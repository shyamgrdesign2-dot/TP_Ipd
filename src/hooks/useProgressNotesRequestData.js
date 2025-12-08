import { useMemo } from "react";

export const useProgressNotesRequestData = ({
  vitals,
  chiefComplaint,
  findings,
  physicalExaminationBasicData,
  additionalRemarks,
  filledDate,
  filledAtTime,
  customModuleContents,
  serializeCustomModules,
}) => {
  return useMemo(() => {
    return {
      vitals: vitals || {},
      chiefComplaint: chiefComplaint || [],
      findings: findings || [],
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
      additionalRemarks: additionalRemarks || [],
      date: filledDate,
      time: filledAtTime,
      customModules: serializeCustomModules
        ? serializeCustomModules(customModuleContents)
        : [],
    };
  }, [
    additionalRemarks,
    chiefComplaint,
    customModuleContents,
    filledAtTime,
    filledDate,
    findings,
    physicalExaminationBasicData,
    serializeCustomModules,
    vitals,
  ]);
};

export default useProgressNotesRequestData;
