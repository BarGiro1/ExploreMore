import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthRoutes from './routes/AuthRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth/*" element={<AuthRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;