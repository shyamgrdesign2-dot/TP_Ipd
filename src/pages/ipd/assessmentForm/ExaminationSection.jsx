import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { Radio } from "antd";
import { defaultIcons } from "../../../assets/images/icons/";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setPhysicalExaminationBasicData } from "../../../redux/ipd/assessmentsFormSlice";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const RichTextEditor = createRemoteComponent("RichTextEditor");
const ExaminationSection = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { physicalExaminationBasicData = {} } = useSelector(
    (state) => state.assessment
  );
  const dispatch = useDispatch();

  const onExaminationRadioChange = (e, id) => {
    dispatch(
      setPhysicalExaminationBasicData({
        ...physicalExaminationBasicData,
        [id]: {
          ...physicalExaminationBasicData[id],
          value: e.target.value,
          title: e.target.value === 2 ? "Abnormal" : "WNL",
        },
      })
    );
  };

  const handleExaminationNotesChange = (data, id) => {
    dispatch(
      setPhysicalExaminationBasicData({
        ...physicalExaminationBasicData,
        [id]: { ...physicalExaminationBasicData[id], notes: data },
      })
    );
  };

  const renderReadOnlyExamination = () => {
    return (
      <div className="ipdaf-examination-readonly">
        <ul>
          {sectionData?.children?.filter((item) => item.enabled).map((item) => {
            const data = physicalExaminationBasicData[item.id];
            if (!data?.title) return null;

            return (
              <li key={item.id} className="examination-item">
                <span className="examination-label">{item.title}:</span>{" "}
                {data.title}
                {data.notes?.[0]?.children?.[0].text && (
                  <div className="ipdaf-exam-read-notes-container">
                    <div className="ipdaf-exam-read-notes-heading">Notes:</div>
                    <RichTextEditor
                      showActionBtns={false}
                      showAutoFill={false}
                      showMagicPenGif={false}
                      showMicrophone={false}
                      showToolbar={false}
                      readOnly={true}
                      initialValue={data.notes}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderEditableExamination = () => {
    return (
      <div className="examinations-parent-container">
        {sectionData?.children?.filter((item) => item.enabled).map((item) => {
          return (
            <RichTextEditWrapper
              key={item.id}
              readOnly={!isEditable}
              showToolbar={isEditable}
              showActionBtns={isEditable}
              showAutoFill={false}
              showMagicPenGif={false}
              showMicrophone={false}
              placeholder={"Additional notes if any"}
              containerClass="wrapper-class examination-rich-container"
              onChange={(data) => handleExaminationNotesChange(data, item.id)}
              initialValue={
                physicalExaminationBasicData[item.id]?.notes?.length
                  ? physicalExaminationBasicData[item.id]?.notes
                  : [
                      {
                        type: "paragraph",
                        children: [{ text: "" }],
                      },
                    ]
              }
            >
              <div className="examination-container-header" data-testid={`examination-radio-${item.id}`}>
                <div className="examination-header">{item.title} : </div>
                <Radio.Group
                  className="exam-radio-text"
                  onChange={(e) => onExaminationRadioChange(e, item.id)}
                  value={physicalExaminationBasicData[item.id]?.value}
                  options={item.options}
                />
              </div>
            </RichTextEditWrapper>
          );
        })}
      </div>
    );
  };

  const renderExaminationSection = () => {
    return isEditable
      ? renderEditableExamination()
      : renderReadOnlyExamination();
  };
  
  if (!isEditable && !Object.keys(physicalExaminationBasicData)?.length)
    return null;
  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      title={sectionData?.title}
      width="100%"
      icon={defaultIcons[sectionData?.icon]}
      showAutoFill={false}
      showMagicPenGif={false}
      showMicrophone={false}
      placeholder={"Additional notes if any"}
      containerClass="wrapper-class examination-rich-container"
      renderBody={renderExaminationSection}
    />
  );
};

export default ExaminationSection;
