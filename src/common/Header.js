import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { getProfile } from "../redux/doctorsSlice";
import defaultprofile from "../assets/images/default-profile.svg";
import { changeHospital } from "../redux/appointmentsSlice";
import { useLocalStorage } from "../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN, PERSISTANT_STORAGE_KEY_CLINIC_ID } from "../utils/constants";

function Header({onClickChanged}) {
  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );

  const [getSavedClinic, saveClinic] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_CLINIC_ID
  );

  const [clinicOptions, setClinicOptions] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [profile, setProfile] = useState(null);
  const profiles = useSelector((state) => state.doctors.profile);
  const { changeHospitalResponse } = useSelector(
    (state) => state.records
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());

    const clinic = getSavedClinic();
    if(clinic) {
      setSelectedHospital(clinic);
    }
    
  }, [dispatch]);

  useEffect(() => {
    if(changeHospitalResponse.token) {
      setToken(changeHospitalResponse.token);
      onClickChanged(changeHospitalResponse.clinicId);
    }
  }, [changeHospitalResponse]);

  useEffect(() => {
    saveClinic(selectedHospital);
  }, [selectedHospital]);
  
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      const firstProfile = profiles[0];
      if (firstProfile) {
        setProfile(firstProfile);
        const clinics = firstProfile.hospital_data?.map((hospital) => {
          return {
            value: hospital.hm_id,
            label: hospital.hm_name,
          };
        });
        setClinicOptions(clinics);

        const id = setTimeout(() => {
          const clinic = getSavedClinic();
          console.log('clinic2: ', clinic);

          if(!clinic && clinics.length > 0) {
            // if no clinic was previouly slected
            // save first one so that on reload, it shows
            // selected.
            const firstClinic = clinics[0];
            setSelectedHospital(firstClinic.value);
            saveClinic(firstClinic.value);
          }
        }, 300);

        return () => {
          clearTimeout(id);
        }
      }
    }
  }, [profiles]);

  return (
    <Navbar className="justify-content-between portal-header">
      <Container fluid>
        <Navbar.Brand href="/">
          <img
            src={require("../assets/images/logo.png")}
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Select
            placeholder="Your Clinics"
            className="me-2"
            defaultValue={selectedHospital ? selectedHospital : "Add a clinic"}
            value={selectedHospital ? selectedHospital : "Add a clinic"}
            onChange={(hospital) => {
              setSelectedHospital(hospital);
              console.log("hospital: ", hospital);
              dispatch(changeHospital(hospital));
            }}
            options={clinicOptions}
          />
          <Dropdown className="dropdown-profile nav-link-profile mx-1 pt-1 align-items-center">
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
          </Dropdown>
          <Dropdown className="dropdown-profile nav-link-profile mx-1 pt-1">
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
          </Dropdown>
          <Dropdown className="dropdown-profile nav-link-profile mx-1">
            <Dropdown.Toggle
              id="navbarDropdown"
              variant=""
              className="py-0 border-0 nav-link"
            >
              {/* <i className='icon-patients'></i> */}
              <img
                src={profile?.um_image ?? defaultprofile}
                alt="Profile"
                style={{ width: "30px" }}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Item>
                <span>Profile</span>
              </Dropdown.Item>
              <Dropdown.Item>
                <span>Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default React.memo(Header);
