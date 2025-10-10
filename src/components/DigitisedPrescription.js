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
  "followUp",
  "dynamicFields",
  "others",
  "labResults"
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

  if (type === "dynamicFields") {
    return { title: t, notes: "" };
  }

  if (type === "others") {
    return t;
  }

  if (type === "labResults") {
    return { testname: t, value: "", notes: "" };
  }

  
  return { name: t, lineItem: "" };
};

const getPrimaryText = (type, item) => {
  if (type === "advice") return typeof item === "string" ? item : "";
  if (type === "medications" || type === "tests") return item?.refinedName || item?.name || "";
  if (type === "dynamicFields") return item?.title || "";
  if (type === "others") return typeof item === "string" ? item : "";
  if (type === "labResults") return item?.testname || "";
  return item?.name || "";
};

const DigitisedPrescription = ({ data, setData, loading, showAbsHeaderInsideLoader = false }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [editableText, setEditableText] = useState("");
  const [editableLineItem, setEditableLineItem] = useState("");
  const [editableKey, setEditableKey] = useState("");
  const [editableValue, setEditableValue] = useState("");
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
      handleInputBlur("vitals", key);
      setVisibleSection("vitals");
      editingRef.current = true;
    
      let newKey = "";
      setData((prev) => {
        const vitals = { ...(prev.vitals || {}) };
        newKey = nextVitalsKey(vitals);
        vitals[newKey] = "";
        return { ...prev, vitals };
      });

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

        if (type === "vitals-key") {
          const newKey = (editableKey || "").trim()
            .replace(/\s+/g, '')
            .replace(/^(.)/, c => c.toLowerCase());
          if (newKey && newKey !== index) {
            const v = { ...(updatedData.vitals || {}) };
            const value = v[index];
            delete v[index];
            v[newKey] = value;
            updatedData.vitals = v;
          }
          return updatedData;
        }
        
        if (type === "vitals") {
          const val = (editableText || "").trim();
          const v = { ...(updatedData.vitals || {}) };
          if (val) v[index] = val;
          updatedData.vitals = v;
          return updatedData;
        }
        if (type === "labResults") {
          const val = (editableText || "").trim();
          const arr = [...(updatedData.labResults || [])];
          if (val) {
            arr[index] = { ...arr[index], testname: val };
          }
          updatedData.labResults = arr;
          return updatedData;
        }
        if (type === "followUp") {
          updatedData.followUp = editableText.trim();
          return updatedData;
        } else if (ARRAY_SECTIONS.includes(type)) {
          let arr = [...(updatedData[type] || [])];
          const item = arr[index];

          const val = (editableText || "").trim();
          if (type === "advice" || type === "others") {
            arr[index] = (editableText || "").trim();
          } else if (type === "medications" || type === "tests") {
            if (val) {
              arr[index] = {
                ...item,
                name: item?.name || val,
                refinedName: val,
              };
            } else {
              arr[index] = "";
            }
          } else if (type === "dynamicFields") {
            if (val) {
              arr[index] = { ...item, title: val };
            } else {
              arr[index] = "";
            }
          } else if (type === "labResults") {
            if (val) {
              arr[index] = { ...item, testname: val };
            } else {
              arr[index] = "";
            }
          } else {
            if (val) {
              arr[index] = { ...item, name: val };
            } else {
              arr[index] = "";
            }
          }
          if (type === "advice" || type === "others") {
            arr = arr.filter((v) => typeof v === "string" && v.trim() !== "");
          } else if (type === "medications" || type === "tests") {
            arr = arr.filter(
              (v) =>
                v &&
                ((typeof v === "object" &&
                  ((v.name && v.name.trim() !== "") ||
                    (v.refinedName && v.refinedName.trim() !== ""))) ||
                  (typeof v === "string" && v.trim() !== ""))
            );
          } else if (type === "dynamicFields") {
            arr = arr.filter(
              (v) =>
                v &&
                typeof v === "object" &&
                v.title &&
                v.title.trim() !== ""
            );
          } else if (type === "labResults") {
            arr = arr.filter(
              (v) =>
                v &&
                typeof v === "object" &&
                v.testname &&
                v.testname.trim() !== ""
            );
          } else {
            arr = arr.filter(
              (v) =>
                v &&
                typeof v === "object" &&
                v.name &&
                v.name.trim() !== ""
            );
          }
          updatedData[type] = arr;
        }

        return updatedData;
      });

      setShowSuggestions(false);
      setActiveIndex(null);
      setActiveType(null);
      setEditableText("");
      setEditableKey("");
    },
    [activeIndex, activeType, editableText, editableKey, setData]
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
          if (activeType.includes('-value')) {
            handleValueBlur(activeType, activeIndex);
          } else if (!editableLineItem) {
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
          if (activeType.includes('-value')) {
            handleValueBlur(activeType, activeIndex);
          } else if (!editableLineItem) {
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
          setEditableValue("");
          editingRef.current = false;
          
          setIoAutoFocusEnabled(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeIndex, activeType, handleInputBlur, visibleSection, editableLineItem, editableText, editableValue]);

  
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
      if (itemType === "diagnosis" || itemType === "examination" || itemType === "dynamicFields") {
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
  const handleValueChange = (e) => setEditableValue(e.target.value);

  const handleValueBlur = (type, index, currentValue = null) => {
    const itemType = type?.split('-')?.[0];
    const valueToSave = currentValue !== null ? currentValue : editableValue;
    setData((prevData) => {
      const updatedData = { ...prevData };
      const arr = [...(updatedData[itemType] || [])];
      if (itemType === "labResults") {
        arr[index] = { ...arr[index], value: valueToSave || "" };
      }
      updatedData[itemType] = arr;
      return updatedData;
    });
    setEditableValue("");
    setActiveIndex(null);
    setActiveType(null);
    setEditableText("");
    setEditableKey("");
  };

  
  const handleItemClick = (type, index) => {
    if (activeIndex !== null && activeType !== null) {
      if (activeType.includes('-value')) {
        handleValueBlur(activeType, activeIndex);
      } else {
        handleInputBlur(activeType, activeIndex);
      }
    }

    if (type === "vitals-key") {
      const isNumberKey = /^\d+$/.test(index);
      const label = isNumberKey
        ? index
        : index.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
      setEditableKey(label);
    } else if (type === "vitals") {
      setEditableText(data.vitals[index] || "");
    } else if (type === "followUp") {
      setEditableText(data?.followUp);
    } else if (ARRAY_SECTIONS.includes(type)) {
      const item = data[type][index];
      setEditableText(type === "advice" ? data[type][index] : getPrimaryText(type, item));
    }

    setActiveIndex(index);
    setActiveType(type);
  };

  
  const handleLineItemClick = (type, index) => {
    const src = data[type][index];
    setEditableLineItem(type === "diagnosis" || type === "examination" || type === "dynamicFields" ? src?.notes : src?.lineItem);
    setActiveIndex(index);
    setActiveType(`${type}-lineItem`);
  };

  const handleValueClick = (type, index) => {
    if (activeIndex !== null && activeType !== null) {
      if (activeType.includes('-value')) {
        handleValueBlur(activeType, activeIndex);
      } else {
        handleInputBlur(activeType, activeIndex);
      }
    }
    const src = data[type][index];
    setEditableValue(src?.value || "");
    setActiveIndex(index);
    setActiveType(`${type}-value`);
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
      if (type === "advice" || type === "others") {
        arr[index] = currentText;
      } else if (type === "medications" || type === "tests") {
        const name = isLineItem ? cur?.name || prev[type]?.name : currentText || cur?.name;
        const lineItem = isLineItem ? currentText || cur?.lineItem || prev[type]?.lineItem : cur?.lineItem;
        arr[index] = currentText ? { ...(cur || {}), name, refinedName: name, lineItem } : cur;
      } else if (type === "dynamicFields") {
        const title = isLineItem ? cur?.title || prev[type]?.title : currentText || cur?.title;
        const notes = isLineItem ? currentText || cur?.notes || prev[type]?.notes : cur?.notes;
        arr[index] = { ...cur, title, notes };
      } else if (type === "labResults") {
        const testname = isLineItem ? cur?.testname || prev[type]?.testname : currentText || cur?.testname;
        const notes = isLineItem ? currentText || cur?.notes || prev[type]?.notes : cur?.notes;
        const value = activeType === `${type}-value` ? editableValue || cur?.value || prev[type]?.value : cur?.value;
        arr[index] = { ...cur, testname, notes, value };
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
              let keyWidth = 0;
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
              if (activeIndex === key && activeType === "vitals-key") {
                const temp = document.createElement("span");
                temp.style.visibility = "hidden";
                temp.style.position = "absolute";
                temp.style.whiteSpace = "nowrap";
                temp.innerText = editableKey || "";
                document.body.appendChild(temp);
                keyWidth = temp.offsetWidth;
                document.body.removeChild(temp);
              }

              const isNumberKey = /^\d+$/.test(key);
              const label = isNumberKey
                ? `${key}: `
                : `${key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}: `;


              return (
                <li key={key}>
                  <div className="medicine-item">
                    {activeIndex === key && activeType === "vitals-key" ? (
                      <input
                        ref={inputRef}
                        data-vitals-key={key}
                        type="text"
                        value={editableKey}
                        className="editable-digitised-item"
                        onChange={(e) => setEditableKey(e.target.value)}
                        onBlur={() => {
                          editingRef.current = false;
                          handleInputBlur("vitals-key", key);
                        }}
                        onFocus={() => { editingRef.current = true; setVisibleSection("vitals"); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleInputBlur("vitals-key", key);
                          }
                        }}
                        autoFocus
                        style={{ width: `clamp(12px, ${keyWidth + 10}px, 100%)` }}
                      />
                    ) : (
                      <span
                        onClick={() => handleItemClick("vitals-key", key)}
                        className="digitised-item"
                      >
                        {label}
                      </span>
                    )}
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
                        onFocus={() => { editingRef.current = true; setVisibleSection("vitals"); }}
                        autoFocus
                        style={{ width: `clamp(12px, ${textWidth + 10}px, 100%)` }}
                      />
                    ) : (
                      <span
                        onClick={() => handleItemClick("vitals", key)}
                        className="digitised-item"
                      >
                        {value || "_"}
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

  
  const renderFollowUp = () => {
    let textWidth = 0;
    let lineItemWidth = 0;
    if (activeType === "followUp") {
      const temp = document.createElement("span");
      temp.style.visibility = "hidden";
      temp.style.position = "absolute";
      temp.style.whiteSpace = "nowrap";
      temp.innerText = editableText || "";
      document.body.appendChild(temp);
      textWidth = temp.offsetWidth;
      document.body.removeChild(temp);
    }
    return (
      <div className="medicine-item digitised-rx-follow-up-item">
        {activeType === "followUp" ? (
          <input
            type="text"
            value={editableText}
            className="editable-digitised-item"
            onChange={handleInputChange}
            onBlur={() => {
              editingRef.current = false;
              handleInputBlur("followUp");
            }}
            onFocus={() => {
              editingRef.current = true;
              setVisibleSection("followUp");
            }}
            autoFocus
            style={{ width: `clamp(12px, ${textWidth + 10}px, 100%)` }}
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
    );
  };
  const renderArraySection = (type) => {
    return (
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
              let valueWidth = 0;
  
              
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

              // Calculate width for value input
              if (activeIndex === index && activeType === `${type}-value`) {
                const temp3 = document.createElement("span");
                temp3.style.visibility = "hidden";
                temp3.style.position = "absolute";
                temp3.style.whiteSpace = "nowrap";
                temp3.innerText = editableValue || "";
                document.body.appendChild(temp3);
                valueWidth = temp3.offsetWidth;
                document.body.removeChild(temp3);
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
                        style={{ width: `clamp(12px, ${textWidth + 10}px, 100%)` }}
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
                          style={{ width: `clamp(12px, ${lineItemWidth + 10}px, 100%)` }}
                        />
                      ) : (
                        <span
                          onClick={() => handleLineItemClick(type, index)}
                          className="digitised-item"
                        >
                          {`(${item.lineItem})`}
                        </span>
                      ))}

                    {/* Special handling for labResults - testname: value format */}
                    {type === "labResults" && (
                      <>
                        {/* Colon separator - always visible */}
                        <span className="digitised-item">: </span>
                        
                        {/* Editable value */}
                        {item?.value &&
                          (activeIndex === index && activeType === `${type}-value` ? (
                            <input
                              type="text"
                              value={editableValue}
                              className="editable-digitised-item"
                              onChange={handleValueChange}
                              onBlur={(e) => {
                                editingRef.current = false;
                                handleValueBlur(activeType, activeIndex, e.target.value);
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
                              style={{ width: `clamp(12px, ${valueWidth + 10}px, 100%)` }}
                            />
                          ) : (
                            <span
                              onClick={() => handleValueClick(type, index)}
                              className="digitised-item"
                            >
                              {item.value}
                            </span>
                          ))}
                      </>
                    )}

                    {/* Editable input for notes (examination/diagnosis/dynamicFields) */}
                    {(type === "examination" || type === "diagnosis" || type === "dynamicFields") &&
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
                          style={{ width: `clamp(12px, ${lineItemWidth + 10}px, 100%)` }}
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
        ) : (
          <>
          {type === "followUp" && renderFollowUp()}
          </>
        )}
      </div>
    );
  } 

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
        dynamicFields: ["title", "notes"],
        others: ["name"],
        labResults: ["testname", "value", "notes"],
      }[type] || ["name"];
      return relevant.some((f) => item[f]?.trim?.()?.length > 0);
    });
  };

  
  return (
    <div
      className={
        loading ? "loading-digitised-container" : "digitised-container"
      }
      ref={containerRef}
    >
      {loading ? (
        <GenRXLoaders
          showAbsHeaderInsideLoader={showAbsHeaderInsideLoader}
          isProcessing={true}
          isSnapRx={true}
        />
      ) : (
        <>
          {data?.vitals &&
            Object.values(data.vitals).some((v) => v?.trim?.()?.length > 0) && (
              <div
                ref={(el) => (sectionRefs.current["vitals"] = el)}
                className="title-digitise-section-wrapper"
              >
                <div className="title-digitise-section mb-2">Vitals</div>
                {renderVitals()}
              </div>
            )}

          {data?.medicalHistory && hasValidContent("medicalHistory") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Medical History</div>
              {renderArraySection("medicalHistory")}
            </div>
          )}

          {data?.symptoms && hasValidContent("symptoms") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Symptoms</div>
              {renderArraySection("symptoms")}
            </div>
          )}

          {data?.examination && hasValidContent("examination") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Examination</div>
              {renderArraySection("examination")}
            </div>
          )}

          {data?.diagnosis && hasValidContent("diagnosis") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Diagnosis</div>
              {renderArraySection("diagnosis")}
            </div>
          )}

          {data?.medications && hasValidContent("medications") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Medicine</div>
              {renderArraySection("medications")}
            </div>
          )}

          {data?.tests && hasValidContent("tests") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">
                Lab Investigation
              </div>
              {renderArraySection("tests")}
            </div>
          )}

          {data?.advice && hasValidContent("advice") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Advices</div>
              {renderArraySection("advice")}
            </div>
          )}

          {data?.vaccinations && hasValidContent("vaccinations") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Vaccination</div>
              {renderArraySection("vaccinations")}
            </div>
          )}

          {data?.followUp && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Follow Up</div>
              {renderArraySection("followUp")}
            </div>
          )}

          {data?.labResults && hasValidContent("labResults") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Lab Results</div>
              {renderArraySection("labResults")}
            </div>
          )}

          {data?.dynamicFields && hasValidContent("dynamicFields") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Dynamic Modules</div>
              {renderArraySection("dynamicFields")}
            </div>
          )}

          {data?.others && hasValidContent("others") && (
            <div className="title-digitise-section-wrapper">
              <div className="title-digitise-section mb-2">Others</div>
              {renderArraySection("others")}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DigitisedPrescription;
