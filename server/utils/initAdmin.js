const User = require('../models/User');

const initAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@renovi8.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '0000000000',
        address: 'HQ'
      });
      console.log('✅ Default Admin Account Created:', adminEmail);
    } else {
      console.log('ℹ️ Admin account already exists.');
    }
  } catch (error) {
    console.error('❌ Failed to initialize admin:', error.message);
  }
};

module.exports = initAdmin;
