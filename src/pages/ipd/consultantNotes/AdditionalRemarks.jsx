import React, { useState, useMemo, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { useSelector, useDispatch } from "react-redux";
import { setAdditionalRemarks } from "../../../redux/ipd/consultantNotesSlice";
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const AdditionalRemarks = (props) => {
  const { isEditable = true, shouldAutofill = false } = props || {};
  const { additionalRemarks } = useSelector((state) => state.consultantNotes);
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const prevConsultantNote = useMemo(() => {
    return consultantNotes[consultantNotes?.length - 1];
  }, [consultantNotes]);
  const prevAdditionalRemarks = useMemo(() => {
    return prevConsultantNote?.consultationNotes?.additionalRemarks;
  }, [prevConsultantNote]);
  const hasAdditionalRemarksInLastConsultantNote = useMemo(() => {
    return (
      (!Array.isArray(prevAdditionalRemarks) &&
        typeof prevAdditionalRemarks === "string" &&
        !!prevAdditionalRemarks) ||
      (Array.isArray(prevAdditionalRemarks) &&
        prevAdditionalRemarks.some((item) =>
          item?.children?.some((child) =>
            child?.children?.some((grandChild) => !!grandChild?.text)
          )
        ))
    );
  }, [prevAdditionalRemarks]);

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
      icon={defaultIcons.doc}
      showAutoFill={hasAdditionalRemarksInLastConsultantNote}
      autoFillTitle={
        hasAdditionalRemarksInLastConsultantNote
          ? `Autofill From Prev. Consultant Notes (${new Date(
              prevConsultantNote.createdAt
            ).toLocaleDateString()}, ${new Date(
              prevConsultantNote.createdAt
            ).toLocaleTimeString()})`
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

export default AdditionalRemarks;
