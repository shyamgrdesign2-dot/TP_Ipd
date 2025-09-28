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
  resetAssessmentForm,
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
import LabResults from "../labResults/LabResults";
import ProgressNotesView from "../progressNotes/progressNotesView/progressNotesView";
import { getProgressNotes } from "../../../redux/ipd/progressNotesSlice";
import {
  getOtNotesData,
  resetOtNotesForm,
} from "../../../redux/ipd/otNotesSlice";
import MedicalRecords from "../medicalRecords/IPDMedicalRecords";
import OtNotesTimeline from "../otNotes/OtNotesTimeline";
import { useAssessmentSectionVisibility } from "../../../hooks/useAssessmentSectionVisibility";
import CrossReferralTimeline from "../crossReferral/CrossReferralTimeline";
import {
  getCrossReferralData,
  resetCrossReferralForm,
} from "../../../redux/ipd/crossReferralSlice";

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

  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails;

  const { hasAnyData: hasAnyAssessmentData } = useAssessmentSectionVisibility();

  const { assessmentsData } = useSelector((state) => state.assessment);
  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const { otNotesData } = useSelector((state) => state.otNotes);
  const { progressNotes } = useSelector((state) => state.progressNotes);
  const { crossReferralData } = useSelector((state) => state.crossReferral);
  const [open, setOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState("assessment");
  const [patientData, setPatientData] = useState(null);

  const dispatch = useDispatch();

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

  const handleAddOtNotesClick = () => {
    dispatch(resetOtNotesForm());
    // TODO: INTEL - RESET ALL THE DATA IN THE OT NOTES FORM
    navigate("/ipd/patient-details/ot-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
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
      },
    });
  };

  const handleMedicalRecordsClick = () => {
    navigate("/ipd/patient-details/medical-records", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  const handleProgressNotesClick = () => {
    navigate("/ipd/patient-details/progress-notes", {
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
      setActiveMenuItem(activeTab);
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
          data?.functionalAssessment?.referredToPhysiotherapyForReview || {}
        )
      );
    }
  };

  useEffect(() => {
    if (!patientId || !admissionId) return;

    if (activeMenuItem === "assessment") {
      dispatch(getAssessmentsData({ patientId, admissionId })).then((res) => {
        addDataToStore(res.payload.assessment);
      });
    } else if (activeMenuItem === "consultantNotes") {
      dispatch(getConsultantNotes({ patientId, admissionId })).catch(
        (error) => {
          console.error("Error fetching consultant notes:", error);
        }
      );
    } else if (activeMenuItem === "progress") {
      dispatch(getProgressNotes({ patientId, admissionId })).catch((error) => {
        console.error("Error fetching progress notes:", error);
      });
    } else if (activeMenuItem === "otNotes") {
      dispatch(getOtNotesData({ patientId, admissionId })).catch((error) => {
        console.error("Error fetching OT notes:", error);
      });
    } else if (activeMenuItem === "crossReferral") {
      dispatch(getCrossReferralData({ patientId, admissionId })).catch(
        (error) => {
          console.error("Error fetching Cross Referral notes:", error);
        }
      );
    } else if (activeMenuItem === "records") {
      // dispatch(getProgressNotes({ patientId, admissionId })).catch(
      //   (error) => {
      //     console.error("Error fetching progress notes:", error);
      //   }
      // );
    }
  }, [activeMenuItem, admissionId, patientId]);

  const handleEmptyCtaClick = {
    assessment: () => handleAddAssessmentClick(true),
    otNotes: handleAddOtNotesClick,
    consultantNotes: handleAddConsultantNotesClick,
    progress: handleProgressNotesClick,
    records: handleMedicalRecordsClick,
    crossReferral: handleAddCrossReferralClick,
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
    } else if (activeMenuItem === "consultantNotes") {
      return !!consultantNotes?.length;
    } else if (activeMenuItem === "progress") {
      return !!progressNotes?.length;
    } else if (activeMenuItem === "records") {
      return false;
    } else if (activeMenuItem === "labResults") {
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
  ]);

  const onRequestClose = () => {
    dispatch(resetOtNotesForm());
    dispatch(resetCrossReferralForm());
    navigate(`/ipd/inPatients`);
  };
  const handleCustomizeClick = () => {
    console.log("INTEL ==> CUSTOMMM print settings");
  };
  const onHandleSelect = (id) => {
    setActiveMenuItem(id);
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
                onEdit={() => handleAddAssessmentClick(false)}
                onPrintPreview={() => console.log("Preview")}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
              />
            </div>
          </>
        );
      case "progress":
        return (
          <div className="ipd-progress-notes-view-container">
            <ProgressNotesView
              progressNotes={progressNotes}
              patientDetails={patientDetails}
            />
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                showEditForm={false}
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
      case "labResults":
        return (
          <div className="ipd-adm-assess-container-readable">
            <LabResults />
          </div>
        );
      case "records":
        return (
          <div className="ipd-adm-assess-container-readable">
            <MedicalRecords />
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
                onPrintPreview={() => console.log("Preview")}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
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
                onPrintPreview={() => console.log("Preview")}
                onPrint={() => console.log("Print")}
                onSettings={handleCustomizeClick}
                onDownload={() => console.log("Download")}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const canShowAddCTA = useMemo(() => {
    return (
      IPD.PATIENT_DETAILS_MENU.find((item) => item.id === activeMenuItem)
        ?.showAddCTA && isDataPresent
    );
  }, [activeMenuItem, isDataPresent]);

  return (
    <div>
      <Suspense fallback={<>Loading ...</>}>
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
