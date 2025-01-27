import React, { useState, useEffect, useRef } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Loader from '../components/Loader';
import fetchData from '../utils/fetchData';

const FoodEatingInstruction = () => {
    const [foodEatingInstructions, setFoodEatingInstructions] = useState([]); // Updated state variable
    const [types, setTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [form, setForm] = useState({
        name: '',
        fei_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [editingFoodInst, setEditingFoodInst] = useState(false); // Updated state variable
    const [totalPages, setTotalPages] = useState(1);

    const debounceTimeout = useRef(null);

    useEffect(() => {
        fetchFoodEatingInstruction(); // Updated function
    }, [page, limit, debouncedSearch]);

    const fetchFoodEatingInstruction = async () => { 
        setLoading(true);
        try {
            const result = await fetchData({
                API_URL: 'Food/Get_Food_Eating_Instructions.php', // Updated API URL
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setFoodEatingInstructions(result.food_eating_instructions || []);  // Updated state variable
                setTotalPages(result.pages); 
            }
        } catch (err) {
            setError('Failed to fetch food eating instructions data');
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

    const handleAddORUpdateFoodEatingInst = async () => { 
        setLoading(true);
        setEditingFoodInst(false); 
        try {
            if(editingFoodInst) {
                const data = {
                    fei_id: form.fei_id,
                    name: form.name,
                    limit,
                    page
                };
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Food/update_food_eating_inst.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
              
                  const result = await response.json();
              
                  if (response.ok) {
                      setFoodEatingInstructions(result.updated_instructions)
                      setShowModal(false);
                      setEditingFoodInst(false);
                      resetForm();
                  } else {
                      throw new Error(result.error || 'Unknown error occurred');
                  }
            } else {
                const data = {
                    name: form.name,
                    limit,
                    page
                };
                
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Food/add_food_eat_inst.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
              
                  const result = await response.json();
              
                  if (response.ok) {
                      setFoodEatingInstructions(result.updated_instructions);
                      setShowModal(false);
                      resetForm();
                  } else {
                      throw new Error(result.error || 'Unknown error occurred');
                  }
            }
        } catch (err) {
            setError('Failed to add food eating instruction');
        } finally {
            setLoading(false);
        }
    };

    const handleEditFoodEatingInst = (instruction) => { // Updated function
        setEditingFoodInst(true); // Updated state variable
        setForm({ ...instruction });
        setShowModal(true);
    };

    const handleDeleteFoodEatingInst = async (instructionId) => { // Updated function
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Food/delete_food_eating_inst.php?fei_id=${instructionId}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                } 
              });
          
              const result = await response.json();
          
              if (response.ok) {
                  setFoodEatingInstructions(result.updated_instructions)
              } else {
                  throw new Error(result.error || 'Unknown error occurred');
              }
            setShowModal(false);
        } catch (err) {
            setError('Failed to delete food eating instruction');
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
                        <h2 className="text-2xl font-semibold mb-4">Food Eating Instructions List</h2> {/* Updated title */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                        >
                            Add Food Eating Instruction {/* Updated text */}
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
                        ) : foodEatingInstructions.length === 0 ? (  // Updated condition
                            <p className="text-xl font-semibold text-center">No Food Eating Instructions Added</p> 
                        ) : (
                            <table className="min-w-full table-auto">
                                <thead className="bg-indigo-600 text-white">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Name</th>
                                        <th className="px-4 py-2 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foodEatingInstructions.map((instruction) => (  // Updated state variable
                                        <tr key={instruction.fei_id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{instruction.name}</td>
                                            <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditFoodEatingInst(instruction)} // Updated function
                                                    className="text-blue-700 hover:text-blue-500"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFoodEatingInst(instruction.fei_id)} // Updated function
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
                                <h2 className="text-2xl text-blue-700 font-semibold mb-4">{editingFoodInst ? 'Edit Food Eating Instruction' : 'Add Food Eating Instruction'}</h2>
                                {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
                                {/* Form Fields */}
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
                                
                                {/* Other form fields */}
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => {
                                            resetForm();
                                            setShowModal(false);
                                            setEditingFoodInst(false);
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleAddORUpdateFoodEatingInst}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        {editingFoodInst ? 'Update' : 'Add'}
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

export default FoodEatingInstruction;  
