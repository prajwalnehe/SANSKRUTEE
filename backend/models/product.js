import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },                  // Product title
    mrp: { type: Number, required: true },                    // MRP (maximum retail price)
    discountPercent: { type: Number, default: 0, min: 0, max: 100 }, // Discount in %
    description: { type: String },
    category: { type: String, required: true, index: true },
    categoryId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      index: true 
    },

    product_info: {
      brand: { type: String },
      manufacturer: { type: String },
      KurtiLength: { type: String },
      KurtiMaterial: { type: String },
      KurtiColor: { type: String },
      SleeveLength: { type: String },
      IncludedComponents: { type: String },
    },

    images: {
      image1: { type: String, required: true },
      image2: { type: String },
      image3: { type: String },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// 💡 Virtual field: Automatically calculate final price after discount
productSchema.virtual("price").get(function () {
  const discount = (this.mrp * this.discountPercent) / 100;
  return Math.round(this.mrp - discount);
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
