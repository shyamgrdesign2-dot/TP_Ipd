import React, { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "antd";
import chevron from "../../../assets/images/arrow-box-right.svg";
import closeFill from "../../../assets/images/closeFill.svg";
import "./VaccineFilter.scss";

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
    { value: "Birth", alert: "success", unit: "day", label: "Birth" },
    { value: "6 Weeks", alert: "success", unit: "week", label: "6 Weeks" },
    { value: "10 Weeks", alert: "failure", unit: "week", label: "10 Weeks" },
    { value: "14 Weeks", alert: null, unit: "month", label: "14 Weeks" },
    { value: "6 Months", alert: null, unit: "month", label: "6 Months" },
    { value: "7 Months", alert: null, unit: "month", label: "7 Months" },
    { value: "6-9 Months", alert: null, unit: "month", label: "6-9 Months" },
    { value: "9 Months", alert: null, unit: "month", label: "9 Months" },
    { value: "9 Months", alert: null, unit: "month", label: "12 Months" },
    { value: "9 Months", alert: null, unit: "month", label: "12-15 Months" },
    { value: "Birth", alert: null, unit: "day", label: "15 Months" },
    { value: "6 Weeks", alert: null, unit: "week", label: "16-18 Months" },
    { value: "6 Weeks", alert: null, unit: "week", label: "18-19 Months" },
    { value: "10 Weeks", alert: null, unit: "week", label: "4-6 years" },
    { value: "14 Weeks", alert: null, unit: "month", label: "9-15 years" },
    { value: "6 Months", alert: null, unit: "month", label: "10-12 years" },
    {
      value: "7 Months",
      unit: "month",
      label: "2nd, 3rd, 4th and 5th years",
    },
  ]);

  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // This effect will run when the component mounts (page is visited)
    // Set a timeout to hide the tooltip after a certain delay (e.g., 5 seconds)
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const pendingVaccines = dateOptions.filter(
    (item) => item.alert === "failure"
  );

  const tooltipTitle = () => {
    return (
      <>
        <div className="d-flex align-items-center justify-content-between">
          <span className="warning" />
          <div style={{ paddingLeft: "16px" }}>Vaccine Pending!</div>
          <img
            className="imageStyle"
            src={closeFill}
            alt="closeFill"
            onClick={() => setShowTooltip(false)}
          />
        </div>
        <div>Pending vaccine detected for this timeframe.</div>
      </>
    );
  };

  return (
    <div className="d-flex align-items-center">
      {scrollToStart ? (
        <img
          className="me-3 clickable imageStyle"
          src={chevron}
          alt="chevron"
          onClick={handleToggleScroll}
          style={{
            cursor: "pointer",
            transform: scrollToStart ? "rotate(180deg)" : "rotate(0deg)",
            margin: "0 5px 0 5px",
          }}
        />
      ) : null}
      <div
        className={`datesContainer ${scrollToStart ? "scrollToEnd" : ""}`}
        ref={datesContainerRef} // Reference to the dates container for scrolling
      >
        {dateOptions.length > 0 &&
          dateOptions.map((item, i) => (
            <Tooltip
              title={tooltipTitle}
              visible={
                showTooltip &&
                pendingVaccines.length === 1 &&
                item.alert === "failure"
              }
              placement="topLeft"
            >
              <Button
                key={i}
                type="text"
                className="btnStyle btn px-5-16 fs-14"
                style={{ margin: "0" }}
                onClick={() => window.alert(item.value + " clicked")}
              >
                {item.alert ? (
                  <span
                    className={`alertStyle ${
                      item.alert === "success" ? "success" : "failure"
                    }`}
                  />
                ) : null}
                <span className="btnText">{item.label}</span>
              </Button>
            </Tooltip>
          ))}
      </div>
      {!scrollToStart ? (
        <div className="imageStyle">
          <div className="blurOverlay" />
          <img
            className="clickable"
            src={chevron}
            alt="chevron"
            onClick={handleToggleScroll}
            style={{
              cursor: "pointer",
              transform: scrollToStart ? "rotate(180deg)" : "rotate(0deg)",
              margin: "0 0 5px 5px",
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default VaccineFilter;
