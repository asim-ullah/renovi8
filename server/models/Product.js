const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    basePrice: { type: Number, required: true, min: 0 },
    installationCost: { type: Number, default: 0, min: 0 },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
