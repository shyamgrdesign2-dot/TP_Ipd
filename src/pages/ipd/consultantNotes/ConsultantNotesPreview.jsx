import React from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as consultantIcons } from "../../../assets/images/consultantNotesIcons/index.js";

import LabInvestigationTable from "./components/LabInvestigationTable";
import "./ConsultantNotesPreview.scss";
import { isEmptyRichText } from "../../../components/PDFGenerator/index.js";
import InteractionGate from "../components/InteractionGate/InteractionGate.jsx";
import MedicationBoxIpd from "../../../components/medicationBoxIpd.js";
import { IPD } from "../../../utils/locale.js";
import useCheckExaminationData from "../../../hooks/useCheckExaminationData.js";
import CNExaminationSection from "../assessmentForm/CNExaminationSection.jsx";
import FilledByCards from "../otNotes/components/FilledByCards.jsx";
import ExaminationSection from "../assessmentForm/ExaminationSection.jsx";
import { groupIpdCustomModulesById } from "../../../utils/utils.js";

const RichTextEditor = createRemoteComponent("RichTextEditor");

const ConsultantNotesPreview = ({ entry }) => {
  const consultationData = entry?.consultationNotes || {};
  const updates = entry?.updates;

  const clinicalAssessmentPlan = consultationData?.clinicalAssessmentPlan;
  const vitals = consultationData?.vitals || {};
  const medication = consultationData?.medication || [];
  const fluidBalance = consultationData?.fluidBalance || [];
  const examination = consultationData?.examination || [];
  const labInvestigation = consultationData?.labInvestigation || [];
  const additionalRemarks = consultationData?.additionalRemarks;

  const customModulesArray = groupIpdCustomModulesById(consultationData?.customModules);

  const filledBy = entry?.createdByName;
  const role = entry?.createdByRole;
  const checkExaminationDataPresent = useCheckExaminationData(examination);

  // Check if vitals has any non-empty values
  const hasVitals = Object.values(vitals).some(
    (value) => value !== null && value !== undefined && value !== ""
  );

  // Format vitals as key-value pairs with label and value
  const formatVitalsData = () => {
    if (!hasVitals) return [];

    const vitalLabels = {
      pulse: "Pulse",
      bloodPressure: "Blood Pressure",
      temperature: "Temperature",
      spo2: "SpO2",
      respiratoryRate: "Respiratory Rate",
      weight: "Weight",
      height: "Height",
      generalRbs: "General RBS",
    };

    const vitalUnits = {
      pulse: "/min",
      bloodPressure: "mmHg",
      temperature: "°F",
      spo2: "%",
      respiratoryRate: "/min",
      weight: "kg",
      height: "cms",
      generalRbs: "mg/dl",
    };

    const vitalItems = [];
    Object.entries(vitals).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        const label = vitalLabels[key] || key;
        const unit = vitalUnits[key] || "";
        vitalItems.push({
          label,
          value: `${value}${unit}`,
        });
      }
    });

    return vitalItems;
  };

  const hasAnyContent =
    !isEmptyRichText(clinicalAssessmentPlan) ||
    hasVitals ||
    (Array.isArray(medication) && medication.length > 0) ||
    (Array.isArray(labInvestigation) && labInvestigation.length > 0) ||
    !isEmptyRichText(additionalRemarks);

  if (!hasAnyContent) {
    return null;
  }

  return (
    <div className="consultant-notes-preview-wrapper">
      <div className="consultant-notes-preview-content expanded">
        {/* Clinical Assessment & Plan */}
        {!isEmptyRichText(clinicalAssessmentPlan) && (
          <div className="cnp-section">
            <div className="cnp-section-header">
              <img
                className="cnp-section-icon"
                src={consultantIcons.clinicalAssessmentPlanPc}
                alt="Clinical Assessment"
              />
              <div className="cnp-section-title">
                Clinical Assessment & Plan
              </div>
            </div>
            <div className="cnp-section-content">
              <RichTextEditor
                showActionBtns={false}
                showAutoFill={false}
                showMagicPenGif={false}
                width={"100%"}
                showMicrophone={false}
                showToolbar={false}
                readOnly={true}
                className="rich-text-editor-container-readonly"
                initialValue={clinicalAssessmentPlan}
              />
            </div>
          </div>
        )}

        {/* Vitals */}
        {hasVitals && (
          <div className="cnp-section">
            <div className="cnp-section-header">
              <img
                className="cnp-section-icon"
                src={consultantIcons.vitalsPc}
                alt="Vitals"
              />
              <div className="cnp-section-title">Vitals</div>
            </div>
            <div className="cnp-section-content">
              <div className="cnp-vitals-inline">
                {formatVitalsData().map((vitalItem, index) => (
                  <React.Fragment key={index}>
                    <span className="cnp-vitals-label">{vitalItem.label}:</span>
                    <span className="cnp-vitals-value"> {vitalItem.value}</span>
                    {index < formatVitalsData().length - 1 && (
                      <span className="cnp-vitals-separator"> | </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medication */}
        {Array.isArray(medication) && medication.length > 0 && (
          <div className="ipdcnp-medication-box-container-readonly">
            <InteractionGate disabled={true}>
              <MedicationBoxIpd isEditable={false} medication={medication} />
            </InteractionGate>
          </div>
        )}

        {/* Fluid Balance */}
        {Object.keys(fluidBalance).length > 0 && (
          <div className="cnp-section">
            <div className="cnp-section-header">
              <img
                className="cnp-section-icon"
                src={consultantIcons.fluidBalancePc}
                alt="Fluid Balance"
              />
              <div className="cnp-section-title">Fluid Balance</div>
            </div>
            <div className="cnp-section-content">
              <div className="cnp-fluid-balance-inline">
                {Object.entries(fluidBalance).map(([key, value], index) => (
                  <React.Fragment key={index}>
                    <span className="cnp-fluid-balance-label fw-semibold">
                      {key}:
                    </span>
                    <span className="cnp-fluid-balance-value"> {value}</span>
                    {index < Object.entries(fluidBalance).length - 1 && (
                      <span className="cnp-fluid-balance-separator"> | </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Examination */}
        {checkExaminationDataPresent && (
          <CNExaminationSection
            isEditable={false}
            examinationData={examination}
            sectionData={IPD.DEFAULT_CONSULTANT_NOTES_FORM_STRUCTURE[3]}
          />
        )}

        {/* Lab Investigation */}
        {Array.isArray(labInvestigation) && labInvestigation.length > 0 && (
          <div className="cnp-section">
            <div className="cnp-section-header">
              <img
                className="cnp-section-icon"
                src={consultantIcons.labInvestigationPc}
                alt="Lab Investigation"
              />
              <div className="cnp-section-title">Lab Investigation</div>
            </div>
            <div className="cnp-section-content cnp-no-left-pad">
              <LabInvestigationTable data={labInvestigation} />
            </div>
          </div>
        )}

        {/* Additional Remarks */}
        {!isEmptyRichText(additionalRemarks) && (
          <div className="cnp-section">
            <div className="cnp-section-header">
              <img
                className="cnp-section-icon"
                src={consultantIcons.additionalRemarksPc}
                alt="Additional Remarks"
              />
              <div className="cnp-section-title">Additional Remarks</div>
            </div>
            <div className="cnp-section-content">
              <RichTextEditor
                showActionBtns={false}
                showAutoFill={false}
                showMagicPenGif={false}
                width={"100%"}
                showMicrophone={false}
                showToolbar={false}
                readOnly={true}
                className="rich-text-editor-container-readonly"
                initialValue={additionalRemarks}
              />
            </div>
          </div>
        )}

        {/* Custom Modules */}

        {customModulesArray.map(({ moduleId, content = [], moduleName }) => (
          <div className="cnp-section" key={moduleId}>
            <div className="cnp-section-header">
              <img
                className="cnp-section-icon"
                src={consultantIcons.customModulesPc}
                alt={moduleName}
              />
              <div className="cnp-section-title">{moduleName}</div>
            </div>
            <div className="cnp-section-content">
              <RichTextEditor
                showActionBtns={false}
                showAutoFill={false}
                showMagicPenGif={false}
                width={"100%"}
                showMicrophone={false}
                showToolbar={false}
                readOnly={true}
                className="rich-text-editor-container-readonly"
                initialValue={content}
              />
            </div>
          </div>
        ))}

        <FilledByCards
          updates={!!updates.length ? [updates[updates.length - 1]] : []}
          createdByRole={entry?.createdByRole}
          createdByName={entry?.createdByName}
          createdAt={entry?.createdAt}
        />
      </div>
    </div>
  );
};

export default ConsultantNotesPreview;
