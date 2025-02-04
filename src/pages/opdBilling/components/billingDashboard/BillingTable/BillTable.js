import { Drawer, Dropdown, Table, message } from "antd";
import { useState } from "react";
import PreviewBill from "../../../PreviewBill";
import RefundBill from "../RefundBill/RefundBill";
import { addBillsToForm3C } from "../../../service";
import imgCloseVisit from "../../../../../assets/images/close-visit.svg";
import visitEnd from "../../../../../assets/images/end-visit.svg";
import { MESSAGE_KEY } from "../../../../../utils/constants";
import { formatDateWithOrdinal } from "../../../utils/helper";
import InfoTooltip from "./InfoToolTip/InfoTooltip";

const BillTable = ({
  data,
  isPatientScreen,
  handleMessageForm3c,
  onSortChange,
  getPatientBills,
}) => {
  const [refundBillDrawer, setRefundBillDrawer] = useState(false);
  const [previewBillDrawer, setPreviewBillDrawer] = useState(false);
  const [billData, setBillData] = useState(null);

  const handleDrawerPreviewBill = () => {
    setPreviewBillDrawer(!previewBillDrawer);
  };

  const onBillingDetailsClick = async (status, record) => {
    setBillData(record);
    if (status === 1) {
      handleDrawerPreviewBill();
    } else if (status === 2) {
      handleRefundBillDrawer(record);
    } else if (status === 3) {
      try {
        const payload = { billIds: [record.id] }; // Adjust payload as needed
        const response = await addBillsToForm3C(payload);
        if (response.status === 204) {
          message.open({
            key: MESSAGE_KEY,
            type: "",
            className: "message-appointment",
            content: (
              <div className="d-flex align-items-center">
                <img src={visitEnd} className="me-3" />
                <div>
                  <div className="title-common text-start fontroboto">{`${record.billNumber} Added to Form 3C`}</div>
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

          handleMessageForm3c();
        } else {
          console.error("Failed to add bill to Form 3C");
        }
      } catch (error) {
        console.error("Error in adding bill to Form 3C:", error);
      }
    }
  };

  // Drawer form 3c
  const handleRefundBillDrawer = () => {
    setRefundBillDrawer(!refundBillDrawer);
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
      dataIndex: "date",
      key: "date",
      width: 200,
      sorter: true,
      render: (text, record) => (
        <div className="cursor-pointer" onClick={async () => {}}>
          <div className="fs-14 fw-semibold">
            <a className="theme-color">{record.billNumber}</a>
          </div>
          <div className="fs-14 fw-normal text-truncate-twolines">
            {formatDateWithOrdinal(record.date)}
          </div>
        </div>
      ),
    },
    !isPatientScreen
      ? {
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
        }
      : undefined,
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      ellipsis: true,
      sorter: true,
      onFilter: (value, record) => record.send_on.startsWith(value),
      render: (text, record) => <div> {record.total_amount} </div>,
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
                displayText: `Due: ₹${parseFloat(record.dueAmount).toFixed(2)}`,
              };
            case "refunded":
              return {
                className: "status-refunded",
                displayText: `Refunded ₹${parseFloat(record.paidAmount).toFixed(
                  2
                )}`,
              };
            case "carriedforward":
              return {
                className: "status-carriedforrward",
                displayText: `Due ₹${parseFloat(record.dueAmount).toFixed(2)}`,
              };
            default:
              return {
                className: "status-due",
                displayText: `Due: ₹${parseFloat(record.dueAmount).toFixed(2)}`,
              };
          }
        };

        // Get status details
        const { className, displayText } = getStatusDetails(record.status);

        return (
          <div className="d-flex">
            <div className={className}>{displayText}</div>
            {["CarriedForward", "Refunded"].includes(record.paymentStatus) && (
              <InfoTooltip
                type={record.paymentStatus}
                amount={
                  record.paymentStatus === "Refunded"
                    ? record.paidAmount
                    : record.dueAmount
                }
                notes={record.notes}
                billNo={record.billNumber}
              />
            )}
          </div>
        );
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
  ]?.filter((item) => item);

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      const order = sorter.order === "ascend" ? "asc" : "desc"; // Convert to API format
      const field = sorter.field; // Get sorted field

      // Pass sorting parameters to parent
      onSortChange(field, order);
    }
  };

  const getMenuItems = (record) => {
    const items = [
      {
        label: (
          <div onClick={() => onBillingDetailsClick(1, record)}>View bill</div>
        ),
        key: "view_bill",
      },
    ];

    // Conditionally add "Add to Form 3C" if isForm3C is false
    if (!record.isForm3C && record.paymentStatus !== "Refunded") {
      items.push({
        label: (
          <div onClick={() => onBillingDetailsClick(3, record)}>
            Add to Form 3C
          </div>
        ),
        key: "add_to_3c",
      });
    }

    // Conditionally add "Add to Form 3C" if isForm3C is false
    if (record.paymentStatus !== "Refunded") {
      items.push({
        label: (
          <div onClick={() => onBillingDetailsClick(2, record)}>
            Refund Bill
          </div>
        ),
        key: "refund_bill",
      });
    }

    return items;
  };

  return (
    <>
      <Table
        className="billing-table px-0"
        style={{ position: "relative" }}
        columns={columns}
        width="100%"
        dataSource={data}
        pagination={false}
        scroll={{ y: 300 }}
        onChange={handleTableChange} // Send sorting data to parent
      />
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
            billData={billData}
          />
        </Drawer>
      )}

      {refundBillDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleRefundBillDrawer}
          open={refundBillDrawer}
          width="56%"
        >
          <RefundBill
            handleRefundBillDrawer={handleRefundBillDrawer}
            billData={billData}
            handleMessageForm3c={handleMessageForm3c}
          />
        </Drawer>
      )}
    </>
  );
};

export default BillTable;
