import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import chevron from "../../../assets/images/chevron.svg";

const VaccineFilter = () => {
  const [scrollToStart, setScrollToStart] = useState(false);
  const datesContainerRef = useRef(null);

  useEffect(() => {
    if (datesContainerRef.current) {
      // Scroll to the end if scrollToStart is true, otherwise scroll to the start
      datesContainerRef.current.scrollTo({
        left: scrollToStart ? datesContainerRef.current.scrollWidth : 0,
        behavior: "smooth",
      });
    }
  }, [scrollToStart]);

  const handleToggleScroll = () => {
    // Toggle scrollToStart state
    setScrollToStart((prevState) => !prevState);
  };

  const [dateOptions, setDateOptions] = useState([
    { value: "Birth", unit: "day", label: "Birth" },
    { value: "6 Weeks", unit: "week", label: "6 Weeks" },
    { value: "10 Weeks", unit: "week", label: "10 Weeks" },
    { value: "14 Weeks", unit: "month", label: "14 Weeks" },
    { value: "6 Months", unit: "month", label: "6 Months" },
    { value: "7 Months", unit: "month", label: "7 Months" },
    { value: "6-9 Months", unit: "month", label: "6-9 Months" },
    { value: "9 Months", unit: "month", label: "9 Months" },
    { value: "9 Months", unit: "month", label: "12 Months" },
    { value: "9 Months", unit: "month", label: "12-15 Months" },
    { value: "Birth", unit: "day", label: "15 Months" },
    { value: "6 Weeks", unit: "week", label: "16-18 Months" },
    { value: "6 Weeks", unit: "week", label: "18-19 Months" },
    { value: "10 Weeks", unit: "week", label: "4-6 years" },
    { value: "14 Weeks", unit: "month", label: "9-15 years" },
    { value: "6 Months", unit: "month", label: "10-12 years" },
    {
      value: "7 Months",
      unit: "month",
      label: "2nd, 3rd, 4th and 5th years",
    },
  ]);

  return (
    <div className="d-flex align-items-center">
      {scrollToStart ? (
        <img
          className="me-3 clickable"
          src={chevron}
          alt="chevron"
          onClick={handleToggleScroll}
          style={{
            cursor: "pointer",
            transform: scrollToStart ? "rotate(180deg)" : "rotate(0deg)",
            marginTop: "10px",
          }}
        />
      ) : null}
      <div
        className={`datesContainer ${scrollToStart ? "scrollToEnd" : ""}`}
        ref={datesContainerRef} // Reference to the dates container for scrolling
      >
        {dateOptions.length > 0 &&
          dateOptions.map((item, i) => (
            <Button
              key={i}
              type="text"
              className="btnStyle btn px-5-16 btn-fw-bold fs-12 mb-12 me-12"
              onClick={() => window.alert(item.value + " clicked")}
            >
              <span className="btnText">{item.label}</span>
            </Button>
          ))}
      </div>
      {!scrollToStart ? (
        <img
          className="me-3 clickable"
          src={chevron}
          alt="chevron"
          onClick={handleToggleScroll}
          style={{
            cursor: "pointer",
            transform: scrollToStart ? "rotate(180deg)" : "rotate(0deg)",
            marginTop: "10px",
          }}
        />
      ) : null}
    </div>
  );
};

export default VaccineFilter;
