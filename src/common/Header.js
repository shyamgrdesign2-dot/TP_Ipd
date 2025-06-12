import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Select, Button, Checkbox, Popover, Drawer, Dropdown, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { isChrome, isSafari, isBrowser } from "react-device-detect";
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Button as ButtonOPD } from "antd";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Slider from "react-slick";

import playIcon from '../assets/images/h-play-icon.svg';
import playIconutube from '../assets/images/play-icon.png';
import fullicon from '../assets/images/full-icon.svg';
import tutorial from '../assets/images/tutorial-icon.svg';
import playIcons from '../assets/images/tube-icon.svg';
import qrIcon from '../assets/images/qr-icon.svg';
import logoIcom from '../assets/images/text-logo.svg';
import VideoModal from "./VideoModal";
import videorotate from '../assets/images/videorotate.gif';
import billingsIcon from "../assets/images/billings.svg";
import upgradeIcon from "../assets/images/upgrade.svg";
import profileBg from "../assets/images/profile-bg.svg";
import goldCrown from "../assets/images/gold-crown.svg";
import crownIcon from "../assets/images/crown.svg";

import config from "../config";
import { getProfile, updateStatusMoengageB2C, changeHospital, customizedPad, swtichLayout, navigatetoTatvaPedia, changeLogoStatus, showMedicineTime, showMedicineFrequency, getMedicineType, getDefaultPrintsettings, listVideo, zydusRefIds } from "../redux/doctorsSlice";
import { viewDoctorWebsite } from "../redux/doctorWebsiteSlice";
import defaultprofile from "../assets/images/default-profile.svg";
import logoSm from "../assets/images/logo-sm.svg";
import { useLocalStorage, clearLocalStorage, getDecodedToken } from "../utils/localStorage";
import { GB_ZYDUS_USER, OPD_API_KEY, PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import { errorMessage, getClinicName, makeDefaultLogo } from "../utils/utils";
import { Modal, Card } from "antd";
import alertIcon from '../assets/images/alertIcon.svg';
import PremiumUser from "./PremiumUser";
import { openModal } from "../redux/doctorModalSlice";

import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { env } from "../EnvironmentConfig";
import CommonModal from "./CommonModal";
import { useReactToPrint } from 'react-to-print';
import { useOpdBilling } from "../pages/opdBilling/useOpdBilling";

const CUSTOMIZED_PAD_SENDDATA = { data: { default: false, reset: true } }

function Header({ locationPath }) {

  const [popOverVideo, setPopOverVideo] = useState(false);
  const [videoLink, setVideoLink] = useState(null);
  const [videoDrawer, setvideoDrawer] = useState(false);
  const { isOpdBillingAccessable } = useOpdBilling();

  const isOpdPlansAccessableFromGB = useFeatureIsOn(
    "opd-plans"
  );
  const isZydusUserAccessableFromGB = useFeatureIsOn(GB_ZYDUS_USER);

  const decodedToken = getDecodedToken();
  const apiUrl = env.opd_encryption_url;
  const opdVisitUrl = env.opd_visit_url;
  const [isQRCodeVisible, setQRCodeVisible] = useState(false);
  const [opdPlansUrl, setOpdPlansUrl] = useState(null);
  const printRef = useRef();

  const sliderSettings = {
    className: "center",
    dots: true,
    arrows: false,
    centerMode: true,
    infinite: false,
    centerPadding: "5px",
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  };

  //PopOver
  const [popOver, setPopOver] = useState(false);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [switchCheckbox, setSwitchCheckbox] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [logoCheckbox, setLogoCheckbox] = useState(false);

  const navigate = useNavigate();

  const { profile, loading, videoList, siteId, empNo, hasLocation } = useSelector((state) => state.doctors);
  const { planDetails } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();

  const [clinicOptions, setClinicOptions] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [getToken, setToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  const [tokenData, setTokenData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const isReceptionist = urlParams.has("receptionist");

  useEffect(() => {
    if (!isReceptionist) {
      dispatch(getProfile());
      dispatch(customizedPad(CUSTOMIZED_PAD_SENDDATA));
      dispatch(showMedicineTime());
      dispatch(showMedicineFrequency());
      dispatch(getMedicineType());
      dispatch(getDefaultPrintsettings({ default: false }));
      dispatch(listVideo());
    }

    const tokenData = decodedToken?.result;
    if (tokenData?.hospital_business_id == env.zydus_business_id && isZydusUserAccessableFromGB) {
      dispatch(zydusRefIds())
    }
  }, [isZydusUserAccessableFromGB]);

  useEffect(() => {
    if (profile && hasLocation === false && !isReceptionist) {
      const clinicDetails = profile?.hospital_data?.find((e) => e.hm_id == tokenData?.clinic_id);
      navigate('/final-setup?noLocation=true', { replace: true, state: { clinicDetails } });
    }
  }, [hasLocation, navigate, isReceptionist, profile]);

  useEffect(() => {
    if (profile) {
      if (profile.moengage_b2c_send === undefined) {
        window.Moengage.add_unique_user_id(profile?.b2c)
        dispatch(updateStatusMoengageB2C());
      }
      // setSwitchCheckbox(profile.switchtoOld != 0 ? true : false)
      setPopOver(profile.NavigatetoTatvaPedia == 0 ? true : false);
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
      const getStorageData = async () => {
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
      getStorageData()
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
            try {
              var decoded = jwtDecode(action.payload.token);
              setTokenData(decoded.result)
            } catch (e) {
              console.log(e)
            }
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

  const tatvaRedirectClick = async () => {
    const clinic_name = getClinicName(profile?.hospital_data);
    window.Moengage.track_event("TP_Tatvapedia_landing", {
      clinic_name,
    });
    showHideLogoModal();

    try {
      // Start loading
      setIsLoading(true);

      // Generate Basic Auth token
      const credentials = btoa('client:secret');
      const mobileNumber = profile?.um_contact && `+91${profile.um_contact}`;
      const password = tokenData.doctor_unique_id && `uuid:${tokenData.doctor_unique_id}`;


      // Prepare form data
      const formData = new URLSearchParams();
      formData.append('client_id', 'client');
      formData.append('username', mobileNumber);
      formData.append('password', password);
      formData.append('grant_type', 'custom_password');
      formData.append('scope', 'openid,profile,read');

      // Make API call
      const response = await axios({
        method: 'post',
        url: `${config.tatvaPedia_api_url}/oauth2/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        data: formData
      });

      // Get token from response
      const token = response.data.access_token;

      // Handle redirect with token
      setTimeout(() => {
        if (!isChrome && !isSafari) {
          navigate('/?close_app=true', { replace: true });
          navigate(0, { replace: true });
        } else {
          const redirectUrl = `${config.tatvaPedia_domain_url}/?token=${token}`;
          window.open(redirectUrl);
        }
        // Stop loading after redirect
        setIsLoading(false);
      }, 500);

    } catch (error) {
      console.error('Error fetching token:', error);
      // Handle error appropriately
      errorMessage('Failed to redirect to TatvaPedia');
      // Stop loading on error
      setIsLoading(false);
    }
  };

  const handleRedirectToOffering = async () => {
    navigate('/our-offerings?from=home');
  }

  const LOGO_MODAL = useMemo(() => {
    return (
      <CommonModal
        isModalOpen={isLogoModalOpen}
        onCancel={showHideLogoModal}
        modalWidth={500}
        title={"Tatvacare"}
        modalBody={
          <>
            <div className="mb-4 fontroboto lh-base">
              Tatvacare is your all-in-one platform to simplify clinical practice, patient management, and medical learning.</div>
            <div className="alert-warning rounded-10px p-2 patient-details mb-4">
              <div className="d-flex align-items-center">
                <img className='me-3' src={alertIcon} alt="Warning" />
                <span>
                  Are you sure you want to switch? <br />
                  You will be redirect to Tatvacare platform.
                </span>
              </div>
            </div>
            <div>
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div onClick={handleRedirectToOffering}
                  className="me-4 text-decoration-underline btn p-0 text-main">
                  Yes, Switch
                </div>
                <Button
                  onClick={() => {

                    window.Moengage.track_event("TP_Tatvapedia_Switch_cancelled");
                    showHideLogoModal()
                  }}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
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
        SSO_TO_PM(1).then(async (data) => {
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

  async function SSO_TO_PM(flag) {
    try {

      var sendData = {
        doctor_unique_id: tokenData.doctor_unique_id,
      };

      var URL;

      if (flag === 1) {
        sendData['mobile_no'] = tokenData.mobile_no
        sendData['clinic_id'] = tokenData.clinic_id
        sendData['hm_business_id'] = tokenData.hospital_business_id
        sendData['from'] = 'app'
        URL = config.sso_to_pm_url
      } else if (flag === 2) {
        sendData['hospital_business_id'] = tokenData.hospital_business_id
        URL = config.sso_to_pm_admin_url
      }

      const formData = new FormData();
      Object.keys(sendData).forEach((key) => {
        formData.append(key, sendData[key]);
      });

      const response = await axios.post(URL, formData,
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
              <Checkbox className="switch-name-check" checked={switchCheckbox} onChange={onSwitchChange}>Don't show this again</Checkbox>
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
            <Checkbox className="switch-name-check fontroboto fw-medium" checked={logoCheckbox} onChange={onLogoChange}>Don't show this again</Checkbox>
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
    const clinic_name = getClinicName(profile?.hospital_data);
    window.Moengage.track_event("TP_Flow_changed", {
      clinic_name,
    });
  }

  //DrawerVideo function
  const handleDrawervideo = useCallback(() => {
    window.Moengage.track_event("video_library_button_clicked");
    setvideoDrawer(!videoDrawer);
  }, [videoDrawer]);

  //PopOverVideo function
  const showHideVideoListPopover = useCallback(() => {
    setPopOverVideo(!popOverVideo);
  }, [popOverVideo]);

  //Video Componet
  const VIDEO_CONTENT = useCallback((categoryId) => {
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
          {videoList?.filter(e => e.category_id === categoryId)[0]?.video?.map((item1, i1) => {
            return (
              <div key={i1} className={`d-flex ${i1 !== videoList?.filter(e => e.category_id === categoryId)[0]?.video?.length - 1 && 'pb-3 mb-15 border-bottom'}`}>
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

  const setUpWebsiteUrl = async (flag) => {
    const action = await dispatch(viewDoctorWebsite());
    if (action.meta.requestStatus === "fulfilled") {
      flag === 1 ?
        navigate('/doctor_profile', { state: { websiteData: { ...action.payload } } })
        :
        navigate('/doctor_website_setting', { state: { websiteData: { ...action.payload } } })
    } else {
      errorMessage(action.error)
    }
  }

  const accountSettings = async () => {
    SSO_TO_PM(2).then(async (data) => {
      if (data.success == 200) {
        if (!isChrome && !isSafari) {
          navigate(`/?url=${data.url}&key=phpRedirect`, { replace: true })
          navigate(0, { replace: true });
        } else {
          await window.open(data.url)
        }
      }
    });
  }

  const myAvailability = async () => {
    SSO_TO_PM(1).then(async (data) => {
      if (data.success == 200) {
        if (!isChrome && !isSafari) {
          navigate(`/?url=${data.url}&module=my_availability&key=phpRedirect`, { replace: true })
          navigate(0, { replace: true });
        } else {
          await window.open(`${data.url}&module=my_availability`)
        }
      }
    });
  }

  const handleShowQRCode = () => {
    setQRCodeVisible(true);
  }

  const iframeRef = useRef(null);

  const openUrlsSilently = async (urls) => {
    const iframeStatuses = await Promise.all(
      urls.map((url) => {
        return new Promise((resolve, reject) => {
          const iframe = document.createElement("iframe");
          iframe.src = url;
          iframe.style.width = "0";
          iframe.style.height = "0";
          iframe.style.border = "none";
          iframe.style.visibility = "hidden";

          // Set a timeout to reject if the iframe doesn't load within 5 seconds
          const timeoutId = setTimeout(() => {
            reject({ url, status: "timeout" });
          }, 5000);

          iframe.onload = () => {
            clearTimeout(timeoutId);
            resolve({ url, status: "success" });
          };

          iframe.onerror = () => {
            clearTimeout(timeoutId);
            reject({ url, status: "error" });
          };

          document.body.appendChild(iframe);

          // Cleanup the iframe after it's loaded or failed
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 3000);
        });
      })
    );

    return iframeStatuses;
  };

  const handleLogout = async () => {
    const urlsToOpen = [
      config.pedia_logout_url,
      config.tatvaAi_logout_url,
    ];

    try {
      // Prevent multiple clicks while logging out
      if (window.isLoggingOut) return;
      window.isLoggingOut = true;

      // Show loader
      setIsLoading(true);

      setTimeout(async () => {
        try {
          // Try to open URLs and get their statuses
          const urlStatuses = await openUrlsSilently(urlsToOpen);
          // Log results and check for failures
          console.log("Logout URL statuses:", urlStatuses);
        } catch (error) {
          console.error("Error opening logout URLs:", error);
        }
      }, 1000);

      // Clear storage - this is our confirmation of logout
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      navigate("/login");

    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear storage and redirect
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      navigate("/login");
    } finally {
      setIsLoading(false);
      window.isLoggingOut = false;
    }
  };

  const handleClick = () => {
    const clinic_name = getClinicName(profile?.hospital_data);
    window.Moengage.track_event("BuyPlanNow_Click", {
      doctor_id: profile?.doctor_unique_id,
      clinic_name,
    });
    dispatch(openModal());
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        label: (
          <>
            <div className="me-3">
              {profile?.um_image && planDetails?.currentPlanStatus !== "PAID" ? (
                <img
                  src={profile?.um_image ?? defaultprofile}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "52px", height: "52px" }}
                />
              ) : planDetails?.currentPlanStatus === "PAID" ? (
                <PremiumUser />
              ) : (
                <div className="rounded-pill patientProfile patientProfile52 border">
                  {makeDefaultLogo(profile?.um_name)}
                </div>
              )}
            </div>
            <div>
              <div className="text-black titleprint">{profile?.um_name}</div>
              <div className="title-common">{profile?.um_contact}</div>
            </div>
          </>
        ),
        key: "0",
      },
      {
        type: "divider",
      },
      {
        label: (
          <a onClick={() => setUpWebsiteUrl(1)}>
            <div className="title-common me-5 d-flex align-items-center">
              <i className="icon-profile me-3"></i>My Profile
            </div>
            <i className="icon-right iconrotate180"></i>
          </a>
        ),
        key: "2",
      },
      {
        label: (
          <a onClick={() => setUpWebsiteUrl(2)}>
            <div className="title-common me-5 d-flex align-items-center">
              <i className="icon-group me-3"></i>
              {`${profile?.website_publish && profile?.publish_url ? "Visit" : "Setup"} My Website`}
            </div>
            <i className="icon-right iconrotate180"></i>
          </a>
        ),
        key: "3",
      },
      {
        label: (
          <a onClick={myAvailability}>
            <div className="title-common me-5 d-flex align-items-center">
              <i className="icon-calendar me-3"></i>My Availability
            </div>
            <i className="icon-right iconrotate180"></i>
          </a>
        ),
        key: "4",
      },
      {
        label: (
          <a onClick={accountSettings}>
            <div className="title-common me-5 d-flex align-items-center">
              <i className="icon-setting me-3"></i>Account Setting
            </div>
            <i className="icon-right iconrotate180"></i>
          </a>
        ),
        key: "5",
      },
      {
        label:
          <a onClick={() => ["TRIAL", "EXPIRED"].includes(planDetails?.currentPlanStatus) ? handleClick() : setUpWebsiteUrl(1)}>
            <div className="title-common me-5 d-flex align-items-center">
              {["TRIAL", "EXPIRED"].includes(planDetails?.currentPlanStatus) && <img loading="lazy" src={upgradeIcon} className="me-3" alt="" />}
              {planDetails?.currentPlanStatus === "PAID" && <img loading="lazy" src={crownIcon} className="me-3" style={{ filter: 'brightness(0%)' }} alt="" />}
              {["TRIAL", "EXPIRED"].includes(planDetails?.currentPlanStatus) ? "Upgrade Plan" : "Subscription"}
              {["TRIAL", "EXPIRED"].includes(planDetails?.currentPlanStatus) && <div className="gradientBackground d-flex">
                <div className="demoModeIndicatorSmall bg-danger" />
                <span className='demoModeLabel'>Demo mode</span>
              </div>}
            </div>
            <i className="icon-right iconrotate180"></i>
          </a>,
        key: '7',
      },
      // {
      //   label:
      //     <a>
      //       <div className="title-common me-5 d-flex align-items-center"><i className="icon-upgrade me-3"></i>Upgrade Plan</div>
      //       <i className="icon-right iconrotate180"></i>
      //     </a>,
      //   key: '5',
      // },
      // {
      //   label:
      //     <a>
      //       <div className="title-common me-5 d-flex align-items-center"><i className="icon-help me-3"></i>Help Center</div>
      //       <i className="icon-right iconrotate180"></i>
      //     </a>,
      //   key: '6',
      // },


      // CSS Also comment
      // {
      //   type: 'divider',
      // },
      // {
      //   label: <><i className="icon-exit me-2"></i> Log Out</>,
      //   key: '8',
      // },
    ];

    const extraItems = [
      {
        label: (
          <a onClick={handleShowQRCode}>
            <div className="title-common me-5 d-flex align-items-center">
              <img src={qrIcon} className="me-3" alt="QR Icon" />
              OPD Plan QR
            </div>
            <i className="icon-right iconrotate180"></i>
          </a>
        ),
        key: "6",
      },
    ];

    // Log Out Section, If isBrowser is false, then don't include logoutItem
    const logoutItem = isBrowser
      ? [
        {
          type: "divider",
        },
        {
          label: (
            <div className="title-common d-flex align-items-center">
              <i className="icon-exit me-3 color-red"></i>
              <span className="color-red">Log Out</span>
            </div>
          ),
          key: "logout",
          onClick: handleLogout,
          className: "logout-menu-item"
        },
      ]
      : [];


    // Combine commonItems, extraItems (if applicable), and logoutItem (always at the end)
    const items = isOpdPlansAccessableFromGB
      ? [...commonItems, ...extraItems, ...logoutItem]
      : [...commonItems, ...logoutItem];

    // If not admin, filter out account setting item, else return all items
    return !tokenData?.admin ? items.filter((item) => item.key !== "5") : items;
  };

  const showHideBackModal = useCallback(() => {
    setQRCodeVisible(false);
  }, [isQRCodeVisible]);

  useEffect(() => {
    if (isQRCodeVisible && !opdPlansUrl) {
      clickOpdPlans();  // Trigger the API call when QR modal is visible and URL isn't yet set
    }
  }, [isQRCodeVisible]);

  const opdEncryptionApiCall = async (data) => {
    const headers = {
      'api-key': OPD_API_KEY,
      'tatvapractice': 'true',
      'Content-Type': 'application/json'
    };
    try {
      const response = await axios.post(apiUrl, data, { headers });
      return response.data
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clickOpdPlans = async () => {
    const clinic_Id = decodedToken?.result?.clinic_id;
    const doc_Id = decodedToken?.result?.doctor_unique_id;

    const decryptData = { d_id: doc_Id, clinic_Id: clinic_Id };

    // Encrypt clinic and doctor ID
    const encryptedCata = await opdEncryptionApiCall(decryptData);

    const url = `${opdVisitUrl}/tatva-care?p_id=${encryptedCata}`;
    setOpdPlansUrl(url);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @media print {
        .opd-plans-inner-contianer {
          font-size: 2.5rem; /* Enlarge the whole container content */
          padding: 40px;
        }
        .opd-title {
          font-size: 3rem; /* Enlarge title */
        }
        .opd-byline {
          font-size: 2rem; /* Enlarge byline */
        }
        .opd-logo img {
          height: 3rem; /* Enlarge logo */
        }
        .opd-qr-image {
          width: 300px !important; /* Enlarge QR Code */
          height: 300px !important;
        }
        .opd-scan-text {
          font-size: 1.8rem; /* Enlarge scan text */
        }
      }
    `
  });

  // Download as PDF functionality
  const handleDownload = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('OPD-Plans.pdf');
  };

  return (
    <Navbar className="justify-content-between portal-header">
      {isLoading && (
        <div className="spinner-overlay">
          <Spin size="large" />
        </div>
      )}
      <Container fluid>
        <div>
          <img onClick={() => {
            window.Moengage.track_event("TP_Tatvapedia_clicked");
            showHideLogoModal()
          }}
            src={require("../assets/images/logo.png")}
            className={`d-inline-block align-top cursor-pointer`}
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
          {profile && profile.SwitchGrowthBook != 0 && tokenData?.hospital_business_id != env.zydus_business_id && !isZydusUserAccessableFromGB && (
            <div onClick={checkModalOpenOrClose} className='align-items-center cursor-pointer d-flex fs-14 fw-medium mx-4'>
              <i className='icon-switch me-2'></i>
              <span className="text-decoration-underline">Switch To Old View</span>
            </div>
          )}

          <Modal
            open={(isQRCodeVisible && opdPlansUrl)}
            centered
            closeIcon={false}
            onCancel={showHideBackModal}
            footer={null}
            title={null}
            destroyOnClose
            className="opd-plan-qr"
          >
            <div className="opd-qr">
              <button className="qr-close-btn" onClick={showHideBackModal}>
                <i style={{ fontSize: "2rem" }} className="icon-Cross"></i>
              </button>
              <div ref={printRef} className="opd-plans-inner-contianer">
                <div className="opd-title" style={{ fontWeight: "700", fontSize: "2rem", color: "#1F2933 !important" }}>
                  OPD Plans
                </div>
                <div className="opd-byline" style={{ marginBottom: "2rem", marginTop: "0.4rem" }}>
                  by <strong>{profile?.um_name}</strong>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="opd-logo log-holder">
                    <img src={logoIcom} style={{ height: "1.8rem" }} className="logo-text-icon" alt="Logo" />
                  </div>
                  <QRCodeSVG className="opd-qr-image" value={opdPlansUrl} size={180} />
                </div>
                <div className="opd-scan-text" style={{ marginTop: "2rem", fontSize: "1.2rem", color: "#454551 !important" }}>
                  Scan the QR to view & buy OPD plans
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-4 mt-4">
                <ButtonOPD
                  onClick={handlePrint}
                  className="btn btn-primary1 btn-41 align-items-center d-flex justify-content-center"
                  style={{ width: "13rem", height: "3rem" }}
                >
                  <span className="fs-18 align-items-center d-flex "><i className="icon-Print me-2"></i>Print</span>
                </ButtonOPD>
                <ButtonOPD
                  onClick={handleDownload}
                  className="btn btn-primary1 btn-41 align-items-center d-flex justify-content-center"
                  style={{ width: "13rem", height: "3rem" }}
                >
                  <span className="fs-18 align-items-center d-flex"><i className="icon-download me-2"></i>Download</span>
                </ButtonOPD>
              </div>
            </div>
          </Modal>

          {locationPath == "/" || locationPath == "/bulk_messages" ? (
            <div onClick={handleDrawervideo} className="cursor-pointer me-2 video-animat">
              <img src={playIcon} />
              <img src={videorotate} />
            </div>) : locationPath == "/billing-dashboard" ? (
              <Popover
                open={popOverVideo}
                onOpenChange={showHideVideoListPopover}
                content={VIDEO_CONTENT(16)}
                trigger="click"
                overlayClassName="pop-430 pp-0 videoTutorial"
                placement="bottom"
              >
                <div className="cursor-pointer me-2 video-animat">
                  <img src={playIcon} />
                  <img src={videorotate} />
                </div>
              </Popover>
            ) : (
            <Popover
              open={popOverVideo}
              onOpenChange={showHideVideoListPopover}
              content={VIDEO_CONTENT(3)}
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
                  item?.video?.length > 0 && (
                    <div key={i} className=" ms-4 video-bottom-spacing">
                      <div className="title-common text-welcome">{item?.category}</div>
                      <div className="fs-12 fontroboto fw-normal text-main">{item?.description}</div>
                      <div className="videodrawer-left mt-3">
                        <Slider {...sliderSettings}>
                          {item?.video?.map((item1, i1) => {
                            return (
                              <div key={i1} className="drawer-slider">
                                <button type="button"
                                  onClick={() => {
                                    setVideoLink(item1)
                                    const clinic_name = getClinicName(profile?.hospital_data);
                                    window.Moengage.track_event("TP_Tutorial_Viewed", {
                                      clinic_name,
                                      tutorial_type: item?.category,
                                    });
                                  }}
                                >
                                  <img src={playIconutube} />
                                </button>
                                <img src={item1?.thumbnail} />
                              </div>
                            )
                          })}
                        </Slider>
                      </div>
                    </div>
                  )
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

          {!!tokenData?.admin && isOpdBillingAccessable &&
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <a onClick={() => navigate("/billing-settings")}>
                        <div className="title-settings me-2 d-flex align-items-center">
                          <img src={billingsIcon} alt="Billing" width={20} height={20} className="me-2" />
                          Billing Settings
                        </div>
                        <i className="icon-right iconrotate180"></i>
                      </a>
                    ),
                    key: "1",
                  }
                ]
              }}
              trigger={['click']}
              className="py-0 nav-link cursor-pointer"
              overlayClassName="settings-dropdown"
            >
              <div className="d-flex align-items-center h-24 w-24">
                <i className="icon-setting me-2"></i>
              </div>
            </Dropdown>
          }

          <Dropdown
            menu={{
              items: getMenuItems(),
            }}
            trigger={['click']}
            className="py-0 nav-link cursor-pointer"
            overlayClassName="prfile-dropdown"
          >
            <a onClick={(e) => e.preventDefault()}>
              {profile?.um_image && planDetails?.currentPlanStatus !== "PAID" ? (
                <img
                  src={profile?.um_image ?? defaultprofile}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "35px", height: "35px" }}
                />
              ) : planDetails?.currentPlanStatus === "PAID" ? (
                <PremiumUser />
              ) :
                <div className='rounded-pill patientProfile border'>{makeDefaultLogo(profile?.um_name)}</div>
              }
            </a>
          </Dropdown>

        </Nav>
      </Container>
    </Navbar >
  );
}

export default React.memo(Header);