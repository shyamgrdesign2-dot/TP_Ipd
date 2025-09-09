import React, { useCallback, useEffect, useState, useRef } from "react";
import moment from "moment";
import { Table, DatePicker, Input, Button, notification, Spin } from "antd";
import { Row, Col } from "react-bootstrap";
import dayjs from "dayjs";
import noData from "../../assets/images/nodata-found.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPatients,
  fetchFilters,
  setFilterParams,
  resetPatients,
  incrementPage,
} from "../../redux/ipd/inPatientsSlice";
import SubHeader from "./components/SubHeader";
import FilterDropdown from "../../components/InPatients/FilterDropdown";
import Referral from "./components/Referral";
import "./InPatients.scss";
import { useNavigate } from "react-router-dom";

// Custom hook for debouncing values
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes or the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD-MM-YYYY";
const { RangePicker } = DatePicker;

function InPatients() {
  const [dateStatus, setDateStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // Get IPD data from Redux store
  const {
    patients: {
      data: patientsData,
      loading: patientsLoading,
      hasMore,
      error: patientsError,
    },
    filters: { ward: wardFilters, doctor: doctorFilters, error: filtersError },
    filterParams,
  } = useSelector((state) => state.inPatients);

  // Format doctor data for the filter dropdown
  const doctors =
    doctorFilters?.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
    })) || [];

  // Format ward data for the filter dropdown
  const wards =
    wardFilters?.map((ward) => ({
      id: ward.id,
      name: ward.title,
    })) || [];

  // We're using dateRange instead of date state
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  // Debounce the search query with a 500ms delay
  const debouncedSearchQuery = useDebounce(inputSearchQuery, 500);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectedWards, setSelectedWards] = useState([]);
  const consultButtonRef = useRef(null);

  const handleClickOutside = (event) => {
    // This function is kept for future use if needed
    if (!consultButtonRef?.current?.contains(event.target)) {
      // Future implementation
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add state to track if filters have been fetched
  const [filtersAttempted, setFiltersAttempted] = useState(false);

  // State to track if we're using static filters
  const [usingStaticFilters, setUsingStaticFilters] = useState(false);

  // Show notification when using static filters
  useEffect(() => {
    if (filtersError && !usingStaticFilters) {
      setUsingStaticFilters(true);
      notification.info({
        message: "Using Static Filters",
        description:
          "Filter API call failed. Using static filter options for demonstration purposes.",
        duration: 5,
        placement: "topRight",
      });
    }
  }, [filtersError, usingStaticFilters]);

  // Fetch doctor and ward filters on component mount only
  useEffect(() => {
    // Only fetch if we haven't attempted to fetch filters yet
    if (!filtersAttempted) {
      dispatch(fetchFilters({ field: "doctor" }));
      dispatch(fetchFilters({ field: "ward" }));
      setFiltersAttempted(true);
    }
  }, [dispatch, filtersAttempted]);

  // Track if we've attempted to fetch data
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // Track if we're currently loading more data (for pagination)
  const [loadingMore, setLoadingMore] = useState(false);

  // State to track if we're using static data
  const [usingStaticData, setUsingStaticData] = useState(false);

  // Show notification when using static data
  useEffect(() => {
    if (patientsError && !usingStaticData) {
      setUsingStaticData(true);
      notification.info({
        message: "Using Static Data",
        description:
          "API call failed. Using static data for demonstration purposes.",
        duration: 5,
        placement: "topRight",
      });
    }
  }, [patientsError, usingStaticData]);

  // Fetch patients data when filters change (initial load)
  useEffect(() => {
    // Skip if we're loading more data (pagination is handled separately)
    if (loadingMore) return;

    // Skip if page is not 1 (this effect only handles initial load/filter changes)
    if (filterParams.page !== 1) return;

    // Reset the patients data when filters change
    dispatch(resetPatients());

    // Only fetch if there's no error or this is the first attempt
    if (!patientsError || !fetchAttempted) {
      dispatch(
        fetchPatients({
          ...filterParams,
          startDate: dateRange ? dateRange.startDate : "",
          endDate: dateRange ? dateRange.endDate : "",
          doctorIdsFilter:
            selectedDoctors.length > 0 ? selectedDoctors.join(",") : "",
          ward: selectedWards.length > 0 ? selectedWards.join(",") : "",
        })
      );
      setFetchAttempted(true);
    }
  }, [
    dispatch,
    filterParams, // Include the entire filterParams object to satisfy the linter
    selectedDoctors,
    selectedWards,
    dateRange,
    patientsError,
    fetchAttempted,
    loadingMore,
  ]);

  // Handle pagination separately
  useEffect(() => {
    // Skip if this is page 1 (handled by the above effect)
    if (filterParams.page === 1 || !loadingMore) return;

    // Fetch the next page of data
    dispatch(
      fetchPatients({
        ...filterParams,
        startDate: dateRange ? dateRange.startDate : "",
        endDate: dateRange ? dateRange.endDate : "",
        doctorIdsFilter:
          selectedDoctors.length > 0 ? selectedDoctors.join(",") : "",
        ward: selectedWards.length > 0 ? selectedWards.join(",") : "",
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterParams, loadingMore, selectedDoctors, selectedWards]);

  // Reset loadingMore when patients data changes or there's an error
  useEffect(() => {
    if (loadingMore && (patientsData.length > 0 || patientsError)) {
      setLoadingMore(false);
    }
  }, [patientsData, patientsError, loadingMore]);

  // Calendar options are handled directly in the onRangeChange function

  // This effect is no longer needed as we're using dateRange directly

  // Effect to handle debounced search query changes
  useEffect(() => {
    // Reset patients data when search query changes
    dispatch(resetPatients());
    // Reset fetchAttempted to trigger a new API call when search query changes
    setFetchAttempted(false);
    dispatch(setFilterParams({ search: debouncedSearchQuery }));
  }, [debouncedSearchQuery, dispatch]);

  // Handle input changes without triggering immediate API calls
  const onSearch = useCallback((query) => {
    setInputSearchQuery(query);
  }, []);

  const onViewDetails = (patientData) => {
    navigate(`/ipd/patient-details`, {
      state: { patientData },
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "srno",
      key: "srno",
      className: "fs-14",
      fixed: "left",
      render: (text, record, index) => (
        <div>
          <span>{index + 1}</span>
        </div>
      ),
    },
    {
      title: "PATIENT DETAILS",
      dataIndex: "patientName",
      key: "patientName",
      fixed: "left",
      render: (text, record) => (
        <div>
          <span
            className="text-primary cursor-pointer"
            onClick={() => onViewDetails(record?.patientData)}
          >
            {record?.patientName}
          </span>
          <br />
          <small>
            {record?.gender}, {`${record?.age}y`}
          </small>
        </div>
      ),
    },
    {
      title: "Patient ID",
      dataIndex: "patientId",
      key: "patientId",
      render: (text, record) => (
        <div className="d-flex align-items-center gap-2">
          <span>{record?.patientId || ""}</span>
          {record?.referral && <Referral />}
        </div>
      ),
    },
    {
      title: "Ward/Room",
      dataIndex: "ward",
      key: "ward",
      render: (text, record) => (
        <div>
          <span>
            {record?.ward || "N/A"} / {record?.room || "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (text, record) => (
        <div>
          <span>{record.contactNumber || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Admitting Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (text, record) => (
        <div>
          <span>{record.doctorName || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Admitted On",
      dataIndex: "admittedOn",
      key: "admittedOn",
      sortDirections: ["descend", "ascend", "descend"],
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const aDate = moment(a.admittedOn).valueOf();
        const bDate = moment(b.admittedOn).valueOf();
        return aDate - bDate;
      },
      render: (text, record) => {
        const dateTime = moment(record.admittedOn);
        return <div>{dateTime.format("DD-MM-YYYY")}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div
          size="middle"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button
            className="btn btn-outline-primary"
            style={{ fontSize: "13px !important" }}
            onClick={() => {
              onViewDetails(record?.patientData);
            }}
          >
            View Details
          </button>
        </div>
      ),
    },
  ];

  const handleChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.order) {
      const sortField = sorter.field;
      const sortOrder = sorter.order === "ascend" ? "asc" : "desc";
      dispatch(setFilterParams({ sort: `${sortField}:${sortOrder}` }));
    }
  };

  const emptyText = (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "calc(100vh - 350px)" }}
    >
      <img src={noData} alt="Warning" />
      <div className="mt-3 fontroboto fw-normal">
        {patientsError
          ? "Using static data. No patients match your filters."
          : "There are no patients right now!"}
      </div>
    </div>
  );

  // Load more data when user scrolls to bottom
  const loadMoreData = useCallback(() => {
    // Don't load more if already loading, there's an error, or no more data
    if (patientsLoading || patientsError || !hasMore || loadingMore) return;

    // Set loading more to true to prevent multiple calls
    setLoadingMore(true);

    // Increment the page number to fetch the next page
    dispatch(incrementPage());
  }, [dispatch, patientsLoading, patientsError, hasMore, loadingMore]);

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  // Create intersection observer for infinite scrolling
  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      // Return if already loading, loading more, or there's an error
      if (patientsLoading || patientsError || loadingMore) return;

      // Disconnect previous observer if it exists
      if (observer.current) observer.current.disconnect();

      // Create a new observer
      observer.current = new IntersectionObserver((entries) => {
        // If the last element is visible and there's more data to load
        if (entries[0].isIntersecting && hasMore) {
          // Add a small delay to prevent multiple triggers
          setTimeout(() => {
            loadMoreData();
          }, 100);
        }
      });

      // Observe the last element if it exists
      if (node) observer.current.observe(node);
    },
    [patientsLoading, hasMore, patientsError, loadMoreData, loadingMore]
  );

  const rangePresets = [
    {
      label: <div className={`${dateStatus === 1 ? "active" : ""}`}>Today</div>,
      value: [dayjs(), dayjs().endOf("day")],
    },
    {
      label: (
        <div className={`${dateStatus === 2 ? "active" : ""}`}>Yesterday</div>
      ),
      value: [dayjs().add(-1, "d"), dayjs()],
    },
    {
      label: (
        <div className={`${dateStatus === 3 ? "active" : ""}`}>Last Month</div>
      ),
      value: [dayjs().add(-1, "M"), dayjs()],
    },
    {
      label: (
        <div
          className={`${!dateStatus ? "active" : ""}`}
          onClick={() => onRangeChange(null)}
        >
          Custom range
        </div>
      ),
      value: null,
    },
  ];

  const onRangeChange = (dates, dateStrings) => {
    // Don't reset fetchAttempted here, as we only want to fetch when Done is clicked

    if (dates) {
      if (
        dayjs().format(dateFormat) ===
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ===
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(1);
      } else if (
        dayjs().add(-7, "d").format(dateFormat) ===
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ===
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(2);
      } else if (
        dayjs().add(-1, "M").format(dateFormat) ===
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ===
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(3);
      } else {
        setDateStatus(null);
      }

      const newDateRange = {
        startDate: moment(dateStrings[0], showDateFormat).format(dateFormat),
        endDate: moment(dateStrings[1], showDateFormat).format(dateFormat),
      };

      setDateRange(newDateRange);
    } else {
      setDateStatus(null);
      setDateRange(null);
    }
    // No API call here - it will be triggered when Done button is clicked
  };

  const handlePickerModal = useCallback(() => {
    // Toggle the picker modal
    setPickerModal(!pickerModal);

    // If we're closing the modal (Done button clicked), trigger API call
    if (pickerModal) {
      // Reset patients data when date range changes
      dispatch(resetPatients());
      // Reset fetchAttempted to trigger a new API call with the updated date range
      setFetchAttempted(false);
    }
  }, [pickerModal, dispatch]);

  const handleDoctorFilterChange = useCallback(
    (doctorIds) => {
      setSelectedDoctors(doctorIds);
      // Reset the page to 1 in Redux
      dispatch(resetPatients());
      // Reset fetchAttempted to trigger a new API call when filters change
      setFetchAttempted(false);
    },
    [dispatch]
  );

  const handleWardFilterChange = useCallback(
    (wardIds) => {
      setSelectedWards(wardIds);
      // Reset the page to 1 in Redux
      dispatch(resetPatients());
      // Reset fetchAttempted to trigger a new API call when filters change
      setFetchAttempted(false);
    },
    [dispatch]
  );

  // State to force filter dropdowns to reset
  const [filterResetKey, setFilterResetKey] = useState(0);

  // Function to clear all filters
  const handleClearAllFilters = useCallback(() => {
    // Reset all filter states
    setSelectedDoctors([]);
    setSelectedWards([]);
    setDateRange(null);
    setDateStatus(null);
    setInputSearchQuery(""); // Reset the input search query

    // Increment the reset key to force filter dropdowns to re-render
    setFilterResetKey((prev) => prev + 1);

    // Reset patients data when filters are cleared
    dispatch(resetPatients());

    // Reset fetchAttempted to trigger a new API call
    setFetchAttempted(false);
  }, [dispatch]);

  return (
    <>
      <SubHeader headerTitle={"InPatients"} />
      <div className="border rounded-4 appointment-wrap dateborder">
        <div className="appointment-data">
          <Row className="justify-content-between align-items-center my-3 px-4">
            <Col xl={4} sm={4}>
              <Input
                value={inputSearchQuery}
                placeholder="Search by patient name / ID / Bed no/ mobile no"
                className="inputheight38"
                prefix={<i className="icon-search" />}
                suffix={
                  inputSearchQuery.length > 0 && (
                    <i className="icon-Cross" onClick={() => onSearch("")}></i>
                  )
                }
                onChange={(e) => onSearch(e.target.value)}
              />
            </Col>
            <Col md="auto">
              <div className="d-flex align-items-center">
                <div className="ms-3">
                  <FilterDropdown
                    key={`doctor-filter-${filterResetKey}`}
                    title="Filter by Doctors"
                    placeholder="All Doctor"
                    items={doctors}
                    onFilterChange={handleDoctorFilterChange}
                    searchPlaceholder="Search by doctor's name"
                  />
                </div>
                <div className="ms-3">
                  <FilterDropdown
                    key={`ward-filter-${filterResetKey}`}
                    title="Filter by Wards"
                    placeholder="All Ward"
                    items={wards}
                    onFilterChange={handleWardFilterChange}
                    searchPlaceholder="Search by ward name"
                  />
                </div>
                <div className="massage-date-wrapper ms-3">
                  <div
                    className="fs-14 h-100 w-100 d-flex align-items-center justify-content-between"
                    onClick={handlePickerModal}
                  >
                    <span>
                      {!dateRange ? (
                        <span className="date-placeholder">
                          Filter by admitted date
                        </span>
                      ) : dateStatus === 1 ? (
                        "Today"
                      ) : dateStatus === 2 ? (
                        "Yesterday"
                      ) : dateStatus === 3 ? (
                        "Last month"
                      ) : (
                        <>
                          {moment(dateRange.startDate).format(showDateFormat)} -{" "}
                          {moment(dateRange.endDate).format(showDateFormat)}
                        </>
                      )}
                    </span>
                    <i className="mx-2 fs-18 icon-calendar"></i>
                  </div>
                  <RangePicker
                    disabledDate={(current) => disabledDate(current)}
                    open={pickerModal}
                    presets={rangePresets}
                    format={showDateFormat}
                    onChange={onRangeChange}
                    popupClassName="massage-date"
                    className="massage-input"
                    inputReadOnly
                    renderExtraFooter={() => (
                      <div className="d-flex align-items-center justify-content-between py-1">
                        <div>
                          {dateRange ? (
                            <>
                              {moment(dateRange.startDate).format(
                                showDateFormat
                              )}{" "}
                              -{" "}
                              {moment(dateRange.endDate).format(showDateFormat)}
                            </>
                          ) : (
                            "No dates selected"
                          )}
                        </div>
                        <div>
                          <button
                            className="btn btn-text me-3 px-0"
                            onClick={() => {
                              setDateStatus(null);
                              setDateRange(null);
                              setPickerModal(false);
                            }}
                          >
                            <span>Cancel</span>
                          </button>
                          <Button
                            className="px-4"
                            type="primary"
                            onClick={handlePickerModal}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                    value={
                      dateRange
                        ? [
                            dateRange.startDate !== dateRange.endDate
                              ? dayjs(
                                  moment(dateRange.startDate).format(
                                    showDateFormat
                                  ),
                                  showDateFormat
                                )
                              : "",
                            dateRange.startDate !== dateRange.endDate
                              ? dayjs(
                                  moment(dateRange.endDate).format(
                                    showDateFormat
                                  ),
                                  showDateFormat
                                )
                              : "",
                          ]
                        : null
                    }
                  />
                </div>
                {/* Only show Clear Filter button when at least one filter is active */}
                {(selectedDoctors.length > 0 ||
                  selectedWards.length > 0 ||
                  dateRange !== null ||
                  inputSearchQuery !== "") && (
                  <div className="ms-3">
                    <button
                      onClick={handleClearAllFilters}
                      className="clear-filter-button"
                    >
                      Clear All Filter
                    </button>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <div className="inpatients-table-container">
            <Table
              className="px-xl-4 px-0"
              columns={columns}
              dataSource={patientsData}
              onChange={handleChange}
              pagination={false}
              loading={patientsLoading && filterParams.page === 1}
              locale={{ emptyText: emptyText }}
              rowKey="id"
              tableLayout="auto"
              scroll={{ x: "max-content" }}
            />

            {/* Add a loading indicator at the bottom when loading more data */}
            {(loadingMore || (patientsLoading && filterParams.page > 1)) && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                  backgroundColor: "#f0f2f5",
                  borderRadius: "0 0 8px 8px",
                }}
              >
                <Spin tip="Loading more..." />
              </div>
            )}

            {/* Add an invisible element at the bottom that will trigger loading more data */}
            {!patientsLoading && !loadingMore && hasMore && (
              <div ref={lastPostElementRef} style={{ height: "20px" }}></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(InPatients);
