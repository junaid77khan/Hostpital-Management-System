import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TestReport = ({ selectedAppointmentImage, handleFileChange, handleSubmit, handleDeleteReport, appointment_details, file }) => {
  const navigate = useNavigate();
  return (
    <div className="p-6 rounded-lg shadow-lg border border-gray-300 flex flex-col bg-white transition-transform transform">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() =>
                              navigate("/admin/doctor_panel/report", { state: { af_id: appointment_details.af_id, date: appointment_details.date } })
                            }
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >View Reports</button>
                        </div>

      {/* Buttons for View in Patient Receipt */}
      <div className="flex flex-wrap justify-center items-center mt-6 space-x-0 space-y-4 sm:space-y-0 sm:space-x-4">
        <a
          href={`https://santhospital.com/admin/doctor_old_panel/production/paper.php?id=${appointment_details.af_id}&p=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-blue-500 text-white text-center py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          View in Patient Receipt
        </a>
      </div>
    </div>
  );
};

export default TestReport;
