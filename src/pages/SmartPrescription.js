import React, { useState, useEffect, useCallback, useRef } from "react";
import "../pages/smartSync/smartSync.css";
import { Button, Drawer, message, Tooltip } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import {
  ADD,
  EDIT,
  GB_SMARTSYNC_CVT,
  SMART_RX_UPLOAD,
  WEBSOCKET_ERROR_MESSAGE,
  PAEDIATRICS,
  GB_ZYDUS_USER,
} from "../utils/constants";

import ReconnectingWebSocket from "reconnectingwebsocket";
import CashManagerContext from "../context/CashManagerContext";
import HeaderSmartPrescription from "../common/HeaderSmartPrescription";

import VitalsBox from "../components/VitalsBox";
import VitalsList from "../components/VitalsList";

import MedicalHistoryBox from "../components/MedicalHistoryBox";
import MedicalHistoryList from "../components/MedicalHistoryList";

import PrivateNotesBox from "../components/PrivateNotesBox";
import PrivateNotesList from "../components/PrivateNotesList";

import vitals from "../assets/images/Vitals.svg";
import MedicalHistory from "../assets/images/Medical-History.svg";
import privateNotes from "../assets/images/private-notes.svg";
import SmartRxFollowUpBox from "../components/SmartRxFollowUpBox";

import {
  PERSISTANT_STORAGE_KEY_AUTH_TOKEN,
  WEBSOCKET_ADDRESS,
} from "../utils/constants";

import { getPatientBirthWeight, getVitals } from "../redux/vitalsSlice";
import {
  getPatientLastHistory,
  listPrivateNotes,
} from "../redux/medicalhistorySlice";

import api from "../api/services/axiosService";
import { env } from "../EnvironmentConfig";
import { errorMessage } from "../utils/utils";
import { MESSAGE_KEY } from "../utils/constants";
import CommonModal from "../common/CommonModal";
import alertIcon from "../assets/images/alertIcon.svg";
import textLogo from "../assets/images/text-logo.svg";
import sparkleGif from "../assets/images/aiSparkleLoader.gif";
import FullPageLoader from "./vaccination/components/Loader";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import CvtKnowMore from "./smartSync/components/CvtKnowMore";
import { Content } from "antd/es/layout/layout";
import vaccinationImg from "../assets/images/Vaccination.svg";
import growthChartImg from "../assets/images/growth-chart-dark.svg";
import obstetricImg from "../assets/images/obstetric-dark.svg";
import uploadDocImg from "../assets/images/upload-doc-dark.svg";
import symptomsImg from "../assets/images/Symptoms.svg";
import labResultImg from "../assets/images/Lab.svg";
import others from "../assets/images/custom-module.svg";
import Vaccination from "./vaccination/Vaccination";
import GrowthChart from "./growthChart/GrowthChart";
import { viewPatient } from "../redux/appointmentsSlice";
import { useAccess } from "./vaccination/useAccess";
import { getGynecDetails } from "../api/services/ApiGynec";
import Obstetric from "./obstetric/Obstetric";
import ObstetricList from "./obstetric/components/obstetricList/ObstetricList";
import { fetchObstetricDetails } from "./obstetric/service";
import {
  addObstetricDetails,
  navigateToObstetric,
} from "../redux/obstetricSlice";
import { getClinicName } from "../utils/utils";
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
} from "../redux/uploadDocSlice";
import UploadDocumentList from "./medicalRecords/components/uploadDocumentList/UploadDocumentList";
import {
  generateUniqueFileName,
  getCorrectedFileName,
  mergeDocuments,
} from "./medicalRecords/utils/helper";
import LabParametersList from "../components/LabParametersList";
import LabParams from "../components/LabParams";
import ViewLabParam from "../components/ViewLabParams";
import { setSelectAutofill, setShowSCPopup, setSymptomCollector } from "../redux/ddxSlice";
import { fetchSymptomsCollectorData, setAddToRx } from "../api/services/ApiGenRx";
import SCBanner from "../components/SCBanner";
import SCPopup from "../components/SCPopup";
import { getDecodedToken } from "../utils/localStorage";

function SmartPrescription() {
  const {
    userId,
    profile,
    customizedPadLeftList,
    customizedPadRightList,
    frequencyList,
    timingList,
  } = useSelector((state) => state.doctors);
  const { selectedVitalsList, vitalsPastList, patientBirthWeight } =
    useSelector((state) => state.vitals);
  const { privateNotesList } = useSelector((state) => state.medicalhistory);
  const { obstetricDetails: allObstetricDetails, isObstetricDetailsFetched, isNavigateToObstetric } =
    useSelector((state) => state.obstetric);
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const examinationHistory = obstetricDetails?.examinationHistory || [];
  const { allUploadedDocs, uploadDocCategories } = useSelector(
    (state) => state.uploadDoc
  );
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
  const dispatch = useDispatch();
  const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);

  const { state } = useLocation();
  const { patient_data, send_path, caseManagerData, smartRxFilesData, pam_id } = state;
  const chartType = state?.chartType;
  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;
  const pamId = pam_id ? pam_id : caseManagerData !== undefined ? caseManagerData.pam_id : 0;
  const consultationDate =
    caseManagerData !== undefined
      ? caseManagerData.consultation_date
      : moment().format("YYYY-MM-DD HH:mm:ss");
  const decodedToken = getDecodedToken();
  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [surgeriesData, setSurgeriesData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [adviceData, setAdviceData] = useState([]);
  const [investigationData, setInvestigationData] = useState([]);
  const [medicationData, setMedicationData] = useState([]);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [vitalsData, setVitalsData] = useState([]);
  const [medicalHistoryData, setMedicalHistoryData] = useState([]);
  const [addlabparamsDrawer, setAddlabparamsDrawer] = useState(false);
  const [viewlabparamsDrawer, setViewlabparamsDrawer] = useState(false);
  const [privateNotesData, setPrivateNotesData] = useState(null);
  const [additionalNote, setAdditionalNote] = useState("");
  const [isGrowthChart, setIsGrowthChart] = useState(false);
  const [labParamsData, setLabParamsData] = useState([]);
  // const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [prescription, setPrescription] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalColor, setModalColor] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [connected, setConnected] = useState(false);
  const [smartRxDetails, setSmartRxDetails] = useState(null);
  const [hasError, setHasError] = useState(false);
  const socketRef = useRef(null);
  const ctxGlobalRefs = useRef([]);
  const newPageRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const selectedPageRef = useRef(null); // Add a ref for selectedPage
  const canvasRefs = useRef([]);
  const [newPageText, setNewPageText] = useState("");
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePopupMsg, setDeletePopupMsg] = useState("");
  const [isClearPopup, setIsClearPopup] = useState(false);
  const [updatedIndex, setUpdatedIndex] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [drawFunction, setDrawFunction] = useState(null);
  const [smartRxFiles, setSmartRxFiles] = useState([]);
  const [imageRefs, setImageRefs] = useState({});
  const [loading, setLoading] = useState(false); // State to track loading
  const drawRef = useRef(null);
  const [dataPresentInCanvas, setDataPresentInCanvas] = useState([]);
  const [loader, setLoader] = useState(false);
  const [customModuleContents, setCustomModuleContents] = useState([]);
  const startTime = moment().format("YYYY-MM-DD HH:mm:ss");
  const [pillupSwitch, setPillupSwitch] = useState(true);

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
    customModuleContents,
    setCustomModuleContents,
    startTime,
    pillupSwitch, 
    setPillupSwitch
  };

  const baseUrl = { customBaseUrl: env.casemanager_api_url };

  const isSmartSyncCVTAccessableFromGB = useFeatureIsOn(GB_SMARTSYNC_CVT);
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
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [isEditDocument, setIsEditDocument] = useState(false);
  const fileInputRef = useRef(null);
  const [cvtDrawer, setCvtDrawer] = useState(false);
  const [showSCBanner, setShowSCBanner] = useState(false);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);

  const { showSCPopup, isAutofillSelected, selectedSymptomsCollector, symptomCollector } =
    useSelector((state) => state.ddx);

  const {
    isVaccinationAccessable,
    isGrowthChartAccessable,
    isGynaecHistoryAccessable,
  } = useAccess(patient_data?.ageYears);

  const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  const baseUrlLabParams = env.lab_params_api_url;

  const getAllObstetricDetails = async () => {
    const obstetricResponse = await fetchObstetricDetails(patient_data.patient_unique_id);
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
  };

  const getAllDocumentCategories = async () => {
    const response = await fetchAllDocumentCategories();
    dispatch(setUploadDocCategories(response));
  };

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
  }, []);

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
  }, []);

  useEffect(() => {
    getSymptomsCollectorData();
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
      dispatch(
        setSymptomCollector({
          ...response?.summary_json_doctor,
          _id: response?._id,
        })
      );
      setShowSCBanner(true);
      if (patient_data?.pam_status === "0") {
        dispatch(setShowSCPopup(true));
      }
    }
  };

  // Drawer Vitals
  const handleDrawerVital = useCallback(() => {
    setVitalDrawer(!vitalDrawer);
  }, [vitalDrawer]);

  // Drawer Medical History
  const handleDrawerMedicalHistory = useCallback(() => {
    setMedicalHistoryDrawer(!medicalHistoryDrawer);
  }, [medicalHistoryDrawer]);

  // Drawer Private Notes
  const handleDrawerPrivateNotes = useCallback(
    (data) => {
      setSelectPrivateNotes(data);
      setPrivateNotesDrawer(!privateNotesDrawer);
    },
    [privateNotesDrawer, selectPrivateNotes]
  );

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
  const handleDrawerObstetric = () => {
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
      } else if (flag === 5) {
        handleDrawerCvtKnowMore();
      }
    },
    [
      vitalDrawer,
      medicalHistoryDrawer,
      vaccinationDrawer,
      privateNotesDrawer,
      cvtDrawer,
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
          mode: caseManagerData !== undefined && tcmId !== 0 ? EDIT : ADD,
          pm_pid: patient_data !== undefined ? patient_data.pm_pid : 0,
          pm_id: patient_data !== undefined ? patient_data.pm_id : 0,
        })
      );

      if (
        profile?.dp_name === PAEDIATRICS &&
        patient_data?.ageMonths <= 12 &&
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
          
          pm_pid: patient_data !== undefined ? patient_data.pm_pid : 0, //extra
          pm_id: patient_data !== undefined ? patient_data.pm_id : 0, //extra
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
      if (
        caseManagerData.private_notes &&
        customizedPadLeftList.findIndex(
          (e) => e.tmdpm_id === 8 && e.tmdpm_status === 0
        ) !== -1 &&
        privateNotesList.findIndex(
          (e) => e.id === caseManagerData.private_notes.id
        ) !== -1 &&
        tcmId
      ) {
        setPrivateNotesData(caseManagerData.private_notes);
      }
    }
  }, [privateNotesList]);

  const handleSaveGynecHistory = (updatedGynecHistory) => {
    setUpdatedGynecHistory(updatedGynecHistory);
  };

  useEffect(() => {
    if (isGynaecHistoryAccessable) {
      fetchGynecHistory();
    }
  }, [isGynaecHistoryAccessable]);

  useEffect(() => {
    getLabParams();
  }, []);

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
      console.error("Error fetching gynec history:", error);
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

  const handleAddLabParamsDrawer = useCallback(() => {
    setAddlabparamsDrawer(!addlabparamsDrawer);
  }, [addlabparamsDrawer]);

  const handleViewLabParamsDrawer = useCallback(() => {
    setViewlabparamsDrawer(!viewlabparamsDrawer);
  }, [viewlabparamsDrawer]);

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
      const cleanedToken = token.replace(/['"]+/g, "");
      const response = await axios.get(
        `${baseUrlLabParams}/api/v1/lab-parameters/results/${patient_data?.patient_unique_id}`,
        {
          headers: {
            Authorization: `Bearer ${cleanedToken}`,
          },
        }
      );
      setLabParamsData(response.data?.data?.results || []);
    } catch (error) {
      console.error("Error fetching lab params:", error);
    }
  };

  const CUSTOMIZED_PAD_LEFT_LIST = () => {
    return customizedPadLeftList?.map((e, i) => {
      return e.tmdpm_id === 1 && e.tmdpm_status === 0 ? (
        <div key={i} className="prescription-box-sm p-14">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src={vitals} alt="vitals" className="me-3" />
              <div className="title-common">Vitals & Body Composition</div>
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
              <span>{`${vitalsData.length > 0 ? "Edit" : "Add"}`}</span>
            </button>
          </div>
          {(vitalsData.length > 0 ||
            vitalsPastList.length > 0 ||
            patientBirthWeight) && (
            <VitalsList mode={caseManagerData !== undefined ? EDIT : ADD} />
          )}
        </div>
      ) : e.tmdpm_id === 3 && e.tmdpm_status === 0 ? (
        <div key={i} className="prescription-box-sm p-14">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img
                src={MedicalHistory}
                alt="Medical History"
                className="me-3"
              />
              <div className="title-common">
                {isGynaecHistoryAccessable
                  ? `Gynec History`
                  : `Medical History`}
              </div>
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
                  medicalHistoryData.length > 0 ||
                  (updatedGynecHistory &&
                    Object.keys(updatedGynecHistory).length > 0)
                    ? "icon-Edit"
                    : "icon-Add"
                } me-1 fs-5`}
              ></i>{" "}
              <span>{`${
                medicalHistoryData.length > 0 ||
                (updatedGynecHistory &&
                  Object.keys(updatedGynecHistory).length > 0)
                  ? "Edit"
                  : "Add"
              }`}</span>
            </button>
          </div>
          {(medicalHistoryData.length > 0 ||
            (updatedGynecHistory &&
              Object.keys(updatedGynecHistory).length > 0)) && (
            <MedicalHistoryList gynecHistory={updatedGynecHistory} />
          )}
        </div>
      ) : e.tmdpm_id === 7 &&
        e.tmdpm_status === 0 &&
        isVaccinationAccessable ? (
        <div className="prescription-box-sm p-14">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src={vaccinationImg} alt="vitals" className="me-3" />
              <div className="title-common">Vaccination</div>
            </div>
            <button
              className="btn d-flex align-items-center btn-text"
              onClick={handleDrawerVaccination}
            >
              {" "}
              <i className={`icon-Add me-1 fs-5`}></i> <span>Add</span>
            </button>
          </div>
        </div>
      ) : e.tmdpm_id === 16 &&
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
            </button>
          </div>
        </div>
      ) : e.tmdpm_id === 8 && e.tmdpm_status === 0 ? (
        <div key={i} className="prescription-box-sm p-14">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src={privateNotes} alt="Private Notes" className="me-3" />
              <div className="title-common">Private Notes</div>
            </div>
            {!privateNotesData && (
              <button
                className="btn d-flex align-items-center btn-text"
                onClick={handleDrawerPrivateNotes}
              >
                <i className="icon-Add me-1 fs-5"></i>
                <span>Add</span>
              </button>
            )}
          </div>
          {privateNotesList.length > 0 && (
            <PrivateNotesList
              handleDrawerPrivateNotes={handleDrawerPrivateNotes}
            />
          )}
        </div>
      ) : e.tmdpm_id === 17 &&
        e.tmdpm_status === 0 &&
        isGynaecHistoryAccessable ? (
        <div className="prescription-box-sm p-14">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src={obstetricImg} alt="obstetric" className="me-3" />
              <div className="title-common">Obstetric History</div>
            </div>
            <button
              className="btn d-flex align-items-center btn-text"
              onClick={handleDrawerObstetric}
            >
              <i
                className={`${
                  examinationHistory?.length > 0 ? "icon-Edit" : "icon-Add"
                } me-1 fs-5`}
              ></i>
              <span>{`${examinationHistory?.length > 0 ? "Edit" : "Add"}`}</span>
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
            shouldShowImmunisation) && <ObstetricList obstetricDrawer={obstetricDrawer} handleDrawerObstetric={handleDrawerObstetric} />}
        </div>
      ) : e.tmdpm_id === 18 && e.tmdpm_status === 0 ? (
        <>
          <div className="prescription-box-sm p-14">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <img
                  src={uploadDocImg}
                  alt="upload-document"
                  className="me-3"
                />
                <div className="title-common">
                  Medical Records{" "}
                  {allUploadedDocs?.length > 0
                    ? `(${allUploadedDocs?.length})`
                    : ""}
                </div>
              </div>
              <button
                className="btn d-flex align-items-center btn-text"
                style={{
                  paddingRight: allUploadedDocs.length > 0 ? 0 : 12,
                }}
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
                <span>{`${
                  allUploadedDocs.length > 0 ? "View All" : "Add"
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
      ) : (
        e.tmdpm_id === 19 &&
        e.tmdpm_status === 0 && (
          <>
            <div className="prescription-box-sm" style={{ overflow: "hidden" }}>
              <div
                className="d-flex align-items-center justify-content-between p-14"
                style={{ borderBottom: "1px solid #ddd" }}
              >
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
                  style={{
                    paddingRight: labParamsData?.length > 0 ? 0 : 12,
                  }}
                  onClick={
                    labParamsData?.length > 0
                      ? handleViewLabParamsDrawer
                      : handleAddLabParamsDrawer
                  }
                >
                  {labParamsData?.length === 0 && (
                    <i className="icon-Add me-1 fs-5" />
                  )}
                  <span>{`${
                    labParamsData?.length > 0 ? "View All" : "Add"
                  }`}</span>
                  {labParamsData?.length > 0 && (
                    <i className="icon-right iconrotate180 ms-auto me-1 fs-5" />
                  )}
                </button>
              </div>
              <LabParametersList
                labParamsData={labParamsData}
                patient_unique_id={patient_data?.patient_unique_id}
                doc_id={userId}
              />
            </div>
          </>
        )
      );
    });
  };

  // Drawer CVT Know more page
  const handleDrawerCvtKnowMore = useCallback(() => {
    setCvtDrawer(!cvtDrawer);
  }, [cvtDrawer]);

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
    // const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    // setToken(token);
    if (token !== undefined) {
      try {
        var decoded = jwtDecode(token);
        setTokenData(decoded.result);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (pages.length === 0 || smartRxFilesData?.length === 0) {
      handleAddPage();
    }
    if (smartRxFilesData?.length > 0) {
      setLoading(true);
      setSmartRxFiles(smartRxFilesData);
    }
  }, []);

  const toggleDeletePopup = () => {
    setShowDeletePopup((prev) => !prev);
  };

  const getCanvas = (id, index) => (
    <canvas
      key={id}
      id={id}
      width="720px"
      height="980px"
      className={`canvas-style ${
        selectedPage === index ? "canvas-active" : ""
      }`}
      ref={(el) => {
        if (el && smartRxFiles) {
          canvasRefs.current[id] = el;
          const ctx = el.getContext("2d");
          ctx.fillStyle = "white";
          ctxGlobalRefs.current[id] = ctx;
        } else {
          canvasRefs.current[id] = el;
        }
      }}
      onClick={() => handlePageChange(index)}
    />
  );

  useEffect(() => {
    selectedPageRef.current = pages[selectedPage]; // Update the ref when selectedPage changes
  }, [selectedPage, refreshTrigger]);

  const wsError = (error) => {
    message.open({
      key: MESSAGE_KEY,
      type: "error",
      className: "error-red",
      content: (
        <div className="d-flex align-items-center">
          <div>
            <div className="title-common text-start fontroboto">{error}</div>
          </div>
        </div>
      ),
      duration: 3,
    });
  };

  useEffect(() => {
    drawRef.current =
      smartRxFiles?.length >= selectedPage + 1 ? editDraw : draw;
  }, [selectedPage]);

  // Handles Websocket Connection
  const connectWebSocket = () => {
    // WebSocket initialization (reconnectingwebsocket : this package handles the reconnection)
    try {
      socketRef.current = new ReconnectingWebSocket(WEBSOCKET_ADDRESS, null, {debug: true, reconnectInterval: 3000});
      socketRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        setConnected(true);
        setHasError(false); // Clear any previous error messages
      };
      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        setConnected(false);
      };
      socketRef.current.onmessage = (event) => {
        const o = event.data.split("|");
        drawRef.current(o[0], o[1], o[2], o[3], selectedPageRef.current);
      };
      socketRef.current.onerror = (error) => {
        // Handle WebSocket errors
        if (!hasError) {
          wsError(WEBSOCKET_ERROR_MESSAGE);
          setHasError(true); // Mark that an error has been displayed
        }
        console.log("WebSocket error", error);
      };
    } catch (error) {
      // Handle errors during WebSocket initialization
      console.error("WebSocket connection failed", error);
      wsError(WEBSOCKET_ERROR_MESSAGE);
    }
  };

  const handleAddPage = () => {
    const newPageId = uuidv4();
    setPages([...pages, newPageId]);
    setDataPresentInCanvas([...dataPresentInCanvas, false]);
    if (pages.length === 0) {
      setSelectedPage(0);
    } else {
      setSelectedPage(pages.length);
      setTimeout(() => {
        newPageRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100); // Adjust timeout as needed
    }
    setNewPageText("");
  };

  const handleDeletePage = (index) => {
    if (smartRxFiles) {
      setSmartRxFiles(
        smartRxFiles.filter((_, fileIndex) => fileIndex !== index)
      );
    }
    const newPages = pages.filter((_, pageIndex) => pageIndex !== index);
    setDataPresentInCanvas(
      dataPresentInCanvas.filter((_, pageIndex) => pageIndex !== index)
    );
    setPages(newPages);
    setRefreshTrigger(!refreshTrigger);
    if (selectedPage >= newPages.length) {
      setSelectedPage(
        newPages.length ? Math.min(selectedPage, newPages.length - 1) : 0
      );
    }
  };

  const handlePageChange = (index) => {
    setSelectedPage(index);
  };

  const handleRefresh = () => {
    setSelectedPage(updatedIndex);
    setRefreshTrigger(!refreshTrigger);

    if (smartRxFiles?.length >= selectedPage + 1) {
      setDrawFunction(true);
    }

    const canvas = canvasRefs.current[pages[updatedIndex]];
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctxGlobalRefs.current[pages[updatedIndex]] = ctx;
      canvasRefs.current[pages[updatedIndex]] = ctx;
    }
  };

  const handleClearAllPages = () => {
    setPages([pages[0]]);
    setDataPresentInCanvas([false]);
    setSelectedPage(0);
    const canvas = canvasRefs.current[pages[0]];
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    }
  };

  function draw(t, n, a, c, pageIndex) {
    const canvas = canvasRefs.current[pageIndex];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    /// set white fill style
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scaleFactor = 1.5;

    // Set consistent styles
    ctx.strokeStyle = "#000"; // Example color for regular drawing

    ctx.moveTo(t * scaleFactor, n * scaleFactor);
    ctx.lineTo(a * scaleFactor, c * scaleFactor);
    ctx.lineJoin = ctx.lineCap = "round";
    ctx.stroke();
    if (!dataPresentInCanvas[selectedPage]) {
      let newDataPresentInCanvas = [...dataPresentInCanvas];
      newDataPresentInCanvas[selectedPage] = true;
      setDataPresentInCanvas(newDataPresentInCanvas);
    }
  }

  function editDraw(t, n, a, c, pageIndex) {
    const canvas = canvasRefs.current[pageIndex];
    if (!canvas) return;
    const scaleFactor = 1.5;
    ctxGlobalRefs.current[pageIndex].strokeStyle = "#000";
    ctxGlobalRefs.current[pageIndex].beginPath();
    ctxGlobalRefs.current[pageIndex].moveTo(t * scaleFactor, n * scaleFactor);
    ctxGlobalRefs.current[pageIndex].lineTo(a * scaleFactor, c * scaleFactor);
    ctxGlobalRefs.current[pageIndex].lineJoin = ctxGlobalRefs.current[
      pageIndex
    ].lineCap = "round";
    ctxGlobalRefs.current[pageIndex].stroke();
    if (!dataPresentInCanvas[selectedPage]) {
      let newDataPresentInCanvas = [...dataPresentInCanvas];
      newDataPresentInCanvas[selectedPage] = true;
      setDataPresentInCanvas(newDataPresentInCanvas);
    }
  }

  const convertCanvasToJPEG = (canvas) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas to Blob conversion failed."));
        }
      }, "image/jpeg");
    });
  };

  const handleSubmit = async () => {
    const canvasArray = Object.values(canvasRefs.current).filter(
      (canvas) => canvas !== null
    );
    let blobs = [];
    let files = [];

    try {
      // Convert all canvases to JPEG blobs and files
      for (let i = 0; i < canvasArray.length; i++) {
        const canvas = canvasArray[i];
        if (!canvas) continue;
        const blob = await convertCanvasToJPEG(canvas);
        const name =
          smartRxFiles && smartRxFiles[i]
            ? smartRxFiles[i].smart_prescription_filename
            : `${uuidv4()}.jpeg`;
        // Create the File object
        const file = new File([blob], name, { type: "image/jpeg" });

        if (file.size < 5 * 1000 && vitalsData.length === 0 && !followUpDate) {
          errorMessage("Please fill your prescription to submit");
        } else if (file.size > 5 * 1000) {
          blobs.push(blob);
          files.push(new File([blob], name, { type: "image/jpeg" }));
        }
      }
    } catch (error) {
      console.error("Error converting canvas to JPEG:", error);
      errorMessage("Failed to generate image, Please Submit again");
    }
    setLoader(true);
    // FormData to handle file upload
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("smart_prescription_files", file);
      formData.append("smart_prescription_filename[]", file.name);
    });
    formData.append("doctor_unique_id", tokenData?.doctor_unique_id);
    formData.append("patient_unique_id", patient_data?.patient_unique_id);

    try {
      if (files.length > 0) {
        const response = await api.post(SMART_RX_UPLOAD, formData, baseUrl);
        const data = response?.message;
      }
      setSmartRxDetails(files || []);
      if (isAutofillSelected) {
        await setAddToRx({
          _id: symptomCollector?._id,
          addToRx: true,
        });
        dispatch(setSelectAutofill(false));
      }
    } catch (error) {
      errorMessage("Error Uploading the prescription, Please try again");
      console.error("Error Submitting the prescription:", error);
    }
    setLoader(false);
  };

  const handleWrite = () => {
    setPrescription(true);
    connectWebSocket();
  };

  useEffect(() => {
    // Set the first page as the default selected page on initial render
    setSelectedPage(0);
    // this is to remove the click from the right container.
    handleWrite();

    if (smartRxFilesData?.length > 0) {
      imageLoad();
    }

    return () => {
      // Cleanup WebSocket connection on component unmount
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const openModal = (success, message) => {
    setShowModal(true);
    setUploadSuccess(success);
    setUploadMessage(message);
    setModalColor(success ? "green" : "red");
    // Start the progress animation
    if (success) {
      animateProgress();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset progress and success state when the modal is closed
    setProgress(0);
    setUploadSuccess(false);
  };

  const animateProgress = () => {
    // Simulate an upload process
    const duration = 2000;
    const interval = 10;
    const steps = duration / interval;

    let step = 0;

    const progressInterval = setInterval(() => {
      step++;
      const currentProgress = (step / steps) * 100;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(progressInterval);

        // Show success message after reaching 100%
        setUploadSuccess(true);

        // Close the modal after a delay (you can adjust the delay as needed)
        setTimeout(() => {
          closeModal();
        }, 1500);
      }
    }, interval);
  };

  // Load images for the edit flow
  const imageLoad = () => {
    const loadedImages = {};
    const totalImages = smartRxFilesData.length;
    let loadedCount = 0;

    const newPageIds = smartRxFilesData.map(() => uuidv4());
    setPages(newPageIds);
    setDataPresentInCanvas(Array(smartRxFilesData.length).fill(true));
    smartRxFilesData.forEach((imageObj, index) => {
      const { smart_prescription_file: imageUrl } = imageObj;
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedImages[newPageIds[index]] = img;
        setImageRefs((prevState) => ({
          ...prevState,
          [newPageIds[index]]: img,
        }));
        setImageLoaded((prevState) => ({
          ...prevState,
          [newPageIds[index]]: true,
        }));
        loadedCount++;

        // Hide loader when all images are loaded
        if (loadedCount === totalImages) {
          setLoading(false);
        }
      };
    });
  };

  useEffect(() => {
    // Draw images on canvases when images are getting loaded
    pages.forEach((pageId) => {
      if (imageLoaded[pageId] && canvasRefs.current[pageId]) {
        const ctx = canvasRefs.current[pageId].getContext("2d");
        ctx.drawImage(imageRefs[pageId], 0, 0);
        ctxGlobalRefs.current[pageId] = ctx;
      }
    });
  }, [imageLoaded]);

  return (
    <CashManagerContext.Provider value={contextApi}>
      <>
        <HeaderSmartPrescription
          isVaccinationEnabled={isVaccinationAccessable}
          isGrowthChartEnabled={isGrowthChartAccessable}
          prescription={prescription}
          onClear={handleClearAllPages}
          onSubmit={handleSubmit}
          smartRxData={smartRxDetails}
          loader={loader}
          caseManagerData={caseManagerData}
        />
        {loading && <FullPageLoader />}
        <div className="w-100 bg-body wrapper2 prescription-wrapper">
          <div className="row">
            <div
              className="col-lg-4 col-md-12 col-12"
              style={{
                marginLeft: "3rem",
                height: "100vh" /* Full height for independent scrolling */,
              }}
            >
              {isSmartSyncCVTAccessableFromGB && (
                <div className="know-more-cvt p-14">
                  <div className="sparkle">
                    <img src={sparkleGif} className="sparkel-loader" />
                    <img
                      src={textLogo}
                      alt="textLogo"
                      className="text-logo-white"
                    />
                  </div>
                  <div className="title-common">
                    <div>
                      <span className="me-2">
                        AI-Powered Smart Rx Digitisation
                      </span>
                      <span className="new-btn">New</span>
                    </div>
                    <button
                      className="know-more-btn"
                      onClick={handleDrawerCvtKnowMore}
                    >
                      View Tips
                    </button>
                  </div>
                </div>
              )}
              {/* add symptoms box if there is symptoms in SC */}
              {isAutofillSelected &&
                selectedSymptomsCollector?.symptoms?.length > 0 && (
                  <div className="prescription-box-sm p-14">
                    <div className="d-flex align-items-center">
                      <img src={symptomsImg} alt="symptoms" className="me-2" />
                      <div className="title-common">Symptoms</div>
                      <Tooltip
                        title={
                          <div>
                            The{" "}
                            <strong style={{ fontWeight: 600 }}>
                              symptoms
                            </strong>{" "}
                            shared by the patient is just for reference. To
                            include it in the{" "}
                            <strong style={{ fontWeight: 600 }}>Rx</strong>, you
                            have to
                            <strong style={{ fontWeight: 600 }}>
                              {" "}
                              write it manually using Smartsync.
                            </strong>
                          </div>
                        }
                        overlayClassName="sc-tooltip"
                        placement="topLeft"
                      >
                        <div
                          className="d-flex align-items-center justify-content-center gap-1"
                          style={{
                            backgroundColor: "rgba(181, 181, 255, 0.4)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            marginLeft: "4px",
                          }}
                        >
                          <span
                            className="text-primary"
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            For reference only
                          </span>
                          <i
                            class="icon-info"
                            style={{
                              color: "#4B4AD5",
                              fontSize: 14,
                            }}
                          />
                        </div>
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      {selectedSymptomsCollector?.symptoms
                        ?.slice(0, showAllSymptoms ? undefined : 2)
                        .map((symptomsData, index) => (
                          <div className="symptoms-box mb-2">
                            <div className="symptoms-box-left">
                              <span
                                className="backbar"
                                style={{ fontSize: "14px" }}
                              >
                                • {symptomsData.name}
                                {symptomsData.duration &&
                                  ` (${symptomsData.duration}`}
                                {symptomsData.severity &&
                                  `, ${symptomsData.severity}`}
                                {symptomsData.notes &&
                                  `, ${symptomsData.notes}`}
                                {(symptomsData.duration ||
                                  symptomsData.severity ||
                                  symptomsData.notes) &&
                                  ")"}
                                {index === 1 &&
                                  !showAllSymptoms &&
                                  selectedSymptomsCollector?.symptoms?.length >
                                    2 && (
                                    <button
                                      className="btn-link text-primary ms-1"
                                      style={{
                                        border: "none",
                                        background: "none",
                                        padding: 0,
                                        textDecoration: "underline",
                                        display: "inline",
                                      }}
                                      onClick={() =>
                                        setShowAllSymptoms(!showAllSymptoms)
                                      }
                                    >
                                      {showAllSymptoms
                                        ? "View less"
                                        : "View more"}
                                    </button>
                                  )}
                              </span>
                            </div>
                          </div>
                        ))}

                      {showAllSymptoms &&
                        selectedSymptomsCollector?.symptoms?.length > 2 && (
                          <button
                            className="btn-link text-primary"
                            style={{
                              border: "none",
                              background: "none",
                              padding: 0,
                              textDecoration: "none",
                            }}
                            onClick={() => setShowAllSymptoms(false)}
                          >
                            View less
                          </button>
                        )}
                    </div>
                  </div>
                )}
              {showSCBanner && (
                <SCBanner handleBanner={() => setShowSCBanner(false)} />
              )}
              {CUSTOMIZED_PAD_LEFT_LIST()}
              {selectedSymptomsCollector?.notes && (
                <div className="prescription-box-sm p-14">
                  <div style={{ padding: "6px" }}>
                    <div className="d-flex align-items-center mb-14">
                      <img className="me-3" src={others} alt="others" />
                      <div className="title-common">Additional Notes</div>
                      <Tooltip
                        title={
                          <div>
                            The{" "}
                            <strong style={{ fontWeight: 600 }}>
                              Additional Notes
                            </strong>{" "}
                            shared by the patient is just for reference. To
                            include it in the{" "}
                            <strong style={{ fontWeight: 600 }}>Rx</strong>, you
                            have to
                            <strong style={{ fontWeight: 600 }}>
                              {" "}
                              write it manually using Smartsync.
                            </strong>
                          </div>
                        }
                        overlayClassName="sc-tooltip"
                        placement="topLeft"
                      >
                        <div
                          className="d-flex align-items-center justify-content-center gap-1"
                          style={{
                            backgroundColor: "rgba(181, 181, 255, 0.4)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            marginLeft: "4px",
                          }}
                        >
                          <span
                            className="text-primary"
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            For reference only
                          </span>
                          <i
                            class="icon-info"
                            style={{
                              color: "#4B4AD5",
                              fontSize: 14,
                            }}
                          />
                        </div>
                      </Tooltip>
                    </div>
                    <div
                      className="d-flex calender-merge-input mt-3"
                      style={{ fontSize: 14 }}
                    >
                      {selectedSymptomsCollector?.notes}
                    </div>
                  </div>
                </div>
              )}
              <div className="prescription-box-sm p-14">
                <SmartRxFollowUpBox />
              </div>
            </div>
            <div
              className="col-lg-8 col-md-12 col-12 mt-lg-0 mt-3"
              style={{
                width: "61%",
                height: "100%",
                marginLeft: "10px",
              }}
            >
              <div>
                <div
                  id="pdf"
                  style={{ border: prescription ? "none" : "lightgrey" }}
                >
                  {pages.map((page, index) => (
                    <div
                      key={page}
                      className="canvas-container"
                      ref={index === pages.length - 1 ? newPageRef : null}
                    >
                      <div
                        className={`canvas-header ${
                          selectedPage === index ? "active-page" : ""
                        }`}
                      >
                        <div className="canvas-header-left">
                          <span>Page {index + 1}</span>
                          {selectedPage === index && (
                            <span className="selected-text">Selected</span>
                          )}
                        </div>
                        <div className="d-flex">
                          <button
                            className="btn d-flex align-items-center btn-text"
                            onClick={() => {
                              toggleDeletePopup();
                              setIsClearPopup(true);
                              setDeletePopupMsg(
                                `Are you sure you want to clear page ${
                                  index + 1
                                } data`
                              );
                              setUpdatedIndex(index);
                            }}
                          >
                            <i className="icon-reload me-2 fs-5" />
                          </button>
                          {pages.length > 1 && (
                            <button
                              className="btn d-flex align-items-center btn-text"
                              onClick={() => {
                                toggleDeletePopup();
                                setIsClearPopup(false);
                                setDeletePopupMsg(
                                  `Are you sure you want to delete page ${
                                    index + 1
                                  } data`
                                );
                                setUpdatedIndex(index);
                              }}
                            >
                              <i className="icon-delete me-2 fs-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      {getCanvas(page, index)}
                      <div
                        className={`canvas-footer ${
                          selectedPage === index ? "active-page" : ""
                        }`}
                      >
                        {index === pages.length - 1 && (
                          <button
                            className="btn d-flex align-items-center justify-content-center btn-text new-page-btn"
                            onMouseEnter={() => setNewPageText("New Page")}
                            onMouseLeave={() => setNewPageText("")}
                            onClick={handleAddPage}
                          >
                            <i className="icon-Add fs-5" />
                            {newPageText}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
          // placement="right"
          onClose={handleDrawerCvtKnowMore}
          open={cvtDrawer}
          className=".modalWidth-800"
          width={800}
        >
          <CvtKnowMore
            handleDrawerCvtKnowMore={handleDrawerCvtKnowMore}
            handleCollapsed={(flag) => handleCollapsed(flag)}
          />
        </Drawer>
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
            <Obstetric obstetricDetails={obstetricDetails} obstetricDrawer={obstetricDrawer} handleDrawerObstetric={handleDrawerObstetric} handleDrawerMedicalReport={handleDrawerMedicalReport} />
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
        {addlabparamsDrawer && (
          <Drawer
            closeIcon={false}
            width={880}
            placement="right"
            open={addlabparamsDrawer}
            onClose={showHideBackModal}
            bodyStyle={{ backgroundColor: "white" }}
          >
            <LabParams
              handleAddLabParamsDrawer={handleAddLabParamsDrawer}
              patient_unique_id={patient_data?.patient_unique_id}
              onSave={handleLabParamsUpdate}
              isBackModalOpen={isBackModalOpen}
              showHideBackModal={showHideBackModal}
              patientGender={patient_data?.pm_gender}
            />
          </Drawer>
        )}
        {viewlabparamsDrawer && (
          <Drawer
            closeIcon={false}
            className="modalWidth-700"
            placement="right"
            open={viewlabparamsDrawer}
            bodyStyle={{ backgroundColor: "white" }}
            onClose={handleViewLabParamsDrawer}
            width="auto"
          >
            <ViewLabParam
              handleViewLabParamsDrawer={handleViewLabParamsDrawer}
              labParamsData={labParamsData}
              handleSwitchToAddLabParams={handleSwitchToAddLabParams}
            />
          </Drawer>
        )}
        <CommonModal
          isModalOpen={shouldShowDeletePopup}
          onCancel={toggleDeletePopup}
          modalWidth={398}
          title={"You may lose your data"}
          modalBody={
            <>
              <div className="alert-warning rounded-10px p-2 patient-details">
                <div className="d-flex align-items-center">
                  <img className="me-3" src={alertIcon} alt="Warning" />
                  <span>{deletePopupMsg}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="d-flex align-items-center mt-2 justify-content-end">
                  <div
                    onClick={() => {
                      if (isClearPopup) {
                        handleRefresh(updatedIndex);
                      } else {
                        handleDeletePage(updatedIndex);
                      }
                      toggleDeletePopup();
                      setUpdatedIndex(null);
                    }}
                    className="me-4 text-decoration-underline btn p-0 text-main"
                  >
                    {isClearPopup ? "Clear" : "Delete"}
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
        {showSCPopup && (
          <SCPopup handlePopup={() => dispatch(setShowSCPopup(false))} />
        )}
      </>
    </CashManagerContext.Provider>
  );
}

export default SmartPrescription;
