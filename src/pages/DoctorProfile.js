import React, { useEffect, useCallback, useState } from "react";
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import { Flex, Progress, Button } from 'antd';
import { handleCopy, makeDefaultLogo } from "../utils/utils";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import defaultprofile from "../assets/images/default-profile.svg";
import Link1 from "../assets/images/link1.svg";

import ProfilePersonalDetailsView from "../components/doctor_profile/ProfilePersonalDetailsView";
import ProfileClinicView from "../components/doctor_profile/ProfileClinicView";
import { TAB_ADDRESS } from "../utils/constants";

function DoctorProfile() {

  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.doctors);

  const { state } = useLocation();
  const { websiteData } = state

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

  }, [personalDetails, clinicProfile, aboutDoctor, doctorExperience, rewardRecognition, membership, socialLinks, services, educationTraining, otherSettings]);

  return (
    <>
      <Navbar className="justify-content-between headerprescription p-0">
        <Container fluid className='h-100 gx-0 w-100'>
          <Row className='h-100 align-items-center w-100 justify-content-between'>
            <Col lg="auto" className='h-100'>
              <div className='align-items-center d-flex h-100'>
                <div className='border-end h-100 text-center'>
                  <div onClick={() => navigate('/', { replace: true })} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                    <i className='icon-right'></i>
                  </div>
                </div>
                <div className='ms-3 title-common'>My Profile</div>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <div className="bg-body p-30 overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
        <Container fluid='lg'>
          <div className="mb-4">
            <div className="p-20 rounded-20px rounded-bottom-0" style={{ backgroundColor: 'rgba(237, 223, 247, 0.30)' }}>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {profile?.um_image ? (
                    <img
                      src={profile?.um_image ?? defaultprofile}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "90px" }}
                    />
                  ) : (
                    <div className='rounded-pill patientProfile patientProfile90 border'>{makeDefaultLogo(profile?.um_name)}</div>
                  )}
                </div>
                <div>
                  <div className="title-hypertension text-welcome">{(profile?.um_name)}</div>
                  <div className="title-common">{(profile?.dp_name)}</div>
                </div>
              </div>
            </div>
            <div className="p-20 rounded-20px rounded-top-0 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center web-progress-custom">
                  <Flex gap="small" wrap>
                    <Progress
                      className={`profile-progress-setting mb-1 ${score > 91 ? 'profile-progress-setting-green' : score > 41 && 'profile-progress-setting-yellow'}`}
                      // className="profile-progress-setting"
                      type="circle"
                      size="small"
                      strokeColor={score > 91 ? '#19BB7A' : score > 41 ? '#FF9431' : '#FC5A5A'}
                      trailColor={score > 91 ? 'rgba(25, 187, 122, 0.2)' : score > 41 ? 'rgba(255, 148, 49, 0.2)' : 'rgba(252, 90, 90, 0.2)'}
                      percent={score.toFixed(0)} />
                  </Flex>
                  {!profile?.publish_url ? (
                    <div className="ms-3">
                      <div className="title-common text-welcome">Let's setup your website</div>
                      <div className="fs-14">Start showcasing your sites by completing your details.</div>
                    </div>
                  ) : profile?.website_publish ? (
                    <div className="ms-3">
                      <div className="title-common text-welcome">Website Status: <span className="badge bdg-primary" style={{ backgroundColor: 'rgb(25, 187, 122, 0.1)' }}>Published</span></div>
                      <div className="fs-14 d-flex align-items-center"><div className="text-truncate" style={{ width: 400 }}>{profile?.publish_url}</div> <button type="button" className="align-items-center btn d-flex" onClick={() => handleCopy(profile?.publish_url)}><img className="me-1" src={Link1} /> <span className="text-primary">Copy</span></button></div>
                    </div>
                  ) : (
                    <div className="ms-3">
                      <div className="title-common text-welcome">Website Status: <span className="badge bdg-danger" style={{ backgroundColor: 'rgba(252, 90, 90, 0.1)', color: '#FC5A5A !important' }}>Unpublished</span></div>
                      <div className="fs-14">Your live website URL has been expired.</div>
                    </div>
                  )}

                </div>
                <div>
                  <Button type="text" onClick={() => navigate('/doctor_website_setting', { state: { websiteData: { ...websiteData } } })} className="btn btn-input align-items-center d-flex btn-41 w-100" icon={<i className="icon-group fs-21" />}>
                    {`${profile?.website_publish && profile?.publish_url ? 'Edit' : 'Setup'} Website`}
                    <i className="icon-right iconrotate180 ms-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <ProfilePersonalDetailsView />
          </div>
          <div className="mb-4">
            <ProfileClinicView />
          </div>
        </Container>
      </div>
    </>
  );
}

export default DoctorProfile;
