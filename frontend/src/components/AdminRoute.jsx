import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Correctly imports the hook

const AdminRoute = () => {
    const { user, token } = useAuth(); // Correctly uses the hook

    // If there's no token, the user is not authenticated. Redirect to login.
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // While we wait for the user object to be fetched from the API
    if (token && !user) {
        return <div>Loading user data...</div>;
    }

    // If we have a user, check their role.
    // If they are an admin, render the child route. Otherwise, redirect.
    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;