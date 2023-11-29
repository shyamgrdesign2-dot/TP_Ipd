import React from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Button, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

function HeaderPrescription() {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Print Rx',
            key: 'printrx',
        },
        {
            label: 'Clear',
            key: 'clear',
        }
    ];

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <Container fluid className='h-100 gx-0 w-100'>
                <Row className='h-100 align-items-center w-100 justify-content-between'>
                    <Col lg="auto" className='h-100'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center me-3'>
                                <Link to='/walk_in_consultation' className='btn-headerback align-items-center d-flex h-100 justify-content-around'>
                                    <i className='icon-right'></i>
                                </Link>
                            </div>
                            <div className='rounded-pill patientProfile border me-3'>
                                AP
                            </div>
                            <div className='patientName'> Ashish Patel,</div>
                            <div className='text-2 me-30'>&nbsp;M, 28y, +91-7894561230</div>
                            <div className='fontroboto text14 d-flex align-items-center'> <i className='icon-calendar me-2'></i> 9-10-2023</div>
                        </div>
                    </Col>
                    <Col lg="auto">
                        <div className='align-items-center d-flex h-100'>
                            <Link to='/' className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                <i className='icon-template me-2'></i> <span className='text-decoration-underline'>Templates</span>
                            </Link>
                            <Link to='/' className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                <i className='icon-setting me-2'></i> <span className='text-decoration-underline'>Customize Your Pad</span>
                            </Link>
                            <Button type="link" className='p-0 me-30'>
                                <i className='icon-Preview text-main'></i>
                            </Button>
                            <Button type="link" className='p-0 me-30'>
                                <i className='icon-Print text-main'></i>
                            </Button>
                            <Button type='primary' className='btn btn-41 me-30'>
                                Finish Prescription
                            </Button>
                            <Dropdown className='btn btn-outline btn-more me-2 p-0' menu={{ items, }} trigger={['click']}>
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

export default React.memo(HeaderPrescription);