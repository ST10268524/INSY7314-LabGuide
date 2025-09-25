// routes/user.mjs
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ExpressBrute from 'express-brute';
import dotenv from 'dotenv';
import { getDb } from '../db/conn.mjs'; // adjust if needed
dotenv.config();

const router = express.Router();
const COLLECTION = 'users';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_in_production';

// express-brute setup (memory store is fine for lab / demo)
const store = new ExpressBrute.MemoryStore();
const brute = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 5 * 1000,        // 5s
  maxWait: 60 * 60 * 1000,  // 1 hour
  lifetime: 60 * 60         // seconds
});

// SIGNUP
// POST /api/users/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const db = getDb();
    const existing = await db.collection(COLLECTION).findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already taken' });

    const hash = await bcrypt.hash(password, 10);
    const userDoc = { username, passwordHash: hash, createdAt: new Date() };
    const result = await db.collection(COLLECTION).insertOne(userDoc);

    return res.status(201).json({ message: 'User created', userId: result.insertedId });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

// LOGIN
// POST /api/users/login
// apply bruteforce middleware to login route
router.post('/login', brute.prevent, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const db = getDb();
    const user = await db.collection(COLLECTION).findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id.toString(), username: user.username }, JWT_SECRET, { expiresIn: '2h' });

    return res.json({ token, expiresIn: '2h' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
