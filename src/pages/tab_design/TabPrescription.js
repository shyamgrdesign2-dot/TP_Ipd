import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Drawer, DatePicker, Input, Button, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { useSelector, useDispatch } from "react-redux";

import { ADD, EDIT } from "../../utils/constants";

import { getVitals } from "../../redux/vitalsSlice";
import { getPatientLastHistory, listPrivateNotes } from "../../redux/medicalhistorySlice";

import CashManagerContext from "../../context/CashManagerContext";

import HeaderPrescription from "../../common/HeaderPrescription";
import TabSymptomsBox from "../../components/tab_design/TabSymptomsBox";
import TabExaminationBox from "../../components/tab_design/TabExaminationBox";
import TabDiagnosisBox from "../../components/tab_design/TabDiagnosisBox";
import TabMedicationBox from "../../components/tab_design/TabMedicationBox";
import TabAdviceBox from "../../components/tab_design/TabAdviceBox";
import TabInvestigationBox from "../../components/tab_design/TabInvestigationBox";
import TabFollowUpBox from "../../components/tab_design/TabFollowUpBox";

import VitalsBox from "../../components/VitalsBox";
import TabVitalsList from "../../components/tab_design/TabVitalsList";
import MedicalHistoryBox from "../../components/MedicalHistoryBox";
import TabMedicalHistoryList from "../../components/tab_design/TabMedicalHistoryList";
import PrivateNotesBox from "../../components/PrivateNotesBox";
import TabPrivateNotesList from "../../components/tab_design/TabPrivateNotesList";

import vitalsWhite from "../../assets/images/vitals-white.svg";
import vitalsDark from "../../assets/images/vitals-dark.svg";
import medicalHistoryWhite from "../../assets/images/medical-history-white.svg";
import medicalHistoryDark from "../../assets/images/medical-history-dark.svg";
import vaccinationWhite from "../../assets/images/vaccination-white.svg";
import vaccinationDark from "../../assets/images/Vaccination.svg";
import growthChart from "../../assets/images/growth-chart.svg";
import growthChartDark from "../../assets/images/growth-chart-dark.svg";
import privateNotesWhite from "../../assets/images/private-notes-white.svg";
import privateNotesDark from "../../assets/images/private-notes-dark.svg";
import obstetricWhite from "../../assets/images/obstetric-white.svg";
import obstetricDark from "../../assets/images/obstetric-dark.svg";

// import labParametersWhite from '../../assets/images/lab-parameters-white.svg';
// import notesWhite from '../../assets/images/notes-white.svg';
// import docsWhite from '../../assets/images/docs-white.svg';
import Sider from "antd/es/layout/Sider";
import Vaccination from "../vaccination/Vaccination";
import GrowthChart from "../growthChart/GrowthChart";
import { viewPatient } from "../../redux/appointmentsSlice";
import { useAccess } from "../vaccination/useAccess";
import { getGynecDetails } from "../../api/services/ApiGynec";
import Obstetric from "../obstetric/Obstetric";
import TabObstetricList from "../obstetric/components/obstetricList/TabObstetricList";
import { fetchAllObstetricDetails } from "../obstetric/service";
import { addObstetricDetails, navigateToObstetric } from "../../redux/obstetricSlice";

function TabPrescription() {
  const {
    customizedPadLeftList,
    customizedPadRightList,
    frequencyList,
    timingList,
    profile,
  } = useSelector((state) => state.doctors);
  const { selectedVitalsList, vitalsPastList } = useSelector((state) => state.vitals);
  const { privateNotesList } = useSelector((state) => state.medicalhistory);
  const { obstetricDetails, isObstetricDetailsFetched, isNavigateToObstetric } =
    useSelector((state) => state.obstetric);
  const { examinationHistory = [] } = obstetricDetails;
  const dispatch = useDispatch();

  const { state } = useLocation();
  const { patient_data, caseManagerData } = state;
  const chartType = state?.chartType;
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
  const [privateNotesData, setPrivateNotesData] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [additionalNote, setAdditionalNote] = useState("");
  const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const [obstetricDrawer, setObstetricDrawer] = useState(false);
  const [isGrowthChart, setIsGrowthChart] = useState(false);
  const { isVaccinationAccessable, isGrowthChartAccessable, isGynaecHistoryAccessable } = useAccess(
    caseManagerData?.patient_data?.patient_age
  );
  const [updatedGynecHistory, setUpdatedGynecHistory] = useState(null);

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
    privateNotesData,
    setPrivateNotesData,
    followUpDate,
    setFollowUpDate,
    additionalNote,
    setAdditionalNote,
    startTime
  };

  const [collapsed, setCollapsed] = useState(false);
  const [collapsedFlag, setCollapsedFlag] = useState(null);
  const [vitalDrawer, setVitalDrawer] = useState(false);
  const [medicalHistoryDrawer, setMedicalHistoryDrawer] = useState(false);
  const [privateNotesDrawer, setPrivateNotesDrawer] = useState(false);
  const [selectPrivateNotes, setSelectPrivateNotes] = useState(null);
  const [vaccinationDrawer, setVaccinationDrawer] = useState(false);
  const [growthDrawer, setGrowthDrawer] = useState(false);

  const getAllObstetricDetails = async () => {
    const obstetricResponse = await fetchAllObstetricDetails(patient_data.patient_unique_id);
    if (obstetricResponse) {
      dispatch(addObstetricDetails(obstetricResponse));
    }
  }

  useEffect(() => {
    const sendData = {
      patient_unique_id: patient_data?.patient_unique_id,
    };
    dispatch(viewPatient(sendData));
  }, []);

  useEffect(() => {
    if (!isObstetricDetailsFetched && isGynaecHistoryAccessable) {
      getAllObstetricDetails();
    }
  }, [isObstetricDetailsFetched, isGynaecHistoryAccessable]);

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
          const medicineUnit = e?.medicineUnit.map((e1) => {
            return {
              key: JSON.stringify({ ...e1 }),
              value: e1.tmu_id,
              label: <>{e1.tmu_title}</>,
            };
          });

          const unitObj = medicineUnit
            ? medicineUnit.find((x) => x.value == e.tmm_unit)
            : null;
          const frequencyObj = frequencyList.find(
            (x) => x.tmf_id == e.tmm_freq_type
          );
          const timingObj = timingList.find((x) => x.tmt_id == e.tmm_time);

          return {
            ...e,
            tmm_unit_name:
              unitObj && unitObj !== undefined
                ? JSON.parse(unitObj.key).tmu_title
                : "",
            tmm_freq_type_name:
              frequencyObj !== undefined ? frequencyObj.tmf_title : "",
            tmf_block_val:
              frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
            tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
            medicineUnit: medicineUnit,
            tmm_days_duration_type: `${e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : ""
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
  }, []);

  // Drawer Vitals
  const handleDrawerVital = useCallback(() => {
    setCollapsedFlag(1);
    setVitalDrawer(!vitalDrawer);
  }, [collapsedFlag, vitalDrawer]);

  // Drawer Medical History
  const handleDrawerMedicalHistory = useCallback(() => {
    setCollapsedFlag(2);
    setMedicalHistoryDrawer(!medicalHistoryDrawer);
  }, [collapsedFlag, medicalHistoryDrawer]);

  // Drawer Private Notes
  const handleDrawerPrivateNotes = useCallback((data) => {
      setCollapsedFlag(4);
    setSelectPrivateNotes(data)
      setPrivateNotesDrawer(!privateNotesDrawer);
  }, [privateNotesDrawer, selectPrivateNotes]);

  // Drawer Vaccination
  const handleDrawerVaccination = () => {
    setCollapsedFlag(3);
    setVaccinationDrawer(!vaccinationDrawer);
  };

  // Drawer Growth Chart
  const handleDrawerGrowth = () => {
    setCollapsedFlag(5);
    setGrowthDrawer(!growthDrawer);
    setIsGrowthChart(!isGrowthChart);
  };

   // Drawer Obstetric
  const handleDrawerObstetric = () => {
    setCollapsedFlag(6);
    setObstetricDrawer(!obstetricDrawer);
  };

  useEffect(() => {
    if (chartType === "vaccination") {
      handleDrawerVaccination();
    } else if (chartType === "growthChart") {
      handleDrawerGrowth();
    }
  }, [chartType]);

  useEffect(() => {
    if (isNavigateToObstetric) {
      handleDrawerObstetric();
      dispatch(navigateToObstetric());
    }
  }, [isNavigateToObstetric]);

  useEffect(() => {
    if (collapsedFlag === 6 && examinationHistory.length === 0) {
      setCollapsed(false);
    }
  }, [collapsedFlag, collapsed])

  //Handle Sider
  const openCollapsed = useCallback(
    (flag) => {
      setCollapsedFlag(flag);
      setCollapsed(true);
    },
    [collapsedFlag, collapsed]
  );

  const handleCollapsed = useCallback(
    (flag) => {
      setCollapsedFlag(flag);
      !collapsed && setCollapsed(!collapsed);
      if (flag === 1) {
        handleDrawerVital();
      } else if (flag === 2) {
        handleDrawerMedicalHistory();
      } else if (flag === 3) {
        handleDrawerVaccination();
      } else if (flag === 4) {
        handleDrawerPrivateNotes();
      } else if (flag === 5) {
        handleDrawerGrowth();
      } else if (flag === 6) {
        handleDrawerObstetric();
      }
    },
    [
      collapsedFlag,
      collapsed,
      vitalDrawer,
      medicalHistoryDrawer,
      vaccinationDrawer,
      privateNotesDrawer
    ]
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

      const PN_action = await dispatch(
        listPrivateNotes({
          patient_unique_id:
            patient_data !== undefined ? patient_data.patient_unique_id : 0,
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

  useEffect(() => {
    if (caseManagerData !== undefined) {
      if (caseManagerData.private_notes && customizedPadLeftList.findIndex((e) => e.tmdpm_id === 8 && e.tmdpm_status === 0) !== -1 && privateNotesList.findIndex((e) => e.id === caseManagerData.private_notes.id) !== -1 && tcmId) {
        setPrivateNotesData(caseManagerData.private_notes);
      }
    }
  }, [privateNotesList]);

  const handleSaveGynecHistory = (updatedGynecHistory) => {
    setUpdatedGynecHistory(updatedGynecHistory)
  };

  useEffect(() => {
    if(isGynaecHistoryAccessable){
        fetchGynecHistory();
    }
  }, [isGynaecHistoryAccessable]);

  const fetchGynecHistory = async () => {
      try {
          const data = await getGynecDetails(patient_data.patient_unique_id);
          // Destructure to remove createdAt and createdBy
          const { createdAt, createdBy, ...updatedData } = data;
          
          setUpdatedGynecHistory(updatedData);
      } catch (error) {
          console.error('Error fetching gynec history:', error);
      }
  }; 

  return (
    <CashManagerContext.Provider value={contextApi}>
      <>
        <HeaderPrescription isVaccinationEnabled={isVaccinationAccessable} isGrowthChartEnabled={isGrowthChartAccessable} gynecHistory={updatedGynecHistory} />
        <div className="w-100 bg-body wrapper2 prescription-wrapper p-0">
          <Layout>
            <div className="prescription-sidebar">
              {customizedPadLeftList?.map((e, i) => {
                return e.tmdpm_id === 1 && e.tmdpm_status === 0 ? (
                  <button
                    key={i}
                    type="button"
                    className="mb-3 text-center btn btn-action"
                    onClick={() =>
                      vitalsData.length === 0 && vitalsPastList.length === 0
                        ? handleDrawerVital()
                        : openCollapsed(1)
                    }
                  >
                    <div
                      className={`prescription-tab-button rounded-10px ${
                        collapsedFlag == 1 && "active"
                      }`}
                    >
                      <img
                        src={collapsedFlag == 1 ? vitalsDark : vitalsWhite}
                        alt="Vitals"
                      />
                    </div>
                    <label className="text-white mt-1">Vitals</label>
                  </button>
                ) : e.tmdpm_id === 3 && e.tmdpm_status === 0 ? (
                  <button
                    key={i}
                    type="button"
                    className="mb-3 text-center btn btn-action"
                    onClick={() =>
                      (medicalHistoryData.length === 0 && !updatedGynecHistory)
                        ? handleDrawerMedicalHistory()
                        : openCollapsed(2)
                    }
                  >
                    <div
                      className={`prescription-tab-button rounded-10px ${
                        collapsedFlag == 2 && "active"
                      }`}
                    >
                      <img
                        src={
                          collapsedFlag == 2
                            ? medicalHistoryDark
                            : medicalHistoryWhite
                        }
                        alt="Medical History"
                      />
                    </div>
                    <label className="text-white mt-1">History</label>
                  </button>
                ) : e.tmdpm_id === 8 && e.tmdpm_status === 0 ? (
                  <button
                    key={i}
                    type="button"
                    className="mb-3 text-center btn btn-action position-relative"
                    onClick={() =>
                      privateNotesList?.length === 0
                        ? handleDrawerPrivateNotes()
                        : openCollapsed(4)
                    }
                  >
                    <div
                      className={`prescription-tab-button rounded-10px  ${
                        collapsedFlag == 4 && "active"
                      }`}
                    >
                      {privateNotesList?.length > 0 && (
                        <div className="notes-dot">
                          {privateNotesList?.length > 5
                            ? "5+"
                            : privateNotesList?.length}
                        </div>
                      )}
                      <img
                        src={
                          collapsedFlag == 4
                            ? privateNotesDark
                            : privateNotesWhite
                        }
                        alt="Private Notes"
                      />
                    </div>
                    <label className="text-white mt-1">Private Notes</label>
                  </button>
                ) : 
                  e.tmdpm_id === 7 &&
                  e.tmdpm_status === 0 &&
                  isVaccinationAccessable ? (
                  <button
                    type="button"
                    className="mb-3 text-center btn btn-action"
                    onClick={handleDrawerVaccination}
                  >
                    <div
                        className={`bg-secondary-light prescription-tab-button rounded-10px ${collapsedFlag === 3 && "active"}`}
                    >
                      <img
                        src={
                          collapsedFlag === 3
                            ? vaccinationDark
                            : vaccinationWhite
                        }
                        alt="Vitals"
                      />
                    </div>
                    <label className="text-white mt-1">Vaccine</label>
                  </button>
                  )
                 : 
                  e.tmdpm_id === 16 &&
                  e.tmdpm_status === 0 &&
                  isGrowthChartAccessable ? (
                      <button
                        type="button"
                        className="mb-3 text-center btn btn-action"
                        onClick={handleDrawerGrowth}
                      >
                        <div
                          className={`prescription-tab-button rounded-10px ${
                            collapsedFlag === 5 && "active"
                          }`}
                        >
                          <img
                            src={
                              collapsedFlag === 5
                                ? growthChartDark
                                : growthChart
                            }
                            alt="Growth"
                          />
                        </div>
                        <label className="text-white mt-1">Growth</label>
                      </button>
                  )
                  :
                  e.tmdpm_id === 17 &&
                    e.tmdpm_status === 0 &&
                    isGynaecHistoryAccessable && (
                        <button
                          type="button"
                          className="mb-3 text-center btn btn-action"
                          style={{padding: "0px"}}
                          onClick={() => examinationHistory.length === 0 ? handleDrawerObstetric() : openCollapsed(6)}
                        >
                          <div
                            className={`prescription-tab-button rounded-10px ${
                              collapsedFlag === 6 && "active"
                            }`}
                          >
                            <img
                              src={
                                collapsedFlag === 6
                                  ? obstetricDark
                                  : obstetricWhite
                              }
                              alt="Obstetric"
                            />
                          </div>
                          <label className="text-white mt-1">Obstetric</label>
                        </button>
                    )
                ;
              })}
              {/* <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="prescription-tab-button rounded-10px">
                                    <img src={medicalHistoryWhite} alt="History" />
                                </div>
                                <label className="text-white mt-1">History</label>
                            </button>
                            <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="prescription-tab-button rounded-10px">
                                    <img src={labParametersWhite} alt="Lab" />
                                </div>
                                <label className="text-white mt-1">Lab</label>
                            </button>
                            <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="prescription-tab-button rounded-10px">
                                    <img src={vaccinationWhite} alt="Vaccine" />
                                </div>
                                <label className="text-white mt-1">Vaccine</label>
                            </button>
                            <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="prescription-tab-button rounded-10px">
                                    <img src={notesWhite} alt="Notes" />
                                </div>
                                <label className="text-white mt-1">Notes</label>
                            </button>
                            <button type='button' className="mb-3 text-center btn btn-action">
                                <div className="prescription-tab-button rounded-10px">
                                    <img src={docsWhite} alt="Docs" />
                                </div>
                                <label className="text-white mt-1">Docs</label>
                            </button> */}
            </div>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              className={collapsed ? "tabsider" : "tabsider1"}
            >
              {collapsedFlag === 1 ? (
                <TabVitalsList
                  mode={caseManagerData !== undefined ? EDIT : ADD}
                  handleDrawerVital={handleDrawerVital}
                  handleCollapsed={() => setCollapsed(!collapsed)}
                />
              ) : collapsedFlag === 2 ? (
                <TabMedicalHistoryList
                  mode={caseManagerData !== undefined ? EDIT : ADD}
                  handleDrawerMedicalHistory={handleDrawerMedicalHistory}
                  handleCollapsed={() => setCollapsed(!collapsed)}
                  gynecHistory={updatedGynecHistory}
                />
              ) : collapsedFlag === 4 ? (
                  <TabPrivateNotesList
                    mode={caseManagerData !== undefined ? EDIT : ADD}
                    handleDrawerPrivateNotes={handleDrawerPrivateNotes}
                    handleCollapsed={() => setCollapsed(!collapsed)}
                  />
              ) : collapsedFlag === 6 && (
                <TabObstetricList
                  handleCollapsed={() => setCollapsed(!collapsed)}
                  handleDrawerObstetric={handleDrawerObstetric} />
              )}
            </Sider>
            <div
              className="p-20 w-100 overflow-y-auto"
              style={{ height: "calc(100vh - 60px)" }}
            >
              <Content>
                {customizedPadRightList?.map((e, i) => {
                  return e.tmdpm_id === 5 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabSymptomsBox />
                    </div>
                  ) : e.tmdpm_id === 10 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabExaminationBox />
                    </div>
                  ) : e.tmdpm_id === 11 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabDiagnosisBox />
                    </div>
                  ) : e.tmdpm_id === 12 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabMedicationBox />
                    </div>
                  ) : e.tmdpm_id === 13 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      {" "}
                      <TabAdviceBox />
                    </div>
                  ) : e.tmdpm_id === 14 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabInvestigationBox />
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
          </Layout>
        </div>
        {vitalDrawer && (<Drawer
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
              isGrowthChart={isGrowthChart}
            />
        </Drawer>)}
        <Drawer
          className="scroll-y-hidden"
          closeIcon={false}
          placement="right"
          onClose={handleDrawerMedicalHistory}
          open={medicalHistoryDrawer}
          width="100%"
        >
          <MedicalHistoryBox
            handleDrawerMedicalHistory={handleDrawerMedicalHistory}
            handleCollapsed={(flag) => handleCollapsed(flag)}
            onSave={handleSaveGynecHistory}
          />
        </Drawer>
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerPrivateNotes}
          open={privateNotesDrawer}
          className="modalWidth-563"
          width="auto"
        >
          <PrivateNotesBox
            handleDrawerPrivateNotes={handleDrawerPrivateNotes}
            handleCollapsed={(flag) => handleCollapsed(flag)}
            selectPrivateNotes={selectPrivateNotes}
          />
        </Drawer>
        {vaccinationDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleDrawerVaccination}
            open={vaccinationDrawer}
            width="100%"
          >
            <Vaccination handleDrawerVaccination={handleDrawerVaccination} />
          </Drawer>
        )}
        {growthDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleDrawerGrowth}
            open={growthDrawer}
            width="100%"
            push={false}
          >
            <GrowthChart
              handleDrawerVaccination={handleDrawerGrowth}
              handleDrawerVital={handleDrawerVital}
            />
          </Drawer>
        )}
        {obstetricDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleDrawerObstetric}
            open={obstetricDrawer}
            width="100%"
            push={false}
          >
            <Obstetric
              handleDrawerObstetric={handleDrawerObstetric}
              handleCollapsed={(flag) => handleCollapsed(flag)} />
          </Drawer>
        )}
      </>
    </CashManagerContext.Provider>
  );
}
export default TabPrescription;
