const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['new_order', 'order_update', 'new_review', 'general'], default: 'general' },
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
