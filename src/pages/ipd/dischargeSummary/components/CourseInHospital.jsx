import React, { useState, useEffect } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  formatDateToShortMonthYear,
  isEmptyRichText,
} from "../../../../utils/utils";
import { setCourseInHospital } from "../../../../redux/ipd/dischargeSummarySlice";
import TreatmentGiven from "../../../../components/DynamicPickerTable/TreatmentGiven";
import { greenTick } from "../../../../assets/images/dischargeSummaryIcons";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const CourseInHospital = (props) => {
  const { isEditable = true, sectionData } = props || {};

  const {
    dischargeSummaryData: { courseInHospital } = {},
    chronologicalSummary,
    actualDischargeSummaryData,
  } = useSelector((state) => state.dischargeSummary);

  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const handleOthersChange = (data, key) => {
    dispatch(setCourseInHospital({ ...courseInHospital, [key]: data }));
  };

  const getModuleCode = (module) => {
    if (!module) return "";

    const moduleMap = {
      "OT Note": "OT",
      "OT Notes": "OT",
      "Progress Note": "PN",
      "Progress Notes": "PN",
      Assessment: "AF",
      "Consultant Notes": "CN",
      "Cross Referral": "CR",
      "Laboratory Report": "LR",
      "Radiology Report": "RR",
      "Nursing Notes": "NN",
      Medication: "MED",
      "Vital Signs": "VS",
      "Discharge Planning": "DP",
    };

    return moduleMap[module] || module.substring(0, 2).toUpperCase();
  };

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

        const fullContent = dayPrefix + dayContent;
        const childrenOfList = [{ text: fullContent }];

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
    if (!isEditable && isEmptyRichText(courseInHospital?.chronologicalSummary))
      return null;

    const getInitialValue = () => {
      if (
        chronologicalSummary &&
        (Array.isArray(chronologicalSummary) ||
          Object.keys(chronologicalSummary).length > 0)
      ) {
        const transformed = transformChronologicalData(chronologicalSummary);

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
          onSave={() => {
            console.log("save");
          }}
          onErase={() => {
            setAutoFillTextToAppend(["clear"]);
          }}
          onTemplate={() => {
            console.log("template");
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
