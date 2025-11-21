import React, { useState, useRef, useCallback } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector, useDispatch } from "react-redux";
import "./styles.scss";
import DiagnosisPickerTable from "../../components/DiagnosisPickerTable/DiagnosisPickerTable";
import { dischargeSummaryIcons } from "../../../../assets/images/indices";
import { setProvisionalDiagnosis } from "../../../../redux/ipd/dischargeSummarySlice";
import { greenTick } from "../../../../assets/images/dischargeSummaryIcons";
import { useDischargeSummaryData } from "../utils/useDischargeSummaryData";
import { useTemplateManagement } from "../../../../hooks/useTemplateManagement";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ProvisionalDiagnosis = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const dispatch = useDispatch();
  const { showLastUpdatedAt } = useDischargeSummaryData();
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};
  const diagnosisPickerTableRef = useRef(null);
  const doctorId = dischargeSummaryData?.patientInformation?.primaryConsultant?.id;
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  // Get current value callback
  const getCurrentValue = useCallback(() => {
    return Array.isArray(provisionalDiagnosis) && provisionalDiagnosis.length
      ? provisionalDiagnosis
      : [];
  }, [provisionalDiagnosis]);

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
    moduleName: "provisionalDiagnosis",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "array",
    getCurrentValue,
    onArrayChange: useCallback(
      (data) => {
        dispatch(setProvisionalDiagnosis(data));
      },
      [dispatch]
    ),
  });

  if (!isEditable && provisionalDiagnosis.length === 0) return null;

  const renderProvisionalDiagnosis = () => {
    if (!isEditable) {
      return (
        <DiagnosisPickerTable
          itemId={"provisionalDiagnosis"}
          isEditable={false}
          ref={diagnosisPickerTableRef}
        />
      );
    }
    return (
      <div className="ipd-provisional-diagnosis-container">
        <DiagnosisPickerTable
          itemId={"provisionalDiagnosis"}
          isEditable={true}
          ref={diagnosisPickerTableRef}
        />
      </div>
    );
  };

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      showMicrophone={false}
      title={sectionData?.title}
      icon={dischargeSummaryIcons[`${sectionData?.id}Pc`]}
      // showOnlyClear={isEditable}
      isDataPresent={provisionalDiagnosis?.length}
      onErase={(e) => {
        dispatch(setProvisionalDiagnosis([]));
      }}
      initialValue={
        provisionalDiagnosis || [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]
      }
      placeholder="Enter provisional diagnosis"
      headerComponent={!!provisionalDiagnosis.length && showLastUpdatedAt}
      templates={normalizedTemplates}
      templateType={"provisionalDiagnosis"}
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
      data={provisionalDiagnosis || []}
      newAutoFillTextToAppend={autoFillTextToAppend}
      setNewAutoFillTextToAppend={setAutoFillTextToAppend}
      renderBody={renderProvisionalDiagnosis}
    />
  );
};

export default ProvisionalDiagnosis;
