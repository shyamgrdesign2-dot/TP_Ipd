import React from "react";
import { View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import {
  getAllVisibleSections,
  isEmptyRichText,
} from "../../../utils/pdfUtils";
import SectionTitle from "../../SectionTitle";
import RichTextPrintRenderer from "./richTextPrintRenderer";
import { Text } from "../../../components/MultilingualText";

const styles = StyleSheet.create({
  mainContainer: {
    padding: "0 6px",
    // marginBottom: 8,
  },
  mainContainer2: {
    // padding: "0 6px",
    marginBottom: 8,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  subsectionTitle2: {
    fontWeight: 700,
    color: "#000000",
    marginBottom: 8,
  },

  subsectionContainer: {
    // paddingVertical: 6,
    paddingHorizontal: 0,
  },

  contentContainer: {
    gap: 2,
  },

  inlineText: {
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
    color: "#454551",
    fontWeight: 400,
    lineHeight: 1.8,
  },

  bulletContent: {
    flex: 1,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  // Table styles
  table: {
    display: "table",
    width: "auto",
    marginTop: 4,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    borderBottomStyle: "solid",
  },

  tableRowLast: {
    borderBottomWidth: 0,
  },

  tableHeader: {
    // backgroundColor: "#F5F5F5",
  },

  tableCol: {
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    borderRightStyle: "solid",
    padding: 8,
  },

  tableColLast: {
    borderRightWidth: 0,
  },

  tableColDate: {
    width: "30%",
  },

  tableColDoctor: {
    width: "70%",
  },

  tableHeaderText: {
    fontSize: 10,
    fontWeight: 600,
    color: "#171725",
    lineHeight: 1.6,
  },

  tableCellText: {
    fontSize: 9,
    fontWeight: 400,
    color: "#454551",
    lineHeight: 1.8,
  },

  doctorItem: {
    marginBottom: 2,
  },

  doctorItemLast: {
    marginBottom: 0,
  },
});

const FollowUp = ({ data, title, formatSettings }) => {
  if (!data?.followUp && !data?.followUpAdditionalNotes) return null;

  const followUp = data.followUp;

  const isArrayFormat = Array.isArray(followUp);

  const followUpSection = formatSettings.find(
    (section) => section.id === "followUp"
  );
  const subsections = followUpSection?.subSections || [];
  const sortedSubsections = getAllVisibleSections(subsections);

  if (isArrayFormat) {
    const hasValidData = followUp.some(
      (item) => item.date || (item.doctor && item.doctor.length > 0)
    );
    
    if (!hasValidData && isEmptyRichText(data?.followUpAdditionalNotes)) return null;

    return (
      <View style={styles.sectionContainer}>
        {title ? <Text style={styles.subsectionTitle2}>{title}</Text> : null}
        {followUp.length > 0 ?( <View style={styles.mainContainer2}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCol, styles.tableColDate]}>
                <Text style={styles.tableHeaderText}>Date</Text>
              </View>
              <View
                style={[
                  styles.tableCol,
                  styles.tableColDoctor,
                  styles.tableColLast,
                ]}
              >
                <Text style={styles.tableHeaderText}>
                  Doctor Name (Speciality)
                </Text>
              </View>
            </View>

            {followUp.map((item, index) => {
              const isLastRow = index === followUp.length - 1;
              const doctors = item.doctor || [];

              return (
                <View
                  key={index}
                  style={[styles.tableRow, isLastRow && styles.tableRowLast]}
                >
                  <View style={[styles.tableCol, styles.tableColDate]}>
                    <Text style={styles.tableCellText}>{item.date || "-"}</Text>
                  </View>

                  <View
                    style={[
                      styles.tableCol,
                      styles.tableColDoctor,
                      styles.tableColLast,
                    ]}
                  >
                    {doctors.length > 0 ? (
                      doctors.map((doctor, docIndex) => {
                        const isLastDoctor = docIndex === doctors.length - 1;
                        return (
                          <Text
                            key={docIndex}
                            style={[
                              styles.tableCellText,
                              isLastDoctor
                                ? styles.doctorItemLast
                                : styles.doctorItem,
                            ]}
                          >
                            {doctor.name}
                            {doctor.speciality ? ` (${doctor.speciality})` : ""}
                          </Text>
                        );
                      })
                    ) : (
                      <Text style={styles.tableCellText}>-</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>) : null}
        {!isEmptyRichText(data?.followUpAdditionalNotes) ? (
          <RichTextPrintRenderer
            key={"followup-additional-notes"}
            data={data?.followUpAdditionalNotes}
            title={"Additional Notes"}
          />
        ) : null}
      </View>
    );
  }

  // Handle object format (old format) - keep existing logic
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
      <SectionTitle title={title} />
      <View style={styles.mainContainer}>
        {/* Follow-up On */}
        {sortedSubsections.map((subSection) => {
          const key = subSection?.id;
          const label = subSection?.label;
          if (key === "followUpDate" && followUp.date) {
            return (
              <View style={styles.subsectionContainer} key={key}>
                <View style={styles.contentContainer}>
                  <Text style={styles.inlineText}>
                    <Text style={styles.inlineLabel}>{label}: </Text>
                    <Text style={styles.inlineValue}>{followUp.date}</Text>
                  </Text>
                </View>
              </View>
            );
          }
          if (key === "followUpDoctor" && followUp.doctor?.name) {
            return (
              <View style={styles.subsectionContainer} key={key}>
                <View style={styles.contentContainer}>
                  <Text style={styles.inlineText}>
                    <Text style={styles.inlineLabel}>{label}: </Text>
                    <Text style={styles.inlineValue}>
                      {followUp.doctor?.name}
                      {followUp.doctor?.speciality
                        ? ` (${followUp.doctor?.speciality})`
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
                key={key}
                data={followUp.additionalNotes}
                title={label}
              />
            );
          }
          return null;
        })}
        {!isEmptyRichText(data?.followUpAdditionalNotes) ? (
          <RichTextPrintRenderer
            key={"followup-additional-notes"}
            data={data?.followUpAdditionalNotes}
            title={"Additional Notes"}
          />
        ) : null}
      </View>
    </View>
  );
};

export default FollowUp;
