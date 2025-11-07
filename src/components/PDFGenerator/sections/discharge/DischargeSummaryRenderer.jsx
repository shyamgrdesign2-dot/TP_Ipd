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
      {/* <SectionTitle title="Admitting Consultant" /> */}
      <Text style={styles.subsectionTitle}>Admitting Consultant:</Text>
      <View style={{ padding: "6px 0px 0 0" }}>
        {renderSimpleText(consultantText)}
      </View>
    </View>
  );
};

const renderCrossReferral = (data, formatSettings) => {
  const text = data.crossReferral
    ?.map((item) => `${item.name} (${item.speciality})`)
    .join(", ");
  return (
    <View style={styles.sectionContainer}>
      {/* <SectionTitle title="Cross Reference" /> */}
      <Text style={styles.subsectionTitle}>Cross Reference:</Text>
      <View style={{ padding: "6px 0px" }}>{renderSimpleText(text)}</View>
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
  // if (!data?.preparedBy) return null;

  // const { preparedBy } = data;

  // if (!preparedBy?.length || preparedBy.some((item) => !item.name)) return null;

  const { primaryConsultant } = data.patientInformation;
  const consultantText = `${primaryConsultant.name} (${primaryConsultant.speciality})`;
  return (
    <View style={styles.sectionContainer}>
      {/* <SectionTitle title="Approved by" /> */}
      <Text style={styles.subsectionTitle}>Discharge Summary Approved by:</Text>

      {/* Inline label-value */}
      <View style={{ padding: "6px 6px 0 6px" }}>
        <Text
          style={{
            lineHeight: 1.8,
            textTransform: "capitalize",
          }}
        >
          {/* <Text style={{ fontWeight: 600, color: "#171725" }}>
            Discharge Summary Prepared by:{" "}
          </Text> */}
          <Text style={{ fontWeight: 400, color: "#454551" }}>
            {/* {preparedBy.map(
              (doctor, index) =>
                `${doctor.name}${index < preparedBy.length - 1 ? ", " : ""}`
            )} */}
            {consultantText}
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
  }

  return sections;
};
