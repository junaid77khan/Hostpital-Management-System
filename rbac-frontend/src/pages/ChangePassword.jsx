import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/change-password.php`, {
                oldPassword,
                newPassword,
            });

            if (response.data.success) {
                setSuccess('Password changed successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(response.data.error || 'Password change failed');
            }
        } catch (err) {
            setError('An error occurred while changing the password');
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 bg-gray-50">
                <Navbar />
                <div className="p-6 md:px-12 lg:px-16">
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h2 className="text-3xl font-semibold text-blue-700">Change Password</h2>
                        <p className="text-gray-600 mt-2">Update your password securely. Ensure your new password is strong and unique.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <form onSubmit={handleChangePassword}>
                            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

                            <div className="mb-5">
                                <label className="block text-gray-700 font-medium mb-2">Old Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-gray-700 font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Change Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
