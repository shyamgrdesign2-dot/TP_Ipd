import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';

import AppointmentList from "./pages/AppointmentList";
import PatientDetails from "./pages/PatientDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<AppointmentList />} />
        <Route path="patient_details" element={<PatientDetails />} />
      </Routes>
    </>
  );
}

export default App;
