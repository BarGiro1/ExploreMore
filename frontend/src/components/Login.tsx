import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password); 
      console.log('Login successful');
      toast.success('Login successful!');
      setTimeout(() => {
        navigate("/");
      }, 1000); 
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
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
          <h4 className="fw-bold mb-1">Log in</h4>
          <small>
            Don’t have an account? <a href="/auth/register">Sign up</a>
          </small>
        </div>

        <div className="d-grid gap-2 mb-3">
          <button className="btn btn-light border rounded-pill d-flex align-items-center justify-content-center gap-2">
            <FcGoogle />
            Log in with Google
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
            style={{ backgroundColor: '#9933ff', color: '#fff', fontWeight: 'bold' }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;