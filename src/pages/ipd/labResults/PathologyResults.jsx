import { Checkbox, Space, message, Typography, Popover, Spin } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import DateRangeFilter from "../components/DateRangeFilter";
import { useDispatch } from "react-redux";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectFilteredPathologyResults,
  selectScanError,
  selectSelectedTests,
  selectSelectedCategories,
  selectError,
  selectUpdateError,
  selectSearchText,
  selectExpandedCategories,
  selectTotalSelectionCount,
  selectTotalItemCount,
  selectIsAllSelected,
  selectIsMainCheckboxIndeterminate,
  getPathologyResults,
  toggleCategory,
  selectAll,
  deselectAll,
  selectCategoryWithTests,
  deselectCategoryWithTests,
  selectTest,
  deselectTest,
  selectCategory,
  deselectCategory,
  clearError,
  addToDischargeSummary,
  setSearchText,
  setSelectedDateRange,
  selectFilteredAvailableDates,
  selectIsLoading,
  selectSelectedDateRange,
} from "../../../redux/ipd/labResultsSlice";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import ToolbarActions from "../components/ToolbarActions/ToolbarActions";
import SearchInput from "../inPatients/components/SearchInput";
import { MESSAGE_KEY } from "../../../utils/constants";
import visitEnd from "../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../assets/images/close-visit.svg";
import { debounce } from "lodash";
import EmptyState from "./EmptyState";
import ReferenceRangeTooltip from "./ReferenceRangeTooltip";

const { Text } = Typography;

const Pathologyresults = () => {
  const { state } = useLocation();
  const { patientDetails } = state || {};

  const patientId = patientDetails?.details?.id;
  const { admissionId, mrno } = patientDetails;
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      dispatch(setSearchText(searchValue));
    }, 300),
    [dispatch]
  );

  // Redux state
  const pathologyResults = useSelector(selectFilteredPathologyResults);
  const scanError = useSelector(selectScanError);
  const selectedTests = useSelector(selectSelectedTests);
  const selectedCategories = useSelector(selectSelectedCategories);
  const searchText = useSelector(selectSearchText);
  const expandedCategories = useSelector(selectExpandedCategories);
  const error = useSelector(selectError);
  const updateError = useSelector(selectUpdateError);
  const totalSelectionCount = useSelector(selectTotalSelectionCount);
  const totalItemCount = useSelector(selectTotalItemCount);
  const isAllSelected = useSelector(selectIsAllSelected);
  const isMainIndeterminate = useSelector(selectIsMainCheckboxIndeterminate);
  const availableDates = useSelector(selectFilteredAvailableDates);
  const isLoading = useSelector(selectIsLoading);
  const selectedDateRange = useSelector(selectSelectedDateRange);
  // Local state for date filtering UI
  const [dateStatus, setDateStatus] = useState("closed");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Local state for search input (for immediate UI updates)
  const [localSearchText, setLocalSearchText] = useState("");

  // Refs for scroll synchronization
  const headerScrollRef = useRef(null);
  const rowScrollRefs = useRef([]);

  const pathologyResultsNoOfDays = 6000;

  // Sync local search text with Redux state
  useEffect(() => {
    setLocalSearchText(searchText);
  }, [searchText]);

  // Load data on component mount only (not on search/date changes)
  useEffect(() => {
    if (patientId && admissionId) {
      dispatch(
        getPathologyResults({
          mrno,
          noOfDays: pathologyResultsNoOfDays,
        })
      );
    }
  }, [dispatch, patientId, admissionId, mrno]);

  // Handle errors
  useEffect(() => {
    if (error) {
      message.error(`Error loading lab results: ${error}`);
      dispatch(clearError());
    }
    if (updateError) {
      message.error(`Error updating lab results: ${updateError}`);
      dispatch(clearError());
    }
    if (scanError) {
      message.error(`Error loading scan results: ${scanError}`);
      dispatch(clearError());
    }
  }, [error, updateError, scanError, dispatch]);

  // Synchronize scrolling between header and rows
  useEffect(() => {
    const handleHeaderScroll = (e) => {
      const scrollLeft = e.target.scrollLeft;
      setIsScrolled(scrollLeft > 0);
      rowScrollRefs.current.forEach((ref) => {
        if (ref && ref !== e.target) {
          ref.scrollLeft = scrollLeft;
        }
      });
    };

    const handleRowScroll = (e) => {
      const scrollLeft = e.target.scrollLeft;
      setIsScrolled(scrollLeft > 0);
      if (headerScrollRef.current) {
        headerScrollRef.current.scrollLeft = scrollLeft;
      }
      rowScrollRefs.current.forEach((ref) => {
        if (ref && ref !== e.target) {
          ref.scrollLeft = scrollLeft;
        }
      });
    };

    // Add event listeners
    if (headerScrollRef.current) {
      headerScrollRef.current.addEventListener("scroll", handleHeaderScroll);
    }

    rowScrollRefs.current.forEach((ref) => {
      if (ref) {
        ref.addEventListener("scroll", handleRowScroll);
      }
    });

    // Cleanup
    return () => {
      if (headerScrollRef.current) {
        headerScrollRef.current.removeEventListener(
          "scroll",
          handleHeaderScroll
        );
      }
      rowScrollRefs.current.forEach((ref) => {
        if (ref) {
          ref.removeEventListener("scroll", handleRowScroll);
        }
      });
    };
  }, [expandedCategories]); // Re-run when categories expand/collapse

  const getCategoryTestKeys = (categoryKey) => {
    const category = pathologyResults.find((cat) => cat.key === categoryKey);
    return category ? category.tests.map((test) => test.key) : [];
  };

  // Handle search input change with debouncing
  const handleSearchChange = (value) => {
    setLocalSearchText(value);
    debouncedSearch(value);
  };

  // Handle search clear
  const handleSearchClear = () => {
    setLocalSearchText("");
    dispatch(setSearchText(""));
  };

  const onDatePickerToggle = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const onDateCancel = () => {
    setDateStatus(null);
    setIsDatePickerOpen(!isDatePickerOpen);
    dispatch(setSelectedDateRange(null));
  };

  const onDateRangeChange = useCallback(
    (dates, dateStrings) => {
      if (dates) {
        // Determine date status based on selected dates
        const today = moment().format("YYYY-MM-DD");
        const startDate = moment(dateStrings[0], "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        );
        const endDate = moment(dateStrings[1], "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        );

        if (startDate === today && endDate === today) {
          setDateStatus(1);
        } else if (
          startDate === moment().add(-1, "d").format("YYYY-MM-DD") &&
          endDate === today
        ) {
          setDateStatus(2);
        } else if (
          startDate === moment().add(-7, "d").format("YYYY-MM-DD") &&
          endDate === today
        ) {
          setDateStatus(3);
        } else if (
          startDate === moment().add(-1, "M").format("YYYY-MM-DD") &&
          endDate === today
        ) {
          setDateStatus(4);
        } else {
          setDateStatus(null);
        }

        // Dispatch to Redux instead of local state
        dispatch(setSelectedDateRange([startDate, endDate]));
      } else {
        setDateStatus(null);
        dispatch(setSelectedDateRange(null));
      }
    },
    [dispatch]
  );

  // Handle main checkbox (select all)
  const handleMainCheckboxChange = (checked) => {
    if (checked) {
      dispatch(selectAll());
    } else {
      dispatch(deselectAll());
    }
  };

  // Handle category checkbox
  const handleCategoryCheckboxChange = (categoryKey, checked) => {
    const categoryTestKeys = getCategoryTestKeys(categoryKey);

    if (checked) {
      dispatch(
        selectCategoryWithTests({ categoryKey, testKeys: categoryTestKeys })
      );
    } else {
      dispatch(
        deselectCategoryWithTests({ categoryKey, testKeys: categoryTestKeys })
      );
    }
  };

  // Handle individual test checkbox
  const handleTestCheckboxChange = (testKey, categoryKey, checked) => {
    if (checked) {
      dispatch(selectTest(testKey));

      // Check if all tests in category are now selected
      const categoryTestKeys = getCategoryTestKeys(categoryKey);
      const updatedSelectedTests = [...selectedTests, testKey];
      const allCategoryTestsSelected = categoryTestKeys.every((key) =>
        updatedSelectedTests.includes(key)
      );

      if (
        allCategoryTestsSelected &&
        !selectedCategories.includes(categoryKey)
      ) {
        dispatch(selectCategory(categoryKey));
      }
    } else {
      dispatch(deselectTest(testKey));

      // Deselect category if it was selected
      if (selectedCategories.includes(categoryKey)) {
        dispatch(deselectCategory(categoryKey));
      }
    }
  };

  // Helper function to determine trend based on value and reference range
  const getValueTrend = (value, refRange) => {
    if (!value || !refRange || value === "--") {
      return null;
    }

    // Extract numeric value from string (remove units)
    const numericValue = parseFloat(value.toString().replace(/[^\d.-]/g, ""));
    if (isNaN(numericValue)) {
      return null;
    }

    if (numericValue > refRange.max) {
      return "above";
    } else if (numericValue < refRange.min) {
      return "below";
    }

    return "normal";
  };

  // Helper function to get trend icon for value
  const getValueTrendIcon = (value, refRange) => {
    const trend = getValueTrend(value, refRange);

    if (trend === "above") {
      return <ArrowUpOutlined className="trend-arrow-abnormal" />;
    } else if (trend === "below") {
      return <ArrowDownOutlined className="trend-arrow-abnormal" />;
    }

    return null;
  };

  const handleCategoryToggle = (categoryKey) => {
    dispatch(toggleCategory(categoryKey));
  };

  // Handle add to discharge summary
  const handleAddToDischarge = async () => {
    try {
      const result = await dispatch(
        addToDischargeSummary({
          patientId,
          admissionId,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" alt="end" />
              <div>
                <div className="title-common text-start fontroboto">
                  Selected Lab Results Added to Discharge Summary
                </div>
              </div>
              <img
                src={imgCloseVisit}
                className="ms-3"
                onClick={() => message.destroy()}
                alt="Close"
              />
            </div>
          ),
          duration: 3,
        });
        await dispatch(
          getPathologyResults({
            mrno,
            noOfDays: pathologyResultsNoOfDays,
          })
        );
      } else {
        console.error("Failed to add items to discharge summary");
      }
    } catch (error) {
      message.error("Failed to add items to discharge summary");
    }
  };

  // Helper function to check if category is selected
  const isCategorySelected = (categoryKey) => {
    return selectedCategories.includes(categoryKey);
  };

  // Helper function to check if category is indeterminate
  const isCategoryIndeterminate = (categoryKey) => {
    const categoryTestKeys = getCategoryTestKeys(categoryKey);
    const selectedCategoryTests = categoryTestKeys.filter((key) =>
      selectedTests.includes(key)
    );
    return (
      selectedCategoryTests.length > 0 &&
      selectedCategoryTests.length < categoryTestKeys.length
    );
  };

  const renderCategoryHeader = (category) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        cursor: "pointer",
      }}
      onClick={() => handleCategoryToggle(category.key)}
    >
      <Text style={{ fontSize: "16px", fontWeight: 500, color: "#454551" }}>
        {category.category}
      </Text>
      <Space>
        <Checkbox
          checked={isCategorySelected(category.key)}
          indeterminate={isCategoryIndeterminate(category.key)}
          onChange={(e) => {
            e.stopPropagation(); // Prevent category toggle when clicking checkbox
            handleCategoryCheckboxChange(category.key, e.target.checked);
          }}
        />
        {expandedCategories.includes(category.key) ? (
          <i className="icon-right iconrotate90"></i>
        ) : (
          <i className="icon-right iconrotate270"></i>
        )}
      </Space>
    </div>
  );

  return (
    <div>
      <div className="search-filter-bar">
        <SearchInput
          value={localSearchText}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="Search by test name or category"
          className="search-input"
        />

        <DateRangeFilter
          dateRange={selectedDateRange}
          dateStatus={dateStatus}
          onRangeChange={onDateRangeChange}
          onToggleModal={onDatePickerToggle}
          onCancel={onDateCancel}
          placeholder="Filter by date"
          isOpen={isDatePickerOpen}
          className="date-filter-btn"
          wrapperClassName="date-filter-btn-wrapper"
        />
      </div>
      {/* Loading Spinner */}
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <Spin size="large" />
        </div>
      )}
      {pathologyResults.length > 0 && !isLoading ? (
        <div className="lab-results-content">
          {/* Global Table Header */}
          <div className="table-header-container">
            <div
              className={`table-header-fixed ${isScrolled ? "scrolled" : ""}`}
            >
              <div className="header-checkbox">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isMainIndeterminate}
                  onChange={(e) => handleMainCheckboxChange(e.target.checked)}
                />
              </div>
              <div className="header-name">
                <Text
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#454551",
                  }}
                >
                  Name
                </Text>
              </div>
            </div>
            <div className="table-header-scrollable" ref={headerScrollRef}>
              {availableDates.map((date) => (
                <div className="header-date" key={date}>
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#171725",
                    }}
                  >
                    {date}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Categories and Data */}
          {pathologyResults.map((category) => (
            <div key={category.key} className="category-section">
              {expandedCategories.includes(category.key) ? (
                <div className="expanded-category">
                  <div className="category-header">
                    {renderCategoryHeader(category)}
                  </div>
                  <div className="category-content">
                    {category.tests.map((test, testIndex) => (
                      <div key={test.key} className="test-row-container">
                        <div
                          className={`test-row-fixed ${
                            isScrolled ? "scrolled" : ""
                          }`}
                        >
                          <div className="test-checkbox">
                            <Checkbox
                              checked={selectedTests.includes(test.key)}
                              onChange={(e) => {
                                handleTestCheckboxChange(
                                  test.key,
                                  category.key,
                                  e.target.checked
                                );
                              }}
                            />
                          </div>
                          <div className="test-name">
                            <Space>
                              <Text
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  color: "#454551",
                                }}
                              >
                                {test.name}
                              </Text>
                              <Popover
                                content={
                                  <ReferenceRangeTooltip
                                    refRange={test.refRange}
                                  />
                                }
                                title={null}
                                trigger="hover"
                                placement="top"
                                overlayClassName="reference-range-popover"
                              >
                                <InfoCircleOutlined
                                  style={{
                                    color: "#A2A2A8",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                  }}
                                />
                              </Popover>
                            </Space>
                          </div>
                        </div>
                        <div
                          className="test-row-scrollable"
                          ref={(el) => (rowScrollRefs.current[testIndex] = el)}
                        >
                          {availableDates.map((date) => {
                            const value = test.values[date]?.value;
                            const trendIcon = getValueTrendIcon(
                              value,
                              test.refRange
                            );
                            const trend = getValueTrend(value, test.refRange);

                            return (
                              <div className="test-value" key={date}>
                                <Space>
                                  <Text
                                    className={
                                      trend === "above" || trend === "below"
                                        ? "test-value-abnormal"
                                        : "test-value-normal"
                                    }
                                  >
                                    {value || "--"}
                                  </Text>
                                  {trendIcon}
                                </Space>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="collapsed-category">
                  {renderCategoryHeader(category)}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState label="Pathology Results" />
      )}

      {/* Toolbar Actions */}
      {selectedTests.length > 0 && (
        <div className="ipd-toolbar-lab-results">
          <ToolbarActions
            showEditForm={false}
            showSelectionCount={totalSelectionCount > 0}
            showAddToDischarge={totalSelectionCount > 0}
            selectedCount={totalSelectionCount}
            totalCount={totalItemCount}
            onAddToDischarge={handleAddToDischarge}
            onPrintPreview={() => console.log("Preview")}
            onPrint={() => console.log("Print")}
            onSettings={() => console.log("Settings")}
            onDownload={() => console.log("Download")}
          />
        </div>
      )}
    </div>
  );
};

export default Pathologyresults;
