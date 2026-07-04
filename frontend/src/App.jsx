import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  // Simple session check (localStorage is clean and standard)
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '');

  const handleLoginSuccess = (userToken) => {
    localStorage.setItem('auth_token', userToken);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken('');
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
