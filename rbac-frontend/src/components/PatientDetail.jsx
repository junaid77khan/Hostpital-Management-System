import React, { useEffect, useState } from "react";
import fetchData from "../utils/fetchData";
import { useNavigate } from "react-router-dom";
import { 
  UserCircle, 
  CalendarDays, 
  Phone, 
  Activity, 
  Clock, 
  Loader2,
  AlertCircle,
  BookOpen
} from "lucide-react";

const PatientDetail = ({ appointment_details }) => {
  const [patientDetails, setPatientDetails] = useState({});
  const [lastAppo, setLastAppo] = useState([]);
  const [age, setAge] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAppointmentImage, setSelectedAppointmentImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientData();
    fetchPatientLastAppo();
  }, []);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: `Appointments/fetch_patient_details.php?p_id=${appointment_details.p_id}`,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setPatientDetails(result.patient_details);
        const birthDate = new Date(result.patient_details.dob);
        const today = new Date();
        if (birthDate > today) return;

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        setAge(age > 0 ? age : 0);
      }
    } catch {
      setError('Failed to fetch patient data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientLastAppo = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: `Patient/fetch_patient_last_appointments.php?p_id=${appointment_details.p_id}&af_id=${appointment_details.af_id}`,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setLastAppo(result.appointments || []);
      }
    } catch {
      setError('Failed to fetch last appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleLastAppointments = async (af_id, date) => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: `Appointments/get_app_by_id.php?af_id=${af_id}&date=${date}`,
      });
      let appointment_details;
      if (result.error) {
        setError(result.error);
      } else {   
        appointment_details = result.appointment;
        navigate(`/admin/doctor_panel/precibsion/${appointment_details.af_id}`, {
          state: {
            appointment_details,
          },
        });
      }
    } catch {
      setError('Failed to fetch report image');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    
    // BMI formula: weight (kg) / (height (m) * height (m))
    const bmi = weight / (heightInMeters * heightInMeters);
    
    return bmi.toFixed(2);
  };
  

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto">
        <div className="flex items-center justify-center space-x-2 py-12">
          <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
          <span className="text-gray-600 font-medium">Loading patient information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full mx-auto">
      <div className="flex items-center border-b pb-4 mb-6">
        <BookOpen className="w-6 h-6 text-teal-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-700">Patient Details</h3>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        {/* Patient ID */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <UserCircle className="w-5 h-5 text-teal-500" />
          </div>
          <div className="ml-3">
            <span className="font-medium text-gray-600">Patient ID</span>
            <span className="block text-gray-800 font-semibold">{appointment_details?.p_id || "N/A"}</span>
          </div>
        </div>

        {/* Name */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <UserCircle className="w-5 h-5 text-teal-500" />
          </div>
          <div className="ml-3">
            <span className="font-medium text-gray-600">Name</span>
            <span className="block text-gray-800 font-semibold">{appointment_details.name || "N/A"}</span>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <CalendarDays className="w-5 h-5 text-teal-500" />
          </div>
          <div className="ml-3">
            <span className="font-medium text-gray-600">Date of Birth</span>
            <span className="block text-gray-800">
              {patientDetails.dob || "N/A"} <span className="text-teal-600 font-semibold">(Age: {age})</span>
            </span>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Phone className="w-5 h-5 text-teal-500" />
          </div>
          <div className="ml-3">
            <span className="font-medium text-gray-600">Mobile</span>
            <span className="block text-gray-800 font-semibold">{patientDetails.mobile || "N/A"}</span>
          </div>
        </div>

        {/* Vitals */}
        <div className="col-span-1 md:col-span-2 flex">
          <div className="flex-shrink-0 mt-1">
            <Activity className="w-5 h-5 text-teal-500" />
          </div>
          <div className="ml-3">
            <span className="font-medium text-gray-600">Vitals</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <div className="bg-gray-50 p-2 rounded-md">
                <span className="text-sm text-gray-600">BP:</span>
                <span className="ml-2 font-semibold text-gray-800">
                  {appointment_details.blood_pressure}/{appointment_details.blood_pressure_low} mmHg
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <span className="text-sm text-gray-600">Temp:</span>
                <span className="ml-2 font-semibold text-gray-800">
                  {appointment_details.temprature}°F
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <span className="text-sm text-gray-600">HR:</span>
                <span className="ml-2 font-semibold text-gray-800">
                  {appointment_details.heart_rate}/Min
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <span className="text-sm text-gray-600">SPO2:</span>
                <span className="ml-2 font-semibold text-gray-800">
                  {appointment_details.spo2}%
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <span className="text-sm text-gray-600">Height:</span>
                <span className="ml-2 font-semibold text-gray-800">
                  {appointment_details.height || "N/A"} cm
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <span className="text-sm text-gray-600">Weight:</span>
                <span className="ml-2 font-semibold text-gray-800">
                  {appointment_details.weight || "N/A"} kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BMI Calculation */}
        <div className="flex items-start col-span-1 md:col-span-2 mt-4">
          <div className="ml-3">
            <span className="font-medium text-gray-600">BMI</span>
            <span className="block text-gray-800">
              {calculateBMI(appointment_details.weight, appointment_details.height)
                ? `${calculateBMI(appointment_details.weight, appointment_details.height)} (Healthy)`
                : "BMI: Not available"}
            </span>
          </div>
        </div>

        {/* Last Appointments */}
        {lastAppo.length > 0 && (
          <div className="col-span-1 md:col-span-2 mt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <h3 className="text-xl font-semibold text-gray-700">Last Appointments</h3>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {lastAppo.map((appo) => (
                <div
                  key={appo.date}
                  className="bg-gray-100 p-4 rounded-lg shadow-md"
                  onClick={() => handleLastAppointments(appo.af_id, appo.date)}
                >
                  <span className="block text-lg text-gray-700">{appo.date}</span>
                  <span className="text-sm text-gray-600">{appo.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
