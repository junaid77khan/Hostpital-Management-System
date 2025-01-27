import React, { useState, useEffect, useRef } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Loader from '../components/Loader';
import fetchData from '../utils/fetchData';

const NextSuggestion = () => {
    const [nextSuggestions, setNextSuggestions] = useState([]); // Updated state variable
    const [types, setTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [form, setForm] = useState({
        name: '',
        ns_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [editingNextSuggestion, setEditingNextSuggestion] = useState(false); // Updated state variable
    const [totalPages, setTotalPages] = useState(1);

    const debounceTimeout = useRef(null);

    useEffect(() => {
        fetchNextSuggestion(); // Updated function
    }, [page, limit, debouncedSearch]);

    const fetchNextSuggestion = async () => { 
        setLoading(true);
        try {
            const result = await fetchData({
                API_URL: 'Next_Suggestion/next_suggestion.php', // Updated API URL
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setNextSuggestions(result.next_suggestions || []);  // Updated state variable
                setTotalPages(result.pages); 
            }
        } catch (err) {
            setError('Failed to fetch next suggestion data');
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

    const openModal = (suggestion) => {
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
                    className={`px-4 py-2 ${i === page ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded-md`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const handleAddOrUpdateNextSuggestion = async () => { // Updated function
        setLoading(true);
        setEditingNextSuggestion(false); // Updated state variable
        try {
            if(editingNextSuggestion) {
                const data = {
                    ns_id: form.ns_id,
                    name: form.name,
                    limit,
                    page
                };
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Next_Suggestion/update_next_suggestion.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
              
                  const result = await response.json();
              
                  if (response.ok) {
                      setNextSuggestions(result.updated_suggestions)
                      setShowModal(false);
                      setEditingNextSuggestion(false);
                      resetForm();
                  } else {
                      throw new Error(result.error || 'Unknown error occurred');
                  }
            } else {
                const data = {
                    name: form.name,
                    limit
                };
                
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Next_Suggestion/add_next_suggestion.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
              
                  const result = await response.json();
              
                  if (response.ok) {
                      setNextSuggestions(result.updated_suggestions);
                      setShowModal(false);
                      resetForm();
                  } else {
                      throw new Error(result.error || 'Unknown error occurred');
                  }
            }
        } catch (err) {
            setError('Failed to add next suggestion');
        } finally {
            setLoading(false);
        }
    };

    const handleEditNextSuggestion = (suggestion) => { // Updated function
        setEditingNextSuggestion(true); // Updated state variable
        setForm({ ...suggestion });
        setShowModal(true);
    };

    const handleDeleteNextSuggestion = async (suggestionId) => { // Updated function
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Next_Suggestion/delete_next_suggestion.php?ns_id=${suggestionId}&limit=${limit}&page=${page}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                } 
              });
          
              const result = await response.json();
          
              if (response.ok) {
                  setNextSuggestions(result.updated_suggestions)
              } else {
                  throw new Error(result.error || 'Unknown error occurred');
              }
            setShowModal(false);
        } catch (err) {
            setError('Failed to delete next suggestion');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ name: '', type: '', instructions: '', dose: '', description: '' });
    };

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold mb-4">Next Suggestions List</h2> {/* Updated title */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                        >
                            Add Next Suggestion {/* Updated text */}
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
                                name='text'
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                className="border px-4 py-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                    
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {loading ? (
                            <Loader />
                        ) : nextSuggestions.length === 0 ? (  // Updated condition
                            <p className="text-xl font-semibold text-center">No Next Suggestions Added</p> 
                        ) : (
                            <table className="min-w-full table-auto">
                                <thead className="bg-indigo-600 text-white">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Name</th>
                                        <th className="px-4 py-2 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nextSuggestions.map((suggestion) => (  // Updated state variable
                                        <tr key={suggestion.fei_id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{suggestion.name}</td>
                                            <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditNextSuggestion(suggestion)} // Updated function
                                                    className="text-blue-700 hover:text-blue-500"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNextSuggestion(suggestion.ns_id)} // Updated function
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
                                        : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
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
                                        : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
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
                                <h2 className="text-2xl text-blue-700 font-semibold mb-4">{editingNextSuggestion ? 'Edit Next Suggestion' : 'Add Next Suggestion'}</h2>
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
                                            setShowModal(false);
                                            setEditingNextSuggestion(false);
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleAddOrUpdateNextSuggestion}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        {editingNextSuggestion ? 'Update' : 'Add'}
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

export default NextSuggestion;
