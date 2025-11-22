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
import { useTemplateManagement } from "../../../../hooks/useTemplateManagement";
import { voiceRx } from "../../../../redux/ipd/ipdSlice";
import { defaultIcons as defaultAssetIcons } from "../../../../assets/images/icons";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const EMPTY_RICH_TEXT_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];


const DischargeAdvice = (props) => {
  const {
    isEditable = true,
    sectionData,
    patientId: patientIdProp = null,
    admissionId: admissionIdProp = null,
  } = props || {};
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );

  // Get doctorId from dischargeSummaryData
  const doctorId =
    dischargeSummaryData?.patientInformation?.primaryConsultant?.id;
  const resolvedPatientId =
    patientIdProp ||
    dischargeSummaryData?.patientInformation?.patientId ||
    dischargeSummaryData?.patientInformation?.id ||
    null;
  const resolvedAdmissionId =
    admissionIdProp ||
    dischargeSummaryData?.patientInformation?.admissionId ||
    null;

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
      // Array-based modules (diet, physicalActivities) should return empty array, not EMPTY_RICH_TEXT_VALUE
      const arrayBasedModules = ['diet', 'physicalActivities'];
      const isArrayBasedModule = arrayBasedModules.includes(moduleId);
      
      if (
        Array.isArray(dischargeSummaryData?.[key]) &&
        dischargeSummaryData[key].length
      ) {
        return dischargeSummaryData[key];
      }
      
      // For array-based modules, return empty array; for rich text modules, return EMPTY_RICH_TEXT_VALUE
      return isArrayBasedModule ? [] : EMPTY_RICH_TEXT_VALUE;
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

  // Template management for rich text modules
  const warningSignsTemplate = useTemplateManagement({
    moduleName: "warningSigns",
    templateSite,
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue: useCallback(() => getCurrentValue("warningSigns"), [getCurrentValue]),
    onValueChange: useCallback(
      (data) => handleOthersChange(data, "warningSigns"),
      [handleOthersChange]
    ),
    autoFetch: false,
  });

  const preventiveMeasuresTemplate = useTemplateManagement({
    moduleName: "preventiveMeasures",
    templateSite,
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue: useCallback(() => getCurrentValue("preventiveMeasures"), [getCurrentValue]),
    onValueChange: useCallback(
      (data) => handleOthersChange(data, "preventiveMeasures"),
      [handleOthersChange]
    ),
    autoFetch: false,
  });

  const emergencyContactTemplate = useTemplateManagement({
    moduleName: "emergencyContact",
    templateSite,
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue: useCallback(() => getCurrentValue("emergencyContact"), [getCurrentValue]),
    onValueChange: useCallback(
      (data) => handleOthersChange(data, "emergencyContact"),
      [handleOthersChange]
    ),
    autoFetch: false,
  });

  const otherAdviceTemplate = useTemplateManagement({
    moduleName: "otherAdvice",
    templateSite,
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue: useCallback(() => getCurrentValue("otherAdvice"), [getCurrentValue]),
    onValueChange: useCallback(
      (data) => handleOthersChange(data, "otherAdvice"),
      [handleOthersChange]
    ),
    autoFetch: false,
  });

  // Template management for array modules
  const dietTemplate = useTemplateManagement({
    moduleName: "diet",
    templateSite,
    doctorId,
    isEditable,
    moduleType: "array",
    getCurrentValue: useCallback(() => getCurrentValue("diet"), [getCurrentValue]),
    onArrayChange: useCallback(
      (data) => dispatch(setDiet(data)),
      [dispatch]
    ),
    isDuplicate: useCallback((existing, newItem) => {
      if (existing.id && newItem.id && existing.id === newItem.id) {
        return true;
      }
      return false;
    }, []),
    autoFetch: false,
  });

  const physicalActivitiesTemplate = useTemplateManagement({
    moduleName: "physicalActivities",
    templateSite,
    doctorId,
    isEditable,
    moduleType: "array",
    getCurrentValue: useCallback(() => getCurrentValue("physicalActivities"), [getCurrentValue]),
    onArrayChange: useCallback(
      (data) => dispatch(setPhysicalActivities(data)),
      [dispatch]
    ),
    isDuplicate: useCallback((existing, newItem) => {
      if (existing.id && newItem.id && existing.id === newItem.id) {
        return true;
      }
      return false;
    }, []),
    autoFetch: false,
  });

  const getVoiceHandler = useCallback(
    (fieldKey, previousOutput, onDataUpdate, setAutoFillFn) =>
      async (payload, callback) => {
        if (!resolvedPatientId || !resolvedAdmissionId) {
          callback?.();
          return;
        }
        const response = await dispatch(
          voiceRx({
            patientId: resolvedPatientId,
            admissionId: resolvedAdmissionId,
            schemaKey: `DISRCHARGED_SUMMARY.dischargeAdvice.${fieldKey}`,
            audioFile: payload?.audioBlob,
            filename: payload?.filename,
            mimeType: payload?.mimeType,
            previousOutput,
          })
        );

        if (response.meta.requestStatus === "fulfilled") {
          const updatedData =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.response?.[
              fieldKey
            ] || [];
          if (!isEmptyRichText(updatedData)) {
            onDataUpdate(updatedData);
            // setAutoFillFn?.(updatedData);
          }
          callback?.();
        } else {
          callback?.();
        }
      },
    [dispatch, resolvedPatientId, resolvedAdmissionId]
  );

  // Simple memoization for initial values
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
  useEffect(() => {
    if (initialFetchDoneRef.current || !isEditable) {
      return;
    }

    const shouldFetchTemplates = (existingTemplates) => {
      return !existingTemplates || existingTemplates.length === 0;
    };

    // Fetch templates only if they don't exist in Redux
    if (shouldFetchTemplates(warningSignsTemplate.rawTemplates)) {
      warningSignsTemplate.refreshTemplates();
    }
    if (shouldFetchTemplates(preventiveMeasuresTemplate.rawTemplates)) {
      preventiveMeasuresTemplate.refreshTemplates();
    }
    if (shouldFetchTemplates(emergencyContactTemplate.rawTemplates)) {
      emergencyContactTemplate.refreshTemplates();
    }
    if (shouldFetchTemplates(otherAdviceTemplate.rawTemplates)) {
      otherAdviceTemplate.refreshTemplates();
    }
    if (shouldFetchTemplates(dietTemplate.rawTemplates)) {
      dietTemplate.refreshTemplates();
    }
    if (shouldFetchTemplates(physicalActivitiesTemplate.rawTemplates)) {
      physicalActivitiesTemplate.refreshTemplates();
    }

    initialFetchDoneRef.current = true;
  }, [
    isEditable,
    warningSignsTemplate.rawTemplates,
    preventiveMeasuresTemplate.rawTemplates,
    emergencyContactTemplate.rawTemplates,
    otherAdviceTemplate.rawTemplates,
    dietTemplate.rawTemplates,
    physicalActivitiesTemplate.rawTemplates,
    warningSignsTemplate.refreshTemplates,
    preventiveMeasuresTemplate.refreshTemplates,
    emergencyContactTemplate.refreshTemplates,
    otherAdviceTemplate.refreshTemplates,
    dietTemplate.refreshTemplates,
    physicalActivitiesTemplate.refreshTemplates,
  ]);

  const renderWarningSigns = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.warningSigns))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        templates={warningSignsTemplate.templates}
        templateType="entries"
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showVoiceAI={isEditable && resolvedPatientId && resolvedAdmissionId}
        showMicrophone={true}
        voiceAiIcon={defaultAssetIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={getVoiceHandler(
          "warningSigns",
          dischargeSummaryData?.warningSigns,
          (data) => handleOthersChange(data, "warningSigns"),
          setAutoFillTextToAppendWarningSigns
        )}
        onChange={(data) => handleOthersChange(data, "warningSigns")}
        initialValue={warningSignsInitialValue}
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={() => {}}
        onErase={() => {
          // Clear Redux state
          handleOthersChange(EMPTY_RICH_TEXT_VALUE, "warningSigns");
          // Clear local UI state
          setAutoFillTextToAppendWarningSigns(["clear"]);
        }}
        showTempButtons={true}
        onTemplate={warningSignsTemplate.refreshTemplates}
        onTemplateSelected={warningSignsTemplate.handleTemplateSelected}
        addTemplate={warningSignsTemplate.handleAddTemplate}
        updateTemplate={warningSignsTemplate.handleUpdateTemplate}
        onDeleteTemplateClicked={warningSignsTemplate.handleDeleteTemplate}
        loading={warningSignsTemplate.templatesLoading}
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
        templates={preventiveMeasuresTemplate.templates}
        templateType="entries"
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showVoiceAI={isEditable && resolvedPatientId && resolvedAdmissionId}
        showMicrophone={true}
        voiceAiIcon={defaultAssetIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={getVoiceHandler(
          "preventiveMeasures",
          dischargeSummaryData?.preventiveMeasures,
          (data) => handleOthersChange(data, "preventiveMeasures"),
          setAutoFillTextToAppendPreventiveMeasures
        )}
        onChange={(data) => handleOthersChange(data, "preventiveMeasures")}
        initialValue={preventiveMeasuresInitialValue}
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={() => {}}
        onErase={() => {
          // Clear Redux state
          handleOthersChange(EMPTY_RICH_TEXT_VALUE, "preventiveMeasures");
          // Clear local UI state
          setAutoFillTextToAppendPreventiveMeasures(["clear"]);
        }}
        showTempButtons={true}
        onTemplate={preventiveMeasuresTemplate.refreshTemplates}
        onTemplateSelected={preventiveMeasuresTemplate.handleTemplateSelected}
        addTemplate={preventiveMeasuresTemplate.handleAddTemplate}
        updateTemplate={preventiveMeasuresTemplate.handleUpdateTemplate}
        onDeleteTemplateClicked={preventiveMeasuresTemplate.handleDeleteTemplate}
        loading={preventiveMeasuresTemplate.templatesLoading}
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
        templates={emergencyContactTemplate.templates}
        templateType="entries"
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate="15 Jun 2025"
        showVoiceAI={isEditable && resolvedPatientId && resolvedAdmissionId}
        showMicrophone={true}
        voiceAiIcon={defaultAssetIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={getVoiceHandler(
          "emergencyContact",
          dischargeSummaryData?.emergencyContact,
          (data) => handleOthersChange(data, "emergencyContact"),
          setAutoFillTextToAppendEmergencyContact
        )}
        onChange={(data) => handleOthersChange(data, "emergencyContact")}
        initialValue={emergencyContactInitialValue}
        placeholder={
          data?.placeholder ||
          "Enter details like onset, duration, progression, and associated symptoms"
        }
        onSave={() => {}}
        onErase={() => {
          // Clear Redux state
          handleOthersChange(EMPTY_RICH_TEXT_VALUE, "emergencyContact");
          // Clear local UI state
          setAutoFillTextToAppendEmergencyContact(["clear"]);
        }}
        showTempButtons={true}
        onTemplate={emergencyContactTemplate.refreshTemplates}
        onTemplateSelected={emergencyContactTemplate.handleTemplateSelected}
        addTemplate={emergencyContactTemplate.handleAddTemplate}
        updateTemplate={emergencyContactTemplate.handleUpdateTemplate}
        onDeleteTemplateClicked={emergencyContactTemplate.handleDeleteTemplate}
        loading={emergencyContactTemplate.templatesLoading}
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
          templates={otherAdviceTemplate.templates}
          templateType="entries"
          title={data?.title}
          width={isEditable ? "100%" : "fit-content"}
          icon={dischargeSummaryIcons[`${data?.id}Pc`]}
          showAutoFill={false}
          containerClass={`wrapper-class ${
            !isEditable ? "ipd-wrapper-class-readonly" : ""
          }`}
          opdDate="15 Jun 2025"
          showVoiceAI={
            isEditable && resolvedPatientId && resolvedAdmissionId
          }
          showMicrophone={true}
          voiceAiIcon={defaultAssetIcons.voiceAiIcon}
          onVoiceAIRecordingComplete={getVoiceHandler(
            "otherAdvice",
            dischargeSummaryData?.otherAdvice,
            (data) => handleOthersChange(data, "otherAdvice"),
            setAutoFillTextToAppendOtherAdvice
          )}
          onChange={(data) => handleOthersChange(data, "otherAdvice")}
          initialValue={otherAdviceInitialValue}
          placeholder={
            data?.placeholder ||
            "Enter details like onset, duration, progression, and associated symptoms"
          }
          onSave={() => {}}
          onErase={() => {
            // Clear Redux state
            handleOthersChange(EMPTY_RICH_TEXT_VALUE, "otherAdvice");
            // Clear local UI state
            setAutoFillTextToAppendOtherAdvice(["clear"]);
          }}
          showTempButtons={true}
          onTemplate={otherAdviceTemplate.refreshTemplates}
          onTemplateSelected={otherAdviceTemplate.handleTemplateSelected}
          addTemplate={otherAdviceTemplate.handleAddTemplate}
          updateTemplate={otherAdviceTemplate.handleUpdateTemplate}
          onDeleteTemplateClicked={otherAdviceTemplate.handleDeleteTemplate}
          loading={otherAdviceTemplate.templatesLoading}
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
                      templates={dietTemplate.templates}
                      templateType="diet"
                      showTempButtons={true}
                      onSave={() => {}}
                      onErase={() => {
                        dispatch(setDiet([]));
                      }}
                      onTemplate={dietTemplate.refreshTemplates}
                      onTemplateSelected={dietTemplate.handleTemplateSelected}
                      addTemplate={dietTemplate.handleAddTemplate}
                      updateTemplate={dietTemplate.handleUpdateTemplate}
                      onDeleteTemplateClicked={dietTemplate.handleDeleteTemplate}
                      loading={dietTemplate.templatesLoading}
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
                      templates={physicalActivitiesTemplate.templates}
                      templateType="physicalActivities"
                      onSave={() => {}}
                      onErase={() => {
                        dispatch(setPhysicalActivities([]));
                      }}
                      showTempButtons={true}
                      onTemplate={physicalActivitiesTemplate.refreshTemplates}
                      onTemplateSelected={physicalActivitiesTemplate.handleTemplateSelected}
                      addTemplate={physicalActivitiesTemplate.handleAddTemplate}
                      updateTemplate={physicalActivitiesTemplate.handleUpdateTemplate}
                      onDeleteTemplateClicked={physicalActivitiesTemplate.handleDeleteTemplate}
                      loading={physicalActivitiesTemplate.templatesLoading}
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
