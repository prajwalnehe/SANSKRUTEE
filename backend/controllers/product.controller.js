import { Product } from '../models/product.js';

const CATEGORY_GROUPS = {
  'Designer Sarees': [
    'Party Wear Saree',
    'Wedding Sarees',
    'Festive Sarees',
    'Bollywood Style Sarees',
    'Heavy Embroidered Sarees'
  ]
};

// Category mapping for URL slugs to database category names
const CATEGORY_MAPPING = {
  'tshirts': ['TShirts', 't-shirt', 't-shirt', 'tshirt', 't shirt', 't shirts', 'T-Shirt', 'T-Shirts'],
  't-shirts': ['TShirts', 't-shirt', 't-shirt', 'tshirt', 't shirt', 't shirts', 'T-Shirt', 'T-Shirts'],
  't shirt': ['TShirts', 't-shirt', 't-shirt', 'tshirt', 't shirt', 't shirts', 'T-Shirt', 'T-Shirts'],
  't shirts': ['TShirts', 't-shirt', 't-shirt', 'tshirt', 't shirt', 't shirts', 'T-Shirt', 'T-Shirts'],
  'shirts': ['shirts', 'shirt', 'Shirts', 'Shirt']
};

export const getProducts = async (req, res) => {
  try {
    // Accept either `subcategory` (preferred) or `category` query param
    const rawCategory = (req.query.subcategory || req.query.category || '').toString();
    // normalize slug-like values (e.g., "soft-silk" -> "soft silk") and trim
    const category = rawCategory.replace(/-/g, ' ').trim();
    let query = {};

    console.log('Received request with query params:', req.query);

    if (category) {
      // Check if there's a category mapping
      const normalizedCategory = category.toLowerCase();
      let searchTerms = [];
      
      // Use mapped categories if they exist, otherwise use the original category and try variations
      if (CATEGORY_MAPPING[normalizedCategory]) {
        searchTerms = CATEGORY_MAPPING[normalizedCategory];
      } else {
        // Fallback: try the category as-is and also try common variations
        searchTerms = [category, normalizedCategory, category.toLowerCase(), category.toUpperCase()];
      }
      
      // Build regex patterns for all search terms
      const orConditions = [];
      
      // For shirts, we need to match only "shirt" or "shirts" and exclude "tshirt" variations
      if (normalizedCategory === 'shirts') {
        // Match exact "shirt" or "shirts" only (not "tshirt" or "TShirts")
        // Use word boundaries to ensure exact match
        orConditions.push(
          { 'category': { $regex: /^shirt$/i } },
          { 'category': { $regex: /^shirts$/i } },
          { 'category.name': { $regex: /^shirt$/i } },
          { 'category.name': { $regex: /^shirts$/i } }
        );
      } else {
        // For tshirts, match all variations including "TShirts"
        searchTerms.forEach(term => {
          const re = new RegExp(term, 'i');
          orConditions.push(
            { 'category.name': { $regex: re } },
            { 'category': { $regex: re } },
            { 'category.slug': { $regex: re } },
            { 'subcategory': { $regex: re } },
            { 'tags': { $regex: re } }
          );
        });
      }

      if (CATEGORY_GROUPS[category]) {
        CATEGORY_GROUPS[category].forEach((sub) => {
          orConditions.push({ category: { $regex: new RegExp(sub, 'i') } });
        });
      }

      // For shirts, add strict exclusion to prevent matching any Tshirt variations
      if (normalizedCategory === 'shirts') {
        query = {
          $and: [
            { $or: orConditions },
            { category: { $ne: 'TShirts' } },
            { category: { $ne: 'T-Shirts' } },
            { category: { $ne: 'tshirts' } },
            { category: { $ne: 't-shirts' } },
            { category: { $ne: 'TShirt' } },
            { category: { $ne: 'T-Shirt' } },
            { category: { $not: { $regex: /tshirt/i } } },
            { category: { $not: { $regex: /t-shirt/i } } },
            { category: { $not: { $regex: /t shirt/i } } }
          ]
        };
      } else {
        query = { $or: orConditions };
      }

      console.log('Category mapping:', normalizedCategory, '→', searchTerms);
      console.log('Search query:', JSON.stringify(query, null, 2));
    }

    // Get all products (for debugging)
    const allProducts = await Product.find({});
    console.log(`Total products in database: ${allProducts.length}`);
    
    if (allProducts.length > 0) {
      console.log('Sample product:', {
        _id: allProducts[0]._id,
        title: allProducts[0].title,
        category: allProducts[0].category,
        price: allProducts[0].price
      });
      
      // Log all unique categories in the database
      const categories = [...new Set(allProducts.map(p => 
        p.category ? (typeof p.category === 'string' ? p.category : p.category.name) : 'None'
      ))];
      console.log('All categories in database:', categories);
    }

    // Execute the query
    let products = await Product.find(query);
    console.log(`Found ${products.length} matching products`);

    // Process image URLs to ensure they're absolute
    products = products.map(product => {
      const productObj = product.toObject();
      if (productObj.images && Array.isArray(productObj.images)) {
        productObj.images = productObj.images.map(img => {
          if (img && img.url && !img.url.startsWith('http')) {
            // If the URL is relative, make it absolute
            const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 7000}`;
            return {
              ...img,
              url: img.url.startsWith('/') ? `${baseUrl}${img.url}` : `${baseUrl}/${img.url}`
            };
          }
          return img;
        });
      }
      return productObj;
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Convert to plain object to modify
    const productObj = product.toObject();
    
    // Process image URLs to ensure they're absolute
    if (productObj.images && Array.isArray(productObj.images)) {
      productObj.images = productObj.images.map(img => {
        if (img && img.url && !img.url.startsWith('http')) {
          // If the URL is relative, make it absolute
          const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 6000}`;
          return {
            ...img,
            url: img.url.startsWith('/') ? `${baseUrl}${img.url}` : `${baseUrl}/${img.url}`
          };
        }
        return img;
      });
    }
    
    res.json(productObj);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      message: 'Error fetching product', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
