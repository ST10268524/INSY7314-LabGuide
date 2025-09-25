// server.js
import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import postsRouter from './routes/post.mjs';
import usersRouter from './routes/user.mjs';
import { connectToDb } from './db/conn.mjs'; // adjust if your conn.mjs exports different name

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json({ limit: '5mb' })); // allow some room for image-as-string if needed
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// Health route
app.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// API routes
app.use('/posts', postsRouter); // routes defined in routes/post.mjs
app.use('/users', usersRouter); // routes defined in routes/user.mjs

// connect to DB, then start HTTPS server
async function start() {
  try {
    // connect to MongoDB
    await connectToDb();
    console.log('Connected to MongoDB');

    // read certs from keys/
    const keyPath = path.join('.', 'keys', 'privatekey.pem');
    const certPath = path.join('.', 'keys', 'certificate.pem');

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      console.warn('SSL keys not found in keys/. Starting HTTP server instead of HTTPS.');
      app.listen(PORT, () => console.log(`Server running (HTTP) on port ${PORT}`));
      return;
    }

    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificate = fs.readFileSync(certPath, 'utf8');

    https.createServer({ key: privateKey, cert: certificate }, app)
      .listen(PORT, () => {
        console.log(`Server running (HTTPS) on port ${PORT}`);
      });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
