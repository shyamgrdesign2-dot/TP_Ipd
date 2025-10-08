/**
 * Diagnosis and Surgery Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

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
const DiagnosisAndSurgery = ({ data, fontFamily = "Poppins" }) => {
  if (!data?.diagnosisAndSurgery) return null;

  const { diagnosisAndSurgery } = data;

  return (
    <View style={styles.mainContainer}>
      {/* Final Diagnosis */}
      {diagnosisAndSurgery.finalDiagnosis &&
        diagnosisAndSurgery.finalDiagnosis.length > 0 && (
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
                      {dx.title} (ICD Code: {dx.icdCode}
                      {dx.notes ? `, Note: ${dx.notes}` : ""})
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

      {/* Provisional Diagnosis */}
      {diagnosisAndSurgery.provisionalDiagnosis &&
        diagnosisAndSurgery.provisionalDiagnosis.length > 0 && (
          <View style={styles.subsectionContainer}>
            <View style={styles.contentContainer}>
              <Text style={[styles.subsectionTitle, { fontFamily }]}>
                Provisional Diagnosis:
              </Text>
              <View style={styles.bulletList}>
                {diagnosisAndSurgery.provisionalDiagnosis.map((dx, index) => (
                  <View key={`prov-dx-${index}`} style={styles.bulletItem}>
                    <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                    <Text style={[styles.bulletContent, { fontFamily }]}>
                      {dx.title} (ICD Code: {dx.icdCode}
                      {dx.notes ? `, Note: ${dx.notes}` : ""})
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

      {/* Surgeries Performed */}
      {diagnosisAndSurgery.surgeriesPerformed &&
        diagnosisAndSurgery.surgeriesPerformed.length > 0 && (
          <View style={styles.subsectionContainer}>
            <View style={styles.contentContainer}>
              <Text style={[styles.subsectionTitle, { fontFamily }]}>
                Surgeries Performed:
              </Text>
              <View style={styles.bulletList}>
                {diagnosisAndSurgery.surgeriesPerformed.map(
                  (surgery, index) => (
                    <View key={`surgery-${index}`} style={styles.bulletItem}>
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
        )}
    </View>
  );
};

export default DiagnosisAndSurgery;
