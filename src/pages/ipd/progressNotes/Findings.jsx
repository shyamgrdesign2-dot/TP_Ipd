import React, { useState, useMemo, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setFindings } from "../../../redux/ipd/progressNotesSlice";
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const Findings = (props) => {
  const { isEditable = true, shouldAutofill = false } = props || {};
  const { findings } = useSelector((state) => state.progressNotes);
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const { progressNotes } = useSelector((state) => state.progressNotes);
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
      prevFindings.some((item) =>
          item?.children?.some((child) =>
            child?.children?.some((grandChild) => !!grandChild?.text)
          )
        ))
    );
  }, [prevFindings]);

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

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      title="Findings (Systemic Examination)"
      width="100%"
      icon={defaultIcons.doc}
      showAutoFill={hasfindingsInLastProgressNote}
      autoFillTitle={
        hasfindingsInLastProgressNote
          ? `Autofill From Prev. Progress Notes (${new Date(
              prevProgressNote.createdAt
            ).toLocaleDateString()}, ${new Date(
              prevProgressNote.createdAt
            ).toLocaleTimeString()})`
          : "No previous progress notes available"
      }
      onAutoFill={handleAutofill}
      containerClass=""
      showMagicPenGif={false}
      showMicrophone={false}
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

export default Findings;
