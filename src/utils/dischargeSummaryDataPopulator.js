/**
 * Utility to populate Redux stores from Discharge Summary API response
 * This function takes the API response and dispatches data to appropriate Redux stores
 */

// Import all necessary Redux actions
import {
  setDischargeSummaryData,
  setTreatmentNotes,
  setChronologicalSummary,
  setVitalsData,
  setDiet,
  setPhysicalActivities,
  setFollowUpDate,
  setFollowUpDoctor,
  setAdditionalNotes,
  setPreparedBy,
} from "../redux/ipd/dischargeSummarySlice";

import {
  setChiefComplaint,
  setPhysicalExaminationProvisionalDiagnosisData,
  setPhysicalExaminationBasicData,
  setPhysicalExaminationOthersData,
  setFunctionalAssessmentData,
  setVitalsData as setAssessmentVitalsData,
  setGynecHistoryData,
} from "../redux/ipd/assessmentsFormSlice";

import {
  setMedicationData,
} from "../redux/prescriptionSlice";

import {
  addObstetricDetails,
} from "../redux/obstetricSlice";

import {
  setOtNotesData,
} from "../redux/ipd/otNotesSlice";

/**
 * Helper function to format treatment notes from API response
 */
const formatTreatmentNotesFromAPI = (treatmentGiven) => {
  if (!Array.isArray(treatmentGiven)) return [];
  
  return treatmentGiven.map((item, index) => ({
    key: `row_${index}`,
    id: index,
    name: item.name || "",
    code: getCodeFromModule(item.module),
    givenDate: item.givenDate || "",
    duration: item.duration || "",
    notes: item.notes || "",
    module: item.module || "",
  }));
};

/**
 * Helper function to map module to code
 */
const getCodeFromModule = (module) => {
  switch (module) {
    case "Cross Referral":
      return "CR";
    case "Consultant Notes":
      return "CN";
    case "OT Notes":
      return "OT";
    case "Progress Notes":
      return "PN";
    case "Assessment Form":
      return "AF";
    default:
      return "N/A";
  }
};

/**
 * Main function to populate Redux stores from API response
 * @param {Object} apiResponse - The discharge summary API response
 * @param {Function} dispatch - Redux dispatch function
 */
export const populateStoresFromDischargeSummaryAPI = (apiResponse, dispatch) => {
  try {
    const {
      assessmentId,
      patientInformation,
      diagnosisAndSurgery,
      patientHistory,
      physicalExamination,
      functionalAssessmentTimeOfAdmission,
      courseInHospital,
      otNotes,
      dischargeNotes,
      dischargeAdvice,
      followUp,
      preparedBy,
    } = apiResponse;

    // 1. Populate Discharge Summary Store
    const dischargeSummaryData = {
      patientInformation: {
        ...patientInformation,
        dateOfDischarge: patientInformation.dateOfDischarge || "",
      },
      diagnosisAndSurgery: diagnosisAndSurgery || {},
      vitalsData: dischargeNotes?.dischargeVitals || {},
      diet: dischargeAdvice?.diet || [],
      physicalActivities: dischargeAdvice?.physicalActivities || [],
      followUpDate: followUp?.date || "",
      followUpDoctor: Array.isArray(followUp?.doctor) && followUp.doctor.length > 0 
        ? followUp.doctor[0] 
        : null,
      additionalNotes: followUp?.additionalNotes || [],
      preparedBy: preparedBy || null,
      surgeriesPerformed: diagnosisAndSurgery?.surgeriesPerformed || [],
      // Don't store raw chronological summary in courseInHospital to avoid conflicts
      courseInHospital: {
        ...dischargeSummaryData?.courseInHospital,
        // Exclude chronologicalSummary from here to prevent raw data being passed to Slate
      },
    };

    dispatch(setDischargeSummaryData(dischargeSummaryData));

    // Set individual discharge summary fields
    if (dischargeNotes?.dischargeVitals) {
      dispatch(setVitalsData(dischargeNotes.dischargeVitals));
    }
    if (dischargeAdvice?.diet) {
      dispatch(setDiet(dischargeAdvice.diet));
    }
    if (dischargeAdvice?.physicalActivities) {
      dispatch(setPhysicalActivities(dischargeAdvice.physicalActivities));
    }
    if (followUp?.date) {
      dispatch(setFollowUpDate(followUp.date));
    }
    // if (followUp?.doctor && Array.isArray(followUp.doctor) && followUp.doctor.length > 0) {
    //   dispatch(setFollowUpDoctor(followUp.doctor[0]));
    // }
    // if (followUp?.additionalNotes) {
    //   dispatch(setAdditionalNotes(followUp.additionalNotes));
    // }
    // if (preparedBy) {
    //   dispatch(setPreparedBy(Array.isArray(preparedBy) ? preparedBy : [preparedBy]));
    // }

    // // 2. Populate Treatment Notes
    // if (courseInHospital?.treatmentGiven) {
    //   const formattedTreatmentNotes = formatTreatmentNotesFromAPI(courseInHospital.treatmentGiven);
    //   dispatch(setTreatmentNotes(formattedTreatmentNotes));
    // }

     // 3. Populate Chronological Summary
     if (courseInHospital?.chronologicalSummary) {
       dispatch(setChronologicalSummary(courseInHospital.chronologicalSummary));
     }

    // // 4. Populate Assessment Store
    // if (patientHistory?.pastMedicalHistory) {
    //   dispatch(setChiefComplaint(patientHistory.pastMedicalHistory));
    // }
    
    // if (diagnosisAndSurgery?.finalDiagnosis) {
    //   dispatch(setPhysicalExaminationProvisionalDiagnosisData(diagnosisAndSurgery.finalDiagnosis));
    // }
    
    // if (physicalExamination?.generalExamination) {
    //   dispatch(setPhysicalExaminationBasicData(physicalExamination.generalExamination));
    // }
    
    // if (physicalExamination?.others) {
    //   dispatch(setPhysicalExaminationOthersData(physicalExamination.others));
    // }
    
    // if (functionalAssessmentTimeOfAdmission?.assessment) {
    //   dispatch(setFunctionalAssessmentData(functionalAssessmentTimeOfAdmission.assessment));
    // }
    
    // if (physicalExamination?.vitals) {
    //   dispatch(setAssessmentVitalsData(physicalExamination.vitals));
    // }
    
    // if (patientHistory?.gyneacHistory) {
    //   dispatch(setGynecHistoryData(patientHistory.gyneacHistory));
    // }

    // // 5. Populate Obstetric Store
    // if (patientHistory?.obstetricHistory && Object.keys(patientHistory.obstetricHistory).length > 0) {
    //   dispatch(addObstetricDetails(patientHistory.obstetricHistory));
    // }

    // // 6. Populate Prescription/Medication Store
    // if (dischargeNotes?.dischargeMedications) {
    //   dispatch(setMedicationData(dischargeNotes.dischargeMedications));
    // }

    // // 7. Populate OT Notes Store
    // if (otNotes?.surgeries) {
    //   dispatch(setOtNotesData(otNotes.surgeries));
    // }

    console.log("Successfully populated all Redux stores from API response");
    return true;

  } catch (error) {
    console.error("Error populating stores from discharge summary API:", error);
    return false;
  }
};

/**
 * Helper function to clear all related stores before populating new data
 * @param {Function} dispatch - Redux dispatch function
 */
export const clearDischargeSummaryStores = (dispatch) => {
  // Clear discharge summary data
  dispatch(setDischargeSummaryData({}));
  dispatch(setTreatmentNotes([]));
  dispatch(setChronologicalSummary([]));
  
  // Clear assessment data
  dispatch(setChiefComplaint([]));
  dispatch(setPhysicalExaminationProvisionalDiagnosisData([]));
  dispatch(setPhysicalExaminationBasicData({}));
  dispatch(setPhysicalExaminationOthersData([]));
  dispatch(setFunctionalAssessmentData({}));
  dispatch(setAssessmentVitalsData({}));
  dispatch(setGynecHistoryData({}));
  
  // Clear medication data
  dispatch(setMedicationData([]));
  
  // Clear OT notes data
  dispatch(setOtNotesData({}));
};

export default {
  populateStoresFromDischargeSummaryAPI,
  clearDischargeSummaryStores,
};
