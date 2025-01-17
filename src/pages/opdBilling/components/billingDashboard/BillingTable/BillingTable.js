import React, { useState, useCallback, useEffect, useRef } from "react";
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
  Modal,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "./BillingTable.scss";
import RefundBill from "../RefundBill/RefundBill";
import { useReactToPrint } from "react-to-print";
import { handlePrintClick } from "../../../../../utils/utils.js";
import DownloadBill from "../DownloadBill/DownloadBill.js";
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
    title: "Total Paid Bill Amount (8)",
    amount: "₹3,892/₹6,330",
    color: "#5A6774",
    fontColor: "#5A6774",
  },
  {
    id: 2,
    title: "Paid fully (4)",
    amount: "₹1,500",
    color: "#A5D6A7",
    fontColor: "#3D8C40",
  },
  {
    id: 3,
    title: "Due (3)",
    amount: "₹500",
    color: "#FFCC80",
    fontColor: "#ED8A00",
  },
  {
    id: 4,
    title: "Refunded (1)",
    amount: "₹800",
    color: "#EF9A9A",
    fontColor: "#B73A3A",
  },
];

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM YYYY";

export default function BillingTable() {
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerModal, setPickerModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const printableRef = useRef(null);
  const [tabLoader, setTabLoader] = useState(false);

  // Drawer states
  const [refundBillDrawer, setRefundBillDrawer] = useState(false);
  const [viewBillDrawer, setViewBillDrawer] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: moment().format(dateFormat),
    endDate: moment().format(dateFormat),
  });
  const [dateStatus, setDateStatus] = useState(1);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDoctors(doctorsList.map((doctor) => doctor.id));
    } else {
      setSelectedDoctors([]);
    }
    setSelectAll(checked);
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

  // Drawer form 3c
  const handleRefundBillDrawer = () => {
    setRefundBillDrawer(!refundBillDrawer);
  };

  // Download Options Modal
  const handleOpenDownloadModal = () => {
    setOpenDownloadModal(!openDownloadModal);
  };

  const handleCheckboxChange = (checkedValues) => {
    setSelectedOptions(checkedValues);
  };

  const handlePrintWeb = useReactToPrint({
    content: () => printableRef.current,
  });

  const handleDownload = async () => {
    // if (selectedOptions.length === 0) {
    //   // message.warning("Please select at least one option or download all sections!");
    //   return;
    // }

    try {
      console.log("this is getting called");
      // Mock API call
      // const response = await fetch("https://api.example.com/download-data", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ filters: selectedOptions }),
      // });
      // const data = await response.json();

      handlePrintClick(
        printableRef.current,
        setTabLoader,
        handlePrintWeb,
        "DownloadBill"
      );

      // // Pass the data to downloadView
      // downloadView(data);
      // message.success("Download started!");
      handleOpenDownloadModal();
    } catch (error) {
      // message.error("Failed to download. Please try again.");
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
    if (status === 1) {
    } else if (status === 2) {
      handleRefundBillDrawer();
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
      render: (text, record) => {
        // Determine the class name and display value based on the status
        const getStatusDetails = (status) => {
          switch (status.toLowerCase()) {
            case "paid fully":
              return {
                className: "status-paid-fully",
                displayText: "Paid Fully",
              };
            case "due":
              return {
                className: "status-due",
                displayText: `Due: ₹${record.paid_Amount}`,
              };
            case "refunded":
              return {
                className: "status-refunded",
                displayText: `Refunded ₹${record.total_amount}`,
              };
            default:
              return {
                className: "due",
                displayText: `Due: ₹${record.paid_Amount}`,
              };
          }
        };

        // Get status details
        const { className, displayText } = getStatusDetails(record.status);

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

  const getMenuItems = (record) => {
    const items = [
      {
        label: (
          <div onClick={() => onBillingDetailsClick(1, record)}>View bill</div>
        ),
        key: "view_bill",
      },
      {
        label: (
          <div onClick={() => onBillingDetailsClick(2, record)}>
            Refund bill
          </div>
        ),
        key: "refund_bill",
      },
      {
        label: (
          <div onClick={() => onBillingDetailsClick(3, record)}>
            Add to Form 3c
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
      total_amount: "5,000",
      paid_Amount: "3,000",
      status: "due",
      mobile_number: "9930875752",
    },
    {
      key: "2",
      srno: "2",
      bill_bum: "INV-2900568",
      patient_details: "Jane Smith",
      bill_date: "14 Oct 2023",
      bill_time: "02:45 PM",
      total_amount: "7,500",
      paid_Amount: "7,500",
      status: "paid fully",
      mobile_number: "9930875752",
    },
    {
      key: "3",
      srno: "3",
      bill_bum: "INV-2900569",
      patient_details: "Michael Johnson",
      bill_date: "16 Oct 2023",
      bill_time: "11:15 AM",
      total_amount: "6,000",
      paid_Amount: "0",
      status: "refunded",
      mobile_number: "9930875752",
    },
    {
      key: "4",
      srno: "4",
      bill_bum: "INV-2900570",
      patient_details: "Emily Davis",
      bill_date: "13 Oct 2023",
      bill_time: "09:00 AM",
      total_amount: "4,200",
      paid_Amount: "4,200",
      status: "paid fully",
      mobile_number: "9930875752",
    },
  ];

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
          handleDownload();
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
        onChange={handleCheckboxChange}
      >
        <Checkbox value="fullyPaid">
          <span className="color-paid">Fully Paid</span>
        </Checkbox>
        <Checkbox value="due">
          <span className="color-due">Due</span>
        </Checkbox>
        <Checkbox value="refunded">
          <span className="color-refunded">Refunded</span>
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

  return (
    <div>
      <div className="appointment-data billing-table-wrapper">
        <Row className="justify-content-between align-items-center my-2 px-4">
          <div>
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
          </div>
          <div className="d-flex flex-row gap-2">
            <div className="d-flex align-items-center">
              <Select
                className=""
                dropdownRender={(menu) => (
                  <div>
                    {/* All Doctors Option */}
                    <div style={{ padding: "10px" }}>
                      <Checkbox
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      >
                        All Doctors
                      </Checkbox>
                    </div>
                    <div
                      style={{
                        borderBottom: "1px solid #e8e8e8",
                        margin: "8px 0",
                      }}
                    />
                    {/* Custom Doctors */}
                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        padding: "8px",
                      }}
                    >
                      {doctorsList.map((doctor) => (
                        <div key={doctor.id} style={{ padding: "4px 0" }}>
                          <Checkbox
                            checked={selectedDoctors.includes(doctor.id)}
                            onChange={(e) =>
                              handleDoctorSelection(doctor.id, e.target.checked)
                            }
                          >
                            {doctor.name}
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                value={
                  selectAll
                    ? "All Doctors"
                    : `Selected (${selectedDoctors.length})`
                }
                style={{ width: "100%" }}
              >
                {/* Empty Option for Placeholder */}
                <Option value="placeholder" disabled>
                  Select Doctors
                </Option>
              </Select>
            </div>
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
                  // backgroundImage: `linear-gradient(to bottom, ${card.color} 5%, #FFFFFF 95%)`
                  boxShadow: `inset 0 10px 20px ${card.color}40` /* Colored inner shadow */,
                }}
              >
                <div
                  className="card-title"
                  style={{ "--dynamic-color": card.fontColor }}
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

        {
          <div style={{ display: "none" }}>
            <div ref={printableRef}>
              <DownloadBill />
            </div>
          </div>
        }

        {refundBillDrawer && (
          <Drawer
            closeIcon={false}
            placement="right"
            onClose={handleRefundBillDrawer}
            open={refundBillDrawer}
            width="50%"
          >
            <RefundBill handleRefundBillDrawer={handleRefundBillDrawer} />
          </Drawer>
        )}
      </div>
    </div>
  );
}
