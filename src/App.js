import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';

import AppointmentList from "./pages/AppointmentList";
import PatientDetails from "./pages/PatientDetails";
import Prescription from "./pages/Prescription";
import AddNewPatient from "./pages/AddNewPatient";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<AppointmentList />} />
        <Route path="patient_details" element={<PatientDetails />} />
        <Route path="Prescription" element={<Prescription />} />
        <Route path="AddNew_Patient" element={<AddNewPatient />} />
      </Routes>
    </>
  );
}

export default App;
