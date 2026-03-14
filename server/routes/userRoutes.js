const express = require('express');
const path = require('path');
const User = require('../models/User');
const { protect, requireAdmin } = require('../middleware/auth');
const { upload, processImage } = require('../middleware/uploadMiddleware');

const router = express.Router();

// GET /api/users/profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) { next(err); }
});

// PATCH /api/users/profile
router.patch('/profile', protect, async (req, res, next) => {
  try {
    const { name, phone, address, emailNotifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, emailNotifications },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// POST /api/users/upload-avatar
router.post('/upload-avatar', protect, upload.single('avatar'), processImage, async (req, res, next) => {
  try {
    if (!req.file || !req.file.processedPath) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: req.file.processedPath },
      { new: true }
    ).select('-password -refreshToken');
    res.json({ success: true, profilePicture: user.profilePicture, user });
  } catch (err) { next(err); }
});

// PATCH /api/users/change-password
router.patch('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) { next(err); }
});

// DELETE /api/users/account
router.delete('/account', protect, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) { next(err); }
});

// GET /api/users (admin)
router.get('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password -refreshToken').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { next(err); }
});

module.exports = router;
