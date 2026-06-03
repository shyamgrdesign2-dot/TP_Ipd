import React, { useEffect, useState, useRef } from "react";
import {
  Routes,
  Route,
  useSearchParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { isMobile, isChrome, isSafari } from "react-device-detect";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "./config";

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
  FROM_NATIVE_APP,
  PERSISTANT_STORAGE_KEY_AUTH_TOKEN,
  PERSISTANT_STORAGE_KEY_BILL_TOKEN,
  PERSISTANT_STORAGE_KEY_MEDECO_TOKEN,
} from "./utils/constants";
import { useLocalStorage } from "./utils/localStorage";
import { isProdEnv, isProdLikeEnvironment } from "./utils/environment";
import {
  getNormalizedPhoneNumber,
  syncPhoneAndCheckZydusAccountUser,
} from "./utils/zydusAccountRouting";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./common/ErrorFallback";
import TalkativeWidget from "./components/TalkativeWidget";
import SmartRxDigitise from "./pages/SmartRxDigitise";
import DemoExpirationBanner from "./common/DemoExpirationBanner";
import PlanExpirationBanner from "./common/PlanExpirationBanner";
import DoctorModal from "./common/DoctorModal";
import ExpiredPlanCard from "./common/ExpiredPlanCard";
import ApolloConsultations from "./pages/apolloConsultations/ApolloConsultations";
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
import PrintPreviewCrossReferral from "./pages/ipd/assessmentForm/PrintPreviewCrossReferral";
import DischargedPatients from "./pages/ipd/inPatients/DischargedPatients";
import IntimateDischarge from "./pages/ipd/inPatients/IntimateDischarge";
import ApproveToDischargePatients from "./pages/ipd/inPatients/ApproveToDischargePatients";
import IpdAddNewPatient from "./pages/ipd/addNewPatient/IpdAddNewPatient";
import CreateAdmission from "./pages/ipd/createAdmission/CreateAdmission";
import IPDSnapRx from "./pages/ipd/snapRx/SnapRx";
import IPDSnapRxDigitise from "./pages/ipd/snapRx/SnapRxDigitise";
import IPDSnapRxPreview from "./pages/ipd/snapRx/SnapRxPreview";
import IPDUploadRx from "./pages/ipd/snapRx/uploadRx";
import WardAndBedManagement from "./pages/ipd/wardAndBedManagement/WardAndBedManagement";
import IpdBillingHistory from "./pages/ipd/billing/IpdBillingHistory";


const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: config?.GROWTHBOOK_CLIENTKEY,
  enableDevMode: !isProdLikeEnvironment(),
});

function App() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const authToken = searchParams.get("authToken");
  const redirectTo = searchParams.get("redirectTo");
  const uploadParams = searchParams.get("uploadParams");
  const medecoToken = searchParams.get("medecoToken");
  const fromNative = searchParams.get("fromNative");
  const navigate = useNavigate();
  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );

  const [getMedecoToken, setMedecoToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_MEDECO_TOKEN
  );
  const [_, setFromNativeFlag] = useLocalStorage(FROM_NATIVE_APP)

  const isLoginPage = location.pathname === "/login";
  const isRootPath = location.pathname === "/";
  const token = getToken();
  
  // State to track if initial redirect check is complete
  // This prevents Routes from rendering the catch-all before we process redirectTo
  const [initialRedirectChecked, setInitialRedirectChecked] = useState(false);
  
  // Use ref to track if redirectTo has been processed (prevents re-runs)
  const redirectToProcessed = useRef(false);
  // Store redirectTo in ref so it persists even after URL changes
  const redirectToRef = useRef(null);

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
    if (medecoToken) {
      setMedecoToken(medecoToken);
    }
    if (fromNative) {
      setFromNativeFlag(fromNative)
    }
  }, []);
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
        const phoneNumber = decodedToken?.result?.mobile_no;
        growthbook?.setAttributes({
          doctorId: decodedToken?.result?.doctor_unique_id,
          id: `${decodedToken?.result?.user_id}`,
          hos_business_id: `${decodedToken?.result?.hospital_business_id}`,
          doctor_phone: phoneNumber,
          doctor_phone_normalized: getNormalizedPhoneNumber(phoneNumber),
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  useEffect(() => {
    const logoutZydusUserFromNormalProd = async () => {
      if (!isProdEnv() || isLoginPage || isReceptionist) return;

      const token = authToken || getToken();
      if (!token) return;

      try {
        const decodedToken = jwtDecode(token);
        const phoneNumber = decodedToken?.result?.mobile_no;
        if (!phoneNumber) return;

        const isZydusAccountUser =
          await syncPhoneAndCheckZydusAccountUser(growthbook, phoneNumber);

        if (isZydusAccountUser) {
          handleLogout();
        }
      } catch (error) {
        console.error("Error checking Zydus account user:", error);
      }
    };

    logoutZydusUserFromNormalProd();
  }, [authToken, isLoginPage, isReceptionist, location.pathname]);

  useEffect(() => {
    // Handle authToken in URL
    if (authToken) {
      setToken(authToken);
      localStorage.removeItem(PERSISTANT_STORAGE_KEY_BILL_TOKEN);

      // If redirectTo exists, don't navigate - let redirectTo handler process it first
      if (redirectTo) {
        return;
      }

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
  }, [authToken, setToken, navigate, redirectTo, location.pathname, location.search, isReceptionist]);

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

  // Handle redirectTo parameter - HIGHEST PRIORITY
  // This runs FIRST and blocks Routes rendering until complete
  useEffect(() => {
    // Store redirectTo in ref when it first appears (before URL changes)
    if (redirectTo && !redirectToRef.current) {
      redirectToRef.current = redirectTo;
    }
    
    // Only process if redirectTo exists (from URL or ref) and hasn't been processed yet
    const currentRedirectTo = redirectTo || redirectToRef.current;
    if (currentRedirectTo && !redirectToProcessed.current) {
      redirectToProcessed.current = true;
      
      // Extract path and query params from redirectTo
      // redirectTo format: "ipd/create-admission?patientData=eyJwbV9m="
      const [path, queryString] = currentRedirectTo.split("?");
      const redirectPath = path.startsWith("/") ? path : `/${path}`;
      
      // Check if we're already on the target path (prevent infinite loops)
      if (location.pathname === redirectPath) {
        redirectToRef.current = null; // Clear ref after successful navigation
        redirectToProcessed.current = false; // Reset flag
        setInitialRedirectChecked(true);
        return;
      }
      
      // Navigate to the redirect path
      if (queryString) {
        navigate(
          {
            pathname: redirectPath,
            search: `?${queryString}`,
          },
          { replace: true }
        );
      } else {
        navigate(redirectPath, { replace: true });
      }
      
      return;
    }
    
    // No redirectTo to process, allow Routes to render
    setInitialRedirectChecked(true);
  }, [redirectTo, navigate, location.pathname]);

  // Handle /ipd route - redirect to /ipd/inPatients if directly accessed
  useEffect(() => {
    // Skip if redirectTo is being processed (check both URL param and ref)
    if (redirectTo || redirectToRef.current || redirectToProcessed.current) {
      return;
    }
    
    // If directly navigating to /ipd, redirect to /ipd/inPatients
    if (location.pathname === "/ipd") {
      navigate("/ipd/inPatients", { replace: true });
      return;
    }
  }, [location.pathname, navigate, redirectTo]);

  // Determine where to redirect on root path (only if redirectTo is not present)
  useEffect(() => {
    // Skip if redirectTo is being processed (check both URL param and ref)
    if (redirectTo || redirectToRef.current || redirectToProcessed.current) {
      return;
    }
    
    // Skip redirection for receptionist or non-relevant paths
    if (isReceptionist || (!isRootPath && !isLoginPage)) {
      return;
    }

    // Check authentication
    const hasAuth = token || authToken;

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

    // Authenticated users - redirect to default IPD page
    if (isChrome || isSafari) {
      navigate("/ipd/inPatients");
    }
  }, [isRootPath, token, authToken, navigate, redirectTo, isReceptionist, isLoginPage]);

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
            {/* Don't render Routes until initial redirect check is complete */}
            {/* This prevents the catch-all route from firing before redirectTo is processed */}
            {!initialRedirectChecked ? null : (
            <Routes>
              {/* Public route */}
              {/* <Route path="/login" element={<AuthContainer />} /> */}
              <Route path="/login" element={<Onboarding />} />
              <Route path="/our-offerings" element={<OurOffering />} />
              <Route path="/final-setup" element={<FinalSetup />} />

              {/* Restricted route - authorized only to get/upload snapRx files */}
              <Route path="snap-rx/mobile-upload" element={<UploadRx />} />
              <Route path="ipd/snap-rx/mobile-upload" element={<IPDUploadRx />} />

              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
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
                <Route path="ipd/snap-rx" element={<IPDSnapRx />} />
                <Route path="ipd/snap-rx/preview" element={<IPDSnapRxPreview />} />
                <Route path="ipd/snap-rx/digitise" element={<IPDSnapRxDigitise />} />
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
                  <Route index element={<Navigate to="/ipd/inPatients" replace />} />
                  <Route path="inPatients" element={<InPatients />} />
                  <Route path="approveToDischagePatients" element={<ApproveToDischargePatients />} />
                  <Route path="dischargedPatients" element={<DischargedPatients />} />
                  <Route path="intimate-discharge" element={<IntimateDischarge />} />
                  <Route path="add-admission" element={<AddAdmission />} />
                  <Route path="patient-admission" element={<PatientAdmission />} />
                  <Route path="ward-bed-management" element={<WardAndBedManagement />} />
                  <Route path="billing-history" element={<IpdBillingHistory />} />
                </Route>
                <Route path="ipd/create-admission" element={<CreateAdmission />} />
                <Route path="ipd/add-new-patient" element={<IpdAddNewPatient />} />
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
                  path="ipd/progress-notes/preview"
                  element={<PreviewProgressNotes />}
                />
                <Route
                  path="ipd/cross-referral/preview"
                  element={<PrintPreviewCrossReferral />}
                />
                <Route
                  path="ipd/cross-referral/configure-print-settings"
                  element={<PrintSettings />}
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
                  path="ipd/progress-notes/configure-print-settings"
                  element={<PrintSettings />}
                />
              </Route>
              <Route path="opd-bill" element={<OpdBill />} />
              <Route path="/*" element={<Navigate to="/ipd/inPatients" replace />} />
            </Routes>
            )}
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </GrowthBookProvider>
  );
}

export default App;
