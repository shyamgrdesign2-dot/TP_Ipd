import React, { Suspense, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import { Button, Drawer } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import PhysicalExamination from "./PhysicalExamination";
import FunctionalAssessment from "./FunctionalAssessment";
import TreatmentPlan from "./TreatmentPlan";
import NoteSection from "./NoteSection";
import {
  getAssessmentsData,
  lastPrescriptionData,
  setAdditionalNotesData,
  setChiefComplaint,
  setFunctionalAssessmentData,
  setGynecHistoryData,
  setHistoryOfPresentIllness,
  setLabResults,
  setPhysicalExaminationBasicData,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
  setReferredDocForReview,
  setTreatmentPlanData,
  setVitalsData,
  updateAssessmentsData,
} from "../../../redux/ipd/assessmentsFormSlice";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice";
import {
  getAllDoses,
  getMedicationTemplates,
} from "../../../redux/medicationSlice";
import { getExaminationTemplates } from "../../../redux/examinationSlice";
import { getDiagnosisTemplates } from "../../../redux/diagnosisSlice";
import { getSymptomsTemplates } from "../../../redux/symptomsSlice";
import { getInvestigationTemplates } from "../../../redux/investigationSlice";
import { getAdviceTemplates } from "../../../redux/adviceSlice";
import AddCustomModule from "../../../components/AddCustomModule";
import { useSelector } from "react-redux";
import {
  addOrderToAssessmentFormStructure,
  convertMedicationFormat,
  convertTemplateDataToRichText,
} from "../../../utils/utils";
import {
  setMedicalHistoryData,
  setMedicationData,
} from "../../../redux/prescriptionSlice";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");

const AssessmentsForm = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    patient_data,
    patient_data_main,
    isEditable = props.isEditable || true,
  } = state || {};

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  // const { templates: symptomsTemplates } = useSelector(
  //   (state) => state.symptoms
  // );
  // const { templates: medicationTemplates } = useSelector(
  //   (state) => state.medication
  // );
  // const { templates: examinationTemplates } = useSelector(
  //   (state) => state.examination
  // );
  // const { templates: diagnosisTemplates } = useSelector(
  //   (state) => state.diagnosis
  // );
  // const { templates: investigationTemplates } = useSelector(
  //   (state) => state.investigation
  // );
  // const { templates: adviceTemplates } = useSelector((state) => state.advice);
  const { obstetricDetails: allObstetricDetails } = useSelector(
    (state) => state.obstetric
  );
  const { customization = {} } = useSelector((state) => state.ipd);
  const assessmentData = useSelector((state) => state.assessment);
  const prescriptionData = useSelector((state) => state.prescription);
  const { assessments = [] } = customization;
  const [modelData, setModelData] = useState(
    assessments.length > 0
      ? assessments
      : IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE
  );

  useEffect(() => {
    if (assessments.length > 0) {
      setModelData(assessments);
    }
  }, [assessments]);

  useEffect(() => {
    // fetch assessments form from api
    dispatch(
      getAssessmentsData({ patientId: parseInt(patient_data?.details?.id, 10) })
    );
    dispatch(getCustomization());
    dispatch(
      lastPrescriptionData({
        patientId: parseInt(patient_data?.details?.id, 10),
        caseId: 37891,
      })
    ); // TODO: INTEL - get from inpatient details (state)
  }, []);

  useEffect(() => {
    // fetch all the templates available
    dispatch(getMedicationTemplates());
    dispatch(getAllDoses());
    dispatch(getExaminationTemplates());
    dispatch(getDiagnosisTemplates());
    dispatch(getSymptomsTemplates());
    dispatch(getInvestigationTemplates());
    dispatch(getAdviceTemplates());
  }, []);

  console.log("INTEL ==> whole data", assessmentData, prescriptionData);

  useEffect(() => {
    if (assessmentData.assessmentsData) {
      // Chief Complaint
      dispatch(setChiefComplaint(assessmentData.assessmentsData?.basicInfo?.chiefComplaint || []));

      // History of Present Illness
      dispatch(setHistoryOfPresentIllness(assessmentData.assessmentsData?.basicInfo?.historyOfPresentIllness || []));

      // Lab Results
      dispatch(setLabResults(assessmentData.assessmentsData?.basicInfo?.labResults || []));

      // Physical Examination Others
      dispatch(setPhysicalExaminationOthersData(assessmentData.assessmentsData?.basicInfo?.physicalExaminationOthers || []));

      // Physical Examination Provisional Diagnosis
      dispatch(setPhysicalExaminationProvisionalDiagnosisData(assessmentData.assessmentsData?.basicInfo?.physicalExaminationProvisionalDiagnosis || []));

      // Physical Examination Basic Data
      dispatch(setPhysicalExaminationBasicData(assessmentData.assessmentsData?.basicInfo?.physicalExaminationBasic || {}));

      // Functional Assessment Data
      dispatch(setFunctionalAssessmentData(assessmentData.assessmentsData?.basicInfo?.functionalAssessment || {}));

      // Treatment Plan Data
      dispatch(setTreatmentPlanData(assessmentData.assessmentsData?.basicInfo?.treatmentPlan || {}));

      // Additional Notes Data
      dispatch(setAdditionalNotesData(assessmentData.assessmentsData?.basicInfo?.additionalNotes || {}));

      // Vitals Data
      dispatch(setVitalsData(assessmentData.assessmentsData?.basicInfo?.vitals || {}));

      // Gynec History Data
      dispatch(setGynecHistoryData(assessmentData.assessmentsData?.basicInfo?.gynecHistory || {}));

      // Referred Doc For Review
      dispatch(setReferredDocForReview(assessmentData.assessmentsData?.basicInfo?.referredDocForReview || null));
    }
  }, [assessmentData.assessmentsData, dispatch]);

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      assessments: IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const patientDataForOPDComponents = {
    pm_contact_no: patient_data?.details?.contact,
    pm_gender: patient_data?.details?.gender,
    patient_unique_id: patient_data?.details?.id,
  };

  const renderSections = (data) => {
    switch (data?.id) {
      case "basicInfo":
        return (
          <BasicInfo
            {...props}
            patientDataForOPDComponents={patientDataForOPDComponents}
            patient_data={patient_data}
            sectionData={data}
            isEditable={isEditable}
          />
        );
      case "physicalExamination":
        return <PhysicalExamination {...props} sectionData={data} />;
      case "functionalAssessment":
        return <FunctionalAssessment {...props} sectionData={data} />;
      case "treatmentPlan":
        return <TreatmentPlan {...props} sectionData={data} />;
      case "additionalNotes":
        return <NoteSection {...props} sectionData={data} />;
      default:
        return null;
    }
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, assessments: [...modelData] };
    dispatch(updateCustomization(newData));
  };

  const onSaveAssessmentClick = () => {
    const reqData = {
      basicInfo: {
        chiefComplaint: assessmentData.chiefComplaint,
        historyOfPresentIllness: assessmentData.historyOfPresentIllness,
        currentMedications: prescriptionData.medicationData,
        labResults: assessmentData.labResults,
        pastMedicalHistory: prescriptionData.medicalHistoryData,
        gyneacHistory: assessmentData.gynecHistoryData,
        obstetricHistory: allObstetricDetails,
      },
      physicalExamination: {
        vitals: assessmentData.vitalsData,
        examination: assessmentData.physicalExaminationBasicData,
        others: assessmentData.physicalExaminationOthersData,
        provisionalDiagnosis:
          assessmentData.physicalExaminationProvisionalDiagnosisData,
      },
      functionalAssessment: assessmentData.functionalAssessmentData,
      treatmentPlan: assessmentData.treatmentPlanData,
      additionalNotes: assessmentData.additionalNotesData,
      customModule: [], // TODO: INTEL - HANDLE CUSTOM MODULE
    };
    // const reqData = {
    //   basicInfo: {
    //     chiefComplaint: [
    //       {
    //         type: "paragraph",
    //         children: [
    //           {
    //             text: "Chief ",
    //           },
    //           {
    //             text: "complaints",
    //             bold: true,
    //           },
    //         ],
    //       },
    //     ],
    //     historyOfPresentIllness: [
    //       {
    //         type: "paragraph",
    //         children: [
    //           {
    //             text: "history of present ",
    //           },
    //           {
    //             text: "illness",
    //             bold: true,
    //           },
    //         ],
    //       },
    //       {
    //         type: "bulleted-list",
    //         children: [
    //           {
    //             type: "list-item",
    //             children: [
    //               {
    //                 text: "point 1",
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //     currentMedications: convertMedicationFormat([
    //       {
    //         tmm_id: "128696",
    //         tmm_medicine_name: "Y Coxib P 60mg/325mg Tablet",
    //         tmm_generic: "Etoricoxib (60mg) + Paracetamol (325mg)",
    //         tmm_company: "Man Serve Pharma",
    //         tmm_type: "5",
    //         tmm_days: "",
    //         tmm_duration_type: "to be continued",
    //         tmm_dosage: "",
    //         tmm_unit: 2,
    //         tmu_id: 2,
    //         tcm_tmm_freq_morning: "0",
    //         tcm_tmm_freq_afternoon: "0",
    //         tcm_tmm_freq_evening: "0",
    //         tcm_tmm_freq_night: "0",
    //         tmm_time: "4",
    //         tmm_remarks: "",
    //         tmm_freq_type: "6",
    //         tmf_block: 1,
    //         other_tmu_id: "5",
    //         medicineUnit: [
    //           {
    //             tmu_id: 2,
    //             tmu_title: "Tablets",
    //           },
    //           {
    //             tmu_id: 5,
    //             tmu_title: "units",
    //           },
    //         ],
    //         tcm_tmr_type: "M",
    //         pms_default: 1,
    //         objectID: "c965922a2e9d8_dashboard_generated_id",
    //         tmm_freq_type_name: "6 times a day",
    //         tmf_block_val: "6",
    //         tmm_time_name: "Bed Time",
    //         tmm_days_duration_type: "to be continued",
    //         unique_id: "f99547ac-407a-4847-bf1b-aea32b0564fe",
    //         tmm_dosage_unit_name: "",
    //         tmm_unit_name: "Tablets",
    //       },
    //     ]),
    //     labResults: [
    //       {
    //         date: "2025-09-09",
    //         inputs: [
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Haemoglobin (Hb)",
    //             value: "33",
    //             arrowDirection: "up",
    //             refRange: {
    //               isConditional: true,
    //               ranges: [
    //                 {
    //                   gender: "MALE",
    //                   value: "MALE",
    //                   min: "13",
    //                   max: "17",
    //                   unit: "Gms/dL",
    //                 },
    //                 {
    //                   gender: "FEMALE",
    //                   value: "FEMALE",
    //                   min: "12",
    //                   max: "15",
    //                   unit: "Gms/dL",
    //                 },
    //               ],
    //             },
    //             units: "Gms/dL",
    //             recentlyUpdated: true,
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Neutrophils",
    //             value: "22",
    //             arrowDirection: "down",
    //             refRange: {
    //               isConditional: false,
    //               ranges: [
    //                 {
    //                   gender: "ALL",
    //                   value: "",
    //                   min: "40",
    //                   max: "75",
    //                   unit: "%",
    //                 },
    //               ],
    //             },
    //             units: "%",
    //             recentlyUpdated: true,
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Total WBC Count",
    //             value: "11",
    //             arrowDirection: "down",
    //             refRange: {
    //               isConditional: false,
    //               ranges: [
    //                 {
    //                   gender: "ALL",
    //                   value: "",
    //                   min: "4000",
    //                   max: "11000",
    //                   unit: "cells/mm³",
    //                 },
    //               ],
    //             },
    //             units: "cells/mm³",
    //             recentlyUpdated: true,
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Total Lymphocytes",
    //             value: "463",
    //             arrowDirection: "up",
    //             refRange: {
    //               isConditional: false,
    //               ranges: [
    //                 {
    //                   gender: "ALL",
    //                   value: "",
    //                   min: "20",
    //                   max: "40",
    //                   unit: "%",
    //                 },
    //               ],
    //             },
    //             units: "%",
    //             recentlyUpdated: true,
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Eosinophils",
    //             value: "13",
    //             arrowDirection: "up",
    //             refRange: {
    //               isConditional: false,
    //               ranges: [
    //                 {
    //                   gender: "ALL",
    //                   value: "",
    //                   min: "1",
    //                   max: "6",
    //                   unit: "%",
    //                 },
    //               ],
    //             },
    //             units: "%",
    //             recentlyUpdated: true,
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Monocytes",
    //             value: "0",
    //             arrowDirection: "down",
    //             refRange: {
    //               isConditional: false,
    //               ranges: [
    //                 {
    //                   gender: "ALL",
    //                   value: "",
    //                   min: "2",
    //                   max: "10",
    //                   unit: "%",
    //                 },
    //               ],
    //             },
    //             units: "%",
    //             recentlyUpdated: true,
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Total Red Cell Count (RBC)",
    //             value: "2",
    //             arrowDirection: "down",
    //             refRange: {
    //               isConditional: true,
    //               ranges: [
    //                 {
    //                   gender: "FEMALE",
    //                   value: "FEMALE",
    //                   min: "3.8",
    //                   max: "4.8",
    //                   unit: "M cells/mm³",
    //                 },
    //                 {
    //                   gender: "MALE",
    //                   value: "MALE",
    //                   min: "3.5",
    //                   max: "4.5",
    //                   unit: "M cells/mm³",
    //                 },
    //               ],
    //             },
    //             units: "M cells/mm³",
    //             recentlyUpdated: true,
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Erythrocyte Sedimentation Rate (ESR)",
    //             value: "234",
    //             arrowDirection: "up",
    //             refRange: {
    //               isConditional: false,
    //               ranges: [
    //                 {
    //                   gender: "ALL",
    //                   value: "",
    //                   min: "0",
    //                   max: "9",
    //                   unit: "mm/hour",
    //                 },
    //               ],
    //             },
    //             units: "mm/hour",
    //             recentlyUpdated: true,
    //           },
    //         ],
    //       },
    //       {
    //         date: "2025-09-04",
    //         createdAt: "2025-09-04",
    //         inputs: [
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Haemoglobin (Hb)",
    //             value: "sadf",
    //             arrowDirection: "",
    //             units: "Gms/dL",
    //             refRange: {
    //               isConditional: true,
    //               ranges: [
    //                 {
    //                   gender: "MALE",
    //                   value: "",
    //                   min: "13",
    //                   max: "17",
    //                   unit: "Gms/dL",
    //                 },
    //                 {
    //                   gender: "FEMALE",
    //                   value: "",
    //                   min: "12",
    //                   max: "15",
    //                   unit: "Gms/dL",
    //                 },
    //               ],
    //             },
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Neutrophils",
    //             value: "sdf",
    //             arrowDirection: "",
    //             units: "%",
    //             refRange: {
    //               isConditional: false,
    //               ranges: [
    //                 {
    //                   gender: "ALL",
    //                   value: "",
    //                   min: "40",
    //                   max: "75",
    //                   unit: "%",
    //                 },
    //               ],
    //             },
    //           },
    //           {
    //             reportName: "Complete Blood Count - CBC",
    //             testName: "Total WBC Count",
    //             value: "sadfsdf",
    //             arrowDirection: "",
    //             units: "cells/mm³",
    //             refRange: {
    //               isConditional: false,
    //               ranges: [
    //                 {
    //                   gender: "ALL",
    //                   value: "",
    //                   min: "4000",
    //                   max: "11000",
    //                   unit: "cells/mm³",
    //                 },
    //               ],
    //             },
    //           },
    //         ],
    //       },
    //     ],
    //     pastMedicalHistory: [
    //       {
    //         title: "Medical Condition ",
    //         tmmhs_id: 2,
    //         no_know_history: false,
    //         tags: [
    //           {
    //             tmmhst_id: 2356,
    //             title: "Fractures",
    //             pms_default: 0,
    //             since: "",
    //             status: "",
    //             medication: "",
    //             note: "",
    //             enable: "Y",
    //           },
    //           {
    //             tmmhst_id: 2355,
    //             title: "Anemia",
    //             pms_default: 0,
    //             since: "3 Week(s)",
    //             status: "Active",
    //             medication: "Yes",
    //             note: "Severe",
    //             enable: "Y",
    //           },
    //           {
    //             tmmhst_id: 3273,
    //             title: "Stage 5 CKD",
    //             pms_default: 1,
    //             since: "",
    //             status: "",
    //             medication: "",
    //             note: "",
    //             enable: "Y",
    //           },
    //         ],
    //         medical_history_remarks: "additional history",
    //       },
    //       {
    //         title: "Allergies",
    //         tmmhs_id: 4,
    //         no_know_history: false,
    //         tags: [
    //           {
    //             tmmhst_id: 2795,
    //             title: "Gluten",
    //             pms_default: 0,
    //             since: "",
    //             status: "",
    //             note: "",
    //             enable: "Y",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Family History",
    //         tmmhs_id: 3,
    //         no_know_history: false,
    //         tags: [
    //           {
    //             tmmhst_id: 2385,
    //             title: "Hypertension",
    //             pms_default: 0,
    //             relationship: "",
    //             note: "",
    //             enable: "Y",
    //           },
    //           {
    //             tmmhst_id: 2382,
    //             title: "Hypothyroidism",
    //             pms_default: 0,
    //             relationship: "",
    //             note: "",
    //             enable: "Y",
    //           },
    //           {
    //             tmmhst_id: 3265,
    //             title: "Thyroid Dysfunction",
    //             pms_default: 1,
    //             relationship: "",
    //             note: "",
    //             enable: "Y",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Lifestyle",
    //         tmmhs_id: 1,
    //         no_know_history: false,
    //         tags: [
    //           {
    //             tmmhst_id: 2377,
    //             title: "Diet",
    //             pms_default: 0,
    //             since: "",
    //             status: "",
    //             note: "",
    //             enable: "N",
    //           },
    //         ],
    //       },
    //       {
    //         title: "Surgical History",
    //         tmmhs_id: 5,
    //         no_know_history: false,
    //         tags: [],
    //       },
    //     ],
    //     gyneacHistory: [{
    //       lmp: "2025-09-02T00:00:00.000Z",
    //       ageAtMenarche: 8,
    //       cycle: "Irregular",
    //       intervalOfCycle: 25,
    //       cycleNotes: "asdfsfdf waittt",
    //       flow: "Scanty",
    //       durationOfMenstrualFlow: 1,
    //       clots: true,
    //       numberOfPadsPerDay: 3,
    //       flowNotes: "flowwwww",
    //       occurrenceOfPain: "Before menses",
    //       pain: "None",
    //       painNotes: "painnnn",
    //       menarcheNotes: "ageeee",
    //       reproductiveLifeStages: "Menopause",
    //       ageAtMenopause: 46,
    //       typeOfMenopause: "Normal",
    //       reproductiveNotes: "ipudu??",
    //       notes: "notes at last",
    //     }],
    //     obstetricHistory: [{
    //       id: "663626ad-4b59-4ed1-9b0b-cf728e59ce45",
    //       deleted: false,
    //       patientId: 123,
    //       currentPregnancy: {
    //         lmp: "2025-09-01T18:30:00.000Z",
    //         edd: "2026-06-08T18:30:00.000Z",
    //         ceed: "2025-09-09T18:30:00.000Z",
    //         gestationWeeks: 39,
    //         gestationDays: 6,
    //         blood: "B+",
    //         husbandsBlood: "B+",
    //         consang: true,
    //         maritialStatus: "married",
    //         marriageDurationYears: 3,
    //         marriageDurationMonths: 3,
    //         gravidity: 2,
    //         parity: 2,
    //         livingChildren: 2,
    //         abortion: 0,
    //         ectopicPregnancies: 2,
    //         examinationHistory: [],
    //         ancHistory: [
    //           {
    //             masterId: "3d5ce2d5-95fb-4fd7-97b0-1d7c6c088287",
    //             weekRange: {
    //               start: 1,
    //               end: 1,
    //             },
    //             status: "Completed",
    //             enablePrint: true,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:01.552Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:13.076Z",
    //             master: {
    //               id: "3d5ce2d5-95fb-4fd7-97b0-1d7c6c088287",
    //               name: "Anomaly Scan",
    //               weekRange: {
    //                 start: 1,
    //                 end: 1,
    //               },
    //               default: false,
    //               global: false,
    //               hm_id: 390,
    //               patient_unique_id: 0,
    //               created_by: 524,
    //               created_at: "2025-05-27T13:08:10.559Z",
    //               deleted: false,
    //             },
    //             dueDate: "2025-09-15T18:30:00.000Z",
    //             notes: "scanned",
    //           },
    //           {
    //             masterId: "b7f7d24c-1277-4f43-beff-993deab87296",
    //             weekRange: {
    //               start: 6,
    //               end: 9,
    //             },
    //             status: "Due",
    //             enablePrint: false,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:01.552Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:01.552Z",
    //             master: {
    //               id: "b7f7d24c-1277-4f43-beff-993deab87296",
    //               name: "Dating and viability Pregnancy Scan",
    //               weekRange: {
    //                 start: 6,
    //                 end: 9,
    //               },
    //               default: true,
    //               global: true,
    //               hm_id: 0,
    //               patient_unique_id: 0,
    //               created_by: 0,
    //               created_at: "2024-12-09T03:50:27.681Z",
    //               deleted: false,
    //             },
    //             dueDate: null,
    //             notes: null,
    //           },
    //           {
    //             masterId: "af90ff7e-396f-4155-856e-55bc3688f4bc",
    //             weekRange: {
    //               start: 12,
    //               end: 14,
    //             },
    //             status: "Due",
    //             enablePrint: false,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:01.552Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:01.552Z",
    //             master: {
    //               id: "af90ff7e-396f-4155-856e-55bc3688f4bc",
    //               name: "Nuchal Translucency (NT) Scan",
    //               weekRange: {
    //                 start: 12,
    //                 end: 14,
    //               },
    //               default: true,
    //               global: true,
    //               hm_id: 0,
    //               patient_unique_id: 0,
    //               created_by: 0,
    //               created_at: "2024-12-09T03:51:36.196Z",
    //               deleted: false,
    //             },
    //             dueDate: null,
    //             notes: null,
    //           },
    //           {
    //             masterId: "1fae90a1-36d6-4cfe-acb1-fe3958256562",
    //             weekRange: {
    //               start: 18,
    //               end: 22,
    //             },
    //             status: "Due",
    //             enablePrint: false,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:01.552Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:01.552Z",
    //             master: {
    //               id: "1fae90a1-36d6-4cfe-acb1-fe3958256562",
    //               name: "Anomaly Scan - Target Scan",
    //               weekRange: {
    //                 start: 18,
    //                 end: 22,
    //               },
    //               default: true,
    //               global: true,
    //               hm_id: 0,
    //               patient_unique_id: 0,
    //               created_by: 0,
    //               created_at: "2024-12-09T03:51:53.027Z",
    //               deleted: false,
    //             },
    //             dueDate: null,
    //             notes: null,
    //           },
    //           {
    //             masterId: "91ab885f-2ea2-4f3b-84cd-145f3b9306b4",
    //             weekRange: {
    //               start: 20,
    //               end: 25,
    //             },
    //             status: "Due",
    //             enablePrint: false,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:01.552Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:01.552Z",
    //             master: {
    //               id: "91ab885f-2ea2-4f3b-84cd-145f3b9306b4",
    //               name: "Fetal Echo Scan",
    //               weekRange: {
    //                 start: 20,
    //                 end: 25,
    //               },
    //               default: true,
    //               global: true,
    //               hm_id: 0,
    //               patient_unique_id: 0,
    //               created_by: 0,
    //               created_at: "2024-12-09T03:52:07.398Z",
    //               deleted: false,
    //             },
    //             dueDate: null,
    //             notes: null,
    //           },
    //           {
    //             masterId: "d4a5ff74-1f2f-4b7a-a3b6-550176265b68",
    //             weekRange: {
    //               start: 28,
    //               end: 32,
    //             },
    //             status: "Due",
    //             enablePrint: false,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:01.552Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:01.552Z",
    //             master: {
    //               id: "d4a5ff74-1f2f-4b7a-a3b6-550176265b68",
    //               name: "Growth Scan with Fetal Doppler",
    //               weekRange: {
    //                 start: 28,
    //                 end: 32,
    //               },
    //               default: true,
    //               global: true,
    //               hm_id: 0,
    //               patient_unique_id: 0,
    //               created_by: 0,
    //               created_at: "2024-12-09T03:52:21.972Z",
    //               deleted: false,
    //             },
    //             dueDate: null,
    //             notes: null,
    //           },
    //         ],
    //         immunisationHistory: [
    //           {
    //             masterId: "c597fa61-efe5-48d2-8ba1-fcbc6c8a8ecc",
    //             status: "Given",
    //             enablePrint: true,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:13.175Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:17.307Z",
    //             master: {
    //               id: "c597fa61-efe5-48d2-8ba1-fcbc6c8a8ecc",
    //               name: "Td/TT",
    //               default: true,
    //               global: true,
    //               hm_id: 0,
    //               patient_unique_id: 0,
    //               created_by: 0,
    //               created_at: "2024-12-09T11:34:35.279Z",
    //               deleted: false,
    //             },
    //             givenDate: "2025-09-07T18:30:00.000Z",
    //             notes: null,
    //           },
    //           {
    //             masterId: "0edc95b2-5779-4131-bea9-48dba972f093",
    //             status: "Given",
    //             enablePrint: true,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:13.175Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:24.317Z",
    //             master: {
    //               id: "0edc95b2-5779-4131-bea9-48dba972f093",
    //               name: "Flu Vaccine",
    //               default: true,
    //               global: true,
    //               hm_id: 0,
    //               patient_unique_id: 0,
    //               created_by: 0,
    //               created_at: "2024-12-09T11:34:48.767Z",
    //               deleted: false,
    //             },
    //             givenDate: "2025-09-07T18:30:00.000Z",
    //             notes: "",
    //           },
    //           {
    //             masterId: "db45b934-b15f-4417-8f0d-40d39e83ddc1",
    //             status: "Due",
    //             enablePrint: false,
    //             createdBy: 524,
    //             createdAt: "2025-09-09T03:08:13.175Z",
    //             modifiedBy: 524,
    //             modifiedAt: "2025-09-09T03:08:13.175Z",
    //             master: {
    //               id: "db45b934-b15f-4417-8f0d-40d39e83ddc1",
    //               name: "Tdap",
    //               default: true,
    //               global: true,
    //               hm_id: 0,
    //               patient_unique_id: 0,
    //               created_by: 0,
    //               created_at: "2024-12-09T11:34:56.583Z",
    //               deleted: false,
    //             },
    //             givenDate: null,
    //             notes: null,
    //           },
    //         ],
    //         createdBy: 524,
    //         createdAt: "2025-09-09T03:08:24.394Z",
    //         modifiedBy: 524,
    //         modifiedAt: "2025-09-09T03:08:24.394Z",
    //       },
    //       pregnancyHistory: [
    //         {
    //           examinationHistory: [],
    //           ancHistory: [],
    //           immunisationHistory: [],
    //           createdBy: 524,
    //           createdAt: "2025-09-09T03:07:58.870Z",
    //           modifiedBy: 524,
    //           modifiedAt: "2025-09-09T03:07:58.870Z",
    //           termLength: "Term",
    //           outcome: "Still birth",
    //           deliveryMode: "FTND",
    //           typeOfDelivery: "date",
    //           dateOfDelivery: "2025-09-02T00:00:00.000Z",
    //           gender: "Male",
    //           babysWeight: 30,
    //           gravidity: 2,
    //         },
    //       ],
    //       createdAt: "2025-09-09T03:08:24.610Z",
    //       createdBy: 524,
    //       modifiedAt: "2025-09-09T03:08:24.610Z",
    //       modifiedBy: 524,
    //     }],
    //   },
    //   physicalExamination: {
    //     vitals: {
    //       pulse: 100,
    //       bloodPressure: 120,
    //       temperature: 95,
    //       spo2: 35,
    //       respiratoryRate: 111,
    //       weight: 80,
    //       height: 150,
    //       generalRBS: 120,
    //     },
    //     examination: {
    //       cvs: {
    //         value: 2,
    //         title: "Abnormal",
    //         notes: ""
    //       },
    //       breast_chest: {
    //         value: 1,
    //         title: "WNL",
    //         notes: ""
    //       },
    //       abdomen: {
    //         value: 1,
    //         title: "WNL",
    //         // notes: [
    //         //   {
    //         //     type: "paragraph",
    //         //     children: [
    //         //       {
    //         //         text: "Abdomen is missing",
    //         //       },
    //         //     ],
    //         //   },
    //         // ],
    //         notes: ""
    //       },
    //       neurological_psychosocial: {
    //         title: "",
    //         // notes: [
    //         //   {
    //         //     type: "paragraph",
    //         //     children: [
    //         //       {
    //         //         text: "",
    //         //       },
    //         //     ],
    //         //   },
    //         // ],
    //         notes: ""
    //       },
    //       back: {
    //         value: 1,
    //         title: "WNL",
    //         // notes: [
    //         //   {
    //         //     type: "paragraph",
    //         //     children: [
    //         //       {
    //         //         text: "All good",
    //         //       },
    //         //     ],
    //         //   },
    //         // ],
    //         notes: ""
    //       },
    //     },
    //     // others: [
    //     //   {
    //     //     type: "paragraph",
    //     //     children: [
    //     //       {
    //     //         text: "Others ",
    //     //       },
    //     //       {
    //     //         text: "data",
    //     //         bold: true,
    //     //       },
    //     //     ],
    //     //   },
    //     // ],
    //     others: "",
    //     // provisionalDiagnosis: [
    //     //   {
    //     //     type: "paragraph",
    //     //     children: [
    //     //       {
    //     //         text: "Provisional",
    //     //         bold: true,
    //     //       },
    //     //       {
    //     //         text: " Data",
    //     //       },
    //     //     ],
    //     //   },
    //     // ],
    //     provisionalDiagnosis: ""
    //   },
    //   functionalAssessment: {
    //     bedActivity: "Independent",
    //     sitting: "Independent",
    //     standing: "Needs Assistance",
    //     ambulation: "Needs Assistance",
    //     stairClimbing: "Dependent",
    //     bedSoreOnAdmission: false,
    //     // others: [
    //     //   {
    //     //     type: "paragraph",
    //     //     children: [
    //     //       {
    //     //         text: "Functional",
    //     //         bold: true,
    //     //       },
    //     //       {
    //     //         text: " others ",
    //     //       },
    //     //       {
    //     //         text: "data",
    //     //         bold: true,
    //     //       },
    //     //     ],
    //     //   },
    //     // ],
    //     others: "",
    //     referredToPhysiotherapyForReview: { id: 123, name: '' }
    //   },
    //   treatmentPlan: {
    //     // immediateManagement: [
    //     //   {
    //     //     type: "numbered-list",
    //     //     children: [
    //     //       {
    //     //         type: "list-item",
    //     //         children: [
    //     //           {
    //     //             text: "Immediate ",
    //     //           },
    //     //           {
    //     //             text: "management ",
    //     //             bold: true,
    //     //           },
    //     //           {
    //     //             text: "it is",
    //     //           },
    //     //         ],
    //     //       },
    //     //     ],
    //     //   },
    //     // ],
    //     // monitoringPlan: [
    //     //   {
    //     //     type: "bulleted-list",
    //     //     children: [
    //     //       {
    //     //         type: "list-item",
    //     //         children: [
    //     //           {
    //     //             text: "Monitoring ",
    //     //           },
    //     //           {
    //     //             text: "Plan",
    //     //             bold: true,
    //     //           },
    //     //         ],
    //     //       },
    //     //     ],
    //     //   },
    //     // ],
    //     monitoringPlan: "",
    //     immediateManagement: "",
    //   },
    //   additionalNotes: {
    //     // specialInstructions: [
    //     //   {
    //     //     type: "paragraph",
    //     //     children: [
    //     //       {
    //     //         text: "Special Instructions",
    //     //       },
    //     //     ],
    //     //   },
    //     //   {
    //     //     type: "paragraph",
    //     //     children: [
    //     //       {
    //     //         text: "- ",
    //     //       },
    //     //       {
    //     //         text: "Additional Notes",
    //     //         bold: true,
    //     //       },
    //     //     ],
    //     //   },
    //     // ],
    //     // dischargeCriteria: [
    //     //   {
    //     //     type: "paragraph",
    //     //     children: [
    //     //       {
    //     //         text: "Discharge ",
    //     //         bold: true,
    //     //       },
    //     //       {
    //     //         text: "Criteria",
    //     //         underline: true,
    //     //       },
    //     //     ],
    //     //   },
    //     // ],
    //     dischargeCriteria: "",
    //     specialInstructions: ""
    //   },
    //   customModule: [],
    // };
    console.log("INTEL ==> REQ DATA", reqData, patient_data);
    dispatch(
      updateAssessmentsData({
        data: reqData,
        patientId: patient_data?.details?.id,
      })
    ).then((res) => {
      dispatch(
        getAssessmentsData({
          patientId: parseInt(patient_data?.details?.id, 10),
        })
      );
    });
    navigate("/ipd/patient-details", {
      state: {
        isEditable: false,
      },
      replace: true,
    });
  };

  const renderBottomSection = () => {
    return (
      <div className="ipd-custom-module-container">
        <AddCustomModule />
      </div>
    );
  };

  const renderAllSections = () => {
    return (
      <div
        className={`ipd-assessments-form-container ${
          !isEditable ? "ipd-assessments-readable-container" : ""
        }`}
        style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
      >
        {assessments.length > 0
          ? assessments.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  return (
    <div className="afipd-assessments-form-container">
      <Suspense fallback={<>Loading ...</>}>
        {!isEditable ? (
          <div>{renderAllSections()}</div>
        ) : (
          <div
            className={`ipd-assessments-form-container ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
            style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
          >
            {open && modelData && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="assessment"
                mainCta={{
                  handler: onSaveAssessmentClick,
                  title: "Save Admission Assessment",
                }}
                items={modelData}
                renderSection={renderSections}
                onRequestClose={() => {
                  navigate(-1);
                  return setOpen(false);
                }}
                headerOffset={72}
                renderBottomSection={renderBottomSection}
              />
            )}
          </div>
        )}
      </Suspense>
      {showCustomisationDrawer && (
        <Drawer
          closeIcon={true}
          width={"70%"}
          placement="right"
          title="Customise Your Form"
          open={showCustomisationDrawer}
          onClose={() => setShowCustomisationDrawer(false)}
          extra={
            <>
              <Button
                type="button"
                onClick={handleDefaultClick}
                className="btn-41 btn text-underline"
                loading={false}
                disabled={false}
              >
                Default Settings
              </Button>
              <Button
                type="button"
                onClick={handleSaveCustomization}
                className="btn-41 btn px-4 btn-primary3"
                loading={false}
                disabled={false}
              >
                Save
              </Button>
            </>
          }
        >
          <Suspense fallback={<>Loading ...</>}>
            <Customization
              onModelChange={(e) => {
                setModelData(e);
              }}
              customModel={modelData}
            />
          </Suspense>
        </Drawer>
      )}
    </div>
  );
};

export default AssessmentsForm;
