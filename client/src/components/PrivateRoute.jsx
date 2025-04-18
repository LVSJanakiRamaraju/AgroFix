// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('Admin'); // Check for admin role

  return isAuthenticated && isAdmin ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
