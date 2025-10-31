import React, { useState, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/consultantNotesIcons";
import { useSelector, useDispatch } from "react-redux";
import { setClinicalAssessmentPlan } from "../../../redux/ipd/consultantNotesSlice";
import { isEmptyRichText } from "../../../components/PDFGenerator";
import dayjs from "dayjs";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ClinicalAssessment = (props) => {
  const {
    isEditable = true,
    shouldAutofill = false,
    sectionData,
  } = props || {};
  const { clinicalAssessmentPlan } = useSelector(
    (state) => state.consultantNotes
  );
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const dispatch = useDispatch();

  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const prevConsultantNote = consultantNotes[0];

  const prevClinicalAssessmentPlan =
    prevConsultantNote?.consultationNotes?.clinicalAssessmentPlan;

  const hasClinicalAssessmentPlanInLastConsultantNote = !isEmptyRichText(
    prevClinicalAssessmentPlan
  );

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
