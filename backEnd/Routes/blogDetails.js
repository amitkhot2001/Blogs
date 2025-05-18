// Routes/blogDetail.js
const express = require('express');
const router = express.Router();
const db = require('../DB/db'); // Your MySQL connection pool

// GET /api/blog/:id - get blog detail by id
router.get('/blog/:id', async (req, res) => {
  const blogId = req.params.id;

  try {
    const [[blog]] = await db.query(
      `SELECT 
         blogs.id,
         blogs.title,
         blogs.content,
         blogs.created_at AS date,
         users.full_name AS author
       FROM blogs
       JOIN users ON blogs.author_id = users.id
       WHERE blogs.id = ?`,
      [blogId]
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (err) {
    console.error('Error fetching blog by id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
