import React from "react";
import { Provider } from "react-redux";
import { useLocation } from "react-router-dom";
import { store } from "../redux/store";
import ApiIpdService from "../api/services/ipd/ipdService"; // TODO: adjust path if needed
import magicPen from "../assets/images/icons/magic-pen.svg";
import { isEmptyRichText } from "../utils/utils";

const REMOTE_RELOAD_FLAG = "shared_ui_reload_attempted";

const isRemoteChunkFetchError = (err) => {
  const message = err?.message || "";
  return (
    err?.type === "chunkload" ||
    /ChunkLoadError/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
};

const loadRemoteModuleWithRefresh = async (loader) => {
  try {
    const mod = await loader();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(REMOTE_RELOAD_FLAG);
    }
    return mod;
  } catch (err) {
    const shouldReload =
      typeof window !== "undefined" &&
      typeof sessionStorage !== "undefined" &&
      isRemoteChunkFetchError(err) &&
      !sessionStorage.getItem(REMOTE_RELOAD_FLAG);

    if (shouldReload) {
      // Remote was likely redeployed; force a one-time refresh to pull the latest chunks.
      sessionStorage.setItem(REMOTE_RELOAD_FLAG, "1");
      window.location.reload();
      return new Promise(() => {});
    }

    throw err;
  }
};

const normalizeToDefault = (m, key) => {
  if (key && m[key]) return { default: m[key] };
  if (m?.default) return { default: m.default };
  if (typeof m === "function") return { default: m };
  throw new Error("Remote module does not export a React component.");
};

// Centralized component loading
const loadComponent = (componentName) => {
  return React.lazy(() =>
    loadRemoteModuleWithRefresh(() => import("shared_ui/components")).then(
      (m) => normalizeToDefault(m, componentName)
    )
  );
};

// Feature flag to toggle RichTextEditWrapper microphone and magic-pen visuals
const isRichTextVoiceAiEnabled =
  (process.env.REACT_APP_ENABLE_RICH_TEXT_VOICE_AI ?? "true") === "true";

// Pre-define all shared components
export const RemoteComponents = {
  LayoutWithMenu: loadComponent("LayoutWithMenu"),
  Customization: loadComponent("Customization"),
  PatientDetailsLayout: loadComponent("PatientDetailsLayout"),
  CollapsibleWrapper: loadComponent("CollapsibleWrapper"),
  GenericCard: loadComponent("GenericCard"),
  RichTextEditWrapper: loadComponent("RichTextEditWrapper"),
  GenericTable: loadComponent("GenericTable"),
  SectionedTable: loadComponent("SectionedTable"),
  UnitInput: loadComponent("UnitInput"),
  AutoFillButton: loadComponent("AutoFillButton"),
  RichTextEditor: loadComponent("RichTextEditor"),
  ReusableProgressCard: loadComponent("ReusableProgressCard"),
  FilledByCard: loadComponent("FilledByCard"),
  ReusableStepper: loadComponent("ReusableStepper"),
  VoiceAI: loadComponent("VoiceAI"),
};

export const withRemoteComponent = (WrappedComponent) => {
  return function WithRemoteComponentWrapper(props) {
    return (
      <React.Suspense fallback={<div> </div>}>
        <WrappedComponent {...props} />
      </React.Suspense>
    );
  };
};

export const createRemoteComponent = (componentName, customFallback) => {
  const Component = RemoteComponents[componentName];
  const isRichTextEditWrapper = componentName === "RichTextEditWrapper";

  if (!Component) {
    throw new Error(`Remote component "${componentName}" is not registered.`);
  }

  return function RemoteComponentWrapper(props) {
    const location = useLocation();
    const { patientDetails } = location?.state || {};

    const handleMagicPenClick = async (paragraph, callback) => {
      if (isEmptyRichText(paragraph)) {
        return;
      }
      if (!patientDetails) {
        return;
      }

      const response = await ApiIpdService.magicPen({
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        paragraph,
      });
      if (response?.data?.message === "Digitization failed")  {
        return;
      }
      callback?.(response.format);
    };
    const onUndoMagicPenClick = ({ originalContent, refinedContent }) => {
      console.log('Undo AI refine', { originalContent, refinedContent });
    };

    const finalPropsBase =
      isRichTextEditWrapper && !props.onMagicPenClick
        ? {
            ...props,
            onMagicPenClick: handleMagicPenClick,
            onUndoMagicPenClick: onUndoMagicPenClick,
            magicPenIcon: magicPen,
          }
        : props;

    const finalProps =
      isRichTextEditWrapper && !isRichTextVoiceAiEnabled
        ? {
            ...finalPropsBase,
            showMicrophone: false,
            showMagicPenGif: false,
          }
        : finalPropsBase;

    return (
      <Provider store={store}>
        <React.Suspense fallback={customFallback || <div> </div>}>
          <Component {...finalProps} />
        </React.Suspense>
      </Provider>
    );
  };
};
