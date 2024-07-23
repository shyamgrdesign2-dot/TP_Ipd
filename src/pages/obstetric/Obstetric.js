import { useEffect, useState } from "react";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import Examination from "./components/examination/Examination";
import PastPregnancy from "./components/PastPregnancy/PastPregnancy";
import PatientDiagnosis from "./components/patientDiagnosis/PatientDiagnosis";
import PregnancyHistory from "./components/pregnancyHistory/PregnancyHistory";
import AddExamination from "./components/AddExamination/AddExamination";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import LmpPopup from "./components/lmpPopup/LmpPopup";
import { useSelector } from "react-redux";
import { Drawer } from "antd";
import { fetchAllObstetricDetails, updateObstetricData } from "./service";
import { addObstetricDetails } from "../../redux/obstetricSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";

const Obstetric = ({ handleDrawerObstetric }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data } = state;
  const { obstetricDetails, isPatientDiagnosisUpdated } = useSelector(
    (state) => state.obstetric
  );
  const {
    gravidity,
    parity,
    livingChildren,
    abortion,
    ectopicPregnancies,
    diagnosisNotes,
    blood,
    ceed,
    lmp,
    consang,
    edd,
    gestationDays,
    gestationWeeks,
    husbandsBlood,
    maritialStatus,
    marriageDurationYears,
    marriageDurationMonths,
  } = obstetricDetails || {};
  const [examinationDrawer, setExaminationDrawer] = useState(false);
  const [pastPregnancyDrawer, setPastPregancyDrawer] = useState(false);
  const [showLmpPopup, setShowLmpPopup] = useState(!obstetricDetails?.lmp);
  const [examinationEditIndex, setExaminationEditIndex] = useState(-1);
  const [pastPregnancyEditIndex, setPastPregnancyEditIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState("pregnancyHistory");
  const [lmpDate, setLmpDate] = useState("");

  const [patientDiagnosisNotes, setPatientDiagnosisNotes] =
    useState(diagnosisNotes);

  const [patientDiagnosisData, setPatientDiagnosisData] = useState({
    lmp: lmp ? dayjs(moment(lmp).format("DD-MM-YYYY"), "DD-MM-YYYY") : "",
    edd: edd ?? undefined,
    ceed: ceed
      ? dayjs(moment(ceed).format("DD-MM-YYYY"), "DD-MM-YYYY")
      : undefined,
    gestationWeeks: gestationWeeks || 0,
    gestationDays: gestationDays || 0,
    blood: blood,
    husbandsBlood: husbandsBlood,
    consang: consang,
    maritialStatus: maritialStatus,
    marriageDurationYears: marriageDurationYears || 0,
    marriageDurationMonths: marriageDurationMonths || 0,
  });

  const [pastPregnancyData, setPastPregnancyData] = useState([
    { value: gravidity, label: "G", key: "gravidity" },
    { value: parity, label: "P", key: "parity" },
    { value: livingChildren, label: "L", key: "livingChildren" },
    { value: abortion, label: "A", key: "abortion" },
    { value: ectopicPregnancies, label: "E", key: "ectopicPregnancies" },
  ]);

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

  const obstetricSaveBtnHandler = async () => {
    if (isPatientDiagnosisUpdated) {
      const pastPregnancy = pastPregnancyData.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      const payload = {
        ...obstetricDetails,
        ...patientDiagnosisData,
        ...pastPregnancy,
        diagnosisNotes: patientDiagnosisNotes,
      };
      dispatch(addObstetricDetails(payload));
      await updateObstetricData(obstetricDetails?.patientId, payload);
    }
    handleDrawerObstetric();
  };

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={obstetricSaveBtnHandler}
        isObstetric={true}
      />

      <div className="scrollableContainer">
        <PatientDiagnosis
          lmpDate={lmpDate}
          patientDiagnosisData={patientDiagnosisData}
          pastPregnancyData={pastPregnancyData}
          patientDiagnosisNotes={patientDiagnosisNotes}
          setPatientDiagnosisData={setPatientDiagnosisData}
          setPastPregnancyData={setPastPregnancyData}
          setPatientDiagnosisNotes={setPatientDiagnosisNotes}
        />

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
