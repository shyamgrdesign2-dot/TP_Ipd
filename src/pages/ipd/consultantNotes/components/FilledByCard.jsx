import React from "react";
import { defaultIcons as indicesIcons } from "../../../../assets/images/indices/index.js";
import "../ConsultantNotesPreview.scss";

const FilledByCard = ({ filledBy, role }) => {
  if (!filledBy && !role) {
    return null;
  }

  return (
    <div className="cnp-filled-by-card">
      <div className="cnp-filled-by-icon">
        <img src={indicesIcons.informedBy} alt="Filled by" />
      </div>
      <div className="cnp-filled-by-content">
        <div className="cnp-filled-by-info">
          <span className="cnp-filled-by-label">Being Filled By:</span>
          <span className="cnp-filled-by-name">{filledBy || "-"}</span>
        </div>
        {role && (
          <div className="cnp-filled-by-role-badge">
            <span className="cnp-filled-by-role-text">{role}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilledByCard;
