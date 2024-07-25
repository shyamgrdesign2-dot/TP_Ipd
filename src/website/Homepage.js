import React, { useState } from 'react';
import { Button, Col, Row } from "antd";

import "../assets/scss/website-custom.scss";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from "react-slick";

import LocationClinic from '../assets/images/website-images/location-clinic.svg'
import Location from '../assets/images/website-images/location.svg'
import locationGrey from '../assets/images/website-images/location-grey.svg'
import Mail from '../assets/images/website-images/mail.svg'
import Plus from '../assets/images/website-images/plus.svg'
import Minus from '../assets/images/website-images/minus.svg'
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
import avatarDoctor from '../assets/images/website-images/avatar-doctor.svg'
import websiteLogo from '../assets/images/website-images/logo.png'
import websiteFacebook from '../assets/images/website-images/website-facebook.svg'
import websiteInstagram from '../assets/images/website-images/website-instagram.svg'
import websiteLinkedin from '../assets/images/website-images/website-linkedin.svg'
import websiteTwitter from '../assets/images/website-images/website-twitter.svg'
import websiteYoutube from '../assets/images/website-images/website-youtube.svg'

const slideData = [1, 2, 3, 4]

function Homepage() {

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
          {/* <br />
          {text.length > 285 ? isReadMore ? (<div className="title-common text-primary cursor-pointer d-inline"><Image src={Plus} alt="Read More" /> Read More</div>) : (<div className="title-common text-primary cursor-pointer d-inline"><Image src={Minus} alt="Show Less" /> Show Less</div>) : ""} */}
        </span>
      </p>
    );
  };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    dots: true,
    adaptiveHeight: true,
    // slidesToShow: 1,
    // slidesToScroll: 1,
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

  const settingsExperience = {
    infinite: false,
    slidesToShow: 2,
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

  const settingsEducation = {
    infinite: false,
    slidesToShow: 3,
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

  const settingsMembership = {
    infinite: false,
    speed: 500,
    dots: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    adaptiveHeight: true,
    afterChange: (current) => setCurrentSlide(current),
    autoplay: false,
  };

  const settingsRewards = {
    infinite: false,
    slidesToShow: 3,
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
              <Button type="button" className="btn btn-primary3 btn-48 rounded-18">
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
              <h1 className="doctor-name mb-20 web-h1 web-h1 text-welcome">Dr. Kunal Shah</h1>
              <div className="education-speciality mb-15 text-welcome">MBBS, MD - Anaesthesiology</div>
              <div className="d-flex flex-wrap mb-lg-5 mb-28">
                <div className="location-contact text-welcome mb-2"> <img src={Location} width={18} height={18} alt="Location" /> Ahmedabad</div>
                <div className="location-contact text-welcome"> <img src={Mail} width={18} height={18} alt="Location" /> contact@aayushyamclinic.com</div>
              </div>
              <Button type="button" className="btn btn-primary3 btn-48 rounded-18">
                Book Appointment
              </Button>
            </Col>
            <Col sm={24} lg={12}>
              <div className='round-pink'></div>
              <div className='doctor-photo'>
                <img src={DoctorProfile} alt="Doctor Profile" />
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
                <div className='about-after ps-3 me-5'>
                  <div className='fs-18 text-welcome fw-medium'>12 Years</div>
                  <div>Overall Experience</div>
                </div>
                <div className='about-after ps-3'>
                  <div className='fs-18 text-welcome fw-medium'>English, Hindi</div>
                  <div>Languages</div>
                </div>
              </div>
              <ReadMore class="title-common">
                Dr. Kunal Jhaveri is a Spine and Pain Specialist, Pain Management Specialist and Nerve Pain Specialist in Satellite Road, Ahmedabad and has an experience of 6 years in these fields. Dr. Kunal Shah practices at Karnavati Pain Clinic in Satellite Dr. Kunal Jhaveri is a Spine and Pain Specialist, Pain Management Specialist and Nerve Pain Specialist in Satellite Road, Ahmedabad and has an experience of 6 years in these fields. Dr. Kunal Shah practices at Karnavati Pain Clinic in Satellite
              </ReadMore>
              <div className="title-common text-primary cursor-pointer d-inline"><img src={Plus} alt="Read More" /> Read More</div>
            </Col>
            <Col sm={24} lg={12} className='mt-5 mt-lg-0'>
              <img src={AboutImg} className='img-fluid' alt="About The Doctor" />
            </Col>
          </Row>
        </div>
      </div>

      {/* Clinic Section */}
      <div className="website-section website-clinic">
        <div className='text-center'>
          <div className='bg-icon-common mx-auto mb-20'>
            <img src={ClinicIcon} alt="Clinic Address & Hours" />
          </div>
          <h3 className="doctor-name h1 web-h1 text-welcome mb-lg-5 mb-28">Clinic Address & Hours</h3>
        </div>
        <div className="slider-container">
          <Slider {...settings} className='clinic-slider'>
            <div className='clinic-box'>
              <Row justify="space-between">
                <Col sm={24} lg={12}>
                  <div className='py-lg-4 py-3'>
                    <div className='d-flex align-items-center'>
                      <div className='bg-icon-common bg-icon-white'><img src={LocationClinic} alt="Clinic Address & Hours" /></div>
                      <div className='ms-3 title-hypertension text-white'>Aayushyam Clinic Centre LLP</div>
                    </div>
                    <p className='clinic-address'>Ground Floor, Sheetal Varsha Complex,
                      Landmark: Near Shivranjani Cross Road,
                      Ahmedabad, Gujarat 380015</p>
                  </div>
                  <div className='d-flex'>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo d-flex align-items-center justify-content-center'>
                      <div className='title-common text-white'>4+</div>
                    </div>
                  </div>
                  <div className='d-flex flex-wrap mt-4 mt-lg-5 clinic-btn'>
                    <Button type="button" className="btn btn-primary3 btn-48">
                      <img src={Direction} alt="Direction" /> Direction to Clinic
                    </Button>
                    <Button type="button" className="btn btn-primary3 btn-48">
                      <img src={Call} alt="Call" /> Call Clinic
                    </Button>
                  </div>
                </Col>
                <Col sm={24} lg={12}>
                  <div class="me-lg-0 mx-auto timingshape">
                    <div className='p-30'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='title-hypertension fw-medium text-welcome'>Timings</div>
                        <div className='bg-icon-common bg-icon-white'><img src={Clock} alt="Clinic Address & Hours" /></div>
                      </div>
                      <div className='mt-4'>
                        <div className='text-welcome fw-medium fs-16'>Mon - Sat</div>
                        <div className='text-welcome fs-16'>09:00 AM - 04:45 PM</div>
                        <div className='text-welcome fs-16'>09:00 AM - 04:45 PM</div>
                      </div>
                      <div className='mt-4'>
                        <div className='text-welcome fw-medium fs-16'>Sun</div>
                        <div className='text-welcome fs-16'>09:00 AM - 01:00 PM</div>
                      </div>
                    </div>
                  </div>
                  <p className='slide-count'><span>0{currentSlide + 1}</span> <span>/ 0{slideData.length}</span></p>
                </Col>
              </Row>
            </div>
            <div className='clinic-box'>
              <Row justify="space-between">
                <Col sm={24} lg={12}>
                  <div className='py-lg-4 py-3'>
                    <div className='d-flex align-items-center'>
                      <div className='bg-icon-common bg-icon-white'><img src={LocationClinic} alt="Clinic Address & Hours" /></div>
                      <div className='ms-3 title-hypertension text-white'>Aayushyam Clinic Centre LLP</div>
                    </div>
                    <p className='clinic-address'>Ground Floor, Sheetal Varsha Complex,
                      Landmark: Near Shivranjani Cross Road,
                      Ahmedabad, Gujarat 380015</p>
                  </div>
                  <div className='d-flex'>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo d-flex align-items-center justify-content-center'>
                      <div className='title-common text-white'>4+</div>
                    </div>
                  </div>
                  <div className='d-flex flex-wrap mt-4 mt-lg-5 clinic-btn'>
                    <Button type="button" className="btn btn-primary3 btn-48">
                      <img src={Direction} alt="Direction" /> Direction to Clinic
                    </Button>
                    <Button type="button" className="btn btn-primary3 btn-48">
                      <img src={Call} alt="Call" /> Call Clinic
                    </Button>
                  </div>
                </Col>
                <Col sm={24} lg={12}>
                  <div class="me-lg-0 mx-auto timingshape">
                    <div className='p-30'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='title-hypertension fw-medium text-welcome'>Timings</div>
                        <div className='bg-icon-common bg-icon-white'><img src={Clock} alt="Clinic Address & Hours" /></div>
                      </div>
                      <div className='mt-4'>
                        <div className='text-welcome fw-medium fs-16'>Mon - Sat</div>
                        <div className='text-welcome fs-16'>09:00 AM - 04:45 PM</div>
                        <div className='text-welcome fs-16'>09:00 AM - 04:45 PM</div>
                      </div>
                      <div className='mt-4'>
                        <div className='text-welcome fw-medium fs-16'>Sun</div>
                        <div className='text-welcome fs-16'>09:00 AM - 01:00 PM</div>
                      </div>
                    </div>
                  </div>
                  <p className='slide-count'><span>0{currentSlide + 1}</span> <span>/ 0{slideData.length}</span></p>
                </Col>
              </Row>
            </div>
            <div className='clinic-box'>
              <Row justify="space-between">
                <Col sm={24} lg={12}>
                  <div className='py-lg-4 py-3'>
                    <div className='d-flex align-items-center'>
                      <div className='bg-icon-common bg-icon-white'><img src={LocationClinic} alt="Clinic Address & Hours" /></div>
                      <div className='ms-3 title-hypertension text-white'>Aayushyam Clinic Centre LLP</div>
                    </div>
                    <p className='clinic-address'>Ground Floor, Sheetal Varsha Complex,
                      Landmark: Near Shivranjani Cross Road,
                      Ahmedabad, Gujarat 380015</p>
                  </div>
                  <div className='d-flex'>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo d-flex align-items-center justify-content-center'>
                      <div className='title-common text-white'>4+</div>
                    </div>
                  </div>
                  <div className='d-flex flex-wrap mt-4 mt-lg-5 clinic-btn'>
                    <Button type="button" className="btn btn-primary3 btn-48">
                      <img src={Direction} alt="Direction" /> Direction to Clinic
                    </Button>
                    <Button type="button" className="btn btn-primary3 btn-48">
                      <img src={Call} alt="Call" /> Call Clinic
                    </Button>
                  </div>
                </Col>
                <Col sm={24} lg={12}>
                  <div class="me-lg-0 mx-auto timingshape">
                    <div className='p-30'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='title-hypertension fw-medium text-welcome'>Timings</div>
                        <div className='bg-icon-common bg-icon-white'><img src={Clock} alt="Clinic Address & Hours" /></div>
                      </div>
                      <div className='mt-4'>
                        <div className='text-welcome fw-medium fs-16'>Mon - Sat</div>
                        <div className='text-welcome fs-16'>09:00 AM - 04:45 PM</div>
                        <div className='text-welcome fs-16'>09:00 AM - 04:45 PM</div>
                      </div>
                      <div className='mt-4'>
                        <div className='text-welcome fw-medium fs-16'>Sun</div>
                        <div className='text-welcome fs-16'>09:00 AM - 01:00 PM</div>
                      </div>
                    </div>
                  </div>
                  <p className='slide-count'><span>0{currentSlide + 1}</span> <span>/ 0{slideData.length}</span></p>
                </Col>
              </Row>
            </div>
            <div className='clinic-box'>
              <Row justify="space-between">
                <Col sm={24} lg={12}>
                  <div className='py-lg-4 py-3'>
                    <div className='d-flex align-items-center'>
                      <div className='bg-icon-common bg-icon-white'><img src={LocationClinic} alt="Clinic Address & Hours" /></div>
                      <div className='ms-3 title-hypertension text-white'>Aayushyam Clinic Centre LLP</div>
                    </div>
                    <p className='clinic-address'>Ground Floor, Sheetal Varsha Complex,
                      Landmark: Near Shivranjani Cross Road,
                      Ahmedabad, Gujarat 380015</p>
                  </div>
                  <div className='d-flex'>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo'>
                      <img className='img-fluid' src={DoctorProfile} alt="Doctor Profile" />
                    </div>
                    <div className='clinic-photo d-flex align-items-center justify-content-center'>
                      <div className='title-common text-white'>4+</div>
                    </div>
                  </div>
                  <div className='d-flex flex-wrap mt-4 mt-lg-5 clinic-btn'>
                    <Button type="button" className="btn btn-primary3 btn-48">
                      <img src={Direction} alt="Direction" /> Direction to Clinic
                    </Button>
                    <Button type="button" className="btn btn-primary3 btn-48">
                      <img src={Call} alt="Call" /> Call Clinic
                    </Button>
                  </div>
                </Col>
                <Col sm={24} lg={12}>
                  <div class="me-lg-0 mx-auto timingshape">
                    <div className='p-30'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='title-hypertension fw-medium text-welcome'>Timings</div>
                        <div className='bg-icon-common bg-icon-white'><img src={Clock} alt="Clinic Address & Hours" /></div>
                      </div>
                      <div className='mt-4'>
                        <div className='text-welcome fw-medium fs-16'>Mon - Sat</div>
                        <div className='text-welcome fs-16'>09:00 AM - 04:45 PM</div>
                        <div className='text-welcome fs-16'>09:00 AM - 04:45 PM</div>
                      </div>
                      <div className='mt-4'>
                        <div className='text-welcome fw-medium fs-16'>Sun</div>
                        <div className='text-welcome fs-16'>09:00 AM - 01:00 PM</div>
                      </div>
                    </div>
                  </div>
                  <p className='slide-count'><span>0{currentSlide + 1}</span> <span>/ 0{slideData.length}</span></p>
                </Col>
              </Row>
            </div>
          </Slider>
        </div>
      </div>

      <div style={{ padding: 24.88 }}>
        {/* Service Section */}
        <div className="website-section mt-2 mt-lg-5">
          <div className='row-80'>
            <div className='text-center border bg-body p-5' style={{ borderRadius: 40 }}>
              <div className='bg-icon-common mx-auto mb-20'>
                <img src={ServicecIcon} alt="Our Services" />
              </div>
              <h3 className="doctor-name h1 web-h1 text-welcome mb-lg-5 mb-28">Our Services</h3>
              <Row >
                <Col sm={24} lg={12}>
                  <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> Back Pain Treatment</div>
                  <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> RF Neurotomy</div>
                  <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> Cancer Pain Management</div>
                  <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> Hand Pain Treatment</div>
                </Col>
                <Col sm={24} lg={12}>
                  <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> Musculoskeletal Pain Management</div>
                  <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> Interventional Pain management</div>
                  <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> Knee Pain Treatment</div>
                  <div className='d-flex align-items-center text-welcome text-start fs-16 p-14'> <div className='bg-icon-common bg-icon-sm me-3'><img src={CheckIcon} alt="Our Services" /></div> Joint Pain Treatment</div>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        {/* Doctor Experience Section */}
        <div className="website-section website-clinic website-experience">
          <Row className='row-80 align-items-start'>
            <Col sm={24} lg={8}>
              <div className='bg-icon-common mb-20'>
                <img src={ExperienceIcon} alt="Doctor Experience" />
              </div>
              <h2 className="doctor-name h1 web-h1 text-welcome mb-28">Doctor Experience</h2>
              <div className='py-5 mt-5'>
                <p className='slide-count'><span>0{currentSlide + 1} -</span> <span> 0{slideData.length}</span></p>
              </div>
            </Col>
            <Col sm={24} lg={16} className='mt-5 mt-lg-0'>
              <Slider {...settingsExperience} className='clinic-slider'>
                <div>
                  <div className='position-relative'>
                    <div className='border-shape-right'></div>
                    <div className='border-shape-bottom'></div>
                    <div class="timingshape">
                      <div className='h-100 d-flex flex-column justify-content-between p-30'>
                        <div>
                          <div>Oct 2017 - May 2021</div>
                          <div className='fw-medium text-welcome title-hypertension mt-3'>Director of Max Super Specialty</div>
                        </div>
                        <div>
                          <div className='bg-icon-common'>
                            <img src={HospitalIcon} alt="Hospital Icon" />
                          </div>
                          <div className='text-welcome fs-16 mt-2'>Siloam Hospitals</div>
                          <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> Ahmedabad</div>
                        </div>
                      </div>
                      <div className='round-shape-top-education round'></div>
                      <div className='shape-education'></div>
                    </div>
                  </div>
                  <img className='round-experience-shape' src={experianceSlideBottomRound} alt="Experience Round" />
                </div>
                <div>
                  <div className='position-relative'>
                    <div className='border-shape-right'></div>
                    <div className='border-shape-bottom'></div>
                    <div class="timingshape">
                      <div className='h-100 d-flex flex-column justify-content-between p-30'>
                        <div>
                          <div>Oct 2017 - May 2021</div>
                          <div className='fw-medium text-welcome title-hypertension mt-3'>Director of Max Super Specialty</div>
                        </div>
                        <div>
                          <div className='bg-icon-common'>
                            <img src={HospitalIcon} alt="Hospital Icon" />
                          </div>
                          <div className='text-welcome fs-16 mt-2'>Siloam Hospitals</div>
                          <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> Ahmedabad</div>
                        </div>
                      </div>
                      <div className='round-shape-top-education round-education-pink'></div>
                      <div className='shape-education'></div>
                    </div>
                  </div>
                  <img className='round-experience-shape' src={experianceSlideBottomRound} alt="Experience Round" />
                </div>
                <div>
                  <div className='position-relative'>
                    <div className='border-shape-right'></div>
                    <div className='border-shape-bottom'></div>
                    <div class="timingshape">
                      <div className='h-100 d-flex flex-column justify-content-between p-30'>
                        <div>
                          <div>Oct 2017 - May 2021</div>
                          <div className='fw-medium text-welcome title-hypertension mt-3'>Director of Max Super Specialty</div>
                        </div>
                        <div>
                          <div className='bg-icon-common'>
                            <img src={HospitalIcon} alt="Hospital Icon" />
                          </div>
                          <div className='text-welcome fs-16 mt-2'>Siloam Hospitals</div>
                          <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> Ahmedabad</div>
                        </div>
                      </div>
                      <div className='round-shape-top-education round'></div>
                      <div className='shape-education'></div>
                    </div>
                  </div>
                  <img className='round-experience-shape' src={experianceSlideBottomRound} alt="Experience Round" />
                </div>
                <div>
                  <div className='position-relative'>
                    <div className='border-shape-right'></div>
                    <div className='border-shape-bottom'></div>
                    <div class="timingshape">
                      <div className='h-100 d-flex flex-column justify-content-between p-30'>
                        <div>
                          <div>Oct 2017 - May 2021</div>
                          <div className='fw-medium text-welcome title-hypertension mt-3'>Director of Max Super Specialty</div>
                        </div>
                        <div>
                          <div className='bg-icon-common'>
                            <img src={HospitalIcon} alt="Hospital Icon" />
                          </div>
                          <div className='text-welcome fs-16 mt-2'>Siloam Hospitals</div>
                          <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> Ahmedabad</div>
                        </div>
                      </div>
                      <div className='round-shape-top-education round-education-pink'></div>
                      <div className='shape-education'></div>
                    </div>
                  </div>
                  <img className='round-experience-shape' src={experianceSlideBottomRound} alt="Experience Round" />
                </div>
              </Slider>
            </Col>
          </Row>
        </div>

        {/* Education & Training */}
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
                <Slider {...settingsEducation} className='clinic-slider'>
                  <div class="timingshape">
                    <div className='h-100 d-flex flex-column justify-content-between p-30'>
                      <div>No education details added</div>
                      {/* <div>
                        <div>2011 - 2014</div>
                        <div className='titleprint'>National Board of Examinations</div>
                        <div className='rounded border bg-white d-inline-block py-1 px-2 mt-2'>MD - Anaesthesiology</div>
                      </div>
                      <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> Ahmedabad</div> */}
                    </div>
                    <div className='round-shape-top-education'></div>
                    <div className='shape-education'></div>
                  </div>
                  <div class="timingshape">
                    <div className='h-100 d-flex flex-column justify-content-between p-30'>
                      <div>
                        <div>2011 - 2014</div>
                        <div className='titleprint'>National Board of Examinations</div>
                        <div className='rounded border bg-white d-inline-block py-1 px-2 mt-2'>MD - Anaesthesiology</div>
                      </div>
                      <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> Ahmedabad</div>
                    </div>
                    <div className='round-shape-top-education round-education-pink'></div>
                    <div className='shape-education'></div>
                  </div>
                  <div class="timingshape">
                    <div className='h-100 d-flex flex-column justify-content-between p-30'>
                      <div>
                        <div>2011 - 2014</div>
                        <div className='titleprint'>National Board of Examinations</div>
                        <div className='rounded border bg-white d-inline-block py-1 px-2 mt-2'>MD - Anaesthesiology</div>
                      </div>
                      <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> Ahmedabad</div>
                    </div>
                    <div className='round-shape-top-education'></div>
                    <div className='shape-education'></div>
                  </div>
                  <div class="timingshape">
                    <div className='h-100 d-flex flex-column justify-content-between p-30'>
                      <div>
                        <div>2011 - 2014</div>
                        <div className='titleprint'>National Board of Examinations</div>
                        <div className='rounded border bg-white d-inline-block py-1 px-2 mt-2'>MD - Anaesthesiology</div>
                      </div>
                      <div className="text-welcome d-flex align-items-center"> <img src={locationGrey} className='me-2' width={18} height={18} alt="Location" /> Ahmedabad</div>
                    </div>
                    <div className='round-shape-top-education round-education-pink'></div>
                    <div className='shape-education'></div>
                  </div>
                </Slider>
                <div className='py-5 mt-5'>
                  <p className='slide-count slide-count-left'><span>0{currentSlide + 1} -</span> <span> 0{slideData.length}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memberships Section */}
        <div className="website-section website-membership">
          <Row className='row-80'>
            <Col lg={{ order: 2, span: 12 }}>
              <div className='bg-icon-common mb-20'>
                <img src={MembershipsIcon} alt="Memberships" />
              </div>
              <h2 className="doctor-name h1 web-h1 text-welcome mb-28">Memberships</h2>
              <Slider {...settingsMembership} className='clinic-slider'>
                <div className='d-flex align-items-center mb-3'>
                  <div className='border membership-slide'>
                    <img src={membershipSlide} className='img-fluid z-1' alt="Memberships" />
                    <div className='membership-yellow-blur-box'></div>
                  </div>
                  <div className='ms-3 title-common'>
                    Member of the Royal College of Physicians, London, UK
                  </div>
                </div>
                <div className='d-flex align-items-center mb-3'>
                  <div className='border membership-slide'>
                    <img src={membershipSlide} className='img-fluid z-1' alt="Memberships" />
                    <div className='membership-pink-blur-box'></div>
                  </div>
                  <div className='ms-3 title-common'>
                    Member of National Academy of Medical Sciences (MNAMS), India
                  </div>
                </div>
                <div className='d-flex align-items-center mb-3'>
                  <div className='border membership-slide'>
                    <img src={membershipSlide} className='img-fluid z-1' alt="Memberships" />
                    <div className='membership-yellow-blur-box'></div>
                  </div>
                  <div className='ms-3 title-common'>
                    Member of the Royal College of Physicians, London, UK
                  </div>
                </div>
                <div className='d-flex align-items-center mb-3'>
                  <div className='border membership-slide'>
                    <img src={membershipSlide} className='img-fluid z-1' alt="Memberships" />
                    <div className='membership-pink-blur-box'></div>
                  </div>
                  <div className='ms-3 title-common'>
                    Member of the Royal College of Physicians, London, UK
                  </div>
                </div>
              </Slider>
              <div className='py-5 mt-5'>
                <p className='slide-count'><span>0{currentSlide + 1} -</span> <span> 0{slideData.length}</span></p>
              </div>
            </Col>
            <Col sm={24} lg={12} className='mt-5 mt-lg-0'>
              <img src={MembershipsImg} className='img-fluid' alt="About The Doctor" />
            </Col>
          </Row>
        </div>

        {/* Rewards & Recognitions Section */}
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
                <div className='py-5 mt-5'>
                  <p className='slide-count text-end'><span>0{currentSlide + 1} -</span> <span> 0{slideData.length}</span></p>
                </div>
              </Col>
            </Row>
            <Slider {...settingsRewards} className='clinic-slider'>
              <div className='position-relative'>
                <div className='border-shape-right'></div>
                <div className='border-shape-bottom'></div>
                <div class="timingshape">
                  <div className='h-100 d-flex flex-column justify-content-between p-30'>
                    <div className='titleprint mt-3'>Chairman's Award from Max Healthcare</div>
                    <div className="text-welcome d-flex align-items-center"> 2019</div>
                  </div>
                  <div className='round-shape-top-education'></div>
                  <div className='shape-education'></div>
                </div>
              </div>
              <div className='position-relative'>
                <div className='border-shape-right'></div>
                <div className='border-shape-bottom'></div>
                <div class="timingshape">
                  <div className='h-100 d-flex flex-column justify-content-between p-30'>
                    <div className='titleprint mt-3'>Role of HEV infection in sporadic NANB hepatitis cases</div>
                    <div className="text-welcome d-flex align-items-center"> 2016</div>
                  </div>
                  <div className='round-shape-top-education round-education-pink'></div>
                  <div className='shape-education'></div>
                </div>
              </div>
              <div className='position-relative'>
                <div className='border-shape-right'></div>
                <div className='border-shape-bottom'></div>
                <div class="timingshape">
                  <div className='h-100 d-flex flex-column justify-content-between p-30'>
                    <div className='titleprint mt-3'>Chairman's Award from Max Healthcare</div>
                    <div className="text-welcome d-flex align-items-center"> 2019</div>
                  </div>
                  <div className='round-shape-top-education'></div>
                  <div className='shape-education'></div>
                </div>
              </div>
              <div className='position-relative'>
                <div className='border-shape-right'></div>
                <div className='border-shape-bottom'></div>
                <div class="timingshape">
                  <div className='h-100 d-flex flex-column justify-content-between p-30'>
                    <div className='titleprint mt-3'>Role of HEV infection in sporadic NANB hepatitis cases</div>
                    <div className="text-welcome d-flex align-items-center"> 2016</div>
                  </div>
                  <div className='round-shape-top-education round-education-pink'></div>
                  <div className='shape-education'></div>
                </div>
              </div>
              <div className='position-relative'>
                <div className='border-shape-right'></div>
                <div className='border-shape-bottom'></div>
                <div class="timingshape">
                  <div className='h-100 d-flex flex-column justify-content-between p-30'>
                    <div className='titleprint mt-3'>Chairman's Award from Max Healthcare</div>
                    <div className="text-welcome d-flex align-items-center"> 2019</div>
                  </div>
                  <div className='round-shape-top-education'></div>
                  <div className='shape-education'></div>
                </div>
              </div>
              <div className='position-relative'>
                <div className='border-shape-right'></div>
                <div className='border-shape-bottom'></div>
                <div class="timingshape">
                  <div className='h-100 d-flex flex-column justify-content-between p-30'>
                    <div className='titleprint mt-3'>Role of HEV infection in sporadic NANB hepatitis cases</div>
                    <div className="text-welcome d-flex align-items-center"> 2016</div>
                  </div>
                  <div className='round-shape-top-education round-education-pink'></div>
                  <div className='shape-education'></div>
                </div>
              </div>
            </Slider>
          </div>
        </div>

        {/* Profile and Social Media Links */}
        <div className="website-section mt-2 mt-lg-5">
          <div className='row-80 text-center'>
            <div className='bg-icon-common bg-icon-xl mx-auto mb-20'>
              <img src={avatarDoctor} alt="Doctor Profile" />
            </div>
            <h3 className="doctor-name h1 web-h1 text-welcome">Dr. Kunal Shah</h3>
            <div className='fs-18 text-welcome fw-medium mt-1'>MBBS, MD - Anaesthesiology</div>
            <Button type="button" className="btn btn-primary3 btn-48 rounded-18 mt-4 px-4 mb-5">
              Book Appointment
            </Button>
            <hr className='mx-auto' style={{ width: 200 }} />
            <div className='border rounded-4 d-flex align-items-center mx-auto d-inline-flex mt-5 pe-3 py-2' style={{ borderRadius: 25 }}>
              <div className='bg-icon-common bg-icon-sm2 mx-2'><img src={Mail} alt="Email" /></div>
              <a href="mailto:contact@aayushyamclinic.com" className='text-main'>contact@aayushyamclinic.com</a>
            </div>
            <br />
            <div className='d-flex align-items-center justify-content-center mt-5'>
              <div className='bg-icon-common bg-icon-32'><img src={websiteFacebook} alt="Email" /></div>
              <div className='bg-icon-common bg-icon-32'><img src={websiteInstagram} alt="Email" /></div>
              <div className='bg-icon-common bg-icon-32'><img src={websiteLinkedin} alt="Email" /></div>
              <div className='bg-icon-common bg-icon-32'><img src={websiteTwitter} alt="Email" /></div>
              <div className='bg-icon-common bg-icon-32'><img src={websiteYoutube} alt="Email" /></div>
            </div>
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
    </div>
  );
}
export default React.memo(Homepage);