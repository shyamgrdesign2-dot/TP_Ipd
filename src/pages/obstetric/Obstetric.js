import { useEffect, useState } from "react";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import Examination from "./components/examination/Examination";
import PastPregnancy from "./components/PastPregnancy/PastPregnancy";
import "./Obstetric.scss";
import PatientDiagnosis from "./components/patientDiagnosis/PatientDiagnosis";
import PregnancyHistory from "./components/pregnancyHistory/PregnancyHistory";
import AddExamination from "./components/AddExamination/AddExamination";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import LmpPopup from "./components/lmpPopup/LmpPopup";
import { useSelector } from "react-redux";
import { Drawer } from "antd";
import { fetchAllObstetricDetails } from "./service";
import { addObstetricDetails } from "../../redux/obstetricSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const Obstetric = ({ handleDrawerObstetric }) => {
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const [examinationDrawer, setExaminationDrawer] = useState(false);
  const [pastPregnancyDrawer, setPastPregancyDrawer] = useState(false);
  const [showLmpPopup, setShowLmpPopup] = useState(!obstetricDetails?.lmp);
  const [examinationEditIndex, setExaminationEditIndex] = useState(-1);
  const [pastPregnancyEditIndex, setPastPregnancyEditIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState("pregnancyHistory");
  const [lmpDate, setLmpDate] = useState("");
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data } = state;

  useEffect(() => {
    if (examinationEditIndex >= 0) {
      handleExaminationDrawer();
    }
    if (pastPregnancyEditIndex >= 0) {
      handlePastPregnancyDrawer();
    }
  }, [examinationEditIndex, pastPregnancyEditIndex]);

  const getAllObstetricDetails = async () => {
    const obstetricResponse = await fetchAllObstetricDetails(
      patient_data.patient_unique_id
    );
    if (obstetricResponse) {
      dispatch(addObstetricDetails(obstetricResponse));
    }
  };

  const handleExaminationDrawer = () => {
    setExaminationDrawer(!examinationDrawer);
  };

  const handlePastPregnancyDrawer = () => {
    setPastPregancyDrawer(!pastPregnancyDrawer);
  };

  const resetExaminationEditIndex = () => {
    setExaminationEditIndex(-1);
  };

  const resetPastPregnancyEditIndex = () => {
    setPastPregnancyEditIndex(-1);
  };

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
              handlePastPregnancyDrawer={handlePastPregnancyDrawer}
              setEditIndex={setPastPregnancyEditIndex}
            />
          </TabPane>
          <TabPane tab="Examination" key="examination">
            <Examination
              handleExaminationDrawer={handleExaminationDrawer}
              setEditIndex={setExaminationEditIndex}
            />
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
      {examinationDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleExaminationDrawer}
          open={examinationDrawer}
          className="modalWidth-563"
          width="auto"
        >
          <AddExamination
            editIndex={examinationEditIndex}
            close={() => {
              handleExaminationDrawer();
              resetExaminationEditIndex();
            }}
            getAllObstetricDetails={getAllObstetricDetails}
          />
        </Drawer>
      )}
      {pastPregnancyDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handlePastPregnancyDrawer}
          open={pastPregnancyDrawer}
          className="modalWidth-563"
          width="auto"
        >
          <PastPregnancy
            editIndex={pastPregnancyEditIndex}
            close={() => {
              handlePastPregnancyDrawer();
              resetPastPregnancyEditIndex();
            }}
            getAllObstetricDetails={getAllObstetricDetails}
          />
        </Drawer>
      )}
    </div>
  );
};

export default Obstetric;
