import React, { useState, useCallback, useEffect, useRef, useImperativeHandle } from "react";
import {
  Select,
  Checkbox,
  Row,
  Col,
  Input,
  DatePicker,
  Button,
  Table,
  Dropdown,
  Drawer,
  message,
} from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import "../AdvanceDepositTable/AdvanceDepositTable.scss";
import { useReactToPrint } from "react-to-print";
import { handlePrintClick } from "../../../../../utils/utils.js";
import DownloadBill from "../DownloadBill/DownloadBill.js";
import {
  fetchAdvancedDepositDashboard,
  fetchPatientWalletBalance,
  listAdvancedDepositByPatient,
} from "../../../service.js";
import PreviewBill from "../../../PreviewBill.js";
import { getDecodedToken } from "../../../../../utils/localStorage.js";
import { formatDateWithOrdinal, printContent } from "../../../utils/helper.js";
import AddAdvance from "../../advanceDeposit/AddAdvance.js";
import ViewBillPdf from "../../viewBillPdf/ViewBillPdf.js";
import { pdf } from "@react-pdf/renderer";
const { RangePicker } = DatePicker;

const cards = [
  {
    id: 1,
    title: "Total Advance Received (3)",
    amount: "₹2000",
    color: "#A461D8",
    fontColor: "#A461D8",
  },
  {
    id: 2,
    title: "Total Advance Refunded (1)",
    amount: "₹800",
    color: "#EF9A9A",
    fontColor: "#B73A3A",
  },
];

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM YYYY";

const AdvanceDepositTable = React.forwardRef(({ patientData }, ref) => {
  const { billPrintSettings, advancedSettings } = useSelector(
    (state) => state.billing
  );
  const { profile } = useSelector((state) => state.doctors);
  const decodedToken = getDecodedToken();
  const isAdmin = decodedToken?.result?.admin;
  const [pageNo, setPageNo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerModal, setPickerModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(1);
  const printableRef = useRef(null);
  const [tabLoader, setTabLoader] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: null, order: null });
  const [data, setData] = useState(null);
  const [cards, setCards] = useState([]);
  const [previewBillDrawer, setPreviewBillDrawer] = useState(false);
  const [billData, setBillData] = useState(null);
  const [downloadData, setDownloadData] = useState([]);
  const [advanceData, setAdvanceData] = useState([]);
  const [addAdvanceDrawer, setAddAdvanceDrawer] = useState(false);
  const [patientWalletBalance, setPatientWalletBalance] = useState(0);

  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  const { doctorList } = useSelector((state) => state.bulkMessages);

  const [dateRange, setDateRange] = useState({
    startDate: moment().format(dateFormat),
    endDate: moment().format(dateFormat),
  });
  const [dateStatus, setDateStatus] = useState(1);

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
        <div className={`${dateStatus === 2 ? "active" : ""}`}>Last week</div>
      ),
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: (
        <div className={`${dateStatus === 3 ? "active" : ""}`}>Last month</div>
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

  const handleDrawerPreviewBill = () => {
    setPreviewBillDrawer(!previewBillDrawer);
  };

  const handleSortChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      const order = sorter.order === "ascend" ? "asc" : "desc"; // Convert for API
      const field = sorter.field;
      setSortConfig({ field, order });
    } else {
      setSortConfig({ field: null, order: null }); // Reset sorting
    }
  };

  const onBillingDetailsClick = async (status, record) => {
    if (patientData && Object.keys(patientData)?.length > 0) {
      setBillData(record);
    } else {
      setBillData({
        ...record,
        patient: {
          ...record?.patient,
        },
      });
    }
    if (status === 1) {
      handleDrawerPreviewBill();
    } else if (status === 2) {
      const blob = await pdf(
        <ViewBillPdf
          printSettings={billPrintSettings}
          patientData={
            patientData && Object.keys(patientData)?.length > 0
              ? patientData
              : {
                  pm_pid: record?.patient?.id,
                  pm_fullname: record?.patient?.name,
                  pm_gender: record?.patient?.gender,
                  pm_contact_no: record?.patient?.phone,
                  pam_ref_id: record?.patient?.refId,
                  ageDays: record?.patient?.ageDays,
                  ageMonths: record?.patient?.ageMonths,
                  ageYears: record?.patient?.ageYears,
                  pm_salutation: record?.patient?.salutation,
                  address: record?.patient?.address,
                }
          }
          profile={profile}
          billData={record}
          isDepositReceipt={true}
          totalAdvanceBalance={patientWalletBalance}
          gstIn={advancedSettings?.GSTIN}
        />
      ).toBlob();
      printContent(blob, patientData?.patient_unique_id);
    } else {
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "srno",
      key: "srno",
      ellipsis: true,
      width: 50,
      render: (text, record, index) => <div className="fs-14">{index + 1}</div>,
    },
    {
      title: "RECEIPT NO & DATE",
      dataIndex: "date",
      key: "date",
      width: 250,
      sorter: true,
      render: (text, record) => (
        <div
          className="cursor-pointer"
          onClick={() => {
            setBillData({
              ...record,
              patient: {
                ...record?.patient,
              },
            });
            handleDrawerPreviewBill();
          }}
        >
          <a className="fs-14 fw-semibold theme-color">
            {selectedCard === 3 ? record?.billNumber : record?.receiptNumber}
          </a>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {formatDateWithOrdinal(record.date)}
          </div>
        </div>
      ),
    },
    {
      title: "PATIENT DETAILS",
      dataIndex: "patient_details",
      key: "patient_details",
      ellipsis: true,
      render: (text, record) => (
        <div>
          <div className="fs-14">{record?.patient?.name}</div>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {record?.patient?.phone}
          </div>
        </div>
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "total_amount",
      key: "total_amount",
      ellipsis: true,
      sorter: true,
      render: (text, record) => (
        <div> {parseFloat(record?.totalAmount).toFixed(2)}</div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      render: (text, record) => {
        // Determine the class name and display value based on the status
        const getStatusDetails = (status) => {
          switch (status.toLowerCase()) {
            case "advance":
              return {
                className: "status-advance",
                displayText: `Advance`,
              };
            case "refunded":
              return {
                className: "status-refunded",
                displayText: `Refunded`,
              };
            default:
              return {
                className: "status-advance",
                displayText: `Advance`,
              };
          }
        };

        // Get status details
        const { className, displayText } = getStatusDetails(
          record?.transactionType
        );

        return <div className={className}>{displayText}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (text, record) => (
        <Dropdown
          className="cursor-pointer"
          menu={{
            items: getMenuItems(record),
          }}
          trigger={["click"]}
        >
          <i
            className="icon-More"
            onClick={() => getPatientWalletBalance(record?.patientId)}
          />
        </Dropdown>
      ),
    },
  ];

  const patientColumns = [
    {
      title: "#",
      dataIndex: "srno",
      key: "srno",
      ellipsis: true,
      width: 50,
      render: (text, record, index) => <div className="fs-14">{index + 1}</div>,
    },
    {
      title: "RECEIPT NO & DATE",
      dataIndex: "receipt_no_date",
      key: "receipt_no_date",
      width: 250,
      sorter: true,
      render: (text, record) => (
        <div
          className="cursor-pointer"
          onClick={() => {
            setBillData(record);
            handleDrawerPreviewBill();
          }}
        >
          <a className="fs-14 fw-semibold theme-color">
            {selectedCard === 3 ? record?.billNumber : record?.receiptNumber}
          </a>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {formatDateWithOrdinal(record.date)}
          </div>
        </div>
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      ellipsis: true,
      sorter: true,
      render: (text, record) => <div> {record?.totalAmount} </div>,
    },
    {
      title: "STATUS",
      dataIndex: "transactionType",
      key: "transactionType",
      ellipsis: true,
      render: (text, record) => {
        // Determine the class name and display value based on the status
        const getStatusDetails = (status) => {
          switch (status.toLowerCase()) {
            case "deposit":
              return {
                className: "status-advance",
                displayText: `Advance`,
              };
            case "refund":
              return {
                className: "status-refunded",
                displayText: `Refunded`,
              };
            case "debit":
              return {
                className: "status-debited",
                displayText: `Debited`,
              };
            default:
              return {
                className: "status-advance",
                displayText: `Advance`,
              };
          }
        };

        // Get status details
        const { className, displayText } = getStatusDetails(
          record?.transactionType
        );

        return <div className={className}>{displayText}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (text, record) => (
        <Dropdown
          className="cursor-pointer"
          menu={{
            items: getMenuItems(record),
          }}
          trigger={["click"]}
        >
          <i className="icon-More"></i>
        </Dropdown>
      ),
    },
  ];

  // Add Advance Drawer
  const handleAddAdvanceDrawer = () => {
    setAddAdvanceDrawer(!addAdvanceDrawer);
  };

  const getMenuItems = (record) => {
    const items = [
      {
        label: (
          <div onClick={() => onBillingDetailsClick(1, record)}>
            View Receipt
          </div>
        ),
        key: "view_receipt",
      },
      {
        label: (
          <div onClick={() => onBillingDetailsClick(2, record)}>
            Print Receipt
          </div>
        ),
        key: "add_to_3c",
      },
    ];

    if (record?.campaign_sent) {
      return items.filter(
        (item) => item.key !== "edit_campaign" && item.key !== "delete_campaign"
      );
    } else if (record?.edit_status) {
      return items.filter((item) => item.key !== "edit_campaign");
    } else {
      return items;
    }
  };

  const handlePrintWeb = useReactToPrint({
    content: () => printableRef.current,
  });

  // Download Options Modal
  const handleOpenDownloadModal = () => {
    setOpenDownloadModal(!openDownloadModal);
  };

  const handleCheckboxChange = (checkedValues) => {
    setSelectedOptions(checkedValues);
  };

  useEffect(() => {
    const filteredOptions = selectedOptions;

    setDownloadData(
      data?.receipts?.filter((item) => {
        filteredOptions.includes(item.transactionType);
      })
    );
  }, [selectedOptions, data]);

  const handleDownload = async () => {
    try {
      handlePrintClick(
        printableRef.current,
        setTabLoader,
        handlePrintWeb,
        "DownloadBill"
      );
    } catch (error) {
      message.error("Failed to download. Please try again.");
    }
  };

  const handleDownloadAll = () => {
    const allStatuses = ["Deposit", "Refund", "Debit"];

    setDownloadData(
      data?.receipts?.filter((item) =>
        allStatuses.includes(item.transactionType)
      )
    );

    // Ensure handleDownload runs after state is updated
    setTimeout(() => {
      handleDownload();
    }, 0);
  };

  // Dropdown content
  const menu = (
    <div
      className="download-options-container billing-table-wrapper"
      style={{
        padding: "10px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Download All Sections */}
      <Button
        type="link"
        style={{ background: "lightgray" }}
        onClick={() => {
          // Direct download all data
          setSelectedOptions(["Deposit", "Refund", "Debit"]);
          handleDownloadAll();
        }}
      >
        Download All Status
      </Button>

      <div style={{ textAlign: "center", margin: "10px 0" }}>
        ---------- or ----------
      </div>

      {/* Checkboxes */}
      <Checkbox.Group
        className="bil"
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
        value={selectedOptions} // Bind selected checkboxes to state
        onChange={handleCheckboxChange}
      >
        <Checkbox value="Deposit">
          <span className="color-advance">Advance</span>
        </Checkbox>
        <Checkbox value="Refund">
          <span className="color-refunded">Refunded</span>
        </Checkbox>
        <Checkbox value="Debit">
          <span className="color-debited">Debited</span>
        </Checkbox>
      </Checkbox.Group>

      {/* Download Now Button */}
      <Button
        type="primary"
        // className="justify-content-center align-items-center"
        style={{
          width: "100%",
          display: `${selectedOptions.length > 0 ? "" : "none"}`,
        }}
        onClick={handleDownload}
      >
        Download
        <i class="icon-download fs-8" />
      </Button>
    </div>
  );

  const loadData = async () => {
    // setLoading(true);
    const params = {
      status:
        selectedCard === 1
          ? "Deposit"
          : selectedCard === 2
          ? "Refund"
          : "Debit",
      sortBy: sortConfig?.field || "date",
      sortOrder: sortConfig?.order || "desc",
      page: 1,
      limit: 25,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      search: searchQuery || "",
    };
    try {
      const response = await fetchAdvancedDepositDashboard(params);
      setData(response || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      // setLoading(false);
    }
  };

  const getPatientWalletBalance = async (patientId) => {
    const patientWalletBalanceRes = await fetchPatientWalletBalance(patientId);
    if (patientWalletBalanceRes?.advanceDepositBalance) {
      setPatientWalletBalance(patientWalletBalanceRes?.advanceDepositBalance);
    }
  };

  const patientAdvanceData = async () => {
    // setLoading(true);
    const params = {
      status:
        selectedCard === 1
          ? "Deposit"
          : selectedCard === 2
          ? "Refund"
          : "Debit",
      sortBy: sortConfig?.field || "date",
      sortOrder: sortConfig?.order || "desc",
      page: 1,
      limit: 25,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      doctorIds: doctorList.map((doctor) => doctor.um_id),
      search: searchQuery || "",
      patientId: patientData?.patient_unique_id ?? "",
    };
    try {
      const response = await listAdvancedDepositByPatient(params);
      setData(response || []);
      let updatedReceipts = [];
      if (response?.receipts?.length > 0) {
        updatedReceipts = response.receipts.map((item) => ({
          ...item,
          patient: response.patient,
        }));
      }

      setData({ ...response, receipts: updatedReceipts });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      // setLoading(false);
    }
  };

  // Add a refresh function
  const refreshData = useCallback(() => {
    if (patientData) {
      patientAdvanceData();
      // Also refresh wallet balance if needed
      getPatientWalletBalance(patientData?.patient_unique_id);
    } else {
      loadData();
    }
  }, [patientData]);

  useEffect(() => {
    if (patientData) {
      patientAdvanceData();
    } else {
      loadData();
    }
  }, [selectedCard, dateRange, searchQuery, doctorList, sortConfig]);

  // Expose the refresh function via ref
  useImperativeHandle(ref, () => ({
    refreshData: () => {
      if (patientData) {
        patientAdvanceData();
        getPatientWalletBalance(patientData?.patient_unique_id);
      } else {
        loadData();
      }
    }
  }));

  return (
    <div>
      <div className="appointment-data advance-table-wrapper">
        <Row className="justify-content-between align-items-center my-2 px-4">
          <Col xl={7} sm={5}>
            <Input
              value={searchQuery}
              placeholder={
                patientData
                  ? "Search by receipt number"
                  : "Search by patient name / phone no / receipt no"
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
          </Col>
          <Col xl={4} sm={5}>
            <div className="d-flex flex-row gap-2">
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
                  // disabledDate={(current) =>
                  //   selectedTab !== TAB_CAMPAIGN ? disabledDate(current) : null
                  // }
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
          </Col>
        </Row>
        <Row className="justify-content-between align-items-center px-4">
          <div className="card-container">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card ${selectedCard === card.id ? "selected" : ""}`}
                onClick={() => setSelectedCard(card.id)}
                style={{
                  borderColor: "transprent",
                  background: `linear-gradient(180deg, ${card.color}4D 0%, ${card.color}00 35%)`,
                }}
              >
                <div
                  className="card-title"
                  style={{ "--dynamic-color": card.fontColor }}
                >
                  {card.title} {"("}
                  {card.count}
                  {")"}
                </div>
                <div className="card-amount">{card.amount}</div>
              </div>
            ))}
          </div>

          {
            <div style={{ display: "none" }}>
              <div ref={printableRef}>
                <DownloadBill
                  downloadData={downloadData}
                  parent={"advance"}
                  dateRange={dateRange}
                />
              </div>
            </div>
          }

          <Table
            className="billing-table px-0"
            columns={patientData ? patientColumns : columns}
            width="100%"
            dataSource={data}
            pagination={false}
            scroll={{ y: 300 }}
            onChange={handleSortChange} // Send sorting data to parent
          />
        </Row>
      </div>
      {previewBillDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerPreviewBill}
          open={previewBillDrawer}
          width="100%"
          push={false}
        >
          <PreviewBill
            handleCreateBillDrawer={handleDrawerPreviewBill}
            isPreviewFromTable={true}
            isDepositReceipt={true}
            billData={billData}
            totalAdvanceBalance={patientWalletBalance}
          />
        </Drawer>
      )}

      {addAdvanceDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleAddAdvanceDrawer}
          open={addAdvanceDrawer}
          width="85%"
          push={false}
        >
          <AddAdvance
            handleAddAdvanceDrawer={handleAddAdvanceDrawer}
            billData={billData}
            onSuccess={refreshData} // Pass the refresh function
          />
        </Drawer>
      )}
    </div>
  );
});

export default React.memo(AdvanceDepositTable);
