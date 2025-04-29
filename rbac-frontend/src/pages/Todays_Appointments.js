import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Edit, Visibility, Delete } from '@mui/icons-material';
import ExportOptions from '../components/ExportOptions';
import fetchData from '../utils/fetchData';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const Todays_Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [deleteAppointmentId, setDeleteAppointmentId] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', description: '' });
    const [editing, setEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1); // Track total pages
    const token = localStorage.getItem('token');
    
    const debounceTimeout = useRef(null); // Ref to hold the timeout ID
    const navigate = useNavigate();
    useEffect(() => {
        fetchAppointments();
    }, [page, limit, debouncedSearch]); // Fetch data when page, limit, or debouncedSearch changes

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const result = await fetchData({
                API_URL: 'Appointments/GetTodaysAppointments.php',
                Page_Number: page,
                Limit: limit,
                Search_Term: debouncedSearch,
            });

            if (result.error) {
                setError(result.error);
            } else {
                setAppointments(result.appointments || []);
                setTotalPages(result.pages); // Assuming result.pages gives total pages
            }
        } catch (err) {
            setError('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current); // Clear the previous timeout
        }

        // Set the new timeout to wait 1 second before making the API call
        debounceTimeout.current = setTimeout(() => {
            setDebouncedSearch(value);
        }, 1000); // Wait 1 second before making the API call
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value, 10));
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleEdit = (data) => {
        navigate("/admin/doctor_panel/appointments/edit", {
            state: {
                "appointment": data
            }
        })
    };

    const handleView = (data) => {
        
        navigate("/admin/doctor_panel/precibsion/${data.af_id}", {
            state: {
              appointment_details: data,
            },
        })
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Appointments/delete_appointment.php?af_id=${deleteAppointmentId}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                } 
              });
          
              const result = await response.json();
          
              if (response.ok) {
                  fetchAppointments();
              } else {
                  throw new Error(result.error || 'Unknown error occurred');
              }
            setShowModal(false);
        } catch (err) {
            setError('Failed to delete appointment');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (appointment) => {
        setDeleteAppointmentId(appointment.af_id);
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

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Today's Appointments</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
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
                    
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    {loading ? (
                        <Loader />
                    ) : appointments.length === 0 ? (
                        <p className="text-xl font-semibold text-center">No Appointments</p>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Token</th>
                                    <th className="px-4 py-2 font-medium">Name</th>
                                    <th className="px-4 py-2 font-medium">Mobile</th>
                                    <th className="px-4 py-2 font-medium">Email</th>
                                    <th className="px-4 py-2 font-medium">Date</th>
                                    <th className="px-4 py-2 font-medium">Next Appo.</th>
                                    <th className="px-4 py-2 font-medium">Action</th>
                                    <th className="px-4 py-2 font-medium">Status/Bill</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{appointment.token_no}</td>
                                        <td className="border px-4 py-2">{appointment.name}</td>
                                        <td className="border px-4 py-2">{appointment.mobile}</td>
                                        <td className="border px-4 py-2">{appointment.email}</td>
                                        <td className="border px-4 py-2">{appointment.date}</td>
                                        <td className="border px-4 py-2">{appointment.next_appointment}</td>
                                        <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => handleView(appointment)}
                                                className='text-teal-700'
                                            >
                                                <Visibility />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(appointment)}
                                            >
                                                <Edit />
                                            </button>
                                            <button
                                                onClick={() => openModal(appointment)}
                                                className='text-red-500'
                                            >
                                                <Delete />
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2">{appointment.statusBill}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="mt-4 flex justify-center items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                page === 1 ? 'bg-gray-200 text-black cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400'
                            }`}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        {renderPageNumbers()}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                page === totalPages ? 'bg-gray-200 text-black cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400'
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
                        <h3 className="text-xl font-semibold">Are you sure you want to delete this appointment?</h3>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
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

export default Todays_Appointments;
