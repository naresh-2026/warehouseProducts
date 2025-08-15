const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Product = require('./productModel'); // Import the product model
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware to enable CORS and parse JSON request bodies
app.use(cors());
app.use(bodyParser.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// --- User Schema and Model ---
// This defines the structure for user documents in your MongoDB collection.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

// --- API Routes ---

// NEW: Route to get the last 5 recently added products for a specific user
app.get('/api/products/recent/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const recentProducts = await Product.find({ username: username })
      .sort({ timestamp: -1 })
      .limit(5);

    res.status(200).json(recentProducts);
  } catch (error) {
    console.error('Error fetching recent products:', error);
    res.status(500).json({ message: 'Failed to fetch recent products.' });
  }
});

// Route to handle product form submission
app.post('/api/add-product', async (req, res) => {
  try {
    const { username, productName, quantity, itemType, isPublic } = req.body;

    // Create a new product document using the Mongoose model
    const newProduct = new Product({
      username: username,
      productName: productName,
      quantity: quantity,
      itemType: itemType,
      isPublic: isPublic,
      // The timestamp is handled automatically by the model
    });

    // Save the document to the database
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product.', error: error.message });
  }
});



// Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // 2. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // 4. Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // 3. If passwords match, login is successful
    res.status(200).json({ message: 'Login successful!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});