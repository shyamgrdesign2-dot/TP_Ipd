import React from 'react';
import { Row, Col } from 'antd';
function ProfilePersonalDetailsCard() {
    return (
        <div className="rounded-20px bg-white">
            <div className="d-flex align-items-center justify-content-between p-20 border-bottom" style={{borderColor: '#F1F1F5'}}>
                <div className="d-flex align-items-center">
                    <i className="profile-head-icon icon-profile me-3"></i>
                    <div className="titleprint">
                       Personal Details
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
                            <div>Contact No.</div>
                            <span className='title-common text-welcome'>7894561230</span>
                        </div>
                    </Col>
                    <Col span={12} className='my-3'>
                        <div>
                            <div>Email</div>
                            <span className='title-common text-greycolor'>Add your email id</span>
                        </div>
                    </Col>
                    <Col span={12} className='my-3'>
                        <div>
                            <div>Date of Birth</div>
                            <span className='title-common text-greycolor'>Add your date of birth</span>
                        </div>
                    </Col>
                    <Col span={12} className='my-3'>
                        <div>
                            <div>Gender</div>
                            <span className='title-common text-greycolor'>Add your gender</span>
                        </div>
                    </Col>
                    <Col span={12} className='my-3'>
                        <div>
                            <div>Years of Experience</div>
                            <span className='title-common text-greycolor'>Add experience</span>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default ProfilePersonalDetailsCard;
