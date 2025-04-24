import React, { useState } from "react";
import { Drawer, Table } from "antd";
import { Col, Row, Container, Navbar } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const BillingHistoryNew = ({ show, setShow }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handlePdfDrawer = () => {
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
  };

  const SubscriptionTable = () => {
    const dataSource = [
      {
        key: '1',
        plans: <><span className="fw-semibold">Voice Rx </span> <span>(Addon)</span></>,
        amountPaid: '₹12,999',
        startDate: '24th Dec, 2024',
        nextPayment: '10 Downing Street',
        invoice: <button className="btn btn-link text-primary p-0" onClick={handlePdfDrawer}>INV2024_2883</button>,
        status: <div className="active">Active</div>,
      },
      {
        key: '2',
        plans: <span className="fw-semibold">Tatva Practice EMR</span>,
        amountPaid: '₹12,999',
        startDate: '24th Dec, 2024',
        nextPayment: '10 Downing Street',
        invoice: <button className="btn btn-link text-primary p-0" onClick={handlePdfDrawer}>INV2024_2883</button>,
        status: <div className="active">Active</div>,
      },
      {
        key: '3',
        plans: <><span className="fw-semibold">Smart Sync PRO </span> <span>(Addon)</span></>,
        amountPaid: '₹12,999',
        startDate: '24th Dec, 2024',
        nextPayment: '10 Downing Street',
        invoice: <button className="btn btn-link text-primary p-0" onClick={handlePdfDrawer}>INV2024_2883</button>,
        status: <div className="expired">Expired</div>,
      },
      {
        key: '4',
        plans: <><span className="fw-semibold">DDX </span> <span>(Addon)</span></>,
        amountPaid: '₹12,999',
        startDate: '24th Dec, 2024',
        nextPayment: '10 Downing Street',
        invoice: <button className="btn btn-link text-primary p-0" onClick={handlePdfDrawer}>INV2024_2883</button>,
        status: <div className="expired">Expired</div>,
      },
    ];

    const columns = [
      {
        title: 'Plans',
        dataIndex: 'plans',
        key: 'plans',
      },
      {
        title: 'Amount Paid',
        dataIndex: 'amountPaid',
        key: 'amountPaid',
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
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
    ];

    return (

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
        <Table className="table-billing p-20 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }} dataSource={dataSource} columns={columns} bordered pagination={false} />
      </>
    );
  };

  return (
    <>
      <Drawer
        width={900}
        open={show}
        footer={null}
        onClose={() => setShow(false)}
        closeIcon={false}>
        <SubscriptionTable />
      </Drawer>

      <Drawer
        width={800}
        open={open}
        footer={null}
        onClose={() => setOpen(false)}
        closeIcon={false}>
        <Navbar className="justify-content-between headerprescription p-0">
          <div className='h-100 d-flex align-items-center w-100 justify-content-between'>
            <div className='align-items-center d-flex h-100'>
              <div className='border-end h-100 text-center' onClick={() => setOpen(false)}>
                <div className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                  <i className='icon-right'></i>
                </div>
              </div>
              <div className='ms-3 title-common'>Invoice</div>
            </div>
            <div className='align-items-center d-flex h-100'>
              <button className='btn'>
                <i className="fs-3 text-primary icon-Print"></i>
              </button>
              <button className='btn'>
                <i className="fs-3 text-primary icon-download"></i>
              </button>
            </div>
          </div>
        </Navbar>
        <div className="m-4 p-4 rounded-20px" style={{ backgroundColor: '#F2F2F2' }}>
          <div className="text-center titleprint mb-3 text-main fw-semibold">Invoice</div>
          <Row>
            <Col lg={7} className="d-flex my-2">
              <div className="fontroboto fw-medium text-welcome fs-15">Patient Name:&nbsp;</div>
              <div className="fontroboto text-welcome fs-15">Rahul Sharma</div>
            </Col>
          </Row>
          <hr />
          <div><span className="fw-semibold">Notes:</span> Can take pain killer tablets during the menstrual time But make sure that there is no usage of more than 2  pain killers per day Can take pain killer tablets during the menstrual time.View less</div>
        </div>
      </Drawer>
    </>
  );
};

export default BillingHistoryNew;
