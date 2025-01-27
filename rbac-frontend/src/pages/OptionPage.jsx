import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const OptionsPage = () => {
    const [options, setOptions] = useState([]);
    const [examination, setExamination] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ id: null, name: '' });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    useEffect(() => {
            const fetchOptions = async () => {
                setLoading(true);
                try {
                    const dummyExaminations = [
                        { id: 1, name: 'Blood Test', options: ['Fasting Required', 'Report in 2 Days'] },
                        { id: 2, name: 'Urine Test', options: [] },
                        { id: 3, name: 'X-Ray', options: ['Wear Loose Clothes'] },
                    ];
            
                    dummyExaminations.forEach((exam) => {
                        console.log(typeof exam.id, ' & ', typeof id);
                        
                        if (exam.id.toString() === id) {
                            setExamination(exam.name);
                            console.log(exam.options);
                            
                            setOptions(exam.options);
                        }
                    });
                } catch (err) {
                    setError('Failed to fetch examinations');
                } finally {
                    setLoading(false);
                }
            };
    
            fetchOptions();
        }, []);

    const handleAddOption = () => {
        setShowModal(true);
        setForm('');
        setEditing(false);
    };

    const handleEditOption = (option) => {
        setShowModal(true);
        setForm(option);
        setEditing(true);
    };

    const handleDeleteOption = (op) => {
        setOptions(options.filter((option) => option !== op));
    };

    const handleSubmit = () => {
        if (editing) {
            setOptions(
                options.map((option) =>
                    option.id === form.id ? { ...option, form } : option
                )
            );
        } else {
            setOptions([...options, form ]);
        }
        setShowModal(false);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {`${examination} Options`}
                            </h2>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate('/settings/examination')}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleAddOption}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add Option
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <table className="min-w-full table-auto">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Option Name</th>
                                    <th className="px-4 py-2 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {options.length > 0 ? (
                                options.map((option, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{option}</td>
                                        <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => handleEditOption(option)}
                                                className="text-blue-700 hover:text-blue-500"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOption(option)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="border px-4 py-2 text-center text-gray-500 italic"
                                    >
                                        No options available
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {showModal && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg w-96">
                                <h2 className="text-2xl text-blue-700 font-semibold mb-4">
                                    {editing ? 'Edit Option' : 'Add Option'}
                                </h2>
                                <div className="mb-4">
                                    <label className="block text-lg font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form}
                                        onChange={(e) => {
                                            setForm(e.target.value)
                                        }}
                                        className="border px-4 py-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        {editing ? 'Update' : 'Add'}
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

export default OptionsPage;
