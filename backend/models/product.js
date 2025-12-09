import mongoose from "mongoose";



const productSchema = new mongoose.Schema(

  {

    title: { type: String, required: true },

    mrp: { type: Number, required: true },

    discountPercent: { type: Number, default: 0, min: 0, max: 100 },

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

      // -------- SHOES --------

      availableSizes: { type: [String], default: [] },

      shoeSize: { type: String },

      shoeMaterial: { type: String },

      shoeColor: { type: String },

      shoeType: { type: String },

      // -------- TSHIRT --------

      tshirtSize: { type: String }, // S, M, L, XL, etc.

      tshirtMaterial: { type: String }, // Cotton, Polyester, Lycra

      tshirtFit: { type: String }, // Regular, Slim, Oversized

      tshirtSleeve: { type: String }, // Half Sleeve, Full Sleeve

      tshirtNeck: { type: String }, // Round, V-Neck, Polo

      tshirtColor: { type: String },

      // -------- PANTS --------

      pantWaist: { type: String }, // "30", "32", "34"

      pantFit: { type: String }, // Slim, Regular, Relaxed

      pantMaterial: { type: String }, // Denim, Cotton, Stretch Fabric

      pantColor: { type: String },

      pantType: { type: String }, // Jeans, Chinos, Joggers, Formal

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

// 💡 Auto-calculate final price

productSchema.virtual("price").get(function () {

  const discount = (this.mrp * this.discountPercent) / 100;

  return Math.round(this.mrp - discount);

});

export const Product = mongoose.model("Product", productSchema);
