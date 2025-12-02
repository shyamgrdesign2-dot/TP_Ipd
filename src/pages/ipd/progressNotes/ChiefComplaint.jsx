import React, { useMemo, useState, useEffect, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setChiefComplaint } from "../../../redux/ipd/progressNotesSlice";
import {
  convertTemplateDataToRichText,
  formatDateToShortMonthYear,
  isEmptyRichText,
} from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
import { defaultIcons as defaultAssetIcons } from "../../../assets/images/icons";
import { useLocation } from "react-router-dom";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const EMPTY_RICH_TEXT_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ChiefComplaint = (props) => {
  // You can pass props as needed, e.g., isEditable, initialValue, etc.
  const {
    isEditable = true,
    shouldAutofill = false,
    sectionData,
  } = props || {};
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const {
    chiefComplaint,
    lastPrescriptionDataForProgress,
    lastPrescriptionDate,
  } = useSelector((state) => state.progressNotes);
  const doctorId = patientDetails?.doctor?.id || null;
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId: patientDetails?.details?.id,
    admissionId: patientDetails?.admissionId,
  });

  const { progressNotes } = useSelector((state) => state.progressNotes);
  const prevProgressNote = useMemo(() => {
    return progressNotes[progressNotes?.length - 1];
  }, [progressNotes]);
  const prevChiefComplaint = useMemo(() => {
    return prevProgressNote?.progressNotes?.chiefComplaint;
  }, [prevProgressNote]);

  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [editorResetKey, setEditorResetKey] = useState(0);

  // Get current value callback
  const getCurrentValue = useCallback(() => {
    if (isEmptyRichText(chiefComplaint)) {
      return EMPTY_RICH_TEXT_VALUE;
    }
    return Array.isArray(chiefComplaint) && chiefComplaint.length
      ? chiefComplaint
      : EMPTY_RICH_TEXT_VALUE;
  }, [chiefComplaint]);

  // Use template management hook
  const {
    templates: normalizedTemplates,
    templatesLoading,
    handleTemplateSelected,
    handleAddTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    refreshTemplates,
  } = useTemplateManagement({
    moduleName: "progressChiefComplaint",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue,
    onValueChange: useCallback(
      (data) => {
        dispatch(setChiefComplaint(data));
      },
      [dispatch]
    ),
  });

  const handleAutoFill = (e) => {
    if (e?.[0] === "undo") {
      setAutoFillTextToAppend(e);
      return;
    }
    if (
      !Array.isArray(prevChiefComplaint) ||
      !prevChiefComplaint?.[0]?.children
    ) {
      const convertedData = convertTemplateDataToRichText(
        prevChiefComplaint,
        "symptoms"
      );
      setAutoFillTextToAppend(convertedData);
    } else {
      setAutoFillTextToAppend(prevChiefComplaint);
    }
  };

  const handleAutofill = (e) => {
    if (e?.[0] === "undo") {
      setAutoFillTextToAppend(e);
      return;
    }

    setAutoFillTextToAppend(prevChiefComplaint);
  };

  useEffect(() => {
    if (shouldAutofill) {
      handleAutofill();
    }
  }, [shouldAutofill]);

  const handleAIRecordingComplete = useCallback(
    (payload, callback) =>
      submitVoiceAiRecording({
        payload,
        schemaKey: "PROGRESS_NOTES.chiefComplaint",
        previousOutput: chiefComplaint,
        onSuccess: (updatedData) => {
          dispatch(setChiefComplaint(updatedData));
        },
        callback,
      }),
    [chiefComplaint, dispatch, submitVoiceAiRecording]
  );

  const hasChiefComplaintInLastProgressNote = useMemo(() => {
    return (
      (!Array.isArray(prevChiefComplaint) &&
        typeof prevChiefComplaint === "string" &&
        !!prevChiefComplaint) ||
      (Array.isArray(prevChiefComplaint) &&
        !!prevChiefComplaint?.[0]?.children?.[0]?.text)
    );
  }, [chiefComplaint, prevChiefComplaint]);

  if (!isEditable && !chiefComplaint?.length) return null;

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      templates={normalizedTemplates}
      templateType="entries"
      title={sectionData?.title}
      data-testid={sectionData?.id}
      width={isEditable ? "100%" : "fit-content"}
      key={`chief-complaint-editor-${editorResetKey}`}
      showVoiceAI={
        isEditable && patientDetails?.details?.id && patientDetails?.admissionId
      }
      showMicrophone={true}
      voiceAiIcon={defaultAssetIcons.voiceAiIcon}
      onVoiceAIRecordingComplete={handleAIRecordingComplete}
      initialValue={
        chiefComplaint?.length > 0
          ? chiefComplaint
          : [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ]
      }
      placeholder={
        "Enter chief complaint like patient's main symptoms or presenting problem"
      }
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      showAutoFill={isEditable && hasChiefComplaintInLastProgressNote}
      autoFillTitle={
        hasChiefComplaintInLastProgressNote
          ? `Autofill From Prev. Progress Notes (${new Date(
              prevProgressNote?.createdAt
            ).toLocaleDateString()}, ${new Date(
              prevProgressNote?.createdAt
            ).toLocaleTimeString()})`
          : "No previous profress notes available"
      }
      containerClass={`${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
      opdDate={
        prevProgressNote?.createdAt
          ? formatDateToShortMonthYear(prevProgressNote?.createdAt || "")
          : null
      }
      showTempButtons={true}
      onSave={() => {}}
      onErase={() => {
        // Clear Redux state
        dispatch(setChiefComplaint(EMPTY_RICH_TEXT_VALUE));
        // Clear local UI state
        setAutoFillTextToAppend(["clear"]);
        setEditorResetKey((prev) => prev + 1);
      }}
      onTemplate={refreshTemplates}
      onTemplateSelected={handleTemplateSelected}
      addTemplate={handleAddTemplate}
      updateTemplate={handleUpdateTemplate}
      onDeleteTemplateClicked={handleDeleteTemplate}
      loading={templatesLoading}
      onChange={(e) => dispatch(setChiefComplaint(e))}
      onAutoFill={handleAutoFill}
      newAutoFillTextToAppend={autoFillTextToAppend}
      setNewAutoFillTextToAppend={setAutoFillTextToAppend}
      isDataPresent={!isEmptyRichText(chiefComplaint)}
    />
  );
};

export default ChiefComplaint;
