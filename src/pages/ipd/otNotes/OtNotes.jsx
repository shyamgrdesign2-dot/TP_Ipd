import React, { Suspense, useCallback, useEffect, useState } from "react";
import { IPD } from "../../../utils/locale.js";
import "../assessmentForm/styles.scss";
import "./styles.scss";
import { Button, Drawer, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createRemoteComponent } from "../../../shared/remoteComponents.js";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice.js";
import useIpdCustomModules from "../../../hooks/useIpdCustomModules";
import SurgeryDetails from "./SurgeryDetails";
import SurgeryTeam from "./SurgeryTeam";
import OperativeNotes from "./OperativeNotes";
import IntraOperativeNotes from "./IntraOperativeNotes";
import PostOperativeNotes from "./PostOperativeNotes";
import {
  getOtNotesData,
  resetOtNotesForm,
  setCurrentOtNoteId,
  setSingleOtNotesData,
  updateOtNotesData,
  setSurgeryProcedureName,
  setAnaesthesiaType,
  setSurgeryDate,
  setSurgeryStartTime,
  setSurgeryEndTime,
  setDiagnosis,
  setSurgeryTeam,
  setOperativeNotes,
  setIntraOperativeNotes,
  setPostOperativeNotes,
} from "../../../redux/ipd/otNotesSlice.js";
import BackConfirmationModal from "../../../components/BackConfirmationModal.js";
import FullPageLoader from "../../vaccination/components/Loader.js";
import dayjs from "dayjs";
import { errorMessage } from "../../../utils/utils.js";
import useOtNotesRequestData from "../../../hooks/useOtNotesRequestData.js";
import GlobalVoiceAI from "../components/GlobalVoiceAI.jsx";
import AgentAlexVoicePanel from "../components/AgentAlexVoicePanel.jsx";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice.js";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");

const OtNotes = (props) => {
  const { hideLayoutWithMenu = false, isEditable: isEditableProp = true } =
    props;
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    patient_data = {},
    patientDetails = {},
    isEditable: isEditableState = true,
    isNew = false,
    fromDischargeSummary = false,
    activeOtNoteId,
    fromTab,
  } = state || {};
  const isEditable = isEditableProp && isEditableState;
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showAutoFillLocal, setShowAutoFillLocal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoFillTitleLocal, setAutoFillTitleLocal] = useState("");
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const requiredSurgeryDetailsFields = [
    { key: "procedureName", label: "Surgery/Procedure Name" },
    { key: "surgeryDate", label: "Surgery Date" },
    { key: "surgeryStartTime", label: "Surgery Start Time" },
    { key: "surgeryEndTime", label: "Surgery End Time" },
  ];
  const { customization = {} } = useSelector((state) => state.ipd);
  const otNotesState = useSelector((state) => state.otNotes);
  const otNotesData = useSelector((state) => state.otNotes);
  const { otNotes = [] } = customization;
  const [modelData, setModelData] = useState(
    otNotes.length > 0 ? otNotes : IPD.DEFAULT_OT_NOTES_FORM_STRUCTURE
  );
  const { profile } = useSelector((state) => state.doctors);
  const [filledDate, setFilledDate] = useState(new Date());
  const [filledAtTime, setFilledAtTime] = useState(new Date());
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Morning");
  const customModuleFormType = IPD.CUSTOM_MODULE_FORM_TYPES.otNotes;
  

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

  const reqData = useOtNotesRequestData({
    filledDate,
    filledAtTime,
    otNotesState,
    serializeCustomModules,
    customModuleContents,
  });
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId: patientDetails?.details?.id,
    admissionId: patientDetails?.admissionId,
    isRichTextRequired: false,
  });

  const handleTimePeriodChange = (value) => {
    setSelectedTimePeriod(value);
  };

  useEffect(() => {
    dispatch(fetchFilters({ field: "ward" }));
  }, []);

  useEffect(() => {
    if (
      !patient_data ||
      !patientDetails?.details?.id ||
      !patientDetails?.admissionId
    ) {
      navigate(-1);
      return;
    }
  }, [patient_data, patientDetails?.details?.id, patientDetails?.admissionId]);

  useEffect(() => {
    if (otNotes.length > 0) {
      setModelData(sanitizeModelData(otNotes));
    }
  }, [otNotes]);

  // useEffect(() => {
  //   const { date, time } = otNotesState?.otNotesData || {};
  //   if (date && time) {
  //     setFilledDate(new Date(date));
  //     setFilledAtTime(new Date(time));
  //   }
  // }, [otNotesState?.otNotesData]);

  useEffect(() => {
    if (isNew) {
      dispatch(setCurrentOtNoteId(null));
    }
  }, [isNew]);

  useEffect(() => {
    dispatch(getCustomization({ doctorId: patientDetails?.doctor?.id }));

    // Only fetch OT Notes data if we have the required patient details
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        getOtNotesData({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      ).then((res) => {
        const activeId = activeOtNoteId || otNotesData.currentOtNoteId;
        if (activeId) {
          dispatch(setCurrentOtNoteId(activeId));
          dispatch(setSingleOtNotesData({ _id: activeId }));
        }
      });
    }
  }, [patientDetails?.details?.id, patientDetails?.admissionId]);

  useEffect(() => {
    const otNotesArray = Array.isArray(otNotesState?.otNotesData)
      ? otNotesState.otNotesData
      : [];

    const currentNote = otNotesArray.find(
      (note) => note._id === otNotesState.currentOtNoteId
    );

    hydrateFromSavedModules(currentNote?.otNotes?.customModules || []);
  }, [
    hydrateFromSavedModules,
    otNotesState?.currentOtNoteId,
    otNotesState?.otNotesData,
  ]);

  useEffect(() => {
    if (otNotesData?.otNotesData?.length > 0) {
      setShowAutoFillLocal(true);
      setAutoFillTitleLocal(
        `Autofill From Prev. OT Notes (${new Date(
          otNotesData?.otNotesData[
            otNotesData?.otNotesData?.length - 1
          ].createdAt
        ).toLocaleDateString()}, ${new Date(
          otNotesData?.otNotesData[
            otNotesData?.otNotesData?.length - 1
          ].createdAt
        ).toLocaleTimeString()})`
      );
    }
  }, [otNotesData?.otNotesData?.length]);

  const handleDefaultClick = () => {
    const defaultModules = [
      ...IPD.DEFAULT_OT_NOTES_FORM_STRUCTURE,
      ...defaultCustomModulesForCustomization,
    ];
    setModelData(defaultModules);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      otNotes: defaultModules,
    };
    dispatch(updateCustomization({ doctorId: patientDetails?.doctor?.id, customization: newData }));
  };

  const renderSections = (data) => {
    // Don't render if data is undefined or doesn't have required properties
    if (!data || !data.id) {
      return null;
    }

    if (isCustomModuleSection(data)) {
      return renderCustomModuleComponent(data);
    }

    return (
      <div className="ipd-otnotes-editable-section-container">
        {(() => {
          switch (data.id) {
            case "surgeryDetails":
              return (
                <SurgeryDetails
                  {...props}
                  sectionData={data}
                  patientDetails={patientDetails}
                />
              );
            case "surgeryTeam":
              return <SurgeryTeam {...props} sectionData={data} />;
            case "operativeNotes":
              return (
                <OperativeNotes
                  {...props}
                  sectionData={data}
                  patientDetails={patientDetails}
                />
              );
            case "intraOperativeNotes":
              return (
                <IntraOperativeNotes
                  {...props}
                  sectionData={data}
                  patientDetails={patientDetails}
                />
              );
            case "postOperativeNotes":
              return (
                <PostOperativeNotes
                  {...props}
                  sectionData={data}
                  patientDetails={patientDetails}
                />
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, otNotes: [...modelData] };
    dispatch(updateCustomization({ doctorId: patientDetails?.doctor?.id, customization: newData }));
  };

  const handleAIRecordingComplete = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "OT_NOTES",
        previousOutput: reqData,
        parseResponse: (response) => {
          if (response?.meta?.requestStatus !== "fulfilled") {
            return { data: null, success: false };
          }
          const updatedData =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.response ||
            {};
          const updatedNotes = updatedData?.otNotes || updatedData;
          return { data: updatedNotes, success: true };
        },
        onSuccess: (updatedNotes) => {
          if (!updatedNotes) return;
          if (updatedNotes?.surgeryDetails) {
            const sd = updatedNotes.surgeryDetails;
            if (sd.procedureName !== undefined)
              dispatch(setSurgeryProcedureName(sd.procedureName));
            if (sd.anaesthesiaType !== undefined)
              dispatch(setAnaesthesiaType(sd.anaesthesiaType));
            if (sd.surgeryDate !== undefined)
              dispatch(setSurgeryDate(sd.surgeryDate));
            if (sd.surgeryStartTime !== undefined)
              dispatch(setSurgeryStartTime(sd.surgeryStartTime));
            if (sd.surgeryEndTime !== undefined)
              dispatch(setSurgeryEndTime(sd.surgeryEndTime));
            if (sd.diagnosis !== undefined)
              dispatch(setDiagnosis(sd.diagnosis));
          }

          if (updatedNotes?.surgeryTeam) {
            const st = updatedNotes.surgeryTeam;
            Object.entries(st).forEach(([roleId, value]) => {
              dispatch(setSurgeryTeam({ roleId, value }));
            });
          }

          if (updatedNotes?.operativeNotes) {
            Object.entries(updatedNotes.operativeNotes).forEach(
              ([key, value]) => {
                dispatch(setOperativeNotes({ key, value }));
              }
            );
          }

          if (updatedNotes?.intraOperativeNotes) {
            const io = updatedNotes.intraOperativeNotes;
            ["complicationsSeverity", "specimensSent", "implantsUsed"].forEach(
              (key) => {
                if (io[key] !== undefined) {
                  dispatch(setIntraOperativeNotes({ key, value: io[key] }));
                }
              }
            );
            if (io.additionalUnits) {
              Object.entries(io.additionalUnits).forEach(([key, value]) => {
                dispatch(
                  setIntraOperativeNotes({
                    parentId: "additionalUnits",
                    key,
                    value,
                  })
                );
              });
            }
            ["estimatedBloodLoss", "swabCount", "fluidCount", "sutureType"].forEach(
              (key) => {
                if (io[key] !== undefined) {
                  dispatch(setIntraOperativeNotes({ key, value: io[key] }));
                }
              }
            );
          }

          if (updatedNotes?.postOperativeNotes) {
            const po = updatedNotes.postOperativeNotes;
            Object.entries(po).forEach(([key, value]) => {
              dispatch(setPostOperativeNotes({ key, value }));
            });
          }

          if (updatedNotes?.date) setFilledDate(new Date(updatedNotes.date));
          if (updatedNotes?.time) setFilledAtTime(new Date(updatedNotes.time));
        },
        callback,
        fallbackToTranscription: false,
      }),
    [dispatch, reqData, submitVoiceAiRecording]
  );

  const getMissingRequiredFields = () => {
    const { surgeryDetails = {} } = otNotesState || {};
    const isValueMissing = (value) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return true;
        return value.every((item) => {
          if (typeof item === "string") return !item.trim();
          if (item && typeof item === "object") return Object.keys(item).length === 0;
          return !item;
        });
      }
      if (typeof value === "string") return !value.trim();
      return value === undefined || value === null || value === "";
    };

    return requiredSurgeryDetailsFields
      .filter(({ key }) => {
        const value = surgeryDetails?.[key];
        return isValueMissing(value);
      })
      .map(({ label }) => label);
  };

  const onSaveOtNotesClick = async () => {
    const missingFields = getMissingRequiredFields();
    if (missingFields.length) {
      message.warning(`Please fill the required fields in Surgery Details`);
      return;
    }

    const response = await dispatch(
      updateOtNotesData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: otNotesState?.currentOtNoteId || null,
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
        dispatch(
          getOtNotesData({
            patientId: patientDetails?.details?.id,
            admissionId: patientDetails?.admissionId,
            _id: otNotesState.currentOtNoteId,
          })
        );
        if (fromDischargeSummary) {
          navigate(-1, {
            state: {
              patient_data,
              patientDetails,
              isEditable: true,
              activeTab: "dischargeSummary",
            },
            replace: true,
          });
          return;
        }
        navigate("/ipd/patient-details", {
          state: {
            isEditable: false,
            patient_data: patient_data,
            patientDetails,
            fromTab,
            activeTab: "otNotes",
          },
          replace: true,
        });
      } catch (error) {
        console.error("OT Notes update api failed:", error);
        setIsLoading(false);
      }
    } else {
      errorMessage(response?.error);
      // message.error("Failed to save OT Notes. Please try again.");
      setIsLoading(false);
    }
  };

  const renderBottomSection = () => (
    <>
      {/* {isVoiceAssistantOpen && <div className="agent-alex-voice-overlay" />}
      <div className="global-voice-ai-wrapper">
        {isVoiceAssistantOpen ? (
          <AgentAlexVoicePanel
            onSubmit={handleAIRecordingComplete}
            onClose={() => setIsVoiceAssistantOpen(false)}
          />
        ) : (
          <GlobalVoiceAI onClick={() => setIsVoiceAssistantOpen(true)} />
        )}
      </div> */}
      {renderCustomModulesFooter()}
    </>
  );

  const renderFilledBySection = () => {
    return (
      <div style={{ margin: "16px 24px 0" }}>
        <FilledByCard
          filledBy={profile?.um_name}
          role="Doctor"
          selectedDate={dayjs(filledDate)}
          selectedTime={dayjs(filledAtTime)}
          dateFormat="DD MMM YYYY"
          timeFormat="hh:mm A"
          selectedTimePeriod={selectedTimePeriod}
          timePeriodOptions={[
            { label: "Morning", value: "Morning" },
            { label: "Afternoon", value: "Afternoon" },
            { label: "Evening", value: "Evening" },
            { label: "Night", value: "Night" },
          ]}
          onDateChange={(date) => setFilledDate(date)}
          onTimeChange={(time) => setFilledAtTime(time)}
          onTimePeriodChange={handleTimePeriodChange}
          editable
          showTimePeriod={true}
        />
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
        {otNotes.length > 0
          ? otNotes.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  const onMenuItemClick = (activeId) => {
    console.log("INTEL ==> activeId", activeId);
  };

  if (isLoading) {
    return <FullPageLoader />;
  }
  // Early return if essential data is missing to prevent undefined errors
  if (!patientDetails && isEditable) {
    return <div>Loading patient details...</div>;
  }

  return (
    <div
      className={`afipd-otnotes-form-container ${
        isEditable ? "" : "ipd-otnotes-form-container-readonly"
      }`}
    >
      <Suspense
        fallback={
          <>
            <FullPageLoader />
          </>
        }
      >
        {!isEditable ? (
          <div>{renderAllSections()}</div>
        ) : (
          <div
            className={`ipd-generic-form-container ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
            style={{ "--backgroundColor": isEditable ? "#fff" : "#FFFFFF80" }}
          >
            {open &&
              modelData &&
              (!hideLayoutWithMenu ? (
                <LayoutWithMenu
                  onCustomiseClick={() => setShowCustomisationDrawer(true)}
                  key="otNotes"
                  title={"OT Notes"}
                  mainCta={{
                    handler: onSaveOtNotesClick,
                    title: "Save",
                  }}
                  showAutoFill={showAutoFillLocal && isNew}
                  autoFillTitle={autoFillTitleLocal}
                  onAutoFill={() => {
                    const prevOtNotesId =
                      otNotesData?.otNotesData[
                        otNotesData?.otNotesData?.length - 1
                      ]?._id;
                    setIsLoading(true);
                    if (prevOtNotesId) {
                      dispatch(setSingleOtNotesData({ _id: prevOtNotesId }));
                      setTimeout(() => {
                        setIsLoading(false);
                      }, 100);
                    }
                  }}
                  items={modelData}
                  renderSection={renderSections}
                  renderTopSection={renderFilledBySection}
                  onRequestClose={() => {
                    setIsBackModalOpen(true);
                  }}
                  headerOffset={72}
                  onMenuItemClick={onMenuItemClick}
                  renderBottomSection={renderBottomSection}
                />
              ) : otNotes.length > 0 ? (
                otNotes.map((item) => {
                  return renderSections(item);
                })
              ) : null)}
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
              activeTab: "otNotes",
              isEditable: false,
              fromTab,
            },
            replace: true,
          });
          dispatch(resetOtNotesForm());
          setOpen(false);
        }}
      />
    </div>
  );
};

export default OtNotes;
