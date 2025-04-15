import React from "react";
import { Link } from "react-router-dom";

import yearlyPlan from '../../../assets/images/year-plan-corner.svg'
import "../GetUnlimitedAccess.scss";
import { Dropdown, Button } from "antd";
import { DownOutlined } from '@ant-design/icons'

function UnlimitedAccessSummary() {

    const items = [
        {
            label: '1st menu item',
            key: '0',
        },
        {
            label: '2nd menu item',
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];

    return (
        <>
            <div className="unlimited-access-summary ">
                <div className="fs-4 fw-semibold">Summary</div>
                <div className="d-flex justify-content-between my-4">
                    <div className="fs-18">TatvaPractice EMR:
                        <div className="d-flex align-items-baseline">
                            <img className="ms-1" src={yearlyPlan} alt="icon" />
                            <div className="d-flex align-items-center">
                                <Dropdown menu={{ items }} className="fs-14 fw-medium text-primary py-1 px-2 dd-yearly" trigger={['click']}>
                                    <a onClick={e => e.preventDefault()}>
                                        1 Year
                                        <DownOutlined className="ps-2 fs-14 fw-medium text-primary" />
                                    </a>
                                </Dropdown>
                                <i className="icon-info fs-6 text-black-50 ms-2"></i>
                            </div>
                        </div>
                    </div>
                    <div className="fs-18 fw-medium">₹12,999</div>
                </div>
                <div className="d-flex justify-content-between my-4">
                    <div className="fs-18">Ask Tatva (Addon):
                        <div className="d-flex align-items-baseline">
                            <img className="ms-1" src={yearlyPlan} alt="icon" />
                            <div className="d-flex align-items-center">
                                <Dropdown menu={{ items }} className="fs-14 fw-medium text-primary py-1 px-2 dd-yearly" trigger={['click']}>
                                    <a onClick={e => e.preventDefault()}>
                                        1 Year
                                        <DownOutlined className="ps-2 fs-14 fw-medium text-primary" />
                                    </a>
                                </Dropdown>
                                <i className="icon-info fs-6 text-black-50 ms-2"></i>
                            </div>
                        </div>
                    </div>
                    <div className="fs-18 fw-medium">₹8,999</div>
                </div>
                <hr />
                <div className="d-flex justify-content-between my-3">
                    <div className="fs-18">Subtotal:</div>
                    <div className="fs-18 fw-medium">₹21,998</div>
                </div>
                <div className="d-flex justify-content-between my-3">
                    <div className="fs-18">Flat Discount:</div>
                    <div className="fs-18 fw-medium text-discount">-₹8,000</div>
                </div>
                <hr />
                <div className="d-flex justify-content-between my-3">
                    <div className="fs-4 text-welcome fw-semibold">Total Amount :</div>
                    <div className="fs-4 text-welcome fw-semibold">₹13,998</div>
                </div>

                <Button className="btn btn-proceed btn-primary3 my-4">
                    Proceed to Pay ₹13,998
                </Button>
                <div className="text-center">
                    <Link className="text-decoration-underline fw-medium text-primary">Have a sales referral code?</Link>
                </div>
            </div>
        </>
    );
}

export default UnlimitedAccessSummary;
