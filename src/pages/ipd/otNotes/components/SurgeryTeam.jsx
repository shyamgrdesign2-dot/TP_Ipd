import React from "react";
import "./SurgeryTeam.scss";
import defaultIcons from "../../../../assets/images/indices";
import { defaultIcons as icons } from "../../../../assets/images/icons";
import MemberChip from "../../components/MemberChip";

const SurgeryTeam = ({ surgeryTeam, id }) => {
  if (!surgeryTeam) return null;

  const renderTeamMember = (label, value, icon = null) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    // Handle array of objects with id and name properties
    let displayValue = "";
    if (Array.isArray(value)) {
      displayValue = value
        .map((item) => item.name || "")
        .filter((name) => name)
        .join(", ");
    } else if (typeof value === "object" && value.name) {
      displayValue = value.name;
    } else {
      displayValue = value;
    }

    if (!displayValue) return null;
    return (
      <MemberChip
        icon={defaultIcons.referringTo}
        label={label}
        value={displayValue}
      />
    );
  };

  if (
    Object.keys(surgeryTeam).filter(
      (key) =>
        surgeryTeam[key]?.length > 0 ||
        (typeof surgeryTeam[key] === "string" && !!surgeryTeam[key])
    ).length === 0
  )
    return null;

  return (
    <div className="surgery-team-container">
      <div className="surgery-team-header">
        <img
          src={defaultIcons[`${id}Pc`]}
          alt="x"
          className="surgery-team-icon"
        />
        <h3 className="surgery-team-title">Surgery Team</h3>
      </div>

      <div className="team-members-grid">
        {renderTeamMember("Primary Surgeon", surgeryTeam.primarySurgeon, true)}
        {renderTeamMember(
          "Secondary Surgeon",
          surgeryTeam.secondarySurgeon,
          true
        )}
        {renderTeamMember("Assistant", surgeryTeam.assistant, true)}
        {renderTeamMember("Anaesthesiologist", surgeryTeam.anaesthesiologist, true)}
        {renderTeamMember("Scrub Nurse", surgeryTeam.scrubNurse, true)}
        {renderTeamMember(
          "Floor/ Circulating Nurse",
          surgeryTeam.floorCirculatingNurse,
          true
        )}
      </div>
    </div>
  );
};

export default SurgeryTeam;
