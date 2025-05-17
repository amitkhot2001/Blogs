const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middelware/middelware'); // your auth middleware
const pool = require('../DB/db'); // your DB connection

router.get('/fetch-blogs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [rows] = await pool.query(
      'SELECT id, title, created_at,is_draft FROM blogs WHERE author_id =? ORDER BY created_at DESC',[userId]);

    if (rows.length === 0) {
      return res.status(200).json({ message: 'No blogs found', blogs: [] });
    }

    // Send rows array directly
    res.status(200).json({ message: 'Blogs fetched successfully', blogs: rows });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});


module.exports = router;
