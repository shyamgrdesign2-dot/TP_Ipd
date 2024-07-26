import React, { useContext, useState, useRef } from 'react';
import { Button, Dropdown, Modal, Progress, Space, Input } from 'antd';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import stopPublishing from '../../assets/images/stop-publishing.svg';
import LinkIcon from '../../assets/images/Link.svg';

import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';

import { saveDoctorWebsite, publishDoctorWebsite } from "../../redux/doctorWebsiteSlice";
import { errorMessage } from '../../utils/utils';

function HeaderDoctorWebsite() {

    const dispatch = useDispatch();
    const { save_loading, publish_loading } = useSelector((state) => state.doctorWebsite);

    const navigate = useNavigate();

    const { tmdwm_id, personalDetails, clinicProfile, aboutDoctor, doctorExperience, services, educationTraining, membership, rewardRecognition, socialLinks, otherSettings } = useContext(DoctorWebsiteSettingsContext);

    const [modalOpen, setModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [publishId, setPublishId] = useState(null);
    const cancelTokenSource = useRef(null);

    const items = [
        {
            label: <div>Unpublish Website</div>,
            key: 'UnPublish',
        },
    ];

    async function onSaveWebsiteClick() {
        setProgress(0);
        setModalOpen(true)

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
            cancelToken: cancelTokenSource.current.token
        }));
        if (action.meta.requestStatus === "fulfilled") {
            navigate('/doctor_website_setting', { replace: true, state: { websiteData: { ...action.payload } } })
        } else {
            setModalOpen(false)
            errorMessage(action.error)
        }
    }

    const onUploadProgress = (progressEvent) => {
        const total = progressEvent.total
        const current = progressEvent.loaded
        const percentage = Math.round((current / total) * 100);
        setProgress(percentage);
    };

    const handleCancelUpload = () => {
        if (cancelTokenSource.current) {
            cancelTokenSource.current.cancel('Upload canceled by the user.');
        }
    };

    async function onPublishWebsiteClick() {
        var sendData = {
            tmdwm_id: tmdwm_id,
            website_publish: 1
        }

        const action = await dispatch(publishDoctorWebsite(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            setPublishId(action.payload?.publish_id)
        } else {
            setModalOpen(false)
            errorMessage(action.error)
        }
    }

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <Container fluid className='h-100 gx-0 w-100'>
                <Row className='h-100 align-items-center w-100 justify-content-between'>
                    <Col sm="auto" className='h-100'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center'>
                                <div onClick={() => navigate(-1)} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
                                </div>
                            </div>
                            <div className='ms-3 title-common'>Setup Website</div>
                        </div>
                    </Col>
                    <Col sm="auto">
                        <div className='align-items-center d-flex'>
                            <button className='btn d-flex align-items-center btn-text me-14'>
                                <i className="icon-New-Window me-2"></i> <span>Live Reference Demo</span>
                            </button>
                            <button className='btn d-flex align-items-center btn-text me-14'>
                                <i className="icon-Preview me-2"></i> <span>Your Website Preview</span>
                            </button>
                            <Button
                                type='button'
                                className="btn-41 btn px-4 btn-primary3 align-items-center d-flex"
                                loading={save_loading}
                                disabled={personalDetails?.first_name
                                    && personalDetails?.last_name
                                    && personalDetails?.education
                                    && aboutDoctor?.years_experience
                                    && aboutDoctor?.language?.length > 0
                                    && clinicProfile?.filter(el => !el.clinic_delete)?.length > 0
                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.name
                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.contact_no
                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.address?.pincode
                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.address?.city
                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.address?.address_line
                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.shift?.length > 0 ? false : true}
                                onClick={onSaveWebsiteClick}>
                                <i className="icon-New-Window me-2"></i> Save & Publish Website
                            </Button>
                            <Modal
                                open={modalOpen}
                                centered
                                footer={null}
                                className="text-center website-publish-modal"
                                destroyOnClose
                                onCancel={() => setModalOpen(false)}
                            // onCancel={null}
                            >
                                <div className='p-3 web-publish'>
                                    {progress >= 100 ? (
                                        <>
                                            <Button style={{ minWidth: 100, minHeight: 100, backgroundColor: "#19BB7A", border: 'none' }} shape="circle" icon={<i style={{ fontSize: 50 }} className="icon-check text-white"></i>} />
                                            <div className="title-hypertension text-welcome mt-4 mb-2">{`Successfully ${publishId ? 'published' : 'processed'}`}</div>
                                            <div className='title-common'>{`Your website has been ${publishId ? 'published' : 'processed'} successfully.`}</div>

                                            {publishId ? (
                                                <>
                                                    <div className='text-start mt-4'>
                                                        <label className='fw-medium mb-1'>Live website URL</label>
                                                        <Space.Compact className='h-45' style={{ width: '100%' }}>
                                                            <Input className='fontroboto' defaultValue={`https://tatvacare.in/ahmedabad/aksharclinic/MBBS MD-anaesthesiology/dr-kunal-shah/${publishId}`} />
                                                            <Button className='h-45 bg-selected border'><img className='me-2' src={LinkIcon} alt="Warning" /> Copy</Button>
                                                        </Space.Compact>
                                                    </div>

                                                    <div className="d-flex align-items-center mt-4">
                                                        <Button type="text" className="btn btn-primary2 align-items-center justify-content-center d-flex btn-41 w-50"
                                                            icon={<i className="icon-New-Window"></i>} >
                                                            Live Preview
                                                        </Button>
                                                        <Button type="text" className="btn btn-primary3 align-items-center justify-content-center d-flex btn-41 w-50 ms-4"
                                                            icon={<i className="icon-right iconrotate180 ms-auto"></i>}>
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
                                                            onClick={() => setModalOpen(false)}>
                                                            Don't Publish
                                                        </Button>
                                                        <Button
                                                            type="text"
                                                            className="btn btn-primary3 align-items-center justify-content-center d-flex btn-41 w-50 ms-4"
                                                            loading={publish_loading}
                                                            onClick={onPublishWebsiteClick}>
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
                                            <div className='title-common'>Please wait a while, Your website is being saved & published.</div>
                                            <Button className="lh-lg btn btn-clear btn-41 px-4 mt-4" onClick={handleCancelUpload}>
                                                <img className='me-3' src={stopPublishing} alt="Warning" /> <span>Stop Processing</span>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Modal>
                            <Dropdown className='btn btn-outline btn-more p-0 ms-3' menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <i className='icon-More'></i>
                                </a>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Container >
        </Navbar >
    );
}

export default HeaderDoctorWebsite;
