import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check if user is authenticated
    // In a real app, you'd check a token in localStorage/cookies and validate it
    const isAuthenticated = localStorage.getItem('adminToken');

    if (!isAuthenticated) {
        return <Navigate to="/portal-lhema-access/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
