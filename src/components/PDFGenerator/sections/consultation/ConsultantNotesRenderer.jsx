import Vitals from "../../components/Vitals";
import MedicationTable from "../../components/MedicationTable";
import LabInvestigationTable from "../../components/LabInvestigationTable";
import { getAllVisibleSections, isEmptyRichText } from "../../utils/pdfUtils";
import SlateToPdf from "../../components/SlateToPdf";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import FilledByCard from "../../components/FilledByCard";

const styles = StyleSheet.create({
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
    fontSize: 10,
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

const renderRichText = (data, fontFamily, title) => {
  if (!data || isEmptyRichText(data)) return null;

  // Custom styles for SlateToPdf to match existing styling
  const customStyles = {
    text: {
      fontSize: 10,
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
      fontSize: 10,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
    },
    numberedSymbol: {
      width: 15,
      fontSize: 10,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
    },
    bulletText: {
      fontSize: 10,
      flex: 1,
      color: "#454551",
      fontWeight: 400,
      lineHeight: 1.8,
      textTransform: "capitalize",
    },
    numberedText: {
      fontSize: 10,
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
        <Text style={[styles.subsectionTitle, { fontFamily }]}>{title}:</Text>
        <View style={styles.bulletList}>
          <SlateToPdf
            nodes={Array.isArray(data) ? data : [data]}
            fontFamily={fontFamily}
            customStyles={customStyles}
          />
        </View>
      </View>
    </View>
  );
};

export const renderConsultantNotes = (data, formatSettings, fontFamily) => {
  if (!data || !formatSettings || !data.consultantNotes) return [];

  // Check if data is an array (multiple consultant notes) or single object
  const consultantNotesArray = Array.isArray(data.consultantNotes)
    ? data.consultantNotes
    : [data.consultantNotes];

  // Get sorted sections
  const sortedSections = getAllVisibleSections(formatSettings);

  // Render all consultant notes on the same page
  const allSections = consultantNotesArray.map((note, noteIndex) => {
    const consultationData = note?.consultationNotes || note;

    // Map section keys to render functions (using new array format IDs)
    const sectionRenderers = {
      clinicalAssessmentPlan: () =>
        renderRichText(
          consultationData.clinicalAssessmentPlan,
          fontFamily,
          "Clinical Assessment & Plan"
        ),
      vitals: () => (
        <Vitals
          vitals={consultationData.vitals}
          fontFamily={fontFamily}
          title="Vitals"
        />
      ),
      medication: () => (
        <MedicationTable
          medications={
            consultationData.medication || consultationData.currentMedication
          }
          fontFamily={fontFamily}
          title="Medication (Rx)"
        />
      ),
      labInvestigation: () => (
        <LabInvestigationTable
          investigations={consultationData.labInvestigation}
          fontFamily={fontFamily}
          title="Lab Investigation"
        />
      ),
      additionalRemarks: () =>
        renderRichText(
          consultationData.additionalRemarks,
          fontFamily,
          "Additional Remarks"
        ),
    };

    // Render sections in order for this note
    const noteSections = sortedSections
      .map((section) => {
        const renderer = sectionRenderers[section.key];

        if (renderer) {
          return renderer();
        }
        return null;
      })
      .filter(Boolean);

    return (
      <View key={note._id || noteIndex}>
        <FilledByCard
          filledBy={note.createdByName}
          filledOn={note.createdAt}
          fontFamily={fontFamily}
        />
        {/* Content */}
        {noteSections}
      </View>
    );
  });

  return allSections;
};
