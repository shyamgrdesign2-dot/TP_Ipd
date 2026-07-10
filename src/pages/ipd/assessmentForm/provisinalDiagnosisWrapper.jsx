import React from "react";
import { useSelector } from "react-redux";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import ProvisionalDiagnosis from "../dischargeSummary/components/ProvisionalDiagnosis";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const ReadOnlyDiagnosisList = ({ items }) => (
  <div style={{ padding: "8px 0" }}>
    {items.map((item, i) => (
      <div key={item.id || i} style={{ display: "flex", alignItems: "center", padding: "6px 0", gap: 8 }}>
        <span style={{ color: "#22c55e", fontSize: 16 }}>&#10003;</span>
        <span style={{ fontSize: 14 }}>{item.name}</span>
      </div>
    ))}
  </div>
);

const ProvisionalDiagnosisWrapper = (props) => {
  const { sectionData, isEditable = true } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};

  if (!isEditable && provisionalDiagnosis.length === 0) return null;

  if (!isEditable) {
    return (
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={assessmentsIcons.provisionalDiagnosisPcDark}
        collapsible={false}
        width={"100%"}
        className="collapsible-wrapper-class collapsible-wrapper-class-readonly"
        defaultOpen
      >
        <ReadOnlyDiagnosisList items={provisionalDiagnosis} />
      </CollapsibleWrapper>
    );
  }

  return (
    <CollapsibleWrapper
      title={sectionData?.title}
      data-testid={sectionData?.id}
      icon={assessmentsIcons.provisionalDiagnosisPcDark}
      collapsible={isEditable}
      width={"100%"}
      className="collapsible-wrapper-class"
      defaultOpen
    >
      <ProvisionalDiagnosis {...props} sectionData={sectionData?.children[0]} />
    </CollapsibleWrapper>
  );
};

export default ProvisionalDiagnosisWrapper;
