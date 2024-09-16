import { Button } from 'antd';
import React, { useState, useEffect, useRef } from 'react';

const DigitisedPrescription = ({ data, setData}) => {

  const [activeIndex, setActiveIndex] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [editableText, setEditableText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

// Handle selecting an item from suggestions
const handleSuggestionClick = (type, index, suggestion) => {
  // Update the refinedName for the clicked suggestion
  setData((prevData) => {
    const updatedData = { ...prevData };
    updatedData[type][index].refinedName = suggestion;
    return updatedData;
  });

  // Hide suggestions after selection
  setShowSuggestions(false);
  setEditableText(suggestion); // Update editableText to match the selected suggestion
  setActiveIndex(null);
  setActiveType(null);
};

// Handle input blur (closing edit mode)
const handleInputBlur = (type, index) => {
    setData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[type][index].refinedName = editableText; // Ensure editable text gets updated
      return updatedData;
    });
  //   setShowSuggestions(false);
  //   setActiveIndex(null);
  //   setActiveType(null);
};

  // Handle input change for editing
  const handleInputChange = (e) => {
    setEditableText(e.target.value);
  };

  // Handle click on an item (to edit)
  const handleItemClick = (type, index) => {
    setEditableText(data[type][index].refinedName);
    setActiveIndex(index);
    setActiveType(type);
    setShowSuggestions(true);
  };

  // Render items for each type (medications, tests, etc.)
  const renderItems = (type) => (
    <div className='digitised-section'>
      <ul>
        {data[type].map((item, index) => (
          <li key={index} className='medicine-item'>
            {activeIndex === index && activeType === type ? (
              <input
                type="text"
                value={editableText}
                className='editable-digitised-item'
                onChange={handleInputChange}
                onBlur={() => handleInputBlur(type, index)}
                autoFocus
              />
            ) : (
              <span
                onClick={() => handleItemClick(type, index)}
                className='digitised-item'
              >
                {type === "advice" ?  data[type][index] : type === "symptoms" ? item.name : item.refinedName}
              </span>
            )}

            {type === "medications" && item.lineItem &&
              // (activeIndex === index && activeType === type && (
              //   <input
              //     type="text"
              //     value={item.lineItem}
              //     className='editable-digitised-item'
              //     // onChange={handleInputChange}
              //     onBlur={() => handleInputBlur(type, index)}
              //   />
              // ) : (
                <span
                  // onClick={() => handleItemClick(type, index)}
                  className='digitised-item'
                > 
                  {` (${item.lineItem})`}
                </span>
              // ))
            }

            {/* Suggestions dropdown */}
            {showSuggestions && activeIndex === index && activeType === type && (
              <div
                className='suggestion-card'
                ref={suggestionRef}
              >
                <div className="align-items-center d-flex justify-content-between border-btm pb-2">
                  <div className="title-common">Suggestions :</div>
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
                    className='btn-outline-digitise'
                    onClick={() => handleSuggestionClick(type, index, item.refinedName)}
                  >
                    Keep {item.refinedName} as it is
                  </button>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className='digitised-container'>
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

      {data?.symptoms && data.symptoms.length > 0 && (
        <>
          <div className="title-digitise-section mb-2">Symptoms</div>
          {renderItems('symptoms')}
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

