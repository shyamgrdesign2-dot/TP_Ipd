/**
 * Patient Information Component for Progress Notes
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { renderListItem } from "../../ListViewRenderer";

/**
 * Patient Information Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Patient data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Patient information section
 */
const PatientInfo = ({ data, fontFamily = "Arial" }) => {
  if (!data?.patientInformation) return null;

  const { patientInformation } = data;

  return (
    <View style={{ padding: "6px 0px" }}>
      {renderListItem("Patient Name", patientInformation.name, fontFamily)}
      {renderListItem("Patient ID", patientInformation.patientId, fontFamily)}
      {renderListItem("Age", patientInformation.age, fontFamily)}
      {renderListItem("Gender", patientInformation.gender, fontFamily)}
      {renderListItem("Admission Date", patientInformation.admissionDate, fontFamily)}
      {renderListItem("Room/Bed", patientInformation.roomBed, fontFamily)}
      {renderListItem("Ward", patientInformation.ward, fontFamily)}
      {renderListItem("Admission Diagnosis", patientInformation.admissionDiagnosis, fontFamily)}
    </View>
  );
};

export default PatientInfo;
