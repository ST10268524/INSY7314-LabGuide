import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/api";
import "../App.css";

export default function PostEdit() {
  const { id } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then((res) => setContent(res.data.content))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios.patch(`/posts/${id}`, { content }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => alert("Post updated!"))
    .catch((err) => console.error(err));
  };

  return (
    <div className="container-card card shadow p-4">
      <h2 className="text-center mb-3">Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-warning w-100">Update</button>
      </form>
    </div>
  );
}
