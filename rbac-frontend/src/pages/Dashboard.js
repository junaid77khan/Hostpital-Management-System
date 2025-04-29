import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import fetchData from '../utils/fetchData';

const Dashboard = () => {
    const [totalPatients, setTotalPatients] = useState(0);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [totalMedicines, setTotalMedicines] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);
    const[error, setError] = useState('');

    useEffect(() => {
        const fetchTotalPatients = async () => {
            try {
                const result = await fetchData({
                    API_URL: 'Patient/total-patient.php'
                });
    
                if (result.error) {
                    setError(result.error);
                } else {
                    setTotalPatients(result.totalPatients);
                }
            } catch (error) {
                console.error('Error fetching total patients:', error);
            }
        };

        const fetchTotalAppointments = async () => {
            try {
                const result = await fetchData({
                    API_URL: 'Appointments/total_appointments.php'
                });
    
                if (result.error) {
                    setError(result.error);
                } else {
                    
                    setTotalAppointments(result.totalAppointments);
                }
            } catch (error) {
                console.error('Error fetching total appointments:', error);
            }
        };

        const fetchTotalMedicines = async () => {
            try {
                const result = await fetchData({
                    API_URL: 'Medicines/total_medicines.php'
                });
    
                if (result.error) {
                    setError(result.error);
                } else {
                    setTotalMedicines(result.totalMedicines);
                }
            } catch (error) {
                console.error('Error fetching total medicines:', error);
            }
        };

        fetchTotalPatients();
        fetchTotalAppointments();
        fetchTotalMedicines();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 bg-gray-50">
                <Navbar />
                <div className="p-6 md:px-12 lg:px-16">
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h2 className="text-3xl font-semibold text-teal-700">Welcome to the Sant Hospital Management System</h2>
                        <p className="text-gray-600 mt-2">
                            Effortlessly manage patient records, appointments, and staff operations. Streamline healthcare processes with our secure and user-friendly platform. 
                            <br />
                            Empowering healthcare professionals to deliver efficient and personalized care to every patient.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-teal-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                            <h3 className="text-xl font-semibold">Total Patients</h3>
                            <p className="text-3xl font-bold">{totalPatients}</p>
                        </div>
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                            <h3 className="text-xl font-semibold">Total Appointments</h3>
                            <p className="text-3xl font-bold">{totalAppointments}</p>
                        </div>
                        <div className="bg-orange-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                            <h3 className="text-xl font-semibold">Total Medicines</h3>
                            <p className="text-3xl font-bold">{totalMedicines}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
