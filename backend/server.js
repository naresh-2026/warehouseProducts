const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware to enable CORS and parse JSON request bodies
app.use(cors());
app.use(bodyParser.json());

// --- Login Route ---
// This endpoint handles login requests from the frontend.
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('--- Received Login Request ---');
  console.log('Username:', username);
  console.log('Password:', password);

  if (username && password) {
    // In a real app, you would validate these credentials against a database.
    res.status(200).json({ message: 'Login request received successfully!' });
  } else {
    res.status(400).json({ message: 'Missing username or password.' });
  }
});

// --- Signup Route ---
// This new endpoint handles signup requests from the frontend.
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  console.log('--- Received Signup Request ---');
  console.log('Username:', username);
  console.log('Email:', email);
  console.log('Password:', password);

  // Perform a basic check to ensure all required fields are present.
  if (username && email && password) {
    // In a real application, you would save this new user to a database.
    res.status(200).json({ message: 'Signup request received successfully!' });
  } else {
    // Send an error if any of the required data is missing.
    res.status(400).json({ message: 'Missing username, email, or password.' });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});