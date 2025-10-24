/**
 * Medication Table Component
 * Reusable component for rendering medication tables in PDF
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // Medication table
  medicationTableContainer: {
    gap: 6,
  },

  table: {
    borderWidth: 0.607,
    borderColor: "#F1F1F5",
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#FAFAFB",
    height: 30,
    borderBottomWidth: 0.607,
    borderBottomColor: "#F1F1F5",
  },

  tableRow: {
    flexDirection: "row",
    height: 48,
    borderBottomWidth: 0.607,
    borderBottomColor: "#F1F1F5",
  },

  // Table cells
  cellBase: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 6.681,
    paddingVertical: 9.11,
    borderRightWidth: 0.607,
    borderRightColor: "#F1F1F5",
  },

  cellMedicineName: {
    minWidth: 145.762,
    flexDirection: "column",
    gap: 2,
  },

  cellNote: {
    minWidth: 121.468,
  },

  // Header text
  headerText: {
    fontSize: 8.503,
    fontWeight: 600, // SemiBold
    color: "#171725",
    lineHeight: 1.286, // 10.932 / 8.503
    letterSpacing: 0.0607,
    textTransform: "uppercase",
  },

  // Cell text - Medicine name
  medicineName: {
    fontSize: 10,
    fontWeight: 500, // Medium
    color: "#454551",
    lineHeight: 1.2754, // 12.754 / 10
    letterSpacing: 0.0607,
  },

  // Cell text - Generic name
  genericName: {
    fontSize: 8.503,
    fontWeight: 400, // Regular
    color: "#454551",
    lineHeight: 1.5, // 12.754 / 8.503
    letterSpacing: 0.0607,
  },

  // Cell text - Regular data
  cellText: {
    fontSize: 10,
    fontWeight: 400, // Regular
    color: "#454551",
    lineHeight: 1.822, // 18.22 / 10
  },

  // Cell text - Small note
  cellTextSmall: {
    fontSize: 8.503,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 2.14, // 18.22 / 8.503
    opacity: 0.9,
  },

  // Title
  title: {
    color: "#171725",
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
  },

  // Container
  container: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
});

/**
 * MedicationTable Component
 * @param {Object} props - Component props
 * @param {Array} props.medications - Array of medication objects
 * @param {string} props.fontFamily - Font family
 * @param {string} props.title - Title for the medication table
 * @param {boolean} props.showContainer - Whether to show container padding
 * @returns {JSX.Element} Medication Table
 */
const MedicationTable = ({
  medications,
  fontFamily = "Poppins",
  title = "Medication (Rx)",
  showContainer = true,
}) => {
  if (!medications || medications.length === 0) return null;

  const tableContent = (
    <View style={styles.medicationTableContainer}>
      {title && <Text style={[styles.title, { fontFamily }]}>{title}:</Text>}

      <View style={styles.table}>
        {/* Table Header */}
        <View fixed style={styles.tableHeader}>
          <View style={[styles.cellBase, styles.cellMedicineName]}>
            <Text style={[styles.headerText, { fontFamily }]}>
              MEDICINE NAME
            </Text>
          </View>
          <View style={styles.cellBase}>
            <Text style={[styles.headerText, { fontFamily }]}>
              UNIT PER DOSE
            </Text>
          </View>
          <View style={styles.cellBase}>
            <Text style={[styles.headerText, { fontFamily }]}>FREQUENCY</Text>
          </View>
          <View style={styles.cellBase}>
            <Text style={[styles.headerText, { fontFamily }]}>WHEN</Text>
          </View>
          <View style={styles.cellBase}>
            <Text style={[styles.headerText, { fontFamily }]}>DURATION</Text>
          </View>
          <View
            style={[styles.cellBase, styles.cellNote, { borderRightWidth: 0 }]}
          >
            <Text style={[styles.headerText, { fontFamily }]}>NOTE</Text>
          </View>
        </View>

        {/* Table Rows */}
        {medications.map((med, index) => (
          <View
            key={`med-${index}`}
            style={[
              styles.tableRow,
              index === medications.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            {/* Medicine Name with Generic */}
            <View style={[styles.cellBase, styles.cellMedicineName]}>
              <Text style={[styles.medicineName, { fontFamily }]}>
                {med.tmm_medicine_name}
              </Text>
              {med.tmm_generic && (
                <Text style={[styles.genericName, { fontFamily }]}>
                  {med.tmm_generic}
                </Text>
              )}
            </View>

            {/* Unit Per Dose */}
            <View style={styles.cellBase}>
              <Text style={[styles.cellText, { fontFamily }]}>
                {med.tmm_dosage || med.tmm_unit || "1"}{" "}
                {med.tmm_unit_name || "Tablets"}
              </Text>
            </View>

            {/* Frequency */}
            <View style={styles.cellBase}>
              <Text style={[styles.cellText, { fontFamily }]}>
                {med.tmm_freq_type_name || "-"}
              </Text>
            </View>

            {/* When */}
            <View style={styles.cellBase}>
              <Text style={[styles.cellText, { fontFamily }]}>
                {med.tmm_time_name || "-"}
              </Text>
            </View>

            {/* Duration */}
            <View style={styles.cellBase}>
              <Text style={[styles.cellText, { fontFamily }]}>
                {med.tmm_days_duration_type || med.tmm_days || "-"}
              </Text>
            </View>

            {/* Note */}
            <View
              style={[
                styles.cellBase,
                styles.cellNote,
                { borderRightWidth: 0 },
              ]}
            >
              <Text style={[styles.cellTextSmall, { fontFamily }]}>
                {med.tmm_remarks || "-"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Return with or without container padding
  return showContainer ? (
    <View style={styles.container}>{tableContent}</View>
  ) : (
    tableContent
  );
};

export default MedicationTable;
