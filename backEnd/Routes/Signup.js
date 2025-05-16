const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../DB/db');
require('dotenv').config();

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { fullName, email, password, role = 'Author' } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, role, email_verified, status) VALUES (?, ?, ?, ?, ?, ?)',
      [fullName, email, hashedPassword, role, 0, 'Pending']
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(201).json({
      message: 'Signup successful! Welcome aboard.',
      token,
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      error: err.message || 'Server error. Please try again later.'
    });
  }
});

module.exports = router;
