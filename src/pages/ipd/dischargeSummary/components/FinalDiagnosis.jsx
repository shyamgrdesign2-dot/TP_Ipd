import React from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector } from "react-redux";
import { isEmptyRichText } from "../../../../utils/utils";
import DiagnosisPickerTable from "../../components/DiagnosisPickerTable/DiagnosisPickerTable";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const FinalDiagnosis = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { finalDiagnosis } = useSelector((state) => state.dischargeSummary);

  if (!isEditable && isEmptyRichText(finalDiagnosis)) return null;

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      showMicrophone={false}
      initialValue={
        finalDiagnosis || [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]
      }
      title={sectionData?.title}
      placeholder="Enter final diagnosis"
      renderBody={() => (
        <DiagnosisPickerTable itemId={"finalDiagnosis"} />
      )}
    />
  );
};

export default FinalDiagnosis;
