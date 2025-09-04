import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { IPD } from "../../../utils/locale";
import { ConfigProvider, Radio } from "antd";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const FunctionalAssessment = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const [assessmentValue, setAssessmentValue] = useState({});

  const handleAssessmentChange = (key, e) => {
    const next = { ...assessmentValue, [key]: e.target.value };
    console.log("INTEL ==> next", next);
    setAssessmentValue(next);
  };

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
        placeholder={"Enter any other examination findings not covered above"} // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
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
  const renderAssessment = () => {
    return (
      <div className="assessments-parent-container">
        {IPD.FUNCTIONAL_ASSESSMENT.map((item) => (
          <div key={item.key} className="assessment-card">
            <div className="assessment-card-header">
              <div className="assessment-title">{item.title}:</div>
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Radio: {
                    colorPrimary: "#4B4AD5",
                    colorPrimaryHover: "#4B4AD5",
                    colorPrimaryActive: "#4B4AD5",
                  },
                },
              }}
            >
              <Radio.Group
                className="assessment-radio-group big-ring-radio"
                options={item.options}
                onChange={(e) => handleAssessmentChange(item.key, e)}
                value={assessmentValue[item.key]}
              />
            </ConfigProvider>
          </div>
        ))}
      </div>
    );
  };
  const renderReferredToPhysiotherapy = (data) => {
    return (
      <div className="referred-to-physiotherapy-container">
        hii there referred doc
      </div>
    );
  };
  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
      switch (item?.id) {
        case "assessment":
          return renderAssessment();
        case "others":
          return renderOthers(item);
        case "referredToPhysiotherapy":
          return renderReferredToPhysiotherapy(item);
        default:
          return null;
      }
    });
  };
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

export default FunctionalAssessment;
