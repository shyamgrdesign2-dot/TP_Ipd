import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  AutoComplete,
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Table,
  Tooltip,
  Tabs,
  Dropdown,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import "./AddAdvance.scss";

import { useSelector, useDispatch } from "react-redux";
import {
  clearSearch,
  searchPatients,
} from "../../../../redux/appointmentsSlice";
import {
  createAdvancedDeposit,
  fetchAdvancedDepositDashboard,
  listAdvancedDepositByPatient,
} from "../../service";
import imgCloseVisit from "../../../../assets/images/close-visit.svg";
import visitEnd from "../../../../assets/images/end-visit.svg";
import { MESSAGE_KEY } from "../../../../utils/constants";
import { ListGroup } from "react-bootstrap";
import { PaymentOptions } from "../../utils/constants";

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM, YY";
const { TextArea } = Input;

function AddAdvance({ handleAddAdvanceDrawer, patientData, billData }) {
  const { profile } = useSelector((state) => state.doctors);
  const { patients, error } = useSelector((state) => state.records);

  const scrollContainerRef = useRef(null);
  const inputRef = useRef([]);
  const dispatch = useDispatch();
  const [dateString, setDateString] = useState(null);
  const [shouldShowRefIdPopup, setShowRefIdPopup] = useState(-1);
  const [selectedTab, setSelectedTab] = useState(1);

  const [patientDetails, setPatientDetails] = useState(null);
  const [sortConfig, setSortConfig] = useState({ field: null, order: null });
  const [data, setData] = useState(null);
  const [clickedPatient, setClickedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [autoCompleteFlagName, setAutoCompleteFlagName] = useState(false);
  const [autoCompleteFlagMobile, setAutoCompleteFlagMobile] = useState(false);
  const [depositDate, setDepositDate] = useState(null);
  const [searchQueryName, setSearchQueryName] = useState("");
  const [searchQueryMobile, setSearchQueryMobile] = useState("");
  const [isEditingName, setIsEditingName] = useState(true);
  const [isEditingMobile, setIsEditingMobile] = useState(true);
  const [advanceTriggered, setAdvacneTriggered] = useState(false);

  const nameAutoCompleteRef = useRef(null);
  const mobileAutoCompleteRef = useRef(null);

  // const [searchOptionsName, setSearchOptionsName] = useState([]);
  // const [searchOptionsMobile, setSearchOptionsMobile] = useState([]);  const [depositDate, setDepositDate] = useState("");

  const [advanceModes, setAdvanceModes] = useState([
    { paymentMode: "Cash", amount: "", refId: "" },
  ]);
  const [refundModes, setRefundModes] = useState([
    { paymentMode: "Cash", amount: "", refId: "" },
  ]);
  const [notes, setNotes] = useState(""); // Stores the final notes value
  const notesRef = useRef("");

  const usedAdvanceModes = advanceModes.map((p) => p.paymentMode);

  const filteredAdvanceOptions = PaymentOptions.filter(
    (option) => !usedAdvanceModes.includes(option.value)
  );

  const usedPaymentModes = refundModes.map((p) => p.paymentMode);

  const filteredOptions = PaymentOptions.filter(
    (option) => !usedPaymentModes.includes(option.value)
  );

  const calculateTotalAmount = (modes) => {
    return modes.reduce((total, mode) => {
      const amount = parseFloat(mode.amount) || 0; // Ensure amount is a number
      return total + amount;
    }, 0);
  };

  const handleBlur = () => {
    setNotes(notesRef.current);
  };

  const BoldWordInName = ({ name, boldWord }) => {
    // Split the name into parts based on the bold word
    const parts = name.split(new RegExp(`(${boldWord})`, "i"));

    // Map through the parts and apply different styles to the bold word
    const formattedName = parts.map((part, index) => {
      if (part.toLowerCase() === boldWord.toLowerCase()) {
        // If the part matches the bold word, render it in bold
        return (
          <span key={index} className="fw-medium">
            {part}
          </span>
        );
      } else {
        // Otherwise, render it normally
        return <span key={index}>{part}</span>;
      }
    });

    return formattedName;
  };
  // Initialize items in state
  const [items, setItems] = useState([
    {
      //   key: Add Advance Deposit,
      key: 1,
      label: (
        <div className="d-flex align-items-center">
          <i className="icon-billings"></i>
          Add Advance Deposit
        </div>
      ),
    },
    {
      //   key: Refund Advance,
      key: 2,
      label: (
        <div className="d-flex align-items-center">
          <i className="icon-Finished"></i>
          Refund Advance
        </div>
      ),
    },
  ]);

  const onChange = useCallback(
    (key) => {
      //   setPageNo(0);
      //   setVisitTypeFilters("");
      setSelectedTab(key);
    },
    [selectedTab]
  );

  // Function to update modes (either advance or refund)
  const handleModeChange = (type, value, index, key) => {
    const updatedModes =
      type === "advance" ? [...advanceModes] : [...refundModes];
    updatedModes[index][key] = value;

    type === "advance"
      ? setAdvanceModes(updatedModes)
      : setRefundModes(updatedModes);
  };

  const handleAmountChange = (value, index) => {
    const updatedModes = [...advanceModes];
    updatedModes[index].amount = parseFloat(value) || 0;
    setAdvanceModes(updatedModes);
  };

  const handleAddAdvance = () => {
    handleAddAdvanceDrawer();
  };

  // Function to add a new payment mode
  const addPaymentMode = (type) => {
    const newMode = { paymentMode: "", amount: 0, refId: "" };
    type === "advance"
      ? setAdvanceModes([...advanceModes, newMode])
      : setRefundModes([...refundModes, newMode]);
  };

  // Function to remove a payment mode
  const removePaymentMode = (type, index) => {
    const updatedModes =
      type === "advance"
        ? advanceModes.filter((_, i) => i !== index)
        : refundModes.filter((_, i) => i !== index);

    type === "advance"
      ? setAdvanceModes(updatedModes)
      : setRefundModes(updatedModes);
  };

  const PatientPlank = (patient) => {
    return (
      <>
        <div className="d-flex align-items-center justify-content-between">
          <div
            className="d-flex align-items-center"
            onClick={() => {
              setAutoCompleteFlagMobile(false);
              setAutoCompleteFlagName(false);
              onSelect(patient);
            }}
          >
            <div className="list-patientName d-flex align-items-center me-4">
              <i className="icon-patients backbar me-2"></i>{" "}
              <span>
                {patient.pm_salutation && patient.pm_salutation}{" "}
                <BoldWordInName
                  name={patient.pm_fullname}
                  boldWord={searchQuery}
                />{" "}
                ({patient.pm_gender}, {patient.ageYears}y)
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  // const AddPatientPlank = () => {
  //   return (
  //     <Button
  //       type="text"
  //       className="btn btn-primary1 btn-41 align-items-center d-flex"
  //       icon={<i className="icon-Add"></i>}
  //       onClick={goToAddPatient}
  //     >
  //       Add New Patient
  //     </Button>
  //   );
  // };

  const onSearchName = useCallback(
    (query) => {
      // const clinic_name = getClinicName(profile?.hospital_data);
      // window.Moengage.track_event("TP_Patient_searched", {
      //   clinic_name,
      // });
      setSearchQueryName(query);
    },
    [setSearchQueryName]
  );

  const onSearchMobile = useCallback(
    (query) => {
      // const clinic_name = getClinicName(profile?.hospital_data);
      // window.Moengage.track_event("TP_Patient_searched", {
      //   clinic_name,
      // });
      setSearchQueryMobile(query);
    },
    [setSearchQueryMobile]
  );

  useEffect(() => {
    if (searchQueryName || searchQueryMobile) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchPatients({
            searchQuery: searchQueryName || searchQueryMobile,
            company: "",
          })
        );
      }, 500);
      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      dispatch(clearSearch());
    }
  }, [searchQueryName, searchQueryMobile]);

  useEffect(() => {
    const data = [];
    if (patients) {
      if (patients.length === 0 && searchQuery.length > 0) {
        data.push({
          key: -2,
          label: <div>{error}</div>,
        });
      } else {
        patients.map((patient) => {
          return data.push({
            key: JSON.stringify(patient),
            value: patient.pm_pid,
            label: PatientPlank(patient),
          });
        });
      }
    }
    // if (!isMobile) {
    //   data.push({
    //     key: -1,
    //     value: "Add New Patient",
    //     label: AddPatientPlank(),
    //   });
    // }
    setSearchOptions(data);
  }, [patients]);

  const onSelect = (patient) => {
    setPatientDetails({
      patientName: patient.pm_fullname,
      mobileNumber: patient.pm_contact_no,
      patientUniqueId: patient.patient_unique_id,
    });
    setSearchOptions([]);
    setSearchQueryMobile("");
    setSearchQueryName("");
    setIsEditingName(false);
    setIsEditingMobile(false);
  };

  useEffect(() => {
    if (isEditingName && nameAutoCompleteRef.current) {
      nameAutoCompleteRef.current.focus();
    }
    if (isEditingMobile && mobileAutoCompleteRef.current) {
      mobileAutoCompleteRef.current.focus();
    }
  }, [isEditingName, isEditingMobile]);

  const handleFieldChange = (field, value) => {
    setPatientDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Render function for modes
  const renderPaymentModes = (type, modes, filteredOptions) => (
    <div className="d-flex">
      <div style={{ padding: "16px 16px 0px 0px", width: "100%" }}>
        <div className="text-lg font-medium mb-2">
          Enter Advance Amount <span className="color-red">*</span>
        </div>
        {modes.map((payment, index) => (
          <div key={index} className="relative" style={{ width: "100%" }}>
            {index > 0 && (
              <div className="flex items-center gap-2 mb-2 relative">
                <span className="text-gray-500 text-sm font-medium z-10 bg-white px-2">
                  And
                </span>
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
              </div>
            )}
            <div className="flex align-items-center gap-4 mb-3">
              <div className="d-flex align-items-center">
                <div className="d-flex flex-column" style={{ width: "100%" }}>
                  <div className="d-flex">
                    <Select
                      placeholder="Select"
                      value={payment.paymentMode}
                      onChange={(value) =>
                        handleModeChange(type, value, index, "paymentMode")
                      }
                      dropdownStyle={{ width: 180 }}
                      options={filteredOptions}
                    />
                    <Input
                      type="number"
                      prefix="₹"
                      value={payment.amount}
                      onChange={(e) =>
                        handleModeChange(
                          type,
                          parseFloat(e.target.value) || 0,
                          index,
                          "amount"
                        )
                      }
                      className="w-40 payment-input"
                    />
                  </div>
                  {payment.paymentMode !== "Cash" && (
                    <span
                      className="show-more-link"
                      onClick={() => setShowRefIdPopup(index)}
                    >
                      {payment?.refId ?? `Add ${payment.paymentMode} Ref ID`}
                    </span>
                  )}
                </div>
                {modes.length > 1 && (
                  <Button
                    className="btn btn-delete-prescription p-0"
                    onClick={() => removePaymentMode(type, index)}
                  >
                    <i
                      className="icon-delete"
                      style={{ color: "#454551", marginLeft: 10 }}
                    />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => addPaymentMode(type)}
            className="payment-btn"
          >
            Payment mode
          </Button>
        </div>
      </div>
    </div>
  );

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
        <div className="cursor-pointer" onClick={async () => {}}>
          <div className="fs-14 fw-semibold theme-color">
            {record.receiptNumber}
          </div>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {moment(record.date).format(showDateFormat)}
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
      render: (text, record) => <div> {record.totalAmount} </div>,
    },
    {
      title: "STATUS",
      dataIndex: "transactionType",
      key: "transactionType",
      align: "center",
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
          record.transactionType
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

  const onAdvanceDetailsClick = async (status, record) => {
    if (status === 2) {
      setSelectedTab(2);
    } else {
    }
  };

  const getMenuItems = (record) => {
    const items = [
      {
        label: (
          <div onClick={() => onAdvanceDetailsClick(1, record)}>
            View Receipt
          </div>
        ),
        key: "view_receipt",
      },
      {
        label: (
          <div onClick={() => onAdvanceDetailsClick(2, record)}>
            Refund Receipt
          </div>
        ),
        key: "refund_receipt",
      },
    ];

    return items;
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

  const convertToISODateTime = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const selectedDate = new Date(`${year}-${month}-${day}`);

    // Get today's date in local timezone (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If selected date is today, return it in local time format with current time
    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      return `${year}-${month}-${day} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    }

    // Otherwise, convert to ISO format for past dates
    return selectedDate.toISOString();
  };

  const handleAddAdvanceClick = async () => {
    const totalAdvanceAmount = calculateTotalAmount(advanceModes);
    const totalRefundAmount = calculateTotalAmount(refundModes);

    if (totalRefundAmount > data?.summary?.totalAdvanceBalance) {
      message.error(
        "Refund amount shouldn't be greated than Total Advance Balance"
      );
      return;
    }

    if (depositDate || patientData?.apDate) {
      // Remove the ordinal suffix (st, nd, rd, th) from the date
      const cleanDate =
        patientData?.apDate &&
        patientData?.apDate.replace(/(\d+)(st|nd|rd|th)/, "$1");

      // Combine date and time and parse with moment
      const isoString = moment(
        `${cleanDate} ${patientData?.apTime}`,
        "D MMM YYYY hh:mm A"
      ).toISOString();

      const payload = {
        appointmentId: patientData?.pam_id ?? null,
        patientId:
          patientData?.patient_unique_id || patientDetails?.patientUniqueId, // Convert to number
        transactionType: selectedTab === 2 ? "Refund" : "Deposit",
        paymentModes: selectedTab === 2 ? [...refundModes] : [...advanceModes],
        totalAmount: selectedTab === 2 ? totalRefundAmount : totalAdvanceAmount,
        notes: notes,
        includeInRx: true,
        date: patientData?.apDate
          ? isoString
          : convertToISODateTime(depositDate),
      };

      try {
        const response = await createAdvancedDeposit(payload);
        if (response) {
          message.open({
            key: MESSAGE_KEY,
            type: "",
            className: "message-appointment",
            content: (
              <div className="d-flex align-items-center">
                <img src={visitEnd} className="me-3" />
                <div>
                  {selectedTab === 2 ? (
                    <div className="title-common text-start fontroboto">{`Advance ${totalRefundAmount} Added successfully`}</div>
                  ) : (
                    <div className="title-common text-start fontroboto">{`Refunded ${totalAdvanceAmount} successfully`}</div>
                  )}
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
          // Reset payment modes
          setAdvanceModes([{ paymentMode: "Cash", amount: "", refId: "" }]);
          setRefundModes([{ paymentMode: "Cash", amount: "", refId: "" }]);
          setAdvacneTriggered((prev) => !prev);
        }
      } catch (error) {
        console.error("Failed to create deposit:", error);
      }
    } else {
      message.error("please fill the details");
    }
  };

  const loadDepositData = async () => {
    // setLoading(true);
    const params = {
      status: ["Deposit", "Refund", "Debit"],
      sortBy: sortConfig?.field || "date",
      sortOrder: sortConfig?.order || "desc",
      patientId:
        patientData?.patient_unique_id || billData?.patientId || patientDetails?.patientUniqueId ,
      page: 1,
      limit: 25,
      // startDate: `2024-10-20`,
      // endDate: dateRange.endDate,
    };
    try {
      const response = await listAdvancedDepositByPatient(params);
      setData(response || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (patientDetails || patientData || billData) {
      loadDepositData();
    }
  }, [patientDetails, advanceTriggered, patientData, sortConfig, billData]);

  function formatDate(date) {
    // Remove ordinal suffix (st, nd, rd, th) using regex
    let cleanDate = date.replace(/(\d+)(st|nd|rd|th)/, "$1");

    // Parse and format the date using Moment.js
    return moment(cleanDate, "D MMM YYYY").format("YYYY-MM-DD");
  }

  return (
    <>
      <Card bordered={false} className="search-modalCard add-advance-wrapper">
        <div className="modalCard-header align-items-center justify-content-between d-flex">
          <div className="align-items-center d-flex justify-content-center">
            <Button
              type="text"
              className="btn px-3 focus-none h-100"
              onClick={handleAddAdvanceDrawer}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">Advance Deposit</div>
          </div>
        </div>
        <div className="d-flex modal-body">
          <div className="advance-left-container">
            <div className="d-flex flex-column gap-2 my-2 form-fields">
              {/* Patient Name */}
              <div className="d-flex gap-2 mx-4 p-2">
                <div style={{ width: "100%" }}>
                  <div className="text-lg font-medium mb-2">
                    Patient Name <span className="color-red">*</span>
                  </div>
                  {isEditingName && !patientData && !billData ? (
                    <AutoComplete
                      ref={nameAutoCompleteRef} // Attach ref for name AutoComplete
                      value={searchQueryName}
                      onSearch={(value) => {
                        setSearchQueryName(value);
                        onSearchName(value);
                      }}
                      options={searchOptions}
                      className="w-100 autocomplete-custom"
                      open={autoCompleteFlagName}
                      onFocus={() => setAutoCompleteFlagName(true)}
                      onBlur={() => setAutoCompleteFlagMobile(false)}
                      popupClassName="autocomplete-dropdown"
                    >
                      <Input
                        placeholder="Search Patient Name"
                        prefix={<i className="icon-search"></i>}
                        suffix={
                          searchQueryName.length > 0 && (
                            <i
                              className="icon-Cross"
                              onClick={() => {
                                setSearchQueryName("");
                              }}
                            />
                          )
                        }
                      />
                    </AutoComplete>
                  ) : (
                    <Input
                      value={
                        patientData
                          ? patientData?.pm_fullname
                          : billData
                          ? billData?.patient.name
                          : patientDetails
                          ? patientDetails?.patientName
                          : ""
                      }
                      disabled={patientData || billData}
                      // readOnly={patientData}
                      className="patient-input"
                      onClick={() => {
                        setIsEditingName(true);
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-between mx-4 p-2">
                {/* Mobile Number */}
                <div>
                  <div className="text-lg font-medium mb-2">
                    Mobile Number <span className="color-red">*</span>
                  </div>
                  {isEditingMobile && !patientData && !billData ? (
                    <AutoComplete
                      ref={mobileAutoCompleteRef} // Attach ref for mobile AutoComplete
                      value={searchQueryMobile}
                      onSearch={(value) => {
                        setSearchQueryMobile(value);
                        onSearchMobile(value);
                      }}
                      options={searchOptions}
                      className="w-100 autocomplete-custom"
                      open={autoCompleteFlagMobile}
                      onFocus={() => setAutoCompleteFlagMobile(true)}
                      onBlur={() => setAutoCompleteFlagMobile(false)}
                      popupClassName="autocomplete-dropdown"
                    >
                      <Input
                        placeholder="Search Mobile Number"
                        prefix={<i className="icon-search"></i>}
                        suffix={
                          searchQueryMobile.length > 0 && (
                            <i
                              className="icon-Cross"
                              onClick={() => {
                                setSearchQueryMobile("");
                              }}
                            />
                          )
                        }
                      />
                    </AutoComplete>
                  ) : (
                    <Input
                      value={
                        patientData
                          ? patientData?.pm_contact_no
                          : billData
                          ? billData.patient.phone
                          : patientDetails
                          ? patientDetails?.mobileNumber
                          : ""
                      }
                      disabled={patientData || billData}
                      // readOnly
                      className="patient-input"
                      onClick={() => setIsEditingMobile(true)} // Switch to editing mode
                    />
                  )}
                </div>
                {/* Advance Deposit Date */}
                <div>
                  <div className="text-lg font-medium mb-2">
                    Advance Deposit Date <span className="color-red">*</span>
                  </div>
                  {patientData?.apDate ? (
                    <Input
                      type="text"
                      value={formatDate(patientData?.apDate)}
                      disabled
                      className="disabled-input" // Optional: Apply styles to match the DatePicker
                    />
                  ) : (
                    <DatePicker
                      placeholder="Select Date"
                      dropdownClassName="addDOB-picker-dropdown"
                      onChange={(_, d) => setDepositDate(d)}
                      format="DD-MM-YYYY"
                      value={
                        depositDate ? dayjs(depositDate, "DD-MM-YYYY") : null
                      }
                      disabledDate={(current) =>
                        current && current.isAfter(dayjs(), "day")
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            {/* <div className="mx-4"> */}
            <Tabs
              defaultActiveKey={1}
              items={items}
              onChange={onChange}
              activeKey={selectedTab}
            />
            {/* </div> */}
            <div className="d-flex flex-column gap-2 mx-4 my-2 p-2 payment-scroll">
              {selectedTab === 1
                ? renderPaymentModes("advance", advanceModes, filteredAdvanceOptions)
                : renderPaymentModes("refund", refundModes, filteredOptions)}
              <div className="d-flex">
                <TextArea
                  className="h-50 align-self-center"
                  placeholder="Add Notes (optional)"
                  autoSize={{
                    minRows: 1,
                    maxRows: 2,
                  }}
                  defaultValue={notes} // Set initial value
                  onChange={(e) => {
                    notesRef.current = e.target.value; // Update ref without re-rendering
                  }}
                  onBlur={handleBlur} // Trigger state update on blur
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center mx-4 p-2">
              <Button
                className="btn btn-primary3 w-100 h-50"
                onClick={handleAddAdvanceClick}
              >
                {selectedTab === 1 ? "Add Advance" : "Refund"}
              </Button>
            </div>
          </div>
          {
            <div className="advance-right-container">
              <div className="total-advance-container mx-4 mt-4">
                <div className="advance-balance-title">
                  Total Advance Balance
                </div>
                {patientDetails || patientData || billData ? (
                  <div className="advance-balance-value">
                    {data?.summary?.totalAdvanceBalance}
                  </div>
                ) : (
                  <div className="advance-balance-value">--</div>
                )}
              </div>
              <div className="mx-4 mt-4 fs-16 fw-semibold">
                Patient’s Advance Deposit History
              </div>
              <div className="mx-4 mt-2">
                <Table
                  className="billing-table px-0"
                  columns={columns}
                  width="100%"
                  dataSource={data?.receipts}
                  pagination={false}
                  scroll={{ y: 600 }}
                  onChange={handleSortChange} // Send sorting data to parent
                />
              </div>
            </div>
          }
        </div>
      </Card>
    </>
  );
}

export default React.memo(AddAdvance);
