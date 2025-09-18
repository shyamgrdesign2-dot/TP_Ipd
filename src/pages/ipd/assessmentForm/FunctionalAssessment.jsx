import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { IPD } from "../../../utils/locale";
import { ConfigProvider, Radio } from "antd";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/icons/assessments";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setFunctionalAssessmentData } from "../../../redux/ipd/assessmentsFormSlice";
import { isEmptyRichText } from "../../../utils/utils";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const FunctionalAssessment = (props) => {
  const { functionalAssessmentData = [] } = useSelector(
    (state) => state.assessment
  );
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
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
    console.log("INTEL ==> KEY", key, e, item);
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
    if (!isEditable && (isEmptyRichText(functionalAssessmentData?.others))) return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%": 'fit-content'}
        icon={defaultIcons[data?.icon]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
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

  const AssessmentDisplay = ({ label, value }) => {
    return (
      <span>
        <span className="assessment-label">{label}:</span> {value}
      </span>
    );
  };

  const renderAssessment = () => {
    if (!isEditable) {
      if (!Object.keys(functionalAssessmentData || {})?.length) return null;
      const assessmentComponents = Object.entries(functionalAssessmentData)
        .filter(
          ([key, value]) =>
            value !== null && value !== undefined && typeof value === "string"
        )
        .map(([key, value]) => {
          return <AssessmentDisplay key={key} label={key} value={value} />;
        });
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
          title={"Basic"}
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

    return (
      <div className="assessments-parent-container">
        {sectionData.children
          ?.find((child) => child.id === "assessment")
          ?.children?.filter((item) => item.enabled)
          ?.map((item) => (
            <div key={item.id} className="assessment-card">
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
                  onChange={(e) => handleAssessmentChange(item.id, e, item)}
                  value={
                    item.options.find(
                      (option) =>
                        option.label === functionalAssessmentData[item.id]
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
    return sectionData?.children?.map((item, index) => {
      const key = `${item?.id || "unknown"}-${index}`;

      switch (item?.id) {
        case "assessment":
          return (
            <React.Fragment key={key}>{renderAssessment()}</React.Fragment>
          );
        case "others":
          return (
            <React.Fragment key={key}>{renderOthers(item)}</React.Fragment>
          );
        case "referredToPhysiotherapy":
          return (
            <React.Fragment key={key}>
              {renderReferredToPhysiotherapy(item)}
            </React.Fragment>
          );
        default:
          return null;
      }
    });
  };
  if (!isEditable && !Object.keys(functionalAssessmentData || {})?.length && isEmptyRichText(functionalAssessmentData?.others)) return null;
  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        icon={assessmentsIcons[sectionData?.icon]}
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

export default FunctionalAssessment;
