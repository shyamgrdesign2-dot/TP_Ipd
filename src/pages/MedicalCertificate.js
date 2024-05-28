import React, { useState, useCallback } from "react";
import { Button, Drawer, Input } from 'antd';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import CommonModal from '../common/CommonModal';
import { useNavigate } from 'react-router-dom';

import EditorContext from "../context/EditorContext";

import alertIcon from '../assets/images/alertIcon.svg';
import travelCetificate from "../assets/images/travel-cetificate.svg";
import CreateCertificate from "../components/medical_certificate/CreateCertificate";
import CustomEditor from "../components/medical_certificate/editor/CustomEditor";

function MedicalCertificate(props) {

    const { handleCertificateFullDrawer } = props

    const [content, setContent] = useState('');

    const contextApi = { content, setContent };

    const navigate = useNavigate();
    const [isBackModalOpen, setIsBackModalOpen] = useState(false);
    const showHideBackModal = useCallback(() => {
        setIsBackModalOpen(!isBackModalOpen);
    }, [isBackModalOpen]);

    const [createCertificateDrawer, setCreateCertificateDrawer] = useState(false);
    const handleCreateCertificateDrawer = useCallback(
        () => {
            setCreateCertificateDrawer(!createCertificateDrawer)
        },
        [createCertificateDrawer]
    );

    return (
        <EditorContext.Provider value={contextApi}>
            <div>
                <Navbar className="justify-content-between headerprescription p-0 bg-white">
                    <Container fluid className='h-100 gx-0 w-100'>
                        <Row className='h-100 align-items-center w-100 justify-content-between'>
                            <Col lg="auto" className='h-100'>
                                <div className='align-items-center d-flex h-100'>
                                    <div className='border-end h-100 text-center me-3'>
                                        {/* onClick={checkDataFillOrNot} */}
                                        <div onClick={showHideBackModal} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                            <i className='icon-right'></i>
                                        </div>
                                        <CommonModal
                                            isModalOpen={isBackModalOpen}
                                            onCancel={showHideBackModal}
                                            modalWidth={500}
                                            title={"Discard Changes"}
                                            modalBody={
                                                <>
                                                    <div className="alert-warning rounded-10px p-2 patient-details">
                                                        <div className="d-flex align-items-center">
                                                            <img className='me-3' src={alertIcon} alt="Warning" />
                                                            <span>
                                                                Are you sure you want to discard the changes you made?
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <div className="d-flex align-items-center mt-2 justify-content-end">
                                                            <div onClick={handleCertificateFullDrawer} className="me-4 text-decoration-underline btn p-0 text-main">
                                                                <span onClick={() => navigate('/', { replace: true })}>Yes, Discard</span>
                                                            </div>
                                                            <Button onClick={showHideBackModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                                                <span>No, Stay</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        />
                                    </div>
                                    <div className="d-flex align-items-center py-3 cursor-pointer">
                                        <div className="bg-fitness me-3">
                                            <img src={travelCetificate} alt="" />
                                        </div>
                                        <div>
                                            <div className="title-common">
                                                Travel Certificate
                                            </div>
                                            <div onClick={handleCreateCertificateDrawer} className="d-flex align-items-center text-2 text-primary">Change Template <i className="fs-16 icon-right iconrotate270"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg="auto">
                                <div className='align-items-center d-flex h-100'>
                                    <Button className="btn btn-41 btn-primary3" >Continue</Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Navbar>
                <div className="bg-body p-3" style={{ height: 'calc(100vh - 60px)' }}>
                    <Input allowClear className="popinput mb-3" onChange='' placeholder="Certificate Title" />
                    <CustomEditor className={'rounded-10px'} />
                    <div>
                        <h3>Editor Content:{content}</h3>
                        {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
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
        </EditorContext.Provider>
    )
}
export default MedicalCertificate;
