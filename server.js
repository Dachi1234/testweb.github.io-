
  require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Require cors package
const app = express();
const Product = require('./models/Product');

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Securely load your MongoDB URI from environment variables
const mongoURI = 'mongodb+srv://dchperadze:iuRiYqYBf2v8gzde@cluster0.h10zb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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
    const newProduct = new Product(req.body); // Create a new product instance
    const savedProduct = await newProduct.save(); // Save the product to the database
    res.status(201).json(savedProduct); // Send back the saved product
  } catch (err) {
    res.status(400).json({ error: err.message }); // Send an error response
  }
});

// GET /products - Retrieve all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.json(products); // Send the products as JSON
  } catch (err) {
    res.status(500).json({ error: err.message }); // Send an error response
  }
});

// GET /products/:id - Retrieve a product by its ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Find product by ID
    if (!product) {
      return res.status(404).json({ error: 'Product not found' }); // Handle product not found
    }
    res.json(product); // Send the product as JSON
  } catch (err) {
    res.status(500).json({ error: err.message }); // Send an error response
  }
});

// PUT /products/:id - Update a product by its ID
app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
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
