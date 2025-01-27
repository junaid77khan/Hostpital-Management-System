import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        status: 'Active',
    });
    const [editing, setEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [operationLoading, setOperationLoading] = useState(false);

    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL;

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(res.data);
        } catch (err) {
            setError('Failed to fetch roles');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOperationLoading(true);
        try {
            if (editing) {
                await axios.put(`${API_URL}/api/users/${currentUser._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${API_URL}/api/users`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setForm({ name: '', email: '', password: '', role: '', status: 'Active' });
            setEditing(false);
            setCurrentUser(null);
            fetchUsers();
        } catch (err) {
            setError(err.response.data.message || 'Operation failed');
        } finally {
            setOperationLoading(false);
        }
    };

    const handleEdit = (user) => {
        setForm({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role._id,
            status: user.status,
        });
        setEditing(true);
        setCurrentUser(user);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setOperationLoading(true);
            try {
                await axios.delete(`${API_URL}/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchUsers();
            } catch (err) {
                setError('Failed to delete user');
            } finally {
                setOperationLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row">
            <Sidebar />
            <div className="flex-1 bg-gray-50 min-h-screen">
                <Navbar />
                <div className="p-6">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-700">Users Management</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <h3 className="text-2xl mb-4 font-medium text-gray-800">{editing ? 'Edit User' : 'Add User'}</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 focus:border-indigo-500"
                                />
                            </div>
                            {!editing && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 focus:border-indigo-500"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 focus:border-indigo-500"
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role._id} value={role._id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 focus:border-indigo-500"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="col-span-full flex items-center gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium"
                                >
                                    {editing ? 'Update User' : 'Add User'}
                                </button>
                                {editing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(false);
                                            setForm({ name: '', email: '', password: '', role: '', status: 'Active' });
                                        }}
                                        className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="overflow-auto">
                        {loading || operationLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="w-8 h-8 border-2 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <table className="w-full table-auto bg-white shadow rounded-lg overflow-hidden">
                                <thead className="bg-indigo-600 text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Role</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-100">
                                            <td className="border px-4 py-3">{user.name}</td>
                                            <td className="border px-4 py-3">{user.email}</td>
                                            <td className="border px-4 py-3">{user.role?.name}</td>
                                            <td className="border px-4 py-3">{user.status}</td>
                                            <td className="border px-4 py-3 flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="text-blue-600 hover:text-blue-500"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-600 hover:text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
