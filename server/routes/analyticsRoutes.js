const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics/stats (admin)
router.get('/stats', protect, requireAdmin, async (req, res, next) => {
  try {
    const [totalOrders, pendingOrders, completedOrders, totalUsers] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      User.countDocuments({ role: 'customer' }),
    ]);
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    res.json({ success: true, stats: { totalOrders, pendingOrders, completedOrders, totalUsers, totalRevenue } });
  } catch (err) { next(err); }
});

// GET /api/analytics/revenue-chart (admin)
router.get('/revenue-chart', protect, requireAdmin, async (req, res, next) => {
  try {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }
    const chartData = await Promise.all(
      months.map(async ({ year, month }) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        const agg = await Payment.aggregate([
          { $match: { status: 'paid', createdAt: { $gte: start, $lt: end } } },
          { $group: { _id: null, revenue: { $sum: '$amount' } } },
        ]);
        return {
          month: start.toLocaleString('default', { month: 'short' }),
          year,
          revenue: agg[0]?.revenue || 0,
        };
      })
    );
    res.json({ success: true, chartData });
  } catch (err) { next(err); }
});

// GET /api/analytics/top-products (admin)
router.get('/top-products', protect, requireAdmin, async (req, res, next) => {
  try {
    const topProducts = await Order.aggregate([
      { $group: { _id: '$product', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { name: '$product.name', count: 1, _id: 0 } },
    ]);
    res.json({ success: true, topProducts });
  } catch (err) { next(err); }
});

module.exports = router;
