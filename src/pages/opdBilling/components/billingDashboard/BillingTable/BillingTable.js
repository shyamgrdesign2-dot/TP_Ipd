import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Select,
  Checkbox,
  Row,
  Input,
  DatePicker,
  Button,
  Dropdown,
  message,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "./BillingTable.scss";
import DownloadBill from "../DownloadBill/DownloadBill.js";
import {
  fetchBillingDashboard,
  fetchBillsByPatient,
  listAdvancedDepositByPatient,
} from "../../../service.js";
import BillTable from "./BillTable.js";
import { listDoctor } from "../../../../../redux/bulkMessagesSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getDecodedToken } from "../../../../../utils/localStorage.js";
import { setLoadingStatus } from "../../../../../redux/uploadDocSlice.js";
import { handleDownload } from "../../../utils/helper.js";
import html2pdf from "html2pdf.js";
import { getClinic, trackEvent } from "../../../../../utils/utils.js";
const { RangePicker } = DatePicker;

const { Option } = Select;

const cardsStaticData = [
  {
    id: 1,
    title: "Total Paid Bill Amount",
    color: "#fff",
    fontColor: "#5A6774",
    amountKey: "totalPaidAmount",
    countKey: "count",
  },
  {
    id: 2,
    title: "Paid fully",
    color: "#A5D6A7",
    fontColor: "#3D8C40",
    amountKey: "paidFullyAmount",
    countKey: "paidFullyCount",
  },
  {
    id: 3,
    title: "Due",
    color: "#FFCC80",
    fontColor: "#ED8A00",
    amountKey: "dueAmount",
    countKey: "dueCount",
  },
  {
    id: 4,
    title: "Refunded",
    color: "#EF9A9A",
    fontColor: "#B73A3A",
    amountKey: "refundedAmount",
    countKey: "refundedCount",
  },
];

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM YYYY";

export default function BillingTable({
  patientData,
  handleTotalAdvanceUpdate,
  handleRefundComplete,
  dateRange,
  setDateRange,
  dateStatus,
  setDateStatus,
  selectedDoctors,
  setSelectedDoctors,
  createBillDrawer,
  totalAdvanceBalance,
}) {
  const decodedToken = getDecodedToken();
  const isAdmin = decodedToken?.result?.admin;
  const [selectAll, setSelectAll] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerModal, setPickerModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const printableRef = useRef(null);
  const [tabLoader, setTabLoader] = useState(false);

  const [sortConfig, setSortConfig] = useState({ field: null, order: null });
  const [data, setData] = useState(null);
  const [cards, setCards] = useState([]);
  const [totalBillCount, setTotalBillCount] = useState(null);
  const [form3cTriggered, setForm3cTriggered] = useState(false);
  const { userId } = useSelector((state) => state.doctors);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const tableRef = useRef(null);

  // Drawer states
  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const umIds = urlParams.get("um_id")?.split(",") || [];
  const umNames = urlParams.get("um_name")?.split(",") || [];
  const isReceptionist = urlParams.has("receptionist");

  const doctorsListFromKea = umIds?.map((id, index) => ({
    um_id: parseInt(id),
    um_name: umNames[index],
  }));
  const { doctorList } = useSelector((state) => state.bulkMessages);
  const finalDoctorList = isReceptionist ? doctorsListFromKea : doctorList;
  const doctorIds = isReceptionist
    ? doctorsListFromKea?.map((doctor) => doctor.um_id)
    : doctorList.map((doctor) => doctor.um_id).length > 0
    ? doctorList.map((doctor) => doctor.um_id)
    : [userId];
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.doctors);

  useEffect(() => {
    if (isAdmin) {
      dispatch(listDoctor());
    }
  }, []);

  useEffect(() => {
    // Update cards state whenever the summary prop changes
    const updatedCards = cardsStaticData.map((card) => ({
      ...card,
      amount: data?.summary[card?.amountKey] || 0,
      count: data?.summary[card?.countKey] || 0,
    }));
    const totalBillCount = updatedCards
      .slice(1, 4) // Extracts cards 2, 3, and 4
      .reduce((sum, card) => sum + (card.count || 0), 0);
    setTotalBillCount(totalBillCount);
    setCards(updatedCards);
  }, [data]);

  const handleSelectAll = () => {
    setSelectedDoctors(finalDoctorList.map((doctor) => doctor.um_id));
    setSelectAll(true);
  };

  const handleDoctorSelection = (doctorId, checked) => {
    if (checked) {
      setSelectedDoctors([...selectedDoctors, doctorId]);
    } else {
      setSelectedDoctors(selectedDoctors.filter((id) => id !== doctorId));
    }
    setSelectAll(false); // Uncheck "All Doctors" if any specific doctor is selected
  };

  const onSearch = useCallback(
    (query) => {
      setPageNo(0);
      setSearchQuery(query);
    },
    [searchQuery]
  );

  const handlePickerModal = useCallback(() => {
    setPickerModal(!pickerModal);
  }, [pickerModal]);

  // Download Options Modal
  const handleOpenDownloadModal = () => {
    setOpenDownloadModal(!openDownloadModal);
  };

  const handleCheckboxChange = async (checkedValues) => {
    if (checkedValues?.includes("Due")) {
      checkedValues = ["CarriedForward", ...checkedValues];
    }
    setSelectedOptions(checkedValues);

    // Only fetch all data if there are selected options
    if (checkedValues.length > 0) {
      dispatch(setLoadingStatus(true));
      try {
        const allBills = await fetchAllData(checkedValues);
        setDownloadData([...allBills]);
      } catch (error) {
        console.error("Error fetching all bills for download:", error);
        message.error("Failed to prepare download data. Please try again.");
      } finally {
        dispatch(setLoadingStatus(false));
      }
    }
  };

  useEffect(() => {
    setDownloadData(
      data?.bills?.filter((item) =>
        selectedOptions.includes(item.paymentStatus)
      )
    );
  }, [selectedOptions, data]);

  const handleSortChange = (field, order) => {
    setSortConfig({ field, order }); // Update state
  };

  const handleDownloadData = () => {
    const element = printableRef.current;
    const options = {
      filename: `billing_${userId || "report"}.pdf`,
      image: { type: "jpeg", quality: 0.8 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      ?.from(element)
      ?.set(options)
      ?.output("blob")
      ?.then((blob) => {
        const url = URL.createObjectURL(blob);
        handleDownload(
          url,
          blob,
          patientData ? patientData.patient_unique_id : userId,
          setStartLoader,
          !patientData
        );
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);
      });
  };

  const setStartLoader = () => {
    dispatch(setLoadingStatus(true));
  };

  const handleDownloadAll = async () => {
    const clinic = getClinic();
    const urlParams = new URLSearchParams(window.location.search);
    const receptionistId = urlParams.get("receptionistId");
    const receptionistName = urlParams.get("receptionistName");
    trackEvent("TP_download_report", {
      doctorSpeciality: profile?.dp_name,
      doctorId: profile?.doctor_unique_id,
      doctorContact: profile?.um_contact,
      city: clinic?.hm_city,
      pincode: clinic?.hm_pincode,
      receptionistId: receptionistId,
      receptionistName: receptionistName,
    });
    dispatch(setLoadingStatus(true));
    try {
      const allStatuses = ["FullyPaid", "CarriedForward", "Due", "Refunded"];
      const allBills = await fetchAllData(allStatuses);

      setDownloadData([...allBills]);

      // Ensure handleDownload runs after state is updated
      setTimeout(() => {
        handleDownloadData();
      }, 50);
    } catch (error) {
      console.error("Error in downloading all data:", error);
      message.error("Failed to download data. Please try again.");
    } finally {
      dispatch(setLoadingStatus(false));
    }
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const rangePresets = [
    {
      label: <div className={`${dateStatus === 1 ? "active" : ""}`}>Today</div>,
      value: [dayjs(), dayjs().endOf("day")],
    },
    {
      label: (
        <div className={`${dateStatus === 2 ? "active" : ""}`}>Last 7 days</div>
      ),
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: (
        <div className={`${dateStatus === 3 ? "active" : ""}`}>
          Last 30 days
        </div>
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
    if (dates) {
      if (
        dayjs().format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(1);
      } else if (
        dayjs().add(-7, "d").format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(2);
      } else if (
        dayjs().add(-1, "M").format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(3);
      } else {
        setDateStatus(null);
      }
      setDateRange({
        startDate: moment(dateStrings[0], showDateFormat).format(dateFormat),
        endDate: moment(dateStrings[1], showDateFormat).format(dateFormat),
      });
    } else {
      setDateStatus(null);
      setDateRange({
        startDate: moment().format(dateFormat),
        endDate: moment().format(dateFormat),
      });
    }
  };

  // Dropdown content
  const menu = (
    <div
      className="download-options-container billing-table-wrapper"
      style={{
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Download All Sections */}
      <Button
        type="link"
        className="download-all-status ant-btn-all-section mt-3"
        onClick={() => {
          setSelectedOptions([
            "FullyPaid",
            "CarriedForward",
            "Due",
            "Refunded",
          ]);
          handleDownloadAll();
        }}
      >
        Download All Status
      </Button>

      <div className="doctor-select-divider">
        <span>or</span>
      </div>

      <div
        className="custom-doctors-section"
        style={{ margin: "20px 15px", paddingBottom: "15px" }}
      >
        <div className="section-title mb-2 fs-16 section-title-color">
          Select specific status
        </div>
        {/* Checkboxes */}
        <Checkbox.Group
          className="bil"
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
            gap: "10px",
          }}
          value={selectedOptions} // Bind selected checkboxes to state
          onChange={handleCheckboxChange}
        >
          <Checkbox value="FullyPaid">
            <span className="color-paid">Fully Paid</span>
          </Checkbox>
          <Checkbox value="Due">
            <span className="color-due">Due</span>
          </Checkbox>
          <Checkbox value="Refunded">
            <span className="color-refunded">Refunded</span>
          </Checkbox>
        </Checkbox.Group>

        {/* Download Now Button */}
        <Button
          type="primary"
          className="ant-btn-download"
          style={{
            width: "100%",
            display: `${selectedOptions.length > 0 ? "" : "none"}`,
          }}
          onClick={handleDownloadData}
        >
          Download
          <i class="icon-download fs-18" style={{ padding: "10px 6px" }} />
        </Button>
      </div>
    </div>
  );

  // Function to handle form3c messages
  const handleMessageForm3c = () => {
    setForm3cTriggered((prev) => !prev); // Toggle state to trigger useEffect
  };

  const loadData = async (resetData = true) => {
    // setLoading(true);
    if (!hasMore && !resetData) return;
    const params = {
      status:
        selectedCard === 1
          ? null
          : selectedCard === 2
          ? ["FullyPaid"]
          : selectedCard === 3
          ? ["Due", "CarriedForward"]
          : ["Refunded"],
      sortBy: sortConfig?.field || "date",
      sortOrder: sortConfig?.order || "desc",
      page: resetData ? 1 : page,
      limit: 25,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      doctorIds:
        selectedDoctors.length > 0 ? [...selectedDoctors] : [...doctorIds],
      search: searchQuery || "",
    };

    try {
      const response = await fetchBillingDashboard(params);
      setPage(resetData ? 2 : page + 1);
      setHasMore(response.bills.length >= 25);
      setData((prev) =>
        resetData
          ? response
          : { ...response, bills: [...(prev?.bills || []), ...response.bills] }
      );
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      // setLoading(false);
    }
  };

  const patientAdvanceData = async () => {
    // setLoading(true);
    const params = {
      status: "Deposit",
      sortBy: sortConfig?.field || "date",
      sortOrder: sortConfig?.order || "desc",
      page: 1,
      limit: 25,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      doctorIds:
        selectedDoctors.length > 0 ? [...selectedDoctors] : [...doctorIds],
      search: searchQuery || "",
      patientId: patientData?.patient_unique_id ?? "",
      // appointmentId: patientData?.pam_id,
    };
    try {
      const response = await listAdvancedDepositByPatient(params);
      handleTotalAdvanceUpdate(response?.summary?.totalAdvanceBalance);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (patientData && finalDoctorList?.length > 0) {
      patientAdvanceData();
    }
  }, []);

  const patientBillingData = async (resetData = true) => {
    if (!hasMore && !resetData) return;

    const params = {
      status:
        selectedCard === 1
          ? null
          : selectedCard === 2
          ? ["FullyPaid"]
          : selectedCard === 3
          ? ["Due", "CarriedForward"]
          : ["Refunded"],
      sortBy: sortConfig?.field || "date",
      sortOrder: sortConfig?.order || "desc",
      page: resetData ? 1 : page,
      limit: 25,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      doctorIds:
        selectedDoctors.length > 0 ? [...selectedDoctors] : [...doctorIds],
      search: searchQuery || "",
      patientId: patientData?.patient_unique_id,
      // appointmentId: patientData?.pam_id,
    };
    try {
      const response = await fetchBillsByPatient(params);
      setPage(resetData ? 2 : page + 1);
      setHasMore(response.bills.length >= 25);
      setData((prev) =>
        resetData
          ? response
          : { ...response, bills: [...(prev?.bills || []), ...response.bills] }
      );
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    resetTableScroll();
    if (finalDoctorList?.length > 0 || userId) {
      const fetchData = patientData ? patientBillingData : loadData;
      fetchData();
    }
  }, [
    selectedCard,
    dateRange,
    searchQuery,
    selectedDoctors,
    form3cTriggered,
    sortConfig,
    doctorList,
    createBillDrawer,
  ]);

  const handleRefundSuccess = () => {
    handleRefundComplete && handleRefundComplete();
  };

  const resetTableScroll = () => {
    // Using document.querySelector with a more specific selector
    const tableBody = document.querySelector(".billing-table .ant-table-body");
    if (tableBody) {
      tableBody.scrollTo({
        top: 0,
        behavior: "smooth", // Optional: adds smooth scrolling
      });
    }
  };

  // Add this new function to fetch all data
  const fetchAllData = async (selectedOptions) => {
    let allBills = [];
    let currentPage = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const params = {
        status: selectedOptions,
        sortBy: sortConfig?.field || "date",
        sortOrder: sortConfig?.order || "desc",
        page: currentPage,
        limit: 100, // Maximum limit per page
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        doctorIds:
          selectedDoctors.length > 0 ? [...selectedDoctors] : [...doctorIds],
        search: searchQuery || "",
      };

      try {
        const response = patientData
          ? await fetchBillsByPatient({
              ...params,
              patientId: patientData?.patient_unique_id,
            })
          : await fetchBillingDashboard(params);
        if (response?.bills?.length > 0) {
          allBills = [...allBills, ...response.bills];
          currentPage += 1;
          hasMoreData = response.bills.length === 100; // Check if we got maximum records
        } else {
          hasMoreData = false;
        }
      } catch (error) {
        console.error("Error fetching all bills:", error);
        hasMoreData = false;
      }
    }

    return allBills;
  };

  return (
    <div>
      <div className="billing-table-wrapper">
        <Row className="justify-content-between align-items-center my-2 px-4">
          <div>
            <Input
              value={searchQuery}
              placeholder={
                patientData
                  ? "Search by bill number"
                  : "Search by patient name / phone no / bill no"
              }
              className="inputheight38"
              prefix={<i className="icon-search" />}
              suffix={
                searchQuery.length > 0 && (
                  <i className="icon-Cross" onClick={() => onSearch("")}></i>
                )
              }
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div className="d-flex flex-row gap-2">
            {(isAdmin || isReceptionist) && finalDoctorList?.length > 1 ? (
              <div className="doctor-select-container">
                <Select
                  className="doctor-select"
                  dropdownRender={(menu) => (
                    <div className="doctor-select-dropdown">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <button
                          className="all-doctors-button"
                          onClick={() => handleSelectAll()}
                        >
                          All Doctors
                        </button>
                      </div>

                      <div className="doctor-select-divider">
                        <span>or</span>
                      </div>

                      <div className="custom-doctors-section">
                        <div className="section-title fs-16">
                          Select Custom Doctors
                        </div>
                        <div className="doctor-select-list">
                          {finalDoctorList.map((doctor) => (
                            <div
                              key={doctor.um_id}
                              style={{ padding: "8px 0" }}
                            >
                              <Checkbox
                                checked={selectedDoctors.includes(doctor.um_id)}
                                onChange={(e) =>
                                  handleDoctorSelection(
                                    doctor.um_id,
                                    e.target.checked
                                  )
                                }
                              >
                                {doctor.um_name}
                              </Checkbox>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  value="placeholder"
                >
                  <Option value="placeholder">
                    <div className="select-value-content">
                      {selectedDoctors.length > 0 ? (
                        <div className="selected-doctors-wrapper">
                          <div className="selected-doctors-tags">
                            {selectedDoctors.map((doctorId) => {
                              const doctor = finalDoctorList.find(
                                (d) => d.um_id === doctorId
                              );
                              return (
                                <span key={doctorId} className="doctor-tag">
                                  {doctor?.um_name}
                                  <i
                                    className="icon-Cross"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDoctorSelection(doctorId, false);
                                    }}
                                  />
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <span>Select Doctors</span>
                      )}
                    </div>
                  </Option>
                </Select>
              </div>
            ) : null}
            <div className="massage-date-wrapper">
              <div
                className="fs-14 h-100 w-100 d-flex align-items-center justify-content-between"
                onClick={handlePickerModal}
              >
                <span>
                  {dateStatus === 1 ? (
                    "Today"
                  ) : dateStatus === 2 ? (
                    "Last week"
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
                      {moment(dateRange.startDate).format(showDateFormat)} -{" "}
                      {moment(dateRange.endDate).format(showDateFormat)}
                    </div>
                    <div>
                      <button
                        className="btn btn-text me-3 px-0"
                        onClick={() => {
                          setDateStatus(1);
                          setDateRange({
                            startDate: moment().format(dateFormat),
                            endDate: moment().format(dateFormat),
                          });
                          handlePickerModal();
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
                onOpenChange={() => {}}
                value={[
                  dateRange.startDate != dateRange.endDate
                    ? dayjs(
                        moment(dateRange.startDate).format(showDateFormat),
                        showDateFormat
                      )
                    : "",
                  dateRange.startDate != dateRange.endDate
                    ? dayjs(
                        moment(dateRange.endDate).format(showDateFormat),
                        showDateFormat
                      )
                    : "",
                ]}
              />
            </div>
            <div className="download-modal-container">
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement="bottomRight" // Positions the dropdown below the button
              >
                <div className="d-flex justify-content-between align-items-center billing-download">
                  <i
                    className="icon-download"
                    style={{ cursor: "pointer", color: "#4B4AD5" }}
                  ></i>
                </div>
              </Dropdown>
            </div>
          </div>
        </Row>
        <Row className="justify-content-between align-items-center px-4">
          <div className="card-container">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card ${selectedCard === card.id ? "selected" : ""}`}
                onClick={() => setSelectedCard(card.id)}
                style={{
                  borderColor: "transparent",
                  background: `linear-gradient(180deg, ${card.color}4D 0%, ${card.color}00 35%)`,
                  position: "relative",
                }}
              >
                <div
                  className="card-title"
                  style={{ "--dynamic-color": card.fontColor }}
                >
                  {card.title}
                  {"("}
                  {card.id === 1 && data ? totalBillCount : card.count}
                  {")"}
                </div>
                <div className="card-amount">
                  ₹{parseFloat(card.amount).toFixed(2)}
                  {card.id === 1 && data && (
                    <span style={{ fontSize: "16px", fontWeight: 500 }}>
                      {"/"}₹
                      {parseFloat(data?.summary?.totalBillAmount).toFixed(2)}
                    </span>
                  )}
                </div>
                {selectedCard === card.id && (
                  <div
                    className="arrow-down"
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderTop: "10px solid #fff",
                      filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))",
                      zIndex: 1,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <BillTable
            data={
              patientData
                ? data?.bills?.map((item) => ({
                    ...item,
                    patient: data?.patient,
                  }))
                : data?.bills
            }
            isPatientScreen={patientData ? true : false}
            handleMessageForm3c={handleMessageForm3c}
            onSortChange={handleSortChange}
            getPatientBills={patientData ? patientBillingData : loadData}
            loadData={loadData}
            hasMore={hasMore}
            tableRef={tableRef}
            patientAdvanceData={patientData ? patientAdvanceData : ""}
            totalAdvanceBalance={totalAdvanceBalance}
          />
        </Row>

        {
          <div style={{ display: "none" }}>
            <div ref={printableRef}>
              <DownloadBill
                downloadData={downloadData}
                parent={"billing"}
                dateRange={dateRange}
                isDoctorDashboard={!patientData}
                paymentSummary={data?.summary?.paymentModeSummary}
              />
            </div>
          </div>
        }
      </div>
    </div>
  );
}
