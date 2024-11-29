import React from "react";
import messageCorner from '../../assets/images/message-corner.svg'
// import "./messages.scss";

function MessageDetailedView() {
    return (
        <>
            <div className="bg-white overflow-y-auto p-20" style={{ height: 'calc( 100vh - 61px)' }}>
                {/* Below code for SMS */}
                <div className="fs-18 lh-base">
                    The below <span className="fw-semibold">Medical Camp</span> message will be sent on <span className="fw-semibold">07/11/2024</span> at <span className="fw-semibold">12:00 AM </span> via <span className="fw-semibold">SMS</span> to <span className="fw-semibold"> 524 male patients </span> of age between <span className="fw-semibold"> 20-40 years </span> who visited in the <span className="fw-semibold"> last 1 month</span>
                </div>

                {/* Below code for whatsup */}
                {/* <div className="fs-18 lh-base">
                    The below <span className="fw-semibold">Medical Camp</span> message was sent on <span className="fw-semibold">07/11/2024</span> at <span className="fw-semibold">12:00 AM</span> via <span className="fw-semibold">WhatsApp</span> to <span className="fw-semibold">524 male patients</span> of age between <span className="fw-semibold">20-40 years</span> who visited in the <span className="fw-semibold">last 1 month</span> under the care of Shyam GR, Dr. Archita Chakra. <span className="fw-semibold">400</span> message were successfully delivered, and <span className="fw-semibold">32</span> failed to send.
                </div> */}

                {/* Below code for SMS */}
                <div className="bg-selected w-100 mt-4 rounded-20px d-flex justify-content-center align-items-center" style={{height: 138}}>
                    <div className="bg-white w-60 fw-medium rounded-4 p-3 position-relative">Hi, Healthion Clinic is holding a Diabities camp from 20-08-2024 to 22-08-2024 at 2nd block, Koramangla. Regards, Shyam GR - TatvaPractice
                    <img className="position-absolute" style={{left: -2, bottom: -3}} src={messageCorner} alt="Message" />
                    </div>
                </div>

                {/* Below code for whatsup */}
                {/* <div className="bg-whatsup-message w-100 mt-4 rounded-20px d-flex justify-content-center align-items-center" style={{height: 138}}>
                    <div className="bg-white w-60 fw-medium rounded-4 p-3 position-relative">Hi, Healthion Clinic is holding a Diabities camp from 20-08-2024 to 22-08-2024 at 2nd block, Koramangla. Regards, Shyam GR - TatvaPractice
                    <img className="position-absolute" style={{left: -2, bottom: -3}} src={messageCorner} alt="Message" />
                    </div>
                </div> */}


                <div className="mt-4">
                    <div className="fontroboto title-hypertension">Credit Details</div>
                    {/* Below code for SMS */}
                    <div className="title-common my-2 text-black-50">( 1SMS = 0.15 Credits)</div>
                    
                    {/* Below code for whatsup */}
                    {/* <div className="title-common my-2 text-black-50">( 1WhatsApp Message = 0.75 Credits)</div> */}

                    <div className="mt-4 mb-3">
                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div>Target Customers (A) :</div>
                            <div>524 User</div>
                        </div>
                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div>SMS Per Customers (B) :</div>
                            <div>1 SMS</div>
                        </div>
                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div>Price Per SMS (C) :</div>
                            <div>0.15 Credits</div>
                        </div>

                        {/* <hr />

                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div>Total Credits Required (ABC) :</div>
                            <div>324 Credits</div>
                        </div>
                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div className="text-faild">Undelivered Messages</div>
                            <div className="text-faild">32 Message</div>
                        </div>
                        <div className="d-flex align-items-center py-2 justify-content-between fs-18 fw-medium fontroboto">
                            <div>Refundable Credits</div>
                            <div>(-)24 Credits</div>
                        </div> */}

                        <hr />

                        <div className="d-flex align-items-center justify-content-between fs-18 fw-semibold fontroboto">
                            <div>Target Customers(A) :</div>
                            <div className="fw-medium">524 User</div>
                        </div>

                        <hr />
                        
                    </div>
                    <div className="text-greycolor">We will refund the credits for undelivered messages within 48 hours of delivery</div>
                </div>
            </div>
        </>
    );
}

export default React.memo(MessageDetailedView);