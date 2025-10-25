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
    fontSize: 14,
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
    fontSize: 11,
    fontWeight: 700,
    color: "#333333",
  },

  doctorInfo: {
    fontSize: 10,
    fontWeight: 450,
    color: "#666666",
  },

  cardContent: {
    padding: 12,
    // borderTop: "1px solid #E0E0E0",
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 4,
    marginTop: 8,
  },

  sectionContent: {
    fontSize: 9,
    color: "#000000",
    marginLeft: 8,
    lineHeight: 1.4,
  },

  bulletPoint: {
    fontSize: 9,
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
const renderProgressNoteEntry = (entry, fontFamily) => {
  if (!entry) return null;
  return <ProgressNoteEntry key={`entry-${entry.dateTime}`} entry={entry} fontFamily={fontFamily} />;
};

/**
 * Render progress notes by date
 */
const renderProgressNotesByDate = (data, fontFamily) => {
  if (!data?.progressNotes || !Array.isArray(data.progressNotes)) return null;

  // Group progress notes by date
  const notesByDate = data.progressNotes.reduce((acc, note) => {
    const date = new Date(note.dateTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(note);
    return acc;
  }, {});

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(notesByDate).sort((a, b) => 
    new Date(b) - new Date(a)
  );

  return (
    <View style={styles.sectionContainer}>
      {sortedDates.map((date) => (
        <View key={`date-${date}`}>
          {/* Date Header */}
          {/* <Text style={[styles.dateHeader, { fontFamily }]}>
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text> */}
          
          {/* Progress Notes Cards for this date */}
          {notesByDate[date]
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            .map((note) => (
              <View key={`note-${note.dateTime}`} style={styles.noteCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Text style={[styles.timeInfo, { fontFamily }]}>
                    {note.timeOfDay} - {formatDateTime(note.dateTime)}
                  </Text>
                  <Text style={[styles.doctorInfo, { fontFamily }]}>
                    Filled By: {note.filledBy}
                  </Text>
                </View>
                
                {/* Card Content */}
                <View style={styles.cardContent}>
                  {/* Chief Complaint */}
                  {note.chiefComplaint && note.chiefComplaint.trim() && (
                    <View>
                      <Text style={[styles.sectionTitle, { fontFamily }]}>
                        Chief Complaint:
                      </Text>
                      <Text style={[styles.sectionContent, { fontFamily }]}>
                        {note.chiefComplaint}
                      </Text>
                    </View>
                  )}
                  
                  {/* Findings */}
                  {note.findings && note.findings.trim() && (
                    <View>
                      <Text style={[styles.sectionTitle, { fontFamily }]}>
                        Findings:
                      </Text>
                      <Text style={[styles.sectionContent, { fontFamily }]}>
                        {note.findings}
                      </Text>
                    </View>
                  )}
                  
                  {/* Vitals */}
                  {note.vitals && note.vitals.trim() && (
                    <View>
                      <Text style={[styles.sectionTitle, { fontFamily }]}>
                        Vitals:
                      </Text>
                      <Text style={[styles.sectionContent, { fontFamily }]}>
                        {note.vitals}
                      </Text>
                    </View>
                  )}
                  
                  {/* Additional Remarks */}
                  {note.additionalRemarks && note.additionalRemarks.trim() && (
                    <View>
                      <Text style={[styles.sectionTitle, { fontFamily }]}>
                        Additional Remarks:
                      </Text>
                      <Text style={[styles.sectionContent, { fontFamily }]}>
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
const renderProgressNotesSummary = (data, fontFamily) => {
  if (!data?.progressNotesSummary) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Progress Notes Summary" fontFamily={fontFamily} />
      <ProgressNotesSummary data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Render patient information section
 */
const renderPatientInfo = (data, fontFamily) => {
  if (!data?.patientInformation) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Patient Information" fontFamily={fontFamily} />
      <PatientInfo data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Render attending physician information
 */
const renderAttendingPhysician = (data, fontFamily) => {
  if (!data?.attendingPhysician) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Attending Physician" fontFamily={fontFamily} />
      <AttendingPhysician data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Main Progress Notes Renderer
 * @param {Object} data - Progress notes data
 * @param {Object} formatSettings - Format settings
 * @param {string} fontFamily - Font family
 * @returns {Array} Array of section components
 */
export const renderProgressNotes = (data, formatSettings, fontFamily) => {

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
    progressNotesByDate: () => renderProgressNotesByDate(data, fontFamily),
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
