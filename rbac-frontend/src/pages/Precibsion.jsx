import React, { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import fetchData from "../utils/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import PatientDetail from "../components/PatientDetail";
import { Delete } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import TestReport from "../components/TestReport";
import Loader from "../components/Loader";
import MedicalTemplateManage from "../components/MedicalTemplateManager";
import ExaminationSection from "../components/ExaminationSection";
import PatientTestList from "../components/PatientTestList";


const useDebounce = (callback, delay) => {
  const timeoutRef = React.useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

const DoctorPanel = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [addComplaintLoading, setAddComplaintLoading] = useState(false);
  const [addTestLoading, setAddTestLoading] = useState(false);
  const { appointment_details } = location.state;
  const [templates, setTemplates] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [complaint, setComplaint] = useState("");
  const [selectedHintId, setSelectedHintId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [duration, setDuration] = useState("");
  const [patientComplaintList, setPatientComplaintList] = useState([]);
  const [hints, setHints] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [filteredHints, setFilteredHints] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const[foodEatingInst, setFoodEatingInst] = useState([]);
  const[selectedNextSuggestion, setSelectedNextSuggestion] = useState('');
  const[selectedNextMeetDate, setSelectedNextMeetDate] = useState('');
  const[selectedFoodEatInst, setSelectedFoodEatInst] = useState('');
  const[diagnosis, setDiagnosis] = useState('');
  const[medicineType, setMedicineType] = useState([]);
  const[medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);
  const[eatingInstructions, setEatingInstructions] = useState([]);
  const[patientMedicines, setPatientMedicines] = useState([]);
  const [filteredMedicinesMap, setFilteredMedicinesMap] = useState({});
  const [filteredTestsMap, setFilteredTestsMap] = useState({});
  const [filteredFoodEatInstMap, setFilteredFoodEatInstMap] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [debouncedDurationValues, setDebouncedDurationValues] = useState({});
  const [debouncedDoseValues, setDebouncedDoseValues] = useState({});
  const [testName, setTestName] = useState('');
  const [patientTestList, setPatientTestList] = useState([]);
  const [testInputValues, setTestInputValues] = useState({});
  const [weight, setWeight] = useState(location.state.appointment_details.weight);
  const [error, setError] = useState("");
  const [testReport, setTestReport] = useState("");
  const [file, setFile] = useState(null);  
  const [selectedAppointmentImage, setSelectedAppointmentImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);

  const navigate = useNavigate();
  

    const handleReportChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageURL = URL.createObjectURL(file);
        setFile(imageURL)
        setTempFile(file);
      }
    };
  
    // Handle form submission (you can replace this with an actual upload function)
    const handleReportSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      if (!file) {
          alert("Please select a file to upload.");
          return;
      }
  
      const formData = new FormData();
      formData.append('photo', tempFile);
      formData.append('af_id', appointment_details.af_id); 
      formData.append('upload_img', 'true');
      formData.append('date', appointment_details.date)
  
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/report/process_upload_report.php`, {
              method: 'POST',
              body: formData,
              // Remove the Content-Type header
              mode: 'cors', 
          });
  
          // It's better to parse JSON if your PHP is returning JSON
          const result = await response.json(); 
          
          if (result.error) {
              alert(result.error);
          } else if (result.success) {
              setSelectedAppointmentImage(file);
              alert('Image uploaded successfully.');
          }
      } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image.');
      } finally {
        
      setLoading(false);
      }
    };
  
    // Handle deleting the report
    const handleDeleteReport = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/report/delete_report.php?af_id=${appointment_details.af_id}`, {
              method: 'POST',
              mode: 'cors', 
          });
  
          const result = await response.json();
          
          if (result.error) {
              alert(result.error);
          } else {
              setSelectedAppointmentImage(null);
              setFile(null);
              alert('Report deleted successfully.');
          }
      } catch (error) {
          console.error('Error deleting image:', error);
          alert('Failed to delete image.');
      } finally {
        
      setLoading(false);
      }
      
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!file) {
          alert("Please select a file to upload.");
          return;
      }
  
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('af_id', appointment_details.af_id); 
      formData.append('upload_img', 'true');
      formData.append('date', appointment_details.date)
  
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/report/process_upload_report.php`, {
              method: 'POST',
              body: formData,
              // Remove the Content-Type header
              mode: 'cors', 
          });
  
          // It's better to parse JSON if your PHP is returning JSON
          const result = await response.json();
          
          if (result.error) {
              alert(result.error);
          } else if (result.success) {
              alert('Image uploaded successfully.');
          }
      } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image.');
      }
  };

  useEffect(() => {
    fetchTemplates();
    fetchHints();
    fetchNextSuggestions();
    fetchFoodEatingInst();
    fetchPatientComplaintList();
    fetchPatientTestList();
    fetchAppointDetails();
    fetchExaminations();
    fetchPatientMedicines();
    fetchMedicineTypes();
    fetchMedicines();
    fetchMedicineEatingInstructions();
    fetchTests();
    fetchReport();
  }, []);

  useEffect(() => {
    const timers = {};
    
    patientComplaintList.forEach((complaint) => {
      const pc_id = complaint.pc_id;
      const duration = debouncedDurationValues[pc_id];

      if (duration !== undefined) {
        timers[pc_id] = setTimeout(() => {
          handleDurationAndDoseInput(duration, pc_id, 'duration');
        }, 1000);
      }
    });

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [debouncedDurationValues]);

  useEffect(() => {
    const timers = {};
    
    patientComplaintList.forEach((complaint) => {
      const pc_id = complaint.pc_id;
      const dose = inputValues[pc_id]?.dose;
      // console.log(inputValues);
      

      if (dose !== undefined) {
        
        timers[pc_id] = setTimeout(() => {
          handleDurationAndDoseInput(dose, pc_id, 'dose');
        }, 1000);
      }
    });

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [debouncedDoseValues]);

  const handleDurationAndDoseInputChange = (e, pc_id, field) => {
    
    const value = e?.target?.value;
    
    setInputValues(prevValues => ({
      ...prevValues,
      [pc_id]: {
        ...prevValues[pc_id],
        [field]: value 
      }
    }));
    
    if(field === 'duration') {
      setDebouncedDurationValues((prevValues) => ({
        ...prevValues,
        [pc_id]: value,
      }));
    } else {
      setDebouncedDoseValues((prevValues) => ({
        ...prevValues,
        [pc_id]: value,
      }));
    }
  };

  useEffect(() => {
    
    if (complaint.trim() === "") {
      setFilteredHints([]);
    } else {
      const filtered = hints.filter(
        (hint) => hint.name && hint.name.toLowerCase().includes(complaint.toLowerCase())
      );
      setFilteredHints(filtered);
    }
  }, [complaint, hints]);

  useEffect(() => {
    if (testName.trim() === "") {
      setFilteredTests([]);
    } else {
      const filtered = tests.filter(
        (test) => test.test_name && test.test_name.toLowerCase().includes(testName.toLowerCase())
      );
      setFilteredTests(filtered);
    }
  }, [testName, tests]);

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);
  const dropdownRef4 = useRef(null);

  const handleOutsideClick = (event) => {
    if ((dropdownRef1.current && !dropdownRef1.current.contains(event.target)) || (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) || (dropdownRef3.current && !dropdownRef3.current.contains(event.target)) || (dropdownRef4.current && !dropdownRef4.current.contains(event.target)) ) {
      setFilteredHints([]);
      setFilteredTests([]);
      setFilteredMedicinesMap({});
      setFilteredFoodEatInstMap({});
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [complaint?.pc_id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: `report/fetch_report.php?af_id=${appointment_details.af_id}&date=${appointment_details.date}`,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSelectedAppointmentImage(result.report.image_data);
        setFile(result.report.image_data);
      }
    } catch {
      setError('Failed to fetch report image');
    } finally {
      setLoading(false);
    }
  }

  const fetchMedicineTypes = async () => {
    setLoading(true);
    try {
        const result = await fetchData({
            API_URL: 'Medicines/Get_Medicine_Type.php'
        });

        if (result.error) {
          console.log(result.error);
          
            // setError(result.error);
        } else {
          
            setMedicineType(result.medicine_types || []);
        }
    } catch (err) {
        setError('Failed to fetch appointments');
    } finally {
        setLoading(false);
    }
};

const fetchTests = async () => {
  setLoading(true);
  try {
      const result = await fetchData({
          API_URL: 'test_list/fetch_test_list.php'
      });

      if (result.error) {
          setError(result.error);
      } else {
          setTests(result.tests || []);
      }
  } catch (err) {
      setError('Failed to fetch test data');
  } finally {
      setLoading(false);
  }
};

  const fetchMedicines = async () => {
    setLoading(true);
    try {
        const result = await fetchData({
            API_URL: 'Medicines/get_medicines.php'
        });

        if (result.error) {
            console.log(result.error);
        } else {
            setMedicines(result.medicines || []);
            // junaid
        }
    } catch (err) {
        setError('Failed to fetch medicines data');
    } finally {
        setLoading(false);
    }
  };

  const fetchMedicineEatingInstructions = async () => {
    setLoading(true);
    try {
        const result = await fetchData({
            API_URL: 'Medicines/Medicine_Eating_Instructions.php'
        });

        if (result.error) {
            console.log(result.error);
        } else {
            setEatingInstructions(result.medicine_eating_instructions || []);
        }
    } catch (err) {
        setError('Failed to fetch medicine eating instructions data');
    } finally {
        setLoading(false);
    }
};

  const handleHintSelect = (hint) => {
    setComplaint(hint.name); 
    setSelectedHintId(hint.hint_id); 
    setTimeout(() => {
      setFilteredHints([]); 
    }, 0);
  };

  const handleTestSelect = (test) => {
    setTestName(test.test_name); 
    setSelectedTestId(test.t_id); 
    setTimeout(() => {
      setFilteredTests([]); 
    }, 0);
  };

  const handlePatientHandleSelect = async (test, index) => {
    setTestInputValues(prevValues => ({
      ...prevValues,
      [index]: {
        ...prevValues[index],
        "test_name": test.test_name,
      }
    }));
    setFilteredTestsMap(prevMap => ({
      ...prevMap,
      [index]: [] 
    }));
    

    const data =  {
      "pt_id": index,
      "t_id": test.t_id,
      "test_name": test.test_name, 
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_test.php`, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    const result = await response.json();

    if (response.ok) {
        // fetchPatientComplaintList();
    } else {
        throw new Error(result.error || 'Unknown error occurred');
    }
  }


  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: `templates/fetch_templates.php?af_id=${appointment_details.af_id}`,
      });

      if (result.error || !result.success) {
        setError("Something went wrong");
      } else {
        setTemplates(result.templates);
      }
    } catch (err) {
      setError("Failed to fetch templates data");
    } finally {
      setLoading(false);
    }
  };

  const fetchExaminations = async () => {
    setLoading(true);
    try {
      const examinationResult = await fetchData({
        API_URL: `Patient/fetch_patient_examination.php?af_id=${appointment_details.af_id}`,
      });

      if (examinationResult.error) {
        setError(examinationResult.error);
        return;
      }
      setExaminations(examinationResult.data);
    } catch (err) {
      setError(err.message || "Failed to fetch examinations");
    } finally {
      setLoading(false);
    }
  };

  const fetchHints = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: "Hints/fetch_hints.php",
      });

      if (result.error) {
        setError(result.error);
      } else {
        setHints(result.hints || []);
      }
    } catch (err) {
      setError("Failed to fetch next hint data");
    } finally {
      setLoading(false);
    }
  };

  const fetchNextSuggestions = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: "Next_Suggestion/next_suggestion.php",
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuggestions(result.next_suggestions);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodEatingInst = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: "Food/Get_Food_Eating_Instructions.php",
      });

      if (result.error) {
        setError(result.error);
      } else {
        setFoodEatingInst(result.food_eating_instructions);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointDetails = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: `Patient/fetch_patient_appointment.php?af_id=${appointment_details.af_id}`,
      });

      if (result.error || !result.success) {
        setError("Something went wrong.");
      }else {
        setSelectedFoodEatInst(result.appointment.eating_instruction)
        setSelectedNextMeetDate(result.appointment.next_appointment_date)
        setSelectedNextSuggestion(result.appointment.next_meeting)
        setDiagnosis(result.appointment.diagnosis);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientMedicines = async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        API_URL: `Patient/fetch_patient_medicine.php?af_id=${appointment_details.af_id}`,
      });

      if (result.error) {
        // setError(result.error);
      } else {
        setPatientMedicines(result.patient_medicines);
        
      }
    } catch (err) {
      setError("Failed to fetch templates data");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();  
    const data = {
      'p_id': appointment_details.p_id,
      'af_id': appointment_details.af_id,
      'h_id': selectedHintId || "",
      'hints_name': complaint || "",
      'duration': duration || ""
    };

    setLoading(true); 

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/add_patient_complaint.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        fetchPatientComplaintList();
        setComplaint('');
        setDuration(''); 
        setFilteredHints([]); 
      } else {
        throw new Error(result.error || 'Failed to add complaint');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();

    if (!testName) {
      toast.error('Please fill in the test field'); // Show error popup
      return;
    }

    const data = {
      af_id: appointment_details.af_id,
      t_id: selectedTestId,
      test_name: testName,
    };

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/add_patient_test_list.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.error) {
        fetchPatientTestList();
        setTestName('');
        setFilteredTests([]);
        toast.success('Test added successfully!'); 
      } else {
        throw new Error(result.error || 'Failed to add the test');
      }
    } catch (err) {
      toast.error(err.message); // Show error popup
    } finally {
      setLoading(false);
    }
  };

  const updateDiagnosis = async (value) => {
    try {
      const data = {
        'af_id': appointment_details.af_id,
        diagnosis: value,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Appointments/appointform_update.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.success) {
        fetchAppointDetails();
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Error updating diagnosis:", err.message);
    }
  };

  // Debounced API call
  const debouncedUpdateDiagnosis = useCallback(
    useDebounce((value) => updateDiagnosis(value), 500), // 500ms debounce delay
    []
  );

const fetchPatientComplaintList = async () => {
  setLoading(true);
  try {
    const complaintResult = await fetchData({
      API_URL: `Patient/fetch_patient_complaint_list.php?af_id=${appointment_details.af_id}`,
    });

    if (complaintResult.error) {
      console.log(complaintResult.error);
      setError(complaintResult.error);
    } else {
      const medicineResult = await fetchData({
        API_URL: `Patient/fetch_patient_medicine.php?af_id=${appointment_details.af_id}`,
      });

      if (medicineResult.error) {
        console.log(medicineResult.error);
      } else {
        const updatedComplaintList = complaintResult.patient_complaints.map((complaint) => {
          
          const correspondingMedicines = medicineResult.patient_medicines.filter(
            (medicine) => {
              return String(medicine.pc_id) === String(complaint.pc_id)}
          );
          return {
            ...complaint,
            medicines: correspondingMedicines,
          };
        });
        
        setPatientComplaintList(updatedComplaintList);
        const initialInputValues = updatedComplaintList.reduce((acc, complaint) => {
          const medicine = complaint.medicines[0];
          if (medicine) {
            // console.log(complaint);
            
            acc[complaint.pc_id] = {
              medicine_name: medicine.medicine_name || "",
              type: medicine.type || "",
              pm_id: medicine.pm_id || "",
              dose: medicine.dose || "",
              duration: medicine.duration || "",
              medicine_dose: (Number)(medicine.dose) || 0,
              medicine_eating: medicine.medicine_eating || '',
              custom_dose: complaint.custom_dose || ''
            };
          }
          return acc;
        }, {});       
        
        const initialDurationValues = Object.keys(initialInputValues).reduce((acc, pc_id) => {
          const complaint = initialInputValues[pc_id]; 
          acc[pc_id] = complaint.duration || ''; 
          return acc;
        }, {});
        
        const initialDoseValues = Object.keys(initialInputValues).reduce((acc, pc_id) => {
          const complaint = initialInputValues[pc_id]; 
          acc[pc_id] = ((Number)(complaint.medicine_dose) * (Number)(weight)) || '';
          return acc;
        }, {});
        // setDebouncedDoseValues(initialDoseValues);
        setDebouncedDurationValues(initialDurationValues);
        setInputValues(initialInputValues);
      }
    }
  } catch (err) {
    console.log(err);
    setError("Failed to fetch patient complaint data");
  } finally {
    setLoading(false);
  }
};

const fetchPatientTestList = async () => {
  setLoading(true);
  try {
    const patientTestResult = await fetchData({
      API_URL: `Patient/fetch_patient_test_list.php?af_id=${appointment_details.af_id}`,
    });

    if (patientTestResult.error) {
      console.log(patientTestResult.error);
      setError(patientTestResult.error);
    } else {
      const initialTestInputValues = patientTestResult.patient_tests.reduce((acc, test) => {
          
          if (test) {
            acc[test.pt_id] = {
              test_name: test.test_name || "",
            };
          }
          return acc;
        }, {});

        setTestInputValues(initialTestInputValues);        
        setPatientTestList(patientTestResult.patient_tests);
    }
  } catch (err) {
    console.log(err);
    setError("Failed to fetch patient complaint data");
  } finally {
    setLoading(false);
  }
};


const handleMedicineInputChange = async (event, index, field) => {
  const query = event?.target?.value;

  setInputValues(prevValues => ({
    ...prevValues,
    [index]: {
      ...prevValues[index],
      [field]: query 
    }
  }));

  if (field === "medicine_name") {
    if(query === "") {
      setInputValues(prevValues => ({
        ...prevValues,
        [index]: {
          ...prevValues[index],
          "medicine_dose": 0
        }
      }));
      
    }
    const medicinesOfSameType = medicines.filter((medicine) => {
      return medicine.type.localeCompare(inputValues[index].type) === 0;
    });       
    
    const filteredMedicines = medicinesOfSameType.filter((medicine) => {
      return medicine.name.toLowerCase().includes(query.toLowerCase());
    });   
    
    
    setFilteredMedicinesMap(prevMap => ({
      ...prevMap,
      [index]: filteredMedicines
    }));

    const pm_id = inputValues[index]?.pm_id;
    const data =  {
      'pm_id': pm_id,
      [field]: query, 
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_medicine.php`, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    const result = await response.json();

    if (result.success) {
        // fetchPatientComplaintList();
    } else {
        throw new Error(result.error || 'Unknown error occurred');
    }
  } else if (field === "medicine_eating") {
    const filteredEatingInstructions = eatingInstructions.filter((instruction) =>
      instruction?.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFoodEatInstMap(prevMap => ({
      ...prevMap,
      [index]: filteredEatingInstructions
    }));
    const pm_id = inputValues[index]?.pm_id;
    const data =  {
      'pm_id': pm_id,
      [field]: query, 
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_medicine.php`, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    const result = await response.json();

    if (result.success) {
        // fetchPatientComplaintList();
    } else {
        throw new Error(result.error || 'Unknown error occurred');
    }
  } else  {
    const pm_id = inputValues[index]?.pm_id;
    if(pm_id) {
      // update value
      const data =  {
        'pm_id': pm_id,
        [field]: query, 
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_medicine.php`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (result.success) {
          // fetchPatientComplaintList();
      } else {
          throw new Error(result.error || 'Unknown error occurred');
      }
    } else {
      // add new patient_medicine
      // console.log('af_id - ', appointment_details.af_id, ' & p_id - ', appointment_details.p_id, ' pc_id - ', index);
      const data =  {
        'af_id': appointment_details.af_id,
        'p_id': appointment_details.p_id, 
        'pc_id': index,
        [field]: query
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/add_patient_medicine.php`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (result.success) {
          fetchPatientComplaintList();
      } else {
          throw new Error(result.error || 'Unknown error occurred');
      }
    }
    
  }
};

const handleTestInputChange = async (event, index, field) => {
  const query = event?.target?.value;

  setTestInputValues(prevValues => ({
    ...prevValues,
    [index]: {
      ...prevValues[index],
      [field]: query 
    }
  }));

  const filteredTests = tests.filter((test) =>
    test.test_name.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredTestsMap(prevMap => ({
    ...prevMap,
    [index]: filteredTests
  }));
};

const handleDurationAndDoseInput = async (value, index, field) => {
  
  setInputValues(prevValues => ({
    ...prevValues,
    [index]: {
      ...prevValues[index],
      [field]: value
    }
  }));
  const pm_id = inputValues[index].pm_id;
  
  if(field === "duration") {
    const data =  {
      'pm_id': pm_id,
      [field]: value, 
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_medicine.php`, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    const result = await response.json();

    if (response.ok) {
        // fetchPatientComplaintList();
    } else {
        throw new Error(result.error || 'Unknown error occurred');
    }
  }else {
    const pm_id = inputValues[index]?.pm_id;
    if(pm_id) {
      // update value
      const data =  {
        'pm_id': pm_id,
        [field]: value, 
      }      

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_medicine.php`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (response.ok) {
          // fetchPatientComplaintList();
      } else {
          throw new Error(result.error || 'Unknown error occurred');
      }
    } else {
      // add new patient_medicine
      // console.log('af_id - ', appointment_details.af_id, ' & p_id - ', appointment_details.p_id, ' pc_id - ', index);
      const data =  {
        'af_id': appointment_details.af_id,
        'p_id': appointment_details.p_id, 
        'pc_id': index,
        [field]: value
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/add_patient_medicine.php`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (result.success) {
          fetchPatientComplaintList();
      } else {
          throw new Error(result.error || 'Unknown error occurred');
      }
    }
  }
};

const handleDoseValue = async(pc_id, dose) => {
  console.log(pc_id, ' ', dose);
  
  const pm_id = inputValues[pc_id].pm_id;
  const data =  {
    'pm_id': pm_id,
    "dose": dose, 
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_medicine.php`, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), 
  });

  const result = await response.json();

  if (result.success) {
      // fetchPatientComplaintList();
  } else {
      throw new Error(result.error || 'Unknown error occurred');
  }
}



  const handleMedicineSelect = async (medicine, index, field) => {
    // console.log(medicine, ' ', index, ' ', field);
    
    setInputValues(prevValues => ({
      ...prevValues,
      [index]: {
        ...prevValues[index],
        [field]: medicine.name,
      }
    }));

    const matchedMedicine = medicines.find(
      med => med.name === medicine.name && med.type === inputValues[index]?.type
    );
    
    if (matchedMedicine && matchedMedicine.dose) {
      setInputValues(prevValues => ({
        ...prevValues,
        [index]: {
          ...prevValues[index],
          "dose": Number(matchedMedicine.dose) * weight,
        }
      }));
      handleDoseValue(index, Number(matchedMedicine.dose) * weight);
    }
  
    if (field === "medicine_name") {
      setFilteredMedicinesMap(prevMap => ({
        ...prevMap,
        [index]: [] 
      }));
      // fetchPatientComplaintList();
    } else if (field === "medicine_eating") {
      setFilteredFoodEatInstMap(prevMap => ({
        ...prevMap,
        [index]: [] 
      }));
    }

    const pm_id = inputValues[index]?.pm_id;
    if(pm_id) {
      // update value
      const data =  {
        'pm_id': pm_id,
        [field]: medicine.name, 
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_patient_medicine.php`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (result.success) {
          fetchPatientComplaintList();
      } else {
          throw new Error(result.error || 'Unknown error occurred');
      }
    } else {
      // add new patient_medicine
      // console.log('af_id - ', appointment_details.af_id, ' & p_id - ', appointment_details.p_id, ' pc_id - ', index);
      const data =  {
        'af_id': appointment_details.af_id,
        'p_id': appointment_details.p_id, 
        'pc_id': index,
        [field]: medicine.name
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/add_patient_medicine.php`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (result.success) {
          fetchPatientComplaintList();
      } else {
          throw new Error(result.error || 'Unknown error occurred');
      }
    }
  };

  const handleDelete = async (pc_id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/delete_patient_complaint.php?pc_id=${pc_id}`, {
      method: 'GET', 
      headers: {
          'Content-Type': 'application/json',
      } 
    });

    const result = await response.json();

    if (response.ok) {
        fetchPatientComplaintList();
    } else {
        throw new Error(result.error || 'Unknown error occurred');
    }
  }

  const handleDeleteTest = async (pt_id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/delete_patient_list.php?pt_id=${pt_id}`, {
      method: 'GET', 
      headers: {
          'Content-Type': 'application/json',
      } 
    });

    const result = await response.json();

    if (response.ok) {
        fetchPatientTestList();
    } else {
        throw new Error(result.error || 'Unknown error occurred');
    }
  }

  const handleTemplate = async (template) => {
    setLoading(true); 

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/templates/update_template_data.php?t_id=${template.t_id}&af_id=${appointment_details.af_id}&p_id=${appointment_details.p_id}&weight=${weight}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        alert("Failed to copy template");
      } else {
        alert("Template Data Copied");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      alert("Failed to copy template.");
    } finally {
      setLoading(false);
    }
  }

  const handleCustomDose = async(e, pc_id) => {
    const value = e.target.value;
    setInputValues(prevValues => ({
      ...prevValues,
      [pc_id]: {
        ...prevValues[pc_id],
        "custom_dose": value
      }
    }));

    const data = {
      "pc_id": pc_id,
      "custom_dose": value
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/Patient/update_custom_dose.php`, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    const result = await response.json();

    if (response.ok) {
        // fetchPatientComplaintList();
    } else {
        throw new Error(result.error || 'Unknown error occurred');
    }
  }
  
  return (
    <div key={appointment_details.af_id} className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
        
          <main className="flex-1 p-5">
            <div className="mb-5 space-y-4 md:space-y-0 md:space-x-2 flex gap-2 flex-wrap justify-center">
              {templates && templates.length > 0 && <MedicalTemplateManage allTemplates={templates} handleTemplate={handleTemplate} />}
            </div>

            {
              appointment_details.op === 'y' && <div class="max-w-lg mx-auto mt-8 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4">Patient Problems</h2>
                  <p class="text-gray-600">{appointment_details.problems}</p>
              </div>
            }

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {/* Examination Section */}
              <ExaminationSection examinations={examinations} fetchExaminations={fetchExaminations} appointment_details={appointment_details} />


              {/* Patient Details Section */}
              <PatientDetail appointment_details={appointment_details} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {/* Add Complaint Section */}
              <div className="rounded-lg shadow-md border border-gray-300 flex flex-col">
                <div className="space-y-1">
                  <div className="flex flex-col">
                    <form onSubmit={handleFormSubmit} className="w-full p-4 mx-auto bg-white rounded-lg">
                      <h2 className="text-2xl font-semibold text-center text-teal-600 mb-6">Add Patient Complaint</h2>

                      <div className="mb-4 relative">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Complaint</label>
                        <input
                          autoComplete="off"
                          type="text"
                          id="name"
                          className="w-full p-4 mt-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Enter your complaint"
                          value={complaint}
                          onChange={(e) => {
                            setComplaint(e.target.value);
                          }}
                        />

                        {complaint.trim() !== '' && (
                          <div ref={dropdownRef1} className="absolute top-full left-0 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            {filteredHints.length > 0 ? (
                              <ul className="list-none p-0">
                                {filteredHints?.map((hint, index) => (
                                  <li
                                    key={index}
                                    className="px-4 py-3 cursor-pointer hover:bg-teal-100 transition-all ease-in-out"
                                    onClick={() => handleHintSelect(hint)} // Use the new handler to select hint
                                  >
                                    <span className="font-medium text-gray-800">{hint.name || 'No hint'}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span></span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Duration Input */}
                      <div className="mb-6">
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration in days</label>
                        <input
                          autoComplete="off"
                          type="text"
                          id="duration"
                          className="w-full p-4 mt-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Enter duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                        />
                      </div>

                      {/* Add Button */}
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          disabled={addComplaintLoading}
                        >
                          {addComplaintLoading ? 'Adding...' : 'Add'}
                        </button>
                      </div>

                      {/* Error Message */}
                      {/* {error && <p className="text-red-500 text-center mt-2">{error}</p>} */}
                    </form>
                  </div>
                </div>
              </div>


              {/* Patient Details Section */}
              <div className="p-6 rounded-lg shadow-md border border-gray-300 flex flex-col bg-white">
                <h3 className="text-lg font-semibold mb-4 text-center">Diagnosis</h3>
                <textarea
                  placeholder="Type details here..."
                  className="p-4 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  rows="6"
                  onChange={async(e) => {
                    setDiagnosis(e.target.value); // Update state immediately
                    debouncedUpdateDiagnosis(e.target.value); // Trigger debounced API call
                  }}     
                  value={diagnosis}
                ></textarea>
              </div>
            </div>

            {/* Complaint list */}
            <div className="p-6 mt-6 rounded-lg shadow-md border border-gray-300 bg-white">
              <h3 className="text-lg font-semibold mb-4 text-center">Complaint List</h3>
              <div className="relative overflow-x-auto">
                <table className="w-full table-auto py-10 border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 w-24">Complaint Name</th>
                      <th className="border border-gray-300 px-4 py-2 w-32">Type</th>
                      <th className="border border-gray-300 px-4 py-2 w-64">Medicine</th>
                      <th className="border border-gray-300 px-4 py-2 w-24">Dose</th>
                      {/* <th className="border border-gray-300 px-4 py-2 w-24">Custom Dose</th> */}
                      <th className="border border-gray-300 px-4 py-2 w-64">Eating Ins.</th>
                      <th className="border border-gray-300 px-4 py-2 w-16">Duration</th>
                      <th className="border border-gray-300 px-4 py-2 w-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="relative">
                    {patientComplaintList.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-gray-500">
                          No complaints added
                        </td>
                      </tr>
                    ) : (
                      patientComplaintList.map((complaint, index) => (
                        <tr
                          key={complaint.pc_id}
                          className="transition-all duration-300 ease-in-out hover:bg-gray-100"
                        >
                          <td className="border border-gray-300 px-4 py-2">{complaint.hints_name}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <select
                              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:cursor-pointer"
                              value={inputValues[complaint.pc_id]?.type || "Not Selected"}
                              onChange={(e) => {
                                const newValue = e.target.value === "Not Selected" ? "" : e.target.value;
                                handleMedicineInputChange(e, complaint.pc_id, "type", newValue);
                              }}
                            >
                              <option value="Not Selected">Not Selected</option>
                              {medicineType?.map((type) => (
                                <option key={type.mt_id} value={type.name}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="relative">
                              <textarea
                                autoComplete="off"
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200 ease-in-out"
                                value={inputValues[complaint.pc_id]?.medicine_name || ""}
                                placeholder="Enter Medicine Name"
                                onChange={(e) => handleMedicineInputChange(e, complaint.pc_id, "medicine_name")}
                              />
                              {filteredMedicinesMap[complaint.pc_id] && filteredMedicinesMap[complaint.pc_id].length > 0 && inputValues[complaint.pc_id] && (
                                <ul 
                                  ref={dropdownRef2} 
                                  className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-50"
                                  style={{
                                    bottom: index === patientComplaintList.length - 1 ? 'auto' : undefined,
                                    top: index === patientComplaintList.length - 1 ? '100%' : undefined
                                  }}
                                >
                                  {filteredMedicinesMap[complaint.pc_id].map((medicine) => (
                                    <li
                                      key={medicine.m_id}
                                      className="px-3 py-2 text-gray-800 cursor-pointer hover:bg-gray-200 focus:bg-gray-200 rounded-md transition-all duration-200 ease-in-out"
                                      onClick={() => handleMedicineSelect(medicine, complaint.pc_id, "medicine_name")}
                                    >
                                      {medicine.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <input
                              autoComplete="off"
                              type="text"
                              value={inputValues[complaint?.pc_id]?.dose ?? null}
                              onChange={(e) => {
                                // handleDurationAndDoseInputChange(e, complaint.pc_id, "dose")
                                setInputValues(prevValues => ({
                                  ...prevValues,
                                  [complaint.pc_id]: {
                                    ...prevValues[complaint.pc_id],
                                    "dose": e.target.value,
                                  }
                                }));
                                handleDoseValue(complaint.pc_id, e.target.value)
                              }}
                              placeholder="Dose"
                              className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                          </td>
                          {/* <td className="border border-gray-300 px-4 py-2">
                            <input
                              autoComplete="off"
                              type="text"
                              value={inputValues[complaint.pc_id].custom_dose || ""}
                              onChange={(e) => handleCustomDose(e, complaint.pc_id)}
                              placeholder="Custom Dose"
                              className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                          </td> */}
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="relative">
                              <textarea
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all duration-200 ease-in-out"
                                value={inputValues[complaint.pc_id]?.medicine_eating || ""}
                                onChange={(e) => handleMedicineInputChange(e, complaint.pc_id, "medicine_eating")}
                                placeholder="Enter Eating Instructions"
                              />
                              {filteredFoodEatInstMap[complaint.pc_id] && filteredFoodEatInstMap[complaint.pc_id].length > 0 && inputValues[complaint.pc_id] && (
                                <ul 
                                  ref={dropdownRef3} 
                                  className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-50"
                                  style={{
                                    bottom: index === patientComplaintList.length - 1 ? 'auto' : undefined,
                                    top: index === patientComplaintList.length - 1 ? '100%' : undefined
                                  }}
                                >
                                  {filteredFoodEatInstMap[complaint.pc_id].map((inst) => (
                                    <li
                                      key={inst.mei_id}
                                      className="px-3 py-2 text-gray-800 cursor-pointer hover:bg-gray-200 focus:bg-gray-200 rounded-md transition-all duration-200 ease-in-out"
                                      onClick={() => handleMedicineSelect(inst, complaint.pc_id, "medicine_eating")}
                                    >
                                      {inst.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <input
                              autoComplete="off"
                              type="number"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:cursor-pointer"
                              value={debouncedDurationValues[complaint.pc_id] || ''}
                              placeholder="Duration"
                              onChange={(e) => handleDurationAndDoseInputChange(e, complaint.pc_id, "duration")}
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <button
                              onClick={() => handleDelete(complaint.pc_id)}
                              className="ml-2 px-3 py-1 text-red-500 transition-colors duration-300 ease-in-out"
                            >
                              <Delete />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

                

                <div className="p-6 rounded-lg shadow-md border border-gray-300 flex flex-col bg-white col-span-2">
                    <div className="space-y-6">
                        {/* Next Suggestion */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="nextSuggestion"
                                className="text-sm font-medium text-gray-700 mb-2"
                            >
                                Select Next Suggestion
                            </label>
                            <select
                                name="nextSuggestion"
                                id="nextSuggestion"
                                value={selectedNextSuggestion}
                                onChange={async(e) => {
                                  setSelectedNextSuggestion(e.target.value);
                                  const data =  {
                                      'af_id': appointment_details.af_id,
                                      'next_meeting': e.target.value,  
                                  }

                                  const response = await fetch(`${process.env.REACT_APP_API_URL}/Appointments/appointform_update.php`, {
                                      method: 'POST', 
                                      headers: {
                                          'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify(data), 
                                  });

                                  const result = await response.json();

                                  if (result.success) {
                                    fetchAppointDetails();
                                  } else {
                                    throw new Error(result.error || 'Unknown error occurred');
                                  }
                              }} 
                                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 hover:bg-white transition duration-200"
                            >
                                {suggestions.map((suggestion) => (
                                    <option key={suggestion.ns_id} value={suggestion.name}>
                                        {suggestion.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Next Meeting Date */}
                        <div className="flex flex-col">
                        <label
                            htmlFor="nextMeetingDate"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Next Meeting Date
                        </label>
                        <input
                            autoComplete="off"
                            type="date"
                            id="nextMeetingDate"
                            onChange={async(e) => {
                                  setSelectedNextMeetDate(e.target.value);
                                  const data =  {
                                      'af_id': appointment_details.af_id,
                                      'next_appointment_date': e.target.value,  
                                  }

                                  const response = await fetch(`${process.env.REACT_APP_API_URL}/Appointments/appointform_update.php`, {
                                      method: 'POST', 
                                      headers: {
                                          'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify(data), 
                                  });

                                  const result = await response.json();

                                  if (result.success) {
                                    fetchAppointDetails();
                                  } else {
                                    throw new Error(result.error || 'Unknown error occurred');
                                  }
                              }} 
                            value={selectedNextMeetDate}
                            className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 hover:bg-white transition duration-200"
                        />
                        </div>

                        {/* Food Eating Instruction */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="foodInstruction"
                                className="text-sm font-medium text-gray-700 mb-2"
                            >
                                Food Eating Instruction
                            </label>
                            <select
                                name="foodInstruction"
                                id="foodInstruction"
                                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 hover:bg-white transition duration-200"
                                value={selectedFoodEatInst}
                                onChange={async(e) => {
                                  setSelectedFoodEatInst(e.target.value);
                                  const data =  {
                                      'af_id': appointment_details.af_id,
                                      'eating_instruction': e.target.value,  
                                  }

                                  const response = await fetch(`${process.env.REACT_APP_API_URL}/Appointments/appointform_update.php`, {
                                      method: 'POST', 
                                      headers: {
                                          'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify(data), 
                                  });

                                  const result = await response.json();

                                  if (result.success) {
                                    fetchAppointDetails();
                                  } else {
                                    throw new Error(result.error || 'Unknown error occurred');
                                  }
                              }} 
                            >
                                {foodEatingInst.map((instruction) => (
                                    <option key={instruction.fei_id} value={instruction.name}>
                                        {instruction.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {/* Test List Section */}
                        <div className="relative rounded-lg shadow-md border border-gray-300 flex flex-col overflow-hidden">
                          <div className="space-y-1">
                            <div className="flex flex-col">
                              <form onSubmit={handleTestSubmit} className="w-full mx-auto p-6 bg-white rounded-lg">
                                <h2 className="text-2xl font-semibold text-center text-teal-600 mb-6">Add Test</h2>

                                {/* Test Input */}
                                <div className="mb-4">
                                  <label htmlFor="test" className="block text-sm font-medium text-gray-700 ">Test Name</label>
                                  <input
                                    autoComplete="off"
                                    type="text"
                                    id="test"
                                    className="w-full p-4 mt-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    placeholder="Enter test name"
                                    value={testName}
                                    onChange={(e) => setTestName(e.target.value)}
                                  />

                                  {/* Test Hints */}
                                  {testName.trim() !== '' && (
                                    <div className="mt-2 text-sm">
                                      {filteredTests.length > 0 ? (
                                        <ul ref={dropdownRef4} className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
                                          {filteredTests?.map((test, index) => (
                                            <li
                                              key={index}
                                              className="px-3 py-2 text-gray-800 cursor-pointer hover:bg-gray-200 focus:bg-gray-200 rounded-md transition-all duration-200 ease-in-out"
                                              onClick={() => {
                                                handleTestSelect(test)
                                              }} // Use handler to select test hint
                                            >
                                              {test.test_name || 'No Test'}
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <span></span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center">
                                  <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    disabled={addTestLoading}
                                  >
                                    {addTestLoading ? 'Adding...' : 'Add'}
                                  </button>
                                </div>

                                {/* Error Message */}
                                {/* {testError && <p className="text-red-500 text-center mt-2">{testError}</p>} */}
                              </form>
                            </div>
                          </div>
                        </div>



                        {/* Test Report Section */}
                        <TestReport 
                          appointment_details={appointment_details}
                        />
                        {/* <div className="flex justify-center items-center">
                          <button
                            onClick={() =>
                              navigate("/admin/doctor_panel/report", { state: { af_id: appointment_details.af_id, date: appointment_details.date } })
                            }
                            className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                          >View Reports</button>
                        </div> */}
                        </div>

                        <PatientTestList patientTestList={patientTestList} handleTestInputChange={handleTestInputChange}  handleDeleteTest={handleDeleteTest} handlePatientHandleSelect={handlePatientHandleSelect} filteredTestsMap={filteredTestsMap} testInputValues={testInputValues}/>
   
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorPanel;
