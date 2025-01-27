import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

const PatientDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    p_id: "",
    name: "",
    mobile: "",
    dob: "",
    address: "",
    pincode: "",
    email: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true); // For skeleton loader
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const patientDetail = location.state?.patient_detail;
    if (patientDetail) {
      setFormData({
        p_id: patientDetail.p_id || "",
        name: patientDetail.name || "",
        mobile: patientDetail.mobile || "",
        dob: patientDetail.dob || "",
        address: patientDetail.address || "",
        pincode: patientDetail.pincode || "",
        email: patientDetail.email || "",
        gender: patientDetail.gender || "",
      });
    }
    setTimeout(() => setLoading(false), 1500); // Simulated loading time
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_detail.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/admin/doctor_panel/patients/history");
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-50">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl p-6 animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded-md"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-md"></div>
                <div className="h-8 bg-gray-200 rounded-md"></div>
                <div className="h-8 bg-gray-200 rounded-md"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
        <div className="flex-1 bg-gray-50">
          <Navbar />
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left pb-2 border-b-2">
            Edit Patient Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Mobile Number", name: "mobile", type: "text" },
                { label: "DOB", name: "dob", type: "date" },
                { label: "Pincode", name: "pincode", type: "text" },
                { label: "Email Address", name: "email", type: "email" },
              ].map((input) => (
                <div key={input.name} className="space-y-2">
                  <label
                    htmlFor={input.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {input.label}
                  </label>
                  <input
                    type={input.type}
                    name={input.name}
                    id={input.name}
                    value={formData[input.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            <div className="flex justify-center gap-6 mt-8">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600"
                onClick={() => navigate("/admin/doctor_panel/patients/history")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
