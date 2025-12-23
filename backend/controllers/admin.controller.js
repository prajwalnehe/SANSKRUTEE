import { Product } from '../models/product.js';
import Order from '../models/Order.js';
import { Address } from '../models/Address.js';

const ORDER_STATUS_ALLOWED = new Set(['pending','confirmed','packed','shipped','delivered','cancelled','returned','created','on_the_way']);
const PAYMENT_STATUS_ALLOWED = new Set(['paid','pending','failed','refunded']);
const PAYMENT_METHOD_ALLOWED = new Set(['razorpay','cod','card','upi']);

const mapLegacyStatusToOrderStatus = (status = '') => {
  const s = String(status).toLowerCase();
  if (s === 'delivered') return 'delivered';
  if (s === 'on_the_way' || s === 'paid') return 'confirmed';
  if (s === 'failed') return 'cancelled';
  if (s === 'created' || s === 'pending') return 'pending';
  return 'pending';
};

const mapLegacyStatusToPaymentStatus = (status = '') => {
  const s = String(status).toLowerCase();
  if (s === 'failed') return 'failed';
  if (s === 'paid') return 'paid';
  return 'pending';
};

const normalizeOrder = (orderDoc) => {
  const o = orderDoc?.toObject ? orderDoc.toObject() : { ...(orderDoc || {}) };
  const orderStatus = o.orderStatus || mapLegacyStatusToOrderStatus(o.status);
  const paymentStatus = o.paymentStatus || mapLegacyStatusToPaymentStatus(o.status);
  const paymentMethod = o.paymentMethod || (o.razorpayPaymentId ? 'razorpay' : 'cod');
  const transactionId = o.transactionId || o.razorpayPaymentId || o.razorpayOrderId || '';

  return {
    ...o,
    orderStatus,
    paymentStatus,
    paymentMethod,
    transactionId,
  };
};

export async function createProduct(req, res) {
  try {
    const {
      title,
      mrp,
      discountPercent = 0,
      description = '',
      category,
      product_info = {},
      images = {},
      categoryId,
    } = req.body || {};

    if (!title || typeof mrp === 'undefined' || !category) {
      return res.status(400).json({ message: 'title, mrp and category are required' });
    }

    const payload = {
      title,
      mrp: Number(mrp),
      discountPercent: Number(discountPercent) || 0,
      description,
      category,
      product_info: {
        brand: product_info.brand || '',
        manufacturer: product_info.manufacturer || '',
        SareeLength: product_info.SareeLength || '',
        SareeMaterial: product_info.SareeMaterial || '',
        SareeColor: product_info.SareeColor || '',
        IncludedComponents: product_info.IncludedComponents || '',
      },
      images: {
        image1: images.image1,
        image2: images.image2,
        image3: images.image3,
      },
    };

    if (categoryId) payload.categoryId = categoryId;

    const product = await Product.create(payload);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const {
      status,
      orderStatus,
      paymentStatus,
      paymentMethod,
      transactionId,
      adminNote,
      action,
    } = req.body || {};

    const updates = {};
    const nextOrderStatus = (orderStatus || status || '').toString().toLowerCase();
    if (nextOrderStatus) {
      if (!ORDER_STATUS_ALLOWED.has(nextOrderStatus)) {
        return res.status(400).json({ message: 'Invalid order status', allowed: Array.from(ORDER_STATUS_ALLOWED) });
      }
      updates.orderStatus = nextOrderStatus;
      // Keep legacy status in sync for backward compatibility
      updates.status = nextOrderStatus;
      if (nextOrderStatus === 'cancelled') {
        updates.paymentStatus = updates.paymentStatus || 'refunded';
      }
    }

    if (paymentStatus) {
      const normalized = String(paymentStatus).toLowerCase();
      if (!PAYMENT_STATUS_ALLOWED.has(normalized)) {
        return res.status(400).json({ message: 'Invalid payment status', allowed: Array.from(PAYMENT_STATUS_ALLOWED) });
      }
      updates.paymentStatus = normalized;
      // Reflect into legacy status when possible
      if (!updates.status && (normalized === 'paid' || normalized === 'failed')) {
        updates.status = normalized === 'paid' ? 'paid' : 'failed';
      }
    }

    if (paymentMethod) {
      const normalized = String(paymentMethod).toLowerCase();
      if (!PAYMENT_METHOD_ALLOWED.has(normalized)) {
        return res.status(400).json({ message: 'Invalid payment method', allowed: Array.from(PAYMENT_METHOD_ALLOWED) });
      }
      updates.paymentMethod = normalized;
    }

    if (transactionId) {
      updates.transactionId = transactionId;
    }

    // Support quick actions
    if (action === 'cancel') {
      updates.orderStatus = 'cancelled';
      updates.status = 'cancelled';
      updates.paymentStatus = updates.paymentStatus || 'pending';
    }
    if (action === 'refund') {
      updates.paymentStatus = 'refunded';
      if (!updates.orderStatus) updates.orderStatus = 'cancelled';
      if (!updates.status) updates.status = 'cancelled';
    }

    const updateOps = { $set: updates };
    if (adminNote) {
      updateOps.$push = { adminNotes: { note: adminNote, createdAt: new Date() } };
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateOps,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(normalizeOrder(order));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
}

export async function adminListProducts(req, res) {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list products', error: err.message });
  }
}

export async function deleteProductById(req, res) {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
}

export async function adminListOrders(req, res) {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();

    // Best-effort address enrichment; never fail the whole response for this step
    try {
      const userIds = Array.from(new Set(orders.map(o => String(o.user?._id)).filter(Boolean)));
      let addrMap = {};
      if (userIds.length > 0) {
        const addrs = await Address.find({ userId: { $in: userIds } }).lean();
        addrMap = Object.fromEntries(addrs.map(a => [String(a.userId), a]));
      }
      const enriched = orders.map(o => {
        const base = {
          ...o,
          address: o.shippingAddress || (o.user?._id ? (addrMap[String(o.user._id)] || null) : null),
        };
        return normalizeOrder(base);
      });
      return res.json(enriched);
    } catch {
      // Fallback: return orders without address enrichment
      return res.json(orders.map(normalizeOrder));
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list orders', error: err.message });
  }
}

export async function adminGetOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate({
        path: 'items.product',
        select: 'title price mrp images product_info',
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(normalizeOrder(order));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
}

export async function adminStats(req, res) {
  try {
    const [revenueAgg] = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const totalRevenue = revenueAgg?.total || 0;
    const totalOrders = revenueAgg?.count || 0;
    const totalProducts = await Product.countDocuments();
    return res.json({ totalRevenue, totalOrders, totalProducts });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load stats', error: err.message });
  }
}

export async function adminListAddresses(req, res) {
  try {
    const addrs = await Address.find({}).sort({ createdAt: -1 }).populate('userId', 'name email').lean();
    return res.json(addrs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list addresses', error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { mrp, discountPercent } = req.body;

    if (typeof mrp === 'undefined' && typeof discountPercent === 'undefined') {
      return res.status(400).json({ message: 'At least one field (mrp or discountPercent) is required' });
    }

    const updates = {};
    if (typeof mrp !== 'undefined') {
      updates.mrp = Number(mrp);
    }
    if (typeof discountPercent !== 'undefined') {
      updates.discountPercent = Number(discountPercent) || 0;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
}
