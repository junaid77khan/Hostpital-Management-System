import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Copy, CheckCircle, Info, X } from 'lucide-react';

export default function MedicalTemplateManage({allTemplates, handleTemplate}) {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // Simulate loading templates data - replace with your actual data fetching
  useEffect(() => {
    const categorized = allTemplates.reduce((acc, template) => {
      const firstLetter = template.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(template);
      return acc;
    }, {});
    
    setTemplates(categorized);
  }, []);

  // Toggle template expansion for details
  const toggleTemplateDetails = (template, event) => {
    event.stopPropagation(); // Prevent triggering the parent button click
    setExpandedTemplate(expandedTemplate?.t_id === template.t_id ? null : template);
  };

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Filter templates based on search term
  const getFilteredTemplates = () => {
    if (!searchTerm) return templates;
    
    const filtered = {};
    
    Object.keys(templates).forEach(category => {
      const categoryTemplates = templates[category].filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.af_id.includes(searchTerm) ||
        template.t_id.includes(searchTerm)
      );
      
      if (categoryTemplates.length > 0) {
        filtered[category] = categoryTemplates;
      }
    });
    
    return filtered;
  };

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-blue-800 mb-4">Medical Templates</h1>
      
      {/* Search bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
      </div>
      
      {/* Templates display with fixed height */}
      <div className="border max-h-64 overflow-y-auto  border-gray-200 rounded-lg bg-white shadow-sm">
        {Object.keys(getFilteredTemplates()).sort().length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No templates match your search
          </div>
        ) : (
          Object.keys(getFilteredTemplates()).sort().map(category => (
            <div key={category} className="border-b border-gray-200 last:border-b-0">
              <div 
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCategory(category)}
              >
                <h3 className="font-medium text-gray-800">
                  {category} <span className="text-sm text-gray-500">({getFilteredTemplates()[category].length})</span>
                </h3>
                {expandedCategory === category ? 
                  <ChevronUp className="text-blue-600" size={18} /> : 
                  <ChevronDown className="text-blue-600" size={18} />
                }
              </div>
              
              {expandedCategory === category && (
                <div className="max-h-64 overflow-y-auto p-2 bg-gray-50">
                  <div className="space-y-2">
                    {getFilteredTemplates()[category].map(template => (
                      <div key={template.t_id} className="relative">
                        <button
                          onClick={() => handleTemplate(template)}
                          className={`w-full text-left p-3 rounded-md transition-all duration-200 flex justify-between items-center ${
                            template.included 
                              ? 'bg-green-100 border border-green-200 hover:bg-green-200' 
                              : 'bg-white border border-gray-200 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex-1 pr-8">
                            <p className={`font-medium ${template.included ? 'text-green-800' : 'text-blue-800'}`}>
                              {template.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">ID: {template.t_id}</p>
                          </div>
                          
                          {template.included ? (
                            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                          ) : (
                            <Copy className="text-blue-600 flex-shrink-0" size={18} />
                          )}
                          
                          <button 
                            className="absolute right-2 top-2 p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100"
                            onClick={(e) => toggleTemplateDetails(template, e)}
                          >
                            <Info size={16} />
                          </button>
                        </button>
                        
                        {/* Expanded details view */}
                        {expandedTemplate?.t_id === template.t_id && (
                          <div className="mt-1 p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">Template Details</h4>
                              <button 
                                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedTemplate(null);
                                }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-500">Template ID:</p>
                                <p className="font-medium">{template.t_id}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">AF ID:</p>
                                <p className="font-medium">{template.af_id}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-500">Status:</p>
                                <p className={`font-medium ${template.included ? 'text-green-600' : 'text-gray-600'}`}>
                                  {template.included ? 'Included in patient record' : 'Not included'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-gray-100">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTemplate(template);
                                }}
                                className={`px-3 py-1 text-sm rounded-md ${
                                  template.included 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                {template.included ? 'Remove from patient' : 'Add to patient'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary of selected templates */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Selected Templates</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(templates).flat().filter(t => t.included).map(template => (
            <div key={template.t_id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
              <span>{template.name}</span>
            </div>
          ))}
          {Object.values(templates).flat().filter(t => t.included).length === 0 && (
            <p className="text-sm text-gray-500">No templates selected</p>
          )}
        </div>
      </div>
    </div>
  );
}