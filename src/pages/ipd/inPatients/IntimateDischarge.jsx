import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import moment from "moment";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import SubHeader from "./components/SubHeader";
import FilterControls from "./components/FilterControls";
import PatientsTable from "./components/PatientsTable";
import { useDebounce } from "./hooks/useDebounce";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { usePatientsData } from "./hooks/usePatientsData";
import { useFiltersData } from "./hooks/useFiltersData";
import { isDischargedByDischargeInfo } from "./dischargeStatusUtils";
import {
  loadIPDFilters,
  saveIPDFilters,
  clearIPDFilters,
} from "../../../utils/localStorage";
import "./InPatients.scss";
import {
  fetchPatientUniqueId,
} from "../../../redux/ipd/ipdSlice";
import { getTokenData } from "../../../utils/utils";
import { env } from "../../../EnvironmentConfig";
import { GB_ZYDUS_USER, GB_NEW_IPD_ZYDUS } from "../../../utils/constants";

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD-MM-YYYY";

function IntimateDischarge() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);
  const isNewIpdZydusEnabled = useFeatureIsOn(GB_NEW_IPD_ZYDUS);
  const izZydusUser =
    String(getTokenData()?.hospital_business_id) ===
      String(env.zydus_business_id) && isZydusUserAccessableFromGB;
  const canAccess = izZydusUser && isNewIpdZydusEnabled;

  useEffect(() => {
    if (!canAccess) {
      navigate("/ipd/inPatients", { replace: true });
    }
  }, [canAccess, navigate]);

  const initializeFiltersFromSession = () => {
    const savedFilters = loadIPDFilters();
    if (savedFilters) {
      return {
        dateStatus: savedFilters.dateStatus || null,
        dateRange: savedFilters.dateRange || null,
        inputSearchQuery: savedFilters.inputSearchQuery || "",
        selectedDoctors: savedFilters.selectedDoctors || [],
        selectedWards: savedFilters.selectedWards || [],
      };
    }
    return {
      dateStatus: null,
      dateRange: null,
      inputSearchQuery: "",
      selectedDoctors: [],
      selectedWards: [],
    };
  };

  const initialFilters = initializeFiltersFromSession();

  const [dateStatus, setDateStatus] = useState(initialFilters.dateStatus);
  const [dateRange, setDateRange] = useState(initialFilters.dateRange);
  const [pickerModal, setPickerModal] = useState(false);
  const [inputSearchQuery, setInputSearchQuery] = useState(
    initialFilters.inputSearchQuery
  );
  const [selectedDoctors, setSelectedDoctors] = useState(
    initialFilters.selectedDoctors
  );
  const [selectedWards, setSelectedWards] = useState(
    initialFilters.selectedWards
  );
  const [filterResetKey, setFilterResetKey] = useState(0);
  const lastFetchParamsRef = useRef(null);

  const saveFiltersToSession = useCallback(() => {
    const currentFilters = {
      dateStatus,
      dateRange,
      inputSearchQuery,
      selectedDoctors,
      selectedWards,
    };

    const hasActiveFilters =
      dateStatus !== null ||
      dateRange !== null ||
      inputSearchQuery !== "" ||
      selectedDoctors.length > 0 ||
      selectedWards.length > 0;

    if (hasActiveFilters) {
      saveIPDFilters(currentFilters);
    } else {
      clearIPDFilters();
    }
  }, [dateStatus, dateRange, inputSearchQuery, selectedDoctors, selectedWards]);

  const debouncedSearchQuery = useDebounce(inputSearchQuery, 500);
  const {
    patientsData,
    patientsLoading,
    patientsError,
    hasMore,
    billingByAdmissionId,
    billDataByAdmissionId,
    billingLoading,
    filterParams,
    loadingMore,
    fetchData,
    resetData,
    loadMore,
    updateFilters,
  } = usePatientsData();

  const { doctors, wards } = useFiltersData();

  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    isLoading: patientsLoading || loadingMore,
    onLoadMore: loadMore,
  });

  const allDoctorIds = useMemo(() => {
    return doctors.map((doctor) => doctor.id).join(",");
  }, [doctors]);

  useEffect(() => {
    saveFiltersToSession();
  }, [saveFiltersToSession]);

  const fetchParams = useMemo(
    () => ({
      ...filterParams,
      startDate: dateRange ? dateRange.startDate : "",
      endDate: dateRange ? dateRange.endDate : "",
      doctorIdsFilter:
        selectedDoctors.length > 0 ? selectedDoctors.join(",") : allDoctorIds,
      ward: selectedWards.length > 0 ? selectedWards.join(",") : "",
      isDischarged: false,
      isIntimateDischarged: true,
    }),
    [filterParams, dateRange, selectedDoctors, selectedWards, allDoctorIds]
  );

  useEffect(() => {
    if (!canAccess) return;
    if (loadingMore || patientsLoading) return;

    const paramsString = JSON.stringify(fetchParams);
    if (lastFetchParamsRef.current === paramsString) return;

    lastFetchParamsRef.current = paramsString;
    fetchData(fetchParams);
  }, [fetchParams, fetchData, loadingMore, patientsLoading, canAccess]);

  useEffect(() => {
    if (!canAccess) return;
    resetData();
    updateFilters({ search: debouncedSearchQuery });
  }, [debouncedSearchQuery, resetData, updateFilters, canAccess]);

  const onSearch = useCallback((query) => {
    setInputSearchQuery(query);
  }, []);

  const onViewDetails = useCallback(
    (patientData) => {
      const patient_data = {
        pm_contact_no: patientData?.details?.contact,
        pm_gender: patientData?.details?.gender,
        patient_unique_id: patientData?.details?.id,
      };
      dispatch(fetchPatientUniqueId({ mrno: patientData?.mrno })).then(
        (res) => {
          navigate(`/ipd/patient-details`, {
            state: {
              patientDetails: {
                ...patientData,
                patient_unique_id: res?.payload?.patientUniqueId,
              },
              patient_data: {
                ...patient_data,
                patient_unique_id: res?.payload?.patientUniqueId,
              },
              isEditable: false,
              activeTab: patientData?.referral ? "crossReferral" : "assessment",
              fromTab: "intimateDischarge",
            },
          });
        }
      );
    },
    [dispatch, navigate]
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
        startDate === moment().add(-7, "d").format(dateFormat) &&
        endDate === today
      ) {
        setDateStatus(3);
      } else if (
        startDate === moment().add(-1, "M").format(dateFormat) &&
        endDate === today
      ) {
        setDateStatus(4);
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
  }, [pickerModal]);

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
    clearIPDFilters();
    resetData();
  }, [resetData]);

  const hasActiveFilters =
    selectedDoctors.length > 0 ||
    selectedWards.length > 0 ||
    dateRange !== null ||
    inputSearchQuery !== "";

  const intimateDischargePatientsData = useMemo(
    () =>
      patientsData.filter((patient) => !isDischargedByDischargeInfo(patient)),
    [patientsData]
  );

  if (!canAccess) {
    return null;
  }

  return (
    <>
      <SubHeader showAddAdmission={false} headerTitle="Intimate Discharge" />
      <div className="border rounded-4 appointment-wrap ipd-inpatients-page-wrap dateborder">
        <div className="inpatients-main">
          <Row className="justify-content-between align-items-center filters">
            <FilterControls
              searchQuery={inputSearchQuery}
              onSearchChange={onSearch}
              onSearchClear={() => onSearch("")}
              doctors={doctors}
              wards={wards}
              onDoctorFilterChange={handleDoctorFilterChange}
              onWardFilterChange={handleWardFilterChange}
              selectedDoctors={selectedDoctors}
              selectedWards={selectedWards}
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
            data={intimateDischargePatientsData}
            loading={patientsLoading}
            error={patientsError}
            onChange={handleChange}
            onViewDetails={onViewDetails}
            loadingMore={loadingMore}
            hasMore={hasMore}
            lastElementRef={lastElementRef}
            filterParams={filterParams}
            fetchParams={fetchParams}
            isInPatients={true}
            isIntimateDischargeList={true}
            billingByAdmissionId={billingByAdmissionId}
            billDataByAdmissionId={billDataByAdmissionId}
            billingLoading={billingLoading}
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(IntimateDischarge);
