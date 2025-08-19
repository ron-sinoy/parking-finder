// auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./database.js");

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = "your_jwt_secret";

// ---------------------- LOGIN ----------------------
router.post("/login", async (req, res) => {
  try {
    const { user_id, passcode } = req.body;
    console.log(user_id, passcode);
    const q = `SELECT * FROM users WHERE user_id = $1;`;
    const result = await db.query(q, [user_id]);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    if (user_id !== user.user_id || passcode !== user.passcode) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- SIGNUP ----------------------
router.post("/signup", async (req, res) => {
  try {
    const { user_id, passcode } = req.body;

    // Check if user already exists
    const checkUser = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
      user_id,
    ]);

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const insertQuery = `
      INSERT INTO users (user_id, passcode)
      VALUES ($1, $2)
    `;
    await db.query(insertQuery, [user_id, passcode]);

    // Generate token for new user
    const token = jwt.sign({ username: user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
