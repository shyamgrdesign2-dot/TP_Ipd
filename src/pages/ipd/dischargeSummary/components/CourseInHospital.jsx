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
import { Button } from "antd";

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
    dischargeSummaryData: { courseInHospital, chronologicalSummary } = {},
    chronologicalSummaryLoading,
  } = useSelector((state) => state.dischargeSummary);
  console.log("intel ==> chronologicalSummary", chronologicalSummary);

  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const handleOthersChange = (data, key) => {
    dispatch(setCourseInHospital({ ...courseInHospital, [key]: data }));

    if (key === "chronologicalSummary") {
      setTimeout(() => {
        const richTextContainer = document.querySelector(
          ".chronological-summary-wrapper .slate-editable-wrapper"
        );
        if (richTextContainer) {
          const event = new CustomEvent("contentChanged");
          richTextContainer.dispatchEvent(event);
        }
      }, 200);
    }
  };

  useEffect(() => {
    const addModuleTooltips = () => {
      const richTextContainer = document.querySelector(
        ".chronological-summary-wrapper .slate-editable-wrapper"
      );
      if (!richTextContainer) {
        return;
      }

      const processModuleCodes = () => {
        const textElements = richTextContainer.querySelectorAll("p, li");

        textElements.forEach((element) => {
          if (element.querySelector(".chronological-module-code")) {
            return;
          }

          const text = element.textContent || element.innerText;

          if (!text.includes("[") || !text.includes("]")) {
            return;
          }

          const moduleRegex = /\[([A-Z]{2,4})\]/g;
          let processedHTML = text;
          let hasModuleCodes = false;

          processedHTML = text.replace(moduleRegex, (match, code) => {
            hasModuleCodes = true;
            return `<span class="chronological-module-code" title="${getModuleFullName(
              code
            )}">${match}</span>`;
          });

          if (hasModuleCodes) {
            element.innerHTML = processedHTML;
          }
        });
      };

      processModuleCodes();

      const handleContentChange = () => {
        setTimeout(processModuleCodes, 100);
      };

      richTextContainer.addEventListener("contentChanged", handleContentChange);

      return () => {
        richTextContainer.removeEventListener(
          "contentChanged",
          handleContentChange
        );
      };
    };

    const timeoutId = setTimeout(addModuleTooltips, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [chronologicalSummary]);

  const getModuleFullName = (code) => {
    const codeToNameMap = {
      OT: "OT Notes",
      PN: "Progress Notes",
      AF: "Assessment",
      CN: "Consultant Notes",
      CR: "Cross Referral",
      LR: "Laboratory Report",
      RR: "Radiology Report",
      NN: "Nursing Notes",
      MED: "Medication",
      VS: "Vital Signs",
      DP: "Discharge Planning",
    };

    return codeToNameMap[code] || code;
  };

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
    if (!apiData || typeof apiData !== "object") return [];

    const transformedData = [];
    const listItems = [];

    Object.keys(apiData).forEach((key) => {
      const dayData = apiData[key];
      if (dayData && dayData.date && dayData.day && dayData.entry) {
        const formattedDate = dayjs(dayData.date).format("DD MMM YYYY");
        const dayPrefix = `${dayData.day} (${formattedDate}): `;

        const moduleCode = dayData.module ? getModuleCode(dayData.module) : "";

        let dayContent = "";
        dayData.entry.forEach((entryItem, index) => {
          if (entryItem.type === "paragraph" && entryItem.children) {
            entryItem.children.forEach((child) => {
              if (child.text) {
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
          children: [
            {
              type: "paragraph",
              children: [{ text: fullContent }],
            },
          ],
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
      if (
        chronologicalSummary &&
        Object.keys(chronologicalSummary).length > 0
      ) {
        return transformChronologicalData(chronologicalSummary);
      }

      if (courseInHospital?.chronologicalSummary) {
        return courseInHospital.chronologicalSummary;
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
        {isEditable && (
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
        )}

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
    return <TreatmentGiven />;
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
