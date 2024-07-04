import React from 'react';
import { Row, Col } from 'antd';
import checkBadge from '../../assets/images/check-badge.svg'
import RXIimage from '../../assets/images/RX_image.png'

function ProfileGovermentProofCard() {
    return (
        <div className="rounded-20px bg-white">
            <div className="d-flex align-items-center justify-content-between p-20 border-bottom" style={{ borderColor: '#F1F1F5' }}>
                <div className="d-flex align-items-center">
                    <i className="profile-head-icon icon-Id me-3"></i>
                    <div className="titleprint">
                        Government ID Proof
                        <img className='ms-3' src={checkBadge} alt='Right' />
                    </div>
                </div>
                <button className="btn d-flex align-items-center btn-text">
                    <i className='icon-Edit me-1 fs-5'></i>
                    <span> Edit </span>
                </button>
            </div>
            <div className="p-20 d-flex">
                <div className="p-20 rounded-20px bg-white border">
                    <img src={RXIimage} alt='Id Proof' />
                </div>    
            </div>
        </div >
    );
}

export default ProfileGovermentProofCard;
