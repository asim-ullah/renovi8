const express = require('express');
const Product = require('../models/Product');
const { protect, requireAdmin } = require('../middleware/auth');
const { upload, processImage } = require('../middleware/uploadMiddleware');

const router = express.Router();

// GET /api/products (public)
router.get('/', async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const products = await Product.find(filter).populate('category', 'name slug').sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) { next(err); }
});

// GET /api/products/all (admin - includes inactive)
router.get('/all', protect, requireAdmin, async (req, res, next) => {
  try {
    const products = await Product.find({}).populate('category', 'name slug').sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) { next(err); }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
});

// POST /api/products (admin)
router.post('/', protect, requireAdmin, upload.array('images', 6), processImage, async (req, res, next) => {
  try {
    const { category, name, description, basePrice, installationCost, isFeatured } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const images = req.files ? req.files.map((f) => f.processedPath) : [];
    const product = await Product.create({ category, name, slug, description, images, basePrice: parseFloat(basePrice), installationCost: parseFloat(installationCost || 0), isFeatured: isFeatured === 'true' });
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
});

// PUT /api/products/:id (admin)
router.put('/:id', protect, requireAdmin, upload.array('images', 6), processImage, async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((f) => f.processedPath);
    }
    if (updates.basePrice) updates.basePrice = parseFloat(updates.basePrice);
    if (updates.installationCost) updates.installationCost = parseFloat(updates.installationCost);
    if (updates.name) updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
