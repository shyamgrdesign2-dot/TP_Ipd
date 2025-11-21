import { useCallback, useEffect, useMemo } from "react";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteTemplate as deleteTemplateThunk,
  getTemplatesByModuleName,
  makeSelectTemplatesByModule,
  selectTemplatesLoading,
  updateTemplate as updateTemplateThunk,
} from "../redux/ipd/tempaltesSlice";
import { isEmptyRichText } from "../utils/utils";

const EMPTY_RICH_TEXT_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

/**
 * Reusable hook for template management across all modules
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.moduleName - The module name (e.g., "otherAdvice", "finalDiagnosis")
 * @param {string} config.templateSite - The site (default: "ipd")
 * @param {string} config.doctorId - The doctor ID
 * @param {boolean} config.isEditable - Whether the module is editable
 * @param {'richText' | 'array'} config.moduleType - Type of module: 'richText' for entries-based, 'array' for array-based
 * @param {Function} config.getCurrentValue - Function to get current value from Redux/store
 * @param {Function} config.onValueChange - Function to update value in Redux/store (for rich text modules)
 * @param {Function} config.onArrayChange - Function to update array in Redux/store (for array modules)
 * @param {Function} [config.isDuplicate] - Optional function to check duplicates for array modules
 * @param {boolean} [config.autoFetch=true] - Whether to auto-fetch templates on mount
 * @param {Function} [config.ensureKeys] - Optional function to ensure keys for array items
 * 
 * @returns {Object} Template management handlers and data
 */
export const useTemplateManagement = (config) => {
  const {
    moduleName,
    templateSite = "ipd",
    doctorId,
    isEditable = true,
    moduleType = "richText", // 'richText' or 'array'
    getCurrentValue,
    onValueChange,
    onArrayChange,
    isDuplicate,
    autoFetch = true,
    ensureKeys,
  } = config;

  const dispatch = useDispatch();

  // Template selectors
  const templateSelector = useMemo(
    () => makeSelectTemplatesByModule(moduleName),
    [moduleName]
  );
  const templates = useSelector(templateSelector);
  const templatesLoading = useSelector(selectTemplatesLoading);

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

  // Helper to extract entries from template (for rich text modules)
  const extractEntries = useCallback(
    (template) => {
      if (!template) return EMPTY_RICH_TEXT_VALUE;

      const candidates = [
        template.entries,
        template.template?.entries,
        template.template?.[moduleName],
        template[moduleName],
        template.data,
        template.template?.data,
        template.content,
        template.template?.content,
        template.value,
        template.template?.value,
        template.template?.symptoms,
        template.symptoms,
        template.template?.advices,
        template.advices,
        template.template?.items,
        template.items,
      ];

      const found = candidates.find(
        (candidate) => Array.isArray(candidate) && candidate.length > 0
      );

      const result =
        found && Array.isArray(found) && found.length
          ? JSON.parse(JSON.stringify(found))
          : EMPTY_RICH_TEXT_VALUE;

      // Validate that each entry has the expected structure
      return result.map((entry) => {
        if (
          entry &&
          typeof entry === "object" &&
          entry.type &&
          Array.isArray(entry.children)
        ) {
          return entry;
        }
        return {
          type: "paragraph",
          children: [{ text: "" }],
        };
      });
    },
    [moduleName]
  );

  // Helper to extract array data from template (for array modules)
  const extractArrayData = useCallback(
    (template) => {
      if (!template) return [];

      const candidates = [
        template.template?.[moduleName],
        template[moduleName],
        template.template?.data,
        template.data,
        template.entries,
        template.template?.entries,
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

      const extracted = found && Array.isArray(found) ? found : [];

      // Apply ensureKeys if provided
      if (ensureKeys && Array.isArray(extracted) && extracted.length > 0) {
        return ensureKeys(JSON.parse(JSON.stringify(extracted)));
      }

      return extracted && Array.isArray(extracted)
        ? JSON.parse(JSON.stringify(extracted))
        : [];
    },
    [moduleName, ensureKeys]
  );

  // Refresh templates
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

  // Handle template selected
  const handleTemplateSelected = useCallback(
    (template) => {
      try {
        if (moduleType === "richText") {
          // Rich text: append to existing content
          const entries = extractEntries(template);

          if (!Array.isArray(entries) || entries.length === 0) {
            console.warn("Invalid template entries, using empty value");
            onValueChange?.(EMPTY_RICH_TEXT_VALUE);
            return;
          }

          const clonedEntries = JSON.parse(JSON.stringify(entries));
          const currentEntries = getCurrentValue() || [];
          const isEmptyCurrent = isEmptyRichText(currentEntries);

          let combinedEntries;

          if (isEmptyCurrent) {
            // Editor is empty - check if template starts with a list
            // Slate tries to access [0,0] as a leaf node, but if first entry is a list,
            // [0,0] points to list-item (non-leaf), causing error
            const firstEntry = clonedEntries[0];
            const isListFirst = firstEntry?.type === "bulleted-list" || firstEntry?.type === "numbered-list";
            
            if (isListFirst) {
              // Prepend empty paragraph so [0,0] always refers to a text leaf node
              combinedEntries = [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
                ...clonedEntries,
              ];
              console.log(combinedEntries,"combinedEntries")
            } else {
              combinedEntries = clonedEntries;
            }
          } else {
            // Editor has content - append template normally
            combinedEntries = [
              ...JSON.parse(JSON.stringify(currentEntries)),
              ...clonedEntries,
            ];
          }

          onValueChange?.(combinedEntries);
        } else {
          // Array: merge with duplicate checking
          const templateData = extractArrayData(template);

          if (!Array.isArray(templateData) || templateData.length === 0) {
            console.warn("Invalid template data, skipping append");
            return;
          }

          const clonedData = JSON.parse(JSON.stringify(templateData));
          const currentData = Array.isArray(getCurrentValue())
            ? getCurrentValue()
            : [];

          let newItems = clonedData;

          // Check for duplicates if isDuplicate function is provided
          if (isDuplicate && typeof isDuplicate === "function") {
            newItems = clonedData.filter((templateItem) => {
              return !currentData.some((existingItem) =>
                isDuplicate(existingItem, templateItem)
              );
            });

            if (newItems.length < clonedData.length) {
              const duplicateCount = clonedData.length - newItems.length;
              message.info(
                `${duplicateCount} duplicate item${duplicateCount > 1 ? "s" : ""} skipped.`
              );
            }
          } else {
            // Default duplicate check by id
            const existingIds = new Set(
              currentData.map((item) => item?.id).filter((id) => id != null)
            );
            newItems = clonedData.filter((item) => {
              const itemId = item?.id;
              return itemId == null || !existingIds.has(itemId);
            });

            if (newItems.length < clonedData.length) {
              const duplicateCount = clonedData.length - newItems.length;
              message.info(
                `${duplicateCount} duplicate item${duplicateCount > 1 ? "s" : ""} skipped.`
              );
            }
          }

          if (newItems.length > 0) {
            const combinedData = [...currentData, ...newItems];
            onArrayChange?.(combinedData);
          } else {
            message.info("All items from this template are already present.");
          }
        }
      } catch (error) {
        console.error("Error in handleTemplateSelected:", error);
        message.error("Failed to apply template.");
      }
    },
    [
      moduleType,
      extractEntries,
      extractArrayData,
      getCurrentValue,
      onValueChange,
      onArrayChange,
      isDuplicate,
    ]
  );

  // Extract template payload for save/update
  const extractTemplatePayload = useCallback(
    (payload) => {
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
        payload?.moduleName ||
        "Untitled Template";

      const currentValue = getCurrentValue();

      if (moduleType === "richText") {
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
          entries:
            Array.isArray(entries) && entries.length ? entries : currentValue,
        };
      } else {
        // Array type
        const data =
          templateData?.[moduleName] ||
          payload?.[moduleName] ||
          templateData?.data ||
          payload?.data ||
          templateData?.items ||
          payload?.items ||
          currentValue;

        const normalizedData =
          Array.isArray(data) && data.length
            ? ensureKeys
              ? ensureKeys(data)
              : data
            : currentValue;

        return {
          _id: payload?._id || payload?.id || templateData?._id || templateData?.id,
          title: title?.trim?.() ? title.trim() : "Untitled Template",
          data: normalizedData,
        };
      }
    },
    [moduleName, moduleType, getCurrentValue, ensureKeys]
  );

  // Handle add template
  const handleAddTemplate = useCallback(
    async (templateData, callback) => {
      try {
        const payload = extractTemplatePayload(templateData);
        const requestPayload = {
          module: moduleName,
          site: templateSite,
          isMaster: false,
          title: payload.title,
          doctorId,
        };

        if (moduleType === "richText") {
          requestPayload.entries = payload.entries;
        } else {
          requestPayload[moduleName] = payload.data;
        }

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
      } catch (error) {
        console.error("Error in handleAddTemplate:", error);
        message.error("Failed to save template.");
      }
    },
    [
      dispatch,
      extractTemplatePayload,
      moduleName,
      moduleType,
      templateSite,
      doctorId,
      refreshTemplates,
    ]
  );

  // Handle update template
  const handleUpdateTemplate = useCallback(
    async (templateData, callback) => {
      try {
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
          doctorId,
        };

        if (moduleType === "richText") {
          requestPayload.entries = payload.entries;
        } else {
          requestPayload[moduleName] = payload.data;
        }

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
      } catch (error) {
        console.error("Error in handleUpdateTemplate:", error);
        message.error("Failed to update template.");
      }
    },
    [
      dispatch,
      extractTemplatePayload,
      moduleName,
      moduleType,
      templateSite,
      doctorId,
      refreshTemplates,
    ]
  );

  // Handle delete template
  const handleDeleteTemplate = useCallback(
    async (templateIdentifier) => {
      try {
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
      } catch (error) {
        console.error("Error in handleDeleteTemplate:", error);
        message.error("Failed to delete template.");
      }
    },
    [dispatch, moduleName, templateSite, doctorId, refreshTemplates]
  );

  // Normalize templates for display
  const normalizeTemplates = useCallback(
    (moduleTemplates) => {
      return (moduleTemplates || []).map((template) => {
        const title = getTemplateTitle(template);
        const id = template?._id || template?.id;

        if (moduleType === "richText") {
          const entries = extractEntries(template);
          return {
            _id: id,
            id: id,
            title,
            templateName: title,
            tst_template_name: template?.tst_template_name || title,
            tat_template_name: template?.tat_template_name || title,
            entries,
            module: template?.module,
            site: template?.site,
            isMaster: template?.isMaster,
          };
        } else {
          const data = extractArrayData(template);
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
        }
      });
    },
    [moduleType, moduleName, getTemplateTitle, extractEntries, extractArrayData]
  );

  const normalizedTemplates = useMemo(
    () => normalizeTemplates(templates),
    [templates, normalizeTemplates]
  );

  // Auto-fetch templates on mount
  useEffect(() => {
    if (autoFetch && isEditable) {
      refreshTemplates();
    }
  }, [autoFetch, isEditable, refreshTemplates]);

  return {
    // Data
    templates: normalizedTemplates,
    templatesLoading,
    rawTemplates: templates,

    // Handlers
    handleTemplateSelected,
    handleAddTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    refreshTemplates,

    // Helpers
    getTemplateTitle,
    extractEntries,
    extractArrayData,
    normalizeTemplates,
  };
};


