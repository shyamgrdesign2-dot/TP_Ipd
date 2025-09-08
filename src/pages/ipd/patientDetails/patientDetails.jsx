import React, { act, Suspense, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale";
import {
  formatDateToShortMonthYear,
  normalizeToDefault,
} from "../../../utils/utils";
import { AnimatePresence } from "framer-motion";
import "./styles.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AssessmentsForm from "../assessmentForm/AssessmentsForm";
import ToolbarActions from "../components/ToolbarActions/ToolbarActions";

const PatientDetailsLayout = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "PatientDetailsLayout")
  );
});

const IPDPatientDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isEditable = true } = state || {};
  const { patientDetails } = useSelector((state) => state.ipd);
  const [open, setOpen] = useState(true);
  const [patientData, setPatientData] = useState(null);

  const patientDataForOPDComponents = {
    pm_contact_no: patientDetails?.details?.contact,
    pm_gender: patientDetails?.details?.gender,
    patient_unique_id: patientDetails?.details?.id,
  };
  const handleAddAssessmentClick = () => {
    navigate("/ipd/patient-details/assessment-form", {
      state: {
        patient_data: patientDetails,
        patient_data_main: patientDataForOPDComponents,
        isEditable: true,
      },
    });
  };
  useEffect(() => {
    const data = {
      fullName: patientDetails.details.name,
      gender: patientDetails.details.gender,
      age: patientDetails.details.age,
      wardBedNumber: `${patientDetails.ward.title} - ${patientDetails.room.title}`,
      consultant: patientDetails.doctor.name,
      admittedOn: formatDateToShortMonthYear(patientDetails.admittedOn),
    };
    setPatientData(data);
  }, [patientDetails]);
  const handleEmptyCtaClick = {
    assessment: handleAddAssessmentClick,
  };
  const patientDetailsMenu = () => {
    return IPD.PATIENT_DETAILS_MENU.map((item) => {
      return { ...item, ctaClick: handleEmptyCtaClick?.[item.id] };
    });
  };

  const renderContent = (activeItem) => {
    switch (activeItem?.id) {
      case "assessment":
        return (
          <div className="ipd-adm-assess-container-readable">
            <AssessmentsForm
              isEditable={isEditable}
              patientDetails={patientDetails.details}
              patientDataForOPDComponents={patientDataForOPDComponents}
            />
            <div className="ipd-toolbar-edit-custom-print-download">
              <ToolbarActions
                onEdit={handleAddAssessmentClick}
                onPrintPreview={() => console.log("Preview")}
                onPrint={() => console.log("Print")}
                onSettings={() => console.log("Settings")}
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
              onRequestClose={() => setOpen(false)}
              fullName={patientData.fullName}
              gender={patientData.gender}
              age={patientData.age}
              wardBedNumber={patientData.wardBedNumber}
              consultant={patientData.consultant}
              admittedOn={patientData.admittedOn}
              renderContent={!isEditable ? renderContent : null}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default IPDPatientDetails;
