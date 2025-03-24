import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken } = useAuth();
  if (!accessToken) {
    return <Navigate to="/authentication/login" />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;