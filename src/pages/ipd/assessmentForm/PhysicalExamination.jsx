import React, { useCallback, useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import ExaminationSection from "./ExaminationSection";
import Vitals from "./Vitals";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import {
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
} from "../../../redux/ipd/assessmentsFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { isEmptyRichText } from "../../../utils/utils";
import useCheckExaminationData from "../../../hooks/useCheckExaminationData";
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const PhysicalExamination = (props) => {
  const assessmentData = useSelector((state) => state.assessment);
  const {
    physicalExaminationOthersData = [],
    referredDocForReview = "",
    physicalExaminationProvisionalDiagnosisData = [],
    physicalExaminationBasicData = {},
    vitalsData,
  } = assessmentData;
  const checkExaminationDataPresent = useCheckExaminationData(physicalExaminationBasicData);

  const {
    isEditable = true,
    sectionData,
    showCollapsibleWrapper = true,
    children,
    isCollapsible,
  } = props || {};
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const handleOthersChange = (data) => {
    dispatch(setPhysicalExaminationOthersData(data));
  };

  const renderOthers = (data) => {
    if (!isEditable && isEmptyRichText(physicalExaminationOthersData))
      return null;
    return (
      <div>
        <RichTextEditWrapper
          readOnly={!isEditable}
          showToolbar={isEditable}
          showActionBtns={isEditable}
          title={data?.title}
          width={isEditable ? "100%" : "fit-content"}
          icon={assessmentsIcons[`${data?.id}Pc`]}
          showAutoFill={false}
          containerClass={`ipdpe-others-section ${
            !isEditable ? "ipd-wrapper-class-readonly" : ""
          }`}
          showMagicPenGif={false}
          showMicrophone={false}
          onChange={handleOthersChange}
          initialValue={
            physicalExaminationOthersData?.length
              ? physicalExaminationOthersData
              : [
                  {
                    type: "paragraph",
                    children: [{ text: "" }],
                  },
                ]
          }
          placeholder={"Enter any other examination findings not covered above"}
          onSave={() => {
            console.log("save");
          }}
          onErase={() => {
            handleOthersChange([
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ]);
            setAutoFillTextToAppend(["clear"]);
          }}
          onTemplate={() => {
            console.log("template");
          }}
          newAutoFillTextToAppend={autoFillTextToAppend}
          setNewAutoFillTextToAppend={setAutoFillTextToAppend}
        />
      </div>
    );
  };

  const renderChildren = () => {
    return (
      <div className="flex-column-gap-16">
        {sectionData?.children?.map((item) => {
          return (
            <React.Fragment key={item.id}>
              {(() => {
                switch (item?.id) {
                  case "examinations":
                    return <ExaminationSection {...props} sectionData={item} />;
                  case "vitals":
                    return <Vitals {...props} sectionData={item} />;
                  case "others":
                    return renderOthers(item);
                  default:
                    return null;
                }
              })()}
            </React.Fragment>
          );
        })}
        {children && children}
      </div>
    );
  };
  const hasAnyVitalValue = !!vitalsData && Object.values(vitalsData).some(
    (value) => value !== null && value !== undefined && value !== ""
  );
  if (
    !isEditable &&
    !checkExaminationDataPresent &&
    !hasAnyVitalValue &&
    isEmptyRichText(physicalExaminationOthersData) &&
    isEmptyRichText(physicalExaminationProvisionalDiagnosisData)
  )
    return null;
  return (
    <>
      {showCollapsibleWrapper ? (
        <CollapsibleWrapper
          title={sectionData?.title}
          data-testid={sectionData?.id}
          icon={assessmentsIcons[`${sectionData?.id}PcDark`]}
          collapsible={isCollapsible || isEditable}
          width={"100%"}
          className={`collapsible-wrapper-class ${
            isEditable ? "" : "collapsible-wrapper-class-readonly"
          }`}
          defaultOpen
        >
          {renderChildren()}
        </CollapsibleWrapper>
      ) : (
        renderChildren()
      )}
    </>
  );
};

export default PhysicalExamination;
