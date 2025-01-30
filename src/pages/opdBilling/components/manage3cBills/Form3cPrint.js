import React from "react";
import { Table } from "antd";
import moment from "moment";
import "./Form3cPrint.scss";

const Form3cPrint = ({ rows }) => {
  // Define the columns
  const columns = [
    {
      title: <i>Date</i>,
      dataIndex: "date",
      key: "date",
      width: 120,
      align: "center",
      render: (text, record) => moment(record.date).format("DD/MM/YYYY"),
    },
    {
      title: <i>Sl. No.</i>,
      dataIndex: "slNo",
      key: "slNo",
      width: 160,
      align: "center",
      render: (text, record) => (record.billNumber),
    },
    {
      title: <i>Patient's name</i>,
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
      title: (
        <i>
          Nature of professional services rendered, i.e., general consultation,
          surgery, injection, visit, etc.
        </i>
      ),
      dataIndex: "servicesRendered",
      key: "servicesRendered",
      align: "left",
      width: 280,
      render: (text, record) => (
        <div className="fs-14">
          {record?.billItems?.map((item) => item.name).join(", ") || "-"}
        </div>
      ),
    },
    {
      title: <i>Fees received</i>,
      dataIndex: "feesReceived",
      key: "feesReceived",
      width: 100,
      align: "right",
      render: (text, record) => (
        <div className="cursor-pointer">
          <div className="fs-14">{record?.paidAmount}</div>
        </div>
      ),
    },
    {
      title: <i>Date of receipt</i>,
      dataIndex: "receiptDate",
      key: "receiptDate",
      width: 120,
      align: "center",
      render: (text, record) => moment(record.date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div
      className="form-3c-print-wrapper"
      style={{ padding: "20px", backgroundColor: "#fff" }}
    >
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
          }}
        >
          <span>20/12/2024, 10:15</span>
          <span>Form 3C</span>
        </div>
        <h2 style={{ fontWeight: "bold", margin: "10px 0" }}>FORM NO. 3C</h2>
        <p style={{ fontSize: "12px", margin: "5px 0" }}>
          <a
            href="https://www.incometaxindia.gov.in/Rules/Income-Tax-Rules/103120000000007197.htm"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4B4AD5", textDecoration: "underline" }}
          >
            [See rule 6F(3)]
          </a>
        </p>
        <h6 style={{ fontWeight: "500", margin: "10px 0" }}>
          Form of daily case register
        </h6>

        <p style={{ fontSize: "12px", margin: "5px 0" }}>
          [TO BE MAINTAINED BY PRACTITIONERS OF ANY SYSTEM OF MEDICINE, I.E.,
          PHYSICIANS, SURGEONS, DENTISTS, PATHOLOGISTS, RADIOLOGISTS, VAIDS,
          HAKIMS, ETC.]
        </p>
      </div>

      {/* Table */}
      <Table
        dataSource={rows}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        tableLayout="fixed"
      />

      {/* Footer Section */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "12px",
          textAlign: "right",
          color: "#888",
        }}
      >
        https://docon.co.in/exam/reports &nbsp;&nbsp; | &nbsp;&nbsp; 1/1
      </div>
    </div>
  );
};

export default Form3cPrint;
