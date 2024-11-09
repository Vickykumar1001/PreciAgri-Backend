// productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  sellerId: {
    type: mongoose.Schema.Types.ObjectId, // Store seller ID as ObjectId
    ref: 'users', // Reference to the users collection (assuming sellers are stored in users)
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide product title"],
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  sizes: [{
    price: { type: Number },
    discountedPrice: { type: Number },
    name: { type: String },
    quantity: { type: Number }
  }],
  imagesUrl: [{
    type: String,
  }],
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
  },
  status: {
    type: String,
    enum: ["Active", "Discontinued"],
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;