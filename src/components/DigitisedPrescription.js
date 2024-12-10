import { Button } from "antd";
import React, { useState, useEffect, useRef } from "react";

const DigitisedPrescription = ({ data, setData }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [editableText, setEditableText] = useState("");
  const [editableLineItem, setEditableLineItem] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    //loading for 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  // Handle input blur (closing edit mode)
  const handleInputBlur = (type, index) => {
    if (activeIndex !== null && activeType !== null) {
      setData((prevData) => {
        const updatedData = { ...prevData };

        if (type === "medications" || type === "tests" || type === "vaccinations") {
          updatedData[type][index].name = editableText; // Update editable text for medications/tests
        } else if (
          type === "symptoms" ||
          type === "examination" ||
          type === "diagnosis" ||
          type === "medicalHistory"
        ) {
          updatedData[type][index].name = editableText; // Update editable text for symptoms/examination/diagnosis
        } else if (type === "advice") {
          updatedData[type][index] = editableText; // Update advice text
        } else if (type === "vitals") {
          updatedData.vitals[index] = editableText; // Handle vitals separately
        }
        return updatedData;
      });
    }

    setShowSuggestions(false);
    setActiveIndex(null);
    setActiveType(null);
    setEditableText(""); // Clear editable text after blur
  };

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
      updatedData[type][index].lineItem = editableLineItem; // Update lineItem with the new value
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
      handleInputBlur(activeType, activeIndex); // Blur the previous active item to save its changes
    }

    if (type === 'medications' || type === 'tests' || type === "vaccinations") {
      setEditableText(data[type][index].name);
      setShowSuggestions(true);
    } else if (type === 'symptoms' || type === "examination" || type === "diagnosis" || type === "medicalHistory") {
      setEditableText(data[type][index].name);
    } else if (type === 'advice') {
      setEditableText(data[type][index]);
    } else if (type === "vitals") {
      setEditableText(data.vitals[index] || ""); // Set editable text to current vital value
      setActiveIndex(index); // Set the active vital index
      setActiveType("vitals"); // Set the active type to 'vitals'
    }
    setActiveIndex(index);
    setActiveType(type);
  };

  // Handle click on a lineItem (to edit)
  const handleLineItemClick = (type, index) => {
    if (type === "medications" || type === "tests" || type === "vaccinations" || type === "medicalHistory") {
      setEditableLineItem(data[type][index]?.lineItem);
    } else {
      setEditableLineItem(data[type][index]?.notes);
    }
    setActiveIndex(index);
    setActiveType(`${type}-lineItem`);
  };

  const renderItems = (type) => {
    // Check if type is 'vitals' and handle accordingly
    if (type === "vitals") {
      return (
        <div className="digitised-section">
          {loading ? (
            <div className="shimmer-container">
              <div className="shimmer"></div>
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
            <div className="shimmer"></div>
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
                          : item?.name}
                      </span>
                    )}

                    {/* Editable input for lineItem */}
                    {(type === "medications" || type === "symptoms" || type === "vaccinations" || type === "medicalHistory") &&
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
                    {(type === "examination" ||
                      type === "diagnosis" ) &&
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

  return (
    <div className="digitised-container">
      {data?.vitals && Object.values(data.vitals).some((value) => value) && (
        <>
          <div className="title-digitise-section mb-2">Vitals</div>
          {renderItems("vitals")}
        </>
      )}

      {data?.medicalHistory && data.medicalHistory.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Medical History</div>
          {renderItems("medicalHistory")}
        </>
      )}

      {data?.symptoms && data.symptoms.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Symptoms</div>
          {renderItems("symptoms")}
        </>
      )}

      {data?.examination && data.examination.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Examination</div>
          {renderItems("examination")}
        </>
      )}

      {data?.diagnosis && data.diagnosis.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Diagnosis</div>
          {renderItems("diagnosis")}
        </>
      )}

      {data?.medications && data.medications.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Medicine</div>
          {renderItems("medications")}
        </>
      )}

      {data?.tests && data.tests.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Tests</div>
          {renderItems("tests")}
        </>
      )}

      {data?.advice && data.advice.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Advices</div>
          {renderItems("advice")}
        </>
      )}

      {data?.vaccinations && data.vaccinations.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Vaccination</div>
          {renderItems('vaccinations')}
        </>
      )}
    </div>
  );
};

export default DigitisedPrescription;
