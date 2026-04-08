import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

// GET /api/products - Get all products or filter by category
router.get('/', getProducts);
router.post('/', createProduct);

// GET /api/products/:id - Get a single product by ID
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
