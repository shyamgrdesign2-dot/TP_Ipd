import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Drawer, Table } from "antd";
import { Button } from "react-bootstrap";

import BillingHistory from "./BillingHistory";
import crownIcon from "../../assets/images/crown-purple.svg";
import billingsIcon from "../../assets/images/billings.svg";
import crown from '../../assets/images/crown.svg'
import BillingHistoryNew from "./BillingHistoryNew";
import BillingPrint from "./BillingPrint";
import { billingHistory } from "../../redux/monetizationSlice";
import { S_SMARTSYNC, S_TATVA_PRACTICE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

function SubscriptionNew() {

  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.doctors);
  const { billingHistoryList } = useSelector((state) => state.monetization);
  const dispatch = useDispatch();

  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(billingHistory(profile?.b2c));
  }, []);

  const handlePdfDrawer = useCallback(() => {
    setOpen(!open);
  }, [open])

  const columns = [
    {
      title: 'Current Active Plans',
      dataIndex: 'service_display_name',
      key: 'service_display_name',
      render: (text, record) => (
        <><span className="fw-semibold">{text} </span> {record?.service_name !== S_TATVA_PRACTICE && record?.service_name !== S_SMARTSYNC ? <span>(Addon)</span> : record?.service_name === S_SMARTSYNC ? <span>(Device)</span> : ''}</>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'plan_start_date',
      key: 'plan_start_date',
    },
    {
      title: 'Next Payment',
      dataIndex: 'plan_end_date',
      key: 'plan_end_date',
    },
    {
      title: 'Invoice',
      dataIndex: 'invoice_generated',
      key: 'invoice_generated',
      render: (text) => <button className="btn btn-link text-primary p-0" onClick={handlePdfDrawer}>{text}</button> || "N/A",
      onCell: (record) => ({
        rowSpan: record.rowSpan,
      }),
      // render: (text, row) => ({
      //   children: <button className="btn btn-link text-primary p-0" onClick={handlePdfDrawer}>{text}</button> || "N/A",
      //   props: {
      //     rowSpan: row.rowSpan,
      //   },
      // }),
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
          {!billingHistoryList?.length > 0 &&
            <button className="btn d-flex align-items-center btn-text"
              onClick={() => {
                setShowBillingHistory(true);
              }}>
              <img loading="lazy" src={billingsIcon}
                style={{ color: "#EE7200", marginRight: "5px" }} alt="" />
              <span> Billing History </span>
            </button>
          }
        </div>

        {billingHistoryList?.length > 0 ? (
          <>
            <Table
              className="table-billing p-20"
              dataSource={billingHistoryList}
              columns={columns}
              bordered
              pagination={false} />
            <BillingHistoryNew
              show={showBillingHistory}
              setShow={setShowBillingHistory}
              handlePdfDrawer={handlePdfDrawer}
              billingHistoryList={billingHistoryList} />
          </>
        ) : (
          <div className="text-center p-4">
            <div className="mb-4 text-black-50 fw-medium">You have no active plan!</div>
            <Button className="btn btn-proceed btn-primary3 w-25 mx-auto align-items-center justify-content-center d-flex" onClick={() => navigate("/get-unlimited-access")}>
              <img className="me-2" src={crown} alt="Crown" />
              Buy plan now
            </Button>
          </div>
        )}

      </div>
      <Drawer
        width={800}
        open={open}
        footer={null}
        onClose={() => setOpen(false)}
        styles={{
          mask: { zIndex: 999 },
          wrapper: { zIndex: 999 },
        }}
        closeIcon={false}>
        <BillingPrint handlePdfDrawer={handlePdfDrawer} />
      </Drawer>
    </>
  );
}

export default React.memo(SubscriptionNew);
