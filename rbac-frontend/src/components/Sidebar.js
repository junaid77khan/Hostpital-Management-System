import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import ChecklistIcon from '@mui/icons-material/Checklist'; 
import { Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import WebIcon from '@mui/icons-material/Web';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Tooltip } from '@mui/material';
import { FiberManualRecord, ArrowForward, ScaleOutlined } from '@mui/icons-material';
import { FaHospital } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const sidebarRef = useRef(null);
    const location = useLocation();
    const[path, setPath] = useState(location.pathname);


    useEffect(() => {
        setPath(location.pathname)
    }, [])

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    useEffect(() => {
        const appointmentPaths = ["today", "all"];
        const settingPaths = [
            "medicines", 
            "medicine-eating-instruction", 
            "food-eating-instruction", 
            "next-suggestion", 
            "medicine-type", 
            "examination", 
            "add-pre-template"
        ];
        const hintsPaths = ["hints"];
    
        if (appointmentPaths.some(p => path.includes(p))) {
            setOpenSection("appointments");
        } else if (settingPaths.some(p => path.includes(p))) {
            setOpenSection("setting");
        } else if (hintsPaths.some(p => path.includes(p))) {
            setOpenSection("hints");
        }
    }, [path]);    

    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div>
            <button
                className={`fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 md:hidden ${isOpen ? 'hidden' : 'block'}`}
                onClick={toggleSidebar}
            >
                ☰
            </button>

            <div
                ref={sidebarRef}
                className={`absolute top-0 left-0 h-full min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-64 z-40`}
            >
                <button
                    className="absolute top-4 right-4 px-3 py-2 bg-green-500 text-white rounded-full shadow-lg md:hidden focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={toggleSidebar}
                >
                    ✕
                </button>
                <div className="p-6 text-center border-b border-blue-600">
                    <h1 className="text-xl font-bold tracking-wider">Menu</h1>
                    <span className="inline-flex items-center">
                        <FaHospital className="p-2 rounded-full" size={50} color="white" />
                        <span className="ml-2 text-xl">{process.env.REACT_APP_HOSPITAL_NAME}</span>
                    </span>
                </div>
                <h1 className='px-4 font-bold mt-1'>GENERAL</h1>
                <ul className="mt-4 space-y-1">
                        <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path == '/' ? 'text-gray-400': 'text-white'}`}>
                            <Link to="/admin/doctor_panel" className="flex items-center gap-4">
                                <DashboardIcon /> Dashboard
                            </Link>
                        </li>
                        <li
                            className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2`}
                            onClick={() => handleSectionToggle('appointments')}
                        >
                            <div className="flex items-center gap-4 cursor-pointer">
                                <EventIcon /> Appointments
                            </div>
                        </li>
                    <div
                        className={`pl-6 space-y-1 transition-all duration-300 ${openSection === 'appointments' ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                    >
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('today') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/appointments/today" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Todays Appointment</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('all') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/appointments/all" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">All Appointments</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('online-patient-appointments') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/online-patient-appointments" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Online Patients Appointments</Typography> 
                                    </Box>
                                </Link>
                            </li>
                    </div>
                        <li
                            className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2`}
                            onClick={() => handleSectionToggle('setting')}
                        >
                            <div className="flex items-center gap-4 cursor-pointer">
                                <SettingsIcon /> Setting
                            </div>
                        </li>
                    <div
                        className={`pl-6 space-y-1 transition-all duration-300 ${openSection === 'setting' ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                    >
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('units') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/units" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ScaleOutlined sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Dose Units</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('medicines') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/medicines" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Medicines</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('medicine-eating') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/medicine-eating-instructions" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Medicine Eating Instruction</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('food-eating') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/food-eating-instructions" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Food Eating Instruction</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('next-suggestion') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/next-suggestion" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Next Suggestion</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('medicine-type') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/medicine-type" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Medicine Type</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('examination') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/examination" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Examination</Typography> 
                                    </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('test') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/manage-test-list" className="flex items-center gap-4">
                                <Box display="flex" alignItems="center">
                                    <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                    <Typography variant="body1">Manage Test List</Typography> 
                                </Box>
                                </Link>
                            </li>
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('add-pre') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/settings/add-pre-template" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Add Pre Template</Typography> 
                                    </Box>
                                </Link>
                            </li>
                    </div>
                        <li
                            className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2`}
                            onClick={() => handleSectionToggle('patients')}
                        >
                            <div className="flex items-center gap-4 cursor-pointer">
                                <PersonIcon /> Patients
                            </div>
                        </li>
                    <div
                        className={`pl-6 space-y-1 transition-all duration-300 ${openSection === 'patients' ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                    >
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('patient-history') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/patients/history" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Patient History</Typography> 
                                    </Box>
                                </Link>
                            </li>
                    </div>
                        <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2`}
                            onClick={() => handleSectionToggle('hints')}
                        >
                            <div className="flex items-center gap-4 cursor-pointer">
                                <LocalPharmacyIcon /> Hints
                            </div>
                        </li>
                        <div
                            className={`pl-6 space-y-1 transition-all duration-300 ${openSection === 'hints' ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                        >
                                <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('manage-hints') ? 'text-gray-400': 'text-white'}`}>
                                    <Link to="/admin/doctor_panel/hints/manage-hints" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Manage Hints</Typography> 
                                    </Box>
                                    </Link>
                                </li>
                        </div>
                        <li
                            className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 `}
                            onClick={() => handleSectionToggle('websiteSetting')}
                        >
                            <div className="flex items-center gap-4 cursor-pointer">
                                <WebIcon /> Website Setting
                            </div>
                        </li>
                    <div
                        className={`pl-6 space-y-1 transition-all duration-300 ${openSection === 'websiteSetting' ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                    >
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('question-tree') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/website-setting/question-tree" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Question Tree</Typography> 
                                    </Box>
                                </Link>
                            </li>
                    </div>
                </ul>

                <h1 className='px-4 font-bold mt-4 text-xl'>LIVE ON</h1>
                <ul className="mt-4 space-y-1">
                        <li
                            className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 `}
                            onClick={() => handleSectionToggle('profile')}
                        >
                            <div className="flex items-center gap-4 cursor-pointer">
                                <AccountCircleIcon /> Profile
                            </div>
                        </li>
                    <div
                        className={`pl-6 space-y-1 transition-all duration-300 ${openSection === 'profile' ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                    >
                            <li className={`p-1 hover:bg-blue-800 transition-colors rounded-lg mx-2 ${path.includes('change-password') ? 'text-gray-400': 'text-white'}`}>
                                <Link to="/admin/doctor_panel/profile/change-password" className="flex items-center gap-4">
                                    <Box display="flex" alignItems="center">
                                        <ChecklistIcon sx={{ fontSize: 14, marginRight: 1 }} /> 
                                        <Typography variant="body1">Change Password</Typography> 
                                    </Box>
                                </Link>
                            </li>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
