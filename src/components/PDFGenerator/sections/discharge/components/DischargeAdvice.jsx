/**
 * Discharge Advice Section
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import {
  getAllVisibleSections,
  isEmptyRichText,
} from "../../../utils/pdfUtils";
import { renderRichText } from "../../../utils/richTextRenderer";
import SectionTitle from "../../SectionTitle";
import RichTextPrintRenderer from "./richTextPrintRenderer";
import { Text } from "../../../components/MultilingualText";

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
    gap: 2,
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 2,
  },
  subsectionTitle2: {
    color: "#171725",
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    // marginBottom: 2,
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
});

/**
 * Render Diet subsection
 */
const renderDiet = (diet) => {
  if (!diet || diet.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle2]}>Diet:</Text>
        <View style={styles.bulletList}>
          {diet.map((item, index) => (
            <View key={`diet-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet]}>•</Text>
              <Text style={[styles.bulletContent]}>
                {item.name}
                {item.note ? ` (Notes: ${item.note})` : ""}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Physical Activity subsection
 */
const renderPhysicalActivity = (activities) => {
  if (!activities || activities.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle2]}>Physical Activity:</Text>
        <View style={styles.bulletList}>
          {activities.map((item, index) => (
            <View key={`activity-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet]}>•</Text>
              <Text style={[styles.bulletContent]}>
                {item.name}
                {item.note ? ` (Notes: ${item.note})` : ""}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Other Advice subsection
 */
const renderOtherAdvice = (otherAdvice) => {
  if (!otherAdvice || isEmptyRichText(otherAdvice)) return null;

  return (
    <View style={styles.subsectionContainer}>
      <RichTextPrintRenderer data={otherAdvice} title="Other Advice:" />
    </View>
  );
};

/**
 * Render Warning Signs subsection
 */
const renderWarningSigns = (warningSigns) => {
  if (!warningSigns || isEmptyRichText(warningSigns)) return null;
  return (
    <View style={styles.subsectionContainer}>
      <RichTextPrintRenderer
        data={warningSigns}
        title={"When to Obtain Urgent Care:"}
      />
    </View>
  );
};

const renderPreventiveMeasures = (preventiveMeasures) => {
  if (!preventiveMeasures) return null;
  return (
    <View style={styles.subsectionContainer}>
      <RichTextPrintRenderer
        data={preventiveMeasures}
        title="Preventive Measures"
      />
    </View>
  );
};

/**
 * Render Emergency Contact subsection
 */
const renderEmergencyContact = (emergencyContact) => {
  if (!emergencyContact || isEmptyRichText(emergencyContact)) return null;

  return (
    <View style={styles.subsectionContainer}>
      <RichTextPrintRenderer
        data={emergencyContact}
        title="Emergency Contact:"
      />
    </View>
  );
};

/**
 * DischargeAdvice Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Discharge advice data
 * @returns {JSX.Element} Discharge Advice Section
 */
const DischargeAdvice = ({ data, title, formatSettings }) => {
  if (!data?.dischargeAdvice) return null;

  const advice = data.dischargeAdvice;

  const dischargeAdviceSection = formatSettings.find(
    (section) => section.id === "dischargeAdvice"
  );
  const subsections = dischargeAdviceSection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  if (
    (!advice.diet?.length || !sortedSubsections.some((s) => s.id === "diet")) &&
    (!advice.physicalActivities?.length ||
      !sortedSubsections.some((s) => s.id === "physicalActivities")) &&
    (isEmptyRichText(advice.otherAdvice) ||
      !sortedSubsections.some((s) => s.id === "otherAdvice")) &&
    (isEmptyRichText(advice.warningSigns) ||
      !sortedSubsections.some((s) => s.id === "warningSigns")) &&
    (isEmptyRichText(advice.preventiveMeasures) ||
      !sortedSubsections.some((s) => s.id === "preventiveMeasures")) &&
    (isEmptyRichText(advice.emergencyContact) ||
      !sortedSubsections.some((s) => s.id === "emergencyContact"))
  )
    return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title={title} />
      <View style={styles.mainContainer}>
        {sortedSubsections.map((subSection) => {
          return (
            <View key={subSection.id}>
              {subSection.id === "diet" &&
                advice.diet.length &&
                renderDiet(advice.diet)}
              {subSection.id === "physicalActivities" &&
                advice.physicalActivities?.length &&
                renderPhysicalActivity(advice.physicalActivities)}
              {subSection.id === "otherAdvice" &&
                !isEmptyRichText(advice.otherAdvice) &&
                renderOtherAdvice(advice.otherAdvice)}
              {subSection.id === "warningSigns" &&
                !isEmptyRichText(advice.warningSigns) &&
                renderWarningSigns(advice.warningSigns)}
              {subSection.id === "preventiveMeasures" &&
                !isEmptyRichText(advice.preventiveMeasures) &&
                renderPreventiveMeasures(advice.preventiveMeasures)}
              {subSection.id === "emergencyContact" &&
                !isEmptyRichText(advice.emergencyContact) &&
                renderEmergencyContact(advice.emergencyContact)}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DischargeAdvice;
