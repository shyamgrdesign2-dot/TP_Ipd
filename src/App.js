import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';

import AppointmentList from "./pages/AppointmentList";
import PatientDetails from "./pages/PatientDetails";
import Prescription from "./pages/Prescription";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<AppointmentList />} />
        <Route path="patient_details" element={<PatientDetails />} />
        <Route path="Prescription" element={<Prescription />} />
      </Routes>
    </>
  );
}

export default App;
