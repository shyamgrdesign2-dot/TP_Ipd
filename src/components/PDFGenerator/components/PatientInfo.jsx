/**
 * Patient Information Component
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { getVisiblePatientFields } from "../utils/pdfUtils";

const styles = StyleSheet.create({
  // Outer container with top/bottom borders
  outerContainer: {
    gap: 10,
    alignItems: "center",
    margin: "16px 0",
  },

  // Top border line
  topBorder: {
    height: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#A2A2A8",
  },

  // Patient info container
  container: {
    padding: "0 14px", // padding: 0 14px from Figma
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },

  // Left column
  leftColumn: {
    width: 273,
    gap: 4,
  },

  // Right column
  rightColumn: {
    width: 204,
    gap: 4,
  },

  // Individual field text
  fieldText: {
    fontSize: 10,
    lineHeight: 1.8, // 18px
    color: "#171725",
  },

  // Address field with different line-height
  addressText: {
    fontSize: 10,
    lineHeight: 2, // 20px for address
    color: "#171725",
  },

  // Label (SemiBold)
  label: {
    fontWeight: 600, // SemiBold
  },

  // Value (Regular)
  value: {
    fontWeight: 400, // Regular
  },

  // Bottom border line
  bottomBorder: {
    height: 0,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#A2A2A8",
  },
});

/**
 * PatientInfo Component - Exact Figma Design Match
 * @param {Object} props - Component props
 * @param {Object} props.displaySettings - Display patient info settings
 * @param {Object} props.patientData - Patient data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Patient Info
 */
const PatientInfo = ({
  displaySettings,
  patientData,
  fontFamily = "Poppins",
}) => {
  // if (!displaySettings || !patientData) return null;

  // Check if patient info should be shown
  // if (displaySettings.showPatientInfo === 0) return null;

  const visibleFields = getVisiblePatientFields(displaySettings, patientData);

  if (visibleFields.length === 0) return null;

  // Separate fields by column based on order
  const leftColumnFields = [];
  const rightColumnFields = [];

  visibleFields.forEach((field) => {
    if (field.column === "left") {
      leftColumnFields.push(field);
    } else if (field.column === "right") {
      rightColumnFields.push(field);
    }
  });

  return (
    <View style={styles.outerContainer}>
      {/* Top Border */}
      <View style={styles.topBorder} />

      {/* Patient Info Content */}
      <View style={styles.container}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          {leftColumnFields.map((field, index) => {
            const isAddress = field.label === "Address";
            return (
              <Text
                key={`left-${index}`}
                style={[
                  isAddress ? styles.addressText : styles.fieldText,
                  { fontFamily },
                ]}
              >
                <Text style={styles.label}>{field.label}:</Text>
                <Text style={styles.value}> {field.value}</Text>
              </Text>
            );
          })}
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {rightColumnFields.map((field, index) => (
            <Text
              key={`right-${index}`}
              style={[styles.fieldText, { fontFamily }]}
            >
              <Text style={styles.label}>{field.label}:</Text>
              <Text style={styles.value}> {field.value}</Text>
            </Text>
          ))}
        </View>
      </View>

      {/* Bottom Border */}
      <View style={styles.bottomBorder} />
    </View>
  );
};

export default PatientInfo;
