import React, { useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { isTablet } from 'react-device-detect';

import AppointmentList from "./pages/AppointmentList";
import PatientDetails from "./pages/PatientDetails";
import Prescription from "./pages/Prescription";

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
    if (pathname == '/tab_app/' && authToken) {
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
            <Route path="prescription" element={isTablet ? <TabPrescription /> : <Prescription />} />
            <Route path="add-patient" element={isTablet ? <TabPrescription /> : <Prescription />} />
            <Route path="prescription_print_view" element={<PrescriptionPrintView />} />
          </Routes>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
