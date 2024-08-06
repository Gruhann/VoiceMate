import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component }) => {
    // Replace with your actual authentication check
    const isAuthenticated = !!document.cookie; // Example for cookie-based auth

    return isAuthenticated ? (
        <Component />
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;
