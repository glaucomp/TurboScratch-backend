const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection pool to handle multiple requests and auto-reconnect
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the pool size to your needs
  host: "156.67.222.52",
  user: "u552141195_fun_user",
  password: "Fun_@pp_2024",
  database: "u552141195_fun_app",
});

// Health check endpoint to test server
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

// Optionally, you can also check the database connection health
app.get("/health/db", (req, res) => {
  pool.query("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({ message: "Database connection failed" });
    }
    res.status(200).json({ message: "Database is healthy!" });
  });
});

// Route to save user data
app.post("/save", (req, res) => {
  const { name, email } = req.body;

  // Check if name and email are provided
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Insert the data into the database
  const query = "INSERT INTO user (name, email) VALUES (?, ?)";
  pool.query(query, [name, email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "User saved!" });
  });
});

// Route to fetch user details by ID
app.post("/user_details", (req, res) => {
  const { id } = req.body;

  // Validate if ID is provided
  if (!id) {
    return res.status(400).json({ error: "ID should not be null" });
  }

  // Query to fetch user details
  const query =
    "SELECT name, score, lucky_symbol, tickets, cards FROM user WHERE id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    // Check if any user was found
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details
    res.status(200).json({ user: results[0] });
  });
});

// Handle graceful shutdown and close the MySQL connection properly
process.on('SIGINT', () => {
  console.log('Gracefully shutting down...');
  pool.end((err) => {
    if (err) {
      console.error('Error closing MySQL connection:', err);
    }
    process.exit();
  });
});

// Start the server on port 3001
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
