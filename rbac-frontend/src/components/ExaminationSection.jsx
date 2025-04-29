import React from 'react';
import { Stethoscope, ChevronDown } from 'lucide-react';

const ExaminationSection = ({ examinations, fetchExaminations, appointment_details }) => {
  const handleOptionChange = async (examination, selectedOption) => {
    try {
      let selectedOptionEOId = examination.options.find(option => option.name === selectedOption)?.eo_id;
      
      if (!selectedOptionEOId) selectedOptionEOId = '#';

      const data = {
        'pe_id': examination.pe_id,
        'eo_id': selectedOptionEOId,  
        'examination_option': selectedOption,
        'af_id': appointment_details.af_id,
        'e_id': examination.e_id,
        'examination_name': examination.examination_name
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_exam_option.php`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (result.success) {
        fetchExaminations();
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error("Failed to update examination option:", error);
      // You could add a toast notification here
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-center mb-4 pb-2 border-b border-gray-200">
        <Stethoscope className="w-5 h-5 text-teal-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Examination</h3>
      </div>
      
      <div className="max-h-64 md:max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-4">
          {examinations.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No examination records available</p>
          ) : (
            examinations.map((examination) => (
              <div key={examination.e_id} className="flex flex-col space-y-2 bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-teal-700 flex items-center">
                  {examination.examination_name}
                </h4>
                <div className="relative">
                  <select 
                    value={examination.selected_option} 
                    onChange={(e) => handleOptionChange(examination, e.target.value)} 
                    className="w-full p-2 pr-8 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none text-sm"
                  >
                    <option value="">Not Selected</option>
                    {examination.options.map((option) => (
                      <option key={option.eo_id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExaminationSection;