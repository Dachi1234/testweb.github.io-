// models/Product.js or in your server.js where the Product schema is defined

const productSchema = new mongoose.Schema({
  // Existing fields
  name: String,
  price: Number,
  description: String,
  image: String,
  // New fields for ratings
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
});

productSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  return total / this.ratings.length;
});

const Product = mongoose.model('Product', productSchema);
