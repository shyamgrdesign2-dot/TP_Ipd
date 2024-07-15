import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./Obstetric.scss";
import PatientDiagnosis from "./components/patientDiagnosis/PatientDiagnosis";
import PregnancyHistory from "./components/pregnancyHistory/PregnancyHistory";
import Examination from "./components/examination/Examination";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import LmpPopup from "./components/lmpPopup/LmpPopup";
import { useState } from "react";

const Obstetric = ({ handleDrawerObstetric }) => {
  const [showLmpPopup, setShowLmpPopup] = useState(true);
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
