import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { IPD } from "../../../utils/locale.js";
import "../assessmentForm/styles.scss";
import "./styles.scss";
import { Button, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createRemoteComponent } from "../../../shared/remoteComponents.js";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice.js";
import { useSelector } from "react-redux";
import useIpdCustomModules from "../../../hooks/useIpdCustomModules";
import BackConfirmationModal from "../../../components/BackConfirmationModal.js";
import FullPageLoader from "../../vaccination/components/Loader.js";
import {
  getDischargeSummaryData,
  resetActualDischargeSummaryData,
  resetDischargeSummaryData,
  resetDischargeSummaryForm,
  setSurgeriesPerformed,
  setDischargeSummaryDataViaPatch,
  updateDischargeSummaryData,
} from "../../../redux/ipd/dischargeSummarySlice.js";
import { addDischargeDataToStore } from "../../../utils/dischargeDataMapper.js";
import { getPatientInformation } from "../../../utils/utils.js";
import PatientInformation from "./components/PatientInformation.jsx";
import DiagnosisAndSurgery from "./components/DiagnosisAndSurgery.jsx";
import PatientHistory from "./components/PatientHistory.jsx";
import PhysicalExamination from "../assessmentForm/PhysicalExamination.jsx";
import FunctionalAssessment from "../assessmentForm/FunctionalAssessment.jsx";
import CourseInHospital from "./components/CourseInHospital.jsx";
import DischargeNotes from "./components/DischargeNotes.jsx";
import DischargeAdvice from "./components/DischargeAdvice.jsx";
import FollowUp from "./components/FollowUp.jsx";
import PreparedBy from "./components/PreparedBy.jsx";
import {
  getLastPrescriptionDate,
  lastPrescriptionData,
} from "../../../redux/ipd/assessmentsFormSlice.js";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import DrawerWrapper from "../components/DrawerWrapper/DrawerWrapper.jsx";
import OtNotesTimeline from "../otNotes/OtNotesTimeline.jsx";
import { otNotesIcons } from "../../../assets/images/indices/index.js";
import {
  getOtNotesData,
  resetOtNotesForm,
} from "../../../redux/ipd/otNotesSlice.js";
import { errorMessage } from "../../../utils/utils.js";
import useDischargeSummaryRequestData from "../../../hooks/useDischargeSummaryRequestData.js";
import GlobalVoiceAI from "../components/GlobalVoiceAI.jsx";
import AgentAlexVoicePanel from "../components/AgentAlexVoicePanel.jsx";
import AgentAlexSnapRxPanel from "../components/AgentAlexSnapRxPanel.jsx";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");
const GenericCard = createRemoteComponent("GenericCard");
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const DischargeSummary = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    patient_data,
    patientDetails,
    isEditable = true,
    fromTab,
    isNew = false,
  } = state || {};
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId: patientDetails?.details?.id,
    admissionId: patientDetails?.admissionId,
    isRichTextRequired: false,
  });
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showAutoFillLocal, setShowAutoFillLocal] = useState(false);
  const [autoFillTitleLocal, setAutoFillTitleLocal] = useState("");
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [activeAssistantPanel, setActiveAssistantPanel] = useState(null);
  const [isMainCtaSubmitting, setIsMainCtaSubmitting] = useState(false);
  const mainCtaLockRef = useRef(false);
  const { customization = {} } = useSelector((state) => state.ipd);
  const assessmentData = useSelector((state) => state.assessment);
  const dischargeSummaryState = useSelector((state) => state.dischargeSummary);
  const prescriptionSlice = useSelector((state) => state.prescription);
  const obstetricSlice = useSelector((state) => state.obstetric);
  const { dischargeSummary = [] } = customization;
  const [modelData, setModelData] = useState(
    dischargeSummary.length > 0
      ? dischargeSummary
      : IPD.DEFAULT_DISCHARGE_SUMMARY_FORM_STRUCTURE
  );

  const [showPhysicalExaminationDrawer, setShowPhysicalExaminationDrawer] =
    useState(false);
  const [showFunctionalAssessmentDrawer, setShowFunctionalAssessmentDrawer] =
    useState(false);
  const otNotesData = useSelector((state) => state.otNotes);
  const [sectionData, setSectionData] = useState(null);
  const customModuleFormType = IPD.CUSTOM_MODULE_FORM_TYPES.dischargeSummary;

  const {
    customModuleContents,
    isCustomModuleSection,
    renderCustomModuleSection: renderCustomModuleComponent,
    renderCustomModulesFooter,
    hydrateFromSavedModules,
    serializeCustomModules,
    handleCustomModuleRenamed,
    handleCustomModuleDeleted,
    defaultCustomModulesForCustomization,
    sanitizeModelData
  } = useIpdCustomModules({
    formType: customModuleFormType,
    customizationKey: customModuleFormType,
    modelData,
    setModelData,
    admissionId: patientDetails?.admissionId,
    patientId: patientDetails?.details?.id,
    patientData: patient_data,
    isEditable,
  });
  const reqData = useDischargeSummaryRequestData({
    dischargeSummaryState,
    otNotesData,
    assessmentData,
    prescriptionSlice,
    obstetricSlice,
    serializeCustomModules,
    customModuleContents,
  });

  useEffect(() => {
    if (dischargeSummary.length > 0) {
      setModelData(sanitizeModelData(dischargeSummary));
    }
  }, [dischargeSummary]);

  useEffect(() => {
    if (otNotesData?.otNotesData && Array.isArray(otNotesData.otNotesData)) {
      const surgeryDetails = otNotesData.otNotesData.map((otNote) => {
        const surgeryInfo = otNote?.otNotes?.surgeryDetails || {};
        return {
          procedureName: Array.isArray(surgeryInfo.procedureName)
            ? surgeryInfo.procedureName.join(", ")
            : surgeryInfo.procedureName || "",
          surgeryDate: surgeryInfo.surgeryDate || "",
          otNoteId: otNote._id || null,
        };
      });

      if (surgeryDetails.length > 0) {
        dispatch(setSurgeriesPerformed(surgeryDetails));
      }
    }
  }, [otNotesData?.otNotesData]);

  useEffect(() => {
    if (
      patientDetails?.details?.id &&
      (!dischargeSummaryState?.actualDischargeSummaryData ||
        (dischargeSummaryState?.actualDischargeSummaryData &&
          !Object.keys(dischargeSummaryState.actualDischargeSummaryData)
            .length))
    )
      dispatch(
        getDischargeSummaryData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
        })
      )
        .then((res) => {
          if (res.payload && !res.error) {
            addDischargeDataToStore(res.payload, dispatch);
          }
        })
        .catch((error) => {
          console.error("Error fetching discharge summary data:", error);
        });
  }, []);

  useEffect(() => {
    if (isEditable)
      dispatch(
        getLastPrescriptionDate({
          patientId: patientDetails?.patient_unique_id,
        })
      ).then((res) => {
        if (res.payload) {
          dispatch(
            lastPrescriptionData({
              patientId: patientDetails?.patient_unique_id,
              caseId: res.payload?.caseId,
            })
          );
        }
      });
  }, []);

  // Auto-fill patient info in discharge summary from admission/patient details (existing behaviour)
  useEffect(() => {
    if (!patientDetails || !dischargeSummaryState?.actualDischargeSummaryData) return;
    const fromAdmission = getPatientInformation(patientDetails);
    const current = dischargeSummaryState?.dischargeSummaryData?.patientInformation || {};
    const merged = { ...current, ...fromAdmission };
    if (JSON.stringify(merged) !== JSON.stringify(current)) {
      dispatch(setDischargeSummaryDataViaPatch({ patientInformation: merged }));
    }
  }, [patientDetails, dischargeSummaryState?.actualDischargeSummaryData, dispatch]);

  useEffect(() => {
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        getOtNotesData({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      );
    }
  }, [patientDetails?.details?.id, patientDetails?.admissionId]);

  useEffect(() => {
    dispatch(getCustomization({ doctorId: patientDetails?.doctor?.id }));
  }, [patientDetails?.doctor?.id]);

  useEffect(() => {
    const savedModules =
      dischargeSummaryState?.dischargeSummaryData?.customModules ||
      dischargeSummaryState?.actualDischargeSummaryData?.customModules ||
      [];

    hydrateFromSavedModules(savedModules);
  }, [
    dischargeSummaryState?.actualDischargeSummaryData?.customModules,
    dischargeSummaryState?.dischargeSummaryData?.customModules,
    hydrateFromSavedModules,
  ]);

  const handleDefaultClick = () => {
    const defaultModules = [
      ...IPD.DEFAULT_DISCHARGE_SUMMARY_FORM_STRUCTURE,
      ...defaultCustomModulesForCustomization,
    ];
    setModelData(defaultModules);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      dischargeSummary: defaultModules,
    };
    dispatch(updateCustomization({ doctorId: patientDetails?.doctor?.id, customization: newData }));
  };

  const handleAddEditPhysicalExamination = (data) => {
    setSectionData(data);
    setShowPhysicalExaminationDrawer((prev) => !prev);
  };

  const handleAddEditFunctionalAssessment = (data) => {
    setSectionData(data);
    setShowFunctionalAssessmentDrawer((prev) => !prev);
  };

  const handleAddEditOtNotes = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    dispatch(resetOtNotesForm());
    navigate("/ipd/patient-details/ot-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        isNew: true,
        fromDischargeSummary: true,
        fromTab
      },
    });
  };

  const handleDigitizationSuccess = useCallback(
    (digitizedData) => {
      const updatedSummary = digitizedData?.dischargeSummary || digitizedData;
      if (updatedSummary) {
        dispatch(resetDischargeSummaryForm());
        addDischargeDataToStore(
          { dischargeSummary: updatedSummary },
          dispatch
        );
      }
    },
    [addDischargeDataToStore, dispatch]
  );

  const handleAIRecordingComplete = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "DISCHARGE_SUMMARY",
        previousOutput: reqData,
        parseResponse: (response) => {
          if (response?.meta?.requestStatus !== "fulfilled") {
            return { data: null, success: false };
          }
          const updatedData =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.response ||
            {};
          const updatedSummary = updatedData?.dischargeSummary || updatedData;
          return { data: updatedSummary, success: true };
        },
        onSuccess: handleDigitizationSuccess,
        callback,
        fallbackToTranscription: false,
      }),
    [handleDigitizationSuccess, reqData, submitVoiceAiRecording]
  );

  const renderSections = (data) => {
    if (!data || !data.id) {
      return null;
    }

    return (
      <div className="ipd-otnotes-editable-section-container">
        {(() => {
          
          if (isCustomModuleSection(data)) {
            return renderCustomModuleComponent(data);
          }
          
          switch (data.id) {
            case "patientInformation":
              return <PatientInformation {...props} sectionData={data} />;
            case "diagnosisAndSurgery":
              return <DiagnosisAndSurgery {...props} sectionData={data} />;
            case "patientHistory":
              return <PatientHistory {...props} sectionData={data} />;
            case "physicalExamination":
              return (
                <div
                  className="flex-column-gap-16"
                  key={`${JSON.stringify(
                    assessmentData?.physicalExaminationOthersData
                  )}-${JSON.stringify(
                    assessmentData?.physicalExaminationBasicData
                  )}-${JSON.stringify(assessmentData?.vitalsData)}`}
                >
                  <PhysicalExamination
                    isEditable={false}
                    {...props}
                    sectionData={data}
                    isDischargeSummary={true}
                    isCollapsible={true}
                  >
                    <div onClick={() => handleAddEditPhysicalExamination(data)}>
                      <GenericCard
                        icon={defaultIcons.editIcon}
                        title={"Add/Edit Physical Examination"}
                      />
                    </div>
                  </PhysicalExamination>
                </div>
              );
            case "functionalAssessment":
              return (
                <div
                  className="flex-column-gap-16"
                  key={JSON.stringify(assessmentData?.functionalAssessmentData)}
                >
                  <FunctionalAssessment
                    isEditable={false}
                    isCollapsible={true}
                    {...props}
                    sectionData={data}
                    hideBorder={true}
                    showAddEditButton={true}
                    onAddEditClick={() =>
                      handleAddEditFunctionalAssessment(data)
                    }
                  />
                </div>
              );
            case "courseInHospital":
              return (
                <CourseInHospital
                  {...props}
                  sectionData={data}
                  patientId={patientDetails?.details?.id}
                  admissionId={patientDetails?.admissionId}
                />
              );
            case "otNotes":
              return (
                <div className="flex-column-gap-16">
                  <CollapsibleWrapper
                    title={data?.title}
                    data-testid={data?.id}
                    icon={otNotesIcons[`${data?.id}PcDark`]}
                    collapsible={isEditable}
                    width={"100%"}
                    className={`collapsible-wrapper-class ${
                      isEditable ? "" : "collapsible-wrapper-class-readonly"
                    }`}
                    defaultOpen
                  >
                    <div className="flex-column-gap-16">
                      <OtNotesTimeline isLiteMode={true} />
                      <div onClick={handleAddEditOtNotes}>
                        <GenericCard
                          icon={defaultIcons.editIcon}
                          title={"Add New OT Notes"}
                        />
                      </div>
                    </div>
                  </CollapsibleWrapper>
                </div>
              );
            case "dischargeNotes":
              return (
                <DischargeNotes
                  {...props}
                  sectionData={data}
                  patientId={patientDetails?.details?.id}
                  admissionId={patientDetails?.admissionId}
                />
              );
            case "dischargeAdvice":
              return (
                <DischargeAdvice
                  {...props}
                  sectionData={data}
                  patientId={patientDetails?.details?.id}
                  admissionId={patientDetails?.admissionId}
                />
              );
            case "followUp":
              return (
                <FollowUp
                  {...props}
                  sectionData={data}
                  patientId={patientDetails?.details?.id}
                  admissionId={patientDetails?.admissionId}
                />
              );
            // case "preparedBy":
            //   return <PreparedBy {...props} sectionData={data} />;
            default:
              return <></>;
          }
        })()}
      </div>
    );
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, dischargeSummary: [...modelData] };
    dispatch(updateCustomization({ doctorId: patientDetails?.doctor?.id, customization: newData }));
  };

  const onSaveDischargeSummaryClick = async () => {
    const response = await dispatch(
      updateDischargeSummaryData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: dischargeSummaryState.dischargeSummaryData?._id || null,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      try {
        if (response?.payload?.error) {
          if (response.payload.message?.split("must")?.[0]) {
            message.warning(`Please fill all the fields before saving`);
          } else {
            message.warning(`Something went wrong, Please try again.`);
          }
          return;
        }
        dispatch(resetActualDischargeSummaryData());
        dispatch(resetDischargeSummaryData());
        navigate("/ipd/patient-details", {
          state: {
            isEditable: false,
            patient_data: patient_data,
            patientDetails,
            fromTab,
            activeTab: "dischargeSummary",
          },
          replace: true,
        });
      } catch (err) {
        errorMessage(response?.error);
      }
    } else {
      errorMessage(response?.error);
      // message.error("Failed to update discharge summary. Please try again.");
    }
  };

  const handleMainCtaClick = async (...args) => {
    if (mainCtaLockRef.current) return;
    mainCtaLockRef.current = true;
    setIsMainCtaSubmitting(true);
    try {
      const result = onSaveDischargeSummaryClick?.(...args);
      if (result && typeof result.then === "function") {
        await result;
      }
    } finally {
      mainCtaLockRef.current = false;
      setIsMainCtaSubmitting(false);
    }
  };

  const renderHeaderSection = () => {
    return (
      <div className="ipd-filled-by-card-container">
        {dischargeSummaryState.currentDischargeSummaryFilledByDetails
          ?.createdByName && (
          <FilledByCard
            showBeing={
              !dischargeSummaryState.currentDischargeSummaryFilledByDetails
                ?.createdAt
            }
            filledBy={
              dischargeSummaryState.currentDischargeSummaryFilledByDetails
                ?.createdByName || ""
            }
            role={
              dischargeSummaryState.currentDischargeSummaryFilledByDetails
                ?.createdByRole || ""
            }
            showFilledOnDate={true}
            selectedDate={
              dischargeSummaryState.currentDischargeSummaryFilledByDetails
                ?.createdAt || ""
            }
          />
        )}
        {/* TODO: INTEL - SHOW EDITABLE ONE INSTEAD OF THIS */}
      </div>
    );
  };

  const renderAllSections = () => {
    return (
      <div
        className={`ipd-generic-form-container ipd-otnotes-form-container ${
          !isEditable ? "ipd-assessments-readable-container" : ""
        }`}
      >
        {modelData?.length > 0
          ? modelData.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  const onMenuItemClick = (activeId) => {
    console.log("INTEL ==> activeId", activeId);
  };

  const renderBottomSection = () => (
    <>
      {activeAssistantPanel && <div className="agent-alex-voice-overlay" />}
      <div className="global-voice-ai-wrapper">
        {activeAssistantPanel === "voice" ? (
          <AgentAlexVoicePanel
            onSubmit={handleAIRecordingComplete}
            onClose={() => setActiveAssistantPanel(null)}
          />
        ) : activeAssistantPanel === "snaprx" ? (
          <AgentAlexSnapRxPanel
            onClose={() => setActiveAssistantPanel(null)}
            previousOutput={reqData}
            schemaKey="DISCHARGED_SUMMARY"
            onSuccess={handleDigitizationSuccess}
          />
        ) : (
          <GlobalVoiceAI
            onVoiceClick={() => setActiveAssistantPanel("voice")}
            onSnapRxClick={() => setActiveAssistantPanel("snaprx")}
          />
        )}
      </div>
      {renderCustomModulesFooter()}
    </>
  );

  if (
    !Object.keys(dischargeSummaryState?.actualDischargeSummaryData || {})
      ?.length
  ) {
    return <FullPageLoader />;
  }
  // Early return if essential data is missing to prevent undefined errors
  if (!patientDetails && isEditable) {
    return <FullPageLoader />;
  }

  return (
    <div
      className={`afipd-otnotes-form-container ${
        isEditable ? "" : "ipd-otnotes-form-container-readonly"
      }`}
    >
      <Suspense fallback={<>Loading ...</>}>
        {!isEditable ? (
          <div>{renderAllSections()}</div>
        ) : (
          <div
            className={`ipd-generic-form-container ipd-editable-discharge-summary-with-readonly-elements ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
            style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
          >
            {open && modelData?.length > 0 && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="dischargeSummary"
                title={"Discharge Summary"}
                mainCta={{
                  handler: handleMainCtaClick,
                  title: isMainCtaSubmitting ? "Saving..." : "Save",
                  disabled: isMainCtaSubmitting,
                }}
                items={modelData}
                renderSection={renderSections}
                onRequestClose={() => {
                  setIsBackModalOpen(true);
                }}
                renderHeaderSection={renderHeaderSection}
                renderBottomSection={renderBottomSection}
                headerOffset={72}
                onMenuItemClick={onMenuItemClick}
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
          onClose={() => {
            dispatch(
              updateCustomization({
                doctorId: patientDetails?.doctor?.id,
                customization: {
                  ...customization,
                  dischargeSummary: modelData,
                },
              })
            );
            return setShowCustomisationDrawer(false);
          }}
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
                onUpdateCustomModuleName={handleCustomModuleRenamed}
                onDeleteCustomModule={handleCustomModuleDeleted}
              />
            </div>
          </Suspense>
        </Drawer>
      )}
      <BackConfirmationModal
        isModalOpen={isBackModalOpen}
        onCancel={() => setIsBackModalOpen(false)}
        onConfirm={() => {
          setIsBackModalOpen(false);
          navigate(`/ipd/patient-details`, {
            state: {
              ...state,
              activeTab: "dischargeSummary",
              isEditable: false,
              fromTab,
            },
            replace: true,
          });
          dispatch(resetDischargeSummaryForm());
          setOpen(false);
        }}
      />
      {showPhysicalExaminationDrawer && (
        <DrawerWrapper
          width={"100%"}
          open={showPhysicalExaminationDrawer}
          onClose={handleAddEditPhysicalExamination}
          title="Physical Examination"
          saveButtonText="Save"
          onSave={handleAddEditPhysicalExamination}
        >
          <PhysicalExamination
            {...props}
            isEditable={true}
            sectionData={sectionData}
            showCollapsibleWrapper={false}
          />
        </DrawerWrapper>
      )}
      {showFunctionalAssessmentDrawer && (
        <DrawerWrapper
          width={"100%"}
          open={showFunctionalAssessmentDrawer}
          onClose={handleAddEditFunctionalAssessment}
          title="Functional Assessment"
          saveButtonText="Save"
          onSave={handleAddEditFunctionalAssessment}
        >
          <FunctionalAssessment
            showCollapsibleWrapper={false}
            {...props}
            isEditable={true}
            sectionData={sectionData}
          />
        </DrawerWrapper>
      )}
    </div>
  );
};

export default DischargeSummary;
