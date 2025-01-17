import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import "./AddForm3cBills.scss";

import locale from "antd/es/date-picker/locale/en_US";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import MenuDivider from "antd/es/menu/MenuDivider";

// import { errorMessage, onlyNumberFormat } from "../../../../utils/utils";
// import { MESSAGE_KEY } from "../../../../utils/constants";

// import VideoModal from "../../../../common/VideoModal";
// import messageCorner from "../../../../assets/images/message-corner.svg";
// import CreditImg from "../../../../assets/images/credit_icon.svg";
// import tutorial from "../../../../assets/images/tutorial-icon.svg";
// import messageCornerGrey from "../../../../assets/images/message-corner-grey.svg";
// import alertIcon from "../../../../assets/images/alertIcon.svg";
// import imgCloseVisit from "../../../../assets/images/close-visit.svg";
// import visitEnd from "../../../../assets/images/end-visit.svg";

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

function AddForm3cBills({ handleAddForm3cBill }) {
  const {
    loading,
    userCreditObj,
    categoryList,
    allTemplateList,
    templateLoading,
    doctorList,
    patientCount,
  } = useSelector((state) => state.bulkMessages);
  const { profile } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { state } = useLocation();
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: moment().format(dateFormat),
    endDate: moment().format(dateFormat),
  });
  const [dateStatus, setDateStatus] = useState(1);
  const [pageNo, setPageNo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerModal, setPickerModal] = useState(false);

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

  // Back Model
  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  const columns = [
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (text, record) => (
        <>
          <Checkbox />
        </>
      ),
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
      dataIndex: "bill_num_date",
      key: "bill_num_date",
      width: 200,
      sorter: (a, b) => {
        const lhsDateTime = `${a.campaign_date} ${a.campaign_time}`;
        const lhsLongTime = moment(
          lhsDateTime,
          "Do MMM YYYY HH:mm A"
        ).valueOf();

        const rhsDateTime = `${b.campaign_date} ${b.campaign_time}`;
        const rhsLongTime = moment(
          rhsDateTime,
          "Do MMM YYYY HH:mm A"
        ).valueOf();

        const result = lhsLongTime - rhsLongTime;
        return result;
      },
      render: (text, record) => (
        <div className="cursor-pointer" onClick={async () => {}}>
          <div className="fs-14 fw-semibold">{record.bill_bum}</div>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {record.bill_date}
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
          <div className="fs-14">{record.patient_details}</div>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {record.mobile_number}
          </div>
        </div>
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "total_amount",
      key: "total_amount",
      ellipsis: true,
      sorter: (a, b) => {
        const lhsDateTime = `${a.campaign_date} ${a.campaign_time}`;
        const lhsLongTime = moment(
          lhsDateTime,
          "Do MMM YYYY HH:mm A"
        ).valueOf();

        const rhsDateTime = `${b.campaign_date} ${b.campaign_time}`;
        const rhsLongTime = moment(
          rhsDateTime,
          "Do MMM YYYY HH:mm A"
        ).valueOf();

        const result = lhsLongTime - rhsLongTime;
        return result;
      },
      onFilter: (value, record) => record.send_on.startsWith(value),
      render: (text, record) => <div> {record.total_amount} </div>,
    },
    {
      title: "PAID AMOUNT",
      dataIndex: "paid_Amount",
      key: "paid_Amount",
      ellipsis: true,
      sorter: (a, b) => {
        const lhsDateTime = `${a.campaign_date} ${a.campaign_time}`;
        const lhsLongTime = moment(
          lhsDateTime,
          "Do MMM YYYY HH:mm A"
        ).valueOf();

        const rhsDateTime = `${b.campaign_date} ${b.campaign_time}`;
        const rhsLongTime = moment(
          rhsDateTime,
          "Do MMM YYYY HH:mm A"
        ).valueOf();

        const result = lhsLongTime - rhsLongTime;
        return result;
      },
      render: (text, record) => <div> {record.paid_Amount} </div>,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      render: (text, record) => <div> {record.status} </div>,
    },
  ];

  const data = [
    {
      key: "1",
      srno: "1",
      bill_bum: "INV-2900567",
      patient_details: "John Doe",
      bill_date: "15 Oct 2023",
      bill_time: "10:30 AM",
      total_amount: "₹5,000",
      paid_Amount: "₹3,000",
      status: "Pending",
      mobile_number: "9930875752",
    },
    {
      key: "2",
      srno: "2",
      bill_bum: "INV-2900568",
      patient_details: "Jane Smith",
      bill_date: "14 Oct 2023",
      bill_time: "02:45 PM",
      total_amount: "₹7,500",
      paid_Amount: "₹7,500",
      status: "Paid",
      mobile_number: "9930875752",
    },
    {
      key: "3",
      srno: "3",
      bill_bum: "INV-2900569",
      patient_details: "Michael Johnson",
      bill_date: "16 Oct 2023",
      bill_time: "11:15 AM",
      total_amount: "₹6,000",
      paid_Amount: "₹0",
      status: "Unpaid",
      mobile_number: "9930875752",
    },
    {
      key: "4",
      srno: "4",
      bill_bum: "INV-2900570",
      patient_details: "Emily Davis",
      bill_date: "13 Oct 2023",
      bill_time: "09:00 AM",
      total_amount: "₹4,200",
      paid_Amount: "₹4,200",
      status: "Paid",
      mobile_number: "9930875752",
    },
  ];

  return (
    <div className="manage-3c-bills-wrapper">
      <div className="modalCard-header align-items-center d-flex justify-content-between">
        <div className="align-items-center d-flex">
          <div className="border-end h-100 text-center">
            <Button
              className="btn btn-delete-prescription px-3 h-100"
              onClick={handleAddForm3cBill}
            >
              <i className="icon-right lh-lg"></i>
            </Button>
          </div>
          <div className="w-100 px-20 fs-16 fw-semibold">Add New Bills to Form 3C</div>
        </div>
        <div className="align-items-center d-flex gap-4 me-4">
          <Button className="btn-create-bill" disabled={true}>
            <span>{"Add to Form 3C"}</span>
          </Button>
        </div>
      </div>
      <div
        className="bg-body overflow-y-auto pt-5 pb-4"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="d-flex justify-content-between align-items-center my-2 px-4">
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
        <div className="justify-content-between align-items-center px-4 my-2">
          <Table
            className="billing-table px-0"
            columns={columns}
            width="100%"
            dataSource={data}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
}

export default AddForm3cBills;
