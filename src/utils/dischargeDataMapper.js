import { useDispatch } from "react-redux";
import {
  setChiefComplaint,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationBasicData,
  setFunctionalAssessmentData,
  setGynecHistoryData,
  setVitalsData as setAssessmentFormVitalsData,
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
  setOTSurgeries,
  setFollowUps,
} from "../redux/ipd/dischargeSummarySlice";

const DEFAULT_GYNEAC_HISTORY = {
  lmp: "",
  ageAtMenarche: 0,
  cycle: "",
  intervalOfCycle: 0,
  cycleNotes: "",
  flow: "",
  durationOfMenstrualFlow: 0,
  clots: true,
  numberOfPadsPerDay: 0,
  flowNotes: "",
  occurrenceOfPain: "",
  pain: "",
  painNotes: "",
  menarcheNotes: "",
  reproductiveLifeStages: "",
  ageAtMenopause: 0,
  typeOfMenopause: "",
  reproductiveNotes: "",
  notes: "",
};

const isEmptyGyneacHistory = (gyneacHistory) => {
  if (!gyneacHistory || typeof gyneacHistory !== "object") return true;
  const keys = Object.keys(DEFAULT_GYNEAC_HISTORY);
  if (Object.keys(gyneacHistory).length === 0) return true;
  if (Object.keys(gyneacHistory).length !== keys.length) return false;
  return keys.every((key) => gyneacHistory[key] === DEFAULT_GYNEAC_HISTORY[key]);
};

const isEmptyObstetricHistory = (obstetricHistory) => {
  if (!obstetricHistory || typeof obstetricHistory !== "object") return true;

  const { currentPregnancy, pregnancyHistory } = obstetricHistory;
  const isEmptyValue = (val) => {
    if (val === null || val === undefined) return true;
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === "string") return val.trim() === "";
    if (typeof val === "number") return val === 0;
    if (typeof val === "boolean") return val === false;
    if (typeof val === "object") return Object.keys(val).length === 0;
    return false;
  };

  const isEmptyCurrentPregnancy =
    !currentPregnancy ||
    (typeof currentPregnancy === "object" &&
      Object.values(currentPregnancy).every(isEmptyValue));
  const isEmptyPregnancyHistory =
    !Array.isArray(pregnancyHistory) || pregnancyHistory.length === 0;

  return isEmptyCurrentPregnancy && isEmptyPregnancyHistory;
};

export const addDischargeDataToStore = (dischargeSummaryData, dispatch) => {
  if (!dischargeSummaryData || !dispatch) {
    console.warn(
      "addDischargeDataToStore: Missing dischargeSummaryData or dispatch function"
    );
    return;
  }

  try {
    if (dischargeSummaryData?.assessmentId) {
      dispatch(
        setDischargeSummaryDataViaPatch({
          assessmentId: dischargeSummaryData.assessmentId,
        })
      );
    }
    if (dischargeSummaryData?.patientInformation) {
      dispatch(
        setDischargeSummaryDataViaPatch({
          patientInformation: dischargeSummaryData.patientInformation,
        })
      );
    }
    if (dischargeSummaryData?.patientHistory) {
      if (dischargeSummaryData?.patientHistory?.presentingComplaints) {
        dispatch(
          setChiefComplaint(
            dischargeSummaryData.patientHistory.presentingComplaints
          )
        );
      }

      if (dischargeSummaryData?.patientHistory?.pastMedicalHistory) {
        dispatch(
          setMedicalHistoryData(
            dischargeSummaryData.patientHistory.pastMedicalHistory
          )
        );
      }

      const gyneacHistory = dischargeSummaryData?.patientHistory?.gyneacHistory;
      if (!isEmptyGyneacHistory(gyneacHistory)) {
        dispatch(setGynecHistoryData(gyneacHistory));
      }

      const obstetricHistory =
        dischargeSummaryData?.patientHistory?.obstetricHistory;
      if (!isEmptyObstetricHistory(obstetricHistory)) {
        dispatch(addObstetricDetails(obstetricHistory));
      }
    }

    if (dischargeSummaryData?.physicalExamination) {
      if (dischargeSummaryData?.physicalExamination?.vitals) {
        dispatch(
          setAssessmentFormVitalsData(
            dischargeSummaryData.physicalExamination.vitals
          )
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
      dischargeSummaryData?.otNotes &&
      dischargeSummaryData?.otNotes?.surgeries
    ) {
      dispatch(setOTSurgeries(dischargeSummaryData?.otNotes?.surgeries || []));
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

    if (dischargeSummaryData?.crossReferral) {
      dispatch(setDischargeSummaryDataViaPatch({
        crossReferral: dischargeSummaryData?.crossReferral,
      }));
    }
    if (dischargeSummaryData?.labResults) {
      dispatch(setDischargeSummaryDataViaPatch({
        labResults: dischargeSummaryData?.labResults,
      }));
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
      dischargeSummaryData?.dischargeAdvice?.preventiveMeasures &&
        dispatch(
          setDischargeSummaryDataViaPatch({
            preventiveMeasures:
              dischargeSummaryData?.dischargeAdvice?.preventiveMeasures,
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

    if (
      dischargeSummaryData?.followUp?.doctor &&
      !Array.isArray(dischargeSummaryData?.followUp?.doctor)
    ) {
      dispatch(setFollowUpDoctor(dischargeSummaryData.followUp.doctor));
    }
    if (dischargeSummaryData?.followUp) {
      dispatch(setFollowUps(dischargeSummaryData.followUp));
    }

    if (dischargeSummaryData?.followUpAdditionalNotes) {
      dispatch(
        setAdditionalNotes(dischargeSummaryData.followUpAdditionalNotes)
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
