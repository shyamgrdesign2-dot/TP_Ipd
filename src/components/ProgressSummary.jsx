import React from "react";
import "./ProgressSummary.scss";

const ProgressSummary = ({ onClick }) => {
  return (
    <div className="progress-summary-container" onClick={onClick}>
      <div className="progress-summary-background" />
      <div className="progress-summary-voice-button">
        <div className="progress-summary-icon">
          <svg
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 1.6875C11.25 1.6875 9.42188 3.51563 9.42188 5.76563V13.5C9.42188 15.75 11.25 17.5781 13.5 17.5781C15.75 17.5781 17.5781 15.75 17.5781 13.5V5.76563C17.5781 3.51563 15.75 1.6875 13.5 1.6875ZM20.25 13.5C20.25 17.5781 16.8281 20.25 13.5 20.25C10.1719 20.25 6.75 17.5781 6.75 13.5H5.0625C5.0625 18.2813 8.57813 22.2188 13.5 22.7656V25.3125H15.1875V22.7656C20.1094 22.2188 23.625 18.2813 23.625 13.5H20.25Z"
              fill="url(#progressSummaryGradient)"
            />
            <defs>
              <linearGradient
                id="progressSummaryGradient"
                x1="4.5"
                y1="4.5"
                x2="22.5"
                y2="22.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A461D8" />
                <stop offset="1" stopColor="#4B4AD5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="progress-summary-text">
          <span>Progress Summary</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
