import React, { useState } from "react";
import BillingHistory from "./BillingHistory";
import crownIcon from "../../assets/images/crown-purple.svg";
import billingsIcon from "../../assets/images/billings.svg";
import { Table } from "antd";
import BillingHistoryNew from "./BillingHistoryNew";

function SubscriptionNew() {

  const [showBillingHistory, setShowBillingHistory] = useState(false);

  const dataSource = [
    {
      key: '1',
      name: <><span className="fw-semibold">Voice Rx </span> <span>(Addon)</span></>,
      startDate: '24th Dec, 2024',
      nextPayment: '10 Downing Street',
      invoice: <button className="btn btn-link text-primary p-0">INV2024_2883</button>,
    },
    {
      key: '2',
      name: <span className="fw-semibold">Tatva Practice EMR</span>,
      startDate: '24th Dec, 2024',
      nextPayment: '10 Downing Street',
      invoice: <button className="btn btn-link text-primary p-0">INV2024_2883</button>,
    },
    {
      key: '3',
      name: <><span className="fw-semibold">Smart Sync PRO </span> <span>(Addon)</span></>,
      startDate: '24th Dec, 2024',
      nextPayment: '10 Downing Street',
      invoice: <button className="btn btn-link text-primary p-0">INV2024_2883</button>,
    },
    {
      key: '4',
      name: <><span className="fw-semibold">DDX </span> <span>(Addon)</span></>,
      startDate: '24th Dec, 2024',
      nextPayment: '10 Downing Street',
      invoice: <button className="btn btn-link text-primary p-0">INV2024_2883</button>,
    },
  ];
  
  const columns = [
    {
      title: 'Current Active Plans',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Next Payment',
      dataIndex: 'nextPayment',
      key: 'nextPayment',
    },
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
    },
  ];

  return (
    <>
      <div className="rounded-20px bg-white mb-5">
        <div className="d-flex align-items-center justify-content-between p-20 border-bottom"
          style={{ borderColor: "#F1F1F5" }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="profile-head-icon me-3">
              <img loading="lazy" src={crownIcon} alt="" />
            </div>
            <div className="titleprint">Subscription</div>
          </div>
          <button className="btn d-flex align-items-center btn-text"
            onClick={() => {
              setShowBillingHistory(true);
            }}>
            <img loading="lazy" src={billingsIcon}
              style={{ color: "#EE7200", marginRight: "5px" }} alt="" />
            <span> Billing History </span>
          </button>
        </div>

        <Table className="table-billing p-20" dataSource={dataSource} columns={columns} bordered pagination={false} />

        {/* <BillingHistory
          show={showBillingHistory}
          setShow={setShowBillingHistory}
        /> */}

      <BillingHistoryNew
      show={showBillingHistory}
      setShow={setShowBillingHistory} />  

      </div>
    </>
  );
}

export default React.memo(SubscriptionNew);
