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
    minHeight: 30,
    borderBottomWidth: 0.607,
    borderBottomColor: "#F1F1F5",
  },

  tableRow: {
    flexDirection: "row",
    minHeight: 48,
    borderBottomWidth: 0.607,
    borderBottomColor: "#F1F1F5",
  },

  // Table cells
  cellBase: {
    flex: 1,
    justifyContent: "flex-start",
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
    fontWeight: 600, // SemiBold
    color: "#171725",
    lineHeight: 1.286, // 10.932 / 8.503
    letterSpacing: 0.0607,
    textTransform: "uppercase",
    flexWrap: "wrap",
  },

  // Cell text - Medicine name
  medicineName: {
    fontWeight: 500, // Medium
    color: "#454551",
    lineHeight: 1.2754, // 12.754 / 10
    letterSpacing: 0.0607,
    flexWrap: "wrap",
  },

  // Cell text - Generic name
  genericName: {
    fontSize: 8,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.5,
    letterSpacing: 0.0607,
    flexWrap: "wrap",
  },

  // Cell text - Regular data
  cellText: {
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.822,
    flexWrap: "wrap",
  },

  // Cell text - Small note
  cellTextSmall: {
    fontSize: 8,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 2.14,
    opacity: 0.9,
    flexWrap: "wrap",
  },

  // Title
  title: {
    color: "#171725",
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
 * @param {string} props.title - Title for the medication table
 * @param {boolean} props.showContainer - Whether to show container padding
 * @returns {JSX.Element} Medication Table
 */
const MedicationTable = ({
  medications,
  title = "Medication (Rx)",
  showContainer = true,
}) => {
  if (!medications || medications.length === 0) return null;

  const tableContent = (
    <View style={styles.medicationTableContainer}>
      {title && <Text style={[styles.title]}>{title}:</Text>}

      <View style={styles.table}>
        {/* Table Header */}
        <View fixed style={styles.tableHeader}>
          <View style={[styles.cellBase, styles.cellMedicineName]}>
            <Text style={[styles.headerText]}>MEDICINE NAME</Text>
          </View>
          <View style={styles.cellBase}>
            <Text style={[styles.headerText]}>UNIT PER DOSE</Text>
          </View>
          <View style={styles.cellBase}>
            <Text style={[styles.headerText]}>FREQUENCY</Text>
          </View>
          <View style={styles.cellBase}>
            <Text style={[styles.headerText]}>WHEN</Text>
          </View>
          <View style={styles.cellBase}>
            <Text style={[styles.headerText]}>DURATION</Text>
          </View>
          <View
            style={[styles.cellBase, styles.cellNote, { borderRightWidth: 0 }]}
          >
            <Text style={[styles.headerText]}>NOTE</Text>
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
              <Text style={[styles.medicineName]}>{med.tmm_medicine_name}</Text>
              {med.tmm_generic && (
                <Text style={[styles.genericName]}>{med.tmm_generic}</Text>
              )}
            </View>

            {/* Unit Per Dose */}
            <View style={styles.cellBase}>
              <Text style={[styles.cellText]}>
                {med.tmm_dosage || med.tmm_unit || "1"}{" "}
                {med.tmm_unit_name || "Tablets"}
              </Text>
            </View>

            {/* Frequency */}
            <View style={styles.cellBase}>
              <Text style={[styles.cellText]}>
                {med.tmm_freq_type_name || "-"}
              </Text>
            </View>

            {/* When */}
            <View style={styles.cellBase}>
              <Text style={[styles.cellText]}>{med.tmm_time_name || "-"}</Text>
            </View>

            {/* Duration */}
            <View style={styles.cellBase}>
              <Text style={[styles.cellText]}>
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
              <Text style={[styles.cellTextSmall]}>
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
