import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Edit, Visibility, Delete } from '@mui/icons-material';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import fetchData from '../utils/fetchData';

const Online_Patient_Appointments = () => {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [deletePatientId, setDeletePatientId] = useState('');
    const debounceTimeout = useRef(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, [page, limit, debouncedSearch]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                API_URL: 'Appointments/GetAllAppointments.php?op=y',
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (res.error) {
                setError(res.error);
            } else {
                const updatedPatients = res.appointments.map((patient) => {
                    const parsedProblem = JSON.parse(patient.problems || '[]')
                        .map(item => item.problem_name)  
                        .join(', '); 
                    
                    patient.problems = parsedProblem;
                    return patient;
                });
                
                setPatients(updatedPatients);
                setTotalPages(res.pages); 
            }
        } catch (err) {
            setError('Failed to fetch online patient appointments');
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

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Appointments/delete_appointment.php?af_id=${deletePatientId}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                } 
              });
            if (response.ok) {
                fetchPatients();
            } else {
                throw new Error(response.data.error || 'Unknown error occurred');
            }
            setDeletePatientId('');
        } catch (err) {
            setError('Failed to delete patient');
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    const closeModal = () => {
        setDeletePatientId('');
        setShowModal(false);
    }

    const handleEdit = (patient) => {
        navigate("/admin/doctor_panel/appointments/edit", {
            state: {
                "appointment": patient
            }
        })
    };

    const handleView = (patient) => {
        navigate("/admin/doctor_panel/precibsion/${patient.af_id}", {
            state: {
              appointment_details: patient,
            },
        })
    };

    const openModal = (patient) => {
        setDeletePatientId(patient.af_id);
        setShowModal(true);
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

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Online Patient Appointments</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
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
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    {loading ? (
                        <Loader />
                    ) : patients.length === 0 ? (
                        <p className="text-xl font-semibold text-center">No Online Patients</p>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Token</th>
                                    <th className="px-4 py-2 font-medium">Name</th>
                                    <th className="px-4 py-2 font-medium">Phone</th>
                                    <th className="px-4 py-2 font-medium">Email</th>
                                    <th className="px-4 py-2 font-medium">Problem</th>
                                    <th className="px-4 py-2 font-medium">Date</th>
                                    <th className="px-4 py-2 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{patient.token_no}</td>
                                        <td className="border px-4 py-2">{patient.name}</td>
                                        <td className="border px-4 py-2">{patient.mobile}</td>
                                        <td className="border px-4 py-2">{patient.email}</td>
                                        <td className="border px-4 py-2">{patient.problems}</td>
                                        <td className="border px-4 py-2">{patient.date}</td>
                                        <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => handleView(patient)}
                                                className="text-teal-700"
                                            >
                                                <Visibility />
                                            </button>
                                            <button onClick={() => handleEdit(patient)}>
                                                <Edit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    openModal(patient)
                                                }}
                                                className="text-red-500"
                                            >
                                                <Delete />
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
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                page === 1
                                    ? 'bg-gray-200 text-black cursor-not-allowed'
                                    : 'bg-teal-500 text-white hover:bg-teal-600'
                            }`}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        {renderPageNumbers()}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                page === totalPages
                                    ? 'bg-gray-200 text-black cursor-not-allowed'
                                    : 'bg-teal-500 text-white hover:bg-teal-600'
                            }`}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
                        <p className="text-gray-700 text-lg mb-4">
                            Deleting this appointment will remove it from the list. Are you sure you want to delete it?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Online_Patient_Appointments;
