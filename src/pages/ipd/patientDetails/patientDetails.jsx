import React, { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { IPD } from "../../../utils/locale";
import {
  formatDateToShortMonthYear,
  getPatientInformation,
  getTokenData,
  transformAdmissionToPatient,
} from "../../../utils/utils";
import { AnimatePresence } from "framer-motion";
import "./styles.scss";
import AssessmentsForm from "../assessmentForm/AssessmentsForm";
import ToolbarActions from "../components/ToolbarActions/ToolbarActions";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getAssessmentsData,
  resetAssessmentForm,
  setAdditionalNotesData,
  setChiefComplaint,
  setCustomModules,
  setFunctionalAssessmentData,
  setGynecHistoryData,
  setHistoryOfPresentIllness,
  setLabResults,
  setPhysicalExaminationBasicData,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
  setReferredDocForReview,
  setTopInformant,
  setTreatmentPlanData,
  setVitalsData,
} from "../../../redux/ipd/assessmentsFormSlice";
import {
  setMedicalHistoryData,
  setMedicationData,
  clearMedicationData,
  resetPrescriptionData,
} from "../../../redux/prescriptionSlice";
import { addObstetricDetails } from "../../../redux/obstetricSlice";
import { getConsultantNotes } from "../../../redux/ipd/consultantNotesSlice";
import ConsultantNotesTimeline from "../consultantNotes/ConsultantNotesTimeline";
import LabResults from "../labResults/LabResults";
import ProgressNotesView from "../progressNotes/progressNotesView/progressNotesView";
import { getProgressNotes } from "../../../redux/ipd/progressNotesSlice";
import {
  getOtNotesData,
  resetOtNotesForm,
  resetOtNotesToInitialState,
} from "../../../redux/ipd/otNotesSlice";
import MedicalRecords from "../medicalRecords/IPDMedicalRecords";
import { Drawer, Spin, message } from "antd";
import UploadDocument from "../../medicalRecords/UploadDocument";
import { getAllPatientDocs } from "../medicalRecords/utils.js/helper";
import VisitMedicalRecords from "../../medicalRecords/components/visitMedicalRecords/VisitMedicalRecords";
import OtNotesTimeline from "../otNotes/OtNotesTimeline";
import { useAssessmentSectionVisibility } from "../../../hooks/useAssessmentSectionVisibility";
import CrossReferralTimeline from "../crossReferral/CrossReferralTimeline";
import {
  getCrossReferralData,
  resetCrossReferralForm,
} from "../../../redux/ipd/crossReferralSlice";
import { getPrintSettings } from "../../../redux/ipd/printSettingsSlice";
import {
  getDischargeSummaryData,
  resetActualDischargeSummaryData,
  resetDischargeSummaryData,
  resetDischargeSummaryToInitialState,
  setProvisionalDiagnosis,
} from "../../../redux/ipd/dischargeSummarySlice";
import { addDischargeDataToStore } from "../../../utils/dischargeDataMapper";
import PreviewDischargeSummary from "../dischargeSummary/PreviewDischargeSummary";
import DischargeSummaryReadonly from "../dischargeSummary/DischargeSummaryReadonly";
import FullPageLoader from "../../vaccination/components/Loader";
import useOnlyViewMode from "../../../hooks/useOnlyViewMode";
import PatientDetails from "../../PatientDetails";
import { downloadModule, printModule } from "../utils/printDownload";
import usePrintPreviewSetup from "../../../hooks/usePrintPreviewSetup";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import AdmissionBilling from "../admissionBilling/AdmissionBilling";
import BillingHeaderActions from "../admissionBilling/BillingHeaderActions";
import { fetchAdvanceSetting } from "../../opdBilling/service";
import { setAdvancedSettings } from "../../../redux/billingSlice";
import { fetchActivityLogs } from "../../../redux/ipd/inPatientsSlice";
import ActivityLogs from "./components/ActivityLogs";

const PatientDetailsLayout = createRemoteComponent("PatientDetailsLayout");

const IPDPatientDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    isEditable = true,
    patient_data,
    patientDetails,
    activeTab,
    fromTab,
  } = state || {};

  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails || {};

  const { hasAnyData: hasAnyAssessmentData } = useAssessmentSectionVisibility();

  const { assessmentsData } = useSelector((state) => state.assessment);
  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const {
    otNotesData,
    filteredOtNotesData,
    currentFilterRange: otNotesFilterRange,
  } = useSelector((state) => state.otNotes);
  const { progressNotes, filteredProgressNotes, currentFilterRange } =
    useSelector((state) => state.progressNotes);
  const { medicalRecords } = useSelector((state) => state.medicalRecords);
  const { crossReferralData } = useSelector((state) => state.crossReferral);
  const { dischargeSummaryData, actualDischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { printSettings } = useSelector((state) => state.printSettings);
  const { activityLogs } = useSelector((state) => state.inPatients || {});
  console.log('INTEL ==> activityLogs', activityLogs)
  const { frequencyList, timingList } = useSelector((state) => state.doctors);
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState("assessment");
  const [patientData, setPatientData] = useState(null);
  const [shouldOpenCreateBill, setShouldOpenCreateBill] = useState(false);
  const isOnlyViewMode = useOnlyViewMode();

  // Medical records states
  const [uploadDocDrawer, setUploadDocDrawer] = useState(false);
  const [medicalReportDrawer, setMedicalReportDrawer] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [isEditDocument, setIsEditDocument] = useState(false);
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [shouldShowUploadDocPopup, setShowUploadDocPopup] = useState(false);
  const dischargeSummaryReadonlyRef = useRef(null);
  const [user_id, setUserId] = useState(null);
  const [totalAdvanceBalance, setTotalAdvanceBalance] = useState(null);
  const [shouldOpenAddAdvance, setShouldOpenAddAdvance] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!patientDetails || !admissionId) {
      navigate("/ipd/inPatients", { replace: true });
    }
  }, [patientDetails, admissionId]);

  useEffect(() => {
    const { user_id } = getTokenData();
    setUserId(user_id);
  }, []);

  const handleAddAssessmentClick = (isEmpty = false) => {
    if (isEmpty) {
      dispatch(resetAssessmentForm());
      dispatch(setMedicationData([]));
      dispatch(setMedicalHistoryData([]));
      dispatch(setLabResults([]));
      dispatch(addObstetricDetails([]));
    }
    navigate("/ipd/patient-details/assessment-form", {
      state: {
        patient_data,
        patientDetails,
        fromTab,
        isEditable: true,
      },
    });
  };

  const handleAddConsultantNotesClick = () => {
    navigate("/ipd/patient-details/consultant-notes", {
      state: {
        patient_data,
        patientDetails,
        fromTab,
      },
    });
  };

  const handleAddOtNotesClick = () => {
    dispatch(resetOtNotesForm());
    // TODO: INTEL - RESET ALL THE DATA IN THE OT NOTES FORM
    navigate("/ipd/patient-details/ot-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        fromTab,
        isNew: true,
      },
    });
  };

  const handleAddCrossReferralClick = () => {
    dispatch(resetCrossReferralForm());
    navigate("/ipd/patient-details/cross-referral", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        fromTab,
      },
    });
  };

  const handleDischargeSummaryClick = () => {
    // dispatch(resetCrossReferralForm());
    navigate("/ipd/patient-details/discharge-summary", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        activeMenuItem,
        fromTab,
      },
    });
  };

  const handleBillingClick = () => {
    setActiveMenuItem("billing");
    setShouldOpenCreateBill(true);
  };

  usePrintPreviewSetup();

  useEffect(() => {
    if (patientId) {
      getAllPatientDocs(patientId, admissionId, "medical_records");
    }
  }, [patientId]);

  // Drawer Medical Report
  const handleDrawerMedicalReport = () => {
    setMedicalReportDrawer(!medicalReportDrawer);
  };

  // Drawer Upload Document
  const handleDrawerUploadDoc = () => {
    setUploadDocDrawer(!uploadDocDrawer);
  };

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const handleUploadDocPopup = () => {
    setShowUploadDocPopup((prev) => !prev);
  };

  const handleMedicalRecordsClick = () => {
    handleDrawerUploadDoc();
    // navigate("/ipd/patient-details/medical-records", {
    //   state: {
    //     patient_data,
    //     patientDetails,
    //     isEditable: true,
    //   },
    // });
  };

  const handleProgressNotesClick = () => {
    navigate("/ipd/patient-details/progress-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        fromTab,
      },
    });
  };

  useEffect(() => {
    const data = {
      fullName: patientDetails?.details?.name,
      gender: patientDetails?.details?.gender,
      age: patientDetails?.details?.age,
      wardBedNumber: `${patientDetails?.ward?.title} - ${patientDetails?.room?.title}`,
      consultant: patientDetails?.doctor?.name,
      admittedOn: formatDateToShortMonthYear(patientDetails?.admittedOn),
    };
    setPatientData(data);
  }, [patientDetails]);
  // Set active menu item based on activeTab parameter
  useEffect(() => {
    if (activeTab) {
      setActiveMenuItem(activeTab);
    }
  }, [activeTab]);

  const addDataToStore = (data) => {
    if (data) {
      // Chief Complaint
      dispatch(setChiefComplaint(data?.basicInfo?.presentingComplaints || []));
      dispatch(setTopInformant(data?.basicInfo?.topInformant || null));

      // History of Present Illness
      dispatch(
        setHistoryOfPresentIllness(
          data?.basicInfo?.historyOfPresentIllness || []
        )
      );

      // Medication
      dispatch(setMedicationData(data?.basicInfo?.medications || []));

      // Lab Results
      dispatch(setLabResults(data?.basicInfo?.labResults || []));

      // Medical History
      dispatch(
        setMedicalHistoryData(data?.basicInfo?.pastMedicalHistory || [])
      );

      // Gynec History
      dispatch(setGynecHistoryData(data?.basicInfo?.gyneacHistory || []));

      // Obstetric History
      dispatch(addObstetricDetails(data?.basicInfo?.obstetricHistory || []));

      // Physical Examination Vitals Data
      dispatch(setVitalsData(data?.physicalExamination?.vitals || {}));

      dispatch(setProvisionalDiagnosis(data?.provisionalDiagnosis || []));

      // Physical Examination Others Data
      dispatch(
        setPhysicalExaminationOthersData(
          data?.physicalExamination?.others || []
        )
      );

      // Physical Examination Basic Data
      dispatch(
        setPhysicalExaminationBasicData(
          data?.physicalExamination?.examination || {}
        )
      );

      // Functional Assessment Data
      const functionalAssessmentWithoutReferredDoc = {
        ...data?.functionalAssessment,
      };
      delete functionalAssessmentWithoutReferredDoc.referredToPhysiotherapyForReview;
      dispatch(
        setFunctionalAssessmentData(
          functionalAssessmentWithoutReferredDoc || {}
        )
      );

      // Treatment Plan Data
      dispatch(setTreatmentPlanData(data?.treatmentPlan || {}));

      // Additional Notes Data
      dispatch(setAdditionalNotesData(data?.additionalNotes || {}));

      // Referred Doc For Review
      dispatch(
        setReferredDocForReview(
          data?.functionalAssessment?.referredToPhysiotherapyForReview || null
        )
      );

      // Custom Modules
      dispatch(setCustomModules(data?.customModules || []));
    }
  };

  const getAdvanceSettings = async () => {
    const advanceSettingsResponse = await fetchAdvanceSetting();
    if (advanceSettingsResponse) {
      dispatch(setAdvancedSettings(advanceSettingsResponse));
    }
  };

  useEffect(() => {
    // Handle billing separately as it doesn't require patientId/admissionId for advance settings
    if (activeMenuItem === "billing") {
      getAdvanceSettings();
      setIsLoading(false);
      return;
    }

    if (!patientId || !admissionId) return;

    if (activeMenuItem === "assessment") {
      dispatch(getAssessmentsData({ patientId, admissionId }))
        .then((res) => {
          if (!res?.payload?.assessment) return;
          addDataToStore(res.payload.assessment);
        })
        .then(() => {
          setIsLoading(false);
        });
    } else if (activeMenuItem === "consultantNotes") {
      dispatch(getConsultantNotes({ patientId, admissionId }))
        .catch((error) => {
          console.error("Error fetching consultant notes:", error);
        })
        .then(() => {
          setIsLoading(false);
        });
    } else if (activeMenuItem === "progress") {
      dispatch(getProgressNotes({ patientId, admissionId }))
        .catch((error) => {
          console.error("Error fetching progress notes:", error);
        })
        .then(() => {
          setIsLoading(false);
        });
    } else if (activeMenuItem === "otNotes") {
      dispatch(getOtNotesData({ patientId, admissionId }))
        .catch((error) => {
          console.error("Error fetching OT notes:", error);
        })
        .then(() => {
          setIsLoading(false);
        });
    } else if (activeMenuItem === "crossReferral") {
      dispatch(getCrossReferralData({ patientId, admissionId }))
        .catch((error) => {
          console.error("Error fetching Cross Referral notes:", error);
        })
        .then(() => {
          setIsLoading(false);
        });
    } else if (activeMenuItem === "records") {
      // if (patient_data.patient_unique_id) {
      //   getAllPatientDocs( patient_data.patient_unique_id , admissionId, "medical_records");
      // }
      // dispatch(getProgressNotes({ patientId, admissionId })).catch(
      //   (error) => {
      //     console.error("Error fetching progress notes:", error);
      //   }
      // );
      setIsLoading(false);
    } else if (activeMenuItem === "dischargeSummary") {
      dispatch(getDischargeSummaryData({ patientId, admissionId }))
        .then((res) => {
          addDischargeDataToStore(res.payload, dispatch);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching discharge summary:", error);
        });
    } else if (activeMenuItem === "opd") {
      setIsLoading(false);
    } else if (activeMenuItem === "activityLogs") {
      dispatch(fetchActivityLogs({ admissionId }))
        .unwrap()
        .catch(() => {
          message.error("Failed to fetch activity logs");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [activeMenuItem, admissionId, patientId, dispatch]);

  const handleEmptyCtaClick = {
    assessment: () => handleAddAssessmentClick(true),
    otNotes: handleAddOtNotesClick,
    consultantNotes: handleAddConsultantNotesClick,
    progress: handleProgressNotesClick,
    records: handleMedicalRecordsClick,
    crossReferral: handleAddCrossReferralClick,
    dischargeSummary: handleDischargeSummaryClick,
    billing: handleBillingClick,
  };

  const patientDetailsMenu = () => {
    return IPD.PATIENT_DETAILS_MENU.map((item) => {
      return {
        ...item,
        ctaClick: handleEmptyCtaClick?.[item.id],
        isActive: item.id === activeTab,
        showAddOption: !isOnlyViewMode,
      };
    });
  };

  const isDataPresent = useMemo(() => {
    if (
      activeMenuItem === "assessment" &&
      (!!assessmentsData || hasAnyAssessmentData)
    ) {
      return Object.keys(assessmentsData || {})?.length > 0;
    } else if (
      activeMenuItem === "otNotes" &&
      Array.isArray(otNotesData) &&
      otNotesData.length > 0
    ) {
      return true;
    } else if (activeMenuItem === "crossReferral") {
      return !!crossReferralData?.length;
    } else if (activeMenuItem === "dischargeSummary") {
      // return !!dischargeSummaryData && !!dischargeSummaryData.patientInformation && Object.keys(dischargeSummaryData.patientInformation).length > 0;
      return true;
    } else if (activeMenuItem === "consultantNotes") {
      return !!consultantNotes?.length;
    } else if (activeMenuItem === "progress") {
      return !!progressNotes?.length;
    } else if (activeMenuItem === "records") {
      return !!medicalRecords?.length;
    } else if (activeMenuItem === "labResults") {
      return true;
    } else if (activeMenuItem === "opd") {
      return true;
    } else if (activeMenuItem === "activityLogs") {
      return !isLoading || !!activityLogs?.data?.length;
    } else if (activeMenuItem === "billing") {
      return true;
    }
    return false;
  }, [
    assessmentsData,
    otNotesData,
    activeMenuItem,
    consultantNotes,
    progressNotes,
    hasAnyAssessmentData,
    crossReferralData,
    medicalRecords,
    dischargeSummaryData,
    activityLogs,
    isLoading,
  ]);

  const onRequestClose = () => {
    dispatch(resetOtNotesForm());
    dispatch(resetCrossReferralForm());
    dispatch(resetActualDischargeSummaryData());
    dispatch(resetDischargeSummaryToInitialState());
    dispatch(resetDischargeSummaryData());
    if (fromTab === "inPatients") {
      navigate("/ipd/inPatients");
    } else if (fromTab === "dischargedPatients") {
      navigate("/ipd/dischargedPatients");
    } else if (fromTab === "dischargeQueue") {
      navigate("/ipd/approveToDischagePatients");
    } else {
      navigate(`/ipd/inPatients`, {});
    }
  };
  const handleCustomizeClick = () => {
    if (activeMenuItem === "dischargeSummary") {
      navigate("/ipd/discharge-summary/configure-print-settings", {
        state: {
          patientDetails,
          moduleType: "dischargeSummary",
          data: actualDischargeSummaryData,
        },
      });
    } else if (activeMenuItem === "consultantNotes") {
      navigate("/ipd/consultant-notes/configure-print-settings", {
        state: {
          patientDetails,
          moduleType: "consultationNotes",
          data: consultantNotes,
        },
      });
    } else if (activeMenuItem === "progress") {
      navigate("/ipd/progress-notes/configure-print-settings", {
        state: {
          patientDetails,
          moduleType: "progressNotes",
          data: {
            patientInformation: getPatientInformation(patientDetails),
            progressNotes: progressNotes,
          },
        },
      });
    } else if (activeMenuItem === "crossReferral") {
      navigate("/ipd/cross-referral/configure-print-settings", {
        state: {
          patientDetails,
          moduleType: "crossReferral",
          data: crossReferralData,
        },
      });
    } else if (activeMenuItem === "otNotes") {
      navigate("/ipd/ot-notes/configure-print-settings", {
        state: {
          patientDetails,
          moduleType: "otNotes",
          data: otNotesData,
        },
      });
    } else if (activeMenuItem === "assessment") {
      navigate("/ipd/admission-assessment/configure-print-settings", {
        state: {
          patientDetails,
          moduleType: "assessments",
          data: assessmentsData,
        },
      });
    }
  };
  // console.log("INTEL ==> patientDetails", patientDetails);
  // console.log('INTEL ==> TRANSFORMED PATIENT DETAILS', transformAdmissionToPatient(patientDetails))
  const onHandleSelect = (id) => {
    if (activeMenuItem === id) {
      return;
    }
    setActiveMenuItem(id);
    setIsLoading(true);
    if (id === "dischargeSummary" || id === "opd") {
      dispatch(resetAssessmentForm());
      dispatch(resetDischargeSummaryToInitialState());
      dispatch(resetPrescriptionData());
      dispatch(resetOtNotesToInitialState());
    } else if (id === "consultantNotes") {
      dispatch(resetAssessmentForm());
    } else if (id === "assessment") {
      dispatch(resetAssessmentForm());
      dispatch(resetDischargeSummaryToInitialState());
    }
    navigate("/ipd/patient-details", {
      state: {
        patientDetails,
        fromTab,
        patient_data:
          id === "opd"
            ? transformAdmissionToPatient(patientDetails)
            : patient_data,
        // patient_data: {
        //   pm_salutation: "",
        //   pm_fullname: "Neel",
        //   pm_id: 74954,
        //   pm_pid: "PAT0729",
        //   pm_contact_no: "1760506186",
        //   patient_unique_id: 424553645634,
        //   pm_gender: "Male",
        //   ageDays: 28,
        //   ageMonths: 0,
        //   ageYears: 26,
        //   pm_dob: "1999-10-02",
        //   tpml_refrence_id: "EXT1001012399",
        //   pm_address: "",
        //   pm_area: "",
        //   pm_city: "",
        //   pm_state: "",
        //   pm_pincode: "",
        //   pm_blood_group: "A+",
        //   category: null,
        //   lastVisitDate: "2025-10-17",
        //   pm_first_name: "Neel",
        // },
        isEditable: false,
        activeTab: id,
      },
      replace: true,
    });
  };

  const handleDischargeSummaryPrintPreview = () => {
    navigate("/ipd/discharge-summary/preview", {
      state: {
        patientDetails,
      },
    });
  };

  const handleCrossReferralPrintPreview = () => {
    navigate("/ipd/cross-referral/preview", {
      state: {
        patientDetails,
      },
    });
  };

  const handleAssessmentPrintPreview = () => {
    navigate("/ipd/admission-assessment/preview", {
      state: {
        patientDetails,
      },
    });
  };

  const handleOTNotesPrintPreview = () => {
    const previewData = getOtNotesDataForOutput();
    if (
      hasActiveOtNotesFilter &&
      (!Array.isArray(previewData) || previewData.length === 0)
    ) {
      message.warning(
        "No OT notes found for the selected date range to preview."
      );
      return;
    }
    navigate("/ipd/ot-notes/preview", {
      state: {
        patientDetails,
        fromTab,
        otNotesData: previewData,
        filterRange: otNotesFilterRange,
      },
    });
  };

  const handleConsultantNotesPrintPreview = () => {
    navigate("/ipd/consultant-notes/preview", {
      state: {
        patientDetails,
      },
    });
  };

  const getProgressNotesDataForOutput = () => {
    const baseData = Array.isArray(progressNotes) ? progressNotes : [];
    const filteredData = Array.isArray(filteredProgressNotes)
      ? filteredProgressNotes
      : [];
    const hasActiveFilter =
      currentFilterRange?.startDate && currentFilterRange?.endDate;
    return hasActiveFilter ? filteredData : baseData;
  };

  const hasActiveOtNotesFilter =
    otNotesFilterRange?.startDate && otNotesFilterRange?.endDate;

  const getOtNotesDataForOutput = () => {
    if (hasActiveOtNotesFilter) {
      return Array.isArray(filteredOtNotesData) ? filteredOtNotesData : [];
    }
    return otNotesData;
  };

  const handleProgressNotesPrintPreview = () => {
    const previewData = getProgressNotesDataForOutput();
    const hasActiveFilter =
      currentFilterRange?.startDate && currentFilterRange?.endDate;

    if (hasActiveFilter && previewData.length === 0) {
      message.warning(
        "No progress notes found for the selected date range to preview."
      );
      return;
    }

    navigate("/ipd/progress-notes/preview", {
      state: {
        patientDetails,
        fromTab,
        progressNotesData: previewData,
        filterRange: currentFilterRange,
      },
    });
  };

  const handleProgressNotesPrint = async () => {
    const notesToPrint = getProgressNotesDataForOutput();
    const hasActiveFilter =
      currentFilterRange?.startDate && currentFilterRange?.endDate;

    if (hasActiveFilter && notesToPrint.length === 0) {
      message.warning(
        "No progress notes found for the selected date range to print."
      );
      return;
    }

    try {
      await printModule(
        "progressNotes",
        printSettings,
        patientDetails,
        notesToPrint
      );
    } catch (error) {
      console.error("Error printing progress notes:", error);
    }
  };

  const handleProgressNotesDownload = async () => {
    const notesToDownload = getProgressNotesDataForOutput();
    const hasActiveFilter =
      currentFilterRange?.startDate && currentFilterRange?.endDate;

    if (hasActiveFilter && notesToDownload.length === 0) {
      message.warning(
        "No progress notes found for the selected date range to download."
      );
      return;
    }

    try {
      await downloadModule(
        "progressNotes",
        printSettings,
        patientDetails,
        notesToDownload
      );
    } catch (error) {
      console.error("Error downloading progress notes:", error);
    }
  };

  // Assessment: print & download
  const handleAssessmentPrint = async () => {
    try {
      await printModule(
        "assessments",
        printSettings,
        patientDetails,
        assessmentsData,
        frequencyList,
        timingList
      );
    } catch (error) {
      console.error("Error printing assessment:", error);
    }
  };

  const handleAssessmentDownload = async () => {
    try {
      await downloadModule(
        "assessments",
        printSettings,
        patientDetails,
        assessmentsData,
        frequencyList,
        timingList
      );
    } catch (error) {
      console.error("Error downloading assessment:", error);
    }
  };

  // Consultant Notes: print & download
  const handleConsultantNotesPrint = async () => {
    try {
      let notes = consultantNotes;
      if (!Array.isArray(notes) || notes.length === 0) {
        try {
          const res = await dispatch(
            getConsultantNotes({ patientId, admissionId })
          );
          notes = res?.payload || notes;
        } catch (e) {
          console.error("Error fetching consultant notes before print:", e);
        }
      }
      await printModule(
        "consultationNotes",
        printSettings,
        patientDetails,
        notes,
        frequencyList,
        timingList
      );
    } catch (error) {
      console.error("Error printing consultant notes:", error);
    }
  };

  const handleConsultantNotesDownload = async () => {
    try {
      let notes = consultantNotes;
      if (!Array.isArray(notes) || notes.length === 0) {
        try {
          const res = await dispatch(
            getConsultantNotes({ patientId, admissionId })
          );
          notes = res?.payload || notes;
        } catch (e) {
          console.error("Error fetching consultant notes before download:", e);
        }
      }
      await downloadModule(
        "consultationNotes",
        printSettings,
        patientDetails,
        notes,
        frequencyList,
        timingList
      );
    } catch (error) {
      console.error("Error downloading consultant notes:", error);
    }
  };

  // OT Notes: print & download
  const handleOTNotesPrint = async () => {
    const otNotesToPrint = getOtNotesDataForOutput();
    if (
      hasActiveOtNotesFilter &&
      (!Array.isArray(otNotesToPrint) || otNotesToPrint.length === 0)
    ) {
      message.warning(
        "No OT notes found for the selected date range to print."
      );
      return;
    }
    try {
      await printModule(
        "otNotes",
        printSettings,
        patientDetails,
        otNotesToPrint
      );
    } catch (error) {
      console.error("Error printing OT notes:", error);
    }
  };

  const handleOTNotesDownload = async () => {
    const otNotesToDownload = getOtNotesDataForOutput();
    if (
      hasActiveOtNotesFilter &&
      (!Array.isArray(otNotesToDownload) || otNotesToDownload.length === 0)
    ) {
      message.warning(
        "No OT notes found for the selected date range to download."
      );
      return;
    }
    try {
      await downloadModule(
        "otNotes",
        printSettings,
        patientDetails,
        otNotesToDownload
      );
    } catch (error) {
      console.error("Error downloading OT notes:", error);
    }
  };

  // Cross Referral: print & download
  const handleCrossReferralPrint = async () => {
    try {
      await printModule(
        "crossReferral",
        printSettings,
        patientDetails,
        crossReferralData
      );
    } catch (error) {
      console.error("Error printing cross referral:", error);
    }
  };

  const handleCrossReferralDownload = async () => {
    try {
      await downloadModule(
        "crossReferral",
        printSettings,
        patientDetails,
        crossReferralData
      );
    } catch (error) {
      console.error("Error downloading cross referral:", error);
    }
  };

  const renderContent = (activeItem) => {
    switch (activeItem?.id) {
      case "assessment":
        return (
          <>
            <div className="ipd-adm-assess-container-readable">
              <AssessmentsForm isEditable={isEditable} />
            </div>
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                showEditForm={!isOnlyViewMode}
                onEdit={() => handleAddAssessmentClick(false)}
                onPrintPreview={handleAssessmentPrintPreview}
                onPrint={handleAssessmentPrint}
                onSettings={handleCustomizeClick}
                onDownload={handleAssessmentDownload}
              />
            </div>
          </>
        );
      case "progress":
        return (
          <div className="ipd-progress-notes-view-container">
            <ProgressNotesView
              progressNotes={progressNotes}
              filteredProgressNotes={filteredProgressNotes}
              patientDetails={patientDetails}
              fromTab={fromTab}
            />
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                showEditForm={false}
                // onEdit={handleAddAssessmentClick}
                onPrintPreview={handleProgressNotesPrintPreview}
                onPrint={handleProgressNotesPrint}
                onSettings={handleCustomizeClick}
                onDownload={handleProgressNotesDownload}
              />
            </div>
          </div>
        );
      case "consultantNotes":
        return (
          <div className="ipd-adm-assess-container-readable">
            <ConsultantNotesTimeline />
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                showEditForm={false}
                onPrintPreview={handleConsultantNotesPrintPreview}
                onPrint={handleConsultantNotesPrint}
                onSettings={handleCustomizeClick}
                onDownload={handleConsultantNotesDownload}
              />
            </div>
          </div>
        );
      case "labResults":
        return (
          <div className="ipd-adm-assess-container-readable">
            <LabResults />
          </div>
        );
      case "records":
        return (
          <div className="ipd-adm-assess-container-readable">
            <VisitMedicalRecords
              isIPDFlow={true}
              ipdRecords={medicalRecords}
              filesData={medicalRecords}
              setUploadDocDrawer={setUploadDocDrawer}
              setFilesData={setFilesData}
              handleUploadDocPopup={handleUploadDocPopup}
              setIsEditDocument={setIsEditDocument}
              handleDrawerUploadDoc={handleDrawerUploadDoc}
              patientId={patientId}
              admissionId={admissionId}
            />
          </div>
        );
      case "otNotes":
        return (
          <div className="ipd-adm-assess-container-readable">
            <OtNotesTimeline />
            <div className="ipd-toolbar-edit-custom-print-download no-edit">
              <ToolbarActions
                showEditForm={false}
                onEdit={handleAddOtNotesClick}
                onPrintPreview={handleOTNotesPrintPreview}
                onPrint={handleOTNotesPrint}
                onSettings={handleCustomizeClick}
                onDownload={handleOTNotesDownload}
              />
            </div>
          </div>
        );
      case "crossReferral":
        return (
          <div className="ipd-adm-assess-container-readable">
            <CrossReferralTimeline />
            <div className="ipd-toolbar-edit-custom-print-download no-edit">
              <ToolbarActions
                showEditForm={false}
                onEdit={handleAddCrossReferralClick}
                onPrintPreview={handleCrossReferralPrintPreview}
                onPrint={handleCrossReferralPrint}
                onSettings={handleCustomizeClick}
                onDownload={handleCrossReferralDownload}
              />
            </div>
          </div>
        );
      case "dischargeSummary":
        const isAdmittingDoctor = patientDetails?.doctorId === user_id;
        // const showOnlyEditForm = !isAdmittingDoctor && !patientDetails?.isDischarged;
        const showOnlyEditForm = false;
        return (
          <div className="ipd-adm-assess-container-readable ipd-discharge-summary-container-readable">
            <DischargeSummaryReadonly ref={dischargeSummaryReadonlyRef} />
            {Object.keys(actualDischargeSummaryData)?.length && (
              <div
                className={`ipd-toolbar-edit-custom-print-download ${
                  showOnlyEditForm
                    ? "ipd-toolbar-edit-custom-print-download-discharge"
                    : ""
                }`}
              >
                <ToolbarActions
                  editBtnText={"Edit Summary"}
                  showOnlyEditForm={showOnlyEditForm}
                  showEditForm={!isOnlyViewMode}
                  onEdit={handleDischargeSummaryClick}
                  onPrintPreview={handleDischargeSummaryPrintPreview}
                  onPrint={() => {
                    dischargeSummaryReadonlyRef?.current?.handlePrintClick();
                  }}
                  onSettings={handleCustomizeClick}
                  onDownload={async () => {
                    try {
                      const currentSettings = printSettings?.dischargeSummary;
                      if (!currentSettings) return;
                      await downloadModule(
                        "dischargeSummary",
                        printSettings,
                        patientDetails,
                        actualDischargeSummaryData
                      );
                    } catch (e) {
                      console.error("Error downloading discharge summary:", e);
                    }
                  }}
                />
              </div>
            )}
          </div>
        );
      case "opd":
        return (
          // <div className="ipd-adm-assess-container-readable ipd-discharge-summary-container-readable">
          //   <DischargeSummaryReadonly ref={dischargeSummaryReadonlyRef} />
          //   {Object.keys(actualDischargeSummaryData)?.length && (
          //     <div className="ipd-toolbar-edit-custom-print-download">
          //       <ToolbarActions
          //         editBtnText={"Edit Summary"}
          //         showEditForm={!isOnlyViewMode}
          //         onEdit={handleDischargeSummaryClick}
          //         onPrintPreview={handleDischargeSummaryPrintPreview}
          //         onPrint={() => {
          //           dischargeSummaryReadonlyRef?.current?.handlePrintClick();
          //         }}
          //         onSettings={handleCustomizeClick}
          //         onDownload={() => console.log("Download")}
          //       />
          //     </div>
          //   )}
          // </div>
          <PatientDetails isIPD={true} />
          // <div>hello</div>
        );
      case "activityLogs":
        return <ActivityLogs logs={activityLogs?.data || []} />;
      case "billing":
        return (
          <AdmissionBilling
            patientDetails={patientDetails}
            patient_data={patientDetails || patient_data}
            fromTab={fromTab}
            shouldOpenCreateBill={shouldOpenCreateBill}
            onDrawerOpened={() => setShouldOpenCreateBill(false)}
            totalAdvanceBalance={totalAdvanceBalance}
            onTotalAdvanceBalanceChange={setTotalAdvanceBalance}
            shouldOpenAddAdvance={shouldOpenAddAdvance}
            onAddAdvanceDrawerOpened={() => setShouldOpenAddAdvance(false)}
          />
        );
      default:
        return null;
    }
  };

  const renderLoader = () => {
    return (
      <div className="patient-details-form-loader">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 22 }} spin />} />
      </div>
    );
  };

  const canShowAddCTA = useMemo(() => {
    if (isOnlyViewMode) return false;
    return (
      IPD.PATIENT_DETAILS_MENU.find((item) => item.id === activeMenuItem)
        ?.showAddCTA && isDataPresent
    );
  }, [activeMenuItem, isDataPresent]);

  const contentHeaderActions = () => {
    if (activeMenuItem === "billing") {
      const patientDataForHeader = patientDetails || patient_data;

      return (
        <BillingHeaderActions
          patientData={patientDataForHeader}
          totalAdvanceBalance={totalAdvanceBalance}
          onTotalAdvanceBalanceChange={setTotalAdvanceBalance}
          onAddAdvanceClick={() => setShouldOpenAddAdvance(true)}
          currentAdmissionId={patientDetails?.admissionId}
          patientDetails={patientDetails}
        />
      );
    }
    return null;
  };

  return (
    <div>
      <Suspense
        fallback={
          <>
            <FullPageLoader />
          </>
        }
      >
        <AnimatePresence mode="wait">
          {open && !!patientData && (
            <PatientDetailsLayout
              key="patient-details"
              items={patientDetailsMenu()}
              onHandleSelect={onHandleSelect}
              onRequestClose={onRequestClose}
              fullName={patientData.fullName}
              gender={patientData.gender}
              age={patientData.age}
              wardBedNumber={patientData.wardBedNumber}
              consultant={patientData.consultant}
              admittedOn={patientData.admittedOn}
              renderContent={
                isDataPresent ? renderContent : isLoading ? renderLoader : null
              }
              // renderContent={renderLoader}
              showAddCTA={canShowAddCTA}
              contentHeaderActions={contentHeaderActions}
            />
          )}
          {uploadDocDrawer && (
            <Drawer
              closeIcon={false}
              placement="right"
              bodyStyle={{ backgroundColor: "white" }}
              onClose={handleDeletePopup}
              open={uploadDocDrawer}
              className="modalWidth-700"
              width="auto"
              push={false}
            >
              <UploadDocument
                onClose={handleDeletePopup}
                handleDrawerUploadDoc={handleDrawerUploadDoc}
                shouldShowDeletePopup={shouldShowDeletePopup}
                setShowDeletePopup={setShowDeletePopup}
                filesData={filesData}
                setFilesData={setFilesData}
                isEditDocument={isEditDocument}
                setIsEditDocument={setIsEditDocument}
                patientData={patientData}
                patient_data_naviagte={patient_data}
                patientDetails={patientDetails}
                handleUploadDocPopup={() =>
                  setShowUploadDocPopup((prev) => !prev)
                }
                // isAppointmentData={true}
                isIPDMedicalRecords={true}
                fromTab={fromTab}
                patientId={patientId}
                admissionId={admissionId}
                overrideDocumentOptions={[
                  { label: "Prescription", value: "prescription" },
                  { label: "Radiology", value: "radiology" },
                  { label: "Pathology", value: "pathology" },
                  { label: "Other", value: "other" },
                ]}
              />
            </Drawer>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default IPDPatientDetails;
