import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Popover, Drawer } from "antd";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from "react-redux";

import playIcons from '../assets/images/tube-icon.svg';
import tutorial from '../assets/images/tutorial-icon.svg';
import ProfilePopover from './ProfilePopover';
import VideoModal from './VideoModal';
import CreateCertificate from '../components/medical_certificate/CreateCertificate';
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { GB_ISCRIBE, GB_SNAP_RX } from '../utils/constants';
import { getClinicName, trackEvent } from '../utils/utils';
import { isAndroid, isBrowser } from 'react-device-detect';
import { generateUniqueFileName, getCorrectedFileName } from '../pages/medicalRecords/utils/helper';
import { EVENTS } from '../utils/events';
import { getDecodedToken } from '../utils/localStorage';

function Welcome1(props) {

    const [popOverVideo, setPopOverVideo] = useState(false);
    const [videoLink, setVideoLink] = useState(null);
    const [clickedDownArrow, setClickedDownArrow] = useState(false);
    const fileInputRef = useRef(null);
    const isSmartSyncAccessableFromGB = useFeatureIsOn(
        GB_ISCRIBE
    );
    const isSnapRxAccessableFromGB = useFeatureIsOn(
        GB_SNAP_RX
    );

    const navigate = useNavigate();
    const { profile, videoList, patientCertificateList } = useSelector((state) => state.doctors);
    const { allUploadedDocs } = useSelector(
        (state) => state.uploadDoc
    );
    const {
        locationPath,
        isMobile,
        patient_data,
        viewCaseManagerData,
        sidebarKey,
        filesData,
        setFilesData,
        handleUploadDocPopup,
        handleDrawerUploadDoc,
    } = props;

    const modifyFormat = useMemo(() => {
        if (viewCaseManagerData) {
            const data = moment(viewCaseManagerData.consultation_date).format('Do MMM')
            let first = data.split(' ')[0].slice(0, -2);
            let second = data.split(' ')[0].slice(-2);
            let third = data.split(' ')[1];
            return { first, second, third }
        } else {
            return null
        }
    }, [viewCaseManagerData])

    const [createCertificateDrawer, setCreateCertificateDrawer] = useState(false);

    const onSmartRxClick = async (patient) => {
        navigate("/smart-prescription", { state: { patient_data: patient } });
    };

    const onSnapRxClick = async (patient) => {
        trackEvent(EVENTS.SNAP_RX.uploadClicked, {
            patient_unique_id: patient?.patient_unique_id,
            doctor_id: getDecodedToken()?.user_id,
            upload_source: "EMR",
          });
        navigate("/snap-rx", { state: { patient_data: patient } });
    };

    const onConsultClick = async (patient) => {
        navigate("/prescription", { state: { patient_data: patient, send_path: "patient_details" } });
    };

    const handleClickDownArrow = () => {
        setClickedDownArrow(!clickedDownArrow);
    };

    const handleCreateCertificateDrawer = useCallback(() => {
        setCreateCertificateDrawer(!createCertificateDrawer)
    }, [createCertificateDrawer]);

    //PopOverVideo function
    const showHideVideoListPopover = useCallback(() => {
        setPopOverVideo(!popOverVideo);
    }, [popOverVideo]);

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files) {
            const filesData = Array.from(files);
            if (filesData.length > 0) {
                const updatedFiles = [];
                filesData.forEach((file) => {
                    const cleanFileName = getCorrectedFileName(file?.name || "");
                    // Check if the file is an image and if its name follows typical camera-captured file patterns
                    const isCapturedFromCamera =
                        (file.type === "image/jpeg" ||
                            file.type === "image/png" ||
                            file.type === "image/jpg") &&
                        (cleanFileName === "image.jpg" ||
                            cleanFileName === "image.png" ||
                            cleanFileName === "image.jpeg");

                    let newFile = file;

                    if (isCapturedFromCamera) {
                        // Generate a unique file name for camera-captured images
                        const uniqueFileName = generateUniqueFileName(file);
                        newFile = new File([file], uniqueFileName, { type: file.type });
                    } else {
                        // If the file name had spaces, create a new file with spaces removed
                        newFile = new File([file], cleanFileName, { type: file.type });
                    }

                    updatedFiles.push(newFile);
                });
                setFilesData(updatedFiles);
                handleDrawerUploadDoc();
            }
        }
        event.target.value = null;
    };

    const handleAddClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    //Video Componet
    const VIDEO_CONTENT = useCallback(() => {
        return (
            <>
                <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
                    <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
                        <div className="title-common lh-base">Video Tutorial</div>
                        <Button className="btn btn-videoClose p-0"
                            onClick={showHideVideoListPopover}>
                            <i className="icon-Cross" />
                        </Button>
                    </div>
                    {videoList[0]?.video?.map((item1, i1) => {
                        return (
                            <div key={i1} className={`d-flex ${i1 !== videoList[0]?.video.length - 1 && 'pb-3 mb-15 border-bottom'}`}>
                                <div className="tutorial-play me-14">
                                    <button type="button"
                                        onClick={() => {
                                            setVideoLink(item1)
                                            const clinic_name = getClinicName(profile?.hospital_data);
                                            window.Moengage.track_event("TP_Tutorial_Viewed", {
                                                clinic_name,
                                                tutorial_type: videoList[0]?.category,
                                            });
                                        }}
                                    >
                                        <img src={playIcons} />
                                    </button>
                                    <span className='tutorial-thumb'><img src={item1.thumbnail} /></span>
                                </div>
                                <div>
                                    <h3 className="title-common text-welcome">{item1?.tmv_title}</h3>
                                    <div className="fs-12 fontroboto fw-normal text-main">{item1?.tmv_description}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        );
    }, [popOverVideo]);

    return (
        <>
            <div className="welcomesection position-relative">
                <div className='bg-welcome d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center'>
                        {sidebarKey === 1 ? (
                            <div>
                                <h1 className='mt-2'>{'Patient Details'}</h1>
                                {isMobile && (<ProfilePopover locationPath={locationPath} isMobile={isMobile} patient_data={patient_data} />)}
                                {isMobile ? '' : <p className='mb-1'>&nbsp;</p>}
                            </div>
                        ) : sidebarKey === 2 ? (
                            <h1 className='mt-2 mb-3'>{'Certificate'}</h1>
                        ) : (
                            <h1 className='mt-2 mb-3'>{'Medical Records'}</h1>
                        )}
                        <img src={require("../assets/images/bg-welcome.png")} className={`welcomeig d-inline-block align-top ${isMobile ? 'ms-2' : 'ms-4'}`} alt="Welcome" />
                    </div>
                    {sidebarKey === 1 ? (
                        <div>
                            {viewCaseManagerData && (
                                <div className='d-sm-flex d-block'>
                                    <Popover
                                        open={popOverVideo}
                                        onOpenChange={showHideVideoListPopover}
                                        content={VIDEO_CONTENT}
                                        trigger="click"
                                        overlayClassName="pop-430 pp-0 videoTutorial"
                                        placement="bottom"
                                    >
                                        <button className='btn d-flex align-items-center btn-text mx-3 tutorial p-0'>
                                            {/* onClick={showHideVideoListPopover} */}
                                            <span className='text-decoration-none rounded-5 pe-3 bg-white shadow2'><img height={42} src={tutorial} />Tutorial</span>
                                        </button>
                                    </Popover>
                                    {videoLink && (
                                        <VideoModal
                                            videoLink={videoLink}
                                            onCancel={() => setVideoLink(null)}
                                        />
                                    )}
                                    {!viewCaseManagerData?.smart_prescription_filename?.length &&
                                        <Button variant="outline-primary me-3 d-flex align-items-center mb-lg-0 mb-2" onClick={() => {
                                            window.Moengage.track_event("repeat_rx_click", {
                                                "doctor_id": profile?.doctor_unique_id,
                                                "patient_id": patient_data !== undefined ? patient_data.patient_unique_id : 0,
                                                "rx_date": viewCaseManagerData?.consultation_date
                                            });
                                            navigate("/prescription", { state: { patient_data: patient_data, send_path: "patient_details", caseManagerData: { ...viewCaseManagerData, tcm_id: 0, consultation_date: moment().format('YYYY-MM-DD HH:mm:ss') } } })
                                        }}> <i className={'icon-reload me-2'}></i>Repeat {modifyFormat && modifyFormat.first}<sup>{modifyFormat && modifyFormat.second}</sup>&nbsp;{modifyFormat && modifyFormat.third} Rx</Button>
                                    }
                                    {isSnapRxAccessableFromGB && !isMobile ? (
                                        <>
                                            <div
                                                style={{
                                                    background: "#4B4AD5",
                                                    borderRadius: "10px",
                                                    color: "white",
                                                    marginLeft: "1rem",
                                                    position: "relative",
                                                }}
                                            >
                                                <button
                                                    // className="btn btn-outline-primary btn-smart-rx"
                                                    className="btn btn-outline-primary btn-smart-rx"
                                                    onClick={() => onSnapRxClick(patient_data)}
                                                    style={{ padding: "9px 2rem 9px 10px" }}
                                                >
                                                    <span className="btn-span-smartRx">Snap Rx</span>
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-down-arrow"
                                                    onClick={handleClickDownArrow}
                                                    style={{ padding: "9.5px 5px" }}
                                                >
                                                    <span
                                                        role="img"
                                                        aria-label="down"
                                                        className="anticon anticon-down ant-select-suffix"
                                                    >
                                                        <i
                                                            className="icon-right"
                                                            style={{
                                                                display: "block",
                                                                transform: `rotate(270deg)`,
                                                                color: "white",
                                                            }}
                                                        />
                                                    </span>
                                                </button>
                                                {clickedDownArrow && (
                                                    <button
                                                        className="btn-consult-patient-details"
                                                        onClick={() => onConsultClick(patient_data)}
                                                    >
                                                        Consult
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    ) :
                                    isSmartSyncAccessableFromGB && !isMobile ? (
                                        <>
                                            <div
                                                style={{
                                                    background: "#4B4AD5",
                                                    borderRadius: "10px",
                                                    color: "white",
                                                    marginLeft: "1rem",
                                                    position: "relative",
                                                }}
                                            >
                                                <button
                                                    // className="btn btn-outline-primary btn-smart-rx"
                                                    className="btn btn-outline-primary btn-smart-rx"
                                                    onClick={() => onSmartRxClick(patient_data)}
                                                    style={{ padding: "9px 2rem 9px 10px" }}
                                                >
                                                    <span className="btn-span-smartRx">SmartRx</span>
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-down-arrow"
                                                    onClick={handleClickDownArrow}
                                                    style={{ padding: "9.5px 5px" }}
                                                >
                                                    <span
                                                        role="img"
                                                        aria-label="down"
                                                        className="anticon anticon-down ant-select-suffix"
                                                    >
                                                        <i
                                                            className="icon-right"
                                                            style={{
                                                                display: "block",
                                                                transform: `rotate(270deg)`,
                                                                color: "white",
                                                            }}
                                                        />
                                                    </span>
                                                </button>
                                                {clickedDownArrow && (
                                                    <button
                                                        className="btn-consult-patient-details"
                                                        onClick={() => onConsultClick(patient_data)}
                                                    >
                                                        Consult
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <Button variant="primary"
                                            className='btn-41 px-4'
                                            onClick={() => {
                                                window.Moengage.track_event("start_new_visit_click", {
                                                    "doctor_id": profile?.doctor_unique_id,
                                                    "patient_id": patient_data !== undefined ? patient_data.patient_unique_id : 0
                                                });
                                                navigate("/prescription", { state: { patient_data: patient_data, send_path: "patient_details" } })
                                            }}>
                                            {'Start New Visit'}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : sidebarKey === 2 ? (
                        <div>
                            {patientCertificateList?.length > 0 && (
                                <Button variant="primary" onClick={handleCreateCertificateDrawer}
                                    className='btn-41 px-4'>
                                    {'Create Certificate'}
                                </Button>
                            )}
                        </div>
                    ) : sidebarKey === 3 && allUploadedDocs?.length > 0 && (
                        <div>
                            <Button
                                variant="primary"
                                style={{ display: "flex", alignItems: "center", gap: "5px" }}
                                onClick={handleAddClick}
                            >
                                {isAndroid && !isBrowser ? (
                                    <div
                                        ref={fileInputRef}
                                        onClick={handleUploadDocPopup}
                                        style={{ display: "none" }}
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        multiple
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                                        style={{ display: "none" }}
                                        disabled={filesData.length >= 5}
                                    />
                                )}
                                <i className="icon-upload" />
                                {"Upload new report"}
                            </Button>
                        </div>
                    )}
                </div>
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
                <div className='pb-5'>
                    &nbsp;
                </div>
            </div>
        </>
    )
}

export default React.memo(Welcome1)