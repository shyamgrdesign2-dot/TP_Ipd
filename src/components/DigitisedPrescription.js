import { Button } from 'antd';
import React, { useState, useEffect, useRef } from 'react';

const DigitisedPrescription = ({ data, setData}) => {

  const [activeIndex, setActiveIndex] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [editableText, setEditableText] = useState('');
  const [editableLineItem, setEditableLineItem] = useState('');
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
    // Ensure we update the data only if there is a change
    if (activeIndex !== null && activeType !== null) {
      setData((prevData) => {
        const updatedData = { ...prevData };
        if (type === 'medications' || type === 'tests') {
          updatedData[type][index].refinedName = editableText; // Ensure editable text gets updated
        } else if (type === 'symptoms') {
          updatedData[type][index].name = editableText; // Update the name for symptoms
        } else if (type === 'advice') {
          updatedData[type][index] = editableText; // Update the advice text
        }
        return updatedData;
      });
    }
    setShowSuggestions(false);
    setActiveIndex(null);
    setActiveType(null);
    setEditableText(''); // Clear editable text after blurring
  };


  // Handle click outside suggestion and input box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target) &&
        suggestionRef.current && !suggestionRef.current.contains(event.target)
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
      if (type === 'medications' || type === 'tests') {
        updatedData[type][index].refinedName = suggestion;
      } else if (type === 'symptoms') {
        updatedData[type][index].name = suggestion;
      } else if (type === 'advice') {
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
    // If switching items, first blur the previous one to save changes
    if (activeIndex !== null && activeType !== null) {
      handleInputBlur(activeType, activeIndex); // Save changes for the active item
    }

    if (type === 'medications' || type === 'tests') {
      setEditableText(data[type][index].refinedName);
      setShowSuggestions(true);
    } else if (type === 'symptoms') {
      setEditableText(data[type][index].name);
    } else if (type === 'advice') {
      setEditableText(data[type][index]);
    }
    
    setActiveIndex(index);
    setActiveType(type);
  };


  // Handle click on a lineItem (to edit)
  const handleLineItemClick = (type, index) => {
    setEditableLineItem(data[type][index].lineItem);
    setActiveIndex(index);
    setActiveType(`${type}-lineItem`);
  };

  const renderItems = (type) => (
    <div className='digitised-section'>
      { loading ? (
        <div className="shimmer-container">
          <div className="shimmer"></div>
        </div>
      ) : data?.[type]?.length > 0 ? (
        <ul>
          {data[type].map((item, index) => {
            // Measure the width of the editable text
            let textWidth = 0;
            let lineItemWidth = 0;

            // For refinedName or other primary data (editableText)
            if (activeIndex === index && activeType === type) {
              const tempSpan = document.createElement('span');
              tempSpan.style.visibility = 'hidden';
              tempSpan.style.position = 'absolute';
              tempSpan.style.whiteSpace = 'nowrap';
              tempSpan.innerText = editableText || '';
              document.body.appendChild(tempSpan);
              textWidth = tempSpan.offsetWidth;
              document.body.removeChild(tempSpan);
            }

            // For lineItem (editableLineItem)
            if (activeIndex === index && activeType === `${type}-lineItem`) {
              const tempSpanLineItem = document.createElement('span');
              tempSpanLineItem.style.visibility = 'hidden';
              tempSpanLineItem.style.position = 'absolute';
              tempSpanLineItem.style.whiteSpace = 'nowrap';
              tempSpanLineItem.innerText = editableLineItem || '';
              document.body.appendChild(tempSpanLineItem);
              lineItemWidth = tempSpanLineItem.offsetWidth;
              document.body.removeChild(tempSpanLineItem);
            }

            return (
              <li key={index}>
                <div className='medicine-item'>
                  {
                    activeIndex === index && activeType === type ? (
                    <input
                      type="text"
                      value={editableText}
                      className="editable-digitised-item"
                      onChange={handleInputChange}
                      ref={inputRef}
                      autoFocus
                      style={{ width: `${textWidth + 10}px` }} // Add padding for better UX
                    />
                  ) : (
                    <span
                      onClick={() => handleItemClick(type, index)}
                      className="digitised-item"
                    >
                        {type === "advice" ? item : type === "symptoms" ? item.name[0].toUpperCase() + item.name.slice(1) : item.refinedName}
                    </span>
                    )
                  }

                  {/* Editable input for lineItem */}
                  {(type === "medications"|| type === "symptoms") && item.lineItem && (
                    activeIndex === index && activeType === `${type}-lineItem` ? (
                      <input
                        type="text"
                        value={editableLineItem}
                        className='editable-digitised-item'
                        onChange={handleLineItemChange}
                        onBlur={() => handleLineItemBlur(type, index)}
                        autoFocus
                        style={{ width: `${lineItemWidth + 10}px` }} // Add padding for better UX
                      />
                    ) : (
                      <span
                        onClick={() => handleLineItemClick(type, index)}
                        className='digitised-item'
                      >
                        {`(${item.lineItem})`}
                      </span>
                    )
                  )}

                  {
                    showSuggestions && activeIndex === index && activeType === type && (
                      <div className="suggestion-card" ref={suggestionRef}>
                        <div className="align-items-center d-flex justify-content-between border-btm pb-2">
                          <div className="title-common-digitised">Suggestions :</div>
                          <Button
                            className="btn btn-delete-prescription p-0 me-3"
                            onClick={() => setShowSuggestions(false)}
                          >
                            <i className="icon-Cross" />
                          </Button>
                        </div>
                        <ul className="no-bullets">
                          {item.suggestions?.map((suggestion, suggestionIndex) => (
                              <li
                                key={suggestionIndex}
                              onClick={() => handleSuggestionClick(type, index, suggestion)}
                                style={{ cursor: "pointer" }}
                              >
                                {suggestion}
                              </li>
                          ))}
                          <button
                            className="btn-outline-digitise"
                            onClick={() => handleSuggestionClick(type, index, item.refinedName)}
                          >
                            Keep {item.refinedName} as it is
                          </button>
                        </ul>
                      </div>
                    )
                  }
                </div>
              </li>
            );
          })}
        </ul>
        )
      : null}
    </div>
  );

  return (
    <div className='digitised-container'>
      {data?.symptoms && data.symptoms.length > 0 && (
        <>
          <div className='title-digitise-section mb-2'>Symptoms</div>
          {renderItems('symptoms')}
        </>
      )}

      {data?.medications && data.medications.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Medicine</div>
          {renderItems('medications')}
        </>
      )}

      {data?.tests && data.tests.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Tests</div>
          {renderItems('tests')}
        </>
      )}

      {data?.advice && data.advice.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Advices</div>
          {renderItems('advice')}
        </>
      )}
    </div>
  );
};

export default DigitisedPrescription;