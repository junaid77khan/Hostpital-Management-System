import React, { useState, useEffect, useRef } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import fetchData from '../utils/fetchData';
import Loader from '../components/Loader';

const MedicineDosesUnits = () => {
    const [dosesUnits, setDosesUnits] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [form, setForm] = useState({
        unit: '',
        du_id: ""
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [editingDosesUnit, setEditingDosesUnit] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const debounceTimeout = useRef(null);

    useEffect(() => {
        fetchDosesUnits();
    }, [page, limit, debouncedSearch]);

    const fetchDosesUnits = async () => {
        setLoading(true);
        try {
            const result = await fetchData({
                API_URL: 'Medicines/Get_Medicine_Doses_Units.php',
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setDosesUnits(result.doses_units || []);
                setTotalPages(result.pages); 
            }
        } catch (err) {
            setError('Failed to fetch doses units');
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

    const openModal = (dosesUnit = null) => {
        if (dosesUnit) {
            setEditingDosesUnit(true);
            setForm(dosesUnit); // Populate form with selected data
        } else {
            setEditingDosesUnit(false);
            resetForm(); // Clear the form for adding a new doses unit
        }
        setShowModal(true);
    };
    
    const closeModal = () => {
        resetForm(); 
        setEditingDosesUnit(false); 
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

    const handleAddOrUpdateDosesUnit = async () => {
        setLoading(true);
        try {
            if(editingDosesUnit) {
                const data = {
                    du_id: form.du_id,
                    unit: form.unit,
                    limit,
                    page
                };
                
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Medicines/update_medicine_doses_unit.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
              
                const result = await response.json();
              
                if (response.ok) {
                    setDosesUnits(result.updated_units);
                    setShowModal(false);
                    setEditingDosesUnit(false);
                    resetForm();
                } else {
                    throw new Error(result.error || 'Unknown error occurred');
                }
            } else {
                const data = {
                    unit: form.unit,
                    limit,
                    page
                };
                
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Medicines/add_medicine_doses_unit.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
              
                const result = await response.json();
              
                if (response.ok) {
                    setDosesUnits(result.updated_units);
                    setShowModal(false);
                    resetForm();
                } else {
                    throw new Error(result.error || 'Unknown error occurred');
                }
            }
        } catch (err) {
            setError('Failed to process doses unit');
        } finally {
            setLoading(false);
            setEditingDosesUnit(false);
        }
    };

    const handleDeleteDosesUnit = async (dosesUnitId) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Medicines/delete_medicine_doses_unit.php?du_id=${dosesUnitId}&limit=${limit}&page=${page}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                } 
            });
          
            const result = await response.json();
          
            if (response.ok) {
                setDosesUnits(result.updated_units)
            } else {
                throw new Error(result.error || 'Unknown error occurred');
            }
        } catch (err) {
            setError('Failed to delete doses unit');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ unit: '', du_id: '' });
    };    

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold mb-4">Medicine Doses Units List</h2>
                        <button
                            onClick={() => openModal()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                        >
                            Add Doses Unit
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
                        ) : dosesUnits.length === 0 ? (
                            <p className="text-xl font-semibold text-center">No Doses Units Added</p>
                        ) : error ? (
                            <p className="text-red-500 mb-4">{error}</p>
                        ): (
                            <table className="min-w-full table-auto">
                                <thead className="bg-indigo-600 text-white">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Unit</th>
                                        <th className="px-4 py-2 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dosesUnits.map((unit) => (
                                        <tr key={unit.du_id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{unit.unit}</td>
                                            <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => openModal(unit)} 
                                                    className="text-blue-700 hover:text-blue-500"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDosesUnit(unit.du_id)}
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
                                <h2 className="text-2xl text-blue-700 font-semibold mb-4">
                                    {editingDosesUnit ? 'Edit Doses Unit' : 'Add Doses Unit'}
                                </h2>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Unit</label>
                                    <input
                                        type="text"
                                        name="unit"
                                        value={form.unit}
                                        onChange={handleChange}
                                        className="border px-4 py-2 rounded-md w-full"
                                        placeholder="e.g. mg, ml, tablets"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddOrUpdateDosesUnit}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        {editingDosesUnit ? 'Update' : 'Add'}
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

export default MedicineDosesUnits;