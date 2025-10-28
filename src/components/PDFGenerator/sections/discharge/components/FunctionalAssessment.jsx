/**
 * Functional Assessment Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import {
  getAllVisibleSections,
  isEmptyRichText,
} from "../../../utils/pdfUtils";
import { renderRichText } from "../../../utils/richTextRenderer";

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

  // Inline assessment text
  assessmentText: {
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

  // Referral text
  referralText: {
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
const renderFunctionalAssessmentInline = (assessment) => {
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
        <Text style={[styles.assessmentText]}>
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
const renderOthers = (others) => {
  if (!others || isEmptyRichText(others)) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>Others:</Text>
        <View style={styles.bulletList}>
          {renderRichText(others, {
            text: {
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
const renderReferral = (referralDoctor) => {
  if (!referralDoctor) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.referralText]}>
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
 * @returns {JSX.Element} Functional Assessment Section
 */

function convertToAssessmentStructure(input = {}) {
  const { others = [], ...assessment } = input;
  return { assessment, others };
}

const FunctionalAssessment = ({
  data,
  isAssessment = false,
  formatSettings,
}) => {
  const hasAssessmentData = isAssessment
    ? !!data?.functionalAssessment
    : !!data?.functionalAssessmentTimeOfAdmission;
  if (!hasAssessmentData) return null;

  const assessment = isAssessment
    ? convertToAssessmentStructure(data.functionalAssessment)
    : data.functionalAssessmentTimeOfAdmission;

  const functionalAssessmentSection = formatSettings.find(
    (section) => section.id === "functionalAssessment"
  );
  const subsections = functionalAssessmentSection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  return (
    <View style={styles.mainContainer}>
      {sortedSubsections.map((subsection) => {
        const key = subsection.id;
        if (key === "assessment" && assessment?.assessment) {
          return renderFunctionalAssessmentInline(assessment?.assessment || {});
        }
        if (key === "func-others" && assessment?.others) {
          return renderOthers(assessment.others);
        }
        if (
          key === "referredToPhysiotherapyForReview" &&
          ((isAssessment &&
            assessment?.assessment.referredToPhysiotherapyForReview) ||
            (!isAssessment && data?.referralDoctor))
        ) {
          return renderReferral(
            isAssessment
              ? assessment?.assessment.referredToPhysiotherapyForReview?.name
              : data?.referralDoctor
          );
        }
        return null;
      })}
    </View>
  );
};

export default FunctionalAssessment;
