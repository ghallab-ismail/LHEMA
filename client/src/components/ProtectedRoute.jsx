import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isTokenValid = (token) => {
    if (!token) return false;
    try {
        // JWT structure: header.payload.signature
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if token has expired (exp is in seconds, Date.now() is in ms)
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            return false;
        }
        return true;
    } catch (e) {
        // Token is malformed
        return false;
    }
};

const ProtectedRoute = () => {
    const token = localStorage.getItem('adminToken');

    if (!isTokenValid(token)) {
        // Clear the expired/invalid token so the login page shows cleanly
        localStorage.removeItem('adminToken');
        return <Navigate to="/portal-lhema-access/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
