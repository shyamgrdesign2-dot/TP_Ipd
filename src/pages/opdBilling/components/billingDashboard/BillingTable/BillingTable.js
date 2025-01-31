import React, { useState, useCallback, useRef } from "react";
import {
  Select,
  Checkbox,
  Row,
  Input,
  DatePicker,
  Button,
  Dropdown,
  Drawer,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "./BillingTable.scss";
import { useReactToPrint } from "react-to-print";
import { handlePrintClick } from "../../../../../utils/utils.js";
import DownloadBill from "../DownloadBill/DownloadBill.js";
import {
  fetchBillingDashboard,
  fetchBillsByPatient,
} from "../../../service.js";
import BillTable from "./BillTable.js";
import { fetchBillingDashboard } from "../../../service.js";
import { listDoctor } from "../../../../../redux/bulkMessagesSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getDecodedToken } from "../../../../../utils/localStorage.js";
const { RangePicker } = DatePicker;

const { Option } = Select;

const cardsStaticData = [
  {
    id: 1,
    title: "Total Paid Bill Amount",
    color: "#5A6774",
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

export default function BillingTable({ patientData }) {
  const decodedToken = getDecodedToken();
  const isAdmin = decodedToken?.result?.admin;
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerModal, setPickerModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const printableRef = useRef(null);
  const [tabLoader, setTabLoader] = useState(false);

  const [data, setData] = useState(null);
  const [cards, setCards] = useState([]);
  const [totalBillCount, setTotalBillCount] = useState(null);
  const [form3cTriggered, setForm3cTriggered] = useState(false);

  // Drawer states
  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: moment().format(dateFormat),
    endDate: moment().format(dateFormat),
  });
  const [dateStatus, setDateStatus] = useState(1);

  const { doctorList } = useSelector((state) => state.bulkMessages);
  const dispatch = useDispatch();

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

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDoctors(doctorList.map((doctor) => doctor.um_id));
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

  useEffect(() => {
    const filteredOptions = selectedOptions.includes("Due")
      ? ["CarriedForward", ...selectedOptions]
      : selectedOptions;

    setDownloadData(
      data?.bills?.filter((item) =>
        filteredOptions.includes(item.paymentStatus)
      )
    );
  }, [selectedOptions, data]);

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
      // handleOpenDownloadModal();
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

  // Function to handle form3c messages
  const handleMessageForm3c = () => {
    setForm3cTriggered((prev) => !prev); // Toggle state to trigger useEffect
  };

  const loadData = async () => {
    // setLoading(true);
    const params = {
      status:
        selectedCard === 1
          ? null
          : selectedCard === 2
          ? ["FullyPaid"]
          : selectedCard === 3
          ? ["Due", "CarriedForward"]
          : ["Refunded"],
      sortBy: "date",
      sortOrder: "desc",
      page: 1,
      limit: 25,
      // startDate: dateRange.startDate,
      // endDate: dateRange.endDate,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      doctorIds: decodedToken?.result?.user_id,
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

  const patientBillingData = async () => {
    // setLoading(true);
    const params = {
      status:
        selectedCard === 1
          ? null
          : selectedCard === 2
          ? ["FullyPaid"]
          : selectedCard === 3
          ? ["Due", "CarriedForward"]
          : ["Refunded"],
      sortBy: "date",
      sortOrder: "desc",
      page: 1,
      limit: 25,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      doctorIds: decodedToken?.result?.user_id,
      search: searchQuery || "",
      patientId: patientData?.patient_unique_id,
    };
    try {
      const response = await fetchBillsByPatient(params);
      setData(response || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (patientData) {
      patientBillingData();
    } else {
      loadData();
    }
  }, [selectedCard, dateRange, searchQuery, doctorList, form3cTriggered]);

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
            {isAdmin && doctorList?.length > 0 && (
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
                        {doctorList.map((doctor) => (
                          <div key={doctor.um_id} style={{ padding: "4px 0" }}>
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
            )}
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
                  {card.title} {"("}{" "}
                  {card.id === 1 && data ? totalBillCount : card.count} {")"}
                </div>
                <div className="card-amount">
                  {card.amount}
                  {card.id === 1 && data && (
                    <span>
                      {"/"} {data?.summary?.totalBillAmount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <BillTable
            data={data?.bills}
            isPatientScreen={patientData ? true : false}
            handleMessageForm3c={handleMessageForm3c}
          />
        </Row>

        {
          <div style={{ display: "none" }}>
            <div ref={printableRef}>
              <DownloadBill downloadData={downloadData} />
            </div>
          </div>
        }
      </div>
    </div>
  );
}
