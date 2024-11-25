import React, { useEffect } from "react";
import { Routes, Route, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { isMobile } from "react-device-detect";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { jwtDecode } from "jwt-decode";
import config from "./config";

import AppointmentList from "./pages/AppointmentList";
import MessagesList from "./pages/MessagesList";
import PatientDetails from "./pages/PatientDetails";
import Prescription from "./pages/Prescription";
import SmartPrescription from "./pages/SmartPrescription";
import SmartRxPreview from "./pages/SmartRxPreview";
import TabPrescription from "./pages/tab_design/TabPrescription";
import PrescriptionPrintView from "./pages/PrescriptionPrintView";
import ConfigurePrintSetting from "./pages/ConfigurePrintSetting";
import MedicalCertificate from "./pages/MedicalCertificate";
import CertificatePrintView from "./pages/CertificatePrintView";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorWebsiteSetting from "./pages/DoctorWebsiteSetting";

import { store, persistor } from "./redux/store";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "./utils/constants";
import { useLocalStorage } from "./utils/localStorage";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./common/ErrorFallback";
import TalkativeWidget from "./components/TalkativeWidget";
import SmartRxDigitise from "./pages/SmartRxDigitise";
import DemoExpirationBanner from "./common/DemoExpirationBanner";
import PlanExpirationBanner from "./common/PlanExpirationBanner";
import SubscriptionDetails from "./components/SubscriptionDetails";
import DoctorModal from "./common/DoctorModal";
import ExpiredPlanCard from "./common/ExpiredPlanCard";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: config?.GROWTHBOOK_CLIENTKEY,
  enableDevMode: process.env.REACT_APP_ENV !== "prod",
});

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  // this param needs to be changed as needed
  const authToken = searchParams.get("authToken");
  const location = useLocation();

  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Load features asynchronously when the app renders
    growthbook?.init({ streaming: true });
    const token = authToken || getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        growthbook?.setAttributes({
          doctorId: decodedToken?.result?.doctor_unique_id,
          id: `${decodedToken?.result?.user_id}`
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  useEffect(() => {
    const pathname = window.location.pathname;

    if (pathname == "/" && authToken) {
      // Set the token in local storage
      setToken(authToken);

      // Remove the authToken from the URL
      const params = new URLSearchParams(location.search);
      params.delete("authToken");

      navigate({
        pathname: location.pathname,
        search: params.toString(),
      }, { replace: true }); // Ensure the URL is cleaned up, removing authToken
    }
  }, [authToken, setToken, navigate, location]);

  return (
    <>
      <GrowthBookProvider growthbook={growthbook}>
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
          <TalkativeWidget region="au" configUuid="3f5d31d7-aae5-43f2-903a-2dc2d90a36f3" />
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <DemoExpirationBanner/>
              <PlanExpirationBanner/>
              <ExpiredPlanCard />
              <DoctorModal />
              <Routes>
                <Route path="/*" element={<AppointmentList />} />
                <Route path="bulk_messages" element={<MessagesList />} />
                <Route path="patient_details" element={<PatientDetails />} />
                <Route path="prescription" element={isMobile ? <TabPrescription /> : <Prescription />} />
                <Route path="prescription_print_view" element={<PrescriptionPrintView />} />
                <Route path="configure_print_setting" element={<ConfigurePrintSetting />} />
                <Route path="certificate" element={<MedicalCertificate />} />
                <Route path="certificate_print_view" element={<CertificatePrintView />} />
                <Route path="smart-prescription" element={<SmartPrescription />} />
                <Route path="print-smart-rx" element={<SmartRxPreview />} />
                <Route path="doctor_profile" element={<DoctorProfile />} />
                <Route path="doctor_website_setting" element={<DoctorWebsiteSetting />} />
                <Route path="smart-rx-digitise" element={<SmartRxDigitise />} />
              </Routes>
            </PersistGate>
          </Provider>
        </ErrorBoundary>
      </GrowthBookProvider>
    </>
  );
}

export default App;
