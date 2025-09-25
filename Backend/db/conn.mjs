// db/conn.mjs (example)
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'mydb';
const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });

let db = null;
export async function connectToDb() {
  if (!db) {
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Mongo connected to', DB_NAME);
  }
  return db;
}

export function getDb() {
  if (!db) throw new Error('Database not initialized. Call connectToDb() first.');
  return db;
}
