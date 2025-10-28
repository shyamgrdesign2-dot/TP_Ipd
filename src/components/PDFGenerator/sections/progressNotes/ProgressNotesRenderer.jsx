/**
 * Progress Notes Renderer
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import SectionTitle from "../SectionTitle";
import { renderSimpleText, renderListItem } from "../ListViewRenderer";
import { getSortedSections } from "../../utils/pdfUtils";
import ProgressNoteEntry from "./components/ProgressNoteEntry";
import PatientInfo from "./components/PatientInfo";
import AttendingPhysician from "./components/AttendingPhysician";
import ProgressNotesSummary from "./components/ProgressNotesSummary";

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },

  dateHeader: {
    fontWeight: 700,
    color: "#000000",
    marginBottom: 12,
    marginTop: 8,
  },

  noteCard: {
    // border: "1px solid #E0E0E0",
    // borderRadius: 8,
    // marginBottom: 16,
    // backgroundColor: "#FFFFFF",
  },

  cardHeader: {
    backgroundColor: "#F1F1F5",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeInfo: {
    fontWeight: 700,
    color: "#333333",
  },

  doctorInfo: {
    fontWeight: 450,
    color: "#666666",
  },

  cardContent: {
    padding: 12,
    // borderTop: "1px solid #E0E0E0",
  },

  sectionTitle: {
    fontWeight: 700,
    color: "#000000",
    marginBottom: 4,
    marginTop: 8,
  },

  sectionContent: {
    color: "#000000",
    marginLeft: 8,
    lineHeight: 1.4,
  },

  bulletPoint: {
    color: "#333333",
    marginLeft: 4,
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
 * Render a single progress note entry
 */
const renderProgressNoteEntry = (entry) => {
  if (!entry) return null;
  return <ProgressNoteEntry key={`entry-${entry.dateTime}`} entry={entry} />;
};

/**
 * Render progress notes by date
 */
const renderProgressNotesByDate = (data) => {
  const progressNotes = data?.progressNotesData?.progressNotes;
  if (!progressNotes || !Array.isArray(progressNotes)) return null;

  // Group progress notes by date
  const notesByDate = progressNotes.reduce((acc, note) => {
    const date = new Date(note.dateTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(note);
    return acc;
  }, {});

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(notesByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <View style={styles.sectionContainer}>
      {sortedDates.map((date) => (
        <View key={`date-${date}`}>
          {/* Progress Notes Cards for this date */}
          {notesByDate[date]
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            .map((note) => (
              <View key={`note-${note.dateTime}`} style={styles.noteCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Text style={[styles.timeInfo]}>
                    {note.timeOfDay} - {formatDateTime(note.dateTime)}
                  </Text>
                  <Text style={[styles.doctorInfo]}>
                    Filled By: {note.filledBy}
                  </Text>
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  {/* Chief Complaint */}
                  {note.chiefComplaint && note.chiefComplaint.trim() && (
                    <View>
                      <Text style={[styles.sectionTitle]}>
                        Chief Complaint:
                      </Text>
                      <Text style={[styles.sectionContent]}>
                        {note.chiefComplaint}
                      </Text>
                    </View>
                  )}

                  {/* Findings */}
                  {note.findings && note.findings.trim() && (
                    <View>
                      <Text style={[styles.sectionTitle]}>Findings:</Text>
                      <Text style={[styles.sectionContent]}>
                        {note.findings}
                      </Text>
                    </View>
                  )}

                  {/* Vitals */}
                  {note.vitals && note.vitals.trim() && (
                    <View>
                      <Text style={[styles.sectionTitle]}>Vitals:</Text>
                      <Text style={[styles.sectionContent]}>{note.vitals}</Text>
                    </View>
                  )}

                  {/* Additional Remarks */}
                  {note.additionalRemarks && note.additionalRemarks.trim() && (
                    <View>
                      <Text style={[styles.sectionTitle]}>
                        Additional Remarks:
                      </Text>
                      <Text style={[styles.sectionContent]}>
                        {note.additionalRemarks}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
        </View>
      ))}
    </View>
  );
};

/**
 * Render progress notes summary
 */
const renderProgressNotesSummary = (data) => {
  if (!data?.progressNotesSummary) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Progress Notes Summary" />
      <ProgressNotesSummary data={data} />
    </View>
  );
};

/**
 * Render patient information section
 */
const renderPatientInfo = (data) => {
  if (!data?.patientInformation) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Patient Information" />
      <PatientInfo data={data} />
    </View>
  );
};

/**
 * Render attending physician information
 */
const renderAttendingPhysician = (data) => {
  if (!data?.attendingPhysician) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Attending Physician" />
      <AttendingPhysician data={data} />
    </View>
  );
};

/**
 * Main Progress Notes Renderer
 * @param {Object} data - Progress notes data
 * @param {Object} formatSettings - Format settings
 * @returns {Array} Array of section components
 */
export const renderProgressNotes = (data, formatSettings) => {
  if (!data) {
    return [];
  }

  // Create default sections if formatSettings is not properly structured
  const defaultSections = [
    { id: "patientInfo", order: 1, visible: true },
    { id: "attendingPhysician", order: 2, visible: true },
    { id: "progressNotesSummary", order: 3, visible: true },
    { id: "progressNotesByDate", order: 4, visible: true },
  ];

  let sectionsToRender = defaultSections;

  // // Try to get sections from formatSettings if it's properly structured
  // if (formatSettings && Array.isArray(formatSettings)) {
  //   sectionsToRender = getSortedSections(formatSettings);
  // } else if (formatSettings && formatSettings.formatStyle) {
  //   // Convert formatStyle object to array format
  //   const sectionsArray = Object.entries(formatSettings.formatStyle).map(([key, value]) => ({
  //     id: key,
  //     order: value.order || 1,
  //     visible: value.visible !== false,
  //   }));
  //   sectionsToRender = getSortedSections(sectionsArray);
  // } else {
  //   console.log("Using default sections:", defaultSections);
  // }

  // Map section keys to render functions
  const sectionRenderers = {
    // patientInfo: () => renderPatientInfo(data, fontFamily),
    // attendingPhysician: () => renderAttendingPhysician(data, fontFamily),
    // progressNotesSummary: () => renderProgressNotesSummary(data, fontFamily),
    progressNotesByDate: () => renderProgressNotesByDate(data),
  };

  // Render sections in order
  const sections = sectionsToRender
    .map((section) => {
      const renderer = sectionRenderers[section.id || section.key];
      if (renderer) {
        const renderedSection = renderer();
        return renderedSection;
      }
      return null;
    })
    .filter(Boolean);

  return sections;
};
