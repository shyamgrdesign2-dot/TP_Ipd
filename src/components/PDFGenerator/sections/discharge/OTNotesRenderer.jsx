/**
 * Discharge Summary Renderer
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import SectionTitle from "../SectionTitle";
import { renderSimpleText } from "../ListViewRenderer";
import { getAllVisibleSections, isEmptyRichText } from "../../utils/pdfUtils";
import { IPD } from "../../../../utils/locale";
import RichTextPrintRendererSection from "./components/RichTextPrintRendererSection";
import RichTextPrintRenderer from "./components/richTextPrintRenderer";
import moment from "moment";
import { camelToCapitalized } from "../../../../utils/utils";
import FilledByCard from "../../components/FilledByCard";
import { isValidMongoId } from "../../../../utils/utils";
import CustomModuleRenderer from "../../components/CustomModuleRenderer";

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 12,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 0,
  },

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
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
  },

  // Category name (Medium weight)
  categoryName: {
    fontWeight: 500, // Medium
    color: "#454551",
    lineHeight: 1.8,
  },

  // Item label (Medium weight for bold parts)
  itemLabel: {
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
    fontWeight: 500, // Medium
    color: "#171725",
  },

  // Regular text
  regularText: {
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
    paddingLeft: 5,
  },

  // Separator pipe
  separator: {
    color: "#A2A2A8",
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
  },

  // Nested bullet list (second level)
  nestedBulletList: {
    paddingLeft: 30, // 15px additional from first level
  },

  subsectionContainer: {
    marginBottom: 10,
  },

  subsectionTitle: {
    fontWeight: 600,
    color: "#000000",
    marginBottom: 6,
    marginTop: 8,
  },
});

/**
 * Primary Consultant Section (Admitting Consultant)
 */
const renderPrimaryConsultant = (data) => {
  if (!data?.patientInformation?.primaryConsultant) return null;

  const { primaryConsultant } = data.patientInformation;
  const consultantText = `${primaryConsultant.name} (${primaryConsultant.speciality})`;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Admitting Consultant" />
      <View style={{ padding: "6px 0px" }}>
        {renderSimpleText(consultantText)}
      </View>
    </View>
  );
};

const renderOperativeNotes = (data, formatSettings) => {
  const finalData = data?.otNotes;
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Operative Notes" />
      <RichTextPrintRendererSection
        data={finalData}
        formatSettings={formatSettings || null}
        id="operativeNotes"
      />
    </View>
  );
};

const renderIntraOperativeNotes = (data, formatSettings) => {
  const originalData = data?.otNotes;

  const transformedData = {
    intraOperativeNotes: {},
  };

  if (originalData?.intraOperativeNotes) {
    const {
      estimatedBloodLoss,
      swabCount,
      fluidCount,
      sutureType,
      ...otherFields
    } = originalData.intraOperativeNotes;

    Object.keys(otherFields).forEach((key) => {
      transformedData.intraOperativeNotes[key] = otherFields[key];
    });

    const metrics = { estimatedBloodLoss, swabCount, fluidCount, sutureType };
    transformedData.intraOperativeNotes.metrics = metrics;
  }

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Intra Operative Notes" />
      <RichTextPrintRendererSection
        data={transformedData}
        formatSettings={formatSettings || null}
        id="intraOperativeNotes"
      />
    </View>
  );
};

const renderPostOperativeNotes = (data, formatSettings) => {
  const finalData = data?.otNotes;
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Post Operative Notes" />
      <RichTextPrintRendererSection
        data={finalData}
        formatSettings={formatSettings || null}
        id="postOperativeNotes"
      />
    </View>
  );
};

const calculateDuration = (startTime, endTime, surgeryDate) => {
  const startDateTime = moment(
    `${surgeryDate} ${startTime}`,
    "DD MMM YYYY h:mm A"
  );
  const endDateTime = moment(`${surgeryDate} ${endTime}`, "DD MMM YYYY h:mm A");

  // If end time is before start time, assume it's the next day
  if (endDateTime.isBefore(startDateTime)) {
    endDateTime.add(1, "day");
  }

  const duration = moment.duration(endDateTime.diff(startDateTime));
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();

  let durationText = "";
  if (days > 0) {
    durationText += `${days}d `;
  }
  if (hours > 0) {
    durationText += `${hours}h `;
  }
  if (minutes > 0) {
    durationText += `${minutes}min`;
  }

  return durationText.trim() || "0min";
};

/**
 * Render Surgery Details
 */
const renderSurgeryDetails = (data, formatSettings) => {
  const surgeryData = data?.otNotes?.surgeryDetails;
  if (!surgeryData) return null;

  const {
    procedureName,
    anaesthesiaType,
    surgeryDate,
    surgeryStartTime,
    surgeryEndTime,
    diagnosis,
  } = surgeryData;

  // Format surgery date to match the UI (e.g., "13 Aug 2025")
  const formattedDate = surgeryDate
    ? moment(surgeryDate, "DD MMM YYYY").format("DD MMM YYYY")
    : "";

  // Calculate duration
  const duration =
    surgeryStartTime && surgeryEndTime && surgeryDate
      ? calculateDuration(surgeryStartTime, surgeryEndTime, surgeryDate)
      : "";

  const mainSection = formatSettings?.find(
    (section) => section?.id === "surgeryDetails"
  );
  const subsections = getAllVisibleSections(mainSection?.subSections || []);

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Surgery Details" />
      <View style={styles.contentContainer}>
        {subsections.map((subSection) => {
          if (subSection.id === "procedureName") {
            return (
              <View style={styles.bulletItem}>
                <Text style={[styles.bullet]}>•</Text>
                <Text style={[styles.bulletContent]}>
                  <Text style={styles.itemLabel}>{subSection.label}:</Text>
                  <Text style={styles.regularText}>
                    {" "}
                    {procedureName.join(", ")}
                  </Text>
                </Text>
              </View>
            );
          }
          if (subSection.id === "dateOfSurgery" && formattedDate) {
            return (
              <View style={styles.bulletItem}>
                <Text style={[styles.bullet]}>•</Text>
                <Text style={[styles.bulletContent]}>
                  <Text style={styles.itemLabel}>{subSection.label}:</Text>
                  <Text style={styles.regularText}> {formattedDate}</Text>
                </Text>
              </View>
            );
          }
          if (
            subSection.id === "duration" &&
            surgeryStartTime &&
            surgeryEndTime
          ) {
            return (
              <View style={styles.bulletItem}>
                <Text style={[styles.bullet]}>•</Text>
                <Text style={[styles.bulletContent]}>
                  <Text style={styles.itemLabel}>{subSection.label}:</Text>
                  <Text style={styles.regularText}>
                    {" "}
                    {surgeryStartTime} - {surgeryEndTime}
                  </Text>
                  {duration && (
                    <Text style={styles.regularText}> ({duration})</Text>
                  )}
                </Text>
              </View>
            );
          }
          if (subSection.id === "anaesthesiaType" && anaesthesiaType) {
            return (
              <View style={styles.bulletItem}>
                <Text style={[styles.bullet]}>•</Text>
                <Text style={[styles.bulletContent]}>
                  <Text style={styles.itemLabel}>{subSection.label}:</Text>
                  <Text style={styles.regularText}> {anaesthesiaType}</Text>
                </Text>
              </View>
            );
          }
          if (
            subSection.id === "diagnosis" &&
            diagnosis &&
            !isEmptyRichText(diagnosis)
          ) {
            return (
              <View style={styles.bulletItem}>
                <Text style={[styles.bullet]}>•</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bulletContent]}>
                    <Text style={[styles.itemLabel]}>{subSection.label}:</Text>
                  </Text>
                  <View
                    style={{ lineHeight: 1.8, marginTop: 10, marginBottom: 10 }}
                  >
                    <RichTextPrintRenderer data={diagnosis} />
                  </View>
                </View>
              </View>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};

const renderSurgeryTeam = (data, formatSettings) => {
  const surgeryTeam = data?.otNotes?.surgeryTeam;
  const mainSection = formatSettings?.find(
    (section) => section?.id === "surgeryTeam"
  );
  const subsections = getAllVisibleSections(mainSection?.subSections || []);

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title={mainSection.label} />
      {subsections.map(({ id, label }) => {
        const value = surgeryTeam?.[id];
        const valueText = Array.isArray(value)
          ? value
              .map((item) => item.name)
              .filter(Boolean)
              .join(", ")
          : value;
        if (!valueText) return null;
        return (
          <View style={styles.bulletItem}>
            <Text style={[styles.bullet]}>•</Text>
            <Text style={[styles.itemLabel]}>{label}:</Text>
            <Text style={[styles.regularText]}>{valueText}</Text>
          </View>
        );
      })}
    </View>
  );
};

/**
 * Main Discharge Summary Renderer
 * @param {Object} data - Discharge summary data
 * @param {Object} formatSettings - Format settings
 * @returns {Array} Array of section components
 */
export const renderOTNotes = (data, formatSettings) => {
  const sortedSections = getAllVisibleSections(formatSettings || null);
  if (!data || !formatSettings) return [];

  const allSections = data.map((note, noteIndex) => {
    const sectionRenderers = {
      surgeryDetails: () => renderSurgeryDetails(note, formatSettings),
      surgeryTeam: () => renderSurgeryTeam(note, formatSettings),
      operativeNotes: () => renderOperativeNotes(note, formatSettings),
      intraOperativeNotes: () =>
        renderIntraOperativeNotes(note, formatSettings),
      postOperativeNotes: () => renderPostOperativeNotes(note, formatSettings),
    };

    // Render sections in order
    const sections = sortedSections
      .map((section) => {
        const renderer = sectionRenderers[section.id];
        if (section.isCustom || isValidMongoId(section.id)) {
          return <CustomModuleRenderer section={section} data={data} />;
        }
        if (renderer) {
          return renderer();
        }
        return <Text>{""}</Text>;
      })
      .filter(Boolean);

    return (
      <View key={note._id || noteIndex}>
        <FilledByCard filledBy={note.createdByName} filledOn={note.createdAt} />
        {/* Content */}
        {sections}
      </View>
    );
  });
  return allSections;
};
