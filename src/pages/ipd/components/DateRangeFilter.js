import React, { useMemo, useRef, useEffect } from "react";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

// Constants - reasonable extraction
const DATE_FORMAT = "YYYY-MM-DD";
const DISPLAY_FORMAT = "DD-MM-YYYY";

const DateRangeFilter = ({
  placeholder = "Filter by admitted date",
  // placeholderType = "admitted", // admitted | discharged | surgery | generic
  dateRange,
  dateStatus,
  isOpen,
  onRangeChange,
  onToggleModal,
  onCancel,
  disabledDate,
  className = "",
}) => {
  const containerRef = useRef(null);

  // Handle clicks outside the component to close the calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen) {
        // Check if click is outside the container
        const isOutsideContainer =
          containerRef.current && !containerRef.current.contains(event.target);

        // Check if click is on the calendar popup (Ant Design renders it with specific classes)
        const isOnCalendarPopup =
          event.target.closest(".ant-picker-dropdown") ||
          event.target.closest(".ant-picker-panel") ||
          event.target.closest(".ant-picker-range-wrapper");

        // Only close if clicking outside container AND not on calendar popup
        if (isOutsideContainer && !isOnCalendarPopup) {
          onToggleModal();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggleModal]);

  // Memoize presets to avoid recreation on every render
  const rangePresets = useMemo(
    () => [
      {
        label: <div className={dateStatus === 1 ? "active" : ""}>Today</div>,
        value: [dayjs(), dayjs().endOf("day")],
      },
      {
        label: (
          <div className={dateStatus === 2 ? "active" : ""}>Yesterday</div>
        ),
        value: [dayjs().add(-1, "d"), dayjs()],
      },
      {
        label: (
          <div className={dateStatus === 3 ? "active" : ""}>Last Month</div>
        ),
        value: [dayjs().add(-1, "M"), dayjs()],
      },
      {
        label: (
          <div
            className={!dateStatus ? "active" : ""}
            onClick={() => onRangeChange(null)}
          >
            Custom range
          </div>
        ),
        value: null,
      },
    ],
    [dateStatus, onRangeChange]
  );

  // Helper function - kept simple and inline
  const formatDateRange = () => {
    if (!dateRange){
      // Prefer explicit placeholder prop if provided
      if (placeholder) return placeholder;
      // Fallbacks by type
      // switch (placeholderType) {
      //   case "discharged":
      //     return "Filter by discharge date";
      //   case "surgery":
      //     return "Filter by surgery date";
      //   case "generic":
      //     return "Filter by date";
      //   case "admitted":
      //   default:
      //     return "Filter by admitted date";
      // }
    };

    const statusLabels = {
      1: "Today",
      2: "Yesterday",
      3: "Last month",
    };

    return (
      statusLabels[dateStatus] ||
      `${dayjs(dateRange.startDate).format(DISPLAY_FORMAT)} - ${dayjs(
        dateRange.endDate
      ).format(DISPLAY_FORMAT)}`
    );
  };

  // Compute picker value - kept as useMemo for performance
  const pickerValue = useMemo(() => {
    if (!dateRange || dateRange.startDate === dateRange.endDate) {
      return null;
    }

    return [
      dayjs(dateRange.startDate, DATE_FORMAT),
      dayjs(dateRange.endDate, DATE_FORMAT),
    ];
  }, [dateRange]);

  return (
    <div
      ref={containerRef}
      className={`massage-date-wrapper ms-3 ${className}`}
    >
      <div
        className="fs-14 h-100 w-100 d-flex align-items-center justify-content-between"
        onClick={onToggleModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleModal();
          }
        }}
      >
        <i className="me-2 fs-18 icon-calendar" aria-hidden="true" />
        <span className="me-2">
          <span className={!dateRange ? "date-placeholder" : ""}>
            {formatDateRange()}
          </span>
        </span>
      </div>

      <RangePicker
        disabledDate={disabledDate}
        open={isOpen}
        presets={rangePresets}
        format={DISPLAY_FORMAT}
        onChange={onRangeChange}
        popupClassName="massage-date"
        className="massage-input"
        inputReadOnly
        value={pickerValue}
        renderExtraFooter={() => (
          <div className="d-flex align-items-center justify-content-between py-1">
            <div>
              {dateRange ? (
                <>
                  {dayjs(dateRange.startDate).format(DISPLAY_FORMAT)} -{" "}
                  {dayjs(dateRange.endDate).format(DISPLAY_FORMAT)}
                </>
              ) : (
                "No dates selected"
              )}
            </div>
            <div>
              <button className="btn btn-text me-3 px-0" onClick={onCancel}>
                <span className="clear-filter">Clear Filter</span>
              </button>
              <Button className="px-4" type="primary" onClick={onToggleModal}>
                Apply Filter
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default DateRangeFilter;
