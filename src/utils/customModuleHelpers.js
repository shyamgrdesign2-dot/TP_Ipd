export const sanitizeCustomModule = (module = {}) => {
  const { createdAt, updatedAt, ...rest } = module;
  return rest;
};

export const extractModulesFromResponse = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload.modules)) {
    return payload.modules.map(sanitizeCustomModule);
  }

  return [];
};

export const buildCustomModuleSection = (module = {}, overrides = {}) => {
  const moduleId =
    module.module_id || module.moduleId || module.id || module.moduleID || "";
  const moduleName =
    module.name || module.module_name || module.title || "Custom Module";

  return {
    id: moduleId,
    title: moduleName,
    icon: "customModule",
    menuIcon: "customModule",
    enabled: true,
    expanded: false,
    isCustom: true,
    name: moduleName,
    children: [],
  };
};
