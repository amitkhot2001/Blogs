const express = require('express');
const router = express.Router();
const db = require('../DB/db');

// GET /public-blogs
router.get('/public-blogs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search?.trim() || '';
    const offset = (page - 1) * limit;

    let queryParams = [];
    let relevanceParams = ['%%', '%%', '%%']; // Default for CASE when no search
    let searchCondition = '';

    if (search) {
      const pattern = `%${search}%`;
      searchCondition = `
        AND (
          blogs.title LIKE ?
          OR blogs.content LIKE ?
          OR users.full_name LIKE ?
        )
      `;
      queryParams = [pattern, pattern, pattern];
      relevanceParams = [pattern, pattern, pattern];
    }

    const [blogs] = await db.query(
      `SELECT 
        blogs.id,
        blogs.title,
        SUBSTRING(blogs.content, 1, 200) AS description,
        blogs.created_at AS date,
        users.full_name AS author,
        (
          CASE 
            WHEN blogs.title LIKE ? THEN 3
            WHEN blogs.content LIKE ? THEN 1
            WHEN users.full_name LIKE ? THEN 2
            ELSE 0
          END
        ) AS relevance
      FROM blogs
      JOIN users ON blogs.author_id = users.id
      WHERE blogs.is_draft = 0
      ${searchCondition}
      ORDER BY 
        ${search ? 'relevance DESC,' : ''} 
        blogs.created_at DESC
      LIMIT ? OFFSET ?`,
      [...relevanceParams, ...queryParams, limit, offset]
    );

    // Total count query
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total 
       FROM blogs 
       JOIN users ON blogs.author_id = users.id
       WHERE blogs.is_draft = 0
       ${searchCondition}`,
      queryParams
    );

    // Highlight matched terms in blog preview
    const processedBlogs = blogs.map(blog => ({
      ...blog,
      description: blog.description ? highlightSearchTerms(blog.description, search) : '',
      title: highlightSearchTerms(blog.title, search),
      author: highlightSearchTerms(blog.author, search)
    }));

    return res.json({
      blogs: processedBlogs,
      totalBlogs: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      searchQuery: search || null
    });

  } catch (err) {
    console.error('Error fetching public blogs:', err);
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Highlight helper
function highlightSearchTerms(text, search) {
  if (!search || !text) return text;

  const terms = search.split(' ').filter(Boolean);
  let highlighted = text;

  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });

  return highlighted;
}

// GET /search-suggestions
router.get('/search-suggestions', async (req, res) => {
  try {
    const search = req.query.q?.trim() || '';

    if (!search || search.length < 2) {
      return res.json({ suggestions: [] });
    }

    const [results] = await db.query(
      `SELECT DISTINCT
        title AS suggestion,
        'title' AS type
      FROM blogs
      WHERE is_draft = 0 AND title LIKE ?
      UNION
      SELECT DISTINCT
        full_name AS suggestion,
        'author' AS type
      FROM users
      WHERE full_name LIKE ?
      LIMIT 5`,
      [`%${search}%`, `%${search}%`]
    );

    return res.json({ suggestions: results });

  } catch (err) {
    console.error('Error fetching search suggestions:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
