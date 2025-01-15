import React from "react";
import OtherSetttings from "./OtherSetttings";
import PatientInfo from "./PatientInfo";
import HeaderFooter from "./HeaderFooter";

const BillHeaderFooterLayout = ({ headerFooter, setPrintSettings }) => {
  return (
    <div className="px-3 form_addnewpatient">
      <HeaderFooter
        headerFooter={headerFooter}
        setPrintSettings={setPrintSettings}
      />
      <PatientInfo
        patientInfo={headerFooter?.patientInfo}
        setPrintSettings={setPrintSettings}
      />
      <OtherSetttings
        otherSettings={headerFooter?.otherSettings}
        setPrintSettings={setPrintSettings}
      />
    </div>
  );
};

export default BillHeaderFooterLayout;
