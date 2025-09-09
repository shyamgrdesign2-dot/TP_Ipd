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
import { getAssessmentsData, lastPrescriptionData } from "../../../redux/ipd/assessmentsFormSlice";
import { getCustomization, setCustomization } from "../../../redux/ipd/ipdSlice";
import { getAllDoses, getMedicationTemplates } from "../../../redux/medicationSlice";
import { getExaminationTemplates } from "../../../redux/examinationSlice";
import { getDiagnosisTemplates } from "../../../redux/diagnosisSlice";
import { getSymptomsTemplates } from "../../../redux/symptomsSlice";
import { getInvestigationTemplates } from "../../../redux/investigationSlice";
import { getAdviceTemplates } from "../../../redux/adviceSlice";
import AddCustomModule from "../../../components/AddCustomModule";
import { useSelector } from "react-redux";
import { addOrderToAssessmentFormStructure, convertTemplateDataToRichText } from "../../../utils/utils";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");

const AssessmentsForm = (props) => {
  const { isEditable = true } = props;
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data } = state || {};
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const { templates: symptomsTemplates } = useSelector((state) => state.symptoms);
  const { templates: medicationTemplates } = useSelector((state) => state.medication);
  const { templates: examinationTemplates } = useSelector((state) => state.examination);
  const { templates: diagnosisTemplates } = useSelector((state) => state.diagnosis);
  const { templates: investigationTemplates } = useSelector((state) => state.investigation);
  const { templates: adviceTemplates } = useSelector((state) => state.advice);
  const [assessmentsFormItems, setAssessmentsFormItems] = useState([]);
  const [modelData, setModelData] = useState(IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE);

  const { customization = {} } = useSelector((state) => state.ipd);
  // const {  assessments : modelData = [] } = customization;

  useEffect(() => {
    // fetch assessments form from api
    dispatch(getAssessmentsData({ patientId: parseInt(patient_data?.details?.id, 10) }));
    dispatch(getCustomization());
    dispatch(lastPrescriptionData({patientId: parseInt(patient_data?.details?.id, 10), caseId: 37891 })); // TODO: INTEL - get from inpatient details (state)
  }, []);

  console.log('INTEL ', IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE)

  useEffect(() => {
    console.log(addOrderToAssessmentFormStructure(IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE))
  })

  useEffect(() => {
    // fetch all the templates available
    dispatch(getMedicationTemplates());
    dispatch(getAllDoses())
    dispatch(getExaminationTemplates());
    dispatch(getDiagnosisTemplates());
    dispatch(getSymptomsTemplates());
    dispatch(getInvestigationTemplates());
    dispatch(getAdviceTemplates());
  }, []);

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
  };

  const renderBottomSection = () => {
    return (
      <div className="ipd-custom-module-container">
        <AddCustomModule />
      </div>
    )
  }

  return (
    <div className="afipd-assessments-form-container">
      <Suspense fallback={<>Loading ...</>}>
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
            <Button
              type="button"
              onClick={handleSaveCustomization}
              className="btn-41 btn px-4 btn-primary3"
              loading={false}
              disabled={false}
            >
              Save
            </Button>
          }
        >
          <Suspense fallback={<>Loading ...</>}>
            <Customization
              onModelChange={(e) => {
                // const newData = {...customization, settings: {
                //   ...customization.settings,
                //   assessments: e
                // }}
                // dispatch(setCustomization(newData));
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
