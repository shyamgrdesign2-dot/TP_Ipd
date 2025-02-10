import React from "react";
import { Divider, Table } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

const DownloadBill = ({ downloadData, parent, dateRange }) => {
  const { profile } = useSelector((state) => state.doctors);

  const hospitalData = profile?.hospital_data?.[0] || {};
  const { hm_name, um_contact, um_email, hm_address, hm_address1, hm_state } =
    hospitalData;

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
      render: (text, record) => record.billNumber,
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
      render: (text, record) => record.receiptNumber,
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (text, record) =>
        record.date ? moment(record.date)?.format("DD MMM YYYY") : "",
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
    const month = date.toLocaleString("default", { month: "short" }); // Get the short month name
    const year = date.getFullYear();

    const suffix = ["th", "st", "nd", "rd"][
      day % 10 > 3 || (day % 100 >= 11 && day % 100 <= 13) ? 0 : day % 10
    ]; // Determine the suffix (st, nd, rd, th)

    return `${day}${suffix} ${month} ${year}`;
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        marginTop: 10,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px", textAlign: "left" }}>
        <h1 style={{ margin: "0", fontWeight: "bold", color: "#4B4AD5" }}>
          {hm_name}
        </h1>
        <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
          {hm_address ?? ""}
          {hm_address && hm_address1 ? `, ${hm_address1}` : ""}
          {hm_state} {um_contact ? ` • ${um_contact}` : ""}
          {um_email ? ` • ${um_email}` : ""}
        </p>

        <Divider />

        <p style={{ fontSize: "14px", color: "#666" }}>
          Bill between {moment(dateRange?.startDate).format("DD/MM/YYYY")} -{" "}
          {moment(dateRange?.endDate).format("DD/MM/YYYY")}
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
