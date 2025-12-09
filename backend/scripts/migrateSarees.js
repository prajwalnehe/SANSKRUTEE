import { Product } from '../models/product.js';
import { Category } from '../models/Category.js';
import { connectDB } from '../config/DataBaseConnection.js';
import { sarees } from '../../frontend/src/data/sarees.js';

async function migrate() {
  try {
    // Connect to database
    await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saree_sansar');
    
    console.log('Starting migration...');
    
    // 1. First, create categories with their descriptions and images
    const categories = [
      {
        name: 'Banarasi',
        description: 'Luxurious silk sarees from Varanasi with intricate zari work',
        image: 'https://example.com/banarasi-category.jpg',
        featured: true
      },
      {
        name: 'Kanjivaram',
        description: 'Traditional silk sarees from Kanchipuram with rich zari borders',
        image: 'https://example.com/kanjivaram-category.jpg',
        featured: true
      },
      {
        name: 'Chanderi',
        description: 'Lightweight and elegant sarees with sheer texture and fine zari work',
        image: 'https://example.com/chanderi-category.jpg',
        featured: true
      },
      {
        name: 'Tussar',
        description: 'Rich textured silk sarees with a natural gold sheen',
        image: 'https://example.com/tussar-category.jpg',
        featured: false
      },
      {
        name: 'Maheshwari',
        description: 'Lightweight cotton and silk sarees with zari borders',
        image: 'https://example.com/maheshwari-category.jpg',
        featured: false
      },
      {
        name: 'Patola',
        description: 'Double ikat silk sarees with geometric patterns',
        image: 'https://example.com/patola-category.jpg',
        featured: false
      },
      {
        name: 'Bandhani',
        description: 'Tie-dye sarees with vibrant colors and patterns',
        image: 'https://example.com/bandhani-category.jpg',
        featured: false
      },
      {
        name: 'Paithani',
        description: 'Maharashtrian silk sarees with peacock and flower motifs',
        image: 'https://example.com/paithani-category.jpg',
        featured: false
      }
    ];
    
    console.log('Creating categories...');
    
    for (const categoryData of categories) {
      const slug = categoryData.name.toLowerCase().replace(/\s+/g, '-');
      await Category.findOneAndUpdate(
        { name: categoryData.name },
        { 
          ...categoryData,
          slug: slug,
          active: true
        },
        { upsert: true, new: true }
      );
      console.log(`Created/Updated category: ${categoryData.name}`);
    }
    
    console.log('Categories created successfully');
    
    // 2. Now import products
    console.log('Importing products...');
    
    for (const saree of sarees) {
      // For now, assign a random category to each saree for demonstration
      // In a real scenario, you would categorize them properly
      const allCategories = await Category.find({});
      const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
      
      if (!randomCategory) {
        console.warn('No categories found in database');
        continue;
      }
      
      // Check if product already exists
      const exists = await Product.findOne({ title: saree.title });
      
      if (!exists) {
        const product = new Product({
          ...saree,
          category: randomCategory.name, // Store category name for easy querying
          categoryId: randomCategory._id, // Reference to category document
          // Add some random variations for demonstration
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
          reviewCount: Math.floor(Math.random() * 100), // Random review count up to 100
          inStock: Math.random() > 0.1, // 90% chance of being in stock
        });
        
        await product.save();
        console.log(`Imported: ${saree.title}`);
      } else {
        console.log(`Skipped (already exists): ${saree.title}`);
      }
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrate();
