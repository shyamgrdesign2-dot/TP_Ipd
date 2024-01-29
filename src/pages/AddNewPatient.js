import React from "react";

import PatientForm from "../components/PatientForm";

function AddNewPatient() {
    return (
        <PatientForm mode="ADD" />
    );
}
export default React.memo(AddNewPatient);
