import React, { useState } from "react";
import CollapsibleSummaryTracker from "./CollapsibleSummaryTracker";
import "./styles.scss";
import { IPD } from "../../../../../utils/locale";
import { mapSectionsWithData } from "../../../../../utils/utils";
import { useSelector } from "react-redux";

export const DischargeSummaryTracker = (props) => {
  const dischargeSummaryState = useSelector((state) => state.dischargeSummary);
  const [openId, setOpenId] = useState(null);

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
          <CollapsibleSummaryTracker
            key={section.id}
            section={section}
            openId={openId}
            setOpenId={setOpenId}
          />
        ))}
      </div>
    </div>
  );
};

export default DischargeSummaryTracker;
