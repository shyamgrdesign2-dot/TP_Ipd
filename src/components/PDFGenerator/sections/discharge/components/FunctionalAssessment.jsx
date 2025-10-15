/**
 * Functional Assessment Section
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

  // Inline assessment text
  assessmentText: {
    fontSize: 10,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  assessmentLabel: {
    fontWeight: 600, // SemiBold
  },

  assessmentValue: {
    fontWeight: 400, // Regular
  },

  separator: {
    color: "#A2A2A8",
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
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  // Referral text
  referralText: {
    fontSize: 10,
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  referralLabel: {
    fontWeight: 600, // SemiBold
    color: "#171725",
  },

  referralValue: {
    fontWeight: 400, // Regular
    color: "#454551",
  },
});

/**
 * Render Functional Assessment inline
 */
const renderFunctionalAssessmentInline = (assessment, fontFamily) => {
  if (!assessment) return null;

  const fields = [
    { label: "Bed Activity", value: assessment.bedActivity },
    { label: "Sitting", value: assessment.sitting },
    { label: "Standing", value: assessment.standing },
    { label: "Ambulation", value: assessment.ambulation },
    { label: "Stair Climbing", value: assessment.stairClimbing },
    { label: "Bed Sore on Admission", value: assessment.bedSoreOnAdmission },
  ];

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Functional Assessment:
        </Text>
        <Text style={[styles.assessmentText, { fontFamily }]}>
          {fields.map((field, index) => {
            if (!field.value) return null;
            return (
              <React.Fragment key={`field-${index}`}>
                {index > 0 && <Text style={styles.separator}> | </Text>}
                <Text style={styles.assessmentLabel}>{field.label}:</Text>
                <Text style={styles.assessmentValue}> {field.value} </Text>
              </React.Fragment>
            );
          })}
        </Text>
      </View>
    </View>
  );
};

/**
 * Render Others section
 */
const renderOthers = (others, fontFamily) => {
  if (!others || isEmptyRichText(others)) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>Others:</Text>
        <View style={styles.bulletList}>
          {renderRichText(others, {
            text: {
              fontSize: 10,
              fontFamily,
              color: "#454551",
              lineHeight: 1.8,
            },
            paragraph: { marginBottom: 0 },
            listItem: {
              flexDirection: "row",
              marginBottom: 0,
            },
          })}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Referral
 */
const renderReferral = (referralDoctor, fontFamily) => {
  if (!referralDoctor) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.referralText, { fontFamily }]}>
          <Text style={styles.referralLabel}>
            Referred to Physiotherapy for Review
          </Text>
          <Text style={styles.referralLabel}>: </Text>
          <Text style={styles.referralValue}>{referralDoctor}</Text>
        </Text>
      </View>
    </View>
  );
};

/**
 * FunctionalAssessment Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Functional assessment data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Functional Assessment Section
 */
const FunctionalAssessment = ({ data, fontFamily = "Poppins" }) => {
  if (!data?.functionalAssessmentTimeOfAdmission) return null;

  const assessment = data.functionalAssessmentTimeOfAdmission;

  return (
    <View style={styles.mainContainer}>
      {/* Functional Assessment - Inline format */}
      {renderFunctionalAssessmentInline(assessment?.assessment, fontFamily)}

      {/* Others */}
      {assessment.others && renderOthers(assessment.others, fontFamily)}

      {/* Referral */}
      {assessment.referralDoctor &&
        renderReferral(assessment.referralDoctor, fontFamily)}
    </View>
  );
};

export default FunctionalAssessment;
