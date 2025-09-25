// routes/post.mjs
import express from 'express';
import { ObjectId } from 'mongodb';
import checkAuth from '../middleware/checkauth.mjs';
import { getDb } from '../db/conn.mjs'; // adjust if your conn file exports differently

const router = express.Router();
const COLLECTION = 'posts';

// GET /api/posts/         -> return all posts
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const posts = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    return res.json(posts);
  } catch (err) {
    console.error('GET posts error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/posts/:id      -> return one post by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const post = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json(post);
  } catch (err) {
    console.error('GET post by id error:', err);
    return res.status(400).json({ error: 'Invalid id or database error' });
  }
});

// POST /api/posts/upload  -> create a post (protected)
router.post('/upload', checkAuth, async (req, res) => {
  try {
    const { username, content, picture } = req.body;
    if (!username || !content) {
      return res.status(400).json({ error: 'username and content required' });
    }

    const db = getDb();
    const newDoc = {
      username,
      content,
      picture: picture || null,        // can be a base64 string or URL per guide
      createdAt: new Date(),
      createdBy: req.user?.username || req.user?.id || null
    };

    const result = await db.collection(COLLECTION).insertOne(newDoc);
    return res.status(201).json({ insertedId: result.insertedId, ...newDoc });
  } catch (err) {
    console.error('POST upload error:', err);
    return res.status(500).json({ error: 'Could not create post' });
  }
});

// PATCH /api/posts/:id    -> update a post (protected)
router.patch('/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const allowed = ['content', 'picture'];
    for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.updatedAt = new Date();

    const db = getDb();
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' } // for mongodb v4+ driver
    );

    if (!result.value) return res.status(404).json({ error: 'Post not found' });
    return res.json(result.value);
  } catch (err) {
    console.error('PATCH post error:', err);
    return res.status(400).json({ error: 'Invalid id or DB error' });
  }
});

// DELETE /api/posts/:id   -> delete a post (protected)
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Post not found' });
    return res.json({ deletedId: id });
  } catch (err) {
    console.error('DELETE post error:', err);
    return res.status(400).json({ error: 'Invalid id or DB error' });
  }
});

export default router;
