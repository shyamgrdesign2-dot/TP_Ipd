import React, { useState, useEffect, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/consultantNotesIcons";
import { useSelector, useDispatch } from "react-redux";
import { setClinicalAssessmentPlan } from "../../../redux/ipd/consultantNotesSlice";
import { isEmptyRichText } from "../../../components/PDFGenerator";
import dayjs from "dayjs";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ClinicalAssessment = (props) => {
  const {
    isEditable = true,
    shouldAutofill = false,
    sectionData,
    patientDetails = {},
  } = props || {};
  const { clinicalAssessmentPlan } = useSelector(
    (state) => state.consultantNotes
  );
  const doctorId = patientDetails?.doctor?.id || null;
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const dispatch = useDispatch();

  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const prevConsultantNote = consultantNotes[0];

  const prevClinicalAssessmentPlan =
    prevConsultantNote?.consultationNotes?.clinicalAssessmentPlan;

  const hasClinicalAssessmentPlanInLastConsultantNote = !isEmptyRichText(
    prevClinicalAssessmentPlan
  );

  const getCurrentValue = useCallback(() => {
    if (isEmptyRichText(clinicalAssessmentPlan)) {
      return [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ];
    }
    return clinicalAssessmentPlan;
  }, [clinicalAssessmentPlan]);

  const {
    templates: normalizedTemplates,
    templatesLoading,
    handleTemplateSelected,
    handleAddTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    refreshTemplates,
  } = useTemplateManagement({
    moduleName: "consultantClinicalAssessmentPlan",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue,
    onValueChange: useCallback(
      (data) => {
        dispatch(setClinicalAssessmentPlan(data));
      },
      [dispatch]
    ),
  });

  const handleAutofill = (e) => {
    if (e?.[0] === "undo") {
      setAutoFillTextToAppend(e);
      return;
    }

    setAutoFillTextToAppend(prevClinicalAssessmentPlan);
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
      title="Clinical Assessment & Plan"
      width="100%"
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      containerClass="wrapper-class"
      showMagicPenGif={false}
      showAutoFill={hasClinicalAssessmentPlanInLastConsultantNote}
      autoFillTitle={
        hasClinicalAssessmentPlanInLastConsultantNote
          ? `Autofill From Prev. Consultant Notes (${dayjs(
              prevConsultantNote?.consultationNotes?.date
            ).format("DD MMM YYYY")}, ${dayjs(
              prevConsultantNote?.consultationNotes?.time,
              "HH:mm:ss"
            ).format("hh:mm A")})`
          : "No previous consultant notes available"
      }
      onAutoFill={handleAutofill}
      initialValue={
        !isEmptyRichText(clinicalAssessmentPlan)
          ? clinicalAssessmentPlan
          : [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ]
      }
      onChange={(newValue) => {
        dispatch(setClinicalAssessmentPlan(newValue));
      }}
      placeholder={
        "Enter clinical assessment & plan like patient's condition and management steps"
      }
      showTempButtons={true}
      onSave={() => {}}
      onErase={() => {
        dispatch(
          setClinicalAssessmentPlan([
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
      isDataPresent={!isEmptyRichText(clinicalAssessmentPlan)}
      newAutoFillTextToAppend={autoFillTextToAppend}
      setNewAutoFillTextToAppend={setAutoFillTextToAppend}
    />
  );
};

export default ClinicalAssessment;
