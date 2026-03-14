const express = require('express');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews (customer - only for completed orders)
router.post('/', protect, async (req, res, next) => {
  try {
    const { orderId, rating, text } = req.body;
    const order = await Order.findById(orderId).populate('product', '_id');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (order.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed orders' });
    }
    if (order.hasReview) {
      return res.status(400).json({ success: false, message: 'Review already submitted for this order' });
    }
    const review = await Review.create({
      order: orderId, customer: req.user._id, product: order.product._id, rating, text,
    });
    order.hasReview = true;
    await order.save();
    await Notification.create({
      title: 'New Review Submitted',
      message: `${req.user.name} left a ${rating}-star review.`,
      type: 'new_review',
    });
    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
});

// GET /api/reviews (admin: all, public: by product)
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.product) filter.product = req.query.product;
    if (req.query.visible !== 'false') filter.isVisible = true;
    const reviews = await Review.find(filter)
      .populate('customer', 'name profilePicture')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
});

// GET /api/reviews/all (admin - includes hidden)
router.get('/all', protect, requireAdmin, async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('customer', 'name profilePicture email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
});

// PATCH /api/reviews/:id/visibility (admin)
router.patch('/:id/visibility', protect, requireAdmin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isVisible: req.body.isVisible }, { new: true });
    res.json({ success: true, review });
  } catch (err) { next(err); }
});

module.exports = router;
