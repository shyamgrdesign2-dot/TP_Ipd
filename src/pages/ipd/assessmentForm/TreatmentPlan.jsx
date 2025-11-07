import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
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
  const [
    autoFillTextToAppendPreventiveActions,
    setAutoFillTextToAppendPreventiveActions,
  ] = useState([]);
  const [
    autoFillTextToAppendDesiredOutcome,
    setAutoFillTextToAppendDesiredOutcome,
  ] = useState([]);
  const handleOthersChange = (data, key) => {
    dispatch(setTreatmentPlanData({ ...treatmentPlanData, [key]: data }));
  };

  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "immediateManagement":
                return renderImmediateManagement(item);
              case "desiredOutcome":
                return renderDesiredOutcome(item);
              case "preventiveActions":
                return renderPreventiveActions(item);
              default:
                return null;
            }
          })()}
        </React.Fragment>
      );
    });
  };
  const renderImmediateManagement = (data) => {
    if (!isEditable && isEmptyRichText(treatmentPlanData?.immediateManagement))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
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
  const renderPreventiveActions = (data) => {
    if (!isEditable && isEmptyRichText(treatmentPlanData?.preventiveActions))
      return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "preventiveActions")}
        initialValue={
          treatmentPlanData?.preventiveActions
            ? treatmentPlanData?.preventiveActions
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter preventive actions like medications, interventions, or follow-up plans"
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppendPreventiveActions(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendPreventiveActions}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendPreventiveActions}
      />
    );
  };

  const renderDesiredOutcome = (data) => {
    if (!isEditable && isEmptyRichText(treatmentPlanData?.desiredOutcome))
      return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "desiredOutcome")}
        initialValue={
          treatmentPlanData?.desiredOutcome
            ? treatmentPlanData?.desiredOutcome
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter desired outcome like expected recovery, complications, or follow-up plans"
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppendDesiredOutcome(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendDesiredOutcome}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendDesiredOutcome}
      />
    );
  };

  if (
    !isEditable &&
    isEmptyRichText(treatmentPlanData?.desiredOutcome) &&
    isEmptyRichText(treatmentPlanData?.preventiveActions) &&
    isEmptyRichText(treatmentPlanData?.immediateManagement)
  )
    return null;

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={assessmentsIcons[`${sectionData?.id}PcDark`]}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </>
  );
};

export default TreatmentPlan;
