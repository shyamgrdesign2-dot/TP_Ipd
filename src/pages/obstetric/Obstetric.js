import { useState } from "react";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import Examination from "./components/Examination/Examination";
import PastPregnancy from "./components/PastPregnancy/PastPregnancy";
import "./Obstetric.scss";
import PatientDiagnosis from "./components/patientDiagnosis/PatientDiagnosis";
import PregnancyHistory from "./components/pregnancyHistory/PregnancyHistory";
import Examination from "./components/examination/Examination";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import LmpPopup from "./components/lmpPopup/LmpPopup";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Drawer } from "antd";

const Obstetric = ({ handleDrawerObstetric }) => {
  const [examinationDrawer, setExaminationDrawer] = useState(true);
  const [pastPregnancyDrawer, setPastPregancyDrawer] = useState(false);
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
      {examinationDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={() => setExaminationDrawer(false)}
          open={examinationDrawer}
          className="modalWidth-563"
          width="auto"
        >
          <Examination close={() => setExaminationDrawer(false)} />
        </Drawer>
      )}
      {pastPregnancyDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={() => setPastPregancyDrawer(false)}
          open={pastPregnancyDrawer}
          className="modalWidth-563"
          width="auto"
        >
          <PastPregnancy close={() => setPastPregancyDrawer(false)} />
        </Drawer>
      )}
    </div>
  );
};

export default Obstetric;
