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
      <SectionTitle title="Provisional Diagnosis" />
      <DiagnosisAndSurgery data={data} isAssessment={true} />
    </View>
  );
};

/**
 * Basic Information Section
 */
const renderBasicInfo = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Basic Info" />
      <PatientHistory
        data={data}
        formatSettings={formatSettings}
        isAssessment={true}
      />
    </View>
  );
};

/**
 * Physical Examination Section
 */
const renderPhysicalExamination = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Physical Examination" />
      <PhysicalExamination
        data={data}
        isAssessment={true}
        formatSettings={formatSettings}
      />
    </View>
  );
};

/**
 * Functional Assessment Section
 */
const renderFunctionalAssessment = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Functional Assessment" />
      <FunctionalAssessment
        isAssessment={true}
        data={data}
        formatSettings={formatSettings}
      />
    </View>
  );
};

const renderTreatmentPlan = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Treatment Plan" />
      <RichTextPrintRendererSection
        data={data}
        formatSettings={formatSettings}
        id="treatmentPlan"
      />
    </View>
  );
};

const renderAdditionalNotes = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Additional Notes" />
      <RichTextPrintRendererSection
        data={data}
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
 * @returns {Array} Array of section components
 */
export const renderAdmissionAssessment = (data, formatSettings) => {
  const sortedSections = getAllVisibleSections(formatSettings || null);
  if (!data || !formatSettings) return [];

  // Get sorted sections

  // Map section keys to render functions (using new array format IDs)
  const sectionRenderers = {
    admittingConsultant: () => renderPrimaryConsultant(data, formatSettings),
    provisionalDiagnosis: () =>
      renderDiagnosisAndSurgery(
        { diagnosisAndSurgery: data },

        formatSettings
      ),
    treatmentPlan: () => renderTreatmentPlan(data, formatSettings),
    additionalNotes: () => renderAdditionalNotes(data, formatSettings),
    basicInfo: () => renderBasicInfo(data, formatSettings),
    physicalExamination: () => renderPhysicalExamination(data, formatSettings),
    functionalAssessment: () =>
      renderFunctionalAssessment(data, formatSettings),
    // Backward compatibility with old keys
    primaryConsultant: () => renderPrimaryConsultant(data, formatSettings),
    dignosisAndSurgery: () => renderDiagnosisAndSurgery(data, formatSettings),
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
