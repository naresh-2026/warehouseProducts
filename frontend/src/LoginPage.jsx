// src/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import API_BASE_URL from "./config";

function LoginPage() {
  // ... (existing state and handleSubmit function)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    // ... (existing handleSubmit logic)
    event.preventDefault();
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setIsLoggedIn(true);
        console.log('Login successful!');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', err);
    }
  };
  useEffect(() => {
  if (isLoggedIn) {
    navigate("/ProductList", { state: { username } });
  }
}, [isLoggedIn, navigate, username]);
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">Log In</button>
      </form>
      <div className="nav-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default LoginPage;