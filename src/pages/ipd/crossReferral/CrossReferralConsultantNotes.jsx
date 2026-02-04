import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IPD } from "../../../utils/locale.js";
import "../assessmentForm/styles.scss";
import "./styles.scss";
import { Button, DatePicker, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createRemoteComponent } from "../../../shared/remoteComponents.js";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice.js";
import { useSelector } from "react-redux";
import {
  resetCrossReferralForm,
  setCurrentCrossReferralId,
  updateCrossReferralData,
} from "../../../redux/ipd/crossReferralSlice.js";
import BackConfirmationModal from "../../../components/BackConfirmationModal.js";
import {
  getCrossReferralData,
  setSingleCrossReferralData,
  setCrossReferralConsultantNoteDetails,
  setCrossReferralFormDetails,
} from "../../../redux/ipd/crossReferralSlice.js";
import ReferralInformation from "./ReferralInformation.jsx";
import ReferralInformationView from "./ReferralInformationView.jsx";
import { defaultIcons as newIcons } from "../../../assets/images/indices";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import { isEmptyRichText } from "../../../utils/utils";
import GlobalVoiceAI from "../components/GlobalVoiceAI.jsx";
import AgentAlexVoicePanel from "../components/AgentAlexVoicePanel.jsx";
import AgentAlexSnapRxPanel from "../components/AgentAlexSnapRxPanel.jsx";
import useCrossReferralRequestData from "../../../hooks/useCrossReferralRequestData.js";
import useIpdCustomModules from "../../../hooks/useIpdCustomModules.js";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

dayjs.extend(customParseFormat);

const CrossReferralConsultantNotes = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    patient_data,
    patientDetails,
    isEditable = true,
    fullData: { referralInformationData, id } = {},
    fromTab,
  } = state || {};
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [activeAssistantPanel, setActiveAssistantPanel] = useState(null);
  const [isMainCtaSubmitting, setIsMainCtaSubmitting] = useState(false);
  const mainCtaLockRef = useRef(false);
  const { customization = {} } = useSelector((state) => state.ipd);
  const crossReferralState = useSelector((state) => state.crossReferral);
  const { crossReferralFormDetails, selectedConsultantNoteId } = useSelector(
    (state) => state.crossReferral
  );
  const initialValue = useMemo(
    () =>
      crossReferralFormDetails?.consultantNotesData?.[
        selectedConsultantNoteId
      ] || {},
    [crossReferralFormDetails?.consultantNotesData, selectedConsultantNoteId]
  );
  const crossReferralData = useSelector((state) => state.crossReferral);
  const { crossReferral = [] } = customization;
  const [modelData, setModelData] = useState(
    crossReferral.length > 0
      ? crossReferral
      : IPD.DEFAULT_CROSS_REFERRAL_FORM_STRUCTURE
  );
  const customModuleFormType = IPD.CUSTOM_MODULE_FORM_TYPES.crossReferral;
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
    customizationKey: customModuleFormType,
    modelData,
    setModelData,
    admissionId: patientDetails?.admissionId,
    patientId: patientDetails?.details?.id,
    patientData: patient_data,
    isEditable,
  });
  const reqData = useCrossReferralRequestData({
    crossReferralFormDetails,
    customModuleContents,
    serializeCustomModules,
  });
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId: patientDetails?.details?.id,
    admissionId: patientDetails?.admissionId,
    isRichTextRequired: false,
  });

  useEffect(() => {
    if (
      id &&
      (!crossReferralFormDetails?.referralInformation?.referringTo ||
        !crossReferralFormDetails?.referralInformation?.referringDepartment)
    ) {
      dispatch(setCurrentCrossReferralId(id));
      dispatch(setSingleCrossReferralData({ _id: id }));
    }
  }, [
    id,
    crossReferralFormDetails?.referralInformation?.referringTo,
    crossReferralFormDetails?.referralInformation?.referringDepartment,
    crossReferralData,
  ]);

  useEffect(() => {
    if (crossReferral.length > 0) {
      setModelData(sanitizeModelData(crossReferral));
    }
  }, [crossReferral]);

  useEffect(() => {
    dispatch(getCustomization({ doctorId: patientDetails?.doctor?.id }));
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        getCrossReferralData({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      ).then((res) => {
        if (crossReferralData.currentCrossReferralId) {
          dispatch(
            setSingleCrossReferralData({
              _id: crossReferralData.currentCrossReferralId,
            })
          );
        }
      });
    }
  }, [patientDetails?.details?.id, patientDetails?.admissionId]);

  useEffect(() => {
    hydrateFromSavedModules(
      crossReferralState?.crossReferralFormDetails?.customModules || []
    );
  }, [
    crossReferralState?.crossReferralFormDetails?.customModules,
    hydrateFromSavedModules,
  ]);

  const handleAIRecordingComplete = useCallback(
    (fieldId, payload, callback) => {
      if (!fieldId) {
        callback?.();
        return;
      }
      submitVoiceAiRecording({
        payload,
        schemaKey: `CROSS_REFERRAL.consultantNotes.${fieldId}`,
        previousOutput: initialValue?.[fieldId],
        onSuccess: (updatedData) => {
          if (!isEmptyRichText(updatedData)) {
            dispatch(
              setCrossReferralConsultantNoteDetails({ [fieldId]: updatedData })
            );
          }
        },
        callback,
      });
    },
    [dispatch, initialValue, submitVoiceAiRecording]
  );

  const handleChange = (value, key) => {
    if (!isEditable) return;
    dispatch(setCrossReferralConsultantNoteDetails({ [key]: value }));
  };

  const handleDefaultClick = () => {
    const defaultModules = [
      ...IPD.DEFAULT_CROSS_REFERRAL_FORM_STRUCTURE,
      ...defaultCustomModulesForCustomization,
    ];
    setModelData(defaultModules);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      crossReferral: defaultModules,
    };
    dispatch(
      updateCustomization({
        doctorId: patientDetails?.doctor?.id,
        customization: newData,
      })
    );
  };

  const renderRichTextEditorSection = (data, showOnlyEditorToolbar = false) => {
    if (!isEditable && !crossReferralFormDetails?.[data?.id]) return null;
    if (showOnlyEditorToolbar) {
      return (
        <RichTextEditWrapper
          readOnly={!isEditable}
          showToolbar={isEditable}
          showActionBtns={isEditable}
          title={data?.title}
          width="100%"
          icon={newIcons[`${data?.id}Pc`]}
          showAutoFill={false}
          showVoiceAI={
            isEditable &&
            patientDetails?.details?.id &&
            patientDetails?.admissionId
          }
          showMicrophone={
            isEditable &&
            patientDetails?.details?.id &&
            patientDetails?.admissionId
          }
          voiceAiIcon={defaultIcons.voiceAiIcon}
          onVoiceAIRecordingComplete={(payload, callback) =>
            handleAIRecordingComplete(data?.id, payload, callback)
          }
          containerClass={
            !isEditable
              ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin"
              : "rich-text-editor-wrapper-bg"
          }
          onErase={() =>
            handleChange(
              [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ],
              data?.id
            )
          }
          onChange={(val) => handleChange(val, data?.id)}
          initialValue={
            initialValue?.[data?.id]
              ? initialValue?.[data?.id]
              : [
                  {
                    type: "paragraph",
                    children: [{ text: "" }],
                  },
                ]
          }
          placeholder={data?.placeholder}
        />
      );
    }
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={newIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={` ${
          !isEditable
            ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin"
            : "rich-text-editor-wrapper-bg"
        }`}
        showVoiceAI={
          isEditable &&
          patientDetails?.details?.id &&
          patientDetails?.admissionId
        }
        showMicrophone={true}
        voiceAiIcon={defaultIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={(payload, callback) =>
          handleAIRecordingComplete(data?.id, payload, callback)
        }
        onErase={() => {
          handleChange(
            [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
            data?.id
          );
        }}
        onChange={(val) => handleChange(val, data?.id)}
        initialValue={
          initialValue?.[data?.id]
            ? initialValue?.[data?.id]
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={data?.placeholder}
      />
    );
  };

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
            case "referralInformation":
              return (
                <ReferralInformationView
                  data={referralInformationData}
                  uniqueId={id}
                  isCollapsible={false}
                />
              );
            case "clinicalAssessment":
              return renderRichTextEditorSection(data, false);
            case "additionalRemarksAndFollowUp":
              return (
                <div className="ipd-crosref-consult-addremarks-container">
                  {data?.children.map((grandChildItem) => {
                    switch (grandChildItem?.id) {
                      case "additionalRemarks":
                        return renderRichTextEditorSection(
                          grandChildItem,
                          true
                        );
                      case "followUp":
                        const dateDisplayFormat = "D MMM YYYY";
                        const normalizeDate = (value) => {
                          if (!value) return "";
                          const formats = [
                            "D MMM YYYY",
                            "Do MMM YYYY",
                            "Do MMMM YYYY",
                            "D MMMM YYYY",
                            "D-M-YYYY",
                            "DD-MM-YYYY",
                            "D/M/YYYY",
                            "DD/MM/YYYY",
                            "YYYY-MM-DD",
                          ];
                          const parsed = dayjs(value, formats, true);
                          if (parsed.isValid())
                            return parsed.format(dateDisplayFormat);
                          const fallback = dayjs(value);
                          return fallback.isValid()
                            ? fallback.format(dateDisplayFormat)
                            : "";
                        };
                        const normalizedFollowUp = normalizeDate(
                          initialValue?.[grandChildItem?.id]
                        );
                        return (
                          <div className="cross-consult-add-follow-up">
                            <div className="otNotes-label">
                              {grandChildItem?.title}
                            </div>
                            <DatePicker
                              className="w-25 popinput inputheight41"
                              format={{
                                format: dateDisplayFormat,
                                type: "mask",
                              }}
                              value={
                                normalizedFollowUp
                                  ? dayjs(normalizedFollowUp, dateDisplayFormat)
                                  : null
                              }
                              placeholder={"dd/mm/yyyy"}
                              onChange={(date) =>
                                dispatch(
                                  setCrossReferralConsultantNoteDetails({
                                    [grandChildItem?.id]: date
                                      ? date.format(dateDisplayFormat)
                                      : "",
                                  })
                                )
                              }
                              suffixIcon={
                                <img
                                  src={defaultIcons.calendarPlainIcon}
                                  alt="calendar"
                                />
                              }
                              prefix={null}
                              allowClear
                              inputReadOnly
                            />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              );
            case "impression":
              return renderRichTextEditorSection(data, false);
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, crossReferral: [...modelData] };
    dispatch(
      updateCustomization({
        doctorId: patientDetails?.doctor?.id,
        customization: newData,
      })
    );
  };

  const handleDigitizationSuccess = useCallback(
    (digitizedData) => {
      const updatedReferral = digitizedData?.crossReferral || digitizedData;
      if (!updatedReferral) return;
      dispatch(setCrossReferralFormDetails(updatedReferral));
      const consultantNotesArr = updatedReferral.consultantNotes || [];
      if (
        Array.isArray(consultantNotesArr) &&
        consultantNotesArr[selectedConsultantNoteId]
      ) {
        dispatch(
          setCrossReferralConsultantNoteDetails(
            consultantNotesArr[selectedConsultantNoteId]
          )
        );
      }
    },
    [dispatch, selectedConsultantNoteId]
  );

  const onAddReferralClick = () => {
    dispatch(
      updateCrossReferralData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: crossReferralState?.currentCrossReferralId || null,
      })
    ).then((res) => {
      if (res?.payload?.error) {
        message.warning(
          `${res.payload.error} - ${
            res.payload.message?.split("must")?.[0]
          } missing`
        );
        return;
      }
      dispatch(
        getCrossReferralData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
          _id: crossReferralState.currentCrossReferralId,
        })
      );
      message.success("Cross Referral Consultant Notes Added Successfully");
      navigate("/ipd/patient-details", {
        state: {
          isEditable: false,
          patient_data: patient_data,
          patientDetails,
          activeTab: "crossReferral",
          fromTab,
        },
        replace: true,
      });
    });
  };

  const handleMainCtaClick = async (...args) => {
    if (mainCtaLockRef.current) return;
    mainCtaLockRef.current = true;
    setIsMainCtaSubmitting(true);
    try {
      const result = onAddReferralClick?.(...args);
      if (result && typeof result.then === "function") {
        await result;
      }
    } finally {
      mainCtaLockRef.current = false;
      setIsMainCtaSubmitting(false);
    }
  };

  const handleAIRecordingCompleteAgent = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "CROSS_REFERRAL",
        previousOutput: reqData,
        parseResponse: (response) => {
          if (response?.meta?.requestStatus !== "fulfilled") {
            return { data: null, success: false };
          }
          const updatedData =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.response || {};
          const updatedReferral = updatedData?.crossReferral || updatedData;
          return { data: updatedReferral, success: true };
        },
        onSuccess: handleDigitizationSuccess,
        callback,
        fallbackToTranscription: false,
      }),
    [handleDigitizationSuccess, reqData, submitVoiceAiRecording]
  );

  const renderBottomSection = () => {
    return (
      <>
        {activeAssistantPanel && <div className="agent-alex-voice-overlay" />}
        <div className="global-voice-ai-wrapper">
          {activeAssistantPanel === "voice" ? (
            <AgentAlexVoicePanel
              onSubmit={(payload, cb) =>
                handleAIRecordingCompleteAgent(payload, cb)
              }
              onClose={() => setActiveAssistantPanel(null)}
            />
          ) : activeAssistantPanel === "snaprx" ? (
            <AgentAlexSnapRxPanel
              onClose={() => setActiveAssistantPanel(null)}
              previousOutput={reqData}
              schemaKey="CROSS_REFERRAL"
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
  };

  const renderHeaderSection = () => {
    return (
      <div className="ipd-filled-by-card-container">
        {crossReferralState.currentCrossReferralFilledByDetails
          ?.createdByName && (
          <FilledByCard
            showBeing={
              !crossReferralState.currentCrossReferralFilledByDetails?.createdAt
            }
            filledBy={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdByName || ""
            }
            role={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdByRole || ""
            }
            showFilledOnDate={true}
            selectedDate={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdAt || ""
            }
          />
        )}
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
        {crossReferral.length > 0
          ? crossReferral.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  const onMenuItemClick = (activeId) => {
    console.log("INTEL ==> activeId", activeId);
  };

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
      <Suspense fallback={<>Loading ...</>}>
        {!isEditable ? (
          <div>{renderAllSections()}</div>
        ) : (
          <div
            className={`ipd-cross-ref-consult-form-container ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
          >
            {open && modelData && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="crossReferral"
                title={"Cross Referral"}
                mainCta={{
                  handler: handleMainCtaClick,
                  title: "Add Referral",
                  disabled: isMainCtaSubmitting,
                }}
                items={modelData}
                renderBottomSection={renderBottomSection}
                renderSection={renderSections}
                onRequestClose={() => {
                  setIsBackModalOpen(true);
                }}
                renderHeaderSection={renderHeaderSection}
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
              activeTab: "crossReferral",
              isEditable: false,
              fromTab,
            },
            replace: true,
          });
          dispatch(resetCrossReferralForm());
          setOpen(false);
        }}
      />
    </div>
  );
};

export default CrossReferralConsultantNotes;
