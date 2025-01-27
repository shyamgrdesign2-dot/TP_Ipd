import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { isMobile } from "react-device-detect";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { jwtDecode } from "jwt-decode";
import config from "./config";
import { store, persistor } from "./redux/store";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "./utils/constants";
import { useLocalStorage } from "./utils/localStorage";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./common/ErrorFallback";
import TalkativeWidget from "./components/TalkativeWidget";
import DemoExpirationBanner from "./common/DemoExpirationBanner";
import PlanExpirationBanner from "./common/PlanExpirationBanner";
import DoctorModal from "./common/DoctorModal";
import ExpiredPlanCard from "./common/ExpiredPlanCard";
import { Spin } from "antd";

// Lazy loaded components
const AppointmentList = lazy(() => import("./pages/AppointmentList"));
const PatientDetails = lazy(() => import("./pages/PatientDetails"));
const Prescription = lazy(() => import("./pages/Prescription"));
const SmartPrescription = lazy(() => import("./pages/SmartPrescription"));
const SmartRxPreview = lazy(() => import("./pages/SmartRxPreview"));
const TabPrescription = lazy(() => import("./pages/tab_design/TabPrescription"));
const PrescriptionPrintView = lazy(() => import("./pages/PrescriptionPrintView"));
const ConfigurePrintSetting = lazy(() => import("./pages/ConfigurePrintSetting"));
const MedicalCertificate = lazy(() => import("./pages/MedicalCertificate"));
const CertificatePrintView = lazy(() => import("./pages/CertificatePrintView"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile"));
const DoctorWebsiteSetting = lazy(() => import("./pages/DoctorWebsiteSetting"));
const MessageCreateCampaign = lazy(() => import("./pages/MessageCreateCampaign"));
const SmartRxDigitise = lazy(() => import("./pages/SmartRxDigitise"));
const ApolloConsultations = lazy(() => import("./pages/apolloConsultations/ApolloConsultations"));
const AuthContainer = lazy(() => import("./pages/auth/auth"));
const GenRxPrescriptionPrintView = lazy(() => import("./pages/GenRxPrescriptionPrintView"));

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

  const isLoginPage = location.pathname === "/login"; // Check if the current path is "/login"

  useEffect(() => {
    // Load features asynchronously when the app renders
    growthbook?.init({ streaming: true });
    const token = authToken || getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        growthbook?.setAttributes({
          doctorId: decodedToken?.result?.doctor_unique_id,
          id: `${decodedToken?.result?.user_id}`,
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

      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      ); // Ensure the URL is cleaned up, removing authToken
    }
  }, [authToken, setToken, navigate, location]);

  return (
    <GrowthBookProvider growthbook={growthbook}>
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={console.error} onReset={console.error}>
      <TalkativeWidget region="au" configUuid="3f5d31d7-aae5-43f2-903a-2dc2d90a36f3" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {!isLoginPage && (
            <>
              <DemoExpirationBanner />
              <PlanExpirationBanner />
              <ExpiredPlanCard />
              <DoctorModal />
            </>
          )}
          <Suspense fallback={<Spin className="d-flex justify-content-center align-items-center mt-5" />}>
            <Routes>
              <Route path="/*" element={<AppointmentList />} />
              <Route path="create-campaign" element={<MessageCreateCampaign />} />
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
              <Route path="apollo-consultations" element={<ApolloConsultations />} />
              <Route path="gen-rx-print" element={<GenRxPrescriptionPrintView />} />
              <Route path="/login" element={<AuthContainer />} />
            </Routes>
          </Suspense>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </GrowthBookProvider>
  );
}

export default App;
