import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Drawer, DatePicker, Input, Button, Col, Row, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import { env } from "../../EnvironmentConfig";

import { useSelector, useDispatch } from "react-redux";

import { ADD, EDIT, EXTRA_OPTIONS, FAILED_VERIFICATION, FREE, GB_ZYDUS_USER, GB_CARE_PLAN, NEO_NATOLOGISTS_DP_ID, PAEDIATRICS, PERSISTANT_STORAGE_KEY_AUTH_TOKEN, S_DDX } from "../../utils/constants";

import { getPatientBirthWeight, getVitals } from "../../redux/vitalsSlice";
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
import alertIcon from "../../assets/images/alertIcon.svg";
import growthChart from "../../assets/images/growth-chart.svg";
import growthChartDark from "../../assets/images/growth-chart-dark.svg";
import privateNotesWhite from "../../assets/images/private-notes-white.svg";
import privateNotesDark from "../../assets/images/private-notes-dark.svg";
import apexAIImg from "../../assets/images/apexAI.svg";
import blinkingDot from "../../assets/images/blinkingDot.gif";
import ddxVector from "../../assets/images/ddx-tab-vector.svg";
import ddxImg from "../../assets/images/ddx.svg";
import ddxInactiveImg from "../../assets/images/tab-ddx-inactive.svg";
import genRxImg from "../../assets/images/gen-rx-mic.svg";
import voiceRxDefault from "../../assets/images/voice-rx-default.svg";
import obstetricWhite from "../../assets/images/obstetric-white.svg";
import obstetricDark from "../../assets/images/obstetric-dark.svg";
import medicalRecordsWhite from "../../assets/images/upload-doc-white.svg";
import medicalRecordsDark from "../../assets/images/upload-doc-dark.svg";
import labParamsWhite from "../../assets/images/lab-parameters-white.svg";
import labParamsDark from "../../assets/images/Lab-Parameters.svg";
import genRxBg from "../../assets/images/gen-rx-bg.gif";
import carePlanIcon from "../../assets/images/Care plan.svg";
import carePlanIconDark from "../../assets/images/Care plan_Active_solid.svg";
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
import { fetchObstetricDetails } from "../obstetric/service";
import { addObstetricDetails } from "../../redux/obstetricSlice";
import { setAllUploadedDocs, setPatientUploadedDocs, setUploadDocCategories, zydusDocsList, zydusRadioList } from "../../redux/uploadDocSlice";
import { fetchAllDocumentCategories, fetchAllPatientDocs, fetchDocsUploadedByPatient } from "../medicalRecords/service";
import TabUploadDocumentList from "../medicalRecords/components/uploadDocumentList/TabUploadDocumentList";
import UploadDocument from "../medicalRecords/UploadDocument";
import MedicalRecords from "../medicalRecords/MedicalRecords";
import TabLabParametersList from "../../components/tab_design/TabLabParametersList";
import LabParams from "../../components/LabParams";
import ViewLabParam from "../../components/ViewLabParams";
import UploadDocPopup from "../medicalRecords/components/uploadDocPopup/UploadDocPopup";
import { isAndroid, isBrowser } from "react-device-detect";
import { generateUniqueFileName, getCorrectedFileName, mergeDocuments } from "../medicalRecords/utils/helper";
import ApexAIPopup from "../../components/ApexAIPopup";
import TabDDxList from "../../components/tab_design/TabDDxList";
import { setIsApexAISelected, setIsDDxReadyToGenerate, setShowSCPopup, setSymptomCollector } from "../../redux/ddxSlice";
import DifferentialDiagnosisDrawer from "../../components/DifferentialDiagnosisDrawer";
import CommonModal from "../../common/CommonModal";
import DDxKnowMore from "../../components/DDxKnowMore";
import { getDDxDetails } from "../../api/services/ApiDDx";
import { getDecodedToken } from "../../utils/localStorage";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { errorMessage, getClinicName, shouldMonetizationDisabled, trackEvent, getDeviceSdkData, getTokenData } from "../../utils/utils";
import TabSurgicalBox from "../../components/tab_design/TabSurgicalBox";
import TabAddCustomModule from "../../components/tab_design/TabAddCustomModule";
import TabCustomModule from "../../components/tab_design/TabCustomModule";
import TabVoiceRx from "../../components/tab_design/TabVoiceRx";
import GenRxKnowMore from "../../components/GenRxKnowMore";
import ConsultationDrawer from "../../components/ConsultationDrawer";
import Carousel from "react-multi-carousel";
import GenRxBanner from "../../components/GenRxBanner";
import TatvaAiBanner from "../../components/TatvaAiBanner";
import TatvaAiKnowMore from "../../components/TatvaAiKnowMore";
import ExpiredSubModal from "../monetization/components/ExpiredSubModal";
import { checkCredits } from "../../redux/monetizationSlice";
import { services } from "../../redux/doctorsSlice";
import SCPopup from "../../components/SCPopup";
import { fetchSymptomsCollectorData } from "../../api/services/ApiGenRx";
import SCBanner from "../../components/SCBanner";
import CarePlanDropdown from "../../components/CarePlanDropdown";
import CarePlanList from "../../components/CarePlanList";
import { getCarePlanNames, getCarePlanAssignments } from "../smartSync/services/carePlanService";
import TabCarePlanList from "../../components/tab_design/TabCarePlanList";

function TabPrescription() {
  const {
    customizedPadLeftList,
    customizedPadRightList,
    frequencyList,
    timingList,
    userId,
  } = useSelector((state) => state.doctors);
  const { planDetails } = useSelector((state) => state.subscription);
  const tp_monetization_enable = !shouldMonetizationDisabled();
  const isApexAIAccessable = useFeatureIsOn("cdss");
  const isVoiceRxAccessable = useFeatureIsOn("voice-rx");
  const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);
  const { selectedVitalsList, vitalsPastList, patientBirthWeight } =
    useSelector((state) => state.vitals);
  const { privateNotesList } = useSelector((state) => state.medicalhistory);
  const { obstetricDetails: allObstetricDetails, isObstetricDetailsFetched, isNavigateToObstetric } =
    useSelector((state) => state.obstetric);
  const obstetricDetails = allObstetricDetails?.currentPregnancy || {};
  const { examinationHistory = [] } = obstetricDetails || [];
  const isCarePlanEnabled = useFeatureIsOn(GB_CARE_PLAN);
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
  const { isApexAISelected, showSCPopup, isDDxReadyToGenerate, isAutofillSelected, selectedSymptomsCollector } = useSelector(
    (state) => state.ddx
  );
  const { profile } = useSelector((state) => state.doctors);
  const { isLoading } = useSelector((state) => state.uploadDoc);
  const { customModules } = useSelector(
    (state) => state.customModules
  );
  const decodedToken = getDecodedToken();
  const tokenData = decodedToken?.result;
  const dispatch = useDispatch();

  const { state } = useLocation();
  const { patient_data, caseManagerData } = state;
  const chartType = state?.chartType;
  const tcmId = caseManagerData !== undefined ? caseManagerData.tcm_id : 0;
  const pamId = caseManagerData !== undefined ? caseManagerData.pam_id : 0;
  const consultationDate =
    caseManagerData !== undefined
      ? caseManagerData.consultation_date
      : moment().format("YYYY-MM-DD HH:mm:ss");

  const [symptomsData, setSymptomsData] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [surgeriesData, setSurgeriesData] = useState([]);
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
  const [shouldShowApexPopup, setShowApexPopup] = useState(true);
  const [shouldShowGenRxPopup, setShowGenRxPopup] = useState(true);
  const [shouldShowTatvaAiPopup, setShowTatvaAiPopup] = useState(true);
  const [ddxKnowMoreDrawer, setDDxKnowMoreDrawer] = useState(false);
  const { isVaccinationAccessable, isGrowthChartAccessable, isGynaecHistoryAccessable } = useAccess(
    caseManagerData?.patient_data?.patient_age
  );
  const [updatedGynecHistory, setUpdatedGynecHistory] = useState(null);
  const [labParamsData, setLabParamsData] = useState(null);
  const [generatedDDx, setGeneratedDDx] = useState({ results: [] });
  const [likeDislike, setLikeDislike] = useState([]);
  const [isDDxGenerated, setIsDDxGenerated] = useState(false);
  const [isDDxLoading, setIsDDxLoading] = useState(false);
  const [customModuleContents, setCustomModuleContents] = useState([]);
  const [pillupSwitch, setPillupSwitch] = useState(true);
  const [showSCBanner, setShowSCBanner] = useState(false);

  const { servicesList } = useSelector((state) => state.doctors);

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalData, setSubModalData] = useState(null);
  const [useVoiceRx, setUseVoiceRx] = useState(false);
  const [useDDX, setUseDDX] = useState(false);
  const [selectedCarePlan, setSelectedCarePlan] = useState(null);
  const [carePlanPlaceholder, setCarePlanPlaceholder] = useState(undefined);

  const showHideSubModal = (object) => {
    object && setSubModalData(object)
    setIsSubModalOpen(!isSubModalOpen);
  }

  const contextApi = {
    patient_data,
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
    setUseDDX,
    selectedCarePlan,
    setSelectedCarePlan
  };

  const [collapsed, setCollapsed] = useState(false);
  const [collapsedFlag, setCollapsedFlag] = useState(null);
  const [vitalDrawer, setVitalDrawer] = useState(false);
  const [medicalHistoryDrawer, setMedicalHistoryDrawer] = useState(false);
  const [privateNotesDrawer, setPrivateNotesDrawer] = useState(false);
  const [selectPrivateNotes, setSelectPrivateNotes] = useState(null);
  const [vaccinationDrawer, setVaccinationDrawer] = useState(false);
  const [growthDrawer, setGrowthDrawer] = useState(false);
  const [uploadDocDrawer, setUploadDocDrawer] = useState(false);
  const [medicalReportDrawer, setMedicalReportDrawer] = useState(false);
  const [labParamsDrawer, setLabParamsDrawer] = useState(false);
  const [viewlabparamsDrawer, setViewlabparamsDrawer] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [shouldShowDeletePopup, setShowDeletePopup] = useState(false);
  const [shouldShowUploadDocPopup, setShowUploadDocPopup] = useState(false);
  const [ddxDrawer, setDDxDrawer] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [isEditDocument, setIsEditDocument] = useState(false);
  const fileInputRef = useRef(null);
  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileLimitError, setIsFileLimitError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(null);
  const [genRxKnowMoreDrawer, setGenRxKnowMoreDrawer] = useState(false);
  const [isGenRxDrawerVisible, setIsGenRxDrawerVisible] = useState(caseManagerData?.smart_prescription_filename || false);
  const [tatvaAiKnowMoreDrawer, setTatvaAiKnowMoreDrawer] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);

  const getAllObstetricDetails = async () => {
    const obstetricResponse = await fetchObstetricDetails(patient_data.patient_unique_id);
    if (obstetricResponse) {
      dispatch(addObstetricDetails(obstetricResponse));
    }
  }

  const baseUrl = env.lab_params_api_url;

  const getAllPatientDocs = async () => {
    const doctorUploadedDocs = await fetchAllPatientDocs(
      patient_data.patient_unique_id
    );
    const patientUploadedDocs = await fetchDocsUploadedByPatient(
      patient_data.patient_unique_id
    );
    dispatch(setPatientUploadedDocs(patientUploadedDocs));
    dispatch(
      setAllUploadedDocs(mergeDocuments(doctorUploadedDocs, patientUploadedDocs))
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
      if (selectedSymptomsCollector?.medicalHistory?.length > 0) {
        openCollapsed(2);
      }
      const timer = setTimeout(() => {
        setShowShimmer(false);
      }, 1000); // 1 seconds

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [isAutofillSelected]);

  useEffect(() => {
    if (uploadDocCategories.length === 0) {
      getAllDocumentCategories();
    }
    if (patient_data.patient_unique_id && allUploadedDocs.length === 0) {
      getAllPatientDocs();
    }
  }, []);

  useEffect(() => {
    const sendData = {
      patient_unique_id: patient_data?.patient_unique_id,
    };
    dispatch(viewPatient(sendData));
  }, []);

  useEffect(() => {
    getSymptomsCollectorData();
  }, []);

  useEffect(() => {
    if (!isObstetricDetailsFetched && isGynaecHistoryAccessable) {
      getAllObstetricDetails();
    }
  }, [isObstetricDetailsFetched, isGynaecHistoryAccessable]);

  useEffect(() => {
    if (isCarePlanEnabled) {
      fetchCarePlanNames();
    }
  }, [isCarePlanEnabled]);

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
        caseManagerData?.surgeries?.length > 0 &&
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
  const handleDrawerObstetric = (obstetricKey) => {
    setCollapsedFlag(6);
    setObstetricDrawer(typeof obstetricKey === "string" ? obstetricKey : !obstetricDrawer);
  };

  const getLabParams = async () => {
    try {
      const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
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

  useEffect(() => {
    getLabParams()
  }, []);

  const showHideBackModal = () => {
    setIsBackModalOpen(!isBackModalOpen);
  };

  // Function to update lab params data in parent component when saved
  const handleLabParamsUpdate = () => {
    getLabParams();
  };

  // Drawer Medical History
  const handleAddLabParamsDrawer = () => {
    setCollapsedFlag(8);
    setLabParamsDrawer(!labParamsDrawer);
  }

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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

  // Drawer Upload Document
  const handleDrawerUploadDoc = () => {
    setCollapsedFlag(7);
    setUploadDocDrawer(!uploadDocDrawer);
  };

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const handleUploadDocPopup = () => {
    setShowUploadDocPopup((prev) => !prev);
  };

  // Drawer Medical Report
  const handleDrawerMedicalReport = () => {
    setMedicalReportDrawer(!medicalReportDrawer);
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

  useEffect(() => {
    if (collapsedFlag === 6 && examinationHistory?.length === 0 && !shouldShowImmunisation && !shouldShowAncHistory && !obstetricDetails?.lmp && !obstetricDetails?.edd && !obstetricDetails?.ceed && !obstetricDetails?.gravidity && !obstetricDetails?.parity && !obstetricDetails?.livingChildren && !obstetricDetails?.abortion && !obstetricDetails?.ectopicPregnancies) {
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
      } else if (flag === 7) {
        handleDrawerUploadDoc();
      } else if (flag === 8) {
        handleAddLabParamsDrawer();
      } else if (flag === 11) {
        // Care plan is handled by openCollapsed, no additional action needed
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
          mode: caseManagerData !== undefined && tcmId !== 0 ? EDIT : ADD,

          pm_pid: patient_data !== undefined ? patient_data.pm_pid : 0, //extra
          pm_id: patient_data !== undefined ? patient_data.pm_id : 0, //extra
        })
      );

      if (
        (profile?.dp_name === PAEDIATRICS || profile?.dp_id === NEO_NATOLOGISTS_DP_ID) && patient_data?.ageMonths <= 12 &&
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

  const fetchGynecHistory = async () => {
    try {
      const data = await getGynecDetails(patient_data.patient_unique_id, userId);
      // Destructure to remove createdAt and createdBy
      const { createdAt, createdBy, ...updatedData } = data;

      setUpdatedGynecHistory(updatedData);
    } catch (error) {
      console.error('Error fetching gynec history:', error);
    }
  };

  const handleViewLabParamsDrawer = () => {
    setViewlabparamsDrawer((prev) => !prev);
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

  const handleGenRxKnowMore = () => {
    setGenRxKnowMoreDrawer((prev) => !prev);
  };

  const handleTatvaAiKnowMore = () => {
    setTatvaAiKnowMoreDrawer((prev) => !prev);
  };

  const handleDDxKnowMore = () => {
    setDDxKnowMoreDrawer((prev) => !prev);
  }

  // Function to close "View Lab Params" and open "Add Lab Params"
  const handleSwitchToAddLabParams = () => {
    setViewlabparamsDrawer(false);
    setLabParamsDrawer(true);
  };

  const handleRetryBtn = () => {
    setFilesData([]);
    setIsFileSizeError(false);
    setIsFileLimitError(false);
    setIsFileTypeError(null);
  };

  const getGenerateDDx = async (field) => {
    const DDX_planDetails = servicesList?.find(e => e.service_name === S_DDX)
    if (DDX_planDetails?.plan_tier === FREE && DDX_planDetails?.credit_balance <= 0) {
      showHideSubModal({ service_name: S_DDX })
    } if (DDX_planDetails?.plan_tier === FAILED_VERIFICATION) {
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
          } else if (action?.payload?.plan_tier === FAILED_VERIFICATION) {
            showHideSubModal()
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

  const fetchCarePlanNames = async () => {
    try {
      if (isCarePlanEnabled) {
        const response = await getCarePlanNames();
        // The CarePlanDropdown component handles its own data fetching
      }
    } catch (error) {
      console.error("Error fetching care plan names:", error);
    }
  };
  
  // Derive placeholder plan name by fetching assignments and matching current tcm_id
  useEffect(() => {
    const resolvePlaceholder = async () => {
      try {
        if (!isCarePlanEnabled) return;
        if (!patient_data?.patient_unique_id) return;
        if (!tcmId || Number(tcmId) === 0) return;
  
        const resp = await getCarePlanAssignments(patient_data?.patient_unique_id);
        const list = Array.isArray(resp) ? resp : [];
  
        const match = list.find(x => Number(x?.tcm_id) === Number(tcmId));
        setCarePlanPlaceholder(match?.plan_name || undefined);
      } catch (e) {
        setCarePlanPlaceholder(undefined);
      }
    };
  
    resolvePlaceholder();
  }, [isCarePlanEnabled, patient_data?.patient_unique_id, tcmId]);

  const handleApexAIClose = () => {
    dispatch(setIsApexAISelected(false));
    setCollapsedFlag(null);
    setCollapsed(false);
  }

  const handleApexAI = () => {
    dispatch(setIsApexAISelected(true));
    openCollapsed((isVoiceRxAccessable || tp_monetization_enable) ? 10 : 9);
    window.Moengage.track_event("TP_Apex_AI_Ack", {
      clinic_name: getClinicName(profile?.hospital_data),
      doctor_id: profile?.doctor_unique_id,
      patient_number: patient_data?.pm_contact_no,
      patient_id: patient_data?.patient_unique_id,
    });
  }

  const handleGenRx = () => {
    setIsGenRxDrawerVisible(true);
    const clinic_name = getClinicName(profile?.hospital_data);
    trackEvent("TP_VoiceRx_Start", {
      patient_contact: patient_data?.pm_contact_no || "",
      patient_id: patient_data?.patient_unique_id || "",
      doctor_speciality: profile?.dp_name,
      doctor_unique_id: profile?.doctor_unique_id,
      clinic_name,
    });
  };

  return (
    <CashManagerContext.Provider value={contextApi}>
      <>
        <HeaderPrescription isVaccinationEnabled={isVaccinationAccessable} isGrowthChartEnabled={isGrowthChartAccessable} gynecHistory={updatedGynecHistory} labParamsData={labParamsData} handleGenRx={() => setIsGenRxDrawerVisible(true)} selectedCarePlan={selectedCarePlan} />
        <div className="w-100 bg-body wrapper2 prescription-wrapper p-0">
          <Layout>
            <div
              className={`prescription-sidebar ${isApexAISelected ? "prescription-sidebar-ai" : ""
                }`}
            >
              {isApexAISelected ? (
                <>
                  <img
                    src={ddxVector}
                    className="prescription-sidebar-ai-vector"
                  />
                  <img
                    src={ddxVector}
                    className="prescription-sidebar-ai-vector-reverse"
                  />
                  <button
                    type="button"
                    className="mb-3 text-center btn btn-action"
                    onClick={handleApexAIClose}
                    style={{ padding: "6px 10px" }}
                  >
                    <div
                      className={"prescription-tab-button"}
                      style={{ backgroundColor: "white", borderRadius: 16 }}
                    >
                      <i className="icon-Cross" style={{ color: "#7742FE" }} />
                    </div>
                  </button>
                  {(isVoiceRxAccessable || tp_monetization_enable) && <button
                    type="button"
                    className="mb-3 text-center btn btn-action"
                    onClick={() => openCollapsed(10)}
                  >
                    <div
                      className={`prescription-tab-button rounded-10px`}
                      style={{ backgroundColor: "inherit" }}
                    >
                      <div
                        className={`prescription-tab-button rounded-10px`}
                      style={{backgroundColor: "inherit"}}
                      >
                        <img
                          src={collapsedFlag == 10 ? genRxImg : voiceRxDefault}
                          alt="VoiceRx"
                          width={42}
                          height={42}
                        />
                      </div>
                      <label className="text-white mt-1">Voice Rx</label>
                    </div>  
                  </button>}
                  {(isApexAIAccessable || tp_monetization_enable) && <button
                    type="button"
                    className="mb-3 text-center btn btn-action"
                    onClick={() => openCollapsed(9)}
                  >
                    <div
                      className={`prescription-tab-button rounded-10px`}
                      style={{ backgroundColor: "inherit" }}
                    >
                      <div
                        className={`prescription-tab-button rounded-10px`}
                      style={{backgroundColor: "inherit"}}
                      >
                        <img
                          src={collapsedFlag == 9 ? ddxImg : ddxInactiveImg}
                          alt="Vitals"
                        />
                      </div>
                      <label className="text-white mt-1">DDx</label>
                    </div> 
                  </button>}
                </>
              ) : (
                <>
                  {((isApexAIAccessable || isVoiceRxAccessable) || tp_monetization_enable) && (
                    <button
                      type="button"
                      className="mb-3 text-center btn btn-action"
                      onClick={handleApexAI}
                      style={{ padding: "6px 10px" }}
                    >
                      <div
                        className={`prescription-tab-button rounded-10px ${collapsedFlag == 1 && "active"
                          }`}
                        style={{ position: "relative" }}
                      >
                        <img src={apexAIImg} alt="apex-AI" />
                        {isDDxReadyToGenerate && generatedDDx?.results?.length > 0 && (
                          <img
                            src={blinkingDot}
                            alt="blinking-dot"
                            width={30}
                            height={30}
                            style={{
                              position: "absolute",
                              top: -15,
                              right: -15,
                            }}
                          />
                        )}
                      </div>
                      <label className="text-white mt-1">TatvaAI</label>
                    </button>
                  )}
                  {customizedPadLeftList?.map((e, i) => {
                    return e.tmdpm_id === 1 && e.tmdpm_status === 0 ? (
                      <button
                        key={i}
                        type="button"
                        className="mb-3 text-center btn btn-action"
                        onClick={() =>
                          vitalsData.length === 0 &&
                            vitalsPastList.length === 0 &&
                            !patientBirthWeight
                            ? handleDrawerVital()
                            : openCollapsed(1)
                        }
                      >
                        <div
                          className={`prescription-tab-button rounded-10px ${collapsedFlag == 1 && "active"
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
                          medicalHistoryData.length === 0 &&
                            !updatedGynecHistory
                            ? handleDrawerMedicalHistory()
                            : openCollapsed(2)
                        }
                      >
                        <div
                          className={`prescription-tab-button rounded-10px ${collapsedFlag == 2 && "active"
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
                          className={`prescription-tab-button rounded-10px  ${collapsedFlag == 4 && "active"
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
                    ) : e.tmdpm_id === 7 &&
                      e.tmdpm_status === 0 &&
                      isVaccinationAccessable ? (
                      <button
                        type="button"
                        className="mb-3 text-center btn btn-action"
                        onClick={handleDrawerVaccination}
                      >
                        <div
                          className={`bg-secondary-light prescription-tab-button rounded-10px ${collapsedFlag === 3 && "active"
                            }`}
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
                    ) : e.tmdpm_id === 16 &&
                      e.tmdpm_status === 0 &&
                      isGrowthChartAccessable ? (
                      <button
                        type="button"
                        className="mb-3 text-center btn btn-action"
                        onClick={handleDrawerGrowth}
                      >
                        <div
                          className={`prescription-tab-button rounded-10px ${collapsedFlag === 5 && "active"
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
                    ) : e.tmdpm_id === 17 &&
                      e.tmdpm_status === 0 &&
                      isGynaecHistoryAccessable ? (
                      <button
                        type="button"
                        className="mb-3 text-center btn btn-action"
                        style={{ padding: "0px" }}
                        onClick={() =>
                          examinationHistory?.length === 0 &&
                            !shouldShowAncHistory &&
                            !shouldShowImmunisation &&
                            !obstetricDetails?.lmp &&
                            !obstetricDetails?.edd &&
                            !obstetricDetails?.gravidity &&
                            !obstetricDetails?.parity &&
                            !obstetricDetails?.livingChildren &&
                            !obstetricDetails?.abortion &&
                            !obstetricDetails?.ectopicPregnancies &&
                            !obstetricDetails?.ceed
                            ? handleDrawerObstetric()
                            : openCollapsed(6)
                        }
                      >
                        <div
                          className={`prescription-tab-button rounded-10px ${collapsedFlag === 6 && "active"
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
                    ) : e.tmdpm_id === 18 && e.tmdpm_status === 0 ? (
                      <button
                        type="button"
                        className="mb-3 text-center btn btn-action"
                        style={{ padding: "0px" }}
                        onClick={() =>
                          allUploadedDocs.length === 0
                            ? handleAddClick()
                            : openCollapsed(7)
                        }
                      >
                        {isAndroid && !isBrowser ? (
                          <div
                            ref={fileInputRef}
                            onClick={handleUploadDocPopup}
                            style={{ display: "none" }}
                          />
                        ) : (
                          <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/png, image/jpeg, image/jpg, image/gif, application/pdf, video/mp4, video/quicktime, video/x-msvideo"
                            style={{ display: "none" }}
                          />
                        )}
                        <div
                          className={`prescription-tab-button rounded-10px ${collapsedFlag === 7 && "active"
                            }`}
                        >
                          <img
                            src={
                              collapsedFlag === 7
                                ? medicalRecordsDark
                                : medicalRecordsWhite
                            }
                            alt="records"
                          />
                        </div>
                        <label className="text-white mt-1">Records</label>
                      </button>
                    ) : e.tmdpm_id === 19 &&
                      e.tmdpm_status === 0 ? (
                      <button
                        type="button"
                        className="mb-3 text-center btn btn-action"
                        style={{ padding: "0px" }}
                        onClick={() =>
                          labParamsData?.length === 0
                            ? handleAddLabParamsDrawer()
                            : openCollapsed(8)
                        }
                      >
                        <div
                          className={`prescription-tab-button rounded-10px ${collapsedFlag === 8 && "active"
                            }`}
                        >
                          <img
                            src={
                              collapsedFlag === 8
                                ? labParamsDark
                                : labParamsWhite
                            }
                            alt="lab"
                          />
                        </div>
                        <label className="text-white mt-1">Lab</label>
                      </button>
                    ) : e.tmdpm_id === 22 &&
                      e.tmdpm_status === 0 &&
                      isCarePlanEnabled ? (
                      <button
                        type="button"
                        className="mb-3 text-center btn btn-action"
                        style={{ padding: "0px" }}
                        onClick={() => openCollapsed(11)}
                      >
                        <div
                          className={`prescription-tab-button rounded-10px ${collapsedFlag === 11 && "active"
                            }`}
                        >
                          <img
                            src={collapsedFlag === 11 ? carePlanIconDark : carePlanIcon}
                            alt="Care Plan"
                            style={{ width: '24px', height: '24px' }}
                          />
                        </div>
                        <label className="text-white mt-1">Care Plan</label>
                      </button>
                    ) : null;
                  })}
                </>
              )}
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
              ) : collapsedFlag === 6 ? (
                <TabObstetricList
                  obstetricDrawer={obstetricDrawer}
                  handleCollapsed={() => setCollapsed(!collapsed)}
                  handleDrawerObstetric={handleDrawerObstetric}
                />
              ) : collapsedFlag === 7 ? (
                <TabUploadDocumentList
                  handleCollapsed={() => setCollapsed(!collapsed)}
                  handleDrawerMedicalReport={handleDrawerMedicalReport}
                  fileInputRef={fileInputRef}
                  handleFileUpload={handleFileUpload}
                  handleAddClick={handleAddClick}
                  handleDrawerUploadDoc={handleDrawerUploadDoc}
                  setFilesData={setFilesData}
                  setIsEditDocument={setIsEditDocument}
                  handleUploadDocPopup={handleUploadDocPopup}
                  setUploadDocDrawer={setUploadDocDrawer}
                />
              ) : collapsedFlag === 8 ? (
                <TabLabParametersList
                  handleCollapsed={() => setCollapsed(!collapsed)}
                  labParamsData={labParamsData}
                  handleAddLabParamsDrawer={handleAddLabParamsDrawer}
                  handleViewLabParamsDrawer={handleViewLabParamsDrawer}
                />
              ) :
                collapsedFlag === 9 && (isApexAIAccessable || tp_monetization_enable) ? (
                  <TabDDxList
                    generatedDDx={generatedDDx?.results}
                    handleDDxDrawer={handleDDxDrawer}
                    isDDxLoading={isDDxLoading}
                    handleDDxKnowMore={handleDDxKnowMore}
                    getGenerateDDx={getGenerateDDx}
                    isDDxGenerated={isDDxGenerated}
                  />
                ) : collapsedFlag === 10 && (isVoiceRxAccessable || tp_monetization_enable) ? (
                    <TabVoiceRx
                      handleGenRxKnowMore={handleGenRxKnowMore}
                      setIsGenRxDrawerVisible={setIsGenRxDrawerVisible}
                    />
                  ) : collapsedFlag === 11 && isCarePlanEnabled ? (
                    <TabCarePlanList
                        handleCollapsed={() => setCollapsed(!collapsed)}
                        patientId={patient_data?.patient_unique_id}
                        selectedTcmId={tcmId}
                        selectedCarePlan={selectedCarePlan}
                        setSelectedCarePlan={setSelectedCarePlan}
                        userId={userId}
                        clinicId={decodedToken?.result?.clinic_id}
                        carePlanPlaceholder={carePlanPlaceholder}
                    />
                  ) : null}
            </Sider>
            <div
              className="p-20 w-100 overflow-y-auto"
              style={{ height: "calc(100vh - 60px)" }}
            >
              <Content>
                {/* {(shouldShowGenRxPopup || shouldShowApexPopup || shouldShowTatvaAiPopup) && 
                  <Carousel
                  responsive={{
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
                  }}
                  infinite={true}
                  autoPlay={true}
                  showDots={true}
                  autoPlaySpeed={2000}
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  arrows={false}
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
                      <TabSymptomsBox
                          handleDDxDrawer={handleDDxDrawer}
                          generatedDDx={generatedDDx?.results}
                        />
                      </div>
                    </div>
                  ) : e.tmdpm_id === 10 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabExaminationBox />
                    </div>
                  ) : e.tmdpm_id === 21 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabSurgicalBox />
                    </div>
                  ) : e.tmdpm_id === 11 && e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabDiagnosisBox
                        handleDDxDrawer={handleDDxDrawer}
                        generatedDDx={generatedDDx?.results}
                        getGenerateDDx={getGenerateDDx}
                        isDDxLoading={isDDxLoading}
                        handleDDxKnowMore={handleDDxKnowMore}
                        isDDxGenerated={isDDxGenerated}
                      />
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
                      <TabInvestigationBox
                        handleDDxDrawer={handleDDxDrawer}
                        generatedDDx={generatedDDx?.results}
                      />
                    </div>
                  ) :
                    e.tmdpm_id === 15 &&
                    e.tmdpm_status === 0 ? (
                    <div key={i} className="prescription-box-sm">
                      <TabFollowUpBox />
                    </div>
                    ): e.is_custom_module && e.tmdpm_status === 0 && customModule && (
                      <div className="prescription-box-sm">
                        <TabCustomModule module={customModule} />
                      </div>
                    )
                })}
                <TabAddCustomModule />
              </Content>
            </div>
          </Layout>
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
            zIndex={100}
          >
            <Obstetric
              obstetricDetails={obstetricDetails}
              obstetricDrawer={obstetricDrawer}
              handleDrawerObstetric={handleDrawerObstetric}
              handleCollapsed={(flag) => handleCollapsed(flag)}
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
              handleUploadDocPopup={handleUploadDocPopup}
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
            className="modalWidth-700"
            width={"auto"}
            push={false}
          >
            <MedicalRecords
              medicalReportDrawer={medicalReportDrawer}
              onClose={handleDrawerMedicalReport}
              handleDrawerUploadDoc={handleDrawerUploadDoc}
              setFilesData={setFilesData}
              setIsEditDocument={setIsEditDocument}
              handleUploadDocPopup={handleUploadDocPopup}
              setUploadDocDrawer={setUploadDocDrawer}
            />
          </Drawer>
        )}
        {shouldShowUploadDocPopup && (
          <UploadDocPopup
            shouldShowUploadDocPopup={shouldShowUploadDocPopup}
            onCancel={handleUploadDocPopup}
            setFilesData={setFilesData}
            filesData={filesData}
            setUploadDocDrawer={setUploadDocDrawer}
            setIsFileSizeError={setIsFileSizeError}
            setIsFileLimitError={setIsFileLimitError}
            setIsFileTypeError={setIsFileTypeError}
          />
        )}
        {labParamsDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={showHideBackModal}
            open={labParamsDrawer}
            className="modalWidth-700"
            width={"auto"}
            push={false}
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
            <DifferentialDiagnosisDrawer
              handleDDxDrawer={handleDDxDrawer}
              generatedDDx={generatedDDx?.results}
              includeExcludeInput={generatedDDx?.input}
              likeDislike={likeDislike}
              setLikeDislike={setLikeDislike}
            />
          </Drawer>
        )}

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

        {isGenRxDrawerVisible && (
          <ConsultationDrawer
            visible={isGenRxDrawerVisible}
            onClose={() => setIsGenRxDrawerVisible(false)}
            handleGenRxKnowMore={handleGenRxKnowMore}
          />
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

        {tatvaAiKnowMoreDrawer &&
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
        }

        {isLoading ? (
          <div>
            <Spin
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                zIndex: "9999",
              }}
              size="large"
            />
          </div>
        ) : null}
      </>
      {isFileSizeError || isFileLimitError || isFileTypeError ? (
        <CommonModal
          isModalOpen={isFileSizeError || isFileLimitError || isFileTypeError}
          onCancel={handleRetryBtn}
          modalWidth={500}
          title={
            isFileSizeError
              ? "Exceeded File Size"
              : isFileLimitError
                ? "Exceeded File Upload Limit"
                : isFileTypeError
                  ? "File format not supported"
                  : "You may lose your data"
          }
          modalBody={
            <>
              <div className="alert-warning rounded-10px p-2 patient-details">
                <div className="d-flex align-items-center">
                  <img className="me-3" src={alertIcon} alt="Warning" />
                  <span>
                    {isFileSizeError ? (
                      <>
                        The file size exceeded{" "}
                        <span style={{ fontWeight: 700 }}>15MB.</span> Please
                        upload a file smaller than 15MB
                      </>
                    ) : isFileLimitError ? (
                      <>
                        You can only upload up to
                        <span style={{ fontWeight: 700 }}> 5 files.</span>{" "}
                        Please reduce the number of files and try again.
                      </>
                    ) : isFileTypeError ? (
                      <>
                        You can't upload
                        <span style={{ fontWeight: 700 }}>
                          {" "}
                          {isFileTypeError}
                        </span>{" "}
                        file. Only PDF, JPG, JPEG, and PNG formats are accepted.
                      </>
                    ) : (
                      "Are you sure you want to leave ?"
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleRetryBtn}
                  className="w-100 btn btn-primary3 btn-41 px-4"
                >
                  Retry
                </Button>
              </div>
            </>
          }
        />
      ) : null}

      <ExpiredSubModal
        title={subModalData && subModalData?.hasOwnProperty('service_name') && subModalData?.service_name}
        isSubModalOpen={isSubModalOpen}
        showHideSubModal={showHideSubModal} />

      {showSCPopup && !caseManagerData?.smart_prescription_filename && (
        <SCPopup handlePopup={() => dispatch(setShowSCPopup(false))} handleGenRx={handleGenRx} />
      )}
    </CashManagerContext.Provider>
  );
}
export default TabPrescription;