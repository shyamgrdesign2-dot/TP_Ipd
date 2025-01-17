import React from "react";
import { Table } from "antd";

const DownloadBill = () => {
  // Define the data source
  const dataSource = [
    {
      key: "1",
      billNo: "INV-2900567",
      date: "10th Oct 2023",
      patientDetails: "Tony Danza",
      contact: "9708823109",
      totalAmount: "₹500",
      paidAmount: "₹500",
      status: "Paid fully",
    },
    {
      key: "2",
      billNo: "INV-2900569",
      date: "10th Oct 2023",
      patientDetails: "Jonathan Higgins",
      contact: "9668796397",
      totalAmount: "₹750",
      paidAmount: "₹500",
      status: "Due: ₹250",
    },
    {
      key: "3",
      billNo: "INV-2900571",
      date: "9th Oct 2023",
      patientDetails: "Templeton Peck",
      contact: "6142245228",
      totalAmount: "₹500",
      paidAmount: "₹500",
      status: "Paid fully",
    },
    {
      key: "4",
      billNo: "INV-2900572",
      date: "9th Oct 2023",
      patientDetails: "Capt. Trunk",
      contact: "6867692673",
      totalAmount: "₹890",
      paidAmount: "₹700",
      status: "Due: ₹250",
    },
    {
      key: "5",
      billNo: "INV-2900573",
      date: "9th Oct 2023",
      patientDetails: "Michael Knight",
      contact: "6397782297",
      totalAmount: "₹800",
      paidAmount: "₹800",
      status: "Refunded: ₹800",
    },
    {
      key: "6",
      billNo: "INV-2900570",
      date: "9th Oct 2023",
      patientDetails: "Jonathan Higgins",
      contact: "6977649184",
      totalAmount: "₹890",
      paidAmount: "₹640",
      status: "Due: ₹250",
    },
  ];

  // Define the columns
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: "BILL NO",
      dataIndex: "billNo",
      key: "billNo",
      align: "center",
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "PATIENT DETAILS",
      dataIndex: "patientDetails",
      key: "patientDetails",
      align: "center",
      render: (text, record) => (
        <div>
          {text}
          <br />
          <span style={{ color: "#888" }}>{record.contact}</span>
        </div>
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
    },
    {
      title: "PAID AMOUNT",
      dataIndex: "paidAmount",
      key: "paidAmount",
      align: "center",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          style={{
            color:
              status.includes("Paid") || status.includes("Refunded")
                ? "green"
                : "red",
          }}
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ margin: "0", fontWeight: "bold", color: "#4B4AD5" }}>CARE CLINIC</h1>
        <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
          Hyderabad, India • 07894561230 • contact@careclinic.com
        </p>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Bill between 09/10/2024 - 10/10/2024
        </p>
      </div>

      {/* Table */}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        style={{
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default DownloadBill;
