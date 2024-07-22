import React from "react";
import Location from '../assets/images/location.svg'
import Mail from '../assets/images/mail.svg'
import DoctorProfile from '../assets/images/doctor-img.png'
import { Button, Col, Row } from "antd";

import websiteLogo from '../assets/images/logo.png'

import "../assets/scss/website-custom.scss";

function Homepage() {
  return (
    <div className="website-wrapper">
      <div className='website-header'>
        <Row className='align-items-center' justify="space-between">
          <Col span={18}>
            <div className='d-flex align-items-center justify-content-between'>
              <img src={websiteLogo} width={151.29} height={35} alt="Logo" />
              <ul className='mb-0'>
                <li>
                  <a href='#'>About</a>
                </li>
                <li>
                  <a href='#'>Clinic</a>
                </li>
                <li>
                  <a href='#'>Services</a>
                </li>
                <li>
                  <a href='#'>Experience</a>
                </li>
              </ul>
            </div>
          </Col>
          <Col>
            <Button type="button" className="btn btn-primary3 rounded-18 btn-41">
              Book Appointment
            </Button>
          </Col>
        </Row>
      </div>
      <div className="website-banner">
        <Row>
          <Col lg={12}>
            <div className="hi text-welcome">Hi, I'm</div>
            <h1 className="doctor-name mb-20 text-welcome">Dr. Kunal Shah</h1>
            <div className="fs-18 mb-15 text-welcome">MBBS, MD - Anaesthesiology</div>
            <div className="d-flex mb-5">
              <div className="location-contact text-welcome"> <img src={Location} width={18} height={18} alt="Location" /> Ahmedabad</div>
              <div className="location-contact text-welcome"> <img src={Mail} width={18} height={18} alt="Location" /> contact@aayushyamclinic.com</div>
            </div>
            <Button type="button" className="btn btn-primary3 rounded-18 btn-41">
              Book Appointment
            </Button>
          </Col>
          <Col lg={12}>
            <div className='round-pink'></div>
            <div className='doctor-photo'>
              <img src={DoctorProfile} alt="Doctor Profile" />
            </div>
            <div className='square-yellow'></div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default React.memo(Homepage);
