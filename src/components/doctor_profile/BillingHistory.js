import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import "./billingHistory.scss";
import { DownloadOutlined, CrownOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import billingsIcon from "../../assets/images/billings.svg";
import { fetchSubscriptionDetails } from "../../redux/subscriptionSlice";

const columns = [
  {
    title: "Plan",
    key: "productType",
    render: (text, record) => (
      <span style={{ fontWeight: "600", fontSize: "16px", color: "#333" }}>
        {record.paymentDetails?.productType || "N/A"}
      </span>
    ),
  },
  {
    title: "Reference",
    key: "txId",
    render: (text, record) => (
      <span style={{ fontSize: "14px", color: "#555" }}>
        {record.paymentDetails?.txId || "N/A"}
      </span>
    ),
  },
  {
    title: "Amount Paid",
    key: "paymentAmount",
    render: (text, record) => (
      <span style={{ fontSize: "14px", color: "#555" }}>
        {record.paymentDetails?.paymentAmount || "N/A"}
      </span>
    ),
  },
  {
    title: "Paid on",
    key: "paymentDate",
    render: (text, record) => (
      <span style={{ fontSize: "14px", color: "#555" }}>
        {record.paymentDetails?.paymentDate
          ? moment(record.paymentDetails?.paymentDate).format("DD MMM YYYY")
          : "N/A"}
      </span>
    ),
  },
  {
    title: "Plan Expires on",
    key: "planExpiryDate",
    render: (text, record) => (
      <span style={{ fontSize: "14px", color: "#555" }}>
        {record.paymentDetails?.planExpiryDate
          ? moment(record.paymentDetails?.planExpiryDate).format("DD MMM YYYY")
          : "N/A"}
      </span>
    ),
  },
  {
    title: "Invoice",
    key: "invoiceReceipt",
    render: (text, record) =>
      record.paymentDetails?.invoiceReceipt ? (
        <a
          href={record?.paymentDetails?.invoiceReceipt}
          target="_blank"
          download
        >
          <DownloadOutlined className="custom-icon" />
        </a>
      ) : (
        <span style={{ fontSize: "14px", color: "#bbb" }}>N/A</span>
      ),
  },
];

const styles = {
  table: {
    margin: "30px auto",
  },
  planText: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#333",
  },
  defaultText: {
    fontSize: "14px",
    color: "#555",
  },
  downloadIcon: {
    fontSize: "18px",
    color: "#5A5FFF",
    cursor: "pointer",
  },
};

const SubscriptionTable = () => {
  const { planDetails } = useSelector((state) => state.subscription);
  const { billingHistory = [], totalPages } = planDetails || {};
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: totalPages || 0,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Fetch data when the component mounts or when pagination changes
  useEffect(() => {
    dispatch(fetchSubscriptionDetails(pagination.current, pagination.pageSize));
  }, [pagination.current, pagination.pageSize]);

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <Table
      dataSource={billingHistory}
      columns={columns}
      rowKey="key"
      style={styles.table}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: totalPages,
        // showSizeChanger: true, // Allows changing page size
      }}
      loading={loading}
      onChange={handleTableChange}
      rowClassName={() => "custom-row"}
    />
  );
};

const BillingHistory = ({ show, setShow }) => {
  const { planDetails } = useSelector((state) => state.subscription);
  const { billingHistory = [] } = planDetails || {};
  console.log({ billingHistory });

  return (
    <Modal
      width={"50%"}
      open={show}
      footer={null}
      onCancel={() => setShow(false)}
      title={
        <>
          <img
            loading="lazy"
            src={billingsIcon}
            style={{ color: "#EE7200", marginRight: "5px" }}
            alt=""
          />
          Billing History
        </>
      }
    >
      <SubscriptionTable />
    </Modal>
  );
};

export default BillingHistory;
