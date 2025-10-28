/**
 * Diagnosis and Surgery Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { getAllVisibleSections } from "../../../utils/pdfUtils";
import SectionTitle from "../../SectionTitle";

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

  // Inner content container
  contentContainer: {
    gap: 4,
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
    marginBottom: 4,
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
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
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
  },
});

/**
 * DiagnosisAndSurgery Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Diagnosis and surgery data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Diagnosis and Surgery Section
 */
const DiagnosisAndSurgery = ({
  data,
  fontFamily = "Poppins",
  isAssessment = false,
  formatSettings,
  title,
}) => {
  if (!data?.diagnosisAndSurgery) return null;

  const { diagnosisAndSurgery } = data;

  const diagnosisAndSurgerySection = formatSettings.find(
    (section) =>
      section.id ===
      (isAssessment ? "provisionalDiagnosis" : "diagnosisAndSurgery")
  );
  const subsections = diagnosisAndSurgerySection?.subSections || [];
  const sortedSubsections = getAllVisibleSections(subsections);

  const hasAnyData = sortedSubsections.some((sub) => {
    const field = sub.id;
    if (
      field === "finalDiagnosis" &&
      diagnosisAndSurgery.finalDiagnosis &&
      diagnosisAndSurgery.finalDiagnosis.length > 0
    ) {
      return true;
    }
    if (
      field === "provisionalDiagnosis" &&
      diagnosisAndSurgery.provisionalDiagnosis &&
      diagnosisAndSurgery.provisionalDiagnosis.length > 0
    ) {
      return true;
    }
    if (
      field === "surgeriesPerformed" &&
      diagnosisAndSurgery.surgeriesPerformed &&
      diagnosisAndSurgery.surgeriesPerformed.length > 0
    ) {
      return true;
    }
    return false;
  });

  if (!hasAnyData) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title={title} fontFamily={fontFamily} />
      <View style={styles.mainContainer}>
        {/* Final Diagnosis */}
        {sortedSubsections.map((subsection) => {
          const key = subsection.id;
          if (
            key === "finalDiagnosis" &&
            diagnosisAndSurgery.finalDiagnosis &&
            diagnosisAndSurgery.finalDiagnosis.length > 0
          ) {
            return (
              <View style={styles.subsectionContainer}>
                <View style={styles.contentContainer}>
                  <Text style={[styles.subsectionTitle, { fontFamily }]}>
                    Final Diagnosis:
                  </Text>
                  <View style={styles.bulletList}>
                    {diagnosisAndSurgery.finalDiagnosis.map((dx, index) => (
                      <View key={`final-dx-${index}`} style={styles.bulletItem}>
                        <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                        <Text style={[styles.bulletContent, { fontFamily }]}>
                          {dx.tds_name}{" "}
                          {dx.icd_code ? `(ICD Code: ${dx.icd_code})` : ""}
                          {dx.notes ? `, Note: ${dx.notes}` : ""}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          }
          if (
            key === "provisionalDiagnosis" &&
            diagnosisAndSurgery.provisionalDiagnosis &&
            diagnosisAndSurgery.provisionalDiagnosis.length > 0
          ) {
            return (
              <View style={styles.subsectionContainer}>
                <View style={styles.contentContainer}>
                  {!isAssessment ? (
                    <Text style={[styles.subsectionTitle, { fontFamily }]}>
                      Provisional Diagnosis:
                    </Text>
                  ) : null}
                  <View style={styles.bulletList}>
                    {diagnosisAndSurgery.provisionalDiagnosis.map(
                      (dx, index) => (
                        <View
                          key={`prov-dx-${index}`}
                          style={styles.bulletItem}
                        >
                          <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                          <Text style={[styles.bulletContent, { fontFamily }]}>
                            {dx.tds_name}{" "}
                            {dx.icd_code ? `(ICD Code: ${dx.icd_code})` : ""}
                            {dx.notes ? `, Note: ${dx.notes}` : ""}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View>
            );
          }
          if (
            key === "surgeriesPerformed" &&
            diagnosisAndSurgery.surgeriesPerformed &&
            diagnosisAndSurgery.surgeriesPerformed.length > 0
          ) {
            return (
              <View style={styles.subsectionContainer}>
                <View style={styles.contentContainer}>
                  <Text style={[styles.subsectionTitle, { fontFamily }]}>
                    Surgeries Performed:
                  </Text>
                  <View style={styles.bulletList}>
                    {diagnosisAndSurgery.surgeriesPerformed.map(
                      (surgery, index) => (
                        <View
                          key={`surgery-${index}`}
                          style={styles.bulletItem}
                        >
                          <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                          <Text style={[styles.bulletContent, { fontFamily }]}>
                            {surgery.procedureName} ({surgery.surgeryDate})
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};

export default DiagnosisAndSurgery;
