import { useMemo } from "react";
import dayjs from "dayjs";
import { convertMedicationFormat } from "../utils/utils";

const API_DATE_FORMAT = "YYYY-MM-DD";
const API_TIME_FORMAT = "HH:mm:ss";

export const useConsultantNotesRequestData = ({
  clinicalAssessmentPlan,
  vitals,
  medicationData,
  physicalExaminationBasicData,
  fluidBalance,
  investigationData,
  additionalRemarks,
  filledDate,
  filledAtTime,
  customModuleContents,
  serializeCustomModules,
}) => {
  return useMemo(() => {
    return {
      clinicalAssessmentPlan: clinicalAssessmentPlan || [],
      vitals: vitals || {},
      currentMedication: convertMedicationFormat(medicationData),
      examination: Object.entries(physicalExaminationBasicData || {}).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            title: value?.title || "",
            notes: value?.notes || [],
            value: value?.value || null,
          };
          return acc;
        },
        {}
      ),
      fluidBalance: fluidBalance || {},
      medication: medicationData,
      labInvestigation:
        investigationData?.map((e) => ({
          name: e.investigation_name,
          notes: e.note,
          service_code: e.service_code,
        })) || [],
      additionalRemarks: additionalRemarks || [],
      date: filledDate ? dayjs(filledDate).format(API_DATE_FORMAT) : "",
      time: filledAtTime ? dayjs(filledAtTime).format(API_TIME_FORMAT) : "",
      customModules: serializeCustomModules
        ? serializeCustomModules(customModuleContents)
        : [],
    };
  }, [
    additionalRemarks,
    clinicalAssessmentPlan,
    customModuleContents,
    filledAtTime,
    filledDate,
    fluidBalance,
    investigationData,
    medicationData,
    physicalExaminationBasicData,
    serializeCustomModules,
    vitals,
  ]);
};

export default useConsultantNotesRequestData;
