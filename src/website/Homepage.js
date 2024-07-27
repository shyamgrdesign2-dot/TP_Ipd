import React, { useState, useCallback } from 'react';
import { Button, Col, Row, Modal } from "antd";

import "../assets/scss/website-custom.scss";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from "react-slick";
import moment from "moment";

import LocationClinic from '../assets/images/website-images/location-clinic.svg'
import Location from '../assets/images/website-images/location.svg'
import locationGrey from '../assets/images/website-images/location-grey.svg'
import Mail from '../assets/images/website-images/mail.svg'
import Plus from '../assets/images/website-images/plus.svg'
import Minus from '../assets/images/website-images/minus.svg'
import BAPhoto from '../assets/images/website-images/book-appointment-photo.png'
import Direction from '../assets/images/website-images/direction.svg'
import Call from '../assets/images/website-images/call.svg'
import Clock from '../assets/images/website-images/clock.svg'
import CheckIcon from '../assets/images/website-images/check.svg'
import AboutIcon from '../assets/images/website-images/about-icon.svg'
import ClinicIcon from '../assets/images/website-images/clinic-icon.svg'
import ServicecIcon from '../assets/images/website-images/service-icon.svg'
import rewardsIcon from '../assets/images/website-images/rewards-icon.svg'
import ExperienceIcon from '../assets/images/website-images/experience-icon.svg'
import experianceSlideBottomRound from '../assets/images/website-images/experiance-slide-bottom-round.svg'
import HospitalIcon from '../assets/images/website-images/hospital-icon.svg'
import AboutImg from '../assets/images/website-images/about-img.svg'
import MembershipsIcon from '../assets/images/website-images/membership.svg'
import MembershipsImg from '../assets/images/website-images/membership-img.svg'
import membershipSlide from '../assets/images/website-images/membership-slide.png'
import DoctorProfile from '../assets/images/website-images/doctor-img.png'
import DoctorDefault from '../assets/images/website-images/doctor-default.png'
import avatarDoctor from '../assets/images/website-images/avatar-doctor.svg'
import websiteLogo from '../assets/images/website-images/logo.png'
import websiteFacebook from '../assets/images/website-images/website-facebook.svg'
import websiteInstagram from '../assets/images/website-images/website-instagram.svg'
import websiteLinkedin from '../assets/images/website-images/website-linkedin.svg'
import websiteTwitter from '../assets/images/website-images/website-twitter.svg'
import websiteYoutube from '../assets/images/website-images/website-youtube.svg'

const slideData = [1, 2, 3, 4]
const dateFormat = 'HH:mm:ss'
const showDateFormat = 'h:mm A'

function Homepage({ personalDetails, aboutDoctor, clinicProfile, services, rewardRecognition, educationTraining, doctorExperience, membership, otherSettings, socialLinks }) {

  const [currentSlide, setCurrentSlide] = useState(0);

  // Read More content
  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
      <p className="text mb-0 lh-base">
        {isReadMore && text.length > 285 ? text.slice(0, 285) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          {text.length > 285 ? isReadMore ? "... Read More" : " Show Less" : ""}
        </span>
      </p>
    );
  };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "60px",
    arrows: false,
    speed: 500,
    dots: true,
    adaptiveHeight: true,
    afterChange: (current) => setCurrentSlide(current),
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerMode: false,
        }
      },
    ]
  };

  const commonSettings = {
    infinite: false,
    speed: 500,
    dots: false,
    adaptiveHeight: true,
    afterChange: (current) => setCurrentSlide(current),
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        }
      },
    ]
  };

  // const settingsEducation = {
  //   infinite: false,
  //   slidesToShow: educationTraining.length < 3,
  //   speed: 500,
  //   dots: false,
  //   adaptiveHeight: true,
  //   afterChange: (current) => setCurrentSlide(current),
  //   autoplay: false,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 1,
  //       }
  //     },
  //   ]
  // };

  // const settingsMembership = {
  //   infinite: false,
  //   speed: 500,
  //   dots: false,
  //   slidesToShow: membership?.length <= 2 ? membership?.length : 2,
  //   arrows: membership?.length >= 2 ? true : false,
  //   slidesToScroll: 1,
  //   vertical: true,
  //   verticalSwiping: true,
  //   adaptiveHeight: true,
  //   afterChange: (current) => setCurrentSlide(current),
  //   autoplay: false,
  // };

  // const settingsRewards = {
  //   infinite: false,
  //   slidesToShow: rewardRecognition.length <= 3 ? rewardRecognition?.length : 3,
  //   arrows: rewardRecognition?.length >= 4 ? true : false,
  //   speed: 500,
  //   dots: false,
  //   adaptiveHeight: true,
  //   afterChange: (current) => setCurrentSlide(current),
  //   autoplay: false,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 1,
  //       }
  //     },
  //   ]
  // };

  const settingsAppointment = {
    infinite: false,
    slidesToShow: 1,
    dots: false,
    adaptiveHeight: true,
    afterChange: (current) => setCurrentSlide(current),
    autoplay: false,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="website-wrapper">
      <div style={{ padding: 24.88 }}>

        {/* Header Section */}
        <div className='website-section website-header'>
          <Row className='align-items-center' justify="space-between">
            <Col span={18}>
              <div className='d-flex align-items-center justify-content-between'>
                <img src={websiteLogo} width={151.29} height={35} alt="Logo" />
                <ul className='mb-0'>
                  <li>
                    <a href='#'>About</a>
                  </li>
                  <li>
                    <a href='#'>Clinic</a>
                  </li>
                  <li>
                    <a href='#'>Services</a>
                  </li>
                  <li>
                    <a href='#'>Experience</a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col>
              <Button type="button" onClick={showModal} className="btn btn-primary3 btn-48 rounded-18">
                Book Appointment
              </Button>
            </Col>
          </Row>
        </div>

        {/* Banner Section */}
        <div className="website-section website-banner">
          <Row className='row-80'>
            <Col sm={24} lg={12}>
              <div className="hi text-welcome">Hi, I'm</div>
              <h1 className="doctor-name mb-20 web-h1 web-h1 text-welcome">{`${personalDetails?.first_name} ${personalDetails?.last_name}`}</h1>
              <div className="education-speciality mb-15 text-welcome">{`${personalDetails?.education} - ${personalDetails?.specialty}`}</div>
              <div className="d-flex flex-wrap mb-lg-5 mb-28">
                {/* <div className="location-contact text-welcome mb-2"> <img src={Location} width={18} height={18} alt="Location" /> Ahmedabad</div> */}
                {personalDetails?.email_id && (
                  <div className="location-contact text-welcome"> <img src={Mail} width={18} height={18} alt="Location" />
                    <a href={`mailto:${personalDetails?.email_id}`} className='text-main'>{personalDetails?.email_id}</a>
                  </div>
                )}
              </div>
              <Button type="button" onClick={showModal} className="btn btn-primary3 btn-48 rounded-18">
                Book Appointment
              </Button>
            </Col>
            <Col sm={24} lg={12}>
              <div className='round-pink'></div>
              <div className='doctor-photo'>
                <img src={personalDetails?.hero_image_link ? personalDetails?.hero_image_link : DoctorDefault} alt="Doctor Profile" className={`${personalDetails?.hero_image_link ? 'img-fluid h-100' : ''} `} />
              </div>
              <div className='square-yellow'></div>
            </Col>
          </Row>
        </div>

        {/* About Section */}
        <div className="website-section website-about">
          <Row className='row-80 align-items-start'>
            <Col lg={{ order: 2, span: 12 }}>
              <div className='bg-icon-common mb-20'>
                <img src={AboutIcon} alt="Doctor Profile" />
              </div>
              <h2 className="doctor-name h1 web-h1 text-welcome mb-28">About The Doctor</h2>
              <div className='d-flex align-items-center mb-28'>
                {aboutDoctor?.years_experience && aboutDoctor?.years_experience?.length > 0 && (
                  <div className='about-after ps-3 me-5'>
                    <div className='fs-18 text-welcome fw-medium'>{`${aboutDoctor?.years_experience} Years`}</div>
                    <div>Overall Experience</div>
                  </div>
                )}
                {aboutDoctor?.language && aboutDoctor?.language?.length > 0 && (
                  <div className='about-after ps-3'>
                    <div className='fs-18 text-welcome fw-medium'>{aboutDoctor?.language.join(', ')}</div>
                    <div>Languages</div>
                  </div>
                )}
              </div>
              {aboutDoctor?.about && (
                <>
                  <ReadMore class="title-common">
                    {aboutDoctor?.about}
                  </ReadMore>
                  {/* <div className="title-common text-primary cursor-pointer d-inline"><img src={Plus} alt="Read More" /> Read More</div> */}
                </>
              )}
            </Col>
            <Col sm={24} lg={12} className='mt-5 mt-lg-0'>
              <img src={AboutImg} className='img-fluid' alt="About The Doctor" />
            </Col>
          </Row>
        </div>
      </div>

      {/* Clinic Section */}
      {clinicProfile?.filter(el => !el.clinic_delete)?.length > 0 ? (
        <div className="website-section website-clinic">
          <div className='text-center'>
            <div className='bg-icon-common mx-auto mb-20'>
              <img src={ClinicIcon} alt="Clinic Address & Hours" />
            </div>
            <h3 className="doctor-name h1 web-h1 text-welcome mb-lg-5 mb-28">Clinic Address & Hours</h3>
          </div>
          <div className="slider-container">
            <Slider
              {...settings}
              slidesToShow={1}
              arrows={false}
              className='clinic-slider'>
              {clinicProfile?.filter(el => !el.clinic_delete)?.map((e, i) => {
                return (
                  <div key={Math.random()} className='clinic-box'>
                    <Row justify="space-between">
                      <Col sm={24} lg={12}>
                        <div className='py-lg-4 py-3'>
                          {e?.name && (
                            <div className='d-flex align-items-center'>
                              <div className='bg-icon-common bg-icon-white'><img src={LocationClinic} alt="Clinic Address & Hours" /></div>
                              <div className='ms-3 title-hypertension text-white'>{e?.name}</div>
                            </div>
                          )}
                          {e?.address && (
                            <p className='clinic-address'>{`${e?.address.address_line}, ${e?.address.city}, ${e?.address.state}, ${e?.address.pincode}`}</p>
                          )}
                        </div>
                        {e?.clinic_photos?.length > 0 && (
                          <div className='d-flex'>
                            {e?.clinic_photos && e?.clinic_photos?.filter(el => !el?.clinic_image_delete)?.slice(0, 3)?.map((item, index) => {
                              return (
                                <div key={index} className='clinic-photo'>
                                  <img className='img-fluid h-100' src={item?.clinic_image_link} alt={item?.clinic_image_name} />
                                </div>
                              )
                            })}
                            {e?.clinic_photos && e?.clinic_photos?.filter(el => !el?.clinic_image_delete)?.length > 3 && (
                              <div className='clinic-photo d-flex align-items-center justify-content-center'>
                                <div className='title-common text-white'>{`${e?.clinic_photos?.filter(el => !el.clinic_image_delete)?.length - 3}+`}</div>
                              </div>
                            )}
                          </div>
                        )}
                        <div className='d-flex flex-wrap mt-4 mt-lg-5 clinic-btn'>
                          {e?.address?.google_map && (
                            <Button type="button" onClick={() => window.open(e?.address?.google_map)} className="btn btn-primary3 btn-48">
                              <img src={Direction} alt="Direction" /> Direction to Clinic
                            </Button>
                          )}
                          {e?.contact_no && (
                            <Button type="button" onClick={() => window.location.href = (`tel:${e.contact_no}`)} className="btn btn-primary3 btn-48">
                              <img src={Call} alt="Call" /> Call Clinic
                            </Button>
                          )}
                        </div>
                      </Col>
                      <Col sm={24} lg={12}>
                        {e?.shift?.length > 0 && (
                          <div class="me-lg-0 mx-auto timingshape">
                            <div className='p-30'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='title-hypertension fw-medium text-welcome'>Timings</div>
                                <div className='bg-icon-common bg-icon-white'><img src={Clock} alt="Clinic Address & Hours" /></div>
                              </div>
                              {e?.shift?.map((e1, i1) => (
                                <div key={i1} className='mt-4'>
                                  {e1?.days?.length > 0 && e1?.timing?.length && (
                                    <>
                                      <div className='text-welcome fw-medium fs-16 text-capitalize'>{`${e1?.days?.length > 1 ? e1?.days[0] + ' - ' + e1?.days[e1?.days?.length - 1] : e1?.days[0]}`}</div>

                                      {e1?.timing?.map((e2, i2) => (
                                        <div key={i2} className='text-welcome fs-16'>
                                          {`${e2?.from_time && e2?.end_time ? moment(e2?.from_time, dateFormat).format(showDateFormat) + ' - ' + moment(e2?.end_time, dateFormat).format(showDateFormat) : ''}`}
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className='slide-count'><span>{String(currentSlide + 1).padStart(2, "0")}/{String(clinicProfile?.filter(el => !el.clinic_delete)?.length).padStart(2, "0")}</span></p>
                      </Col>
                    </Row>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>
      ) : null}

      <div style={{ padding: 24.88 }}>
        {/* Service Section */}
        {services?.length > 0 && otherSettings?.enable_services ? (
          <div className="website-section mt-2 mt-lg-5">
            <div className='row-80'>
              <div className='text-center border bg-body p-5' style={{ borderRadius: 40 }}>
                <div className='bg-icon-common mx-auto mb-20'>
                  <img src={ServicecIcon} alt="Our Services" />
                </div>
                <h3 className="doctor-name h1 web-h1 text-welcome mb-lg-5 mb-28">Our Services</h3>
                <Row >
                  {services?.map((e, i) => {
                    return (
                      <Col key={i} sm={24} lg={12}>
                        {e?.title && (
                          <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> {e?.title}</div>
                        )}
                      </Col>
                    )
                  })}
                </Row>
              </div>
            </div>
          </div>
        ) : null}

        {/* Doctor Experience Section */}
        {doctorExperience?.length > 0 && otherSettings?.enable_doctor_experience ? (
          <div className="website-section website-clinic website-experience">
            <Row className='row-80 align-items-start'>
              <Col sm={24} lg={8}>
                <div className='bg-icon-common mb-20'>
                  <img src={ExperienceIcon} alt="Doctor Experience" />
                </div>
                <h2 className="doctor-name h1 web-h1 text-welcome mb-28">Doctor Experience</h2>
                {doctorExperience?.length > 2 && (
                  <div className='py-5 mt-5'>
                    <p className='slide-count'><span>{String(currentSlide + 1).padStart(2, "0")} - {String(doctorExperience?.length).padStart(2, "0")}</span></p>
                  </div>
                )}
              </Col>
              <Col sm={24} lg={16} className='mt-5 mt-lg-0'>
                <Slider  {...commonSettings}
                  slidesToShow={doctorExperience?.length <= 2 ? doctorExperience?.length : 2}
                  arrows={doctorExperience?.length >= 3 ? true : false}
                  className='clinic-slider'>
                  {doctorExperience?.map((e, i) => {
                    return (
                      <div>
                        <div className='position-relative'>
                          <div className='border-shape-right'></div>
                          <div className='border-shape-bottom'></div>
                          <div class="timingshape">
                            <div className='h-100 d-flex flex-column justify-content-between p-30'>
                              {(!e?.title && !e?.hospital && !e?.city && (!e?.start_month || !e?.start_year) && (!e?.end_month || !e?.end_year)) && 'No details added'}
                              <div>
                                {e?.currently_working ? (
                                  e?.start_month && e?.start_year && (
                                    <div>{`${moment(e?.start_month).format('MMM') + ' ' + moment(e?.start_year).format('YYYY')}`}</div>
                                  )
                                ) : (
                                  <div>{`${e?.start_month && e?.start_year && moment(e?.start_month).format('MMM') + ' ' + moment(e?.start_year).format('YYYY')}${e?.start_month && e?.start_year && e?.end_month && e?.end_year && ' - '}${e?.end_month && e?.end_year && moment(e?.end_month).format('MMM') + ' ' + moment(e?.end_year).format('YYYY')}`}</div>
                                )}
                                <div className='fw-medium text-welcome title-hypertension mt-3'>{e?.title}</div>
                              </div>
                              <div>
                                {e?.hospital && (
                                  <>
                                    <div className='bg-icon-common'>
                                      <img src={HospitalIcon} alt="Hospital Icon" />
                                    </div>
                                    <div className='text-welcome fs-16 mt-2'>{e?.hospital}</div>
                                  </>
                                )}
                                {e?.city && (
                                  <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" />{e?.city}</div>
                                )}
                              </div>
                            </div>
                            <div className={`round-shape-top-education ${i % 2 === 1 && 'round-education-pink'}`}></div>
                            <div className='shape-education'></div>
                          </div>
                        </div>
                        <img className='round-experience-shape' src={experianceSlideBottomRound} alt="Experience Round" />
                      </div>
                    )
                  })}
                </Slider>
              </Col>
            </Row>
          </div>
        ) : null}

        {/* Education & Training */}
        {educationTraining?.length > 0 && otherSettings?.enable_education_training ? (
          <div className="website-section website-clinic website-education">
            <div className='row-80'>
              <div className="slider-container">
                <div className='clinic-box'>
                  <div className='py-lg-5 py-3'>
                    <div className='text-center'>
                      <div className='bg-icon-common mx-auto mb-20'>
                        <img src={ClinicIcon} alt="Clinic Address & Hours" />
                      </div>
                      <h3 className="doctor-name h1 text-white">Education & Training</h3>
                    </div>
                  </div>
                  <Slider
                    {...commonSettings}
                    slidesToShow={educationTraining?.length <= 3 ? educationTraining?.length : 3}
                    arrows={educationTraining?.length >= 4 ? true : false}
                    className='clinic-slider'>
                    {educationTraining?.map((e, i) => {
                      return (
                        <div class="timingshape">
                          <div className='h-100 d-flex flex-column justify-content-between p-30'>
                            {(!e?.title && !e?.degree && !e?.city && !e?.start_year && !e?.end_year) && 'No education details added'}
                            <div>
                              <div>{`${e.start_year} - ${e.end_year}`}</div>
                              <div className='titleprint'>{e.title}</div>
                              {e?.degree && (
                                <div className='rounded border bg-white d-inline-block py-1 px-2 mt-2'>{e?.degree}</div>
                              )}
                            </div>
                            {e?.city && (
                              <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> {e?.city}</div>
                            )}
                          </div>
                          <div className={`round-shape-top-education ${i % 2 === 1 && 'round-education-pink'}`}></div>
                          <div className='shape-education'></div>
                        </div>
                      )
                    })}
                  </Slider>
                  {educationTraining?.length > 3 && (
                    <div className='py-5 mt-5'>
                      <p className='slide-count slide-count-left'><span>{String(currentSlide + 1).padStart(2, "0")} - {String(educationTraining?.length).padStart(2, "0")}</span></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Memberships Section */}
        {membership?.length > 0 && otherSettings?.enable_membership ? (
          <div className="website-section website-membership">
            <Row className='row-80'>
              <Col lg={{ order: 2, span: 12 }}>
                <div className='bg-icon-common mb-20'>
                  <img src={MembershipsIcon} alt="Memberships" />
                </div>
                <h2 className="doctor-name h1 web-h1 text-welcome mb-28">Memberships</h2>
                <Slider
                  {...commonSettings}
                  slidesToShow={membership?.length <= 2 ? membership?.length : 2}
                  arrows={membership?.length >= 3 ? true : false}
                  vertical={true}
                  verticalSwiping={true}
                  className='clinic-slider'>
                  {membership?.map((e, i) => {
                    return (
                      <div key={i} className='d-flex align-items-center mb-3'>
                        {e.title && (
                          <>
                            <div className='border membership-slide'>
                              <img src={membershipSlide} className='img-fluid z-1' alt="Memberships" />
                              <div className={`membership-yellow-blur-box ${i % 2 === 1 && 'membership-pink-blur-box'}`}></div>
                            </div>
                            <div className='ms-3 title-common'>
                              {e?.title}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </Slider>
                {membership?.length > 2 && (
                  <div className='py-5 mt-5'>
                    <p className='slide-count'><span>{String(currentSlide + 1).padStart(2, "0")} - {String(membership?.length).padStart(2, "0")}</span></p>
                  </div>
                )}
              </Col>
              <Col sm={24} lg={12} className='mt-5 mt-lg-0'>
                <img src={MembershipsImg} className='img-fluid' alt="About The Doctor" />
              </Col>
            </Row>
          </div>
        ) : null}

        {/* Rewards & Recognitions Section */}
        {rewardRecognition?.length > 0 && otherSettings?.enable_reward_recognition ? (
          <div className="website-section website-clinic website-experience website-rewards">
            <div className='row-80 align-items-start'>
              <Row className='align-items-start'>
                <Col sm={24} lg={16}>
                  <div className='bg-icon-common mb-20'>
                    <img src={rewardsIcon} alt="Doctor Experience" />
                  </div>
                  <h2 className="doctor-name h1 web-h1 text-welcome mb-28">Rewards & Recognitions</h2>
                </Col>
                <Col sm={24} lg={8}>
                  {rewardRecognition?.length && (
                    <div className='py-5 mt-5'>
                      <p className='slide-count text-end'><span>{String(currentSlide + 1).padStart(2, "0")} - {String(rewardRecognition?.length).padStart(2, "0")}</span></p>
                    </div>
                  )}
                </Col>
              </Row>
              <Slider
                {...commonSettings}
                slidesToShow={rewardRecognition?.length <= 3 ? rewardRecognition?.length : 3}
                arrows={rewardRecognition?.length >= 4 ? true : false}
                className='clinic-slider'>
                {rewardRecognition?.map((e, i) => {
                  return (
                    <div key={i} className='position-relative'>
                      <div className='border-shape-right'></div>
                      <div className='border-shape-bottom'></div>
                      <div class="timingshape">
                        <div className='h-100 d-flex flex-column justify-content-between p-30'>
                          {(!e?.title && !e?.year) && 'No any rewards & recognitions added'}
                          <div className='titleprint mt-3'>{e?.title}</div>
                          <div className="text-welcome d-flex align-items-center"> {e?.year}</div>
                        </div>
                        <div className={`round-shape-top-education ${i % 2 === 1 && 'round-education-pink'}`}></div>
                        <div className='shape-education'></div>
                      </div>
                    </div>
                  )
                })}
              </Slider>
            </div>
          </div>
        ) : null}

        {/* Profile and Social Media Links */}
        <div className="website-section mt-2 mt-lg-5">
          <div className='row-80 text-center'>
            <div className='bg-icon-common bg-icon-xl mx-auto mb-20'>
              <img src={avatarDoctor} alt="Doctor Profile" />
            </div>
            <h3 className="doctor-name h1 web-h1 text-welcome">{`${personalDetails?.first_name} ${personalDetails?.last_name}`}</h3>
            <div className='fs-18 text-welcome fw-medium mt-1'>{`${personalDetails?.education}, - ${personalDetails?.specialty}`}</div>
            <Button type="button" onClick={showModal} className="btn btn-primary3 btn-48 rounded-18 mt-4 px-4 mb-5">
              Book Appointment
            </Button>
            <hr className='mx-auto' style={{ width: 200 }} />
            {personalDetails?.email_id && (
              <div className='border rounded-4 d-flex align-items-center mx-auto d-inline-flex mt-5 pe-3 py-2' style={{ borderRadius: 25 }}>
                <div className='bg-icon-common bg-icon-sm2 mx-2'><img src={Mail} alt="Email" /></div>
                <a href={`mailto:${personalDetails?.email_id}`} className='text-main'>{personalDetails?.email_id}</a>
              </div>
            )}
            <br />
            {otherSettings?.enable_social_links ? (
              <div className='d-flex align-items-center justify-content-center mt-5'>
                {socialLinks?.facebook && (
                  <div className='bg-icon-common bg-icon-32 cursor-pointer' onClick={() => window.open(socialLinks?.facebook)}><img src={websiteFacebook} alt="Email" /></div>
                )}
                {socialLinks?.instagram && (
                  <div className='bg-icon-common bg-icon-32 cursor-pointer' onClick={() => window.open(socialLinks?.instagram)} ><img src={websiteInstagram} alt="Email" /></div>
                )}
                {socialLinks?.linkedin && (
                  <div className='bg-icon-common bg-icon-32 cursor-pointer' onClick={() => window.open(socialLinks?.linkedin)}><img src={websiteLinkedin} alt="Email" /></div>
                )}
                {socialLinks?.twitter && (
                  <div className='bg-icon-common bg-icon-32 cursor-pointer' onClick={() => window.open(socialLinks?.twitter)}><img src={websiteTwitter} alt="Email" /></div>
                )}
                {socialLinks?.youtube && (
                  <div className='bg-icon-common bg-icon-32 cursor-pointer' onClick={() => window.open(socialLinks?.youtube)}><img src={websiteYoutube} alt="Email" /></div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Section */}
        <div className="website-section website-clinic">
          <div className="slider-container">
            <div className='clinic-box p-4'>
              <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between'>
                <img style={{ filter: 'brightness(0) invert(1)' }} src={websiteLogo} width={151} height={35} alt="Footer Logo" />
                <div className='text-white mt-4 mt-lg-0'>© {(new Date().getFullYear())} TatvaPractice. All rights reserved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Model */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        width={792}
        className='website-appointment-model p-lg-5'>
        <div className='model-title text-welcome mt-4'>Book an Appointment</div>
        <div className='model-subtitle mt-2'>Please contact the clinic to schedule an appointment.</div>
        <Row className='mt-4'>
          <Col sm={24} lg={16}>
            <Slider {...settingsAppointment} className='clinic-slider'>
              <div class="timingshape">
                <div className='h-100 d-flex flex-column justify-content-between appt-30'>
                  <div>
                    <div className='d-flex align-items-center'>
                      <div className='appointment-dp'>
                        <img src={DoctorProfile} className='img-fluid' alt="Doctor Profile" />
                      </div>
                      <div className='ms-3'>
                        <div className='appt-drname text-welcome'>Dr. Kunal Shah</div>
                        <div className='appt-dreducation text-welcome'>MBBS, MD - Anaesthesiology</div>
                      </div>
                    </div>
                    <Row className='mt-4'>
                      <Col sm={24} lg={4}>
                        <div className='bg-icon-common bg-icon-sm2 mb-2 bg-white border'><img src={LocationClinic} alt="Clinic Address & Hours" /></div>
                      </Col>
                      <Col sm={24} lg={20}>
                        <div className='model-subtitle text-welcome fw-medium'>Aayushyam Clinic Centre LLP</div>
                        <div>Ground Floor, Sheetal Varsha Complex,
                          Landmark: Near Shivranjani Cross Road,
                          Ahmedabad, Gujarat 380015</div>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Button type="button" onClick={showModal} className="btn btn-primary3 btn-48 rounded-18">
                      <a className='text-white d-flex align-items-center' href='tel:+91 7894561230'><img src={Call} className='me-2' alt="Call" /> Call +91 7894561230</a>
                    </Button>
                  </div>
                </div>
                <div className='round-shape-top-education round'></div>
                <div className='shape-education'></div>
                <p className='mb-0 position-absolute slide-count slide-count-left' style={{ bottom: 33, zIndex: 99, right: 5 }}><span className='text-welcome'>0{currentSlide + 1} / </span> <span className='text-greycolor'> 0{slideData.length}</span></p>
              </div>
              <div class="timingshape">
                <div className='h-100 d-flex flex-column justify-content-between appt-30'>
                  <div>
                    <div className='d-flex align-items-center'>
                      <div className='appointment-dp'>
                        <img src={DoctorProfile} className='img-fluid' alt="Doctor Profile" />
                      </div>
                      <div className='ms-3'>
                        <div className='appt-drname text-welcome'>Dr. Kunal Shah</div>
                        <div className='appt-dreducation text-welcome'>MBBS, MD - Anaesthesiology</div>
                      </div>
                    </div>
                    <Row className='mt-4'>
                      <Col sm={24} lg={4}>
                        <div className='bg-icon-common bg-icon-sm2 mb-2 bg-white border'><img src={LocationClinic} alt="Clinic Address & Hours" /></div>
                      </Col>
                      <Col sm={24} lg={20}>
                        <div className='model-subtitle text-welcome fw-medium'>Aayushyam Clinic Centre LLP</div>
                        <div>Ground Floor, Sheetal Varsha Complex,
                          Landmark: Near Shivranjani Cross Road,
                          Ahmedabad, Gujarat 380015</div>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Button type="button" onClick={showModal} className="btn btn-primary3 btn-48 rounded-18">
                      <a className='text-white d-flex align-items-center' href='tel:+91 7894561230'><img src={Call} className='me-2' alt="Call" /> Call +91 7894561230</a>
                    </Button>
                  </div>
                </div>
                <div className='round-shape-top-education round'></div>
                <div className='shape-education'></div>
                <p className='mb-0 position-absolute slide-count slide-count-left' style={{ bottom: 33, zIndex: 99, right: 5 }}><span className='text-welcome'>0{currentSlide + 1} / </span> <span className='text-greycolor'> 0{slideData.length}</span></p>
              </div>
            </Slider>
          </Col>
          <Col lg='auto' className='d-none d-sm-none d-lg-block'>
            <img src={BAPhoto} className='img-fluid' alt="Book Appointment" />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
export default React.memo(Homepage);