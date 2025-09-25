// middleware/checkauth.mjs
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_in_production';

export default function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);

    // attach small user info to request for downstream handlers
    req.user = { id: payload.userId || payload.id, username: payload.username };
    next();
  } catch (err) {
    console.error('Auth error:', err?.message || err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
