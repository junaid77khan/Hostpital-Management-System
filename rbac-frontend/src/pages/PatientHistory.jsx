import React, { useState, useEffect, useRef } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import ExportOptions from '../components/ExportOptions';
import Loader from '../components/Loader';
import fetchData from '../utils/fetchData';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const PatientHistory = () => {
    const [patientHistories, setPatientHistories] = useState([]);
    const [types, setTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [form, setForm] = useState({
        name: '',
        type: '',
        description: '',
        duration: '',
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [editingPatientHistory, setEditingPatientHistory] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    const debounceTimeout = useRef(null);

    useEffect(() => {
        fetchPatientHistories();
    }, [page, limit, debouncedSearch]);

    const fetchPatientHistories = async () => {
        setLoading(true);
        try {
            const result = await fetchData({
                API_URL: 'Patient/patient-history.php',
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setPatientHistories(result.patients || []);
                setTotalPages(result.pages);
            }
        } catch (err) {
            setError('Failed to fetch patient history data');
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
                    className={`px-4 py-2 ${i === page ? 'bg-teal-500 text-white' : 'bg-gray-300'} rounded-md`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const handleEditPatientHistory = (patientHistory) => {
        navigate("/admin/doctor_panel/edit-patient-detail", {
            state: {
                "patient_detail": patientHistory
            }
        })
    };

    const handleDeletePatientHistory = async (patientHistoryId) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/delete_patient.php?p_id=${patientHistoryId}&page=${page}&limit=${limit}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                } 
              });
          
              const result = await response.json();
          
              if (response.ok) {
                  setPatientHistories(result.patient_history)
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

    const handleViewAppointment = async (p_id) => {
        // first fetch patient app. detail
        try {
            // setLoading(true);
            
          const response = await fetch(`${process.env.REACT_APP_API_URL}/Appointments/fetch_appointment.php?p_id=${p_id}`, {
              method: 'GET', 
              headers: {
                  'Content-Type': 'application/json',
              },
            });
        
            const result = await response.json();
            console.log(result);
            
        
            if (response.ok) {
              navigate("/admin/doctor_panel/precibsion", {
                state: {
                    "appointment_details": result.appointment
                }
              });
            } else {
                throw new Error(result.error || 'Unknown error occurred');
            }
          } catch (error) {
            console.log(error);
            
          }
    }

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold mb-4">Patient History List</h2>
                        {/* <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none"
                        >
                            Add Patient History
                        </button> */}
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
                                className="border px-4 py-2 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        {loading ? (
                            <Loader />
                        ) : patientHistories.length === 0 ? (
                            <p className="text-xl font-semibold text-center">No Patient Histories Found</p>
                        ) : (
                            <table className="min-w-full table-auto">
                                <thead className="bg-teal-500 text-white">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">P. Id</th>
                                        <th className="px-4 py-2 font-medium">Name</th>
                                        <th className="px-4 py-2 font-medium">Mobile</th>
                                        <th className="px-4 py-2 font-medium">A. Mobile</th>
                                        <th className="px-4 py-2 font-medium">Email</th>
                                        <th className="px-4 py-2 font-medium">Gender</th>
                                        <th className="px-4 py-2 font-medium">Address</th>
                                        <th className="px-4 py-2 font-medium">D.O.B</th>
                                        <th className="px-4 py-2 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientHistories.map((patientHistory, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{patientHistory.p_id}</td>
                                            <td className="border px-4 py-2">{patientHistory.name}</td>
                                            <td className="border px-4 py-2">{patientHistory.mobile}</td>
                                            <td className="border px-4 py-2">{patientHistory.alternate_mobile || 'N/A'}</td>
                                            <td className="border px-4 py-2">{patientHistory.email}</td>
                                            <td className="border px-4 py-2">{patientHistory.gender}</td>
                                            <td className="border px-4 py-2">{patientHistory.address || 'N/A'}</td>
                                            <td className="border px-4 py-2">{new Date(patientHistory.dob).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                                <Tooltip title="View Appointment" arrow>
                                                    <button
                                                        onClick={() => handleViewAppointment(patientHistory.p_id)}
                                                        className="text-teal-700 hover:text-teal-500"
                                                    >
                                                        <MenuIcon />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="Edit" arrow>
                                                <button
                                                    onClick={() => handleEditPatientHistory(patientHistory)}
                                                    className="text-teal-700 hover:text-teal-500"
                                                >
                                                    <EditIcon />
                                                </button>
                                                </Tooltip>
                                                <Tooltip title="Delete" arrow>
                                                <button
                                                    onClick={() => handleDeletePatientHistory(patientHistory.p_id)}
                                                    className="text-red-500 hover:text-red-400"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                                </Tooltip>
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
                </div>
            </div>
        </div>
    );
};

export default PatientHistory;
