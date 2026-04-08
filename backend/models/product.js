import mongoose from 'mongoose';

const reviewsSchema = new mongoose.Schema(
  {
    totalReviews: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    salePrice: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    taxIncluded: { type: Boolean, default: true },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    quantity: { type: Number, default: 0, min: 0 },
    sku: { type: String, trim: true, default: '', unique: true, sparse: true },
  },
  { _id: false }
);

const notesSchema = new mongoose.Schema(
  {
    topNotes: { type: [String], default: [] },
    middleNotes: { type: [String], default: [] },
    baseNotes: { type: [String], default: [] },
  },
  { _id: false }
);

const offersSchema = new mongoose.Schema(
  {
    couponCode: { type: String, trim: true, default: '' },
    discount: { type: Number, default: 0, min: 0 },
    applicableOn: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const servicesSchema = new mongoose.Schema(
  {
    secureTransaction: { type: Boolean, default: true },
    payOnDelivery: { type: Boolean, default: false },
    easyTracking: { type: Boolean, default: true },
    freeDelivery: { type: Boolean, default: false },
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    isFreeShipping: { type: Boolean, default: true },
    shippingType: { type: String, trim: true, default: 'Standard' },
    estimatedDelivery: { type: String, trim: true, default: '' },
    notes: { type: [String], default: [] },
    prepaidBenefits: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const returnsSchema = new mongoose.Schema(
  {
    isReturnable: { type: Boolean, default: true },
    policy: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 200 },
    brand: { type: String, trim: true, default: '' },
    gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex', index: true },
    category: { type: String, required: true, trim: true, index: true },
    subcategory: { type: String, trim: true, default: '' },
    type: { type: String, trim: true, default: '' },

    reviews: { type: reviewsSchema, default: () => ({}) },
    pricing: { type: pricingSchema, required: true },
    stock: { type: stockSchema, default: () => ({}) },
    notes: { type: notesSchema, default: () => ({}) },

    description: { type: String, trim: true, default: '' },
    offers: { type: offersSchema, default: () => ({}) },
    services: { type: servicesSchema, default: () => ({}) },

    shippingAndReturns: {
      shipping: { type: shippingSchema, default: () => ({}) },
      returns: { type: returnsSchema, default: () => ({}) },
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.every((url) => typeof url === 'string' && url.trim().length > 0),
        message: 'All images must be valid non-empty strings',
      },
    },

    pincodeServiceable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre('validate', function autoComputeDiscount(next) {
  if (this.pricing?.mrp > 0 && this.pricing?.salePrice >= 0) {
    const computed = ((this.pricing.mrp - this.pricing.salePrice) / this.pricing.mrp) * 100;
    this.pricing.discountPercent = Number(Math.max(0, Math.min(100, computed)).toFixed(2));
  }
  next();
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
