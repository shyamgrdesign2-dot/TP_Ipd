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

// Removed Slate inline component approach - using DOM-based tooltips instead

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
    const addModuleCodeStyling = () => {
      const richTextContainer = document.querySelector(
        ".chronological-summary-wrapper .slate-editable-wrapper"
      );
      if (!richTextContainer) {
        return;
      }

      let tooltip = null;

      const createTooltip = (content, x, y) => {
        if (tooltip) {
          tooltip.remove();
        }
        tooltip = document.createElement("div");
        tooltip.className = "module-code-tooltip-overlay";
        tooltip.textContent = content;
        tooltip.style.position = "fixed";
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 40}px`;
        tooltip.style.zIndex = "10000";
        tooltip.style.backgroundColor = "white";
        tooltip.style.color = "white";
        tooltip.style.padding = "8px 12px";
        tooltip.style.borderRadius = "6px";
        tooltip.style.fontSize = "12px";
        tooltip.style.fontWeight = "normal";
        tooltip.style.whiteSpace = "nowrap";
        tooltip.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        tooltip.style.pointerEvents = "none";
        tooltip.style.opacity = "0";
        tooltip.style.transition = "opacity 0.2s ease";

        document.body.appendChild(tooltip);

        setTimeout(() => {
          if (tooltip) tooltip.style.opacity = "1";
        }, 10);
      };

      const hideTooltip = () => {
        if (tooltip) {
          tooltip.style.opacity = "0";
          setTimeout(() => {
            if (tooltip && tooltip.parentNode) {
              tooltip.parentNode.removeChild(tooltip);
              tooltip = null;
            }
          }, 200);
        }
      };

      const handleMouseMove = (event) => {
        // Get the element under the mouse
        const elementUnderMouse = document.elementFromPoint(
          event.clientX,
          event.clientY
        );

        if (
          elementUnderMouse &&
          richTextContainer.contains(elementUnderMouse)
        ) {
          const text = elementUnderMouse.textContent || "";
          const moduleRegex = /\[([A-Z]{2,4})\]/g;

          // Check if text contains module codes
          if (moduleRegex.test(text)) {
            // Find which module code the mouse is over
            const matches = [...text.matchAll(/\[([A-Z]{2,4})\]/g)];

            if (matches.length > 0) {
              // Show tooltip for the first module code found
              const match = matches[0];
              const code = match[1];
              const fullName = getModuleFullName(code);
              createTooltip(
                `${code}: ${fullName}`,
                event.clientX,
                event.clientY
              );
              return;
            }
          }
        }

        hideTooltip();
      };

      const handleMouseOut = () => {
        hideTooltip();
      };

      // Add event listeners to the container (no DOM manipulation)
      richTextContainer.addEventListener("mousemove", handleMouseMove);
      richTextContainer.addEventListener("mouseout", handleMouseOut);

      return () => {
        hideTooltip();
        richTextContainer.removeEventListener("mousemove", handleMouseMove);
        richTextContainer.removeEventListener("mouseout", handleMouseOut);
      };
    };

    const timeoutId = setTimeout(addModuleCodeStyling, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [chronologicalSummary]);

  useEffect(() => {
    handleGenerateChronologicalSummary();
  }, []);

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
      // Handle chronological summary from API
      if (
        chronologicalSummary &&
        (Array.isArray(chronologicalSummary) ||
          Object.keys(chronologicalSummary).length > 0)
      ) {
        const transformed = transformChronologicalData(chronologicalSummary);
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
