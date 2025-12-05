import React from "react";
import { useLocation } from "react-router-dom";

import { ADD } from "../../../utils/constants";

import PatientForm from "../../../components/PatientForm";
import SubHeader from "../createAdmission/components/SubHeader";
import { isMobile } from "react-device-detect";

function IpdAddNewPatient() {
    const { state } = useLocation();
    const { patient_data } = state != null && state;

    return (
        <>
            { !isMobile && (
                <SubHeader headerTitle="Add New Patient" backButton={true} backButtonPath="/ipd/create-admission" showConfirmAdmissionButton={false} />
            )}
            <PatientForm mode={ADD} patient_data={patient_data} />
        </>
    );
}

export default React.memo(IpdAddNewPatient);

