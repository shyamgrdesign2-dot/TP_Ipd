/**
 * OT Notes Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    // marginBottom: 8,
  },

  // Surgery subsection container
  surgeryContainer: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },

  // Content container
  contentContainer: {
    gap: 4,
  },

  // Surgery number title
  surgeryTitle: {
    color: "#171725",
    fontWeight: 600, // SemiBold
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
    lineHeight: 2.2, // 22px for 10px font (different from other sections)
  },

  // Bullet content
  bulletContent: {
    flex: 1,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 2.2, // 22px for 10px font
    textTransform: "capitalize",
  },

  // Field label (Medium weight)
  fieldLabel: {
    fontWeight: 500, // Medium
  },

  // Regular text
  regularText: {
    fontWeight: 400,
  },
});

/**
 * Extract text from rich text format
 */
const extractRichText = (content) => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((node) => node.children?.map((child) => child.text).join(""))
      .join(" ");
  }
  return "";
};

/**
 * OTNotes Component
 * @param {Object} props - Component props
 * @param {Object} props.data - OT notes data
 * @returns {JSX.Element} OT Notes Section
 */
const OTNotes = ({ data }) => {
  if (!data?.otNotes?.surgeries || data.otNotes.surgeries.length === 0)
    return null;

  const { surgeries } = data.otNotes;

  return (
    <View style={styles.mainContainer}>
      {surgeries.map((surgery, index) => {
        // Extract rich text content
        const operativeFindings = extractRichText(surgery.operativeFindings);
        const procedure = extractRichText(surgery.procedure);

        return (
          <View key={`surgery-${index}`} style={styles.surgeryContainer}>
            <View style={styles.contentContainer}>
              {/* Surgery number title */}
              <Text style={[styles.surgeryTitle]}>Surgery {index + 1}:</Text>

              {/* Surgery details as bullet list */}
              <View style={styles.bulletList}>
                {/* Surgery/Procedure Name */}
                {surgery.procedureName && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>
                        Surgery/Procedure Name:{" "}
                      </Text>
                      <Text style={styles.regularText}>
                        {Array.isArray(surgery.procedureName)
                          ? surgery.procedureName.join(", ")
                          : surgery.procedureName}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Date Of Surgery */}
                {surgery.dateOfSurgery && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>Date Of Surgery: </Text>
                      <Text style={styles.regularText}>
                        {surgery.dateOfSurgery}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Duration */}
                {surgery.surgeryStartTime && surgery.surgeryEndTime && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>Duration: </Text>
                      <Text style={styles.regularText}>
                        {surgery.surgeryStartTime} - {surgery.surgeryEndTime}
                        {surgery.duration ? ` (${surgery.duration})` : ""}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Primary Surgeon */}
                {surgery.surgeon && surgery.surgeon.length > 0 && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>Primary Surgeon: </Text>
                      <Text style={styles.regularText}>
                        {surgery.surgeon[0]?.name || surgery.surgeon[0]}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Secondary Surgeon */}
                {surgery.surgeon && surgery.surgeon.length > 1 && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>Secondary Surgeon: </Text>
                      <Text style={styles.regularText}>
                        {surgery.surgeon
                          .slice(1)
                          .map((s) => s.name || s)
                          .join(", ")}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Assistant */}
                {surgery.assistant && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>Assistant: </Text>
                      <Text style={styles.regularText}>
                        {surgery.assistant}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Anaesthetist */}
                {surgery.anaesthetist && surgery.anaesthetist.length > 0 && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>Anaesthetist: </Text>
                      <Text style={styles.regularText}>
                        {surgery.anaesthetist
                          .map((a) => a.name || a)
                          .join(", ")}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Scrub Nurse */}
                {surgery.scrubNurse && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>Scrub Nurse: </Text>
                      <Text style={styles.regularText}>
                        {surgery.scrubNurse}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Floor/Circulating Nurse */}
                {surgery.circulatingNurse && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>
                        Floor/ Circulating Nurse:{" "}
                      </Text>
                      <Text style={styles.regularText}>
                        {surgery.circulatingNurse}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Operative Findings */}
                {operativeFindings && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>
                        Operative Findings:{" "}
                      </Text>
                      <Text style={styles.regularText}>
                        {operativeFindings}
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Procedure */}
                {procedure && (
                  <View style={styles.bulletItem}>
                    <Text style={[styles.bullet]}>•</Text>
                    <Text style={[styles.bulletContent]}>
                      <Text style={styles.fieldLabel}>Procedure: </Text>
                      <Text style={styles.regularText}>{procedure}</Text>
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default OTNotes;
