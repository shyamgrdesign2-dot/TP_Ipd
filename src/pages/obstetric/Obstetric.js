import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./Obstetric.scss";
import PatientDiagnosis from "./components/patientDiagnosis/PatientDiagnosis";
import PregnancyHistory from "./components/pregnancyHistory/PregnancyHistory";
import Examination from "./components/examination/Examination";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import LmpPopup from "./components/lmpPopup/LmpPopup";
import { useState } from "react";

const Obstetric = ({ handleDrawerObstetric, allObstetricDetails }) => {
  const { examinationHistory, pregnancyHistory } = allObstetricDetails || {};

  const [showLmpPopup, setShowLmpPopup] = useState(!allObstetricDetails?.lmp);

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={handleDrawerObstetric}
        isObstetric={true}
      />
      <PatientDiagnosis allObstetricDetails={allObstetricDetails} />

      <Tabs defaultActiveKey="pregnancyHistory">
        <TabPane tab="Pregnancy History" key="pregnancyHistory">
          <PregnancyHistory pregnancyHistory={pregnancyHistory} />
        </TabPane>
        <TabPane tab="Examination" key="examination">
          <Examination examinationHistory={examinationHistory} />
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
