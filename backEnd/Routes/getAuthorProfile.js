const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middelware/middelware');
const pool = require('../DB/db');

router.get('/user/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [rows] = await pool.query('SELECT full_name FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ fullName: rows[0].full_name });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
