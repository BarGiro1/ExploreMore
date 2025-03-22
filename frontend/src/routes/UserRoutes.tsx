import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import ProtectedRoute from './ProtectedRoute';
import Comments from '../components/Comments';


const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
      <Route path="/posts/:postId/comments" element={<ProtectedRoute><Comments /></ProtectedRoute>} />
    </Routes>
  );
};

export default UserRoutes;