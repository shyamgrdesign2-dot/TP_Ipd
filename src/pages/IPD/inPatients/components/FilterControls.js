import React from "react";
import { Col } from "react-bootstrap";
import SearchInput from "./SearchInput";
import FilterDropdown from "./FilterDropdown";
import DateRangeFilter from "./DateRangeFilter";

const FilterControls = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  doctors,
  wards,
  onDoctorFilterChange,
  onWardFilterChange,
  dateRange,
  dateStatus,
  pickerModal,
  onDateRangeChange,
  onDatePickerToggle,
  onDateCancel,
  disabledDate,
  filterResetKey,
  hasActiveFilters,
  onClearAllFilters,
}) => (
  <>
    <Col xl={4} sm={4}>
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onSearchClear}
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
            onFilterChange={onDoctorFilterChange}
            searchPlaceholder="Search by doctor's name"
          />
        </div>
        <div className="ms-3">
          <FilterDropdown
            key={`ward-filter-${filterResetKey}`}
            title="Filter by Wards"
            placeholder="All Ward"
            items={wards}
            onFilterChange={onWardFilterChange}
            searchPlaceholder="Search by ward name"
          />
        </div>
        <DateRangeFilter
          dateRange={dateRange}
          dateStatus={dateStatus}
          isOpen={pickerModal}
          onRangeChange={onDateRangeChange}
          onToggleModal={onDatePickerToggle}
          onCancel={onDateCancel}
          disabledDate={disabledDate}
        />
        {hasActiveFilters && (
          <div className="ms-3">
            <button onClick={onClearAllFilters} className="clear-filter-button">
              Clear All Filter
            </button>
          </div>
        )}
      </div>
    </Col>
  </>
);

export default FilterControls;
