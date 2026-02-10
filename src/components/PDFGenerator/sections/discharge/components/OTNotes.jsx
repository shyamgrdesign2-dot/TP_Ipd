/**
 * OT Notes Section
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import SectionTitle from "../../SectionTitle";
import {
  getAllVisibleSections,
  isEmptyRichText,
} from "../../../utils/pdfUtils";
import RichTextPrintRenderer from "./richTextPrintRenderer";
import { Text } from "../../../components/MultilingualText";

const styles = StyleSheet.create({
  // Main container
  mainContainer: {
    padding: "0 6px",
    // marginBottom: 8,
  },

  // Surgery subsection container
  surgeryContainer: {
    paddingVertical: 6,
    paddingHorizontal: 0,
  },

  // Content container
  contentContainer: {
    gap: 4,
  },

  // Surgery number title
  surgeryTitle: {
    color: "#171725",
    fontWeight: 600, // SemiBold
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
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
    lineHeight: 2.2, // 22px for 10px font (different from other sections)
  },

  // Bullet content
  bulletContent: {
    flex: 1,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 2.2, // 22px for 10px font
    textTransform: "capitalize",
  },

  // Field label (Medium weight)
  fieldLabel: {
    fontWeight: 500, // Medium
  },

  // Regular text
  regularText: {
    fontWeight: 400,
  },
});

const OTNotes = ({ data, title, formatSettings }) => {
  if (!data?.otNotes?.surgeries || data.otNotes.surgeries.length === 0)
    return <Text>{""}</Text>;

  const { surgeries } = data.otNotes;

  const otNotesSection = formatSettings.find(
    (section) => section.id === "otNotes"
  );
  const subsections = otNotesSection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  if (!surgeries?.length) return <Text>{""}</Text>;

  return (
    <View style={styles.sectionContainer} break>
      <SectionTitle title={title} />
      <View style={styles.mainContainer}>
        {surgeries.map((surgery, index) => {
          return (
            <View key={`surgery-${index}`} style={styles.surgeryContainer}>
              <View style={styles.contentContainer}>
                {/* Surgery number title */}
                <Text style={[styles.surgeryTitle]}>Surgery {index + 1}:</Text>

                {sortedSubsections.map((subSection) => {
                  const key = subSection.id;
                  const label = subSection?.label;

                  if (
                    key === "procedureName" &&
                    surgery.procedureName?.length > 0
                  ) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {Array.isArray(surgery.procedureName)
                              ? surgery.procedureName.join(", ")
                              : surgery.procedureName}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (key === "dateOfSurgery" && surgery.dateOfSurgery) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {surgery.dateOfSurgery}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (
                    key === "duration" &&
                    surgery.surgeryStartTime &&
                    surgery.surgeryEndTime
                  ) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {surgery.surgeryStartTime} -{" "}
                            {surgery.surgeryEndTime}
                            {surgery.duration ? ` (${surgery.duration})` : ""}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (
                    key === "primarySurgeon" &&
                    surgery.surgeon &&
                    surgery.surgeon.length > 0
                  ) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {surgery.surgeon
                              .map((s) => s?.name || s)
                              .join(", ")}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (
                    key === "secondarySurgeon" &&
                    surgery.secondarySurgeon &&
                    surgery.secondarySurgeon.length > 0
                  ) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {surgery.secondarySurgeon
                              .map((s) => s?.name || s)
                              .join(", ")}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (
                    key === "assistant" &&
                    surgery.assistant &&
                    surgery.assistant.length > 0
                  ) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {surgery.assistant
                              .map((s) => s?.name || s)
                              .join(", ")}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (
                    key === "anaesthetist" &&
                    surgery.anaesthetist &&
                    ((Array.isArray(surgery.anaesthetist) &&
                      surgery.anaesthetist.length > 0) ||
                      (typeof surgery.anaesthetist === "string" &&
                        !!surgery.anaesthetist))
                  ) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {Array.isArray(surgery.anaesthetist)
                              ? surgery.anaesthetist
                                  .map((s) => s?.name || s)
                                  .join(", ")
                              : surgery.anaesthetist}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (key === "anaesthetistType" && surgery.anaesthetistType) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>
                            {"Anaesthesia Type"}:{" "}
                          </Text>
                          <Text style={styles.regularText}>
                            {surgery.anaesthetistType}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (
                    key === "scrubNurse" &&
                    surgery.scrubNurse &&
                    surgery.scrubNurse.length > 0
                  ) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {surgery.scrubNurse
                              .map((s) => s?.name || s)
                              .join(", ")}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (
                    key === "floorCirculatingNurse" &&
                    surgery.floorCirculatingNurse &&
                    surgery.floorCirculatingNurse.length > 0
                  ) {
                    return (
                      <View style={styles.bulletItem}>
                        <Text style={[styles.bullet]}>•</Text>
                        <Text style={[styles.bulletContent]}>
                          <Text style={styles.fieldLabel}>{label}: </Text>
                          <Text style={styles.regularText}>
                            {surgery.floorCirculatingNurse
                              .map((s) => s?.name || s)
                              .join(", ")}
                          </Text>
                        </Text>
                      </View>
                    );
                  }
                  if (
                    key === "operativeFindings" &&
                    surgery.operativeFindings &&
                    !isEmptyRichText(surgery.operativeFindings)
                  ) {
                    return (
                      <RichTextPrintRenderer
                        data={surgery.operativeFindings}
                        title={label}
                      />
                    );
                  }
                  if (
                    key === "procedure" &&
                    surgery.procedure &&
                    !isEmptyRichText(surgery.procedure)
                  ) {
                    return (
                      <RichTextPrintRenderer
                        data={surgery.procedure}
                        title={label}
                      />
                    );
                  }
                  return null;
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default OTNotes;
