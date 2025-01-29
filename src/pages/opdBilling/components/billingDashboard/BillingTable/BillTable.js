import { Drawer, Dropdown, Table } from "antd";
import moment from "moment";
import { useState } from "react";
import PreviewBill from "../../../PreviewBill";
import RefundBill from "../RefundBill/RefundBill";

const BillTable = ({ data, isPatientScreen }) => {
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
      handleRefundBillDrawer();
    } else {
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
    !isPatientScreen
      ? {
          title: "PATIENT DETAILS",
          dataIndex: "patient_details",
          key: "patient_details",
          ellipsis: true,
          render: (text, record) => (
            <div className="cursor-pointer" onClick={async () => {}}>
              <div className="fs-14">{record.patientName}</div>
              <div className="fs-14 fw-normal text-truncate-twolines">
                {record.patientPhone}
              </div>
            </div>
          ),
        }
      : undefined,
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
            case "carriedforward":
              return {
                className: "status-carriedforrward",
                displayText: `Due ₹${record.dueAmount}`,
              };
            default:
              return {
                className: "status-due",
                displayText: `Due: ₹${record.dueAmount}`,
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
  ]?.filter((item) => item);

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
          <div onClick={() => onBillingDetailsClick(2, record)}>Refund bill</div>
        ),
        key: "refund_bill",
      },
    ];
  
    // Conditionally add "Add to Form 3C" if isForm3C is false
    if (!record.isForm3C) {
      items.push({
        label: (
          <div onClick={() => onBillingDetailsClick(3, record)}>
            Add to Form 3C
          </div>
        ),
        key: "add_to_3c",
      });
    }
  
    return items;
  };
  
  return (
    <>
      <Table
        className="billing-table px-0"
        columns={columns}
        width="100%"
        dataSource={data}
        pagination={false}
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
          width="50%"
        >
          <RefundBill
            handleRefundBillDrawer={handleRefundBillDrawer}
            billData={billData}
          />
        </Drawer>
      )}
    </>
  );
};

export default BillTable;
