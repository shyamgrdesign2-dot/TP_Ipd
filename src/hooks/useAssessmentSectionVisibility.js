import { useSelector } from "react-redux";
import { isEmptyRichText } from "../utils/utils";

/**
 * Custom hook to determine the visibility of assessment form sections
 * based on the data and isEditable state
 *
 * @param {boolean} isEditable - Whether the form is in editable mode
 * @returns {object} Object containing visibility flags for each section
 */
export const useAssessmentSectionVisibility = (isEditable) => {
  // Assessment form data
  const assessmentData = useSelector((state) => state.assessment);
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};
  const prescriptionData = useSelector((state) => state.prescription);
  const { obstetricDetails } = useSelector((state) => state.obstetric);

  // Extract all necessary data from Redux store
  const {
    chiefComplaint,
    historyOfPresentIllness,
    labResults,
    gynecHistoryData,
    physicalExaminationBasicData,
    physicalExaminationOthersData,
    physicalExaminationProvisionalDiagnosisData,
    functionalAssessmentData,
    referredDocForReview,
    treatmentPlanData,
    additionalNotesData,
  } = assessmentData;

  const { medicationData, medicalHistoryData } = prescriptionData;

  // Helper function to check if gynec history data exists
  const isGynecHistoryDataExists =
    gynecHistoryData && Object.keys(gynecHistoryData).length > 0;

  // Helper function to check if pregnancy history exists
  const pregnancyHistory = obstetricDetails?.examinationHistory || [];

  // BasicInfo section visibility condition
  const showBasicInfo =
    isEditable ||
    !(
      isEmptyRichText(chiefComplaint) &&
      isEmptyRichText(historyOfPresentIllness) &&
      !medicationData?.length &&
      !labResults?.length &&
      !medicalHistoryData?.length &&
      !isGynecHistoryDataExists &&
      !Object.keys(obstetricDetails || {})?.length &&
      !pregnancyHistory?.length
    );

  // PhysicalExamination section visibility condition
  const showPhysicalExamination =
    isEditable ||
    !(
      !Object.keys(physicalExaminationBasicData || {})?.length &&
      isEmptyRichText(physicalExaminationOthersData)
    );

  // FunctionalAssessment section visibility condition
  const showFunctionalAssessment =
    isEditable ||
    !(
      (!Object.keys(functionalAssessmentData || {})?.length ||
        (Object.keys(functionalAssessmentData || {})?.length === 1 &&
          !!functionalAssessmentData?.others)) &&
      !referredDocForReview &&
      isEmptyRichText(functionalAssessmentData?.others)
    );

  // TreatmentPlan section visibility condition
  const showTreatmentPlan =
    isEditable ||
    !(
      isEmptyRichText(treatmentPlanData?.monitoringPlan) &&
      isEmptyRichText(treatmentPlanData?.immediateManagement)
    );

  const showProvisionalDiagnosis = provisionalDiagnosis.length;

  // NoteSection (AdditionalNotes) section visibility condition
  const showNoteSection =
    isEditable ||
    !(
      isEmptyRichText(additionalNotesData?.dischargeCriteria) &&
      isEmptyRichText(additionalNotesData?.specialInstructions)
    );

  // Check if any section has data to show (for overall form visibility)
  const hasAnyData =
    showBasicInfo ||
    showPhysicalExamination ||
    showFunctionalAssessment ||
    showTreatmentPlan ||
    showProvisionalDiagnosis ||
    showNoteSection;

  return {
    showBasicInfo,
    showPhysicalExamination,
    showFunctionalAssessment,
    showTreatmentPlan,
    showNoteSection,
    showProvisionalDiagnosis,
    hasAnyData,
  };
};
