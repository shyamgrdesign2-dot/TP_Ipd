import React, { useState, useEffect, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/consultantNotesIcons";
import { useSelector, useDispatch } from "react-redux";
import { setAdditionalRemarks } from "../../../redux/ipd/consultantNotesSlice";
import { isEmptyRichText } from "../../../components/PDFGenerator";
import dayjs from "dayjs";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const AdditionalRemarks = (props) => {
  const {
    isEditable = true,
    shouldAutofill = false,
    sectionData,
    patientDetails = {},
  } = props || {};
  const { additionalRemarks } = useSelector((state) => state.consultantNotes);
  const doctorId = patientDetails?.doctor?.id || null;
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const prevConsultantNote = consultantNotes[0];
  const prevAdditionalRemarks =
    prevConsultantNote?.consultationNotes?.additionalRemarks;
  const hasAdditionalRemarksInLastConsultantNote = !isEmptyRichText(
    prevAdditionalRemarks
  );

  const getCurrentValue = useCallback(() => {
    if (isEmptyRichText(additionalRemarks)) {
      return [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ];
    }
    return additionalRemarks;
  }, [additionalRemarks]);

  const {
    templates: normalizedTemplates,
    templatesLoading,
    handleTemplateSelected,
    handleAddTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    refreshTemplates,
  } = useTemplateManagement({
    moduleName: "consultantAdditionalRemarks",
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
      showAutoFill={hasAdditionalRemarksInLastConsultantNote}
      autoFillTitle={
        hasAdditionalRemarksInLastConsultantNote
          ? `Autofill From Prev. Consultant Notes (${dayjs(
              prevConsultantNote?.consultationNotes?.date
            ).format("DD MMM YYYY")}, ${dayjs(
              prevConsultantNote?.consultationNotes?.time,
              "HH:mm:ss"
            ).format("hh:mm A")})`
          : "No previous consultant notes available"
      }
      onAutoFill={handleAutofill}
      containerClass="wrapper-class"
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
        dispatch(
          setAdditionalRemarks([
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ])
        );
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
      isDataPresent={!isEmptyRichText(additionalRemarks)}
      newAutoFillTextToAppend={autoFillTextToAppend}
      setNewAutoFillTextToAppend={setAutoFillTextToAppend}
    />
  );
};

export default AdditionalRemarks;
