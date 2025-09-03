import React, { Suspense, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale";
import { formatDateToShortMonthYear, normalizeToDefault } from "../../../utils/utils";
import { AnimatePresence } from "framer-motion";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PatientDetailsLayout = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "PatientDetailsLayout")
  );
});

const IPDPatientDetails = () => {
  const navigate = useNavigate();
  const { patientDetails } = useSelector((state) => state.ipd);
  console.log("INTEL ==> patientDetails", patientDetails);
  const [open, setOpen] = useState(true);
  const [patientData, setPatientData] = useState(null);

  const handleAddAssessmentClick = () => {
    navigate("/ipd/patient-details/assessment-form", {
      state: {
        patient_data: patientDetails,
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
    }
    setPatientData(data);
  }, [patientDetails])
  const handleEmptyCtaClick = {
    assessment: handleAddAssessmentClick,
  };
  const patientDetailsMenu = () => {
    return IPD.PATIENT_DETAILS_MENU.map((item) => {
      return { ...item, ctaClick: handleEmptyCtaClick?.[item.id] };
    });
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
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default IPDPatientDetails;
