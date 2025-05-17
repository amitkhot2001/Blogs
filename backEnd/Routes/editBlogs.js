const express = require('express');
const router = express.Router();
const Hashids = require('hashids/cjs');
const authenticateToken = require('../Middelware/middelware');
const pool = require('../DB/db');

const hashids = new Hashids('qA0z4AGE9R', 10);

router.get('/blogs/:encodedId', authenticateToken, async (req, res) => {
  const encodedId = req.params.encodedId;
  const decoded = hashids.decode(encodedId);

  if (!decoded.length) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  const blogId = decoded[0];

  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [blogId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const blog = rows[0];

    // ✅ FIX: use req.user.userId instead of req.user.id
    if (blog.author_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied: You do not own this blog' });
    }

    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
