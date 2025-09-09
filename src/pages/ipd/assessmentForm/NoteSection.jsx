import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalNotesData } from "../../../redux/ipd/assessmentsFormSlice";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const NoteSection = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { additionalNotesData = {} } = useSelector((state) => state.assessment);
  const [initialValue] = useState(additionalNotesData || {});
  const dispatch = useDispatch();
  const handleOthersChange = (data, key) => {
    dispatch(setAdditionalNotesData({...additionalNotesData, [key]: data}));
  }
  const renderSpecialInstructions = (data) => {
    if (!isEditable && !additionalNotesData?.specialInstructions) return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={defaultIcons[data?.icon]}
        showAutoFill={false}
        containerClass="wrapper-class"
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, 'specialInstructions')}
        initialValue={initialValue?.specialInstructions ? initialValue?.specialInstructions : [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]}
        placeholder={
          "Enter Special Instructions, Precautions or Additional Notes" // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
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
      />
    );
  };
  const renderDischargeCriteria = (data) => {
    if (!isEditable && !additionalNotesData?.dischargeCriteria) return null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={defaultIcons[data?.icon]}
        showAutoFill={false}
        containerClass="wrapper-class"
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, 'dischargeCriteria')}
        initialValue={initialValue?.dischargeCriteria ? initialValue?.dischargeCriteria : [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]}
        placeholder={
          "Enter discharge criteria like stable vitals, afebrile status etc"
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
  if (!isEditable && (!additionalNotesData?.dischargeCriteria && !additionalNotesData?.specialInstructions)) return null;
  return (
    <div>
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
    </div>
  );
};

export default NoteSection;
