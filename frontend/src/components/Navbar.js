import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>INSY7314 3D App</h1>
      <div className="links">
        <Link to="/">Posts</Link>
        <Link to="/create">Create Post</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </nav>
  );
}
