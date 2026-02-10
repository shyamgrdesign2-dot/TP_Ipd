/**
 * Discharge Summary Renderer
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import SectionTitle from "../SectionTitle";
import DiagnosisAndSurgery from "./components/DiagnosisAndSurgery";
import PatientHistory from "./components/PatientHistory";
import PhysicalExamination from "./components/PhysicalExamination";
import FunctionalAssessment from "./components/FunctionalAssessment";
import { renderSimpleText } from "../ListViewRenderer";
import { getAllVisibleSections } from "../../utils/pdfUtils";
import RichTextPrintRendererSection from "./components/RichTextPrintRendererSection";
import { isValidMongoId } from "../../../../utils/utils";
import CustomModuleRenderer from "../../components/CustomModuleRenderer";
import { Text } from "../../components/MultilingualText";

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
const renderDiagnosisAndSurgery = (data, formatSettings) => {
  return (
    <DiagnosisAndSurgery
      title="Provisional Diagnosis"
      data={data}
      formatSettings={formatSettings}
      isAssessment={true}
    />
  );
};

/**
 * Basic Information Section
 */
const renderBasicInfo = (
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
      isAssessment={true}
      // title="Basic Info"
      frequencyList={frequencyList}
      timingList={timingList}
      fontSize={fontSize}
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
      isAssessment={true}
      formatSettings={formatSettings}
      // title="Physical Examination"
    />
  );
};

/**
 * Functional Assessment Section
 */
const renderFunctionalAssessment = (data, formatSettings) => {
  return (
    <FunctionalAssessment
      isAssessment={true}
      data={data}
      formatSettings={formatSettings}
      // title="Functional Assessment"
    />
  );
};

const renderTreatmentPlan = (data, formatSettings) => {
  return (
    <RichTextPrintRendererSection
      data={data}
      formatSettings={formatSettings}
      id="treatmentPlan"
      // title="Treatment Plan"
    />
  );
};

const renderAdditionalNotes = (data, formatSettings) => {
  return (
    <RichTextPrintRendererSection
      data={data}
      formatSettings={formatSettings}
      id="additionalNotes"
      // title="Additional Notes"
    />
  );
};

/**
 * Main Discharge Summary Renderer
 * @param {Object} data - Discharge summary data
 * @param {Object} formatSettings - Format settings
 * @returns {Array} Array of section components
 */
export const renderAdmissionAssessment = (
  data,
  formatSettings,
  frequencyList,
  timingList,
  fontSize
) => {
  const sortedSections = getAllVisibleSections(formatSettings || null);

  if (!data || !formatSettings) return [];

  // Get sorted sections

  // Map section keys to render functions (using new array format IDs)
  const sectionRenderers = {
    admittingConsultant: () => renderPrimaryConsultant(data, formatSettings),
    provisional: () =>
      renderDiagnosisAndSurgery(
        { diagnosisAndSurgery: data },

        formatSettings
      ),
    treatmentPlan: () => renderTreatmentPlan(data, formatSettings),
    additionalNotes: () => renderAdditionalNotes(data, formatSettings),
    basicInfo: () =>
      renderBasicInfo(
        data,
        formatSettings,
        frequencyList,
        timingList,
        fontSize
      ),
    physicalExamination: () => renderPhysicalExamination(data, formatSettings),
    functionalAssessment: () =>
      renderFunctionalAssessment(data, formatSettings),
    // Backward compatibility with old keys
    primaryConsultant: () => renderPrimaryConsultant(data, formatSettings),
    // dignosisAndSurgery: () => renderDiagnosisAndSurgery(data, formatSettings),
  };

  // Render sections in order
  const sections = sortedSections
    .map((section) => {
      const renderer = sectionRenderers[section.id];
      if (section.isCustom || isValidMongoId(section.id)) {
        return <CustomModuleRenderer section={section} data={data?.customModules} />;
      }
      if (renderer) {
        return renderer();
      }
      return <Text>{""}</Text>;
    })
    .filter(Boolean);

  return sections;
};
