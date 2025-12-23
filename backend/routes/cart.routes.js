import { Router } from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import Cart from '../models/Cart.js';

const router = Router();

// GET /api/cart -> current user's cart
router.get('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
  res.json(cart || { user: req.userId, items: [] });
});

// POST /api/cart/add -> { productId, quantity?, size? }
router.post('/add', auth, async (req, res) => {
  const { productId, quantity = 1, size } = req.body || {};
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid productId' });
  }
  const qty = Number(quantity) || 1;
  if (qty < 1) return res.status(400).json({ message: 'Quantity must be >= 1' });

  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) cart = new Cart({ user: req.userId, items: [] });

  // Check if item with same product and size already exists
  const idx = cart.items.findIndex(i => 
    i.product.toString() === productId && 
    (i.size || '') === (size || '')
  );
  
  if (idx > -1) {
    cart.items[idx].quantity += qty;
  } else {
    cart.items.push({ product: productId, quantity: qty, size: size || undefined });
  }

  await cart.save();
  const populated = await cart.populate('items.product');
  res.json(populated);
});

// DELETE /api/cart/remove/:id -> remove by productId
router.delete('/remove/:id', auth, async (req, res) => {
  const { id: productId } = req.params;
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid productId' });
  }

  const cart = await Cart.findOne({ user: req.userId });
  if (!cart) return res.json({ user: req.userId, items: [] });

  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  const populated = await cart.populate('items.product');
  res.json(populated);
});

export default router;
