/**
 * Discharge Summary Renderer
 */

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import SectionTitle from "../SectionTitle";
import DiagnosisAndSurgery from "./components/DiagnosisAndSurgery";
import PatientHistory from "./components/PatientHistory";
import PhysicalExamination from "./components/PhysicalExamination";
import FunctionalAssessment from "./components/FunctionalAssessment";
import CourseInHospital from "./components/CourseInHospital";
import OTNotes from "./components/OTNotes";
import DischargeNote from "./components/DischargeNote";
import DischargeAdvice from "./components/DischargeAdvice";
import FollowUp from "./components/FollowUp";
import { renderSimpleText } from "../ListViewRenderer";
import { getAllVisibleSections } from "../../utils/pdfUtils";

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 12,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  subsectionContainer: {
    marginBottom: 4,
  },

  subsectionTitle: {
    fontWeight: 700,
    color: "#000000",
    // marginBottom: 6,
  },
  subsectionTitle2: {
    fontWeight: 700,
    color: "#000000",
    marginBottom: 6,
  },
  subsectionText: {
    color: "#171725",
    fontWeight: 400,
    lineHeight: 1.8,
    marginBottom: 4,
  },
});

/**
 * Primary Consultant Section (Admitting Consultant)
 */
const renderPrimaryConsultant = (data) => {
  if (!data?.patientInformation?.primaryConsultant) return null;

  const { primaryConsultant } = data.patientInformation;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.subsectionTitle, { marginBottom: 4 }]}>
        ADMITTING CONSULTANT
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          border: "1px solid #E0E0E0",
        }}
      >
        <View
          style={{
            width: "70%",
            padding: "8px 12px",
            borderRight: "1px solid #E0E0E0",
          }}
        >
          <Text
            style={{
              fontWeight: 700,
              color: "#000000",
            }}
          >
            {primaryConsultant.name}
          </Text>
        </View>

        <View
          style={{
            width: "30%",
            padding: "8px 12px",
          }}
        >
          <Text
            style={{
              fontWeight: 400,
              color: "#171725",
            }}
          >
            {primaryConsultant.speciality}
          </Text>
        </View>
      </View>
    </View>
  );
};

const renderCrossReferral = (data, formatSettings) => {
  const crossReferrals = data.crossReferral;
  if (!crossReferrals?.length) return null;

  return (
    <View
      wrap={false}
      key="final-diagnosis-section"
      style={styles.subsectionContainer}
    >
      <Text style={styles.subsectionTitle}>CROSS REFERENCE</Text>
      <View
        style={{
          border: "1px solid #E0E0E0",
          marginTop: 6,
        }}
      >
        {crossReferrals.map((dx, index) => (
          <View
            key={`final-dx-${index}`}
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "none",
            }}
          >
            <View
              style={{
                width: "70%",
                padding: "4px 12px",
                borderRight: "1px solid #E0E0E0",
              }}
            >
              <Text
                style={{
                  // fontSize: 10,
                  fontWeight: 400,
                  color: "#171725",
                }}
              >
                {dx.name}
              </Text>
            </View>
            <View
              style={{
                width: "30%",
                padding: "4px 12px",
              }}
            >
              <Text
                style={{
                  // fontSize: 10,
                  fontWeight: 400,
                  color: "#171725",
                }}
              >
                {dx.speciality || "--"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * Diagnosis and Surgery Section
 */
const renderDiagnosisAndSurgery = (data, formatSettings) => {
  return (
    <DiagnosisAndSurgery
      // title="Diagnosis & Surgery"
      formatSettings={formatSettings}
      data={data}
    />
  );
};

/**
 * Patient History Section
 */
const renderPatientHistory = (
  data,
  formatSettings,
  frequencyList,
  timingList,
  fontSize
) => {
  return (
    <PatientHistory
      data={data}
      formatSettings={formatSettings}
      // title="Patient History"
      frequencyList={frequencyList}
      timingList={timingList}
      fontSize={fontSize}
      isDischargeSummary={true}
    />
  );
};

/**
 * Physical Examination Section
 */
const renderPhysicalExamination = (data, formatSettings) => {
  return (
    <PhysicalExamination
      data={data}
      formatSettings={formatSettings}
      isDischargeSummary={true}
      // title="Physical Examination at the Time of Admission"
    />
  );
};

/**
 * Functional Assessment Section
 */
const renderFunctionalAssessment = (data, formatSettings) => {
  return (
    <FunctionalAssessment
      data={data}
      formatSettings={formatSettings}
      title="Functional Assessment at the Time of Admission"
    />
  );
};

/**
 * Course in Hospital Section
 */
const renderCourseInHospital = (data, formatSettings) => {
  return (
    <CourseInHospital
      title="Course in Hospital"
      data={data}
      formatSettings={formatSettings}
    />
  );
};

/**
 * OT Notes Section
 */
const renderOTNotes = (data, formatSettings) => {
  return (
    <OTNotes title="OT Notes" data={data} formatSettings={formatSettings} />
  );
};

/**
 * Discharge Notes Section
 */
const renderDischargeNotes = (
  data,
  formatSettings,
  frequencyList,
  timingList,
  fontSize
) => {
  return (
    <DischargeNote
      // title="Discharge Note"
      data={data}
      formatSettings={formatSettings}
      frequencyList={frequencyList}
      timingList={timingList}
      fontSize={fontSize}
    />
  );
};

/**
 * Discharge Advice Section
 */
const renderDischargeAdvice = (data, formatSettings) => {
  return (
    <DischargeAdvice
      // title="Discharge Advice"
      data={data}
      formatSettings={formatSettings}
    />
  );
};

/**
 * Follow-up Section
 */
const renderFollowUp = (data, formatSettings) => {
  return (
    <FollowUp title="Follow-up" data={data} formatSettings={formatSettings} />
  );
};

/**
 * Prepared By Section
 */
const renderPreparedBy = (data) => {
  const { primaryConsultant } = data.patientInformation;
  const consultantText = `${primaryConsultant.name} (${primaryConsultant.speciality})`;
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.subsectionTitle2}>
        Discharge Summary Approved by:
      </Text>
      <Text
        style={{
          lineHeight: 1.8,
          textTransform: "capitalize",
        }}
      >
        <Text style={{ fontWeight: 400, color: "#454551" }}>
          {consultantText}
        </Text>
      </Text>
    </View>
  );
};

const renderSignOfRelatives = (data) => {
  return (
    <View wrap={false} style={styles.sectionContainer}>
      <Text style={styles.subsectionText}>
        Discharge advice, treatment and care has been explained to patient /
        relatives in the language one understands.
      </Text>
      <View wrap={false} style={styles.flexContainer}>
        <Text style={styles.subsectionTitle}>Name:</Text>
        <View
          style={{
            borderBottom: "1px solid #454551",
            width: 120,
            marginTop: "24px",
            marginBottom: "6px",
          }}
        />
        <Text style={styles.subsectionTitle}>Signature:</Text>
        <View
          style={{
            borderBottom: "1px solid #454551",
            width: 120,
            marginTop: "24px",
            marginBottom: "6px",
          }}
        />
      </View>
    </View>
  );
};

/**
 * Main Discharge Summary Renderer
 * @param {Object} data - Discharge summary data
 * @param {Object} formatSettings - Format settings
 * @returns {Array} Array of section components
 */
export const renderDischargeSummary = (
  data,
  formatSettings,
  frequencyList,
  timingList,
  fontSize
) => {
  if (!data || !formatSettings) return [];

  // Get sorted sections
  const sortedSections = getAllVisibleSections(formatSettings);

  // Map section keys to render functions (using new array format IDs)
  const sectionRenderers = {
    admittingConsultant: () => renderPrimaryConsultant(data, formatSettings),
    crossReferral: () => renderCrossReferral(data, formatSettings),
    diagnosisAndSurgery: () => renderDiagnosisAndSurgery(data, formatSettings),
    patientHistory: () =>
      renderPatientHistory(
        data,
        formatSettings,
        frequencyList,
        timingList,
        fontSize
      ),
    physicalExamination: () => renderPhysicalExamination(data, formatSettings),
    // functionalAssessment: () =>
    //   renderFunctionalAssessment(data, formatSettings),
    courseInHospital: () => renderCourseInHospital(data, formatSettings),
    otNotes: () => renderOTNotes(data, formatSettings),
    dischargeNotes: () =>
      renderDischargeNotes(
        data,
        formatSettings,
        frequencyList,
        timingList,
        fontSize
      ),
    dischargeAdvice: () => renderDischargeAdvice(data, formatSettings),
    followUp: () => renderFollowUp(data, formatSettings),
    // Backward compatibility with old keys
    primaryConsultant: () => renderPrimaryConsultant(data, formatSettings),
    dignosisAndSurgery: () => renderDiagnosisAndSurgery(data, formatSettings),
  };

  // Render sections in order
  const sections = sortedSections
    .map((section) => {
      const renderer = sectionRenderers[section.key];
      if (renderer) {
        return renderer();
      }
      return null;
    })
    .filter(Boolean);

  // Add prepared by at the end
  if (data.patientInformation?.primaryConsultant) {
    sections.push(renderPreparedBy(data));
    sections.push(renderSignOfRelatives(data));
  }

  return sections;
};
