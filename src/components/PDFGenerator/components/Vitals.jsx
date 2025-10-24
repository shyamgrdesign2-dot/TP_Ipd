/**
 * Vitals Component
 * Reusable component for rendering vitals in PDF
 */

import React from "react";
import { Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // Vitals inline text
  vitalsText: {
    fontSize: 10,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  vitalsTitle: {
    fontWeight: 600, // SemiBold
    color: "#171725",
  },

  vitalLabel: {
    fontWeight: 500, // Medium
  },

  vitalValue: {
    fontWeight: 400, // Regular
  },

  separator: {
    color: "#A2A2A8",
  },
});

/**
 * Vitals Component
 * @param {Object} props - Component props
 * @param {Object} props.vitals - Vitals data
 * @param {string} props.fontFamily - Font family
 * @param {string} props.title - Title for vitals section (e.g., "Vitals", "Discharge Vitals")
 * @returns {JSX.Element} Vitals inline display
 */
const Vitals = ({ vitals, fontFamily = "Poppins", title = "Vitals" }) => {
  if (!vitals) return null;

  const vitalFields = [
    { label: "Pulse", value: vitals.pulse, unit: "T" },
    { label: "BP", value: vitals.bloodPressure, unit: "" },
    { label: "Temperature", value: vitals.temperature, unit: "Frh" },
    { label: "Spo2", value: vitals.spo2, unit: "%" },
    { label: "RR", value: vitals.respiratoryRate, unit: "/min" },
    { label: "Weight", value: vitals.weight, unit: "Kg" },
    { label: "Height", value: vitals.height, unit: "cms" },
    { label: "General Rbs", value: vitals.generalRBS, unit: "mg/Dl" },
  ];

  // Filter out fields with no value
  const activeFields = vitalFields.filter((field) => field.value);

  // Don't render if no vitals have values
  if (activeFields.length === 0) return null;

  return (
    <Text style={[styles.vitalsText, { fontFamily }]}>
      <Text style={styles.vitalsTitle}>{title}: </Text>
      {activeFields.map((field, index) => (
        <React.Fragment key={`vital-${field.label}`}>
          {index > 0 && <Text style={styles.separator}> | </Text>}
          <Text style={styles.vitalLabel}>{field.label}:</Text>
          <Text style={styles.vitalValue}>
            {" "}
            {field.value}
            {field.unit}{" "}
          </Text>
        </React.Fragment>
      ))}
    </Text>
  );
};

export default Vitals;
