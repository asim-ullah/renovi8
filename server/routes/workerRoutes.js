const express = require('express');
const Worker = require('../models/Worker');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/workers (admin)
router.get('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const workers = await Worker.find({}).sort({ createdAt: -1 });
    res.json({ success: true, workers });
  } catch (err) { next(err); }
});

// POST /api/workers (admin)
router.post('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const worker = await Worker.create(req.body);
    res.status(201).json({ success: true, worker });
  } catch (err) { next(err); }
});

// PUT /api/workers/:id (admin)
router.put('/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, worker });
  } catch (err) { next(err); }
});

// DELETE /api/workers/:id (admin)
router.delete('/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Worker deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
