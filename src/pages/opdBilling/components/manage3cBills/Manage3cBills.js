import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Button,
  Drawer,
  Popover,
  Steps,
  Radio,
  DatePicker,
  TimePicker,
  Select,
  Checkbox,
  Input,
  Spin,
  message,
  Table,
} from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "./Manage3cBills.scss";
import AddForm3cBills from "../manage3cBills/AddForm3cBills.js";
import { useReactToPrint } from "react-to-print";
import { handlePrintClick } from "../../../../utils/utils.js";

import locale from "antd/es/date-picker/locale/en_US";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
// import MenuDivider from "antd/es/menu/MenuDivider";
import Form3cPrint from "./Form3cPrint.js";
import { MESSAGE_KEY } from "../../../../utils/constants.js";
import visitEnd from "../../../../assets/images/end-visit.svg";
import imgCloseVisit from "../../../../assets/images/close-visit.svg";
import { fetchBillingDashboard } from "../../service.js";
import { formatDateWithOrdinal } from "../../utils/helper.js";
import InfoTooltip from "../billingDashboard/BillingTable/InfoToolTip/InfoTooltip.js";

// import { errorMessage, onlyNumberFormat } from "../../../../utils/utils";
// import { MESSAGE_KEY } from "../../../../utils/constants";

// import VideoModal from "../../../../common/VideoModal";
// import messageCorner from "../../../../assets/images/message-corner.svg";
// import CreditImg from "../../../../assets/images/credit_icon.svg";
// import tutorial from "../../../../assets/images/tutorial-icon.svg";
// import messageCornerGrey from "../../../../assets/images/message-corner-grey.svg";
// import alertIcon from "../../../../assets/images/alertIcon.svg";
// import AvailableCredits from "../../../../components/bulk_messages/AvailableCredits";
// import CommonModal from "../../../../common/CommonModal";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM YYYY";

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const dateFormat1 = "YYYY-MM-DD";
const timeFormat1 = "HH:mm:ss";

const showDateTimeFormat = "DD MMM YYYY hh:mm A";
const showDateFormat1 = "DD MMM YYYY";
const showTimeFormat1 = "hh:mm A";

const SELECT_AFTER = [
  {
    value: "Year",
    label: "Year",
  },
  {
    value: "Month",
    label: "Month",
  },
];

const GENDER = ["Male", "Female", "Other"];

function Manage3cBill({ handleForm3cBill, handleAddForm3cBill }) {
  const {
    loading,
    userCreditObj,
    categoryList,
    allTemplateList,
    templateLoading,
    doctorList,
    patientCount,
  } = useSelector((state) => state.bulkMessages);
  const { profile, userId } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { state } = useLocation();
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: moment().format(dateFormat),
    endDate: moment().format(dateFormat),
  });
  const [dateStatus, setDateStatus] = useState(1);
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Store selected row objects
  const [pageNo, setPageNo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerModal, setPickerModal] = useState(false);
  const printableRef = useRef(null);
  const [tabLoader, setTabLoader] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: null, order: null });

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

  const handlePrintWeb = useReactToPrint({
    content: () => printableRef.current,
  });

  const handleForm3cPrint = () => {
    handlePrintClick(
      printableRef.current,
      setTabLoader,
      handlePrintWeb,
      "DownloadBill"
    );
  };

  // Handle individual row selection
  const onSelectChange = (selectedKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  // Handle "Select All" checkbox in header
  const onSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.bills);
    } else {
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    if (form3cData) {
      message.open({
        key: MESSAGE_KEY,
        type: "",
        className: "message-appointment",
        content: (
          <div className="d-flex align-items-center">
            <img src={visitEnd} className="me-3" />
            <div>
              <div className="title-common text-start fontroboto">{`${form3cData} Bills added Form 3C.`}</div>
              {/* <div className='fontroboto text-start fw-normal mt-1'>View completed visits in finished tab.</div> */}
            </div>
            <img
              src={imgCloseVisit}
              className="ms-3"
              onClick={() => message.destroy()}
            />
          </div>
        ),
        duration: 5,
      });
    }
  }, [form3cData]);

  const rangePresets = [
    {
      label: (
        <div className={`${dateStatus === 1 ? "active" : ""}`}>Till date</div>
      ),
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
      // console.log('From: ', dates[0], ', to: ', dates[1]);
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

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
      } else if (
        dayjs().add(-3, "M").format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(4);
      } else if (
        dayjs().add(-6, "M").format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(5);
      } else if (
        dayjs().add(-1, "y").format(dateFormat) ==
          moment(dateStrings[0], showDateFormat).format(dateFormat) &&
        dayjs().format(dateFormat) ==
          moment(dateStrings[1], showDateFormat).format(dateFormat)
      ) {
        setDateStatus(6);
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

  const disabledDate = (current) => {
    // Disable dates before today and after 3 months from today
    const today = moment().startOf("day");
    const threeMonthsFromToday = today.clone().add(3, "months").endOf("day");
    return (
      current &&
      (current.isBefore(today) || current.isAfter(threeMonthsFromToday))
    );
  };

  const disabledTime = (current) => {
    if (!current) return {};
    const now = moment();

    // If the selected date is today, disable past hours and minutes
    if (current.isSame(now, "day")) {
      return {
        disabledHours: () => [...Array(now.hour()).keys()], // Disable past hours
        disabledMinutes: (selectedHour) =>
          selectedHour === now.hour() ? [...Array(now.minute()).keys()] : [], // Disable past minutes for the current hour
      };
    }
    return {};
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      const order = sorter.order === "ascend" ? "asc" : "desc"; // Convert to API format
      const field = sorter.field; // Get sorted field

      // Pass sorting parameters to parent
      handleSortChange(field, order);
    }
  };

  const handleSortChange = (field, order) => {
    setSortConfig({ field, order }); // Update state
  };

  // Back Model
  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  const columns = [
    {
      key: "action",
      width: 30,
    },
    {
      title: "#",
      dataIndex: "srno",
      key: "srno",
      ellipsis: true,
      width: 50,
      render: (text, record, index) => <div className="fs-14">{index + 1}</div>,
    },
    {
      title: "BILL NO & DATE",
      dataIndex: "date",
      key: "date",
      width: 200,
      sorter: true,
      render: (text, record) => (
        <div className="cursor-pointer" onClick={async () => {}}>
          <div className="fs-14 fw-semibold theme-color">
            {record.billNumber}
          </div>
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
        <div className="cursor-pointer" onClick={async () => {}}>
          <div className="fs-14">{record.patient.name}</div>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {record.patient.phone}
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
      render: (text, record) => <div> {record.payableAmount} </div>,
    },
    {
      title: "PAID AMOUNT",
      dataIndex: "paidAmount",
      key: "paidAmount",
      ellipsis: true,
      sorter: true,
      render: (text, record) => <div> {record.paidAmount} </div>,
    },
    {
      title: "STATUS",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      ellipsis: true,
      render: (text, record) => {
        // Determine the class name and display value based on the status
        const getStatusDetails = (status) => {
          switch (status?.toLowerCase()) {
            case "fullypaid":
              return {
                className: "status-paid-fully",
                displayText: "Paid Fully",
              };
            case "due":
              return {
                className: "status-due",
                displayText: `Due`,
              };
            case "carriedforward":
              return {
                className: "status-carriedforrward",
                displayText: `Due`,
              };
            default:
              return {
                className: "status-paid-fully",
                displayText: `Paid Fully`,
              };
          }
        };

        // Get status details
        const { className, displayText } = getStatusDetails(
          record.paymentStatus
        );

        return (
          <div className="d-flex">
            <div className={className}>{displayText}</div>
            {("CarriedForward" === record.paymentStatus ||
              ("Refunded" === record.paymentStatus && record.notes)) && (
              <InfoTooltip
                type={record.paymentStatus}
                amount={
                  record.paymentStatus === "Refunded"
                    ? record.paidAmount
                    : record.dueAmount
                }
                notes={record.notes}
                billNo={record.nextBillNumber}
              />
            )}
          </div>
        );
      },
    },
  ];

  const loadData = async () => {
    // setLoading(true);
    const params = {
      sortBy: sortConfig?.field || "date",
      sortOrder: sortConfig?.order || "desc",
      page: 1,
      limit: 25,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      doctorIds: userId,
      isForm3C: true,
      search: searchQuery || "",
    };
    try {
      const response = await fetchBillingDashboard(params);
      setData(response || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange, searchQuery, sortConfig, form3cData]);

  return (
    <div className="manage-3c-bills-wrapper">
      <div className="modalCard-header align-items-center d-flex justify-content-between">
        <div className="align-items-center d-flex">
          <div className="border-end h-100 text-center">
            <Button
              className="btn btn-delete-prescription px-3 h-100"
              onClick={handleForm3cBill}
            >
              <i className="icon-right lh-lg"></i>
            </Button>
          </div>
          <div className="w-100 px-20 fs-16 fw-semibold">Form 3C Bill</div>
        </div>
        <div className="align-items-center d-flex gap-4 me-4">
          <Button className="btn-manage-bill" onClick={handleAddForm3cBill}>
            <span>{"+"}</span>
            <span>{"Add New Bills to 3C"}</span>
          </Button>
          <Button
            className={`btn-create-bill ${
              selectedRows?.length === 0 ? "disabled" : ""
            } `}
            onClick={handleForm3cPrint}
            disabled={selectedRows?.length === 0}
          >
            <span>{"Print Form 3C"}</span>
          </Button>
        </div>
      </div>
      <div
        className="bg-body overflow-y-auto pt-1 pb-4"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="d-flex justify-content-between align-items-center my-4 px-4">
          <div>
            <Input
              value={searchQuery}
              placeholder="Search by patient name / phone no / bill no"
              className="inputheight38 search-bar"
              prefix={<i className="icon-search" />}
              suffix={
                searchQuery.length > 0 && (
                  <i className="icon-Cross" onClick={() => onSearch("")}></i>
                )
              }
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div>
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
            </div>
          </div>
        </div>

        {
          <div style={{ display: "none" }}>
            <div ref={printableRef}>
              <Form3cPrint rows={selectedRows} />
            </div>
          </div>
        }
        <div className="justify-content-between align-items-center px-4 my-2 billing-table-wrapper">
          <Table
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedRows.map((row) => row.id),
              onChange: onSelectChange,
            }}
            className="px-0"
            columns={columns}
            width="100%"
            scroll={{ y: 600 }}
            dataSource={data?.bills?.filter((item) => item.paymentStatus !== "Refunded")}
            pagination={false}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Manage3cBill;
