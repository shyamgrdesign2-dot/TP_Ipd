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
  const datesContainerRef = useRef(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    /**
     * scrolling to the specific age option when we comes to vaccination
     * page on the first time
     */
    if (!hasScrolledRef.current && datesContainerRef.current) {
      if (activeDate && activeDate > 0 && activeDate <= dateOptions.length) {
        const monthElement = datesContainerRef.current.children[activeDate];
        if (monthElement) {
          const containerRect =
            datesContainerRef.current.getBoundingClientRect();
          const monthRect = monthElement.getBoundingClientRect();
          const scrollLeft =
            monthRect.left -
            containerRect.left -
            containerRect.width / 2 +
            monthRect.width / 2;
          datesContainerRef.current.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
          hasScrolledRef.current = true;
        }
      }
    }
  }, [dateOptions]);

  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const handleLeftToggleScroll = () => {
    if (datesContainerRef.current) {
      datesContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
    setShowLeft(false);
    setShowRight(true);
  };

  const handleRightToggleScroll = () => {
    if (datesContainerRef.current) {
      datesContainerRef.current.scrollTo({
        left: datesContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
    setShowRight(false);
    setShowLeft(true);
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
      {showLeft && (
        <img
          className="me-3 clickable imageStyle"
          src={chevron}
          alt="chevron"
          onClick={handleLeftToggleScroll}
          style={{
            cursor: "pointer",
            transform: "rotate(180deg)",
            margin: "0 5px 0 5px",
          }}
        />
      )}
      <div
        className={`datesContainer`}
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
      {showRight && (
        <div className="vaccineFilterStyle">
          <img
            className="clickable"
            src={chevron}
            alt="chevron"
            onClick={handleRightToggleScroll}
            style={{
              cursor: "pointer",
              transform: "rotate(0deg)",
              margin: "0 0 5px 5px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VaccineFilter;
