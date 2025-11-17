/**
 * Progress Notes Renderer
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import SectionTitle from "../SectionTitle";
import { renderSimpleText, renderListItem } from "../ListViewRenderer";
import { getAllVisibleSections, getSortedSections } from "../../utils/pdfUtils";
import ProgressNoteEntry from "./components/ProgressNoteEntry";
import PatientInfo from "./components/PatientInfo";
import AttendingPhysician from "./components/AttendingPhysician";
import ProgressNotesSummary from "./components/ProgressNotesSummary";
import { renderRichText as renderRichTextUtil } from "../../utils/richTextRenderer";
import Vitals from "../../components/Vitals";
import FilledByCard from "../../components/FilledByCard";
import SlateToPdf from "../../components/SlateToPdf";
import { renderGeneralExamination } from "../discharge/components/PhysicalExamination";

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

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
  },
});

/**
 * Render rich text with title
 */
const renderRichText = (data, title) => {
  console.log(data, title, "renderRichTextData");
  if (!data || !data?.length) return null;

  // Custom styles for SlateToPdf to match existing styling
  const customStyles = {
    text: {
      color: "#454551",
      lineHeight: 1.8,
    },
    paragraph: {
      marginBottom: 0,
    },
    bulletList: {
      paddingLeft: 0,
    },
    numberedList: {
      paddingLeft: 0,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 0,
    },
    numberedItem: {
      flexDirection: "row",
      marginBottom: 0,
    },
    bulletSymbol: {
      width: 12,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
    },
    numberedSymbol: {
      width: 15,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
    },
    bulletText: {
      flex: 1,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
      textTransform: "capitalize",
    },
    numberedText: {
      flex: 1,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
      textTransform: "capitalize",
    },
  };

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>{title}:</Text>
        <View style={styles.bulletList}>
          <SlateToPdf
            nodes={Array.isArray(data) ? data : [data]}
            customStyles={customStyles}
          />
        </View>
      </View>
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
  if (!data || !formatSettings || !data?.progressNotes) return [];

  // Check if data is an array (multiple consultant notes) or single object
  const progressNotesArray = Array.isArray(data?.progressNotes)
    ? data?.progressNotes
    : [data?.progressNotes];

  // Get sorted sections
  const sortedSections = getAllVisibleSections(formatSettings);
  console.log(sortedSections, "sortedSections");

  // Render all consultant notes on the same page
  const allSections = progressNotesArray.map((note, noteIndex) => {
    const progressNotesData = note?.progressNotes || note;
    console.log(progressNotesData, "progressNotesData");

    // Map section keys to render functions (using new array format IDs)
    const sectionRenderers = {
      chiefComplaint: () =>
        renderRichText(progressNotesData.chiefComplaint, "Chief Complaint"),
      findings: () =>
        renderRichText(
          progressNotesData.findings,

          "Findings"
        ),
      vitals: () => <Vitals vitals={progressNotesData.vitals} title="Vitals" />,
      examinations: () =>
        renderGeneralExamination(progressNotesData.examination, {
          label: "Examination",
        }),
      additionalRemarks: () =>
        renderRichText(
          progressNotesData.additionalRemarks,

          "Additional Remarks"
        ),
    };

    // Render sections in order for this note
    const noteSections = sortedSections
      .map((section) => {
        const renderer = sectionRenderers[section.key];
        if (renderer) {
          console.log(renderer, "renderer");
          return renderer();
        }
        return <Text>{""}</Text>;
      })
      .filter(Boolean);

    return (
      <View key={note._id || noteIndex}>
        <FilledByCard filledBy={note.createdByName} filledOn={note.createdAt} />
        {/* Content */}
        {noteSections}
      </View>
    );
  });
  console.log(allSections, "allSections");
  return allSections;
};
