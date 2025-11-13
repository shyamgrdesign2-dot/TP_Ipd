import React, { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  formatDateToShortMonthYear,
  getModuleCode,
  isEmptyRichText,
} from "../../../../utils/utils";
import {
  setCourseInHospital,
  setChronologicalSummary,
} from "../../../../redux/ipd/dischargeSummarySlice";
import TreatmentGiven from "../../../../components/DynamicPickerTable/TreatmentGiven";
import { greenTick } from "../../../../assets/images/dischargeSummaryIcons";
import {
  deleteTemplate as deleteTemplateThunk,
  getTemplatesByModuleName,
  makeSelectTemplatesByModule,
  selectTemplatesLoading,
  updateTemplate as updateTemplateThunk,
} from "../../../../redux/ipd/tempaltesSlice";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const EMPTY_RICH_TEXT_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const CourseInHospital = (props) => {
  const { isEditable = true, sectionData } = props || {};

  const {
    dischargeSummaryData = {},
    chronologicalSummary,
    actualDischargeSummaryData,
  } = useSelector((state) => state.dischargeSummary);

  const { courseInHospital = {} } = dischargeSummaryData || {};

  const doctorId =
    dischargeSummaryData?.patientInformation?.primaryConsultant?.id ||
    actualDischargeSummaryData?.patientInformation?.primaryConsultant?.id ||
    null;

  const templateSite = "ipd";
  const chronologicalModuleName = "chronologicalSummary";

  const templatesLoading = useSelector(selectTemplatesLoading);

  const chronologicalTemplatesSelector = useMemo(
    () => makeSelectTemplatesByModule(chronologicalModuleName),
    [chronologicalModuleName]
  );
  const chronologicalTemplates = useSelector(chronologicalTemplatesSelector);

  // console.log("INTEL ==> chronologicalSummary", chronologicalSummary);

  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const handleOthersChange = (data, key) => {
    dispatch(setCourseInHospital({ ...courseInHospital, [key]: data }));
  };

  const getCurrentChronologicalValue = useCallback(() => {
    if (
      Array.isArray(courseInHospital?.chronologicalSummary) &&
      courseInHospital.chronologicalSummary.length
    ) {
      return courseInHospital.chronologicalSummary;
    }

    if (chronologicalSummary) {
      if (Array.isArray(chronologicalSummary)) {
        const isInitialGeneratedState =
          chronologicalSummary?.[0]?.day || chronologicalSummary?.[0]?.date;
        const transformed = isInitialGeneratedState
          ? transformChronologicalData(chronologicalSummary)
          : chronologicalSummary;
        return transformed && transformed.length
          ? transformed
          : EMPTY_RICH_TEXT_VALUE;
      }
      if (
        typeof chronologicalSummary === "object" &&
        Object.keys(chronologicalSummary).length
      ) {
        const transformed = transformChronologicalData(chronologicalSummary);
        return transformed && transformed.length
          ? transformed
          : EMPTY_RICH_TEXT_VALUE;
      }
    }

    return courseInHospital?.chronologicalSummary ||
      courseInHospital?.chronologicalSummary?.length
      ? courseInHospital?.chronologicalSummary
      : EMPTY_RICH_TEXT_VALUE;
  }, [chronologicalSummary, courseInHospital]);

  const extractChronologicalEntries = useCallback((template) => {
    if (!template) return EMPTY_RICH_TEXT_VALUE;
    const candidates = [
      template.entries,
      template.template?.entries,
      template.template?.chronologicalSummary,
      template.chronologicalSummary,
      template.data,
      template.template?.data,
      template.content,
      template.template?.content,
      template.value,
      template.template?.value,
    ];
    const found = candidates.find(
      (candidate) => Array.isArray(candidate) && candidate.length
    );
    const result =
      found && Array.isArray(found) && found.length
        ? JSON.parse(JSON.stringify(found))
        : EMPTY_RICH_TEXT_VALUE;

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

  const refreshChronologicalTemplates = useCallback(() => {
    dispatch(
      getTemplatesByModuleName({
        moduleName: chronologicalModuleName,
        site: templateSite,
        isMaster: false,
        doctorId,
      })
    );
  }, [dispatch, chronologicalModuleName, templateSite, doctorId]);

  const handleChronologicalTemplateSelected = useCallback(
    (template) => {
      try {
        const templateEntries = extractChronologicalEntries(template);
        
        // Get current value
        const currentValue = getCurrentChronologicalValue();
        const isEmpty = isEmptyRichText(currentValue);
        
        // If current value is empty, just set the template entries
        // Otherwise, append template entries to existing content
        const newEntries = isEmpty
          ? templateEntries
          : [...currentValue, ...templateEntries];
        
        // Update both Redux stores
        dispatch(setChronologicalSummary(newEntries));
        dispatch(
          setCourseInHospital({
            ...courseInHospital,
            chronologicalSummary: newEntries,
          })
        );
      } catch (error) {
        console.error("Error applying chronological template:", error);
        message.error("Failed to apply template.");
      }
    },
    [dispatch, courseInHospital, extractChronologicalEntries, getCurrentChronologicalValue, isEmptyRichText]
  );

  const extractChronologicalPayload = useCallback(
    (payload) => {
      const title =
        payload?.title ||
        payload?.templateName ||
        payload?.tst_template_name ||
        payload?.tat_template_name ||
        payload?.name ||
        "Untitled Template";
      const currentValue = getCurrentChronologicalValue();
      const entries =
        payload?.entries ||
        payload?.chronologicalSummary ||
        payload?.data ||
        currentValue;
      return {
        _id: payload?._id || payload?.id,
        title: title?.trim?.() ? title.trim() : "Untitled Template",
        entries:
          Array.isArray(entries) && entries.length ? entries : currentValue,
      };
    },
    [getCurrentChronologicalValue]
  );

  const handleChronologicalAddTemplate = useCallback(
    async (templateData, callback) => {
      const { title, entries } = extractChronologicalPayload(templateData);
      const requestPayload = {
        module: chronologicalModuleName,
        site: templateSite,
        isMaster: false,
        title,
        entries,
        doctorId,
      };

      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template saved successfully.");
        refreshChronologicalTemplates();
        callback?.();
      } else {
        message.error(
          action.payload || action.error?.message || "Failed to save template."
        );
      }
    },
    [
      dispatch,
      extractChronologicalPayload,
      doctorId,
      refreshChronologicalTemplates,
    ]
  );

  const handleChronologicalUpdateTemplate = useCallback(
    async (templateData, callback) => {
      const { _id, title, entries } =
        extractChronologicalPayload(templateData);
      if (!_id) {
        message.warning("Template identifier not found for update.");
        return;
      }
      const requestPayload = {
        _id,
        module: chronologicalModuleName,
        site: templateSite,
        isMaster: false,
        title,
        entries,
        doctorId,
      };
      const action = await dispatch(updateTemplateThunk(requestPayload));
      if (updateTemplateThunk.fulfilled.match(action)) {
        message.success("Template updated successfully.");
        refreshChronologicalTemplates();
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
      extractChronologicalPayload,
      doctorId,
      refreshChronologicalTemplates,
    ]
  );

  const handleChronologicalDeleteTemplate = useCallback(
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
          moduleName: chronologicalModuleName,
          site: templateSite,
          isMaster: false,
          doctorId,
        })
      );
      if (deleteTemplateThunk.fulfilled.match(action)) {
        message.success("Template deleted.");
        refreshChronologicalTemplates();
      } else {
        message.error(
          action.payload ||
            action.error?.message ||
            "Failed to delete template."
        );
      }
    },
    [dispatch, doctorId, refreshChronologicalTemplates]
  );

  const normalizeChronologicalTemplates = useCallback(
    (moduleTemplates) => {
      return (moduleTemplates || []).map((template) => {
        const title = getTemplateTitle(template);
        const entries = extractChronologicalEntries(template);
        const id = template?._id || template?.id;
        return {
          _id: id,
          id,
          title,
          templateName: title,
          tst_template_name: template?.tst_template_name || title,
          tat_template_name: template?.tat_template_name || title,
          entries,
          module: template?.module,
          site: template?.site,
          isMaster: template?.isMaster,
        };
      });
    },
    [extractChronologicalEntries, getTemplateTitle]
  );

  const normalizedChronologicalTemplates = useMemo(
    () => normalizeChronologicalTemplates(chronologicalTemplates),
    [chronologicalTemplates, normalizeChronologicalTemplates]
  );

  useEffect(() => {
    if (isEditable) {
      refreshChronologicalTemplates();
    }
  }, [isEditable, refreshChronologicalTemplates]);

  const transformChronologicalData = (apiData) => {
    if (!apiData) return [];

    const transformedData = [];
    const listItems = [];

    // Handle both array and object formats
    const dataToProcess = Array.isArray(apiData)
      ? apiData
      : Object.values(apiData);

    dataToProcess.forEach((dayData) => {
      if (dayData && dayData.date && dayData.day) {
        const formattedDate = dayjs(dayData.date).format("DD MMM YYYY");
        const dayPrefix = `${dayData.day} (${formattedDate}): `;

        const moduleCode = dayData.module ? getModuleCode(dayData.module) : "";

        let dayContent = "";

        // Handle both array and single entry formats
        const entries = Array.isArray(dayData) ? dayData : [dayData];

        entries.forEach((entryItem) => {
          if (
            entryItem &&
            entryItem.type === "paragraph" &&
            entryItem.children
          ) {
            entryItem.children.forEach((child) => {
              if (child && child.text) {
                dayContent += child.text + " ";
              }
            });
          }
        });

        dayContent = dayContent.trim();

        const childrenOfList = [
          { text: dayPrefix, bold: true, underline: true },
          { text: dayContent },
        ];

        if (moduleCode) {
          childrenOfList.push({
            type: "link",
            url: null,
            tooltip: () => (
              <div className="chrosum-tooltip-container">
                <div className="chrotol-source">
                  <span>Source:</span>
                  {dayData.module} - {dayData.subModule}
                </div>
                <div className="chrotol-source">
                  <span>Date:</span>
                  {dayData.date}
                </div>
              </div>
            ),
            children: [{ text: `[${moduleCode}]` }],
          });
        }

        listItems.push({
          type: "list-item",
          children: childrenOfList,
        });
      }
    });

    if (listItems.length > 0) {
      transformedData.push({
        type: "bulleted-list",
        children: listItems,
      });
    }

    return transformedData.length > 0
      ? transformedData
      : [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ];
  };

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

  const renderChronologicalSummary = (data) => {
    if (!isEditable && isEmptyRichText(chronologicalSummary)) return null;

    const getInitialValue = () => {
      if (
        chronologicalSummary &&
        (Array.isArray(chronologicalSummary) ||
          Object.keys(chronologicalSummary).length > 0)
      ) {
        const isInitialGeneratedState =
          chronologicalSummary?.[0]?.day || chronologicalSummary?.[0]?.date;

        const transformed = isInitialGeneratedState
          ? transformChronologicalData(chronologicalSummary)
          : chronologicalSummary;

        return Array.isArray(transformed) && transformed.length > 0
          ? transformed
          : [{ type: "paragraph", children: [{ text: "" }] }];
      }

      if (courseInHospital?.chronologicalSummary) {
        if (Array.isArray(courseInHospital.chronologicalSummary)) {
          return courseInHospital.chronologicalSummary;
        }
      }

      return [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ];
    };

    return (
      <div className="chronological-summary-wrapper">
        <RichTextEditWrapper
          key={`chronological-summary-${
            Object.keys(chronologicalSummary || {}).length
          }`}
          readOnly={!isEditable}
          showToolbar={isEditable}
          showActionBtns={isEditable}
          title={data?.title}
          width={isEditable ? "100%" : "fit-content"}
          icon={dischargeSummaryIcons[`${data?.id}Pc`]}
          showAutoFill={false}
          containerClass={`wrapper-class ${
            !isEditable ? "ipd-wrapper-class-readonly" : ""
          }`}
          opdDate="15 Jun 2025"
          showMagicPenGif={false}
          showMicrophone={false}
          onChange={(data) => handleOthersChange(data, "chronologicalSummary")}
          initialValue={getInitialValue()}
          placeholder={
            data?.placeholder ||
            "Click 'Generate Chronological Summary' to auto-populate or enter details manually"
          }
          templates={normalizedChronologicalTemplates}
          templateType="entries"
          onSave={() => {}}
          onTemplate={refreshChronologicalTemplates}
          onTemplateSelected={handleChronologicalTemplateSelected}
          addTemplate={handleChronologicalAddTemplate}
          updateTemplate={handleChronologicalUpdateTemplate}
          onDeleteTemplateClicked={handleChronologicalDeleteTemplate}
          loading={templatesLoading}
          data={getCurrentChronologicalValue()}
          showTempButtons={true}
          onErase={() => {
            // Clear the Redux state for chronologicalSummary
            dispatch(setChronologicalSummary([]));
            dispatch(
              setCourseInHospital({
                ...courseInHospital,
                chronologicalSummary: [],
              })
            );
            // Also clear the autoFillTextToAppend for the editor
            setAutoFillTextToAppend(["clear"]);
          }}
          newAutoFillTextToAppend={autoFillTextToAppend}
          setNewAutoFillTextToAppend={setAutoFillTextToAppend}
          headerComponent={showLastUpdatedAt}
        />
      </div>
    );
  };

  const renderTreatmentsGiven = (data) => {
    return <TreatmentGiven sectionData={data} />;
  };

  const renderSection = () => {
    return sectionData?.children?.map((item) => {
      return (
        <React.Fragment key={item.id}>
          {(() => {
            switch (item?.id) {
              case "chronologicalSummary":
                return renderChronologicalSummary(item);
              case "treatmentsGiven":
                return renderTreatmentsGiven(item);
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

export default CourseInHospital;
