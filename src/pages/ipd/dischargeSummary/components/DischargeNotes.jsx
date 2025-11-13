import React, { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { defaultIcons } from "../../../../assets/images/icons";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import Vitals from "../../assessmentForm/Vitals";
import { isEmptyRichText } from "../../../../utils/utils";
import {
  setDischargeSummaryData,
  setPatientCondition,
} from "../../../../redux/ipd/dischargeSummarySlice";
import CurrentMedications from "../../assessmentForm/CurrentMedications";
import {
  deleteTemplate as deleteTemplateThunk,
  getTemplatesByModuleName,
  makeSelectTemplatesByModule,
  selectTemplatesLoading,
  updateTemplate as updateTemplateThunk,
} from "../../../../redux/ipd/tempaltesSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const DischargeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { surgeryDetails, surgeryProcedureOptions, dischargeSummaryData } =
    useSelector((state) => state.dischargeSummary);
  const initialValue = useMemo(() => surgeryDetails || {}, [surgeryDetails]);
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  // Template management for patientCondition
  const templateSite = "ipd";
  const moduleName = "patientConditionDuringDischarge";
  const doctorId =
    dischargeSummaryData?.patientInformation?.primaryConsultant?.id;

  // Template selectors
  const patientConditionSelector = useMemo(
    () => makeSelectTemplatesByModule(moduleName),
    [moduleName]
  );
  const patientConditionTemplates = useSelector(patientConditionSelector);
  const templatesLoading = useSelector(selectTemplatesLoading);

  // Helper to get current value
  const getCurrentPatientConditionValue = useCallback(() => {
    const patientCondition = dischargeSummaryData?.patientCondition;
    if (isEmptyRichText(patientCondition)) {
      return [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ];
    }
    return Array.isArray(patientCondition) && patientCondition.length
      ? patientCondition
      : [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ];
  }, [dischargeSummaryData?.patientCondition]);

  // Helper to extract entries from template
  const extractPatientConditionEntries = useCallback((template) => {
    if (!template) {
      return [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ];
    }
    const candidates = [
      template.entries,
      template.template?.entries,
      template.patientConditionDuringDischarge,
      template.template?.patientConditionDuringDischarge,
      template.data,
      template.template?.data,
      template.content,
      template.template?.content,
      template.value,
      template.template?.value,
    ];
    const found = candidates.find(
      (candidate) => Array.isArray(candidate) && candidate.length > 0
    );
    const result =
      found && Array.isArray(found) && found.length
        ? JSON.parse(JSON.stringify(found))
        : [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ];

    return result.map((entry) => {
      if (
        entry &&
        typeof entry === "object" &&
        entry.type &&
        Array.isArray(entry.children)
      ) {
        return entry;
      }
      return {
        type: "paragraph",
        children: [{ text: "" }],
      };
    });
  }, []);

  // Helper to get template title
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

  // Template handlers
  const refreshPatientConditionTemplates = useCallback(() => {
    dispatch(
      getTemplatesByModuleName({
        moduleName,
        site: templateSite,
        isMaster: false,
        doctorId,
      })
    );
  }, [dispatch, moduleName, templateSite, doctorId]);

  const handlePatientConditionTemplateSelected = useCallback(
    (template) => {
      try {
        console.log("Template selected:", template);
        const templateEntries = extractPatientConditionEntries(template);
        console.log("Extracted entries:", templateEntries);
        const currentValue = getCurrentPatientConditionValue();
        console.log("Current value:", currentValue);
        const isEmpty = isEmptyRichText(currentValue);

        // If current value is empty, just set the template entries
        // Otherwise, append template entries to existing content
        const newEntries = isEmpty
          ? templateEntries
          : [...currentValue, ...templateEntries];

        console.log("New entries to set:", newEntries);
        // Update Redux store
        dispatch(setPatientCondition(newEntries));
      } catch (error) {
        console.error("Error applying patient condition template:", error);
        message.error("Failed to apply template.");
      }
    },
    [
      dispatch,
      extractPatientConditionEntries,
      getCurrentPatientConditionValue,
      isEmptyRichText,
    ]
  );

  const extractPatientConditionPayload = useCallback(
    (payload) => {
      const title =
        payload?.title ||
        payload?.templateName ||
        payload?.tst_template_name ||
        payload?.tat_template_name ||
        payload?.name ||
        "Untitled Template";
      const currentValue = getCurrentPatientConditionValue();
      const data =
        payload?.data ||
        payload?.entries ||
        payload?.patientConditionDuringDischarge ||
        currentValue;
      return {
        _id: payload?._id || payload?.id,
        title: title?.trim?.() ? title.trim() : "Untitled Template",
        data: Array.isArray(data) && data.length ? data : currentValue,
      };
    },
    [getCurrentPatientConditionValue]
  );

  const handlePatientConditionAddTemplate = useCallback(
    async (templateData, callback) => {
      const { title, data } = extractPatientConditionPayload(templateData);
      const requestPayload = {
        module: moduleName,
        site: templateSite,
        isMaster: false,
        title,
        entries: data,
        doctorId,
      };

      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template saved successfully.");
        refreshPatientConditionTemplates();
        callback?.();
      } else {
        message.error(
          action.payload || action.error?.message || "Failed to save template."
        );
      }
    },
    [
      dispatch,
      extractPatientConditionPayload,
      moduleName,
      templateSite,
      doctorId,
      refreshPatientConditionTemplates,
    ]
  );

  const handlePatientConditionUpdateTemplate = useCallback(
    async (templateData, callback) => {
      const { _id, title, data } = extractPatientConditionPayload(templateData);
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
        entries: data,
        doctorId,
      };
      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template updated successfully.");
        refreshPatientConditionTemplates();
        callback?.();
      } else {
        message.error(
          action.payload || action.error?.message || "Failed to update template."
        );
      }
    },
    [
      dispatch,
      extractPatientConditionPayload,
      moduleName,
      templateSite,
      doctorId,
      refreshPatientConditionTemplates,
    ]
  );

  const handlePatientConditionDeleteTemplate = useCallback(
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
        refreshPatientConditionTemplates();
      } else {
        message.error(
          action.payload ||
            action.error?.message ||
            "Failed to delete template."
        );
      }
    },
    [dispatch, moduleName, templateSite, doctorId, refreshPatientConditionTemplates]
  );

  // Normalize templates for display
  const normalizePatientConditionTemplates = useCallback(
    (moduleTemplates) => {
      return (moduleTemplates || []).map((template) => {
        const title = getTemplateTitle(template);
        const data = extractPatientConditionEntries(template);
        const id = template?._id || template?.id;
        return {
          _id: id,
          id: id,
          title,
          templateName: title,
          tst_template_name: template?.tst_template_name || title,
          tat_template_name: template?.tat_template_name || title,
          entries: data,
          module: template?.module,
          site: template?.site,
          isMaster: template?.isMaster,
        };
      });
    },
    [extractPatientConditionEntries, getTemplateTitle]
  );

  const normalizedPatientConditionTemplates = useMemo(
    () => normalizePatientConditionTemplates(patientConditionTemplates),
    [patientConditionTemplates, normalizePatientConditionTemplates]
  );

  // Fetch templates on mount
  useEffect(() => {
    if (isEditable) {
      refreshPatientConditionTemplates();
    }
  }, [isEditable, refreshPatientConditionTemplates]);

  const handlePatientConditionChange = (data) => {
    dispatch(setPatientCondition(data));
  };

  const renderPatientCondition = (data) => {
    if (!isEditable && isEmptyRichText(dischargeSummaryData?.patientCondition))
      return null;

    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width={isEditable ? "100%" : "fit-content"}
        icon={dischargeSummaryIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={` ${!isEditable ? "ipd-wrapper-class-readonly" : ""}`}
        opdDate="15 Jun 2025"
        showMagicPenGif={false}
        showMicrophone={false}
        onChange={(data) => handlePatientConditionChange(data)}
        initialValue={
          dischargeSummaryData?.patientCondition?.length
            ? dischargeSummaryData?.patientCondition
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={data?.placeholder || "Enter Patient Condition"}
        templates={normalizedPatientConditionTemplates}
        templateType="entries"
        showTempButtons={true}
        onSave={() => {}}
        onTemplate={refreshPatientConditionTemplates}
        onTemplateSelected={handlePatientConditionTemplateSelected}
        addTemplate={handlePatientConditionAddTemplate}
        updateTemplate={handlePatientConditionUpdateTemplate}
        onDeleteTemplateClicked={handlePatientConditionDeleteTemplate}
        loading={templatesLoading}
        data={getCurrentPatientConditionValue()}
        onErase={() => {
          // Clear the Redux state for patientCondition
          dispatch(setPatientCondition([]));
          // Also clear the autoFillTextToAppend for the editor
          setAutoFillTextToAppend(["clear"]);
        }}
        newAutoFillTextToAppend={autoFillTextToAppend}
        setNewAutoFillTextToAppend={setAutoFillTextToAppend}
      />
    );
  };

  const renderSection = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "dischargeVitals":
                return (
                  <Vitals
                    isEditable={true}
                    {...props}
                    formName="dischargeSummary"
                    sectionData={item}
                  />
                );
              case "patientCondition":
                return renderPatientCondition(item);
              case "dischargeMedications":
                return (
                  <CurrentMedications
                    isDischargeSummary={true}
                    {...props}
                    sectionData={item}
                  />
                );
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

export default DischargeNotes;
