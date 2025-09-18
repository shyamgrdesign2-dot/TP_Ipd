import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setTreatmentPlanData } from "../../../redux/ipd/assessmentsFormSlice";
import { isEmptyRichText } from "../../../utils/utils";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const TreatmentPlan = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { treatmentPlanData = {} } = useSelector((state) => state.assessment);
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [autoFillTextToAppendMonitoringPlan, setAutoFillTextToAppendMonitoringPlan] = useState([]);
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
    if (!isEditable && (isEmptyRichText(treatmentPlanData?.immediateManagement))) return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%": 'fit-content'}
        icon={defaultIcons[data?.icon]}
        showAutoFill={false}
        containerClass={`wrapper-class ${!isEditable ? 'ipd-wrapper-class-readonly' : ''}`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "immediateManagement")}
        initialValue={
          treatmentPlanData?.immediateManagement
            ? treatmentPlanData?.immediateManagement
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
  const renderMonitoringPlan = (data) => {
    if (!isEditable && (isEmptyRichText(treatmentPlanData?.monitoringPlan))) return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%": 'fit-content'}
        icon={defaultIcons[data?.icon]}
        showAutoFill={false}
        containerClass={`wrapper-class ${!isEditable ? 'ipd-wrapper-class-readonly' : ''}`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "monitoringPlan")}
        initialValue={
          treatmentPlanData?.monitoringPlan
            ? treatmentPlanData?.monitoringPlan
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
          setAutoFillTextToAppendMonitoringPlan(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendMonitoringPlan}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendMonitoringPlan}
      />
    );
  };

  if (
    !isEditable &&
    (isEmptyRichText(treatmentPlanData?.monitoringPlan) &&
    isEmptyRichText(treatmentPlanData?.immediateManagement))
  )
    return null;

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        icon={assessmentsIcons[sectionData?.icon]}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${isEditable ? "" : "collapsible-wrapper-class-readonly"}`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </>
  );
};

export default TreatmentPlan;
