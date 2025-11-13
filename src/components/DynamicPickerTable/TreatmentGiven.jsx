import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { message, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createRemoteComponent } from "../../shared/remoteComponents";
import DynamicPickerTable from "./DynamicPickerTable";
import { searchMedication, searchGeneric } from "../../redux/medicationSlice";
import {
  addTreatmentNote,
  updateTreatmentNote,
  removeTreatmentNote,
  setTreatmentNotes,
} from "../../redux/ipd/dischargeSummarySlice";
import {
  formatDateToShortMonthYear,
  getModuleCode,
  removeBeforeWhiteSpace,
  replaceCommasAndSemicolons,
} from "../../utils/utils";
import { useLocation } from "react-router-dom";
import { dischargeSummaryIcons } from "../../assets/images/indices";
import "./styles.scss";
import { greenTick } from "../../assets/images/dischargeSummaryIcons";
import {
  deleteTemplate as deleteTemplateThunk,
  getTemplatesByModuleName,
  makeSelectTemplatesByModule,
  selectTemplatesLoading,
  updateTemplate as updateTemplateThunk,
} from "../../redux/ipd/tempaltesSlice";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const TreatmentGiven = ({ sectionData }) => {
  const { state } = useLocation();
  const { isEditable = true } = state || {};
  const tableRef = useRef();
  const dispatch = useDispatch();
  const DISPATCH_DEBOUNCE_MS = 250;
  const changeTimersRef = useRef({});
  const {
    treatmentNotes,
    treatmentNotesLoading,
    actualDischargeSummaryData,
    dischargeSummaryData,
  } = useSelector((state) => state.dischargeSummary);

  const templateSite = "ipd";
  const moduleName = "treatmentGiven";

  const templatesLoading = useSelector(selectTemplatesLoading);
  const treatmentTemplatesSelector = useMemo(
    () => makeSelectTemplatesByModule(moduleName),
    [moduleName]
  );
  const treatmentTemplates = useSelector(treatmentTemplatesSelector);

  const doctorId =
    dischargeSummaryData?.patientInformation?.primaryConsultant?.id || null;

  const filteredTreatmentNotes = useMemo(() => {
    if (!treatmentNotes) return [];

    return treatmentNotes.filter((record) => {
      const isOTNote =
        record.module === "OT Note" || record.module === "OT Notes";
      // const isSurgeryDetails = record.subModule === "Surgery Details";

      return !(
        isOTNote
        //  && isSurgeryDetails
      );
    });
  }, [treatmentNotes]);

  const ensureKeys = useCallback((items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item, index) => {
      if (item?.key) return item;
      const fallbackKey =
        item?.id ||
        item?.name ||
        item?.tmm_id ||
        `${item?.module || "row"}-${index}`;
      return { ...item, key: `${fallbackKey}-${index}` };
    });
  }, []);

  useEffect(() => {
    if (treatmentNotes?.length) {
      const needsKeys = treatmentNotes.some((t) => !t?.key);
      if (needsKeys) {
        const withKeys = treatmentNotes.map((t, i) =>
          t?.key ? t : { ...t, key: `${t?.id ?? t?.name ?? "row"}-${i}` }
        );
        dispatch(setTreatmentNotes(withKeys));
      }
    }
  }, [treatmentNotes, dispatch]);

  const getCurrentValue = useCallback(
    () => ensureKeys(filteredTreatmentNotes),
    [filteredTreatmentNotes, ensureKeys]
  );

  const extractArrayData = useCallback(
    (template) => {
      if (!template) return [];
      const candidates = [
        template.template?.[moduleName],
        template[moduleName],
        template.template?.data,
        template.data,
        template.entries,
        template.template?.entries,
        template.items,
        template.template?.items,
      ];
      const found = candidates.find(
        (candidate) => Array.isArray(candidate) && candidate.length > 0
      );
      return found && Array.isArray(found)
        ? ensureKeys(JSON.parse(JSON.stringify(found)))
        : [];
    },
    [moduleName, ensureKeys]
  );

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
      templateData.tat_template_name ||
      template.tat_template_name ||
      templateData.name ||
      template.name ||
      "Untitled Template"
    );
  }, []);

  const refreshTreatmentTemplates = useCallback(() => {
    dispatch(
      getTemplatesByModuleName({
        moduleName,
        site: templateSite,
        isMaster: false,
        doctorId,
      })
    );
  }, [dispatch, moduleName, templateSite, doctorId]);

  const handleTemplateSelected = useCallback(
    (template) => {
      try {
        const templateData = extractArrayData(template);
        const currentData = getCurrentValue();
        
        // Helper function to check if two treatment notes are duplicates
        const isDuplicate = (existing, newItem) => {
          // Check by id (most reliable)
          if (existing.id && newItem.id && existing.id === newItem.id) {
            return true;
          }
          // // Check by tmm_id (medication ID)
          // if (existing.tmm_id && newItem.tmm_id && existing.tmm_id === newItem.tmm_id) {
          //   return true;
          // }
          // // Check by name (case-insensitive)
          // if (existing.name && newItem.name && 
          //     existing.name.trim().toLowerCase() === newItem.name.trim().toLowerCase()) {
          //   return true;
          // }
          // // Check by key if both have keys
          // if (existing.key && newItem.key && existing.key === newItem.key) {
          //   return true;
          // }
          return false;
        };
        
        // Filter out duplicates from template data
        const newItems = templateData.filter((templateItem) => {
          return !currentData.some((existingItem) => 
            isDuplicate(existingItem, templateItem)
          );
        });
        
        // Merge: existing data + new non-duplicate items from template
        const mergedData = [...currentData, ...newItems];
        
        // Ensure all items have keys
        const dataWithKeys = ensureKeys(mergedData);
        
        dispatch(setTreatmentNotes(dataWithKeys));
        
        if (newItems.length < templateData.length) {
          const duplicateCount = templateData.length - newItems.length;
          message.info(
            `${duplicateCount} duplicate treatment${duplicateCount > 1 ? 's' : ''} skipped.`
          );
        }
      } catch (error) {
        console.error("Error applying treatment template:", error);
        message.error("Failed to apply template.");
      }
    },
    [dispatch, extractArrayData, ensureKeys, getCurrentValue]
  );

  const extractTemplatePayload = useCallback(
    (payload) => {
      const title =
        payload?.title ||
        payload?.templateName ||
        payload?.tst_template_name ||
        payload?.tat_template_name ||
        payload?.name ||
        "Untitled Template";
      const currentValue = getCurrentValue();
      const data =
        payload?.data ||
        payload?.[moduleName] ||
        payload?.entries ||
        currentValue;
      const normalizedData =
        Array.isArray(data) && data.length ? ensureKeys(data) : currentValue;
      return {
        _id: payload?._id || payload?.id,
        title: title?.trim?.() ? title.trim() : "Untitled Template",
        data: normalizedData,
      };
    },
    [getCurrentValue, moduleName, ensureKeys]
  );

  const handleAddTemplate = useCallback(
    async (templateData, callback) => {
      const { title, data } = extractTemplatePayload(templateData);
      const requestPayload = {
        module: moduleName,
        site: templateSite,
        isMaster: false,
        title,
        [moduleName]: data,
        doctorId,
      };

      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template saved successfully.");
        refreshTreatmentTemplates();
        callback?.();
      } else {
        message.error(
          action.payload || action.error?.message || "Failed to save template."
        );
      }
    },
    [
      dispatch,
      extractTemplatePayload,
      moduleName,
      templateSite,
      doctorId,
      refreshTreatmentTemplates,
    ]
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
        module: moduleName,
        site: templateSite,
        isMaster: false,
        title,
        [moduleName]: data,
        doctorId,
      };
      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template updated successfully.");
        refreshTreatmentTemplates();
        callback?.();
      } else {
        message.error(
          action.payload ||
            action.error?.message ||
            "Failed to update template."
        );
      }
    },
    [
      dispatch,
      extractTemplatePayload,
      moduleName,
      templateSite,
      doctorId,
      refreshTreatmentTemplates,
    ]
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
          moduleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
      if (deleteTemplateThunk.fulfilled.match(action)) {
        message.success("Template deleted.");
        refreshTreatmentTemplates();
      } else {
        message.error(
          action.payload ||
            action.error?.message ||
            "Failed to delete template."
        );
      }
    },
    [dispatch, moduleName, templateSite, doctorId, refreshTreatmentTemplates]
  );

  const normalizeTreatmentTemplates = useCallback(
    (moduleTemplates) => {
      return (moduleTemplates || []).map((template) => {
        const title = getTemplateTitle(template);
        const data = extractArrayData(template);
        const id = template?._id || template?.id;
        return {
          _id: id,
          id,
          title,
          templateName: title,
          tst_template_name: template?.tst_template_name || title,
          tat_template_name: template?.tat_template_name || title,
          [moduleName]: data,
          entries: data,
          module: template?.module,
          site: template?.site,
          isMaster: template?.isMaster,
        };
      });
    },
    [extractArrayData, getTemplateTitle, moduleName]
  );

  const normalizedTreatmentTemplates = useMemo(
    () => normalizeTreatmentTemplates(treatmentTemplates),
    [treatmentTemplates, normalizeTreatmentTemplates]
  );

  useEffect(() => {
    if (isEditable) {
      refreshTreatmentTemplates();
    }
  }, [isEditable, refreshTreatmentTemplates]);

  const handleSearch = async (query) => {
    if (!query) return [];

    try {
      const medicationAction = await dispatch(
        searchMedication({
          searchQuery: removeBeforeWhiteSpace(query),
          type: "parent",
        })
      );

      const genericAction = await dispatch(
        searchGeneric(replaceCommasAndSemicolons(removeBeforeWhiteSpace(query)))
      );

      const medicationResults = medicationAction.payload || [];
      const genericResults = genericAction.payload || [];

      const formattedResults = [
        ...medicationResults.map((med) => ({
          id: med.tmm_id,
          name: med.tmm_medicine_name,
          code: "DS",
          type: med.tmm_type || "Medication",
          strength: med.tmm_strength || "",
          manufacturer: med.tmm_company || "",
        })),
        ...genericResults.map((gen) => ({
          id: `gen_${gen.id || Date.now()}`,
          name: gen.tmm_generic || gen.name,
          code: "CN",
          type: "Generic",
          strength: "",
          manufacturer: "",
        })),
      ];

      return formattedResults;
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };

  const ToolTipContent = (record) => {
    return (
      <div className="chrosum-tooltip-container">
        <div className="chrotol-source">
          <span>Source:</span>
          {record.module} - {record.subModule}
        </div>
        <div className="chrotol-source">
          <span>Date:</span>
          {record.givenDate}
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => {
        let code = getModuleCode(record.module);
        if (
          (record.module === "OT Note" || record.module === "OT Notes") &&
          record.subModule === "Surgery Details"
        ) {
          code = null;
        }
        return (
          <div className="medication-name-cell">
            <span className="medication-name">{text}</span>
            <Tooltip title={ToolTipContent(record)}>
              <span
                className={`badge badge-${
                  record.code?.toLowerCase() || "default"
                }`}
              >
                {code ? `[${code}]` : null}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "GIVEN DATE",
      dataIndex: "givenDate",
      key: "givenDate",
      type: "date",
      width: 160,
      placeholder: "Select date",
      dateProps: {
        format: "DD MMM YYYY",
        style: { width: "100%" },
      },
    },
    {
      title: "DURATION",
      dataIndex: "duration",
      key: "duration",
      type: "select",
      width: 120,
      placeholder: "Select duration",
      options: [
        { label: "1 day", value: "1 day" },
        { label: "3 days", value: "3 days" },
        { label: "5 days", value: "5 days" },
        { label: "7 days", value: "7 days" },
        { label: "10 days", value: "10 days" },
        { label: "14 days", value: "14 days" },
        { label: "21 days", value: "21 days" },
        { label: "30 days", value: "30 days" },
      ],
      selectProps: {
        style: { width: "100%" },
      },
    },
    {
      title: "NOTE",
      dataIndex: "notes",
      key: "notes",
      type: "input",
      placeholder: "Notes",
      inputProps: {
        style: { width: "100%" },
      },
    },
  ];

  const searchConfig = {
    valueField: "name",
    titleField: "name",
    subtitleField: "code",
    preventDuplicates: true,
    duplicateCheckField: "id",
    renderOption: (item) => (
      <div className="option-row">
        <span className="option-title">{item.name}</span>
      </div>
    ),
  };

  const handleRowChange = (row, field, value) => {
    const id = `${row.key}::${field}`;
    if (changeTimersRef.current[id]) {
      clearTimeout(changeTimersRef.current[id]);
    }

    changeTimersRef.current[id] = setTimeout(() => {
      dispatch(
        updateTreatmentNote({ key: row.key, updates: { [field]: value } })
      );
      delete changeTimersRef.current[id];
    }, DISPATCH_DEBOUNCE_MS);
  };

  const handleRowAdd = (row) => {
    dispatch(addTreatmentNote(row));
  };

  const handleRowDelete = (row) => {
    dispatch(removeTreatmentNote(row.key));
  };

  const renderTreatmentTable = () => (
    <DynamicPickerTable
      ref={tableRef}
      isEditable={isEditable}
      columns={columns}
      initialData={filteredTreatmentNotes}
      searchConfig={searchConfig}
      onSearch={handleSearch}
      onRowChange={handleRowChange}
      onRowAdd={handleRowAdd}
      onRowDelete={handleRowDelete}
      emptyText="No treatments added"
      searchPlaceholder="Search by treatment name or type..."
      rootClassName="treatment-given-picker"
      loading={treatmentNotesLoading}
      hideTableWhenEmpty={true}
      isTreatmentGiven={true}
    />
  );

  const showLastUpdatedAt = () => {
    if (!actualDischargeSummaryData?.date) return null;
    return (
      <div className="success-gradient-pill">
        <img src={greenTick} alt="." />
        {`Last Updated on ${formatDateToShortMonthYear(
          actualDischargeSummaryData?.date
        )}`}
      </div>
    );
  };

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      title={sectionData?.title}
      width="100%"
      icon={dischargeSummaryIcons[`${sectionData?.id}Pc`]}
      showAutoFill={false}
      containerClass={`wrapper-class ${
        !isEditable
          ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly"
          : ""
      }`}
      showMagicPenGif={false}
      showMicrophone={false}
      placeholder="Treatment given details"
      templates={normalizedTreatmentTemplates}
      templateType={moduleName}
      onSave={() => {}}
      showTempButtons={true}
      onTemplate={refreshTreatmentTemplates}
      onTemplateSelected={handleTemplateSelected}
      addTemplate={handleAddTemplate}
      updateTemplate={handleUpdateTemplate}
      onDeleteTemplateClicked={handleDeleteTemplate}
      loading={templatesLoading}
      data={getCurrentValue()}
      isDataPresent={filteredTreatmentNotes?.length > 0}
      onErase={() => {
        dispatch(setTreatmentNotes([]));
      }}
      renderBody={renderTreatmentTable}
      headerComponent={showLastUpdatedAt}
    />
  );
};

export default TreatmentGiven;
