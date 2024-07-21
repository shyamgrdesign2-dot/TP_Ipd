import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import "./Obstetric.scss";
import PatientDiagnosis from "./components/patientDiagnosis/PatientDiagnosis";
import PregnancyHistory from "./components/pregnancyHistory/PregnancyHistory";
import Examination from "./components/examination/Examination";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import LmpPopup from "./components/lmpPopup/LmpPopup";
import { useState } from "react";
import { useSelector } from "react-redux";

const Obstetric = ({ handleDrawerObstetric }) => {
  const { obstetricDetails } = useSelector((state) => state.obstetric);

  const [showLmpPopup, setShowLmpPopup] = useState(!obstetricDetails?.lmp);

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={handleDrawerObstetric}
        isObstetric={true}
      />

      <div className="scrollableContainer">
        <PatientDiagnosis />

        <Tabs defaultActiveKey="pregnancyHistory">
          <TabPane tab="Pregnancy History" key="pregnancyHistory">
            <PregnancyHistory />
          </TabPane>
          <TabPane tab="Examination" key="examination">
            <Examination />
          </TabPane>
        </Tabs>
      </div>
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
