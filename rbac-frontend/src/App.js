
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import All_Appointments from './pages/All_Appointments';
import PrivateRoute from './components/PrivateRoute';
import Todays_Appointments from './pages/Todays_Appointments';
import MedicineEatingInstruction from './pages/MedicineEatingInstruction';
import FoodEatingInstruction from './pages/FoodEatingInstruction';
import NextSuggestion from './pages/NextSuggestion';
import MedicineType from './pages/MedicineType';
import Examination from './pages/Examination';
import OptionsPage from './pages/OptionPage';
import Template from './pages/Template';
import Hint from './pages/Hint';
import PatientHistory from './pages/PatientHistory';
import PrecisionComponent from './pages/Precibsion';
import ManageTestList from './pages/ManageTestLIst';
import PatientAppointmentEdit from './pages/PatientAppointmentEdit';
import PatientDetail from './pages/PatientDetail';
import Online_Patient_Appointments from './pages/Online_Patient_Appointment';
import OnlinePatientAppointEdit from './pages/OnlinePatientAppointEdit';
import Structure from './pages/Structure';
import ChangePassword from './pages/ChangePassword';

const items = [
    {
      id: 1,
      name: "Fever",
      subOptions: [
        {
          id: 1,
          name: "Cold",
          subOptions: [
            { id: 1, name: "Dry Cough", subOptions: [] },
            { id: 2, name: "Wet Cough", subOptions: [] },
          ],
        },
        { id: 2, name: "Boils", subOptions: [] },
      ],
    },
    {
      id: 2,
      name: "Cold",
      subOptions: [
        { id: 1, name: "Runny Nose", subOptions: [] },
        {
          id: 2,
          name: "Congestion",
          subOptions: [{ id: 1, name: "Severe Congestion", subOptions: [] }],
        },
      ],
    },
    {
      id: 3,
      name: "Pain in Head",
      subOptions: [],
    },
  ];

  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin/doctor_panel" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/appointments/all" 
          element={
            <PrivateRoute>
              <All_Appointments />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/appointments/today" 
          element={
            <PrivateRoute>
              <Todays_Appointments />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/appointments/edit" 
          element={
            <PrivateRoute>
              <PatientAppointmentEdit />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/settings/medicines" 
          element={
            <PrivateRoute>
              <Medicines />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/settings/medicine-eating-instructions" 
          element={
            <PrivateRoute>
              <MedicineEatingInstruction />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/settings/food-eating-instructions" 
          element={
            <PrivateRoute>
              <FoodEatingInstruction />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/settings/next-suggestion" 
          element={
            <PrivateRoute>
              <NextSuggestion />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/settings/medicine-type" 
          element={
            <PrivateRoute>
              <MedicineType />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/settings/examination" 
          element={
            <PrivateRoute>
              <Examination />
            </PrivateRoute>
          } 
        />
        <Route path="/admin/doctor_panel/examinations/:id/options" element={
          <PrivateRoute>
          <OptionsPage />
          </PrivateRoute>
        } />
        <Route 
          path="/admin/doctor_panel/settings/add-pre-template" 
          element={
            <PrivateRoute>
              <Template />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/hints/manage-hints" 
          element={
            <PrivateRoute>
              <Hint />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/patients/history" 
          element={
            <PrivateRoute>
              <PatientHistory />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/precibsion" 
          element={
            <PrivateRoute>
              <PrecisionComponent />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/settings/manage-test-list" 
          element={
            <PrivateRoute>
              <ManageTestList />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/edit-patient-detail" 
          element={
            <PrivateRoute>
              <PatientDetail />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/online-patient-appointments" 
          element={
            <PrivateRoute>
              <Online_Patient_Appointments />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/online_patient/edit" 
          element={
            <PrivateRoute>
              <OnlinePatientAppointEdit />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/website-setting/question-tree" 
          element={
            <PrivateRoute>
              <Structure/>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/doctor_panel/profile/change-password" 
          element={
            <PrivateRoute>
              <ChangePassword/>
            </PrivateRoute>
          } 
        />        
        <Route path="*" element={<Navigate to="/admin/doctor_panel" />} />
      </Routes>
    </Router>
  );
}

export default App;
