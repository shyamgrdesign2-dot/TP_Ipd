import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { IPD } from "../../../utils/locale";
import { ConfigProvider, Radio } from "antd";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setFunctionalAssessmentData } from "../../../redux/ipd/assessmentsFormSlice";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const FunctionalAssessment = (props) => {
  const { functionalAssessmentData = [] } = useSelector(
    (state) => state.assessment
  );
  const [initialValue] = useState(functionalAssessmentData?.others || []);
  const dispatch = useDispatch();
  const handleOthersChange = (data) => {
    dispatch(
      setFunctionalAssessmentData({ ...functionalAssessmentData, others: data })
    );
  };
  const { isEditable = true, sectionData } = props || {};
  const [assessmentValue, setAssessmentValue] = useState({});

  const handleAssessmentChange = (key, e, item) => {
    const selectedOption = item.options.find(
      (option) => option.value === e.target.value
    );
    const next = { ...assessmentValue, [key]: selectedOption.label };
    // setAssessmentValue(next);
    dispatch(
      setFunctionalAssessmentData({
        ...functionalAssessmentData,
        [key]: selectedOption.label,
      })
    );
  };

  const renderOthers = (data) => {
    if (!isEditable && !functionalAssessmentData?.others?.length) return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={defaultIcons[data?.icon]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        initialValue={
          initialValue.length
            ? initialValue
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={"Enter any other examination findings not covered above"} // TODO: INTEL - PLACEHOLDERS CAN ALSO BECOME DYNAMIC
        onChange={handleOthersChange}
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
  const ASSESSMENT_CONFIGS = [
    { key: "bedActivity", label: "Bed Activity" },
    { key: "sitting", label: "Sitting" },
    { key: "standing", label: "Standing" },
    { key: "ambulation", label: "Ambulation" },
    {
      key: "stairClimbing",
      label: "Stair Climbing",
      note: "reports fatigue on climbing stairs",
    },
    { key: "bedSoreOnAdmission", label: "Bed Sore on Admission" },
  ];

  const AssessmentDisplay = ({ label, value, note }) => (
    <span>
      <span className="assessment-label">{label}:</span> {value}
      {note && value?.toLowerCase().includes("needs assistance") && (
        <span className="assessment-note"> ({note})</span>
      )}
    </span>
  );

  const renderAssessment = () => {
    if (!isEditable) {
      const assessmentComponents = sectionData.children?.[0]?.children?.filter(
        (config) => functionalAssessmentData?.[config.key]
      ).map((config) => (
        <AssessmentDisplay
          key={config.key}
          label={config.label}
          value={functionalAssessmentData[config.key]}
          note={config.note}
        />
      ));

      const renderReadOnlyBody = () => {
        return (
          <div className="ipdaf-assessment-readonly">
            {assessmentComponents.map((component, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="separator">|</span>}
                {component}
              </React.Fragment>
            ))}
          </div>
        );
      };

      return (
        <RichTextEditWrapper
          readOnly={true}
          showToolbar={false}
          showActionBtns={false}
          title={'Basics'}
          width="100%"
          icon={defaultIcons.medication}
          showAutoFill={false}
          containerClass={`ipd-fn-as-readonly`}
          showMagicPenGif={false}
          showMicrophone={false}
          renderBody={renderReadOnlyBody}
        />
      );
    }

    console.log('INTEL ==> sectionData', sectionData)
    return (
      <div className="assessments-parent-container">
        {sectionData.children?.[0]?.children?.filter((item) => item.enabled)?.map((item) => (
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
                onChange={(e) => handleAssessmentChange(item.key, e, item)}
                value={
                  item.options.find(
                    (option) =>
                      option.label === functionalAssessmentData[item.key]
                  )?.value
                }
              />
            </ConfigProvider>
          </div>
        ))}
      </div>
    );
  };
  const renderReferredToPhysiotherapy = (data) => {
    if (!isEditable) return null; // TODO: INTEL - REFERRED PHYSIO PENDING
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
