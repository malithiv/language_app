const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kidslingo_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Home route
app.get('/', (req, res) => {
  res.send("Welcome to KidsLingo API");
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: 'Registration failed', error: err });
      }
      res.json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error("Unexpected error during registration:", error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email); // Debug log

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: 'Database error occurred' });
    }

    if (results.length === 0) {
      console.log('No user found with email:', email); // Debug log
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (passwordMatch) {
        console.log('Login successful for user:', user.username); // Debug log
        res.json({
          message: 'Login successful',
          userId: user.id,
          username: user.username
        });
      } else {
        console.log('Invalid password for user:', email); // Debug log
        res.status(401).json({ message: 'Invalid password' });
      }
    } catch (error) {
      console.error("Password comparison error:", error);
      res.status(500).json({ message: 'Error verifying credentials' });
    }
  });
});

app.post('/api/process-payment', (req, res) => {
  const { cardNumber, expiryDate, cvv, amount } = req.body;

  // Simulate payment processing
  const isSuccessful = true;
  
  if (isSuccessful) {
    res.json({ status: 'success', message: 'Payment processed successfully' });
  } else {
    res.status(400).json({ status: 'error', message: 'Payment failed' });
  }
});

// Fetch quizzes
app.get('/api/quizzes', (req, res) => {
  const sql = "SELECT * FROM quizzes";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching quizzes:", err);
      return res.status(500).json({ message: 'Failed to fetch quizzes', error: err });
    }
    res.json(results);
  });
});

// Fetch activities
app.get('/api/activities', (req, res) => {
  const sql = "SELECT * FROM activities";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching activities:", err);
      return res.status(500).json({ message: 'Failed to fetch activities', error: err });
    }
    res.json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
