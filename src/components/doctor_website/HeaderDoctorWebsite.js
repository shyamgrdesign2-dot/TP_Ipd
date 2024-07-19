import React, { useContext } from 'react';
import { Button, Dropdown } from 'antd';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';

function HeaderDoctorWebsite() {

    const navigate = useNavigate();

    const { personalDetails, aboutDoctor, doctorExperience, rewardRecognition, services, socialLinks, membership, educationTraining, otherSettings } = useContext(DoctorWebsiteSettingsContext);

    const items = [
        {
            label: <div>Unpublish Website</div>,
            key: 'UnPublish',
        },
    ];

    async function onPublishWebsiteClick() {
        console.log("personalDetails", personalDetails)
        console.log("aboutDoctor", aboutDoctor)
        console.log("doctorExperience", doctorExperience)
        console.log("rewardRecognition", rewardRecognition);
        console.log("membership", membership);
        console.log("socialLinks" ,socialLinks);
        console.log("services" ,services);
        console.log("educationTraining", educationTraining);
        console.log("otherSettings", otherSettings);
    }

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <Container fluid className='h-100 gx-0 w-100'>
                <Row className='h-100 align-items-center w-100 justify-content-between'>
                    <Col sm="auto" className='h-100'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center'>
                                <div onClick={() => navigate(-1)} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
                                </div>
                            </div>
                            <div className='ms-3 title-common'>Setup Website</div>
                        </div>
                    </Col>
                    <Col sm="auto">
                        <div className='align-items-center d-flex'>
                            <button className='btn d-flex align-items-center btn-text me-14'>
                                <i className="icon-New-Window me-2"></i> <span>Live Reference Demo</span>
                            </button>
                            <button className='btn d-flex align-items-center btn-text me-14'>
                                <i className="icon-Preview me-2"></i> <span>Your Website Preview</span>
                            </button>
                            <Button type='button' className="btn-41 btn px-4 btn-primary3 align-items-center d-flex" onClick={onPublishWebsiteClick}>
                                <i className="icon-New-Window me-2"></i> Publish Website
                            </Button>
                            <Dropdown className='btn btn-outline btn-more p-0 ms-3' menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <i className='icon-More'></i>
                                </a>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default HeaderDoctorWebsite;
