import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setIntraOperativeNotes } from "../../../redux/ipd/otNotesSlice";
import "./styles.scss";
import { isEmptyRichText, hasNoData } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
import { voiceRx } from "../../../redux/ipd/ipdSlice";
import { defaultIcons as defaultAssetIcons } from "../../../assets/images/icons";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const UnitInput = createRemoteComponent("UnitInput");

export const MetricsList = ({ sectionData, data }) => {
  return (
    <div className="ipdot-ion-metrics-container">
      <div className="ipdot-ion-metrics-title">{"Metrics"}</div>
      <ul className="ipdot-ion-metrics-list">
        {sectionData?.map((section) => {
          return (
            <>
              {data?.[section.id] ? (
                <li>
                  <span className="ipdot-ion-metrics-list-label">
                    {section.title}
                  </span>{" "}
                  :{" "}
                  <span className="ipdot-ion-metrics-list-value">
                    {data?.[section.id]}
                  </span>
                </li>
              ) : null}
            </>
          );
        })}
      </ul>
    </div>
  );
};

const IntraOperativeNotes = (props) => {
  const { isEditable = true, sectionData, patientDetails = {} } = props || {};
  let { intraOperativeNotes = {} } = useSelector((state) => state.otNotes);
  intraOperativeNotes = props?.intraOperativeNotes || intraOperativeNotes;
  const { profile } = useSelector((state) => state.doctors);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const doctorId =
    patientDetails?.doctor?.id || profile?.id || profile?.um_id || null;
  const patientId = patientDetails?.details?.id || null;
  const admissionId = patientDetails?.admissionId || null;
  const handleChange = useCallback((value, key, parentId = null) => {
    if (!isEditable) return;
    dispatch(setIntraOperativeNotes({ key, value, parentId }));
  }, [dispatch, isEditable]);
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
  // Section IDs: complicationsSeverity, specimensSent, implantsUsed
  // Redux Keys: complicationsSeverity, specimensSent, implantsUsed
  // Note: Section IDs and Redux keys are the same for all fields
  const getReduxKey = useCallback((sectionId) => {
    const mapping = {
      complicationsSeverity: "complicationsSeverity", // Section ID = Redux key
      specimensSent: "specimensSent", // Section ID = Redux key
      implantsUsed: "implantsUsed", // Section ID = Redux key
    };
    return mapping[sectionId] || sectionId;
  }, []);

  // Helper to get field value by section ID (converts to Redux key)
  const getFieldValueByKey = useCallback(
    (sectionId) => {
      const reduxKey = getReduxKey(sectionId);
      // Redux stores as: intraOperativeNotes[reduxKey] = { value: [...] }
      const reduxEntry = props.intraOperativeNotes?.[reduxKey] ?? intraOperativeNotes?.[reduxKey];
      
      // Check if it's stored as a direct array (legacy format)
      if (Array.isArray(reduxEntry) && reduxEntry.length) {
        return reduxEntry;
      }
      
      // Check if it's stored as { value: [...] }
      if (reduxEntry?.value && Array.isArray(reduxEntry.value) && reduxEntry.value.length) {
        return reduxEntry.value;
      }
      
      return defaultRichText;
    },
    [intraOperativeNotes, props.intraOperativeNotes, defaultRichText, getReduxKey]
  );

  // Memoize field values to prevent infinite loops - use section IDs
  const complicationSeverityValue = useMemo(
    () => getFieldValueByKey("complicationsSeverity"), // Section ID
    [getFieldValueByKey]
  );
  const specimensSentValue = useMemo(
    () => getFieldValueByKey("specimensSent"), // Section ID
    [getFieldValueByKey]
  );
  const implantsProstheticsUsedValue = useMemo(
    () => getFieldValueByKey("implantsUsed"), // Section ID
    [getFieldValueByKey]
  );

  // Use ref to store the latest handleChange to prevent callback recreation
  const handleChangeRef = useRef(handleChange);
  useEffect(() => {
    handleChangeRef.current = handleChange;
  }, [handleChange]);

  // Stable callbacks for template management - use Redux keys for dispatch
  const handleComplicationSeverityChange = useCallback(
    (data) => {
      handleChange(data, "complicationsSeverity"); // Redux key
    },
    [handleChange]
  );

  const handleSpecimensSentChange = useCallback(
    (data) => {
      handleChange(data, "specimensSent"); // Redux key
    },
    [handleChange]
  );

  const handleImplantsProstheticsUsedChange = useCallback(
    (data) => {
      handleChange(data, "implantsUsed"); // Redux key
    },
    [handleChange]
  );

  const getComplicationSeverityValue = useCallback(
    () => complicationSeverityValue,
    [complicationSeverityValue]
  );

  const getSpecimensSentValue = useCallback(
    () => specimensSentValue,
    [specimensSentValue]
  );

  const getImplantsProstheticsUsedValue = useCallback(
    () => implantsProstheticsUsedValue,
    [implantsProstheticsUsedValue]
  );

  const useIntraTemplate = (moduleName, key, getCurrentValueFn, onValueChangeFn) =>
    useTemplateManagement({
      moduleName,
      templateSite: "ipd",
      doctorId,
      isEditable,
      moduleType: "richText",
      getCurrentValue: getCurrentValueFn,
      onValueChange: onValueChangeFn,
    });

  const complicationTemplate = useIntraTemplate(
    "complicationsSeverity",
    "complicationsSeverity",
    getComplicationSeverityValue,
    handleComplicationSeverityChange
  );
  const specimensTemplate = useIntraTemplate(
    "specimensSent",
    "specimensSent",
    getSpecimensSentValue,
    handleSpecimensSentChange
  );
  const implantsTemplate = useIntraTemplate(
    "implantsUsed",
    "implantsUsed",
    getImplantsProstheticsUsedValue,
    handleImplantsProstheticsUsedChange
  );

  // Map using section IDs (what data?.id will be)
  const templateMap = useMemo(
    () => ({
      complicationsSeverity: complicationTemplate, // Section ID
      specimensSent: specimensTemplate, // Section ID
      implantsUsed: implantsTemplate, // Section ID
    }),
    [complicationTemplate, specimensTemplate, implantsTemplate]
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
            schemaKey: `OT_NOTES.intraOperativeNotes.${reduxKey}`,
            audioFile: payload?.audioBlob,
            filename: payload?.filename,
            mimeType: payload?.mimeType,
            previousOutput: getFieldValueByKey(sectionId),
          })
        );

        if (response.meta.requestStatus === "fulfilled") {
          let updatedData =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.response?.[
              reduxKey
            ] || [];
          if (isEmptyRichText(updatedData)) {
            const transcription =
              response?.payload?.data?.rxDigitizationHistory?.[0]?.payload
                ?.transcription;
            if (transcription) {
              updatedData = [
                {
                  type: "paragraph",
                  children: [{ text: transcription }],
                },
              ];
            }
          }
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
      getFieldValueByKey,
      getReduxKey,
      handleChange,
      patientId,
    ]
  );

  // Memoize onChange callbacks for each field - map section IDs to Redux keys
  // Use ref to avoid dependency on handleChange
  const handleComplicationSeverityOnChange = useCallback(
    (val) => handleChangeRef.current(val, "complicationsSeverity"), // Redux key
    [] // Empty deps - use ref to get latest handleChange
  );
  const handleSpecimensSentOnChange = useCallback(
    (val) => handleChangeRef.current(val, "specimensSent"), // Redux key
    []
  );
  const handleImplantsProstheticsUsedOnChange = useCallback(
    (val) => handleChangeRef.current(val, "implantsUsed"), // Redux key
    []
  );

  // Memoize onErase callbacks - use Redux keys for dispatch, section IDs for state keys
  const handleComplicationSeverityOnErase = useCallback(() => {
    handleChangeRef.current(defaultRichText, "complicationsSeverity"); // Redux key
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["complicationsSeverity"]: ["clear"], // Section ID for state key
    }));
  }, [defaultRichText]);

  const handleSpecimensSentOnErase = useCallback(() => {
    handleChangeRef.current(defaultRichText, "specimensSent"); // Redux key
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["specimensSent"]: ["clear"], // Section ID for state key
    }));
  }, [defaultRichText]);

  const handleImplantsProstheticsUsedOnErase = useCallback(() => {
    handleChangeRef.current(defaultRichText, "implantsUsed"); // Redux key - corrected
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["implantsUsed"]: ["clear"], // Section ID for state key
    }));
  }, [defaultRichText]);

  // Memoize setAutoFillTextToAppend callbacks - use section IDs for state keys
  const handleSetComplicationSeverityAutoFill = useCallback((value) => {
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["complicationsSeverity"]: value, // Section ID
    }));
  }, []);

  const handleSetSpecimensSentAutoFill = useCallback((value) => {
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["specimensSent"]: value, // Section ID
    }));
  }, []);

  const handleSetImplantsProstheticsUsedAutoFill = useCallback((value) => {
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      ["implantsUsed"]: value, // Section ID
    }));
  }, []);

  // Create maps using section IDs (what data?.id will be)
  const onChangeMap = useMemo(
    () => ({
      complicationsSeverity: handleComplicationSeverityOnChange, // Section ID
      specimensSent: handleSpecimensSentOnChange, // Section ID
      implantsUsed: handleImplantsProstheticsUsedOnChange, // Section ID
    }),
    [
      handleComplicationSeverityOnChange,
      handleSpecimensSentOnChange,
      handleImplantsProstheticsUsedOnChange,
    ]
  );

  const onEraseMap = useMemo(
    () => ({
      complicationsSeverity: handleComplicationSeverityOnErase, // Section ID
      specimensSent: handleSpecimensSentOnErase, // Section ID
      implantsUsed: handleImplantsProstheticsUsedOnErase, // Section ID
    }),
    [
      handleComplicationSeverityOnErase,
      handleSpecimensSentOnErase,
      handleImplantsProstheticsUsedOnErase,
    ]
  );

  const setAutoFillMap = useMemo(
    () => ({
      complicationsSeverity: handleSetComplicationSeverityAutoFill, // Section ID
      specimensSent: handleSetSpecimensSentAutoFill, // Section ID
      implantsUsed: handleSetImplantsProstheticsUsedAutoFill, // Section ID
    }),
    [
      handleSetComplicationSeverityAutoFill,
      handleSetSpecimensSentAutoFill,
      handleSetImplantsProstheticsUsedAutoFill,
    ]
  );

  const initialValueMap = useMemo(
    () => ({
      complicationsSeverity: complicationSeverityValue, // Section ID
      specimensSent: specimensSentValue, // Section ID
      implantsUsed: implantsProstheticsUsedValue, // Section ID
    }),
    [complicationSeverityValue, specimensSentValue, implantsProstheticsUsedValue]
  );

  const renderRichTextEditorSection = (data) => {
    const sectionId = data?.id;
    const reduxKey = getReduxKey(sectionId);
    
    // Check empty state - Redux stores as { value: [...] }
    const reduxEntry = intraOperativeNotes?.[reduxKey];
    const fieldValue = Array.isArray(reduxEntry) ? reduxEntry : reduxEntry?.value;
    if (!isEditable && isEmptyRichText(fieldValue))
      return null;
    
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
        containerClass={`wrapper-class ${
          !isEditable
            ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin"
            : ""
        }`}
        onErase={onEraseMap[sectionId]}
        newAutoFillTextToAppend={autoFillTextToAppend[sectionId]}
        setNewAutoFillTextToAppend={setAutoFillMap[sectionId]}
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
        initialValue={initialValueMap[sectionId] || getFieldValueByKey(sectionId)}
        onSave={() => {}}
        placeholder={data?.placeholder}
      />
    );
  };

  const renderEditableMetrics = (item, enabledChildItems) => {
    return (
      <div className="ipd-ot-notes-section-container">
        {item?.title && (
          <div className="ipd-ot-notes-section-title">{item?.title}</div>
        )}
        <div className="ipd-ot-notes-section-children-container">
          {enabledChildItems?.map((subItem) => {
            return (
              <div
                className="ipd-ot-notes-section-children-item"
                key={subItem.id}
              >
                <UnitInput
                  key={subItem.id}
                  containerStyle={{ marginBottom: "20px" }}
                  onChange={(e) => handleChange(e, subItem.id, item.id)}
                  value={intraOperativeNotes?.[item.id]?.[subItem.id]}
                  type="text"
                  inputMode="text"
                  label={subItem.label}
                  unit={subItem?.unit || null}
                  {...subItem}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const renderChildren = () => {
    const enabledItems = sectionData?.children?.filter((item) => item.enabled);
    if (!isEditable) {
      return (
        <ul>
          {enabledItems?.map((item) => {
            if (item?.children) {
              const enabledChildItems = item?.children?.filter(
                (item) => item.enabled
              );
              if (
                enabledChildItems?.length > 0 &&
                enabledChildItems?.some((item) => {
                  const reduxKey = getReduxKey(item.id);
                  const reduxEntry = intraOperativeNotes?.[reduxKey];
                  const fieldValue = Array.isArray(reduxEntry) ? reduxEntry : reduxEntry?.value;
                  return item.id && !!fieldValue;
                })
              ) {
                return (
                  <li key={item.id}>
                    <MetricsList
                      sectionData={enabledChildItems}
                      data={intraOperativeNotes}
                    />
                  </li>
                );
              }
            }
            const reduxKey = getReduxKey(item?.id);
            const reduxEntry = intraOperativeNotes?.[reduxKey];
            const fieldValue = Array.isArray(reduxEntry) ? reduxEntry : reduxEntry?.value;
            if (!isEditable && isEmptyRichText(fieldValue))
              return null;
            return <li key={item.id}>{renderRichTextEditorSection(item)}</li>;
          })}
        </ul>
      );
    }
    return enabledItems?.map((item) => {
      if (item?.children) {
        const enabledChildItems = item?.children?.filter(
          (item) => item.enabled
        );
        if (enabledChildItems?.length > 0) {
          return renderEditableMetrics(item, enabledChildItems);
        }
      }
      return renderRichTextEditorSection(item);
    });
  };
  if (!sectionData) return null;
  if (!isEditable && hasNoData(intraOperativeNotes)) {
    return null;
  }
  return (
    <div>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? otNotesIcons[`${sectionData.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable
            ? ""
            : "collapsible-wrapper-class-readonly ipdot-ion-readonly readonly-container-box"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </div>
  );
};

export default IntraOperativeNotes;
