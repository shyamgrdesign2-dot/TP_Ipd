/**
 * Attending Physician Component for Progress Notes
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { renderListItem } from "../../ListViewRenderer";

/**
 * Attending Physician Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Physician data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Attending physician section
 */
const AttendingPhysician = ({ data, fontFamily = "Arial" }) => {
  if (!data?.attendingPhysician) return null;

  const { attendingPhysician } = data;

  return (
    <View style={{ padding: "6px 0px" }}>
      {renderListItem("Name", attendingPhysician.name, fontFamily)}
      {renderListItem("Specialty", attendingPhysician.specialty, fontFamily)}
      {renderListItem("Department", attendingPhysician.department, fontFamily)}
      {renderListItem("Contact", attendingPhysician.contact, fontFamily)}
      {renderListItem("Email", attendingPhysician.email, fontFamily)}
      {renderListItem("License Number", attendingPhysician.licenseNumber, fontFamily)}
    </View>
  );
};

export default AttendingPhysician;
