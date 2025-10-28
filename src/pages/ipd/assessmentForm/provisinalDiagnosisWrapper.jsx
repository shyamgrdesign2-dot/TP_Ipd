import React from "react";
import { useSelector } from "react-redux";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import ProvisionalDiagnosis from "../dischargeSummary/components/ProvisionalDiagnosis";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const ProvisionalDiagnosisWrapper = (props) => {
  const { sectionData, isEditable = true } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};

    console.log('INTEL ==> provisionalDiagnosis', provisionalDiagnosis, isEditable)
  if (!isEditable && provisionalDiagnosis.length === 0) return null;

  return (
    <CollapsibleWrapper
      title={sectionData?.title}
      data-testid={sectionData?.id}
      icon={assessmentsIcons.provisionalDiagnosisPcDark}
      collapsible={isEditable}
      width={"100%"}
      className={`collapsible-wrapper-class ${
        isEditable ? "" : "collapsible-wrapper-class-readonly"
      }`}
      defaultOpen
    >
      <ProvisionalDiagnosis {...props} sectionData={sectionData?.children[0]} />
    </CollapsibleWrapper>
  );
};

export default ProvisionalDiagnosisWrapper;
