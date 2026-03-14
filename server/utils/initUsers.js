const User = require('../models/User');

const initUsers = async () => {
  try {
    // Default Admin
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
    }

    // Default Customer
    const customerEmail = process.env.CUSTOMER_EMAIL || 'client@example.com';
    const customerPassword = process.env.CUSTOMER_PASSWORD || 'client123';

    const customerExists = await User.findOne({ email: customerEmail });

    if (!customerExists) {
      await User.create({
        name: 'John Doe',
        email: customerEmail,
        password: customerPassword,
        role: 'customer',
        phone: '1234567890',
        address: '123 Main St, London'
      });
      console.log('✅ Default Customer Account Created:', customerEmail);
    } else {
      console.log('ℹ️ Default users check complete.');
    }
  } catch (error) {
    console.error('❌ Failed to initialize users:', error.message);
  }
};

module.exports = initUsers;
