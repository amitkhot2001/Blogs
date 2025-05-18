const express = require('express');
const router = express.Router();
const db = require('../DB/db'); // Adjust path if needed

// GET /api/public-blogs?page=1&limit=6
router.get('/public-blogs', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;

  try {
  

    // Fetch paginated blogs
    const [blogs] = await db.query(
      `SELECT 
          blogs.id,
          blogs.title,
          blogs.content AS description,
          blogs.created_at AS date,
          users.full_name AS author
        FROM blogs
        JOIN users ON blogs.author_id = users.id
        WHERE blogs.is_draft = 0
        ORDER BY blogs.created_at DESC
        LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Fetch total blogs count
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM blogs WHERE is_draft = 0`
    );

    // Send response
    return res.json({
      blogs,
      totalBlogs: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching public blogs:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
