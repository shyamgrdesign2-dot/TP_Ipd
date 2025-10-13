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
import { getSortedSections } from "../../utils/pdfUtils";

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
const renderPrimaryConsultant = (data, fontFamily) => {
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
const renderDiagnosisAndSurgery = (data, fontFamily) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Diagnosis & Surgery" fontFamily={fontFamily} />
      <DiagnosisAndSurgery data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Patient History Section
 */
const renderPatientHistory = (data, fontFamily, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Patient History" fontFamily={fontFamily} />
      <PatientHistory
        data={data}
        formatSettings={formatSettings}
        fontFamily={fontFamily}
      />
    </View>
  );
};

/**
 * Physical Examination Section
 */
const renderPhysicalExamination = (data, fontFamily) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle
        title="Physical Examination at the Time of Admission"
        fontFamily={fontFamily}
      />
      <PhysicalExamination data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Functional Assessment Section
 */
const renderFunctionalAssessment = (data, fontFamily) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle
        title="Functional Assessment at the Time of Admission"
        fontFamily={fontFamily}
      />
      <FunctionalAssessment data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Course in Hospital Section
 */
const renderCourseInHospital = (data, fontFamily) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Course in Hospital" fontFamily={fontFamily} />
      <CourseInHospital data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * OT Notes Section
 */
const renderOTNotes = (data, fontFamily) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="OT Notes" fontFamily={fontFamily} />
      <OTNotes data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Discharge Notes Section
 */
const renderDischargeNotes = (data, fontFamily) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Discharge Note" fontFamily={fontFamily} />
      <DischargeNote data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Discharge Advice Section
 */
const renderDischargeAdvice = (data, fontFamily) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Discharge Advice" fontFamily={fontFamily} />
      <DischargeAdvice data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Follow-up Section
 */
const renderFollowUp = (data, fontFamily) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Follow-up" fontFamily={fontFamily} />
      <FollowUp data={data} fontFamily={fontFamily} />
    </View>
  );
};

/**
 * Prepared By Section
 */
const renderPreparedBy = (data, fontFamily) => {
  if (!data?.preparedBy) return null;

  const { preparedBy } = data;

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
            {preparedBy.name}
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
  console.log('INTEL ==> data', data)
  if (!data || !formatSettings) return [];

  // Get sorted sections
  const sortedSections = getSortedSections(formatSettings);

  // Map section keys to render functions
  const sectionRenderers = {
    primaryConsultant: () => renderPrimaryConsultant(data, fontFamily),
    dignosisAndSurgery: () => renderDiagnosisAndSurgery(data, fontFamily),
    patientHistory: () =>
      renderPatientHistory(data, fontFamily, formatSettings),
    physicalExamination: () => renderPhysicalExamination(data, fontFamily),
    functionalAssessment: () => renderFunctionalAssessment(data, fontFamily),
    courseInHospital: () => renderCourseInHospital(data, fontFamily),
    otNotes: () => renderOTNotes(data, fontFamily),
    dischargeNotes: () => renderDischargeNotes(data, fontFamily),
    dischargeAdvice: () => renderDischargeAdvice(data, fontFamily),
    followUp: () => renderFollowUp(data, fontFamily),
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
