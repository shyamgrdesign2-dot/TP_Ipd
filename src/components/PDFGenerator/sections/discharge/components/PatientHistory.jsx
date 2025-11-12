/**
 * Patient History Section
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import SlateToPdf from "../../../components/SlateToPdf";
import MedicationTable from "../../../components/MedicationTable";
import ObsHistoryListView from "../../../../print_settings/obsHistory/list";
import { PX_TO_PT } from "../../../constants";
import { IPD } from "../../../../../utils/locale";
import moment from "moment";
import {
  getAllVisibleSections,
  isEmptyRichText,
} from "../../../utils/pdfUtils";
import SectionTitle from "../../SectionTitle";

const styles = StyleSheet.create({
  pageBreak: {
    breakBefore: "page",
  },
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

  subsectionContainer2: {
    paddingBottom: 16,
    paddingHorizontal: 0,
  },

  // Inner content container
  contentContainer: {
    // gap: 4,
  },
  contentContainer2: {
    gap: 0,
  },

  // Subsection title
  subsectionTitle: {
    color: "#171725",
    fontWeight: 600,
    lineHeight: 1.8, // 18px for 10px font
    textTransform: "capitalize",
    // marginBottom: 4,
  },

  subsectionTitle2: {
    color: "#171725",
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
  },

  // Bullet list container
  bulletList: {
    paddingLeft: 15,
  },

  // Nested bullet list (second level)
  nestedBulletList: {
    paddingLeft: 30, // 15px additional from first level
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
    fontWeight: 500, // Medium
  },

  // Regular text
  regularText: {
    fontWeight: 400,
  },

  // Separator pipe
  separator: {
    color: "#A2A2A8",
  },
});

const obsStyles = StyleSheet.create({
  mainTitle: {
    color: "#A461D8",
    fontWeight: 700,
  },
  subTitle: {
    color: "#454551",

    fontWeight: 500,
    lineHeight: 1.4,
  },
  displayPatient: {
    color: "#171725",
  },
  mainCasemanager: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  extraText: {
    color: "#171725",
  },
  directionCasemanager: {
    flexDirection: "row",
    alignItems: "center",
  },
  table: {
    marginTop: PX_TO_PT * 4,
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #171725",
    borderLeft: "1px solid #171725",
    minHeight: PX_TO_PT * 10,
  },
  cell: {
    flex: 1,
    padding: 6,
    borderRight: "1px solid #171725",
    height: "100%",
  },
  dynamicModuleCell: {
    padding: 6,
    borderRight: "1px solid #171725",
    height: "100%",
  },
  headerRow: {
    flexDirection: "row",
    borderBottom: "1px solid #171725",
    borderLeft: "1px solid #171725",
    borderTop: "1px solid #171725",
  },
  headerRowFixed: {
    flexDirection: "row",
    borderBottom: "1px solid #171725",
    borderLeft: "1px solid #171725",
  },
  headerCell: {
    flex: 1,
    padding: 6,
    borderRight: "1px solid #171725",
    fontWeight: 700,
  },
  minHeight50: {
    minHeight: 50,
  },
  lineHeight2: {
    lineHeight: 2,
  },
  minHeight38: {
    minHeight: 38,
  },
});

const renderTopInformant = (topInformant) => {
  if (!topInformant) return null;
  return (
    <View style={styles.subsectionContainer2}>
      <View style={styles.contentContainer2}>
        <Text style={[styles.subsectionTitle2]}>Top Informant:</Text>
        <Text style={styles.bulletContent}>{topInformant}</Text>
      </View>
    </View>
  );
};

const renderPresentingComplaints = (complaints) => {
  if (!complaints || complaints.length === 0) return null;

  // Handle both old format (simple strings/objects) and new Slate.js format
  const isSlateFormat =
    Array.isArray(complaints) &&
    complaints.some((item) => item && typeof item === "object" && item.type);

  // Custom styles for the SlateToPdf component to match existing styling
  const customStyles = {
    bulletList: styles.bulletList,
    bulletItem: styles.bulletItem,
    bulletSymbol: styles.bullet,
    bulletText: styles.bulletContent,
    // Use default styles from SlateToPdf for numbered lists and paragraphs
    numberedList: {},
    numberedItem: {},
    numberedSymbol: {},
    numberedText: {},
    paragraph: {},
    text: {},
  };

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>Presenting Complaints:</Text>
        {isSlateFormat ? (
          <View style={styles.bulletList}>
            <SlateToPdf nodes={complaints} customStyles={customStyles} />
          </View>
        ) : (
          // Fallback for old format
          <View style={styles.bulletList}>
            {complaints.map((complaint, index) => (
              <View key={`complaint-${index}`} style={styles.bulletItem}>
                <Text style={[styles.bullet]}>•</Text>
                <Text style={[styles.bulletContent]}>
                  {typeof complaint === "string" ? complaint : complaint.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

/**
 * Render Past Medical History with nested structure
 */
const renderPastMedicalHistory = (history) => {
  if (!history || history.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>Past Medical History:</Text>
        <View style={styles.bulletList}>
          {history.map((historyGroup, idx) => {
            const tags = historyGroup.tags?.filter((tag) => tag.enable === "Y");
            if (!tags || tags.length === 0) return null;

            return (
              <View key={`history-${idx}`}>
                {/* Category name */}
                <View style={styles.bulletItem}>
                  <Text style={[styles.bullet]}>•</Text>
                  <Text style={[styles.categoryName]}>
                    {historyGroup.title}:
                  </Text>
                </View>

                {/* Nested items */}
                <View style={styles.nestedBulletList}>
                  {tags.map((tag, tagIdx) => (
                    <View key={`tag-${tagIdx}`} style={styles.bulletItem}>
                      <Text style={[styles.bullet]}>•</Text>
                      <Text style={[styles.bulletContent]}>
                        <Text style={styles.itemLabel}>{tag.title}</Text>
                        {(tag.since || tag.status || tag.note) && (
                          <Text style={styles.regularText}> (</Text>
                        )}
                        {tag.since && (
                          <>
                            <Text style={styles.itemLabel}>Since:</Text>
                            <Text style={styles.regularText}> {tag.since}</Text>
                          </>
                        )}
                        {tag.since && (tag.status || tag.note) && (
                          <Text style={styles.separator}> | </Text>
                        )}
                        {tag.status && (
                          <>
                            <Text style={styles.itemLabel}>Status:</Text>
                            <Text style={styles.regularText}>
                              {" "}
                              {tag.status}
                            </Text>
                          </>
                        )}
                        {tag.status && tag.note && (
                          <Text style={styles.separator}> | </Text>
                        )}
                        {tag.note && (
                          <>
                            <Text style={styles.itemLabel}>Note:</Text>
                            <Text style={styles.regularText}> {tag.note}</Text>
                          </>
                        )}
                        {(tag.since || tag.status || tag.note) && (
                          <Text style={styles.regularText}>)</Text>
                        )}
                      </Text>
                    </View>
                  ))}
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
 * Render Gynec History
 */
const renderGynecHistory = (gynecData) => {
  if (!gynecData) return null;

  const items = [];

  // Menarche
  if (gynecData.ageAtMenarche) {
    items.push({
      label: "Menarche",
      parts: [{ label: "Age at", value: `${gynecData.ageAtMenarche} years` }],
    });
  }

  // Cycle
  if (gynecData.cycle || gynecData.intervalOfCycle || gynecData.cycleNotes) {
    const parts = [];
    if (gynecData.cycle) {
      parts.push({ label: "Type", value: gynecData.cycle });
    }
    if (gynecData.intervalOfCycle) {
      parts.push({
        label: "Cycle Interval",
        value: `${gynecData.intervalOfCycle} days`,
      });
    }
    if (gynecData.cycleNotes) {
      parts.push({ label: "Cycle Note", value: gynecData.cycleNotes });
    }
    if (parts.length > 0) {
      items.push({ label: "Cycle", parts });
    }
  }

  // Flow
  if (gynecData.flow || gynecData.numberOfPadsPerDay) {
    const parts = [];
    if (gynecData.flow) {
      parts.push({ label: "Volume", value: gynecData.flow });
    }
    if (gynecData.numberOfPadsPerDay) {
      parts.push({
        label: "Number of pads per day",
        value: gynecData.numberOfPadsPerDay,
      });
    }
    if (parts.length > 0) {
      items.push({ label: "Flow", parts });
    }
  }

  // Pain
  if (gynecData.pain || gynecData.occurrenceOfPain) {
    const parts = [];
    if (gynecData.pain) {
      parts.push({ label: "Level", value: gynecData.pain });
    }
    if (gynecData.occurrenceOfPain) {
      parts.push({
        label: "Occurrence of pain",
        value: gynecData.occurrenceOfPain,
      });
    }
    if (parts.length > 0) {
      items.push({ label: "Pain", parts });
    }
  }

  // Lifecycle Hormonal Changes
  if (
    gynecData.reproductiveLifeStages ||
    gynecData.ageAtMenopause ||
    gynecData.typeOfMenopause ||
    gynecData.reproductiveNotes
  ) {
    const parts = [];
    if (gynecData.reproductiveLifeStages && gynecData.ageAtMenopause) {
      parts.push({
        label: `${gynecData.reproductiveLifeStages} at`,
        value: `${gynecData.ageAtMenopause} years`,
      });
    }
    if (gynecData.typeOfMenopause) {
      parts.push({
        label: `${gynecData.reproductiveLifeStages} type`,
        value: gynecData.typeOfMenopause,
      });
    }
    if (gynecData.reproductiveNotes) {
      parts.push({
        label: `${gynecData.reproductiveLifeStages} note`,
        value: gynecData.reproductiveNotes,
      });
    }
    if (parts.length > 0) {
      items.push({ label: "Lifecycle Hormonal Changes", parts });
    }
  }

  // Menstruation notes
  if (gynecData.menarcheNotes) {
    items.push({
      label: "Menstruation notes",
      singleValue: gynecData.menarcheNotes,
    });
  }

  if (items.length === 0) return null;

  return (
    <View style={styles.subsectionContainer}>
      <View style={styles.contentContainer}>
        <Text style={[styles.subsectionTitle]}>Gynec History:</Text>
        <View style={styles.bulletList}>
          {items.map((item, index) => (
            <View key={`gynec-${index}`} style={styles.bulletItem}>
              <Text style={[styles.bullet]}>•</Text>
              <Text style={[styles.bulletContent]}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.singleValue ? (
                  <Text style={styles.regularText}> ({item.singleValue})</Text>
                ) : (
                  <>
                    <Text style={styles.regularText}> (</Text>
                    {item.parts.map((part, partIdx) => (
                      <React.Fragment key={`part-${partIdx}`}>
                        {partIdx > 0 && (
                          <Text style={styles.separator}> | </Text>
                        )}
                        <Text style={styles.itemLabel}>{part.label}:</Text>
                        <Text style={styles.regularText}> {part.value}</Text>
                      </React.Fragment>
                    ))}
                    <Text style={styles.regularText}>)</Text>
                  </>
                )}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const renderLabResults = (labResults, printSettings) => {
  const groupByReportNameForAll = (data) => {
    return data.map((item) => {
      const groupedInputs = item.inputs.reduce((acc, input) => {
        if (!acc[input.reportName]) {
          acc[input.reportName] = [];
        }
        acc[input.reportName].push(input);
        return acc;
      }, {});

      return {
        date: item.date,
        groupedInputs,
      };
    });
  };

  const syncLabResultsData = (labResults) => {
    const allReportNames = new Set();
    const allTestNamesByReport = {};

    labResults.forEach((result) => {
      Object.keys(result.groupedInputs).forEach((reportName) => {
        allReportNames.add(reportName);
        if (!allTestNamesByReport[reportName]) {
          allTestNamesByReport[reportName] = new Set();
        }
        result.groupedInputs[reportName].forEach((test) => {
          allTestNamesByReport[reportName].add(test.testName);
        });
      });
    });

    const allReportNamesArray = Array.from(allReportNames);
    const allTestNamesByReportArray = {};
    Object.keys(allTestNamesByReport).forEach((reportName) => {
      allTestNamesByReportArray[reportName] = Array.from(
        allTestNamesByReport[reportName]
      );
    });

    return labResults.map((result) => {
      const transformedGroupedInputs = {};

      allReportNamesArray.forEach((reportName) => {
        if (!result.groupedInputs[reportName]) {
          transformedGroupedInputs[reportName] = allTestNamesByReportArray[
            reportName
          ].map((testName) => ({
            reportName,
            testName,
            value: "-",
            arrowDirection: "",
            units: "",
          }));
        } else {
          const existingTests = result.groupedInputs[reportName];

          const updatedTests = allTestNamesByReportArray[reportName].map(
            (testName) => {
              const existingTest = existingTests.find(
                (test) => test.testName === testName
              );
              return (
                existingTest || {
                  reportName,
                  testName,
                  value: "-",
                  arrowDirection: "",
                  units: "",
                }
              );
            }
          );

          transformedGroupedInputs[reportName] = updatedTests;
        }
      });

      return {
        ...result,
        groupedInputs: transformedGroupedInputs,
      };
    });
  };

  const labParamsPatchData = labResults
    ? groupByReportNameForAll(labResults)
    : null;
  const labParamsPatchTableData = labParamsPatchData
    ? syncLabResultsData(labParamsPatchData)
    : null;

  if (!labResults) return null;
  return (
    <View style={{ marginTop: PX_TO_PT * 15 }}>
      <Text
        style={{
          color: "#171725",
          fontWeight: 700,
          marginBottom: PX_TO_PT * 6,
        }}
        fixed
        wrap={false}
      >
        Lab Results:&nbsp;
      </Text>

      <View style={{ marginTop: PX_TO_PT * 6 }}>
        <View style={[obsStyles.table, { marginTop: 0 }]}>
          <View style={[obsStyles.headerRow]} fixed>
            <Text
              style={[
                obsStyles.headerCell,
                {
                  flex: 1,
                  fontWeight: 500,
                  color: "#000",
                },
              ]}
            >
              {"NAME"}
            </Text>
            {labParamsPatchTableData.map((entry, i) => (
              <Text
                key={i}
                style={[
                  obsStyles.headerCell,
                  {
                    flex: 1,
                    fontWeight: 500,
                    color: "#000",
                  },
                ]}
              >
                {moment(entry.date).format("Do MMM YY")}
              </Text>
            ))}
          </View>

          {labParamsPatchTableData &&
            Object.keys(labParamsPatchTableData[0]?.groupedInputs || {}).map(
              (reportName, j) => (
                <View key={j} style={{ marginTop: PX_TO_PT * 0 }}>
                  <View style={[obsStyles.row]} wrap={false}>
                    <Text
                      style={[
                        obsStyles.cell,
                        {
                          flex: 1,
                          fontWeight: 500,
                          color: "#000",
                        },
                      ]}
                    >
                      {reportName}
                    </Text>
                  </View>

                  {labParamsPatchTableData[0]?.groupedInputs[reportName]?.map(
                    (test, idx) => (
                      <View key={idx} style={{ marginTop: PX_TO_PT * 0 }}>
                        <View style={[obsStyles.row]} wrap={false}>
                          <Text
                            style={[
                              obsStyles.cell,
                              {
                                flex: 1,
                                fontWeight: 500,
                                color: "#000",
                              },
                            ]}
                          >
                            {test.testName}
                          </Text>

                          {labParamsPatchTableData.map((entry, k) => {
                            const testResult = entry?.groupedInputs[
                              reportName
                            ]?.find(
                              (input) => input?.testName === test?.testName
                            );
                            return (
                              <Text
                                key={k}
                                style={[
                                  obsStyles.cell,
                                  {
                                    flex: 1,
                                    fontWeight: 400,
                                    color: "#000",
                                  },
                                ]}
                              >
                                {testResult
                                  ? testResult.value +
                                    " " +
                                    (testResult.testName !== "Remarks"
                                      ? testResult.units
                                      : "")
                                  : "-"}
                                &nbsp;
                              </Text>
                            );
                          })}
                        </View>
                      </View>
                    )
                  )}
                </View>
              )
            )}
        </View>
      </View>
    </View>
  );
};

/**
 * PatientHistory Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Patient history data
 * @param {Object} props.formatSettings - Format settings for subsections
 * @returns {JSX.Element} Patient History Section
 */
const PatientHistory = ({
  data,
  formatSettings,
  isAssessment = false,
  title,
  frequencyList,
  timingList,
  fontSize,
  isDischargeSummary = false
}) => {
  const hasAssessmentData = isAssessment
    ? !!data?.basicInfo
    : !!data?.patientHistory;
  if (!hasAssessmentData) return null;
  const finalData = isAssessment ? data?.basicInfo : data?.patientHistory;

  const patientHistorySection = formatSettings.find(
    (section) => section.id === (isAssessment ? "basicInfo" : "patientHistory")
  );
  const subsections = patientHistorySection?.subSections || [];

  const sortedSubsections = getAllVisibleSections(subsections);

  const hasRenderableSubsection = sortedSubsections.some((subsection) => {
    const key = subsection.id;

    // top informant
    if (key === "topInformant" && finalData.topInformant) {
      return true;
    }
    // Presenting Complaints
    if (key === "presentingComplaints" && finalData.presentingComplaints) {
      return true;
    }

    // Past Medical History
    if (key === "pastMedicalHistory" && finalData.pastMedicalHistory) {
      return true;
    }

    // Gynec History
    if (
      ((isAssessment && key === "gyneacHistory") ||
        (!isAssessment && key === "gynecHistory")) &&
      Object.keys(finalData.gyneacHistory)?.length
    ) {
      return true;
    }

    // Medications
    if (isAssessment && key === "medications" && finalData.medications) {
      return true;
    }

    // Lab Results
    if (key === "labResults" && finalData.labResults?.length) {
      return true;
    }

    // Obstetric History
    if (
      isAssessment &&
      key === "obstetricHistory" &&
      finalData?.obstetricHistory &&
      Object.keys(finalData.obstetricHistory).length
    ) {
      return true;
    }

    return false;
  });

  if (!hasRenderableSubsection) return null;

  return (
    <View style={styles.sectionContainer} 
    break
    >
      {title ? <SectionTitle title={title} />: null}
      <View style={styles.mainContainer}>
        {sortedSubsections.map((subsection) => {
          const key = subsection.id;

          // Top Informant
          if (key === "topInformant" && finalData?.topInformant) {
            return renderTopInformant(finalData?.topInformant);
          }

          // Presenting Complaints
          if (
            key === "presentingComplaints" &&
            finalData.presentingComplaints &&
            !isEmptyRichText(finalData.presentingComplaints)
          ) {
            return renderPresentingComplaints(
              Array.isArray(finalData?.presentingComplaints)
                ? finalData.presentingComplaints
                : [finalData.presentingComplaints]
            );
          }

          // Past Medical History
          if (key === "pastMedicalHistory" && finalData.pastMedicalHistory) {
            return renderPastMedicalHistory(finalData.pastMedicalHistory);
          }

          // Gynec History
          if (
            ((isAssessment && key === "gyneacHistory") ||
              (!isAssessment && key === "gynecHistory")) &&
            Object.keys(finalData.gyneacHistory)?.length
          ) {
            return renderGynecHistory(finalData.gyneacHistory);
          }

          // Medications

          if (isAssessment && key === "medications" && finalData.medications) {
            // return renderGynecHistory(finalData.medications, fontFamily);
            return (
              <MedicationTable
                medications={
                  finalData.medications || finalData.currentMedication
                }
                title="Medication (Rx)"
                frequencyList={frequencyList}
                timingList={timingList}
                fontSize={fontSize}
              />
            );
          }

          // Obstetric History
          if (
            isAssessment &&
            key === "obstetricHistory" &&
            Object.keys(finalData?.obstetricHistory)?.length
          ) {
            return (
              <ObsHistoryListView
                PX_TO_PT={0.75}
                styles={obsStyles}
                printSettings={{
                  page_format: {
                    pagination: true,
                  },
                }}
                options={IPD.OBSTETRIC_HISTORY_PRINT_FORMAT_STRUCTURE}
                obsHistoryData={finalData?.obstetricHistory}
              />
            );
          }

          // Lab Results
          if (key === "labResults" && finalData.labResults?.length) {
            return renderLabResults(finalData.labResults, {
              page_format: {
                pagination: true,
              },
            });
          }

          return null;
        })}
      </View>
    </View>
  );
};

export default PatientHistory;
