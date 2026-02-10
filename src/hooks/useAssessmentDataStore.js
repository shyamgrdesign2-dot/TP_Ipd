import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setAdditionalNotesData,
  setTopInformant,
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
import { useSelector } from "react-redux";
import { convertCurrentMedicationToPrescription } from "../utils/utils";

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

/**
 * Custom hook to handle adding assessment data to Redux store
 * @returns {Function} addDataToStore - Memoized function to populate Redux store with assessment data
 */
export const useAssessmentDataStore = () => {
  const dispatch = useDispatch();
  const { defaultList } = useSelector((state) => state.medicalhistory);

  const mapIdsFromDefaultList = useCallback(
    (data = []) => {
      if (!Array.isArray(data) || !defaultList?.length) return data;

      const normalize = (value) =>
        (value || "").toString().trim().toLowerCase();

      return data.map((item) => {
        let section = defaultList.find(
          (defaultItem) =>
            normalize(defaultItem?.title) === normalize(item?.title)
        );

        if (!section && normalize(item?.title) === "others") {
          section = defaultList.find(
            (defaultItem) => normalize(defaultItem?.title) === "lifestyle"
          );
        }

        const mappedTags = Array.isArray(item?.tags)
          ? item.tags.map((tag) => {
              const matchedTag = section?.tags?.find(
                (defaultTag) =>
                  normalize(defaultTag?.title) === normalize(tag?.title)
              );
              return matchedTag?.tmmhst_id
                ? {
                    ...tag,
                    note: tag?.notes || tag?.note,
                    tmmhst_id: matchedTag.tmmhst_id,
                    enable:
                      tag?.enable === "" || tag?.enable === undefined
                        ? "Y"
                        : tag?.enable,
                  }
                : {
                    ...tag,
                    note: tag?.notes || tag?.note,
                    enable:
                      tag?.enable === "" || tag?.enable === undefined
                        ? "Y"
                        : tag?.enable,
                  };
            })
          : item?.tags;

        return section?.tmmhs_id
          ? { ...item, tmmhs_id: section.tmmhs_id, tags: mappedTags }
          : { ...item, tags: mappedTags };
      });
    },
    [defaultList]
  );

  const addDataToStore = useCallback(
    (data, fromAIPipeline = false) => {
      if (data) {
        // Basic Info dispatches
        dispatch(
          setChiefComplaint(data?.basicInfo?.presentingComplaints || [])
        );
        dispatch(setTopInformant(data?.basicInfo?.topInformant || null));
        dispatch(
          setHistoryOfPresentIllness(
            data?.basicInfo?.historyOfPresentIllness || []
          )
        );
        const updatedMedications = data?.basicInfo?.currentMedications?.filter(
          (med) => {
            const groundingData =
              med?.grounding?.[0]?.structuralMedicationData || {
                ...med?.grounding?.[0],
              };
            if (!groundingData || (typeof groundingData === "object" && Object.keys(groundingData).length === 0)) {
              return false;
            }
            return true;
          }
        )?.map(med => {
          const groundingData =
              med?.grounding?.[0]?.structuralMedicationData || {
                ...med?.grounding?.[0],
              };
          const allDetails = {
            ...groundingData,
            unitPerDose: med?.unitPerDose,
            schedule: med?.schedule,
            frequency: med?.frequency,
            duration: med?.duration,
            notes: med?.notes,
          };
          return convertCurrentMedicationToPrescription([allDetails])?.[0];
        });
        dispatch(
          setMedicationData(
            fromAIPipeline
              ? updatedMedications
              : data?.basicInfo?.medications || []
          )
        );
        dispatch(setLabResults(data?.basicInfo?.labResults || []));
        const dataWithIds = fromAIPipeline
          ? mapIdsFromDefaultList(data?.basicInfo?.pastMedicalHistory)
          : data?.basicInfo?.pastMedicalHistory;
        dispatch(setMedicalHistoryData(dataWithIds || []));
        const gyneacHistory = data?.basicInfo?.gyneacHistory;
        if (!isEmptyGyneacHistory(gyneacHistory)) {
          dispatch(setGynecHistoryData(gyneacHistory));
        }
        const obstetricHistory = data?.basicInfo?.obstetricHistory;
        if (!isEmptyObstetricHistory(obstetricHistory)) {
          dispatch(addObstetricDetails(obstetricHistory));
        }

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
    [dispatch, defaultList, mapIdsFromDefaultList]
  );

  return { addDataToStore };
};
