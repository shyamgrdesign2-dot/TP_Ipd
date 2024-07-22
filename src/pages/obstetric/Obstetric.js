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

  const [activeTab, setActiveTab] = useState("pregnancyHistory");
  const [lmpDate, setLmpDate] = useState("");
  const [showLmpPopup, setShowLmpPopup] = useState(!obstetricDetails?.lmp);

  const continueExaminationHandler = () => {
    setActiveTab("examination");
  };

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={handleDrawerObstetric}
        isObstetric={true}
      />

      <div className="scrollableContainer">
        <PatientDiagnosis lmpDate={lmpDate} />

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Pregnancy History" key="pregnancyHistory">
            <PregnancyHistory
              continueExaminationHandler={continueExaminationHandler}
            />
          </TabPane>
          <TabPane tab="Examination" key="examination">
            <Examination />
          </TabPane>
        </Tabs>
      </div>
      {showLmpPopup && (
        <LmpPopup
          handleDrawerObstetric={handleDrawerObstetric}
          lmpDate={lmpDate}
          setLmpDate={setLmpDate}
          setShowLmpPopup={setShowLmpPopup}
        />
      )}
    </div>
  );
};

export default Obstetric;
