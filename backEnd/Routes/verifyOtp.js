const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tempUsers = require('../tempUsers');
const pool = require('../DB/db');
require('dotenv').config();

const router = express.Router();

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const storedUser = tempUsers.get(email);

  if (!storedUser) {
    return res.status(400).json({ error: 'No OTP found for this email' });
  }

  // Check if OTP is expired
  if (Date.now() > storedUser.expiry) {
    tempUsers.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }

  // Check if OTP is valid
  if (otp !== storedUser.otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(storedUser.password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, role, email_verified, status) VALUES (?, ?, ?, ?, ?, ?)',
      [storedUser.fullName, email, hashedPassword, 'Author', 1, 'Active']
    );

    const userId = result.insertId;
    const token = jwt.sign(
      { id: userId, email, role: 'Author' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Delete the OTP from memory
    tempUsers.delete(email);

    res.json({ message: 'Signup complete!', token });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

module.exports = router;
