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
    fontSize: 11,
    fontWeight: 700,
    color: "#000000",
    marginBottom: 6,
    marginTop: 8,
  },
});

/**
 * Primary Consultant Section (Admitting Consultant)
 */
const renderPrimaryConsultant = (data, fontFamily, formatSettings) => {
  if (!data?.patientInformation?.primaryConsultant) return null;

  const { primaryConsultant } = data.patientInformation;
  const consultantText = `${primaryConsultant.name} (${primaryConsultant.speciality})`;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Admitting Consultant" fontFamily={fontFamily} />
      <View style={{ padding: "6px 0px" }}>
        {renderSimpleText(consultantText, fontFamily)}
      </View>
    </View>
  );
};

/**
 * Diagnosis and Surgery Section
 */
const renderDiagnosisAndSurgery = (data, fontFamily, formatSettings) => {
  return (
    <DiagnosisAndSurgery
      title="Diagnosis & Surgery"
      formatSettings={formatSettings}
      data={data}
      fontFamily={fontFamily}
    />
  );
};

/**
 * Patient History Section
 */
const renderPatientHistory = (data, fontFamily, formatSettings) => {
  return (
    <PatientHistory
      data={data}
      formatSettings={formatSettings}
      fontFamily={fontFamily}
      title="Patient History"
    />
  );
};

/**
 * Physical Examination Section
 */
const renderPhysicalExamination = (data, fontFamily, formatSettings) => {
  return (
    <PhysicalExamination
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
      title="Physical Examination at the Time of Admission"
    />
  );
};

/**
 * Functional Assessment Section
 */
const renderFunctionalAssessment = (data, fontFamily, formatSettings) => {
  return (
    <FunctionalAssessment
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
      title="Functional Assessment at the Time of Admission"
    />
  );
};

/**
 * Course in Hospital Section
 */
const renderCourseInHospital = (data, fontFamily, formatSettings) => {
  return (
    <CourseInHospital
      title="Course in Hospital"
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
    />
  );
};

/**
 * OT Notes Section
 */
const renderOTNotes = (data, fontFamily, formatSettings) => {
  return (
    <OTNotes
      title="OT Notes"
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
    />
  );
};

/**
 * Discharge Notes Section
 */
const renderDischargeNotes = (data, fontFamily, formatSettings) => {
  return (
    <DischargeNote
      title="Discharge Note"
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
    />
  );
};

/**
 * Discharge Advice Section
 */
const renderDischargeAdvice = (data, fontFamily, formatSettings) => {
  return (
    <DischargeAdvice
      title="Discharge Advice"
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
    />
  );
};

/**
 * Follow-up Section
 */
const renderFollowUp = (data, fontFamily, formatSettings) => {
  return (
    <FollowUp
      title="Follow-up"
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
    />
  );
};

/**
 * Prepared By Section
 */
const renderPreparedBy = (data, fontFamily) => {
  if (!data?.preparedBy) return null;

  const { preparedBy } = data;

  if (!preparedBy?.length || preparedBy.some((item) => !item.name)) return null;

  return (
    <View style={{ gap: 4 }}>
      <SectionTitle title="Prepared by" fontFamily={fontFamily} />

      {/* Inline label-value */}
      <View style={{ padding: "6px 6px 0 6px" }}>
        <Text
          style={{
            fontSize: 10,
            lineHeight: 1.8,
            textTransform: "capitalize",
            fontFamily,
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
 * @param {string} fontFamily - Font family
 * @returns {Array} Array of section components
 */
export const renderDischargeSummary = (data, formatSettings, fontFamily) => {
  if (!data || !formatSettings) return [];

  // Get sorted sections
  const sortedSections = getAllVisibleSections(formatSettings);

  // Map section keys to render functions (using new array format IDs)
  const sectionRenderers = {
    admittingConsultant: () =>
      renderPrimaryConsultant(data, fontFamily, formatSettings),
    diagnosisAndSurgery: () =>
      renderDiagnosisAndSurgery(data, fontFamily, formatSettings),
    patientHistory: () =>
      renderPatientHistory(data, fontFamily, formatSettings),
    physicalExamination: () =>
      renderPhysicalExamination(data, fontFamily, formatSettings),
    functionalAssessment: () =>
      renderFunctionalAssessment(data, fontFamily, formatSettings),
    courseInHospital: () =>
      renderCourseInHospital(data, fontFamily, formatSettings),
    otNotes: () => renderOTNotes(data, fontFamily, formatSettings),
    dischargeNotes: () =>
      renderDischargeNotes(data, fontFamily, formatSettings),
    dischargeAdvice: () =>
      renderDischargeAdvice(data, fontFamily, formatSettings),
    followUp: () => renderFollowUp(data, fontFamily, formatSettings),
    // Backward compatibility with old keys
    primaryConsultant: () =>
      renderPrimaryConsultant(data, fontFamily, formatSettings),
    dignosisAndSurgery: () =>
      renderDiagnosisAndSurgery(data, fontFamily, formatSettings),
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
    sections.push(renderPreparedBy(data, fontFamily));
  }

  return sections;
};
