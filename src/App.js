import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppointmentList from "./pages/AppointmentList";
import PatientDetails from "./pages/PatientDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes path="/">
          <Route index element={<AppointmentList />} />
          <Route path="appointment_list" element={<AppointmentList />} />
          <Route path="patient_details" element={<PatientDetails />} />
        </Routes>
      </BrowserRouter>
      {/*  */}
    </>
  );
}

export default App;
