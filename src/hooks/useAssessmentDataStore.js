import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setAdditionalNotesData,
  setChiefComplaint,
  setFunctionalAssessmentData,
  setGynecHistoryData,
  setHistoryOfPresentIllness,
  setLabResults,
  setPhysicalExaminationBasicData,
  setPhysicalExaminationOthersData,
  setReferredDocForReview,
  setTreatmentPlanData,
  setVitalsData,
} from "../redux/ipd/assessmentsFormSlice";
import {
  setMedicalHistoryData,
  setMedicationData,
} from "../redux/prescriptionSlice";
import { addObstetricDetails } from "../redux/obstetricSlice";
import { setProvisionalDiagnosis } from "../redux/ipd/dischargeSummarySlice";

/**
 * Custom hook to handle adding assessment data to Redux store
 * @returns {Function} addDataToStore - Memoized function to populate Redux store with assessment data
 */
export const useAssessmentDataStore = () => {
  const dispatch = useDispatch();

  const addDataToStore = useCallback(
    (data) => {
      if (data) {
        // Basic Info dispatches
        dispatch(setChiefComplaint(data?.basicInfo?.presentingComplaints || []));
        dispatch(
          setHistoryOfPresentIllness(
            data?.basicInfo?.historyOfPresentIllness || []
          )
        );
        dispatch(setMedicationData(data?.basicInfo?.medications || []));
        dispatch(setLabResults(data?.basicInfo?.labResults || []));
        dispatch(
          setMedicalHistoryData(data?.basicInfo?.pastMedicalHistory || [])
        );
        dispatch(setGynecHistoryData(data?.basicInfo?.gyneacHistory || []));
        dispatch(addObstetricDetails(data?.basicInfo?.obstetricHistory || []));

        // Physical Examination dispatches
        dispatch(setVitalsData(data?.physicalExamination?.vitals || {}));
        dispatch(setProvisionalDiagnosis(data?.provisionalDiagnosis || []));
        dispatch(
          setPhysicalExaminationOthersData(
            data?.physicalExamination?.others || []
          )
        );
        dispatch(
          setPhysicalExaminationBasicData(
            data?.physicalExamination?.examination || {}
          )
        );

        // Functional Assessment dispatches
        const functionalAssessmentWithoutReferredDoc = {
          ...data?.functionalAssessment,
        };
        delete functionalAssessmentWithoutReferredDoc.referredToPhysiotherapyForReview;
        dispatch(
          setFunctionalAssessmentData(
            functionalAssessmentWithoutReferredDoc || {}
          )
        );

        // Treatment Plan and Additional Notes dispatches
        dispatch(setTreatmentPlanData(data?.treatmentPlan || {}));
        dispatch(setAdditionalNotesData(data?.additionalNotes || {}));

        // Referred Doc for Review dispatch
        dispatch(
          setReferredDocForReview(
            data?.functionalAssessment?.referredToPhysiotherapyForReview || null
          )
        );
      }
    },
    [dispatch]
  );

  return { addDataToStore };
};
