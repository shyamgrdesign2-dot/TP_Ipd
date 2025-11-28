import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import AddCustomModule from "../components/AddCustomModule";
import IpdCustomModule from "../pages/ipd/components/IpdCustomModule";
import {
  addModule as addModuleIPD,
  getCustomModules,
  markModuleAsDeleted,
  deleteModule,
} from "../redux/ipd/customModuleSlice";
import { updateCustomization } from "../redux/ipd/ipdSlice";
import {
  updatePrintSettings,
  getPrintSettings,
} from "../redux/ipd/printSettingsSlice";
import { buildCustomModuleSection } from "../utils/customModuleHelpers";
import { useLocation } from "react-router-dom";
import { IPD } from "../utils/locale";

const DEFAULT_SLATE_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const FORM_TYPE_TO_PRINT_SETTINGS_MODULE_MAP = {
  [IPD.CUSTOM_MODULE_FORM_TYPES.consultantNotes]: "consultationNotes",
  [IPD.CUSTOM_MODULE_FORM_TYPES.progressNotes]: "progressNotes",
  [IPD.CUSTOM_MODULE_FORM_TYPES.otNotes]: "otNotes",
  [IPD.CUSTOM_MODULE_FORM_TYPES.dischargeSummary]: "dischargeSummary",
  [IPD.CUSTOM_MODULE_FORM_TYPES.assessments]: "assessments",
  [IPD.CUSTOM_MODULE_FORM_TYPES.crossReferral]: "crossReferral",
};

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

const useIpdCustomModules = ({
  formType,
  customizationKey,
  modelData,
  setModelData,
  admissionId,
  patientId,
  isEditable = true,
}) => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.ipd.customization || {});
  const customModules = useSelector(
    (state) => state.ipdCustomModules.customModules || []
  );
  const { printSettings } = useSelector((state) => state.printSettings);

  const [customModuleContents, setCustomModuleContentsState] = useState([]);
  const { state } = useLocation();
  const { patientDetails = {} } = state || {};
  const admittingDoctorId = patientDetails?.doctor?.id;

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

  useEffect(() => {
    setCustomModuleContentsState((prev) =>
      normalizeModuleContents(prev, customModules)
    );
  }, [customModules]);

  useEffect(() => {
    if (admittingDoctorId && formType) {
      dispatch(getCustomModules({ userId: admittingDoctorId, form: formType }));
    }
  }, [dispatch, formType, admittingDoctorId]);

  useEffect(() => {
    const mappedFormType = FORM_TYPE_TO_PRINT_SETTINGS_MODULE_MAP[formType];
    if (mappedFormType && !printSettings?.[mappedFormType]) {
      dispatch(getPrintSettings());
    }
  }, [dispatch, formType, printSettings]);

  const updateCustomizationWith = useCallback(
    async (nextSections) => {
      if (!customizationKey || !setModelData) {
        return;
      }

      try {
        await dispatch(
          updateCustomization({
            doctorId: admittingDoctorId,
            customization: {
              ...customization,
              [customizationKey]: nextSections,
            },
            [customizationKey]: nextSections,
          })
        );
      } catch (error) {
        console.error("Failed to update customization:", error);
      }
    },
    [customization, customizationKey, dispatch, setModelData]
  );

  const syncPrintSettingsFormatStyle = useCallback(
    async (action, { moduleId, moduleName }) => {
      const mappedFormType = FORM_TYPE_TO_PRINT_SETTINGS_MODULE_MAP[formType];
      if (!mappedFormType || !moduleId || !printSettings?.[mappedFormType]) {
        return;
      }

      const resolvedLabel =
        moduleName?.trim() ||
        customModules.find((module) => module.module_id === moduleId)?.name ||
        "Custom Module";

      const moduleSettings = printSettings[mappedFormType];
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
      } else if (action === "rename") {
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
      } else if (action === "delete") {
        let softDeleted = false;
        updatedFormatStyle = currentFormatStyle.map((section) => {
          if (ensureModuleId(section) === moduleId) {
            softDeleted = true;
            return {
              ...section,
              isDeleted: true,
            };
          }
          return section;
        });

        shouldUpdate = softDeleted;
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
        printSettings: {
          ...settingsPayload,
          [mappedFormType]: {
            ...moduleSettings,
            formatStyle: updatedFormatStyle,
          },
        },
        doctorId: admittingDoctorId,
      };

      try {
        await dispatch(updatePrintSettings(updatedPrintSettingsPayload));
      } catch (error) {
        console.error("Failed to update print settings:", error);
      }
    },
    [customModules, dispatch, formType, printSettings, admittingDoctorId]
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

        Promise.allSettled([
          updateCustomizationWith(next),
          syncPrintSettingsFormatStyle("add", {
            moduleId,
            moduleName,
          }),
        ]).then((results) => {
          const failures = results.filter((r) => r.status === "rejected");
          if (failures.length > 0) {
            console.error("Some secondary operations failed:", failures);
          }
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
    async (moduleId) => {
      if (!moduleId || !setModelData) {
        return;
      }

      const payload = {
        userId: admittingDoctorId,
        form: formType,
        moduleId,
      };

      const action = await dispatch(deleteModule(payload));

      if (action.meta.requestStatus === "fulfilled") {
        message.success("Module deleted successfully.");

        dispatch(markModuleAsDeleted({ moduleId }));
        setModelData((prev = []) => {
          const next = prev.map((item) =>
            ensureModuleId(item) === moduleId
              ? { ...item, isDeleted: true }
              : item
          );

          Promise.allSettled([
            updateCustomizationWith(next),
            syncPrintSettingsFormatStyle("delete", { moduleId }),
          ]).then((results) => {
            const failures = results.filter((r) => r.status === "rejected");
            if (failures.length > 0) {
              console.error(
                "Some secondary operations failed after delete:",
                failures
              );
            }
          });

          return next;
        });
      } else {
        message.error("Failed to delete module. Please try again.");
      }
    },
    [
      dispatch,
      admittingDoctorId,
      formType,
      setModelData,
      setCustomModuleContents,
      syncPrintSettingsFormatStyle,
      updateCustomizationWith,
    ]
  );

  const isNameExists = (updatedName) => {
    return customModules.some(
      (module) => module.name.trim() === updatedName.trim() && !module.isDeleted
    );
  };

  const handleCustomModuleRenamed = useCallback(
    async (moduleId, updatedName) => {
      if (!moduleId || !updatedName || !setModelData) {
        return;
      }

      if (isNameExists(updatedName)) {
        message.error("Module name already exists.");
        return;
      }
      const payload = {
        data: {
          userId: admittingDoctorId,
          modules: customModules.map((module) =>
            module.module_id === moduleId
              ? { ...module, name: updatedName }
              : module
          ),
          form: formType,
        },
      };

      const action = await dispatch(addModuleIPD(payload));

      if (action.meta.requestStatus === "fulfilled") {
        message.success("Module name updated successfully.");

        setModelData((prev = []) => {
          if (!prev.some((item) => ensureModuleId(item) === moduleId)) {
            return prev;
          }

          const next = prev.map((item) =>
            ensureModuleId(item) === moduleId
              ? {
                  ...item,
                  title: updatedName,
                }
              : item
          );

          setCustomModuleContents((previous) =>
            previous.map((item) =>
              item.module_id === moduleId
                ? { ...item, module_name: updatedName }
                : item
            )
          );

          Promise.allSettled([
            updateCustomizationWith(next),
            syncPrintSettingsFormatStyle("rename", {
              moduleId,
              moduleName: updatedName,
            }),
          ]).then((results) => {
            const failures = results.filter((r) => r.status === "rejected");
            if (failures.length > 0) {
              console.error(
                "Some secondary operations failed after rename:",
                failures
              );
            }
          });

          return next;
        });
      } else {
        message.error("Failed to update module name. Please try again.");
        throw new Error("Failed to update module name");
      }
    },
    [
      admittingDoctorId,
      formType,
      customModules,
      dispatch,
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
          userId: admittingDoctorId,
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
    [
      customModules,
      dispatch,
      formType,
      admittingDoctorId,
      setCustomModuleContents,
    ]
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
          userId: admittingDoctorId,
          modules: modulesPayload,
          form: formType,
        },
      };

      const action = await dispatch(addModuleIPD(payload));

      if (action.meta.requestStatus === "fulfilled") {
        message.success("Template deleted successfully.");
        return action.payload;
      }

      const errorMessage =
        action.error?.message || "Failed to delete template. Please try again.";
      message.error(errorMessage);
      throw new Error(errorMessage);
    },
    [customModules, dispatch, formType, admittingDoctorId]
  );

  const hydrateFromSavedModules = useCallback(
    (savedModules) => {
      setCustomModuleContents(savedModules || []);
    },
    [setCustomModuleContents]
  );

  const serializeCustomModules = useCallback(
    (contents) =>
      normalizeModuleContents(contents || customModuleContents, customModules)
        .filter(({ module_id, deleted }) => {
          if (deleted) {
            return false;
          }
          const module = customModules.find((m) => m.module_id === module_id);
          return !module?.deleted;
        })
        .map(({ module_id, module_name, content }) => ({
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

      if (section.isDeleted && isEditable) {
        return false;
      }

      if (section.isCustom) {
        return true;
      }

      const sectionId = ensureModuleId(section);
      if (!sectionId) {
        return false;
      }

      return customModules.some(
        (module) =>
          module.module_id === sectionId &&
          (isEditable ? !module.isDeleted : true)
      );
    },
    [customModules]
  );

  const renderCustomModuleSection = useCallback(
    (section, extraProps = {}) => {
      const moduleId = ensureModuleId(section);
      const baseModule =
        customModules.find(
          (module) =>
            module.module_id === moduleId && !(module.isDeleted && isEditable)
        ) || {};

      if (
        !section ||
        (section.isDeleted && isEditable) ||
        !moduleId ||
        !baseModule?.module_id
      ) {
        return null;
      }

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
          isEditable={isEditable}
          patientId={patientId}
          admissionId={admissionId}
          formType={formType}
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
          onUpdateModuleName={(newModuleName) =>
            handleCustomModuleRenamed(moduleId, newModuleName)
          }
          onDeleteModule={(moduleId) => handleCustomModuleDeleted(moduleId)}
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
      patientId,
      admissionId,
      formType,
      handleCustomModuleRenamed,
      handleCustomModuleDeleted,
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
      admittingDoctorId,
      activeCount:
        modelData?.filter((item) => item.isCustom && !item.isDeleted).length ||
        0,
    }),
    [
      admissionId,
      customModuleContents,
      formType,
      handleCustomModuleAdded,
      patientId,
      setCustomModuleContents,
      admittingDoctorId,
      modelData,
    ]
  );

  const renderCustomModulesFooter = useCallback(
    () => (
      <div className="ipd-add-custom-module-container">
        <AddCustomModule {...addCustomModuleProps} limit={10} isIPDMode />
      </div>
    ),
    [addCustomModuleProps]
  );

  const defaultCustomModulesForCustomization = useMemo(() => {
    return (
      customModules
        ?.filter((module) => !module.isDeleted)
        ?.map((module) => buildCustomModuleSection(module)) || []
    );
  }, [customModules]);

  const defaultCustomModulesForPrintSettings = useMemo(() => {
    return (
      customModules
        ?.filter((module) => !module.isDeleted)
        ?.map((module) => {
          return {
            id: module.module_id,
            label: module.name,
            visible: true,
            view: 1,
            subSections: [],
            isCustom: true,
          };
        }) || []
    );
  }, [customModules]);

  const sanitizeModelData = (data) => {
    if (!data) {
      return [];
    }
    return data.filter((item) => {
      if (item.isCustom) {
        return customModules.some(
          (module) =>
            module.module_id === item.id && !(module.isDeleted && isEditable)
        );
      }
      return true;
    });
  };

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
    defaultCustomModulesForCustomization,
    defaultCustomModulesForPrintSettings,
    handleCustomModuleAdded,
    handleCustomModuleDeleted,
    handleCustomModuleRenamed,
    handleModuleTemplateSave,
    handleModuleTemplateDelete,
    sanitizeModelData,
  };
};

export default useIpdCustomModules;
