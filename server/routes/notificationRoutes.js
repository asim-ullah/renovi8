const express = require('express');
const Notification = require('../models/Notification');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications (admin)
router.get('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ isRead: false });
    res.json({ success: true, notifications, unreadCount });
  } catch (err) { next(err); }
});

// PATCH /api/notifications/:id/read (admin)
router.patch('/:id/read', protect, requireAdmin, async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// PATCH /api/notifications/mark-all-read (admin)
router.patch('/mark-all-read', protect, requireAdmin, async (req, res, next) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
