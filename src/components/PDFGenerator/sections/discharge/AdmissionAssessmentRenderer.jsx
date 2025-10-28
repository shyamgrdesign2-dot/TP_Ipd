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
import RichTextPrintRendererSection from "./components/RichTextPrintRendererSection";

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
const renderDiagnosisAndSurgery = (data, fontFamily, formatSettings) => {
  return (
    <DiagnosisAndSurgery
      title="Provisional Diagnosis"
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
      isAssessment={true}
    />
  );
};

/**
 * Basic Information Section
 */
const renderBasicInfo = (data, fontFamily, formatSettings) => {
  return (
    <PatientHistory
      data={data}
      formatSettings={formatSettings}
      fontFamily={fontFamily}
      isAssessment={true}
      title="Basic Info"
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
      isAssessment={true}
      formatSettings={formatSettings}
      title="Physical Examination"
    />
  );
};

/**
 * Functional Assessment Section
 */
const renderFunctionalAssessment = (data, fontFamily, formatSettings) => {
  return (
    <FunctionalAssessment
      isAssessment={true}
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
      title="Functional Assessment"
    />
  );
};

const renderTreatmentPlan = (data, fontFamily, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Treatment Plan" fontFamily={fontFamily} />
      <RichTextPrintRendererSection
        data={data}
        fontFamily={fontFamily}
        formatSettings={formatSettings}
        id="treatmentPlan"
      />
    </View>
  );
};

const renderAdditionalNotes = (data, fontFamily, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Additional Notes" fontFamily={fontFamily} />
      <RichTextPrintRendererSection
        data={data}
        fontFamily={fontFamily}
        formatSettings={formatSettings}
        id="additionalNotes"
      />
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
export const renderAdmissionAssessment = (data, formatSettings, fontFamily) => {
  const sortedSections = getAllVisibleSections(formatSettings || null);
  if (!data || !formatSettings) return [];

  // Get sorted sections

  // Map section keys to render functions (using new array format IDs)
  const sectionRenderers = {
    admittingConsultant: () =>
      renderPrimaryConsultant(data, fontFamily, formatSettings),
    provisionalDiagnosis: () =>
      renderDiagnosisAndSurgery(
        { diagnosisAndSurgery: data },
        fontFamily,
        formatSettings
      ),
    treatmentPlan: () => renderTreatmentPlan(data, fontFamily, formatSettings),
    additionalNotes: () =>
      renderAdditionalNotes(data, fontFamily, formatSettings),
    basicInfo: () => renderBasicInfo(data, fontFamily, formatSettings),
    physicalExamination: () =>
      renderPhysicalExamination(data, fontFamily, formatSettings),
    functionalAssessment: () =>
      renderFunctionalAssessment(data, fontFamily, formatSettings),
    // Backward compatibility with old keys
    primaryConsultant: () =>
      renderPrimaryConsultant(data, fontFamily, formatSettings),
    dignosisAndSurgery: () =>
      renderDiagnosisAndSurgery(data, fontFamily, formatSettings),
  };

  // Render sections in order
  const sections = sortedSections
    .map((section) => {
      const renderer = sectionRenderers[section.id];
      if (renderer) {
        return renderer();
      }
      return null;
    })
    .filter(Boolean);

  return sections;
};
