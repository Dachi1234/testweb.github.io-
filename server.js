require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const Product = require('./Product'); // Make sure this path is correct



// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware
app.use(cors());


// Securely load your MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dchperadze:iuRiYqYBf2v8gzde@cluster0.h10zb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server only after successful connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define your routes here
app.get('/', (req, res) => {
  res.send('Server is running');
});

// POST /products - Add a new product
app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    // You can add more filters here (e.g., brand, price range)
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id - Retrieve a product by its ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Convert the Mongoose document to a plain JavaScript object
    const productObj = product.toObject();

    // Add averageRating to the product object
    productObj.averageRating = product.averageRating;

    res.json(productObj);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// PUT /products/:id - Update a product by its ID
app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /products/:id - Delete a product by its ID
app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);


// Registration Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with that email' });
    }

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter all fields' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// server.js

// ... existing code ...

// Ensure express.json() middleware is included to parse JSON request bodies
app.use(express.json());

// Middleware to check authentication (simplified)
const isAuthenticated = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Cart routes

// Add item to cart
app.post('/cart', isAuthenticated, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product already exists in cart
    const cartItemIndex = req.user.cart.findIndex((item) => item.productId.equals(productId));
    if (cartItemIndex > -1) {
      // Update quantity
      req.user.cart[cartItemIndex].quantity += quantity;
    } else {
      // Add new item
      req.user.cart.push({ productId, quantity });
    }

    await req.user.save();
    res.json({ message: 'Item added to cart' });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// View cart items
app.get('/cart', isAuthenticated, async (req, res) => {
  try {
    await req.user.populate('cart.productId');
    res.json(req.user.cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cart item quantity
app.put('/cart', isAuthenticated, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const cartItem = req.user.cart.find((item) => item.productId.equals(productId));
    if (cartItem) {
      cartItem.quantity = quantity;
      await req.user.save();
      res.json({ message: 'Cart updated' });
    } else {
      res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
app.delete('/cart', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const cartItemIndex = req.user.cart.findIndex((item) => item.productId.equals(productId));
    if (cartItemIndex > -1) {
      req.user.cart.splice(cartItemIndex, 1);
      await req.user.save();
      res.json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to check authentication (using the same `isAuthenticated` middleware)

app.post('/ratings', isAuthenticated, async (req, res) => {
  try {
    const { productId, rating } = req.body;

    // Validate input
    if (!productId || !rating) {
      return res.status(400).json({ error: 'Product ID and rating are required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has already rated the product
    const existingRatingIndex = product.ratings.findIndex(r => r.userId.equals(req.user._id));
    if (existingRatingIndex > -1) {
      // Update existing rating
      product.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      product.ratings.push({ userId: req.user._id, rating });
    }

    await product.save();
    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

