import React, { useState, useCallback } from "react";
import { Button, Drawer, Popover, Steps, Radio } from 'antd';
import { Col, Container, Row } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import VideoModal from "../common/VideoModal";

import messageCorner from '../assets/images/message-corner.svg'
import CreditImg from "../assets/images/credit_icon.svg"
import tutorial from '../assets/images/tutorial-icon.svg';
import messageCornerGrey from '../assets/images/message-corner-grey.svg'

import "../components/bulk_messages/messages.scss";
import MessageAvailableCredits from "../components/bulk_messages/MessageAvailableCredits";

function MessageCreateCampaign() {
    const navigate = useNavigate();
    const [popOverVideo, setPopOverVideo] = useState(false);
    const [videoLink, setVideoLink] = useState(null);
    const [messageDetailed, setMessageDetailed] = useState(false);
    const [stepCurrent, setStepCurrent] = useState(0);

    //PopOverVideo function
    const showHideVideoListPopover = useCallback(() => {
        setPopOverVideo(!popOverVideo);
    }, [popOverVideo]);

    const handleMessageDetailed = useCallback(
        () => {
            setMessageDetailed(!messageDetailed)
        },
        [messageDetailed]
    );

    //Video Componet
    const VIDEO_CONTENT = useCallback(() => {
        return (
            <>
                <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
                    <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
                        <div className="title-common lh-base">Video Tutorial</div>
                    </div>
                </div>
            </>
        );
    }, [popOverVideo]);

    const next = () => {
        setStepCurrent(stepCurrent + 1);
    };

    const prev = () => {
        setStepCurrent(stepCurrent - 1);
    };

    return (
        <>
            <div className='modalCard-header align-items-center d-flex justify-content-between'>
                <div className="align-items-center d-flex">
                    <div className='border-end h-100 text-center'>
                        <Button className='btn btn-delete-prescription px-3 h-100' onClick={() => navigate(-1)}>
                            <i className='icon-right lh-lg'></i>
                        </Button>
                    </div>
                    <div className="w-100 px-20 fs-16 fw-semibold">Create Campaign</div>
                </div>
                <div className="align-items-center d-flex">
                    <Popover
                        open={popOverVideo}
                        onOpenChange={showHideVideoListPopover}
                        content={VIDEO_CONTENT}
                        trigger="click"
                        overlayClassName="pop-430 pp-0 videoTutorial"
                        placement="bottom"
                    >
                        <button className='btn d-flex align-items-center btn-text me-10 tutorial'>
                            <span className='text-decoration-none rounded-5 pe-3 bg-white shadow2'><img height={42} src={tutorial} />Tutorial</span>
                        </button>
                    </Popover>
                    {videoLink && (
                        <VideoModal
                            videoLink={videoLink}
                            onCancel={() => setVideoLink(null)}
                        />
                    )}
                    <Button
                        onClick={handleMessageDetailed}
                        className="px-3 btn-41 btn-message d-flex align-items-center me-3">
                        <img src={CreditImg} width={19} className="me-2" />
                        {"Available Credits: 0"}
                    </Button>
                    <Button type="text" className="btn btn-primary1 me-3 btn-41 px-4 d-flex align-items-center" onClick={() => prev()}>
                        Back
                    </Button>
                    <Button className='btn btn-primary3 me-30 btn-41 px-4 d-flex align-items-center' onClick={() => next()}>
                        Next
                    </Button>
                </div>
            </div >
            <div className="bg-body">
                <Container>
                    <Row className="justify-content-center py-5">
                        <Col xs={6}>
                            <Steps
                                className="campaign-steps"
                                current={stepCurrent}
                                items={[{}, {}, {}]}
                            />
                            <div className="mt-3 d-flex align-items-center justify-content-between">
                                <div className="fontroboto fs-14 fw-medium" style={{ marginLeft: -33 }}>Choose template</div>
                                <div className="fontroboto fs-14 fw-medium" style={{ marginLeft: -23 }}>Configure</div>
                                <div className="fontroboto fs-14 fw-medium" style={{ marginRight: -5 }}>Summary</div>
                            </div>
                        </Col>
                    </Row>

                    {stepCurrent === 0 ? (
                        <>
                            <Row className="justify-content-between my-3">
                                <Col className="px-3 px-xl-4">
                                    <div className="titleprint fw-semibold">
                                        Choose a template from below
                                    </div>
                                </Col>
                                <Col className="px-3 px-xl-4">
                                    <div className="text-end">
                                        All Template
                                    </div>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Hi, {'clinic name'} wishes you a Happy New Year 2024! May this year bring Peace, Health, and Happiness to you and yours.
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Hello, We wish you good health on the occasion of {'festival name'} from {'clinic name'}. Sent via TatvaPractice
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Consult with me online via video call using TatvaPractice App. Click to install: {'link'}TatvaPractice-app For directions to book appointments click{'link'} Regards, Dr. {'Doctor Name'} -TatvaPractice
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Hi, {'clinic name'} wishes you a Happy New Year 2024! May this year bring Peace, Health, and Happiness to you and yours.
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Hi, {'clinic name'} wishes you a Happy New Year 2024! May this year bring Peace, Health, and Happiness to you and yours.
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Hi, {'clinic name'} wishes you a Happy New Year 2024! May this year bring Peace, Health, and Happiness to you and yours.
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Hi, {'clinic name'} wishes you a Happy New Year 2024! May this year bring Peace, Health, and Happiness to you and yours.
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Hi, {'clinic name'} wishes you a Happy New Year 2024! May this year bring Peace, Health, and Happiness to you and yours.
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4} className="px-3 px-xl-4 mb-4 mb-xl-5">
                                    <div className="message-box">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 className="fs-16 mb-0 fw-semibold" style={{ color: '#000044' }}>New year wish</h5>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="mt-4 fs-14">
                                            Hi, {'clinic name'} wishes you a Happy New Year 2024! May this year bring Peace, Health, and Happiness to you and yours.
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) : stepCurrent === 1 ? (
                        <>
                            <div className="titleprint fw-semibold my-3">
                                Configure “Medical Camp” Template
                            </div>

                            <Row className="justify-content-between">
                                <Col xl={7} xs={8}>
                                    <div className="configure-template">
                                        <h5 className="fs-16 mb-0 fw-semibold">Send on</h5>
                                        <div className="mt-3">
                                            <Radio.Group className="d-flex">
                                                <Radio className="col" value={true}>SMS</Radio>
                                                <Radio className="col me-0" value={false}>WhatsApp</Radio>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="sms-preview">
                                        <div className="text-center fs-14 mb-0 fw-medium fontroboto">SMS Preview</div>
                                        <div className="sms-preview-mobile">
                                            <div className="sms-preview-message rounded-4 p-2">Hi, {'clinic name'} is holding a {'camp name'} camp from {'start date'} to {'end date'} at {'clinic address'} . Regards,  {'Doctor  Name'} - TatvaPractice
                                                <img className="position-absolute" style={{ left: -2, bottom: -3 }} src={messageCornerGrey} alt="Message" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="fontroboto fs-18 fw-bold text-black">Credit Details</div>
                                        <div className="fs-12-1 fw-semibold fontroboto text-black-50">( 1SMS = 0.15 Credits)</div>
                                        <div className="my-3">
                                            <div className="d-flex align-items-center py-1 justify-content-between fs-14 fontroboto">
                                                <div className="fontroboto fw-bold">Target Customers (A) :</div>
                                                <div className="fontroboto fw-bold">524 User</div>
                                            </div>
                                            <div className="d-flex align-items-center py-1 justify-content-between fs-14 fontroboto">
                                                <div className="fontroboto fw-bold">SMS Per Customers (B) :</div>
                                                <div className="fontroboto fw-bold">1 SMS</div>
                                            </div>
                                            <div className="d-flex align-items-center py-1 justify-content-between fs-14 fontroboto">
                                                <div className="fontroboto fw-bold">Price Per SMS (C) :</div>
                                                <div className="fontroboto fw-bold">0.15 Credits</div>
                                            </div>
                                            <hr className="my-2" />
                                            <div className="d-flex align-items-center justify-content-between fs-14 fontroboto">
                                                <div className="fontroboto fw-bold">Target Customers(A) :</div>
                                                <div className="fontroboto fw-bold">524 User</div>
                                            </div>
                                            <hr />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <>
                            <div className="configure-template overflow-y-auto w-75 mx-auto">
                                <div className="fs-18 lh-base">
                                    The below <span className="fw-semibold">Medical Camp</span> message will be sent on <span className="fw-semibold">07/11/2024</span> at <span className="fw-semibold">12:00 AM </span> via <span className="fw-semibold">SMS</span> to <span className="fw-semibold"> 524 male patients </span> of age between <span className="fw-semibold"> 20-40 years </span> who visited in the <span className="fw-semibold"> last 1 month</span>
                                </div>

                                <div className="bg-selected w-100 mt-4 rounded-20px d-flex justify-content-center align-items-center" style={{ height: 138 }}>
                                    <div className="bg-white w-60 fw-medium rounded-4 p-3 position-relative">Hi, Healthion Clinic is holding a Diabities camp from 20-08-2024 to 22-08-2024 at 2nd block, Koramangla. Regards, Shyam GR - TatvaPractice
                                        <img className="position-absolute" style={{ left: -2, bottom: -3 }} src={messageCorner} alt="Message" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="fontroboto text-black fw-bold title-hypertension">Credit Details</div>
                                    <div className="title-common my-2 text-black-50">( 1SMS = 0.15 Credits)</div>

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
                    )}




                </Container>
            </div>

            <Drawer
                className="modalWidth-645" width="auto"
                title="Buy Message Credits"
                placement="right"
                closable
                open={messageDetailed}
                onClose={handleMessageDetailed}
            >
                <MessageAvailableCredits />
            </Drawer>
        </>
    );
}

export default React.memo(MessageCreateCampaign);