import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">INSY7314 3D App</Link>
        <div className="collapse navbar-collapse">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">Posts</Link>
            <Link className="nav-link" to="/create">Create Post</Link>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/signup">Signup</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
