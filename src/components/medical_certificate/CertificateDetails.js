import React, {useState, useCallback } from "react";
import { Dropdown, Button, Drawer } from "antd";
import Card from 'react-bootstrap/Card';

import notcertificate from '../../assets/images/not-certificate.svg';
import certificatepdf from '../../assets/images/certificate-pdf.svg';
import CreateCertificate from "./CreateCertificate";

function CertificateDetails() {

    const [createCertificateDrawer, setCreateCertificateDrawer] = useState(false);

    const items = [
        {
            label: <div>Edit</div>,
            key: '1',
        },
        {
            label: <div>Print</div>,
            key: '2',
        },
    ];

    const handleCreateCertificateDrawer = useCallback(
        () => {
            setCreateCertificateDrawer(!createCertificateDrawer)
        },
        [createCertificateDrawer]
    );

    return (
        <div className="appointment-wrap PatientDetailswrap m-0">
            <Card>
                <div className='p-20' style={{ height: "calc(100vh - 117px)" }}>
                    <div className="certificate-not d-flex justify-content-center flex-column align-items-center my-5 py-5">
                        <img src={notcertificate} alt="not certificate" />
                        <div className="text-center fs-14 text-main lh-base fw-normal fontroboto mb-20 mt-20">
                            Certificate Not Found! <br />No any certificate created for this patient.
                        </div>
                        <Button type="primary" onClick={handleCreateCertificateDrawer} className="btn px-4 btn-41">Create Certificate</Button>
                    </div>
                    <div className="d-flex flex-wrap">
                        <div className="certificate-box border me-4 mb-4">
                            <div className="pfd-box d-flex justify-content-center align-items-center">
                                {/* <img src={certificatepdf} alt="Certificate PDF" /> */}
                                <iframe
                                    src="http://infolab.stanford.edu/pub/papers/google.pdf#toolbar=0&navpanes=0&scrollbar=0"
                                    frameBorder="0"
                                    scrolling="auto"
                                    height="100%"
                                    width="100%"
                                ></iframe>
                            </div>
                            <div className="bg-selected leave-ui d-flex justify-content-between">
                                <div>
                                    <h5 className="fw-semibold fs-14 m-0 text-start">Medical Leave</h5>
                                    <div>9 Oct, 2023 11:59 AM</div>
                                </div>
                                <Dropdown className='btn btn-outline btn-more p-0' menu={{ items, }} trigger={['click']}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <i className='icon-More'></i>
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="certificate-box border me-4 mb-4">
                            <div className="pfd-box d-flex justify-content-center align-items-center">
                                <img src={certificatepdf} alt="Certificate PDF" />
                            </div>
                            <div className="bg-selected leave-ui d-flex justify-content-between">
                                <div>
                                    <h5 className="fw-semibold fs-14 m-0 text-start">Medical Leave</h5>
                                    <div>9 Oct, 2023 11:59 AM</div>
                                </div>
                                <Dropdown className='btn btn-outline btn-more p-0' menu={{ items, }} trigger={['click']}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <i className='icon-More'></i>
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <Drawer
                    className="modalWidth-563" width="auto"
                    title="Create Certificate"
                    placement="right"
                    closable
                    open={createCertificateDrawer}
                    onClose={handleCreateCertificateDrawer}
                    key="left"
                >
                   <CreateCertificate />
                </Drawer>
                </div>
            </Card>
        </div>
    )
}
export default React.memo(CertificateDetails);
