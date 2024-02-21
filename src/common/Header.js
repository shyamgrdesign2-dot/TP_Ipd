import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Select, Button, Checkbox, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { isChrome, isSafari } from "react-device-detect";
import axios from 'axios';

import config from "../config";
import { getProfile, changeHospital, customizedPad, swtichLayout } from "../redux/doctorsSlice";
import defaultprofile from "../assets/images/default-profile.svg";
import { useLocalStorage, clearLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN, PERSISTANT_STORAGE_KEY_CLINIC_ID, PERSISTANT_STORAGE_KEY_PROFILE } from "../utils/constants";
import { makeDefaultLogo } from "../utils/utils";
import { MESSAGE_KEY } from "../utils/constants";
import CommonModal from './CommonModal';
import alertIcon from '../assets/images/alertIcon.svg';

const CUSTOMIZED_PAD_SENDDATA = { data: { default: false, reset: true } }

function Header({ locationPath }) {

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const navigate = useNavigate();

  const { profile, loading } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const [clinicOptions, setClinicOptions] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [getToken, setToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  const [getStoredProfile, saveProfile] = useLocalStorage(PERSISTANT_STORAGE_KEY_PROFILE);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(customizedPad(CUSTOMIZED_PAD_SENDDATA))
  }, []);

  useEffect(() => {
    if (profile) {
      saveProfile(profile);
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

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  async function onSwitchLayoutClick() {
    const action = await dispatch(swtichLayout())
    if (action.meta.requestStatus === "fulfilled") {
      showHideSwitchModal()
      if (!isChrome && !isSafari) {
        setTimeout(() => {
          navigate(`/?switch_layout=old`, { replace: true })
          navigate(0, { replace: true });
        }, 500);
      } else {
        SSO_TO_PM().then(async (data) => {
          if (data.success == 200) {
            clearLocalStorage()
            await window.open(data.url, '_self');
          }
        });
      }
    } else {
      message.open({
        key: MESSAGE_KEY,
        type: 'warning',
        content: action.error.message,
        duration: 2
      });
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
              <Checkbox className="switch-name-check" onChange={onChange}>Don’t show this again</Checkbox>
            </div>
            <div>
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div onClick={showHideSwitchModal} className="me-4 text-decoration-underline btn p-0 text-main">
                  No, Stay
                </div>
                <Button onClick={onSwitchLayoutClick} className="lh-lg btn btn-primary3 btn-41 px-4" loading={loading}>
                  <span>Switch to Old</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }, [isSwitchModalOpen, loading]);

  return (
    <Navbar className="justify-content-between portal-header">
      <Container fluid>
        <div className="cursor-pointer" onClick={showHideLogoModal}>
          <img
            src={require("../assets/images/logo.png")}
            className="d-inline-block align-top" style={{ height: '30px' }}
            alt="Logo"
          />
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
            <div onClick={showHideSwitchModal} className='align-items-center cursor-pointer d-flex fs-14 fw-medium mx-4'>
              <i className='icon-switch me-2'></i>
              Switch To Old View
            </div>
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
    </Navbar>
  );
}

export default React.memo(Header);