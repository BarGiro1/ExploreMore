import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!)

root.render(
  <GoogleOAuthProvider clientId="906759648008-aoqojbfljuaqp1m8n0tjfnqruhb8nh38.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);