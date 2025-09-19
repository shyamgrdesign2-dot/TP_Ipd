import React, { useState } from "react";
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
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const PhysicalExamination = (props) => {
  const {
    physicalExaminationOthersData = [],
    referredDocForReview = "",
    physicalExaminationProvisionalDiagnosisData = [],
    physicalExaminationBasicData = {},
  } = useSelector((state) => state.assessment);
  const { isEditable = true, sectionData } = props || {};
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [
    autoFillTextToAppendProvisionalDiagnosis,
    setAutoFillTextToAppendProvisionalDiagnosis,
  ] = useState([]);
  const handleOthersChange = (data) => {
    dispatch(setPhysicalExaminationOthersData(data));
  };

  const handleProvisionalDiagnosisChange = (data) => {
    dispatch(setPhysicalExaminationProvisionalDiagnosisData(data));
  };

  const renderOthers = (data) => {
    if (!isEditable && isEmptyRichText(physicalExaminationOthersData))
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

  const renderProvisionalDiagnosis = (data) => {
    if (
      !isEditable &&
      isEmptyRichText(physicalExaminationProvisionalDiagnosisData)
    )
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
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        onChange={handleProvisionalDiagnosisChange}
        showMicrophone={false}
        initialValue={
          physicalExaminationProvisionalDiagnosisData?.length
            ? physicalExaminationProvisionalDiagnosisData
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={
          "Enter provisional diagnosis like suspected condition or working diagnosis"
        }
        onSave={() => {
          console.log("save");
        }}
        onErase={() => {
          setAutoFillTextToAppendProvisionalDiagnosis(["clear"]);
        }}
        onTemplate={() => {
          console.log("template");
        }}
        newAutoFillTextToAppend={autoFillTextToAppendProvisionalDiagnosis}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendProvisionalDiagnosis}
      />
    );
  };

  const renderChildren = () => {
    return sectionData?.children?.map((item) => {
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
              case "provisionalDiagnosis":
                return renderProvisionalDiagnosis(item);
              default:
                return null;
            }
          })()}
        </React.Fragment>
      );
    });
  };
  if (
    !isEditable &&
    !Object.keys(physicalExaminationBasicData)?.length &&
    isEmptyRichText(physicalExaminationOthersData) &&
    isEmptyRichText(physicalExaminationProvisionalDiagnosisData)
  )
    return null;
  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        icon={assessmentsIcons[`${sectionData?.id}PcDark`]}
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

export default PhysicalExamination;
