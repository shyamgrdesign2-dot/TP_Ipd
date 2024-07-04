import React from 'react';
import { Row, Col } from 'antd';
import CertificatePDF from '../../assets/images/certificate-pdf.svg'

function ProfileCertificateCard() {
    return (
        <div className="rounded-20px bg-white">
            <div className="d-flex align-items-center justify-content-between p-20 border-bottom" style={{ borderColor: '#F1F1F5' }}>
                <div className="d-flex align-items-center">
                    <i className="profile-head-icon icon-certificate-profile fs-4 me-3"></i>
                    <div className="titleprint">
                        MCI Number and Certificate
                    </div>
                </div>
                <button className="btn d-flex align-items-center btn-text">
                    <i className='icon-Edit me-1 fs-5'></i>
                    <span> Edit </span>
                </button>
            </div>
            <div className="p-20">
                <div className="p-20 rounded-20px border" style={{ backgroundColor: '#FAF6FD' }}>
                    <div className='fw-medium fs-16' style={{ fontWeight: 600 }}>MCI Number : <span className='text-welcome'>65401</span> </div> 
                </div>
                <div className='d-flex mt-20'>
                    <div className="p-20 rounded-20px bg-white border">
                        <img src={CertificatePDF} alt='Certificate' />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ProfileCertificateCard;
