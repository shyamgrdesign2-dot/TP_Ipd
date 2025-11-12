/**
 * Course in Hospital Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { formatDate } from "../../../utils/pdfUtils";
import SectionTitle from "../../SectionTitle";
import { getAllVisibleSections } from "../../../utils/pdfUtils";
import RichTextPrintRenderer from "./richTextPrintRenderer";
import { CHRONOLOGY_LAST_PARAGRAPH } from "../../../../../utils/locale";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    // marginBottom: 8,
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
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
  },

  subsectionText: {
    color: "#171725",
    fontWeight: 400,
    lineHeight: 1.8,
    // textTransform: "capitalize",
    marginBottom: 4,
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
  },

  // Bullet list item
  bulletItem: {
    flexDirection: "row",
    marginBottom: 4,
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
    fontWeight: 600, // Medium
    textDecoration: "underline",
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

  const isInitialGeneratedState = summary?.[0]?.day || summary?.[0]?.date;

  if (isInitialGeneratedState) {
    return (
      <View style={styles.subsectionContainer}>
        <View style={styles.contentContainer}>
          {/* <Text style={[styles.subsectionTitle]}>Chronological Summary:</Text> */}
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
  } else {
    return <RichTextPrintRenderer data={summary} />;
  }
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
        <Text style={[styles.subsectionText]}>{CHRONOLOGY_LAST_PARAGRAPH}</Text>
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
const CourseInHospital = ({ data, title, formatSettings }) => {
  if (!data?.courseInHospital) return null;

  const course = data.courseInHospital;

  const courseInHospitalSection = formatSettings.find(
    (section) => section.id === "courseInHospital"
  );
  const subsections = courseInHospitalSection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  const hasChronologicalSummary = sortedSubsections.some(
    (sub) =>
      sub.id === "chronologicalSummary" &&
      course.chronologicalSummary &&
      course.chronologicalSummary.length > 0
  );
  const hasTreatmentGiven = sortedSubsections.some(
    (sub) =>
      sub.id === "treatmentsGiven" &&
      course.treatmentGiven &&
      course.treatmentGiven.length > 0
  );

  if (!hasChronologicalSummary && !hasTreatmentGiven) {
    return null;
  }

  return (
    <View style={styles.sectionContainer} break>
      <SectionTitle title={title} />
      <View style={styles.mainContainer}>
        {sortedSubsections.map((subsection) => {
          const key = subsection.id;
          if (
            key === "chronologicalSummary" &&
            course.chronologicalSummary &&
            course.chronologicalSummary.length > 0
          ) {
            return renderChronologicalSummary(course.chronologicalSummary);
          }
          if (
            key === "treatmentsGiven" &&
            course.treatmentGiven &&
            course.treatmentGiven.length > 0
          ) {
            return renderTreatmentGiven(course.treatmentGiven);
          }
        })}
      </View>
    </View>
  );
};

export default CourseInHospital;
