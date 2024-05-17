import React, { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "antd";
import chevron from "../../../../assets/images/arrow-box-right.svg";
import closeFill from "../../../../assets/images/closeFill.svg";
import "./VaccineFilter.scss";

const VaccineFilter = ({
  dateOptions,
  activeDate,
  setActiveDate,
  setSelectedCards,
  setSelectAll,
}) => {
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

  useEffect(() => {
    /**
     * scrolling to the specific age option when we comes to vaccination
     * page on the first time
     */
    if (
      activeDate &&
      activeDate > 0 &&
      activeDate <= dateOptions.length &&
      datesContainerRef.current
    ) {
        const monthElement = datesContainerRef.current.children[activeDate];
        if (monthElement) {
        const containerRect = datesContainerRef.current.getBoundingClientRect();
          const monthRect = monthElement.getBoundingClientRect();
          const scrollLeft = monthRect.left - containerRect.left;
          datesContainerRef.current.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
      }
    }
  }, [dateOptions]);

  const handleToggleScroll = () => {
    setScrollToStart((prevState) => !prevState);
  };

  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    /**
     * This effect will run when the component mounts (page is visited)
     * Set a timeout to hide the tooltip after a certain delay (e.g., 5 seconds)
     */
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const pendingVaccines = dateOptions.filter(
    (item) => item?.alert === "failure"
  );

  const dateOptionHandler = (i) => {
    setActiveDate(i);
    setSelectedCards([]);
    setSelectAll(false);
  };

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
              key={i}
              title={tooltipTitle}
              overlayClassName="customTooltip"
              open={
                showTooltip &&
                pendingVaccines.length === 1 &&
                item.alert === "failure"
              }
              placement="topLeft"
            >
              <Button
                key={i}
                type="text"
                className={`btnStyle btn px-5-16 fs-14 ${
                  i === activeDate ? "activeBtn" : ""
                }`}
                style={{ margin: "0" }}
                onClick={() => dateOptionHandler(i)}
              >
                {item.alert ? (
                  <span
                    className={`alertStyle ${
                      item.alert === "success" ? "success" : "failure"
                    }`}
                  />
                ) : null}
                <span
                  className={`btnText ${
                    i === activeDate ? "activeBtnText" : ""
                  }`}
                >
                  {item.label}
                </span>
              </Button>
            </Tooltip>
          ))}
      </div>
      {!scrollToStart ? (
        <div className="vaccineFilterStyle">
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
