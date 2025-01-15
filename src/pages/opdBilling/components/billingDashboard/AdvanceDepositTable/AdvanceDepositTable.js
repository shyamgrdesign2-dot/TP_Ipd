import React, { useState, useCallback, useEffect } from "react";
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
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "../AdvanceDepositTable/AdvanceDepositTable.scss";
const { RangePicker } = DatePicker;

const { Option } = Select;

const doctorsList = [
  { id: 1, name: "Doctor 1" },
  { id: 2, name: "Doctor 2" },
  { id: 3, name: "Doctor 3" },
  { id: 4, name: "Doctor 4" },
];

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

export default function AdvanceDepositTable() {
  const [pageNo, setPageNo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerModal, setPickerModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(1);

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

  const onBillingDetailsClick = async (status, record) => {
    if (status === 3) {
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
      dataIndex: "receipt_no_date",
      key: "receipt_no_date",
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
        </div>
      ),
    },
    {
      title: "MOBILE NUMBER",
      dataIndex: "mobile_number",
      key: "mobile_number",
      ellipsis: true,
      render: (text, record) => (
        <div className="cursor-pointer" onClick={async () => {}}>
          <div className="fs-14">{record.mobile_number}</div>
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
        const { className, displayText } = getStatusDetails(record.status);
      
        return <div className={className}>{displayText}</div>;
      }
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

  const getMenuItems = (record) => {
    const items = [
      {
        label: (
          <div onClick={() => onBillingDetailsClick(1, record)}>View Receipt</div>
        ),
        key: "view_receipt",
      },
      {
        label: (
          <div onClick={() => onBillingDetailsClick(2, record)}>
            Refund Receipt
          </div>
        ),
        key: "refund_receipt",
      },
      {
        label: (
          <div onClick={() => onBillingDetailsClick(3, record)}>
            Refund Advance
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

  const data = [
    {
      key: "1",
      srno: "1",
      bill_bum: "INV-2900567",
      patient_details: "John Doe",
      bill_date: "15 Oct 2023",
      bill_time: "10:30 AM",
      total_amount: "₹5,00",
      paid_Amount: "₹3,00",
      status: "Advance",
      mobile_number: "9930875752",
    },
    {
      key: "2",
      srno: "2",
      bill_bum: "INV-2900568",
      patient_details: "Jane Smith",
      bill_date: "14 Oct 2023",
      bill_time: "02:45 PM",
      total_amount: "₹500",
      paid_Amount: "₹7,500",
      status: "Advance",
      mobile_number: "9930875752",
    },
    {
      key: "3",
      srno: "3",
      bill_bum: "INV-2900569",
      patient_details: "Michael Johnson",
      bill_date: "16 Oct 2023",
      bill_time: "11:15 AM",
      total_amount: "₹500",
      paid_Amount: "₹0",
      status: "Refunded",
      mobile_number: "9930875752",
    },
    {
      key: "4",
      srno: "4",
      bill_bum: "INV-2900570",
      patient_details: "Emily Davis",
      bill_date: "13 Oct 2023",
      bill_time: "09:00 AM",
      total_amount: "₹500",
      paid_Amount: "₹4,200",
      status: "Refunded",
      mobile_number: "9930875752",
    },
  ];

  return (
    <div>
      <div className="appointment-data advance-table-wrapper">
        <Row className="justify-content-between align-items-center my-2 px-4">
          <Col xl={7} sm={5}>
            <Input
              value={searchQuery}
              placeholder="Search by patient name / phone no / bill no"
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
          <Col xl={3} sm={5}>
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
                  // borderColor: "transprent",
                  // backgroundImage: `linear-gradient(to bottom, ${card.color} 5%, #FFFFFF 95%)`
                  boxShadow: `inset 0 10px 20px ${card.color}40` /* Colored inner shadow */,
                  // background: `linear-gradient(180deg, ${#A461D81A} 0%, ${#A461D800} 100%)`
                }}
              >
                <div
                  className="card-title"
                  style={{ "--dynamic-color": card.fontColor}}
                >
                  {card.title}
                </div>
                <div className="card-amount">{card.amount}</div>
              </div>
            ))}
          </div>

          <Table
            className="billing-table px-0"
            columns={columns}
            width="100%"
            dataSource={data}
            pagination={false}
          />
        </Row>
      </div>
    </div>
  );
}
