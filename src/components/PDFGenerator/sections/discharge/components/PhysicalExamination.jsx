/**
 * Physical Examination Section
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import {
  getAllVisibleSections,
  isEmptyRichText,
} from "../../../utils/pdfUtils";
import SlateToPdf from "../../../components/SlateToPdf";
import Vitals from "../../../components/Vitals";
import SectionTitle from "../../SectionTitle";
import RichTextPrintRenderer from "./richTextPrintRenderer";
import { Text } from "../../../components/MultilingualText";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    // marginBottom: 8,
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
    gap: 4,
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    // marginBottom: 4,
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
  },

  // Nested bullet list (second level)
  nestedBulletList: {
    marginLeft: 30,
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
    lineHeight: 1.8,
  },

  // Bullet content
  bulletContent: {
    flex: 1,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  // Examination label (SemiBold)
  examinationLabel: {
    fontWeight: 600, // SemiBold
  },

  // Notes label (Medium)
  notesLabel: {
    fontWeight: 500, // Medium
  },

  // Regular text
  regularText: {
    fontWeight: 400,
  },
});

/**
 * Render General Examination
 */
export const renderGeneralExamination = (examination, subsection) => {
  if (!examination || Object.keys(examination).length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>{subsection.label}</Text>
        <View style={styles.bulletList}>
          {Object.entries(examination).map(([key, value]) => {
            if (!value?.title && isEmptyRichText(value.notes)) return null;

            const label = key
              .replace(/_/g, "/")
              .split("/")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join("/");

            const hasNotes = value.notes && !isEmptyRichText(value.notes);

            return (
              <View key={key}>
                <View style={styles.bulletItem}>
                  <Text style={[styles.bullet]}>•</Text>
                  <Text style={[styles.bulletContent]}>
                    <Text style={styles.examinationLabel}>{label}:</Text>
                    <Text style={styles.regularText}>
                      {" "}
                      {value.title} {(hasNotes && value.title) ? ",  " : ""}
                    </Text>
                    {hasNotes && (
                      <>
                        <View style={[styles.bulletContent]}>
                          {/* <Text style={[styles.notesLabel]}>Notes: </Text> */}
                          {typeof value.notes === "string" ? (
                            <Text style={[styles.regularText]}>
                              {value.notes}
                            </Text>
                          ) : (
                            <RichTextPrintRenderer data={value.notes} />
                          )}
                        </View>
                      </>
                    )}
                  </Text>
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
 * Render Others section
 */
const renderOthers = (others) => {
  if (!others || isEmptyRichText(others)) return null;

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
        <Text style={styles.subsectionTitle}>Others:</Text>
        <View style={styles.bulletList}>
          <SlateToPdf
            nodes={Array.isArray(others) ? others : [others]}
            customStyles={customStyles}
          />
        </View>
      </View>
    </View>
  );
};

/**
 * PhysicalExamination Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Physical examination data
 * @returns {JSX.Element} Physical Examination Section
 */
const PhysicalExamination = ({
  data,
  isAssessment = false,
  formatSettings,
  title,
  isDischargeSummary = false,
}) => {
  if (!data?.physicalExamination) return null;

  const { physicalExamination } = data;

  const physicalExaminationSection = formatSettings?.find(
    (section) => section.id === "physicalExamination"
  );
  const subsections = physicalExaminationSection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  // Check if either "vitals", "generalExamination", or "others" subsection is present and populated
  const isVitalsPresent =
    physicalExamination?.vitals &&
    Object.values(physicalExamination?.vitals)?.some(
      (item) => item !== null && item !== "" && item !== undefined
    );

  const hasVitals = sortedSubsections.some(
    (sub) => sub.id === "vitals" && isVitalsPresent
  );
  const isExaminationPresent = isAssessment
    ? physicalExamination?.examination
    : physicalExamination?.generalExamination;
  const checkExamination =
    isExaminationPresent &&
    typeof isExaminationPresent === "object" &&
    !Array.isArray(isExaminationPresent) &&
    Object.values(isExaminationPresent).some(
      (item) =>
        item &&
        typeof item === "object" &&
        ((item.title && `${item.title}`.trim() !== "") ||
          !isEmptyRichText(item.notes))
    );
  const hasGeneralExamination = sortedSubsections.some(
    (sub) => sub.id === "generalExamination" && checkExamination
  );
  const hasOthers = sortedSubsections.some(
    (sub) =>
      sub.id === "others" &&
      physicalExamination?.others &&
      !isEmptyRichText(physicalExamination?.others)
  );

  if (!hasVitals && !hasGeneralExamination && !hasOthers) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      {title ? <SectionTitle title={title} /> : null}
      <View style={styles.mainContainer}>
        {sortedSubsections.map((subsection) => {
          const key = subsection.id;

          if (
            key === "vitals" &&
            !isDischargeSummary &&
            physicalExamination?.vitals
          ) {
            return (
              <Vitals
                vitals={physicalExamination.vitals}
                title={subsection.label}
              />
            );
          }
          if (
            key === "generalExamination" &&
            ((isAssessment && hasGeneralExamination) ||
              (!isAssessment && hasGeneralExamination))
          ) {
            return renderGeneralExamination(
              isAssessment
                ? physicalExamination.examination
                : physicalExamination.generalExamination,
              subsection
            );
          }
          if (key === "others" && physicalExamination?.others) {
            return renderOthers(physicalExamination.others);
          }
          return null;
        })}
      </View>
    </View>
  );
};

export default PhysicalExamination;
