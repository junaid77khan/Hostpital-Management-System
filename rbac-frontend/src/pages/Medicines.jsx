import React, { useState, useEffect, useRef } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import fetchData from '../utils/fetchData';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [types, setTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [form, setForm] = useState({
        m_id: '',
        name: '',
        type: '',
        eat_instructions: '',
        dose: '',
        description: '',
        duration: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [editingMedicine, setEditingMedicine] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const[medicineEatingInstructions, setMedicineEatingInstructions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const debounceTimeout = useRef(null);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchMedicines(),
                    fetchMedicineTypes(),
                    fetchMedicineEatingInstructions()
                ]);
            } catch (error) {
                console.error('Error initializing data:', error);
            } finally {
                console.log("Total pages - ", totalPages);
                
                setLoading(false);
            }
        };

        initializeData();
    }, [page, limit, debouncedSearch]);

    const fetchMedicines = async () => {
        try {
            const result = await fetchData({
                API_URL: 'Medicines/get_medicines.php',
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setMedicines(result.medicines || []);                
                setTotalPages(result.pages);                 
            }
        } catch (err) {
            setError('Failed to fetch medicines data');
        }
    };

    const fetchMedicineEatingInstructions = async () => {
        try {
            const result = await fetchData({
                API_URL: 'Medicines/Medicine_Eating_Instructions.php'
            });

            if (result.error) {
                setError(result.error);
            } else {
                setMedicineEatingInstructions(result.medicine_eating_instructions || []); 
            }
        } catch (err) {
            setError('Failed to fetch medicine eating instructions data');
        }
    };

    const fetchMedicineTypes = async () => {
        try {
            const result = await fetchData({
                API_URL: 'Medicines/Get_Medicine_Type_Names.php'
            });

            if (result.error) {
                setError(result.error);
            } else {
                setTypes((result.medicine_type_names || []));
            }
        } catch (err) {
            setError('Failed to fetch medicine types');
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
        // console.log("render Pages ", totalPages);
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

    

    const handleAddOrUpdateMedicine = async () => {
        setLoading(true);
        
        try {
            
            if(editingMedicine) {
                const data = {
                    m_id: form.m_id,
                    name: form.name,
                    description: form.description,
                    type: form.type,
                    medicine_eating: form.eat_instructions,
                    dose: form.dose,
                };
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Medicines/update_medicine.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
              
                  const result = await response.json();
              
                  if (response.ok) {
                      fetchMedicines();
                      setShowModal(false);
                      setEditingMedicine(false);
                      resetForm();
                  } else {
                      throw new Error(result.error || 'Unknown error occurred');
                  }
            } else {
                const data = {
                    name: form.name,
                    description: form.description,
                    type: form.type,
                    medicine_eating: form.eat_instructions,
                    dose: form.dose,
                };
                
                const response = await fetch(`${process.env.REACT_APP_API_URL}/Medicines/add_medicine.php`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });
              
                  const result = await response.json();
              
                  if (response.ok) {
                      fetchMedicines();
                      setShowModal(false);
                      resetForm();
                  } else {
                      throw new Error(result.error || 'Unknown error occurred');
                  }
            }
        } catch (err) {
            setError('Failed to add medicine');
        } finally {
            setLoading(false);
        }
    };

    const handleEditMedicine = (medicine) => {
        
        setEditingMedicine(true);
        setForm({ ...medicine });
        setShowModal(true);
    };

    const handleDeleteMedicine = async (medicineId) => {
        setLoading(true);
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Medicines/delete_medicine.php?m_id=${medicineId}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                } 
              });
          
              const result = await response.json();
          
              if (response.ok) {
                  fetchMedicines();
              } else {
                  throw new Error(result.error || 'Unknown error occurred');
              }
            setShowModal(false);
        } catch (err) {
            setError('Failed to delete medicine');
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
                        <h2 className="text-2xl font-semibold mb-4">Medicines List</h2>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                        >
                            Add Medicine
                        </button>
                    </div>
                    {/* <ExportOptions /> */}
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
                        ) : medicines.length === 0 ? (
                            <p className="text-xl font-semibold text-center">No Medicines Added</p>
                        ) : (
                                    <table className="min-w-full table-auto">
                                        <thead className="bg-indigo-600 text-white">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Name</th>
                                                <th className="px-4 py-2 font-medium">Description</th>
                                                <th className="px-4 py-2 font-medium">Type</th>
                                                <th className="px-4 py-2 font-medium">Dose (Kg)</th>
                                                <th className="px-4 py-2 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {medicines.map((medicine, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="border px-4 py-2">{medicine.name}</td>
                                                    <td className="border px-4 py-2">{medicine.description}</td>
                                                    <td className="border px-4 py-2">{medicine.type}</td>
                                                    <td className="border px-4 py-2">{medicine.dose}</td>
                                                    <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleEditMedicine(medicine)}
                                                            className="text-blue-700 hover:text-blue-500"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMedicine(medicine.m_id)}
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
                                    {editingMedicine ? 'Edit Medicine' : 'Add Medicine'}
                                </h2>
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
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Type</label>
                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        className="border px-4 py-2 rounded-md w-full"
                                    >
                                        <option value="">Select Type</option>
                                        {types.map((type, idx) => (
                                            <option key={idx} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Eating Instruction</label>
                                    <select
                                        name="eat_instructions"
                                        value={form.eat_instructions}
                                        onChange={handleChange}
                                        className="border px-4 py-2 rounded-md w-full"
                                    >
                                        <option value="">Select Eating Instruction</option>
                                        {medicineEatingInstructions.map((inst, idx) => (
                                            <option key={idx} value={inst.name}>
                                                {inst.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Dose / Kg</label>
                                    <input
                                        type="text"
                                        name="dose"
                                        value={form.dose}
                                        onChange={handleChange}
                                        className="border px-4 py-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="border px-4 py-2 rounded-md w-full"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => {
                                            resetForm();
                                            setEditingMedicine(false);
                                            setShowModal(false);
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleAddOrUpdateMedicine}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        {editingMedicine ? 'Update' : 'Add'}
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

export default Medicines;
