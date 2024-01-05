import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Button, Popover } from 'antd';
import { isMobile } from 'react-device-detect';
import { makeDefaultLogo } from "../utils/utils";

function SidebarPatient({ collapsed, state }) {
    const menu = [
        { icon_name: 'icon-Visit-Summary', short_title: 'Visit', long_title: 'Visit Summary' },
        // { icon_name: 'icon-Report', short_title: 'Reports', long_title: 'Medical Reports (3)' },
        // { icon_name: 'icon-Discharge-Summary', short_title: 'Discharge', long_title: 'Discharge Summary' },
        // { icon_name: 'icon-Medical-Certificate', short_title: 'Certificate', long_title: 'Medical Certificate' },
        // { icon_name: 'icon-billings', short_title: 'Add Bill', long_title: 'Add Bill/Payment' },
        // { icon_name: 'icon-More', short_title: '', long_title: 'More Options' }
    ]

    const content = (
        <>
            <div className="align-items-center d-flex medicine-templates without-hover px-0 pt-0 pb-3">
                <div className="round-box bg-body-secondary"><i className="icon-Id fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Patient Id</div>
                    <div className="fontroboto letterspacing fw-medium">{state != undefined ? state.pm_pid : "000000"}</div>
                </div>
            </div>
            <div className="align-items-center d-flex medicine-templates without-hover px-0 pt-0">
                <div className="round-box bg-body-secondary"><i className="icon-phone fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Mobile Number</div>
                    <div className="fontroboto letterspacing fw-medium">{state != undefined ? state.pm_contact_no : "000000"}</div>
                </div>
            </div>
            <div>
                <Button className='btn btn-primary2 d-flex justify-content-center align-items-center w-100 mt-3 btn-41'>
                    <i className='icon-Edit me-2 fs-21'></i>
                    Edit Profile
                </Button>
                <Button className='btn btn-primary2 align-items-center d-flex justify-content-center w-100 mt-3 btn-41'>
                    <i className='icon-Visit-Summary fs-21 me-2'></i>
                    Visit Summary
                </Button>

            </div>
        </>
    )

    return (
        <div>
            <Popover
                content={!isMobile ? content : null}
                trigger="click"
                className='cursor-pointer'
                overlayClassName="pop-260 pp-20"
            >
                <div className={`d-flex align-items-center rounded-3 m-2 text-truncate ${collapsed ? '' : 'bg-body p-2'}`}>
                    <div className={`rounded-pill patientProfile border ${collapsed ? 'mx-auto' : 'me-2'}`}>
                        {makeDefaultLogo(state?.pm_fullname)}
                    </div>
                    {!collapsed && (
                        <div className='text-truncate'>
                            <div className='patientName d-flex align-items-center'> <div className='text-truncate pt-2px'>{`${state != undefined ? state.pm_fullname : "Hello Guest"}`}</div>
                                <button className='btn p-0 ms-2 iconrotate270'><i className='icon-right'></i></button>
                            </div>
                            <p className='mb-0'>{`${state != undefined ? state.pm_gender[0].toUpperCase() : "M"}, ${state != undefined ? state.ageYears : 30}y, ${state != undefined ? state.pm_contact_no : "000000"}`}</p>
                        </div>
                    )}
                </div>
            </Popover>
            <hr />
            {menu.map((item, index) => {
                return (
                    <div key={index}>
                        <Nav.Item className={collapsed && 'text-center'}>
                            <Nav.Link className={`${index == 0 && 'active'} ${!collapsed && 'd-flex align-items-center'}`}>
                                <i className={item.icon_name}></i>
                                <div className={collapsed ? 'text-truncate' : 'ms-3'}>{collapsed ? item.short_title : item.long_title}</div>
                            </Nav.Link>
                        </Nav.Item>
                        {index == menu.length - 2 && <hr className='my-1' />}
                    </div>
                )
            })}
        </div>
    )
}
export default React.memo(SidebarPatient)