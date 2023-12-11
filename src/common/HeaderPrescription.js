import React, { useState } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Button, Dropdown, Popover } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

function HeaderPrescription() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const items = [
        {
            label: 'Clear',
            key: 'clear',
        },
    ];

    const languageItems = [
        {
            label: '1st menu item',
            key: '0',
        },
        {
            label: '2nd menu item',
            key: '1',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const content = (
        <>
            <div className="align-items-center d-flex medicine-templates without-hover px-0 pt-0 pb-3">
                <div className="round-box bg-body-secondary"><i className="icon-Id fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Patient Id</div>
                    <div className="fontroboto letterspacing fw-medium">PI202306001</div>
                </div>
            </div>
            <div className="align-items-center d-flex medicine-templates without-hover px-0 pt-0">
                <div className="round-box bg-body-secondary"><i className="icon-phone fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Mobile Number</div>
                    <div className="fontroboto letterspacing fw-medium">7894651230</div>
                </div>
            </div>
            <div>
                <Button className='btn btn-primary2 d-flex justify-content-center align-items-center w-100 mt-3 btn-41'>
                    <i className='icon-Edit me-2 fs-21'></i>
                    Edit Profile
                </Button>
                <Button className='btn btn-primary2 align-items-center d-flex justify-content-center w-100 mt-3 btn-41'>
                    <i className='icon-Visit-Summary fs-21 me-2'></i>
                    Visit Summary
                </Button>
            </div>
        </>
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
                                overlayClassName="pop-260 pp-20"
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
                                <i className='icon-save me-2'></i> <span className='text-decoration-underline'>Save</span>
                            </Link>
                            <Link to='/' className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                <i className='icon-setting me-2'></i> <span className='text-decoration-underline'>Customize</span>
                            </Link>

                            <Dropdown
                                menu={{
                                    languageItems,
                                }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()} className='text-main align-items-center d-flex fw-medium text14 me-30'>
                                    <i className='icon-language me-2'></i>
                                    <span className='text-decoration-underline'>English</span>
                                    <i className='icon-right iconrotate270 ms-1'></i>
                                </a>
                            </Dropdown>

                            <Link to='/prescription_print_view' onClick={() => window.print()}>
                                <Button className='btn align-items-center d-flex btn-41 btn-input me-20'>
                                    <i className='icon-Print me-2'></i>
                                    Print
                                </Button>
                            </Link>
                            <Link to='/prescription_print_view'>
                                <Button className='btn align-items-center d-flex btn-41 btn-primary3 me-20'>
                                    <i className='icon-exit me-2'></i>
                                    End Visit
                                </Button>
                            </Link>
                            <Dropdown className='btn btn-outline btn-more p-0' menu={{ items }} trigger={['click']}>
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