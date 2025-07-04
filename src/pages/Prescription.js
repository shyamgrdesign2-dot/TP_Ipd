import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Drawer, Tabs } from "antd";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { useSelector, useDispatch } from "react-redux";

import { ADD, EDIT, EXTRA_OPTIONS, FREE, GB_GYNEC_HISTORY, GB_ZYDUS_USER, GYNAECOLOGY, PAEDIATRICS, PERSISTANT_STORAGE_KEY_AUTH_TOKEN, S_DDX } from "../utils/constants";

import { getPatientBirthWeight, getVitals } from "../redux/vitalsSlice";
import { getPatientLastHistory, listPrivateNotes } from "../redux/medicalhistorySlice";

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
import MedicalHistoryList from "../components/MedicalHistoryList";

import PrivateNotesBox from "../components/PrivateNotesBox";
import PrivateNotesList from "../components/PrivateNotesList";

import vitals from "../assets/images/Vitals.svg";
import MedicalHistory from "../assets/images/Medical-History.svg";
import privateNotes from "../assets/images/private-notes.svg";

import hey from "../assets/images/bg-hey.png";

import { Content } from "antd/es/layout/layout";
import vaccinationImg from "../assets/images/Vaccination.svg";
import growthChartImg from "../assets/images/growth-chart-dark.svg";
import obstetricImg from "../assets/images/obstetric-dark.svg";
import uploadDocImg from "../assets/images/upload-doc-dark.svg";
import labResultImg from "../assets/images/Lab.svg";
import Vaccination from "./vaccination/Vaccination";
import GrowthChart from "./growthChart/GrowthChart";
import { viewPatient } from "../redux/appointmentsSlice";
import { useAccess } from "./vaccination/useAccess";
import { getGynecDetails } from "../api/services/ApiGynec";
import Obstetric from "./obstetric/Obstetric";
import ObstetricList from "./obstetric/components/obstetricList/ObstetricList";
import { fetchObstetricDetails } from "./obstetric/service";
import { addObstetricDetails } from "../redux/obstetricSlice";
import { errorMessage, getClinicName, trackEvent, getTokenData, getDeviceSdkData } from "../utils/utils";
import { deviceType, osName } from "react-device-detect";
import UploadDocument from "./medicalRecords/UploadDocument";
import MedicalRecords from "./medicalRecords/MedicalRecords";
import {
  fetchAllDocumentCategories,
  fetchAllPatientDocs,
  fetchDocsUploadedByPatient,
} from "./medicalRecords/service";
import {
  setAllUploadedDocs,
  setPatientUploadedDocs,
  setUploadDocCategories,
  zydusDocsList,
  zydusRadioList,
} from "../redux/uploadDocSlice";
import UploadDocumentList from "./medicalRecords/components/uploadDocumentList/UploadDocumentList";
import { generateUniqueFileName, getCorrectedFileName, mergeDocuments } from "./medicalRecords/utils/helper";
import LabParametersList from "../components/LabParametersList";
import axios from 'axios';
import { env } from "../EnvironmentConfig";
import LabParams from "../components/LabParams";
import ViewLabParam from "../components/ViewLabParams";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import DDxKnowMore from "../components/DDxKnowMore";
import TabPane from "antd/es/tabs/TabPane";
import apexAIImg from "../assets/images/apexAI.svg";
import blinkingDot from "../assets/images/blinkingDot.gif";
import DifferentialDiagnosisDrawer from "../components/DifferentialDiagnosisDrawer";
import { setIsDDxReadyToGenerate, setShowSCPopup, setSymptomCollector } from "../redux/ddxSlice";
import { getDDxDetails } from "../api/services/ApiDDx";
import { getDecodedToken } from "../utils/localStorage";
import DDxList from "../components/medical_certificate/DDxList";
import SurgicalBox from "../components/SurgicalBox";
import AddCustomModule from "../components/AddCustomModule";
import CustomModule from "../components/CustomModule";

import TatvaAiKnowMore from "../components/TatvaAiKnowMore";
import GenRxBox from "../components/GenRxBox";
import GenRxKnowMore from "../components/GenRxKnowMore";
import ConsultationDrawer from "../components/ConsultationDrawer";
import ExpiredSubModal from "./monetization/components/ExpiredSubModal";
import { checkCredits } from "../redux/monetizationSlice";
import { services } from "../redux/doctorsSlice";
import { fetchSymptomsCollectorData } from "../api/services/ApiGenRx";
import SCPopup from "../components/SCPopup";
import SCBanner from "../components/SCBanner";
import genRxBg from "../assets/images/gen-rx-bg.gif";
import LabResultsTable from '../components/LabParams';
import ZydusLabParams from '../components/ZydusLabParams';
import ZydusLabParametersList from "../components/ZydusLabParametersList";

function Prescription() {
  const {
    userId,
    customizedPadLeftList,
    customizedPadRightList,
    frequencyList,
    timingList,
  } = useSelector((state) => state.doctors);
  const { planDetails } = useSelector((state) => state.subscription);
  const { selectedVitalsList, vitalsPastList, patientBirthWeight } =
    useSelector((state) => state.vitals);
  const { privateNotesList } = useSelector((state) => state.medicalhistory);
  const { obstetricDetails: allObstetricDetails, isObstetricDetailsFetched, isNavigateToObstetric } =
    useSelector((state) => state.obstetric);
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const examinationHistory = obstetricDetails?.examinationHistory || [];
  const shouldShowAncHistory = obstetricDetails?.ancHistory?.find(
    (item) =>
      !item?.deleted &&
      (item?.dueDate ||
        item?.status === "Completed" ||
        item?.notes ||
        item?.enablePrint)
  );

  const shouldShowImmunisation = obstetricDetails?.immunisationHistory?.find(
    (item) =>
      !item?.deleted &&
      (item?.givenDate ||
        item?.status === "Given" ||
        item?.notes ||
        item?.enablePrint)
  );
  const { allUploadedDocs, uploadDocCategories } = useSelector(
    (state) => state.uploadDoc
  );
  const { customModules } = useSelector(
    (state) => state.customModules
  );
  const dispatch = useDispatch();
  const decodedToken = getDecodedToken();
  const tokenData = decodedToken?.result;

  const { state } = useLocation();
  const { patient_data, send_path, caseManagerData } = state;
  const chartType = state?.chartType;
  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;
  const pamId = caseManagerData !== undefined ? caseManagerData.pam_id : 0;
  const consultationDate =
    caseManagerData !== undefined
      ? caseManagerData.consultation_date
      : moment().format("YYYY-MM-DD HH:mm:ss");

  const { profile } = useSelector((state) => state.doctors);

  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [surgeriesData, setSurgeriesData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [adviceData, setAdviceData] = useState([]);
  const [investigationData, setInvestigationData] = useState([]);
  const [medicationData, setMedicationData] = useState([]);
  const [vitalsData, setVitalsData] = useState([]);
  const [medicalHistoryData, setMedicalHistoryData] = useState([]);
  const [addlabparamsDrawer, setAddlabparamsDrawer] = useState(false);
  const [viewlabparamsDrawer, setViewlabparamsDrawer] = useState(false);
  const [privateNotesData, setPrivateNotesData] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [additionalNote, setAdditionalNote] = useState("");
  const [isGrowthChart, setIsGrowthChart] = useState(false);
  const [labParamsData, setLabParamsData] = useState([]);
  const startTime = moment().format("YYYY-MM-DD HH:mm:ss");
  const [customModuleContents, setCustomModuleContents] = useState([]);
  const [isGenRxDrawerVisible, setIsGenRxDrawerVisible] = useState(caseManagerData?.smart_prescription_filename || false);
  const [pillupSwitch, setPillupSwitch] = useState(true);
  const [showSCBanner, setShowSCBanner] = useState(false);
  const [zydusTestReportDrawer, setZydusTestReportDrawer] = useState(false);
  const [labReportID, setLabReportID] = useState(null);
  const [zydusSelectedLabParams, setZydusSelectedLabParams] = useState([]);

  const { servicesList } = useSelector((state) => state.doctors);

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalData, setSubModalData] = useState(null);
  const [useVoiceRx, setUseVoiceRx] = useState(false);
  const [useDDX, setUseDDX] = useState(false);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const showHideSubModal = (object) => {
    object && setSubModalData(object)
    setIsSubModalOpen(!isSubModalOpen);
  }

  const contextApi = {
    patient_data,
    send_path,
    tcmId,
    pamId,
    consultationDate,
    symptomsData,
    setSymptomsData,
    examinationData,
    setExaminationData,
    surgeriesData,
    setSurgeriesData,
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
    startTime,
    customModuleContents,
    setCustomModuleContents,
    pillupSwitch,
    setPillupSwitch,
    showHideSubModal,
    useVoiceRx,
    setUseVoiceRx,
    useDDX,
    setUseDDX
  };

  const [vitalDrawer, setVitalDrawer] = useState(false);
  const [medicalHistoryDrawer, setMedicalHistoryDrawer] = useState(false);
  const [privateNotesDrawer, setPrivateNotesDrawer] = useState(false);
  const [selectPrivateNotes, setSelectPrivateNotes] = useState(null);
  const [vaccinationDrawer, setVaccinationDrawer] = useState(false);
  const [growthDrawer, setGrowthDrawer] = useState(false);
  const [updatedGynecHistory, setUpdatedGynecHistory] = useState(null);
  const [obstetricDrawer, setObstetricDrawer] = useState(false);
  const [uploadDocDrawer, setUploadDocDrawer] = useState(false);
  const [medicalReportDrawer, setMedicalReportDrawer] = useState(false);
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [isEditDocument, setIsEditDocument] = useState(false);
  const fileInputRef = useRef(null);
  const [shouldShowApexPopup, setShowApexPopup] = useState(true);
  const [shouldShowGenRxPopup, setShowGenRxPopup] = useState(true);
  const [shouldShowTatvaAiPopup, setShowTatvaAiPopup] = useState(true);
  const [ddxKnowMoreDrawer, setDDxKnowMoreDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [generatedDDx, setGeneratedDDx] = useState({ results: [] });
  const [isDDxLoading, setIsDDxLoading] = useState(false);
  const [ddxDrawer, setDDxDrawer] = useState(false);
  const [likeDislike, setLikeDislike] = useState([]);
  const [isDDxGenerated, setIsDDxGenerated] = useState(false);
  const [genRxKnowMoreDrawer, setGenRxKnowMoreDrawer] = useState(false);
  const [tatvaAiKnowMoreDrawer, setTatvaAiKnowMoreDrawer] = useState(false);
  const tp_monetization_enable = true;
  const [showShimmer, setShowShimmer] = useState(false);
  const isApexAIAccessable = useFeatureIsOn("cdss");
  const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);
  const isVoiceRxAccessable = useFeatureIsOn("voice-rx");
  const isSCAccessable = useFeatureIsOn("symptoms-collector");
  const {
    isVaccinationAccessable,
    isGrowthChartAccessable,
    isGynaecHistoryAccessable,
  } = useAccess(patient_data?.ageYears);
  const { isDDxReadyToGenerate, showSCPopup, isAutofillSelected } = useSelector(
    (state) => state.ddx
  );

  const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  const baseUrl = env.lab_params_api_url;

  const getAllObstetricDetails = async () => {
    const obstetricResponse = await fetchObstetricDetails(
      patient_data.patient_unique_id,
    );
    if (obstetricResponse) {
      dispatch(addObstetricDetails(obstetricResponse));
    }
  };

  const getAllPatientDocs = async () => {
    const doctorUploadedDocs = await fetchAllPatientDocs(
      patient_data.patient_unique_id
    );
    const patientUploadedDocs = await fetchDocsUploadedByPatient(
      patient_data.patient_unique_id
    );
    dispatch(setPatientUploadedDocs(patientUploadedDocs));
    dispatch(
      setAllUploadedDocs(
        mergeDocuments(doctorUploadedDocs, patientUploadedDocs)
      )
    );
    const tokenData = decodedToken?.result;
    if (tokenData?.hospital_business_id == env.zydus_business_id && isZydusUserAccessableFromGB && patient_data.mrno != null && patient_data.mrno != undefined) {
      dispatch(zydusDocsList({ mrno: patient_data.mrno, um_id: tokenData?.user_id }))
      dispatch(zydusRadioList({ mrno: patient_data.mrno, um_id: tokenData?.user_id }))
    }
  };

  const getAllDocumentCategories = async () => {
    const response = await fetchAllDocumentCategories();
    dispatch(setUploadDocCategories(response));
  };

  useEffect(() => {
    if (isAutofillSelected) {
      setShowShimmer(true);
      const timer = setTimeout(() => {
        setShowShimmer(false);
      }, 1000); // 1 seconds

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [isAutofillSelected]);

  useEffect(() => {
    const clinic_name = getClinicName(profile?.hospital_data);
    tcmId == 0 ?
      window.Moengage.track_event("TP_Consultation_Started", {
        clinic_name,
        patient_number: patient_data?.pm_contact_no,
        patient_id: patient_data?.patient_unique_id,
        tcm_id: tcmId,
      })
      :
      window.Moengage.track_event("TP_Consultation_edit_started", {
        clinic_name,
        patient_number: patient_data?.pm_contact_no,
        patient_id: patient_data?.patient_unique_id,
      })
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
    if (uploadDocCategories.length === 0) {
      getAllDocumentCategories();
    }
    if (patient_data.patient_unique_id && allUploadedDocs.length === 0) {
      getAllPatientDocs();
    }
  }, [isZydusUserAccessableFromGB]);

  useEffect(() => {
    if (caseManagerData !== undefined) {
      if (
        caseManagerData.vitals.length > 0 &&
        customizedPadLeftList.findIndex(
          (e) => e.tmdpm_id === 1 && e.tmdpm_status === 0
        ) !== -1
      ) {
        if (tcmId !== 0) {
          const updatedData = caseManagerData.vitals.map((e, i) => {
            return {
              ...e,
              systolic: e.blood_press ? e.blood_press.split("/")[0] : "",
              diastolic: e.blood_press ? e.blood_press.split("/")[1] : "",
            };
          });
          setVitalsData(updatedData);
        }
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
        caseManagerData.surgeries.length > 0 &&
        customizedPadRightList.findIndex(
          (e) => e.tmdpm_id === 21 && e.tmdpm_status === 0
        ) !== -1
      ) {
        setSurgeriesData(caseManagerData.surgeries);
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
                ? `${e.tcm_tmm_freq_morning && e.tcm_tmm_freq_morning != 0
                  ? e.tcm_tmm_freq_morning + " - "
                  : "0 -"
                }${e.tcm_tmm_freq_afternoon && e.tcm_tmm_freq_afternoon != 0
                  ? e.tcm_tmm_freq_afternoon + " - "
                  : "0 -"
                }${e.tcm_tmm_freq_evening && e.tcm_tmm_freq_evening != 0
                  ? e.tcm_tmm_freq_evening + " - "
                  : ""
                }${e.tcm_tmm_freq_night && e.tcm_tmm_freq_night != 0
                  ? e.tcm_tmm_freq_night
                  : "0"}`
                : frequencyObj !== undefined
                  ? frequencyObj.tmf_title
                  : "",
            tmf_block_val:
              frequencyObj !== undefined ? frequencyObj.tmf_block_val : "",
            tmm_time_name: timingObj !== undefined ? timingObj.tmt_title : "",
            tmm_dosage_unit_name: `${e.tmm_dosage
              ? `${e.tmm_dosage} ${unitObj && unitObj !== undefined ? unitObj.tmu_title : ""
              }`
              : ""
              }`,
            tmm_days_duration_type: EXTRA_OPTIONS.some((x) => x.value == e.tmm_duration_type) ? e.tmm_duration_type : e.tmm_days ? `${e.tmm_days} ${e.tmm_duration_type}` : "",
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
      if (caseManagerData?.moduleContents?.length) {
        setCustomModuleContents(caseManagerData?.moduleContents?.filter(
          (e) => !!customModules.find((cm) => cm.module_id === e.module_id)
        ))
      }
      setPillupSwitch(caseManagerData?.pillup_fulfilment == 1 ? true : false)
      
      // Initialize labReportID from caseManagerData if available
      if (caseManagerData?.labReportID) {
        setLabReportID(caseManagerData.labReportID);
      }
    }
  }, []);

  // Drawer Vitals
  const handleDrawerVital = useCallback(() => {
    setVitalDrawer(!vitalDrawer);
  }, [vitalDrawer]);

  // Drawer Medical History
  const handleDrawerMedicalHistory = useCallback(() => {
    setMedicalHistoryDrawer(!medicalHistoryDrawer);
  }, [medicalHistoryDrawer]);

  // Drawer Private Notes
  const handleDrawerPrivateNotes = useCallback((data) => {
    setSelectPrivateNotes(data)
    setPrivateNotesDrawer(!privateNotesDrawer);
  }, [privateNotesDrawer, selectPrivateNotes]);

  // Drawer Vaccination
  const handleDrawerVaccination = () => {
    setVaccinationDrawer(!vaccinationDrawer);
  };

  // Drawer Growth Chart
  const handleDrawerGrowth = () => {
    setGrowthDrawer(!growthDrawer);
    setIsGrowthChart(!isGrowthChart);
  };

  // Drawer Upload Document
  const handleDrawerUploadDoc = () => {
    setUploadDocDrawer(!uploadDocDrawer);
  };

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  // Drawer Medical Report
  const handleDrawerMedicalReport = () => {
    setMedicalReportDrawer(!medicalReportDrawer);
  };

  // Drawer Obstetric
  const handleDrawerObstetric = (obstetricKey) => {
    setObstetricDrawer(
      typeof obstetricKey === "string" ? obstetricKey : !obstetricDrawer
    );
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
      handleDrawerObstetric(isNavigateToObstetric);
    }
  }, [isNavigateToObstetric]);

  //Handle Sider
  const handleCollapsed = useCallback(
    (flag) => {
      if (flag === 1) {
        handleDrawerVital();
      } else if (flag === 2) {
        handleDrawerMedicalHistory();
      } else if (flag === 3) {
        handleDrawerVaccination();
      } else if (flag === 4) {
        handleDrawerPrivateNotes();
      }
    },
    [vitalDrawer, medicalHistoryDrawer, vaccinationDrawer, privateNotesDrawer]
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
          mode: caseManagerData !== undefined && tcmId !== 0 ? EDIT : ADD,

          pm_pid: patient_data !== undefined ? patient_data.pm_pid : 0, //extra
          pm_id: patient_data !== undefined ? patient_data.pm_id : 0, //extra
        })
      );

      if (
        profile?.dp_name === PAEDIATRICS && patient_data?.ageMonths <= 12 &&
        patient_data?.ageYears === 0
      ) {
        dispatch(
          getPatientBirthWeight({
            patient_unique_id:
              patient_data !== undefined ? patient_data.patient_unique_id : 0,
            pam_id:
              patient_data !== undefined && patient_data.pam_id !== undefined
                ? patient_data.pam_id
                : 0,
          })
        );
      }

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
    if (caseManagerData === undefined || tcmId === 0) {
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
    if (isGynaecHistoryAccessable) {
      fetchGynecHistory();
    }
  }, [isGynaecHistoryAccessable]);

  useEffect(() => {
    getLabParams();
  }, []);

  useEffect(() => {
    if (isSCAccessable) {
      getSymptomsCollectorData();
    }
  }, []);


  const getSymptomsCollectorData = async () => {
    const payload = {
      um_id: String(userId),
      patient_unique_id: String(patient_data?.patient_unique_id),
      hm_id: String(decodedToken?.result?.clinic_id),
      pam_id:
        patient_data !== undefined && patient_data.pam_id !== undefined
          ? String(patient_data.pam_id)
          : caseManagerData !== undefined
          ? String(caseManagerData.pam_id)
          : 0,
    };
    const response = await fetchSymptomsCollectorData(payload);
    if (response && Object.keys(response)?.length > 0) {
      dispatch(setSymptomCollector(response?.summary_json_doctor));
      setShowSCBanner(true);
      if (patient_data?.pam_status === "0") {
        dispatch(setShowSCPopup(true));
      }
    }
  };

  const fetchGynecHistory = async () => {
    try {
      const data = await getGynecDetails(
        patient_data.patient_unique_id,
        userId
      );
      // Destructure to remove createdAt and createdBy
      const { createdAt, createdBy, ...updatedData } = data;

      setUpdatedGynecHistory(updatedData);
    } catch (error) {
      console.error('Error fetching gynec history:', error);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const filesData = Array.from(files);
      if (filesData.length > 0) {
        const updatedFiles = [];
        filesData.forEach((file) => {
          const cleanFileName = getCorrectedFileName(file?.name || "");
          // Check if the file is an image and if its name follows typical camera-captured file patterns
          const isCapturedFromCamera =
            (file.type === "image/jpeg" ||
              file.type === "image/png" ||
              file.type === "image/jpg") &&
            (cleanFileName === "image.jpg" ||
              cleanFileName === "image.png" ||
              cleanFileName === "image.jpeg");

          let newFile = file;

          if (isCapturedFromCamera) {
            // Generate a unique file name for camera-captured images
            const uniqueFileName = generateUniqueFileName(file);
            newFile = new File([file], uniqueFileName, { type: file.type });
          } else {
            // If the file name had spaces, create a new file with spaces removed
            newFile = new File([file], cleanFileName, { type: file.type });
          }

          updatedFiles.push(newFile);
        });
        setFilesData(updatedFiles);
        handleDrawerUploadDoc();
      }
    }
    event.target.value = null;
  };

  // Handle Add button click
  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddLabParamsDrawer = useCallback(
    () => {
      setAddlabparamsDrawer(!addlabparamsDrawer)
    },
    [addlabparamsDrawer]
  );

  const handleViewLabParamsDrawer = useCallback(
    () => {
      setViewlabparamsDrawer(!viewlabparamsDrawer)
    },
    [viewlabparamsDrawer]
  );

  // Function to close "View Lab Params" and open "Add Lab Params"
  const handleSwitchToAddLabParams = () => {
    setViewlabparamsDrawer(false);
    setAddlabparamsDrawer(true);
  };

  // Function to update lab params data in parent component when saved
  const handleLabParamsUpdate = () => {
    getLabParams(); // Update state with the new lab params data
  };

  const showHideBackModal = () => {
    setIsBackModalOpen(!isBackModalOpen);
  };

  const getLabParams = async () => {
    try {
      const cleanedToken = token.replace(/['"]+/g, '');
      const response = await axios.get(`${baseUrl}/api/v1/lab-parameters/results/${patient_data?.patient_unique_id}`, {
        headers: {
          'Authorization': `Bearer ${cleanedToken}`,
        },
      });
      setLabParamsData(response.data?.data?.results || []);
    } catch (error) {
      console.error("Error fetching lab params:", error);
    }
  };

  const handleDDxKnowMore = () => {
    setDDxKnowMoreDrawer((prev) => !prev);
  };

  const handleDDxDrawer = (field) => {
    setDDxDrawer((prev) => !prev);
    if (!ddxDrawer) {
      window.Moengage.track_event("TP_CDSS_Ddx_reviewed", {
        clinic_name: getClinicName(profile?.hospital_data),
        doctor_id: profile?.doctor_unique_id,
        patient_number: patient_data?.pm_contact_no,
        patient_id: patient_data?.patient_unique_id,
        field: field,
      });
    }
  };

  const getGenerateDDx = async (field) => {
    const DDX_planDetails = servicesList?.find(e => e.service_name === S_DDX)
    if (DDX_planDetails?.plan_tier === FREE && DDX_planDetails?.credit_balance <= 0) {
      showHideSubModal({ service_name: S_DDX })
    } else {
      let sendData = {
        b2c_id: profile?.b2c,
        service_name: S_DDX
      }
      const action = await dispatch(checkCredits(sendData));
      if (action.meta.requestStatus === "fulfilled") {
        if (action?.payload?.hasOwnProperty("service_name")) {
          if (action?.payload?.plan_tier === FREE && action?.payload?.credit_balance <= 0) {
            if (action?.payload?.credit_balance != DDX_planDetails?.credit_balance) {
              await dispatch(services(sendData?.b2c_id))
            }
            showHideSubModal({ service_name: S_DDX })
          } else {
            setIsDDxLoading(true);
            setIsDDxGenerated(true);
            window.Moengage.track_event("TP_CDSS_Ack_GenDx", {
              clinic_name: getClinicName(profile?.hospital_data),
              doctor_id: profile?.doctor_unique_id,
              patient_number: patient_data?.pm_contact_no,
              patient_id: patient_data?.patient_unique_id,
              field: field,
            });
            const payload = {
              patientId: patient_data?.patient_unique_id,
              symptoms: symptomsData?.map((symptom) => {
                if (symptom) {
                  return {
                    name: symptom.symptom_name,
                    since: symptom.since,
                    severity: symptom.severity,
                    notes: symptom.note,
                  };
                }
              }),
              examinations: examinationData?.map((examination) => {
                if (examination) {
                  return {
                    name: examination.examination_name,
                    notes: examination.note,
                  };
                }
              }),
            };
            const generatedDDxResponse = await getDDxDetails(payload);
            if (generatedDDxResponse?.results) {
              setGeneratedDDx(generatedDDxResponse);
              setLikeDislike(generatedDDxResponse?.results?.map(() => ""));
              setUseDDX(true);
            }
            dispatch(setIsDDxReadyToGenerate(false));
            setIsDDxLoading(false);
          }
        } else {
          typeof action?.payload?.data?.error === 'object' ?
            errorMessage(action?.payload?.data?.error?.description)
            :
            errorMessage(action?.payload?.data?.message)
        }
      } else {
        errorMessage(action.payload.message)
      }
    }
    const clinic_name = getClinicName(profile?.hospital_data);
    const tokenData = getTokenData(); 
    const deviceSdkData = getDeviceSdkData();
    window.Moengage.track_event("TP_Monetization_GenerateDDX", {
      doctor_name: profile?.um_name,
      doctor_number: profile?.um_contact,
      doctor_unique_id: profile?.doctor_unique_id,
      doctor_specialty: profile?.dp_name,
      um_id: tokenData?.user_id,
      clinic_id: tokenData?.clinic_id,
      clinic_Name: clinic_name,
      payment_Status: planDetails?.currentPlanStatus,
      token_count: DDX_planDetails?.credit_balance,
      ...deviceSdkData
    });
  }

  const handleGenRxKnowMore = () => {
    setGenRxKnowMoreDrawer((prev) => !prev);
  };

  const handleTatvaAiKnowMore = () => {
    setTatvaAiKnowMoreDrawer((prev) => !prev);
  };

  const ShimmerLoader = () => {
    return (
      <div className="sc-shimmer-container">
        <div className="shimmer-box">
          <div className="shimmer-header">
            <div className="shimmer-title"></div>
            <div className="shimmer-edit"></div>
          </div>
          <div className="shimmer-line"></div>
          <div className="shimmer-line"></div>
          <div className="shimmer-line"></div>
        </div>
      </div>
    );
  };

  const handleZydusTestReportDrawer = () => {
    setZydusTestReportDrawer(!zydusTestReportDrawer);
  };

  const CUSTOMIZED_PAD_LEFT_LIST = () => {
    const modules = customizedPadLeftList?.map((e, i) => {
      return e.tmdpm_id === 1 && e.tmdpm_status === 0 ? (
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
                className={`${vitalsData.length > 0 ? "icon-Edit" : "icon-Add"
                  } me-1 fs-5`}
              ></i>{" "}
              <span>{`${vitalsData.length > 0 ? "Edit" : "Add"
                }`}</span>
            </button>
          </div>
          {(vitalsData.length > 0 || vitalsPastList.length > 0 || patientBirthWeight) && (
            <VitalsList
              mode={caseManagerData !== undefined ? EDIT : ADD}
            />
          )}
        </div>
      ) : e.tmdpm_id === 3 && e.tmdpm_status === 0 ? (
        <div style={showShimmer ? { background: `url(${genRxBg})`, padding: "2px", borderRadius: "20px", marginBottom: "15px" } : {}}>
          <div key={i} className="prescription-box-sm p-14" style={showShimmer ? {} : {marginBottom: "15px"}}>
            <div style={{ background: "white", borderRadius: "17px" }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={MedicalHistory}
                    alt="Medical History"
                    className="me-3"
                  />
                  <div className="title-common">{isGynaecHistoryAccessable ? `Gynec History` : `Medical History`}</div>
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
                    className={`${medicalHistoryData.length > 0 || (updatedGynecHistory && Object.keys(updatedGynecHistory).length > 0)
                      ? "icon-Edit"
                      : "icon-Add"
                      } me-1 fs-5`}
                  ></i>{" "}
                  <span>{`${medicalHistoryData.length > 0 || (updatedGynecHistory && Object.keys(updatedGynecHistory).length > 0) ? "Edit" : "Add"
                    }`}</span>
                </button>
              </div>
              {showShimmer ? <ShimmerLoader /> : (medicalHistoryData.length > 0 || (updatedGynecHistory && Object.keys(updatedGynecHistory).length > 0)) && <MedicalHistoryList gynecHistory={updatedGynecHistory} />}
            </div>
          </div>
        </div>
      ) :
        e.tmdpm_id === 7 &&
          e.tmdpm_status === 0 &&
          isVaccinationAccessable ? (
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
                onClick={handleDrawerVaccination}
              >
                {" "}
                <i className={`icon-Add me-1 fs-5`}></i>{" "}
                <span>Add</span>
              </button>
            </div>
          </div>
        )
          :
          e.tmdpm_id === 16 &&
            e.tmdpm_status === 0 &&
            isGrowthChartAccessable ? (
            <div className="prescription-box-sm p-14">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img src={growthChartImg} alt="growth" className="me-3" />
                  <div className="title-common">Growth Chart</div>
                </div>
                <button
                  className="btn d-flex align-items-center btn-text"
                  onClick={handleDrawerGrowth}
                >
                  <i className={`icon-Add me-1 fs-5`}></i> <span>Add</span>
                </button></div></div>
          )
            : e.tmdpm_id === 8 && e.tmdpm_status === 0 ? (
              <div key={i} className="prescription-box-sm p-14">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img src={privateNotes} alt="Private Notes" className="me-3" />
                    <div className="title-common">
                      Private Notes
                    </div>
                  </div>
                  {!privateNotesData && (
                    <button
                      className="btn d-flex align-items-center btn-text"
                      onClick={handleDrawerPrivateNotes}
                    >
                      <i
                        className="icon-Add me-1 fs-5"></i>
                      <span>Add</span>
                    </button>
                  )}
                </div>
                {privateNotesList.length > 0 && (
                  <PrivateNotesList handleDrawerPrivateNotes={handleDrawerPrivateNotes} />
                )}
              </div>
            ) : e.tmdpm_id === 17 &&
              e.tmdpm_status === 0 &&
              isGynaecHistoryAccessable ? (
              <div className="prescription-box-sm p-14">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img
                      src={obstetricImg}
                      alt="obstetric"
                      className="me-3"
                    />
                    <div className="title-common">Obstetric History</div>
                  </div>
                  <button
                    className="btn d-flex align-items-center btn-text"
                    onClick={handleDrawerObstetric}
                  >
                    <i
                      className={`${examinationHistory?.length > 0
                        ? "icon-Edit"
                        : "icon-Add"
                        } me-1 fs-5`}
                    ></i>
                    <span>{`${examinationHistory?.length > 0 ? "Edit" : "Add"
                      }`}</span>
                  </button>
                </div>
                {(obstetricDetails?.lmp ||
                  obstetricDetails?.edd ||
                  obstetricDetails?.ceed ||
                  obstetricDetails?.gravidity ||
                  obstetricDetails?.parity ||
                  obstetricDetails?.livingChildren ||
                  obstetricDetails?.abortion ||
                  obstetricDetails?.ectopicPregnancies ||
                  examinationHistory?.length > 0 ||
                  shouldShowAncHistory ||
                  shouldShowImmunisation
                ) && <ObstetricList obstetricDrawer={obstetricDrawer} handleDrawerObstetric={handleDrawerObstetric} />}
              </div>
            ) : e.tmdpm_id === 18 &&
              e.tmdpm_status === 0 ? (
              <>
                <div className="prescription-box-sm p-14">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <img
                        src={uploadDocImg}
                        alt="upload-document"
                        className="me-3"
                      />
                      <div className="title-common">Medical Records {allUploadedDocs?.length > 0 ? `(${allUploadedDocs?.length})` : ""}</div>
                    </div>
                    <button
                      className="btn d-flex align-items-center btn-text"
                      style={{ paddingRight: allUploadedDocs.length > 0 ? 0 : 12 }}
                      onClick={
                        allUploadedDocs.length > 0
                          ? handleDrawerMedicalReport
                          : handleAddClick
                      }
                    >
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/png, image/jpeg, image/jpg, image/gif, application/pdf"
                        style={{ display: "none" }}
                      />
                      {allUploadedDocs.length === 0 && (
                        <i className="icon-Add me-1 fs-5" />
                      )}
                      <span>{`${allUploadedDocs.length > 0 ? "View All" : "Add"
                        }`}</span>
                      {allUploadedDocs.length > 0 && (
                        <i className="icon-right iconrotate180 ms-auto me-1 fs-5" />
                      )}
                    </button>
                  </div>
                  <UploadDocumentList
                    handleDrawerUploadDoc={handleDrawerUploadDoc}
                    setFilesData={setFilesData}
                    setIsEditDocument={setIsEditDocument}
                    setUploadDocDrawer={setUploadDocDrawer}
                  />
                </div>
              </>
            ) : e.tmdpm_id === 19 &&
            e.tmdpm_status === 0 ? (
              <>
                <div className="prescription-box-sm" style={{ overflow: 'hidden' }}>
                  <div className="d-flex align-items-center justify-content-between p-14" style={{ borderBottom: "1px solid #ddd" }}>
                    <div className="d-flex align-items-center">
                      <img
                        src={labResultImg}
                        alt="upload-document"
                        className="me-3"
                      />
                      <div className="title-common">Lab Results</div>
                    </div>
                    <button
                      className="btn d-flex align-items-center btn-text"
                      style={{ paddingRight: labParamsData?.length > 0 ? 0 : 12 }}
                      onClick={labParamsData?.length > 0 ? handleViewLabParamsDrawer : handleAddLabParamsDrawer}
                    >
                      {labParamsData?.length === 0 && (
                        <i className="icon-Add me-1 fs-5" />
                      )}
                      <span>{`${labParamsData?.length > 0 ? "View All" : "Add"
                        }`}</span>
                      {labParamsData?.length > 0 && (
                        <i className="icon-right iconrotate180 ms-auto me-1 fs-5" />
                      )}
                    </button>
                  </div>
                  <LabParametersList labParamsData={labParamsData} patient_unique_id={patient_data?.patient_unique_id} doc_id={userId} />
                </div>
              </>
            ) : null;
    });

    // Add Zydus Test Reports module if user has Zydus business ID
    if (tokenData?.hospital_business_id == env.zydus_business_id) {
      modules.push(
        <div key="zydus-test-reports" className="prescription-box-sm" style={{ overflow: 'hidden' }}>
          <div className="d-flex align-items-center justify-content-between p-14" style={{ borderBottom: "1px solid #ddd" }}>
            <div className="d-flex align-items-center">
              <img
                src={labResultImg}
                alt="zydus-test-report"
                className="me-3"
              />
              <div className="title-common">Zydus Lab Reports</div>
            </div>
            <button
              className="btn d-flex align-items-center btn-text"
              onClick={handleZydusTestReportDrawer}
            >
              <i className="icon-Add me-1 fs-5"></i>
              <span>View All</span>
            </button>
          </div>
          <ZydusLabParametersList labParamsData={zydusSelectedLabParams} patient_unique_id={patient_data?.patient_unique_id} doc_id={userId} />
        </div>
      );
    }

    return modules;
  }

  const handleGenRx = () => {
    setIsGenRxDrawerVisible(true);
    const clinic_name = getClinicName(profile?.hospital_data);
    trackEvent("TP_VoiceRx_Start", {
      patient_contact: patient_data?.pm_contact_no || "",
      patient_id: patient_data?.patient_unique_id || "",
      doctor_speciality: profile?.dp_name,
      doctor_unique_id: profile?.doctor_unique_id,
      clinic_name
    });
    
    if (tcmId == 0) {
      const tokenData = getTokenData();
      const deviceSdkData = getDeviceSdkData();
      window.Moengage.track_event("TP_VoiceRx", {
        doctor_name: profile?.um_name,
        doctor_number: profile?.um_contact,
        doctor_unique_id: profile?.doctor_unique_id,
        doctor_specialty: profile?.dp_name,
        clinic_id: tokenData?.clinic_id,
        um_id: tokenData?.user_id,
        clinic_Name: clinic_name,
        ...deviceSdkData,
      });
    }
  }
  // Auto-fetch Zydus lab params when labReportID is available (for ZydusLabParametersList display)
  useEffect(() => {
    const fetchZydusLabParamsForDisplay = async () => {
      if (labReportID && zydusSelectedLabParams.length === 0) {
        try {
          const response = await axios.post(
            `${env.lab_params_api_url}/api/v1/lab-reports/getByID`,
            {
              labReportID: labReportID,
              source: "zydus-ict",
              patient_unique_id: patient_data?.patient_unique_id
            },
            {
              headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN))}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.data && response.data.data) {
            setZydusSelectedLabParams(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching Zydus lab params for display:", error);
        }
      }
    };

    fetchZydusLabParamsForDisplay();
  }, [labReportID, patient_data?.patient_unique_id]);

  return (
    <CashManagerContext.Provider value={contextApi}>
      <>
        <HeaderPrescription isVaccinationEnabled={isVaccinationAccessable} isGrowthChartEnabled={isGrowthChartAccessable} gynecHistory={updatedGynecHistory} labParamsData={labParamsData} zydusSelectedLabParams={zydusSelectedLabParams} handleGenRx={handleGenRx} labReportID={labReportID} />
        <div className="w-100 bg-body wrapper2 prescription-wrapper">
          <img src={hey} alt="vitals" className="me-3 hey" />
          <div className="row">
            <div className="col-lg-4 col-md-12 col-12">
              {((isApexAIAccessable || isVoiceRxAccessable) || tp_monetization_enable) ? (
                <Tabs
                  className="obstetricTab"
                  activeKey={activeTab}
                  onChange={(key) => {
                    setActiveTab(key);
                    if (key === "apexAI") {
                      window.Moengage.track_event("TP_Apex_AI_Ack", {
                        clinic_name: getClinicName(profile?.hospital_data),
                        doctor_id: profile?.doctor_unique_id,
                        patient_number: patient_data?.pm_contact_no,
                        patient_id: patient_data?.patient_unique_id,
                      });
                    }
                  }}
                  centered
                >
                  <TabPane tab="Basic Info" key="basicInfo">
                    {CUSTOMIZED_PAD_LEFT_LIST()}
                  </TabPane>
                  <TabPane
                    tab={
                      <div style={{ position: "relative" }}>
                        <img
                          src={apexAIImg}
                          alt="apex-AI"
                          width={20}
                          height={20}
                          style={{ marginRight: 8 }}
                        />
                        TatvaAI
                        {isDDxReadyToGenerate && generatedDDx?.results?.length > 0 && (
                          <img
                            src={blinkingDot}
                            alt="blinking-dot"
                            width={20}
                            height={20}
                            style={{ position: "absolute", top: -12, right: -15 }}
                          />
                        )}
                      </div>
                    }
                    key="apexAI"
                  >
                    {(isVoiceRxAccessable || tp_monetization_enable) && <div className="prescription-box-sm">
                      <GenRxBox setIsGenRxDrawerVisible={setIsGenRxDrawerVisible} handleGenRxKnowMore={handleGenRxKnowMore} />
                    </div>}
                    {(isApexAIAccessable || tp_monetization_enable) && <div className="prescription-box-sm">
                      <DDxList
                        generatedDDx={generatedDDx?.results}
                        handleDDxDrawer={handleDDxDrawer}
                        isDDxLoading={isDDxLoading}
                        handleDDxKnowMore={handleDDxKnowMore}
                        getGenerateDDx={getGenerateDDx}
                        handleDrawerVital={handleDrawerVital}
                        isDDxGenerated={isDDxGenerated}
                      />
                    </div>}
                  </TabPane>
                </Tabs>
              ) : (
                CUSTOMIZED_PAD_LEFT_LIST()
              )}
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
                {/* {(shouldShowGenRxPopup || shouldShowApexPopup || shouldShowTatvaAiPopup) && 
                  <Carousel
                  responsive={responsive}
                  infinite={true}
                  autoPlay={true}
                  showDots={true}
                  autoPlaySpeed={2000}
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  arrows={false}
                  // dotListClass=""
                  >
                  {shouldShowGenRxPopup && (
                    <GenRxBanner key="genrx-banner" setShowGenRxPopup={setShowGenRxPopup} handleGenRxKnowMore={handleGenRxKnowMore} />
                  )}
                  {shouldShowTatvaAiPopup && (
                    <TatvaAiBanner key="tatva-ai-banner" setShowTatvaAiPopup={setShowTatvaAiPopup} handleTatvaAiKnowMore={handleTatvaAiKnowMore} />
                  )}
                  {shouldShowApexPopup && (
                    <ApexAIPopup
                    key="apex-popup"
                      setShowApexPopup={setShowApexPopup}
                      handleDDxKnowMore={handleDDxKnowMore}
                    />
                  )}
                  </Carousel>
                } */}
                {showSCBanner && <SCBanner handleBanner={() => setShowSCBanner(false)} />}
                {customizedPadRightList?.map((e, i) => {
                  const customModule = customModules?.find(
                    (m) => m.module_id === e.tmdpm_id
                  )
                  return e.tmdpm_id === 5 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm" style={showShimmer ? { background: `url(${genRxBg})`, padding: "2px" } : {}}>
                      <div style={showShimmer ? {background: "white", borderRadius: "17px"} : {}}>
                        <SymptomsBox handleDDxDrawer={handleDDxDrawer} generatedDDx={generatedDDx?.results} />
                      </div>
                    </div>
                  ) : e.tmdpm_id === 10 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <ExaminationBox />
                    </div>
                  ) : e.tmdpm_id === 21 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <SurgicalBox />
                    </div>
                  ) : e.tmdpm_id === 11 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <DiagnosisBox handleDDxDrawer={handleDDxDrawer} generatedDDx={generatedDDx?.results} getGenerateDDx={getGenerateDDx} isDDxLoading={isDDxLoading} handleDDxKnowMore={handleDDxKnowMore} isDDxGenerated={isDDxGenerated} />
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
                      <InvestigationBox handleDDxDrawer={handleDDxDrawer} generatedDDx={generatedDDx?.results} />
                    </div>
                  ) :
                    e.tmdpm_id === 15 &&
                      e.tmdpm_status === 0 ? (
                      <div key={i} className="prescription-box-sm">
                        <TabFollowUpBox />
                      </div>
                    ) : e.is_custom_module && e.tmdpm_status === 0 && customModule && (
                      <CustomModule module={customModule} />
                    )
                })}
                <AddCustomModule />
              </Content>
            </div>
          </div>
        </div>
        {vitalDrawer && (
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
              isGrowthChart={isGrowthChart}
            />
          </Drawer>
        )}
        <Drawer
          className="scroll-y-hidden"
          closeIcon={false}
          placement="right"
          onClose={handleDrawerMedicalHistory}
          open={medicalHistoryDrawer}
          width="75%"
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
            <GrowthChart handleDrawerVaccination={handleDrawerGrowth} />
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
            zIndex={100}
          >
            <Obstetric
              obstetricDetails={obstetricDetails}
              obstetricDrawer={obstetricDrawer}
              handleDrawerObstetric={handleDrawerObstetric}
              handleDrawerMedicalReport={handleDrawerMedicalReport}
            />
          </Drawer>
        )}
        {uploadDocDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            bodyStyle={{ backgroundColor: "white" }}
            onClose={handleDeletePopup}
            open={uploadDocDrawer}
            className="modalWidth-700"
            width="auto"
            push={false}
          >
            <UploadDocument
              onClose={handleDeletePopup}
              handleDrawerUploadDoc={handleDrawerUploadDoc}
              shouldShowDeletePopup={shouldShowDeletePopup}
              setShowDeletePopup={setShowDeletePopup}
              filesData={filesData}
              setFilesData={setFilesData}
              isEditDocument={isEditDocument}
              setIsEditDocument={setIsEditDocument}
            />
          </Drawer>
        )}
        {medicalReportDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            bodyStyle={{ backgroundColor: "white" }}
            onClose={handleDrawerMedicalReport}
            open={medicalReportDrawer}
            width="50%"
            push={false}
          >
            <MedicalRecords
              medicalReportDrawer={medicalReportDrawer}
              onClose={handleDrawerMedicalReport}
              handleDrawerUploadDoc={handleDrawerUploadDoc}
              setFilesData={setFilesData}
              setIsEditDocument={setIsEditDocument}
              setUploadDocDrawer={setUploadDocDrawer}
            />
          </Drawer>
        )}
        {addlabparamsDrawer &&
          <Drawer
            closeIcon={false}
            width={880}
            placement="right"
            open={addlabparamsDrawer}
            onClose={showHideBackModal}
            bodyStyle={{ backgroundColor: "white" }}
          >
            <LabParams handleAddLabParamsDrawer={handleAddLabParamsDrawer} patient_unique_id={patient_data?.patient_unique_id} onSave={handleLabParamsUpdate} isBackModalOpen={isBackModalOpen} showHideBackModal={showHideBackModal} patientGender={patient_data?.pm_gender} />
          </Drawer>
        }
        {viewlabparamsDrawer &&
          <Drawer
            closeIcon={false}
            className="modalWidth-700"
            placement="right"
            open={viewlabparamsDrawer}
            bodyStyle={{ backgroundColor: "white" }}
            onClose={handleViewLabParamsDrawer}
            width="auto"
          >
            <ViewLabParam handleViewLabParamsDrawer={handleViewLabParamsDrawer} labParamsData={labParamsData} handleSwitchToAddLabParams={handleSwitchToAddLabParams} />
          </Drawer>
        }
        {ddxKnowMoreDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            open={ddxKnowMoreDrawer}
            onClose={handleDDxKnowMore}
            className=".modalWidth-800"
            width={825}
          >
            <DDxKnowMore handleDDxKnowMore={handleDDxKnowMore} />
          </Drawer>
        )}
        {ddxDrawer && (
          <Drawer
            closeIcon={false}
            className="modalWidth-700"
            placement="right"
            open={ddxDrawer}
            onClose={handleDDxDrawer}
            width="auto"
            zIndex={999}
          >
            <DifferentialDiagnosisDrawer handleDDxDrawer={handleDDxDrawer} generatedDDx={generatedDDx?.results} includeExcludeInput={generatedDDx?.input} likeDislike={likeDislike} setLikeDislike={setLikeDislike} />
          </Drawer>
        )}
        {genRxKnowMoreDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            open={genRxKnowMoreDrawer}
            onClose={handleGenRxKnowMore}
            className=".modalWidth-800"
            width={825}
          >
            <GenRxKnowMore handleGenRxKnowMore={handleGenRxKnowMore} />
          </Drawer>
        )}
        {isGenRxDrawerVisible && (
          <ConsultationDrawer
            visible={isGenRxDrawerVisible}
            onClose={() => setIsGenRxDrawerVisible(false)}
            handleGenRxKnowMore={handleGenRxKnowMore}
            labReportID={labReportID}
          />
        )}
        {tatvaAiKnowMoreDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            open={tatvaAiKnowMoreDrawer}
            onClose={handleTatvaAiKnowMore}
            className=".modalWidth-800"
            width={825}
          >
            <TatvaAiKnowMore handleTatvaAiKnowMore={handleTatvaAiKnowMore} handleDDxKnowMore={handleDDxKnowMore} handleGenRxKnowMore={handleGenRxKnowMore} />
          </Drawer>
        )}

        <ExpiredSubModal
          title={subModalData && subModalData?.hasOwnProperty('service_name') && subModalData?.service_name}
          isSubModalOpen={isSubModalOpen}
          showHideSubModal={showHideSubModal} />

        {showSCPopup && !caseManagerData?.smart_prescription_filename && <SCPopup handlePopup={() => dispatch(setShowSCPopup(false))} handleGenRx={handleGenRx} />}
        {zydusTestReportDrawer && (
          <Drawer
            closeIcon={false}
            width={880}
            placement="right"
            open={zydusTestReportDrawer}
            onClose={handleZydusTestReportDrawer}
            bodyStyle={{ backgroundColor: "white" }}
          >
            <ZydusLabParams
              handleZydusTestReportDrawer={handleZydusTestReportDrawer}
              mrno={patient_data?.mrno}
              patientId={patient_data?.patient_unique_id}
              mrcNo={patient_data?.mrno}
              labReportID={labReportID}
              setLabReportID={setLabReportID}
              zydusSelectedLabParams={zydusSelectedLabParams}
              setZydusSelectedLabParams={setZydusSelectedLabParams}
              onSave={(newLabReportID) => {
                if (newLabReportID) {
                  setLabReportID(newLabReportID);
                }
              }}
              isBackModalOpen={isBackModalOpen}
              showHideBackModal={showHideBackModal}
              patientGender={patient_data?.pm_gender}
            />
          </Drawer>
        )}
      </>
    </CashManagerContext.Provider>
  );
}

export default Prescription;
