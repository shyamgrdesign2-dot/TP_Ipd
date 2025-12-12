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
        const updatedMedications = data?.basicInfo?.currentMedications?.map(
          (med) => {
            return (
              med?.grounding?.[0]?.structuralMedicationData || {
                ...med?.grounding?.[0],
              }
            );
          }
        );
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
        dispatch(setGynecHistoryData(data?.basicInfo?.gyneacHistory || {}));
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
    [dispatch, defaultList, mapIdsFromDefaultList]
  );

  return { addDataToStore };
};
