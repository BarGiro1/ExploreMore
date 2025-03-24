import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa'; // Import icons
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/authentication/login');
      toast.success('Logged out successfully!');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  return (
    <>
      <ToastContainer />
      <Button onClick={handleLogout} className="d-flex align-items-center mb-2" style={{ backgroundColor: 'transparent', border: 'none', color: 'inherit' }}>
        <FaSignOutAlt className="me-2" /> Logout
      </Button>
    </>
  );
};

export default Logout;