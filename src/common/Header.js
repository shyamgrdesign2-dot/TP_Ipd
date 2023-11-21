import React from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Select } from 'antd';

import profile from '../assets/images/profile.svg';

function Header() {
    
    return (
        <Navbar className="justify-content-between">
            <Container fluid>
                <Navbar.Brand href="/">
                    <img src={require("../assets/images/logo.png")} className="d-inline-block align-top" alt="Logo" />
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <Select placeholder="Clinic Name" className='me-2'
                        options={[
                            {
                                value: 'Clinic1',
                                label: 'Clinic 1',
                            },
                            {
                                value: 'Clinic2',
                                label: 'Clinic 2',
                            },
                        ]}
                    />
                    <Dropdown className='dropdown-profile nav-link-profile mx-1 pt-1 align-items-center'>
                        <Dropdown.Toggle id="navbarDropdown" variant="" className='py-0 border-0 nav-link'>
                            <i className='icon-notification active-notification'></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-menu-end'>
                            <Dropdown.Item>
                                <span>Profile</span>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <span>Logout</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className='dropdown-profile nav-link-profile mx-1 pt-1'>
                        <Dropdown.Toggle id="navbarDropdown" variant="" className='py-0 border-0 nav-link'>
                            <i className='icon-setting'></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-menu-end'>
                            <Dropdown.Item>
                                <span>Profile</span>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <span>Logout</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className='dropdown-profile nav-link-profile mx-1'>
                        <Dropdown.Toggle id="navbarDropdown" variant="" className='py-0 border-0 nav-link'>
                            {/* <i className='icon-patients'></i> */}
                            <img src={profile} alt="Logo" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-menu-end'>
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