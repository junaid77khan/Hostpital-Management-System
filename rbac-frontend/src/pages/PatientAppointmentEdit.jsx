import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Navigate, useLocation, useNavigate } from "react-router-dom";


const PatientAppointmentEdit = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    af_id: "",
    p_id: "",
    name: "",
    mobile: "",
    age: "",
    address: "",
    pincode: "",
    email: "",
    gender: "",
    blood_pressure: "",
    blood_pressure_low: "",
    weight: "",
    weight_expect: "",
    height: "",
    height_e: "",
    spo2: "",
    heart_rate: "",
    respiratory_rate: "",
    temprature: "",
    description: "",
    next_appointment_date: "",
  });
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(location.state.appointment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log(location.state);
  console.log(location.state.appointment);
  
  

  useEffect(() => {
    if (appointment) {
      setFormData({
        af_id: appointment.af_id || "",
        p_id: appointment.p_id || "",
        name: appointment.name || "",
        mobile: appointment.mobile || "",
        age: appointment.age || "",
        address: appointment.address || "",
        pincode: appointment.pincode || "",
        email: appointment.email || "",
        gender: appointment.gender || "",
        blood_pressure: appointment.blood_pressure || "",
        blood_pressure_low: appointment.blood_pressure_low || "",
        weight: appointment.weight || "",
        weight_expect: appointment.weight_expect || "",
        height: appointment.height || "",
        height_e: appointment.height_e || "",
        spo2: appointment.spo2 || "",
        heart_rate: appointment.heart_rate || "",
        respiratory_rate: appointment.respiratory_rate || "",
        temprature: appointment.temprature || "",
        description: appointment.description || "",
        next_appointment_date: appointment.next_appointment_date || "",
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = { 
        ...formData
      };

    const data2 = {
      "p_id": formData.p_id,
      "name": formData.name,
      "mobile": formData.mobile,
      "gender": formData.gender,
      "email": formData.email,
      "addreass": formData.address,
      "pincode": formData.pincode
    }

    const resp = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_detail.php`, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data2)
    });

    let result = await resp.json();

    if(resp.ok) {
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Appointments/appointform_update.php`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      result = await response.json();
  
      if (response.ok) {
        if(appointment.op) {
          navigate("/admin/doctor_panel/online-patient-appointments");
        } else {
          navigate("/admin/doctor_panel/appointments/all");
        }
      } else {
          throw new Error(result.error || 'Unknown error occurred');
      }
    } else {
      throw new Error(result.error || 'Unknown error occurred');
    }    
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Appointment Details</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Information */}
            <div className="border border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">General Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Full Name", name: "name", type: "text" },
                  { label: "Mobile Number", name: "mobile", type: "text" },
                  { label: "Age", name: "age", type: "text" },
                  { label: "Pincode", name: "pincode", type: "text" },
                  { label: "Email Address", name: "email", type: "email" },
                ].map((input) => (
                  <div key={input.name}>
                    <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 mb-1">
                      {input.label}
                    </label>
                    <input
                      type={input.type}
                      name={input.name}
                      id={input.name}
                      value={formData[input.name]}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData["address"]}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="border border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Blood Pressure (High)", name: "blood_pressure", type: "number" },
                  { label: "Blood Pressure (Low)", name: "blood_pressure_low", type: "number" },
                  { label: "Weight (Actual)", name: "weight", type: "number" },
                  { label: "Weight (Expected)", name: "weight_expect", type: "number" },
                  { label: "SpO2", name: "spo2", type: "number" },
                  { label: "Heart Rate", name: "heart_rate", type: "number" },
                  { label: "Respiratory Rate", name: "respiratory_rate", type: "number" },
                  { label: "Temperature", name: "temprature", type: "number" },
                ].map((input) => (
                  <div key={input.name}>
                    <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 mb-1">
                      {input.label}
                    </label>
                    <input
                      type={input.type}
                      name={input.name}
                      id={input.name}
                      value={formData[input.name]}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment Information */}
            <div className="border border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Appointment Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[{ label: "Next Appointment Date", name: "next_appointment_date", type: "date" }].map(
                  (input) => (
                    <div key={input.name}>
                      <label htmlFor={input.name} className="block text-sm font-medium text-gray-700 mb-1">
                        {input.label}
                      </label>
                      <input
                        type={input.type}
                        name={input.name}
                        id={input.name}
                        value={formData[input.name]}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )
                )}
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason or Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Reason or Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-row justify-center items-center gap-4">
              <button
                type="button"
                className="w-48 bg-gray-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                onClick={() => navigate("/admin/doctor_panel/appointments/all")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-48 bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit"}
              </button>
            </div>

          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointmentEdit;
