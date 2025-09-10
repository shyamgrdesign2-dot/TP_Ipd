import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setTreatmentPlanData } from "../../../redux/ipd/assessmentsFormSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const TreatmentPlan = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { treatmentPlanData = {} } = useSelector((state) => state.assessment);
  const [initialValue] = useState(treatmentPlanData || {});
  const dispatch = useDispatch();
  const handleOthersChange = (data, key) => {
    dispatch(setTreatmentPlanData({ ...treatmentPlanData, [key]: data }));
  };

  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      switch (item?.id) {
        case "immediateManagement":
          return renderImmediateManagement(item);
        case "monitoringPlan":
          return renderMonitoringPlan(item);
        default:
          return null;
      }
    });
  };
  const renderImmediateManagement = (data) => {
    if (!isEditable && !treatmentPlanData?.immediateManagement) return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={defaultIcons[data?.icon]}
        showAutoFill={false}
        containerClass={`wrapper-class ${isEditable ? 'ipd-wrapper-class-readonly' : ''}`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "immediateManagement")}
        initialValue={
          initialValue?.immediateManagement
            ? initialValue?.immediateManagement
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter immediate management like emergency interventions or initial treatment" // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
        }
        onSave={() => {
          console.log("save");
        }}
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
  const renderMonitoringPlan = (data) => {
    if (!isEditable && !treatmentPlanData?.monitoringPlan) return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={defaultIcons[data?.icon]}
        showAutoFill={false}
        containerClass={`wrapper-class ${isEditable ? 'ipd-wrapper-class-readonly' : ''}`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "monitoringPlan")}
        initialValue={
          initialValue?.monitoringPlan
            ? initialValue?.monitoringPlan
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter monitoring plan like vitals charting, labs, or daily observations"
        }
        onSave={() => {
          console.log("save");
        }}
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

  if (
    !isEditable &&
    !treatmentPlanData?.monitoringPlan &&
    !treatmentPlanData?.immediateManagement
  )
    return null;

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        icon={assessmentsIcons[sectionData?.icon]}
        collapsible={isEditable}
        width={"100%"}
        className={"collapsible-wrapper-class"}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </>
  );
};

export default TreatmentPlan;
