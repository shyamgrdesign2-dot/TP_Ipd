import * as remoteEntry from "/shared-ui/assets/remoteEntry.js";

const originalGet = remoteEntry.get;

function get(module) {
  const result = originalGet(module);
  if (result && typeof result.then === "function") {
    return result.then(function (m) {
      return function () { return m; };
    });
  }
  return function () { return result; };
}

export { get };
export const init = remoteEntry.init;
export const dynamicLoadingCss = remoteEntry.dynamicLoadingCss;
