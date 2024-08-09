import { useEffect, useRef, useState } from "react";
import VaccineHeader from "../vaccination/components/vaccineHeader/VaccineHeader";
import Examination from "./components/examination/Examination";
import PastPregnancy from "./components/PastPregnancy/PastPregnancy";
import PatientDiagnosis from "./components/patientDiagnosis/PatientDiagnosis";
import PregnancyHistory from "./components/pregnancyHistory/PregnancyHistory";
import AddExamination from "./components/AddExamination/AddExamination";
import alertIcon from "./../../assets/images/alertIcon.svg";
import { Button, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import LmpPopup from "./components/lmpPopup/LmpPopup";
import { useSelector, useDispatch } from "react-redux";
import { Drawer } from "antd";
import {
  addObstetricData,
  fetchAllObstetricDetails,
  fetchPrefillObstetricDetails,
  updateObstetricData,
  updatePrefillObstetricData,
} from "./service";
import {
  addObstetricDetails,
  resetUpdatedPatientDiagnosis,
} from "../../redux/obstetricSlice";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../utils/constants";
import { errorMessage, getClinicName } from "../../utils/utils";
import SuccessPopup from "../growthChart/components/SuccessPopup";
import CommonModal from "../../common/CommonModal";

const Obstetric = ({ handleDrawerObstetric, handleCollapsed }) => {
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
    husbandsBlood,
    maritialStatus,
    marriageDurationYears,
    marriageDurationMonths,
  } = obstetricDetails || {};
  const [loader, setLoader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [examinationDrawer, setExaminationDrawer] = useState(false);
  const [pastPregnancyDrawer, setPastPregancyDrawer] = useState(false);
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [isDataAddedOrEdited, setIsDataAddedOrEdited] = useState(false);
  const [showLmpPopup, setShowLmpPopup] = useState(!obstetricDetails?.lmp);
  const [examinationEditIndex, setExaminationEditIndex] = useState(-1);
  const [pastPregnancyEditIndex, setPastPregnancyEditIndex] = useState(-1);
  const [isFixed, setIsFixed] = useState(false);
  const [activeTab, setActiveTab] = useState(
    obstetricDetails?.examinationHistory?.length
      ? "examination"
      : "pregnancyHistory"
  );
  const [lmpDate, setLmpDate] = useState("");
  const [tokenData, setTokenData] = useState(null);

  const [patientDiagnosisNotes, setPatientDiagnosisNotes] =
    useState(diagnosisNotes);
  const [prefillObstetricData, setPrefillObstetricData] = useState({});

  const today = moment();
  const lmpValue = moment(lmp);
  const gestationWeeks = today.diff(lmpValue, "weeks");
  const tempDate = lmpValue.clone().add(gestationWeeks, "weeks");
  const gestationDays = today.diff(tempDate, "days");

  const [patientDiagnosisData, setPatientDiagnosisData] = useState({
    lmp: lmp,
    edd: edd ?? undefined,
    ceed: ceed ?? undefined,
    gestationWeeks: gestationWeeks,
    gestationDays: gestationDays,
    blood: blood,
    husbandsBlood: husbandsBlood,
    consang: consang,
    maritialStatus: maritialStatus,
    marriageDurationYears: marriageDurationYears,
    marriageDurationMonths: marriageDurationMonths,
  });

  const [pastPregnancyData, setPastPregnancyData] = useState([
    { value: gravidity, label: "G", key: "gravidity" },
    { value: parity, label: "P", key: "parity" },
    { value: livingChildren, label: "L", key: "livingChildren" },
    { value: abortion, label: "A", key: "abortion" },
    { value: ectopicPregnancies, label: "E", key: "ectopicPregnancies" },
  ]);
  const [isExaminationUpdated, setIsExaminationUpdated] = useState(false);
  const [isPastPregnancyUpdated, setIsPastPregnancyUpdated] = useState(false);

  const pregnancyRef = useRef(null);
  const examinationRef = useRef(null);
  const { profile, userId } = useSelector((state) => state.doctors);

  useEffect(() => {
    if (examinationEditIndex >= 0) {
      handleExaminationDrawer();
    }
  }, [examinationEditIndex]);

  useEffect(() => {
    if (pastPregnancyEditIndex >= 0) {
      handlePastPregnancyDrawer();
    }
  }, [pastPregnancyEditIndex]);

  useEffect(() => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    try {
      const decoded = jwtDecode(token);
      setTokenData(decoded.result);
    } catch (e) {
      console.error("Error while token decoding: ", e);
    }
  }, []);

  useEffect(() => {
    getPrefillObstetricDetails();
    scrollToBottom();
  }, []);

  const getPrefillObstetricDetails = async () => {
    const prefillObstetricResponse = await fetchPrefillObstetricDetails(
      patient_data.patient_unique_id
    );
    setPrefillObstetricData(prefillObstetricResponse);
    let gestationInWeeks, gestationInDays, newLmp, newEdd;
    if (prefillObstetricResponse?.lmp) {
      newLmp = moment(prefillObstetricResponse?.lmp);
      newEdd = newLmp
        .clone()
        .add(1, "year")
        .subtract(3, "months")
        .add(7, "days")
        .toDate()
        .toISOString();
      gestationInWeeks = today.diff(newLmp, "weeks");
      const tempDate = newLmp.clone().add(gestationInWeeks, "weeks");
      gestationInDays = today.diff(tempDate, "days");
    }
    setPatientDiagnosisData({
      ...patientDiagnosisData,
      lmp: newLmp || lmp,
      edd: newEdd || edd,
      blood:
        prefillObstetricResponse.bloodGroup?.indexOf("(") > 0
          ? prefillObstetricResponse.bloodGroup
              ?.slice(0, prefillObstetricResponse.bloodGroup?.indexOf("("))
              ?.trim()
          : prefillObstetricResponse.bloodGroup || blood,
      maritialStatus: prefillObstetricResponse.marriedStatus || maritialStatus,
      gestationWeeks: gestationInWeeks || gestationWeeks,
      gestationDays: gestationInDays || gestationDays,
    });
  };

  const scrollToBottom = () => {
    if (activeTab === "pregnancyHistory") {
      pregnancyRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      examinationRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getAllObstetricDetails = async () => {
    const obstetricResponse = await fetchAllObstetricDetails(
      patient_data.patient_unique_id,
      userId
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
    if (!obstetricDetails?.examinationHistory?.length)
      handleExaminationDrawer();
  };

  const toggleDeletePopup = () => {
    setShowDeletePopup((prev) => !prev);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop > 185) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  const trackUpdateEvent = () => {
    const clinic_name = getClinicName(profile?.hospital_data);
    const attributes = {
      clinic_name,
      doctor_id: profile?.doctor_unique_id,
      patient_number: patient_data?.pm_contact_no,
      patient_id: patient_data?.patient_unique_id,
    };
    window.Moengage.track_event("TP_Obs_history_updated", attributes);
    if (isExaminationUpdated) {
      window.Moengage.track_event("TP_obs_examination_updated", attributes);
      setIsExaminationUpdated(false);
    }
    if (isPastPregnancyUpdated) {
      window.Moengage.track_event("TP_Past_pregnancy_updated", attributes);
      setIsPastPregnancyUpdated(false);
    }
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
        patientId: patient_data.patient_unique_id,
        diagnosisNotes: patientDiagnosisNotes,
        createdAt: obstetricDetails?.createdAt || new Date().toISOString(),
        createdBy: obstetricDetails?.createdBy || tokenData?.user_id,
        modifiedAt: new Date().toISOString(),
        modifiedBy: tokenData?.user_id,
      };
      dispatch(addObstetricDetails(payload));
      dispatch(resetUpdatedPatientDiagnosis());
      setLoader(true);
      const obstetricResponse = obstetricDetails?._id
        ? await updateObstetricData(
            obstetricDetails?.patientId,
            payload,
            userId
          )
        : await addObstetricData(payload);
      const prefillObstetricPayload = {};
      Object.keys(prefillObstetricData).forEach((key) => {
        if (prefillObstetricData[key]) {
          prefillObstetricPayload[key] = prefillObstetricData[key];
        }
      });
      await updatePrefillObstetricData(prefillObstetricPayload);
      setLoader(false);
      if (obstetricResponse?.data) {
        trackUpdateEvent();
        setShowSuccess(true);
        getAllObstetricDetails();
      } else {
        errorMessage(obstetricResponse?.message || "Error while adding data");
      }
    }
    setTimeout(() => {
      handleDrawerObstetric();
    }, 1000);
  };

  const clearObstetricData = () => {
    handleDrawerObstetric();
    getAllObstetricDetails();
    dispatch(resetUpdatedPatientDiagnosis());
  };

  const tabChangeHandler = (key) => {
    setActiveTab(key);
    scrollToBottom();
  };

  return (
    <div className="vaccinationWrapper">
      <VaccineHeader
        handleDrawerVaccination={obstetricSaveBtnHandler}
        handleObstetricBackBtn={handleDrawerObstetric}
        clearObstetricData={clearObstetricData}
        loader={loader}
        isObstetric={true}
      />

      <div className="scrollableContainer" onScroll={handleScroll}>
        <PatientDiagnosis
          lmpDate={lmpDate}
          patientDiagnosisData={patientDiagnosisData}
          pastPregnancyData={pastPregnancyData}
          patientDiagnosisNotes={patientDiagnosisNotes}
          setLmpDate={setLmpDate}
          setPatientDiagnosisData={setPatientDiagnosisData}
          setPastPregnancyData={setPastPregnancyData}
          setPatientDiagnosisNotes={setPatientDiagnosisNotes}
          isFixed={isFixed}
          setPrefillObstetricData={setPrefillObstetricData}
        />

        <Tabs
          className="obstetricTab"
          activeKey={activeTab}
          onChange={(key) => tabChangeHandler(key)}
        >
          <TabPane tab="Pregnancy History" key="pregnancyHistory">
            <PregnancyHistory
              continueExaminationHandler={continueExaminationHandler}
              handlePastPregnancyDrawer={handlePastPregnancyDrawer}
              setEditIndex={setPastPregnancyEditIndex}
              bottomRef={pregnancyRef}
            />
          </TabPane>
          <TabPane tab="Examination" key="examination">
            <Examination
              handleExaminationDrawer={handleExaminationDrawer}
              setEditIndex={setExaminationEditIndex}
              bottomRef={examinationRef}
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
          onClose={() => {
            if (isDataAddedOrEdited) {
              toggleDeletePopup();
            } else {
              setExaminationEditIndex(-1);
              handleExaminationDrawer();
            }
          }}
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
            handleCollapsed={handleCollapsed}
            toggleDeletePopup={toggleDeletePopup}
            isDataAddedOrEdited={isDataAddedOrEdited}
            setIsDataAddedOrEdited={setIsDataAddedOrEdited}
            setIsExaminationUpdated={setIsExaminationUpdated}
            prefillObstetricData={prefillObstetricData}
            setPrefillObstetricData={setPrefillObstetricData}
          />
        </Drawer>
      )}
      {pastPregnancyDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={() => {
            if (isDataAddedOrEdited) {
              toggleDeletePopup();
            } else {
              setPastPregnancyEditIndex(-1);
              handlePastPregnancyDrawer();
            }
          }}
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
            toggleDeletePopup={toggleDeletePopup}
            isDataAddedOrEdited={isDataAddedOrEdited}
            setIsDataAddedOrEdited={setIsDataAddedOrEdited}
            setIsPastPregnancyUpdated={setIsPastPregnancyUpdated}
          />
        </Drawer>
      )}
      <SuccessPopup show={showSuccess} setShow={setShowSuccess} />
      <CommonModal
        isModalOpen={shouldShowDeletePopup}
        onCancel={toggleDeletePopup}
        modalWidth={500}
        title={"You may lose your data"}
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className="me-3" src={alertIcon} alt="Warning" />
                <span>
                  Are you sure you want to leave? <br />
                  You will permanently lose your
                  {examinationDrawer ? " Examination" : " Past pregnancy"} data.
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={() => {
                    if (examinationDrawer) {
                      handleExaminationDrawer();
                      resetExaminationEditIndex();
                    } else {
                      handlePastPregnancyDrawer();
                      resetPastPregnancyEditIndex();
                    }
                    setIsDataAddedOrEdited(false);
                    toggleDeletePopup();
                  }}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes Leave
                </div>
                <Button
                  onClick={toggleDeletePopup}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No, Stay</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default Obstetric;
