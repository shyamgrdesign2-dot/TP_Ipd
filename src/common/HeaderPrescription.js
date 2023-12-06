import React, { useState } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Button, Dropdown, Popover } from 'antd';
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

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const content = (
        <div className='pop-body'>
            <div className="align-items-center d-flex justify-content-between medicine-templates without-hover">
                <div className="round-box"><i className="icon-template"></i></div>
                <div className="text-truncate">
                    <div className="title">Template name</div>
                    <div className="text-truncate">Pan 40 Tablet, Telma20 Tablet, Pan 40 Tablet</div>
                </div>
            </div>
        </div>
    )

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <Container fluid className='h-100 gx-0 w-100'>
                <Row className='h-100 align-items-center w-100 justify-content-between'>
                    <Col lg="auto" className='h-100'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center'>
                                <Link to='/walk_in_consultation' className='btn-headerback align-items-center d-flex h-100 justify-content-around'>
                                    <i className='icon-right'></i>
                                </Link>
                            </div>
                            <Popover
                                content={content}
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}
                                className='cursor-pointer'
                            >
                                <div className='align-items-center d-flex h-100 ps-3'>
                                    <div className='rounded-pill patientProfile border me-3'>
                                        AP
                                    </div>
                                    <div>
                                        <div className='patientName'> Ashish Patel</div>
                                        <div className='text-2 me-30'>M, 28y</div>
                                    </div>
                                    <div className='iconrotate270 align-self-start'>
                                        <i className='icon-right me-3'></i>
                                    </div>
                                </div>
                            </Popover>
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
                            <Link to='/prescription_print_view'>
                                <Button type='primary' className='btn btn-41 me-30'>
                                    Finish Prescription
                                </Button>
                            </Link>
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