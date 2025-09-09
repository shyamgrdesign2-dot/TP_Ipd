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
} from "../../../redux/prescriptionSlice";
import { addObstetricDetails } from "../../../redux/obstetricSlice";

const PatientDetailsLayout = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "PatientDetailsLayout")
  );
});

const IPDPatientDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isEditable = true, patient_data, patientDetails } = state || {};
  const { assessmentsData } = useSelector((state) => state.assessment);
  const [open, setOpen] = useState(true);
  const [patientData, setPatientData] = useState(null);
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
        patient_data: patientDetails,
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
  }

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
    if (!patientDetails?.details?.id) return;
    dispatch(
      getAssessmentsData({ patientId: patientDetails?.details?.id })
    ).then((res) => {
      addDataToStore(res.payload);
    });
  }, [patientDetails?.details?.id]);
  const handleEmptyCtaClick = {
    assessment: handleAddAssessmentClick,
    consultantNotes: handleAddConsultantNotesClick,
    otNotes: handleOtNotesClick
  };
  const patientDetailsMenu = () => {
    return IPD.PATIENT_DETAILS_MENU.map((item) => {
      return { ...item, ctaClick: handleEmptyCtaClick?.[item.id] };
    });
  };

  const isDataPresent = useMemo(() => {
    return Object.keys(assessmentsData)?.length > 0;
  }, [assessmentsData]);

  const onRequestClose = () => {
    navigate(`/ipd/inPatients`);
  };
  const handleCustomizeClick = () => {
    console.log("INTEL ==> CUSTOMMM print settings");
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
    }
    return <>heyy</>;
  };

  return (
    <div>
      <Suspense fallback={<>Loading ...</>}>
        <AnimatePresence mode="wait">
          {open && !!patientData && (
            <PatientDetailsLayout
              key="patient-details"
              items={patientDetailsMenu()}
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
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default IPDPatientDetails;
