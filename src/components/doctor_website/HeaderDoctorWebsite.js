import React, { useContext } from 'react';
import { Button, Dropdown } from 'antd';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';

import { saveDoctorWebsite } from "../../redux/doctorWebsiteSlice";
import { errorMessage } from '../../utils/utils';

function HeaderDoctorWebsite() {

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.doctorWebsite);

    const navigate = useNavigate();

    const { personalDetails, clinicProfile, aboutDoctor, doctorExperience, services, educationTraining, membership, rewardRecognition, socialLinks, otherSettings } = useContext(DoctorWebsiteSettingsContext);

    const items = [
        {
            label: <div>Unpublish Website</div>,
            key: 'UnPublish',
        },
    ];

    async function onPublishWebsiteClick() {
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

        const action = await dispatch(saveDoctorWebsite(sendData));
        if (action.meta.requestStatus === "fulfilled") {
            navigate('/doctor_website_setting', { replace: true, state: { websiteData: { ...action.payload } } })
        } else {
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
                            <Button type='button' className="btn-41 btn px-4 btn-primary3 align-items-center d-flex" loading={loading} onClick={onPublishWebsiteClick}>
                                <i className="icon-New-Window me-2"></i> Publish Website
                            </Button>
                            <Dropdown className='btn btn-outline btn-more p-0 ms-3' menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <i className='icon-More'></i>
                                </a>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default HeaderDoctorWebsite;
