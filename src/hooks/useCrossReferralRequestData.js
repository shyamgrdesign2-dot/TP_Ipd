import { useMemo } from "react";

export const useCrossReferralRequestData = ({
  crossReferralFormDetails,
  customModuleContents,
  serializeCustomModules,
}) => {
  return useMemo(() => {
    const consultantNotesData =
      crossReferralFormDetails?.consultantNotesData || [];

    const reqData = {
      ...(crossReferralFormDetails || {}),
      consultantNotes: consultantNotesData,
      customModules: serializeCustomModules
        ? serializeCustomModules(customModuleContents)
        : [],
    };

    delete reqData.consultantNotesData;
    return reqData;
  }, [crossReferralFormDetails, customModuleContents, serializeCustomModules]);
};

export default useCrossReferralRequestData;
