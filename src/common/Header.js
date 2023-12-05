import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { getProfile } from "../redux/doctorsSlice";

function Header() {
  const [clinicOptions, setClinicOptions] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [profile, setProfile] = useState(null);
  const profiles = useSelector((state) => state.doctors.profile);
  const dispatch = useDispatch();
  console.log("profile: ", profiles);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      const firstProfile = profiles[0];
      if (firstProfile) {
        setProfile(firstProfile);
        const hospitals = firstProfile.hospital_data?.map((hospital) => {
          return {
            value: hospital.hm_id,
            label: hospital.hm_name,
          };
        });

        if (hospitals.length > 0) {
          const firstClinic = hospitals[0];
          setClinicOptions(hospitals);
          setSelectedHospital(firstClinic);
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
            value={selectedHospital ? selectedHospital : "Add a clinic"}
            onChange={(hospital) => {
              setSelectedHospital(hospital);
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
              <img src={profile?.um_image} alt="Logo" />
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
