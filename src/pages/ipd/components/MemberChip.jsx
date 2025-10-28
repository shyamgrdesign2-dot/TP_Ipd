import React from "react";
import "./MemberChip.scss";

const MemberChip = ({ icon, role, label, value }) => {
  if (!value) {
    return null;
  }

  return (
    <div className="team-member-chip">
      <img
        src={icon}
        alt="icon"
        className="team-member-icon"
      />
      <div className="chip-content">
        <span className="team-member-label">{label}</span>
        <span className="team-member-value">{value}</span>
      </div>
      {role && (
        <div className="chip-role success-info-pill">{role}</div>
      )}
    </div>
  );
};

export default MemberChip;
