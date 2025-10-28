/**
 * Discharge Note Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { isEmptyRichText } from "../../../utils/pdfUtils";
import { renderRichText } from "../../../utils/richTextRenderer";
import Vitals from "../../../components/Vitals";
import MedicationTable from "../../../components/MedicationTable";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    // marginBottom: 8,
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
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
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
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  bulletContent: {
    flex: 1,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },
});

/**
 * Render Patient Condition
 */
const renderPatientCondition = (condition) => {
  if (!condition || isEmptyRichText(condition)) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>
          Patient's Condition During Discharge:
        </Text>
        <View style={styles.bulletList}>
          {renderRichText(condition, {
            text: {
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
 * DischargeNote Component - Exact Figma Match
 * @param {Object} props - Component props
 * @param {Object} props.data - Discharge note data
 * @returns {JSX.Element} Discharge Note Section
 */
const DischargeNote = ({ data }) => {
  if (!data?.dischargeNotes) return null;

  const notes = data.dischargeNotes;

  return (
    <View style={styles.mainContainer}>
      {/* Discharge Vitals - Inline */}
      <Vitals vitals={notes.dischargeVitals} title="Discharge Vitals" />

      {/* Patient Condition */}
      {notes.patientCondition && renderPatientCondition(notes.patientCondition)}

      {/* Discharge Medication Table */}
      <MedicationTable
        medications={notes.dischargeMedications}
        title="Discharge Medication"
        showContainer={true}
      />
    </View>
  );
};

export default DischargeNote;
