import React, { useState } from "react";
import api from "../api/api";
import "../App.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/users/login", { username, password })
      .then((res) => {
        alert("Login successful! Token: " + res.data.token);
        localStorage.setItem("token", res.data.token);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container-card card shadow p-4">
      <h2 className="mb-3 text-center">Login</h2>
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
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
