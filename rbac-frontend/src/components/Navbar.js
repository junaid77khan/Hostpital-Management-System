import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHospital, FaUserMd, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('auth_token');
            const expiration = localStorage.getItem('auth_expiration');
            
            if (!token || Date.now() > Number(expiration)) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_expiration');
                navigate('/login');
            }
        };

        // Check token on mount
        checkAuth();

        // Set an interval to check periodically
        const interval = setInterval(checkAuth, 5000); // Every 5 seconds

        // Cleanup the interval on unmount
        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('auth_expiration');
        localStorage.removeItem('auth_token');
        navigate('admin/doctor_panel/login');
    };

    return (
        <nav className="bg-gradient-to-r from-teal-600 to-teal-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Hospital Name - Always visible */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <FaHospital className="text-white" size={28} />
                            <span className="ml-2 text-white font-semibold text-lg md:text-xl">
                                {process.env.REACT_APP_HOSPITAL_NAME || "Medical Center"}
                            </span>
                        </div>
                    </div>

                    {/* Desktop menu - Hidden on mobile */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="bg-white text-teal-800 px-4 py-2 rounded-md font-medium hover:bg-teal-50 transition duration-300 flex items-center"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:text-teal-200 focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <FaTimes size={24} />
                            ) : (
                                <FaBars size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on state */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-teal-700 shadow-inner">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left bg-white text-teal-800 block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-50 flex items-center"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;