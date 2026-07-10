// Module Federation stub - provides empty containers so the host app boots
// without the real shared_ui remote running.
var moduleMap = {
  "./components": function () {
    return Promise.resolve({
      __esModule: true,
      default: {},
      PatientDetailsLayout: function () { return null; },
      CollapsibleWrapper: function () { return null; },
      GenericCard: function () { return null; },
      RichTextEditWrapper: function () { return null; },
      GenericTable: function () { return null; },
      SectionedTable: function () { return null; },
      UnitInput: function () { return null; },
      AutoFillButton: function () { return null; },
      RichTextEditor: function () { return null; },
      ReusableProgressCard: function () { return null; },
      FilledByCard: function () { return null; },
      ReusableStepper: function () { return null; },
      VoiceAI: function () { return null; },
      LayoutWithMenu: function () { return null; },
      Customization: function () { return null; },
    });
  },
  "./simple": function () {
    return Promise.resolve({ __esModule: true, default: {} });
  },
};

export function get(module) {
  return moduleMap[module]
    ? moduleMap[module]()
    : Promise.reject(new Error("Module " + module + " does not exist in stub"));
}

export function init() {
  return Promise.resolve();
}
