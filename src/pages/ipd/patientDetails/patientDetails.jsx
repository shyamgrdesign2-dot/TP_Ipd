import React, { Suspense, useState } from "react";
import { IPD } from "../../../utils/locale";
import { normalizeToDefault } from "../../../utils/utils";
import { AnimatePresence } from "framer-motion";
import './styles.scss';
import { useNavigate } from "react-router-dom";

const PatientDetailsLayout = React.lazy(() => {
  return import("shared_ui/components").then((m) =>
    normalizeToDefault(m, "PatientDetailsLayout")
  );
});

const IPDPatientDetails = () => {
    const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleAddAssessmentClick = () => {
    navigate("/ipd/patient-details/assessment-form", {
        state: {
        //   patient_data: patient_data,
        },
      });
  }
  const handleEmptyCtaClick = {
    'assessment': handleAddAssessmentClick
    }
  const patientDetailsMenu = () => {
    return IPD.PATIENT_DETAILS_MENU.map(item => {
        return {...item, ctaClick: handleEmptyCtaClick?.[item.id]}
    })
}
  return (
    <div>
      <Suspense fallback={<>Loading ...</>}>
      <AnimatePresence mode='wait'>
        {open && (<PatientDetailsLayout
                key='patient-details'
                items={patientDetailsMenu()}
                onRequestClose={() => setOpen(false)}
                // renderContent={active => (
                //   <div>
                //     <p>
                //       Showing: <strong>{active.name}</strong>
                //     </p>
                //   </div>
                // )}
            />)}
      </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default IPDPatientDetails;
