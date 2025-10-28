/**
 * Discharge Note Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import {
  getAllVisibleSections,
  isEmptyRichText,
} from "../../../utils/pdfUtils";
import { renderRichText } from "../../../utils/richTextRenderer";
import Vitals from "../../../components/Vitals";
import MedicationTable from "../../../components/MedicationTable";
import SectionTitle from "../../SectionTitle";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    marginBottom: 8,
  },
  sectionContainer: {
    marginBottom: 12,
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
});

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
 * DischargeNote Component - Exact Figma Match
 * @param {Object} props - Component props
 * @param {Object} props.data - Discharge note data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Discharge Note Section
 */
const DischargeNote = ({
  data,
  fontFamily = "Poppins",
  title,
  formatSettings,
}) => {
  if (!data?.dischargeNotes) return null;

  const notes = data.dischargeNotes;

  const otNotesSection = formatSettings.find(
    (section) => section.id === "dischargeNotes"
  );
  const subsections = otNotesSection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  if (
    (!sortedSubsections.some((s) => s.id === "patientCondition") ||
      isEmptyRichText(notes.patientCondition)) &&
    (!sortedSubsections.some((s) => s.id === "dischargeVitals") ||
      !Object.keys(notes.dischargeVitals)?.length ||
      !Object.values(notes.dischargeVitals)?.some((item) => !!item)) &&
    (!sortedSubsections.some((s) => s.id === "dischargeMedications") ||
      !notes.dischargeMedications?.length)
  )
    return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title={title} fontFamily={fontFamily} />
      <View style={styles.mainContainer}>
        {sortedSubsections.map((subSection) => {
          return (
            <View key={subSection.id}>
              {subSection.id === "patientCondition" &&
                renderPatientCondition(notes.patientCondition, fontFamily)}
              {subSection.id === "dischargeVitals" &&
                Object.values(notes.dischargeVitals)?.some(
                  (item) => !!item
                ) && (
                  <Vitals
                    vitals={notes.dischargeVitals}
                    fontFamily={fontFamily}
                    title={subSection.label}
                  />
                )}
              {subSection.id === "dischargeMedications" &&
                notes.dischargeMedications?.length > 0 && (
                  <MedicationTable
                    medications={notes.dischargeMedications}
                    fontFamily={fontFamily}
                    title={subSection.label}
                    showContainer={true}
                  />
                )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DischargeNote;
