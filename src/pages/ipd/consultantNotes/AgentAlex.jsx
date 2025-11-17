import React, { useState } from "react";
import "./AgentAlex.scss";
import ProgressNotesView from "../progressNotes/progressNotesView/progressNotesView";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import agentAlex from "../../../assets/images/agent-alex.png";
import closeSquare from "../../../assets/images/close-square.svg";
import { defaultIcons } from "../../../assets/images/icons";

const AgentAlex = ({ onClose, onViewProgressNotes }) => {
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const { progressNotes } = useSelector((state) => state.progressNotes);
  const { state } = useLocation();
  const { patientDetails, fromTab } = state || {};

  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleViewProgressNotesClick = () => {
    setIsTimelineExpanded(true);
    if (onViewProgressNotes) {
      onViewProgressNotes();
    }
  };

  const handleViewLessClick = () => {
    setIsTimelineExpanded(false);
  };

  return (
    <div
      className={`agent-alex-container ${
        isTimelineExpanded ? "timeline-expanded" : ""
      }`}
    >
      {/* Background Pattern */}
      <div className="agent-alex-background-pattern" />

      {/* Header Section */}
      <div className="agent-alex-header">
        <div className="agent-alex-profile-section">
          <div className="agent-alex-avatar">
            {/* <div className="agent-alex-avatar-image" /> */}
            <img
              className="agent-alex-avatar-image"
              src={agentAlex}
              alt="Agent Alex"
            />
          </div>
          <div className="agent-alex-info">
            <div className="agent-alex-name">Agent Alex</div>
            <div className="agent-alex-role">
              Your personal medical assistant
            </div>
          </div>
        </div>
        <button
          className="agent-alex-close-button"
          onClick={handleCloseClick}
          aria-label="Close Agent Alex panel"
        >
          <img src={closeSquare} alt="Close" />
        </button>
      </div>

      {/* AI Summary Section */}
      {/* <div className="agent-alex-ai-summary">
        <div className="agent-alex-summary-header">
          <div className="agent-alex-summary-icon">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path
                d="M8.5 1.5L10.5 6.5L15.5 6.5L11.5 9.5L13.5 14.5L8.5 11.5L3.5 14.5L5.5 9.5L1.5 6.5L6.5 6.5L8.5 1.5Z"
                fill="url(#aiSummaryGradient)"
                stroke="url(#aiSummaryGradient)"
                strokeWidth="1"
              />
              <defs>
                <linearGradient
                  id="aiSummaryGradient"
                  x1="1.5"
                  y1="1.5"
                  x2="15.5"
                  y2="15.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#A461D8" />
                  <stop offset="1" stopColor="#4B4AD5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="agent-alex-summary-title">
            Progress Notes AI Summary
          </div>
          <div className="agent-alex-info-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 4V6M6 8H6.01"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="agent-alex-summary-content">
          <ul className="agent-alex-summary-list">
            <li>
              Since the last consultation, patient's reported{" "}
              <strong>fever has resolved</strong> and{" "}
              <strong>improved appetite</strong>.
            </li>
            <li>
              Vitals improved from Temp <strong>101.2°F to 99.6°F</strong>, BP
              stable at <strong>118/78</strong>, HR reduced to{" "}
              <strong>80 bpm</strong>.
            </li>
            <li>
              Findings show reduced <strong>abdominal tenderness</strong>.
            </li>
            <li>
              <strong>IV antibiotics</strong> continued,{" "}
              <strong>oral hydration</strong> initiated,{" "}
              <strong>urine culture</strong> sample sent.
            </li>
          </ul>
        </div>
      </div> */}

      {/* Progress Timeline Section */}
      <div className="agent-alex-progress-timeline">
        {/* Progress Notes Timeline Header */}
        <div className="agent-alex-timeline-header-section">
          <h3 className="agent-alex-timeline-title">Progress Notes Timeline</h3>
        </div>

        {/* Progress Notes Timeline - Always visible, blurred when collapsed */}
        <div
          className={`agent-alex-timeline-container ${
            isTimelineExpanded ? "expanded" : "collapsed"
          }`}
        >
          <ProgressNotesView
            progressNotes={[progressNotes[progressNotes.length - 1]]}
            patientDetails={patientDetails}
            fromTab={fromTab}
            isProgressNotesSummary
          />
        </div>

        {/* View Less Button */}
        {isTimelineExpanded && (
          <button
            className="agent-alex-view-less-button"
            onClick={handleViewLessClick}
          >
            <span>View Less</span>
            <img src={defaultIcons.downArrowPcIcon} alt="View Less" />
          </button>
        )}
      </div>

      {/* Bottom Section with View Progress Notes Button */}
      {!isTimelineExpanded && (
        <div className="agent-alex-bottom-section">
          <button
            className="agent-alex-view-progress-button"
            onClick={handleViewProgressNotesClick}
          >
            <span>View Progress Notes</span>
            <img src={defaultIcons.downArrowPcIcon} alt="View Less" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentAlex;
