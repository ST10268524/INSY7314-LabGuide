import React, { useState } from "react";
import api from "../api/api";
import "../App.css";

export default function PostCreate() {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/posts/upload", { username, content, picture })
      .then((res) => {
        alert("Post created!");
        setUsername("");
        setContent("");
        setPicture("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <input placeholder="Image URL" value={picture} onChange={(e) => setPicture(e.target.value)} />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
