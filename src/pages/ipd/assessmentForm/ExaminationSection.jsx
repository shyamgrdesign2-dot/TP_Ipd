import React, { useState } from "react";
import { IPD } from "../../../utils/locale";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { Radio } from "antd";
import { defaultIcons } from "../../../assets/images/icons/";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const ExaminationSection = (props) => {
    const { isEditable = true, sectionData } = props || {};
    const [examinationValue, setExaminationValue] = useState({});

    const onExaminationRadioChange = (e, id) => {
        setExaminationValue({ ...examinationValue, [id]: e.target.value });
    };

  const renderExaminationSection = () => {
    return (
      <div className="examinations-parent-container">
        {IPD.EXAMINATION.map((item) => {
          return (
            <RichTextEditWrapper
              readOnly={!isEditable}
              showToolbar={isEditable}
              showActionBtns={isEditable}
              initialValue={[
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]}
              // title="Examination"
              // width="100%"
              // icon={aidKit}
              showAutoFill={false}
              opdDate="15 Jun 2025"
              showMagicPenGif={false}
              showMicrophone={false}
              placeholder={"Additional notes if any"}
              containerClass="wrapper-class examination-rich-container"
            >
              <div className="examination-container-header">
                <div className="examination-header">{item.title} : </div>
                <Radio.Group
                  className="exam-radio-text"
                  onChange={(e) => onExaminationRadioChange(e, item.title)}
                  value={examinationValue[item.title]}
                  options={item.options}
                />
              </div>
            </RichTextEditWrapper>
          );
        })}
      </div>
    );
  };
  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      initialValue={[
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ]}
      title={sectionData?.title}
      width="100%"
      icon={defaultIcons[sectionData?.icon]}
      showAutoFill={false}
      opdDate="15 Jun 2025"
      showMagicPenGif={false}
      showMicrophone={false}
      placeholder={"Additional notes if any"}
      containerClass="wrapper-class examination-rich-container"
      renderBody={renderExaminationSection}
    />
  );
};

export default ExaminationSection;
