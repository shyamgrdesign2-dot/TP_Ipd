import React, { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import defaultIcons, {
  defaultIcons as dischargeSummaryIcons,
} from "../../../../assets/images/indices";
import "./styles.scss";
import DietPickerTable from "../../../../components/DynamicPickerTable/DietPickerTable";
import PhysicalActivitiesPickerTable from "../../../../components/DynamicPickerTable/PhysicalActivitiesPickerTable";
import { isEmptyRichText } from "../../../../utils/utils";
import { useSelector } from "react-redux";
import {
  setDischargeSummaryData,
  setDiet,
  setPhysicalActivities,
} from "../../../../redux/ipd/dischargeSummarySlice";
import { useDispatch } from "react-redux";
import {
  deleteTemplate as deleteTemplateThunk,
  getTemplatesByModuleName,
  makeSelectTemplatesByModule,
  selectTemplatesLoading,
  updateTemplate as updateTemplateThunk,
} from "../../../../redux/ipd/tempaltesSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const EMPTY_RICH_TEXT_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];


const DischargeAdvice = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );

  // Get doctorId from dischargeSummaryData
  const doctorId = dischargeSummaryData?.patientInformation?.primaryConsultant?.id;

  console.log(dischargeSummaryData,"dischargeSummaryData")


  const [
    autoFillTextToAppendWarningSigns,
    setAutoFillTextToAppendWarningSigns,
  ] = useState([]);
  const [
    autoFillTextToAppendPreventiveMeasures,
    setAutoFillTextToAppendPreventiveMeasures,
  ] = useState([]);

  const [
    autoFillTextToAppendEmergencyContact,
    setAutoFillTextToAppendEmergencyContact,
  ] = useState([]);
  const dispatch = useDispatch();
  const [autoFillTextToAppendOtherAdvice, setAutoFillTextToAppendOtherAdvice] =
    useState([]);
  const handleOthersChange = (data, key) => {
    dispatch(setDischargeSummaryData({ ...dischargeSummaryData, [key]: data }));
  };
  const templateSite = "ipd";

  // Helper to get module name from data.id
  const getModuleName = useCallback((moduleId) => {
    return moduleId;
  }, []);

  // Helper to get current value for a module
  const getCurrentValue = useCallback(
    (moduleId) => {
      const key = moduleId;
      if (
        Array.isArray(dischargeSummaryData?.[key]) &&
        dischargeSummaryData[key].length
      ) {
        return dischargeSummaryData[key];
      }
      return EMPTY_RICH_TEXT_VALUE;
    },
    [dischargeSummaryData]
  );

  const extractEntries = useCallback((template) => {
    if (!template) return EMPTY_RICH_TEXT_VALUE;
    
    // Template structure from API: { _id: "...", template: { entries: [...], title: "..." } }
    // Priority: Check nested template object first (actual API structure), then root level (fallback)
    const candidates = [
      template.template?.entries, // API structure: template.template.entries
      template.entries, // Also check root level (fallback)
      template.template?.content,
      template.content,
      template.template?.data,
      template.data,
      template.template?.value,
      template.value,
      template.template?.symptoms,
      template.symptoms,
      template.template?.advices,
      template.advices,
      template.template?.items,
      template.items,
    ];
    const found = candidates.find(
      (candidate) => Array.isArray(candidate) && candidate.length
    );
    const result = found && Array.isArray(found) && found.length
      ? found
      : EMPTY_RICH_TEXT_VALUE;
    
    // Ensure result is always a valid array (deep clone to avoid reference issues)
    if (!Array.isArray(result)) {
      return EMPTY_RICH_TEXT_VALUE;
    }
    
    // Validate that each entry has the expected structure
    const validated = result.map((entry) => {
      if (entry && typeof entry === 'object' && entry.type && Array.isArray(entry.children)) {
        return entry;
      }
      // If entry is malformed, return a default paragraph
      return {
        type: "paragraph",
        children: [{ text: "" }],
      };
    });
    
    return validated.length > 0 ? validated : EMPTY_RICH_TEXT_VALUE;
  }, []);

  // Helper to extract array data from template (for diet/physicalActivities)
  const extractArrayData = useCallback((template, moduleId) => {
    if (!template) return [];
    
    // Template structure from API: { _id: "...", template: { [moduleId]: [...], title: "..." } }
    // Priority: Check nested template object first (actual API structure), then root level (fallback)
    const candidates = [
      template.template?.[moduleId], // e.g., template.template.diet or template.template.physicalActivities (API structure)
      template[moduleId], // Also check root level (fallback)
      template.template?.data,
      template.data,
      template.template?.items,
      template.items,
      template.template?.content,
      template.content,
      template.template?.value,
      template.value,
    ];
    const found = candidates.find(
      (candidate) => Array.isArray(candidate) && candidate.length > 0
    );
    return found && Array.isArray(found) ? found : [];
  }, []);

  const getTemplateTitle = useCallback((template) => {
    if (!template) return "Untitled Template";
    
    // Check both root level and nested template object
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
      templateData.moduleName ||
      template.moduleName ||
      "Untitled Template"
    );
  }, []);

  // Create template handlers factory for array-based modules (diet, physicalActivities)
  const createArrayTemplateHandlers = useCallback(
    (moduleId, moduleTemplates, setAction) => {
      const moduleName = getModuleName(moduleId);
      const currentValue = getCurrentValue(moduleId);

      const refreshTemplates = () => {
        dispatch(
          getTemplatesByModuleName({
            moduleName,
            site: templateSite,
            isMaster: false,
            doctorId,
          })
        );
      };

      const handleTemplateSelected = (template) => {
        try {
          const templateData = extractArrayData(template, moduleId);

          if (!Array.isArray(templateData) || templateData.length === 0) {
            console.warn("Invalid template data, skipping append");
            return;
          }

          // Deep clone to avoid reference issues
          const clonedData = JSON.parse(JSON.stringify(templateData));

          // Get current value
          const currentData = Array.isArray(currentValue) ? currentValue : [];
          
          // Get existing IDs to prevent duplicates
          const existingIds = new Set(
            currentData.map(item => item?.id).filter(id => id != null)
          );
          
          // Filter out items that already exist (based on id)
          const newItems = clonedData.filter(item => {
            const itemId = item?.id;
            // If item has an id and it already exists, skip it
            if (itemId != null && existingIds.has(itemId)) {
              return false;
            }
            return true;
          });

          // Only update if there are new items to add
          if (newItems.length > 0) {
            const combinedData = [...currentData, ...newItems];
            // Dispatch the appropriate action (setDiet or setPhysicalActivities)
            dispatch(setAction(combinedData));
          } else {
            message.info("All items from this template are already present.");
          }
        } catch (error) {
          console.error("Error in handleTemplateSelected:", error);
        }
      };

      const extractTemplatePayload = (payload) => {
        // Check both root level and nested template object
        const templateData = payload?.template || payload;
        
        const title =
          templateData?.title ||
          payload?.title ||
          templateData?.templateName ||
          payload?.templateName ||
          templateData?.tst_template_name ||
          payload?.tst_template_name ||
          templateData?.tat_template_name ||
          payload?.tat_template_name ||
          templateData?.name ||
          payload?.name ||
          templateData?.moduleName ||
          payload?.moduleName;
        // For array-based templates, use the module-specific field or data
        const data =
          templateData?.[moduleId] ||
          payload?.[moduleId] ||
          templateData?.data ||
          payload?.data ||
          templateData?.items ||
          payload?.items ||
          currentValue;
        return {
          _id: payload?._id || payload?.id || templateData?._id || templateData?.id,
          title: title?.trim?.() ? title.trim() : "Untitled Template",
          [moduleId]: Array.isArray(data) && data.length ? data : currentValue,
        };
      };

      const handleAddTemplate = async (templateData, callback) => {
        const payload = extractTemplatePayload(templateData);
        const requestPayload = {
          module: moduleName,
          site: templateSite,
          isMaster: false,
          title: payload.title,
          [moduleId]: payload[moduleId], // Store as diet or physicalActivities
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
      };

      const handleUpdateTemplate = async (templateData, callback) => {
        const payload = extractTemplatePayload(templateData);
        if (!payload._id) {
          message.warning("Template identifier not found for update.");
          return;
        }
        const requestPayload = {
          _id: payload._id,
          module: moduleName,
          site: templateSite,
          isMaster: false,
          title: payload.title,
          [moduleId]: payload[moduleId],
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
      };

      const handleDeleteTemplate = async (templateIdentifier) => {
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
      };

      return {
        moduleName,
        currentValue,
        handleTemplateSelected,
        handleAddTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
        handleTemplateButtonClick: () => {
          // No-op: Templates are already in Redux, no need to fetch again
          // Templates will only be refreshed after add/update/delete operations
        },
      };
    },
    [
      getModuleName,
      getCurrentValue,
      extractArrayData,
      dispatch,
      templateSite,
    ]
  );

  // Create template handlers factory for a specific module (rich text)
  const createTemplateHandlers = useCallback(
    (moduleId, moduleTemplates) => {
      const moduleName = getModuleName(moduleId);
      const currentValue = getCurrentValue(moduleId);

      const refreshTemplates = () => {
        // Always fetch templates to get the latest list after save/update/delete
        dispatch(
          getTemplatesByModuleName({
            moduleName,
            site: templateSite,
            isMaster: false,
            doctorId,
          })
        );
      };

      const handleTemplateSelected = (template) => {
        try {
          const entries = extractEntries(template);

          // Ensure entries is always a valid array before passing to handleOthersChange
          if (!Array.isArray(entries) || entries.length === 0) {
            console.warn("Invalid template entries, using empty value");
            handleOthersChange(EMPTY_RICH_TEXT_VALUE, moduleId);
            return;
          }
          // Deep clone to avoid reference issues
          const clonedEntries = JSON.parse(JSON.stringify(entries));
          
          // Get current value and append template data to it
          const currentEntries = currentValue || [];
          const isEmptyCurrent = isEmptyRichText(currentEntries);
          
          // If current is empty, just use template entries; otherwise append
          const combinedEntries = isEmptyCurrent 
            ? clonedEntries 
            : [...JSON.parse(JSON.stringify(currentEntries)), ...clonedEntries];
          
          handleOthersChange(combinedEntries, moduleId);
        } catch (error) {
          console.error("Error in handleTemplateSelected:", error);
          handleOthersChange(EMPTY_RICH_TEXT_VALUE, moduleId);
        }
      };

      const extractTemplatePayload = (payload) => {
        // Check both root level and nested template object
        const templateData = payload?.template || payload;
        
        const title =
          templateData?.title ||
          payload?.title ||
          templateData?.templateName ||
          payload?.templateName ||
          templateData?.tst_template_name ||
          payload?.tst_template_name ||
          templateData?.tat_template_name ||
          payload?.tat_template_name ||
          templateData?.name ||
          payload?.name ||
          templateData?.moduleName ||
          payload?.moduleName;
        const entries =
          templateData?.entries ||
          payload?.entries ||
          templateData?.symptoms ||
          payload?.symptoms ||
          templateData?.advices ||
          payload?.advices ||
          templateData?.data ||
          payload?.data ||
          currentValue;
        return {
          _id: payload?._id || payload?.id || templateData?._id || templateData?.id,
          title: title?.trim?.() ? title.trim() : "Untitled Template",
          entries: Array.isArray(entries) && entries.length
            ? entries
            : currentValue,
        };
      };

      const handleAddTemplate = async (templateData, callback) => {
        const { title, entries } = extractTemplatePayload(templateData);
        const requestPayload = {
          module: moduleName,
          site: templateSite,
          isMaster: false,
          title,
          entries,
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
      };

      const handleUpdateTemplate = async (templateData, callback) => {
        const { _id, title, entries } = extractTemplatePayload(templateData);
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
          entries,
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
      };

      const handleDeleteTemplate = async (templateIdentifier) => {
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
      };

      return {
        moduleName,
        currentValue,
        handleTemplateSelected,
        handleAddTemplate,
        handleUpdateTemplate,
        handleDeleteTemplate,
        handleTemplateButtonClick: () => {
          // No-op: Templates are already in Redux, no need to fetch again
          // Templates will only be refreshed after add/update/delete operations
        },
      };
    },
    [
      getModuleName,
      getCurrentValue,
      extractEntries,
      handleOthersChange,
      dispatch,
      templateSite,
    ]
  );

  // Get templates and handlers for each module at top level
  const warningSignsModuleName = getModuleName("warningSigns");
  const preventiveMeasuresModuleName = getModuleName("preventiveMeasures");
  const emergencyContactModuleName = getModuleName("emergencyContact");
  const otherAdviceModuleName = getModuleName("otherAdvice");
  const dietModuleName = getModuleName("diet");
  const physicalActivitiesModuleName = getModuleName("physicalActivities");

  const warningSignsSelector = useMemo(
    () => makeSelectTemplatesByModule(warningSignsModuleName),
    [warningSignsModuleName]
  );
  const preventiveMeasuresSelector = useMemo(
    () => makeSelectTemplatesByModule(preventiveMeasuresModuleName),
    [preventiveMeasuresModuleName]
  );
  const emergencyContactSelector = useMemo(
    () => makeSelectTemplatesByModule(emergencyContactModuleName),
    [emergencyContactModuleName]
  );
  const otherAdviceSelector = useMemo(
    () => makeSelectTemplatesByModule(otherAdviceModuleName),
    [otherAdviceModuleName]
  );
  const dietSelector = useMemo(
    () => makeSelectTemplatesByModule(dietModuleName),
    [dietModuleName]
  );
  const physicalActivitiesSelector = useMemo(
    () => makeSelectTemplatesByModule(physicalActivitiesModuleName),
    [physicalActivitiesModuleName]
  );

  // Simple memoization for otherAdvice initialValue
  const otherAdviceInitialValue = useMemo(() => {
    const currentData = dischargeSummaryData?.otherAdvice;
    if (!isEmptyRichText(currentData)) {
      try {
        return JSON.parse(JSON.stringify(currentData));
      } catch (error) {
        return currentData || EMPTY_RICH_TEXT_VALUE;
      }
    }
    return EMPTY_RICH_TEXT_VALUE;
  }, [dischargeSummaryData?.otherAdvice]);

  // Simple memoization for warningSigns initialValue
  const warningSignsInitialValue = useMemo(() => {
    const currentData = dischargeSummaryData?.warningSigns;
    if (!isEmptyRichText(currentData)) {
      try {
        return JSON.parse(JSON.stringify(currentData));
      } catch (error) {
        return currentData || EMPTY_RICH_TEXT_VALUE;
      }
    }
    return EMPTY_RICH_TEXT_VALUE;
  }, [dischargeSummaryData?.warningSigns]);
  
  // Simple memoization for preventiveMeasures initialValue
  const preventiveMeasuresInitialValue = useMemo(() => {
    const currentData = dischargeSummaryData?.preventiveMeasures;
    if (!isEmptyRichText(currentData)) {
      try {
        return JSON.parse(JSON.stringify(currentData));
      } catch (error) {
        return currentData || EMPTY_RICH_TEXT_VALUE;
      }
    }
    return EMPTY_RICH_TEXT_VALUE;
  }, [dischargeSummaryData?.preventiveMeasures]);
  
  // Simple memoization for emergencyContact initialValue
  const emergencyContactInitialValue = useMemo(() => {
    const currentData = dischargeSummaryData?.emergencyContact;
    if (!isEmptyRichText(currentData)) {
      try {
        return JSON.parse(JSON.stringify(currentData));
      } catch (error) {
        return currentData || EMPTY_RICH_TEXT_VALUE;
      }
    }
    return EMPTY_RICH_TEXT_VALUE;
  }, [dischargeSummaryData?.emergencyContact]);
  
  const warningSignsTemplates = useSelector(warningSignsSelector);
  const preventiveMeasuresTemplates = useSelector(preventiveMeasuresSelector);
  const emergencyContactTemplates = useSelector(emergencyContactSelector);
  const otherAdviceTemplates = useSelector(otherAdviceSelector);
  const dietTemplates = useSelector(dietSelector);
  const physicalActivitiesTemplates = useSelector(physicalActivitiesSelector);
  const templatesLoading = useSelector(selectTemplatesLoading);

  const warningSignsHandlers = useMemo(
    () => createTemplateHandlers("warningSigns", warningSignsTemplates),
    [createTemplateHandlers, warningSignsTemplates]
  );
  const preventiveMeasuresHandlers = useMemo(
    () => createTemplateHandlers("preventiveMeasures", preventiveMeasuresTemplates),
    [createTemplateHandlers, preventiveMeasuresTemplates]
  );
  const emergencyContactHandlers = useMemo(
    () => createTemplateHandlers("emergencyContact", emergencyContactTemplates),
    [createTemplateHandlers, emergencyContactTemplates]
  );
  const otherAdviceHandlers = useMemo(
    () => createTemplateHandlers("otherAdvice", otherAdviceTemplates),
    [createTemplateHandlers, otherAdviceTemplates]
  );
  const dietHandlers = useMemo(
    () => createArrayTemplateHandlers("diet", dietTemplates, setDiet),
    [createArrayTemplateHandlers, dietTemplates]
  );
  const physicalActivitiesHandlers = useMemo(
    () => createArrayTemplateHandlers("physicalActivities", physicalActivitiesTemplates, setPhysicalActivities),
    [createArrayTemplateHandlers, physicalActivitiesTemplates]
  );

  // const normalizeTemplatesForModule = useCallback(
  //   (moduleTemplates) => {

  //     console.log(moduleTemplates,"moduleTemplates")
  //     return (moduleTemplates || []).map((template) => {
  //       const title = getTemplateTitle(template);
  //       const entries = extractEntries(template);
  //       const id = template?._id || template?.id;
  //       // Only include safe, serializable properties to avoid rendering issues
  //       return {
  //         _id: id,
  //         id: id,
  //         title,
  //         templateName: title,
  //         tst_template_name: template?.tst_template_name || title,
  //         tat_template_name: template?.tat_template_name || title,
  //         entries,
  //         // // Include other safe primitive properties if needed
  //         // module: template?.module,
  //         // site: template?.site,
  //         // isMaster: template?.isMaster,
  //       };
  //     });
  //   },
  //   [extractEntries, getTemplateTitle]
  // );

  // const normalizedWarningSignsTemplates = useMemo(
  //   () => normalizeTemplatesForModule(warningSignsTemplates),
  //   [warningSignsTemplates, normalizeTemplatesForModule]
  // );
  // const normalizedPreventiveMeasuresTemplates = useMemo(
  //   () => normalizeTemplatesForModule(preventiveMeasuresTemplates),
  //   [preventiveMeasuresTemplates, normalizeTemplatesForModule]
  // );
  // const normalizedEmergencyContactTemplates = useMemo(
  //   () => normalizeTemplatesForModule(emergencyContactTemplates),
  //   [emergencyContactTemplates, normalizeTemplatesForModule]
  // );
  // const normalizedOtherAdviceTemplates = useMemo(
  //   () => normalizeTemplatesForModule(otherAdviceTemplates),
  //   [otherAdviceTemplates, normalizeTemplatesForModule]
  // );

  // Track if initial template fetch check has been done
  const initialFetchDoneRef = React.useRef(false);

  // Fetch templates for each module on mount only if they don't already exist in Redux
  // This effect runs once on mount and checks Redux state (which persists across unmounts)
  useEffect(() => {
    // Skip if we've already done the initial check
    if (initialFetchDoneRef.current) {
      return;
    }

    // Check if templates already exist in Redux before fetching
    const shouldFetchTemplates = (existingTemplates) => {
      // Only fetch if templates don't exist or array is empty
      return !existingTemplates || existingTemplates.length === 0;
    };

    // Fetch templates only if they don't exist in Redux
    // Redux state persists across unmounts, so this check works even after remount
    if (shouldFetchTemplates(warningSignsTemplates)) {
      dispatch(
        getTemplatesByModuleName({
          moduleName: warningSignsModuleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
    }

    if (shouldFetchTemplates(preventiveMeasuresTemplates)) {
      dispatch(
        getTemplatesByModuleName({
          moduleName: preventiveMeasuresModuleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
    }

    if (shouldFetchTemplates(emergencyContactTemplates)) {
      dispatch(
        getTemplatesByModuleName({
          moduleName: emergencyContactModuleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
    }

    if (shouldFetchTemplates(otherAdviceTemplates)) {
      dispatch(
        getTemplatesByModuleName({
          moduleName: otherAdviceModuleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
    }

    if (shouldFetchTemplates(dietTemplates)) {
      dispatch(
        getTemplatesByModuleName({
          moduleName: dietModuleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
    }

    if (shouldFetchTemplates(physicalActivitiesTemplates)) {
      dispatch(
        getTemplatesByModuleName({
          moduleName: physicalActivitiesModuleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
    }

    // Mark initial check as done
    initialFetchDoneRef.current = true;
  }, [
    dispatch,
    warningSignsModuleName,
    preventiveMeasuresModuleName,
    emergencyContactModuleName,
    otherAdviceModuleName,
    dietModuleName,
    physicalActivitiesModuleName,
    templateSite,
    // Include templates to check their current state, but ref prevents refetching
    warningSignsTemplates,
    preventiveMeasuresTemplates,
    emergencyContactTemplates,
    otherAdviceTemplates,
    dietTemplates,
    physicalActivitiesTemplates,
  ]);

  const renderWarningSigns = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.warningSigns))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        templates={warningSignsTemplates}
        templateType="entries"
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "warningSigns")}
        initialValue={warningSignsInitialValue}
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={warningSignsHandlers.handleTemplateButtonClick}
        onErase={() => {
          setAutoFillTextToAppendWarningSigns(["clear"]);
        }}
        onTemplate={warningSignsHandlers.handleTemplateButtonClick}
        onTemplateSelected={warningSignsHandlers.handleTemplateSelected}
        addTemplate={warningSignsHandlers.handleAddTemplate}
        updateTemplate={warningSignsHandlers.handleUpdateTemplate}
        onDeleteTemplateClicked={warningSignsHandlers.handleDeleteTemplate}
        loading={templatesLoading}
        newAutoFillTextToAppend={autoFillTextToAppendWarningSigns}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendWarningSigns}
        // Don't pass data prop - RichTextEditWrapper will use its internal editorContent
        // This prevents re-renders when typing in template name
        isDataPresent={!isEmptyRichText(warningSignsInitialValue)}
      />
    );
  };

  const renderPreventiveMeasures = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.preventiveMeasures))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        templates={preventiveMeasuresTemplates}
        templateType="entries"
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "preventiveMeasures")}
        initialValue={preventiveMeasuresInitialValue}
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={preventiveMeasuresHandlers.handleTemplateButtonClick}
        onErase={() => {
          setAutoFillTextToAppendPreventiveMeasures(["clear"]);
        }}
        onTemplate={preventiveMeasuresHandlers.handleTemplateButtonClick}
        onTemplateSelected={preventiveMeasuresHandlers.handleTemplateSelected}
        addTemplate={preventiveMeasuresHandlers.handleAddTemplate}
        updateTemplate={preventiveMeasuresHandlers.handleUpdateTemplate}
        onDeleteTemplateClicked={preventiveMeasuresHandlers.handleDeleteTemplate}
        loading={templatesLoading}
        newAutoFillTextToAppend={autoFillTextToAppendPreventiveMeasures}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendPreventiveMeasures}
        // Don't pass data prop - RichTextEditWrapper will use its internal editorContent
        // This prevents re-renders when typing in template name
        isDataPresent={!isEmptyRichText(preventiveMeasuresInitialValue)}
      />
    );
  };

  const renderEmergencyContact = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.emergencyContact))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        templates={emergencyContactTemplates}
        templateType="entries"
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handleOthersChange(data, "emergencyContact")}
        initialValue={emergencyContactInitialValue}
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={emergencyContactHandlers.handleTemplateButtonClick}
        onErase={() => {
          setAutoFillTextToAppendEmergencyContact(["clear"]);
        }}
        onTemplate={emergencyContactHandlers.handleTemplateButtonClick}
        onTemplateSelected={emergencyContactHandlers.handleTemplateSelected}
        addTemplate={emergencyContactHandlers.handleAddTemplate}
        updateTemplate={emergencyContactHandlers.handleUpdateTemplate}
        onDeleteTemplateClicked={emergencyContactHandlers.handleDeleteTemplate}
        loading={templatesLoading}
        newAutoFillTextToAppend={autoFillTextToAppendEmergencyContact}
        setNewAutoFillTextToAppend={setAutoFillTextToAppendEmergencyContact}
        // Don't pass data prop - RichTextEditWrapper will use its internal editorContent
        // This prevents re-renders when typing in template name
        isDataPresent={!isEmptyRichText(emergencyContactInitialValue)}
      />
    );
  };
  const renderOtherAdvice = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.otherAdvice))
      return null;

    return (
      <div>
        <RichTextEditWrapper
          readOnly={!isEditable}
          showToolbar={isEditable}
          showActionBtns={isEditable}
          templates={otherAdviceTemplates}
          templateType="entries"
          title={data?.title}
          width={isEditable ? "100%" : "fit-content"}
          icon={dischargeSummaryIcons[`${data?.id}Pc`]}
          showAutoFill={false}
          containerClass={`wrapper-class ${
            !isEditable ? "ipd-wrapper-class-readonly" : ""
          }`}
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          onChange={(data) => handleOthersChange(data, "otherAdvice")}
          initialValue={otherAdviceInitialValue}
          placeholder={
            data?.placeholder ||
            "Enter details like onset, duration, progression, and associated symptoms"
          }
          onSave={otherAdviceHandlers.handleTemplateButtonClick}
          onErase={() => {
            setAutoFillTextToAppendOtherAdvice(["clear"]);
          }}
          onTemplate={otherAdviceHandlers.handleTemplateButtonClick}
          onTemplateSelected={otherAdviceHandlers.handleTemplateSelected}
          addTemplate={otherAdviceHandlers.handleAddTemplate}
          updateTemplate={otherAdviceHandlers.handleUpdateTemplate}
          onDeleteTemplateClicked={otherAdviceHandlers.handleDeleteTemplate}
          loading={templatesLoading}
          newAutoFillTextToAppend={autoFillTextToAppendOtherAdvice}
          setNewAutoFillTextToAppend={setAutoFillTextToAppendOtherAdvice}
          // Don't pass data prop - RichTextEditWrapper will use its internal editorContent
          // This prevents re-renders when typing in template name
          isDataPresent={!isEmptyRichText(otherAdviceInitialValue)}
        />
      </div>
    );
  };

  // console.log(dischargeSummaryData.diet,"dischargeSummaryData.diet")

  const renderSection = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "diet":
                return (
                  <div key={item.id} className="discharge-advice-section">
                    <RichTextEditWrapper
                      readOnly={!isEditable}
                      showToolbar={isEditable}
                      showActionBtns={isEditable}
                      title={item?.title || "Diet"}
                      width="100%"
                      containerClass="wrapper-class ipd-pmh-wrapper-class"
                      icon={defaultIcons[`${item?.id}Pc`]}
                      showAutoFill={false}
                      opdDate="15 Jun 2025"
                      templates={dietTemplates}
                      templateType="diet"
                      onSave={dietHandlers.handleTemplateButtonClick}
                      onErase={() => {
                        dispatch(setDiet([]));
                      }}
                      onTemplate={dietHandlers.handleTemplateButtonClick}
                      onTemplateSelected={dietHandlers.handleTemplateSelected}
                      addTemplate={dietHandlers.handleAddTemplate}
                      updateTemplate={dietHandlers.handleUpdateTemplate}
                      onDeleteTemplateClicked={dietHandlers.handleDeleteTemplate}
                      loading={templatesLoading}
                      data={dischargeSummaryData?.diet || []}
                      isDataPresent={Array.isArray(dischargeSummaryData?.diet) && dischargeSummaryData.diet.length > 0}
                      renderBody={() => {
                        return <DietPickerTable isEditable={isEditable} />;
                      }}
                    />
                  </div>
                );
              case "physicalActivities":
                return (
                  <div key={item.id} className="discharge-advice-section">
                    <RichTextEditWrapper
                      readOnly={!isEditable}
                      showToolbar={isEditable}
                      showActionBtns={isEditable}
                      title={item?.title || "Physical Activities"}
                      width="100%"
                      containerClass="wrapper-class ipd-pmh-wrapper-class"
                      icon={defaultIcons[`${item?.id}Pc`]}
                      showAutoFill={false}
                      opdDate="15 Jun 2025"
                      templates={physicalActivitiesTemplates}
                      templateType="physicalActivities"
                      onSave={physicalActivitiesHandlers.handleTemplateButtonClick}
                      onErase={() => {
                        dispatch(setPhysicalActivities([]));
                      }}
                      onTemplate={physicalActivitiesHandlers.handleTemplateButtonClick}
                      onTemplateSelected={physicalActivitiesHandlers.handleTemplateSelected}
                      addTemplate={physicalActivitiesHandlers.handleAddTemplate}
                      updateTemplate={physicalActivitiesHandlers.handleUpdateTemplate}
                      onDeleteTemplateClicked={physicalActivitiesHandlers.handleDeleteTemplate}
                      loading={templatesLoading}
                      data={dischargeSummaryData?.physicalActivities || []}
                      isDataPresent={Array.isArray(dischargeSummaryData?.physicalActivities) && dischargeSummaryData.physicalActivities.length > 0}
                      renderBody={() => {
                        return (
                          <PhysicalActivitiesPickerTable
                            isEditable={isEditable}
                          />
                        );
                      }}
                    />
                  </div>
                );
              case "otherAdvice":
                return renderOtherAdvice(item);
              case "warningSigns":
                return renderWarningSigns(item);
              case "preventiveMeasures":
                return renderPreventiveMeasures(item);
              case "emergencyContact":
                return renderEmergencyContact(item);
              default:
                return null;
            }
          })()}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={
          sectionData?.id
            ? dischargeSummaryIcons[`${sectionData.id}Dark`]
            : null
        }
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderSection()}
      </CollapsibleWrapper>
    </>
  );
};

export default DischargeAdvice;
