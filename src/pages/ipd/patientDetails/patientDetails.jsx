import React, { act, Suspense, useEffect, useMemo, useState } from "react";
import { IPD } from "../../../utils/locale";
import {
  formatDateToShortMonthYear,
  normalizeToDefault,
} from "../../../utils/utils";
import { AnimatePresence } from "framer-motion";
import "./styles.scss";
import AssessmentsForm from "../assessmentForm/AssessmentsForm";
import ToolbarActions from "../components/ToolbarActions/ToolbarActions";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setPatientDetailsInOldFormat } from "../../../redux/ipd/ipdSlice";
import {
  getAssessmentsData,
  setAdditionalNotesData,
  setChiefComplaint,
  setFunctionalAssessmentData,
  setGynecHistoryData,
  setHistoryOfPresentIllness,
  setLabResults,
  setPhysicalExaminationBasicData,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
  setReferredDocForReview,
  setTreatmentPlanData,
  setVitalsData,
} from "../../../redux/ipd/assessmentsFormSlice";
import {
  setMedicalHistoryData,
  setMedicationData,
  clearMedicationData,
} from "../../../redux/prescriptionSlice";
import { addObstetricDetails } from "../../../redux/obstetricSlice";
import { getConsultantNotes } from "../../../redux/ipd/consultantNotesSlice";
import ConsultantNotesTimeline from "../consultantNotes/ConsultantNotesTimeline";

const PatientDetailsLayout = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "PatientDetailsLayout")
  );
});

const IPDPatientDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    isEditable = true,
    patient_data,
    patientDetails,
    activeTab,
  } = state || {};

  const { assessmentsData } = useSelector((state) => state.assessment);
  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const [open, setOpen] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(
    IPD.PATIENT_DETAILS_MENU[0]
  );
  const dispatch = useDispatch();

  const handleAddAssessmentClick = () => {
    navigate("/ipd/patient-details/assessment-form", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  const handleAddConsultantNotesClick = () => {
    navigate("/ipd/patient-details/consultant-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  const handleOtNotesClick = () => {
    navigate("/ipd/patient-details/ot-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
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
      const menuItems = IPD.PATIENT_DETAILS_MENU;
      const targetItem = menuItems.find((item) => item.id === activeTab);
      if (targetItem) {
        setActiveMenuItem(targetItem);
      }
    }
  }, [activeTab]);

  const addDataToStore = (data) => {
    if (data) {
      // Chief Complaint
      dispatch(setChiefComplaint(data?.basicInfo?.chiefComplaint || []));

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

      // Physical Examination Provisional Diagnosis
      dispatch(
        setPhysicalExaminationProvisionalDiagnosisData(
          data?.physicalExamination?.provisionalDiagnosis || []
        )
      );

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
      dispatch(setFunctionalAssessmentData(data?.functionalAssessment || {}));

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
    }
  };

  useEffect(() => {
    if (activeMenuItem) {
      // Clear medication data when switching between forms to avoid data bleeding
      dispatch(clearMedicationData());

      switch (activeMenuItem.id) {
        case "assessment":
          dispatch(
            getAssessmentsData({ patientId: patientDetails?.details?.id })
          ).then((res) => {
            addDataToStore(res.payload);
          });
          break;
        case "consultantNotes":
          dispatch(
            getConsultantNotes({ patientId: patientDetails?.details?.id })
          ).catch((error) => {
            console.error("Error fetching consultant notes:", error);
          });
          break;
      }
    }
  }, [activeMenuItem, patientDetails?.details?.id]);

  const handleEmptyCtaClick = {
    assessment: handleAddAssessmentClick,
    consultantNotes: handleAddConsultantNotesClick,
    otNotes: handleOtNotesClick,
  };
  const patientDetailsMenu = () => {
    return IPD.PATIENT_DETAILS_MENU.map((item) => {
      return {
        ...item,
        ctaClick: handleEmptyCtaClick?.[item.id],
        isActive: item.id === activeTab,
      };
    });
  };

  const isDataPresent = useMemo(() => {
    if (!activeMenuItem) return false;

    switch (activeMenuItem.id) {
      case "assessment":
        return Object.keys(assessmentsData)?.length > 0;
      case "consultantNotes":
        return consultantNotes && consultantNotes.length > 0;
      case "otNotes":
        // Add OT notes data check when available
        return false;
      default:
        return false;
    }
  }, [activeMenuItem, assessmentsData, consultantNotes]);

  const onRequestClose = () => {
    navigate(`/ipd/inPatients`);
  };
  const handleCustomizeClick = () => {
    console.log("INTEL ==> CUSTOMMM print settings");
  };

  const handleActiveItemChange = (item) => {
    setActiveMenuItem(item);
  };

  const renderContent = (activeItem) => {
    switch (activeItem?.id) {
      case "assessment":
        return (
          <div className="ipd-adm-assess-container-readable">
            <AssessmentsForm isEditable={isEditable} />
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                onEdit={handleAddAssessmentClick}
                onPrintPreview={() => console.log("Preview")}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
              />
            </div>
          </div>
        );
      case "consultantNotes":
        return (
          <div className="ipd-adm-assess-container-readable">
            <ConsultantNotesTimeline />
          </div>
        );
      default:
        return null;
    }
  };

  const canShowAddCTA = useMemo(() => {
    return activeMenuItem?.showAddCTA && isDataPresent;
  }, [activeMenuItem, isDataPresent]);

  return (
    <div>
      <Suspense fallback={<>Loading ...</>}>
        <AnimatePresence mode="wait">
          {open && !!patientData && (
            <PatientDetailsLayout
              key="patient-details"
              items={patientDetailsMenu()}
              onRequestClose={onRequestClose}
              onActiveItemChange={handleActiveItemChange}
              fullName={patientData.fullName}
              gender={patientData.gender}
              age={patientData.age}
              wardBedNumber={patientData.wardBedNumber}
              consultant={patientData.consultant}
              admittedOn={patientData.admittedOn}
              renderContent={
                !isEditable && isDataPresent ? renderContent : null
              }
              showAddCTA={canShowAddCTA}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default IPDPatientDetails;
