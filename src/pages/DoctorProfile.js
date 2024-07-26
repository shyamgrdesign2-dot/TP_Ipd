import React from "react";
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Flex, Progress, Button } from 'antd';
import { makeDefaultLogo } from "../utils/utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import defaultprofile from "../assets/images/default-profile.svg";

import ProfilePersonalDetailsView from "../components/doctor_profile/ProfilePersonalDetailsView";
import ProfileClinicView from "../components/doctor_profile/ProfileClinicView";

function DoctorProfile() {

  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.doctors);
  
  return (
    <>
      <Navbar className="justify-content-between headerprescription p-0">
        <Container fluid className='h-100 gx-0 w-100'>
          <Row className='h-100 align-items-center w-100 justify-content-between'>
            <Col lg="auto" className='h-100'>
              <div className='align-items-center d-flex h-100'>
                <div className='border-end h-100 text-center'>
                  <div onClick={() => navigate('/', { replace: true })} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                    <i className='icon-right'></i>
                  </div>
                </div>
                <div className='ms-3 title-common'>My Profile</div>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <div className="bg-body p-30 overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
        <Container fluid='lg'>
          <div className="mb-4">
            <div className="p-20 rounded-20px rounded-bottom-0" style={{ backgroundColor: 'rgba(237, 223, 247, 0.30)' }}>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {profile?.um_image ? (
                    <img
                      src={profile?.um_image ?? defaultprofile}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "90px" }}
                    />
                  ) : (
                    <div className='rounded-pill patientProfile patientProfile90 border'>{makeDefaultLogo(profile?.um_name)}</div>
                  )}
                </div>
                <div>
                  <div className="title-hypertension text-welcome">{(profile?.um_name)}</div>
                  <div className="title-common">{(profile?.dp_name)}</div>
                </div>
              </div>
            </div>
            <div className="p-20 rounded-20px rounded-top-0 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center web-progress-custom">
                  <Flex gap="small" wrap>
                    <Progress type="circle" size="small" percent={11} />
                  </Flex>
                  <div className="ms-3">
                    <div className="title-common text-welcome">Let's setup your website</div>
                    <div className="fs-14">Start showcasing your sites by completing your details.</div>
                  </div>
                </div>
                <div>
                  <Button type="text" onClick={() => navigate('/doctor_website_setting')} className="btn btn-input align-items-center d-flex btn-41 w-100" icon={<i className="icon-group fs-21" />}>
                    Setup Website
                    <i className="icon-right iconrotate180 ms-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <ProfilePersonalDetailsView />
          </div>
          <div className="mb-4">
            <ProfileClinicView />
          </div>
        </Container>
      </div>
    </>
  );
}

export default DoctorProfile;
