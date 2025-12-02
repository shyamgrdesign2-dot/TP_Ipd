import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IPD } from "../../../utils/locale";
import "../assessmentForm/styles.scss";
import "./styles.scss";
import { Button, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import {
  getProgressNotes,
  resetProgressNotes,
  setFindings,
  setVitals,
  updateProgressNotes,
  setChiefComplaint,
  setAdditionalRemarks,
  setCurrentProgressNote,
  setPhysicalExaminationBasicData,
} from "../../../redux/ipd/progressNotesSlice.js";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import useIpdCustomModules from "../../../hooks/useIpdCustomModules";
import { MESSAGE_KEY } from "../../../utils/constants";
import visitEnd from "../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../assets/images/close-visit.svg";
import alertIcon from "../../../assets/images/alertIcon.svg";

import Findings from "./Findings.jsx";
import AdditionalRemarks from "./AdditionalRemarks.jsx";
import ChiefComplaint from "./ChiefComplaint.jsx";
import Vitals from "./Vitals.jsx";
import BackConfirmationModal from "../../../components/BackConfirmationModal.js";
import FullPageLoader from "../../vaccination/components/Loader.js";
import { formatDateWithTime } from "../../../utils/utils.js";
import { isEmptyRichText } from "../../../components/PDFGenerator/index.js";
import PNExaminationSection from "../assessmentForm/PNExaminationSection.jsx";
import useProgressNotesRequestData from "../../../hooks/useProgressNotesRequestData";
import GlobalVoiceAI from "../components/GlobalVoiceAI";
import AgentAlexVoicePanel from "../components/AgentAlexVoicePanel";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const ProgressNotes = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    progressNotesData,
    patient_data,
    patientDetails,
    isEditable = true,
    fromTab,
  } = state || {};
  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails || {};
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId,
    admissionId,
  });

  // const { isEditable = true } = props; // Default patientId for testing

  const navigate = useNavigate();
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [filledDate, setFilledDate] = useState(new Date());
  const [filledAtTime, setFilledAtTime] = useState(new Date());
  const [shouldAutofill, setShouldAutofill] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  const customModuleFormType = IPD.CUSTOM_MODULE_FORM_TYPES.progressNotes;

  const mergeDateAndTime = useCallback((dateValue, timeValue) => {
    const dateMoment = dayjs(dateValue ?? new Date());
    const validDate = dateMoment.isValid() ? dateMoment : dayjs();

    const timeSource = timeValue ?? dateValue ?? new Date();
    const timeMoment = dayjs(timeSource);
    const validTime = timeMoment.isValid() ? timeMoment : dayjs();

    return validDate
      .set("hour", validTime.hour())
      .set("minute", validTime.minute())
      .set("second", validTime.second())
      .set("millisecond", validTime.millisecond())
      .toDate();
  }, []);

  const handleFilledDateChange = useCallback(
    (value) => {
      const merged = mergeDateAndTime(value, filledAtTime);
      setFilledDate(merged);
      setFilledAtTime(merged);
    },
    [mergeDateAndTime, filledAtTime]
  );

  const handleFilledTimeChange = useCallback(
    (value) => {
      const merged = mergeDateAndTime(filledDate, value);
      setFilledDate(merged);
      setFilledAtTime(merged);
    },
    [mergeDateAndTime, filledDate]
  );

  const {
    progressNotes,
    currentProgressNote,
    isUpdating,
    chiefComplaint,
    findings,
    vitals,
    additionalRemarks,
    physicalExaminationBasicData,
  } = useSelector((state) => state.progressNotes);

  const { customization = {} } = useSelector((state) => state.ipd);
  const { profile } = useSelector((state) => state.doctors);

  const { progressNotes: progressNotesCustomization = [] } = customization;
  const [modelData, setModelData] = useState(
    progressNotesCustomization.length > 0
      ? progressNotesCustomization
      : IPD.DEFAULT_PROGRESS_NOTES_FORM_STRUCTURE
  );

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
    admissionId,
    patientId,
    patientData: patient_data,
    isEditable,
  });

  useEffect(() => {
    if (progressNotesCustomization.length > 0) {
      setModelData(sanitizeModelData(progressNotesCustomization));
    }
  }, [progressNotesCustomization]);

  // Preload from navigation state when user clicked Edit from the timeline
  useEffect(() => {
    if (progressNotesData && progressNotesData.raw) {
      const raw = progressNotesData.raw;
      const pn = raw.progressNotes || {};
      dispatch(setCurrentProgressNote(raw));
      if (Array.isArray(pn.chiefComplaint))
        dispatch(setChiefComplaint(pn.chiefComplaint));
      if (Array.isArray(pn.findings)) dispatch(setFindings(pn.findings));
      if (pn.vitals && typeof pn.vitals === "object")
        dispatch(setVitals(pn.vitals));
      if (pn.examination && typeof pn.examination === "object")
        dispatch(setPhysicalExaminationBasicData(pn.examination));
      if (Array.isArray(pn.additionalRemarks))
        dispatch(setAdditionalRemarks(pn.additionalRemarks));
      if (pn.date) setFilledDate(new Date(pn.date));
      // prefer explicit time field, fallback to timestamp
      if (pn.time) setFilledAtTime(new Date(pn.time));
    }
  }, [progressNotesData, dispatch]);

  // If navigated directly (no state), ensure customization and fetch list for autofill/use
  useEffect(() => {
    dispatch(getCustomization({doctorId: patientDetails?.doctor?.id}));
    if (patientId && admissionId) {
      dispatch(getProgressNotes({ patientId, admissionId }));
    }
  }, [dispatch, patientId, admissionId]);

  useEffect(() => {
    hydrateFromSavedModules(
      currentProgressNote?.progressNotes?.customModules || []
    );
  }, [
    currentProgressNote?.progressNotes?.customModules,
    hydrateFromSavedModules,
  ]);

  // Load filledDate and filledAtTime from current note if it changes (kept, with minor fix)
  useEffect(() => {
    if (currentProgressNote && currentProgressNote.progressNotes) {
      if (currentProgressNote.progressNotes.date) {
        setFilledDate(new Date(currentProgressNote.progressNotes.date));
      }
      if (currentProgressNote.progressNotes.time) {
        setFilledAtTime(new Date(currentProgressNote.progressNotes.time));
      }
    }
  }, [currentProgressNote]);

  const isDataPresent = useMemo(() => {
    return (
      Object.values(vitals).some((item) => !!item) ||
      !isEmptyRichText(chiefComplaint) ||
      !isEmptyRichText(findings) ||
      !isEmptyRichText(additionalRemarks)
    );
  }, [vitals, chiefComplaint, findings, additionalRemarks]);

  const progressNotesRequestData = useProgressNotesRequestData({
    vitals,
    chiefComplaint,
    findings,
    physicalExaminationBasicData,
    additionalRemarks,
    filledDate,
    filledAtTime,
    customModuleContents,
    serializeCustomModules,
  });

  const handleAIRecordingComplete = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "PROGRESS_NOTES",
        previousOutput: progressNotesRequestData,
        parseResponse: (response) => {
          if (response?.meta?.requestStatus !== "fulfilled") {
            return { data: null, success: false };
          }
          const updatedData =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.response || {};
          const updatedNotes = updatedData?.progressNotes || updatedData;
          return { data: updatedNotes, success: true };
        },
        onSuccess: (updatedNotes) => {
          if (!updatedNotes) return;
          if (updatedNotes.vitals) dispatch(setVitals(updatedNotes.vitals));
          if (updatedNotes.chiefComplaint)
            dispatch(setChiefComplaint(updatedNotes.chiefComplaint));
          if (updatedNotes.findings)
            dispatch(setFindings(updatedNotes.findings));
          if (updatedNotes.additionalRemarks)
            dispatch(setAdditionalRemarks(updatedNotes.additionalRemarks));
          if (updatedNotes.examination)
            dispatch(setPhysicalExaminationBasicData(updatedNotes.examination));
          if (updatedNotes.date) setFilledDate(new Date(updatedNotes.date));
          if (updatedNotes.time) setFilledAtTime(new Date(updatedNotes.time));
        },
        callback,
        fallbackToTranscription: false,
      }),
    [
      dispatch,
      progressNotesRequestData,
      submitVoiceAiRecording,
    ]
  );

  const saveProgressNotes = async () => {
    try {
      // Validate that there's actual data to save
      const hasVitalsData =
        vitals &&
        Object.values(vitals).some(
          (value) => value !== null && value !== undefined && value !== ""
        );

      // Helper function to check if rich text editor data has meaningful content
      // Handles multiple structures:
      // 1. paragraph → text (existing structure)
      // 2. list-item → text (direct text children)
      // 3. list-item → paragraph → text (nested structure)
      // 4. numbered-list/bulleted-list → list-item → text/paragraph → text
      const hasRichTextContent = (data) => {
        if (!Array.isArray(data) || data.length === 0) return false;

        // Recursive function to check if a node has non-empty text content
        const hasTextInNode = (node) => {
          if (!node || typeof node !== "object") return false;

          // Check if node is a text node with non-empty text
          if (node.text !== undefined) {
            return typeof node.text === "string" && node.text.trim() !== "";
          }

          // If node has children, recursively check them
          if (node.children && Array.isArray(node.children)) {
            return node.children.some((child) => hasTextInNode(child));
          }

          return false;
        };

        // Check each top-level item
        return data.some((item) => {
          // Check if item has children
          if (item && item.children && Array.isArray(item.children)) {
            // Check if any child has text content (handles both direct text and nested structures)
            return item.children.some((child) => hasTextInNode(child));
          }
          
          // Also check if the item itself is a text node
          if (item && item.text !== undefined) {
            return typeof item.text === "string" && item.text.trim() !== "";
          }
          
          return false;
        });
      };

      const hasChiefComplaint =
        chiefComplaint &&
        chiefComplaint.length > 0 &&
        hasRichTextContent(chiefComplaint);
      const hasFindings =
        findings && findings.length > 0 && hasRichTextContent(findings);
      const hasAdditionalRemarks =
        additionalRemarks &&
        additionalRemarks.length > 0 &&
        hasRichTextContent(additionalRemarks);

      // Check if any field has meaningful data
      const hasAnyData =
        hasVitalsData ||
        hasChiefComplaint ||
        hasFindings ||
        hasAdditionalRemarks ||
        customModuleContents.length > 0;

      if (!hasAnyData) {
        message.open({
          key: MESSAGE_KEY,
          // type: "error",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={alertIcon} className="me-3" alt="Alert" />
              <div>
                <div className="title-common text-start fontroboto">
                  Please fill in at least one field before saving!
                </div>
              </div>
              <img
                src={imgCloseVisit}
                className="ms-3"
                onClick={() => message.destroy()}
                alt="Close"
              />
            </div>
          ),
          duration: 3,
        });
        return; // Exit early if no data
      }

      // Update existing note (requires _id). If none, try to use currentProgressNote or skip _id.
      const result = await dispatch(
        updateProgressNotes({
          patientId,
          admissionId,
          _id: currentProgressNote?._id || progressNotesData?._id,
          data: progressNotesRequestData,
        })
      );

      if (result.type.endsWith("fulfilled")) {
        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" alt="Success" />
              <div>
                <div className="title-common text-start fontroboto">
                  Progress Notes Saved Successfully!
                </div>
              </div>
              <img
                src={imgCloseVisit}
                className="ms-3"
                onClick={() => message.destroy()}
                alt="Close"
              />
            </div>
          ),
          duration: 3,
        });
        dispatch(resetProgressNotes());
      } else {
        console.error("Failed to update progress notes");
      }

      // Refresh the notes after saving
      await dispatch(getProgressNotes({ patientId, admissionId }));
      navigate(`/ipd/patient-details`, {
        replace: true,
        state: {
          patient_data,
          patientDetails,
          isEditable: false,
          fromTab,
          activeTab: "progress", // This will help identify which tab to show
        },
      });
    } catch (error) {
      console.error("Error saving progress notes:", error);
    }
  };

  const handleAutofillVitals = () => {
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes?.vitals) {
        dispatch(setVitals(latestNote.progressNotes.vitals));
        console.log("Autofilled Vitals:", latestNote.progressNotes.vitals);
      }
    }
  };

  const handleAutofillFindings = () => {
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes?.findings) {
        dispatch(setFindings(latestNote.progressNotes.findings));
        console.log("Autofilled Findings:", latestNote.progressNotes.findings);
      }
    }
  };

  const handleAutofillChiefComplaint = () => {
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes?.chiefComplaint) {
        dispatch(setChiefComplaint(latestNote.progressNotes.chiefComplaint));
        console.log(
          "Autofilled Chief Complaint:",
          latestNote.progressNotes.chiefComplaint
        );
      }
    }
  };

  const handleAutofillAdditionalRemarks = () => {
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes?.additionalRemarks) {
        dispatch(
          setAdditionalRemarks(latestNote.progressNotes.additionalRemarks)
        );
        console.log(
          "Autofilled Additional Remarks:",
          latestNote.progressNotes.additionalRemarks
        );
      }
    }
  };

  // Main autofill function that calls all individual autofill functions
  const handleAutofillAll = () => {
    console.log("handleAutofillAll called with progressNotes:", progressNotes);
    setShouldAutofill(true);
    if (progressNotes && progressNotes.length > 0) {
      const latestNote = progressNotes[progressNotes?.length - 1];
      if (latestNote.progressNotes) {
        console.log(
          "Dispatching Redux actions with data:",
          latestNote.progressNotes
        );

        // Call all individual autofill functions
        handleAutofillChiefComplaint();
        handleAutofillFindings();
        handleAutofillVitals();
        handleAutofillAdditionalRemarks();

        console.log(
          "Autofilled all sections from latest progress note:",
          latestNote.progressNotes
        );
      }
    } else {
      console.log("No previous progress notes found for autofill");
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
        case "chiefComplaint":
          return (
            <div className="ipd-pn-section-container">
              <ChiefComplaint
                {...props}
                sectionData={data}
                shouldAutofill={shouldAutofill}
              />
            </div>
          );
        case "findings":
          return (
            <div className="ipd-pn-section-container">
              <Findings
                {...props}
                sectionData={data}
                shouldAutofill={shouldAutofill}
              />
            </div>
          );
        case "vitals":
          return (
            <div className="ipd-pn-section-container">
              <Vitals
                {...props}
                sectionData={data}
                shouldAutofill={shouldAutofill}
              />
            </div>
          );
        case "examinations":
          return <PNExaminationSection {...props} sectionData={data} />;
        case "additionalRemarks":
          return (
            <div className="ipd-pn-section-container">
              <AdditionalRemarks
                {...props}
                sectionData={data}
                shouldAutofill={shouldAutofill}
              />
            </div>
          );
        default:
          return null;
      }
    },
    [
      props,
      shouldAutofill,
      isEditable,
      dispatch,
      isCustomModuleSection,
      renderCustomModuleComponent,
    ]
  );

  const renderBottomSection = () => (
    <>
      {isVoiceAssistantOpen && <div className="agent-alex-voice-overlay" />}
      <div className="global-voice-ai-wrapper">
        {isVoiceAssistantOpen ? (
          <AgentAlexVoicePanel
            onSubmit={handleAIRecordingComplete}
            onClose={() => setIsVoiceAssistantOpen(false)}
          />
        ) : (
          <GlobalVoiceAI onClick={() => setIsVoiceAssistantOpen(true)} />
        )}
      </div>
      {renderCustomModulesFooter()}
    </>
  );

  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Morning");
  const handleTimePeriodChange = useCallback((value) => {
    setSelectedTimePeriod(value);
  }, []);

  const renderFilledBySection = () => {
    return (
      <div style={{ margin: "16px 24px 0" }}>
        <FilledByCard
          filledBy={profile?.um_name}
          role="Doctor"
          selectedDate={filledDate ? dayjs(filledDate) : ""}
          selectedTime={dayjs(filledAtTime)}
          // showRole={false}
          dateFormat="DD MMM YYYY"
          timeFormat="hh:mm A"
          selectedTimePeriod={selectedTimePeriod}
          timePeriodOptions={[
            { label: "Morning", value: "Morning" },
            { label: "Afternoon", value: "Afternoon" },
            { label: "Evening", value: "Evening" },
            { label: "Night", value: "Night" },
          ]}
          onDateChange={handleFilledDateChange}
          onTimeChange={handleFilledTimeChange}
          onTimePeriodChange={handleTimePeriodChange}
          editable
          showTimePeriod={true}
        />
      </div>
    );
  };

  // const renderAllSections = () => {
  //   return (
  //     <div
  //       className={`ipd-generic-form-container ${
  //         !isEditable ? "ipd-assessments-readable-container" : ""
  //       }`}
  //       style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
  //     >
  //       {progressNotes.length > 0
  //         ? progressNotes.map((item) => {
  //             return renderSections(item);
  //           })
  //         : null}
  //     </div>
  //   );
  // };

  const handleDefaultClick = () => {
    const defaultModules = [
      ...IPD.DEFAULT_PROGRESS_NOTES_FORM_STRUCTURE,
      ...defaultCustomModulesForCustomization,
    ];
    setModelData(defaultModules);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      progressNotes: defaultModules,
    };
    dispatch(updateCustomization({ doctorId: patientDetails?.doctor?.id, customization: newData }));
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, progressNotes: [...modelData] };
    dispatch(updateCustomization({ doctorId: patientDetails?.doctor?.id, customization: newData }));
  };

  const handleBackConfirmation = () => {
    if (!patientDetails?.details?.id && !patientDetails?.admissionId) {
      setIsBackModalOpen(false);
      navigate(`/ipd/patient-details`, {
        state: { ...state, activeTab: "progress", isEditable: false, fromTab },
        replace: true,
      });
      setOpen(false);
    }
    try {
      // dispatch(
      //   getProgressNotes({
      //     patientId: patientDetails?.details?.id,
      //     admissionId: patientDetails?.admissionId,
      //   })
      // ).then((res) => {
      // addDataToStore(res.payload.assessment);
      dispatch(resetProgressNotes());
      navigate(`/ipd/patient-details`, {
        state: { ...state, activeTab: "progress", isEditable: false, fromTab },
        replace: true,
      });
      setIsBackModalOpen(false);
      setOpen(false);
      // });
    } catch (err) {
      console.error(err, "error");
      setIsBackModalOpen(false);
      setOpen(false);
    }
  };

  return (
    <div className="afipd-assessments-form-container afipd-progress-notes-form-container">
      <Suspense
        fallback={
          <>
            <FullPageLoader />
          </>
        }
      >
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
                title: isUpdating ? "Saving..." : "Save",
                handler: saveProgressNotes,
                disabled: isUpdating || !isDataPresent,
              }}
              items={modelData}
              renderSection={renderSections}
              // onRequestClose={() => {
              //   dispatch(resetProgressNotes());
              //   navigate(-1);
              //   return setOpen(false);
              // }}
              onRequestClose={() => {
                setIsBackModalOpen(true);
              }}
              headerOffset={72}
              renderTopSection={renderFilledBySection}
              renderBottomSection={renderBottomSection}
              showAutoFill={!!progressNotes?.length}
              autoFillTitle={
                progressNotes && progressNotes.length > 0
                  ? `Autofill From Prev. Progress Notes (${formatDateWithTime(
                      progressNotes[progressNotes?.length - 1].createdAt
                    )})`
                  : "No previous progress notes available"
              }
              onAutoFill={handleAutofillAll}
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
      <BackConfirmationModal
        isModalOpen={isBackModalOpen}
        onCancel={() => setIsBackModalOpen(false)}
        onConfirm={handleBackConfirmation}
      />
    </div>
  );
};

export default ProgressNotes;
