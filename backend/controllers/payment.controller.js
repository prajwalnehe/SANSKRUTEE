import Razorpay from 'razorpay';
import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { Address } from '../models/Address.js';

const getClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!key_id || !key_secret) return null;
  return { client: new Razorpay({ key_id, key_secret }), key_id, key_secret };
};

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body || {};
    const rupees = Number(amount);
    if (!rupees || Number.isNaN(rupees) || rupees <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Razorpay keys not configured on server' });
    }

    const options = {
      amount: Math.round(rupees * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    };

    const order = await ctx.client.orders.create(options);
    return res.json({ order, key: ctx.key_id });
  } catch (err) {
    console.error('Razorpay createOrder error:', err?.message || err);
    if (err?.error?.description) console.error('Razorpay API:', err.error.description);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Server secret missing' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', ctx.key_secret).update(payload).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = cart.items.map(i => {
      const p = i.product;
      let base = 0;
      if (p && typeof p.price === 'number') {
        base = Number(p.price) || 0;
      } else {
        const mrp = Number(p?.mrp) || 0;
        const discountPercent = Number(p?.discountPercent) || 0;
        base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
      }
      return { product: p._id, quantity: i.quantity, price: base, size: i.size || undefined };
    });
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      }
    } catch {}

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'paid',
      paymentMethod: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    return res.json({ success: true, order });
  } catch (err) {
    console.error('Razorpay verifyPayment error:', err?.message || err);
    return res.status(500).json({ error: 'Verification failed' });
  }
};

export const createCODOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      console.error('COD Order: No userId found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      console.error('COD Order: Cart is empty for user', userId);
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = cart.items.map(i => {
      const p = i.product;
      let base = 0;
      if (p && typeof p.price === 'number') {
        base = Number(p.price) || 0;
      } else {
        const mrp = Number(p?.mrp) || 0;
        const discountPercent = Number(p?.discountPercent) || 0;
        base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
      }
      return { product: p._id, quantity: i.quantity, price: base, size: i.size || undefined };
    });
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      } else {
        console.error('COD Order: No address found for user', userId);
      }
    } catch (addrErr) {
      console.error('COD Order: Error fetching address:', addrErr?.message || addrErr);
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required. Please save your delivery address first.' });
    }

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'cod',
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    console.log('COD Order created successfully:', order._id);
    return res.json({ success: true, order });
  } catch (err) {
    console.error('Create COD order error:', err?.message || err);
    console.error('Stack:', err?.stack);
    return res.status(500).json({ error: err?.message || 'Failed to create COD order' });
  }
};
