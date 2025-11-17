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
import { useTemplateManagement } from "../../../../hooks/useTemplateManagement";

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

  // console.log("INTEL ==> chronologicalSummary", chronologicalSummary);

  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const handleOthersChange = (data, key) => {
    dispatch(setCourseInHospital({ ...courseInHospital, [key]: data }));
  };

  // Get current value callback for chronological summary
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

  // Use template management hook for chronological summary
  const {
    templates: normalizedChronologicalTemplates,
    templatesLoading,
    handleTemplateSelected: handleChronologicalTemplateSelected,
    handleAddTemplate: handleChronologicalAddTemplate,
    handleUpdateTemplate: handleChronologicalUpdateTemplate,
    handleDeleteTemplate: handleChronologicalDeleteTemplate,
    refreshTemplates: refreshChronologicalTemplates,
  } = useTemplateManagement({
    moduleName: "chronologicalSummary",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue: getCurrentChronologicalValue,
    onValueChange: useCallback(
      (newEntries) => {
        // Update both Redux stores
        dispatch(setChronologicalSummary(newEntries));
        dispatch(
          setCourseInHospital({
            ...courseInHospital,
            chronologicalSummary: newEntries,
          })
        );
      },
      [dispatch, courseInHospital]
    ),
  });

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
