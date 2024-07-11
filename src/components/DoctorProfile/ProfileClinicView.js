import React from 'react';
import { Row, Col, Button } from 'antd';
function ProfileClinicView() {
    return (
        <div className="rounded-20px bg-white">
            <div className="d-flex align-items-center justify-content-between p-20 border-bottom" style={{ borderColor: '#F1F1F5' }}>
                <div className="d-flex align-items-center">
                    <i className="profile-head-icon icon-Visit-Summary me-3"></i>
                    <div className="titleprint">
                        Clinic Details
                    </div>
                </div>
                <button className="btn d-flex align-items-center btn-text">
                    <i className='icon-Edit me-1 fs-5'></i>
                    <span> Edit </span>
                </button>
            </div>
            <div className="px-20 py-1">
                <Row>
                    <Col span={12} className='my-3'>
                        <div>
                            <div className="p-20 rounded-20px rounded-bottom-0 border" style={{ backgroundColor: 'rgba(237, 223, 247, 0.30)' }}>
                                <div className='fw-semibold fs-16' style={{ fontWeight: 600 }}> Aayushyam Clinic Centre LLP</div>
                            </div>
                            <div className="p-20 rounded-20px rounded-top-0 bg-white border border-top-0">
                                <div className="fw-semibold">Address</div>
                                <div className="fs-14">Ground Floor, Sheetal Varsha Complex,
                                    Landmark: Near Shivranjani Cross Road,
                                    Ahmedabad, Gujarat 380015</div>
                                <div className="d-flex align-items-center justify-content-between mt-4">
                                    <div className="align-items-center d-flex text-primary fw-medium px-3 py-1 cursor-pointer">
                                        <i className="icon-Preview text-primary me-2"></i>
                                        Get Direction                                        
                                    </div>
                                    <Button type="text" className="btn btn-videoClose align-items-center d-flex fw-medium" icon={<i className="profile-head-icon icon-phone text-secondary-custom"></i>}>
                                        7894561230
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div >
    );
}

export default ProfileClinicView;
