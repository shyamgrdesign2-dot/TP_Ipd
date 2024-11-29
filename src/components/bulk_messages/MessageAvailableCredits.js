import React from "react";
import { Button, Input, Radio } from "antd";
import DiscountIcon from "../../assets/images/discount.svg"
import CreditImg from "../../assets/images/credit_icon.svg"

function MessageAvailableCredits() {
    return (
        <>
            <div className="badge-discount py-2 w-100 rounded-0 text-center"> <img src={DiscountIcon} className="me-1" alt="Discount" />Get <span className="fw-medium">20% extra</span> credits on purchases over <span className="fw-medium">₹2000!</span></div>
            <div className="bg-white overflow-y-auto p-20 d-flex flex-column justify-content-between" style={{ height: 'calc( 100vh - 98px)' }}>
                <div>
                    <div className="px-3 available-credits">
                        <img src={CreditImg} width={19} className="me-2" />
                        Available Credits: 0
                    </div>
                    <div className="mt-3 w-100 rounded-4 p-3" style={{ background: '#FAF8F6' }}>
                        <div className="fw-semibold">Note:</div>
                        <ul className="fw-medium ps-4 mt-2 mb-0">
                            <li>1 Credit = <span className="fw-bold">₹ 1.00</span></li>
                            <li>To send 1 SMS: <span className="fw-bold">0.15 credits</span> required</li>
                            <li>To send 1 WhatsApp message: <span className="fw-bold">0.75 credits</span> required</li>
                        </ul>
                    </div>
                    <div className="mt-3">
                        <Radio.Group className="w-100">
                            <div className="mb-3 border pe-3 rounded-4 d-flex align-items-center">
                                <Radio className="py-3 ps-3 me-auto w-100" value={1}>₹500 (500 credit)</Radio>
                                {/* <div className="fs-12-1 fw-medium badge-discount"> <img src={DiscountIcon} className="me-1" alt="Discount"/>Get extra 5%</div> */}
                            </div>
                            <div className="mb-3 border pe-3 rounded-4 d-flex align-items-center">
                                <Radio className="py-3 ps-3 me-auto w-100" value={2}>₹1000 (1000 credit)</Radio>
                                {/* <div className="fs-12-1 fw-medium badge-discount"> <img src={DiscountIcon} className="me-1" alt="Discount"/>Get extra 10%</div> */}
                            </div>
                            <div className="mb-3 border pe-3 rounded-4 d-flex align-items-center">
                                <Radio className="py-3 ps-3 me-auto w-100" value={3}>₹1500 (1500 credit)</Radio>
                                {/* <div className="fs-12-1 fw-medium badge-discount"> <img src={DiscountIcon} className="me-1" alt="Discount"/>Get extra 15%</div> */}
                            </div>
                            <div className="mb-3 border pe-3 rounded-4 d-flex align-items-center">
                                <Radio className="py-3 ps-3 me-auto w-100" value={4}>₹2000 (2000 credit)</Radio>
                                <div className="fs-12-1 fw-medium badge-discount"> <img src={DiscountIcon} className="me-1" alt="Discount" />Get extra 20%</div>
                            </div>
                        </Radio.Group>
                    </div>
                    <div>
                        <Input className="p-3 rounded-4 text-suffix-credits" placeholder="Or Enter Custom amount" inputMode="numeric" suffix="2400 Credits" />
                        <div className='mt-1 text-green d-flex align-items-center'><i className="icon-check fs-5 ms-1"></i>Extra 20% credits applied to your purchase!</div>
                    </div>
                </div>
                <div>
                    <Button className="lh-lg btn btn-primary3 btn-54 w-100">
                        <span>Buy Now</span>
                    </Button>
                </div>
            </div>
        </>
    );
}

export default React.memo(MessageAvailableCredits);