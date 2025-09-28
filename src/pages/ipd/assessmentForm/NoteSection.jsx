import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalNotesData } from "../../../redux/ipd/assessmentsFormSlice";
import { isEmptyRichText } from "../../../utils/utils";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const NoteSection = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [
    autoFillTextToAppendDischargeCriteria,
    setAutoFillTextToAppendDischargeCriteria,
  ] = useState([]);
  const { additionalNotesData = {} } = useSelector((state) => state.assessment);
  const dispatch = useDispatch();
  const handleOthersChange = (data, key) => {
    dispatch(setAdditionalNotesData({ ...additionalNotesData, [key]: data }));
  };
  const renderSpecialInstructions = (data) => {
    if (
      !isEditable &&
      isEmptyRichText(additionalNotesData?.specialInstructions)
    )
      return null;
    return (
      <RichTextEditWrapper
        key={data?.title}
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
        onChange={(data) => handleOthersChange(data, "specialInstructions")}
        initialValue={
          additionalNotesData?.specialInstructions
            ? additionalNotesData?.specialInstructions
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter Special Instructions, Precautions or Additional Notes" // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
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
  const renderDischargeCriteria = (data) => {
    if (!isEditable && isEmptyRichText(additionalNotesData?.dischargeCriteria))
      return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        key={data?.title}
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
        onChange={(data) => handleOthersChange(data, "dischargeCriteria")}
        initialValue={
          additionalNotesData?.dischargeCriteria
            ? additionalNotesData?.dischargeCriteria
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter discharge criteria like stable vitals, afebrile status etc"
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppendDischargeCriteria(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendDischargeCriteria}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendDischargeCriteria}
      />
    );
  };
  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      switch (item?.id) {
        case "specialInstructions":
          return renderSpecialInstructions(item);
        case "dischargeCriteria":
          return renderDischargeCriteria(item);
        default:
          return null;
      }
    });
  };
  if (
    !isEditable &&
    isEmptyRichText(additionalNotesData?.dischargeCriteria) &&
    isEmptyRichText(additionalNotesData?.specialInstructions)
  )
    return null;
  return (
    <div>
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
    </div>
  );
};

export default NoteSection;
