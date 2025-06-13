import React from "react";
import { Divider, Table } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 15;

const DownloadBill = ({
  downloadData,
  parent,
  dateRange,
  isDoctorDashboard,
  paymentSummary,
}) => {
  const { profile } = useSelector((state) => state.doctors);
  const { doctorList } = useSelector((state) => state.bulkMessages);
  const { state } = useLocation();
  const { patient_data } = state || {};

  const hospitalData = profile?.hospital_data?.[0] || {};
  const { hm_name, um_contact, um_email, hm_address, hm_address1, hm_state } =
    hospitalData;

  const paymentSummaryWithTotal = paymentSummary
    ? [
        ...paymentSummary,
        {
          paymentMode: "Total",
          receivedAmount: paymentSummary.reduce(
            (sum, item) => sum + (Number(item.receivedAmount) || 0),
            0
          ),
          refundedAmount: paymentSummary.reduce(
            (sum, item) => sum + (Number(item.refundedAmount) || 0),
            0
          ),
        },
      ]
    : [];

  function getDoctorNameById(um_id) {
    const doctor = doctorList.find((doc) => doc.um_id === um_id);
    return doctor ? doctor.um_name : "";
  }

  // Define the columns
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 20,
      render: (text, record, index, { currentPageIndex }) => (
        <div style={{ fontSize: 12 }}>
          {currentPageIndex * ITEMS_PER_PAGE + index + 1}
        </div>
      ),
    },
    {
      title: "BILL NO",
      dataIndex: "billNo",
      key: "billNo",
      align: "center",
      render: (text, record) => (
        <div style={{ fontSize: 12 }}>{record.billNumber}</div>
      ),
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      align: "center",
      width: 150,
      render: (text, record) => (
        <div style={{ fontSize: 12 }}>
          {moment(record.date).format("DD MMM YYYY")}
        </div>
      ),
    },
    isDoctorDashboard
      ? {
          title: "Patient Name",
          dataIndex: "patientName",
          key: "patientName",
          align: "left",
          render: (text, record) => (
            <div style={{ fontSize: 12 }}>{record?.patient?.name}</div>
          ),
        }
      : undefined,
    isDoctorDashboard
      ? {
          title: "Doctor Name",
          dataIndex: "doctorName",
          key: "doctorId",
          align: "left",
          render: (text, record) => (
            <div style={{ fontSize: 12 }}>
              {getDoctorNameById(record?.doctorId)}
            </div>
          ),
        }
      : undefined,
    isDoctorDashboard
      ? {
          title: "Mobile Number",
          dataIndex: "patientDetails",
          key: "patientDetails",
          align: "center",
          render: (text, record) => (
            <div>
              <span style={{ fontSize: 12 }}>{record?.patient?.phone}</span>
            </div>
          ),
        }
      : undefined,
    {
      title: "TOTAL AMOUNT",
      dataIndex: "payableAmount",
      key: "payableAmount",
      align: "center",
      render: (text, record) => (
        <div style={{ fontSize: 12 }}>₹{record?.payableAmount}</div>
      ),
    },
    {
      title: "PAID AMOUNT",
      dataIndex: "paidAmount",
      key: "paidAmount",
      align: "center",
      render: (text, record) => (
        <div style={{ fontSize: 12 }}>₹{record?.paidAmount}</div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record) => (
        <span style={{ fontSize: 12 }}>{record?.paymentStatus}</span>
      ),
    },
  ]?.filter((item) => item);

  const advanceColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
      render: (text, record, index, { currentPageIndex }) => (
        <div className="fs-14">
          {currentPageIndex * ITEMS_PER_PAGE + index + 1}
        </div>
      ),
    },
    {
      title: "BILL NO",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      align: "center",
      render: (text, record) => record?.billNumber || record?.receiptNumber,
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      align: "center",
      width: 150,
      render: (text, record) =>
        record.date ? moment(record.date)?.format("DD MMM YYYY") : "",
    },
    isDoctorDashboard
      ? {
          title: "PATIENT NAME",
          dataIndex: "patientName",
          key: "patientName",
          width: 150,
          align: "left",
          render: (text, record) => (
            <div className="cursor-pointer">
              <div className="fs-14 patient-name-cell">
                {record?.patient?.name}
              </div>
            </div>
          ),
        }
      : undefined,
    isDoctorDashboard
      ? {
          title: "MOBILE NUMBER",
          dataIndex: "patientDetails",
          key: "patientDetails",
          align: "center",
          render: (text, record) => (
            <div>
              <span className="patient-name-cell" style={{ color: "#888" }}>
                {record?.patient?.phone}
              </span>
            </div>
          ),
        }
      : undefined,
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
  ]?.filter((item) => item);

  const summaryColumns = [
    {
      title: "PAYMENT MODE",
      dataIndex: "paymentMode",
      key: "paymentMode",
      align: "center",
      render: (text, record, index) => (
        <span
          style={{
            fontWeight: record.paymentMode === "Total" ? "medium" : "normal",
            fontSize: 12,
          }}
        >
          {record.paymentMode}
        </span>
      ),
    },
    {
      title: "RECEIVED AMOUNT",
      dataIndex: "receivedAmount",
      key: "receivedAmount",
      align: "center",
      render: (text, record) => (
        <span
          style={{
            fontWeight: record.paymentMode === "Total" ? "medium" : "normal",
            fontSize: 12,
          }}
        >
          ₹{record.receivedAmount?.toFixed(2)}
        </span>
      ),
    },
    {
      title: "REFUNDED AMOUNT",
      dataIndex: "refundedAmount",
      key: "refundedAmount",
      align: "center",
      render: (text, record) => (
        <span
          style={{
            fontWeight: record.paymentMode === "Total" ? "medium" : "normal",
            fontSize: 12,
          }}
        >
          ₹{record.refundedAmount?.toFixed(2)}
        </span>
      ),
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (text, record) => (
        <span
          style={{
            fontWeight: record.paymentMode === "Total" ? "medium" : "normal",
            fontSize: 12,
          }}
        >
          ₹{(record.receivedAmount - record.refundedAmount)?.toFixed(2)}
        </span>
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

  const PatientPlank = () => {
    return (
      <div
        className={`d-flex align-items-center flex-wrap border border-radius-10 cursor-pointer ${
          patient_data?.patient_unique_id && "pe-none disabled"
        }`}
        style={{
          padding: "5px 10px",
          marginBottom: "20px",
          width: "fit-content",
        }}
      >
        <div className="list-patientName d-flex align-items-center me-4 ml-2">
          <i className="icon-patients backbar me-2"></i>{" "}
          <span className="patientInfo">
            {patient_data.pm_salutation ? `${patient_data.pm_salutation} ` : ""}
            {patient_data?.pm_fullname}
          </span>
        </div>
        <div className="list-patientName d-flex align-items-center me-4">
          <i className="icon-phone backbar me-2"></i>
          <span className="patientInfo">{patient_data?.pm_contact_no}</span>
        </div>
        <div className="list-patientName d-flex align-items-center me-4">
          <i className="icon-Id backbar me-2"></i>
          <span className="patientInfo">{patient_data?.pm_pid}</span>
        </div>
      </div>
    );
  };

  // Split data into chunks of 15 items
  const tablePages = downloadData?.reduce((resultArray, item, index) => {
    const pageIndex = Math.floor(index / ITEMS_PER_PAGE);

    if (!resultArray[pageIndex]) {
      resultArray[pageIndex] = [];
    }

    resultArray[pageIndex].push(item);
    return resultArray;
  }, []) || [[]];

  return (
    <div className="printable-content">
      {/* First render all the data tables */}
      {tablePages.map((pageData, pageIndex) => (
        <div
          key={pageIndex}
          style={{
            margin: "0 18px 0 18px",
            pageBreakBefore: pageIndex > 0 ? "always" : "auto",
            marginTop: pageIndex > 0 ? "20px" : "0",
          }}
        >
          {/* Show header info only on first page */}
          <>
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
                Bill between {moment(dateRange?.startDate).format("DD/MM/YYYY")}{" "}
                - {moment(dateRange?.endDate).format("DD/MM/YYYY")}
              </p>
            </div>

            {patient_data ? <PatientPlank /> : null}
          </>

          <Table
            dataSource={pageData}
            columns={(parent === "advance" ? advanceColumns : columns).map(
              (col) => ({
                ...col,
                render: col.render
                  ? (text, record, index) =>
                      col.render(text, record, index, {
                        currentPageIndex: pageIndex,
                      })
                  : col.render,
              })
            )}
            pagination={false}
            bordered
            style={{
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          />
        </div>
      ))}

      {/* Render payment summary on a separate page */}
      {paymentSummary && paymentSummary?.length > 0 && (
        <div
          className="table-wrapper no-break"
          style={{
            pageBreakBefore: "always",
            marginTop: "20px",
            paddingTop: "40px",
          }}
        >
          <Table
            dataSource={paymentSummaryWithTotal}
            columns={summaryColumns}
            pagination={false}
            bordered
            style={{
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DownloadBill;
