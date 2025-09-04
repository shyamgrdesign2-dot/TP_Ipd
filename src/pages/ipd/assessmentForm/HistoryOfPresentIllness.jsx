import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons/";
import { useDispatch, useSelector } from "react-redux";
import { setHistoryOfPresentIllness } from "../../../redux/ipd/assessmentsFormSlice";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const HistoryOfPresentIllness = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const dispatch = useDispatch();
  const { historyOfPresentIllness } = useSelector((state) => state.assessment);
  
  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={false}
      title={sectionData?.title}
      width="100%"
      icon={defaultIcons[sectionData?.icon]}
      showAutoFill={false}
      containerClass="wrapper-class"
      opdDate="15 Jun 2025"
      initialValue={[
        {
          type: "paragraph",
          children: [{ text: historyOfPresentIllness.length > 0 ? historyOfPresentIllness : "" }],
        },
      ]}
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
        console.log("erase");
      }}
      onTemplate={() => {
        console.log("template");
      }}
      onVoiceDictatorClick={(callback) => {
        console.log("voice dictation");
        setTimeout(() => {
          callback();
        }, 3000);
      }}
    />
  );
};

export default HistoryOfPresentIllness;
