import mongoose from 'mongoose';
import { Product } from '../models/product.js';
import dummyProducts from '../dummy-products.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/STYLEIT';

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('Cleared existing products');

    // Insert dummy products
    const products = await Product.insertMany(dummyProducts);
    console.log(`✅ Successfully inserted ${products.length} products`);

    // Display summary
    const categories = {};
    products.forEach(product => {
      const cat = product.category || 'Unknown';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    console.log('\n📊 Products by Category:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

