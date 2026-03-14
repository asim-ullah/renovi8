const express = require('express');
const Category = require('../models/Category');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories (public)
router.get('/', async (req, res, next) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { isActive: true };
    const categories = await Category.find(query).sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) { next(err); }
});

// POST /api/categories (admin)
router.post('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const category = await Category.create({ name, slug, description, icon });
    res.status(201).json({ success: true, category });
  } catch (err) { next(err); }
});

// PUT /api/categories/:id (admin)
router.put('/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, icon, isActive } = req.body;
    const slug = name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name, slug }), description, icon, isActive },
      { new: true }
    );
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (err) { next(err); }
});

// DELETE /api/categories/:id (admin)
router.delete('/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
