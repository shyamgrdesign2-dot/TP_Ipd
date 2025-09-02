import { Button } from "antd";
import React, { useState, useEffect, useRef, useCallback } from "react";
import GenRXLoaders from "./GenRxLoaders";
const DigitisedPrescription = ({ data, setData, loading }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [editableText, setEditableText] = useState("");
  const [editableLineItem, setEditableLineItem] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  // Handle input blur (closing edit mode)
  const handleInputBlur = useCallback(
    (type, index) => {
      if (activeIndex !== null && activeType !== null) {
        setData((prevData) => {
          const updatedData = { ...prevData };

          if (type === "medications" || type === "tests") {
            updatedData[type][index].refinedName = editableText.trim();
          } else if (
            type === "symptoms" ||
            type === "examination" ||
            type === "diagnosis" ||
            type === "medicalHistory" ||
            type === "vaccinations"
          ) {
            updatedData[type][index].name = editableText.trim();
          } else if (type === "advice") {
            updatedData[type][index] = editableText.trim();
          } else if (type === "vitals") {
            updatedData.vitals[index] = editableText.trim();
          } else if (type === "followUp") {
            updatedData.followUp = editableText.trim();
          }

          return updatedData; // Persist changes
        });
      }

      setShowSuggestions(false);
      setActiveIndex(null);
      setActiveType(null);
      setEditableText(""); // Clear editable text after blur
    },
    [activeIndex, activeType, editableText, setData]
  );

  // Handle click outside suggestion and input box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        handleInputBlur(activeType, activeIndex);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeIndex, activeType, handleInputBlur]);

  // Handle selecting an item from suggestions
  const handleSuggestionClick = (type, index, suggestion) => {
    setData((prevData) => {
      const updatedData = { ...prevData };
      if (type === "medications" || type === "tests") {
        updatedData[type][index].name = suggestion;
      } else if (
        type === "symptoms" ||
        type === "examination" ||
        type === "diagnosis"
      ) {
        updatedData[type][index].name = suggestion;
      } else if (type === "advice") {
        updatedData[type][index] = suggestion;
      }
      return updatedData;
    });

    setShowSuggestions(false);
    setEditableText(suggestion); // Update editableText to match the selected suggestion
    setActiveIndex(null);
    setActiveType(null);
  };

  // Handle lineItem input blur (closing edit mode)
  const handleLineItemBlur = (type, index) => {
    setData((prevData) => {
      const updatedData = { ...prevData };
      if (type === "diagnosis" || type === "examination") {
        updatedData[type][index].notes = editableLineItem;
      } else {
        updatedData[type][index].lineItem = editableLineItem; // Update lineItem with the new value
      }
      return updatedData;
    });
    setActiveIndex(null);
    setActiveType(null);
  };

  // Handle input change for editing
  const handleInputChange = (e) => {
    setEditableText(e.target.value);
  };

  // Handle lineItem input change for editing
  const handleLineItemChange = (e) => {
    setEditableLineItem(e.target.value);
  };

  // Handle click on an item (to edit)
  const handleItemClick = (type, index) => {
    if (activeIndex !== null && activeType !== null) {
      handleInputBlur(activeType, activeIndex);
    }

    if (type === "medications" || type === "tests") {
      setEditableText(data[type][index].refinedName);
    } else if (
      type === "symptoms" ||
      type === "examination" ||
      type === "diagnosis" ||
      type === "medicalHistory" ||
      type === "vaccinations"
    ) {
      setEditableText(data[type][index].name);
    } else if (type === "advice") {
      setEditableText(data[type][index]);
    } else if (type === "vitals") {
      setEditableText(data.vitals[index]);
    } else if (type === "followUp") {
      setEditableText(data?.followUp);
    }

    setActiveIndex(index);
    setActiveType(type);
  };

  // Handle click on a lineItem (to edit)
  const handleLineItemClick = (type, index) => {
    if (
      type === "medications" ||
      type === "tests" ||
      type === "vaccinations" ||
      type === "medicalHistory" ||
      type === "symptoms"
    ) {
      setEditableLineItem(data[type][index]?.lineItem);
    } else {
      setEditableLineItem(data[type][index]?.notes);
    }
    setActiveIndex(index);
    setActiveType(`${type}-lineItem`);
  };

  const renderItems = (type) => {
    if (type === "followUp") {
      let textWidth = 0;
      if (activeType === "followUp") {
        const tempSpan = document.createElement("span");
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.whiteSpace = "nowrap";
        tempSpan.innerText = editableText || "";
        document.body.appendChild(tempSpan);
        textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
      }
      return (
        <div className="digitised-section">
          {loading ? (
            <div className="shimmer-container">
              <div className="shimmer-header">
                <div className="shimmer"></div>
              </div>
              <div className="shimmer-content">
                <div className="shimmer"></div>
              </div>
            </div>
          ) : (
            <div className="medicine-item">
              {activeType === "followUp" ? (
                <input
                  type="text"
                  value={editableText}
                  className="editable-digitised-item"
                  onChange={handleInputChange}
                  onBlur={() => handleInputBlur("followUp")}
                  autoFocus
                  style={{ width: `${textWidth + 10}px` }}
                />
              ) : (
                <span
                  onClick={() => handleItemClick("followUp")}
                  className="digitised-item"
                >
                  {data?.followUp}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
    // Check if type is 'vitals' and handle accordingly
    if (type === "vitals") {
      return (
        <div className="digitised-section">
          {loading ? (
            <div className="shimmer-container">
              <div className="shimmer-header">
                <div className="shimmer"></div>
              </div>
              <div className="shimmer-content">
                <div className="shimmer"></div>
              </div>
            </div>
          ) : (
            <ul>
              {Object.entries(data.vitals || {})
                .filter(([key, value]) => value)
                .map(([key, value]) => {
                  // Dynamically calculate input width
                  let textWidth = 0;
                  if (activeIndex === key && activeType === "vitals") {
                    const tempSpan = document.createElement("span");
                    tempSpan.style.visibility = "hidden";
                    tempSpan.style.position = "absolute";
                    tempSpan.style.whiteSpace = "nowrap";
                    tempSpan.innerText = editableText || "";
                    document.body.appendChild(tempSpan);
                    textWidth = tempSpan.offsetWidth;
                    document.body.removeChild(tempSpan);
                  }

                  return (
                    <li key={key}>
                      <div className="medicine-item">
                        <span className="digitised-item">
                          {/* Format the key to be human-readable */}
                          {`${key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}: `}
                        </span>
                        {activeIndex === key && activeType === "vitals" ? (
                          <input
                            type="text"
                            value={editableText} // Pre-fill the input with the current value
                            className="editable-digitised-item"
                            onChange={(e) => setEditableText(e.target.value)}
                            onBlur={() => handleInputBlur(type, key)}
                            autoFocus
                            style={{ width: `${textWidth + 10}px` }} // Add padding for better UX
                          />
                        ) : (
                          <span
                            onClick={() => handleItemClick(type, key)}
                            className="digitised-item"
                          >
                            {value}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      );
    }

    // Handle other types dynamically (like medications, symptoms, etc.)
    return (
      <div className="digitised-section">
        {loading ? (
          <div className="shimmer-container">
            <div className="shimmer-header">
              <div className="shimmer"></div>
            </div>
            <div className="shimmer-content">
              <div className="shimmer"></div>
            </div>
          </div>
        ) : Array.isArray(data[type]) && data[type].length > 0 ? (
          <ul>
            {data[type].map((item, index) => {
              // Measure the width of the editable text
              let textWidth = 0;
              let lineItemWidth = 0;

              // For name or other primary data (editableText)
              if (activeIndex === index && activeType === type) {
                const tempSpan = document.createElement("span");
                tempSpan.style.visibility = "hidden";
                tempSpan.style.position = "absolute";
                tempSpan.style.whiteSpace = "nowrap";
                tempSpan.innerText = editableText || "";
                document.body.appendChild(tempSpan);
                textWidth = tempSpan.offsetWidth;
                document.body.removeChild(tempSpan);
              }

              // For lineItem (editableLineItem)
              if (activeIndex === index && activeType === `${type}-lineItem`) {
                const tempSpanLineItem = document.createElement("span");
                tempSpanLineItem.style.visibility = "hidden";
                tempSpanLineItem.style.position = "absolute";
                tempSpanLineItem.style.whiteSpace = "nowrap";
                tempSpanLineItem.innerText = editableLineItem || "";
                document.body.appendChild(tempSpanLineItem);
                lineItemWidth = tempSpanLineItem.offsetWidth;
                document.body.removeChild(tempSpanLineItem);
              }

              return (
                <li key={index}>
                  <div className="medicine-item">
                    {activeIndex === index && activeType === type ? (
                      <input
                        type="text"
                        value={editableText}
                        className="editable-digitised-item"
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(type, index)}
                        autoFocus
                        style={{ width: `${textWidth + 10}px` }} // Add padding for better UX
                      />
                    ) : (
                      <span
                        onClick={() => handleItemClick(type, index)}
                        className="digitised-item"
                      >
                        {type === "advice"
                          ? item
                          : type === "symptoms" && item?.name?.length > 0
                          ? item.name[0]?.toUpperCase() + item.name?.slice(1)
                          : type === "medications" || type === "tests"
                          ? item?.refinedName
                          : item?.name}
                      </span>
                    )}

                    {/* Editable input for lineItem */}
                    {(type === "medications" ||
                      type === "symptoms" ||
                      type === "vaccinations" ||
                      type === "medicalHistory" ||
                      type === "tests") &&
                      item?.lineItem &&
                      (activeIndex === index &&
                      activeType === `${type}-lineItem` ? (
                        <input
                          type="text"
                          value={editableLineItem}
                          className="editable-digitised-item"
                          onChange={handleLineItemChange}
                          onBlur={() => handleLineItemBlur(type, index)}
                          autoFocus
                          style={{ width: `${lineItemWidth + 10}px` }} // Add padding for better UX
                        />
                      ) : (
                        <span
                          onClick={() => handleLineItemClick(type, index)}
                          className="digitised-item"
                        >
                          {`(${item.lineItem})`}
                        </span>
                      ))}

                    {/* Editable input for notes (lineItem) */}
                    {(type === "examination" || type === "diagnosis") &&
                      item?.notes &&
                      (activeIndex === index &&
                      activeType === `${type}-lineItem` ? (
                        <input
                          type="text"
                          value={editableLineItem}
                          className="editable-digitised-item"
                          onChange={handleLineItemChange}
                          onBlur={() => handleLineItemBlur(type, index)}
                          autoFocus
                          style={{ width: `${lineItemWidth + 10}px` }} // Add padding for better UX
                        />
                      ) : (
                        <span
                          onClick={() => handleLineItemClick(type, index)}
                          className="digitised-item"
                        >
                          {`(${item.notes})`}
                        </span>
                      ))}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  };

  const hasValidContent = (type) => {
    if (!data[type] || !Array.isArray(data[type])) return false;

    return data[type].some((item) => {
      if (typeof item === "string") return item.trim().length > 0;

      // For object types, check if any relevant fields have content
      const relevantFields = {
        medications: ["refinedName", "lineItem"],
        symptoms: ["name", "lineItem"],
        examination: ["name", "notes"],
        diagnosis: ["name", "notes"],
        medicalHistory: ["name", "lineItem"],
        vaccinations: ["name", "lineItem"],
        tests: ["refinedName", "lineItem"],
      };

      const fieldsToCheck = relevantFields[type] || ["name"];
      return fieldsToCheck.some((field) => item[field]?.trim?.().length > 0);
    });
  };

  return (
    <div className="digitised-container">
      {loading ? (
        // TODO:INTEL - PROGRESS BAR TO BE HANDLED
        <GenRXLoaders isProcessing={true} />
      ) : (
        // Show actual content when not loading
        <>
          {data?.vitals &&
            Object.values(data.vitals).some(
              (value) => value?.trim?.().length > 0
            ) && (
              <>
                <div className="title-digitise-section mb-2">Vitals</div>
                {renderItems("vitals")}
              </>
            )}

          {data?.medicalHistory && hasValidContent("medicalHistory") && (
            <>
              <div className="title-digitise-section mb-2">Medical History</div>
              {renderItems("medicalHistory")}
            </>
          )}

          {data?.symptoms && hasValidContent("symptoms") && (
            <>
              <div className="title-digitise-section mb-2">Symptoms</div>
              {renderItems("symptoms")}
            </>
          )}

          {data?.examination && hasValidContent("examination") && (
            <>
              <div className="title-digitise-section mb-2">Examination</div>
              {renderItems("examination")}
            </>
          )}

          {data?.diagnosis && hasValidContent("diagnosis") && (
            <>
              <div className="title-digitise-section mb-2">Diagnosis</div>
              {renderItems("diagnosis")}
            </>
          )}

          {data?.medications && hasValidContent("medications") && (
            <>
              <div className="title-digitise-section mb-2">Medicine</div>
              {renderItems("medications")}
            </>
          )}

          {data?.tests && hasValidContent("tests") && (
            <>
              <div className="title-digitise-section mb-2">
                Lab Investigation
              </div>
              {renderItems("tests")}
            </>
          )}

          {data?.advice && hasValidContent("advice") && (
            <>
              <div className="title-digitise-section mb-2">Advices</div>
              {renderItems("advice")}
            </>
          )}

          {data?.vaccinations && hasValidContent("vaccinations") && (
            <>
              <div className="title-digitise-section mb-2">Vaccination</div>
              {renderItems("vaccinations")}
            </>
          )}

          {data?.followUp && (
            <>
              <div className="title-digitise-section mb-2">Follow Up</div>
              {renderItems("followUp")}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DigitisedPrescription;
