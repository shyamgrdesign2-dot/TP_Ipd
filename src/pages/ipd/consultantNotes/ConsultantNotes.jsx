import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IPD } from "../../../utils/locale";
import "./styles.scss";
import MedicationsBox from "../../../components/MedicationsBox";
import { Button, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getConsultantNotes,
  updateConsultantNotes,
  placeZydusIpdOrderMedicineAndInvestigation,
  setVitals,
  setLabInvestigation,
  setClinicalAssessmentPlan,
  setFluidBalance,
  setAdditionalRemarks,
  setPhysicalExaminationBasicData,
  resetConsultantNotes,
} from "../../../redux/ipd/consultantNotesSlice";
import {
  setMedicationData,
  clearMedicationData,
} from "../../../redux/prescriptionSlice";
import InvestigationBox from "../../../components/InvestigationBox";
import Vitals from "../../ipd/consultantNotes/Vitals";
import ClinicalAssessment from "../../ipd/consultantNotes/ClinicalAssessment";
import AdditionalRemarks from "../../ipd/consultantNotes/AdditionalRemarks";
import dayjs from "dayjs";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import {
  updateCustomization,
  getCustomization,
} from "../../../redux/ipd/ipdSlice";
import { isMobile } from "react-device-detect";
import TabInvestigationBox from "../../../components/tab_design/TabInvestigationBox";
import { GB_NEW_IPD_ZYDUS, MESSAGE_KEY } from "../../../utils/constants";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { isZydus } from "../../../utils/utils";
import visitEnd from "../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../assets/images/close-visit.svg";
import ProgressSummary from "./ProgressSummary";
import AgentAlex from "./AgentAlex";
import { getProgressNotes } from "../../../redux/ipd/progressNotesSlice";
import FullPageLoader from "../../vaccination/components/Loader";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { isEmptyRichText } from "../../../components/PDFGenerator";
import MedicationBoxIpd from "../../../components/medicationBoxIpd";
import FluidBalanceSection from "../assessmentForm/FluidBalanceSection";
import CNExaminationSection from "../assessmentForm/CNExaminationSection";
import useIpdCustomModules from "../../../hooks/useIpdCustomModules";
import useConsultantNotesRequestData from "../../../hooks/useConsultantNotesRequestData";
import GlobalVoiceAI from "../components/GlobalVoiceAI";
import AgentAlexVoicePanel from "../components/AgentAlexVoicePanel";
import AgentAlexSnapRxPanel from "../components/AgentAlexSnapRxPanel";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";
dayjs.extend(customParseFormat);

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const DATE_FORMAT = "DD MMM YYYY";
const TIME_FORMAT = "hh:mm A";
const API_DATE_FORMAT = "YYYY-MM-DD";
const API_TIME_FORMAT = "HH:mm:ss";

const ConsultantNotes = (props) => {
  const { state } = useLocation();
  const { patient_data, patientDetails, fromTab } = state || {};
  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails;
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId,
    admissionId,
    isRichTextRequired: false,
  });

  const { isEditable = true } = props;
  const dispatch = useDispatch();
  const isNewIPDZydusAccessableFromGB = useFeatureIsOn(GB_NEW_IPD_ZYDUS);

  const {
    consultantNotes,
    currentConsultantNote,
    isUpdating,
    clinicalAssessmentPlan,
    vitals,
    additionalRemarks,
    fluidBalance,
    physicalExaminationBasicData,
  } = useSelector((state) => state.consultantNotes);
  const { medicationData } = useSelector((state) => state.prescription);
  const { customization = {} } = useSelector((state) => state.ipd);
  const { profile } = useSelector((state) => state.doctors);
  const { progressNotes, isFetched: isProgressNotesFetched } = useSelector(
    (state) => state.progressNotes
  );

  useEffect(() => {
    dispatch(getCustomization({ doctorId: patientDetails?.doctor?.id }));
  }, [dispatch, patientDetails]);

  const { consultationNotes: consultantNotesCustomization = [] } =
    customization;

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [isMainCtaSubmitting, setIsMainCtaSubmitting] = useState(false);
  const mainCtaLockRef = useRef(false);
  const [filledDate, setFilledDate] = useState(dayjs());
  const [filledAtTime, setFilledAtTime] = useState(dayjs());
  const [investigationData, setInvestigationData] = useState([]);
  const [shouldAutofill, setShouldAutofill] = useState(false);
  const [showAgentAlex, setShowAgentAlex] = useState(false);
  const [activeAssistantPanel, setActiveAssistantPanel] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Morning");
  const [modelData, setModelData] = useState(
    consultantNotesCustomization.length > 0
      ? consultantNotesCustomization
      : IPD.DEFAULT_CONSULTANT_NOTES_FORM_STRUCTURE
  );

  const customModuleFormType = IPD.CUSTOM_MODULE_FORM_TYPES.consultantNotes;

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
    sanitizeModelData,
  } = useIpdCustomModules({
    formType: customModuleFormType,
    customizationKey: "consultationNotes",
    modelData,
    setModelData,
    admissionId,
    patientId,
    patientData: patient_data,
    isEditable,
  });

  useEffect(() => {
    if (currentConsultantNote && currentConsultantNote.consultationNotes) {
      if (currentConsultantNote.consultationNotes.date) {
        setFilledDate(dayjs(currentConsultantNote.consultationNotes.date));
      }

      if (currentConsultantNote.consultationNotes.time) {
        setFilledAtTime(
          dayjs(currentConsultantNote.consultationNotes.time, API_TIME_FORMAT)
        );
      }
      if (currentConsultantNote.consultationNotes.labInvestigation) {
        setInvestigationData(
          currentConsultantNote.consultationNotes.labInvestigation?.map(
            (e) => ({
              investigation_name: e.name,
              note: e.notes,
              service_code: e.service_code,
            })
          ) || []
        );
      }
    }
  }, [currentConsultantNote]);

  useEffect(() => {
    if (consultantNotesCustomization.length > 0) {
      setModelData(sanitizeModelData(consultantNotesCustomization));
    }
  }, [consultantNotesCustomization]);

  useEffect(() => {
    if (patientId && admissionId) {
      if (!currentConsultantNote?._id) dispatch(clearMedicationData());
      dispatch(getConsultantNotes({ patientId, admissionId }));
    }
  }, [patientId, dispatch, admissionId]);

  useEffect(() => {
    hydrateFromSavedModules(
      currentConsultantNote?.consultationNotes?.customModules || []
    );
  }, [
    currentConsultantNote?.consultationNotes?.customModules,
    hydrateFromSavedModules,
  ]);

  useEffect(() => {
    if (!isProgressNotesFetched && patientId && admissionId) {
      dispatch(getProgressNotes({ patientId, admissionId }));
    }
  }, [dispatch, isProgressNotesFetched, patientId, admissionId]);

  const isDataPresent = useMemo(() => {
    return (
      !isEmptyRichText(clinicalAssessmentPlan) ||
      Object.values(vitals)?.some((item) => !!item) ||
      medicationData?.length > 0 ||
      investigationData?.length > 0 ||
      !isEmptyRichText(additionalRemarks) ||
      customModuleContents.some((module) => !isEmptyRichText(module.content))
    );
  }, [
    clinicalAssessmentPlan,
    vitals,
    medicationData,
    investigationData,
    additionalRemarks,
    customModuleContents,
  ]);

  const consultantNotesRequestData = useConsultantNotesRequestData({
    clinicalAssessmentPlan,
    vitals,
    medicationData,
    physicalExaminationBasicData,
    fluidBalance,
    investigationData,
    additionalRemarks,
    filledDate,
    filledAtTime,
    customModuleContents,
    serializeCustomModules,
  });

  const saveConsultantNotes = async () => {
    if (!isDataPresent) {
      message.warning("Please fill in at least one field before saving!");
      return;
    }

    const isEditingConsultantNote = !!currentConsultantNote?._id;

    try {
      const result = await dispatch(
        updateConsultantNotes({
          patientId,
          admissionId,
          _id: currentConsultantNote?._id,
          data: consultantNotesRequestData,
        })
      );

      if (result.type.endsWith("fulfilled")) {
        const medication = consultantNotesRequestData.medication || [];
        const labInvestigation = consultantNotesRequestData.labInvestigation || [];
        const consultationId = isEditingConsultantNote
          ? currentConsultantNote._id
          : result.payload?.result?.data?._id;

        if (
          isZydus() &&
          isNewIPDZydusAccessableFromGB &&
          consultationId &&
          (medication.length > 0 || labInvestigation.length > 0)
        ) {
          const orderResult = await dispatch(
            placeZydusIpdOrderMedicineAndInvestigation({
              patientId,
              admissionId,
              consultationId,
              isCreated: !isEditingConsultantNote,
              medication,
              labInvestigation,
            })
          );

          if (orderResult.type.endsWith("rejected")) {
            message.error(orderResult.payload);
          }
        }

        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" alt="Visit End" />
              <div>
                <div className="title-common text-start fontroboto">
                  Consultant Notes Saved Successfully!
                </div>
              </div>
              <img
                src={imgCloseVisit}
                className="ms-3"
                onClick={() => message.destroy()}
                alt="Close Visit"
              />
            </div>
          ),
          duration: 3,
        });
        await dispatch(resetConsultantNotes());
      } else {
        console.error("Failed to update consultant notes");
      }

      navigate(`/ipd/patient-details`, {
        replace: true,
        state: {
          patient_data,
          patientDetails,
          isEditable: false,
          activeTab: "consultantNotes",
          fromTab,
        },
      });
    } catch (error) {
      console.error("Error saving consultant notes:", error);
    }
  };

  const handleMainCtaClick = async (...args) => {
    if (mainCtaLockRef.current) return;
    mainCtaLockRef.current = true;
    setIsMainCtaSubmitting(true);
    try {
      const result = saveConsultantNotes?.(...args);
      if (result && typeof result.then === "function") {
        await result;
      }
    } finally {
      mainCtaLockRef.current = false;
      setIsMainCtaSubmitting(false);
    }
  };

  const latestNote = consultantNotes[0];

  const handleAutofillVitals = useCallback(() => {
    if (latestNote?.consultationNotes?.vitals) {
      dispatch(setVitals(latestNote?.consultationNotes?.vitals));
    }
  }, [latestNote, dispatch]);

  const handleAutofillMedication = useCallback(() => {
    if (latestNote?.consultationNotes?.medication) {
      dispatch(setMedicationData(latestNote?.consultationNotes?.medication));
    }
  }, [latestNote, dispatch]);

  const handleAutofillLabInvestigation = useCallback(() => {
    if (latestNote?.consultationNotes?.labInvestigation) {
      setInvestigationData(
        latestNote?.consultationNotes?.labInvestigation?.map((e) => ({
          investigation_name: e.name,
          note: e.notes,
          service_code: e.service_code,
        }))
      );
    }
  }, [latestNote, dispatch]);

  const handleAutofillAll = () => {
    setShouldAutofill(true);
    if (latestNote?.consultationNotes) {
      handleAutofillMedication();
      handleAutofillLabInvestigation();
    }
    setTimeout(() => {
      setShouldAutofill(false);
    }, 100);
  };

  const renderSections = useCallback(
    (data) => {
      if (isCustomModuleSection(data)) {
        return renderCustomModuleComponent(data);
      }

      switch (data?.id) {
        case "clinicalAssessmentPlan":
          return (
            <ClinicalAssessment
              {...props}
              sectionData={data}
              shouldAutofill={shouldAutofill}
              patientDetails={patientDetails}
            />
          );
        case "vitals":
          return (
            <Vitals
              {...props}
              sectionData={data}
              onAutofill={handleAutofillVitals}
            />
          );
        case "examinations":
          return (
            <CNExaminationSection
              isConsultantNotes={true}
              {...props}
              sectionData={data}
              patientDetails={patientDetails}
            />
          );
        case "fluidBalance":
          return <FluidBalanceSection {...props} sectionData={data} />;
        case "medication":
          return (
            <div className="ipdaf-box-container">
              {isMobile ? (
                <MedicationBoxIpd isEditable={isEditable} />
              ) : (
                <MedicationsBox isEditable={isEditable} isIpd={true} />
              )}
            </div>
          );
        case "labInvestigation":
          return (
            <div className="ipdaf-box-container">
              {isMobile ? (
                <TabInvestigationBox
                  investigationData={investigationData || []}
                  setInvestigationData={(data) => {
                    setInvestigationData(data);
                    dispatch(setLabInvestigation(data));
                  }}
                  diagnosisData={[]}
                />
              ) : (
                <InvestigationBox
                  onAutofill={handleAutofillLabInvestigation}
                  investigationData={investigationData || []}
                  setInvestigationData={(data) => {
                    setInvestigationData(data);
                    dispatch(setLabInvestigation(data));
                  }}
                  diagnosisData={[]}
                />
              )}
            </div>
          );
        case "additionalRemarks":
          return (
            <AdditionalRemarks
              {...props}
              sectionData={data}
              shouldAutofill={shouldAutofill}
              patientDetails={patientDetails}
            />
          );
        default:
          return null;
      }
    },
    [
      props,
      shouldAutofill,
      handleAutofillVitals,
      handleAutofillLabInvestigation,
      isEditable,
      medicationData,
      investigationData,
      dispatch,
      isCustomModuleSection,
      renderCustomModuleComponent,
    ]
  );

  const handleTimePeriodChange = (value) => {
    setSelectedTimePeriod(value);
  };

  const renderFilledBySection = () => {
    return (
      <div style={{ margin: "16px 24px 0" }}>
        <FilledByCard
          filledBy={profile?.um_name}
          role="Doctor"
          selectedDate={filledDate ? dayjs(filledDate, DATE_FORMAT) : ""}
          selectedTime={dayjs(filledAtTime, TIME_FORMAT)}
          dateFormat={DATE_FORMAT}
          timeFormat={TIME_FORMAT}
          selectedTimePeriod={selectedTimePeriod}
          timePeriodOptions={[
            { label: "Morning", value: "Morning" },
            { label: "Afternoon", value: "Afternoon" },
            { label: "Evening", value: "Evening" },
            { label: "Night", value: "Night" },
          ]}
          onDateChange={(date) => setFilledDate(date)}
          onTimeChange={(time) => {
            setFilledAtTime(time);
          }}
          onTimePeriodChange={handleTimePeriodChange}
          editable
          showTimePeriod={false}
        />
      </div>
    );
  };

  const handleDefaultClick = () => {
    const defaultModules = [
      ...IPD.DEFAULT_CONSULTANT_NOTES_FORM_STRUCTURE,
      ...defaultCustomModulesForCustomization,
    ];
    setModelData(defaultModules);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      consultationNotes: defaultModules,
    };
    dispatch(
      updateCustomization({
        doctorId: patientDetails?.doctor?.id,
        customization: newData,
      })
    );
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      consultationNotes: [...modelData],
    };
    dispatch(
      updateCustomization({
        doctorId: patientDetails?.doctor?.id,
        customization: newData,
      })
    );
  };

  const handleProgressSummaryClick = () => {
    setShowAgentAlex(true);
  };

  const handleAgentAlexClose = () => {
    setShowAgentAlex(false);
  };

  const showProgressSummary =
    !showAgentAlex && !activeAssistantPanel && progressNotes.length > 0;

  const handleDigitizationSuccess = useCallback(
    (digitizedData) => {
      const updatedNotes =
        digitizedData?.consultationNotes ||
        digitizedData?.consultantNotes ||
        digitizedData;
      if (!updatedNotes) return;
      if (updatedNotes.vitals) dispatch(setVitals(updatedNotes.vitals));
      if (updatedNotes.clinicalAssessmentPlan)
        dispatch(setClinicalAssessmentPlan(updatedNotes.clinicalAssessmentPlan));
      if (updatedNotes.medication) {
        dispatch(setMedicationData(updatedNotes.medication));
      }
      if (updatedNotes.labInvestigation) {
        const mappedInvestigations =
          updatedNotes.labInvestigation?.map((e) => ({
            investigation_name: e.name,
            note: e.notes,
            service_code: e.service_code,
          })) || [];
        setInvestigationData(mappedInvestigations);
        dispatch(setLabInvestigation(mappedInvestigations));
      }
      if (updatedNotes.additionalRemarks)
        dispatch(setAdditionalRemarks(updatedNotes.additionalRemarks));
      if (updatedNotes.examination)
        dispatch(setPhysicalExaminationBasicData(updatedNotes.examination));
      if (updatedNotes.fluidBalance)
        dispatch(setFluidBalance(updatedNotes.fluidBalance));
      if (updatedNotes.date) setFilledDate(dayjs(updatedNotes.date));
      if (updatedNotes.time)
        setFilledAtTime(dayjs(updatedNotes.time, API_TIME_FORMAT));
    },
    [dispatch]
  );

  const handleAIRecordingComplete = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "CONSULTANT_NOTES",
        previousOutput: consultantNotesRequestData,
        parseResponse: (response) => {
          if (response?.meta?.requestStatus !== "fulfilled") {
            return { data: null, success: false };
          }
          const updatedData =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.response ||
            {};
          const updatedNotes =
            updatedData?.consultationNotes ||
            updatedData?.consultantNotes ||
            updatedData;
          return { data: updatedNotes, success: true };
        },
        onSuccess: handleDigitizationSuccess,
        callback,
        fallbackToTranscription: false,
      }),
    [
      consultantNotesRequestData,
      handleDigitizationSuccess,
      submitVoiceAiRecording,
    ]
  );

  const renderBottomSection = () => (
    <>
      {activeAssistantPanel && <div className="agent-alex-voice-overlay" />}
      {showProgressSummary ? (
        <div className="floating-bottom-row">
          <div className="global-voice-ai-wrapper">
            {activeAssistantPanel === "voice" ? (
              <AgentAlexVoicePanel
                onSubmit={handleAIRecordingComplete}
                onClose={() => setActiveAssistantPanel(null)}
              />
            ) : activeAssistantPanel === "snaprx" ? (
              <AgentAlexSnapRxPanel
                onClose={() => setActiveAssistantPanel(null)}
                previousOutput={consultantNotesRequestData}
                schemaKey="CONSULTANT_NOTES"
                onSuccess={handleDigitizationSuccess}
              />
            ) : (
              <GlobalVoiceAI
                onVoiceClick={() => setActiveAssistantPanel("voice")}
                onSnapRxClick={() => setActiveAssistantPanel("snaprx")}
              />
            )}
          </div>
          <div className="progress-summary-wrapper">
            <ProgressSummary onClick={handleProgressSummaryClick} />
          </div>
        </div>
      ) : (
        <div className="global-voice-ai-wrapper">
          {activeAssistantPanel === "voice" ? (
            <AgentAlexVoicePanel
              onSubmit={handleAIRecordingComplete}
              onClose={() => setActiveAssistantPanel(null)}
            />
          ) : activeAssistantPanel === "snaprx" ? (
            <AgentAlexSnapRxPanel
              onClose={() => setActiveAssistantPanel(null)}
              previousOutput={consultantNotesRequestData}
              schemaKey="CONSULTANT_NOTES"
              onSuccess={handleDigitizationSuccess}
            />
          ) : (
            <GlobalVoiceAI
              onVoiceClick={() => setActiveAssistantPanel("voice")}
              onSnapRxClick={() => setActiveAssistantPanel("snaprx")}
            />
          )}
        </div>
      )}
      {renderCustomModulesFooter()}
    </>
  );

  const autoFillTitle = useMemo(() => {
    return latestNote
      ? `Autofill From Prev. Consultant Notes (${dayjs(
          latestNote?.consultationNotes?.date
        ).format(DATE_FORMAT)}, ${dayjs(
          latestNote?.consultationNotes?.time,
          API_TIME_FORMAT
        ).format(TIME_FORMAT)})`
      : "";
  }, [latestNote]);

  return (
    <div className="afipd-assessments-form-container">
      <Suspense
        fallback={
          <>
            <FullPageLoader />
          </>
        }
      >
        <div className={`ipd-assessments-form-container `}>
          {open && modelData && (
            <LayoutWithMenu
              onCustomiseClick={() => setShowCustomisationDrawer(true)}
              key="consult"
              items={modelData}
              onRequestClose={() => {
                dispatch(resetConsultantNotes());
                navigate(-1);
                return setOpen(false);
              }}
              headerOffset={72}
              title="Consultant Notes"
              renderSection={renderSections}
              renderTopSection={renderFilledBySection}
              renderBottomSection={renderBottomSection}
              showAutoFill={!!consultantNotes?.length}
              autoFillTitle={autoFillTitle}
              onAutoFill={handleAutofillAll}
              mainCta={{
                title: isUpdating ? "Saving..." : "Save",
                handler: handleMainCtaClick,
                disabled: isUpdating || isMainCtaSubmitting || !isDataPresent,
              }}
              isAuxPanelOpen={showAgentAlex}
              auxPanel={<AgentAlex onClose={handleAgentAlexClose} />}
            />
          )}
        </div>
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
                onUpdateCustomModuleName={handleCustomModuleRenamed}
                onDeleteCustomModule={handleCustomModuleDeleted}
              />
            </div>
          </Suspense>
        </Drawer>
      )}
    </div>
  );
};

export default React.memo(ConsultantNotes);
