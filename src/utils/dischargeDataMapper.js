/**
 * Utility function to map discharge summary data back to Redux stores
 * This function reverses the mapping done in DischargeSummary.jsx (lines 491-564)
 * to populate all relevant Redux slices with data from the discharge summary API response
 * 
 * Usage:
 * 1. Import the function: import { addDischargeDataToStore } from '../utils/dischargeDataMapper';
 * 2. Call it after getting discharge summary data from API:
 *    dispatch(getDischargeSummaryData({ patientId, admissionId })).then(res => {
 *      addDischargeDataToStore(res.payload.dischargeSummary, dispatch);
 *    });
 * 
 * This will automatically populate all relevant Redux stores with the discharge summary data.
 */

import { useDispatch } from 'react-redux';
import {
  setChiefComplaint,
  setHistoryOfPresentIllness,
  setLabResults,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
  setPhysicalExaminationBasicData,
  setReferredDocForReview,
  setFunctionalAssessmentData,
  setTreatmentPlanData,
  setAdditionalNotesData,
  setVitalsData,
  setGynecHistoryData,
} from '../redux/ipd/assessmentsFormSlice';

import {
  setMedicationData,
  setMedicalHistoryData,
} from '../redux/prescriptionSlice';

import { addObstetricDetails } from '../redux/obstetricSlice';

import {
  setDischargeSummaryData,
  setTreatmentNotes,
  setChronologicalSummary,
} from '../redux/ipd/dischargeSummarySlice';

/**
 * Maps discharge summary API response data back to Redux stores
 * @param {Object} dischargeSummaryData - The discharge summary data from API response
 * @param {Function} dispatch - Redux dispatch function
 */
export const addDischargeDataToStore = (dischargeSummaryData, dispatch) => {
  if (!dischargeSummaryData || !dispatch) {
    console.warn('addDischargeDataToStore: Missing dischargeSummaryData or dispatch function');
    return;
  }

  try {
    // 1. Assessment Form Data - Basic Info
    if (dischargeSummaryData.patientHistory) {
      // Chief Complaint (mapped from pastMedicalHistory in reqData)
      if (dischargeSummaryData.patientHistory.pastMedicalHistory) {
        dispatch(setChiefComplaint(dischargeSummaryData.patientHistory.pastMedicalHistory));
      }

      // Medical History Data (prescription slice)
      if (dischargeSummaryData.patientHistory.pastMedicalHistory) {
        dispatch(setMedicalHistoryData(dischargeSummaryData.patientHistory.pastMedicalHistory));
      }

      // Gynec History Data
      if (dischargeSummaryData.patientHistory.gyneacHistory) {
        dispatch(setGynecHistoryData(dischargeSummaryData.patientHistory.gyneacHistory));
      }

      // Obstetric History
      if (dischargeSummaryData.patientHistory.obstetricHistory) {
        dispatch(addObstetricDetails(dischargeSummaryData.patientHistory.obstetricHistory));
      }
    }

    // 2. Physical Examination Data
    if (dischargeSummaryData.physicalExamination) {
      // Vitals Data
      if (dischargeSummaryData.physicalExamination.vitals) {
        dispatch(setVitalsData(dischargeSummaryData.physicalExamination.vitals));
      }

      // General Examination (Basic Data)
      if (dischargeSummaryData.physicalExamination.generalExamination) {
        dispatch(setPhysicalExaminationBasicData(dischargeSummaryData.physicalExamination.generalExamination));
      }

      // Others Data
      if (dischargeSummaryData.physicalExamination.others) {
        dispatch(setPhysicalExaminationOthersData(dischargeSummaryData.physicalExamination.others));
      }
    }

    // 3. Diagnosis and Surgery Data
    if (dischargeSummaryData.diagnosisAndSurgery) {
      // Final Diagnosis (mapped from physicalExaminationProvisionalDiagnosisData in reqData)
      if (dischargeSummaryData.diagnosisAndSurgery.finalDiagnosis) {
        dispatch(setPhysicalExaminationProvisionalDiagnosisData(dischargeSummaryData.diagnosisAndSurgery.finalDiagnosis));
      }
    }

    // 4. Functional Assessment Data
    if (dischargeSummaryData.functionalAssessmentTimeOfAdmission) {
      // Assessment data
      if (dischargeSummaryData.functionalAssessmentTimeOfAdmission.assessment) {
        dispatch(setFunctionalAssessmentData(dischargeSummaryData.functionalAssessmentTimeOfAdmission.assessment));
      }

      // Others data (if needed for functional assessment)
      if (dischargeSummaryData.functionalAssessmentTimeOfAdmission.others) {
        // This might need additional handling based on your requirements
        console.log('Functional assessment others data:', dischargeSummaryData.functionalAssessmentTimeOfAdmission.others);
      }
    }

    // 5. Discharge Medications
    if (dischargeSummaryData.dischargeNotes && dischargeSummaryData.dischargeNotes.dischargeMedications) {
      dispatch(setMedicationData(dischargeSummaryData.dischargeNotes.dischargeMedications));
    }

    // 6. Course in Hospital Data
    if (dischargeSummaryData.courseInHospital) {
      // Chronological Summary
      if (dischargeSummaryData.courseInHospital.chronologicalSummary) {
        dispatch(setChronologicalSummary(dischargeSummaryData.courseInHospital.chronologicalSummary));
      }

      // Treatment Given (Treatment Notes)
      if (dischargeSummaryData.courseInHospital.treatmentGiven) {
        dispatch(setTreatmentNotes(dischargeSummaryData.courseInHospital.treatmentGiven));
      }
    }

    // 7. Discharge Summary Specific Data
    // Set the entire discharge summary data to the discharge summary slice
    dispatch(setDischargeSummaryData(dischargeSummaryData));

    // 8. Additional data that might be present
    // Lab Results (if present in the response)
    if (dischargeSummaryData.labResults) {
      dispatch(setLabResults(dischargeSummaryData.labResults));
    }

    // History of Present Illness (if present in the response)
    if (dischargeSummaryData.historyOfPresentIllness) {
      dispatch(setHistoryOfPresentIllness(dischargeSummaryData.historyOfPresentIllness));
    }

    // Treatment Plan Data (if present in the response)
    if (dischargeSummaryData.treatmentPlan) {
      dispatch(setTreatmentPlanData(dischargeSummaryData.treatmentPlan));
    }

    // Additional Notes Data (if present in the response)
    if (dischargeSummaryData.additionalNotes) {
      dispatch(setAdditionalNotesData(dischargeSummaryData.additionalNotes));
    }

    // Referred Doc For Review (if present in the response)
    if (dischargeSummaryData.referredDocForReview) {
      dispatch(setReferredDocForReview(dischargeSummaryData.referredDocForReview));
    }

    console.log('Successfully mapped discharge summary data to Redux stores');

  } catch (error) {
    console.error('Error mapping discharge summary data to stores:', error);
  }
};

/**
 * Alternative hook-based approach for using the mapper
 * @returns {Function} The addDischargeDataToStore function with dispatch already bound
 */
export const useDischargeDataMapper = () => {
  const dispatch = useDispatch();
  
  return (dischargeSummaryData) => {
    addDischargeDataToStore(dischargeSummaryData, dispatch);
  };
};

// Export individual mapping functions for more granular control if needed
export const mapPatientHistoryData = (patientHistory, dispatch) => {
  if (patientHistory.pastMedicalHistory) {
    dispatch(setChiefComplaint(patientHistory.pastMedicalHistory));
    dispatch(setMedicalHistoryData(patientHistory.pastMedicalHistory));
  }
  if (patientHistory.gyneacHistory) {
    dispatch(setGynecHistoryData(patientHistory.gyneacHistory));
  }
  if (patientHistory.obstetricHistory) {
    dispatch(addObstetricDetails(patientHistory.obstetricHistory));
  }
};

export const mapPhysicalExaminationData = (physicalExamination, dispatch) => {
  if (physicalExamination.vitals) {
    dispatch(setVitalsData(physicalExamination.vitals));
  }
  if (physicalExamination.generalExamination) {
    dispatch(setPhysicalExaminationBasicData(physicalExamination.generalExamination));
  }
  if (physicalExamination.others) {
    dispatch(setPhysicalExaminationOthersData(physicalExamination.others));
  }
};

export const mapDiagnosisData = (diagnosisAndSurgery, dispatch) => {
  if (diagnosisAndSurgery.finalDiagnosis) {
    dispatch(setPhysicalExaminationProvisionalDiagnosisData(diagnosisAndSurgery.finalDiagnosis));
  }
};
