import React, { useEffect, useCallback, useState } from "react";
import { Col, Progress, Row, Switch } from "antd";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import DoctorWebsiteSettingsContext from '../context/DoctorWebsiteSettingsContext';

import HeaderDoctorWebsite from "../components/doctor_website/HeaderDoctorWebsite";

import { listLanguage } from "../redux/doctorWebsiteSlice";

import mendatoryTick from "../../src/assets/images/mendatory-tick.svg";
import cloudSaved from "../../src/assets/images/cloud-saved.svg";
import DWAboutDoctor from "../components/doctor_website/DWAboutDoctor";
import DWPersonalDetails from "../components/doctor_website/DWPersonalDetails";
import DWClinicProfile from "../components/doctor_website/DWClinicProfile";
import DWDoctorExperience from "../components/doctor_website/DWDoctorExperience";
import DWServices from "../components/doctor_website/DWServices";
import DWEducationTraning from "../components/doctor_website/DWEducationTraning";
import DWRewardsRecognition from "../components/doctor_website/DWRewardsRecognition";
import DWSocialLinks from "../components/doctor_website/DWSocialLinks";
import Homepage from "../website/Homepage";
import DWMembership from "../components/doctor_website/DWMembership";
import { TAB_ADDRESS } from "../utils/constants";

function DoctorWebsiteSetting() {

    const dispatch = useDispatch();

    const { state } = useLocation();
    const { websiteData } = state
    const tmdwm_id = websiteData !== undefined ? websiteData.tmdwm_id : 0;

    const [score, setScore] = useState(0);
    const [personalDetails, setPersonalDetails] = useState(null);
    const [clinicProfile, setClinicProfile] = useState([]);
    const [aboutDoctor, setAboutDoctor] = useState(null);
    const [doctorExperience, setDoctorExperience] = useState([]);
    const [services, setServices] = useState([]);
    const [educationTraining, setEducationTraining] = useState([]);
    const [membership, setMembership] = useState([]);
    const [rewardRecognition, setRewardRecognition] = useState([]);
    const [socialLinks, setSocialLinks] = useState(null);
    const [otherSettings, setOtherSettings] = useState(null);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    const contextApi = { tmdwm_id, personalDetails, setPersonalDetails, clinicProfile, setClinicProfile, aboutDoctor, setAboutDoctor, doctorExperience, setDoctorExperience, rewardRecognition, setRewardRecognition, membership, setMembership, socialLinks, setSocialLinks, services, setServices, educationTraining, setEducationTraining, otherSettings, setOtherSettings };


    useEffect(() => {
        const fetchLanguages = async () => {
            await dispatch(listLanguage());
        }
        fetchLanguages()
    }, []);

    useEffect(() => {
        const makeData = async () => {
            const copy_personalDetails = JSON.parse(JSON.stringify({
                ...websiteData.personal_details,
                uploadFile: null
            }))

            const updatedClinicProfile = websiteData?.clinic_profile?.map(e => {
                const updatedClinicPhotos = e?.clinic_photos?.map(e1 => {
                    return { ...e1, clinic_image_link: e1?.clinic_image_link }
                })
                return { ...e, created_by: 'server', selectedTab: TAB_ADDRESS, clinic_photos: [...updatedClinicPhotos] }
            })
            const copy_clinicProfile = JSON.parse(JSON.stringify([...updatedClinicProfile]))

            const copy_aboutDoctor = JSON.parse(JSON.stringify({ ...websiteData.about_doctor }))
            const copy_doctorExperience = JSON.parse(JSON.stringify([...websiteData.doctor_experience]))

            const updatedServices = websiteData?.services?.map(e => {
                return { ...e, unique_id: uuidv4() }
            })
            const copy_services = JSON.parse(JSON.stringify([...updatedServices]))

            const copy_educationTraining = JSON.parse(JSON.stringify([...websiteData.education_training]))

            const updatedMembership = websiteData?.membership?.map(e => {
                return { ...e, unique_id: uuidv4() }
            })
            const copy_membership = JSON.parse(JSON.stringify([...updatedMembership]))

            const copy_rewardRecognition = JSON.parse(JSON.stringify([...websiteData.reward_recognition]))
            const copy_socialLinks = JSON.parse(JSON.stringify({ ...websiteData.social_links }))

            const copy_otherSettings = {
                enable_doctor_experience: websiteData.enable_doctor_experience,
                enable_services: websiteData.enable_services,
                enable_education_training: websiteData.enable_education_training,
                enable_membership: websiteData.enable_membership,
                enable_reward_recognition: websiteData.enable_reward_recognition,
                enable_social_links: websiteData.enable_social_links
            };

            setPersonalDetails(copy_personalDetails);
            setClinicProfile(copy_clinicProfile);
            setAboutDoctor(copy_aboutDoctor);
            setDoctorExperience(copy_doctorExperience);
            setServices(copy_services);
            setEducationTraining(copy_educationTraining);
            setMembership(copy_membership);
            setRewardRecognition(copy_rewardRecognition);
            setSocialLinks(copy_socialLinks);
            setOtherSettings(copy_otherSettings);
        }
        makeData()
    }, [websiteData]);

    useEffect(() => {
        if (!isVisible) {
            let cal = 0
            //Personal Details
            if (personalDetails?.first_name) {
                cal += 3.703
            }
            if (personalDetails?.last_name) {
                cal += 3.703
            }
            if (personalDetails?.education) {
                cal += 3.703
            }

            //About Doctor
            if (aboutDoctor?.years_experience) {
                cal += 5.555
            }
            if (aboutDoctor?.language?.length > 0) {
                cal += 5.555
            }

            //Clinic Profile
            if (clinicProfile?.filter(el => !el.clinic_delete)?.length > 0) {
                const firstClinic = clinicProfile?.filter(el => !el.clinic_delete)[0]
                if (firstClinic?.name) {
                    cal += 1.587
                }
                if (firstClinic?.contact_no) {
                    cal += 1.587
                }
                if (firstClinic?.address?.pincode) {
                    cal += 1.587
                }
                if (firstClinic?.address?.city) {
                    cal += 1.587
                }
                if (firstClinic?.address?.state) {
                    cal += 1.587
                }
                if (firstClinic?.address?.address_line) {
                    cal += 1.587
                }
                if (firstClinic?.shift?.length > 0) {
                    cal += 1.587
                }
            }

            //Doctor Experience
            if (doctorExperience?.length > 0 && otherSettings?.enable_doctor_experience) {
                const firstDoctorExp = doctorExperience[0]
                if (firstDoctorExp?.title) {
                    cal += 3.703
                }
                if (firstDoctorExp?.hospital) {
                    cal += 3.703
                }
                if (firstDoctorExp?.city) {
                    cal += 3.703
                }
            }

            //Services
            if (services?.length > 0 && otherSettings?.enable_services) {
                const firstServices = services[0]
                if (firstServices?.title) {
                    cal += 11.111
                }
            }

            //Education & Training
            if (educationTraining?.length > 0 && otherSettings?.enable_education_training) {
                const firstEduTraining = educationTraining[0]
                if (firstEduTraining?.title) {
                    cal += 3.703
                }
                if (firstEduTraining?.degree) {
                    cal += 3.703
                }
                if (firstEduTraining?.city) {
                    cal += 3.703
                }
            }

            //Memberships
            if (membership?.length > 0 && otherSettings?.enable_membership) {
                const firstMembership = membership[0]
                if (firstMembership?.title) {
                    cal += 11.111
                }
            }

            //Rewards & Recognition
            if (rewardRecognition?.length > 0 && otherSettings?.enable_reward_recognition) {
                const firstRewardRecognition = rewardRecognition[0]
                if (firstRewardRecognition?.title) {
                    cal += 5.555
                }
                if (firstRewardRecognition?.year) {
                    cal += 5.555
                }
            }

            //Social Links
            if (otherSettings?.enable_social_links) {
                if (socialLinks?.facebook) {
                    cal += 2.222
                }
                if (socialLinks?.instagram) {
                    cal += 2.222
                }
                if (socialLinks?.linkedin) {
                    cal += 2.222
                }
                if (socialLinks?.twitter) {
                    cal += 2.222
                }
                if (socialLinks?.youtube) {
                    cal += 2.222
                }
            }

            const finalScore = cal > 99 ? 100 : cal
            setScore(finalScore)
        }
    }, [isVisible, personalDetails, clinicProfile, aboutDoctor, doctorExperience, rewardRecognition, membership, socialLinks, services, educationTraining, otherSettings]);

    const handlePersonalDetails = useCallback((value, name) => {
        setSelectedMenu({ value: value, name: name })
        showHide();
    }, [selectedMenu, isVisible])

    const showHide = useCallback(() => {
        setIsVisible(!isVisible);
    }, [isVisible])

    const onSwitchChange = useCallback(
        (checked, key) => {
            otherSettings[key] = checked ? 1 : 0;
            setOtherSettings((prev) => { return { ...prev } });
        },
        [otherSettings]
    );

    return (
        <DoctorWebsiteSettingsContext.Provider value={contextApi}>
            <>
                <HeaderDoctorWebsite />
                <div className={'w-100 bg-body wrapper2'}>
                    <Row justify="space-between">
                        <Col xl={8} sm={10} className="pe-3">
                            <div className="bg-white overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                                <div className="p-20 web-progress-custom">
                                    <div className="ms-5 fontroboto">Website Setup Score</div>
                                    <Progress
                                        className={`profile-website-setting mb-1 ${score > 91 ? 'profile-website-setting-green' : score > 41 && 'profile-website-setting-yellow'}`}
                                        size="small"
                                        strokeColor={score > 91 ? '#19BB7A' : score > 41 ? '#FF9431' : '#FC5A5A'}
                                        trailColor={score > 91 ? 'rgba(25, 187, 122, 0.2)' : score > 41 ? 'rgba(255, 148, 49, 0.2)' : 'rgba(252, 90, 90, 0.2)'}
                                        percent={score.toFixed(0)} />

                                    {/* Personal Details */}
                                    <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(1, 'Personal Details')}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="titleprint">Personal Details</div>
                                                <div className="border rounded-1 ms-2 px-1 fw-medium fs-12-1">Mendatory</div>
                                                {personalDetails?.first_name
                                                    && personalDetails?.last_name
                                                    && personalDetails?.education
                                                    && (
                                                        <img className="ms-2" src={mendatoryTick} alt="Mendatory" />
                                                    )}
                                            </div>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="text-greycolor me-30 fontroboto"> Write about doctor's personal details.</div>
                                    </div>

                                    {/* About Doctor */}
                                    <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(2, 'About Doctor')}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="titleprint">About Doctor</div>
                                                <div className="border rounded-1 ms-2 px-1 fw-medium fs-12-1">Mendatory</div>
                                                {aboutDoctor?.years_experience
                                                    && aboutDoctor?.language?.length > 0
                                                    && (
                                                        <img className="ms-2" src={mendatoryTick} alt="Mendatory" />
                                                    )}
                                            </div>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="text-greycolor me-30 fontroboto"> Write a brief introduction. Highlight your role, experience, languages spoken, best qualities, and key skills.</div>
                                    </div>

                                    {/* Clinic Profile */}
                                    <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(3, 'Clinic Profile')}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="titleprint">Clinic Profile</div>
                                                <div className="border rounded-1 ms-2 px-1 fw-medium fs-12-1">Mendatory</div>
                                                {clinicProfile?.filter(el => !el.clinic_delete)?.length > 0
                                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.name
                                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.contact_no
                                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.address?.pincode
                                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.address?.city
                                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.address?.address_line
                                                    && clinicProfile?.filter(el => !el.clinic_delete)[0]?.shift?.length > 0
                                                    && (
                                                        <img className="ms-2" src={mendatoryTick} alt="Mendatory" />
                                                    )}
                                            </div>
                                            <i className="icon-right iconrotate180"></i>
                                        </div>
                                        <div className="text-greycolor me-30 fontroboto"> Add your clinic name, location, timings, and photos.</div>
                                    </div>

                                    {/* Doctor Experience */}
                                    <div className="d-flex border-bottom justify-content-between py-3">
                                        <div className="cursor-pointer w-100" onClick={() => handlePersonalDetails(4, 'Doctor Experience')}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="titleprint">Doctor Experience</div>
                                                <div className="d-flex">
                                                    <span className="fw-medium me-2 text-greycolor fs-16">{otherSettings?.enable_doctor_experience ? 'Show' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="text-greycolor fontroboto">Your experience journey includes previous roles, locations, durations, and descriptions.</div>
                                        </div>
                                        <Switch className="mt-2"
                                            checked={otherSettings?.enable_doctor_experience ? true : false}
                                            onChange={(checked) => onSwitchChange(checked, 'enable_doctor_experience')} />
                                    </div>

                                    {/* Services */}
                                    <div className="d-flex border-bottom justify-content-between py-3">
                                        <div className="cursor-pointer w-100" onClick={() => handlePersonalDetails(5, 'Services')}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="titleprint">Services</div>
                                                <div className="d-flex">
                                                    <span className="fw-medium me-2 text-greycolor fs-16">{otherSettings?.enable_services ? 'Show' : ''}</span>

                                                </div>
                                            </div>
                                            <div className="text-greycolor fontroboto">Include the services you provide to your patients.</div>
                                        </div>
                                        <Switch className="mt-2"
                                            checked={otherSettings?.enable_services ? true : false}
                                            onChange={(checked) => onSwitchChange(checked, 'enable_services')} />
                                    </div>

                                    {/* Education & Training */}
                                    <div className="d-flex border-bottom justify-content-between py-3">
                                        <div className="cursor-pointer w-100" onClick={() => handlePersonalDetails(6, 'Education & Training')}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="titleprint">Education & Training</div>
                                                <div className="d-flex">
                                                    <span className="fw-medium me-2 text-greycolor fs-16">{otherSettings?.enable_education_training ? 'Show' : ''}</span>

                                                </div>
                                            </div>
                                            <div className="text-greycolor fontroboto">A summary of the doctor's academic background, including degrees, institutions attended, and year of completion.</div>
                                        </div>
                                        <Switch className="mt-2"
                                            checked={otherSettings?.enable_education_training ? true : false}
                                            onChange={(checked) => onSwitchChange(checked, 'enable_education_training')} />
                                    </div>

                                    {/* Memberships */}
                                    <div className="d-flex border-bottom justify-content-between py-3">
                                        <div className="cursor-pointer w-100" onClick={() => handlePersonalDetails(7, 'Memberships')}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="titleprint">Memberships</div>
                                                <div className="d-flex">
                                                    <span className="fw-medium me-2 text-greycolor fs-16">{otherSettings?.enable_membership ? 'Show' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="text-greycolor fontroboto">Include the memberships you are associated with.</div>
                                        </div>
                                        <Switch className="mt-2"
                                            checked={otherSettings?.enable_membership ? true : false}
                                            onChange={(checked) => onSwitchChange(checked, 'enable_membership')} />
                                    </div>

                                    {/* Rewards & Recognition */}
                                    <div className="d-flex border-bottom justify-content-between py-3">
                                        <div className="cursor-pointer w-100" onClick={() => handlePersonalDetails(8, 'Rewards & Recognition')}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="titleprint">Rewards & Recognition</div>
                                                <div className="d-flex">
                                                    <span className="fw-medium me-2 text-greycolor fs-16">{otherSettings?.enable_reward_recognition ? 'Show' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="text-greycolor fontroboto">Add your achievements, public acknowledgment or praise, such as awards, certificates, commendations, etc.</div>
                                        </div>
                                        <Switch className="mt-2"
                                            checked={otherSettings?.enable_reward_recognition ? true : false}
                                            onChange={(checked) => onSwitchChange(checked, 'enable_reward_recognition')} />
                                    </div>

                                    {/* Social Links */}
                                    <div className="d-flex justify-content-between mt-20 pb-3 ">
                                        <div className="cursor-pointer w-100">
                                            <div className="d-flex align-items-center justify-content-between" onClick={() => handlePersonalDetails(9, 'Social Links')}>
                                                <div className="titleprint">Social Links</div>
                                                <div className="d-flex">
                                                    <span className="fw-medium me-2 text-greycolor fs-16">{otherSettings?.enable_social_links ? 'Show' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="text-greycolor fontroboto">Add your profile photo and social media profile links.</div>
                                        </div>
                                        <Switch
                                            className="mt-2"
                                            checked={otherSettings?.enable_social_links ? true : false}
                                            onChange={(checked) => onSwitchChange(checked, 'enable_social_links')} />
                                    </div>
                                </div>
                                {isVisible &&
                                    <div className="handle-personal-details">
                                        <div className="d-flex align-items-center bg-selected p-12 ps-0">
                                            <div onClick={showHide} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                                <i className='icon-Cross'></i>
                                            </div>
                                            <div className="titleprint">{selectedMenu ? selectedMenu?.name : ''}</div>
                                            <div className="border rounded-1 ms-2 px-1 fw-medium fs-12-1 bg-white">Mendatory</div>
                                        </div>
                                        {selectedMenu
                                            && selectedMenu?.value === 1 ? <DWPersonalDetails />
                                            : selectedMenu?.value === 2 ? <DWAboutDoctor />
                                                : selectedMenu?.value === 3 ? <DWClinicProfile />
                                                    : selectedMenu?.value === 4 ? <DWDoctorExperience />
                                                        : selectedMenu?.value === 5 ? <DWServices />
                                                            : selectedMenu?.value === 6 ? <DWEducationTraning />
                                                                : selectedMenu?.value === 7 ? <DWMembership />
                                                                    : selectedMenu?.value === 8 ? <DWRewardsRecognition />
                                                                        : selectedMenu?.value === 9 && <DWSocialLinks />}
                                    </div>
                                }
                            </div>
                        </Col>
                        <Col xl={16} sm={14}>
                            <div className="mx-auto overflow-y-auto " style={{ width: isMobile ? 580 : '97%' }} >
                                <div className="mt-20 d-flex align-items-center justify-content-between">
                                    <div className="titleprint">Preview</div>
                                    <div> <img src={cloudSaved} alt="Saved" className="me-1" /> Saved</div>
                                </div>
                                <div className="rounded-20px bg-white mt-2 overflow-hidden">
                                    <div className="printheight">
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
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </>
        </DoctorWebsiteSettingsContext.Provider>
    );
}

export default DoctorWebsiteSetting;