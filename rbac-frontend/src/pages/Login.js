import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/login.php`, { password });
                // console.log(res);
                
            // If login is successful
            if (res.data.success) {
                // Save the token and navigate to the admin page
                localStorage.setItem('auth_token', res.data.token);
                localStorage.setItem('auth_expiration', Date.now() + res.data.expires_in * 1000);                 
                navigate('/admin/doctor_panel');
            } else {
                // Handle unexpected API responses
                setError(res.data.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-800">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Welcome Back!</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={onSubmit}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
