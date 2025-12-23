import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true },
    size: { type: String }, // Selected size (e.g., "5", "6", "7", "8", "9", "10", "S", "M", "L", "30", "32", etc.)
  },
  { _id: false }
);

const ShippingAddressSchema = new mongoose.Schema(
  {
    fullName: String,
    mobileNumber: String,
    pincode: String,
    locality: String,
    address: String,
    city: String,
    state: String,
    landmark: String,
    alternatePhone: String,
    addressType: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [OrderItemSchema], default: [] },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    // Legacy status field (kept for backward compatibility). Accept broader enums so
    // newer order states can be stored without validation errors.
    status: { 
      type: String, 
      enum: [
        'created', 'paid', 'pending', 'failed',
        'confirmed', 'on_the_way', 'delivered', 'cancelled', 'returned', 'packed', 'shipped'
      ], 
      default: 'pending' 
    },
    // New explicit fields
    orderStatus: { 
      type: String, 
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'], 
      default: 'pending' 
    },
    paymentStatus: { 
      type: String, 
      enum: ['paid', 'pending', 'failed', 'refunded'], 
      default: 'pending' 
    },
    paymentMethod: { 
      type: String, 
      enum: ['razorpay', 'cod', 'card', 'upi'], 
      default: 'cod' 
    },
    transactionId: { type: String },
    adminNotes: {
      type: [
        {
          note: String,
          createdAt: { type: Date, default: Date.now },
        }
      ],
      default: []
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    shippingAddress: { type: ShippingAddressSchema },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
