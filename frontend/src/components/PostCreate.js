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
      .then(() => {
        alert("Post created!");
        setUsername("");
        setContent("");
        setPicture("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container-card card shadow p-4">
      <h2 className="text-center mb-3">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Image URL"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Post</button>
      </form>
    </div>
  );
}
