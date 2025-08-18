import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import GenRXLoaders from "./GenRxLoaders";


export const ARRAY_SECTIONS = [
  "symptoms",
  "medicalHistory",
  "examination",
  "diagnosis",
  "medications",
  "tests",
  "vaccinations",
  "advice",
  
];

export const normalizeNewItem = (type, text = "") => {
  const t = (text ?? "").trim();

  if (type === "advice") return t; 

  if (type === "medications" || type === "tests") {
    return {
      name: t,
      refinedName: t,
      frequency: "",
      dosage: "",
      schedule: "",
      duration: "",
      notes: "",
      lineItem: "",
      suggestions: [],
    };
  }

  if (type === "examination" || type === "diagnosis") {
    return { name: t, notes: "", lineItem: "" };
  }

  
  return { name: t, lineItem: "" };
};

const getPrimaryText = (type, item) => {
  if (type === "advice") return typeof item === "string" ? item : "";
  if (type === "medications" || type === "tests") return item?.refinedName || item?.name || "";
  return item?.name || "";
};

const DigitisedPrescription = ({ data, setData, loading }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [editableText, setEditableText] = useState("");
  const [editableLineItem, setEditableLineItem] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [ioAutoFocusEnabled, setIoAutoFocusEnabled] = useState(true);
  const editingRef = useRef(false);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);
  
  const containerRef = useRef(null);
  const sectionRefs = useRef({}); 
  const [visibleSection, setVisibleSection] = useState(null);

  
  const renderedSections = useMemo(() => {
    const order = [];
    if (data?.vitals && Object.values(data.vitals || {}).some((v) => v?.trim?.()?.length)) {
      order.push("vitals");
    }
    ARRAY_SECTIONS.forEach((s) => {
      if (Array.isArray(data?.[s]) && data[s].length > 0) {
        order.push(s);
      }
    });
    return order;
  }, [data]);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (editingRef.current) return;
        const firstVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (firstVisible) {
          const sec = firstVisible.target.dataset.section;
          setVisibleSection(sec);
        }
      },
      {
        root,
        threshold: 0.2, 
      }
    );

    renderedSections.forEach((sec) => {
      const el = sectionRefs.current[sec];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [renderedSections]);

  
  useEffect(() => {
    if (activeType !== null) return;
    if (!visibleSection) return;
    if (!ARRAY_SECTIONS.includes(visibleSection)) return;
    if (!ioAutoFocusEnabled) return;
    const arr = data?.[visibleSection];
    if (!Array.isArray(arr) || arr.length === 0) return;
    const lastIndex = arr.length - 1;
    const lastItem = arr[lastIndex];
    const text = getPrimaryText(visibleSection, lastItem);

    setActiveType(visibleSection);
    setActiveIndex(lastIndex);
    setEditableText(text);
    setTimeout(() => {
      const el = sectionRefs.current[visibleSection]?.querySelector("input");
      el?.focus?.();
    }, 0);
    setIoAutoFocusEnabled(false);
  }, [visibleSection, data, activeType, ioAutoFocusEnabled]);

  const nextVitalsKey = (vitals = {}) => {
    const nums = Object.keys(vitals)
      .map((k) => parseInt(k, 10))
      .filter((n) => Number.isFinite(n));
    return String((nums.length ? Math.max(...nums) : 0) + 1);
  };

  const handleEnterInVitals = (key) => {
      // Save the current field first
      handleInputBlur("vitals", key);
      setVisibleSection("vitals");
      editingRef.current = true;
    
      let newKey = "";
      setData((prev) => {
        const vitals = { ...(prev.vitals || {}) };
        newKey = nextVitalsKey(vitals);
        vitals[newKey] = ""; // blank line inside vitals
        return { ...prev, vitals };
      });
    
      // focus the new input
      setTimeout(() => {
        setActiveType("vitals");
        setActiveIndex(newKey);
        setEditableText("");
        sectionRefs.current["vitals"]
          ?.querySelector(`input[data-vitals-key="${newKey}"]`)
          ?.focus?.();
      }, 0);
    };
  
  
  const handleInputBlur = useCallback(
    (type, index) => {
      if (activeIndex === null || activeType === null) return;

      setData((prevData) => {
        const updatedData = { ...prevData };

        if (type === "vitals") {
          const val = (editableText || "").trim();
          const v = { ...(updatedData.vitals || {}) };
          if (val) v[index] = val;
          else delete v[index];
          updatedData.vitals = v;
          return updatedData;
        }

        if (ARRAY_SECTIONS.includes(type)) {
          const arr = [...(updatedData[type] || [])];
          const item = arr[index];

          const val = (editableText || "").trim();
          if (type === "advice") {
            arr[index] = (editableText || "").trim();
            if (!arr[index]) arr.splice(index, 1);
          } else if (type === "medications" || type === "tests") {
            if (!val) { arr.splice(index, 1); }
            else {
              arr[index] = {
                ...item,
                name: item?.name || val,
                refinedName: val,
              };
            }
          } else {
            if (!val) { arr.splice(index, 1); }
            else { arr[index] = { ...item, name: val }; }
          }
          updatedData[type] = arr;
        }

        return updatedData;
      });

      setShowSuggestions(false);
      setActiveIndex(null);
      setActiveType(null);
      setEditableText("");
    },
    [activeIndex, activeType, editableText, setData]
  );

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        if (activeType !== null) {
          if (!editableLineItem) {
            handleInputBlur(activeType, activeIndex)
          } else {
            handleLineItemBlur(activeType, activeIndex);
          }
        };
      }
      const target = event.target;
      const inActiveInput =
        inputRef.current && inputRef.current.contains(target);
      const inSuggestions =
        suggestionRef.current && suggestionRef.current.contains(target);
      
      const sectionEl =
        visibleSection && sectionRefs.current[visibleSection]
          ? sectionRefs.current[visibleSection]
          : null;
      const clickedInsideHighlighted =
        sectionEl && sectionEl.contains(target);
      if (!inActiveInput && !inSuggestions) {
        
        if (activeType !== null) {
          if (!editableLineItem) {
            handleInputBlur(activeType, activeIndex)
          } else {
            handleLineItemBlur(activeType, activeIndex);
          }
        };
        
        if (!clickedInsideHighlighted) {
          setVisibleSection(null);
          setActiveType(null);
          setActiveIndex(null);
          setEditableText("");
          editingRef.current = false;
          
          setIoAutoFocusEnabled(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeIndex, activeType, handleInputBlur, visibleSection, editableLineItem, editableText]);

  
  const handleSuggestionClick = (type, index, suggestion) => {
    setData((prevData) => {
      const updatedData = { ...prevData };
      if (type === "medications" || type === "tests") {
        updatedData[type][index].name = suggestion;
      } else if (type === "symptoms" || type === "examination" || type === "diagnosis") {
        updatedData[type][index].name = suggestion;
      } else if (type === "advice") {
        updatedData[type][index] = suggestion;
      }
      return updatedData;
    });
    setShowSuggestions(false);
    setEditableText(suggestion);
    setActiveIndex(null);
    setActiveType(null);
  };

  
  const handleLineItemBlur = (type, index) => {
    const itemType = type?.split('-')?.[0];
    setData((prevData) => {
      const updatedData = { ...prevData };
      const arr = [...(updatedData[itemType] || [])];
      if (itemType === "diagnosis" || itemType === "examination") {
        arr[index] = { ...arr[index], notes: editableLineItem };
      } else {
        arr[index] = { ...arr[index], lineItem: editableLineItem };
      }
      updatedData[itemType] = arr;
      return updatedData;
    });
    setEditableLineItem("")
    setActiveIndex(null);
    setActiveType(null);
  };

  const handleInputChange = (e) => setEditableText(e.target.value);
  const handleLineItemChange = (e) => setEditableLineItem(e.target.value);

  
  const handleItemClick = (type, index) => {
    if (activeIndex !== null && activeType !== null) {
      handleInputBlur(activeType, activeIndex);
    }

    if (type === "vitals") {
      setEditableText(data.vitals[index] || "");
    } else if (ARRAY_SECTIONS.includes(type)) {
      const item = data[type][index];
      setEditableText(type === "advice" ? data[type][index] : getPrimaryText(type, item));
    }

    setActiveIndex(index);
    setActiveType(type);
  };

  
  const handleLineItemClick = (type, index) => {
    const src = data[type][index];
    setEditableLineItem(type === "diagnosis" || type === "examination" ? src?.notes : src?.lineItem);
    setActiveIndex(index);
    setActiveType(`${type}-lineItem`);
  };

  
  const handleEnterToInsert = (type, index, isLineItem = false) => {
    if (!ARRAY_SECTIONS.includes(type)) return;
    setVisibleSection(type);
    editingRef.current = true;
    setData((prev) => {
      const updated = { ...prev };
      const arr = Array.isArray(updated[type]) ? [...updated[type]] : [];
      const cur = arr[index];
    
      const currentText = (isLineItem ? editableLineItem : editableText ?? "").trim();
      if (type === "advice") {
        arr[index] = currentText;
      } else if (type === "medications" || type === "tests") {
        const name = isLineItem ? cur?.name || prev[type]?.name : currentText || cur?.name;
        const lineItem = isLineItem ? currentText || cur?.lineItem || prev[type]?.lineItem : cur?.lineItem;
        arr[index] = currentText ? { ...(cur || {}), name, refinedName: name, lineItem } : cur;
      } else {
        const name = isLineItem ? cur?.name || prev[type]?.name : currentText || cur?.name;
        const lineItem = isLineItem ? currentText || cur?.lineItem || prev[type]?.lineItem : cur?.lineItem;
        arr[index] = { ...cur, name, lineItem, notes: lineItem };
      }
      arr.splice(index + 1, 0, normalizeNewItem(type, ""));
      updated[type] = arr;
      return updated;
    });

    
    setTimeout(() => {
      setActiveType(type);
      setActiveIndex(index + 1);
      setEditableText("");
      setEditableLineItem("");
      const sec = sectionRefs.current[type];
      const inputs = sec?.querySelectorAll("input");
      inputs?.[index + 1]?.focus?.();
    }, 0);
  };

  

  
  const renderVitals = () => (
     <div
       data-section="vitals"
       ref={(el) => (sectionRefs.current["vitals"] = el)}
       className={`digitised-section-rx ${visibleSection === "vitals" ? "highlight-blue" : ""}`}
     >
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
          {Object.entries(data.vitals || {}).map(([key, value]) => {
              
              let textWidth = 0;
              if (activeIndex === key && activeType === "vitals") {
                const temp = document.createElement("span");
                temp.style.visibility = "hidden";
                temp.style.position = "absolute";
                temp.style.whiteSpace = "nowrap";
                temp.innerText = editableText || "";
                document.body.appendChild(temp);
                textWidth = temp.offsetWidth;
                document.body.removeChild(temp);
              }

              const isNumberKey = /^\d+$/.test(key);
              const label = isNumberKey
                ? `${key}: `
                : `${key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}: `;


              return (
                <li key={key}>
                  <div className="medicine-item">
                    <span className="digitised-item">{label}</span>
                    {activeIndex === key && activeType === "vitals" ? (
                      <input
                        ref={inputRef}
                        data-vitals-key={key}
                        type="text"
                        value={editableText}
                        className="editable-digitised-item"
                        onChange={(e) => setEditableText(e.target.value)}
                        onBlur={() => {
                          editingRef.current = false;
                          handleInputBlur("vitals", key);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleEnterInVitals(key);
                          }
                        }}
                        onFocus={() => { editingRef.current = true; setVisibleSection("vitals"); }}
                        autoFocus
                        style={{ width: `${textWidth + 10}px` }}
                      />
                    ) : (
                      <span
                        onClick={() => handleItemClick("vitals", key)}
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

  
  const renderArraySection = (type) => (
    <div data-section={type} ref={(el) => (sectionRefs.current[type] = el)} className={`digitised-section-rx ${visibleSection === type ? "highlight-blue" : ""}`}>
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
            let textWidth = 0;
            let lineItemWidth = 0;

            
            if (activeIndex === index && activeType === type) {
              const temp = document.createElement("span");
              temp.style.visibility = "hidden";
              temp.style.position = "absolute";
              temp.style.whiteSpace = "nowrap";
              temp.innerText = editableText || "";
              document.body.appendChild(temp);
              textWidth = temp.offsetWidth;
              document.body.removeChild(temp);
            }

            
            if (activeIndex === index && activeType === `${type}-lineItem`) {
              const temp2 = document.createElement("span");
              temp2.style.visibility = "hidden";
              temp2.style.position = "absolute";
              temp2.style.whiteSpace = "nowrap";
              temp2.innerText = editableLineItem || "";
              document.body.appendChild(temp2);
              lineItemWidth = temp2.offsetWidth;
              document.body.removeChild(temp2);
            }

            const primaryDisplay = getPrimaryText(type, item);

            return (
              <li key={index}>
                <div className="medicine-item">
                  {activeIndex === index && activeType === type ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editableText}
                      className="editable-digitised-item"
                      onChange={handleInputChange}
                      onBlur={() => {
                        editingRef.current = false;
                        handleInputBlur(type, index);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleEnterToInsert(type, index);
                        }
                      }}
                      autoFocus
                      onFocus={() => {
                        editingRef.current = true;
                        setVisibleSection(type);
                      }}
                      style={{ width: `${textWidth + 10}px` }}
                    />
                  ) : (
                    <span
                      onClick={() => handleItemClick(type, index)}
                      className="digitised-item"
                    >
                      {primaryDisplay}
                    </span>
                  )}

                  {/* Editable input for lineItem (not for advice/userAdded) */}
                  {(type === "medications" ||
                    type === "symptoms" ||
                    type === "vaccinations" ||
                    type === "medicalHistory" ||
                    type === "tests") &&
                    item?.lineItem &&
                    (activeIndex === index && activeType === `${type}-lineItem` ? (
                      <input
                        type="text"
                        value={editableLineItem}
                        className="editable-digitised-item"
                        onChange={handleLineItemChange}
                        onBlur={() => {
                          editingRef.current = false;
                          setVisibleSection(type);
                          handleLineItemBlur(type, index);
                        }}
                        onFocus={() => { editingRef.current = true; setVisibleSection(type); }}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleEnterToInsert(type, index, true);
                          }
                        }}
                        style={{ width: `${lineItemWidth + 10}px` }}
                      />
                    ) : (
                      <span
                        onClick={() => handleLineItemClick(type, index)}
                        className="digitised-item"
                      >
                        {`(${item.lineItem})`}
                      </span>
                    ))}

                  {/* Editable input for notes (examination/diagnosis) */}
                  {(type === "examination" || type === "diagnosis") &&
                    item?.notes &&
                    (activeIndex === index && activeType === `${type}-lineItem` ? (
                      <input
                        type="text"
                        value={editableLineItem}
                        className="editable-digitised-item"
                        onChange={handleLineItemChange}
                        onBlur={() => {
                          editingRef.current = false;
                          handleLineItemBlur(type, index);
                        }}
                        onFocus={() => {
                          editingRef.current = true;
                          setVisibleSection(type);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleEnterToInsert(type, index, true);
                          }
                        }}
                        autoFocus
                        style={{ width: `${lineItemWidth + 10}px` }}
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

  const hasValidContent = (type) => {
    if (!data[type] || !Array.isArray(data[type])) return false;
    return data[type].some((item) => {
      if (typeof item === "string") return item.trim().length > 0;
      const relevant = {
        medications: ["refinedName", "lineItem"],
        symptoms: ["name", "lineItem"],
        examination: ["name", "notes"],
        diagnosis: ["name", "notes"],
        medicalHistory: ["name", "lineItem"],
        vaccinations: ["name", "lineItem"],
        tests: ["refinedName", "lineItem"],
      }[type] || ["name"];
      return relevant.some((f) => item[f]?.trim?.()?.length > 0);
    });
  };

  
  return (
    <div className="digitised-container" ref={containerRef}>
      {loading ? (
        <GenRXLoaders isProcessing={true} isSnapRx={true} />
      ) : (
        <>
          {data?.vitals &&
            Object.values(data.vitals).some((v) => v?.trim?.()?.length > 0) && (
              <div
                ref={(el) => (sectionRefs.current["vitals"] = el)}
                // data-section="vitals"
                className="title-digitise-section-wrapper"
              >
                <div className="title-digitise-section mb-2">Vitals</div>
                {renderVitals()}
              </div>
            )}

          {data?.medicalHistory && hasValidContent("medicalHistory") && (
            <div
              // ref={(el) => (sectionRefs.current["medicalHistory"] = el)}
              // data-section="medicalHistory"
              className="title-digitise-section-wrapper"
            >
              <div className="title-digitise-section mb-2">Medical History</div>
              {renderArraySection("medicalHistory")}
            </div>
          )}

          {data?.symptoms && hasValidContent("symptoms") && (
            <div
              // ref={(el) => (sectionRefs.current["symptoms"] = el)}
              // data-section="symptoms"
              className="title-digitise-section-wrapper"
            >
              <div className="title-digitise-section mb-2">Symptoms</div>
              {renderArraySection("symptoms")}
            </div>
          )}

          {data?.examination && hasValidContent("examination") && (
            <div
              // ref={(el) => (sectionRefs.current["examination"] = el)}
              // data-section="examination"
              className="title-digitise-section-wrapper"
            >
              <div className="title-digitise-section mb-2">Examination</div>
              {renderArraySection("examination")}
            </div>
          )}

          {data?.diagnosis && hasValidContent("diagnosis") && (
            <div
              // ref={(el) => (sectionRefs.current["diagnosis"] = el)}
              // data-section="diagnosis"
              className="title-digitise-section-wrapper"
            >
              <div className="title-digitise-section mb-2">Diagnosis</div>
              {renderArraySection("diagnosis")}
            </div>
          )}

          {data?.medications && hasValidContent("medications") && (
            <div
              // ref={(el) => (sectionRefs.current["medications"] = el)}
              // data-section="medications"
              className="title-digitise-section-wrapper"
            >
              <div className="title-digitise-section mb-2">Medicine</div>
              {renderArraySection("medications")}
            </div>
          )}

          {data?.tests && hasValidContent("tests") && (
            <div
              // ref={(el) => (sectionRefs.current["tests"] = el)}
              // data-section="tests"
              className="title-digitise-section-wrapper"
            >
              <div className="title-digitise-section mb-2">Lab Investigation</div>
              {renderArraySection("tests")}
            </div>
          )}

          {data?.advice && hasValidContent("advice") && (
            <div
              // ref={(el) => (sectionRefs.current["advice"] = el)}
              // data-section="advice"
              className="title-digitise-section-wrapper"
            >
              <div className="title-digitise-section mb-2">Advices</div>
              {renderArraySection("advice")}
            </div>
          )}

          {data?.vaccinations && hasValidContent("vaccinations") && (
            <div
              // ref={(el) => (sectionRefs.current["vaccinations"] = el)}
              // data-section="vaccinations"
              className="title-digitise-section-wrapper"
            >
              <div className="title-digitise-section mb-2">Vaccination</div>
              {renderArraySection("vaccinations")}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DigitisedPrescription;
