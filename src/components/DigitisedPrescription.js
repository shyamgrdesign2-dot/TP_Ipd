// import { Button } from "antd";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import GenRXLoaders from "./GenRxLoaders";
// const DigitisedPrescription = ({ data, setData, loading }) => {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [activeType, setActiveType] = useState(null);
//   const [editableText, setEditableText] = useState("");
//   const [editableLineItem, setEditableLineItem] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const suggestionRef = useRef(null);
//   const inputRef = useRef(null);

//   // Handle input blur (closing edit mode)
//   const handleInputBlur = useCallback(
//     (type, index) => {
//       if (activeIndex !== null && activeType !== null) {
//         setData((prevData) => {
//           const updatedData = { ...prevData };

//           if (type === "medications" || type === "tests") {
//             updatedData[type][index].refinedName = editableText.trim();
//           } else if (
//             type === "symptoms" ||
//             type === "examination" ||
//             type === "diagnosis" ||
//             type === "medicalHistory" ||
//             type === "vaccinations"
//           ) {
//             updatedData[type][index].name = editableText.trim();
//           } else if (type === "advice") {
//             updatedData[type][index] = editableText.trim();
//           } else if (type === "vitals") {
//             updatedData.vitals[index] = editableText.trim();
//           }
//           return updatedData; // Persist changes
//         });
//       }

//       setShowSuggestions(false);
//       setActiveIndex(null);
//       setActiveType(null);
//       setEditableText(""); // Clear editable text after blur
//     },
//     [activeIndex, activeType, editableText, setData]
//   );

//   // Handle click outside suggestion and input box
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         inputRef.current &&
//         !inputRef.current.contains(event.target) &&
//         suggestionRef.current &&
//         !suggestionRef.current.contains(event.target)
//       ) {
//         handleInputBlur(activeType, activeIndex);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [activeIndex, activeType, handleInputBlur]);

//   // Handle selecting an item from suggestions
//   const handleSuggestionClick = (type, index, suggestion) => {
//     setData((prevData) => {
//       const updatedData = { ...prevData };
//       if (type === "medications" || type === "tests") {
//         updatedData[type][index].name = suggestion;
//       } else if (
//         type === "symptoms" ||
//         type === "examination" ||
//         type === "diagnosis"
//       ) {
//         updatedData[type][index].name = suggestion;
//       } else if (type === "advice") {
//         updatedData[type][index] = suggestion;
//       }
//       return updatedData;
//     });

//     setShowSuggestions(false);
//     setEditableText(suggestion); // Update editableText to match the selected suggestion
//     setActiveIndex(null);
//     setActiveType(null);
//   };

//   // Handle lineItem input blur (closing edit mode)
//   const handleLineItemBlur = (type, index) => {
//     setData((prevData) => {
//       const updatedData = { ...prevData };
//       if (type === "diagnosis" || type === "examination") {
//         updatedData[type][index].notes = editableLineItem;
//       } else {
//         updatedData[type][index].lineItem = editableLineItem; // Update lineItem with the new value
//       }
//       return updatedData;
//     });
//     setActiveIndex(null);
//     setActiveType(null);
//   };

//   // Handle input change for editing
//   const handleInputChange = (e) => {
//     setEditableText(e.target.value);
//   };

//   // Handle lineItem input change for editing
//   const handleLineItemChange = (e) => {
//     setEditableLineItem(e.target.value);
//   };

//   // Handle click on an item (to edit)
//   const handleItemClick = (type, index) => {
//     if (activeIndex !== null && activeType !== null) {
//       handleInputBlur(activeType, activeIndex);
//     }

//     if (type === "medications" || type === "tests") {
//       setEditableText(data[type][index].refinedName);
//     } else if (
//       type === "symptoms" ||
//       type === "examination" ||
//       type === "diagnosis" ||
//       type === "medicalHistory" ||
//       type === "vaccinations"
//     ) {
//       setEditableText(data[type][index].name);
//     } else if (type === "advice") {
//       setEditableText(data[type][index]);
//     } else if (type === "vitals") {
//       setEditableText(data.vitals[index]);
//     }

//     setActiveIndex(index);
//     setActiveType(type);
//   };

//   // Handle click on a lineItem (to edit)
//   const handleLineItemClick = (type, index) => {
//     if (
//       type === "medications" ||
//       type === "tests" ||
//       type === "vaccinations" ||
//       type === "medicalHistory" ||
//       type === "symptoms"
//     ) {
//       setEditableLineItem(data[type][index]?.lineItem);
//     } else {
//       setEditableLineItem(data[type][index]?.notes);
//     }
//     setActiveIndex(index);
//     setActiveType(`${type}-lineItem`);
//   };

//   const renderItems = (type) => {
//     // Check if type is 'vitals' and handle accordingly
//     if (type === "vitals") {
//       return (
//         <div className="digitised-section">
//           {loading ? (
//             <div className="shimmer-container">
//               <div className="shimmer-header">
//                 <div className="shimmer"></div>
//               </div>
//               <div className="shimmer-content">
//                 <div className="shimmer"></div>
//               </div>
//             </div>
//           ) : (
//             <ul>
//               {Object.entries(data.vitals || {})
//                 .filter(([key, value]) => value)
//                 .map(([key, value]) => {
//                   // Dynamically calculate input width
//                   let textWidth = 0;
//                   if (activeIndex === key && activeType === "vitals") {
//                     const tempSpan = document.createElement("span");
//                     tempSpan.style.visibility = "hidden";
//                     tempSpan.style.position = "absolute";
//                     tempSpan.style.whiteSpace = "nowrap";
//                     tempSpan.innerText = editableText || "";
//                     document.body.appendChild(tempSpan);
//                     textWidth = tempSpan.offsetWidth;
//                     document.body.removeChild(tempSpan);
//                   }

//                   return (
//                     <li key={key}>
//                       <div className="medicine-item">
//                         <span className="digitised-item">
//                           {/* Format the key to be human-readable */}
//                           {`${key
//                             .replace(/([A-Z])/g, " $1")
//                             .replace(/^./, (str) => str.toUpperCase())}: `}
//                         </span>
//                         {activeIndex === key && activeType === "vitals" ? (
//                           <input
//                             type="text"
//                             value={editableText} // Pre-fill the input with the current value
//                             className="editable-digitised-item"
//                             onChange={(e) => setEditableText(e.target.value)}
//                             onBlur={() => handleInputBlur(type, key)}
//                             autoFocus
//                             style={{ width: `${textWidth + 10}px` }} // Add padding for better UX
//                           />
//                         ) : (
//                           <span
//                             onClick={() => handleItemClick(type, key)}
//                             className="digitised-item"
//                           >
//                             {value}
//                           </span>
//                         )}
//                       </div>
//                     </li>
//                   );
//                 })}
//             </ul>
//           )}
//         </div>
//       );
//     }

//     // Handle other types dynamically (like medications, symptoms, etc.)
//     return (
//       <div className="digitised-section">
//         {loading ? (
//           <div className="shimmer-container">
//             <div className="shimmer-header">
//               <div className="shimmer"></div>
//             </div>
//             <div className="shimmer-content">
//               <div className="shimmer"></div>
//             </div>
//           </div>
//         ) : Array.isArray(data[type]) && data[type].length > 0 ? (
//           <ul>
//             {data[type].map((item, index) => {
//               // Measure the width of the editable text
//               let textWidth = 0;
//               let lineItemWidth = 0;

//               // For name or other primary data (editableText)
//               if (activeIndex === index && activeType === type) {
//                 const tempSpan = document.createElement("span");
//                 tempSpan.style.visibility = "hidden";
//                 tempSpan.style.position = "absolute";
//                 tempSpan.style.whiteSpace = "nowrap";
//                 tempSpan.innerText = editableText || "";
//                 document.body.appendChild(tempSpan);
//                 textWidth = tempSpan.offsetWidth;
//                 document.body.removeChild(tempSpan);
//               }

//               // For lineItem (editableLineItem)
//               if (activeIndex === index && activeType === `${type}-lineItem`) {
//                 const tempSpanLineItem = document.createElement("span");
//                 tempSpanLineItem.style.visibility = "hidden";
//                 tempSpanLineItem.style.position = "absolute";
//                 tempSpanLineItem.style.whiteSpace = "nowrap";
//                 tempSpanLineItem.innerText = editableLineItem || "";
//                 document.body.appendChild(tempSpanLineItem);
//                 lineItemWidth = tempSpanLineItem.offsetWidth;
//                 document.body.removeChild(tempSpanLineItem);
//               }

//               return (
//                 <li key={index}>
//                   <div className="medicine-item">
//                     {activeIndex === index && activeType === type ? (
//                       <input
//                         type="text"
//                         value={editableText}
//                         className="editable-digitised-item"
//                         onChange={handleInputChange}
//                         onBlur={() => handleInputBlur(type, index)}
//                         autoFocus
//                         style={{ width: `${textWidth + 10}px` }} // Add padding for better UX
//                       />
//                     ) : (
//                       <span
//                         onClick={() => handleItemClick(type, index)}
//                         className="digitised-item"
//                       >
//                         {type === "advice"
//                           ? item
//                           : type === "symptoms" && item?.name?.length > 0
//                           ? item.name[0]?.toUpperCase() + item.name?.slice(1)
//                           : type === "medications" || type === "tests"
//                           ? item?.refinedName
//                           : item?.name}
//                       </span>
//                     )}

//                     {/* Editable input for lineItem */}
//                     {(type === "medications" ||
//                       type === "symptoms" ||
//                       type === "vaccinations" ||
//                       type === "medicalHistory" ||
//                       type === "tests") &&
//                       item?.lineItem &&
//                       (activeIndex === index &&
//                       activeType === `${type}-lineItem` ? (
//                         <input
//                           type="text"
//                           value={editableLineItem}
//                           className="editable-digitised-item"
//                           onChange={handleLineItemChange}
//                           onBlur={() => handleLineItemBlur(type, index)}
//                           autoFocus
//                           style={{ width: `${lineItemWidth + 10}px` }} // Add padding for better UX
//                         />
//                       ) : (
//                         <span
//                           onClick={() => handleLineItemClick(type, index)}
//                           className="digitised-item"
//                         >
//                           {`(${item.lineItem})`}
//                         </span>
//                       ))}

//                     {/* Editable input for notes (lineItem) */}
//                     {(type === "examination" || type === "diagnosis") &&
//                       item?.notes &&
//                       (activeIndex === index &&
//                       activeType === `${type}-lineItem` ? (
//                         <input
//                           type="text"
//                           value={editableLineItem}
//                           className="editable-digitised-item"
//                           onChange={handleLineItemChange}
//                           onBlur={() => handleLineItemBlur(type, index)}
//                           autoFocus
//                           style={{ width: `${lineItemWidth + 10}px` }} // Add padding for better UX
//                         />
//                       ) : (
//                         <span
//                           onClick={() => handleLineItemClick(type, index)}
//                           className="digitised-item"
//                         >
//                           {`(${item.notes})`}
//                         </span>
//                       ))}
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         ) : null}
//       </div>
//     );
//   };

//   const hasValidContent = (type) => {
//     if (!data[type] || !Array.isArray(data[type])) return false;

//     return data[type].some((item) => {
//       if (typeof item === "string") return item.trim().length > 0;

//       // For object types, check if any relevant fields have content
//       const relevantFields = {
//         medications: ["refinedName", "lineItem"],
//         symptoms: ["name", "lineItem"],
//         examination: ["name", "notes"],
//         diagnosis: ["name", "notes"],
//         medicalHistory: ["name", "lineItem"],
//         vaccinations: ["name", "lineItem"],
//         tests: ["refinedName", "lineItem"],
//       };

//       const fieldsToCheck = relevantFields[type] || ["name"];
//       return fieldsToCheck.some((field) => item[field]?.trim?.().length > 0);
//     });
//   };

//   return (
//     <div className="digitised-container">
//       {loading ? (
//         <GenRXLoaders isProcessing={true} isSnapRx={true} />
//       ) : (
//         <>
//           {data?.vitals &&
//             Object.values(data.vitals).some(
//               (value) => value?.trim?.().length > 0
//             ) && (
//               <>
//                 <div className="title-digitise-section mb-2">Vitals</div>
//                 {renderItems("vitals")}
//               </>
//             )}

//           {data?.medicalHistory && hasValidContent("medicalHistory") && (
//             <>
//               <div className="title-digitise-section mb-2">Medical History</div>
//               {renderItems("medicalHistory")}
//             </>
//           )}

//           {data?.symptoms && hasValidContent("symptoms") && (
//             <>
//               <div className="title-digitise-section mb-2">Symptoms</div>
//               {renderItems("symptoms")}
//             </>
//           )}

//           {data?.examination && hasValidContent("examination") && (
//             <>
//               <div className="title-digitise-section mb-2">Examination</div>
//               {renderItems("examination")}
//             </>
//           )}

//           {data?.diagnosis && hasValidContent("diagnosis") && (
//             <>
//               <div className="title-digitise-section mb-2">Diagnosis</div>
//               {renderItems("diagnosis")}
//             </>
//           )}

//           {data?.medications && hasValidContent("medications") && (
//             <>
//               <div className="title-digitise-section mb-2">Medicine</div>
//               {renderItems("medications")}
//             </>
//           )}

//           {data?.tests && hasValidContent("tests") && (
//             <>
//               <div className="title-digitise-section mb-2">
//                 Lab Investigation
//               </div>
//               {renderItems("tests")}
//             </>
//           )}

//           {data?.advice && hasValidContent("advice") && (
//             <>
//               <div className="title-digitise-section mb-2">Advices</div>
//               {renderItems("advice")}
//             </>
//           )}

//           {data?.vaccinations && hasValidContent("vaccinations") && (
//             <>
//               <div className="title-digitise-section mb-2">Vaccination</div>
//               {renderItems("vaccinations")}
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default DigitisedPrescription;

import { Button } from "antd";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import GenRXLoaders from "./GenRxLoaders";

// Sections we treat as arrays (where we can add userAddedText items)
export const ARRAY_SECTIONS = [
  "symptoms",
  "medicalHistory",
  "examination",
  "diagnosis",
  "medications",
  "tests",
  "vaccinations",
  "advice",
  // "vitals" is an object; see vitalsUser handling below
];

export const isUserAdded = (obj) =>
  obj && typeof obj === "object" && Object.keys(obj)[0]?.startsWith("userAddedText_");

export const getUserAddedValue = (obj) => (isUserAdded(obj) ? obj[Object.keys(obj)[0]] : "");

// Turn free text into the canonical shape for each section
export const normalizeNewItem = (type, text = "") => {
  const t = (text ?? "").trim();

  if (type === "advice") return t; // advice is array of strings

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

  // symptoms, medicalHistory, vaccinations (and fallback)
  return { name: t, lineItem: "" };
};

export const buildFinalEditedData = (raw) => {
  const out = JSON.parse(JSON.stringify(raw || {}));

  // 1) Normalize array sections
  ARRAY_SECTIONS.forEach((section) => {
    const src = Array.isArray(out[section]) ? out[section] : [];
    const norm = [];

    src.forEach((item) => {
      // drop placeholders
      if (item && typeof item === "object" && item.__placeholder) return;

      // advice: strings only
      if (section === "advice") {
        if (typeof item === "string") {
          const v = item.trim();
          if (v) norm.push(v);
          return;
        }
        if (isUserAdded(item)) {
          const v = getUserAddedValue(item).trim();
          if (v) norm.push(v);
          return;
        }
        // if someone put an object with name into advice, coerce to string
        if (item && typeof item === "object" && item.name) {
          const v = String(item.name).trim();
          if (v) norm.push(v);
        }
        return;
      }

      // non-advice arrays
      if (isUserAdded(item)) {
        const v = getUserAddedValue(item).trim();
        if (v) norm.push(normalizeNewItem(section, v));
        return;
      }

      if (typeof item === "string") {
        const v = item.trim();
        if (v) norm.push(normalizeNewItem(section, v));
        return;
      }

      if (item && typeof item === "object") {
        // trim important fields
        const copy = { ...item };
        if (section === "medications" || section === "tests") {
          if (copy.refinedName) copy.refinedName = String(copy.refinedName).trim();
          if (copy.name) copy.name = String(copy.name).trim();
        } else if (copy.name) {
          copy.name = String(copy.name).trim();
        }
        // drop fully empty objects (no name/refinedName)
        const keyField =
          section === "medications" || section === "tests" ? (copy.refinedName || copy.name) : copy.name;
        if (keyField && String(keyField).trim().length > 0) {
          norm.push(copy);
        }
      }
    });

    out[section] = norm;
  });

  // 2) Vitals extras: fold vitalsUser → vitals.extraNotes[]
  if (Array.isArray(out.vitalsUser)) {
    const extras = out.vitalsUser
      .map(getUserAddedValue)
      .map((s) => (s || "").trim())
      .filter(Boolean);

    if (!out.vitals) out.vitals = {};
    if (extras.length) {
      // Append (don’t overwrite) if backend already stores extraNotes
      const existing = Array.isArray(out.vitals.extraNotes) ? out.vitals.extraNotes : [];
      out.vitals.extraNotes = [...existing, ...extras];
    }
    delete out.vitalsUser;
  }

  return out;
};

const nextUserAddedKey = (arr) => {
  const nums = arr
    .map((x) => (isUserAdded(x) ? Number(Object.keys(x)[0].split("_")[1]) : 0))
    .filter(Boolean);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `userAddedText_${next}`;
};

// Resolve displayable primary text for non userAdded items
const getPrimaryText = (type, item) => {
  if (type === "advice") return typeof item === "string" ? item : "";
  if (type === "medications" || type === "tests") return item?.refinedName || "";
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

  // === First-visible section highlight/auto-focus ===
  const containerRef = useRef(null);
  const sectionRefs = useRef({}); // { [section]: HTMLElement }
  const [visibleSection, setVisibleSection] = useState(null);

  // Build list of sections that actually rendered (with content)
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
        // pick the visible entry with smallest top (closest to top)
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
        threshold: 0.2, // 20% of section visible
      }
    );

    renderedSections.forEach((sec) => {
      const el = sectionRefs.current[sec];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [renderedSections]);

  // Auto-focus last input of first-visible section (arrays only)
  useEffect(() => {
    // Do not disrupt if user is already editing something
    if (activeType !== null) return;
    if (!visibleSection) return;
    if (!ARRAY_SECTIONS.includes(visibleSection)) return;

    if (!ioAutoFocusEnabled) return;         // NEW: opt-in only
    if (activeType !== null) return;
    if (!visibleSection) return;
    if (!ARRAY_SECTIONS.includes(visibleSection)) return;

    const arr = data?.[visibleSection];
    if (!Array.isArray(arr) || arr.length === 0) return;

    const lastIndex = arr.length - 1;

    // Set edit mode on the last line
    const lastItem = arr[lastIndex];
    const text = isUserAdded(lastItem)
      ? getUserAddedValue(lastItem)
      : getPrimaryText(visibleSection, lastItem);

    setActiveType(visibleSection);
    setActiveIndex(lastIndex);
    setEditableText(text);
    setTimeout(() => {
      const el = sectionRefs.current[visibleSection]?.querySelector("input");
      el?.focus?.();
    }, 0);
    setIoAutoFocusEnabled(false);
  }, [visibleSection, data, activeType, ioAutoFocusEnabled]);

  const handleEnterInVitals = (key) => {
    // 1) persist the current vital's value
    handleInputBlur("vitals", key);
  
    // 2) append a new editable line inside "Vitals" (vitalsUser)
    let newIndex = 0;
    setVisibleSection("vitals");
    editingRef.current = true;
  
    setData((prev) => {
      const updated = { ...prev };
      const arr = Array.isArray(updated.vitalsUser) ? [...updated.vitalsUser] : [];
      newIndex = arr.length;
      const newKey = nextUserAddedKey(arr);
      arr.push({ [newKey]: "" });
      updated.vitalsUser = arr;
      return updated;
    });
  
    // 3) focus it
    setTimeout(() => {
      setActiveType("vitalsUser");
      setActiveIndex(newIndex);
      setEditableText("");
      const sec = sectionRefs.current["vitals"];
      const inputs = sec?.querySelectorAll("input");
      inputs?.[inputs.length - 1]?.focus?.(); // last input is fine
    }, 0);
  };
  
  // === Input blur: persist any edits ===
  const handleInputBlur = useCallback(
    (type, index) => {
      if (activeIndex === null || activeType === null) return;

      setData((prevData) => {
        const updatedData = { ...prevData };

        if (type === "vitals") {
          updatedData.vitals[index] = (editableText || "").trim();
          return updatedData;
        }

        if (type === "vitalsUser") {
          const arr = Array.isArray(updatedData.vitalsUser) ? [...updatedData.vitalsUser] : [];
          const item = arr[index];
          const k = Object.keys(item || { userAddedText_1: "" })[0];
          const val = (editableText || "").trim();
          if (!val) { arr.splice(index, 1); }
          else { arr[index] = { [k]: val }; }
          updatedData.vitalsUser = arr;
          return updatedData;
        }

        if (ARRAY_SECTIONS.includes(type)) {
          const arr = [...(updatedData[type] || [])];
          const item = arr[index];

          if (isUserAdded(item)) {
            const key = Object.keys(item)[0];
            const val = (editableText || "").trim();
            if (!val) {
              // if empty after editing, remove the newly added row
              arr.splice(index, 1);
            } else {
              arr[index] = { [key]: val };
            }
          } else if (type === "advice") {
            arr[index] = (editableText || "").trim();
          } else if (type === "medications" || type === "tests") {
            arr[index] = { ...item, refinedName: (editableText || "").trim() };
          } else {
            arr[index] = { ...item, name: (editableText || "").trim() };
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

  // Click outside closes edit mode
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        if (activeType !== null) handleInputBlur(activeType, activeIndex);
      }
      const target = event.target;
      const inActiveInput =
        inputRef.current && inputRef.current.contains(target);
      const inSuggestions =
        suggestionRef.current && suggestionRef.current.contains(target);
      // current highlighted section element (if any)
      const sectionEl =
        visibleSection && sectionRefs.current[visibleSection]
          ? sectionRefs.current[visibleSection]
          : null;
      const clickedInsideHighlighted =
        sectionEl && sectionEl.contains(target);
      if (!inActiveInput && !inSuggestions) {
        // always persist current edit if any
        if (activeType !== null) {
          handleInputBlur(activeType, activeIndex);
        }
        // if click is OUTSIDE the highlighted section, clear the highlight
        if (!clickedInsideHighlighted) {
          setVisibleSection(null);
          setActiveType(null);
          setActiveIndex(null);
          setEditableText("");
          editingRef.current = false;
          // disable IO-driven autofocus so it doesn't immediately re-open
          setIoAutoFocusEnabled(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeIndex, activeType, handleInputBlur, visibleSection]);

  // Suggestions click (unchanged)
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

  // LineItem blur
  const handleLineItemBlur = (type, index) => {
    setData((prevData) => {
      const updatedData = { ...prevData };
      const arr = [...(updatedData[type] || [])];
      if (type === "diagnosis" || type === "examination") {
        arr[index] = { ...arr[index], notes: editableLineItem };
      } else {
        arr[index] = { ...arr[index], lineItem: editableLineItem };
      }
      updatedData[type] = arr;
      return updatedData;
    });
    setActiveIndex(null);
    setActiveType(null);
  };

  const handleInputChange = (e) => setEditableText(e.target.value);
  const handleLineItemChange = (e) => setEditableLineItem(e.target.value);

  // Click to edit a primary line
  const handleItemClick = (type, index) => {
    if (activeIndex !== null && activeType !== null) {
      handleInputBlur(activeType, activeIndex);
    }

    if (type === "vitals") {
      setEditableText(data.vitals[index] || "");
    } else if (ARRAY_SECTIONS.includes(type)) {
      const item = data[type][index];
      const text = isUserAdded(item)
        ? getUserAddedValue(item)
        : getPrimaryText(type, item);
      setEditableText(text);
    }

    if (type === "vitalsUser") {
      const item = data.vitalsUser?.[index];
      setEditableText(getUserAddedValue(item));
    }

    setActiveIndex(index);
    setActiveType(type);
  };

  // Click to edit a lineItem/notes
  const handleLineItemClick = (type, index) => {
    const src = data[type][index];
    setEditableLineItem(type === "diagnosis" || type === "examination" ? src?.notes : src?.lineItem);
    setActiveIndex(index);
    setActiveType(`${type}-lineItem`);
  };

  // ENTER to insert a new userAdded line after current index
  const handleEnterToInsert = (type, index) => {
    if (!ARRAY_SECTIONS.includes(type)) return;
    setVisibleSection(type);
    editingRef.current = true;
    setData((prev) => {
      const updated = { ...prev };
      const arr = Array.isArray(updated[type]) ? [...updated[type]] : [];
      const cur = arr[index];
    
      const currentText = (editableText ?? "").trim();
      if (isUserAdded(cur)) {
        const k = Object.keys(cur)[0];
        arr[index] = currentText ? { [k]: currentText } : { [k]: "" };
      } else if (type === "advice") {
        arr[index] = currentText;
      } else if (type === "medications" || type === "tests") {
        arr[index] = { ...cur, refinedName: currentText };
      } else {
        arr[index] = { ...cur, name: currentText };
      }
      const newKey = nextUserAddedKey(arr);
      arr.splice(index + 1, 0, { [newKey]: "" });
      updated[type] = arr;
      return updated;
    });

    // move caret to the newly inserted row
    setTimeout(() => {
      setActiveType(type);
      setActiveIndex(index + 1);
      setEditableText("");
      const sec = sectionRefs.current[type];
      const inputs = sec?.querySelectorAll("input");
      inputs?.[index + 1]?.focus?.();
    }, 0);
  };

  // === RENDERERS ===

  // vitals block unchanged (not insertable)
  const renderVitals = () => (
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
            .filter(([_, value]) => value)
            .map(([key, value]) => {
              // text width computation for nice input size
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

              return (
                <li key={key}>
                  <div className="medicine-item">
                    <span className="digitised-item">
                      {`${key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}: `}
                    </span>
                    {activeIndex === key && activeType === "vitals" ? (
                      <input
                        ref={inputRef}
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
            {Array.isArray(data.vitalsUser) && data.vitalsUser.length > 0 && (
              data.vitalsUser.map((obj, idx) => {
                const text = getUserAddedValue(obj);
                let textWidth = 0;
                if (activeType === "vitalsUser" && activeIndex === idx) {
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
                  <li key={`vu-${idx}`}>
                    <div className="medicine-item">
                      {activeType === "vitalsUser" && activeIndex === idx ? (
                        <input
                          type="text"
                          value={editableText}
                          className="editable-digitised-item"
                          onChange={handleInputChange}
                          onBlur={() => { handleInputBlur("vitalsUser", idx); editingRef.current = false; }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleEnterToInsert("vitalsUser", idx);
                            }
                          }}
                          onFocus={() => { editingRef.current = true; setVisibleSection("vitals"); }}
                          autoFocus
                          style={{ width: `${textWidth + 10}px` }}
                        />
                      ) : (
                        <span
                          onClick={() => handleItemClick("vitalsUser", idx)}
                          className="digitised-item"
                        >
                          {text}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })
            )}
        </ul>
      )}
    </div>
  );

  // shared list renderer for ARRAY_SECTIONS
  const renderArraySection = (type) => (
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
            let textWidth = 0;
            let lineItemWidth = 0;

            // width for primary text
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

            // width for lineItem/notes
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

            const primaryDisplay = isUserAdded(item)
              ? getUserAddedValue(item)
              : getPrimaryText(type, item);

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
                    !isUserAdded(item) &&
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
                    !isUserAdded(item) &&
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
      if (isUserAdded(item)) return getUserAddedValue(item)?.trim?.()?.length > 0;
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

  // === MAIN RENDER ===
  return (
    <div className={loading ? "loading-digitised-container" : "digitised-container"} ref={containerRef}>
      {loading ? (
        <GenRXLoaders isProcessing={true} isSnapRx={true} />
      ) : (
        <>
          {data?.vitals &&
            Object.values(data.vitals).some((v) => v?.trim?.()?.length > 0) && (
              <div
                ref={(el) => (sectionRefs.current["vitals"] = el)}
                data-section="vitals"
                className={`title-digitise-section-wrapper ${
                  visibleSection === "vitals" ? "highlight-blue" : ""
                }`}
              >
                <div className="title-digitise-section mb-2">Vitals</div>
                {renderVitals()}
              </div>
            )}

          {data?.medicalHistory && hasValidContent("medicalHistory") && (
            <div
              ref={(el) => (sectionRefs.current["medicalHistory"] = el)}
              data-section="medicalHistory"
              className={`title-digitise-section-wrapper ${
                visibleSection === "medicalHistory" ? "highlight-blue" : ""
              }`}
            >
              <div className="title-digitise-section mb-2">Medical History</div>
              {renderArraySection("medicalHistory")}
            </div>
          )}

          {data?.symptoms && hasValidContent("symptoms") && (
            <div
              ref={(el) => (sectionRefs.current["symptoms"] = el)}
              data-section="symptoms"
              className={`title-digitise-section-wrapper ${
                visibleSection === "symptoms" ? "highlight-blue" : ""
              }`}
            >
              <div className="title-digitise-section mb-2">Symptoms</div>
              {renderArraySection("symptoms")}
            </div>
          )}

          {data?.examination && hasValidContent("examination") && (
            <div
              ref={(el) => (sectionRefs.current["examination"] = el)}
              data-section="examination"
              className={`title-digitise-section-wrapper ${
                visibleSection === "examination" ? "highlight-blue" : ""
              }`}
            >
              <div className="title-digitise-section mb-2">Examination</div>
              {renderArraySection("examination")}
            </div>
          )}

          {data?.diagnosis && hasValidContent("diagnosis") && (
            <div
              ref={(el) => (sectionRefs.current["diagnosis"] = el)}
              data-section="diagnosis"
              className={`title-digitise-section-wrapper ${
                visibleSection === "diagnosis" ? "highlight-blue" : ""
              }`}
            >
              <div className="title-digitise-section mb-2">Diagnosis</div>
              {renderArraySection("diagnosis")}
            </div>
          )}

          {data?.medications && hasValidContent("medications") && (
            <div
              ref={(el) => (sectionRefs.current["medications"] = el)}
              data-section="medications"
              className={`title-digitise-section-wrapper ${
                visibleSection === "medications" ? "highlight-blue" : ""
              }`}
            >
              <div className="title-digitise-section mb-2">Medicine</div>
              {renderArraySection("medications")}
            </div>
          )}

          {data?.tests && hasValidContent("tests") && (
            <div
              ref={(el) => (sectionRefs.current["tests"] = el)}
              data-section="tests"
              className={`title-digitise-section-wrapper ${
                visibleSection === "tests" ? "highlight-blue" : ""
              }`}
            >
              <div className="title-digitise-section mb-2">Lab Investigation</div>
              {renderArraySection("tests")}
            </div>
          )}

          {data?.advice && hasValidContent("advice") && (
            <div
              ref={(el) => (sectionRefs.current["advice"] = el)}
              data-section="advice"
              className={`title-digitise-section-wrapper ${
                visibleSection === "advice" ? "highlight-blue" : ""
              }`}
            >
              <div className="title-digitise-section mb-2">Advices</div>
              {renderArraySection("advice")}
            </div>
          )}

          {data?.vaccinations && hasValidContent("vaccinations") && (
            <div
              ref={(el) => (sectionRefs.current["vaccinations"] = el)}
              data-section="vaccinations"
              className={`title-digitise-section-wrapper ${
                visibleSection === "vaccinations" ? "highlight-blue" : ""
              }`}
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
