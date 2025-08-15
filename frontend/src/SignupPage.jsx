// import React, { useState } from 'react';
// import './SignupPage.css'; // Import the CSS file for styling

// function SignupPage() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isSignedUp, setIsSignedUp] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Basic validation: Check if fields are empty
//     if (!username || !email || !password) {
//       setError('All fields are required.');
//       return;
//     }

//     setError(''); // Clear previous errors

//     // Simulate a backend API call
//     try {
//       const response = await fetch('https://api.example.com/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, email, password }),
//       });

//       if (response.ok) {
//         // Successful signup
//         setIsSignedUp(true);
//         console.log('Signup successful! Redirecting to login page...');
//         // In a real app, you would redirect here using React Router: navigate('/login');
//       } else {
//         // Unsuccessful signup
//         const data = await response.json();
//         setError(data.message || 'Signup failed. Please try again.');
//       }
//     } catch (err) {
//       // Handle network or other errors
//       setError('An error occurred. Please try again later.');
//       console.error('Signup error:', err);
//     }
//   };

//   if (isSignedUp) {
//     return (
//       <div className="success-container">
//         <h1>Welcome, {username}!</h1>
//         <p>Your account has been created. You can now log in.</p>
//         {/* A link to the login page would go here */}
//       </div>
//     );
//   }

//   return (
//     <div className="signup-container">
//       <form className="signup-form" onSubmit={handleSubmit}>
//         <h2>Sign Up</h2>
//         {error && <p className="error-message">{error}</p>}
//         <div className="input-group">
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div className="input-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="input-group">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type="submit" className="signup-button">Sign Up</button>
//       </form>
//     </div>
//   );
// }

// export default SignupPage;

// src/SignupPage.jsx
import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useNavigate } from "react-router-dom";
import './SignupPage.css';
import API_BASE_URL from "./config";

function SignupPage() {
  // ... (existing state and handleSubmit function)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    // ... (existing handleSubmit logic)
    event.preventDefault();
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        setIsSignedUp(true);
        setMessage("Sign up successful!");
        console.log('Signup successful!');
      } else {
        const data = await response.json();
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Signup error:', err);
    }
  };
  
   // Show message then navigate after 2 seconds
  useEffect(() => {
    if (isSignedUp) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1200); // seconds delay

      return () => clearTimeout(timer); // cleanup in case component unmounts
    }
  }, [isSignedUp, navigate]);

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <div className="nav-link">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}

export default SignupPage;