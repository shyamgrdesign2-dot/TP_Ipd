import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./Obstetric.scss";
import PatientDiagnosis from "./components/patientDiagnosis/PatientDiagnosis";
import PregnancyHistory from "./components/pregnancyHistory/PregnancyHistory";
import Examination from "./components/examination/Examination";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import LmpPopup from "./components/lmpPopup/LmpPopup";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllObstetricDetails } from "./service";

const Obstetric = ({ handleDrawerObstetric }) => {
  const { state } = useLocation();
  let { patient_data } = state;
  const [showLmpPopup, setShowLmpPopup] = useState(false);

  useEffect(() => {
    getAllObstetricDetails(patient_data.patient_unique_id);
  }, []);
  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={handleDrawerObstetric}
        isObstetric={true}
      />
      <PatientDiagnosis />

      <Tabs defaultActiveKey="pregnancyHistory">
        <TabPane tab="Pregnancy History" key="pregnancyHistory">
          <PregnancyHistory />
        </TabPane>
        <TabPane tab="Examination" key="examination">
          <Examination />
        </TabPane>
      </Tabs>
      {showLmpPopup && (
        <LmpPopup
          handleDrawerObstetric={handleDrawerObstetric}
          setShowLmpPopup={setShowLmpPopup}
        />
      )}
    </div>
  );
};

export default Obstetric;
