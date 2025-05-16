import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContextProvider } from './contexts/AuthContext';

/**
 * Main application entry point
 * Sets up providers for:
 * - React Strict Mode
 * - Google OAuth 
 * - Authentication Context
 * - Router (in App.jsx)
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID || ''}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
