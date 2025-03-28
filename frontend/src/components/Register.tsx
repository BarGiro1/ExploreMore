import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState<string | null>(null);
  const { register } = useAuth(); // Get the register function from AuthContext


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, username, password, profilePhoto); // Call the register function from AuthContext
      console.log('Registration successful');
      toast.success('Registration successful!');
      setTimeout(() => {
        navigate("/authentication/login");
      }, 1000); 
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setProfilePhotoURL(URL.createObjectURL(file));
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
            Already have an account? <a href="/authentication/login">Sign in</a>
          </small>
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
          <div className="mb-3">
            <label className="form-label small">Profile Photo</label>
            <input
              type="file"
              className="form-control rounded-pill px-3 py-2"
              onChange={handlePhotoChange}
              accept="image/*"
            />
          </div>
          {profilePhotoURL && (
            <div className="mb-3 text-center">
              <img
                src={profilePhotoURL}
                alt="Profile Preview"
                className="img-fluid rounded-circle"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
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