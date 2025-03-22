import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import ProtectedRoute from './ProtectedRoute';


const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
      {/* <Route path="/posts/:postId/comments" element={<ProtectedRoute><PostComments /></ProtectedRoute>} /> */}
    </Routes>
  );
};

export default UserRoutes;