// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // If the authentication status is still loading,
  // you might want to show a loading spinner or a blank page.
  if (isLoading) {
    return <div>Loading...</div>; // Or return null;
  }

  // If the user is not logged in, redirect them to the /login page.
  // The 'replace' prop prevents the user from going "back" to the protected route
  // after being redirected.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the child components (the actual page).
  return children;
};

export default ProtectedRoute;