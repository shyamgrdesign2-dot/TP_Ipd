import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as defaultAssetIcons } from "../../../assets/images/icons";
import { defaultIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch, useSelector } from "react-redux";
import { setChiefComplaint } from "../../../redux/ipd/assessmentsFormSlice";
import {
  convertTemplateDataToRichText,
  formatDateToShortMonthYear,
  isEmptyRichText,
} from "../../../utils/utils";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";
import { useDischargeSummaryData } from "../dischargeSummary/utils/useDischargeSummaryData";
import { useLocation } from "react-router-dom";
// import { errorMessage } from "../../../utils/toast";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const EMPTY_RICH_TEXT_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ChiefComplaint = (props) => {
  const {
    isEditable = true,
    sectionData,
    hideBorder = false,
    children,
    isDischargeSummary = false,
  } = props || {};
  const dispatch = useDispatch();
  const apiRef = useRef(null);
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const { showLastUpdatedAt } = useDischargeSummaryData();
  const {
    chiefComplaint,
    lastPrescriptionDataForAssessment,
    lastPrescriptionDate,
  } = useSelector((state) => state.assessment);

  const doctorId = patientDetails?.doctor?.id || null;

  const { presentingComplaints: chiefComplaintFromLastPrescription = [] } =
    lastPrescriptionDataForAssessment;
  const { lastRxDate } = lastPrescriptionDate || {};
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [editorResetKey, setEditorResetKey] = useState(0);
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId: patientDetails?.details?.id,
    admissionId: patientDetails?.admissionId,
  });

  const getCurrentValue = useCallback(() => {
    if (isEmptyRichText(chiefComplaint)) {
      return EMPTY_RICH_TEXT_VALUE;
    }
    return chiefComplaint;
  }, [chiefComplaint]);

  const {
    templates: normalizedTemplates,
    templatesLoading,
    handleTemplateSelected,
    handleAddTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    refreshTemplates,
  } = useTemplateManagement({
    moduleName: "presentingComplaints",
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
      !Array.isArray(chiefComplaintFromLastPrescription) ||
      (Array.isArray(chiefComplaintFromLastPrescription) &&
        chiefComplaintFromLastPrescription?.length > 1) ||
      chiefComplaintFromLastPrescription?.[0]?.symptom_name
    ) {
      const convertedData = convertTemplateDataToRichText(
        chiefComplaintFromLastPrescription,
        "symptoms"
      );
      setAutoFillTextToAppend(convertedData);
    } else {
      setAutoFillTextToAppend(chiefComplaintFromLastPrescription);
    }
  };

  const isLastChiefComplaintPresent = useMemo(() => {
    return (
      (!Array.isArray(chiefComplaintFromLastPrescription) &&
        typeof chiefComplaintFromLastPrescription === "string" &&
        !!chiefComplaintFromLastPrescription) ||
      !isEmptyRichText(chiefComplaintFromLastPrescription)
    );
  }, [chiefComplaint, chiefComplaintFromLastPrescription]);
  
  const handleAIRecordingComplete = useCallback(
    (payload, callback) => {
      const schemaKey = isDischargeSummary
        ? "DISCHARGED_SUMMARY.patientHistory.presentingComplaints"
        : "ASSESSMENTS.basicInfo.presentingComplaints";
      return submitVoiceAiRecording({
        payload,
        schemaKey,
        previousOutput: isEmptyRichText(chiefComplaint) ? [] : chiefComplaint,
        onSuccess: (updatedData) => {
          dispatch(setChiefComplaint(updatedData));
        },
        callback,
      });
    },
    [chiefComplaint, dispatch, isDischargeSummary, submitVoiceAiRecording]
  );

  if (!isEditable && isEmptyRichText(chiefComplaint) && !isDischargeSummary)
    return null;
  return (
    <div className="flex-column-gap-16">
      <RichTextEditWrapper
        key={`chief-complaint-editor-${editorResetKey}`}
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showVoiceAI={true}
        showMicrophone={true}
        showMagicPenGif={true}
        templates={normalizedTemplates}
        templateType="entries"
        title={sectionData?.title}
        data-testid={sectionData?.id}
        width={isEditable ? "100%" : "fit-content"}
        voiceAiIcon={defaultAssetIcons.voiceAiIcon}
        initialValue={
          !isEmptyRichText(chiefComplaint)
            ? chiefComplaint
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        onVoiceAIRecordingComplete={handleAIRecordingComplete}
        onExposeApi={(api) => {
          apiRef.current = api;
        }}
        placeholder={
          "Enter chief complaint like patient’s main symptoms or presenting problem"
        }
        icon={defaultIcons[`${sectionData?.id}Pc`]}
        showAutoFill={isEditable && isLastChiefComplaintPresent}
        containerClass={`${hideBorder ? "ipdchiefcomplaint-hide-border" : ""} ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate={
          lastRxDate
            ? formatDateToShortMonthYear(lastRxDate)
            : "Last Consultation"
        }
        showTempButtons={true}
        onSave={() => {}}
        onErase={() => {
          dispatch(setChiefComplaint(EMPTY_RICH_TEXT_VALUE));
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
        renderFooter={() => {
          return children && children;
        }}
        headerComponent={
          !isEmptyRichText(chiefComplaint) ? showLastUpdatedAt : null
        }
      />
    </div>
  );
};

export default ChiefComplaint;
