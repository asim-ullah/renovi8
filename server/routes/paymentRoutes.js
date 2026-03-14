const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', protect, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: order.product.name,
              description: `${order.serviceType === 'product+installation' ? 'Product + Installation' : 'Product Only'} Service`,
              images: order.product.images.length > 0 ? [`${process.env.CLIENT_URL}${order.product.images[0]}`] : [],
            },
            unit_amount: Math.round(order.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel?orderId=${orderId}`,
      metadata: { orderId: orderId.toString(), userId: req.user._id.toString() },
    });

    // Create pending payment record
    await Payment.create({
      order: orderId,
      customer: req.user._id,
      stripeSessionId: session.id,
      amount: order.totalPrice,
      currency: 'gbp',
      status: 'pending',
    });

    res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (err) { next(err); }
});

// POST /api/payments/webhook (raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { orderId } = session.metadata;
    try {
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: 'paid', stripePaymentIntentId: session.payment_intent },
        { new: true }
      );
      const payment = await Payment.findOne({ stripeSessionId: session.id });
      await Order.findByIdAndUpdate(orderId, { payment: payment?._id, status: 'confirmed' });
    } catch (err) {
      console.error('Webhook processing error:', err);
    }
  }

  res.json({ received: true });
});

// GET /api/payments/verify/:orderId
router.get('/verify/:orderId', protect, async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId });
    res.json({ success: true, payment });
  } catch (err) { next(err); }
});

module.exports = router;
