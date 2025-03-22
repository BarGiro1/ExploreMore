import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;