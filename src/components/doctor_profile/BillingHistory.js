import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import "./billingHistory.scss";
import { DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import billingsIcon from "../../assets/images/billings.svg";
import { fetchSubscriptionDetails } from "../../redux/subscriptionSlice";

const columns = [
  {
    title: "Plan",
    key: "productType",
    dataIndex: "productType",
    render: (text) => (
      <span style={{ fontWeight: "600", fontSize: "16px", color: "#333" }}>
        {text || ""}
      </span>
    ),
  },
  {
    title: "Reference",
    key: "txId",
    dataIndex: "txId",
    render: (text) => (
      <span style={{ fontSize: "14px", color: "#555" }}>{text || ""}</span>
    ),
  },
  {
    title: "Amount Paid",
    key: "paymentAmount",
    dataIndex: "paymentAmount",
    render: (text) => (
      <span style={{ fontSize: "14px", color: "#555" }}>{text || ""}</span>
    ),
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (text) => (
      <span style={{ fontSize: "14px", color: "#555" }}>{text || ""}</span>
    ),
  },
  {
    title: "Paid on",
    key: "paymentDate",
    dataIndex: "paymentDate",
    render: (text) => (
      <span style={{ fontSize: "14px", color: "#555" }}>
        {text ? moment(text).format("DD MMM YYYY") : ""}
      </span>
    ),
  },
  {
    title: "Plan Expires on",
    key: "planExpiryDate",
    dataIndex: "planExpiryDate",
    render: (text) => (
      <span style={{ fontSize: "14px", color: "#555" }}>
        {text ? moment(text).format("DD MMM YYYY") : ""}
      </span>
    ),
  },
  {
    title: "Invoice",
    key: "invoiceReceipt",
    dataIndex: "invoiceReceipt",
    render: (text) =>
      text ? (
        <a href={text} download rel="noopener noreferrer">
          <DownloadOutlined className="custom-icon" />
        </a>
      ) : (
        ""
      ),
  },
];

const styles = {
  table: {
    margin: "30px auto",
    textAlign: "center",
  },
};

const SubscriptionTable = () => {
  const { planDetails } = useSelector((state) => state.subscription);
  const { billingHistory = [], totalPages } = planDetails || {};
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 5,
    total: totalPages || 0,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Fetch data when the component mounts or when pagination changes
  useEffect(() => {
    dispatch(fetchSubscriptionDetails(pagination));
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
      style={styles.table}
      pagination={{
        current: pagination.current + 1,
        pageSize: pagination.pageSize,
        total: totalPages,
      }}
      loading={loading}
      onChange={handleTableChange}
      rowClassName={() => "custom-row"}
    />
  );
};

const BillingHistory = ({ show, setShow }) => {
  return (
    <Modal
      width={"auto"}
      open={show}
      footer={null}
      onCancel={() => setShow(false)}
      centered
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
