import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { isMobile, isChrome, isSafari } from "react-device-detect";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
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
import {
  PERSISTANT_STORAGE_KEY_AUTH_TOKEN,
  PERSISTANT_STORAGE_KEY_BILL_TOKEN,
  PERSISTANT_STORAGE_KEY_MEDECO_TOKEN,
} from "./utils/constants";
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
import { checkAccountStatus } from "./pages/auth/authService";
import PrivateRoute from "./pages/auth/components/PrivateRoute";
import GetUnlimitedAccess from "./pages/monetization/GetUnlimitedAccess";
import UpgradeServicesModal from "./pages/monetization/components/UpgradeServicesModal";
import Onboarding from "./pages/onBoarding/components/Onboarding";
import FinalSetup from "./pages/FinalSetup";
import OurOffering from "./pages/ourOffering/OurOffering";
import SnapRx from "./pages/snapRx/SnapRx";
import UploadRx from "./pages/uploadRx";
import BottomSheetManager from "./components/bottomSheetManager";
import SnapRxPreview from "./pages/snapRx/SnapRxPreview";
import SnapRxDigitise from "./pages/snapRx/SnapRxDigitise";
import AppointmentAgent from "./pages/appointmentAgent/AppointmentAgent";
import AppointmentSuccess from "./pages/appointmentAgent/components/AppointmentSuccess/AppointmentSuccess";
import OpdBill from "./pages/opdBilling/OpdBill";
import IPDPatientDetails from "./pages/ipd/patientDetails/patientDetails";
import AssessmentsForm from "./pages/ipd/assessmentForm/AssessmentsForm";
import InPatients from "./pages/ipd/inPatients/InPatients";
import OtNotes from "./pages/ipd/otNotes/OtNotes";
import HomePageLayout from "./pages/ipd/HomePageLayout";
import ConsultantNotes from "./pages/ipd/consultantNotes/ConsultantNotes";
import LabResults from "./pages/ipd/labResults/LabResults";
import ProgressNotes from "./pages/ipd/progressNotes/progressNotes";
import IPDMedicalRecords from "./pages/ipd/medicalRecords/IPDMedicalRecords";
import CrossReferral from "./pages/ipd/crossReferral/CrossReferral";
import CrossReferralConsultantNotes from "./pages/ipd/crossReferral/CrossReferralConsultantNotes";
import DischargeSummary from "./pages/ipd/dischargeSummary/DischargeSummary";
import PreviewDischargeSummary from "./pages/ipd/dischargeSummary/PreviewDischargeSummary";
import PreviewProgressNotes from "./pages/ipd/progressNotes/previewProgressNotes";
import ConfigurePrintSettings from "./pages/ipd/dischargeSummary/ConfigurePrintSettings";
import PatientAdmission from "./pages/ipd/patientAdmission/PatientAdmission";
import AddAdmission from "./pages/ipd/patientAdmission/AddAdmission";
import PrintPreview from "./pages/ipd/consultantNotes/PrintPreview";
import PrintSettings from "./pages/ipd/consultantNotes/PrintSettings";
import PreviewAdmissionAssessment from "./pages/ipd/assessmentForm/PreviewAdmissionAssessment";
import PrintPreviewOTNotes from "./pages/ipd/assessmentForm/PrintPreviewOTNotes";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: config?.GROWTHBOOK_CLIENTKEY,
  enableDevMode: process.env.REACT_APP_ENV !== "prod",
});

function App() {
  const [redirectReady, setRedirectReady] = useState(false);
  const [searchParams] = useSearchParams();
  const authToken = searchParams.get("authToken");
  const redirectTo = searchParams.get("redirectTo");
  const uploadParams = searchParams.get("uploadParams");
  const medecoToken = searchParams.get("medecoToken");
  const location = useLocation();
  const navigate = useNavigate();
  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );

  const [getMedecoToken, setMedecoToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_MEDECO_TOKEN
  );

  const isLoginPage = location.pathname === "/login";
  const isRootPath = location.pathname === "/";
  const token = getToken();

  const urlParams = new URLSearchParams(window.location.search);
  const isReceptionist = urlParams.has("receptionist");

  const openUrlsSilently = async (urls) => {
    return Promise.all(
      urls.map(async (url) => {
        try {
          const response = await fetch(url, { method: "GET", mode: "no-cors" });
          return { url, status: "success" };
        } catch (error) {
          return { url, status: "error", error };
        }
      })
    );
  };

  const handleLogout = async () => {
    const urlsToOpen = [config.pedia_logout_url, config.tatvaAi_logout_url];

    try {
      if (window.isLoggingOut) return;
      window.isLoggingOut = true;

      const statuses = await openUrlsSilently(urlsToOpen);
      console.log("URL statuses:", statuses);

      const allSuccessful = statuses.every(
        ({ status }) => status === "success"
      );
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
            const response = await checkAccountStatus(
              phoneNumber,
              doctorUniqueId
            );
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
    const isUserLocked = async () => {
      try {
        const decoded = jwtDecode(authToken);
        const phoneNumber = decoded?.result?.mobile_no;
        // Check document status
        const docResponse = await axios.get(
          `${config.user_management_api_url}/user/pm/info/status?mblNo=${phoneNumber}`,
          {
            headers: {
              api_key: config.api_key,
              api_secret_key: config.api_secret_key,
            },
          }
        );
        if (docResponse.data && docResponse.data.status === false) {
          if (location.pathname !== "/final-setup") {
            navigate("/final-setup?step=2&isAccountLocked=true");
          }
        }
      } catch (e) {
        console.error("Error checking account status:", e);
      }
    };

    authToken && !isReceptionist && isUserLocked();
  }, [location.pathname, navigate, authToken, isReceptionist]);

  useEffect(() => {
    if (isReceptionist) return;
    // Load features asynchronously when the app renders
    growthbook?.init({ streaming: true });
    const token = authToken || getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        growthbook?.setAttributes({
          doctorId: decodedToken?.result?.doctor_unique_id,
          id: `${decodedToken?.result?.user_id}`,
          hos_business_id: `${decodedToken?.result?.hospital_business_id}`,
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
      localStorage.removeItem(PERSISTANT_STORAGE_KEY_BILL_TOKEN);

      // Clean up URL but preserve other params
      const params = new URLSearchParams(location.search);
      if (!isReceptionist) {
        params.delete("authToken");
        // Navigate to appointment list
        // add condition for user comming from Medeco to practice offering page
        if (location.pathname !== "/our-offerings")
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

  useEffect(() => {
    if (uploadParams) {
      localStorage.setItem("uploadParams", uploadParams);
      // navigate(
      //   {
      //     pathname: location.pathname,
      //   },
      //   { replace: true }
      // );
    }
  }, [uploadParams]);

  // Add effect to handle redirectTo parameter
  useEffect(() => {
    if (redirectTo) {
      localStorage.setItem("redirectTo", redirectTo);

      // Clean up URL but preserve other params
      const params = new URLSearchParams(location.search);
      params.delete("redirectTo");
      setRedirectReady(true);
      // Update URL without the redirectTo parameter
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    } else {
      setRedirectReady(false);
    }
  }, []);

  // Determine where to redirect on root path
  useEffect(() => {
    // Skip redirection for receptionist or non-relevant paths
    if (isReceptionist || (!isRootPath && !isLoginPage)) {
      return;
    }

    // Check authentication and get stored redirect path
    const hasAuth = token || authToken;
    const localRedirectTo = localStorage.getItem("redirectTo");

    // Handle unauthenticated users
    if (!hasAuth) {
      const urlParams = new URLSearchParams(window.location.search);

      // Only collect UTM params that have values
      const utmParams = new URLSearchParams();
      [
        "utm_source",
        "utm_campaign",
        "utm_medium",
        "utm_content",
        "utm_term",
      ].forEach((param) => {
        const value = urlParams.get(param);
        if (value) {
          utmParams.append(param, value);
        }
      });

      // Construct login URL with UTM parameters
      const loginUrl =
        "/login" + (utmParams.toString() ? "?" + utmParams.toString() : "");

      navigate(loginUrl);
      return;
    }

    if (isChrome || isSafari) {
      // Determine and execute redirection
      const redirectPath =
        localRedirectTo === "profile"
          ? "/doctor_profile"
          : redirectReady
          ? localRedirectTo
          : "/";

      // Clean up localStorage if redirecting to profile
      if (localRedirectTo === "profile" || redirectReady) {
        localStorage.removeItem("redirectTo");
        setRedirectReady(false);
      }

      navigate(redirectPath);
    }
  }, [isRootPath, token, authToken, navigate, redirectTo, redirectReady]);

  //Upgraded Services Modal
  const upgrade_services = searchParams.get("upgrade_services");
  const service_list = searchParams.get("service_list");
  const [isUpgradeModal, setIsUpgradeModal] = useState(false);
  const [upgradeList, setUpgradeList] = useState(null);

  useEffect(() => {
    if (upgrade_services) {
      setIsUpgradeModal(true);
      setUpgradeList(service_list.split(",").map((s) => s.trim()));
      searchParams.delete("upgrade_services");
      searchParams.delete("service_list");
      navigate("/", { replace: true });
    }
  }, [upgrade_services]);

  const handleUpgradeModal = () => {
    setIsUpgradeModal(false);
  };

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
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 199,
                }}
              >
                <DemoExpirationBanner />
                <PlanExpirationBanner />
                <ExpiredPlanCard />
                <DoctorModal />
                <BottomSheetManager />
              </div>
            )}
            {isUpgradeModal && (
              <UpgradeServicesModal
                isUpgradeModal={isUpgradeModal}
                upgradeList={upgradeList}
                handleUpgradeModal={handleUpgradeModal}
              />
            )}
            <Routes>
              {/* Public route */}
              {/* <Route path="/login" element={<AuthContainer />} /> */}
              <Route path="/login" element={<Onboarding />} />
              <Route path="/our-offerings" element={<OurOffering />} />
              <Route path="/final-setup" element={<FinalSetup />} />

              {/* Restricted route - authorized only to get/upload snapRx files */}
              <Route path="snap-rx/mobile-upload" element={<UploadRx />} />

              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/*" element={<AppointmentList />} />
                <Route
                  path={`/ipd/patient-details`}
                  element={<IPDPatientDetails />}
                />
                <Route
                  path="/ipd/patient-details/assessment-form"
                  element={<AssessmentsForm />}
                />
                <Route
                  path="/ipd/patient-details/ot-notes"
                  element={<OtNotes />}
                />
                <Route
                  path="/ipd/patient-details/cross-referral"
                  element={<CrossReferral />}
                />
                <Route
                  path="/ipd/patient-details/cross-referral/consultant-notes"
                  element={<CrossReferralConsultantNotes />}
                />
                <Route
                  path="/ipd/patient-details/discharge-summary"
                  element={<DischargeSummary />}
                />
                <Route
                  path="/ipd/patient-details/progress-notes"
                  element={<ProgressNotes />}
                />
                <Route
                  path="/ipd/patient-details/consultant-notes"
                  element={<ConsultantNotes />}
                />
                <Route
                  path="/ipd/patient-details/lab-results"
                  element={<LabResults />}
                />
                {/* <Route
                  path="/ipd/patient-details/medical-records"
                  element={<IPDMedicalRecords />}
                /> */}
                <Route
                  path="create-campaign"
                  element={<MessageCreateCampaign />}
                />
                <Route path="patient_details" element={<PatientDetails />} />
                <Route
                  path="prescription"
                  // element={isMobile ? <TabMedicationBox /> : <MedicationsBox />}
                  element={isMobile ? <TabPrescription /> : <Prescription />}
                  // element={isMobile ? <TabPrescription /> : <Obstetric />}
                  // element={isMobile ? <TabPrescription /> : <ObstetricList />}
                  // element={isMobile ? <TabPrescription /> : <MedicalHistoryBox />}
                  // element={isMobile ? <TabPrescription /> : <MedicalHistoryList  />}
                  // element={isMobile ? <TabMedicationBox /> : <GynecHistoryList />}
                  // element={isMobile ? <TabMedicationBox /> : <LabParametersList />}
                  //   element={isMobile ? <TabMedicationBox /> : (
                  //     <>
                  //       <LabResultsTable showHeader={true} showSearchBar={false} />
                  //       <LabParams
                  //         // handleAddLabParamsDrawer={handleAddLabParamsDrawer}
                  //         // patient_unique_id={patient_data?.patient_unique_id}
                  //         onSave={() => {}}
                  //         // isBackModalOpen={isBackModalOpen}
                  //         // showHideBackModal={showHideBackModal}
                  //         // patientGender={patient_data?.pm_gender}
                  //       />
                  //     </>
                  // )}
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
                <Route
                  path="apollo-consultations"
                  element={<ApolloConsultations />}
                />
                <Route
                  path="gen-rx-print"
                  element={<GenRxPrescriptionPrintView />}
                />
                <Route
                  path="billing-dashboard"
                  element={<BillingDashboard />}
                />
                <Route path="all_patients" element={<AllPatients />} />
                <Route path="billing-settings" element={<BillingSettings />} />
                <Route path="add-appointment" element={<AddAppointment />} />
                <Route path="snap-rx" element={<SnapRx />} />
                <Route path="snap-rx/preview" element={<SnapRxPreview />} />
                <Route path="snap-rx/digitise" element={<SnapRxDigitise />} />
                <Route
                  path="get-unlimited-access"
                  element={<GetUnlimitedAccess />}
                />
                <Route
                  path="appointment-agent"
                  element={<AppointmentAgent />}
                />
                <Route
                  path="appointment-agent/success"
                  element={<AppointmentSuccess />}
                />
                <Route path="ipd" element={<HomePageLayout />}>
                  <Route path="inPatients" element={<InPatients />} />
                  <Route path="add-admission" element={<AddAdmission />} />
                  <Route path="patient-admission" element={<PatientAdmission />} />
                </Route>
                <Route
                  path="ipd/discharge-summary/preview"
                  element={<PreviewDischargeSummary />}
                />
                <Route
                  path="ipd/admission-assessment/preview"
                  element={<PreviewAdmissionAssessment />}
                />
                <Route
                  path="ipd/ot-notes/preview"
                  element={<PrintPreviewOTNotes />}
                />
                <Route
                  path="ipd/discharge-summary/configure-print-settings"
                  element={<ConfigurePrintSettings />}
                />
                <Route
                  path="ipd/consultant-notes/preview"
                  element={<PrintPreview />}
                />
                <Route
                  path="ipd/consultant-notes/configure-print-settings"
                  element={<PrintSettings />}
                />
                <Route
                  path="ipd/ot-notes/configure-print-settings"
                  element={<PrintSettings />}
                />
                <Route
                  path="ipd/admission-assessment/configure-print-settings"
                  element={<PrintSettings />}
                />
                <Route
                  path="ipd/progress-notes/preview"
                  element={<PreviewProgressNotes />}
                />
              </Route>
              <Route path="opd-bill" element={<OpdBill />} />
            </Routes>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </GrowthBookProvider>
  );
}

export default App;
