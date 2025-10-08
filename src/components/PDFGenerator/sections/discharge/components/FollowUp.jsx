/**
 * Follow-up Section
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

  // Content container (gap: 2px)
  contentContainer: {
    gap: 2,
  },

  // Inline label-value text
  inlineText: {
    fontSize: 10,
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  inlineLabel: {
    fontWeight: 600, // SemiBold
    color: "#171725",
  },

  inlineValue: {
    fontWeight: 400, // Regular
    color: "#454551",
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 2,
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
});

/**
 * FollowUp Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Follow-up data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Follow-up Section
 */
const FollowUp = ({ data, fontFamily = "Poppins" }) => {
  if (!data?.followUp) return null;

  const followUp = data.followUp;

  return (
    <View style={styles.mainContainer}>
      {/* Follow-up On */}
      {followUp.date && (
        <View style={styles.subsectionContainer}>
          <View style={styles.contentContainer}>
            <Text style={[styles.inlineText, { fontFamily }]}>
              <Text style={styles.inlineLabel}>Follow-up on: </Text>
              <Text style={styles.inlineValue}>{followUp.date}</Text>
            </Text>
          </View>
        </View>
      )}

      {/* Follow-up Doctor */}
      {followUp.doctor && (
        <View style={styles.subsectionContainer}>
          <View style={styles.contentContainer}>
            <Text style={[styles.inlineText, { fontFamily }]}>
              <Text style={styles.inlineLabel}>Follow-up Doctor: </Text>
              <Text style={styles.inlineValue}>
                {followUp.doctor.name}
                {followUp.doctor.role ? ` (${followUp.doctor.role})` : ""}
              </Text>
            </Text>
          </View>
        </View>
      )}

      {/* Additional Notes */}
      {followUp.additionalNotes &&
        !isEmptyRichText(followUp.additionalNotes) && (
          <View style={styles.subsectionContainer}>
            <View style={styles.contentContainer}>
              <Text style={[styles.subsectionTitle, { fontFamily }]}>
                Additional Notes
              </Text>
              <View style={styles.bulletList}>
                {renderRichText(followUp.additionalNotes, {
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
        )}
    </View>
  );
};

export default FollowUp;
