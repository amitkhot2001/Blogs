const express = require('express');
const router = express.Router();
const db = require('../DB/db'); // Make sure the path to your DB connection is correct

// GET /public-blogs?page=1&limit=6
router.get('/public-blogs', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;

  try {
    // Fetch paginated blog posts
    const [blogs] = await db.query(`
      SELECT 
        blogs.id,
        blogs.title,
        blogs.content AS description,
        blogs.created_at AS date,
        users.full_name AS author
      FROM blogs
      JOIN users ON blogs.author_id = users.id
      WHERE blogs.is_draft = 0
      ORDER BY blogs.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    // Fetch total count for pagination
    const [[{ total }]] = await db.query(`
      SELECT COUNT(*) AS total FROM blogs WHERE is_draft = 0
    `);

    res.json({
      blogs,
      totalBlogs: total,              // <-- send total count here
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching public blogs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
