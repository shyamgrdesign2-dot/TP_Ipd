/**
 * Patient History Section
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

  // Nested bullet list (second level)
  nestedBulletList: {
    paddingLeft: 30, // 15px additional from first level
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

  // Category name (Medium weight)
  categoryName: {
    fontSize: 10,
    fontWeight: 500, // Medium
    color: "#454551",
    lineHeight: 1.8,
  },

  // Item label (Medium weight for bold parts)
  itemLabel: {
    fontWeight: 500, // Medium
  },

  // Regular text
  regularText: {
    fontWeight: 400,
  },

  // Separator pipe
  separator: {
    color: "#A2A2A8",
  },
});

/**
 * Render Presenting Complaints
 */
const renderPresentingComplaints = (complaints, fontFamily) => {
  if (!complaints || complaints.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Presenting Complaints:
        </Text>
        <View style={styles.bulletList}>
          {complaints.map((complaint, index) => (
            <View key={`complaint-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletContent, { fontFamily }]}>
                {typeof complaint === "string" ? complaint : complaint.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Past Medical History with nested structure
 */
const renderPastMedicalHistory = (history, fontFamily) => {
  if (!history || history.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Past Medical History:
        </Text>
        <View style={styles.bulletList}>
          {history.map((historyGroup, idx) => {
            const tags = historyGroup.tags?.filter((tag) => tag.enable === "Y");
            if (!tags || tags.length === 0) return null;

            return (
              <View key={`history-${idx}`}>
                {/* Category name */}
                <View style={styles.bulletItem}>
                  <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                  <Text style={[styles.categoryName, { fontFamily }]}>
                    {historyGroup.title}:
                  </Text>
                </View>

                {/* Nested items */}
                <View style={styles.nestedBulletList}>
                  {tags.map((tag, tagIdx) => (
                    <View key={`tag-${tagIdx}`} style={styles.bulletItem}>
                      <Text style={[styles.bullet, { fontFamily }]}>•</Text>
                      <Text style={[styles.bulletContent, { fontFamily }]}>
                        <Text style={styles.itemLabel}>{tag.title}</Text>
                        {(tag.since || tag.status || tag.note) && (
                          <Text style={styles.regularText}> (</Text>
                        )}
                        {tag.since && (
                          <>
                            <Text style={styles.itemLabel}>Since:</Text>
                            <Text style={styles.regularText}> {tag.since}</Text>
                          </>
                        )}
                        {tag.since && (tag.status || tag.note) && (
                          <Text style={styles.separator}> | </Text>
                        )}
                        {tag.status && (
                          <>
                            <Text style={styles.itemLabel}>Status:</Text>
                            <Text style={styles.regularText}>
                              {" "}
                              {tag.status}
                            </Text>
                          </>
                        )}
                        {tag.status && tag.note && (
                          <Text style={styles.separator}> | </Text>
                        )}
                        {tag.note && (
                          <>
                            <Text style={styles.itemLabel}>Note:</Text>
                            <Text style={styles.regularText}> {tag.note}</Text>
                          </>
                        )}
                        {(tag.since || tag.status || tag.note) && (
                          <Text style={styles.regularText}>)</Text>
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

/**
 * Render Gynec History
 */
const renderGynecHistory = (gynecData, fontFamily) => {
  if (!gynecData) return null;

  const items = [];

  // Menarche
  if (gynecData.ageAtMenarche) {
    items.push({
      label: "Menarche",
      parts: [{ label: "Age at", value: `${gynecData.ageAtMenarche} years` }],
    });
  }

  // Cycle
  if (gynecData.cycle || gynecData.intervalOfCycle || gynecData.cycleNotes) {
    const parts = [];
    if (gynecData.cycle) {
      parts.push({ label: "Type", value: gynecData.cycle });
    }
    if (gynecData.intervalOfCycle) {
      parts.push({
        label: "Cycle Interval",
        value: `${gynecData.intervalOfCycle} days`,
      });
    }
    if (gynecData.cycleNotes) {
      parts.push({ label: "Cycle Note", value: gynecData.cycleNotes });
    }
    if (parts.length > 0) {
      items.push({ label: "Cycle", parts });
    }
  }

  // Flow
  if (gynecData.flow || gynecData.numberOfPadsPerDay) {
    const parts = [];
    if (gynecData.flow) {
      parts.push({ label: "Volume", value: gynecData.flow });
    }
    if (gynecData.numberOfPadsPerDay) {
      parts.push({
        label: "Number of pads per day",
        value: gynecData.numberOfPadsPerDay,
      });
    }
    if (parts.length > 0) {
      items.push({ label: "Flow", parts });
    }
  }

  // Pain
  if (gynecData.pain || gynecData.occurrenceOfPain) {
    const parts = [];
    if (gynecData.pain) {
      parts.push({ label: "Level", value: gynecData.pain });
    }
    if (gynecData.occurrenceOfPain) {
      parts.push({
        label: "Occurrence of pain",
        value: gynecData.occurrenceOfPain,
      });
    }
    if (parts.length > 0) {
      items.push({ label: "Pain", parts });
    }
  }

  // Lifecycle Hormonal Changes
  if (
    gynecData.reproductiveLifeStages ||
    gynecData.ageAtMenopause ||
    gynecData.typeOfMenopause ||
    gynecData.reproductiveNotes
  ) {
    const parts = [];
    if (gynecData.reproductiveLifeStages && gynecData.ageAtMenopause) {
      parts.push({
        label: `${gynecData.reproductiveLifeStages} at`,
        value: `${gynecData.ageAtMenopause} years`,
      });
    }
    if (gynecData.typeOfMenopause) {
      parts.push({
        label: `${gynecData.reproductiveLifeStages} type`,
        value: gynecData.typeOfMenopause,
      });
    }
    if (gynecData.reproductiveNotes) {
      parts.push({
        label: `${gynecData.reproductiveLifeStages} note`,
        value: gynecData.reproductiveNotes,
      });
    }
    if (parts.length > 0) {
      items.push({ label: "Lifecycle Hormonal Changes", parts });
    }
  }

  // Menstruation notes
  if (gynecData.menarcheNotes) {
    items.push({
      label: "Menstruation notes",
      singleValue: gynecData.menarcheNotes,
    });
  }

  if (items.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle, { fontFamily }]}>
          Gynec History:
        </Text>
        <View style={styles.bulletList}>
          {items.map((item, index) => (
            <View key={`gynec-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet, { fontFamily }]}>•</Text>
              <Text style={[styles.bulletContent, { fontFamily }]}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.singleValue ? (
                  <Text style={styles.regularText}> ({item.singleValue})</Text>
                ) : (
                  <>
                    <Text style={styles.regularText}> (</Text>
                    {item.parts.map((part, partIdx) => (
                      <React.Fragment key={`part-${partIdx}`}>
                        {partIdx > 0 && (
                          <Text style={styles.separator}> | </Text>
                        )}
                        <Text style={styles.itemLabel}>{part.label}:</Text>
                        <Text style={styles.regularText}> {part.value}</Text>
                      </React.Fragment>
                    ))}
                    <Text style={styles.regularText}>)</Text>
                  </>
                )}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * PatientHistory Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Patient history data
 * @param {Object} props.formatSettings - Format settings for subsections
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Patient History Section
 */
const PatientHistory = ({ data, formatSettings, fontFamily = "Poppins" }) => {
  if (!data?.patientHistory) return null;

  const { patientHistory } = data;
  const subsections = formatSettings?.patientHistory || {};

  // Sort subsections
  const sortedSubsections = Object.entries(subsections)
    .filter(([key]) => key !== "settings")
    .map(([key, value]) => ({ key, ...value }))
    .filter((section) => section.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <View style={styles.mainContainer}>
      {sortedSubsections.map((subsection) => {
        const key = subsection.key;

        // Presenting Complaints
        if (
          key === "presentingComplaints" &&
          patientHistory.presentingComplaints
        ) {
          return renderPresentingComplaints(
            Array.isArray(patientHistory.presentingComplaints)
              ? patientHistory.presentingComplaints
              : [patientHistory.presentingComplaints],
            fontFamily
          );
        }

        // Past Medical History
        if (key === "pastMedicalHistory" && patientHistory.pastMedicalHistory) {
          return renderPastMedicalHistory(
            patientHistory.pastMedicalHistory,
            fontFamily
          );
        }

        // Gynec History
        if (key === "gyneacHistory" && patientHistory.gyneacHistory) {
          return renderGynecHistory(patientHistory.gyneacHistory, fontFamily);
        }

        return null;
      })}
    </View>
  );
};

export default PatientHistory;
