import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../App.css";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-muted">No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card shadow-sm">
            <h5 className="fw-bold">{post.username}</h5>
            <p>{post.content}</p>
            {post.picture && <img src={post.picture} alt="Post" />}
          </div>
        ))
      )}
    </div>
  );
}
