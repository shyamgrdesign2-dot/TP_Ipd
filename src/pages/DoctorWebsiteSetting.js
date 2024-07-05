import React from "react";
import { Col, Progress, Row } from "antd";
import { isMobile } from "react-device-detect";
import HeaderDoctorWebsite from "../components/DoctorProfile/HeaderDoctorWebsite";

import cloudSaved from "../../src/assets/images/cloud-saved.svg";

function DoctorWebsiteSetting() {
    return (
        <>
            <HeaderDoctorWebsite />
            <div className={'w-100 bg-body wrapper2'}>
                <Row justify="space-between">
                    <Col xl={8} lg={10} className="pe-3">
                        <div className="bg-white overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                            <div className="p-4">
                                <Progress percent={30} />
                            </div>
                        </div>
                    </Col>
                    <Col xl={16} lg={14}>
                        <div className="mx-auto overflow-y-auto " style={{ width: isMobile ? 580 : 900 }} >
                            <div className="mt-20 d-flex align-items-center justify-content-between">
                                <div className="titleprint">Preview</div>
                                <div> <img src={cloudSaved} className="me-1" /> Saved</div>
                            </div>
                            <div className="rounded-20px bg-white mt-2 overflow-hidden">
                                <div className="position-relative printheight">
                                    123
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default DoctorWebsiteSetting;