import { useDispatch } from "react-redux";
import {
  setChiefComplaint,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
  setPhysicalExaminationBasicData,
  setFunctionalAssessmentData,
  setGynecHistoryData,
} from "../redux/ipd/assessmentsFormSlice";

import {
  setMedicationData,
  setMedicalHistoryData,
} from "../redux/prescriptionSlice";

import { addObstetricDetails } from "../redux/obstetricSlice";

import {
  setTreatmentNotes,
  setChronologicalSummary,
  setProvisionalDiagnosis,
  setFollowUpDate,
  setFollowUpDoctor,
  setAdditionalNotes,
  setPreparedBy,
  setPatientCondition,
  setDiet,
  setVitalsData,
  setDischargeSummaryDataViaPatch,
  setFinalDiagnosis,
} from "../redux/ipd/dischargeSummarySlice";

export const addDischargeDataToStore = (dischargeSummaryData, dispatch) => {
  if (!dischargeSummaryData || !dispatch) {
    console.warn(
      "addDischargeDataToStore: Missing dischargeSummaryData or dispatch function"
    );
    return;
  }

  try {
    if (dischargeSummaryData?.assessmentId) {
      dispatch(setDischargeSummaryDataViaPatch({assessmentId: dischargeSummaryData.assessmentId}));
    }
    if (dischargeSummaryData?.patientInformation) {
      dispatch(setDischargeSummaryDataViaPatch({patientInformation: dischargeSummaryData.patientInformation}));
    }
    if (dischargeSummaryData?.patientHistory) {
      if (dischargeSummaryData?.patientHistory?.presentingComplaints) {
        dispatch(
          setChiefComplaint(dischargeSummaryData.patientHistory.presentingComplaints)
        );
      }

      if (dischargeSummaryData?.patientHistory?.pastMedicalHistory) {
        dispatch(
          setMedicalHistoryData(
            dischargeSummaryData.patientHistory.pastMedicalHistory
          )
        );
      }

      if (dischargeSummaryData?.patientHistory?.gyneacHistory) {
        dispatch(
          setGynecHistoryData(dischargeSummaryData.patientHistory.gyneacHistory)
        );
      }

      if (dischargeSummaryData?.patientHistory?.obstetricHistory) {
        dispatch(
          addObstetricDetails(
            dischargeSummaryData.patientHistory.obstetricHistory
          )
        );
      }
    }

    if (dischargeSummaryData?.physicalExamination) {
      if (dischargeSummaryData?.physicalExamination?.vitals) {
        dispatch(
          setVitalsData(dischargeSummaryData.physicalExamination.vitals)
        );
      }

      if (dischargeSummaryData?.physicalExamination?.generalExamination) {
        dispatch(
          setPhysicalExaminationBasicData(
            dischargeSummaryData.physicalExamination.generalExamination
          )
        );
      }

      if (dischargeSummaryData?.physicalExamination?.others) {
        dispatch(
          setPhysicalExaminationOthersData(
            dischargeSummaryData.physicalExamination.others
          )
        );
      }
    }

    if (dischargeSummaryData?.diagnosisAndSurgery) {
      if (dischargeSummaryData.diagnosisAndSurgery.finalDiagnosis) {
        dispatch(
          setFinalDiagnosis(
            dischargeSummaryData.diagnosisAndSurgery.finalDiagnosis
          )
        );
      }

      if (dischargeSummaryData?.diagnosisAndSurgery?.provisionalDiagnosis) {
        dispatch(
          setProvisionalDiagnosis(
            dischargeSummaryData.diagnosisAndSurgery.provisionalDiagnosis
          )
        );
      }
    }

    if (dischargeSummaryData?.functionalAssessmentTimeOfAdmission) {
      if (dischargeSummaryData.functionalAssessmentTimeOfAdmission.assessment) {
        dispatch(
          setFunctionalAssessmentData({
            ...dischargeSummaryData.functionalAssessmentTimeOfAdmission
              .assessment,
            others:
              dischargeSummaryData.functionalAssessmentTimeOfAdmission.others ||
              [],
          })
        );
      }
    }

    if (
      dischargeSummaryData?.dischargeNotes &&
      dischargeSummaryData.dischargeNotes.dischargeMedications
    ) {
      dispatch(
        setMedicationData(
          dischargeSummaryData.dischargeNotes.dischargeMedications || []
        )
      );
    }
    if (
      dischargeSummaryData?.dischargeNotes &&
      dischargeSummaryData.dischargeNotes.dischargeVitals
    ) {
      dispatch(
        setVitalsData(dischargeSummaryData.dischargeNotes.dischargeVitals || {})
      );
    }

    if (dischargeSummaryData?.courseInHospital) {
      if (dischargeSummaryData.courseInHospital.chronologicalSummary) {
        dispatch(
          setChronologicalSummary(
            dischargeSummaryData.courseInHospital.chronologicalSummary
          )
        );
      }

      if (dischargeSummaryData?.courseInHospital?.treatmentGiven) {
        dispatch(
          setTreatmentNotes(
            dischargeSummaryData.courseInHospital.treatmentGiven
          )
        );
      }
    }

    if (dischargeSummaryData?.dischargeNotes?.patientCondition) {
      dispatch(
        setPatientCondition(
          dischargeSummaryData.dischargeNotes.patientCondition
        )
      );
    }

    if (dischargeSummaryData?.dischargeAdvice) {
      dischargeSummaryData?.dischargeAdvice?.diet &&
        dispatch(setDiet(dischargeSummaryData?.dischargeAdvice?.diet));
      dischargeSummaryData?.dischargeAdvice?.physicalActivities &&
        dispatch(
          setDischargeSummaryDataViaPatch({
            physicalActivities:
              dischargeSummaryData?.dischargeAdvice?.physicalActivities,
          })
        );
      dischargeSummaryData?.dischargeAdvice?.otherAdvice &&
        dispatch(
          setDischargeSummaryDataViaPatch({
            otherAdvice: dischargeSummaryData?.dischargeAdvice?.otherAdvice,
          })
        );
      dischargeSummaryData?.dischargeAdvice?.warningSigns &&
        dispatch(
          setDischargeSummaryDataViaPatch({
            warningSigns: dischargeSummaryData?.dischargeAdvice?.warningSigns,
          })
        );
      dischargeSummaryData?.dischargeAdvice?.emergencyContact &&
        dispatch(
          setDischargeSummaryDataViaPatch({
            emergencyContact:
              dischargeSummaryData?.dischargeAdvice?.emergencyContact,
          })
        );
    }

    if (dischargeSummaryData?.followUp?.date) {
      dispatch(setFollowUpDate(dischargeSummaryData.followUp.date));
    }

    if (!Array.isArray(dischargeSummaryData?.followUp?.doctor)) {
      dispatch(setFollowUpDoctor(dischargeSummaryData.followUp.doctor));
    }

    if (dischargeSummaryData?.followUp?.additionalNotes) {
      dispatch(
        setAdditionalNotes(dischargeSummaryData.followUp.additionalNotes)
      );
    }
    if (dischargeSummaryData?.preparedBy) {
      dispatch(setPreparedBy(dischargeSummaryData.preparedBy));
    }

    console.log("Successfully mapped discharge summary data to Redux stores");
  } catch (error) {
    console.error("Error mapping discharge summary data to stores:", error);
  }
};

export const useDischargeDataMapper = () => {
  const dispatch = useDispatch();

  return (dischargeSummaryData) => {
    addDischargeDataToStore(dischargeSummaryData, dispatch);
  };
};
