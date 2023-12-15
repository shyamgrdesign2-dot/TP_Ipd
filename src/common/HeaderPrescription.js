import React, { useState } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Button, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePopover from './ProfilePopover';
import CommonModal from './CommonModal';
import alert from '../assets/images/alert.svg';

function HeaderPrescription() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const showModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <Container fluid className='h-100 gx-0 w-100'>
                <Row className='h-100 align-items-center w-100 justify-content-between'>
                    <Col lg="auto" className='h-100'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center'>
                                <Link onClick={showModal} className='btn-headerback align-items-center d-flex h-100 justify-content-around'>
                                    <i className='icon-right'></i>
                                </Link>
                                <CommonModal
                                    isModalOpen={isModalOpen}
                                    modalWidth={500}
                                    title={"You may lose your data"}
                                    modalBody={
                                        <>
                                            <div className="alert-warning rounded-10px p-2 patient-details">
                                                <div className="d-flex align-items-center">
                                                <img className='me-3' src={alert} alt="Warning" />
                                                    <span>
                                                        Are you sure you want to leave? <br />
                                                        You will permanently lose your data.
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="d-flex align-items-center mt-2 justify-content-end">
                                                    <Link to='/walk_in_consultation' className="me-4 text-decoration-underline btn p-0 text-main">
                                                        Yes Leave
                                                    </Link>
                                                    <Link onClick={closeModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                                        <span>No, Stay</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    }
                                />
                            </div>
                            <ProfilePopover />
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