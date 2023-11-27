import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import AppointmentList from "./pages/AppointmentList";
import PatientDetails from "./pages/PatientDetails";
import Prescription from "./pages/Prescription";
import AddNewPatient from "./pages/AddNewPatient";
import Testing from "./pages/Testing";
import { store, persistor } from "./redux/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/*" element={<AppointmentList />} />
            <Route path="patient_details" element={<PatientDetails />} />
            <Route path="Prescription" element={<Prescription />} />
            <Route path="testing" element={<Testing />} />
            <Route path="AddNew_Patient" element={<AddNewPatient />} />
          </Routes>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
