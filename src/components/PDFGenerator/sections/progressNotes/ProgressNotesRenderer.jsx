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
    marginBottom: 12,
  },

  subsectionContainer: {
    marginBottom: 10,
  },

  subsectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 6,
    marginTop: 8,
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
        <View key={`date-${date}`} style={styles.subsectionContainer}>
          <Text style={[styles.subsectionTitle, { fontFamily }]}>
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          {notesByDate[date]
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            .map((note) => renderProgressNoteEntry(note, fontFamily))}
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
  if (!data || !formatSettings) return [];

  // Get sorted sections
  const sortedSections = getSortedSections(formatSettings);

  // Map section keys to render functions
  const sectionRenderers = {
    patientInfo: () => renderPatientInfo(data, fontFamily),
    attendingPhysician: () => renderAttendingPhysician(data, fontFamily),
    progressNotesSummary: () => renderProgressNotesSummary(data, fontFamily),
    progressNotesByDate: () => renderProgressNotesByDate(data, fontFamily),
  };

  // Render sections in order
  const sections = sortedSections
    .map((section) => {
      const renderer = sectionRenderers[section.key];
      if (renderer) {
        return renderer();
      }
      return null;
    })
    .filter(Boolean);

  return sections;
};
