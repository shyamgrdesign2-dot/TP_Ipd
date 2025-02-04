import React from "react";
import { Table } from "antd";

const DownloadBill = ({downloadData, parent}) => {

  // Define the columns
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
      render: (text, record, index) => <div className="fs-14">{index + 1}</div>,
    },
    {
      title: "BILL NO",
      dataIndex: "billNo",
      key: "billNo",
      align: "center",
      render: (text, record) => (record.billNumber),
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "PATIENT DETAILS",
      dataIndex: "patientName",
      key: "patientName",
      width: 150,
      align: "left",
      render: (text, record) => (
        <div className="cursor-pointer">
          <div className="fs-14">{record?.patient?.name}</div>
        </div>
      ),
    },
    {
      title: "PATIENT DETAILS",
      dataIndex: "patientDetails",
      key: "patientDetails",
      align: "center",
      render: (text, record) => (
        <div>
          <span style={{ color: "#888" }}>{record?.patient?.phone}</span>
        </div>
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "payableAmount",
      key: "payableAmount",
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
      render: (text, record) => (
        <span style={{ color: "#888" }}>{record?.paymentStatus}</span>
      ),
    },
  ];

  const advanceColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
      render: (text, record, index) => <div className="fs-14">{index + 1}</div>,
    },
    {
      title: "BILL NO",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      align: "center",
      render: (text, record) => (record.receiptNumber),
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (text, record) => (formatDate(record.date)),
    },
    {
      title: "PATIENT DETAILS",
      dataIndex: "patientName",
      key: "patientName",
      width: 150,
      align: "left",
      render: (text, record) => (
        <div className="cursor-pointer">
          <div className="fs-14">{record?.patient?.name}</div>
        </div>
      ),
    },
    {
      title: "PATIENT DETAILS",
      dataIndex: "patientDetails",
      key: "patientDetails",
      align: "center",
      render: (text, record) => (
        <div>
          <span style={{ color: "#888" }}>{record?.patient?.phone}</span>
        </div>
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      render: (text, record) => (
        <div>
          <span style={{ color: "#888" }}>{record?.totalAmount}</span>
        </div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record) => (
        <span style={{ color: "#888" }}>{record?.transactionType}</span>
      ),
    },
  ];

  function formatDate(dateString) {
    const date = new Date(dateString);
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // Get the short month name
    const year = date.getFullYear();
    
    const suffix = ['th', 'st', 'nd', 'rd'][((day % 10) > 3 || (day % 100 >= 11 && day % 100 <= 13)) ? 0 : day % 10]; // Determine the suffix (st, nd, rd, th)

    return `${day}${suffix} ${month} ${year}`;
  }

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
        dataSource={downloadData}
        columns={parent === "advance" ? advanceColumns : columns}
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
