import { Drawer, Dropdown, Table } from "antd";
import moment from "moment";
import { useState } from "react";
import PreviewBill from "../../../PreviewBill";

const patient_data = {
  pm_salutation: "Mr",
  pm_fullname: "A A RATHVA",
  pm_first_name: "A A RATHVA",
  pm_contact_no: "7567784027",
  pm_gender: "Male",
  pm_dob: "1982-06-12",
  pm_pincode: "",
  pm_city: "",
  pm_image: "",
  pm_image_path: "",
  pm_state: "",
  pm_address: "",
  pm_reference_id: "10012020049092",
  doctor_unique_id: "2cAKe9FUbvGRJtN",
  mobile_no: "9742639958",
  clinic_id: "368",
  hospital_business_id: "754811713438773",
  user_id: 493,
  patient_unique_id: 833190707254,
  pm_pid: "PAT0450",
  pm_id: 6942,
  ageYears: 42,
  ageMonths: 6,
  ageDays: 27,
};

const BillTable = ({ isPatientScreen }) => {
  const [refundBillDrawer, setRefundBillDrawer] = useState(false);
  const [previewBillDrawer, setPreviewBillDrawer] = useState(false);

  const handleRefundBillDrawer = () => {
    setRefundBillDrawer(!refundBillDrawer);
  };

  const handleDrawerPreviewBill = () => {
    setPreviewBillDrawer(!previewBillDrawer);
  };

  const onBillingDetailsClick = async (status, record) => {
    if (status === 1) {
      handleDrawerPreviewBill();
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
    !isPatientScreen
      ? {
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
            patientData={patient_data}
          />
        </Drawer>
      )}
    </>
  );
};

export default BillTable;
