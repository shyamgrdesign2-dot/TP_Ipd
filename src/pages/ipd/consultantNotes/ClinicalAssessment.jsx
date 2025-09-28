import React, { useState, useMemo, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/consultantNotesIcons";
import { useSelector, useDispatch } from "react-redux";
import { setClinicalAssessmentPlan } from "../../../redux/ipd/consultantNotesSlice";
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ClinicalAssessment = (props) => {
  const { isEditable = true, shouldAutofill = false, sectionData } = props || {};
  const { clinicalAssessmentPlan } = useSelector(
    (state) => state.consultantNotes
  );
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const dispatch = useDispatch();

  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const prevConsultantNote = useMemo(() => {
    return consultantNotes[consultantNotes?.length - 1];
  }, [consultantNotes]);
  const prevClinicalAssessmentPlan = useMemo(() => {
    return prevConsultantNote?.consultationNotes?.clinicalAssessmentPlan;
  }, [prevConsultantNote]);

  const hasClinicalAssessmentPlanInLastConsultantNote = useMemo(() => {
    return (
      (!Array.isArray(prevClinicalAssessmentPlan) &&
        typeof prevClinicalAssessmentPlan === "string" &&
        !!prevClinicalAssessmentPlan) ||
      (Array.isArray(prevClinicalAssessmentPlan) &&
        prevClinicalAssessmentPlan.some((item) =>
          item?.children?.some((child) =>
            child?.children?.some((grandChild) => !!grandChild?.text)
          )
        ))
    );
  }, [prevClinicalAssessmentPlan]);

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
          ? `Autofill From Prev. Consultant Notes (${new Date(
              prevConsultantNote.createdAt
            ).toLocaleDateString()}, ${new Date(
              prevConsultantNote.createdAt
            ).toLocaleTimeString()})`
          : "No previous consultant notes available"
      }
      onAutoFill={handleAutofill}
      initialValue={
        clinicalAssessmentPlan?.length > 0
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
      onSave={() => {
        console.log("save");
      }}
      onErase={() => {
        setAutoFillTextToAppend(["clear"]);
      }}
      onTemplate={() => {
        console.log("template");
      }}
      newAutoFillTextToAppend={autoFillTextToAppend}
      setNewAutoFillTextToAppend={setAutoFillTextToAppend}
    />
  );
};

export default ClinicalAssessment;
