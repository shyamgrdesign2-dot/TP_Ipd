import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { getProfile, changeHospital } from "../redux/doctorsSlice";
import defaultprofile from "../assets/images/default-profile.svg";
import { useLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN, PERSISTANT_STORAGE_KEY_CLINIC_ID, PERSISTANT_STORAGE_KEY_PROFILE } from "../utils/constants";
import { makeDefaultLogo } from "../utils/utils";

function Header({ locationPath }) {

  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const [clinicOptions, setClinicOptions] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [getToken, setToken] = useLocalStorage(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  const [getStoredProfile, saveProfile] = useLocalStorage(PERSISTANT_STORAGE_KEY_PROFILE);

  useEffect(() => {
    dispatch(getProfile());
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
            const index = clinicOptions.findIndex(e => e.value == decoded.result.clinic_id)
            index != -1 ? setSelectedHospital(parseInt(decoded.result.clinic_id)) : setSelectedHospital(null)
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
          if (action.meta.requestStatus == "fulfilled") {
            // setSelectedHospital(value)
            await setToken(action.payload.token);
            if (locationPath == "/") {
              // navigate('/', { replace: true });
              // navigate(0, { replace: true });
              navigate('/?authToken=' + action.payload.token, { replace: true });
              navigate(0, { replace: true });
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

  return (
    <Navbar className="justify-content-between portal-header">
      <Container fluid>
        <Navbar.Brand href="/">
          <img
            src={require("../assets/images/logo.png")}
            className="d-inline-block align-top" style={{ height: '30px' }}
            alt="Logo"
          />
        </Navbar.Brand>
        <Nav className="ms-auto">
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
            {/* <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Item>
                <span>Profile</span>
              </Dropdown.Item>
              <Dropdown.Item>
                <span>Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu> */}
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default React.memo(Header);