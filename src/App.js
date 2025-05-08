import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { isMobile } from "react-device-detect";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { jwtDecode } from "jwt-decode";
import config from "./config";

import AppointmentList from "./pages/AppointmentList";
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
import MessageCreateCampaign from "./pages/MessageCreateCampaign";

import { store, persistor } from "./redux/store";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "./utils/constants";
import { useLocalStorage } from "./utils/localStorage";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./common/ErrorFallback";
import TalkativeWidget from "./components/TalkativeWidget";
import SmartRxDigitise from "./pages/SmartRxDigitise";
import DemoExpirationBanner from "./common/DemoExpirationBanner";
import PlanExpirationBanner from "./common/PlanExpirationBanner";
import DoctorModal from "./common/DoctorModal";
import ExpiredPlanCard from "./common/ExpiredPlanCard";
import ApolloConsultations from "./pages/apolloConsultations/ApolloConsultations";
import AuthContainer from "./pages/auth/auth";
import GenRxPrescriptionPrintView from "./pages/GenRxPrescriptionPrintView";
import BillingDashboard from "./pages/opdBilling/components/billingDashboard/BillingDashboard";
import BillingSettings from "./pages/opdBilling/components/advanceBillSettings/BillingSettings";
import AllPatients from "./pages/allPatients.js/AllPatients";
import AddAppointment from "./pages/addAppointment/AddAppointment";
import { checkAccountStatus } from './pages/auth/authService';
import PrivateRoute from "./pages/auth/components/PrivateRoute";
import Onboarding from "./pages/onBoarding/components/Onboarding";
import OnboardingWrapper from "./components/userOnboarding";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: config?.GROWTHBOOK_CLIENTKEY,
  enableDevMode: process.env.REACT_APP_ENV !== "prod",
});

function App() {
  const [searchParams] = useSearchParams();
  const authToken = searchParams.get("authToken");
  const location = useLocation();
  const navigate = useNavigate();
  const [getToken, setToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  
  const isLoginPage = location.pathname === "/login";
  const isRootPath = location.pathname === "/";
  const token = getToken();

  const urlParams = new URLSearchParams(window.location.search);
  const isReceptionist = urlParams.has("receptionist");

  const openUrlsSilently = async (urls) => {
    return Promise.all(
      urls.map(async (url) => {
        try {
          const response = await fetch(url, { method: 'GET', mode: 'no-cors' });
          return { url, status: 'success' };
        } catch (error) {
          return { url, status: 'error', error };
        }
      })
    );
  };

  const handleLogout = async () => {
  
    const urlsToOpen = [
      config.pedia_logout_url,
      config.tatvaAi_logout_url,
    ];

    try {
      if (window.isLoggingOut) return;
      window.isLoggingOut = true;

      const statuses = await openUrlsSilently(urlsToOpen);
      console.log("URL statuses:", statuses);
  
      const allSuccessful = statuses.every(({ status }) => status === "success");
      if (!allSuccessful) {
        console.warn("Some logout URLs failed:", statuses);
      }

      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login"; 

    } catch (error) {
      console.error("Error during logout:", error);
      window.location.href = "/login";
    } finally {
      window.isLoggingOut = false;
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = getToken();
      if (token && !isLoginPage && !isReceptionist) {
        try {
          const decoded = jwtDecode(token);
          const phoneNumber = decoded?.result?.mobile_no;
          const doctorUniqueId = decoded?.result?.doctor_unique_id;
          
          if (phoneNumber && doctorUniqueId) {
            const response = await checkAccountStatus(phoneNumber, doctorUniqueId);
            if (response?.account_status === false) { 
              handleLogout();
            }
          }
        } catch (e) {
          console.error("Error checking account status:", e);
        }
      }
    };

    checkUserStatus();

    const intervalId = setInterval(checkUserStatus, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [location.pathname]);

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
    // Handle authToken in URL
    if (authToken) {
      setToken(authToken);
      
      // Clean up URL but preserve other params
      const params = new URLSearchParams(location.search);
      if (!isReceptionist) {
        params.delete("authToken");

        // Navigate to appointment list
        navigate(
          {
            pathname: "/",
            search: params.toString(),
          },
          { replace: true }
        );
      }
      
    }
  }, [authToken, setToken, navigate]);

  // Determine where to redirect on root path
  useEffect(() => {
    if (isRootPath) {
      const hasAuth = token || authToken;
      if (!hasAuth) {
        navigate("/login");
      }
    }
  }, [isRootPath, token, authToken, navigate]);

  return (
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
        <TalkativeWidget
          region="au"
          configUuid="3f5d31d7-aae5-43f2-903a-2dc2d90a36f3"
        />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {!isLoginPage && (
              <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
              }}>
                {/* <DemoExpirationBanner /> */}
                <PlanExpirationBanner />
                <ExpiredPlanCard />
                <DoctorModal />
              </div>
            )}
            <OnboardingWrapper />
            <Routes>
              {/* Public route */}
              {/* <Route path="/login" element={<AuthContainer />} /> */}
              <Route path="/login" element={<Onboarding />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/*" element={<AppointmentList />} />
                <Route path="create-campaign" element={<MessageCreateCampaign />} />
                <Route path="patient_details" element={<PatientDetails />} />
                <Route
                  path="prescription"
                  element={isMobile ? <TabPrescription /> : <Prescription />}
                />
                <Route
                  path="prescription_print_view"
                  element={<PrescriptionPrintView />}
                />
                <Route
                  path="configure_print_setting"
                  element={<ConfigurePrintSetting />}
                />
                <Route path="certificate" element={<MedicalCertificate />} />
                <Route
                  path="certificate_print_view"
                  element={<CertificatePrintView />}
                />
                <Route
                  path="smart-prescription"
                  element={<SmartPrescription />}
                />
                <Route path="print-smart-rx" element={<SmartRxPreview />} />
                <Route path="doctor_profile" element={<DoctorProfile />} />
                <Route
                  path="doctor_website_setting"
                  element={<DoctorWebsiteSetting />}
                />
                <Route path="smart-rx-digitise" element={<SmartRxDigitise />} />
                <Route path="apollo-consultations" element={<ApolloConsultations />} />
                <Route path="gen-rx-print" element={<GenRxPrescriptionPrintView />} />
                <Route path="billing-dashboard" element={<BillingDashboard />} />
                <Route path="all_patients" element={<AllPatients />} />
                <Route path="billing-settings" element={<BillingSettings />} />
                <Route path="add-appointment" element={<AddAppointment />} />
              </Route>
            </Routes>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </GrowthBookProvider>
  );
}

export default App;