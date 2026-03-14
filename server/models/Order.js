const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    serviceType: {
      type: String,
      enum: ['product', 'product+installation'],
      required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
    productPrice: { type: Number, required: true },
    installationCost: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    serviceDate: { type: Date, required: true },
    serviceTime: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'technician_assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    timeline: [
      {
        status: { type: String },
        message: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    cancelReason: { type: String, default: null },
    hasReview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
