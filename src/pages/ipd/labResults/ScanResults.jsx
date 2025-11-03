import { Button, Spin, message } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row } from "react-bootstrap";
import RecordCard from "../../medicalRecords/components/recordCard/RecordCard";
import DateRangeFilter from "../components/DateRangeFilter";
import {
  selectScanResults,
  selectScanLoading,
  selectScanError,
  clearError,
  getScanResults,
} from "../../../redux/ipd/labResultsSlice";
import moment from "moment";
import { useLocation } from "react-router-dom";
import EmptyState from "./EmptyState";
import { IPD } from "../../../utils/locale";

const ScanResults = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const patientId = patientDetails?.details?.id;
  const { admissionId } = patientDetails;
  const scanResults = useSelector(selectScanResults);
  const scanLoading = useSelector(selectScanLoading);
  const scanError = useSelector(selectScanError);

  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [dateStatus, setDateStatus] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeScanCategory, setActiveScanCategory] = useState("all");

  const mappedScanResults = scanResults.map(({ docs, _id, createdAt }) => {
    return {
      notes: "",
      id: _id,
      url: docs?.fileUrl,
      thumbnail_url: docs?.fileUrl,
      investigation_date: createdAt,
      category: docs?.subCategory,
      display_name: docs?.filename,
    };
  });

  const categoryOptionHandler = (id) => {
    setActiveScanCategory(id);
  };

  // Handle scan errors
  useEffect(() => {
    if (scanError) {
      message.error(`Error loading scan results: ${scanError}`);
      dispatch(clearError());
    }
  }, [scanError, dispatch]);

  // Load scan results when category or date range changes
  useEffect(() => {
    if (patientId && admissionId) {
      dispatch(
        getScanResults({
          patientId,
          admissionId,
          subCategory: activeScanCategory === "all" ? null : activeScanCategory,
          filterStartDate: selectedDateRange?.startDate,
          filterEndDate: selectedDateRange?.endDate,
        })
      );
    }
  }, [dispatch, patientId, admissionId, activeScanCategory, selectedDateRange]);

  const onDatePickerToggle = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const onDateCancel = () => {
    setDateStatus(null);
    setIsDatePickerOpen(!isDatePickerOpen);
    setSelectedDateRange(null);
  };

  const onDateRangeChange = useCallback((dates, dateStrings) => {
    if (dates) {
      // Determine date status based on selected dates
      const today = moment().format("YYYY-MM-DD");
      const startDate = moment(dateStrings[0], "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      const endDate = moment(dateStrings[1], "DD-MM-YYYY").format("YYYY-MM-DD");

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

      setSelectedDateRange({
        startDate: startDate,
        endDate: endDate,
      });
    } else {
      setDateStatus(null);
      setSelectedDateRange(null);
    }
  }, []);

  return (
    <div className="scan-results">
      <div className="d-flex justify-content-center flex-column">
        <div
          className="d-flex flex-wrap justify-content-between"
          style={{ padding: "0 24px 24px 24px" }}
        >
          <div className="d-flex" style={{ columnGap: "16px" }}>
            {IPD.SCAN_RESULTS_CATEGORIES.map((item) => (
              <Button
                type="text"
                key={item?.id}
                className={`btnStyle btn px-5-16 fs-14 category-btn ${
                  item?.id === activeScanCategory ? "active-category-btn" : ""
                }`}
                onClick={() => categoryOptionHandler(item?.id)}
              >
                <span
                  className={`btnText category-label ${
                    item?.id === activeScanCategory
                      ? "active-category-label"
                      : ""
                  }`}
                >
                  {item?.name}
                </span>
              </Button>
            ))}
          </div>
          <DateRangeFilter
            dateRange={selectedDateRange}
            dateStatus={dateStatus}
            onRangeChange={onDateRangeChange}
            onToggleModal={onDatePickerToggle}
            onCancel={onDateCancel}
            placeholder="Filter by date"
            isOpen={isDatePickerOpen}
            className="date-filter-btn"
            wrapperClassName="scan-results-date-filter-wrapper"
          />
        </div>

        {/* Loading Spinner */}
        {scanLoading && (
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

        {/* Scan Results Grid */}
        {!scanLoading && mappedScanResults.length > 0 ? (
          <Row
            xs={1}
            sm={2}
            md={2}
            lg={3}
            className="gy-4 w-100"
            style={{ padding: "0 0 50px 24px" }}
          >
            {mappedScanResults.map((cardData, index) => {
              return (
                <Col key={index} className="gx-4 file-card">
                  <RecordCard
                    cardData={cardData}
                    medicalReportDrawer={() => {}}
                    handleDrawerUploadDoc={() => {}}
                    setFilesData={() => {}}
                    setIsEditDocument={() => {}}
                    setUploadDocDrawer={() => {}}
                    isIpd
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          <EmptyState label="No Scan Results available" />
        )}
      </div>
    </div>
  );
};

export default ScanResults;
