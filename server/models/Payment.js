const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'gbp' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ stripeSessionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
