import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ExternalLink, ClipboardList } from "lucide-react";

const TestReport = ({ appointment_details }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
      <div className="flex items-center justify-center mb-4 pb-3 border-b border-gray-100">
        <FileText className="w-5 h-5 text-teal-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Test Reports</h3>
      </div>

      <div className="flex flex-col space-y-4">
        {/* View Reports Button */}
        <div className="flex justify-center">
          <button
            onClick={() =>
              navigate("/admin/doctor_panel/report", { 
                state: { 
                  af_id: appointment_details.af_id, 
                  date: appointment_details.date 
                } 
              })
            }
            className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm"
            aria-label="View reports"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            <span>View Reports</span>
          </button>
        </div>
        
        {/* Patient Receipt Link */}
        <div className="mt-2 flex justify-center">
          <a
            href={`https://santhospital.com/admin/doctor_old_panel/production/paper.php?id=${appointment_details.af_id}&p=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-teal-100 text-teal-800 border border-teal-200 rounded-md hover:bg-teal-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-1 shadow-sm"
            aria-label="View patient receipt"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            <span>View Patient Receipt</span>
          </a>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">
          Access complete patient documentation and test results
        </p>
      </div>
    </div>
  );
};

export default TestReport;