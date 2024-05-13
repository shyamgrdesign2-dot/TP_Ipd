import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Select, Button, Checkbox, Popover, Drawer, Carousel, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { isChrome, isSafari } from "react-device-detect";
import axios from 'axios';

import Slider from "react-slick";

import playIcon from '../assets/images/h-play-icon.svg';
import playIconutube from '../assets/images/play-icon.png';
import fullicon from '../assets/images/full-icon.svg';
import tutorial from '../assets/images/tutorial-icon.svg';
import playIcons from '../assets/images/tube-icon.svg';
import VideoModal from "./VideoModal";

import config from "../config";
import { getProfile, changeHospital, customizedPad, swtichLayout, navigatetoTatvaPedia, changeLogoStatus, showMedicineTime, showMedicineFrequency, getMedicineType, getDefaultPrintsettings, listVideo } from "../redux/doctorsSlice";
import defaultprofile from "../assets/images/default-profile.svg";
import logoSm from "../assets/images/logo-sm.svg";
import { useLocalStorage, clearLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import { errorMessage, makeDefaultLogo } from "../utils/utils";
import CommonModal from './CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';

const CUSTOMIZED_PAD_SENDDATA = { data: { default: false, reset: true } }

function Header({ locationPath }) {

  const [popOverVideo, setPopOverVideo] = useState(false);
  const [videoLink, setVideoLink] = useState(null);
  const [videoDrawer, setvideoDrawer] = useState(false);

  const sliderSettings = {
    className: "center",
    dots: true,
    arrows: false,
    centerMode: true,
    infinite: false,
    centerPadding: "5px",
    slidesToShow: 1,
  };

  //PopOver
  const [popOver, setPopOver] = useState(false);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [switchCheckbox, setSwitchCheckbox] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [logoCheckbox, setLogoCheckbox] = useState(false);

  const navigate = useNavigate();

  const { profile, loading, videoList } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const [clinicOptions, setClinicOptions] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [getToken, setToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(customizedPad(CUSTOMIZED_PAD_SENDDATA));
    dispatch(showMedicineTime());
    dispatch(showMedicineFrequency());
    dispatch(getMedicineType());
    dispatch(getDefaultPrintsettings({ default: false }));
    dispatch(listVideo());
  }, []);

  useEffect(() => {
    if (profile) {
      // setSwitchCheckbox(profile.switchtoOld != 0 ? true : false)
      !isChrome && !isSafari && setPopOver(profile.NavigatetoTatvaPedia == 0 ? true : false);
      const clinics = profile.hospital_data?.map((e) => {
        return {
          value: e.hm_id,
          label: e.hm_name,
        };
      });
      setClinicOptions(clinics);
    }
  }, [profile]);

  useEffect(() => {
    if (clinicOptions.length > 0) {
      const getClinicId = async () => {
        const token = await getToken()
        if (token !== undefined) {
          try {
            var decoded = jwtDecode(token);
            setTokenData(decoded.result)
            const index = clinicOptions.findIndex(e => e.value == decoded.result.clinic_id)
            index !== -1 ? setSelectedHospital(parseInt(decoded.result.clinic_id)) : setSelectedHospital(null)
          } catch (e) {
            console.log(e)
          }
        }
      }
      getClinicId()
    }
  }, [clinicOptions]);

  const HOSPITAL_DATA = useMemo(() => {
    return (
      <Select
        placeholder="Clinic Name"
        className="me-2"
        defaultValue={selectedHospital ? selectedHospital : "Clinic Name"}
        value={selectedHospital ? selectedHospital : "Clinic Name"}
        onChange={async (value) => {
          const sendData = {
            clinic_id: value,
          };
          const action = await dispatch(changeHospital(sendData));
          if (action.meta.requestStatus === "fulfilled") {
            // setSelectedHospital(value)
            await setToken(action.payload.token);
            if (locationPath == "/") {
              if (!isChrome && !isSafari) {
                navigate('/?authToken=' + action.payload.token, { replace: true });
                navigate(0, { replace: true });
              } else {
                navigate('/', { replace: true });
                navigate(0, { replace: true });
              }
            } else {
              navigate(0, { replace: true });
            }
          }
        }
        }
        options={clinicOptions}
      />
    );
  }, [selectedHospital, clinicOptions, locationPath]);

  //Logo Modal
  const showHideLogoModal = useCallback(() => {
    setIsLogoModalOpen(!isLogoModalOpen);
  }, [isLogoModalOpen]);

  const LOGO_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isLogoModalOpen}
        onCancel={showHideLogoModal}
        modalWidth={500}
        title={"Welcome to TatvaPedia"}
        modalBody={
          <>
            <div className="mb-4 fontroboto lh-base">
              You can explore exclusive bit-sized medical content, expert-curated content, boost your proficiency & learning, and showcase your clinical competencies by submitting content based on your experiences.
            </div>
            <div className="alert-warning rounded-10px p-2 patient-details mb-4">
              <div className="d-flex align-items-center">
                <img className='me-3' src={alertIcon} alt="Warning" />
                <span>
                  Are you sure you want to switch? <br />
                  You will be redirect to TatvaPedia platform.
                </span>
              </div>
            </div>
            <div>
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div onClick={() => {
                  navigate('/?close_app=true', { replace: true });
                  navigate(0, { replace: true });
                }}
                  className="me-4 text-decoration-underline btn p-0 text-main">
                  Yes, Switch
                </div>
                <Button onClick={showHideLogoModal} className="lh-lg btn btn-primary3 btn-41 px-4">
                  <span>No, Stay</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isLogoModalOpen]);


  //Switch Modal
  const showHideSwitchModal = useCallback(() => {
    setIsSwitchModalOpen(!isSwitchModalOpen);
  }, [isSwitchModalOpen]);

  const onSwitchChange = useCallback((e) => {
    setSwitchCheckbox(e.target.checked)
  }, [switchCheckbox]);

  async function onSwitchLayoutClick(flag) {
    var sendData = {
      from: 'app',
      dont_show: flag
    }
    const action = await dispatch(swtichLayout(sendData))
    if (action.meta.requestStatus === "fulfilled") {
      flag == 0 && showHideSwitchModal()
      if (!isChrome && !isSafari) {
        setTimeout(() => {
          navigate(`/?switch_layout=old`, { replace: true })
          navigate(0, { replace: true });
        }, 500);
      } else {
        SSO_TO_PM().then(async (data) => {
          if (data.success == 200) {
            navigate('/', { replace: true })
            clearLocalStorage()
            await window.open(data.url, '_self');
          }
        });
      }
    } else {
      errorMessage(action.error)
    }
  }

  async function SSO_TO_PM() {
    try {
      const sendData = {
        doctor_unique_id: tokenData.doctor_unique_id,
        mobile_no: tokenData.mobile_no
      };

      const formData = new FormData();
      Object.keys(sendData).forEach((key) => {
        formData.append(key, sendData[key]);
      });

      const response = await axios.post(config.sso_to_pm_url, formData,
        {
          auth: {
            username: config.sso_to_pm_username,
            password: config.sso_to_pm_password,
          }
        },
      );

      return response.data;
    } catch (err) {
      console.log(err.message);
      console.log(err.response.status);
    }
  }

  const SWITCH_TO_OLD_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isSwitchModalOpen}
        onCancel={showHideSwitchModal}
        modalWidth={500}
        title={"Switch to old view"}
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className='me-3' src={alertIcon} alt="Warning" />
                <span>
                  Are you sure you want to revert to the old <br />
                  version?
                </span>
              </div>
            </div>
            <div className="my-3">
              <Checkbox className="switch-name-check" checked={switchCheckbox} onChange={onSwitchChange}>Don’t show this again</Checkbox>
            </div>
            <div>
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div onClick={showHideSwitchModal} className="me-4 text-decoration-underline btn p-0 text-main">
                  No, Stay
                </div>
                <Button onClick={() => switchCheckbox ? onSwitchLayoutClick(1) : onSwitchLayoutClick(0)} className="lh-lg btn btn-primary3 btn-41 px-4" loading={loading}>
                  <span>Switch to Old</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isSwitchModalOpen, loading, switchCheckbox]);


  // navigate to TatvaPedia
  //PopOver function
  const showHideNavigateToTatvaPedia = useCallback(() => {
    setPopOver(!popOver);
  }, [popOver]);

  const onLogoChange = useCallback((e) => {
    setLogoCheckbox(e.target.checked)
  }, [logoCheckbox]);

  async function onLogoClick() {
    const action = await dispatch(navigatetoTatvaPedia())
    if (action.meta.requestStatus === "fulfilled") {
      await dispatch(changeLogoStatus())
      showHideNavigateToTatvaPedia()
    } else {
      errorMessage(action.error)
    }
  }

  const NAVIGATE_TO_TATVAPEDIA = useCallback(() => {
    return (
      <>
        <div className="pop-header">
          <div className="align-items-center d-flex">
            <img src={logoSm} className="d-inline-block align-top me-3" style={{ height: '40px' }} alt="" />
            <div className="title-common title">You can navigate to TatvaPedia <br /> platform from here</div>
          </div>
          <div className="mt-4 fontroboto">Where you can uplift your medical practice with premium evidence-based and practice related content.</div>
          <div className="my-3 align-items-center d-flex justify-content-between">
            <Checkbox className="switch-name-check fontroboto fw-medium" checked={logoCheckbox} onChange={onLogoChange}>Don’t show this again</Checkbox>
            <Button onClick={() => logoCheckbox ? onLogoClick() : showHideNavigateToTatvaPedia()} className="lh-lg btn btn-primary3 btn-41 px-4" loading={loading}>
              <span>Close</span>
            </Button>
          </div>
        </div>
      </>
    );
  }, [popOver, loading, logoCheckbox]);

  const checkModalOpenOrClose = () => {
    if (profile && profile.switchtoOld != 0) {
      onSwitchLayoutClick(1)
    } else {
      showHideSwitchModal()
    }
  }

  //DrawerVideo function
  const handleDrawervideo = useCallback(() => {
    setvideoDrawer(!videoDrawer);
  }, [videoDrawer]);

  //PopOverVideo function
  const showHideVideoListPopover = useCallback(() => {
    setPopOverVideo(!popOverVideo);
  }, [popOverVideo]);

  //Video Componet
  const VIDEO_CONTENT = useCallback(() => {
    return (
      <>
        <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
          <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
            <div className="title-common lh-base">Video Tutorial</div>
            <Button className="btn btn-delete-prescription p-0"
              onClick={showHideVideoListPopover}>
              <i className="icon-Cross" />
            </Button>
          </div>
          {videoList[0]?.video?.map((item1, i1) => {
            return (
              <div key={i1} className={`d-flex ${i1 !== videoList[0]?.video.length - 1 && 'pb-3 mb-15 border-bottom'}`}>
                <div className="tutorial-play me-14">
                  <button type="button" onClick={() => setVideoLink(item1)}><img src={playIcons} /></button>
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
    <Navbar className="justify-content-between portal-header">
      <Container fluid>
        <div>
          <img onClick={() => !isChrome && !isSafari && showHideLogoModal()}
            src={require("../assets/images/logo.png")}
            className={`d-inline-block align-top ${!isChrome && !isSafari && 'cursor-pointer'}`}
            style={{ width: '110px' }}
            alt="Logo"
          />
          <Popover open={popOver} onOpenChange={showHideNavigateToTatvaPedia} content={NAVIGATE_TO_TATVAPEDIA}
            trigger="click" overlayClassName="pop-370 pp-0" placement="bottomRight">
            <div></div>
          </Popover>
        </div>
        {LOGO_MODAL}
        <Nav className="ms-auto align-items-center d-flex">
          {HOSPITAL_DATA}
          {/* <Dropdown className="dropdown-profile nav-link-profile mx-1 pt-1 align-items-center">
            <Dropdown.Toggle
              id="navbarDropdown"
              variant=""
              className="py-0 border-0 nav-link"
            >
              <i className="icon-notification active-notification"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Item>
                <span>Profile</span>
              </Dropdown.Item>
              <Dropdown.Item>
                <span>Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
          {/* <Dropdown className="dropdown-profile nav-link-profile mx-1 pt-1">
            <Dropdown.Toggle
              id="navbarDropdown"
              variant=""
              className="py-0 border-0 nav-link"
            >
              <i className="icon-setting"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Item>
                <span>Profile</span>
              </Dropdown.Item>
              <Dropdown.Item>
                <span>Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
          {profile && profile.SwitchGrowthBook != 0 && (
            <div onClick={checkModalOpenOrClose} className='align-items-center cursor-pointer d-flex fs-14 fw-medium mx-4'>
              <i className='icon-switch me-2'></i>
              <span className="text-decoration-underline">Switch To Old View</span>
            </div>
          )}

          {locationPath == "/" ? (
            <div onClick={handleDrawervideo} className="border border-color2 cursor-pointer rounded-circle me-2"><img src={playIcon} /></div>) : (
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
          )}

          <Drawer title="Video Tutorial" placement="right" onClose={handleDrawervideo} open={videoDrawer} className="modalWidth-400 tab345 playdrawer" width="auto">
            <div className="mt-20">
              {videoList?.map((item, i) => {
                return (
                  <div key={i} className="overflow-hidden ms-4">
                    <div className="title-common text-welcome">{item?.category}</div>
                    <div className="fs-12 fontroboto fw-normal text-main">{item?.description}</div>
                    <div className="videodrawer-left mt-3">
                      <Slider {...sliderSettings}>
                        {item?.video?.map((item1, i1) => {
                          return (
                            <div key={i1} className="drawer-slider">
                              <button type="button" onClick={() => setVideoLink(item1)}><img src={playIconutube} /></button>
                              <img src={item1?.thumbnail} />
                            </div>
                          )
                        })}
                      </Slider>
                    </div>
                  </div>
                )
              })}
            </div>
          </Drawer>

          {videoLink && (
            <VideoModal
              videoLink={videoLink}
              onCancel={() => setVideoLink(null)}
            />
          )}

          {SWITCH_TO_OLD_MODAL}
          <Dropdown className="dropdown-profile nav-link-profile mx-1">
            <Dropdown.Toggle
              id="navbarDropdown"
              variant=""
              className="py-0 border-0 nav-link"
            >
              {profile?.um_image ? (
                <img
                  src={profile?.um_image ?? defaultprofile}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "35px" }}
                />
              ) : (
                <div className='rounded-pill patientProfile border'>{makeDefaultLogo(profile?.um_name)}</div>
              )}
            </Dropdown.Toggle>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar >
  );
}

export default React.memo(Header);