/**
 * Referral Information Section for Cross Referral
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
import moment from "moment";
import { Text } from "../../../components/MultilingualText";

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
    gap: 2,
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    // fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 2,
  },

  // Inline label-value row
  inlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },

  // Label text (bold)
  labelText: {
    // fontSize: 10,
    fontWeight: 600,
    color: "#171725",
    lineHeight: 1.8,
  },

  // Value text (regular)
  valueText: {
    // fontSize: 10,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
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
    // fontSize: 10,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  // Bullet content
  bulletContent: {
    flex: 1,
    // fontSize: 10,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },
});

/**
 * Render Referred By subsection
 */
const renderReferredBy = (referredBy, fontFamily) => {
  if (!referredBy || !referredBy.name) return null;

  return (
    <Text style={[styles.inlineRow, { fontFamily }]}>
      <Text style={styles.labelText}>Referred by: </Text>
      <Text style={styles.valueText}>{referredBy.name}</Text>
    </Text>
  );
};

/**
 * Render Referred To subsection
 */
const renderReferredTo = (referredTo, fontFamily, status) => {
  if (!referredTo || !referredTo.name) return null;

  return (
    <Text style={[styles.inlineRow, { fontFamily }]}>
      <Text style={styles.labelText}>, Referred to: </Text>
      <Text style={styles.valueText}>{referredTo.name}</Text>
      {status === "cancelled" && (
        <Text
          style={[
            styles.valueText,
            {
              color: "#DC2626",
              fontWeight: 600,
              marginLeft: 8,
              backgroundColor: "#FEE2E2",
              padding: "2px 8px",
              borderRadius: 4,
            },
          ]}
        >
          (Cancelled)
        </Text>
      )}
    </Text>
  );
};

/**
 * Render Referred Department subsection
 */
const renderReferredDepartment = (referredDepartment, fontFamily) => {
  if (!referredDepartment) return null;

  return (
    <Text style={[styles.inlineRow, { fontFamily }]}>
      <Text style={styles.labelText}>, Referred Department: </Text>
      <Text style={styles.valueText}>{referredDepartment}</Text>
    </Text>
  );
};

/**
 * Render Reason for Referral subsection
 */
const renderReasonForReferral = (reasonForReferral, fontFamily) => {
  if (!reasonForReferral) return null;

  // Handle rich text format
  if (Array.isArray(reasonForReferral) && !isEmptyRichText(reasonForReferral)) {
    return (
      <View style={styles.subsectionContainer}>
        <View style={styles.contentContainer}>
          <Text style={[styles.subsectionTitle, { fontFamily }]}>
            Reason for Referral:
          </Text>
          <View style={styles.bulletList}>
            {renderRichText(reasonForReferral, {
              text: {
                // fontSize: 10,
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
  }

  // Handle string format
  if (typeof reasonForReferral === "string" && reasonForReferral.trim()) {
    return (
      <View style={styles.subsectionContainer}>
        <View style={styles.contentContainer}>
          <Text style={[styles.subsectionTitle, { fontFamily }]}>
            Reason for Referral:
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bullet, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletContent, { fontFamily }]}>
                {reasonForReferral}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return null;
};

/**
 * Render Relatives Informed subsection
 */
const renderRelativesInformed = (relativesInformed, fontFamily) => {
  if (!relativesInformed) return null;

  const { informedByDoctor, informedTo, informedOnDate } = relativesInformed;

  if (!informedByDoctor || !informedTo || !informedOnDate) return null;

  const formattedDate = moment(informedOnDate).format("DD MMM YYYY , hh:mmA");
  const informedText = `${informedByDoctor?.name} informed ${informedTo} regarding the cross reference on ${formattedDate}.`;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Relatives Informed Regarding the cross reference:
        </Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={[styles.bullet, { fontFamily }]}>•</Text>
            <Text style={[styles.bulletContent, { fontFamily }]}>
              {informedText}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * ReferralInformation Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Referral information data
 * @param {string} props.fontFamily - Font family
 * @param {string} props.title - Section title
 * @param {Object} props.formatSettings - Format settings
 * @returns {JSX.Element} Referral Information Section
 */
const ReferralInformation = ({
  data,
  fontFamily = "Poppins",
  title,
  formatSettings,
  status,
}) => {
  //   if (!data?.referralInformation) return null;

  const referralInfo = data;

  // Get subsections from formatSettings
  const referralInfoSection = formatSettings.find(
    (section) => section.id === "referralInformation"
  );
  const subsections = referralInfoSection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  // Check if any data exists
  const hasData =
    (referralInfo.relativesInformed?.informedByDoctor?.name &&
      sortedSubsections.some((s) => s.id === "referredBy")) ||
    (referralInfo.referringTo?.name &&
      sortedSubsections.some((s) => s.id === "referringTo")) ||
    (referralInfo.referringDepartment &&
      sortedSubsections.some((s) => s.id === "referringDepartment")) ||
    (referralInfo.reasonForReferral &&
      !isEmptyRichText(referralInfo.reasonForReferral) &&
      sortedSubsections.some((s) => s.id === "reasonForReferral")) ||
    (referralInfo.relativesInformed?.informedTo &&
      sortedSubsections.some((s) => s.id === "informedToRelativesAt"));

  if (!hasData) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title={title} fontFamily={fontFamily} />
      <View
      //    style={styles.mainContainer}
      >
        <View style={[styles.inlineRow, { fontFamily, gap: 1 }]}>
          {sortedSubsections.some((s) => s.id === "referredBy") &&
            referralInfo.relativesInformed?.informedByDoctor?.name &&
            renderReferredBy(
              referralInfo.relativesInformed?.informedByDoctor,
              fontFamily
            )}
          {sortedSubsections.some((s) => s.id === "referringTo") &&
            referralInfo.referringTo?.name &&
            renderReferredTo(referralInfo.referringTo, fontFamily, status)}
          {sortedSubsections.some((s) => s.id === "referringDepartment") &&
            referralInfo.referringDepartment &&
            renderReferredDepartment(
              referralInfo.referringDepartment,
              fontFamily
            )}
        </View>
        {sortedSubsections.map((subSection) => {
          return (
            <View key={subSection.id}>
              {subSection.id === "reasonForReferral" &&
                referralInfo.reasonForReferral &&
                !isEmptyRichText(referralInfo.reasonForReferral) &&
                renderReasonForReferral(
                  referralInfo.reasonForReferral,
                  fontFamily
                )}
              {subSection.id === "informedToRelativesAt" &&
                referralInfo.relativesInformed &&
                renderRelativesInformed(
                  referralInfo.relativesInformed,
                  fontFamily
                )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ReferralInformation;
