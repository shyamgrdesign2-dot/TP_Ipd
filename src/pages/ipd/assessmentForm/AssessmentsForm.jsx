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
  setChiefComplaint,
  setGynecHistoryData,
  setHistoryOfPresentIllness,
  setLabResults,
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
  const { templates: symptomsTemplates } = useSelector(
    (state) => state.symptoms
  );
  const { templates: medicationTemplates } = useSelector(
    (state) => state.medication
  );
  const { templates: examinationTemplates } = useSelector(
    (state) => state.examination
  );
  const { templates: diagnosisTemplates } = useSelector(
    (state) => state.diagnosis
  );
  const { templates: investigationTemplates } = useSelector(
    (state) => state.investigation
  );
  const { templates: adviceTemplates } = useSelector((state) => state.advice);
  const [assessmentsFormItems, setAssessmentsFormItems] = useState([]);
  let { medicationData, pillupSwitch, medicalHistoryData } = useSelector(
    (state) => state.prescription
  );

  const { customization = {} } = useSelector((state) => state.ipd);
  const { chiefComplaint, labResults } = useSelector(
    (state) => state.assessment
  );
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

  // useEffect(() => {
  //   dispatch(
  //     setGynecHistoryData({
  //       lmp: "2025-09-02T00:00:00.000Z",
  //       ageAtMenarche: 8,
  //       cycle: "Irregular",
  //       intervalOfCycle: 31,
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
  //     })
  //   );
  //   dispatch(
  //     setLabResults([
  //       {
  //         date: "2025-08-17T07:07:04.318Z",
  //         inputs: [
  //           {
  //             reportName: "Complete Blood Count - CBC",
  //             testName: "Haemoglobin (Hb)",
  //             value: "23",
  //             units: "Gms/dL",
  //             arrowDirection: "up",
  //             refRange: {
  //               isConditional: true,
  //               ranges: [
  //                 {
  //                   gender: "MALE",
  //                   max: "17",
  //                   min: "13",
  //                   unit: "Gms/dL",
  //                   value: "",
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     ])
  //   );
  //   dispatch(
  //     setChiefComplaint([
  //       {
  //         type: "paragraph",
  //         children: [
  //           {
  //             text: "basic para",
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
  //                 text: "bullet points",
  //               },
  //             ],
  //           },
  //           {
  //             type: "list-item",
  //             children: [
  //               {
  //                 text: "second one",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         type: "paragraph",
  //         children: [
  //           {
  //             text: "",
  //           },
  //         ],
  //       },
  //     ])
  //   );
  //   dispatch(
  //     setMedicalHistoryData([
  //       {
  //         title: "Medical Condition ",
  //         notes: "",
  //         tags: [
  //           {
  //             title: "Hypertension",
  //             enable: "Y",
  //             medication: "",
  //             monthYear: "",
  //             newSince: "",
  //             notes: "2-3 ಲೀಟರ್ ನೀರು ಕುಡಿಯಬೇಕು",
  //             since: "",
  //             status: "Active",
  //           },
  //           {
  //             title: "Prediabetes",
  //             enable: "Y",
  //             medication: "",
  //             monthYear: "",
  //             newSince: "",
  //             notes: "",
  //             since: "",
  //             status: "",
  //           },
  //         ],
  //       },
  //       {
  //         title: "Allergies",
  //         notes: "",
  //         tags: [],
  //       },
  //       {
  //         title: "Family History",
  //         notes: "",
  //         tags: [],
  //       },
  //       {
  //         title: "Lifestyle",
  //         notes: "",
  //         tags: [],
  //       },
  //     ])
  //   );
  //   dispatch(
  //     setMedicationData([
  //       {
  //         tmm_id: "52709",
  //         tmm_medicine_name: "A Tret 10mg Capsule",
  //         tmm_generic: "Acitretin (10mg)",
  //         tmm_company: "Kaizen Pharmaceuticals Pvt Ltd",
  //         tmm_type: "6",
  //         tmm_days: "",
  //         tmm_duration_type: "",
  //         tmm_dosage: "",
  //         tmm_unit: 6,
  //         tmu_id: 6,
  //         tcm_tmm_freq_morning: "1",
  //         tcm_tmm_freq_afternoon: "1",
  //         tcm_tmm_freq_evening: "1",
  //         tcm_tmm_freq_night: "0",
  //         tmm_time: "6",
  //         tmm_remarks: "",
  //         tmm_freq_type: "2",
  //         tmf_block: 0,
  //         other_tmu_id: "5,2",
  //         medicineUnit: [
  //           {
  //             tmu_id: 2,
  //             tmu_title: "Tablets",
  //           },
  //           {
  //             tmu_id: 5,
  //             tmu_title: "units",
  //           },
  //           {
  //             tmu_id: 6,
  //             tmu_title: "Capsule",
  //           },
  //         ],
  //         tcm_tmr_type: "M",
  //         pms_default: 1,
  //         objectID: "1fb2b44ee909ef_dashboard_generated_id",
  //         tmm_freq_type_name: "1 - 1 - 1 - 0",
  //         tmf_block_val: "0",
  //         tmm_time_name: "None",
  //         tmm_days_duration_type: "",
  //         unique_id: "b8d9f6e0-187d-41f2-a6a6-1f5feacbe6d8",
  //         tmm_dosage_unit_name: "",
  //         tmm_unit_name: "Capsule",
  //       },
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
  //         unique_id: "1ec9a730-9f50-4747-b53b-40e448b52bc7",
  //         tmm_dosage_unit_name: "",
  //         tmm_unit_name: "Tablets",
  //       },
  //       {
  //         tmm_id: "38565",
  //         tmm_medicine_name: "A Trax 250mg Injection",
  //         tmm_generic: "Ceftriaxone (250mg)",
  //         tmm_company: "Abron Healthcare",
  //         tmm_type: "1",
  //         tmm_days: "",
  //         tmm_duration_type: "to be continued",
  //         tmm_dosage: "",
  //         tmm_unit: 5,
  //         tmu_id: 5,
  //         tcm_tmm_freq_morning: "0",
  //         tcm_tmm_freq_afternoon: "0",
  //         tcm_tmm_freq_evening: "1",
  //         tcm_tmm_freq_night: "0",
  //         tmm_time: "5",
  //         tmm_remarks: "",
  //         tmm_freq_type: "2",
  //         tmf_block: 0,
  //         other_tmu_id: "5,4,3",
  //         medicineUnit: [
  //           {
  //             tmu_id: 1,
  //             tmu_title: "Amplues",
  //           },
  //           {
  //             tmu_id: 3,
  //             tmu_title: "mg",
  //           },
  //           {
  //             tmu_id: 4,
  //             tmu_title: "ml",
  //           },
  //           {
  //             tmu_id: 5,
  //             tmu_title: "units",
  //           },
  //         ],
  //         tcm_tmr_type: "M",
  //         pms_default: 1,
  //         objectID: "1bedf3ee311491_dashboard_generated_id",
  //         tmm_freq_type_name: "0 -0 -1 - 0",
  //         tmf_block_val: "0",
  //         tmm_time_name: "Before Breakfast",
  //         tmm_days_duration_type: "to be continued",
  //         unique_id: "d7a1a786-2dd8-454d-aa60-4906bb22092a",
  //         tmm_dosage_unit_name: "",
  //         tmm_unit_name: "units",
  //       },
  //     ])
  //   );
  //   dispatch(
  //     setHistoryOfPresentIllness([
  //       {
  //         type: "paragraph",
  //         children: [
  //           {
  //             text: "basic para",
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
  //                 text: "bullet points",
  //               },
  //             ],
  //           },
  //           {
  //             type: "list-item",
  //             children: [
  //               {
  //                 text: "second one",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         type: "paragraph",
  //         children: [
  //           {
  //             text: "",
  //           },
  //         ],
  //       },
  //     ])
  //   );
  // }, []);

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE)
    setShowCustomisationDrawer(false);
    const newData = { ...customization, assessments: IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE };
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
    // navigate(-1);
    
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
