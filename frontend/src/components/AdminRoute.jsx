import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const AdminRoute = () => {
    const { user, token } = useAuth(); 

    // If there's no token, the user is not authenticated. Redirect to login.
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    
    if (token && !user) {
        return <div>Loading user data...</div>;
    }


    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;