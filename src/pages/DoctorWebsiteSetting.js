import React, { useCallback, useState } from "react";
import { Col, Progress, Row, Switch } from "antd";
import { isMobile } from "react-device-detect";
import HeaderDoctorWebsite from "../components/doctor_website/HeaderDoctorWebsite";

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

function DoctorWebsiteSetting() {

    const [isVisible, setIsVisible] = useState();
    const [selectedMenu, setSelectedMenu] = useState(null);

    const handlePersonalDetails = useCallback((value, name) => {
        setSelectedMenu({ value: value, name: name })
        showHide();
    }, [selectedMenu, isVisible])

    const showHide = useCallback(() => {
        setIsVisible(!isVisible);
    }, [isVisible])

    return (
        <>
            <HeaderDoctorWebsite />
            <div className={'w-100 bg-body wrapper2'}>
                <Row justify="space-between">
                    <Col xl={8} sm={10} className="pe-3">
                        <div className="bg-white overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                            <div className="p-20">
                                <div className="ms-5 fontroboto">Website Setup Score</div>
                                <Progress className="profile-website-setting mb-1" size="small" percent={11} />

                                {/* Personal Details */}
                                <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(1, 'Personal Details')}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div className="titleprint">Personal Details</div>
                                            <div className="border rounded-1 ms-2 px-1 fw-medium fs-12-1">Mendatory</div>
                                            <img className="ms-2" src={mendatoryTick} alt="Mendatory" />
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
                                            <img className="ms-2" src={mendatoryTick} alt="Mendatory" />
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
                                            <img className="ms-2" src={mendatoryTick} alt="Mendatory" />
                                        </div>
                                        <i className="icon-right iconrotate180"></i>
                                    </div>
                                    <div className="text-greycolor me-30 fontroboto"> Add your clinic name, location, timings, and photos.</div>
                                </div>

                                {/* Doctor Experience */}
                                <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(4, 'Doctor Experience')}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="titleprint">Doctor Experience</div>
                                        <div className="d-flex">
                                            <span className="fw-medium me-2 text-greycolor fs-16">Show</span>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                    <div className="text-greycolor me-30 fontroboto">Your experience journey includes previous roles, locations, durations, and descriptions.</div>
                                </div>

                                {/* Services */}
                                <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(5, 'Services')}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="titleprint">Services</div>
                                        <div className="d-flex">
                                            <span className="fw-medium me-2 text-greycolor fs-16">Show</span>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                    <div className="text-greycolor me-30 fontroboto">Include the services you provide to your patients.</div>
                                </div>

                                {/* Education & Training */}
                                <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(6, 'Education & Training')}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="titleprint">Education & Training</div>
                                        <div className="d-flex">
                                            <span className="fw-medium me-2 text-greycolor fs-16">Show</span>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                    <div className="text-greycolor me-30 fontroboto">A summary of the doctor's academic background, including degrees, institutions attended, and year of completion.</div>
                                </div>

                                {/* Memberships */}
                                <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(7, 'Memberships')}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="titleprint">Memberships</div>
                                        <div className="d-flex">
                                            <span className="fw-medium me-2 text-greycolor fs-16">Show</span>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                    <div className="text-greycolor me-30 fontroboto">Include the memberships you are associated with.</div>
                                </div>

                                {/* Rewards & Recognition */}
                                <div className="border-bottom py-3 cursor-pointer" onClick={() => handlePersonalDetails(8, 'Rewards & Recognition')}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="titleprint">Rewards & Recognition</div>
                                        <div className="d-flex">
                                            <span className="fw-medium me-2 text-greycolor fs-16">Show</span>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                    <div className="text-greycolor me-30 fontroboto">Add your achievements, public acknowledgment or praise, such as awards, certificates, commendations, etc.</div>
                                </div>

                                {/* Social Links */}
                                <div className="mt-20 pb-3">
                                    <div className="d-flex align-items-center justify-content-between" onClick={() => handlePersonalDetails(9, 'Social Links')}>
                                        <div className="titleprint">Social Links</div>
                                        <div className="d-flex">
                                            <span className="fw-medium me-2 text-greycolor fs-16">Show</span>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                    <div className="text-greycolor me-30 fontroboto">Add your profile photo and social media profile links.</div>
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
                                    {selectedMenu && selectedMenu?.value === 1 ?
                                        <DWPersonalDetails />
                                        : selectedMenu?.value === 2 ? <DWAboutDoctor />
                                            : selectedMenu?.value === 3 ? <DWClinicProfile />
                                                : selectedMenu?.value === 4 ? <DWDoctorExperience />
                                                    : selectedMenu?.value === 5 ? <DWServices />
                                                        : selectedMenu?.value === 6 ? <DWEducationTraning />
                                                            : selectedMenu?.value === 7 ? <DWEducationTraning />
                                                                : selectedMenu?.value === 8 ? <DWRewardsRecognition />
                                                                    : selectedMenu?.value === 9 && <DWSocialLinks />}
                                </div>
                            }
                        </div>
                    </Col>
                    <Col xl={16} sm={14}>
                        <div className="mx-auto overflow-y-auto " style={{ width: isMobile ? 580 : 900 }} >
                            <div className="mt-20 d-flex align-items-center justify-content-between">
                                <div className="titleprint">Preview</div>
                                <div> <img src={cloudSaved} alt="Saved" className="me-1" /> Saved</div>
                            </div>
                            <div className="rounded-20px bg-white mt-2 overflow-hidden">
                                <div className="position-relative printheight d-flex align-items-center justify-content-center fs-2 fw-normal">
                                    Comming Soon...
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default DoctorWebsiteSetting;