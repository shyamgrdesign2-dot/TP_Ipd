import React from "react";
import "./ProgressSummary.scss";
import progressSummaryIcon from "../../../assets/images/progress-summary.svg";

const ProgressSummary = ({ onClick }) => {
  return (
    <div className="progress-summary-container" onClick={onClick}>
      <div className="progress-summary-background" />
      <div className="progress-summary-voice-button">
        <div className="progress-summary-icon">
          <img src={progressSummaryIcon} alt="Progress Summary" />
        </div>
        <div className="progress-summary-text">
          <span>Progress Summary</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
