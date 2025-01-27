import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');
    const expiration = localStorage.getItem('auth_expiration');

    // Check if token exists and is not expired
    // if (!token || Date.now() > Number(expiration)) {
    //     // Clear the invalid token and expiration time
    //     localStorage.removeItem('auth_token');
    //     localStorage.removeItem('auth_expiration');

    //     // Redirect to login page
    //     return <Navigate to="/admin/doctor_panel/login" />;
    // }

    // Render children if token is valid
    return children;
};

export default PrivateRoute;
