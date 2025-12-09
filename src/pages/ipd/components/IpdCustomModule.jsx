import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { isEmptyRichText } from "../../../utils/utils";
import customModuleIcon from "../../../assets/images/custom-module.svg";
import { useDispatch } from "react-redux";
import { defaultIcons } from "../../../assets/images/icons";
import { useVoiceAiRecordingComplete } from "../../../hooks/useVoiceAiRecordingComplete";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const DEFAULT_SLATE_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ensureSlateValue = (value) => {
  if (Array.isArray(value) && value.every((node) => node?.children)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.every((node) => node?.children)) {
        return parsed;
      }
    } catch (error) {
      return DEFAULT_SLATE_VALUE;
    }
  }

  return DEFAULT_SLATE_VALUE;
};

const IpdCustomModule = ({
  module,
  value,
  onChange,
  onSaveTemplate,
  onDeleteTemplate,
  isEditable = true,
  hideBorder = false,
  placeholder,
  className,
  headerComponent = null,
  footerComponent = null,
  onUpdateModuleName,
  onDeleteModule,
  patientId = null,
  admissionId = null,
  formType = "customModule",
}) => {
  const dispatch = useDispatch();
  const { submitVoiceAiRecording } = useVoiceAiRecordingComplete({
    patientId,
    admissionId,
  });
  const moduleTitle =
    module?.moduleName ||
    module?.title ||
    module?.module_name ||
    module?.name ||
    "Custom Module";

  const [editorValue, setEditorValue] = useState(() => ensureSlateValue(value));
  const [templateAppendValue, setTemplateAppendValue] = useState([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);

  useEffect(() => {
    setEditorValue(ensureSlateValue(value));
  }, [value]);

  const handleChange = useCallback(
    (nextValue) => {
      setEditorValue(nextValue);

      if (typeof onChange === "function") {
        onChange(nextValue);
      }
    },
    [onChange]
  );

  const resolvedPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    return `Enter ${moduleTitle.toLowerCase()} details`;
  }, [placeholder, moduleTitle]);

  const footerRenderer = useCallback(() => footerComponent, [footerComponent]);

  const isValueEmpty = useMemo(
    () => isEmptyRichText(editorValue),
    [editorValue]
  );

  const moduleTemplates = useMemo(
    () =>
      module?.templates?.map((template) => ({
        ...template,
        tst_template_name: template?.template_name,
        entries: ensureSlateValue(template?.content),
        id: template?.template_id,
      })) || [],
    [module?.templates]
  );

  const handleTemplateSelected = useCallback((template) => {
    if (!template) {
      return;
    }

    setIsTemplateLoading(true);

    const rawContent = template?.entries || template?.moduleContent?.content;
    const finalContent = ensureSlateValue(rawContent);

    setTemplateAppendValue(finalContent);
    setIsTemplateLoading(false);
  }, []);

  const resetTemplateAppendValue = useCallback((nextValue) => {
    setTemplateAppendValue(nextValue);
  }, []);

  const handleTemplateSave = useCallback(
    (templateData, done) => {
      if (typeof onSaveTemplate !== "function") {
        if (typeof done === "function") done();
        return;
      }

      setIsTemplateLoading(true);

      const resolvedName = templateData?.tst_template_name || "";

      const resolvedContent = ensureSlateValue(
        templateData?.entries ||
          templateData?.content ||
          templateData?.templateContent ||
          templateData?.value ||
          editorValue
      );

      Promise.resolve(
        onSaveTemplate({
          moduleId: module?.module_id || module?.id,
          moduleName: moduleTitle,
          templateName: resolvedName,
          content: resolvedContent,
          moduleContent: ensureSlateValue(editorValue),
        })
      )
        .then(() => {
          setTemplateAppendValue([]);
        })
        .catch((e) => {
          console.error("Error saving template", e);
        })
        .finally(() => {
          setIsTemplateLoading(false);
          if (typeof done === "function") {
            done();
          }
        });
    },
    [editorValue, module?.id, module?.module_id, moduleTitle, onSaveTemplate]
  );

  const handleDeleteTemplate = useCallback(
    (templateIdentifier, done) => {
      if (typeof onDeleteTemplate !== "function") {
        if (typeof done === "function") done();
        return;
      }

      setIsTemplateLoading(true);

      Promise.resolve(onDeleteTemplate(templateIdentifier))
        .catch((e) => {
          console.error("Error deleting template", e);
        })
        .finally(() => {
          setIsTemplateLoading(false);
          if (typeof done === "function") {
            done();
          }
        });
    },
    [onDeleteTemplate]
  );

  const handleUpdateModuleName = useCallback(
    (newModuleName) => {
      if (typeof onUpdateModuleName === "function") {
        onUpdateModuleName(newModuleName);
      }
    },
    [onUpdateModuleName]
  );

  const handleDeleteModule = useCallback(() => {
    if (typeof onDeleteModule === "function") {
      onDeleteModule(module?.module_id || module?.id);
    }
  }, [onDeleteModule]);

  const schemaKeyMapping = {
    assessments: "ASSESSMENTS",
    progressNotes: "PROGRESS_NOTES",
    consultantNotes: "CONSULTANT_NOTES",
    crossReferral: "CROSS_REFERRAL",
    dischargeSummary: "DISCHARGED_SUMMARY",
    otNotes: "OT_NOTES",
  };

  const handleAIRecordingComplete = useCallback(
    (payload, callback) => {
      const schemaKey = `${schemaKeyMapping?.[formType]}.customModules`;
      submitVoiceAiRecording({
        payload,
        schemaKey,
        previousOutput: editorValue,
        onSuccess: (updatedData) => {
          if (!isEmptyRichText(updatedData)) {
            // setTemplateAppendValue(updatedData);
            handleChange(updatedData);
          }
        },
        callback,
      });
    },
    [editorValue, formType, handleChange, moduleTitle, submitVoiceAiRecording]
  );

  if (!isEditable && isValueEmpty) {
    return null;
  }

  return (
    <div
      key={`custom-module-${JSON.stringify(module)}`}
      className="ipd-custom-module-wrapper"
    >
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        showVoiceAI={isEditable && patientId && admissionId}
        showMicrophone={isEditable && patientId && admissionId}
        voiceAiIcon={defaultIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={handleAIRecordingComplete}
        title={moduleTitle}
        data-testid={module?.id || module?.module_id}
        width="100%"
        initialValue={editorValue}
        placeholder={resolvedPlaceholder}
        icon={customModuleIcon}
        showTemplate
        showTempButtons
        showSave
        showErase
        templates={moduleTemplates}
        templateType="entries"
        onTemplate={() => {
          console.log("onTemplate");
        }}
        onTemplateSelected={handleTemplateSelected}
        headerComponent={headerComponent}
        renderFooter={footerComponent ? footerRenderer : undefined}
        onChange={handleChange}
        addTemplate={handleTemplateSave}
        updateTemplate={handleTemplateSave}
        onDeleteTemplateClicked={handleDeleteTemplate}
        newAutoFillTextToAppend={templateAppendValue}
        setNewAutoFillTextToAppend={resetTemplateAppendValue}
        isShimmeringFromParent={isTemplateLoading}
        containerClass={`${hideBorder ? "ipd-custom-module-hide-border" : ""} ${
          !isEditable ? "ipd-wrapper-class-readonly readonly-container-box" : ""
        }`}
        isDataPresent={!isEmptyRichText(editorValue)}
        onErase={() => setTemplateAppendValue(["clear"])}
        onUpdateModuleName={(newModuleName) =>
          handleUpdateModuleName(newModuleName)
        }
        onDeleteModule={handleDeleteModule}
        isCustom
      />
    </div>
  );
};

export default IpdCustomModule;
