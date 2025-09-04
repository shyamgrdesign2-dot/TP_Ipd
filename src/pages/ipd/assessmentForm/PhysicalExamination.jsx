import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import ExaminationSection from "./ExaminationSection";
import Vitals from "./Vitals";
import { defaultIcons } from "../../../assets/images/icons";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const PhysicalExamination = (props) => {
    const { isEditable = true, sectionData } = props || {};


  const renderOthers = (data) => {
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
        placeholder={"Enter any other examination findings not covered above"}
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

  const renderProvisionalDiagnosis = (data) => {
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
          "Enter provisional diagnosis like suspected condition or working diagnosis"
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
        case "examinations":
          return <ExaminationSection {...props} sectionData={item} />;
        case "vitals":
          return <Vitals {...props} sectionData={item} />;
        case "others":
          return renderOthers(item);
        case "provisionalDiagnosis":
          return renderProvisionalDiagnosis(item);
        default:
          return null;
      }
    });
  };
  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        icon={defaultIcons[sectionData?.icon]}
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

export default PhysicalExamination;
