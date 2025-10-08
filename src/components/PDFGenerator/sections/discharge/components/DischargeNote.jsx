/**
 * Discharge Note Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { isEmptyRichText } from "../../../utils/pdfUtils";
import { renderRichText } from "../../../utils/richTextRenderer";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    marginBottom: 8,
  },

  // Subsection container
  subsectionContainer: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },

  // Content container
  contentContainer: {
    gap: 4,
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
  },

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

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
  },

  bulletItem: {
    flexDirection: "row",
    marginBottom: 0,
  },

  bullet: {
    width: 12,
    fontSize: 10,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  bulletContent: {
    flex: 1,
    fontSize: 10,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

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
});

/**
 * Render Discharge Vitals inline
 */
const renderDischargeVitals = (vitals, fontFamily) => {
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

  return (
    <Text style={[styles.vitalsText, { fontFamily }]}>
      <Text style={styles.vitalsTitle}>Discharge Vitals: </Text>
      {vitalFields.map((field, index) => {
        if (!field.value) return null;
        return (
          <React.Fragment key={`vital-${index}`}>
            {index > 0 && <Text style={styles.separator}> | </Text>}
            <Text style={styles.vitalLabel}>{field.label}:</Text>
            <Text style={styles.vitalValue}>
              {" "}
              {field.value}
              {field.unit}{" "}
            </Text>
          </React.Fragment>
        );
      })}
    </Text>
  );
};

/**
 * Render Patient Condition
 */
const renderPatientCondition = (condition, fontFamily) => {
  if (!condition || isEmptyRichText(condition)) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Patient's Condition During Discharge:
        </Text>
        <View style={styles.bulletList}>
          {renderRichText(condition, {
            text: {
              fontSize: 10,
              fontFamily,
              color: "#454551",
              lineHeight: 1.8,
            },
            paragraph: { marginBottom: 0 },
          })}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Discharge Medication Table
 */
const renderDischargeMedicationTable = (medications, fontFamily) => {
  if (!medications || medications.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.medicationTableContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Discharge Medication:
        </Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
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
              style={[
                styles.cellBase,
                styles.cellNote,
                { borderRightWidth: 0 },
              ]}
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
    </View>
  );
};

/**
 * DischargeNote Component - Exact Figma Match
 * @param {Object} props - Component props
 * @param {Object} props.data - Discharge note data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Discharge Note Section
 */
const DischargeNote = ({ data, fontFamily = "Poppins" }) => {
  if (!data?.dischargeNotes) return null;

  const notes = data.dischargeNotes;

  return (
    <View style={styles.mainContainer}>
      {/* Discharge Vitals - Inline */}
      {notes.dischargeVitals &&
        renderDischargeVitals(notes.dischargeVitals, fontFamily)}

      {/* Patient Condition */}
      {notes.patientCondition &&
        renderPatientCondition(notes.patientCondition, fontFamily)}

      {/* Discharge Medication Table */}
      {notes.dischargeMedications &&
        renderDischargeMedicationTable(notes.dischargeMedications, fontFamily)}
    </View>
  );
};

export default DischargeNote;
