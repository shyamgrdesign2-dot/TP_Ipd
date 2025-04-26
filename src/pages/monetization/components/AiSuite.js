import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, Drawer } from "antd";

import Vitals from "../../../assets/images/Vitals.svg";
import purchased from "../../../assets/images/purchased.png";
import expired from "../../../assets/images/expired.png";

function AiSuite({ aiModal, handleAiSuite }) {

    return (
        <Drawer
            placement="right"
            open={aiModal}
            closeIcon={false}
            onClose={handleAiSuite}
            width={600}>
            <div className="modalCard-header h-60 position-sticky top-0 z-2">
                <div className="align-items-center d-flex h-100">
                    <div className="border-end h-100 text-center me-3">
                        <div onClick={handleAiSuite}
                            className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer">
                            <i className="icon-right"></i>
                        </div>
                    </div>
                    <div className="fs-18 fw-semibold">AI Suit</div>
                </div>
            </div>
            <div className="px-4 h-100 bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>

                <div className="ai-suite ai-purchased my-4">
                    <Row className="align-items-center">
                        <Col lg={8}>
                            <div className="d-flex align-items-center mb-2">
                                <img src={Vitals} style={{ background: '#E6C3FF80' }} className="p-1 rounded-10px me-2" />
                                <div className="fs-18 fw-semibold text-1F2933">Voice Rx</div>
                                <img src={purchased} className="ms-2" />
                            </div>
                            <p className="mb-0">
                                AI-powered Voice Rx generation for seamless patient care Know more&nbsp;
                                <Link className="text-decoration-underline fw-medium text-primary">Know more</Link>
                            </p>
                        </Col>
                        <Col lg={4} className="text-center">
                            <div className="text-themesecondarylight fs-12-1">Valid till</div>
                            <div className="text-secondary-custom fw-semibold">27th Jun 2026</div>
                        </Col>
                    </Row>
                </div>

                <div className="ai-suite ai-expired my-4">
                    <div className="d-flex align-items-center mb-3">
                        <img src={Vitals} style={{ background: '#EDDFF780' }} className="p-1 rounded-10px me-2" />
                        <div className="fs-18 fw-semibold text-1F2933">Ask Tatva</div>
                        <img src={expired} className="ms-2" />
                    </div>
                    <p>
                        AI-powered Voice Rx generation for seamless patient care, AI-powered Voice Rx generation for seamless patient care
                    </p>
                    <Row className="mt-4">
                        <Col lg={6}>
                            <Button className='w-100 btn ant-btn btn-41 btn-primary1 btn-outline-primary'>
                                Know More
                            </Button>
                        </Col>
                        <Col lg={6}>
                            <Button className="btn btn-primary3 btn-41 w-100">
                                Buy Now
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Drawer>
    );
}

export default React.memo(AiSuite);
