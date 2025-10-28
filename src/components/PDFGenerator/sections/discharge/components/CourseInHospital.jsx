/**
 * Course in Hospital Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { formatDate } from "../../../utils/pdfUtils";

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

  // Bullet list item
  bulletItem: {
    flexDirection: "row",
    marginBottom: 0,
  },

  // Bullet marker
  bullet: {
    width: 12,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  // Bullet content
  bulletContent: {
    flex: 1,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  // Day label (Medium/SemiBold)
  dayLabel: {
    fontWeight: 500, // Medium
  },

  // Regular text
  regularText: {
    fontWeight: 400,
  },
});

/**
 * Render Chronological Summary
 */
const renderChronologicalSummary = (summary) => {
  if (!summary || summary.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>Chronological Summary:</Text>
        <View style={styles.bulletList}>
          {summary.map((entry, index) => {
            // Extract text from rich text format
            let entryText = "";
            if (entry && entry.children && Array.isArray(entry.children)) {
              entryText = entry.children?.map((child) => child.text).join("");
            } else if (typeof entry === "string") {
              entryText = entry;
            }

            return (
              <View key={`chron-${index}`} style={styles.bulletItem}>
                <Text style={[styles.bullet]}>•</Text>
                <Text style={[styles.bulletContent]}>
                  <Text style={styles.dayLabel}>
                    {entry.day} ({formatDate(entry.date)})
                  </Text>
                  <Text style={styles.regularText}>: {entryText}</Text>
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Treatment Given
 */
const renderTreatmentGiven = (treatments) => {
  if (!treatments || treatments.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>Treatment Given:</Text>
        <View style={styles.bulletList}>
          {treatments.map((treatment, index) => (
            <View key={`treatment-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet]}>•</Text>
              <Text style={[styles.bulletContent]}>{treatment.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * CourseInHospital Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Course in hospital data
 * @returns {JSX.Element} Course in Hospital Section
 */
const CourseInHospital = ({ data }) => {
  if (!data?.courseInHospital) return null;

  const course = data.courseInHospital;

  return (
    <View style={styles.mainContainer}>
      {/* Chronological Summary */}
      {course.chronologicalSummary &&
        renderChronologicalSummary(course.chronologicalSummary)}

      {/* Treatment Given */}
      {course.treatmentGiven && renderTreatmentGiven(course.treatmentGiven)}
    </View>
  );
};

export default CourseInHospital;
