import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, Button, Drawer, Spin, message } from "antd";
import Card from 'react-bootstrap/Card';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import { isChrome, isSafari } from "react-device-detect";

import { useSelector, useDispatch } from "react-redux";

import notcertificate from '../../assets/images/not-certificate.svg';
import certificatepdf from '../../assets/images/certificate-pdf.svg';
import CreateCertificate from "./CreateCertificate";
import PdfThumbnail from "../../common/PdfThumbnail";
import { listPatientCertificate, deletePatientCertificate } from "../../redux/doctorsSlice";
import { errorMessage, sendMessageToParent } from "../../utils/utils";

import { MESSAGE_KEY } from "../../utils/constants";

import visitEnd from '../../assets/images/end-visit.svg';
import imgCloseVisit from '../../assets/images/close-visit.svg';
import { EVENTS } from "../../utils/events";

function CertificateDetails({ patient_data }) {

    const navigate = useNavigate();

    const { patientCertificateList, loading } = useSelector((state) => state.doctors);

    const dispatch = useDispatch();

    useEffect(() => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0
        }
        dispatch(listPatientCertificate(sendData));
    }, []);

    const [createCertificateDrawer, setCreateCertificateDrawer] = useState(false);


    const handleCreateCertificateDrawer = useCallback(() => {
        setCreateCertificateDrawer(!createCertificateDrawer)
    }, [createCertificateDrawer]);

    async function printContent(item) {
        await window.open(item?.certificate);
    };

    async function printInAppContent(item) {
        navigate(`/patient_details/?url=${item?.certificate}&key=print`, { replace: true, state: { patient_data: patient_data } })
        navigate(0, { replace: true });
        // sendMessageToParent(EVENTS.PRINT, { url: item?.certificate });
    };

    const getMenuItems = (item) => {
        return [
            {
                label: <div onClick={() => !isChrome && !isSafari ? printInAppContent(item) : printContent(item)}>Print</div>,
                key: '1',
            },
            {
                label: <div
                    onClick={() => {
                        onDeleteClicked(item?.tcu_id)
                    }}>Delete</div>,
                key: '2',
            },
        ]
    };

    const onDeleteClicked = async (tcu_id) => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            tcu_id: tcu_id
        }
        const action = await dispatch(deletePatientCertificate(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            message.open({
                key: MESSAGE_KEY,
                type: '',
                className: 'message-appointment',
                content: (
                    <div className='d-flex align-items-center'>
                        <img src={visitEnd} className='me-3' />
                        <div>
                            <div className='title-common text-start fontroboto'>{`Certificate has been successfully deleted`}</div>
                        </div>
                        <img src={imgCloseVisit} className='ms-3' onClick={() => message.destroy()} />
                    </div>
                ),
                duration: 5,
            });
        } else {
            errorMessage(action.error)
        }
    };

    return (
        <div className="appointment-wrap PatientDetailswrap m-0">
            <Card>
                <div className='p-20 overflow-y-auto' style={{ height: "calc(100vh - 117px)" }}>
                    {loading ? (
                        <div className='align-items-center text-center'>
                            <Spin />
                        </div>
                    ) : (
                        patientCertificateList?.length > 0 ? (
                            <div className="d-flex flex-wrap">
                                {patientCertificateList?.map((item, index) => {
                                    return (
                                        <div key={index} className="certificate-box border me-4 mb-4">
                                            <div className="pfd-box d-flex justify-content-center align-items-center cursor-pointer"
                                                onClick={() => navigate('/certificate_print_view', { state: { ...item, viewable: true } })}>
                                                {/* <img src={certificatepdf} alt="Certificate PDF" /> */}
                                                <PdfThumbnail pdfUrl={item?.certificate} index={index} thumbnailUrl={item?.thumbnailUrl} />
                                            </div>
                                            <div className="bg-selected leave-ui d-flex justify-content-between">
                                                <div className="text-truncate">
                                                    <h5 className="fw-semibold fs-14 m-0 text-start text-truncate">{item?.tcu_title}</h5>
                                                    <div className="text-start">{moment(item?.tcu_created_date).format('DD MMM, YYYY LT')}</div>
                                                </div>
                                                <Dropdown className='btn btn-outline btn-more p-0 mt-1'
                                                    menu={{
                                                        items: getMenuItems(item),
                                                    }}
                                                    trigger={['click']}>
                                                    <a onClick={(e) => e.preventDefault()}>
                                                        <i className='icon-More'></i>
                                                    </a>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="certificate-not d-flex justify-content-center flex-column align-items-center my-5 py-5">
                                <img src={notcertificate} alt="not certificate" />
                                <div className="text-center fs-14 text-main lh-base fw-normal fontroboto mb-20 mt-20">
                                    Certificate Not Found! <br />No certificate created for this patient.
                                </div>
                                <Button type="primary" onClick={handleCreateCertificateDrawer} className="btn px-4 btn-41">Create Certificate</Button>
                            </div>
                        )
                    )}

                    <Drawer
                        className="modalWidth-563" width="auto"
                        title="Create Certificate"
                        placement="right"
                        closable
                        open={createCertificateDrawer}
                        onClose={handleCreateCertificateDrawer}
                        // key="left"
                    >
                        <CreateCertificate handleCreateCertificateDrawer={handleCreateCertificateDrawer} patient_data={patient_data} replace={false} />
                    </Drawer>
                </div>
            </Card>
        </div>
    )
}
export default React.memo(CertificateDetails);
