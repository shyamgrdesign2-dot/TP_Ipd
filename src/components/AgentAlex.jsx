import React from "react";
import "./AgentAlex.scss";

const AgentAlex = ({ onClose, onViewProgressNotes }) => {
  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleViewProgressNotesClick = () => {
    if (onViewProgressNotes) {
      onViewProgressNotes();
    }
  };

  return (
    <div className="agent-alex-container">
      {/* Background Pattern */}
      <div className="agent-alex-background-pattern" />

      {/* Header Section */}
      <div className="agent-alex-header">
        <div className="agent-alex-profile-section">
          <div className="agent-alex-avatar">
            <div className="agent-alex-avatar-image" />
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
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 25.6667C20.4433 25.6667 25.6667 20.4433 25.6667 14C25.6667 7.55668 20.4433 2.33334 14 2.33334C7.55668 2.33334 2.33334 7.55668 2.33334 14C2.33334 20.4433 7.55668 25.6667 14 25.6667Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* AI Summary Section */}
      <div className="agent-alex-ai-summary">
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
      </div>

      {/* Progress Timeline Section */}
      <div className="agent-alex-progress-timeline">
        <div className="agent-alex-timeline-header">
          <div className="agent-alex-timeline-date">
            <div className="agent-alex-calendar-icon">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path
                  d="M8.66667 2.16667V5.41667M17.3333 2.16667V5.41667M3.25 9.75H22.75M4.33333 22.75H21.6667C22.9541 22.75 24 21.7041 24 20.4167V5.41667C24 4.12925 22.9541 3.08334 21.6667 3.08334H4.33333C3.04592 3.08334 2 4.12925 2 5.41667V20.4167C2 21.7041 3.04592 22.75 4.33333 22.75Z"
                  stroke="#4B4AD5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="agent-alex-date-text">24 Jun, 2025</div>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="agent-alex-progress-cards">
          {/* Morning Card */}
          <div className="agent-alex-progress-card">
            <div className="agent-alex-card-header">
              <div className="agent-alex-time-section">
                <div className="agent-alex-time-icon morning">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path
                      d="M8.5 1.5L10.5 6.5L15.5 6.5L11.5 9.5L13.5 14.5L8.5 11.5L3.5 14.5L5.5 9.5L1.5 6.5L6.5 6.5L8.5 1.5Z"
                      fill="#4E1A7E"
                      stroke="#4E1A7E"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
                <div className="agent-alex-time-text">
                  <span className="time-period">Morning</span>
                  <span className="time-detail">(08:12 AM)</span>
                </div>
              </div>
            </div>
            <div className="agent-alex-card-content">
              <div className="agent-alex-content-section">
                <div className="agent-alex-section-header">
                  <div className="agent-alex-section-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M7.5 1.5L9.5 6.5L14.5 6.5L10.5 9.5L12.5 14.5L7.5 11.5L2.5 14.5L4.5 9.5L0.5 6.5L5.5 6.5L7.5 1.5Z"
                        fill="#454551"
                        stroke="#454551"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <div className="agent-alex-section-title">
                    Chief Complaint
                  </div>
                </div>
                <div className="agent-alex-section-content">
                  <ul>
                    <li>Mild headache, improved appetite</li>
                  </ul>
                </div>
              </div>

              <div className="agent-alex-content-section">
                <div className="agent-alex-section-header">
                  <div className="agent-alex-section-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M3.75 3.75H11.25V11.25H3.75V3.75Z"
                        stroke="#454551"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.625 5.625H9.375V9.375H5.625V5.625Z"
                        fill="#454551"
                      />
                    </svg>
                  </div>
                  <div className="agent-alex-section-title">Findings</div>
                </div>
                <div className="agent-alex-section-content">
                  <ul>
                    <li>
                      Abdominal pain started 2 days ago, mainly in the right
                      lower quadrant.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="agent-alex-content-section">
                <div className="agent-alex-section-header">
                  <div className="agent-alex-section-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M2.5 7.5H12.5M7.5 2.5V12.5"
                        stroke="#454551"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="7.5" cy="7.5" r="1.5" fill="#454551" />
                    </svg>
                  </div>
                  <div className="agent-alex-section-title">Vitals</div>
                </div>
                <div className="agent-alex-section-content">
                  <ul>
                    <li>BP: 122/80, HR: 78, Temp: 98.8°F, RR: 18</li>
                  </ul>
                </div>
              </div>

              <div className="agent-alex-content-section">
                <div className="agent-alex-section-header">
                  <div className="agent-alex-section-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M7.5 1.5L9.5 6.5L14.5 6.5L10.5 9.5L12.5 14.5L7.5 11.5L2.5 14.5L4.5 9.5L0.5 6.5L5.5 6.5L7.5 1.5Z"
                        fill="#454551"
                        stroke="#454551"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <div className="agent-alex-section-title">
                    Additional Remarks
                  </div>
                </div>
                <div className="agent-alex-section-content">
                  <ul>
                    <li>
                      Paracetamol 500 mg (3 days, No other regular medication)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="agent-alex-card-footer">
              <div className="agent-alex-signature">
                <div className="agent-alex-signature-icon">
                  <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
                    <path
                      d="M19.5 3.25L24.5 15.25L36.5 15.25L27.5 23.25L32.5 35.25L19.5 27.25L6.5 35.25L11.5 23.25L2.5 15.25L14.5 15.25L19.5 3.25Z"
                      fill="#B89ECE"
                    />
                  </svg>
                </div>
                <div className="agent-alex-signature-info">
                  <div className="agent-alex-signature-label">
                    Being Filled By:
                  </div>
                  <div className="agent-alex-signature-name">
                    Dr. John Smith
                  </div>
                </div>
                <div className="agent-alex-role-badge">
                  <span>Medical Officer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Less Button */}
        <button className="agent-alex-view-less-button">
          <span>View Less</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="#4B4AD5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Bottom Section with View Progress Notes Button */}
      <div className="agent-alex-bottom-section">
        <button
          className="agent-alex-view-progress-button"
          onClick={handleViewProgressNotesClick}
        >
          <span>View Progress Notes</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="#4B4AD5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AgentAlex;
