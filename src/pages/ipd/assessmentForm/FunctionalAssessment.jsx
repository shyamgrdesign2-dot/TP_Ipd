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

const ASSESSMENT_CHILDREN_MAPPING = {
  bedActivity: "Bed Activity",
  sitting: "Sitting",
  standing: "Standing",
  ambulation: "Ambulation",
  stairClimbing: "Stair Climbing",
  bedSoreOnAdmission: "Bed Sore on Admission",
};
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

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
  const { isEditable = true, sectionData, showCollapsibleWrapper= true, hideBorder= false } = props || {};

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
        containerClass={`wrapper-class ${hideBorder ? "ipddaso-hide-border" : ""} ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
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

  const renderAssessment = () => {
    if (!isEditable) {
      if (
        !Object.keys(functionalAssessmentData)?.length ||
        (Object.keys(functionalAssessmentData)?.length === 1 &&
          !!functionalAssessmentData.others)
      )
        return null;
      const assessmentComponents = Object.entries(functionalAssessmentData)
        .filter(
          ([key, value]) =>
            value !== null && value !== undefined && typeof value === "string"
        )
        .map(([key, value]) => {
          return (
            <AssessmentDisplay
              key={key}
              label={ASSESSMENT_CHILDREN_MAPPING[key]}
              value={value}
            />
          );
        });
      const renderReadOnlyBody = () => {
        return (
          <div className="ipdaf-assessment-readonly">
            {assessmentComponents?.map((component, i) => (
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
    const options = (doctorsList || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id}>{item.name}</div>,
    }));
    return (
      <div className="ipd-fas-refphy-container">
        <div className="refphy-label-container">
          <img src={assessmentsIcons[`${data?.id}Pc`]} alt="x" />
          <label className="refphy-label">{data.title}</label>
        </div>
        <Select
          showSearch
          optionLabelProp="label"
          options={options}
          value={referredDocForReview?.name}
          className="autocomplete-custom w-100 popinput inputheight41"
          placeholder={`Select Physiotherapist`}
          onSearch={(q) =>
            dispatch(fetchFilters({ field: "doctor", search: q }))
          }
          allowClear
          onChange={(value, option) => {
            if (value === undefined || value === null) {
              dispatch(setReferredDocForReview(null));
              return;
            }
            try {
              const parsed = option?.key ? JSON.parse(option.key) : null;
              dispatch(setReferredDocForReview(parsed));
            } catch (err) {
              console.log("ERR in Referred To Physiotherapy", err);
            }
          }}
        />
      </div>
    );
  };
  const renderReferredToPhysiotherapy = (data) => {
    if (!isEditable && !referredDocForReview?.name) return null;
    if (!isEditable) {
      return (
        <div className="ipd-fas-refphy-container rich-text-editor-wrapper wrapper-class ipd-wrapper-class-readonly">
          <div className="refphy-label-container">
            <img src={assessmentsIcons[`${data?.id}Pc`]} alt="x" />
            <label className="refphy-label">{data.title}</label>
          </div>
          <div className="referred-to-physiotherapy-name">
            {referredDocForReview?.name}
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
  const functionalAssessmentDataOnlyBasics = useMemo(() => {
    const filtered = { ...functionalAssessmentData };
    delete filtered.others;
    return filtered;
  }, [functionalAssessmentData]);

  if (
    !isEditable &&
    (!Object.keys(functionalAssessmentData)?.length ||
      (Object.keys(functionalAssessmentData)?.length === 1 &&
        !!functionalAssessmentData.others)) &&
    !referredDocForReview?.name &&
    isEmptyRichText(functionalAssessmentData?.others)
  )
    return null;
  return (
    <>
      {showCollapsibleWrapper ? <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={assessmentsIcons[`${sectionData?.id}PcDark`]}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper> : renderChildren()}
    </>
  );
};

export default FunctionalAssessment;
