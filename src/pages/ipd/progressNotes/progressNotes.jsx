import React, { Suspense, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale";
import "../assessmentForm/styles.scss";
import { Button, Drawer } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice";
import AddCustomModule from "../../../components/AddCustomModule";
import { useSelector } from "react-redux";
import CustomModule from "../../../components/CustomModule";
import { getProgressNotesData } from "../../../redux/ipd/progressNotesSlice.js";
// import ChiefComplaint from "./ChiefComplaint.jsx";
import Vitals from "./Vitals.jsx";
import Findings from "./Findings.jsx";
import AdditionalRemarks from "./AdditionalRemarks.jsx";
import ChiefComplaint from "../assessmentForm/ChiefComplaint.jsx";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");

const ProgressNotes = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data, patientDetails, isEditable = true } = state || {};

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const { customization = {} } = useSelector((state) => state.ipd);
  const { customModules } = useSelector((state) => state.customModules);
  const progressNotesData = useSelector((state) => state.progressNotes);
  const { progressNotes = [] } = customization;
  const [modelData, setModelData] = useState(
    progressNotes.length > 0 ? progressNotes : IPD.DEFAULT_PROGRESS_NOTES_FORM_STRUCTURE
  );

  useEffect(() => {
    if (progressNotes.length > 0) {
      setModelData(progressNotes);
    }
  }, [progressNotes]);

  useEffect(() => {
    // fetch assessments form from api
    if (
      isEditable &&
      patientDetails?.details?.id &&
      Object.keys(progressNotesData?.progressNotesData || {}).length === 0
    ) {
      dispatch(getProgressNotesData({ patientId: patientDetails?.details?.id })).then(
        (res) => {
          // addDataToStore(res.payload);
        }
      );
    }
    dispatch(getCustomization());
  }, []);

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_PROGRESS_NOTES_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      progressNotes: IPD.DEFAULT_PROGRESS_NOTES_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const renderSections = (data) => {
    switch (data?.id) {
      case "chiefComplaint":
        return <ChiefComplaint {...props} sectionData={data} />;
      case "findings":
        return <Findings {...props} sectionData={data} />;
      case "vitals":
        return <Vitals {...props} sectionData={data} />;
      case "additionalRemarks":
        return <AdditionalRemarks {...props} sectionData={data} />;
      default:
        return null;
    }
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, progressNotes: [...modelData] };
    dispatch(updateCustomization(newData));
  };

  const onSaveProgressNotesClick = () => {
    // const reqData = {
    //   basicInfo: {
    //     chiefComplaint: assessmentData.chiefComplaint,
    //     historyOfPresentIllness: assessmentData.historyOfPresentIllness,
    //     currentMedications: convertMedicationFormat(
    //       prescriptionData.medicationData
    //     ),
    //     medications: prescriptionData.medicationData,
    //     labResults: assessmentData.labResults,
    //     pastMedicalHistory: prescriptionData.medicalHistoryData,
    //     gyneacHistory: assessmentData.gynecHistoryData,
    //     obstetricHistory: allObstetricDetails,
    //   },
    //   physicalExamination: {
    //     vitals: assessmentData.vitalsData,
    //     examination: Object.entries(
    //       assessmentData.physicalExaminationBasicData || {}
    //     ).reduce((acc, [key, value]) => {
    //       acc[key] = {
    //         title: value?.title || "",
    //         notes: value?.notes || [],
    //         value: value?.value || null,
    //       };
    //       return acc;
    //     }, {}),
    //     others: assessmentData.physicalExaminationOthersData,
    //     provisionalDiagnosis:
    //       assessmentData.physicalExaminationProvisionalDiagnosisData,
    //   },
    //   functionalAssessment: assessmentData.functionalAssessmentData,
    //   treatmentPlan: assessmentData.treatmentPlanData,
    //   additionalNotes: assessmentData.additionalNotesData,
    //   customModule: [], // TODO: INTEL - HANDLE CUSTOM MODULE
    // };
    // dispatch(
    //   updateAssessmentsData({
    //     data: reqData,
    //     patientId: patientDetails?.details?.id,
    //   })
    // ).then((res) => {
    //   if (!res.payload) return;
    //   addDataToStore(reqData);
    //   dispatch(
    //     getAssessmentsData({
    //       patientId: patientDetails?.details?.id,
    //     })
    //   );
    //   navigate("/ipd/patient-details", {
    //     state: {
    //       isEditable: false,
    //       patient_data: patient_data,
    //       patientDetails,
    //     },
    //     replace: true,
    //   });
    // });
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
        className={`ipd-assessments-form-container ${
          !isEditable ? "ipd-assessments-readable-container" : ""
        }`}
        style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
      >
        {progressNotes.length > 0
          ? progressNotes.map((item) => {
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
                key="progressNotes"
                title={"Progress Notes"}
                mainCta={{
                  handler: onSaveProgressNotesClick,
                  title: "Save",
                }}
                items={modelData}
                renderSection={renderSections}
                onRequestClose={() => {
                  navigate(-1);
                  return setOpen(false);
                }}
                headerOffset={72}
                // renderBottomSection={renderBottomSection}
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

export default ProgressNotes;
