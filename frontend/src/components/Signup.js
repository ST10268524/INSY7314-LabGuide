import React, { useState } from "react";
import api from "../api/api";
import "../App.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/users/signup", { username, password })
      .then(() => alert("User created!"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container-card card shadow p-4">
      <h2 className="text-center mb-3">Signup</h2>
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
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Signup</button>
      </form>
    </div>
  );
}
