import React, { useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { isMobile } from "react-device-detect";

import AppointmentList from "./pages/AppointmentList";
import PatientDetails from "./pages/PatientDetails";
import Prescription from "./pages/Prescription";
import SmartPrescription from "./pages/SmartPrescription";
import SmartRxPreview from "./pages/SmartRxPreview";

import { store, persistor } from "./redux/store";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "./utils/constants";
import { useLocalStorage } from "./utils/localStorage";
import PrescriptionPrintView from "./pages/PrescriptionPrintView";
import TabPrescription from "./pages/tab_design/TabPrescription";
import ConfigurePrintSetting from "./pages/ConfigurePrintSetting";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./common/ErrorFallback";
import Vaccination from "./pages/vaccination/Vaccination";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  // this param needs to be changed as needed
  const authToken = searchParams.get("authToken");

  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname == "/" && authToken) {
      setToken(authToken);
    }
  }, [window.location.pathname, authToken]);

  return (
    <>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error) => {
          // You can also log the error to an error reporting service like AppSignal
          // logErrorToMyService(error, errorInfo);
          console.error(error);
        }}
        onReset={(details) => {
          // Reset the state of your app so the error doesn't happen again
          console.error(details);
        }}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes>
              <Route path="/*" element={<AppointmentList />} />
              <Route path="/vaccination" element={<Vaccination />} />
              <Route path="patient_details" element={<PatientDetails />} />
              <Route
                path="prescription"
                element={isMobile ? <TabPrescription /> : <Prescription />}
              />
              <Route
                path="smart-prescription"
                element= {<SmartPrescription />}
              />
              <Route
                path="/print-smart-rx"
                element={<SmartRxPreview />}
              />
              <Route
                path="prescription_print_view"
                element={<PrescriptionPrintView />}
              />
              <Route
                path="configure_print_setting"
                element={<ConfigurePrintSetting />}
              />
            </Routes>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </>
  );
}

export default App;
