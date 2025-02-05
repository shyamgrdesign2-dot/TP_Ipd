import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Table,
  Tooltip,
  AutoComplete,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import "./RefundBill.scss";

import { useSelector, useDispatch } from "react-redux";
import { fetchPatientWalletBalance, processBillRefund } from "../../../service";
import imgCloseVisit from "../../../../../assets/images/close-visit.svg";
import visitEnd from "../../../../../assets/images/end-visit.svg";
import { MESSAGE_KEY } from "../../../../../utils/constants";
import { PaymentOptions } from "../../../utils/constants";
import { formatDateWithOrdinal } from "../../../utils/helper";
import RefIdPopup from "../../refIdPopup/RefIdPopup";
import {
  onlyDecimalFormat,
  removeBeforeWhiteSpace,
} from "../../../../../utils/utils";

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM, YY";
const { TextArea } = Input;

function RefundBill({
  handleRefundBillDrawer,
  billData,
  handleMessageForm3c,
  getPatientBills,
}) {
  const scrollContainerRef = useRef(null);
  const inputRef = useRef([]);
  const dispatch = useDispatch();
  const [dateString, setDateString] = useState(null);
  const [shouldShowRefIdPopup, setShowRefIdPopup] = useState(-1);
  const [totalRefundAmount, setTotalRefundAmount] = useState(0);
  const [patientWalletBalance, setPatientWalletBalance] = useState(0);
  const [paymentModes, setPaymentModes] = useState([
    { paymentMode: "Cash", amount: billData?.paidAmount, refId: "" },
  ]);
  const usedPaymentModes = paymentModes.map((p) => p.paymentMode);

  const filteredOptions = PaymentOptions.filter(
    (option) =>
      !usedPaymentModes.includes(option.value) &&
      (option.value !== "Advance Deposit" || patientWalletBalance > 0)
  );

  const getPatientWalletBalance = async (patientUniqueId) => {
    const patientWalletBalanceRes = await fetchPatientWalletBalance(
      patientUniqueId
    );
    if (patientWalletBalanceRes?.advanceDepositBalance) {
      setPatientWalletBalance(patientWalletBalanceRes?.advanceDepositBalance);
    }
  };

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

  // Calculate total refund whenever paymentModes change
  useEffect(() => {
    const total = paymentModes.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
    setTotalRefundAmount(total);
  }, [paymentModes]);

  const handleRefundBill = async () => {
    const updatedPaymentModes = paymentModes?.filter(
      (item) => item.paymentMode && item.amount > 0
    );
    if (updatedPaymentModes?.length !== paymentModes?.length) {
      message.error("Payment mode and amount cannot be empty.");
      return;
    }
    if (totalRefundAmount !== billData?.paidAmount) {
      message.error(
        "You can't do partial refund OR Refund amount should be equal to Total Paid Amount"
      );
      return;
    }

    try {
      const payload = {
        billId: billData.id,
        paymentModes: [...paymentModes],
      };
      const response = await processBillRefund(payload);
      if (response.status === 204) {
        message.open({
          key: MESSAGE_KEY,
          type: "",
          className: "message-appointment",
          content: (
            <div className="d-flex align-items-center">
              <img src={visitEnd} className="me-3" />
              <div>
                <div className="title-common text-start fontroboto">{`${totalRefundAmount} is refunded`}</div>
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
        handleRefundBillDrawer();
        handleMessageForm3c();
      } else {
        throw new Error(response.error || "Failed to refund the bill.");
      }
    } catch (e) {
      message.error(e);
    }
  };

  const addPaymentMode = () => {
    setPaymentModes([...paymentModes, { paymentMode: undefined, amount: 0 }]);
  };

  const removePaymentMode = (index) => {
    const updatedModes = paymentModes.filter((_, i) => i !== index);
    setPaymentModes(updatedModes);
  };

  const columns = [
    {
      title: "BILL NO & DATE",
      dataIndex: "bill_num_date",
      key: "bill_num_date",
      render: (text, record) => (
        <div className="cursor-pointer" onClick={async () => {}}>
          <div className="fs-14 fw-semibold theme-color">
            {record?.billNumber}
          </div>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {formatDateWithOrdinal(record?.date)}
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
      onFilter: (value, record) => record.send_on.startsWith(value),
      render: (text, record) => <div> {record?.payableAmount} </div>,
    },
    {
      title: "PAID AMOUNT",
      dataIndex: "paid_Amount",
      key: "paid_Amount",
      ellipsis: true,
      render: (text, record) => <div> {record?.paidAmount} </div>,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
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
                displayText: `Due: ₹${record?.dueAmount}`,
              };
            case "carriedforward":
              return {
                className: "status-refunded",
                displayText: `Due ₹${record?.dueAmount}`,
              };
            default:
              return {
                className: "due",
                displayText: `Due: ₹${record?.dueAmount}`,
              };
          }
        };

        // Get status details
        const { className, displayText } = getStatusDetails(
          record?.paymentStatus
        );

        return <div className={className}>{displayText}</div>;
      },
    },
  ];

  return (
    <>
      <Card bordered={false} className="search-modalCard refund-bill-wrapper">
        <div className="modalCard-header h-60 align-items-center justify-content-between d-flex">
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={handleRefundBillDrawer}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">Refund Bill</div>
          </div>
          <Button
            className="btn btn-primary3 btn-41 px-4 me-20"
            onClick={handleRefundBill}
          >
            Refund
          </Button>
        </div>
        <div
          className="billing-table-wrapper align-items-center d-flex justify-content-between mx-4 mt-4 "
          style={{
            border: "1px solid var(--T-Text-10, #E2E2EA)",
            borderRadius: "10px",
          }}
        >
          <Table
            className="billing-table px-0"
            columns={columns}
            width="100%"
            dataSource={[billData]}
            pagination={false}
          />
        </div>
        <div className="payment-methods-container">
          <div className="d-flex gap-2 mx-4 my-2 p-2">
            <div style={{ padding: "16px 16px 0px 0px" }}>
              <div className="text-lg font-medium mb-2">
                Paid Amount <span className="color-red">*</span>
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
                          // style={{
                          //   border: disableSaveBtn ? "solid 1px red" : "",
                          //   borderRadius: disableSaveBtn ? 10 : "",
                          // }}
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
                    {paymentModes.length > 1 && (
                      <Button
                        className="btn btn-delete-prescription p-0"
                        onClick={() => removePaymentMode(index)}
                      >
                        <i
                          className="icon-delete"
                          style={{ color: "#454551", marginLeft: 10 }}
                        />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
        </div>

        <div className="mx-4 my-2 p-2 refund-info h-50">
          <span className="color-red fw-semibold">
            {totalRefundAmount ? totalRefundAmount : 0}
          </span>
           will be Refunded to the patient
        </div>

        <button
          className="btn-refund-bill mx-4 p-2 h-50"
          onClick={handleRefundBill}
        >
          Refund the Bill
        </button>

        {shouldShowRefIdPopup !== null && shouldShowRefIdPopup >= 0 && (
          <RefIdPopup
            index={shouldShowRefIdPopup}
            refId={paymentModes[shouldShowRefIdPopup]?.refId}
            showHideModal={() => setShowRefIdPopup(-1)}
            handleModeChange={handleModeChange}
          />
        )}
      </Card>
    </>
  );
}

export default React.memo(RefundBill);
