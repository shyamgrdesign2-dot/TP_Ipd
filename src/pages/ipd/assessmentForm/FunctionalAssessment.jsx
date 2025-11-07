import React, { useState, useEffect, useMemo } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { IPD } from "../../../utils/locale";
import { ConfigProvider, Radio, Select } from "antd";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch, useSelector } from "react-redux";
import {
  setFunctionalAssessmentData,
  setReferredDocForReview,
} from "../../../redux/ipd/assessmentsFormSlice";
import { isEmptyRichText } from "../../../utils/utils";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";
import { defaultIcons } from "../../../assets/images/icons";
// import defaultIcons from "../../../assets/images/indices";

const ASSESSMENT_CHILDREN_MAPPING = {
  bedActivity: "Bed Activity",
  sitting: "Sitting",
  standing: "Standing",
  ambulation: "Ambulation",
  stairClimbing: "Stair Climbing",
  bedSoreOnAdmission: "Bed Sore on Admission",
};
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const UnitInput = createRemoteComponent("UnitInput");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");

const FunctionalAssessment = (props) => {
  const { referredDocForReview, functionalAssessmentData = [] } = useSelector(
    (state) => state.assessment
  );
  const { filters } = useSelector((state) => state.inPatients);
  const doctorsList = filters?.doctor || [];
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const dispatch = useDispatch();
  const handleOthersChange = (data) => {
    dispatch(
      setFunctionalAssessmentData({ ...functionalAssessmentData, others: data })
    );
  };
  const {
    isEditable = true,
    sectionData,
    showCollapsibleWrapper = true,
    hideBorder = false,
    isCollapsible = false,
    showAddEditButton = false,
  } = props || {};

  const handleAssessmentChange = (key, e, item) => {
    const selectedOption = item.options.find(
      (option) => option.value === e.target.value
    );
    dispatch(
      setFunctionalAssessmentData({
        ...functionalAssessmentData,
        [key]: selectedOption.label,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchFilters({ field: "doctor" }));
  }, []);

  const renderOthers = (data) => {
    if (!isEditable && isEmptyRichText(functionalAssessmentData?.others))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={assessmentsIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          hideBorder ? "ipddaso-hide-border" : ""
        } ${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        initialValue={
          functionalAssessmentData?.others?.length
            ? functionalAssessmentData?.others
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

  const { others, ...functionalAssessmentWithouOthers } =
    functionalAssessmentData;

  const isFunctionAssessmentValuesPresent = Object.values(
    functionalAssessmentWithouOthers
  ).some((item) => !!item && item !== "");

  const renderAssessment = () => {
    if (!isEditable) {
      if (
        !Object.keys(functionalAssessmentData)?.length ||
        (Object.keys(functionalAssessmentData)?.length === 1 &&
          !!functionalAssessmentData.others)
      )
        return null;

      if (!isFunctionAssessmentValuesPresent) return null;

      const functionalAssessmentFinalData = Object.entries(
        functionalAssessmentData
      ).filter(
        ([key, value]) =>
          value !== null && value !== undefined && typeof value === "string"
      );
      const assessmentComponents = functionalAssessmentFinalData.map(
        ([key, value]) => {
          if (!value) return null;
          return (
            <AssessmentDisplay
              key={key}
              label={ASSESSMENT_CHILDREN_MAPPING[key]}
              value={value}
            />
          );
        }
      );
      const renderReadOnlyBody = () => {
        return (
          <div className="ipdaf-assessment-readonly">
            {assessmentComponents?.map((component, i) => (
              <React.Fragment key={i}>
                {i > 0 && component && <span className="separator">|</span>}
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
          icon={assessmentsIcons[`${sectionData?.id}Pc`]}
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
  const renderSelectDoctor = (data) => {
    return (
      <div className="ipd-fas-refphy-container">
        <div className="refphy-label-container">
          <img src={assessmentsIcons[`${data?.id}Pc`]} alt="x" />
          <label className="refphy-label">{data.title}</label>
        </div>
        <UnitInput
          key={data?.id}
          containerStyle={{ marginBottom: "20px" }}
          onChange={(e) => {
            dispatch(setReferredDocForReview(e));
          }}
          value={referredDocForReview}
          type="string"
          inputMode="text"
          title={null}
          unit={null}
        />
      </div>
    );
  };
  const renderReferredToPhysiotherapy = (data) => {
    if (typeof referredDocForReview === 'object' && referredDocForReview?.name) return null;
    if (!isEditable && !referredDocForReview) return null;
    if (!isEditable) {
      return (
        <div className="ipd-fas-refphy-container rich-text-editor-wrapper wrapper-class ipd-wrapper-class-readonly">
          <div className="refphy-label-container">
            <img src={assessmentsIcons[`${data?.id}Pc`]} alt="x" />
            <label className="refphy-label">{data.title}</label>
          </div>
          <div className="referred-to-physiotherapy-name">
            {referredDocForReview}
          </div>
        </div>
      );
    }
    return (
      <div className="referred-to-physiotherapy-container">
        {renderSelectDoctor(data)}
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

  const renderGenericCard = () => {
    return (
      <div onClick={() => props.onAddEditClick()}>
        <GenericCard
          icon={defaultIcons.editIcon}
          title={"Add/Edit Functional Assessment"}
        />
      </div>
    );
  };

  if (
    !isEditable &&
    !isFunctionAssessmentValuesPresent &&
    !referredDocForReview &&
    isEmptyRichText(functionalAssessmentData?.others)
  )
    return null;
  return (
    <>
      {showCollapsibleWrapper ? (
        <CollapsibleWrapper
          title={sectionData?.title}
          data-testid={sectionData?.id}
          icon={assessmentsIcons[`${sectionData?.id}PcDark`]}
          collapsible={isEditable || isCollapsible}
          width={"100%"}
          className={`collapsible-wrapper-class ${
            isEditable ? "" : "collapsible-wrapper-class-readonly"
          }`}
          defaultOpen
        >
          {renderChildren()}
          {/* {renderGeneri} */}
          {showAddEditButton && renderGenericCard()}
        </CollapsibleWrapper>
      ) : (
        renderChildren()
      )}
    </>
  );
};

export default FunctionalAssessment;
