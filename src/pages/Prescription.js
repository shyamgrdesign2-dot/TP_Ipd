import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, Button } from "antd";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { useSelector, useDispatch } from "react-redux";

import { ADD, EDIT } from "../utils/constants";

import { getVitals } from "../redux/vitalsSlice";
import { getPatientLastHistory } from "../redux/medicalhistorySlice";

import CashManagerContext from "../context/CashManagerContext";
import HeaderPrescription from "../common/HeaderPrescription";
import SymptomsBox from "../components/SymptomsBox";
import ExaminationBox from "../components/ExaminationBox";
import DiagnosisBox from "../components/DiagnosisBox";
import MedicationsBox from "../components/MedicationsBox";
import AdviceBox from "../components/AdviceBox";
import InvestigationBox from "../components/InvestigationBox";
import TabFollowUpBox from "../components/tab_design/TabFollowUpBox";

import VitalsBox from "../components/VitalsBox";
import VitalsList from "../components/VitalsList";

import MedicalHistoryBox from "../components/MedicalHistoryBox";
import MedicalHistoryList from "../components/tab_design/MedicalHistoryList";

import vitals from "../assets/images/Vitals.svg";
import MedicalHistory from "../assets/images/Medical-History.svg";

import hey from "../assets/images/bg-hey.png";
import vaccinationImg from "../assets/images/Vaccination.svg";

import { Content } from "antd/es/layout/layout";
import { checkToShowVaccination } from "./vaccination/service";

function Prescription() {
  const {
    customizedPadLeftList,
    customizedPadRightList,
    frequencyList,
    timingList,
  } = useSelector((state) => state.doctors);
  const { selectedVitalsList, vitalsPastList } = useSelector(
    (state) => state.vitals
  );
  const { profile } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();
  const { patient_data, caseManagerData } = state;
  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;
  const consultationDate =
    caseManagerData !== undefined
      ? caseManagerData.consultation_date
      : moment().format("YYYY-MM-DD HH:mm:ss");

  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [adviceData, setAdviceData] = useState([]);
  const [investigationData, setInvestigationData] = useState([]);
  const [medicationData, setMedicationData] = useState([]);
  const [vitalsData, setVitalsData] = useState([]);
  const [medicalHistoryData, setMedicalHistoryData] = useState([]);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [additionalNote, setAdditionalNote] = useState("");

  const contextApi = {
    patient_data,
    tcmId,
    consultationDate,
    symptomsData,
    setSymptomsData,
    examinationData,
    setExaminationData,
    diagnosisData,
    setDiagnosisData,
    adviceData,
    setAdviceData,
    investigationData,
    setInvestigationData,
    medicationData,
    setMedicationData,
    vitalsData,
    setVitalsData,
    medicalHistoryData,
    setMedicalHistoryData,
    followUpDate,
    setFollowUpDate,
    additionalNote,
    setAdditionalNote,
  };

  const [vitalDrawer, setVitalDrawer] = useState(false);
  const [medicalHistoryDrawer, setMedicalHistoryDrawer] = useState(false);
  const [shouldShowVaccination, setShouldShowVaccination] = useState(false);

  const checkForVaccination = async () => {
    setShouldShowVaccination(
      await checkToShowVaccination(profile?.doctor_unique_id)
    );
  };

  useEffect(() => {
    if (caseManagerData !== undefined) {
      if (
        caseManagerData.vitals.length > 0 &&
        customizedPadLeftList.findIndex(
          (e) => e.tmdpm_id === 1 && e.tmdpm_status === 0
        ) !== -1
      ) {
        const updatedData = caseManagerData.vitals.map((e, i) => {
          return {
            ...e,
            systolic: e.blood_press ? e.blood_press.split("/")[0] : "",
            diastolic: e.blood_press ? e.blood_press.split("/")[1] : "",
          };
        });
        setVitalsData(updatedData);
      }
      if (
        caseManagerData.medical_history.length > 0 &&
        customizedPadLeftList.findIndex(
          (e) => e.tmdpm_id === 3 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setMedicalHistoryData(
          JSON.parse(JSON.stringify(caseManagerData.medical_history))
        );
      }
      if (
        caseManagerData.symptoms.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 5 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setSymptomsData(caseManagerData.symptoms);
      }
      if (
        caseManagerData.examination.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 10 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setExaminationData(caseManagerData.examination);
      }
      if (
        caseManagerData.diagnosis.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 11 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setDiagnosisData(caseManagerData.diagnosis);
      }
      if (
        caseManagerData.medicine.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 12 && e.tmdpm_status === 0
        ) !== -1
      ) {
        const updatedData = caseManagerData.medicine.map((e) => {
          const unitObj = e?.medicineUnit
            ? e?.medicineUnit.find((x) => x.tmu_id == e.tmm_unit)
            : null;
          const frequencyObj = frequencyList.find(
            (x) => x.tmf_id == e.tmm_freq_type
          );
          const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

          return {
            ...e,
            tmm_unit_name:
              unitObj && unitObj !== undefined ? unitObj.tmu_title : "",
            tmm_freq_type_name:
              e.tmf_block == 0
                ? `${
                    e.tcm_tmm_freq_morning
                      ? e.tcm_tmm_freq_morning + " - "
                      : "0 -"
                  }${
                    e.tcm_tmm_freq_afternoon
                      ? e.tcm_tmm_freq_afternoon + " - "
                      : "0 -"
                  }${
                    e.tcm_tmm_freq_evening
                      ? e.tcm_tmm_freq_evening + " - "
                      : "0 -"
                  }${e.tcm_tmm_freq_night ? e.tcm_tmm_freq_night : "0"}`
                : frequencyObj !== undefined
                ? frequencyObj.tmf_title
                : "",
            tmf_block_val:
              frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
            tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
            tmm_dosage_unit_name: `${
              e.tmm_dosage
                ? `${e.tmm_dosage} ${
                    unitObj && unitObj !== undefined ? unitObj.tmu_title : ""
                  }`
                : ""
            }`,
            tmm_days_duration_type: `${
              e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : ""
            }`,
            unique_id: uuidv4(),
          };
        });
        setMedicationData([...updatedData]);
      }
      if (
        caseManagerData.advice.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 13 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setAdviceData(caseManagerData.advice);
      }
      if (
        caseManagerData.investigation.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 14 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setInvestigationData(caseManagerData.investigation);
      }
      if (
        caseManagerData.follow_up_date &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 15 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setFollowUpDate(caseManagerData.follow_up_date);
      }
      if (
        caseManagerData.visit_advice &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 15 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setAdditionalNote(caseManagerData.visit_advice);
      }
    }
    checkForVaccination();
  }, []);

  // Drawer Vitals
  const handleDrawerVital = useCallback(() => {
    setVitalDrawer(!vitalDrawer);
  }, [vitalDrawer]);

  // Drawer Medical History
  const handleDrawerMedicalHistory = useCallback(() => {
    setMedicalHistoryDrawer(!medicalHistoryDrawer);
  }, [medicalHistoryDrawer]);

  //Handle Sider
  const handleCollapsed = useCallback(
    (flag) => {
      if (flag === 1) {
        handleDrawerVital();
      } else if (flag === 2) {
        handleDrawerMedicalHistory();
      }
    },
    [vitalDrawer, medicalHistoryDrawer]
  );

  useEffect(() => {
    const patientLastHistory = async () => {
      const V_action = await dispatch(
        getVitals({
          patient_unique_id:
            patient_data !== undefined ? patient_data.patient_unique_id : 0,
          pam_id:
            patient_data !== undefined && patient_data.pam_id !== undefined
              ? patient_data.pam_id
              : 0,
          mode: caseManagerData !== undefined ? EDIT : ADD,
        })
      );

      if (caseManagerData === undefined) {
        const MH_action = await dispatch(
          getPatientLastHistory({
            patient_unique_id:
              patient_data !== undefined ? patient_data.patient_unique_id : 0,
          })
        );
        if (MH_action.meta.requestStatus === "fulfilled") {
          setMedicalHistoryData(JSON.parse(JSON.stringify(MH_action.payload)));
        }
      }
    };
    patientLastHistory();
  }, []);

  useEffect(() => {
    if (caseManagerData === undefined) {
      const updatedData = selectedVitalsList.map((e, i) => {
        return {
          ...e,
          systolic: e.blood_press ? e.blood_press.split("/")[0] : "",
          diastolic: e.blood_press ? e.blood_press.split("/")[1] : "",
        };
      });
      setVitalsData(updatedData);
    }
  }, [selectedVitalsList]);

  const vaccinationHandler = () => {
    navigate("/vaccination", { state: { patient_data: patient_data } });
  };

  return (
    <CashManagerContext.Provider value={contextApi}>
      <>
        <HeaderPrescription />
        <div className="w-100 bg-body wrapper2 prescription-wrapper">
          <img src={hey} alt="vitals" className="me-3 hey" />
          <div className="row">
            <div className="col-lg-4 col-md-12 col-12">
              {customizedPadLeftList?.map((e, i) => {
                return e.tmdpm_id === 1 && e.tmdpm_status === 0 ? (
                  <>
                    <div key={i} className="prescription-box-sm p-14">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <img src={vitals} alt="vitals" className="me-3" />
                          <div className="title-common">
                            Vitals & Body Composition
                          </div>
                        </div>
                        <button
                          className="btn d-flex align-items-center btn-text"
                          onClick={handleDrawerVital}
                        >
                          {" "}
                          <i
                            className={`${
                              vitalsData.length > 0 ? "icon-Edit" : "icon-Add"
                            } me-1 fs-5`}
                          ></i>{" "}
                          <span>{`${
                            vitalsData.length > 0 ? "Edit" : "Add"
                          }`}</span>
                        </button>
                      </div>
                      {vitalsData.length > 0 && (
                        <VitalsList
                          mode={caseManagerData !== undefined ? EDIT : ADD}
                        />
                      )}
                    </div>
                    {shouldShowVaccination === "true" ? (
                      <div className="prescription-box-sm p-14">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <img
                              src={vaccinationImg}
                              alt="vitals"
                              className="me-3"
                            />
                            <div className="title-common">Vaccination</div>
                          </div>
                          <button
                            className="btn d-flex align-items-center btn-text"
                            onClick={vaccinationHandler}
                          >
                            {" "}
                            <i
                              className={`${
                                vitalsData.length > 0 ? "icon-Edit" : "icon-Add"
                              } me-1 fs-5`}
                            ></i>{" "}
                            <span>{`${
                              vitalsData.length > 0 ? "Edit" : "Add"
                            }`}</span>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  e.tmdpm_id === 3 && e.tmdpm_status === 0 && (
                    <div key={i} className="prescription-box-sm p-14">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <img
                            src={MedicalHistory}
                            alt="Medical History"
                            className="me-3"
                          />
                          <div className="title-common">Medical History</div>
                          {/* <Button className="btn border rounded-3 px-1 ms-3 collapseButton" onClick={() => collapsedFlag != 2 ? setCollapsedFlag(2) : setCollapsedFlag(null)}>
                            <i style={{ transitionDuration: '0.5s' }} className={`icon-right d-block fs-18 ${collapsedFlag != 2 ? 'iconrotate270' : 'iconrotatehistory90'}`}></i>
                          </Button> */}
                        </div>

                        <button
                          className="btn d-flex align-items-center btn-text"
                          onClick={handleDrawerMedicalHistory}
                        >
                          {" "}
                          <i
                            className={`${
                              medicalHistoryData.length > 0
                                ? "icon-Edit"
                                : "icon-Add"
                            } me-1 fs-5`}
                          ></i>{" "}
                          <span>{`${
                            medicalHistoryData.length > 0 ? "Edit" : "Add"
                          }`}</span>
                        </button>
                      </div>
                      {medicalHistoryData.length > 0 && <MedicalHistoryList />}
                    </div>
                  )
                );
              })}
              {/* <div>
                <button className="btn btn-parameters mx-auto w-100">
                  <div className="align-items-center d-flex justify-content-center">
                    <i className="icon-Add me-2"></i> Add More Parameters
                  </div>
                </button>
              </div> */}
            </div>
            <div className="col-lg-8 col-md-12 col-12 mt-lg-0 mt-3">
              <Content>
                {customizedPadRightList?.map((e, i) => {
                  return e.tmdpm_id === 5 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <SymptomsBox />
                    </div>
                  ) : e.tmdpm_id === 10 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <ExaminationBox />
                    </div>
                  ) : e.tmdpm_id === 11 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <DiagnosisBox />
                    </div>
                  ) : e.tmdpm_id === 12 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <MedicationsBox />
                    </div>
                  ) : e.tmdpm_id === 13 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <AdviceBox />
                    </div>
                  ) : e.tmdpm_id === 14 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      {" "}
                      <InvestigationBox />
                    </div>
                  ) : (
                    e.tmdpm_id === 15 &&
                    e.tmdpm_status === 0 && (
                      <div key={i} className="prescription-box-sm">
                        <TabFollowUpBox />
                      </div>
                    )
                  );
                })}
              </Content>
            </div>
          </div>
        </div>
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerVital}
          open={vitalDrawer}
          className="modalWidth-700"
          width="auto"
        >
          <VitalsBox
            handleDrawerVital={handleDrawerVital}
            handleCollapsed={(flag) => handleCollapsed(flag)}
          />
        </Drawer>
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerMedicalHistory}
          open={medicalHistoryDrawer}
          width="75%"
        >
          <MedicalHistoryBox
            handleDrawerMedicalHistory={handleDrawerMedicalHistory}
            handleCollapsed={(flag) => handleCollapsed(flag)}
          />
        </Drawer>
      </>
    </CashManagerContext.Provider>
  );
}

export default Prescription;
