/**
 * Medication Table Component
 * Reusable component for rendering medication tables in PDF
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { PX_TO_PT } from "../constants";
import {
  capitalize,
  getDurationTitle,
  getFrequencyLanguageTitles,
  getFrequencyTitle,
  getTimeingTitle,
  isNumeric,
  medicine_freq_dosage_format,
} from "../../../utils/utils";
import { EXTRA_OPTIONS } from "../../../utils/constants";

const styles = StyleSheet.create({
  medicationTableContainer: {
    gap: 6,
    paddingVertical: 6,
  },

  table: {
    marginTop: PX_TO_PT * 4,
  },

  title: {
    color: "#171725",
    fontWeight: 600,
    lineHeight: 1.8,
    textTransform: "capitalize",
    marginBottom: 4,
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
  headerRow: {
    flexDirection: "row",
    borderBottom: "1px solid #171725",
    borderLeft: "1px solid #171725",
    borderTop: "1px solid #171725",
  },
  headerCell: {
    flex: 1,
    padding: 6,
    borderRight: "1px solid #171725",
    fontWeight: 700,
  },
});

const MedicationTable = ({
  medications,
  title = "Medication (Rx)",
  frequencyList,
  timingList,
  fontSize,
}) => {
  if (!medications || medications.length === 0) return null;

  const innerMedication = (index) => {
    const mainArray = [];
    for (let i = index; i < medications.length; i++) {
      if (medications[i].tmm_id === medications[index].tmm_id) {
        mainArray.push(medications[i]);
      } else {
        break;
      }
    }
    return mainArray;
  };

  const formatUnitPerDose = (tmm_dosage, is_dosage_decimal) => {
    const unitPerDoseFormat = medicine_freq_dosage_format(
      tmm_dosage,
      is_dosage_decimal
    );
    return unitPerDoseFormat;
  };

  const formatFrequency = (
    morning,
    afternoon,
    evening,
    night,
    is_dosage_decimal
  ) => {
    const {
      morning: morningLabel,
      afternoon: afternoonLabel,
      evening: eveningLabel,
      night: nightLabel,
    } = getFrequencyLanguageTitles(1);

    const frequencyParts = [
      morning > 0
        ? `${morningLabel}(${medicine_freq_dosage_format(
            morning,
            is_dosage_decimal
          )})`
        : "",
      afternoon > 0
        ? `${afternoonLabel}(${medicine_freq_dosage_format(
            afternoon,
            is_dosage_decimal
          )})`
        : "",
      evening > 0
        ? `${eveningLabel}(${medicine_freq_dosage_format(
            evening,
            is_dosage_decimal
          )})`
        : "",
      night > 0
        ? `${nightLabel}(${medicine_freq_dosage_format(
            night,
            is_dosage_decimal
          )})`
        : "",
    ].filter(Boolean);
    const frequencyInWords = frequencyParts.join(" - ");
    return frequencyInWords;
  };

  const frequencyLang = () => {
    const value = getFrequencyTitle(1);
    return value;
  };

  const durationLang = (title) => {
    const value = getDurationTitle(1, title);
    return value;
  };

  const timeingLang = () => {
    const value = getTimeingTitle(1);
    return value;
  };

  const medicationData = medications
    ?.map((e, index) => ({ ...e, index: index }))
    .reduce(
      (acc, curr) =>
        acc?.at(-1)?.tmm_id === curr.tmm_id ? acc : [...acc, curr],
      []
    );

  const tableContent = (
    <View style={styles.medicationTableContainer}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.table}>
        <View style={styles.headerRow} fixed>
          <Text
            style={[
              styles.headerCell,
              {
                flex: 0.18,
                fontWeight: 500,
                color: "#000",
              },
            ]}
          >
            S.NO
          </Text>
          <Text
            style={[
              styles.headerCell,
              {
                fontWeight: 500,
                color: "#000",
              },
            ]}
          >
            MEDICINE
          </Text>
          <View
            style={{
              flex: 2.4,
            }}
          >
            <View style={{ flexGrow: 1, flexDirection: "row" }}>
              <Text
                style={[
                  styles.headerCell,
                  {
                    flex: 0.45,
                    fontWeight: 500,
                  },
                ]}
              >
                DOSE
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  {
                    flex: 0.6,
                    fontWeight: 500,
                    color: "#000",
                  },
                ]}
              >
                FREQUENCY
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  {
                    flex: 0.53,
                    fontWeight: 500,
                    color: "#000",
                  },
                ]}
              >
                DURATION
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  {
                    flex: 0.18,
                    fontWeight: 500,
                    color: "#000",
                  },
                ]}
              >
                QTY
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  {
                    flex: 0.7,
                    fontWeight: 500,
                    color: "#000",
                  },
                ]}
              >
                NOTES
              </Text>
            </View>
          </View>
        </View>
        {medicationData?.map((med, i) => (
          <View style={styles.row} key={i} wrap={false}>
            <Text
              style={[
                styles.cell,
                {
                  flex: 0.18,
                  color: "#171725",
                  fontWeight: 500,
                },
              ]}
            >
              {i + 1}
            </Text>
            <View style={styles.cell}>
              <Text
                style={[
                  {
                    fontWeight: 500,
                  },
                ]}
              >
                {med.tmm_medicine_name}
              </Text>
              {med?.tmm_generic && (
                <Text
                  style={[
                    {
                      color: "#171725",
                      fontWeight: 400,
                      fontSize: fontSize - 2,
                      marginTop: 5,
                    },
                  ]}
                >
                  {med.tmm_generic}
                </Text>
              )}
            </View>
            <View
              style={{
                flex: 2.4,
              }}
            >
              {innerMedication(i).map((item, ii) => {
                return (
                  <View
                    style={{
                      flexGrow: 1,
                      flexDirection: "row",
                      borderBottom:
                        ii !== innerMedication(i)?.length - 1
                          ? "1px solid #171725"
                          : "0px",
                    }}
                    key={ii}
                  >
                    <Text
                      style={[
                        styles.cell,
                        {
                          flex: 0.45,
                          color: "#171725",
                          fontWeight: 500,
                        },
                      ]}
                    >{`${
                      item.tmm_dosage && item.tmm_unit
                        ? `${formatUnitPerDose(
                            item.tmm_dosage,
                            med?.is_dosage_decimal
                          )} ${
                            item?.medicineUnit?.find(
                              (x) => x.tmu_id == item.tmm_unit
                            )?.tmu_title || ""
                          }`
                        : `${
                            item?.medicineUnit?.find(
                              (x) => x.tmu_id == item.default_tmm_unit
                            )?.tmu_title || ""
                          }`
                    }`}</Text>

                    <Text
                      style={[
                        styles.cell,
                        {
                          flex: 0.6,
                          color: "#171725",
                          fontWeight: 400,
                        },
                      ]}
                    >
                      {item.tmf_block === 0 || item.tmf_block === ""
                        ? `${
                            item.tcm_tmm_freq_morning ||
                            item.tcm_tmm_freq_afternoon ||
                            item.tcm_tmm_freq_evening ||
                            item.tcm_tmm_freq_night
                              ? `${
                                  item.tcm_tmm_freq_morning
                                    ? medicine_freq_dosage_format(
                                        item.tcm_tmm_freq_morning,
                                        med?.is_dosage_decimal
                                      )
                                    : 0
                                } - ${
                                  item.tcm_tmm_freq_afternoon
                                    ? medicine_freq_dosage_format(
                                        item.tcm_tmm_freq_afternoon,
                                        med?.is_dosage_decimal
                                      )
                                    : 0
                                }${
                                  item.tcm_tmm_freq_evening
                                    ? " - " +
                                      medicine_freq_dosage_format(
                                        item.tcm_tmm_freq_evening,
                                        med?.is_dosage_decimal
                                      )
                                    : ""
                                } - ${
                                  item.tcm_tmm_freq_night
                                    ? medicine_freq_dosage_format(
                                        item.tcm_tmm_freq_night,
                                        med?.is_dosage_decimal
                                      )
                                    : 0
                                }`
                              : formatFrequency(
                                  item.tcm_tmm_freq_morning,
                                  item.tcm_tmm_freq_afternoon,
                                  item.tcm_tmm_freq_evening,
                                  item.tcm_tmm_freq_night
                                )
                          }`
                        : `(${
                            frequencyList?.find(
                              (x) => x.tmf_id === item.tmm_freq_type
                            )?.[frequencyLang()] || ""
                          })`}
                      {"\n"}
                      {timingList?.find((x) => x.tmt_id === item.tmm_time)
                        ?.tmt_title !== "None"
                        ? timingList?.find((x) => x.tmt_id === item.tmm_time)?.[
                            timeingLang()
                          ] || ""
                        : ""}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        {
                          flex: 0.53,
                          color: "#171725",
                          fontWeight: 400,
                        },
                      ]}
                    >
                      {EXTRA_OPTIONS.some(
                        (x) => x.value == item.tmm_duration_type
                      )
                        ? durationLang(capitalize(item.tmm_duration_type, true))
                        : isNumeric(item.tmm_days)
                        ? `${item.tmm_days} ${durationLang(
                            item.tmm_duration_type
                          )}`
                        : "-"}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        {
                          flex: 0.18,
                          color: "#171725",
                          fontWeight: 400,
                        },
                      ]}
                    >
                      {item.display_qty ? item.display_qty : "-"}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        {
                          flex: 0.7,
                          color: "#171725",
                          fontWeight: 400,
                        },
                      ]}
                    >
                      {item.tmm_remarks ? item.tmm_remarks : "-"}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return tableContent;
};

export default MedicationTable;
