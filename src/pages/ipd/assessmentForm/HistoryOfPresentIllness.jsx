import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch, useSelector } from "react-redux";
import { setHistoryOfPresentIllness } from "../../../redux/ipd/assessmentsFormSlice";
import { isEmptyRichText } from "../../../utils/utils";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const HistoryOfPresentIllness = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const { historyOfPresentIllness } = useSelector((state) => state.assessment);

  if (!isEditable && isEmptyRichText(historyOfPresentIllness)) return null;

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      title={sectionData?.title}
      width={isEditable ? "100%": 'fit-content'}
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      showAutoFill={false}
      containerClass={`wrapper-class ${!isEditable ? 'ipd-wrapper-class-readonly' : ''}`}
      opdDate="15 Jun 2025"
      initialValue={
        historyOfPresentIllness.length > 0
          ? historyOfPresentIllness
          : [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ]
      }
      placeholder={
        "Enter history of present illness, including onset, duration, and progression of symptoms"
      }
      onAutoFill={() => {
        console.log("auto fill");
      }}
      onSave={() => {
        console.log("save");
      }}
      onChange={(e) => dispatch(setHistoryOfPresentIllness(e))}
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

export default HistoryOfPresentIllness;
