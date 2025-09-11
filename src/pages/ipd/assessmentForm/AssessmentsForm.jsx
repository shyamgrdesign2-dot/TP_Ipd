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
  getLastPrescriptionDate,
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
import { addObstetricDetails } from "../../../redux/obstetricSlice";
import CustomModule from "../../../components/CustomModule";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");

const AssessmentsForm = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data, patientDetails, isEditable = true } = state || {};

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const { obstetricDetails: allObstetricDetails } = useSelector(
    (state) => state.obstetric
  );
  const { customization = {} } = useSelector((state) => state.ipd);
  const { customModules } = useSelector((state) => state.customModules);
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

  const addDataToStore = (data) => {
    if (data) {
      // Chief Complaint
      dispatch(setChiefComplaint(data?.basicInfo?.chiefComplaint || []));

      // History of Present Illness
      dispatch(
        setHistoryOfPresentIllness(
          data?.basicInfo?.historyOfPresentIllness || []
        )
      );

      // Medication
      dispatch(setMedicationData(data?.basicInfo?.medications || []));

      // Lab Results
      dispatch(setLabResults(data?.basicInfo?.labResults || []));

      // Medical History
      dispatch(
        setMedicalHistoryData(data?.basicInfo?.pastMedicalHistory || [])
      );

      // Gynec History
      dispatch(setGynecHistoryData(data?.basicInfo?.gyneacHistory || []));

      // Obstetric History
      dispatch(addObstetricDetails(data?.basicInfo?.obstetricHistory || []));

      // Physical Examination Vitals Data
      dispatch(setVitalsData(data?.physicalExamination?.vitals || {}));

      // Physical Examination Provisional Diagnosis
      dispatch(
        setPhysicalExaminationProvisionalDiagnosisData(
          data?.physicalExamination?.provisionalDiagnosis || []
        )
      );

      // Physical Examination Others Data
      dispatch(
        setPhysicalExaminationOthersData(
          data?.physicalExamination?.others || []
        )
      );

      // Physical Examination Basic Data
      dispatch(
        setPhysicalExaminationBasicData(
          data?.physicalExamination?.examination || {}
        )
      );

      // Functional Assessment Data
      dispatch(setFunctionalAssessmentData(data?.functionalAssessment || {}));

      // Treatment Plan Data
      dispatch(setTreatmentPlanData(data?.treatmentPlan || {}));

      // Additional Notes Data
      dispatch(setAdditionalNotesData(data?.additionalNotes || {}));

      // Referred Doc For Review
      dispatch(
        setReferredDocForReview(
          data?.functionalAssessment?.referredToPhysiotherapyForReview || null
        )
      );
    }
  };

  useEffect(() => {
    // fetch assessments form from api
    if (
      isEditable &&
      patientDetails?.details?.id &&
      Object.keys(assessmentData?.assessmentsData || {}).length === 0
    ) {
      dispatch(
        getAssessmentsData({ patientId: patientDetails?.details?.id })
      ).then((res) => {
        addDataToStore(res.payload);
      });
    }
    dispatch(getCustomization());
    if (isEditable)
      dispatch(
        getLastPrescriptionDate({ patientId: patientDetails?.details?.id })
      ).then((res) => {
        if (res.payload) {
          dispatch(
            lastPrescriptionData({
              patientId: patientDetails?.details?.id,
              caseId: res.payload?.caseId,
            })
          );
        }
      });
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

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      assessments: IPD.DEFAULT_ASSESSMENTS_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const renderSections = (data) => {
    switch (data?.id) {
      case "basicInfo":
        return (
          <BasicInfo {...props} sectionData={data} isEditable={isEditable} />
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
        currentMedications: convertMedicationFormat(
          prescriptionData.medicationData
        ),
        medications: prescriptionData.medicationData,
        labResults: assessmentData.labResults,
        pastMedicalHistory: prescriptionData.medicalHistoryData,
        gyneacHistory: assessmentData.gynecHistoryData,
        obstetricHistory: allObstetricDetails,
      },
      physicalExamination: {
        vitals: assessmentData.vitalsData,
        examination: Object.entries(
          assessmentData.physicalExaminationBasicData || {}
        ).reduce((acc, [key, value]) => {
          acc[key] = {
            title: value?.title || "",
            notes: value?.notes || [],
            value: value?.value || null,
          };
          return acc;
        }, {}),
        others: assessmentData.physicalExaminationOthersData,
        provisionalDiagnosis:
          assessmentData.physicalExaminationProvisionalDiagnosisData,
      },
      functionalAssessment: assessmentData.functionalAssessmentData,
      treatmentPlan: assessmentData.treatmentPlanData,
      additionalNotes: assessmentData.additionalNotesData,
      customModule: [], // TODO: INTEL - HANDLE CUSTOM MODULE
    };
    dispatch(
      updateAssessmentsData({
        data: reqData,
        patientId: patientDetails?.details?.id,
      })
    ).then((res) => {
      if (!res.payload) return;
      addDataToStore(reqData);
      dispatch(
        getAssessmentsData({
          patientId: patientDetails?.details?.id,
        })
      );
      navigate("/ipd/patient-details", {
        state: {
          isEditable: false,
          patient_data: patient_data,
          patientDetails,
        },
        replace: true,
      });
    });
  };

  const renderBottomSection = () => {
    return (
      <div className="ipd-custom-module-container">
        {customModules?.map((customModule) => {
          return (
            <CustomModule module={customModule} patient_data={patient_data} />
          );
        })}
        <AddCustomModule />
      </div>
    );
  };

  const renderAllSections = () => {
    return (
      <div
        className={`ipd-generic-form-container ${
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
    <div className="afipd-generic-form-container">
      <Suspense fallback={<>Loading ...</>}>
        {!isEditable ? (
          <div>{renderAllSections()}</div>
        ) : (
          <div
            className={`ipd-generic-form-container ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
            style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
          >
            {open && modelData && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="assessment"
                title={"Admission Assessment"}
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
          className="customise-form-ipd-container"
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
            <div className="customise-form-ipd-container-inner">
              <Customization
                onModelChange={(e) => {
                  setModelData(e);
                }}
                customModel={modelData}
              />
            </div>
          </Suspense>
        </Drawer>
      )}
    </div>
  );
};

export default AssessmentsForm;
