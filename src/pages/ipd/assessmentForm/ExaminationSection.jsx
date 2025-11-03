import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { Radio } from "antd";
import { defaultIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setPhysicalExaminationBasicData } from "../../../redux/ipd/assessmentsFormSlice";
import useCheckExaminationData from "../../../hooks/useCheckExaminationData";
import { isEmptyRichText } from "../../../components/PDFGenerator";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const RichTextEditor = createRemoteComponent("RichTextEditor");
const ExaminationSection = (props) => {
  const {
    isEditable = true,
    sectionData,
    isDischargeSummary = false,
  } = props || {};
  const { physicalExaminationBasicData = {} } = useSelector(
    (state) => state.assessment
  );
  const dispatch = useDispatch();
  const checkExaminationDataPresent = useCheckExaminationData(physicalExaminationBasicData);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [disableFocusEffect, setDisableFocusEffect] = useState({});
  const onExaminationRadioChange = (e, item) => {
    const { id } = item;
    dispatch(
      setPhysicalExaminationBasicData({
        ...physicalExaminationBasicData,
        [id]: {
          ...physicalExaminationBasicData[id],
          value: e.target.value,
          title: item.options.find((option) => option.value === e.target.value)
            ?.label,
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
      <div
        className={`ipdaf-examination-readonly ${
          false ? "box-with-padding" : ""
        }`}
      >
        <ul>
          {sectionData?.children
            ?.filter((item) => item.enabled)
            .map((item) => {
              const data = physicalExaminationBasicData[item.id];
              if (
                !data?.title &&
                ((data?.value === undefined || data?.value == null || data?.value === 0) &&
                  isEmptyRichText(data?.notes))
              )
                return null;

              return (
                <li key={item.id} className="examination-item">
                  <span className="examination-label">{item.title}:</span>{" "}
                  {data.title}
                  {!isEmptyRichText(data?.notes) && (
                    <div className="ipdaf-exam-read-notes-container">
                      <li className="ipdaf-exam-read-notes-heading">Notes:</li>
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

  const handleEraseDataFromRichTextEditor = (item) => {
    setDisableFocusEffect((prev) => ({
      ...prev,
      [item?.id]: true,
    }));
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      [item?.id]: ["clear"],
    }));
    setTimeout(() => {
      setDisableFocusEffect((prev) => ({
        ...prev,
        [item?.id]: false,
      }));
    }, 100);
  };

  const renderEditableExamination = () => {
    return (
      <div className="examinations-parent-container">
        {sectionData?.children
          ?.filter((item) => item.enabled)
          .map((item) => {
            return (
              <RichTextEditWrapper
                key={item.id}
                readOnly={!isEditable}
                showToolbar={isEditable}
                showActionBtns={false}
                onErase={() => handleEraseDataFromRichTextEditor(item)}
                newAutoFillTextToAppend={autoFillTextToAppend[item?.id]}
                setNewAutoFillTextToAppend={(value) => {
                  setAutoFillTextToAppend((prev) => ({
                    ...prev,
                    [item?.id]: value,
                  }));
                }}
                toolbarClass={"small-toolbar"}
                showAutoFill={false}
                showMagicPenGif={false}
                disableFocusEffect={disableFocusEffect[item?.id]}
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
                <div
                  className="examination-container-header"
                  data-testid={`examination-radio-${item.id}`}
                >
                  <div className="examination-header">{item.title} : </div>
                  <Radio.Group
                    className="exam-radio-text"
                    onChange={(e) => onExaminationRadioChange(e, item)}
                    value={physicalExaminationBasicData[
                      item.id
                    ]?.value?.toString()}
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

  if (!isEditable && !checkExaminationDataPresent) return null;
  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      showOnlyClear={isEditable}
      isDataPresent={Object.keys(physicalExaminationBasicData)?.length}
      onErase={(e) => {
        dispatch(setPhysicalExaminationBasicData({}));
        sectionData?.children
          ?.filter((item) => item.enabled)
          ?.forEach((item) => {
            handleEraseDataFromRichTextEditor(item);
          });
      }}
      title={sectionData?.title}
      data-testid={sectionData?.id}
      width="100%"
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      showAutoFill={false}
      showMagicPenGif={false}
      showMicrophone={false}
      placeholder={"Additional notes if any"}
      containerClass={`examination-rich-container ${
        !isEditable ? "examination-rich-readonly-container" : ""
      }`}
      renderBody={renderExaminationSection}
    />
  );
};

export default ExaminationSection;
