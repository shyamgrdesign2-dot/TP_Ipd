import React from "react";
import { Button } from "antd";
import { Col, Row } from "react-bootstrap";
import crown from '../../../assets/images/crown.svg'

function ExpiredText({ title }) {

    return (
        <div className="position-sticky bottom-0 bg-white w-100 px-4 py-3">
            <div className="fontroboto fs-16 text-center text-danger-custom">
                Your <span className="fw-bold text-danger-custom">{title} free trail</span> has expired. <br />
                Upgrade now to continue a hassle free experience!
            </div>
            <Row className="mt-2">
                <Col lg={6}>
                    <Button type='button' className='w-100 btn ant-btn align-items-center justify-content-center d-flex btn-41 btn-primary1 btn-outline-primary' style={{ height: 52 }}>
                        <i className='icon-phone me-2'></i>
                        Request a call back
                    </Button>
                </Col>
                <Col lg={6}>
                    <Button className="btn btn-proceed btn-primary3 w-100 align-items-center justify-content-center d-flex">
                        <img className="me-2" src={crown} alt="Crown" />
                        Get Unlimited Access
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default React.memo(ExpiredText);
