import React, { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { Row } from "react-bootstrap";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import SubHeader from "./components/SubHeader";
import FilterControls from "./components/FilterControls";
import PatientsTable from "./components/PatientsTable";
import { useDebounce } from "./hooks/useDebounce";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { usePatientsData } from "./hooks/usePatientsData";
import { useFiltersData } from "./hooks/useFiltersData";
import "./InPatients.scss";

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD-MM-YYYY";



function InPatients() {
  const navigate = useNavigate();

  // Local state
  const [dateStatus, setDateStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [pickerModal, setPickerModal] = useState(false);
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectedWards, setSelectedWards] = useState([]);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const [symptomsData, setSymptomsData] = useState({
    symptom: "",
    since:"",
    severity:"",
    notes:""
  });

  // const [stateValue, funcToUpdateState] = useState(initialState)

  // Custom hooks
  const debouncedSearchQuery = useDebounce(inputSearchQuery, 500);
  const {
    patientsData,
    patientsLoading,
    patientsError,
    hasMore,
    filterParams,
    fetchAttempted,
    loadingMore,
    usingStaticData,
    setUsingStaticData,
    fetchData,
    resetData,
    loadMore,
    updateFilters,
  } = usePatientsData();

  const {
    doctors,
    wards,
    filtersError,
    usingStaticFilters,
    setUsingStaticFilters,
  } = useFiltersData();

  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    isLoading: patientsLoading || loadingMore,
    onLoadMore: loadMore,
  });

  // Notification effects
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
  }, [filtersError, usingStaticFilters, setUsingStaticFilters]);

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
  }, [patientsError, usingStaticData, setUsingStaticData]);

  // Data fetching effects
  useEffect(() => {
    if (loadingMore || filterParams.page !== 1) return;

    resetData();

    if (!patientsError || !fetchAttempted) {
      fetchData({
        ...filterParams,
        startDate: dateRange ? dateRange.startDate : "",
        endDate: dateRange ? dateRange.endDate : "",
        doctorIdsFilter:
          selectedDoctors.length > 0 ? selectedDoctors.join(",") : "",
        ward: selectedWards.length > 0 ? selectedWards.join(",") : "",
      });
    }
  }, [
    filterParams,
    dateRange,
    selectedDoctors,
    selectedWards,
    patientsError,
    fetchAttempted,
    loadingMore,
    fetchData,
    resetData,
  ]);

  useEffect(() => {
    if (filterParams.page === 1 || !loadingMore) return;

    fetchData({
      ...filterParams,
      startDate: dateRange ? dateRange.startDate : "",
      endDate: dateRange ? dateRange.endDate : "",
      doctorIdsFilter:
        selectedDoctors.length > 0 ? selectedDoctors.join(",") : "",
      ward: selectedWards.length > 0 ? selectedWards.join(",") : "",
    });
  }, [
    filterParams,
    loadingMore,
    selectedDoctors,
    selectedWards,
    dateRange,
    fetchData,
  ]);

  useEffect(() => {
    resetData();
    updateFilters({ search: debouncedSearchQuery });
  }, [debouncedSearchQuery, resetData, updateFilters]);

  // Event handlers
  const onSearch = useCallback((query) => {
    setInputSearchQuery(query);
  }, []);

  const onViewDetails = useCallback(
    (patientData) => {
      navigate(`/ipd/patient-details`, {
        state: { patientData },
      });
    },
    [navigate]
  );

  const handleChange = useCallback(
    (pagination, filters, sorter) => {
      if (sorter && sorter.order) {
        const sortField = sorter.field;
        const sortOrder = sorter.order === "ascend" ? "asc" : "desc";
        updateFilters({ sort: `${sortField}:${sortOrder}` });
      }
    },
    [updateFilters]
  );

  const disabledDate = useCallback((current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  }, []);

  const onRangeChange = useCallback((dates, dateStrings) => {
    if (dates) {
      // Determine date status based on selected dates
      const today = moment().format(dateFormat);
      const startDate = moment(dateStrings[0], showDateFormat).format(
        dateFormat
      );
      const endDate = moment(dateStrings[1], showDateFormat).format(dateFormat);

      if (startDate === today && endDate === today) {
        setDateStatus(1);
      } else if (
        startDate === moment().add(-1, "d").format(dateFormat) &&
        endDate === today
      ) {
        setDateStatus(2);
      } else if (
        startDate === moment().add(-1, "M").format(dateFormat) &&
        endDate === today
      ) {
        setDateStatus(3);
      } else {
        setDateStatus(null);
      }

      setDateRange({
        startDate: startDate,
        endDate: endDate,
      });
    } else {
      setDateStatus(null);
      setDateRange(null);
    }
  }, []);

  const handlePickerModal = useCallback(() => {
    setPickerModal(!pickerModal);
  }, [pickerModal, resetData]);

  const handleDateCancel = useCallback(() => {
    setDateStatus(null);
    setDateRange(null);
    setPickerModal(false);
  }, []);

  const handleDoctorFilterChange = useCallback(
    (doctorIds) => {
      setSelectedDoctors(doctorIds);
      resetData();
    },
    [resetData]
  );

  const handleWardFilterChange = useCallback(
    (wardIds) => {
      setSelectedWards(wardIds);
      resetData();
    },
    [resetData]
  );

  const handleClearAllFilters = useCallback(() => {
    setSelectedDoctors([]);
    setSelectedWards([]);
    setDateRange(null);
    setDateStatus(null);
    setInputSearchQuery("");
    setFilterResetKey((prev) => prev + 1);
    resetData();
  }, [resetData]);

  // Computed values
  const hasActiveFilters =
    selectedDoctors.length > 0 ||
    selectedWards.length > 0 ||
    dateRange !== null ||
    inputSearchQuery !== "";

  return (
    <>
      <SubHeader headerTitle={"InPatients"} />
      <div className="border rounded-4 appointment-wrap dateborder">
        <div className="appointment-data">
          <Row className="justify-content-between align-items-center my-3 px-4">
            <FilterControls
              searchQuery={inputSearchQuery}
              onSearchChange={onSearch}
              onSearchClear={() => onSearch("")}
              doctors={doctors}
              wards={wards}
              onDoctorFilterChange={handleDoctorFilterChange}
              onWardFilterChange={handleWardFilterChange}
              dateRange={dateRange}
              dateStatus={dateStatus}
              pickerModal={pickerModal}
              onDateRangeChange={onRangeChange}
              onDatePickerToggle={handlePickerModal}
              onDateCancel={handleDateCancel}
              disabledDate={disabledDate}
              filterResetKey={filterResetKey}
              hasActiveFilters={hasActiveFilters}
              onClearAllFilters={handleClearAllFilters}
            />
          </Row>

          <PatientsTable
            data={patientsData}
            loading={patientsLoading}
            error={patientsError}
            onChange={handleChange}
            onViewDetails={onViewDetails}
            loadingMore={loadingMore}
            hasMore={hasMore}
            lastElementRef={lastElementRef}
            filterParams={filterParams}
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(InPatients);
