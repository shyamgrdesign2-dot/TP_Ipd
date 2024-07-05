import React from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function HeaderDoctorProfile() {
    const navigate = useNavigate();
    
    return (
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
    );
}

export default HeaderDoctorProfile;
