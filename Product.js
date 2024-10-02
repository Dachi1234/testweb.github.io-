// models/Product.js

const mongoose = require('mongoose'); // Import mongoose

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
});

// Virtual field for average rating
productSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  return total / this.ratings.length;
});

// Ensure virtual fields are serialized
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; // Export the model
