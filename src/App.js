import React, { useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import AppointmentList from "./pages/AppointmentList";
import PatientDetails from "./pages/PatientDetails";
import Prescription from "./pages/Prescription";
import AddNewPatient from "./pages/AddNewPatient";
import Testing from "./pages/Testing";
import { store, persistor } from "./redux/store";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "./utils/constants";
import { useLocalStorage } from "./utils/localStorage";
import PrescriptionPrintView from "./pages/PrescriptionPrintView";
import TabPrescription from "./pages/tab_design/TabPrescription";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  // this param needs to be changed as needed
  const authToken = searchParams.get("authToken");

  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );

  useEffect(() => {
    const pathname = window.location.pathname;
    if(pathname === '/' && authToken) {
      setToken(authToken);
    }
  }, [window.location.pathname, authToken]);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/*" element={<AppointmentList />} />
            <Route path="patient_details" element={<PatientDetails />} />
            <Route path="Prescription" element={<Prescription />} />
            <Route path="tab_prescription" element={<TabPrescription />} />
            <Route path="prescription_print_view" element={<PrescriptionPrintView />} />
            <Route path="testing" element={<Testing />} />
            <Route path="AddNew_Patient" element={<AddNewPatient />} />
          </Routes>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
