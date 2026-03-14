const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1 });
reviewSchema.index({ customer: 1 });

module.exports = mongoose.model('Review', reviewSchema);
