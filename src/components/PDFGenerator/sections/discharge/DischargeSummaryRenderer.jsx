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
import { IPD } from "../../../../utils/locale";

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 12,
  },

  subsectionContainer: {
    marginBottom: 10,
  },

  subsectionTitle: {
    fontWeight: 700,
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

/**
 * Diagnosis and Surgery Section
 */
const renderDiagnosisAndSurgery = (data) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Diagnosis & Surgery" />
      <DiagnosisAndSurgery data={data} />
    </View>
  );
};

/**
 * Patient History Section
 */
const renderPatientHistory = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Patient History" />
      <PatientHistory data={data} formatSettings={formatSettings} />
    </View>
  );
};

/**
 * Physical Examination Section
 */
const renderPhysicalExamination = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Physical Examination at the Time of Admission" />
      <PhysicalExamination data={data} formatSettings={formatSettings} />
    </View>
  );
};

/**
 * Functional Assessment Section
 */
const renderFunctionalAssessment = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Functional Assessment at the Time of Admission" />
      <FunctionalAssessment data={data} formatSettings={formatSettings} />
    </View>
  );
};

/**
 * Course in Hospital Section
 */
const renderCourseInHospital = (data) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Course in Hospital" />
      <CourseInHospital data={data} />
    </View>
  );
};

/**
 * OT Notes Section
 */
const renderOTNotes = (data) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="OT Notes" />
      <OTNotes data={data} />
    </View>
  );
};

/**
 * Discharge Notes Section
 */
const renderDischargeNotes = (data) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Discharge Note" />
      <DischargeNote data={data} />
    </View>
  );
};

/**
 * Discharge Advice Section
 */
const renderDischargeAdvice = (data) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Discharge Advice" />
      <DischargeAdvice data={data} />
    </View>
  );
};

/**
 * Follow-up Section
 */
const renderFollowUp = (data) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Follow-up" />
      <FollowUp data={data} />
    </View>
  );
};

/**
 * Prepared By Section
 */
const renderPreparedBy = (data) => {
  if (!data?.preparedBy) return null;

  const { preparedBy } = data;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Prepared by" />

      {/* Inline label-value */}
      <View style={{ padding: "6px 6px 0 6px" }}>
        <Text
          style={{
            lineHeight: 1.8,
            textTransform: "capitalize",
          }}
        >
          <Text style={{ fontWeight: 600, color: "#171725" }}>
            Discharge Summary Prepared by:{" "}
          </Text>
          <Text style={{ fontWeight: 400, color: "#454551" }}>
            {preparedBy.map(
              (doctor, index) =>
                `${doctor.name}${index < preparedBy.length - 1 ? ", " : ""}`
            )}
          </Text>
        </Text>
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
export const renderDischargeSummary = (data, formatSettings) => {
  if (!data || !formatSettings) return [];

  // Get sorted sections
  const sortedSections = getAllVisibleSections(formatSettings);

  // Map section keys to render functions (using new array format IDs)
  const sectionRenderers = {
    admittingConsultant: () => renderPrimaryConsultant(data),
    diagnosisAndSurgery: () => renderDiagnosisAndSurgery(data),
    patientHistory: () => renderPatientHistory(data, formatSettings),
    physicalExamination: () => renderPhysicalExamination(data, formatSettings),
    functionalAssessment: () =>
      renderFunctionalAssessment(data, formatSettings),
    courseInHospital: () => renderCourseInHospital(data),
    otNotes: () => renderOTNotes(data),
    dischargeNotes: () => renderDischargeNotes(data),
    dischargeAdvice: () => renderDischargeAdvice(data),
    followUp: () => renderFollowUp(data),
    // Backward compatibility with old keys
    primaryConsultant: () => renderPrimaryConsultant(data),
    dignosisAndSurgery: () => renderDiagnosisAndSurgery(data),
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
  if (data.preparedBy) {
    sections.push(renderPreparedBy(data));
  }

  return sections;
};
