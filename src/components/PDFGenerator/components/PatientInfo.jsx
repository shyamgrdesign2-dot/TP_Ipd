/**
 * Patient Information Component
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import { getVisiblePatientFields } from "../utils/pdfUtils";
import { isZydus } from "../../../utils/utils";

const styles = StyleSheet.create({
  outerContainer: {
    gap: 10,
    marginBottom: 16,
  },

  topBorder: {
    height: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#A2A2A8",
  },

  container: {
    padding: "0 14px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },

  fieldText: {
    flexDirection: "row",
    flexWrap: "wrap",
    lineHeight: 1.8,
    color: "#171725",
    paddingRight: "10px",
  },
  title: {
    fontSize: 16,
    fontWeight: 900,
    color: "#454551",
    textAlign: "center",
    letterSpacing: 0.2,
    lineHeight: 1.75,
    textTransform: "uppercase",
  },

  addressText: {
    lineHeight: 2,
    color: "#171725",
  },

  label: {
    fontWeight: 600,
  },

  value: {
    fontWeight: 400,
  },

  bottomBorder: {
    height: 0,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#A2A2A8",
  },
});

/**
 * PatientInfo Component - Exact Figma Design Match
 * @param {Object} props - Component props
 * @param {Object} props.displaySettings - Display patient info settings
 * @param {Object} props.patientData - Patient data
 * @param {Object} props.fullData - Full discharge summary data
 * @returns {JSX.Element} Patient Info
 */
const PatientInfo = ({
  displaySettings,
  patientData,
  patientInfoFontSize,
  documentType,
  fullData,
}) => {
  // Hide patient info for admission details as it's included in the content sections
  if (documentType === "admissionDetails") {
    return null;
  }
  // if (!displaySettings || !patientData) return null;

  let visibleFields = getVisiblePatientFields(displaySettings, patientData);
  
  // Remove mrnNo field for non-Zydus users
  if (!isZydus()) {
    visibleFields = visibleFields.filter((field) => field.key !== "mrnNo");
  }
  
  let surgeryDateFields = [];

  if (
    fullData?.otNotes?.surgeries &&
    Array.isArray(fullData.otNotes.surgeries)
  ) {
    surgeryDateFields = fullData.otNotes.surgeries
      .map((surgery, index) => {
        if (surgery.dateOfSurgery) {
          return {
            key: `dateOfSurgery${index + 1}`,
            label: `Date of Surgery ${index + 1}`,
            value: surgery.dateOfSurgery,
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  if (visibleFields.length === 0) return null;

  const showPatientInfoSetting = displaySettings?.showPatientInfo;
  const showInfoOnAllPages = showPatientInfoSetting === 1;
  const showInfoOnFirstPageOnly = showPatientInfoSetting === 0;
  const showNameAndMrnOnOtherPages =
    showInfoOnFirstPageOnly &&
    displaySettings?.showPatientNameAndMrnNoOnAllPages;

  const renderFieldColumns = () => (
    <View>
      <View style={[styles.container, { fontSize: patientInfoFontSize }]}>
        <View style={{ flex: 0.6 }}>
          {visibleFields?.map((item, i) => {
            return (
              i % 2 === 0 && (
                <Text key={`left-${i}`} style={[styles.fieldText]}>
                  {item.label && !!item.value && (
                    <Text style={styles.label}>{item.label}:</Text>
                  )}
                  {item.value && (
                    <Text style={styles.value}> {item.value}</Text>
                  )}
                </Text>
              )
            );
          })}
        </View>
        <View style={{ flex: 0.4 }}>
          {visibleFields?.map((item, i) => {
            return (
              i % 2 === 1 && (
                <Text key={`right-${i}`} style={[styles.fieldText]}>
                  <Text style={styles.label}>{item.label}:</Text>
                  <Text style={styles.value}> {item.value}</Text>
                </Text>
              )
            );
          })}
        </View>
      </View>
      {surgeryDateFields.length > 0 ? (
        <View style={[styles.container, { fontSize: patientInfoFontSize }]}>
          <View style={{ flex: 0.6 }}>
            {surgeryDateFields?.map((item, i) => {
              return (
                i % 2 === 0 && (
                  <Text key={`left-${i}`} style={[styles.fieldText]}>
                    {item.label && !!item.value && (
                      <Text style={styles.label}>{item.label}:</Text>
                    )}
                    {item.value && (
                      <Text style={styles.value}> {item.value}</Text>
                    )}
                  </Text>
                )
              );
            })}
          </View>
          <View style={{ flex: 0.4 }}>
            {surgeryDateFields?.map((item, i) => {
              return (
                i % 2 === 1 && (
                  <Text key={`right-${i}`} style={[styles.fieldText]}>
                    <Text style={styles.label}>{item.label}:</Text>
                    <Text style={styles.value}> {item.value}</Text>
                  </Text>
                )
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );

  const renderNameAndMrn = () => (
    <View style={[styles.container, { fontSize: patientInfoFontSize }]}>
      <View style={{ flex: 0.7 }}>
        <Text style={styles.fieldText}>
          <Text style={styles.label}>Patient Name:</Text>
          <Text style={styles.value}> {patientData?.patientName}</Text>
        </Text>
      </View>
      <View style={{ flex: 0.4 }}>
        <Text style={styles.fieldText}>
          <Text style={styles.label}>MRN No:</Text>
          <Text style={styles.value}> {patientData?.mrnNo}</Text>
        </Text>
      </View>
    </View>
  );

  const dischargeStaticHeader =
    !patientData?.dischargeType || patientData?.dischargeType === "Normal"
      ? "Normal Discharge Summary"
      : patientData?.dischargeType === "Daycare" ||
        patientData?.dischargeType === "daycare"
      ? "Daycare Summary"
      : patientData?.dischargeType === "LAMA"
      ? "Leaving Against Medical Advice (LAMA) Summary"
      : patientData?.dischargeType === "Death"
      ? "Death Summary"
      : "";

  return (
    <>
      {/* Fixed title on all pages */}
      {documentType === "dischargeSummary" && !!dischargeStaticHeader ? (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
          fixed
        >
          <Text style={styles.title}>{dischargeStaticHeader}</Text>
        </View>
      ) : null}

      <View style={styles.outerContainer} fixed={showInfoOnAllPages}>
        <View style={styles.topBorder} />
        {(showInfoOnAllPages || showInfoOnFirstPageOnly) &&
          renderFieldColumns()}
        <View style={styles.bottomBorder} />
      </View>

      {showNameAndMrnOnOtherPages && (
        <View
          fixed
          render={({ pageNumber }) =>
            pageNumber > 1 ? (
              <View style={styles.outerContainer}>
                <View style={styles.topBorder} />
                {renderNameAndMrn()}
                <View style={styles.bottomBorder} />
              </View>
            ) : null
          }
        />
      )}
    </>
  );
};

export default PatientInfo;
