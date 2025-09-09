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
import SurgeryDetails from "./SurgeryDetails.jsx";
import SurgeryTeam from "./SurgeryTeam.jsx";
import OperativeNotes from "./OperativeNotes.jsx";
import IntraOperativeNotes from "./IntraOperativeNotes.jsx";
import PostOperativeNotes from "./PostOperativeNotes.jsx";
import { getOtNotesData } from "../../../redux/ipd/otNotesSlice.js";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");

const OtNotes = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data, patientDetails, isEditable = true } = state || {};

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const { customization = {} } = useSelector((state) => state.ipd);
  const { customModules } = useSelector((state) => state.customModules);
  const otNotesData = useSelector((state) => state.otNotes);
  const { otNotes = [] } = customization;
  const [modelData, setModelData] = useState(
    otNotes.length > 0 ? otNotes : IPD.DEFAULT_OT_NOTES_FORM_STRUCTURE
  );

  useEffect(() => {
    if (otNotes.length > 0) {
      setModelData(otNotes);
    }
  }, [otNotes]);

  useEffect(() => {
    // fetch assessments form from api
    if (
      isEditable &&
      patientDetails?.details?.id &&
      Object.keys(otNotesData?.otNotesData || {}).length === 0
    ) {
      dispatch(getOtNotesData({ patientId: patientDetails?.details?.id })).then(
        (res) => {
          // addDataToStore(res.payload);
        }
      );
    }
    dispatch(getCustomization());
  }, []);

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_OT_NOTES_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      otNotes: IPD.DEFAULT_OT_NOTES_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const renderSections = (data) => {
    switch (data?.id) {
      case "surgeryDetails":
        return <SurgeryDetails {...props} sectionData={data} />;
      case "surgeryTeam":
        return <SurgeryTeam {...props} sectionData={data} />;
      case "operativeNotes":
        return <OperativeNotes {...props} sectionData={data} />;
      case "intraOperativeNotes":
        return <IntraOperativeNotes {...props} sectionData={data} />;
      case "postOperativeNotes":
        return <PostOperativeNotes {...props} sectionData={data} />;
      default:
        return null;
    }
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, otNotes: [...modelData] };
    dispatch(updateCustomization(newData));
  };

  const onSaveOtNotesClick = () => {
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
        {otNotes.length > 0
          ? otNotes.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  console.log('INTEL ==> otNotes', {open, modelData, otNotes})
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
                key="otNotes"
                title={"OT Notes"}
                mainCta={{
                  handler: onSaveOtNotesClick,
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

export default OtNotes;
