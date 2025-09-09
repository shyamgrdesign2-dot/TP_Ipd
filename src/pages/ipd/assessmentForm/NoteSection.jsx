import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const NoteSection = (props) => {
  const { isEditable = true, sectionData } = props || {};

  const renderSpecialInstructions = (data) => {
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
        initialValue={[
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
        onVoiceDictatorClick={(callback) => {
          console.log("voice dictation");
          setTimeout(() => {
            callback();
          }, 3000);
        }}
      />
    );
  };
  const renderDischargeCriteria = (data) => {
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
        initialValue={[
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
        onVoiceDictatorClick={(callback) => {
          console.log("voice dictation");
          setTimeout(() => {
            callback();
          }, 3000);
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
