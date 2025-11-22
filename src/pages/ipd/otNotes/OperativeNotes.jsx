import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setOperativeNotes } from "../../../redux/ipd/otNotesSlice";
import { isEmptyRichText, hasNoData } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
import { voiceRx } from "../../../redux/ipd/ipdSlice";
import { defaultIcons as defaultAssetIcons } from "../../../assets/images/icons";
import { useLocation } from "react-router-dom";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const OperativeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { state } = useLocation();
  const { patientDetails } = state || {};
  let { operativeNotes = {} } = useSelector((state) => state.otNotes);
  operativeNotes = props.operativeNotes || operativeNotes;
  const { profile } = useSelector((state) => state.doctors);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const doctorId =
    patientDetails?.doctor?.id || profile?.id || profile?.um_id || null;
  const patientId = patientDetails?.details?.id || null;
  const admissionId = patientDetails?.admissionId || null;
  const handleChange = useCallback((value, key) => {
    dispatch(setOperativeNotes({ key, value }));
  }, [dispatch]);
  
  const defaultRichText = useMemo(
    () => [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    []
  );

  // Map section data IDs to Redux keys
  // Section IDs: operativeFindings, procedures, additionalNotes
  // Redux Keys: operativeFindings, operativeProcedure, operativeAdditionalNotes
  const getReduxKey = useCallback((sectionId) => {
    const mapping = {
      operativeFindings: "operativeFindings",
      procedures: "operativeProcedure",
      additionalNotes: "operativeAdditionalNotes",
    };
    return mapping[sectionId] || sectionId;
  }, []);

  const getFieldValue = useCallback(
    (key) => {
      // Convert section ID to Redux key if needed
      const reduxKey = getReduxKey(key);
      const value = props.operativeNotes?.[reduxKey] ?? operativeNotes?.[reduxKey];
      if (Array.isArray(value) && value.length) {
        return value;
      }
      if (value?.value && Array.isArray(value.value) && value.value.length) {
        return value.value;
      }
      return defaultRichText;
    },
    [operativeNotes, props.operativeNotes, defaultRichText, getReduxKey]
  );

  // Helper to get field value by section ID
  const getFieldValueBySectionId = useCallback(
    (sectionId) => {
      const reduxKey = getReduxKey(sectionId);
      const value = props.operativeNotes?.[reduxKey] ?? operativeNotes?.[reduxKey];
      if (Array.isArray(value) && value.length) {
        return value;
      }
      if (value?.value && Array.isArray(value.value) && value.value.length) {
        return value.value;
      }
      return defaultRichText;
    },
    [operativeNotes, props.operativeNotes, defaultRichText, getReduxKey]
  );

  // Memoize field values to prevent infinite loops
  // Use section IDs for mapping
  const operativeFindingsValue = useMemo(
    () => getFieldValueBySectionId("operativeFindings"),
    [getFieldValueBySectionId]
  );

  const operativeProcedureValue = useMemo(
    () => getFieldValueBySectionId("procedures"),
    [getFieldValueBySectionId]
  );

  const operativeAdditionalValue = useMemo(
    () => getFieldValueBySectionId("additionalNotes"),
    [getFieldValueBySectionId]
  );

  // Stable callbacks to prevent recreation
  const handleOperativeFindingsChange = useCallback(
    (data) => {
      handleChange(data, "operativeFindings");
    },
    [handleChange]
  );

  const handleOperativeProcedureChange = useCallback(
    (data) => {
      handleChange(data, "operativeProcedure");
    },
    [handleChange]
  );

  const handleOperativeAdditionalChange = useCallback(
    (data) => {
      handleChange(data, "operativeAdditionalNotes");
    },
    [handleChange]
  );

  const getOperativeFindingsValue = useCallback(
    () => operativeFindingsValue,
    [operativeFindingsValue]
  );

  const getOperativeProcedureValue = useCallback(
    () => operativeProcedureValue,
    [operativeProcedureValue]
  );

  const getOperativeAdditionalValue = useCallback(
    () => operativeAdditionalValue,
    [operativeAdditionalValue]
  );

  const useOperativeTemplate = (moduleName, key, getCurrentValueFn, onValueChangeFn) =>
    useTemplateManagement({
      moduleName,
      templateSite: "ipd",
      doctorId,
      isEditable,
      moduleType: "richText",
      getCurrentValue: getCurrentValueFn,
      onValueChange: onValueChangeFn,
    });

  const operativeFindingsTemplate = useOperativeTemplate(
    "operativeFindings",
    "operativeFindings",
    getOperativeFindingsValue,
    handleOperativeFindingsChange
  );
  const operativeProcedureTemplate = useOperativeTemplate(
    "operativeProcedure",
    "operativeProcedure",
    getOperativeProcedureValue,
    handleOperativeProcedureChange
  );
  const operativeAdditionalTemplate = useOperativeTemplate(
    "operativeAdditionalNotes",
    "operativeAdditionalNotes",
    getOperativeAdditionalValue,
    handleOperativeAdditionalChange
  );

  // Map using section IDs (what data?.id will be)
  const templateMap = useMemo(
    () => ({
      operativeFindings: operativeFindingsTemplate,
      procedures: operativeProcedureTemplate, // Section ID is "procedures"
      additionalNotes: operativeAdditionalTemplate, // Section ID is "additionalNotes"
    }),
    [
      operativeFindingsTemplate,
      operativeProcedureTemplate,
      operativeAdditionalTemplate,
    ]
  );

  const getVoiceHandler = useCallback(
    (sectionId) =>
      async (payload, callback) => {
        if (!patientId || !admissionId) {
          callback?.();
          return;
        }
        const reduxKey = getReduxKey(sectionId);
        const response = await dispatch(
          voiceRx({
            patientId,
            admissionId,
            schemaKey: `OT_NOTES.operativeNotes.${reduxKey}`,
            audioFile: payload?.audioBlob,
            filename: payload?.filename,
            mimeType: payload?.mimeType,
            previousOutput: getFieldValueBySectionId(sectionId),
          })
        );

        if (response.meta.requestStatus === "fulfilled") {
          const updatedData =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.response?.[
              reduxKey
            ] || [];
          if (!isEmptyRichText(updatedData)) {
            // setAutoFillTextToAppend((prev) => ({
            //   ...prev,
            //   [sectionId]: updatedData,
            // }));
            handleChange(updatedData, reduxKey);
          }
          callback?.();
        } else {
          callback?.();
        }
      },
    [
      admissionId,
      dispatch,
      getFieldValueBySectionId,
      getReduxKey,
      handleChange,
      patientId,
    ]
  );

  // Use ref to store the latest handleChange to prevent callback recreation
  const handleChangeRef = useRef(handleChange);
  useEffect(() => {
    handleChangeRef.current = handleChange;
  }, [handleChange]);

  // Memoize onChange callbacks for each field - map section IDs to Redux keys
  // Use ref to avoid dependency on handleChange
  const handleOperativeFindingsOnChange = useCallback(
    (val) => handleChangeRef.current(val, "operativeFindings"), // Section ID = Redux key
    [] // Empty deps - use ref to get latest handleChange
  );
  const handleOperativeProcedureOnChange = useCallback(
    (val) => handleChangeRef.current(val, "operativeProcedure"), // Section ID "procedures" → Redux key "operativeProcedure"
    []
  );
  const handleOperativeAdditionalOnChange = useCallback(
    (val) => handleChangeRef.current(val, "operativeAdditionalNotes"), // Section ID "additionalNotes" → Redux key "operativeAdditionalNotes"
    []
  );

  // Memoize onErase callbacks - use section IDs for state keys, Redux keys for dispatch
  // Use ref to avoid dependency on handleChange
  const handleOperativeFindingsOnErase = useCallback(() => {
    handleChangeRef.current(defaultRichText, "operativeFindings"); // Redux key
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["operativeFindings"]: ["clear"], // Section ID for state key
    }));
  }, [defaultRichText]);

  const handleOperativeProcedureOnErase = useCallback(() => {
    handleChangeRef.current(defaultRichText, "operativeProcedure"); // Redux key
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["procedures"]: ["clear"], // Section ID for state key
    }));
  }, [defaultRichText]);

  const handleOperativeAdditionalOnErase = useCallback(() => {
    handleChangeRef.current(defaultRichText, "operativeAdditionalNotes"); // Redux key
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["additionalNotes"]: ["clear"], // Section ID for state key
    }));
  }, [defaultRichText]);

  // Memoize setAutoFillTextToAppend callbacks - use section IDs for state keys
  const handleSetOperativeFindingsAutoFill = useCallback((value) => {
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["operativeFindings"]: value, // Section ID
    }));
  }, []);

  const handleSetOperativeProcedureAutoFill = useCallback((value) => {
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["procedures"]: value, // Section ID
    }));
  }, []);

  const handleSetOperativeAdditionalAutoFill = useCallback((value) => {
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["additionalNotes"]: value, // Section ID
    }));
  }, []);

  // Create maps using section IDs (what data?.id will be)
  const onChangeMap = useMemo(
    () => ({
      operativeFindings: handleOperativeFindingsOnChange,
      procedures: handleOperativeProcedureOnChange, // Section ID
      additionalNotes: handleOperativeAdditionalOnChange, // Section ID
    }),
    [
      handleOperativeFindingsOnChange,
      handleOperativeProcedureOnChange,
      handleOperativeAdditionalOnChange,
    ]
  );

  const onEraseMap = useMemo(
    () => ({
      operativeFindings: handleOperativeFindingsOnErase,
      procedures: handleOperativeProcedureOnErase, // Section ID
      additionalNotes: handleOperativeAdditionalOnErase, // Section ID
    }),
    [
      handleOperativeFindingsOnErase,
      handleOperativeProcedureOnErase,
      handleOperativeAdditionalOnErase,
    ]
  );

  const setAutoFillMap = useMemo(
    () => ({
      operativeFindings: handleSetOperativeFindingsAutoFill,
      procedures: handleSetOperativeProcedureAutoFill, // Section ID
      additionalNotes: handleSetOperativeAdditionalAutoFill, // Section ID
    }),
    [
      handleSetOperativeFindingsAutoFill,
      handleSetOperativeProcedureAutoFill,
      handleSetOperativeAdditionalAutoFill,
    ]
  );

  const initialValueMap = useMemo(
    () => ({
      operativeFindings: operativeFindingsValue,
      procedures: operativeProcedureValue, // Section ID
      additionalNotes: operativeAdditionalValue, // Section ID
    }),
    [operativeFindingsValue, operativeProcedureValue, operativeAdditionalValue]
  );

  const renderRichTextEditorSection = (data) => {
    const sectionId = data?.id;
    const reduxKey = getReduxKey(sectionId);
    
    if (!isEditable && isEmptyRichText(operativeNotes?.[reduxKey])) return null;
    const templateHandlers = templateMap[sectionId];
    
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={isEditable ? otNotesIcons[sectionId] : null}
        showAutoFill={false}
        onErase={onEraseMap[sectionId]}
        newAutoFillTextToAppend={autoFillTextToAppend[sectionId]}
        setNewAutoFillTextToAppend={setAutoFillMap[sectionId]}
        containerClass={`wrapper-class ${
          !isEditable ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin" : ""
        }`}
        showVoiceAI={isEditable && patientId && admissionId}
        showMicrophone={true}
        voiceAiIcon={defaultAssetIcons.voiceAiIcon}
        onVoiceAIRecordingComplete={getVoiceHandler(sectionId)}
        templates={templateHandlers?.templates}
        templateType={templateHandlers ? "entries" : undefined}
        showTempButtons={isEditable && !!templateHandlers}
        onTemplate={templateHandlers?.refreshTemplates}
        onTemplateSelected={templateHandlers?.handleTemplateSelected}
        addTemplate={templateHandlers?.handleAddTemplate}
        updateTemplate={templateHandlers?.handleUpdateTemplate}
        onDeleteTemplateClicked={templateHandlers?.handleDeleteTemplate}
        loading={templateHandlers?.templatesLoading}
        onChange={onChangeMap[sectionId]}
        initialValue={initialValueMap[sectionId] || getFieldValue(sectionId)}
        placeholder={data?.placeholder}
        onSave={() => {}}
      />
    );
  };
  const renderChildren = () => {
    if (!isEditable)
      return (
        <ul>
          {sectionData?.children?.map((item) => {
            const reduxKey = getReduxKey(item?.id);
            if (!isEditable && isEmptyRichText(operativeNotes?.[reduxKey])) return null;
            return (
              <li key={item.id}>
                {renderRichTextEditorSection(item)}
              </li>
            )
          })}
        </ul>
      )
    return sectionData?.children?.map((item) => {
      return renderRichTextEditorSection(item);
    });
  };
  if (!sectionData) return null;
  if (!isEditable && hasNoData(operativeNotes)) {
    return null;
  }
  return (
    <div>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? otNotesIcons[`${sectionData?.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly ipdot-ion-readonly readonly-container-box"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </div>
  );
};

export default OperativeNotes;
