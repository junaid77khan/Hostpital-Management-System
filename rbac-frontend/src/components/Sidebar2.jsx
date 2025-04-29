import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { 
  Hospital,
  X,
  AlignJustify,
  LayoutDashboard,
  Calendar,
  Settings,
  User,
  Pill,
  Globe,
  CircleUser,
  ChevronRight,
  ChevronDown,
  Scale,
  ClipboardCheck
} from 'lucide-react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const sidebarRef = useRef(null);
    const location = useLocation();
    const [path, setPath] = useState(location.pathname);

    useEffect(() => {
        setPath(location.pathname);
    }, [location]);

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
        const patientPaths = ["patient"];
        const profilePaths = ["profile"];
        const websitePaths = ["website"];
    
        if (appointmentPaths.some(p => path.includes(p))) {
            setOpenSection("appointments");
        } else if (settingPaths.some(p => path.includes(p))) {
            setOpenSection("setting");
        } else if (hintsPaths.some(p => path.includes(p))) {
            setOpenSection("hints");
        } else if (patientPaths.some(p => path.includes(p))) {
            setOpenSection("patients");
        } else if (profilePaths.some(p => path.includes(p))) {
            setOpenSection("profile");
        } else if (websitePaths.some(p => path.includes(p))) {
            setOpenSection("websiteSetting");
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

    // Menu item component for better consistency
    const MenuItem = ({ to, icon: Icon, label, active, onClick, children }) => {
        const isActive = path.includes(to) || active;
        
        return (
            <li className={`rounded-lg transition-all duration-200 ${isActive ? 'bg-teal-700 text-white' : 'text-teal-100 hover:bg-teal-700/50'}`}>
                <div 
                    className={`flex items-center justify-between py-2 px-3 cursor-pointer`}
                    onClick={onClick}
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5" />}
                        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                    </div>
                    {children && (
                        openSection === to ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                    )}
                </div>
            </li>
        );
    };

    // Submenu item component
    const SubMenuItem = ({ to, label }) => {
        const isActive = path.includes(to);
        
        return (
            <li>
                <Link 
                    to={to} 
                    className={`flex items-center py-2 pl-10 pr-3 text-sm ${isActive ? 'text-white bg-teal-700/70' : 'text-teal-100 hover:bg-teal-700/30'} rounded-lg transition-all duration-200`}
                >
                    <span className="text-xs">{label}</span>
                </Link>
            </li>
        );
    };

    return (
        <div>
            {/* Mobile Toggle Button */}
            <button
                className={`fixed top-4 left-4 z-50 p-2 bg-teal-600 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 md:hidden ${isOpen ? 'hidden' : 'block'}`}
                onClick={toggleSidebar}
                aria-label="Open sidebar"
            >
                <AlignJustify className="w-5 h-5" />
            </button>

            {/* Sidebar Container */}
            <div
                ref={sidebarRef}
                className={`absolute top-0 left-0 h-full min-h-screen bg-gradient-to-b from-teal-800 to-teal-900 text-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-64 z-40`}
            >
                {/* Close Button for Mobile */}
                <button
                    className="absolute top-4 right-4 p-1 bg-teal-700 text-white rounded-full shadow-lg md:hidden focus:outline-none hover:bg-teal-600 transition-colors"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="p-4 border-b border-teal-700/50">
                    <div className="flex items-center justify-center mb-2">
                        <Hospital className="w-7 h-7 text-teal-300" />
                        <span className="ml-2 text-lg font-semibold text-white">
                            {process.env.REACT_APP_HOSPITAL_NAME || "Medical Center"}
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="px-3 py-2">
                    <div className="mb-1">
                        <h3 className="text-xs font-bold uppercase text-teal-300 px-3 py-2">General</h3>
                        <ul className="space-y-1">
                            {/* Dashboard */}
                            <li className={`rounded-lg transition-all duration-200 ${path === '/admin/doctor_panel' ? 'bg-teal-700 text-white' : 'text-teal-100 hover:bg-teal-700/50'}`}>
                                <Link to="/admin/doctor_panel" className="flex items-center gap-3 py-2 px-3">
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span className="text-sm font-medium">Dashboard</span>
                                </Link>
                            </li>

                            {/* Appointments Section */}
                            <MenuItem 
                                to="appointments" 
                                icon={Calendar} 
                                label="Appointments" 
                                onClick={() => handleSectionToggle('appointments')} 
                                active={openSection === 'appointments'}
                                children={true}
                            />
                            
                            {/* Appointments Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'appointments' ? 'max-h-40' : 'max-h-0'}`}>
                                <ul className="py-1 space-y-1">
                                    <SubMenuItem to="/admin/doctor_panel/appointments/today" label="Today's Appointments" />
                                    <SubMenuItem to="/admin/doctor_panel/appointments/all" label="All Appointments" />
                                    <SubMenuItem to="/admin/doctor_panel/online-patient-appointments" label="Online Appointments" />
                                </ul>
                            </div>

                            {/* Settings Section */}
                            <MenuItem 
                                to="setting" 
                                icon={Settings} 
                                label="Settings" 
                                onClick={() => handleSectionToggle('setting')} 
                                active={openSection === 'setting'}
                                children={true}
                            />
                            
                            {/* Settings Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'setting' ? 'max-h-96' : 'max-h-0'}`}>
                                <ul className="py-1 space-y-1">
                                    <SubMenuItem to="/admin/doctor_panel/settings/units" label="Dose Units" />
                                    <SubMenuItem to="/admin/doctor_panel/settings/medicines" label="Medicines" />
                                    <SubMenuItem to="/admin/doctor_panel/settings/medicine-eating-instructions" label="Medicine Instructions" />
                                    <SubMenuItem to="/admin/doctor_panel/settings/food-eating-instructions" label="Food Instructions" />
                                    <SubMenuItem to="/admin/doctor_panel/settings/next-suggestion" label="Next Suggestion" />
                                    <SubMenuItem to="/admin/doctor_panel/settings/medicine-type" label="Medicine Type" />
                                    <SubMenuItem to="/admin/doctor_panel/settings/examination" label="Examination" />
                                    <SubMenuItem to="/admin/doctor_panel/settings/manage-test-list" label="Manage Test List" />
                                    <SubMenuItem to="/admin/doctor_panel/settings/add-pre-template" label="Add Pre Template" />
                                </ul>
                            </div>

                            {/* Patients Section */}
                            <MenuItem 
                                to="patients" 
                                icon={User} 
                                label="Patients" 
                                onClick={() => handleSectionToggle('patients')} 
                                active={openSection === 'patients'}
                                children={true}
                            />
                            
                            {/* Patients Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'patients' ? 'max-h-20' : 'max-h-0'}`}>
                                <ul className="py-1 space-y-1">
                                    <SubMenuItem to="/admin/doctor_panel/patients/history" label="Patient History" />
                                </ul>
                            </div>

                            {/* Hints Section */}
                            <MenuItem 
                                to="hints" 
                                icon={Pill} 
                                label="Hints" 
                                onClick={() => handleSectionToggle('hints')} 
                                active={openSection === 'hints'}
                                children={true}
                            />
                            
                            {/* Hints Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'hints' ? 'max-h-20' : 'max-h-0'}`}>
                                <ul className="py-1 space-y-1">
                                    <SubMenuItem to="/admin/doctor_panel/hints/manage-hints" label="Manage Hints" />
                                </ul>
                            </div>

                            {/* Website Settings Section */}
                            <MenuItem 
                                to="websiteSetting" 
                                icon={Globe} 
                                label="Website Setting" 
                                onClick={() => handleSectionToggle('websiteSetting')} 
                                active={openSection === 'websiteSetting'}
                                children={true}
                            />
                            
                            {/* Website Settings Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'websiteSetting' ? 'max-h-20' : 'max-h-0'}`}>
                                <ul className="py-1 space-y-1">
                                    <SubMenuItem to="/admin/doctor_panel/website-setting/question-tree" label="Question Tree" />
                                </ul>
                            </div>
                        </ul>
                    </div>

                    {/* Live On Section */}
                    <div className="mt-6">
                        <h3 className="text-xs font-bold uppercase text-teal-300 px-3 py-2">Live On</h3>
                        <ul className="space-y-1">
                            {/* Profile Section */}
                            <MenuItem 
                                to="profile" 
                                icon={CircleUser} 
                                label="Profile" 
                                onClick={() => handleSectionToggle('profile')} 
                                active={openSection === 'profile'}
                                children={true}
                            />
                            
                            {/* Profile Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'profile' ? 'max-h-20' : 'max-h-0'}`}>
                                <ul className="py-1 space-y-1">
                                    <SubMenuItem to="/admin/doctor_panel/profile/change-password" label="Change Password" />
                                </ul>
                            </div>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 mt-6 border-t border-teal-700/50 text-xs text-center text-teal-300">
                    © {new Date().getFullYear()} Hospital Management
                </div>
            </div>
        </div>
    );
};

export default Sidebar;