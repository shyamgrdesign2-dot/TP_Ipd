import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import {
  getAllVisibleSections,
  isEmptyRichText,
} from "../../../utils/pdfUtils";
import SectionTitle from "../../SectionTitle";
import RichTextPrintRenderer from "./richTextPrintRenderer";

const styles = StyleSheet.create({
  mainContainer: {
    padding: "0 6px",
    marginBottom: 8,
  },

  subsectionContainer: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },

  contentContainer: {
    gap: 2,
  },

  inlineText: {
    fontSize: 10,
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  inlineLabel: {
    fontWeight: 600,
    color: "#171725",
  },

  inlineValue: {
    fontWeight: 400,
    color: "#454551",
  },

  subsectionTitle: {
    color: "#171725",
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 2,
  },

  bulletList: {
    paddingLeft: 15,
  },

  bulletItem: {
    flexDirection: "row",
    marginBottom: 0,
  },

  bullet: {
    width: 12,
    fontSize: 10,
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  bulletContent: {
    flex: 1,
    fontSize: 10,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },
});

const FollowUp = ({ data, fontFamily = "Poppins", title, formatSettings }) => {
  if (!data?.followUp) return null;

  const followUp = data.followUp;

  const followUpSection = formatSettings.find(
    (section) => section.id === "followUp"
  );
  const subsections = followUpSection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  if (
    (!sortedSubsections.some((s) => s.id === "followUpDate") ||
      !followUp.date) &&
    (!sortedSubsections.some((s) => s.id === "followUpDoctor") ||
      !followUp.doctor?.name) &&
    (!sortedSubsections.some((s) => s.id === "additionalNotes") ||
      isEmptyRichText(followUp.additionalNotes))
  )
    return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title={title} fontFamily={fontFamily} />
      <View style={styles.mainContainer}>
        {/* Follow-up On */}
        {sortedSubsections.map((subSection) => {
          const key = subSection?.id;
          const label = subSection?.label;
          if (key === "followUpDate" && followUp.date) {
            return (
              <View style={styles.subsectionContainer}>
                <View style={styles.contentContainer}>
                  <Text style={[styles.inlineText, { fontFamily }]}>
                    <Text style={styles.inlineLabel}>{label}: </Text>
                    <Text style={styles.inlineValue}>{followUp.date}</Text>
                  </Text>
                </View>
              </View>
            );
          }
          if (key === "followUpDoctor" && followUp.doctor?.name) {
            return (
              <View style={styles.subsectionContainer}>
                <View style={styles.contentContainer}>
                  <Text style={[styles.inlineText, { fontFamily }]}>
                    <Text style={styles.inlineLabel}>{label}: </Text>
                    <Text style={styles.inlineValue}>
                      {followUp.doctor?.name}
                      {followUp.doctor?.role
                        ? ` (${followUp.doctor?.role})`
                        : ""}
                    </Text>
                  </Text>
                </View>
              </View>
            );
          }
          if (
            key === "additionalNotes" &&
            !isEmptyRichText(followUp.additionalNotes)
          ) {
            return (
              <RichTextPrintRenderer
                data={followUp.additionalNotes}
                title={label}
                fontFamily={fontFamily}
              />
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};

export default FollowUp;
