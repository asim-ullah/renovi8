const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { protect, requireAdmin } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const generateInvoicePDF = require('../utils/pdfInvoice');

const router = express.Router();

const STATUS_MESSAGES = {
  pending: 'Order placed and awaiting confirmation.',
  confirmed: 'Your order has been confirmed.',
  technician_assigned: 'A technician has been assigned to your order.',
  in_progress: 'Work is currently in progress at your location.',
  completed: 'Service completed successfully. Thank you!',
  cancelled: 'Order has been cancelled.',
};

// POST /api/orders (create)
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId, serviceType, serviceDate, serviceTime, notes, address } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Product not found' });

    const installationCost = serviceType === 'product+installation' ? product.installationCost : 0;
    const totalPrice = product.basePrice + installationCost;

    const order = await Order.create({
      customer: req.user._id,
      product: product._id,
      serviceType,
      productPrice: product.basePrice,
      installationCost,
      totalPrice,
      address: address || req.user.address,
      serviceDate: new Date(serviceDate),
      serviceTime,
      notes: notes || '',
      timeline: [{ status: 'pending', message: STATUS_MESSAGES.pending }],
    });

    await Notification.create({
      title: 'New Order Received',
      message: `New order #${order._id.toString().slice(-8).toUpperCase()} from ${req.user.name}`,
      type: 'new_order',
      relatedOrder: order._id,
    });

    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
});

// GET /api/orders (customer: own orders, admin: all)
router.get('/', protect, async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { customer: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter)
      .populate('product', 'name images basePrice')
      .populate('worker', 'name phone')
      .populate('payment', 'status stripePaymentIntentId amount')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'name images description basePrice installationCost category')
      .populate('customer', 'name email phone address profilePicture')
      .populate('worker', 'name phone email specialization')
      .populate('payment');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// PATCH /api/orders/:id/status (admin)
router.patch('/:id/status', protect, requireAdmin, async (req, res, next) => {
  try {
    const { status, cancelReason } = req.body;
    const order = await Order.findById(req.params.id).populate('customer');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (status === 'cancelled' && cancelReason) order.cancelReason = cancelReason;
    order.timeline.push({ status, message: STATUS_MESSAGES[status] || status });
    await order.save();

    await Notification.create({
      title: 'Order Status Updated',
      message: `Order #${order._id.toString().slice(-8).toUpperCase()} status changed to ${status}`,
      type: 'order_update',
      relatedOrder: order._id,
    });

    if (order.customer?.emailNotifications) {
      try {
        const template = emailTemplates.orderStatusUpdate(order, order.customer, status);
        await sendEmail({ to: order.customer.email, ...template });
      } catch (emailErr) { console.error('Email send error:', emailErr); }
    }

    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// PATCH /api/orders/:id/assign-worker (admin)
router.patch('/:id/assign-worker', protect, requireAdmin, async (req, res, next) => {
  try {
    const { workerId, serviceDate } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.worker = workerId || null;
    if (serviceDate) order.serviceDate = new Date(serviceDate);
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// PATCH /api/orders/:id/cancel (customer)
router.patch('/:id/cancel', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Access denied' });
    if (['completed', 'in_progress', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    }
    order.status = 'cancelled';
    order.cancelReason = req.body.cancelReason || 'Cancelled by customer';
    order.timeline.push({ status: 'cancelled', message: 'Order cancelled by customer.' });
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// GET /api/orders/:id/invoice (download PDF)
router.get('/:id/invoice', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'name')
      .populate('customer', 'name email phone address')
      .populate('payment', 'status stripePaymentIntentId');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    generateInvoicePDF(order, res);
  } catch (err) { next(err); }
});

module.exports = router;
