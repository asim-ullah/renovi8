const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/renovi8';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create Admin
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Platform Admin',
      email: 'admin@renovi8.com',
      password: 'admin123', // Model will hash it via pre-save hook
      role: 'admin',
      phone: '0000000000',
      address: 'Admin HQ'
    });
    console.log('✅ Admin account created: admin@renovi8.com / admin123');

    // Create Client
    await User.create({
      name: 'John Doe',
      email: 'client@example.com',
      password: 'client123',
      role: 'customer',
      phone: '1234567890',
      address: '123 Main St, London'
    });
    console.log('✅ Client account created: client@example.com / client123');

    // Create Category
    const category = await Category.create({
      name: 'Plumbing',
      description: 'Expert plumbing repair and installation services.',
      slug: 'plumbing'
    });
    console.log('✅ Category created: Plumbing');

    // Create Product
    await Product.create({
      name: 'Kitchen Tap Installation',
      slug: 'kitchen-tap-installation',
      description: 'Professional replacement of your kitchen faucet with premium fittings.',
      basePrice: 85,
      installationCost: 45,
      category: category._id,
      images: ['/uploads/default-tap.webp'],
      features: ['2-year warranty', 'Premium materials', 'Same-day service'],
      isActive: true,
      isFeatured: true
    });
    console.log('✅ Product created: Kitchen Tap Installation');

    console.log('🚀 Seeding complete! Closing connection...');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
