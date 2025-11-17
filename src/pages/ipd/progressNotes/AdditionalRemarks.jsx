import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalRemarks } from "../../../redux/ipd/progressNotesSlice";
import { formatDateToShortMonthYear, isEmptyRichText } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const EMPTY_RICH_TEXT_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const AdditionalRemarks = (props) => {
  const {
    isEditable = true,
    shouldAutofill = false,
    sectionData,
    patientDetails = {},
  } = props || {};
  const { additionalRemarks } = useSelector((state) => state.progressNotes);
  const doctorId = patientDetails?.doctor?.id || null;
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const { progressNotes } = useSelector((state) => state.progressNotes);
  const prevProgressNote = useMemo(() => {
    return progressNotes[progressNotes?.length - 1];
  }, [progressNotes]);
  const prevAdditionalRemarks = useMemo(() => {
    return prevProgressNote?.progressNotes?.additionalRemarks;
  }, [prevProgressNote]);
  console.log(additionalRemarks, "additionalRemarks");
  console.log(prevAdditionalRemarks, "prevAdditionalRemarks");
  const hasAdditionalRemarksInLastProgressNote = useMemo(() => {
    return (
      (!Array.isArray(prevAdditionalRemarks) &&
        typeof prevAdditionalRemarks === "string" &&
        !!prevAdditionalRemarks) ||
      (Array.isArray(prevAdditionalRemarks) &&
        !!prevAdditionalRemarks?.[0]?.children?.[0]?.text)
      // (Array.isArray(prevAdditionalRemarks) &&
      //   prevAdditionalRemarks.some((item) =>
      //     item?.children?.some((child) =>
      //       child?.children?.some((grandChild) => !!grandChild?.text)
      //     )
      //   ))
    );
  }, [additionalRemarks, prevAdditionalRemarks]);
  console.log(
    hasAdditionalRemarksInLastProgressNote,
    "hasAdditionalRemarksInLastProgressNotex"
  );

  // Get current value callback
  const getCurrentValue = useCallback(() => {
    if (isEmptyRichText(additionalRemarks)) {
      return EMPTY_RICH_TEXT_VALUE;
    }
    return Array.isArray(additionalRemarks) && additionalRemarks.length
      ? additionalRemarks
      : EMPTY_RICH_TEXT_VALUE;
  }, [additionalRemarks]);

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
    moduleName: "progressAdditionalRemarks",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue,
    onValueChange: useCallback(
      (data) => {
        dispatch(setAdditionalRemarks(data));
      },
      [dispatch]
    ),
  });

  const handleAutofill = (e) => {
    if (e?.[0] === "undo") {
      setAutoFillTextToAppend(e);
      return;
    }

    setAutoFillTextToAppend(prevAdditionalRemarks);
  };

  useEffect(() => {
    if (shouldAutofill) {
      handleAutofill();
    }
  }, [shouldAutofill]);

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      title="Additional Remarks"
      width="100%"
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      showAutoFill={isEditable && hasAdditionalRemarksInLastProgressNote}
      opdDate={
        prevProgressNote?.createdAt
          ? formatDateToShortMonthYear(prevProgressNote?.createdAt || "")
          : null
      }
      autoFillTitle={
        hasAdditionalRemarksInLastProgressNote
          ? `Autofill From Prev. Progress Notes (${new Date(
              prevProgressNote?.createdAt
            ).toLocaleDateString()}, ${new Date(
              prevProgressNote?.createdAt
            ).toLocaleTimeString()})`
          : "No previous profress notes available"
      }
      onAutoFill={handleAutofill}
      containerClass={`${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
      showMagicPenGif={false}
      showMicrophone={false}
      initialValue={
        additionalRemarks?.length > 0
          ? additionalRemarks
          : [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ]
      }
      onChange={(newValue) => {
        dispatch(setAdditionalRemarks(newValue));
      }}
      placeholder={"Enter additional remarks if any"}
      showTempButtons={true}
      onSave={() => {}}
      onErase={() => {
        // Clear Redux state
        dispatch(setAdditionalRemarks(EMPTY_RICH_TEXT_VALUE));
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
      isDataPresent={!isEmptyRichText(additionalRemarks)}
    />
  );
};

export default AdditionalRemarks;
