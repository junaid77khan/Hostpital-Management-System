import React, { useState, useEffect, useRef } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Loader from '../components/Loader';
import fetchData from '../utils/fetchData';

const Examination = () => {
    const [examinations, setExaminations] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [form, setForm] = useState({
        name: '',
        e_id: ''
    });
    const [optionForm, setOptionForm] = useState({
        e_id: '',
        optionName: '',
        eo_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showOptionModal, setShowOptionModal] = useState(false); // For option modal
    const [error, setError] = useState('');
    const [editingExamination, setEditingExamination] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [isOptionEditing, setIsOptionEditing] = useState(false); 

    const debounceTimeout = useRef(null);

    useEffect(() => {
        fetchExaminations();
    }, [page, limit, debouncedSearch]);

    const resetForm = () => {
                setForm({ name: '' });
            };

            const handleEditOption = (e_id, eo_id) => {
                const examination = examinations.find((exam) => exam.e_id === e_id);
                const option = examination.options.find((opt) => opt.eo_id === eo_id);
                
                setOptionForm({ e_id, optionName: option.name, eo_id });
                setIsOptionEditing(true); // We're editing an existing option
                setShowOptionModal(true);
            };
            
            
    const handleDeleteOption =async (eo_id) => {
        setLoading(true);
        try {
            const data = {
                "eo_id": eo_id
            }
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/examination/delete_examination_option.php`,
                { 
                    method: "POST",
                    body: JSON.stringify(data)
                }
            );

            if(response.error) console.log(response.error);

            fetchExaminations();
        } catch (err) {
            setError('Failed to delete examination option');
        } finally {
            setLoading(false);
        }
    }

    const fetchExaminations = async () => {
        setLoading(true);
        try {
            const result = await fetchData({
                API_URL: 'examination.php',
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (result.error) {
                setError(result.error);
            } else {
                console.log(result);
                
                setExaminations(result.examinations || []);
                setTotalPages(result.totalPages);
            }
        } catch (err) {
            setError('Failed to fetch examination data');
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
                    className={`px-4 py-2 ${i === page ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded-md`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const handleAddORUpdateExamination = async () => {
        setLoading(true);
        setEditingExamination(false);
        try {
            if (editingExamination) {
                const data = {
                    e_id: form.e_id,
                    name: form.name,
                    limit, 
                    page
                };
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/examination/update_examination.php`,
                    {
                        method: "POST",
                        body: JSON.stringify(data)
                    }
                );

                // setExaminations(response.data.updated_examinations);
                if(response.ok) {
                    console.log("Fetching");
                    
                    fetchExaminations();
                    setShowModal(false);
                    setEditingExamination(false);
                    resetForm();
                } else {
                    console.log(response.error);
                    
                }
            } else {
                const data = { name: form.name, limit, page };
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/examination/add_examination.php`,
                    data
                );

                fetchExaminations();
                setShowModal(false);
                resetForm();
            }
        } catch (err) {
            setError('Failed to add or update examination');
        } finally {
            setLoading(false);
        }
    };

    const handleEditExamination = (examination) => {
        setEditingExamination(true);
        setForm({ ...examination });
        setShowModal(true);
    };

    const handleDeleteExamination = async (examinationId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/examination/delete_examination.php?limit=${limit}&page=${page}`,
                { params: { e_id: examinationId } }
            );

            // setExaminations(response.data.updated_examinations);
            fetchExaminations();
        } catch (err) {
            setError('Failed to delete examination');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOption = (e_id) => {
        setOptionForm({ e_id, optionName: '' });
        setShowOptionModal(true);
    };

    const handleAddORUpdateOptionApi = async () => {
        setLoading(true);
        try {
            const data = {
                e_id: optionForm.e_id,
                name: optionForm.optionName,
            };
    
            let response;
            if (isOptionEditing) {
                data.eo_id = optionForm.eo_id;
                console.log(data);
                
                response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/examination/update_examination_option.php`,
                    data
                );
            } else {
                // If we're adding a new option
                response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/examination/add_examination_option.php`,
                    data
                );
            }
    
            fetchExaminations(); // Fetch updated examination list with new/updated options
            setShowOptionModal(false); // Close the modal
            setOptionForm({ e_id: '', optionName: '' }); // Reset the form
            setIsOptionEditing(false); // Reset the editing flag
        } catch (err) {
            setError('Failed to add or update option');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold mb-4">Examinations List</h2>
                        <button
                            onClick={openModal}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                        >
                            Add Examination
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
                                className="border px-4 py-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        {loading ? (
                            <Loader />
                        ) : examinations.length === 0 ? (
                            <p className="text-xl font-semibold text-center text-gray-500">No Examinations Added</p>
                        ) : (
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-indigo-600 text-white">
                                    <tr>
                                        <th className="border px-4 py-2 text-left font-medium">Name</th>
                                        <th className="border px-4 py-2 text-left font-medium">Options</th>
                                        <th className="border px-4 py-2 text-center font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examinations.map((examination) => (
                                        <tr key={examination.fei_id} className="hover:bg-gray-100">
                                            <td className="border px-4 py-3 font-medium text-gray-800">{examination.name}</td>
                                            <td className="border px-4 py-3">
                                            <div className="space-y-2">
                                                {examination?.options?.length > 0 ? (
                                                    examination.options.map((option) => (
                                                        <div
                                                            key={option.id}
                                                            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md shadow"
                                                        >
                                                            <span className="text-gray-700 font-medium">{option.option_name}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => handleEditOption(examination.e_id, option.eo_id)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteOption(option.eo_id)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm italic">No option added</p>
                                                )}
                                                <button
                                                    onClick={() => handleAddOption(examination.e_id)}
                                                    className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none"
                                                >
                                                    Add Option
                                                </button>
                                            </div>

                                            </td>
                                            <td className="border px-4 py-3 flex items-center justify-center space-x-4">
                                                <button
                                                    onClick={() => handleEditExamination(examination)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExamination(examination.e_id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="mt-6 flex justify-center gap-2 items-center">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    page === 1
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <div className="flex space-x-1">{renderPageNumbers()}</div>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    page === totalPages
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
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
                                <h2 className="text-2xl text-blue-700 font-semibold mb-4">{editingExamination ? 'Edit Examination' : 'Add Examination'}</h2>
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
                                            setEditingExamination(false);
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleAddORUpdateExamination}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        {editingExamination ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        {/* Option Modal */}
                        {showOptionModal && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-6 rounded-lg w-96">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        {isOptionEditing 
                                            ? `Edit Option for: ${examinations.find((ex) => ex.e_id === optionForm.e_id)?.name}` 
                                            : `Add Option for: ${examinations.find((ex) => ex.e_id === optionForm.e_id)?.name}`}
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block text-lg font-medium">Option Name</label>
                                        <input
                                            type="text"
                                            name="optionName"
                                            value={optionForm.optionName}
                                            onChange={(e) => setOptionForm({ ...optionForm, optionName: e.target.value })}
                                            className="border px-4 py-2 rounded-md w-full"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setShowOptionModal(false)}
                                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={handleAddORUpdateOptionApi}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            {isOptionEditing ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Examination;
