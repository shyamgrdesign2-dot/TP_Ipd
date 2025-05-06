import React from "react";
import { Drawer, Table } from "antd";
import { Navbar } from "react-bootstrap";

import { S_SMARTSYNC, S_TATVA_PRACTICE } from "../../utils/constants";

const BillingHistoryNew = ({ show, setShow, handlePdfDrawer, billingHistoryList }) => {

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
      title: 'Amount Paid',
      dataIndex: 'plan_amount',
      key: 'plan_amount',
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
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <div className={text === 'active' ? 'active' : 'expired'}>{text === 'active' ? 'Active' : 'Expired'}</div>,

    }
  ];

  return (
    <>
      <Drawer
        width={900}
        open={show}
        footer={null}
        onClose={() => setShow(false)}
        closeIcon={false}>
        <>
          <Navbar className="justify-content-between headerprescription p-0">
            <div className='align-items-center d-flex h-100'>
              <div className='border-end h-100 text-center' onClick={() => setShow(false)}>
                <div className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                  <i className='icon-right'></i>
                </div>
              </div>
              <div className='ms-3 title-common'>Billing History</div>
            </div>
          </Navbar>
          <Table
            className="table-billing p-20 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 60px)' }}
            dataSource={billingHistoryList}
            columns={columns}
            bordered
            pagination={false} />
        </>
      </Drawer>
    </>
  );
};

export default BillingHistoryNew;
