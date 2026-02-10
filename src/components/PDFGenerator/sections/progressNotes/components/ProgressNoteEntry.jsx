/**
 * Progress Note Entry Component
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { Text } from "../../../components/MultilingualText";

const styles = StyleSheet.create({
  progressNoteEntry: {
    marginBottom: 16,
    border: "1px solid #E5E5E5",
    borderRadius: 8,
    overflow: "hidden",
  },

  entryHeader: {
    backgroundColor: "#F8F9FA",
    padding: "8px 12px",
    borderBottom: "1px solid #E5E5E5",
  },

  entryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#2C3E50",
    marginBottom: 2,
  },

  entrySubtitle: {
    fontSize: 9,
    color: "#6C757D",
    fontWeight: 500,
  },

  entryContent: {
    padding: "12px",
  },

  contentSection: {
    marginBottom: 8,
  },

  contentLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 4,
  },

  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
  },

  bulletMarker: {
    width: 8,
    fontSize: 10,
    color: "#000000",
  },

  bulletText: {
    flex: 1,
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.5,
  },
});

/**
 * Format date and time for display
 */
const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  
  try {
    const date = new Date(dateTime);
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const dateStr = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${dateStr} (${timeStr})`;
  } catch (error) {
    return dateTime;
  }
};

/**
 * Progress Note Entry Component
 * @param {Object} props - Component props
 * @param {Object} props.entry - Progress note entry data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Progress note entry
 */
const ProgressNoteEntry = ({ entry, fontFamily = "Arial" }) => {
  if (!entry) return null;

  const { 
    timeOfDay, 
    dateTime, 
    filledBy, 
    chiefComplaint, 
    findings, 
    vitals, 
    additionalRemarks 
  } = entry;

  return (
    <View style={styles.progressNoteEntry}>
      {/* Entry Header */}
      <View style={styles.entryHeader}>
        <Text style={[styles.entryTitle, { fontFamily }]}>
          {timeOfDay} - {formatDateTime(dateTime)}
        </Text>
        {filledBy && (
          <Text style={[styles.entrySubtitle, { fontFamily }]}>
            Being Filled By: {filledBy}
          </Text>
        )}
      </View>

      {/* Entry Content */}
      <View style={styles.entryContent}>
        {/* Chief Complaint */}
        {chiefComplaint && (
          <View style={styles.contentSection}>
            <Text style={[styles.contentLabel, { fontFamily }]}>
              Chief Complaint:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={[styles.bulletMarker, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletText, { fontFamily }]}>
                {chiefComplaint}
              </Text>
            </View>
          </View>
        )}

        {/* Findings */}
        {findings && (
          <View style={styles.contentSection}>
            <Text style={[styles.contentLabel, { fontFamily }]}>
              Findings:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={[styles.bulletMarker, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletText, { fontFamily }]}>
                {findings}
              </Text>
            </View>
          </View>
        )}

        {/* Vitals */}
        {vitals && (
          <View style={styles.contentSection}>
            <Text style={[styles.contentLabel, { fontFamily }]}>
              Vitals:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={[styles.bulletMarker, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletText, { fontFamily }]}>
                {vitals}
              </Text>
            </View>
          </View>
        )}

        {/* Additional Remarks */}
        {additionalRemarks && (
          <View style={styles.contentSection}>
            <Text style={[styles.contentLabel, { fontFamily }]}>
              Additional Remarks:
            </Text>
            <View style={styles.bulletPoint}>
              <Text style={[styles.bulletMarker, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletText, { fontFamily }]}>
                {additionalRemarks}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProgressNoteEntry;
