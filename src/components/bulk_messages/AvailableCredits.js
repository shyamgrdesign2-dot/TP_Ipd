import React, { useCallback, useState } from "react";
import { Button, Input, Radio } from "antd";
import { useSelector, useDispatch } from "react-redux";

import DiscountIcon from "../../assets/images/discount.svg"
import CreditImg from "../../assets/images/credit_icon.svg"
import { errorMessage, onlyNumberFormat } from "../../utils/utils";
import { paymentOrder, verifyPayment, paymentHistory } from "../../redux/bulkMessagesSlice";

function AvailableCredits({ handleAvailableCredit }) {
    const dispatch = useDispatch();

    const { profile } = useSelector((state) => state.doctors);
    const { userCreditObj } = useSelector((state) => state.bulkMessages);
    const [creditRadio, setCreditRadio] = useState(null);
    const [creditInput, setCreditInput] = useState(null);

    const ITEMS = [
        { amount: 500, credit: 500 },
        { amount: 1000, credit: 1000 },
        { amount: 1500, credit: 1500 },
        { amount: 2000, credit: 2400 },
    ]

    const onRadioGroupChange = (e) => {
        setCreditRadio(e.target.value);
        setCreditInput(null);
    }

    const onInputChange = (e) => {
        const value = onlyNumberFormat(e.target.value);
        setCreditInput(value);
        setCreditRadio(null);
    }

    const clickBuyNow = async () => {
        if (creditRadio || creditInput) {
            var sendData = {
                amount: creditInput ? creditInput : creditRadio
            }
            const action = await dispatch(paymentOrder(sendData));
            if (action.meta.requestStatus === "fulfilled") {
                initRazorPayPayment(action?.payload);
            } else {
                errorMessage(action.payload.message)
            }
        } else {
            errorMessage('Please select or enter amount')
        }
    }

    const initRazorPayPayment = (data) => {
        const options = {
            key: 'rzp_test_PoLtBba5t8qJIm',
            amount: data.amount,
            currency: data.currency,
            name: 'Purchase bulk messages',
            description: 'description',
            image: '',
            order_id: data.id,
            handler: async (response) => {
                try {
                    verifyRazorPayPayment(response)
                } catch (error) {
                    console.log(error);
                }
            },
            prefill: {
                contact: profile?.um_contact,
                name: profile?.um_name,
                email: profile?.um_email,
            },
            theme: {
                color: "#3399cc",
            },
            modal: {
                ondismiss: function () {
                    //   setLoading(false)
                }
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const verifyRazorPayPayment = async (r_response) => {
        const action = await dispatch(verifyPayment(r_response));
        if (action.meta.requestStatus === "fulfilled") {
            if (action?.payload?.status === 'captured') {
                setCreditRadio(null);
                setCreditInput(null);
                handleAvailableCredit()
            } else {
                errorMessage(action?.payload?.error_description)
            }
        } else {
            errorMessage(action.payload.message)
        }
    }

    return (
        <>
            <div className="badge-discount py-2 w-100 rounded-0 text-center"> <img src={DiscountIcon} className="me-1" alt="Discount" />Get <span className="fw-medium">20% extra</span> credits on purchases over <span className="fw-medium">₹2000!</span></div>
            <div className="bg-white overflow-y-auto p-20 d-flex flex-column justify-content-between" style={{ minHeight: 'calc( 100vh - 98px)' }}>
                <div>
                    <div className="px-3 available-credits">
                        <img src={CreditImg} width={19} className="me-2" />
                        Available Credits: {userCreditObj?.userCredit}
                    </div>
                    <div className="mt-3 w-100 rounded-4 p-3" style={{ background: '#FAF8F6' }}>
                        <div className="fw-semibold">Note:</div>
                        <ul className="fw-medium ps-4 mt-2 mb-0">
                            <li>1 Credit = <span className="fw-bold">₹ 1.00</span></li>
                            <li>To send 1 SMS: <span className="fw-bold">{userCreditObj?.defaultSMSCredit} credits</span> required</li>
                            <li>To send 1 WhatsApp message: <span className="fw-bold">{userCreditObj?.defaultWhatsAppCredit} credits</span> required</li>
                        </ul>
                    </div>
                    <div className="mt-3">
                        <Radio.Group className="w-100" onChange={onRadioGroupChange} value={creditRadio}>
                            {ITEMS?.map((e, i) => {
                                return (
                                    <div key={i} className="mb-3 border pe-3 rounded-4 d-flex align-items-center">
                                        <Radio className="py-3 ps-3 me-auto w-100" value={e.amount}>{`₹${e.amount} (${e.credit} credit)`}</Radio>
                                        {e.amount >= 2000 && (
                                            <div className="fs-12-1 fw-medium badge-discount"> <img src={DiscountIcon} className="me-1" alt="Discount" />Get extra 20%</div>
                                        )}
                                    </div>
                                )
                            })}
                        </Radio.Group>
                    </div>
                    <div>
                        <Input
                            className="p-3 rounded-4 text-suffix-credits"
                            placeholder="Or Enter Custom amount"
                            inputMode="numeric"
                            suffix={creditInput ?
                                parseInt(creditInput) >= 2000 ?
                                    `${parseInt(creditInput) + (parseInt(creditInput) * 20 / 100)} Credits`
                                    : `${creditInput} Credits`
                                : '0 Credits'}
                            value={creditInput}
                            onChange={onInputChange} />
                        {creditInput && parseInt(creditInput) >= 2000 && (
                            <div className='mt-1 text-green d-flex align-items-center'><i className="icon-check fs-5 ms-1"></i>Extra 20% credits applied to your purchase!</div>
                        )}
                    </div>
                </div>
                <div>
                    <Button className="mt-5 lh-lg btn btn-primary3 btn-54 w-100" onClick={clickBuyNow}>
                        <span>Buy Now</span>
                    </Button>
                </div>
            </div>
        </>
    );
}

export default React.memo(AvailableCredits);