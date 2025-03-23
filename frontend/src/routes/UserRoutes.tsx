import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import Home from '../components/Home';
import ProtectedRoute from './ProtectedRoute';
import Comments from '../components/Comments';
import Profile from '../components/Profile';


const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/posts/:postId/comments" element={<ProtectedRoute><Comments /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><div><Profile/></div></ProtectedRoute>} />
    </Routes>
  );
};

export default UserRoutes;