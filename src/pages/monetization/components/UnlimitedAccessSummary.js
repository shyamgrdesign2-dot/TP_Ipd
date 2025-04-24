import React, { useState, useCallback, useMemo } from "react";
import { Dropdown, Card, Modal, Drawer, Input } from "antd";
import { Button, Col, Row } from "react-bootstrap";
import { DownOutlined } from '@ant-design/icons'
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import yearlyPlan from '../../../assets/images/year-plan-corner.svg'
import upgradedLogo from '../../../assets/images/upgraded-logo.svg'
import medcoAppScanner from '../../../assets/images/scanner-medco-app.svg'
import listIcon from '../../../assets/images/list-icon.svg'
import aiPowered from '../../../assets/images/ai-powered.svg'
import vaccinationImg from "../../../assets/images/Vaccination.svg";
import iconEdit from "../../../assets/images/edit.svg";
import logoSm from '../../../assets/images/logo-sm.svg';
import config from "../../../config";
import { errorMessage, formatAmount } from "../../../utils/utils";
import { paymentOrder, verifyPayment } from "../../../redux/monetizationSlice";

import "../GetUnlimitedAccess.scss";

function UnlimitedAccessSummary({ selectedServices, setSelectedServices }) {

    const { profile } = useSelector((state) => state.doctors);
    const { campaignsData } = useSelector((state) => state.monetization);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const showHideModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const showDrawer = () => {
        setDrawerOpen(true);
    };
    const onClose = () => {
        setDrawerOpen(false);
    };

    const handleValidity = useCallback((service_name, newValidity) => {
        setSelectedServices(prev =>
            prev.map(e =>
                e.service_name === service_name
                    ? { ...e, validity: newValidity }
                    : e
            )
        );
    }, [selectedServices]);

    const subTotal = useMemo(() => {
        return selectedServices.reduce(
            (sum, item) => sum + (parseFloat(item.service_cost) * item.validity),
            0
        );
    }, [selectedServices]);

    const getMenuItems = (service_name) => {
        return [
            {
                label: <div onClick={() => handleValidity(service_name, 1)}>1 Year</div>,
                key: '1',
            },
            {
                label: <div onClick={() => handleValidity(service_name, 2)}>2 Year</div>,
                key: '2',
            },
            {
                type: 'divider',
                key: '0',
            },
            {
                label: <div onClick={() => handleValidity(service_name, 3)}>3 Year</div>,
                key: '3',
            }
        ]
    };

    const settings = {
        infinite: true,
        speed: 500,
        dots: true,
        arrows: true,
        adaptiveHeight: false,
        autoplay: false,
    };

    const totalAmount = useMemo(() => {
        return campaignsData?.campaign_active ? formatAmount(subTotal - (subTotal * parseFloat(campaignsData?.campaign_value) / 100)) : formatAmount(subTotal);
    }, [selectedServices]);

    const clickBuyNow = async () => {
        let sendData = {
            amount: totalAmount,
        }
        const action = await dispatch(paymentOrder(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            if (action?.payload?.hasOwnProperty("id")) {
                initRazorPayPayment(action?.payload);
            } else {
                typeof action?.payload?.data?.error === 'object' ?
                    errorMessage(action?.payload?.data?.error?.description)
                    :
                    errorMessage(action?.payload?.data?.message)
            }
        } else {
            errorMessage(action.payload.message)
        }
    }

    const initRazorPayPayment = (data) => {
        const options = {
            key: config.razorPay_key,
            amount: data.amount,
            currency: data.currency,
            name: 'Tatvacare',
            description: 'Credit Top-Up',
            image: logoSm,
            order_id: data.id,
            handler: async (response) => {
                try {
                    verifyRazorPayPayment(response, data)
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
                color: "#4B4AD5",
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

    const verifyRazorPayPayment = async (r_response, data) => {
        const action = await dispatch(verifyPayment(r_response));
        if (action.meta.requestStatus === "fulfilled") {
            if (action?.payload?.hasOwnProperty("id") && action?.payload?.status === 'captured') {

            } else {
                typeof action?.payload?.data?.error === 'object' ?
                    errorMessage(action?.payload?.data?.error?.description)
                    :
                    errorMessage(action?.payload?.data?.message)
            }
        } else {
            errorMessage(action.payload.message)
        }
    }

    return (
        <>
            <div className="unlimited-access-summary ">
                <div className="fs-4 fw-semibold">Summary</div>
                {selectedServices?.map((item, index) => {
                    return (
                        <div key={index} className="d-flex justify-content-between my-4">
                            <div className="fs-18">{`${item?.service_display_name}:`}
                                <div className="d-flex align-items-baseline">
                                    <img className="ms-1" src={yearlyPlan} alt="icon" />
                                    <div className="d-flex align-items-center">
                                        <Dropdown menu={{ items: getMenuItems(item?.service_name) }} className="fs-14 fw-medium text-primary py-1 px-2 dd-yearly" trigger={['click']}>
                                            <a onClick={e => e.preventDefault()}>
                                                {`${item?.validity} Year`}
                                                <DownOutlined className="ps-2 fs-14 fw-medium text-primary" />
                                            </a>
                                        </Dropdown>
                                        <i className="icon-info fs-6 text-black-50 ms-2"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="fs-18 fw-medium">
                                {`₹${formatAmount(parseFloat(item.service_cost) * item.validity)}`}
                            </div>
                        </div>
                    )
                })}
                <hr />
                <div className="d-flex justify-content-between my-3">
                    <div className="fs-18">Subtotal:</div>
                    <div className="fs-18 fw-medium">{`₹${formatAmount(subTotal)}`}</div>
                </div>
                <div className="d-flex justify-content-between my-3">
                    <div className="fs-18">Flat Discount:</div>
                    <div className="fs-18 fw-medium text-discount">{`-₹${campaignsData?.campaign_active ? formatAmount(subTotal * parseFloat(campaignsData?.campaign_value) / 100) : 0}`}</div>
                </div>
                <hr />
                <div className="d-flex justify-content-between my-3">
                    <div className="fs-4 text-welcome fw-semibold">Total Amount:</div>
                    <div className="fs-4 text-welcome fw-semibold">{`₹${totalAmount}`}</div>
                </div>

                <Button className="btn btn-proceed btn-primary3 my-4" onClick={clickBuyNow}>
                    {`Proceed to Pay ₹${totalAmount}`}
                </Button>
                <div className="text-center">
                    <Link className="text-decoration-underline fw-medium text-primary" onClick={showDrawer}>Have a sales referral code?</Link>
                </div>
            </div>
            <Drawer
                placement="right"
                open={drawerOpen}
                className='bg-body'
                closeIcon={false}
                width={539}
            >
                <div className="modalCard-header h-60 position-sticky top-0 z-2">
                    <div className="align-items-center d-flex h-100">
                        <div className="border-end h-100 text-center me-3">
                            <div onClick={onClose}
                                className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer">
                                <i className="icon-right"></i>
                            </div>
                        </div>
                        <div className="title-common">Referral Code</div>
                    </div>
                    <div className="p-4">
                        {/* OTP Mobile Number */}
                        {/* <div className="fontroboto mb-2">Enter Sales Mobile Number <sup className="text-danger-custom fs-14">*</sup></div>
                        <Input className="inputheight45 rounded-10px" />
                        <Button className="btn btn-proceed btn-primary3 fs-18 my-4" onClick={showModal}>
                            Continue
                        </Button> */}

                        {/* OTP Code */}
                        {/* <div className="fontroboto mb-2 text-1F2933">Enter OTP sent to <span className="fw-bold text-decoration-underline text-1F2933">+91-9344414944</span> <img className="ms-2 cursor-pointer" height={16} src={iconEdit} /></div>
                        <Input.OTP className="input-otp-size45" length={6} />
                        <div className="fontroboto mt-3">Didn’t receive OTP? <Link className="text-decoration-underline fw-semibold text-primary">Resend OTP</Link></div>
                        <Button className="btn btn-proceed btn-primary3 my-4 fs-18" onClick={showModal}>
                            Continue
                        </Button> */}

                        {/* Discount Amount */}
                        <div className="fontroboto mb-2">Enter Sales Discount Amount <sup className="text-danger-custom fs-14">*</sup></div>
                        <Input className="inputheight45 rounded-10px fw-medium" placeholder="0" prefix="₹" />
                        <div className="discount-amount-box p-4 mt-4">
                            <div className="d-flex align-items-center justify-content-between py-2">
                                <div>TatvaPractice EMR (1 year):</div>
                                <div className="fw-medium text-green">₹12,999</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between py-2">
                                <div>Flat Discount:</div>
                                <div className="fw-medium text-green">-₹3000</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between py-2">
                                <div>Sales Discount:</div>
                                <div className="fw-medium text-green">-₹0</div>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center justify-content-between py-2">
                                <div className="text-welcome fw-semibold fs-18">Total Amount :</div>
                                <div className="text-welcome fw-semibold fs-18">₹9,999</div>
                            </div>
                        </div>
                        <Button disabled className="btn btn-proceed btn-primary3 fs-18 my-4" onClick={() => { }}>
                            Continue
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Modal
                open={isModalOpen}
                closeIcon={false}
                footer={null}
                width={750}
                onCancel={showHideModal}
                className="upgraded-model"
                destroyOnClose>
                <Card
                    extra={
                        <button className="btn p-1 lh-1 btnclose closeButton" onClick={showHideModal}>
                            <i className="icon-Cross"></i>
                        </button>
                    }>
                    <>
                        <img src={upgradedLogo} alt="upgraded to premium" />
                        <div className="fs-2 fw-bold mt-3">
                            You have upgraded to premium
                        </div>
                        <div className="mt-3"> Here’s what’s now available to you.</div>
                        <Slider
                            {...settings}
                            slidesToShow={1}>
                            <div className='upgraded-premium-box w-92'>
                                <Row>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">OPD Management</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Digital Rx Delivery</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Appointment Management</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Automated Follow-up Remainder</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Comprehnsive Patient Record</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Dedicated Support</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Specialised Rx Pad</div>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="py-2">
                                        <div className="d-flex align-items-center">
                                            <img className="mx-2" src={listIcon} alt="icon" />
                                            <div className="fs-14 fw-medium text-price text-start">Appointment scheduling </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Button className="btn btn-proceed btn-primary3 w-100 mt-4">
                                    Start Exploring
                                </Button>
                            </div>
                            <div className='upgraded-premium-box w-92'>
                                <Row>
                                    <Col lg={6}>
                                        <div className="py-3 upgrade-addon-box">
                                            <div>
                                                <div className="fs-18 d-flex align-items-center text-welcome fw-semibold my-2 text-truncate">
                                                    <img style={{ background: '#EDD6FF' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" />
                                                    Voice Rx
                                                    <img className="ms-3" src={aiPowered} alt="Icon" />
                                                </div>
                                                <div className="text-start">
                                                    AI-powered Voice Rx generation for seamless patient care
                                                </div>
                                            </div>
                                            <Button className="btn btn-outline-primary w-100 mt-4 mb-3">
                                                Know more
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="py-3 upgrade-addon-box">
                                            <div className="fs-18 d-flex align-items-center text-welcome fw-semibold my-2 text-truncate">
                                                <img style={{ background: '#EDD6FF' }} className="p-1 rounded-10px me-2" src={vaccinationImg} alt="Icon" />
                                                Ask Tatva
                                                <img className="ms-3" src={aiPowered} alt="Icon" />
                                            </div>
                                            <div className="text-start">
                                                Access reliable AI-driven medical insights from PubMed
                                            </div>
                                            <Button className="btn btn-outline-primary w-100 mt-4 mb-3">
                                                Know more
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='upgraded-premium-box w-92'>
                                <div className="w-75 mx-auto px-3">
                                    <div className="fs-18 fw-semibold"> Scan the Below QR to Download MedEco App</div>
                                    <img className="mx-auto my-4" src={medcoAppScanner} alt="Medco App QR Code" />
                                    <div>Enhance your clinical practice and stay updated with the latest medical insights. <Link className="text-decoration-underline fw-medium text-primary">Know More</Link></div>
                                </div>
                            </div>
                        </Slider>
                    </>
                </Card>
            </Modal>
        </>
    );
}

export default UnlimitedAccessSummary;
