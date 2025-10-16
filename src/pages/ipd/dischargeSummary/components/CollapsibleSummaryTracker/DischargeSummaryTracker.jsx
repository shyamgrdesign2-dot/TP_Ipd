import React from "react";
import CollapsibleSummaryTracker, {
  assessmentIcons,
} from "./CollapsibleSummaryTracker";
import "./styles.scss";
import { IPD } from "../../../../../utils/locale";
import { mapSectionsWithData } from "../../../../../utils/utils";
import { useSelector } from "react-redux";

const demoSection = {
  id: "diagnosisAndSurgery",
  title: "Diagnosis & Surgery",
  isDataFilled: false,
  defaultOpen: true,
  iconSrc: assessmentIcons.provisionalDiagnosisPcDark,
  items: [
    { id: "finalDiagnosis", title: "Final Diagnosis", isDataFilled: false },
    {
      id: "provisionalDiagnosis",
      title: "Provisional Diagnosis",
      isDataFilled: true,
      hint: "Autofilled from Admi. Asses Form (24 Jun 2025)",
    },
    {
      id: "surgeriesPerformed",
      title: "Surgeries Performed",
      isDataFilled: true,
      hint: "Autofilled from OT notes (24 Jun 2025)",
    },
  ],
};

export const DischargeSummaryTracker = (props) => {
  const dischargeSummaryState = useSelector((state) => state.dischargeSummary);

  const sectionsWithData = mapSectionsWithData(
    IPD.DEFAULT_DISCHARGE_SUMMARY_FORM_STRUCTURE,
    dischargeSummaryState.actualDischargeSummaryData
  );

  return (
    <div className="sumtrack-full-container no-scrollbar">
      <div className="sumtrack-headings">
        <div className="sumtrack-title">Summary Progress</div>
        <div className="sumtrack-desc">
          Track completion status of each section
        </div>
      </div>
      <div className="d-flex flex-column summary-tracker-container">
        {sectionsWithData.map((section) => (
          <CollapsibleSummaryTracker key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
  // return <CollapsibleSummaryTracker section={demoSection} />;
};

export default DischargeSummaryTracker;
