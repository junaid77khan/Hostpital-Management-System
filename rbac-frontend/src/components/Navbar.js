
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaHospital } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('auth_token');
            const expiration = localStorage.getItem('auth_expiration');
            
            if (!token || Date.now() > Number(expiration)) {
                localStorage.removeItem('auth_token'); // Clear token if expired
                localStorage.removeItem('auth_expiration'); // Clear expiration time
                navigate('/login'); // Redirect to login page
            }
        };

        // Check token on mount
        checkAuth();

        // Set an interval to check periodically
        const interval = setInterval(checkAuth, 5000); // Every 5 seconds

        // Cleanup the interval on unmount
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_expiration');
        localStorage.removeItem('auth_token');
        navigate('admin/doctor_panel/login');
    };

    return (
        <nav className="bg-gradient-to-b from-blue-700 to-blue-900 p-4 flex justify-between items-center shadow-lg">
            <h1 className="text-white text-2xl font-semibold tracking-wider text-center w-full 
                lg:text-2xl lg:block sm:text-xl sm:pt-6 sm:px-4">
                <span className="inline-flex items-center">
                    <FaHospital className="p-2 rounded-full" size={50} color="white" />
                    <span className="ml-2 text-xl">{process.env.REACT_APP_HOSPITAL_NAME}</span>
                </span>
            </h1>

            <button
                onClick={handleLogout}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 focus:outline-none"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
