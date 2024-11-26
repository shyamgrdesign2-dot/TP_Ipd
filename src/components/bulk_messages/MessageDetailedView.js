import React from "react";
import messageCorner from '../../assets/images/message-corner.svg'
import "./messages.scss";

function MessageDetailedView() {
    return (
        <>
            <div className="bg-white overflow-y-auto p-20" style={{ height: 'calc( 100vh - 61px)' }}>
                <div className="fs-18 lh-base">
                    The below <span className="fw-semibold">Medical Camp</span> message will be sent on <span className="fw-semibold">07/11/2024</span> at <span className="fw-semibold">12:00 AM </span> via <span className="fw-semibold">SMS</span> to <span className="fw-semibold"> 524 male patients </span> of age between <span className="fw-semibold"> 20-40 years </span> who visited in the <span className="fw-semibold"> last 1 month</span>
                </div>
                <div className="bg-selected w-100 mt-3 rounded-20px d-flex justify-content-center align-items-center" style={{height: 138}}>
                    <div className="bg-white w-75 fw-medium rounded-4 p-3 position-relative">Hi, Healthion Clinic is holding a Diabities camp from 20-08-2024 to 22-08-2024 at 2nd block, Koramangla. Regards, Shyam GR - TatvaPractice
                    <img className="position-absolute" style={{left: -2, bottom: -3}} src={messageCorner} alt="Message" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="fontroboto title-hypertension">Credit Details</div>
                    <div className="title-common my-2 text-black-50">( 1SMS = 0.15 Credits)</div>
                    <div className="mt-4 mb-3">
                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div>Target Customers <span className="fw-semibold">(A) :</span></div>
                            <div>524 User</div>
                        </div>
                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div>SMS Per Customers <span className="fw-semibold">(B) :</span></div>
                            <div>1 SMS</div>
                        </div>
                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div>Price Per SMS <span className="fw-semibold">(C) :</span></div>
                            <div>0.15 Credits</div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between py-3 border-top border-bottom fs-18 fw-semibold fontroboto">
                            <div>Target Customers(A) :</div>
                            <div className="fw-medium">524 User</div>
                        </div>
                    </div>
                    <i className="mt-3 fw-semibold text-greycolor">We will refund the credits for undelivered messages within 48 hours of delivery</i>
                </div>
            </div>
        </>
    );
}

export default React.memo(MessageDetailedView);