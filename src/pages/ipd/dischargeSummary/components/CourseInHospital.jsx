import React, { useState, useEffect } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { isEmptyRichText } from "../../../../utils/utils";
import {
  setCourseInHospital,
  generateChronologicalSummary,
} from "../../../../redux/ipd/dischargeSummarySlice";
import TreatmentGiven from "../../../../components/DynamicPickerTable/TreatmentGiven";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const CourseInHospital = (props) => {
  const {
    isEditable = true,
    sectionData,
    patientId,
    admissionId,
  } = props || {};
  const {
    dischargeSummaryData: {
      courseInHospital,
      //   chronologicalSummary,
      treatmentNotes,
    } = {},
    chronologicalSummary,
    chronologicalSummaryLoading,
  } = useSelector((state) => state.dischargeSummary);
  const dataa = useSelector((state) => state.dischargeSummary);

  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const handleOthersChange = (data, key) => {
    dispatch(setCourseInHospital({ ...courseInHospital, [key]: data }));
  };

  useEffect(() => {
    handleGenerateChronologicalSummary();
  }, []);

  const handleGenerateChronologicalSummary = async () => {
    if (!patientId || !admissionId) return;

    try {
      await dispatch(
        generateChronologicalSummary({ patientId, admissionId })
      ).unwrap();
    } catch (error) {
      console.error("Failed to generate chronological summary:", error);
    }
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
      if (dayData && dayData.date && dayData.day && dayData.entry) {
        const formattedDate = dayjs(dayData.date).format("DD MMM YYYY");
        const dayPrefix = `${dayData.day} (${formattedDate}): `;

        const moduleCode = dayData.module ? getModuleCode(dayData.module) : "";

        let dayContent = "";

        // Handle both array and single entry formats
        const entries = Array.isArray(dayData.entry)
          ? dayData.entry
          : [dayData.entry];

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
        if (moduleCode) {
          dayContent += ` [${moduleCode}]`;
        }

        const fullContent = dayPrefix + dayContent;

        listItems.push({
          type: "list-item",
          children: [{ text: fullContent }],
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

  const renderChronologicalSummary = (data) => {
    if (!isEditable && isEmptyRichText(courseInHospital?.chronologicalSummary))
      return null;

    const getInitialValue = () => {
      // Handle chronological summary from API
      if (
        chronologicalSummary &&
        (Array.isArray(chronologicalSummary) ||
          Object.keys(chronologicalSummary).length > 0)
      ) {
        console.log('INTEL ==> chronologicalSummary', chronologicalSummary)
        const transformed = Array.isArray(chronologicalSummary) && !chronologicalSummary?.[0]?.entry
          ? chronologicalSummary
          : transformChronologicalData(chronologicalSummary);

        // Ensure we return a valid Slate structure
        return Array.isArray(transformed) && transformed.length > 0
          ? transformed
          : [{ type: "paragraph", children: [{ text: "" }] }];
      }

      // Handle existing courseInHospital data
      if (courseInHospital?.chronologicalSummary) {
        // Ensure it's a valid Slate structure
        if (Array.isArray(courseInHospital.chronologicalSummary)) {
          return courseInHospital.chronologicalSummary;
        }
      }

      // Default empty state
      return [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ];
    };

    return (
      <div className="chronological-summary-wrapper">
        {/* {isEditable && (
          <div
            className="chronological-summary-actions"
            style={{ marginBottom: "16px", textAlign: "right" }}
          >
            <Button
              type="primary"
              onClick={handleGenerateChronologicalSummary}
              loading={chronologicalSummaryLoading}
              size="small"
            >
              Generate Chronological Summary
            </Button>
          </div>
        )} */}

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
