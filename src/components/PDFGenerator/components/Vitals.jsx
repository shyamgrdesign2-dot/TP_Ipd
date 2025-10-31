/**
 * Vitals Component
 * Reusable component for rendering vitals in PDF
 */

import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  vitalsText: {
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
    paddingVertical: 6,
    gap: 4,
  },

  vitalsTitle: {
    fontWeight: 600,
    color: "#171725",
  },

  vitalLabel: {
    fontWeight: 500,
  },

  vitalValue: {
    fontWeight: 400,
  },

  separator: {
    color: "#A2A2A8",
  },

  bulletItem: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    marginBottom: 3,
    marginLeft: 14,
  },

  bulletSymbol: {
    width: 12,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },
});

/**
 * Vitals Component
 * @param {Object} props - Component props
 * @param {Object} props.vitals - Vitals data
 * @param {string} props.title - Title for vitals section (e.g., "Vitals", "Discharge Vitals")
 * @returns {JSX.Element} Vitals inline display
 */
const Vitals = ({ vitals, title = "Vitals" }) => {
  if (!vitals) return null;

  const vitalFields = [
    { label: "Pulse", value: vitals.pulse, unit: "/min" },
    { label: "BP", value: vitals.bloodPressure, unit: "mmHg" },
    { label: "Temperature", value: vitals.temperature, unit: "F" },
    { label: "Spo2", value: vitals.spo2, unit: "%" },
    { label: "RR", value: vitals.respiratoryRate, unit: "breaths/min" },
    { label: "Weight", value: vitals.weight, unit: "kg" },
    { label: "Height", value: vitals.height, unit: "cms" },
    { label: "General Rbs", value: vitals.generalRBS, unit: "mg/dl" },
  ];

  const activeFields = vitalFields.filter((field) => field.value);

  if (activeFields.length === 0) return null;

  return (
    <View style={[styles.vitalsText]}>
      <Text style={styles.vitalsTitle}>{title}: </Text>
      <View style={[styles.bulletItem]}>
        <Text style={[styles.bulletSymbol]}>{"•"}</Text>
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
      </View>
    </View>
  );
};

export default Vitals;
