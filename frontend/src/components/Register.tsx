import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { register } from '../services/AuthService'; // Import the register function
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, username, password); // Call the register function
      console.log('Registration successful');
      // Handle successful registration, e.g., redirect to login page
      toast.success('Registration successful!');
      navigate('/login');

    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f2f2f2' }}>
      <ToastContainer />
      <div
        className="p-4 shadow-sm"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '2rem',
        }}
      >
        <div className="text-center mb-3">
          <h4 className="fw-bold mb-1">Sign Up</h4>
          <small>
            Already have an account? <a href="/login">Sign in</a>
          </small>
        </div>

        <div className="d-grid gap-2 mb-3">
          <button className="btn btn-light border rounded-pill d-flex align-items-center justify-content-center gap-2">
            <FcGoogle />
            Sign up with Google
          </button>
        </div>

        <div className="text-center text-muted mb-3 position-relative">
          <hr />
          <span
            className="position-absolute top-50 start-50 translate-middle px-2"
            style={{ backgroundColor: '#ffffff', fontSize: '0.8rem' }}
          >
            OR
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small">Your username</label>
            <input
              type="text"
              className="form-control rounded-pill px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small">Your email</label>
            <input
              type="email"
              className="form-control rounded-pill px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small">Your password</label>
            <input
              type="password"
              className="form-control rounded-pill px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100 rounded-pill py-2"
            style={{ backgroundColor: '#9933ff', color: 'white', fontWeight: 'bold' }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;