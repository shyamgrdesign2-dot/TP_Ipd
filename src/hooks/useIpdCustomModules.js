import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import AddCustomModule from "../components/AddCustomModule";
import IpdCustomModule from "../pages/ipd/components/IpdCustomModule";
import {
  addModule as addModuleIPD,
  getCustomModules,
} from "../redux/ipd/customModuleSlice";
import { updateCustomization } from "../redux/ipd/ipdSlice";
import {
  updatePrintSettings,
  getPrintSettings,
} from "../redux/ipd/printSettingsSlice";
import { buildCustomModuleSection } from "../utils/customModuleHelpers";

const DEFAULT_SLATE_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ensureModuleId = (module) =>
  module?.module_id || module?.moduleId || module?.id || null;

const getModuleDisplayName = (module = {}) =>
  module.module_name ||
  module.moduleName ||
  module.name ||
  module.title ||
  "Custom Module";

const isSlateNode = (node) => node && Array.isArray(node.children);

const isSlateValue = (value) =>
  Array.isArray(value) && value.length > 0 && value.every(isSlateNode);

const ensureSlateValue = (value) => {
  if (isSlateValue(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (isSlateValue(parsed)) {
        return parsed;
      }
    } catch (error) {
      return DEFAULT_SLATE_VALUE;
    }
  }

  return DEFAULT_SLATE_VALUE;
};

const normalizeModuleContentEntry = (entry, customModules = []) => {
  if (!entry) {
    return null;
  }

  const source = entry.moduleContent || entry;

  const moduleId =
    ensureModuleId(entry) ||
    ensureModuleId(entry.moduleContent) ||
    ensureModuleId(entry.content) ||
    ensureModuleId(source);

  if (!moduleId) {
    return null;
  }

  const matchedModule = customModules.find(
    (module) => module.module_id === moduleId
  );

  const moduleName = getModuleDisplayName({
    module_id: moduleId,
    module_name:
      entry.module_name ||
      entry.moduleName ||
      entry.name ||
      source.module_name ||
      source.moduleName ||
      source.name ||
      matchedModule?.module_name ||
      matchedModule?.name,
  });

  let content =
    entry.content ??
    entry.contents ??
    source.content ??
    source.contents ??
    entry.notes ??
    source.notes ??
    DEFAULT_SLATE_VALUE;

  if (
    content &&
    typeof content === "object" &&
    !Array.isArray(content) &&
    content.content
  ) {
    content = content.content;
  }

  const normalizedContent = ensureSlateValue(content);

  return {
    module_id: moduleId,
    module_name: moduleName,
    content: normalizedContent,
  };
};

const normalizeModuleContents = (entries, customModules = []) => {
  if (!entries) {
    return [];
  }

  const list = Array.isArray(entries) ? entries : [entries];

  const normalized = list
    .map((item) => normalizeModuleContentEntry(item, customModules))
    .filter(Boolean);

  const deduped = new Map();

  normalized.forEach((item) => {
    deduped.set(item.module_id, item);
  });

  return Array.from(deduped.values());
};

const FORM_TYPE_MAP = {
  consultantNotes: "consultationNotes",
  progressNotes: "progressNotes",
  otNotes: "otNotes",
  dischargedSummary: "dischargeSummary",
  assessments: "assessments",
  crossReferral: "crossReferral",
};

const useIpdCustomModules = ({
  formType,
  customizationKey,
  setModelData,
  admissionId,
  patientId,
  isEditable = true,
}) => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.ipd.customization || {});
  const { userId } = useSelector((state) => state.doctors);
  const customModules = useSelector(
    (state) => state.ipdCustomModules.customModules || []
  );
  const { printSettings } = useSelector((state) => state.printSettings);

  const [customModuleContentsState, setCustomModuleContentsState] = useState(
    []
  );

  const setCustomModuleContents = useCallback(
    (value) => {
      setCustomModuleContentsState((prev) => {
        const base = prev || [];
        const nextRaw = typeof value === "function" ? value(base) : value;
        return normalizeModuleContents(nextRaw, customModules);
      });
    },
    [customModules]
  );

  const customModuleContents = customModuleContentsState;

  useEffect(() => {
    setCustomModuleContentsState((prev) =>
      normalizeModuleContents(prev, customModules)
    );
  }, [customModules]);

  useEffect(() => {
    if (userId && formType) {
      dispatch(getCustomModules({ userId, form: formType }));
    }
  }, [dispatch, formType, userId]);

  useEffect(() => {
    if (!printSettings?.[formType]) {
      dispatch(getPrintSettings());
    }
  }, [dispatch, formType]);

  const updateCustomizationWith = useCallback(
    (nextSections) => {
      if (!customizationKey || !setModelData) {
        return;
      }

      dispatch(
        updateCustomization({
          ...customization,
          [customizationKey]: nextSections,
        })
      );
    },
    [customization, customizationKey, dispatch, setModelData]
  );

  const syncPrintSettingsFormatStyle = useCallback(
    (action, { moduleId, moduleName }) => {
      if (!formType || !moduleId || !printSettings?.[FORM_TYPE_MAP[formType]]) {
        return;
      }

      const resolvedLabel =
        moduleName?.trim() ||
        customModules.find((module) => module.module_id === moduleId)?.name ||
        "Custom Module";

      const moduleSettings = printSettings[FORM_TYPE_MAP[formType]];
      const currentFormatStyle = Array.isArray(moduleSettings.formatStyle)
        ? [...moduleSettings.formatStyle]
        : [];

      let updatedFormatStyle = currentFormatStyle;
      let shouldUpdate = false;

      if (action === "add") {
        if (
          currentFormatStyle.some(
            (section) => ensureModuleId(section) === moduleId
          )
        ) {
          return;
        }

        const highestOrder = currentFormatStyle.reduce((max, section) => {
          const order = Number(section.order) || 0;
          return order > max ? order : max;
        }, 0);

        const newSection = {
          id: moduleId,
          label: resolvedLabel,
          order: highestOrder + 1,
          visible: true,
          view: 1,
          subSections: [],
          isCustom: true,
        };

        updatedFormatStyle = [...currentFormatStyle, newSection];
        shouldUpdate = true;
      }

      if (action === "rename") {
        let renamed = false;
        updatedFormatStyle = currentFormatStyle.map((section) => {
          if (ensureModuleId(section) === moduleId) {
            renamed = true;
            return {
              ...section,
              label: resolvedLabel,
            };
          }
          return section;
        });

        shouldUpdate = renamed;
      }

      if (action === "delete") {
        const filtered = currentFormatStyle.filter(
          (section) => ensureModuleId(section) !== moduleId
        );

        if (filtered.length !== currentFormatStyle.length) {
          updatedFormatStyle = filtered;
          shouldUpdate = true;
        }
      }

      if (!shouldUpdate) {
        return;
      }

      const {
        _id,
        doctorId,
        hospitalId,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        message,
        ...settingsPayload
      } = printSettings;

      const updatedPrintSettingsPayload = {
        ...settingsPayload,
        [FORM_TYPE_MAP[formType]]: {
          ...moduleSettings,
          formatStyle: updatedFormatStyle,
        },
      };

      dispatch(updatePrintSettings(updatedPrintSettingsPayload));
    },
    [customModules, dispatch, formType, printSettings]
  );

  const handleCustomModuleAdded = useCallback(
    (moduleSection) => {
      const moduleId = ensureModuleId(moduleSection);
      if (!moduleId || !setModelData) {
        return;
      }

      setModelData((prev = []) => {
        if (prev.some((item) => ensureModuleId(item) === moduleId)) {
          return prev;
        }

        const nextSection = buildCustomModuleSection(moduleSection);
        const next = [...prev, nextSection];
        updateCustomizationWith(next);

        const moduleName =
          moduleSection?.name ||
          moduleSection?.module_name ||
          nextSection?.title;

        setCustomModuleContents((previous) => {
          if (previous.some((item) => item.module_id === moduleId)) {
            return previous;
          }

          return [
            ...previous,
            {
              module_id: moduleId,
              module_name: moduleName || "",
              content: DEFAULT_SLATE_VALUE,
            },
          ];
        });

        syncPrintSettingsFormatStyle("add", {
          moduleId,
          moduleName,
        });
        return next;
      });
    },
    [
      setModelData,
      setCustomModuleContents,
      syncPrintSettingsFormatStyle,
      updateCustomizationWith,
    ]
  );

  const handleCustomModuleDeleted = useCallback(
    (moduleId) => {
      if (!moduleId || !setModelData) {
        return;
      }

      setModelData((prev = []) => {
        if (!prev.some((item) => ensureModuleId(item) === moduleId)) {
          return prev;
        }

        const next = prev.filter((item) => ensureModuleId(item) !== moduleId);
        updateCustomizationWith(next);
        syncPrintSettingsFormatStyle("delete", { moduleId });

        setCustomModuleContents((previous) =>
          previous.filter((item) => item.module_id !== moduleId)
        );

        return next;
      });
    },
    [
      setModelData,
      setCustomModuleContents,
      syncPrintSettingsFormatStyle,
      updateCustomizationWith,
    ]
  );

  const handleCustomModuleRenamed = useCallback(
    (moduleId, updatedName) => {
      if (!moduleId || !updatedName || !setModelData) {
        return;
      }

      setModelData((prev = []) => {
        if (!prev.some((item) => ensureModuleId(item) === moduleId)) {
          return prev;
        }

        const next = prev.map((item) =>
          ensureModuleId(item) === moduleId
            ? {
                ...item,
                ...buildCustomModuleSection({
                  ...item,
                  module_id: moduleId,
                  title: updatedName,
                  name: updatedName,
                  module_name: updatedName,
                }),
              }
            : item
        );

        updateCustomizationWith(next);
        syncPrintSettingsFormatStyle("rename", {
          moduleId,
          moduleName: updatedName,
        });

        setCustomModuleContents((previous) =>
          previous.map((item) =>
            item.module_id === moduleId
              ? { ...item, module_name: updatedName }
              : item
          )
        );

        return next;
      });
    },
    [
      setModelData,
      setCustomModuleContents,
      syncPrintSettingsFormatStyle,
      updateCustomizationWith,
    ]
  );

  const handleModuleContentChange = useCallback(
    (moduleId, moduleName, nextValue) => {
      const normalizedContent = ensureSlateValue(nextValue);

      setCustomModuleContents((previous) => {
        const existingIndex = previous.findIndex(
          (item) => item.module_id === moduleId
        );

        if (existingIndex === -1) {
          return [
            ...previous,
            {
              module_id: moduleId,
              module_name: moduleName || "",
              content: normalizedContent,
            },
          ];
        }

        const next = [...previous];
        next[existingIndex] = {
          ...next[existingIndex],
          module_name: moduleName || next[existingIndex].module_name,
          content: normalizedContent,
        };
        return next;
      });
    },
    [setCustomModuleContents]
  );

  const handleModuleTemplateSave = useCallback(
    async ({ moduleId, moduleName, templateName, content, moduleContent }) => {
      const trimmedName = (templateName || "").trim();

      if (!moduleId) {
        message.error("Unable to determine the module to save the template.");
        throw new Error("Missing moduleId");
      }

      if (!trimmedName) {
        message.error("Template name is required.");
        throw new Error("Template name is required");
      }

      const normalizedModuleContent = ensureSlateValue(
        moduleContent || DEFAULT_SLATE_VALUE
      );

      const modulesPayload = customModules.map((cm) => {
        if (cm.module_id === moduleId) {
          const existingTemplates = Array.isArray(cm.templates)
            ? cm.templates
            : [];

          const filteredTemplates = existingTemplates.filter(
            (template) => template.template_name !== trimmedName
          );

          return {
            ...cm,
            templates: [
              {
                template_name: trimmedName,
                content,
              },
              ...filteredTemplates,
            ],
          };
        }

        return cm;
      });

      const payload = {
        data: {
          userId,
          modules: modulesPayload,
          form: formType,
        },
      };

      const action = await dispatch(addModuleIPD(payload));

      if (action.meta.requestStatus === "fulfilled") {
        message.success("Template saved successfully.");

        setCustomModuleContents((previous) => {
          const existingIndex = previous.findIndex(
            (item) => item.module_id === moduleId
          );

          if (existingIndex === -1) {
            return [
              ...previous,
              {
                module_id: moduleId,
                module_name: moduleName,
                content: normalizedModuleContent,
              },
            ];
          }

          const next = [...previous];
          next[existingIndex] = {
            ...next[existingIndex],
            content: normalizedModuleContent,
          };
          return next;
        });

        return action.payload;
      }

      const errorMessage =
        action.error?.message || "Failed to save template. Please try again.";
      message.error(errorMessage);
      throw new Error(errorMessage);
    },
    [customModules, dispatch, formType, userId, setCustomModuleContents]
  );

  const handleModuleTemplateDelete = useCallback(
    async ({ moduleId, templateIdentifier }) => {
      if (!moduleId) {
        message.error("Missing information to delete the template.");
        throw new Error("Missing identifiers");
      }

      const targetModule = customModules.find(
        (module) => module.module_id === moduleId
      );

      if (!targetModule) {
        message.error("Unable to locate the module for this template.");
        throw new Error("Module not found");
      }

      const existingTemplates = Array.isArray(targetModule.templates)
        ? targetModule.templates
        : [];

      if (!existingTemplates.length) {
        message.info("No templates available to delete.");
        return;
      }

      const templateId =
        typeof templateIdentifier === "object"
          ? templateIdentifier?.template_id ||
            templateIdentifier?.id ||
            templateIdentifier?._id ||
            templateIdentifier?.tst_id
          : templateIdentifier;

      if (!templateId) {
        message.warning("Template identifier not found.");
        throw new Error("Template identifier missing");
      }

      const filteredTemplates = existingTemplates.filter(
        (template) => template.template_id !== templateId
      );

      if (filteredTemplates.length === existingTemplates.length) {
        message.warning("Template not found or already deleted.");
        return;
      }

      const modulesPayload = customModules.map((module) => {
        if (module.module_id === moduleId) {
          return {
            ...module,
            templates: filteredTemplates,
          };
        }
        return module;
      });

      const payload = {
        data: {
          userId,
          modules: modulesPayload,
          form: formType,
        },
      };

      const action = await dispatch(addModuleIPD(payload));

      if (action.meta.requestStatus === "fulfilled") {
        message.success("Template deleted successfully.");

        setCustomModuleContents((previous) => previous);

        return action.payload;
      }

      const errorMessage =
        action.error?.message || "Failed to delete template. Please try again.";
      message.error(errorMessage);
      throw new Error(errorMessage);
    },
    [customModules, dispatch, formType, userId, setCustomModuleContents]
  );

  const hydrateFromSavedModules = useCallback(
    (savedModules) => {
      setCustomModuleContents(savedModules || []);
    },
    [setCustomModuleContents]
  );

  const serializeCustomModules = useCallback(
    (contents) =>
      normalizeModuleContents(
        contents || customModuleContents,
        customModules
      ).map(({ module_id, module_name, content }) => ({
        moduleId: module_id,
        moduleName: module_name,
        content: ensureSlateValue(content),
      })),
    [customModuleContents, customModules]
  );

  const isCustomModuleSection = useCallback(
    (section) => {
      if (!section) {
        return false;
      }

      if (section.isCustom || section.isCustomModule) {
        return true;
      }

      const sectionId = ensureModuleId(section);
      if (!sectionId) {
        return false;
      }

      return customModules.some((module) => module.module_id === sectionId);
    },
    [customModules]
  );

  const renderCustomModuleSection = useCallback(
    (section, extraProps = {}) => {
      if (!section) {
        return null;
      }

      const moduleId = ensureModuleId(section);
      if (!moduleId) {
        return null;
      }

      const baseModule =
        customModules.find((module) => module.module_id === moduleId) || {};

      const mergedModule = {
        ...baseModule,
        ...section,
        module_id: moduleId,
        id: moduleId,
      };

      const existingContent = customModuleContents.find(
        (item) => item.module_id === moduleId
      );

      const moduleName = getModuleDisplayName(mergedModule);

      return (
        <IpdCustomModule
          key={moduleId}
          module={mergedModule}
          value={existingContent?.content || DEFAULT_SLATE_VALUE}
          onChange={(nextValue) =>
            handleModuleContentChange(moduleId, moduleName, nextValue)
          }
          isEditable={extraProps?.isEditable ?? isEditable}
          onSaveTemplate={(templatePayload) =>
            handleModuleTemplateSave({
              moduleId,
              moduleName,
              ...templatePayload,
            })
          }
          onDeleteTemplate={(templateIdentifier, done) =>
            handleModuleTemplateDelete({
              moduleId,
              templateIdentifier,
            })
              .catch(() => {})
              .finally(() => {
                if (typeof done === "function") {
                  done();
                }
              })
          }
          {...extraProps}
        />
      );
    },
    [
      customModuleContents,
      customModules,
      handleModuleContentChange,
      handleModuleTemplateSave,
      handleModuleTemplateDelete,
      isEditable,
    ]
  );

  const addCustomModuleProps = useMemo(
    () => ({
      form: formType,
      customModuleContents,
      setCustomModuleContents,
      admissionId,
      patientId,
      onCustomModuleAdded: handleCustomModuleAdded,
    }),
    [
      admissionId,
      customModuleContents,
      formType,
      handleCustomModuleAdded,
      patientId,
      setCustomModuleContents,
    ]
  );

  const renderCustomModulesFooter = useCallback(
    () => (
      <div className="ipd-custom-module-container">
        <AddCustomModule {...addCustomModuleProps} />
      </div>
    ),
    [addCustomModuleProps]
  );

  return {
    customModules,
    customModuleContents,
    setCustomModuleContents,
    isCustomModuleSection,
    renderCustomModuleSection,
    renderCustomModulesFooter,
    hydrateFromSavedModules,
    serializeCustomModules,
    addCustomModuleProps,
    handleCustomModuleAdded,
    handleCustomModuleDeleted,
    handleCustomModuleRenamed,
    handleModuleTemplateSave,
    handleModuleTemplateDelete,
  };
};

export default useIpdCustomModules;
