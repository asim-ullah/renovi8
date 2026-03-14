const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateTokens = require('../utils/generateToken');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, phone, address, password });
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh-token
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.json({ success: true, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', protect, async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const template = emailTemplates.passwordReset(resetUrl);
    await sendEmail({ to: user.email, ...template });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
