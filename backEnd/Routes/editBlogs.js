const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middelware/middelware'); // your auth middleware
const pool = require('../DB/db'); // your DB connection

// GET blog by ID (protected route)
router.get('/blogs/:id', authenticateToken, async (req, res) => {
  const blogId = parseInt(req.params.id);

  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
