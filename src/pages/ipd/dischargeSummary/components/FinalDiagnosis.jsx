import React, { useCallback, useState } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector, useDispatch } from "react-redux";
import { isEmptyRichText } from "../../../../utils/utils";
import DiagnosisPickerTable from "../../components/DiagnosisPickerTable/DiagnosisPickerTable";
import defaultIcons from "../../../../assets/images/indices";
import { setFinalDiagnosis } from "../../../../redux/ipd/dischargeSummarySlice";
import { useTemplateManagement } from "../../../../hooks/useTemplateManagement";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const FinalDiagnosis = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const dispatch = useDispatch();
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const finalDiagnosis = dischargeSummaryData?.diagnosisAndSurgery?.finalDiagnosis || [];
  const doctorId = dischargeSummaryData?.patientInformation?.primaryConsultant?.id;
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  // Get current value callback
  const getCurrentValue = useCallback(() => {
    return Array.isArray(finalDiagnosis) && finalDiagnosis.length
      ? finalDiagnosis
      : [];
  }, [finalDiagnosis]);

  // Use template management hook
  const {
    templates: normalizedTemplates,
    templatesLoading,
    handleTemplateSelected,
    handleAddTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    refreshTemplates,
  } = useTemplateManagement({
    moduleName: "finalDiagnosis",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "array",
    getCurrentValue,
    onArrayChange: useCallback(
      (data) => {
        dispatch(setFinalDiagnosis(data));
      },
      [dispatch]
    ),
  });

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
      icon={defaultIcons?.[`${sectionData?.id}Pc`]}
      title={sectionData?.title}
      placeholder="Enter final diagnosis"
      isDataPresent={finalDiagnosis?.length > 0}
      onErase={(e) => {
        dispatch(setFinalDiagnosis([]));
      }}
      templates={normalizedTemplates}
      templateType={"finalDiagnosis"}
      showTempButtons={true}
      onSave={() => {
        // Save button click is handled by TempActionButtons internally
      }}
      onTemplate={refreshTemplates}
      onTemplateSelected={handleTemplateSelected}
      addTemplate={handleAddTemplate}
      updateTemplate={handleUpdateTemplate}
      onDeleteTemplateClicked={handleDeleteTemplate}
      loading={templatesLoading}
      data={finalDiagnosis || []}
      newAutoFillTextToAppend={autoFillTextToAppend}
      setNewAutoFillTextToAppend={setAutoFillTextToAppend}
      renderBody={() => (
        <DiagnosisPickerTable itemId={"finalDiagnosis"} />
      )}
    />
  );
};

export default FinalDiagnosis;
