import express from "express";
import db from "./db/conn.mjs"; // <-- this makes sure Mongo connects

const PORT = 3000;
const app = express();

app.use(express.json());

// Simple test route
app.get("/", async (req, res) => {
    try {
        // Try to read something from the DB
        const users = await db.collection("users").find({}).toArray();
        res.json(users);
    } catch (e) {
        console.error("DB error:", e);
        res.status(500).send("Database error");
    }
});

app.get("/test", (req, res) => {
    res.send("Testing the /test endpoint");
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
