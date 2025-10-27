import React, { useState, useMemo, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalRemarks } from "../../../redux/ipd/progressNotesSlice";
import { formatDateToShortMonthYear } from "../../../utils/utils";
// import { convertTemplateDataToRichText, formatDateToShortMonthYear } from "../../../utils/utils";
// import { fetchSingleTemplate } from "../../../redux/ipd/ipdSlice";
// import { errorMessage } from "../../../utils/toast";
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const AdditionalRemarks = (props) => {
  const {
    isEditable = true,
    shouldAutofill = false,
    sectionData,
  } = props || {};
  const { additionalRemarks } = useSelector((state) => state.progressNotes);
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
