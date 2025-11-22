import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setFindings } from "../../../redux/ipd/progressNotesSlice";
import { isEmptyRichText } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
import { voiceRx } from "../../../redux/ipd/ipdSlice";
import { defaultIcons as defaultAssetIcons } from "../../../assets/images/icons";
import { useLocation } from "react-router-dom";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const EMPTY_RICH_TEXT_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const Findings = (props) => {
  const { isEditable = true, shouldAutofill = false, sectionData } = props || {};
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const { findings, progressNotes } = useSelector((state) => state.progressNotes);
  const doctorId = patientDetails?.doctor?.id || null;
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const prevProgressNote = useMemo(() => {
    return progressNotes[progressNotes?.length - 1];
  }, [progressNotes]);
  const prevFindings = useMemo(() => {
    return prevProgressNote?.progressNotes?.findings;
  }, [prevProgressNote]);
  const hasfindingsInLastProgressNote = useMemo(() => {
    return (
      (!Array.isArray(prevFindings) &&
        typeof prevFindings === "string" &&
        !!prevFindings) ||
        (Array.isArray(prevFindings) &&
        !!prevFindings?.[0]?.children?.[0]?.text)
      // (Array.isArray(prevFindings) &&
      // prevFindings.some((item) =>
      //     item?.children?.some((child) =>
      //       child?.children?.some((grandChild) => !!grandChild?.text)
      //     )
      //   ))
    );
  }, [findings,prevFindings]);

  // Get current value callback
  const getCurrentValue = useCallback(() => {
    if (isEmptyRichText(findings)) {
      return EMPTY_RICH_TEXT_VALUE;
    }
    return Array.isArray(findings) && findings.length
      ? findings
      : EMPTY_RICH_TEXT_VALUE;
  }, [findings]);

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
    moduleName: "progressFindings",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue,
    onValueChange: useCallback(
      (data) => {
        dispatch(setFindings(data));
      },
      [dispatch]
    ),
  });

  const handleAutofill = (e) => {
    if (e?.[0] === "undo") {
      setAutoFillTextToAppend(e);
      return;
    }

    setAutoFillTextToAppend(prevFindings);
  };

  useEffect(() => {
    if (shouldAutofill) {
      handleAutofill();
    }
  }, [shouldAutofill]);

  const handleAIRecordingComplete = async (payload, callback) => {
    if (
      !(patientDetails?.details?.id || patientDetails?.details?.id) ||
      !(patientDetails?.admissionId || patientDetails?.admissionId)
    ) {
      callback?.();
      return;
    }
    const response = await dispatch(
      voiceRx({
        patientId:
          patientDetails?.details?.id || patientDetails?.details?.id,
        admissionId:
          patientDetails?.admissionId || patientDetails?.admissionId,
        schemaKey: "PROGRESS_NOTES.findings",
        audioFile: payload?.audioBlob,
        filename: payload?.filename,
        mimeType: payload?.mimeType,
        previousOutput: findings,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      const updatedData =
        response?.payload?.data?.rxDigitizationHistory?.[0]?.response
          ?.findings || [];
      if (!isEmptyRichText(updatedData)) {
        dispatch(setFindings(updatedData));
        // setAutoFillTextToAppend(updatedData);
        callback?.();
      } else {
        callback?.();
      }
    } else {
      callback?.();
    }
  };

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      showVoiceAI={
        isEditable &&
        (patientDetails?.details?.id || patientDetails?.details?.id) &&
        (patientDetails?.admissionId || patientDetails?.admissionId)
      }
      showMicrophone={true}
      voiceAiIcon={defaultAssetIcons.voiceAiIcon}
      onVoiceAIRecordingComplete={handleAIRecordingComplete}
      title="Findings (Systemic Examination)"
      width="100%"
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      showAutoFill={hasfindingsInLastProgressNote}
      autoFillTitle={
        hasfindingsInLastProgressNote
          ? `Autofill From Prev. Progress Notes (${new Date(
              prevProgressNote?.createdAt
            ).toLocaleDateString()}, ${new Date(
              prevProgressNote?.createdAt
            ).toLocaleTimeString()})`
          : "No previous progress notes available"
      }
      onAutoFill={handleAutofill}
      containerClass=""
      initialValue={
        findings?.length > 0
          ? findings
          : [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ]
      }
      onChange={(newValue) => {
        dispatch(setFindings(newValue));
      }}
      placeholder={"Enter findings if any"}
      showTempButtons={true}
      onSave={() => {}}
      onErase={() => {
        // Clear Redux state
        dispatch(setFindings(EMPTY_RICH_TEXT_VALUE));
        // Clear local UI state
        setAutoFillTextToAppend(["clear"]);
      }}
      onTemplate={refreshTemplates}
      onTemplateSelected={handleTemplateSelected}
      addTemplate={handleAddTemplate}
      updateTemplate={handleUpdateTemplate}
      onDeleteTemplateClicked={handleDeleteTemplate}
      loading={templatesLoading}
      templates={normalizedTemplates}
      templateType="entries"
      newAutoFillTextToAppend={autoFillTextToAppend}
      setNewAutoFillTextToAppend={setAutoFillTextToAppend}
      isDataPresent={!isEmptyRichText(findings)}
    />
  );
};

export default Findings;
