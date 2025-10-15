/**
 * Physical Examination Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { isEmptyRichText } from "../../../utils/pdfUtils";
import SlateToPdf from "../../../components/SlateToPdf";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    marginBottom: 8,
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

  // Nested bullet list (second level)
  nestedBulletList: {
    paddingLeft: 30,
  },

  // Bullet list item
  bulletItem: {
    flexDirection: "row",
    marginBottom: 0,
  },

  // Bullet marker
  bullet: {
    width: 12,
    fontSize: 10,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  // Bullet content
  bulletContent: {
    flex: 1,
    fontSize: 10,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  // Examination label (SemiBold)
  examinationLabel: {
    fontWeight: 600, // SemiBold
  },

  // Notes label (Medium)
  notesLabel: {
    fontWeight: 500, // Medium
  },

  // Regular text
  regularText: {
    fontWeight: 400,
  },
});

/**
 * Render Vitals inline
 */
const renderVitals = (vitals, fontFamily) => {
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
      <Text style={styles.vitalsTitle}>Vitals: </Text>
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
 * Render General Examination
 */
const renderGeneralExamination = (examination, fontFamily) => {
  if (!examination) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          General Examination:
        </Text>
        <View style={styles.bulletList}>
          {Object.entries(examination).map(([key, value]) => {
            if (!value || !value.title) return null;

            const label = key
              .replace(/_/g, "/")
              .split("/")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join("/");

              const hasNotes = value.notes && !isEmptyRichText(value.notes);

            return (
              <View key={key}>
                <View style={styles.bulletItem}>
                  <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                  <Text style={[styles.bulletContent, { fontFamily }]}>
                    <Text style={styles.examinationLabel}>{label}:</Text>
                    <Text style={styles.regularText}> {value.title}</Text>
                  </Text>
                </View>
                {hasNotes && (
                  <View style={styles.nestedBulletList}>
                    <View style={styles.bulletItem}>
                      <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                      <View style={[styles.bulletContent]}>
                        <Text style={[styles.notesLabel, { fontFamily }]}>Notes: </Text>
                        {typeof value.notes === "string" ? (
                          <Text style={[styles.regularText, { fontFamily }]}>
                            {value.notes}
                          </Text>
                        ) : (
                          <SlateToPdf 
                            nodes={Array.isArray(value.notes) ? value.notes : [value.notes]}
                            fontFamily={fontFamily}
                            customStyles={{
                              text: { fontSize: 10, color: "#454551", lineHeight: 1.8 },
                              paragraph: { marginBottom: 2 },
                              bulletList: { paddingLeft: 15, marginBottom: 2 },
                              numberedList: { paddingLeft: 15, marginBottom: 2 },
                              bulletItem: { marginBottom: 2 },
                              numberedItem: { marginBottom: 2 },
                              bulletSymbol: { width: 12, fontSize: 10, color: "#454551", fontWeight: 400, lineHeight: 1.8 },
                              numberedSymbol: { width: 15, fontSize: 10, color: "#454551", fontWeight: 400, lineHeight: 1.8 },
                              bulletText: { fontSize: 10, flex: 1, color: "#454551", fontWeight: 400, lineHeight: 1.8, textTransform: "capitalize" },
                              numberedText: { fontSize: 10, flex: 1, color: "#454551", fontWeight: 400, lineHeight: 1.8, textTransform: "capitalize" }
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Others section
 */
const renderOthers = (others, fontFamily) => {
  if (!others || isEmptyRichText(others)) return null;

  // Custom styles for SlateToPdf to match existing styling
  const customStyles = {
    text: {
      fontSize: 10,
      color: "#454551",
      lineHeight: 1.8,
    },
    paragraph: { 
      marginBottom: 0 
    },
    bulletList: { 
      paddingLeft: 0 
    },
    numberedList: { 
      paddingLeft: 0 
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 0,
    },
    numberedItem: {
      flexDirection: "row", 
      marginBottom: 0,
    },
    bulletSymbol: {
      width: 12,
      fontSize: 10,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
    },
    numberedSymbol: {
      width: 15,
      fontSize: 10,
      color: "#454551", 
      fontWeight: 400,
      lineHeight: 1.8,
    },
    bulletText: {
      fontSize: 10,
      flex: 1,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
      textTransform: "capitalize",
    },
    numberedText: {
      fontSize: 10,
      flex: 1,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
      textTransform: "capitalize",
    }
  };

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>Others:</Text>
        <View style={styles.bulletList}>
          <SlateToPdf 
            nodes={Array.isArray(others) ? others : [others]}
            fontFamily={fontFamily}
            customStyles={customStyles}
          />
        </View>
      </View>
    </View>
  );
};

/**
 * PhysicalExamination Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Physical examination data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Physical Examination Section
 */
const PhysicalExamination = ({ data, fontFamily = "Poppins" }) => {
  if (!data?.physicalExamination) return null;

  const { physicalExamination } = data;

  return (
    <View style={styles.mainContainer}>
      {/* Vitals - Inline format */}
      {physicalExamination.vitals &&
        renderVitals(physicalExamination.vitals, fontFamily)}

      {/* General Examination */}
      {physicalExamination.generalExamination &&
        renderGeneralExamination(physicalExamination.generalExamination, fontFamily)}

      {/* Others */}
      {physicalExamination.others &&
        renderOthers(physicalExamination.others, fontFamily)}
    </View>
  );
};

export default PhysicalExamination;
