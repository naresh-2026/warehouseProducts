const mongoose = require('mongoose');

// Define the schema for a product
const productSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensures the quantity is greater than 0
  },
  itemType: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Mongoose model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;