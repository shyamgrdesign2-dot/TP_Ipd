import React, { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector, useDispatch } from "react-redux";
import { isEmptyRichText } from "../../../../utils/utils";
import DiagnosisPickerTable from "../../components/DiagnosisPickerTable/DiagnosisPickerTable";
import defaultIcons from "../../../../assets/images/indices";
import { setFinalDiagnosis } from "../../../../redux/ipd/dischargeSummarySlice";
import {
  deleteTemplate as deleteTemplateThunk,
  getTemplatesByModuleName,
  makeSelectTemplatesByModule,
  selectTemplatesLoading,
  updateTemplate as updateTemplateThunk,
} from "../../../../redux/ipd/tempaltesSlice";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const FinalDiagnosis = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const dispatch = useDispatch();
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const finalDiagnosis = dischargeSummaryData?.diagnosisAndSurgery?.finalDiagnosis || [];
  const templateSite = "ipd";
  const moduleName = "finalDiagnosis";

  // Get doctorId from dischargeSummaryData
  const doctorId =
    dischargeSummaryData?.patientInformation?.primaryConsultant?.id;

  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  // Template selectors
  const finalDiagnosisSelector = useMemo(
    () => makeSelectTemplatesByModule(moduleName),
    [moduleName]
  );
  const finalDiagnosisTemplates = useSelector(finalDiagnosisSelector);
  const templatesLoading = useSelector(selectTemplatesLoading);

  // Helper to get current value
  const getCurrentValue = useCallback(() => {
    return Array.isArray(finalDiagnosis) && finalDiagnosis.length
      ? finalDiagnosis
      : [];
  }, [finalDiagnosis]);

  // Helper to extract array data from template
  const extractArrayData = useCallback((template) => {
    if (!template) return [];
    const candidates = [
      template.template?.[moduleName],
      template[moduleName],
      template.template?.data,
      template.data,
      template.template?.items,
      template.items,
      template.template?.content,
      template.content,
      template.template?.value,
      template.value,
      template.entries,
    ];
    const found = candidates.find(
      (candidate) => Array.isArray(candidate) && candidate.length > 0
    );
    return found && Array.isArray(found) ? found : [];
  }, [moduleName]);

  // Helper to get template title
  const getTemplateTitle = useCallback((template) => {
    if (!template) return "Untitled Template";
    const templateData = template.template || template;
    return (
      templateData.title ||
      template.title ||
      templateData.templateName ||
      template.templateName ||
      templateData.tst_template_name ||
      template.tst_template_name ||
      templateData.tat_template_name ||
      template.tat_template_name ||
      templateData.name ||
      template.name ||
      "Untitled Template"
    );
  }, []);

  // Template handlers
  const refreshTemplates = useCallback(() => {
    dispatch(
      getTemplatesByModuleName({
        moduleName,
        site: templateSite,
        isMaster: false,
        doctorId,
      })
    );
  }, [dispatch, moduleName, templateSite, doctorId]);

  const handleTemplateSelected = useCallback(
    (template) => {
      try {
        const data = extractArrayData(template);
        if (Array.isArray(data) && data.length > 0) {
          dispatch(setFinalDiagnosis(data));
        }
      } catch (error) {
        console.error("Error in handleTemplateSelected:", error);
      }
    },
    [dispatch, extractArrayData]
  );

  const extractTemplatePayload = useCallback(
    (payload) => {
      const title =
        payload?.title ||
        payload?.templateName ||
        payload?.tst_template_name ||
        payload?.tat_template_name ||
        payload?.name ||
        "Untitled Template";
      const currentValue = getCurrentValue();
      const data =
        payload?.data ||
        payload?.[moduleName] ||
        payload?.entries ||
        currentValue;
      return {
        _id: payload?._id || payload?.id,
        title: title?.trim?.() ? title.trim() : "Untitled Template",
        data: Array.isArray(data) && data.length ? data : currentValue,
      };
    },
    [getCurrentValue, moduleName]
  );

  const handleAddTemplate = useCallback(
    async (templateData, callback) => {
      const { title, data } = extractTemplatePayload(templateData);
      const requestPayload = {
        module: moduleName,
        site: templateSite,
        isMaster: false,
        title,
        [moduleName]: data,
        doctorId,
      };

      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template saved successfully.");
        refreshTemplates();
        callback?.();
      } else {
        message.error(
          action.payload || action.error?.message || "Failed to save template."
        );
      }
    },
    [dispatch, extractTemplatePayload, moduleName, templateSite, doctorId, refreshTemplates]
  );

  const handleUpdateTemplate = useCallback(
    async (templateData, callback) => {
      const { _id, title, data } = extractTemplatePayload(templateData);
      if (!_id) {
        message.warning("Template identifier not found for update.");
        return;
      }
      const requestPayload = {
        _id,
        module: moduleName,
        site: templateSite,
        isMaster: false,
        title,
        [moduleName]: data,
        doctorId,
      };
      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template updated successfully.");
        refreshTemplates();
        callback?.();
      } else {
        message.error(
          action.payload || action.error?.message || "Failed to update template."
        );
      }
    },
    [dispatch, extractTemplatePayload, moduleName, templateSite, doctorId, refreshTemplates]
  );

  const handleDeleteTemplate = useCallback(
    async (templateIdentifier) => {
      const id =
        typeof templateIdentifier === "object"
          ? templateIdentifier?._id || templateIdentifier?.id
          : templateIdentifier;
      if (!id) {
        message.warning("Template identifier not found.");
        return;
      }
      const action = await dispatch(
        deleteTemplateThunk({
          _id: id,
          moduleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
      if (deleteTemplateThunk.fulfilled.match(action)) {
        message.success("Template deleted.");
        refreshTemplates();
      } else {
        message.error(
          action.payload ||
            action.error?.message ||
            "Failed to delete template."
        );
      }
    },
    [dispatch, moduleName, templateSite, doctorId, refreshTemplates]
  );

  // Normalize templates for display
  const normalizeTemplatesForModule = useCallback(
    (moduleTemplates) => {
      return (moduleTemplates || []).map((template) => {
        const title = getTemplateTitle(template);
        const data = extractArrayData(template);
        const id = template?._id || template?.id;
        return {
          _id: id,
          id: id,
          title,
          templateName: title,
          tst_template_name: template?.tst_template_name || title,
          tat_template_name: template?.tat_template_name || title,
          [moduleName]: data,
          entries: data, // Also add as entries for compatibility
          module: template?.module,
          site: template?.site,
          isMaster: template?.isMaster,
        };
      });
    },
    [extractArrayData, getTemplateTitle, moduleName]
  );

  const normalizedTemplates = useMemo(
    () => normalizeTemplatesForModule(finalDiagnosisTemplates),
    [finalDiagnosisTemplates, normalizeTemplatesForModule]
  );

  // Fetch templates on mount
  useEffect(() => {
    if (isEditable) {
      refreshTemplates();
    }
  }, [isEditable, refreshTemplates]);

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
      templateType={moduleName}
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
