import React, { useState, useEffect, useRef } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Loader from '../components/Loader';
import fetchData from '../utils/fetchData';
import { useNavigate } from 'react-router-dom';

const Template = () => {
    const [preTemplates, setPreTemplates] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [form, setForm] = useState({
        name: '',
        t_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [editingTemplate, setEditingTemplate] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const debounceTimeout = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPreTemplates();
    }, [page, limit, debouncedSearch]);

    const fetchPreTemplates = async () => {
        setLoading(true);
        try {
            const result = await fetchData({
                API_URL: 'pre-template.php',
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setPreTemplates(result.template_suggestions || []);
                setTotalPages(result.pages);
            }
        } catch (err) {
            setError('Failed to fetch pre-template data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            setDebouncedSearch(value);
        }, 1000);
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value, 10));
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`px-4 py-2 ${i === page ? 'bg-teal-500 text-white' : 'bg-gray-300'} rounded-md`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const handleAddORUpdateTemplate = async () => {
        setLoading(true);
        setEditingTemplate(false);
        try {
            if(editingTemplate) {
                const data = {
                    t_id: form.t_id,
                    name: form.name,
                    limit,
                    page
                };
                const response = await fetch(`${process.env.REACT_APP_API_URL}/templates/update_template.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
              
                  const result = await response.json();
              
                  if (response.ok) {
                      setPreTemplates(result.updated_templates)
                      setShowModal(false);
                      setEditingTemplate(false);
                      resetForm();
                  } else {
                      throw new Error(result.error || 'Unknown error occurred');
                  }
            } else {
                const data = {
                    name: form.name,
                    limit
                };
                
                const response = await fetch(`${process.env.REACT_APP_API_URL}/templates/add_template.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
              
                  const result = await response.json();
              
                  if (response.ok) {
                      setPreTemplates(result.updated_templates);
                      setShowModal(false);
                      resetForm();
                  } else {
                      throw new Error(result.error || 'Unknown error occurred');
                  }
            }
        } catch (err) {
            setError('Failed to add pre-template');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTemplateName = (template) => {
        setEditingTemplate(true);
        setForm({ ...template });
        setShowModal(true);
    };

    const handleEditTemplate = async (template) => {
        console.log(template)
        const result = await fetchData({
            API_URL: `Appointments/fetch_appointment.php/?t_id=${template.t_id}`
        });

        if (result.error) {
            // throw new Error(result.error || 'Unknown error occurred');
            if(result.error.includes("Appointment not found")) {
                alert(result.error);
            } else {
                console.log("error");                
            }
        } else {
            navigate(`/admin/doctor_panel/precibsion/${result.appointment.af_id}`, {
                state: {
                    "appointment_details": result.appointment
                }
            });
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/templates/delete_template.php?t_id=${templateId}&page=${page}&limit=${limit}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                } 
              });
          
              const result = await response.json();
          
              if (response.ok) {
                  setPreTemplates(result.updated_templates)
              } else {
                  throw new Error(result.error || 'Unknown error occurred');
              }
            setShowModal(false);
        } catch (err) {
            setError('Failed to delete pre-template');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ name: '' });
    };

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold mb-4">Pre-Templates List</h2>
                        <button
                            onClick={openModal}
                            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none"
                        >
                            Add Pre-Template
                        </button>
                    </div>
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <label className="text-xl font-semibold">Show</label>
                            <select
                                onChange={handleLimitChange}
                                value={limit}
                                className="border px-4 py-2 rounded-md"
                            >
                                {[10, 25, 50, 100].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <span>Entries</span>
                        </div>
                        <div className="flex-shrink-0">
                            <input
                                type="text"
                                name="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                className="border px-4 py-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {loading ? (
                            <Loader />
                        ) : preTemplates?.length === 0 ? (
                            <p className="text-xl font-semibold text-center">No Pre-Templates Added</p>
                        ) : (
                            <table className="min-w-full table-auto">
                                <thead className="bg-teal-600 text-white">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Name</th>
                                        <th className="px-4 py-2 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preTemplates.map((template) => (
                                        <tr key={template.t_id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{template.name}</td>
                                            <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditTemplate(template)}
                                                    className="text-teal-700 hover:text-teal-500"
                                                >
                                                    Edit template
                                                </button>
                                                <button
                                                    onClick={() => handleEditTemplateName(template)}
                                                    className="text-teal-700 hover:text-teal-500"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTemplate(template.t_id)}
                                                    className="text-red-500 hover:text-red-400"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="mt-4 flex justify-center items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                    page === 1
                                        ? 'bg-gray-200 text-black cursor-not-allowed'
                                        : 'bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400'
                                }`}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            {renderPageNumbers()}
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                    page === totalPages
                                        ? 'bg-gray-200 text-black cursor-not-allowed'
                                        : 'bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400'
                                }`}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg w-96">
                                <h2 className="text-2xl text-teal-700 font-semibold mb-4">{editingTemplate ? 'Edit Pre-Template' : 'Add Pre-Template'}</h2>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="border px-4 py-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => {
                                            resetForm();
                                            closeModal();
                                            setEditingTemplate(false);
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleAddORUpdateTemplate}
                                        className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none"
                                    >
                                        {editingTemplate ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Template;
