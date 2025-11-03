/**
 * Patient Information Component
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { getVisiblePatientFields } from "../utils/pdfUtils";

const styles = StyleSheet.create({
  outerContainer: {
    gap: 10,
    marginBottom: 16,
  },

  topBorder: {
    height: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#A2A2A8",
  },

  container: {
    padding: "0 14px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },

  fieldText: {
    flexDirection: "row",
    flexWrap: "wrap",
    lineHeight: 1.8,
    color: "#171725",
  },

  addressText: {
    lineHeight: 2,
    color: "#171725",
  },

  label: {
    fontWeight: 600,
  },

  value: {
    fontWeight: 400,
  },

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
 * @returns {JSX.Element} Patient Info
 */
const PatientInfo = ({ displaySettings, patientData, patientInfoFontSize }) => {
  // if (!displaySettings || !patientData) return null;

  const visibleFields = getVisiblePatientFields(displaySettings, patientData);

  if (visibleFields.length === 0) return null;

  return (
    <View
      style={styles.outerContainer}
      fixed={displaySettings?.showPatientInfo === 1}
    >
      <View style={styles.topBorder} />

      <View style={[styles.container, { fontSize: patientInfoFontSize }]}>
        <View style={{ flex: 0.7 }}>
          {visibleFields.map((item, i) => {
            return (
              i % 2 === 0 && (
                <Text key={`left-${i}`} style={[styles.fieldText]}>
                  <Text style={styles.label}>{item.label}:</Text>
                  <Text style={styles.value}> {item.value}</Text>
                </Text>
              )
            );
          })}
        </View>
        <View style={{ flex: 0.4 }}>
          {visibleFields.map((item, i) => {
            return (
              i % 2 === 1 && (
                <Text key={`right-${i}`} style={[styles.fieldText]}>
                  <Text style={styles.label}>{item.label}:</Text>
                  <Text style={styles.value}> {item.value}</Text>
                </Text>
              )
            );
          })}
        </View>
      </View>

      <View style={styles.bottomBorder} />
    </View>
  );
};

export default PatientInfo;
