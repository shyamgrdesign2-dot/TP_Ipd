import { useMemo } from "react";

export const useOtNotesRequestData = ({
  filledDate,
  filledAtTime,
  otNotesState,
  serializeCustomModules,
  customModuleContents,
}) => {
  return useMemo(() => {
    return {
      date: filledDate,
      time: filledAtTime,
      surgeryDetails: {
        ...otNotesState.surgeryDetails,
      },
      surgeryTeam: {
        ...otNotesState.surgeryTeam,
      },
      operativeNotes: Object.entries(otNotesState.operativeNotes || {}).reduce(
        (acc, [key, value]) => {
          acc[key] = value?.value || value;
          return acc;
        },
        {}
      ),
      intraOperativeNotes: {
        complicationsSeverity:
          otNotesState.intraOperativeNotes?.complicationsSeverity?.value || [],
        specimensSent:
          otNotesState.intraOperativeNotes?.specimensSent?.value || [],
        implantsUsed:
          otNotesState.intraOperativeNotes?.implantsUsed?.value || [],
        estimatedBloodLoss:
          parseInt(
            otNotesState.intraOperativeNotes?.additionalUnits
              ?.estimatedBloodLoss,
            10
          ) || 0,
        swabCount:
          parseInt(
            otNotesState.intraOperativeNotes?.additionalUnits?.swabCount,
            10
          ) || 0,
        fluidCount:
          parseInt(
            otNotesState.intraOperativeNotes?.additionalUnits?.fluidCount,
            10
          ) || 0,
        sutureType:
          parseInt(
            otNotesState.intraOperativeNotes?.additionalUnits?.sutureType,
            10
          ) || 0,
      },
      postOperativeNotes: {
        postOpDestination:
          otNotesState.postOperativeNotes?.postOpDestination?.value || "",
        additionalInstructions:
          otNotesState.postOperativeNotes?.additionalInstructions?.value || [],
        ...Object.entries(otNotesState.postOperativeNotes || {}).reduce(
          (acc, [key, value]) => {
            const excludedKeys = [
              "postOpDestination",
              "additionalInstructions",
            ];
            if (!excludedKeys.includes(key)) {
              acc[key] = value?.value || value;
            }
            return acc;
          },
          {}
        ),
      },
      customModules: serializeCustomModules
        ? serializeCustomModules(customModuleContents)
        : [],
    };
  }, [customModuleContents, filledAtTime, filledDate, otNotesState, serializeCustomModules]);
};

export default useOtNotesRequestData;
