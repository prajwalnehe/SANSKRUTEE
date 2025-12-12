import { Category } from '../models/Category.js';
import { Product } from '../models/product.js';

export const getHeaderData = async (req, res) => {
  // Set CORS headers
  const allowedOrigins = [
    'https://sarees-frontend.onrender.com',
    'https://sarees-jwhn.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  try {
    // Get all categories for the navigation
    const categories = await Category.find({}, 'name slug -_id').sort({ name: 1 });

    // Mock data for other header elements
    const headerData = {
      logo: {
        url: '/logo.png',
        alt: 'SANSKRUTEE Logo'
      },
      navigation: {
        categories: categories,
        links: [
          { name: 'Home', url: '/' },
          { name: 'New Arrivals', url: '/new-arrivals' },
          { name: 'Best Sellers', url: '/best-sellers' },
          { name: 'Deals', url: '/deals' },
          { name: 'Contact', url: '/contact' }
        ]
      },
      search: {
        placeholder: 'Search for sarees, lehengas, and more...',
        suggestions: [
          'Banarasi Silk Saree',
          'Kanjivaram Saree',
          'Chanderi Cotton',
          'Designer Lehenga',
          'Bridal Saree'
        ]
      },
      userLinks: {
        wishlist: { url: '/wishlist', label: 'Wishlist' },
        cart: { url: '/cart', label: 'Cart' },
        account: { url: '/account', label: 'Account' }
      }
    };

    res.json(headerData);
  } catch (error) {
    console.error('Error fetching header data:', error);
    res.status(500).json({ message: 'Error fetching header data', error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.json({ results: [] });
    }

    // Search in products
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'product_info.brand': { $regex: query, $options: 'i' } },
        { 'product_info.SareeMaterial': { $regex: query, $options: 'i' } }
      ]
    }).limit(10).select('title images price mrp discountPercent');

    res.json({ results: products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error performing search', error: error.message });
  }
};

// Helper function to set CORS headers
const setCorsHeaders = (req, res) => {
  const allowedOrigins = [
    'https://sarees-frontend.onrender.com',
    'https://sarees-jwhn.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Get COLLECTION category with subcategories
export const getCollectionCategories = async (req, res) => {
  setCorsHeaders(req, res);
  try {
    const category = await Category.findOne({ 
      $or: [
        { name: { $regex: /^collection$/i } },
        { slug: 'collection' }
      ]
    }).populate('subcategories', 'name slug -_id');
    
    if (!category) {
      return res.json({ 
        category: { name: 'COLLECTION', slug: 'collection', subcategories: [] },
        subcategories: []
      });
    }

    res.json({
      category: {
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories || []
      },
      subcategories: category.subcategories || []
    });
  } catch (error) {
    console.error('Error fetching COLLECTION categories:', error);
    res.status(500).json({ message: 'Error fetching COLLECTION categories', error: error.message });
  }
};

// Get MEN category with subcategories
export const getMenCategories = async (req, res) => {
  setCorsHeaders(req, res);
  try {
    const category = await Category.findOne({ 
      $or: [
        { name: { $regex: /^men$/i } },
        { slug: 'men' }
      ]
    }).populate('subcategories', 'name slug -_id');
    
    if (!category) {
      return res.json({ 
        category: { name: 'MEN', slug: 'men', subcategories: [] },
        subcategories: []
      });
    }

    res.json({
      category: {
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories || []
      },
      subcategories: category.subcategories || []
    });
  } catch (error) {
    console.error('Error fetching MEN categories:', error);
    res.status(500).json({ message: 'Error fetching MEN categories', error: error.message });
  }
};

// Get WOMEN category with subcategories
export const getWomenCategories = async (req, res) => {
  setCorsHeaders(req, res);
  try {
    const category = await Category.findOne({ 
      $or: [
        { name: { $regex: /^women$/i } },
        { slug: 'women' }
      ]
    }).populate('subcategories', 'name slug -_id');
    
    if (!category) {
      return res.json({ 
        category: { name: 'WOMEN', slug: 'women', subcategories: [] },
        subcategories: []
      });
    }

    res.json({
      category: {
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories || []
      },
      subcategories: category.subcategories || []
    });
  } catch (error) {
    console.error('Error fetching WOMEN categories:', error);
    res.status(500).json({ message: 'Error fetching WOMEN categories', error: error.message });
  }
};

// Get BOYS category with subcategories
export const getBoysCategories = async (req, res) => {
  setCorsHeaders(req, res);
  try {
    const category = await Category.findOne({ 
      $or: [
        { name: { $regex: /^boys$/i } },
        { slug: 'boys' }
      ]
    }).populate('subcategories', 'name slug -_id');
    
    if (!category) {
      return res.json({ 
        category: { name: 'BOYS', slug: 'boys', subcategories: [] },
        subcategories: []
      });
    }

    res.json({
      category: {
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories || []
      },
      subcategories: category.subcategories || []
    });
  } catch (error) {
    console.error('Error fetching BOYS categories:', error);
    res.status(500).json({ message: 'Error fetching BOYS categories', error: error.message });
  }
};

// Get GIRLS category with subcategories
export const getGirlsCategories = async (req, res) => {
  setCorsHeaders(req, res);
  try {
    const category = await Category.findOne({ 
      $or: [
        { name: { $regex: /^girls$/i } },
        { slug: 'girls' }
      ]
    }).populate('subcategories', 'name slug -_id');
    
    if (!category) {
      return res.json({ 
        category: { name: 'GIRLS', slug: 'girls', subcategories: [] },
        subcategories: []
      });
    }

    res.json({
      category: {
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories || []
      },
      subcategories: category.subcategories || []
    });
  } catch (error) {
    console.error('Error fetching GIRLS categories:', error);
    res.status(500).json({ message: 'Error fetching GIRLS categories', error: error.message });
  }
};

// Get SISHU category with subcategories
export const getSishuCategories = async (req, res) => {
  setCorsHeaders(req, res);
  try {
    const category = await Category.findOne({ 
      $or: [
        { name: { $regex: /^sishu$/i } },
        { slug: 'sishu' }
      ]
    }).populate('subcategories', 'name slug -_id');
    
    if (!category) {
      return res.json({ 
        category: { name: 'SISHU', slug: 'sishu', subcategories: [] },
        subcategories: []
      });
    }

    res.json({
      category: {
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories || []
      },
      subcategories: category.subcategories || []
    });
  } catch (error) {
    console.error('Error fetching SISHU categories:', error);
    res.status(500).json({ message: 'Error fetching SISHU categories', error: error.message });
  }
};
