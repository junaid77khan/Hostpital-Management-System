import React, { useEffect, useState } from "react";
import fetchData from "../utils/fetchData";
import { useNavigate } from "react-router-dom";

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
      })
    }
    } catch {
      setError('Failed to fetch report image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6 w-full mx-auto">
      {loading ? (
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-24 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-gray-700 border-b pb-3">Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {error && <p className="text-red-500 col-span-2">{error}</p>}
            <div>
              <span className="font-medium text-gray-600">App. ID:</span>
              <span className="block text-gray-800">{appointment_details?.p_id || "N/A"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <span className="block text-gray-800">{appointment_details.name || "N/A"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">D.O.B:</span>
              <span className="block text-gray-800">
                {patientDetails.dob || "N/A"} (Age: {age})
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Mobile:</span>
              <span className="block text-gray-800">{patientDetails.mobile || "N/A"}</span>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-600">Vitals:</span>
              <span className="block text-gray-800">
                BP-{appointment_details.blood_pressure}/{appointment_details.blood_pressure_low}mmHg |
                Temp.-{appointment_details.temprature}°F | HR.-{appointment_details.heart_rate}/Min |
                SPO2-{appointment_details.spo2}% | Ht-{appointment_details.height}/{appointment_details.height_e}cm |
                Wt-{appointment_details.weight}/{appointment_details.weight_expect}kg | BMI-20.66 (Normal built)
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Deworming:</span>
              <span className="block text-gray-800">{appointment_details.deworming || "N/A"}</span>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-600">Last 3 Appointments:</span>
              <div className="flex flex-wrap space-x-2 mt-2">
                {lastAppo.length === 0 ? (
                  <div className="text-gray-500">No Appointments</div>
                ) : (
                  lastAppo.map((data) => (
                    <div key={data.af_id} className="mb-4">
                      <button
                        onClick={() => handleLastAppointments(data.af_id, data.date)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                      >
                        {data.date}
                      </button>
                    </div>
                  ))
                )}
              </div>
              {selectedAppointmentImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Report Image</h4>
                    <img
                      src={selectedAppointmentImage}
                      alt="Selected Report"
                      className="rounded-lg shadow-md object-contain w-full max-h-96"
                    />
                    <div className="flex justify-end space-x-4 mt-4">
                      <button
                        onClick={() => setSelectedAppointmentImage(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-red-300"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientDetail;
