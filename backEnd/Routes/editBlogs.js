const express = require('express');
const router = express.Router();
const Hashids = require('hashids/cjs');
const authenticateToken = require('../Middelware/middelware');
const pool = require('../DB/db');

const hashids = new Hashids('qA0z4AGE9R', 10);

// GET blog details by encoded ID
router.get('/blogs/:encodedId', authenticateToken, async (req, res) => {
  const encodedId = req.params.encodedId;
  const decoded = hashids.decode(encodedId);

  if (!decoded.length) return res.status(400).json({ message: 'Invalid blog ID' });

  const blogId = decoded[0];
  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });

    const blog = rows[0];
    if (blog.author_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied: You do not own this blog' });
    }

    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update blog details by encoded ID
router.put('/blogs/:encodedId', authenticateToken, async (req, res) => {
  const encodedId = req.params.encodedId;
  const decoded = hashids.decode(encodedId);

  if (!decoded.length) return res.status(400).json({ message: 'Invalid blog ID' });

  const blogId = decoded[0];
  const { title, content, is_draft } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });

    const blog = rows[0];
    if (blog.author_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied: You do not own this blog' });
    }

    await pool.query(
      'UPDATE blogs SET title = ?, content = ?, is_draft = ? WHERE id = ?',
      [title, content, is_draft ? 1 : 0, blogId]
    );

    res.json({ message: 'Blog updated successfully' });
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE blog by encoded ID
router.delete('/blogs/:encodedId', authenticateToken, async (req, res) => {
  const encodedId = req.params.encodedId;
  const decoded = hashids.decode(encodedId);

  if (!decoded.length) return res.status(400).json({ message: 'Invalid blog ID' });

  const blogId = decoded[0];

  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });

    const blog = rows[0];
    if (blog.author_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied: You do not own this blog' });
    }

    await pool.query('DELETE FROM blogs WHERE id = ?', [blogId]);

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
