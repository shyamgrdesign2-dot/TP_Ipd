import { useMemo } from "react";
import { convertMedicationFormat } from "../utils/utils";

const convertToRawFormat = (data = []) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const isAlreadyRaw = data.every(
    (item) => item.tmu_id !== undefined && item.tmu_title !== undefined
  );
  if (isAlreadyRaw) return data;

  return data.map((item) => {
    if (item.key) {
      try {
        return JSON.parse(item.key);
      } catch {
        return { tmu_id: item.value, tmu_title: item.label };
      }
    }

    return { tmu_id: item.value, tmu_title: item.label };
  });
};

const formatAssessmentMedications = (medications) => {
  if (!Array.isArray(medications) || medications.length === 0) {
    return [];
  }

  return medications.map((medication) => {
    const formattedMedication = { ...medication };
    const formattedMedicineUnit = convertToRawFormat(
      formattedMedication.medicineUnit
    );

    if (
      formattedMedication.tmm_dosage_unit_name &&
      formattedMedication.tmm_dosage_unit_name.trim() !== ""
    ) {
      formattedMedication.tmm_dosage = formattedMedication.tmm_dosage_unit_name;
    } else {
      const dosage = formattedMedication.tmm_dosage
        ? formattedMedication.tmm_dosage
        : 1;
      const unitName = formattedMedication.tmm_unit_name
        ? formattedMedication.tmm_unit_name
        : formattedMedicineUnit?.find(
            (x) => x.tmu_id == formattedMedication.tmu_id
          )?.tmu_title || formattedMedicineUnit[0]?.tmu_title;

      formattedMedication.tmm_dosage_unit_name = `${dosage} ${unitName}`.trim();
    }

    return formattedMedication;
  });
};

export const useAssessmentRequestData = ({
  filledDate,
  filledAtTime,
  assessmentData,
  prescriptionData,
  allObstetricDetails,
  provisionalDiagnosis,
  customModuleContents,
  serializeCustomModules,
}) => {
  return useMemo(() => {
    const gyneacHistory = Array.isArray(assessmentData.gynecHistoryData)
      ? {}
      : assessmentData.gynecHistoryData || {};
    const obstetricHistory =
      Array.isArray(allObstetricDetails) && !allObstetricDetails.length
        ? {}
        : allObstetricDetails || {};

    return {
      date: filledDate,
      time: filledAtTime,
      basicInfo: {
        topInformant: assessmentData.topInformant || null,
        presentingComplaints: assessmentData.chiefComplaint || [],
        historyOfPresentIllness: assessmentData.historyOfPresentIllness,
        currentMedications: convertMedicationFormat(
          prescriptionData.medicationData || []
        ),
        medications: formatAssessmentMedications(
          prescriptionData.medicationData || []
        ),
        labResults: assessmentData.labResults || [],
        pastMedicalHistory: prescriptionData.medicalHistoryData || {},
        gyneacHistory,
        obstetricHistory,
      },
      physicalExamination: {
        vitals: assessmentData.vitalsData || {},
        examination: Object.entries(
          assessmentData.physicalExaminationBasicData || {}
        ).reduce((acc, [key, value]) => {
          acc[key] = {
            title: value?.title || "",
            notes: value?.notes || [],
            value: value?.value || null,
          };
          return acc;
        }, {}),
        others: assessmentData.physicalExaminationOthersData || [],
      },
      provisionalDiagnosis: provisionalDiagnosis || [],
      functionalAssessment:
        {
          ...assessmentData.functionalAssessmentData,
          referredToPhysiotherapyForReview:
            assessmentData?.referredDocForReview || null,
        } || {},
      treatmentPlan: assessmentData.treatmentPlanData || [],
      additionalNotes: assessmentData.additionalNotesData || [],
      customModules: serializeCustomModules
        ? serializeCustomModules(customModuleContents)
        : [],
    };
  }, [
    allObstetricDetails,
    assessmentData,
    customModuleContents,
    filledAtTime,
    filledDate,
    prescriptionData,
    provisionalDiagnosis,
    serializeCustomModules,
  ]);
};

export default useAssessmentRequestData;
