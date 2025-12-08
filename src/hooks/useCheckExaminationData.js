import { useMemo } from "react";
import { isEmptyRichText } from "../components/PDFGenerator";

/**
 * Custom hook to check if examination data is present and valid
 * @param {Object} examinationData - The examination data object to check
 * @returns {boolean} - Returns true if valid examination data is present, false otherwise
 */
const useCheckExaminationData = (examinationData) => {
  const isExaminationDataPresent = useMemo(() => {
    return (
      examinationData &&
      typeof examinationData === "object" &&
      !Array.isArray(examinationData) &&
      Object.values(examinationData).some(
        (item) =>
          item &&
          typeof item === "object" &&
          ((item.title &&
          `${item.title}`.trim() !== "") || !isEmptyRichText(item.notes))
      )
    );
  }, [examinationData]);

  return isExaminationDataPresent;
};

export default useCheckExaminationData;
