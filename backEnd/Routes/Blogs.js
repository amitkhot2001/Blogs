const express = require('express');
const router = express.Router();
const db = require('../DB/db'); // Your MySQL connection pool
const authenticateToken = require('../Middelware/middelware');

router.post('/blogs', authenticateToken, async (req, res) => {
  const { title, content, isDraft } = req.body;

  // Try both possible user ID keys
  const authorId = req.user.id || req.user.userId;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  if (!authorId) {
    return res.status(401).json({ error: 'User ID not found in token.' });
  }

  try {
    const query = 'INSERT INTO blogs (title, content, author_id, is_draft) VALUES (?, ?, ?, ?)';
    await db.execute(query, [title, content, authorId, isDraft ? 1 : 0]);

    res.status(201).json({
      message: isDraft ? 'Blog saved as draft successfully!' : 'Blog published successfully!',
    });
  } catch (error) {
    console.error('Error inserting blog:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
