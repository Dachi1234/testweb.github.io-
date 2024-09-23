// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  category: String,
  brand: String,
  color: String,
  size: String,
  // Add more fields as needed
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
