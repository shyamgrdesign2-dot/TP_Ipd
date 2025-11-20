import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  const onExaminationRadioChange = useCallback((e, item) => {
    const { id } = item; 
    dispatch(
      setPhysicalExaminationBasicData({
        ...physicalExaminationBasicData,
        [id]: {
          ...physicalExaminationBasicData[id],
          value: e.target.value,
          title: item.options.find((option) => option.value === e.target.value)
            ?.label,
        },
      })
    );
  }, [dispatch, physicalExaminationBasicData]);

  const handleExaminationNotesChange = useCallback((data, id) => {
    dispatch(
      setPhysicalExaminationBasicData({
        ...physicalExaminationBasicData,
        [id]: { ...physicalExaminationBasicData[id], notes: data },
      })
    );
  }, [dispatch, physicalExaminationBasicData]);

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
          return {
            id: child.id,
            label: child.title,
            title: current.title || "",
            value:
              current.value === undefined || current.value === null
                ? 0
                : current.value,
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
        updated[item.id] = {
          title: item.title || "",
          value:
            item.value === undefined || item.value === null ? 0 : item.value,
          notes: normalizeNotes(item.notes),
        };
      });
      // Clear existing data before applying template
      dispatch(setPhysicalExaminationBasicData({}));
      dispatch(setPhysicalExaminationBasicData(updated));
    },
    [dispatch, normalizeNotes]
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
                showActionBtns={false}
                onErase={() => handleEraseDataFromRichTextEditor(item)}
                newAutoFillTextToAppend={autoFillTextToAppend[item?.id]}
                setNewAutoFillTextToAppend={(value) => {
                  setAutoFillTextToAppend((prev) => ({
                    ...prev,
                    [item?.id]: value,
                  }));
                }}
                toolbarClass={"small-toolbar"}
                showAutoFill={false}
                showMagicPenGif={false}
                disableFocusEffect={disableFocusEffect[item?.id]}
                showMicrophone={false}
                placeholder={"Additional notes if any"}
                containerClass="wrapper-class examination-rich-container"
                onChange={(data) => handleExaminationNotesChange(data, item.id)}
                initialValue={
                  physicalExaminationBasicData[item.id]?.notes?.length
                    ? physicalExaminationBasicData[item.id]?.notes
                    : [
                        {
                          type: "paragraph",
                          children: [{ text: "" }],
                        },
                      ]
                }
              >
                <div
                  className="examination-container-header"
                  data-testid={`examination-radio-${item.id}`}
                >
                  <div className="examination-header">{item.title} : </div>
                  <Radio.Group
                    className="exam-radio-text"
                    onChange={(e) => onExaminationRadioChange(e, item)}
                    value={physicalExaminationBasicData[item.id]?.value}
                    options={item.options}
                  />
                </div>
              </RichTextEditWrapper>
            );
          })}
      </div>
    );
  }, [physicalExaminationBasicData, sectionData, isEditable, autoFillTextToAppend, disableFocusEffect, handleExaminationNotesChange, onExaminationRadioChange]);

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
      // showOnlyClear={isEditable}
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
      showTempButtons={isEditable}
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
