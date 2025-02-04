import { Col, Container, Navbar, Row } from "react-bootstrap";
import CommonModal from "../../../../common/CommonModal";
import {
  AutoComplete,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Input,
  Radio,
  Select,
  Table,
  message,
} from "antd";
import alertIcon from "./../../../../assets/images/alertIcon.svg";
import imgCloseVisit from "./../../../../assets/images/close-visit.svg";
import visitEnd from "./../../../../assets/images/end-visit.svg";
import { PlusOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState, useRef } from "react";
import DiagnosisNotes from "../../../obstetric/components/diagnosisNotes/DiagnosisNotes";
import {
  onlyDecimalFormat,
  removeBeforeWhiteSpace,
} from "../../../../utils/utils";
import ServiceItemPopup from "../serviceItemPopup/ServiceItemPopup";
import "./CreateBill.scss";
import RefIdPopup from "../refIdPopup/RefIdPopup";
import ReadMore from "../../../../common/ReadMore";
import ViewBillPdf from "../viewBillPdf/ViewBillPdf";
import { useSelector } from "react-redux";
import { pdf } from "@react-pdf/renderer";
import PreviewBill from "../../PreviewBill";
import { calculateTotalAmount, printContent } from "../../utils/helper";
import moment from "moment";
import {
  createBill,
  fetchAdvanceSetting,
  fetchPatientDueAmount,
  fetchPatientWalletBalance,
  fetchPrintSetting,
  searchBillItem,
} from "../../service";
import { setLoadingStatus } from "../../../../redux/uploadDocSlice";
import { useDispatch } from "react-redux";
import { deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase";
import { deleteDocsUploadedFromAndroid } from "../../../medicalRecords/service";
import {
  setAdvancedSettings,
  setBillPrintSettings,
} from "../../../../redux/billingSlice";
import { jwtDecode } from "jwt-decode";
import { useLocalStorage } from "../../../../utils/localStorage";
import {
  MESSAGE_KEY,
  PERSISTANT_STORAGE_KEY_AUTH_TOKEN,
} from "../../../../utils/constants";
import { useLocation } from "react-router-dom";
import { PaymentOptions } from "../../utils/constants";
import {
  clearSearch,
  searchPatients,
} from "../../../../redux/appointmentsSlice";

const CreateBill = ({
  handleCreateBillDrawer,
  isBackModalOpen,
  showHideBackModal,
  isRxPage,
  patientData = {},
  isDashboard,
}) => {
  const { state } = useLocation();
  const { pam_id } = state || {};
  const dispatch = useDispatch();
  const deviceUid = localStorage.getItem("app_device_unique_id");
  const { profile, userId } = useSelector((state) => state.doctors);
  const { patients, error } = useSelector((state) => state.records);
  const { billPrintSettings, advancedSettings } = useSelector(
    (state) => state.billing
  );
  const [billNotesDrawer, setBillNotesDrawer] = useState(false);
  const [previewBillDrawer, setPreviewBillDrawer] = useState(false);
  const [patientBillNotes, setPatientBillNotes] = useState("");
  const [searchItemSelected, setSearchItemSelected] = useState(null);
  const [shouldShowRefIdPopup, setShowRefIdPopup] = useState(-1);
  const [dataSource, setDataSource] = useState([
    {
      masterId: "",
      name: "",
      quantity: "",
      amount: "",
      discount: "",
      discountType: "",
      gst: "",
      totalAmount: "",
      createdBy: "",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [patientNameAndId, setPatientNameAndId] = useState(
    patientData.pm_pid
      ? `${patientData?.pm_fullname}, ${patientData.pm_pid}`
      : undefined
  );
  const [mobileNumber, setMobileNumber] = useState(patientData?.pm_contact_no);
  const [includeInRx, setIncludeInRx] = useState(false);
  const [shouldAddBillTo3C, setAddBillTo3C] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [extraDiscount, setExtraDiscount] = useState(undefined);
  const [extraDiscountType, setExtraDiscountType] = useState("flat");
  const [patientDueAmount, setPatientDueAmount] = useState(0);
  const [patientWalletBalance, setPatientWalletBalance] = useState(0);
  const [paymentModes, setPaymentModes] = useState([]);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [getToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  const [tokenData, setTokenData] = useState(null);
  const [billData, setBillData] = useState({});
  // Search patient related states
  const [patientDetails, setPatientDetails] = useState(null);
  const [searchQueryName, setSearchQueryName] = useState("");
  const [searchQueryMobile, setSearchQueryMobile] = useState("");
  const [isEditingName, setIsEditingName] = useState(true);
  const [isEditingMobile, setIsEditingMobile] = useState(true);
  const [autoCompleteFlagName, setAutoCompleteFlagName] = useState(false);
  const [autoCompleteFlagMobile, setAutoCompleteFlagMobile] = useState(false);
  const nameAutoCompleteRef = useRef(null);
  const mobileAutoCompleteRef = useRef(null);

  const subTotal = dataSource
    .reduce((sum, service) => sum + (Number(service.amount) || 0), 0)
    .toFixed(2);

  const lineItemDiscount = dataSource
    .reduce((sum, service) => sum + (Number(service.discount) || 0), 0)
    .toFixed(2);

  const applicableGst = dataSource
    .reduce(
      (sum, service) =>
        sum +
        ((Number(service.amount) || 0) - (Number(service.discount) || 0)) *
          ((Number(service.gst) || 0) / 100),
      0
    )
    .toFixed(2);

  const payableAmount = (
    dataSource.reduce(
      (sum, service) => sum + (Number(service.totalAmount) || 0),
      0
    ) -
    (Number(extraDiscount) || 0) +
    (Number(patientDueAmount) || 0)
  ).toFixed(2);

  const paidAmount = paymentModes
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
    .toFixed(2);

  const usedPaymentModes = paymentModes.map((p) => p.paymentMode);

  const filteredOptions = PaymentOptions.filter(
    (option) =>
      !usedPaymentModes.includes(option.value) &&
      (option.value !== "Advance Deposit" || patientWalletBalance > 0)
  );

  useEffect(() => {
    getStorageData();
    if (advancedSettings && Object.keys(advancedSettings).length === 0) {
      getAdvanceSettings();
    }
    if (billPrintSettings && Object.keys(billPrintSettings).length === 0) {
      getBillPrintSettings();
    }
    if (patientData?.patient_unique_id) {
      getPatientDueAmount();
      getPatientWalletBalance();
    }
  }, []);

  useEffect(() => {
    const updatedPayableAmount = (
      dataSource.reduce(
        (sum, service) => sum + (Number(service.totalAmount) || 0),
        0
      ) -
      (Number(extraDiscount) || 0) +
      (Number(patientDueAmount) || 0)
    ).toFixed(2);

    if (
      updatedPayableAmount &&
      Array.isArray(paymentModes) &&
      paymentModes.length
    ) {
      const updatedPaymentModes = paymentModes.map((mode, index) =>
        index === 0 ? { ...mode, amount: updatedPayableAmount } : mode
      );
      setPaymentModes(updatedPaymentModes);
    }
  }, [extraDiscount, patientDueAmount, dataSource]);

  const getBillPrintSettings = async () => {
    const printSettingsResponse = await fetchPrintSetting();
    if (printSettingsResponse) {
      dispatch(setBillPrintSettings(printSettingsResponse));
    }
  };

  const getStorageData = () => {
    const token = getToken();
    if (token !== undefined) {
      try {
        const decoded = jwtDecode(token);
        setTokenData(decoded.result);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const validatePaymentData = (data) => {
    return data.some(
      (item) => item.paymentMode && item.amount && Number(item.amount) > 0
    );
  };

  useEffect(() => {
    const validatePayment = validatePaymentData(paymentModes);
    if (validatePayment) {
      setDisableSaveBtn(false);
    } else {
      setDisableSaveBtn(true);
    }
    if (Number(paidAmount) > Number(payableAmount)) {
      setDisableSaveBtn(true);
    } else {
      setDisableSaveBtn(false);
    }
  }, [dataSource, paymentModes]);

  useEffect(() => {
    setDataSource((prevData) => {
      return prevData.map((item) => ({
        ...item,
        totalAmount: calculateTotalAmount(item),
      }));
    });
  }, [JSON.stringify(dataSource)]);

  const getPatientDueAmount = async () => {
    const patientDueRes = await fetchPatientDueAmount(
      patientData?.patient_unique_id
    );
    if (patientDueRes?.previousDueAmount) {
      setPatientDueAmount(patientDueRes?.previousDueAmount);
    }
  };

  const getPatientWalletBalance = async () => {
    const patientWalletBalanceRes = await fetchPatientWalletBalance(
      patientData?.patient_unique_id
    );
    if (patientWalletBalanceRes?.advanceDepositBalance) {
      setPatientWalletBalance(patientWalletBalanceRes?.advanceDepositBalance);
    }
  };

  useEffect(() => {
    if (advancedSettings && Object.keys(advancedSettings)?.length) {
      setIncludeInRx(advancedSettings.defaultRxFlag);
      setAddBillTo3C(advancedSettings.defaultForm3cFlag);
      setPaymentModes([
        {
          paymentMode: advancedSettings.defaultPaymentMode,
          amount: undefined,
          refId: "",
        },
      ]);
    }
  }, [advancedSettings]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      getSearchOptions();
    }, 500);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchQuery]);

  const getAdvanceSettings = async () => {
    const advanceSettingsResponse = await fetchAdvanceSetting();
    if (advanceSettingsResponse) {
      dispatch(setAdvancedSettings(advanceSettingsResponse));
    }
  };

  const getSearchOptions = async () => {
    const searchOptionsRes = await searchBillItem(searchQuery);
    const data = [];
    searchOptionsRes?.map((e) => {
      return data.push({
        key: JSON.stringify({ ...e }),
        value: e.id,
        label: <div>{e.name}</div>,
      });
    });
    searchQuery &&
      data.push({
        key: JSON.stringify({
          change: 1,
          name: searchQuery,
        }),
        value: searchQuery,
        label: (
          <>
            <div>
              {searchQuery}
              <i className="icon-Add mx-1 text-primary fs-6" />{" "}
              <a className="fw-medium text-decoration-underline text-primary">
                {" "}
                Add Custom
              </a>
            </div>
          </>
        ),
        isCustom: true,
      });
    setSearchOptions(data);
  };
  const handleInputChange = (value, index, column) => {
    const updatedData = dataSource.map((row, i) =>
      i === index ? { ...row, [column]: value } : row
    );
    setDataSource(updatedData);
  };

  const handleAddRow = (updatedData = dataSource) => {
    const newRow = {
      masterId: "",
      name: "",
      quantity: "",
      amount: "",
      discount: "",
      discountType: "",
      gst: "",
      totalAmount: "",
      createdBy: "",
    };
    setDataSource([...updatedData, newRow]);
    setSearchQuery("");
  };

  const handleDeleteRow = (index) => {
    const updatedData = dataSource.filter((_, i) => i !== index);
    setDataSource(updatedData);
  };

  const onSelect = (value, option, index) => {
    const selectedData = option?.key && JSON.parse(option.key);
    if (option?.isCustom) {
      setSearchItemSelected({
        ...selectedData,
        isCustom: option.isCustom,
        index: index,
      });
    } else if (option) {
      const updatedData = dataSource.map((row, idx) =>
        index === idx
          ? {
              ...row,
              masterId: selectedData.id,
              quantity: 1,
              name: selectedData.name,
              amount: selectedData.price,
              discount: selectedData.discount,
              discountType: selectedData.discountType,
              type: selectedData.type,
              gst: selectedData.gst,
              totalAmount: selectedData.totalAmount,
              createdBy: selectedData.createdBy,
            }
          : row
      );
      setDataSource(updatedData);
      setSearchQuery(selectedData.name);
      if (index === dataSource?.length - 1) {
        handleAddRow(updatedData);
      }
    } else {
      console.log("directly add the entry to the table");
    }
  };

  const onSearch = useCallback(
    (query) => {
      setSearchQuery(removeBeforeWhiteSpace(query));
    },
    [searchQuery]
  );

  const columns = [
    {
      title: "ITEMS",
      dataIndex: "name",
      width: "27%",
      render: (_, record, index) => (
        <>
          <AutoComplete
            value={record.name}
            onSearch={onSearch}
            options={searchOptions}
            onSelect={(value, option) => onSelect(value, option, index)}
            className="autocomplete-custom w-100"
            defaultActiveFirstOption={true}
          >
            <Input
              placeholder="Search & add new item"
              style={{ border: "none" }}
              onChange={(e) => handleInputChange(e.target.value, index, "name")}
              value={record.name}
            />
          </AutoComplete>
          {dataSource[index]?.totalAmount > 0 &&
            (userId === dataSource[index]?.createdBy ||
              tokenData?.admin === 1) && (
              <i
                className="icon-Edit fs-6 d-flex justify-content-end"
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
                }}
                onClick={() => {
                  setEditIndex(index);
                  setSearchItemSelected(dataSource[index]);
                }}
              />
            )}
        </>
      ),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      width: "11%",
      render: (_, record, index) => (
        <Input
          value={record.quantity}
          onChange={(e) =>
            handleInputChange(
              e.target.value.replace(/[^0-9]/g, ""),
              index,
              "quantity"
            )
          }
          bordered={false}
          type="number"
        />
      ),
    },
    {
      title: "PRICE PER UNIT",
      dataIndex: "amount",
      width: "13%",
      render: (_, record, index) => (
        <Input
          value={record.amount}
          onChange={(e) =>
            handleInputChange(
              onlyDecimalFormat(e.target.value),
              index,
              "amount"
            )
          }
          prefix="₹"
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "DISCOUNT",
      dataIndex: "discount",
      width: "15%",
      render: (_, record, index) => (
        <>
          <Input
            value={
              record.discount !== undefined && record.discount !== null
                ? `${record.discountType === "flat" ? "₹ " : ""}${
                    record.discount
                  }${record.discountType === "flat" ? "" : " %"}`
                : ""
            }
            inputMode="decimal"
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^\d.]/g, "");
              handleInputChange(numericValue, index, "discount");
            }}
            bordered={false}
          />
          <div
            style={{
              position: "absolute",
              right: "18px",
              bottom: "18px",
              zIndex: 10,
            }}
          >
            <Radio.Group
              value={record.discountType}
              style={{ display: "flex", width: "60px" }}
              onChange={(e) =>
                handleInputChange(e.target.value, index, "discountType")
              }
            >
              <Radio.Button
                value={"percentage"}
                style={{
                  width: "50%",
                  height: "23px",
                }}
                className="custom-radio-button d-flex align-items-center justify-content-center"
              >
                %
              </Radio.Button>
              <Radio.Button
                value={"flat"}
                style={{
                  width: "50%",
                  height: "23px",
                }}
                className="custom-radio-button  d-flex align-items-center justify-content-center"
              >
                ₹
              </Radio.Button>
            </Radio.Group>
          </div>
        </>
      ),
    },
    {
      title: "GST (%)",
      dataIndex: "gst",
      width: "11%",
      render: (_, record, index) => (
        <Input
          value={record.gst}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          onChange={(e) => {
            const value = onlyDecimalFormat(e.target.value);
            handleInputChange(value <= 100 ? value : record.gst, index, "gst");
          }}
          suffix="%"
          bordered={false}
          style={{ textAlign: "center" }}
        />
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      width: "13%",
      render: (_, record, index) => (
        <Input
          value={record.totalAmount}
          onChange={(e) =>
            handleInputChange(
              e.target.value.replace(/[^0-9]/g, ""),
              index,
              "totalAmount"
            )
          }
          prefix="₹"
          bordered={false}
          style={{ textAlign: "center" }}
          disabled={true}
        />
      ),
      onCell: () => ({
        style: {
          backgroundColor: "#FAFAFB",
        },
      }),
    },
    {
      title: "ACTION",
      dataIndex: "action",
      width: "10%",
      render: (_, record, index) => (
        <>
          {dataSource?.length > 1 && (
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={() => handleDeleteRow(index)}
            >
              <i className="icon-delete" style={{ color: "#454551" }} />
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleModeChange = (value, index, type) => {
    const updatedModes = [...paymentModes];
    updatedModes[index][type] = value;
    setPaymentModes(updatedModes);
  };

  const handleAmountChange = (value, index) => {
    if (value <= 1000000000) {
      const updatedModes = [...paymentModes];
      updatedModes[index].amount = onlyDecimalFormat(value);
      setPaymentModes(updatedModes);
    }
  };

  const addPaymentMode = () => {
    setPaymentModes([...paymentModes, { paymentMode: undefined, amount: 0 }]);
  };

  const removePaymentMode = (index) => {
    const updatedModes = paymentModes.filter((_, i) => i !== index);
    setPaymentModes(updatedModes);
  };

  const handleDrawerDiagnosisNotes = () => {
    setBillNotesDrawer(!billNotesDrawer);
  };

  const handleDrawerPreviewBill = () => {
    setPreviewBillDrawer(!previewBillDrawer);
  };

  const handleCreateBill = async (type) => {
    const updatedDataSource = dataSource.filter((item) => {
      const { masterId, name, quantity, amount, totalAmount } = item;
      return masterId && name && quantity && amount && totalAmount;
    });
    const payload = {
      patientId: patientData?.patient_unique_id,
      doctorId: userId,
      billItems: updatedDataSource,
      paymentModes: paymentModes,
      subTotal: subTotal,
      lineItemDiscount: lineItemDiscount,
      extraDiscount: extraDiscount || 0,
      extraDiscountType: extraDiscountType,
      applicableGst: applicableGst,
      payableAmount: payableAmount,
      paidAmount: paidAmount,
      includeInRx: includeInRx,
      isForm3C: shouldAddBillTo3C,
      date: moment().format("YYYY-MM-DD"),
      notes: patientBillNotes,
      dueFromPreviousBill: patientDueAmount,
      appointmentId: pam_id || patientData?.pam_id,
    };
    const createRes = await createBill(payload);
    if (createRes?.id) {
      message.open({
        key: MESSAGE_KEY,
        type: "",
        className: "message-appointment",
        content: (
          <div className="d-flex align-items-center">
            <img src={visitEnd} className="me-3" />
            <div>
              <div className="title-common text-start fontroboto">
                {`${patientData?.pm_fullname}’s new bill saved successfully`}
              </div>
            </div>
            <img
              src={imgCloseVisit}
              className="ms-3"
              onClick={() => message.destroy()}
            />
          </div>
        ),
        duration: 3,
      });
      setBillData(createRes);
      if (type === "exit") {
        handleCreateBillDrawer();
      } else if (type === "preview") {
        handleDrawerPreviewBill();
      } else {
        const blob = await pdf(
          <ViewBillPdf
            printSettings={billPrintSettings}
            patientData={patientData}
            profile={profile}
            billData={createRes}
          />
        ).toBlob();
        printContent(blob, patientData.patient_unique_id, setStartLoader);
        handleCreateBillDrawer();
      }
    }
  };

  const setStartLoader = () => {
    dispatch(setLoadingStatus(true));
  };

  useEffect(() => {
    const checkInFireBase = async () => {
      if (deviceUid) {
        const docCapturedImage = doc(db, "billing", deviceUid);
        try {
          const docCapturedImageSnap = await getDoc(docCapturedImage);
          if (docCapturedImageSnap.exists()) {
            onSnapshot(
              doc(db, "billing", deviceUid),
              async (docSnapshotOfCapturedImage) => {
                const res = docSnapshotOfCapturedImage?.data();
                if (res?.clicked === "no") {
                  dispatch(setLoadingStatus(false));
                  deleteDoc(doc(db, "billing", deviceUid));
                  deleteDocsUploadedFromAndroid(patientData?.patient_unique_id);
                }
              }
            );
          }
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else {
        console.error("Device UID not found");
      }
    };

    return () => checkInFireBase();
  }, [db, deviceUid]);

  // Patient search related logic
  const onSearchName = useCallback(
    (query) => {
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

  const onSelectPatient = (patient) => {
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

  const PatientPlank = (patient) => {
    return (
      <>
        <div className="d-flex align-items-center justify-content-between">
          <div
            className="d-flex align-items-center"
            onClick={() => {
              setAutoCompleteFlagMobile(false);
              setAutoCompleteFlagName(false);
              onSelectPatient(patient);
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

  return (
    <div>
      <Navbar className="headerprescription p-0">
        <Container fluid className="h-100 gx-0 w-100">
          <Row className="h-100 align-items-center w-100 justify-content-between">
            <Col sm="auto" md="auto" lg="auto" className="h-100 w-auto">
              <div className="align-items-center d-flex h-100 gap-2">
                <div className="border-end h-100 text-center">
                  <div
                    onClick={handleCreateBillDrawer}
                    className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                  >
                    <i className="icon-right" />
                  </div>
                  <CommonModal
                    isModalOpen={isBackModalOpen}
                    onCancel={showHideBackModal}
                    modalWidth={500}
                    title={"You may lose your data"}
                    modalBody={
                      <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                          <div className="d-flex align-items-center">
                            <img
                              className="me-3"
                              src={alertIcon}
                              alt="Warning"
                            />
                            <span>
                              Are you sure you want to leave? <br />
                              You will permanently lose your data.
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="d-flex align-items-center mt-2 justify-content-end">
                            <div
                              onClick={handleCreateBillDrawer}
                              className="me-4 text-decoration-underline btn p-0 text-main"
                            >
                              Yes Leave
                            </div>
                            <Button
                              onClick={showHideBackModal}
                              className="lh-lg btn btn-primary3 btn-41 px-4"
                            >
                              <span>No, Stay</span>
                            </Button>
                          </div>
                        </div>
                      </>
                    }
                  />
                </div>
                <span className="title-digitise-card">Create Bill</span>
              </div>
            </Col>
            <Col sm="auto" md="auto" lg="auto" className="h-100  w-auto">
              <div className="align-items-center d-flex h-100 gap-4">
                <div>
                  <Checkbox
                    className="me-2"
                    checked={shouldAddBillTo3C}
                    onChange={(e) => setAddBillTo3C(e.target.checked)}
                  />
                  Add bill for Form 3C
                </div>
                {!isDashboard && (
                  <div>
                    <Checkbox
                      className="me-2"
                      checked={includeInRx}
                      onChange={(e) => setIncludeInRx(e.target.checked)}
                    />
                    Include in RX
                  </div>
                )}

                {isRxPage ? (
                  <>
                    <Button
                      type="button"
                      className="btn-41 btn px-4 ant-btn-text btn-input align-items-center d-flex"
                      onClick={() => {
                        handleCreateBill("exit");
                      }}
                      disabled={disableSaveBtn}
                    >
                      Save & Exit
                    </Button>

                    <Button
                      className="btn btn-primary3 btn-41 px-4 me-20"
                      onClick={handleCreateBill}
                      disabled={disableSaveBtn}
                    >
                      Save & Print
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      className="btn-41 btn px-4 ant-btn-text btn-input align-items-center d-flex"
                      onClick={handleCreateBill}
                      disabled={disableSaveBtn}
                    >
                      Save & Print
                    </Button>

                    <Button
                      className="btn btn-primary3 btn-41 px-4 me-20"
                      onClick={() => {
                        handleCreateBill("preview");
                      }}
                      disabled={disableSaveBtn}
                    >
                      Save & Preview
                    </Button>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <div className="scrollableContainer">
        <Row className="h-100 align-items-start w-100">
          <Col
            className="h-100"
            style={{
              flex: "0 0 70%",
              maxWidth: "70%",
              overflowY: "auto",
              height: "100%",
              paddingRight: 0,
            }}
          >
            <div className="d-flex flex-column h-100 gap-2 px-3 py-4">
              <div className="d-flex gap-3">
                <div>
                  <div>Patient Name & ID</div>
                  {/* <Input
                    className="text-main"
                    style={{ width: 230 }}
                    value={patientNameAndId}
                    placeholder="Search by patient name / ID"
                    onChange={(e) => setPatientNameAndId(e.target.value)}
                    disabled={!isDashboard}
                  /> */}
                  {isEditingName &&
                  (!patientData || Object.keys(patientData).length === 0) ? (
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
                        Object.keys(patientData).length > 0
                          ? patientData?.pm_fullname
                          : patientDetails
                          ? patientDetails?.patientName
                          : ""
                      }
                      disabled={Object.keys(patientData).length > 0}
                      // readOnly={patientData}
                      className="patient-input"
                      onClick={() => {
                        setIsEditingName(true);
                      }}
                    />
                  )}
                </div>
                <div>
                  <div>Mobile Number</div>
                  {/* <Input
                    className="text-main"
                    style={{ width: 130 }}
                    value={mobileNumber}
                    placeholder="Search number"
                    onInput={(e) => {
                      setMobileNumber(e.target.value.replace(/[^0-9]/g, ""));
                    }}
                    disabled={!isDashboard}
                  /> */}
                  {isEditingMobile &&
                  (!patientData || Object.keys(patientData).length === 0) ? (
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
                        Object.keys(patientData).length > 0
                          ? patientData?.pm_contact_no
                          : patientDetails
                          ? patientDetails.mobileNumber
                          : ""
                      }
                      disabled={Object.keys(patientData).length > 0}
                      // readOnly
                      className="patient-input"
                      onClick={() => setIsEditingMobile(true)} // Switch to editing mode
                    />
                  )}
                </div>
                <div>
                  <div>Bill Date</div>
                  <Input
                    className="text-main"
                    style={{ width: 125 }}
                    value={moment().format("DD-MM-YYYY")}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
                <div>
                  <div>Doctor Name</div>
                  <Input
                    className="text-main"
                    value={profile?.um_name}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    disabled={true}
                  />
                </div>
              </div>
              <Divider />
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowKey="key"
                bordered
                className="customize-table"
              />
              <div>
                <Button
                  type="button"
                  className="btn-41 btn px-4 ant-btn-text btn-input align-items-center d-flex"
                  onClick={handleAddRow}
                  icon={<PlusOutlined />}
                  style={{ marginTop: 16, width: "fit-content" }}
                >
                  <span>Add Another Service</span>
                </Button>
              </div>
            </div>
          </Col>
          <Col
            className="h-100 py-4"
            style={{
              flex: "0 0 30%",
              maxWidth: "30%",
              overflowY: "auto",
              height: "100%",
              backgroundColor: "rgba(241, 241, 245, 0.5)",
            }}
          >
            <div className="d-flex gap-2">
              <div>
                <div className="text-lg font-medium mb-2">
                  Paid Amount <span className="lab-params-warning">*</span>
                </div>
                {paymentModes.map((payment, index) => (
                  <div key={index} className="relative">
                    {index > 0 && (
                      <div className="flex items-center gap-2 mb-2 relative">
                        <span className="text-gray-500 text-sm font-medium z-10 bg-white px-2">
                          And
                        </span>
                        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                      </div>
                    )}
                    <div className="flex align-items-center gap-4 mb-3">
                      <div className="d-flex align-items-center gap-1">
                        <div
                          className="d-flex flex-column"
                          style={{
                            background: "rgba(75, 74, 213, 0.06)",
                            borderRadius: 10,
                          }}
                        >
                          <div
                            className="d-flex"
                            style={{
                              border: disableSaveBtn ? "solid 1px red" : "",
                              borderRadius: disableSaveBtn ? 10 : "",
                            }}
                          >
                            <Select
                              placeholder="Select"
                              value={payment.paymentMode}
                              onChange={(value) =>
                                handleModeChange(value, index, "paymentMode")
                              }
                              className="payment-mode"
                              dropdownStyle={{ width: 180 }}
                              options={filteredOptions}
                            />
                            <Input
                              inputMode="numeric"
                              prefix="₹"
                              value={payment.amount}
                              onChange={(e) =>
                                handleAmountChange(e.target.value, index)
                              }
                              className="w-40 payment-input"
                            />
                          </div>
                          {payment?.paymentMode &&
                            payment.paymentMode !== "Cash" && (
                              <span
                                style={{
                                  textAlign: payment?.refId ? "" : "center",
                                  textDecoration: payment?.refId
                                    ? "none"
                                    : "underline",
                                  borderRadius: "0 0 10px 10px",
                                  minHeight: 25,
                                  cursor: "pointer",
                                  wordBreak: "break-word",
                                }}
                                onClick={() => setShowRefIdPopup(index)}
                              >
                                {payment?.refId ? (
                                  <div className="d-flex align-items-center justify-content-between px-2">
                                    <span>Ref ID: {payment?.refId}</span>
                                    <span className="icon-Edit fs-18" />
                                  </div>
                                ) : (
                                  <span className="show-more-link">
                                    {`Add ${payment.paymentMode} Ref ID`}
                                  </span>
                                )}
                              </span>
                            )}
                        </div>
                        {paymentModes.length > 1 && (
                          <Button
                            className="btn btn-delete-prescription p-2 d-flex align-items-center justify-content-center"
                            onClick={() => removePaymentMode(index)}
                          >
                            <i
                              className="icon-delete"
                              style={{ color: "#454551" }}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {disableSaveBtn && (
                  <div className="d-flex align-items-start gap-2">
                    <span className="icon-info fs-18 mt-1 bdg-danger" />
                    <span className="bdg-danger">
                      The sum of paid amount cannot exceed the total payable
                      amount
                    </span>
                  </div>
                )}
                {paymentModes.length < 4 && (
                  <div className="flex align-items-center gap-2">
                    <button
                      className="btn d-flex align-items-center btn-text"
                      onClick={addPaymentMode}
                    >
                      <i className={`icon-Add me-1 fs-5 text-primary`} />
                      <span className="text-primary">Payment mode</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Divider />
            <div
              className="d-flex flex-column gap-3"
              style={{ background: "white", borderRadius: 16, padding: 14 }}
            >
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Line Item Discount:</span>
                <span className="tick-icon">-₹{lineItemDiscount}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Applicable GST:</span>
                <span>₹{applicableGst}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Extra Discount:</span>
                <div style={{ position: "relative", width: "50%" }}>
                  <Input
                    value={extraDiscount}
                    onChange={(e) => {
                      const value = onlyDecimalFormat(e.target.value);
                      setExtraDiscount(value);
                    }}
                    prefix={extraDiscountType === "flat" ? "₹" : "%"}
                    style={{
                      textAlign: "center",
                      width: "100%",
                      height: "38px",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "6px",
                      bottom: "8px",
                      zIndex: 10,
                    }}
                  >
                    <Radio.Group
                      value={extraDiscountType}
                      style={{ display: "flex", width: "60px" }}
                      onChange={(e) => setExtraDiscountType(e.target.value)}
                    >
                      <Radio.Button
                        value={"percentage"}
                        style={{
                          width: "50%",
                          height: "23px",
                        }}
                        className="custom-radio-button d-flex align-items-center justify-content-center"
                      >
                        %
                      </Radio.Button>
                      <Radio.Button
                        value={"flat"}
                        style={{
                          width: "50%",
                          height: "23px",
                        }}
                        className="custom-radio-button  d-flex align-items-center justify-content-center"
                      >
                        ₹
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              {patientDueAmount > 0 && (
                <div className="d-flex justify-content-between">
                  <span>Due from Previous bill:</span>
                  <span className="text-scheduled">
                    ₹{patientDueAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <Divider style={{ margin: 0 }} />
              <div className="d-flex justify-content-between">
                <span style={{ fontWeight: 600 }}>Total Payable Amount:</span>
                <span style={{ fontWeight: 600 }}>₹{payableAmount}</span>
              </div>
              <Divider style={{ margin: 0 }} />
              {paymentModes?.map((payment, index) => {
                return (
                  <div key={index} className="d-flex justify-content-between">
                    <span>Paid Via "{payment.paymentMode}":</span>
                    <span>₹{payment.amount}</span>
                  </div>
                );
              })}
              <Divider style={{ margin: 0 }} />
              <div className="d-flex justify-content-between">
                <span className="tick-icon" style={{ fontWeight: 500 }}>
                  Total Amount Paid:
                </span>
                <span className="tick-icon" style={{ fontWeight: 500 }}>
                  ₹{paidAmount}
                </span>
              </div>
              {payableAmount - paidAmount > 0 && (
                <div className="d-flex justify-content-between">
                  <span className="text-scheduled" style={{ fontWeight: 500 }}>
                    Total Payment Due:
                  </span>
                  <span className="text-scheduled" style={{ fontWeight: 500 }}>
                    ₹{(Number(payableAmount) - Number(paidAmount)).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {patientBillNotes?.length === 0 ? (
              <button
                className="btn d-flex align-items-center btn-text"
                style={{
                  color: "#4B4AD5",
                  fontWeight: "500",
                  padding: "25px 0px 40px",
                }}
                onClick={handleDrawerDiagnosisNotes}
              >
                <i className={`icon-Add me-1 fs-5`} /> Add Notes
              </button>
            ) : (
              <div
                className="d-flex justify-content-between"
                style={{ padding: "25px 0px 25px 14px" }}
              >
                <div className="d-flex gap-1">
                  <span style={{ fontWeight: "600" }}>Notes: </span>
                  <ReadMore text={patientBillNotes} textLimit={60} />
                </div>
                <div onClick={handleDrawerDiagnosisNotes}>
                  <i className="icon-Edit text-primary fs-16 cursor-pointer" />
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
      {(searchItemSelected?.isCustom || editIndex > -1) && (
        <ServiceItemPopup
          onCancel={() => {
            setSearchItemSelected(null);
            setEditIndex(-1);
          }}
          editIndex={editIndex}
          item={searchItemSelected}
          setDataSource={setDataSource}
        />
      )}
      {shouldShowRefIdPopup !== null && shouldShowRefIdPopup >= 0 && (
        <RefIdPopup
          index={shouldShowRefIdPopup}
          refId={paymentModes[shouldShowRefIdPopup]?.refId}
          showHideModal={() => setShowRefIdPopup(-1)}
          handleModeChange={handleModeChange}
        />
      )}
      {billNotesDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerDiagnosisNotes}
          open={billNotesDrawer}
          className="modalWidth-563"
          width="auto"
          push={false}
        >
          <DiagnosisNotes
            handleDrawerDiagnosisNotes={handleDrawerDiagnosisNotes}
            diagnosisNotes={patientBillNotes}
            setDiagnosisNotes={setPatientBillNotes}
            isDiagnosis={false}
          />
        </Drawer>
      )}
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
            handleDrawerPreviewBill={handleDrawerPreviewBill}
            handleCreateBillDrawer={handleCreateBillDrawer}
            patientData={patientData}
            billData={billData}
          />
        </Drawer>
      )}
    </div>
  );
};

export default React.memo(CreateBill);
