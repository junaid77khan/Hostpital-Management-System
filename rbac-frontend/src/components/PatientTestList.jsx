import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function PatientTestList({ 
  patientTestList = [], 
  handleTestInputChange, 
  handleDeleteTest, 
  handlePatientHandleSelect,
  filteredTestsMap = {},
  testInputValues = {}
}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="p-4 md:p-6 mt-4 md:mt-6 rounded-lg shadow-md border border-gray-300 bg-white">
      <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-center text-gray-800">
        Patient Test List
      </h3>
      
      {isSmallScreen ? (
        // Mobile view - card layout
        <div className="space-y-4">
          {patientTestList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tests added
            </div>
          ) : (
            patientTestList.map((test, index) => (
              <div 
                key={test.pt_id}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Test #{index + 1}</span>
                  <button
                    onClick={() => handleDeleteTest(test.pt_id)}
                    className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
                    aria-label="Delete test"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    autoComplete="off"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200"
                    value={testInputValues[test.pt_id]?.test_name || ""}
                    placeholder="Enter Test Name"
                    onChange={(e) => handleTestInputChange(e, test.pt_id, "test_name")}
                  />
                  
                  {filteredTestsMap[test.pt_id] && filteredTestsMap[test.pt_id].length > 0 && test.pt_id && (
                    <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredTestsMap[test.pt_id].map((testSuggestion) => (
                        <li
                          key={testSuggestion.test_id}
                          className="px-3 py-2 text-gray-800 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-all duration-200"
                          onClick={() => handlePatientHandleSelect(testSuggestion, test.pt_id)}
                        >
                          {testSuggestion.test_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Desktop view - table layout
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 w-16">S.No.</th>
                <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Test Name</th>
                <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientTestList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    No tests added
                  </td>
                </tr>
              ) : (
                patientTestList.map((test, index) => (
                  <tr
                    key={test.pt_id}
                    className="transition-all duration-200 hover:bg-gray-50"
                  >
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 relative">
                      <input
                        autoComplete="off"
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200"
                        value={testInputValues[test.pt_id]?.test_name || ""}
                        placeholder="Enter Test Name"
                        onChange={(e) => handleTestInputChange(e, test.pt_id, "test_name")}
                      />
                      
                      {filteredTestsMap[test.pt_id] && filteredTestsMap[test.pt_id].length > 0 && test.pt_id && (
                        <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
                          {filteredTestsMap[test.pt_id].map((testSuggestion) => (
                            <li
                              key={testSuggestion.test_id}
                              className="px-3 py-2 text-gray-800 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-all duration-200"
                              onClick={() => handlePatientHandleSelect(testSuggestion, test.pt_id)}
                            >
                              {testSuggestion.test_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <button
                        onClick={() => handleDeleteTest(test.pt_id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 flex items-center justify-center mx-auto"
                        aria-label="Delete test"
                      >
                        <Trash2 size={16} className="mr-1" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}