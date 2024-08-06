import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { Button, Dropdown, Modal, Progress, Space, Input, Drawer } from 'antd';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import Homepage from '../../website/Homepage';
import DemoHomepage from '../../website/DemoHomepage';
import stopPublishing from '../../assets/images/stop-publishing.svg';
import LinkIcon from '../../assets/images/Link.svg';

import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';

import { saveDoctorWebsite, publishDoctorWebsite } from "../../redux/doctorWebsiteSlice";
import { errorMessage, handleCopy, validateEmail } from '../../utils/utils';
import CommonModal from '../../common/CommonModal';
import alertIcon from '../../assets/images/alertIcon.svg';

function HeaderDoctorWebsite() {

    const dispatch = useDispatch();
    const { save_loading, publish_loading } = useSelector((state) => state.doctorWebsite);

    const [childDrawer, setChildDrawer] = useState(false);
    const [childDrawer1, setChildDrawer1] = useState(false);

    // Handle Child Drawer
    const handleDrawerChild = useCallback(() => {
        setChildDrawer(!childDrawer);
    }, [childDrawer]);

    const handleDrawerChild1 = useCallback(() => {
        setChildDrawer1(!childDrawer1);
    }, [childDrawer1]);

    const navigate = useNavigate();

    const { websiteData, tmdwm_id, personalDetails, clinicProfile, aboutDoctor, doctorExperience, services, educationTraining, membership, rewardRecognition, socialLinks, otherSettings } = useContext(DoctorWebsiteSettingsContext);

    const [loaderModal, setLoaderModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [publishUrl, setPublishUrl] = useState(null);
    const [unpublishStatus, setUnpublishStatus] = useState(null);
    const cancelTokenSource = useRef(null);


    async function onSaveWebsiteClick() {
        setPublishUrl(null)
        setProgress(0);
        setUnpublishStatus(false)
        setLoaderModal(true)

        let { uploadFile, ...updatePersonalDetails } = personalDetails

        let makeClinicPhotosObject = {}
        const updatedClinicProfile = clinicProfile?.map(e => {
            const newObj = { ...e };

            delete newObj['selectedTab'];
            delete newObj['created_by'];

            const updatedServerClinicPhotos = newObj?.clinic_photos?.filter(e1 => !e1.clinic_image_link.startsWith('blob:'))

            const updatedLocalClinicPhotos = newObj?.clinic_photos?.filter(e1 => e1.clinic_image_link.startsWith('blob:'))
            var fetchUploadFile = []
            updatedLocalClinicPhotos?.map(e1 => fetchUploadFile.push(e1?.uploadFile))
            makeClinicPhotosObject[`clinicpic_${newObj?.random_id}`] = fetchUploadFile

            return { ...newObj, clinic_photos: [...updatedServerClinicPhotos] }
        })

        var sendData = {
            personal_details: JSON.stringify(updatePersonalDetails),
            hero_image: personalDetails?.uploadFile ? personalDetails?.uploadFile : '',
            clinic_profile: JSON.stringify(updatedClinicProfile),
            about_doctor: JSON.stringify(aboutDoctor),
            doctor_experience: JSON.stringify(doctorExperience),
            services: JSON.stringify(services.map(({ unique_id, ...rest }) => rest)),
            education_training: JSON.stringify(educationTraining),
            membership: JSON.stringify(membership.map(({ unique_id, ...rest }) => rest)),
            reward_recognition: JSON.stringify(rewardRecognition),
            social_links: JSON.stringify(socialLinks),
            ...otherSettings,
            ...makeClinicPhotosObject
        }

        const formData = new FormData();
        Object.keys(sendData).forEach((key) => {
            if (key.startsWith('clinicpic')) {
                sendData[key].forEach((item, index) => {
                    formData.append(key, item);
                });
            } else {
                formData.append(key, sendData[key]);
            }
        });

        cancelTokenSource.current = axios.CancelToken.source();

        const action = await dispatch(saveDoctorWebsite({
            data: sendData,
            onUploadProgress: onUploadProgress,
            onDownloadProgress: onDownloadProgress,
            cancelToken: cancelTokenSource.current.token
        }));
        if (action.meta.requestStatus === "fulfilled") {
            navigate('/doctor_website_setting', { replace: true, state: { websiteData: { ...action.payload } } })
        } else {
            setLoaderModal(false)
            errorMessage(action.error)
        }
    }
    const onDownloadProgress = (progressEvent) => {
        const total = progressEvent.total
        const current = progressEvent.loaded
        const percentage = Math.round((current / total) * 100);
        if (percentage > 95) {
            setProgress(percentage);
        }
    };
    const onUploadProgress = (progressEvent) => {
        const total = progressEvent.total
        const current = progressEvent.loaded
        const percentage = Math.round((current / total) * 100);
        if (percentage < 95) {
            setProgress(percentage);
        }
    };

    const handleCancelUpload = () => {
        if (cancelTokenSource.current) {
            cancelTokenSource.current.cancel('Upload canceled by the user.');
        }
    };

    async function onPublishWebsiteClick(status) {

        if (!status) {
            showHideModal()
        }

        var sendData = {
            tmdwm_id: tmdwm_id,
            website_publish: status
        }

        const action = await dispatch(publishDoctorWebsite(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            if (!status) {
                setUnpublishStatus(true)
                setLoaderModal(true)
            }
            setPublishUrl(action.payload?.publish_url)
        } else {
            setLoaderModal(false)
            errorMessage(action.error)
        }
    }

    const showHideModal = useCallback(() => {
        setIsModalOpen(!isModalOpen);
    }, [isModalOpen]);

    const items = [
        {
            label: <div onClick={showHideModal}>Unpublish Website</div>,
            key: 'UnPublish',
        },
    ];


    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

    const showHideLogoModal = useCallback(() => {
        setIsLogoModalOpen(!isLogoModalOpen);
    }, [isLogoModalOpen]);

    return (
        <>
            <Navbar className="justify-content-between headerprescription p-0">
                <Container fluid className='h-100 gx-0 w-100'>
                    <Row className='h-100 align-items-center w-100 justify-content-between'>
                        <Col sm="auto" className='h-100'>
                            <div className='align-items-center d-flex h-100'>
                                <div className='border-end h-100 text-center'>
                                    <div onClick={showHideLogoModal} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                        <i className='icon-right'></i>
                                    </div>
                                    <CommonModal
                                        isModalOpen={isLogoModalOpen}
                                        onCancel={showHideLogoModal}
                                        modalWidth={500}
                                        title={"You may lose your data"}
                                        modalBody={
                                            <>
                                                <div className="alert-warning rounded-10px p-2 patient-details mb-4">
                                                    <div className="d-flex align-items-center">
                                                        <img className='me-3' src={alertIcon} alt="Warning" />
                                                        <span>
                                                            Are you sure you want to leave? <br />
                                                            You will permanently lose your data.
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="d-flex align-items-center mt-2 justify-content-end">
                                                        <div onClick={() => navigate('/doctor_profile', { replace: true, state: { websiteData: { ...websiteData } } })}
                                                            className="me-4 text-decoration-underline btn p-0 text-main">
                                                            Yes, Back
                                                        </div>
                                                        <Button onClick={showHideLogoModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                                            <span>No, Stay</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                </div>
                                <div className='ms-3 title-common'>Setup Website</div>
                            </div>
                        </Col>
                        <Col sm="auto">
                            <div className='align-items-center d-flex'>
                                <button onClick={handleDrawerChild1} className='btn d-flex align-items-center btn-text me-14'>
                                    <i className="icon-New-Window me-2"></i> <span>Live Reference Demo</span>
                                </button>
                                <button onClick={handleDrawerChild} className='btn d-flex align-items-center btn-text me-14'>
                                    <i className="icon-Preview me-2"></i> <span>Your Website Preview</span>
                                </button>
                                <Button
                                    type='button'
                                    className="btn-41 btn px-4 btn-primary3 align-items-center d-flex"
                                    loading={save_loading}
                                    disabled={personalDetails?.first_name
                                        // && personalDetails?.last_name
                                        && personalDetails?.education
                                        // && (personalDetails?.email_id ? validateEmail(personalDetails?.email_id) : true)
                                        && aboutDoctor?.years_experience
                                        && aboutDoctor?.language?.length > 0
                                        && clinicProfile?.filter(el => !el.clinic_delete)?.length > 0
                                        && clinicProfile?.filter(el => !el.clinic_delete)?.filter(el => !el.name)?.length === 0
                                        && clinicProfile?.filter(el => !el.clinic_delete)?.filter(el => !el.contact_no)?.length === 0
                                        && clinicProfile?.filter(el => !el.clinic_delete)?.filter(el => !el.address.pincode)?.length === 0
                                        && clinicProfile?.filter(el => !el.clinic_delete)?.filter(el => !el.address.city)?.length === 0
                                        && clinicProfile?.filter(el => !el.clinic_delete)?.filter(el => !el.address.state)?.length === 0
                                        && clinicProfile?.filter(el => !el.clinic_delete)?.filter(el => !el.address.address_line)?.length === 0
                                        && clinicProfile?.filter(el => !el.clinic_delete)?.filter(el => el.shift.length === 0)?.length === 0 ? false : true}
                                    onClick={onSaveWebsiteClick}>
                                    <i className="icon-New-Window me-2"></i> Save & Publish Website
                                </Button>
                                <Dropdown className='btn btn-outline btn-more p-0 ms-3' menu={{ items }} trigger={['click']}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <i className='icon-More'></i>
                                    </a>
                                </Dropdown>
                            </div>
                        </Col>
                    </Row>
                </Container >
            </Navbar>
            <Modal
                open={loaderModal}
                centered
                footer={null}
                className="text-center website-publish-modal"
                destroyOnClose
                onCancel={() => setLoaderModal(false)}
            // onCancel={null}
            >
                <div className='p-3 web-publish'>
                    {unpublishStatus ? (
                        <>
                            <Button style={{ minWidth: 100, minHeight: 100, backgroundColor: "#19BB7A", border: 'none' }} shape="circle" icon={<i style={{ fontSize: 50 }} className="icon-check text-white"></i>} />
                            <div className="title-hypertension text-welcome mt-4 mb-2">{`Successfully unpublished`}</div>
                            <div className='title-common'>{`Your website has been unpublished successfully.`}</div>

                            <div className='text-start mt-4'>
                                <Space.Compact className='h-45' style={{ width: '100%' }}>
                                    <Input className='fontroboto' defaultValue={'Note: Your live website url has been expired.'} disabled />
                                </Space.Compact>
                            </div>

                            <div className="d-flex align-items-center justify-content-center mt-4">
                                <Button
                                    type="text"
                                    className="btn btn-primary3 align-items-center justify-content-center d-flex btn-41 w-50 ms-4"
                                    icon={<i className="icon-right iconrotate180 ms-auto"></i>}
                                    onClick={() => navigate('/doctor_profile', { replace: true, state: { websiteData: { ...websiteData } } })}>
                                    Back to Profile
                                </Button>
                            </div>

                        </>
                    ) : (
                        progress >= 100 ? (
                            <>
                                <Button style={{ minWidth: 100, minHeight: 100, backgroundColor: "#19BB7A", border: 'none' }} shape="circle" icon={<i style={{ fontSize: 50 }} className="icon-check text-white"></i>} />
                                <div className="title-hypertension text-welcome mt-4 mb-2">{`Successfully ${publishUrl ? 'published' : 'processed'}`}</div>
                                <div className='title-common'>{`Your website has been ${publishUrl ? 'published' : 'processed'} successfully.`}</div>

                                {publishUrl ? (
                                    <>
                                        <div className='text-start mt-4'>
                                            <label className='fw-medium mb-1'>Live website URL</label>
                                            <Space.Compact className='h-45' style={{ width: '100%' }}>
                                                <Input className='fontroboto' defaultValue={publishUrl} />
                                                <Button onClick={() => handleCopy(publishUrl)} className='h-45 bg-selected border'><img className='me-2' src={LinkIcon} alt="Warning" /> Copy</Button>
                                            </Space.Compact>
                                        </div>

                                        <div className="d-flex align-items-center mt-4">
                                            <Button type="text" className="btn btn-primary2 align-items-center justify-content-center d-flex btn-41 w-50"
                                                icon={<i className="icon-New-Window"></i>}
                                                onClick={() => window.open(publishUrl)}>
                                                Live Preview
                                            </Button>
                                            <Button type="text" className="btn btn-primary3 align-items-center justify-content-center d-flex btn-41 w-50 ms-4"
                                                icon={<i className="icon-right iconrotate180 ms-auto"></i>}
                                                onClick={() => navigate('/doctor_profile', { replace: true, state: { websiteData: { ...websiteData } } })}>
                                                Back to Profile
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="d-flex align-items-center mt-4">
                                            <Button
                                                type="text"
                                                className="btn btn-primary2 align-items-center justify-content-center d-flex btn-41 w-50"
                                                onClick={() => setLoaderModal(false)}>
                                                Don't Publish
                                            </Button>
                                            <Button
                                                type="text"
                                                className="btn btn-primary3 align-items-center justify-content-center d-flex btn-41 w-50 ms-4"
                                                loading={publish_loading}
                                                onClick={() => onPublishWebsiteClick(1)}>
                                                Go to publish
                                            </Button>
                                        </div>
                                    </>
                                )}

                            </>
                        ) : (
                            <>
                                <Progress type="circle" format={(number) => ''} percent={progress} size={100} />
                                <div className="title-hypertension text-welcome mt-4 mb-2">Processing Website...</div>
                                <div className='title-common'>Your data is getting saved, please do not refresh the page.</div>
                                {/* <Button className="lh-lg btn btn-clear btn-41 px-4 mt-4" onClick={handleCancelUpload}>
                                    <img className='me-3' src={stopPublishing} alt="Warning" /> <span>Stop Processing</span>
                                </Button> */}
                            </>
                        )
                    )}
                </div>
            </Modal>
            <CommonModal
                isModalOpen={isModalOpen}
                onCancel={showHideModal}
                modalWidth={500}
                title={"Unpublish Website"}
                modalBody={
                    <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                            <div className="d-flex align-items-center">
                                <img className='me-3' src={alertIcon} alt="Warning" />
                                <span>
                                    Are you sure you want to unpublish your website?
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex align-items-center mt-2 justify-content-end">
                                <div onClick={() => onPublishWebsiteClick(0)}
                                    className="me-4 text-decoration-underline btn p-0 text-main">
                                    Unpublish
                                </div>
                                <Button onClick={showHideModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                                    <span>Keep, Live</span>
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
            <Drawer closeIcon={false} placement="right" onClose={handleDrawerChild} open={childDrawer} width="100%">

                <Navbar className="justify-content-between headerprescription p-0">
                    <Container fluid className='h-100 gx-0 w-100'>
                        <Row className='h-100 align-items-center w-100 justify-content-between'>
                            <Col sm="auto" className='h-100'>
                                <div className='align-items-center d-flex h-100'>
                                    <div className='border-end h-100 text-center'>
                                        <div onClick={handleDrawerChild} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                            <i className='icon-right'></i>
                                        </div>
                                    </div>
                                    <div className='ms-3 title-common'>Back to editor</div>
                                </div>
                            </Col>
                            {/* <Col sm="auto">
                                <Button
                                    type='button'
                                    className="btn-41 btn px-4 btn-primary3 align-items-center d-flex">
                                    <i className="icon-New-Window me-2"></i> Publish Website
                                </Button>
                            </Col> */}
                        </Row>
                    </Container >
                </Navbar>
                <div className="overflow-auto bg-white" style={{ height: 'calc(100vh - 60px)' }}>
                    <Homepage
                        personalDetails={personalDetails}
                        aboutDoctor={aboutDoctor}
                        clinicProfile={clinicProfile}
                        services={services}
                        rewardRecognition={rewardRecognition}
                        educationTraining={educationTraining}
                        doctorExperience={doctorExperience}
                        membership={membership}
                        otherSettings={otherSettings}
                        socialLinks={socialLinks}
                    />
                </div>
            </Drawer>
            <Drawer closeIcon={false} placement="right" onClose={handleDrawerChild1} open={childDrawer1} width="100%">
                <Navbar className="justify-content-between headerprescription p-0">
                    <Container fluid className='h-100 gx-0 w-100'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center'>
                                <div onClick={handleDrawerChild1} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
                                </div>
                            </div>
                            <div className='ms-3 title-common'>Live Reference Demo</div>
                        </div>
                    </Container >
                </Navbar>
                <div className='w-100 px-3 py-2 fontroboto d-flex align-items-center' style={{ backgroundColor: '#FFE8AE' }}>
                    <i className='icon-info fs-18 me-3'></i> This is a demonstration website with sample data to show how it will look once you fill it.
                </div>
                <div className="overflow-auto" style={{ height: 'calc(100vh - 60px)' }}>
                    <DemoHomepage />
                </div>
            </Drawer>
        </>
    );
}

export default React.memo(HeaderDoctorWebsite);
