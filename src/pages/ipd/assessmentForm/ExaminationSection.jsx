import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { Radio, message } from "antd";
import { defaultIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setPhysicalExaminationBasicData } from "../../../redux/ipd/assessmentsFormSlice";
import useCheckExaminationData from "../../../hooks/useCheckExaminationData";
import { isEmptyRichText } from "../../../components/PDFGenerator";
import {
  deleteTemplate as deleteTemplateThunk,
  getTemplatesByModuleName,
  makeSelectTemplatesByModule,
  selectTemplatesLoading,
  updateTemplate as updateTemplateThunk,
} from "../../../redux/ipd/tempaltesSlice";
import { voiceRx } from "../../../redux/ipd/ipdSlice";
import { defaultIcons as defaultAssetIcons } from "../../../assets/images/icons";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const RichTextEditor = createRemoteComponent("RichTextEditor");
const ExaminationSection = (props) => {
  const {
    isEditable = true,
    sectionData,
    isDischargeSummary = false,
    isConsultantNotes = false,
    patientDetails = {},
  } = props || {};
  const physicalExaminationBasicData = useSelector(
    (state) => state.assessment.physicalExaminationBasicData || {}
  );
  const dispatch = useDispatch();
  const checkExaminationDataPresent =
    useCheckExaminationData(physicalExaminationBasicData);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [disableFocusEffect, setDisableFocusEffect] = useState({});
  const templateModuleName = "generalExamination";
  const templateSite = "ipd";
  const doctorId = patientDetails?.doctor?.id || null;
  const patientId = patientDetails?.details?.id;
  const admissionId = patientDetails?.admissionId;
  const templateSelector = useMemo(
    () => makeSelectTemplatesByModule(templateModuleName),
    [templateModuleName]
  );
  const templates = useSelector(templateSelector);
  const templatesLoading = useSelector(selectTemplatesLoading);
  const defaultNotes = useMemo(
    () => [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    []
  );
  // Helper function to normalize value to match option value type
  const normalizeRadioValue = useCallback((value, options) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (!options || !Array.isArray(options) || options.length === 0) {
      return value;
    }
    // Get the type of the first option's value
    const firstOptionValue = options[0]?.value;
    if (firstOptionValue === undefined || firstOptionValue === null) {
      return value;
    }
    const optionValueType = typeof firstOptionValue;
    // Convert value to match option value type
    if (optionValueType === 'number') {
      const numValue = Number(value);
      return isNaN(numValue) ? undefined : numValue;
    } else if (optionValueType === 'string') {
      return String(value);
    }
    return value;
  }, []);

  // Use ref to store the latest physicalExaminationBasicData to prevent callback recreation
  const physicalExaminationBasicDataRef = useRef(physicalExaminationBasicData);
  useEffect(() => {
    physicalExaminationBasicDataRef.current = physicalExaminationBasicData;
  }, [physicalExaminationBasicData]);

  // Stable callback for radio change - uses ref to access latest state
  const onExaminationRadioChange = useCallback((e, item) => {
    const { id } = item;
    const normalizedValue = normalizeRadioValue(e.target.value, item.options);
    const currentState = physicalExaminationBasicDataRef.current;
    dispatch(
      setPhysicalExaminationBasicData({
        ...currentState,
        [id]: {
          ...currentState[id],
          value: normalizedValue,
          title: item.options.find((option) => option.value === normalizedValue)
            ?.label,
        },
      })
    );
  }, [dispatch, normalizeRadioValue]);

  // Stable callback for notes change - uses ref to access latest state
  const handleExaminationNotesChange = useCallback((data, id) => {
    const currentState = physicalExaminationBasicDataRef.current;
    dispatch(
      setPhysicalExaminationBasicData({
        ...currentState,
        [id]: { ...currentState[id], notes: data },
      })
    );
  }, [dispatch]);

  // Store stable callback in ref for use in map callbacks
  const handleExaminationNotesChangeRef = useRef(handleExaminationNotesChange);
  useEffect(() => {
    handleExaminationNotesChangeRef.current = handleExaminationNotesChange;
  }, [handleExaminationNotesChange]);

  const handleAIRecordingComplete = useCallback(
    async (itemId, payload, callback) => {
      if (!patientId || !admissionId) {
        callback?.();
        return;
      }
      const response = await dispatch(
        voiceRx({
          patientId,
          admissionId,
          schemaKey: `ASSESSMENTS.examination.${itemId}`,
          audioFile: payload?.audioBlob,
          filename: payload?.filename,
          mimeType: payload?.mimeType,
          previousOutput: physicalExaminationBasicData?.[itemId]?.notes,
        })
      );

      if (response.meta.requestStatus === "fulfilled") {
        const updatedData =
          response?.payload?.data?.rxDigitizationHistory?.[0]?.response || [];
        let updatedNotes = updatedData?.notes || [];
        if (isEmptyRichText(updatedNotes)) {
          const transcription =
            response?.payload?.data?.rxDigitizationHistory?.[0]?.payload
              ?.transcription;
          if (transcription) {
            updatedNotes = [
              {
                type: "paragraph",
                children: [{ text: transcription }],
              },
            ];
          }
        }
        if (!isEmptyRichText(updatedNotes)) {
          dispatch(
            setPhysicalExaminationBasicData({
              ...physicalExaminationBasicData,
              [itemId]: {
                ...physicalExaminationBasicData[itemId],
                notes: updatedNotes,
              },
            })
          );
        }
        callback?.();
      } else {
        callback?.();
      }
    },
    [admissionId, dispatch, patientId, physicalExaminationBasicData]
  );

  const renderReadOnlyExamination = () => {
    return (
      <div
        className={`ipdaf-examination-readonly ${
          false ? "box-with-padding" : ""
        }`}
      >
        <ul>
          {sectionData?.children
            ?.filter((item) => item.enabled)
            .map((item) => {
              const data = physicalExaminationBasicData[item.id];
              if (
                !data?.title &&
                ((data?.value === undefined || data?.value == null || data?.value === 0) &&
                  isEmptyRichText(data?.notes))
              )
                return null;

              return (
                <li key={item.id} className="examination-item">
                  <span className="examination-label">{item.title}:</span>{" "}
                  {data.title}
                  {!isEmptyRichText(data?.notes) && (
                    <div className="ipdaf-exam-read-notes-container">
                      <li className="ipdaf-exam-read-notes-heading">Notes:</li>
                      <RichTextEditor
                        showActionBtns={false}
                        showAutoFill={false}
                        showMagicPenGif={false}
                        showMicrophone={false}
                        showToolbar={false}
                        readOnly={true}
                        initialValue={data.notes}
                      />
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    );
  };

  const handleEraseDataFromRichTextEditor = (item) => {
    setDisableFocusEffect((prev) => ({
      ...prev,
      [item?.id]: true,
    }));
    setAutoFillTextToAppend((prev) => ({
      ...prev,
      [item?.id]: ["clear"],
    }));
    setTimeout(() => {
      setDisableFocusEffect((prev) => ({
        ...prev,
        [item?.id]: false,
      }));
    }, 100);
  };

  const serializeGeneralExaminationData = useCallback(() => {
    return (
      sectionData?.children
        ?.filter((child) => child.enabled)
        .map((child) => {
          const current = physicalExaminationBasicData[child.id] || {};
          const notes =
            Array.isArray(current.notes) && current.notes.length
              ? current.notes
              : defaultNotes;
          // Normalize value to match option type
          let normalizedValue = current.value;
          if (normalizedValue === undefined || normalizedValue === null) {
            normalizedValue = 0;
          } else if (child.options && Array.isArray(child.options) && child.options.length > 0) {
            const firstOptionValue = child.options[0]?.value;
            if (typeof firstOptionValue === 'number' && typeof normalizedValue !== 'number') {
              const numValue = Number(normalizedValue);
              normalizedValue = isNaN(numValue) ? 0 : numValue;
            }
          }
          return {
            id: child.id,
            label: child.title,
            title: current.title || "",
            value: normalizedValue,
            notes,
          };
        }) || []
    );
  }, [sectionData, physicalExaminationBasicData, defaultNotes]);

  const normalizeNotes = useCallback(
    (notes) => {
      if (Array.isArray(notes) && notes.length) {
        return notes;
      }
      return defaultNotes;
    },
    [defaultNotes]
  );

  const applyTemplateData = useCallback(
    (templateData) => {
      if (!Array.isArray(templateData) || !templateData.length) {
        message.warning("Template has no examination data.");
        return;
      }
      const updated = {};
      templateData.forEach((item) => {
        // Find the corresponding section item to get options for normalization
        const sectionItem = sectionData?.children?.find((child) => child.id === item.id);
        let normalizedValue = item.value;
        if (normalizedValue === undefined || normalizedValue === null) {
          normalizedValue = 0;
        } else if (sectionItem?.options && Array.isArray(sectionItem.options) && sectionItem.options.length > 0) {
          const firstOptionValue = sectionItem.options[0]?.value;
          if (typeof firstOptionValue === 'number' && typeof normalizedValue !== 'number') {
            const numValue = Number(normalizedValue);
            normalizedValue = isNaN(numValue) ? 0 : numValue;
          }
        }
        updated[item.id] = {
          title: item.title || "",
          value: normalizedValue,
          notes: normalizeNotes(item.notes),
        };
      });
      // Clear existing data before applying template
      dispatch(setPhysicalExaminationBasicData({}));
      dispatch(setPhysicalExaminationBasicData(updated));
    },
    [dispatch, normalizeNotes, sectionData]
  );

  const extractTemplateData = useCallback((template) => {
    if (!template) return [];
    const templateData = template.template || template;
    const candidates = [
      template.generalExamination,
      templateData.generalExamination,
      templateData.data,
      template.data,
    ];
    const found = candidates.find(
      (candidate) => Array.isArray(candidate) && candidate.length > 0
    );
    return found ? JSON.parse(JSON.stringify(found)) : [];
  }, []);

  const refreshTemplates = useCallback(() => {
    if (!isEditable) return;
    dispatch(
      getTemplatesByModuleName({
        moduleName: templateModuleName,
        site: templateSite,
        isMaster: false,
        doctorId,
      })
    );
  }, [dispatch, doctorId, isEditable, templateModuleName]);

  useEffect(() => {
    if (isEditable) {
      refreshTemplates();
    }
  }, [isEditable, refreshTemplates]);

  const getTemplateTitle = useCallback((template) => {
    if (!template) return "Untitled Template";
    const templateData = template.template || template;
    return (
      templateData.title ||
      template.title ||
      templateData.templateName ||
      template.templateName ||
      templateData.tst_template_name ||
      template.tst_template_name ||
      templateData.name ||
      template.name ||
      "Untitled Template"
    );
  }, []);

  const createPreviewEntries = useCallback((data = []) => {
    if (!Array.isArray(data) || !data.length) {
      return [
        {
          type: "paragraph",
          children: [{ text: "General examination template" }],
        },
      ];
    }
    return data.map((item) => ({
      type: "paragraph",
      children: [
        {
          text: `${item?.label || item?.id}: ${item?.title || ""}`,
        },
      ],
    }));
  }, []);

  const normalizeTemplatesForList = useCallback(
    (moduleTemplates) => {
      return (moduleTemplates || []).map((template) => {
        const title = getTemplateTitle(template);
        const data = extractTemplateData(template);
        const id = template?._id || template?.id;
        return {
          _id: id,
          id,
          title,
          templateName: title,
          generalExamination: data,
          entries: createPreviewEntries(data),
          module: template?.module,
          site: template?.site,
          isMaster: template?.isMaster,
        };
      });
    },
    [createPreviewEntries, extractTemplateData, getTemplateTitle]
  );

  const normalizedTemplates = useMemo(
    () => normalizeTemplatesForList(templates),
    [templates, normalizeTemplatesForList]
  );

  const extractTemplatePayload = useCallback(
    (payload) => {
      const templateData = payload?.template || payload;
      const title =
        templateData?.title ||
        payload?.title ||
        templateData?.templateName ||
        payload?.templateName ||
        templateData?.tst_template_name ||
        payload?.tst_template_name ||
        templateData?.name ||
        payload?.name ||
        "Untitled Template";
      const dataCandidates = [
        templateData?.generalExamination,
        payload?.generalExamination,
        templateData?.data,
        payload?.data,
      ];
      const found = dataCandidates.find(
        (candidate) => Array.isArray(candidate) && candidate.length > 0
      );
      return {
        _id:
          templateData?._id ||
          templateData?.id ||
          payload?._id ||
          payload?.id,
        title: title?.trim?.() ? title.trim() : "Untitled Template",
        data: found || serializeGeneralExaminationData(),
      };
    },
    [serializeGeneralExaminationData]
  );

  const handleTemplateSelected = useCallback(
    (template) => {
      const data = extractTemplateData(template);
      applyTemplateData(data);
    },
    [applyTemplateData, extractTemplateData]
  );

  const handleAddTemplate = useCallback(
    async (templateData, callback) => {
      const { title, data } = extractTemplatePayload(templateData);
      const requestPayload = {
        module: templateModuleName,
        site: templateSite,
        isMaster: false,
        title,
        generalExamination: data,
        doctorId,
      };
      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template saved successfully.");
        refreshTemplates();
        callback?.();
      } else {
        message.error(
          action.payload || action.error?.message || "Failed to save template."
        );
      }
    },
    [dispatch, doctorId, extractTemplatePayload, refreshTemplates]
  );

  const handleUpdateTemplate = useCallback(
    async (templateData, callback) => {
      const { _id, title, data } = extractTemplatePayload(templateData);
      if (!_id) {
        message.warning("Template identifier not found for update.");
        return;
      }
      const requestPayload = {
        _id,
        module: templateModuleName,
        site: templateSite,
        isMaster: false,
        title,
        generalExamination: data,
        doctorId,
      };
      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template updated successfully.");
        refreshTemplates();
        callback?.();
      } else {
        message.error(
          action.payload ||
            action.error?.message ||
            "Failed to update template."
        );
      }
    },
    [dispatch, doctorId, extractTemplatePayload, refreshTemplates]
  );

  const handleDeleteTemplate = useCallback(
    async (templateIdentifier) => {
      const id =
        typeof templateIdentifier === "object"
          ? templateIdentifier?._id || templateIdentifier?.id
          : templateIdentifier;
      if (!id) {
        message.warning("Template identifier not found.");
        return;
      }
      const action = await dispatch(
        deleteTemplateThunk({
          _id: id,
          moduleName: templateModuleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
      if (deleteTemplateThunk.fulfilled.match(action)) {
        message.success("Template deleted.");
        refreshTemplates();
      } else {
        message.error(
          action.payload ||
            action.error?.message ||
            "Failed to delete template."
        );
      }
    },
    [dispatch, doctorId, refreshTemplates]
  );

  // Memoize initial values for each item to prevent new references on every render
  const itemInitialValues = useMemo(() => {
    const values = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        const notes = physicalExaminationBasicData[item.id]?.notes;
        values[item.id] =
          Array.isArray(notes) && notes.length
            ? notes
            : defaultNotes;
      });
    return values;
  }, [physicalExaminationBasicData, sectionData, defaultNotes]);

  // Stable onChange callbacks for each item
  const itemOnChangeCallbacks = useMemo(() => {
    const callbacks = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        callbacks[item.id] = (data) => {
          handleExaminationNotesChangeRef.current(data, item.id);
        };
      });
    return callbacks;
  }, [sectionData]);

  // Stable onErase callbacks for each item
  const itemOnEraseCallbacks = useMemo(() => {
    const callbacks = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        callbacks[item.id] = () => handleEraseDataFromRichTextEditor(item);
      });
    return callbacks;
  }, [sectionData]);

  // Stable setNewAutoFillTextToAppend callbacks for each item
  const itemSetAutoFillCallbacks = useMemo(() => {
    const callbacks = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        callbacks[item.id] = (value) => {
          setAutoFillTextToAppend((prev) => ({
            ...prev,
            [item?.id]: value,
          }));
        };
      });
    return callbacks;
  }, [sectionData]);

  // Memoize radio values for each item
  const itemRadioValues = useMemo(() => {
    const values = {};
    sectionData?.children
      ?.filter((item) => item.enabled)
      ?.forEach((item) => {
        values[item.id] = normalizeRadioValue(
          physicalExaminationBasicData[item.id]?.value,
          item.options
        );
      });
    return values;
  }, [physicalExaminationBasicData, sectionData, normalizeRadioValue]);

  const renderEditableExamination = useMemo(() => {
    return (
      <div className="examinations-parent-container">
        {sectionData?.children
          ?.filter((item) => item.enabled)
          .map((item) => {
            return (
              <RichTextEditWrapper
                key={item.id}
                readOnly={!isEditable}
                showToolbar={isEditable}
                showActionBtns={isEditable}
                onErase={itemOnEraseCallbacks[item.id]}
                newAutoFillTextToAppend={autoFillTextToAppend[item?.id]}
                setNewAutoFillTextToAppend={itemSetAutoFillCallbacks[item.id]}
                toolbarClass={"small-toolbar"}
                showAutoFill={false}
                disableFocusEffect={disableFocusEffect[item?.id]}
                showVoiceAI={isEditable && patientId && admissionId}
                showMicrophone={true}
                voiceAiIcon={defaultAssetIcons.voiceAiIcon}
                onVoiceAIRecordingComplete={(payload, callback) =>
                  handleAIRecordingComplete(item.id, payload, callback)
                }
                placeholder={"Additional notes if any"}
                containerClass="wrapper-class examination-rich-container"
                onChange={itemOnChangeCallbacks[item.id]}
                initialValue={itemInitialValues[item.id]}
                size={"small"}
              >
                <div
                  className="examination-container-header"
                  data-testid={`examination-radio-${item.id}`}
                >
                  <div className="examination-header">{item.title} : </div>
                  <Radio.Group
                    className="exam-radio-text"
                    onChange={(e) => onExaminationRadioChange(e, item)}
                    value={itemRadioValues[item.id]}
                    options={item.options}
                  />
                </div>
              </RichTextEditWrapper>
            );
          })}
      </div>
    );
  }, [
    sectionData,
    isEditable,
    autoFillTextToAppend,
    disableFocusEffect,
    itemOnChangeCallbacks,
    itemOnEraseCallbacks,
    itemSetAutoFillCallbacks,
    itemInitialValues,
    itemRadioValues,
    onExaminationRadioChange,
    handleAIRecordingComplete,
    patientId,
    admissionId,
  ]);

  const renderExaminationSection = () => {
    return isEditable
      ? renderEditableExamination
      : renderReadOnlyExamination();
  };

  if (!isEditable && !checkExaminationDataPresent) return null;
  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      showOnlyClear={isEditable}
      isDataPresent={Object.keys(physicalExaminationBasicData)?.length}
      onErase={(e) => {
        dispatch(setPhysicalExaminationBasicData({}));
        sectionData?.children
          ?.filter((item) => item.enabled)
          ?.forEach((item) => {
            handleEraseDataFromRichTextEditor(item);
          });
      }}
      title={sectionData?.title}
      data-testid={sectionData?.id}
      width="100%"
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      showAutoFill={false}
      showMagicPenGif={false}
      showMicrophone={false}
      placeholder={"Additional notes if any"}
      showTempButtons={false}
      templates={normalizedTemplates}
      templateType="generalExamination"
      onTemplate={refreshTemplates}
      onTemplateSelected={handleTemplateSelected}
      addTemplate={handleAddTemplate}
      updateTemplate={handleUpdateTemplate}
      onDeleteTemplateClicked={handleDeleteTemplate}
      loading={templatesLoading}
      data={serializeGeneralExaminationData()}
      onSave={() => {}}
      containerClass={`examination-rich-container ${
        !isEditable ? "examination-rich-readonly-container" : ""
      } ${isConsultantNotes && !isEditable ? "consultant-notes-examination-container" : ""}`}
      renderBody={renderExaminationSection}
    />
  );
};

export default ExaminationSection;
