import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Button, Popover } from 'antd';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

import { useSelector } from "react-redux";

import { makeDefaultLogo } from "../utils/utils";

function SidebarPatient({ collapsed, patient_data, sidebarKey, onClickSidebarHandle }) {

    const { profile } = useSelector((state) => state.doctors);

    const menu = [
        { key: 1, icon_name: 'icon-Visit-Summary-Fill', short_title: 'Visit', long_title: 'Visit Summary' },
        { key: 2, icon_name: 'icon-Medical-Certificate', short_title: 'Certificate', long_title: 'Certificate' },
        // { icon_name: 'icon-Report', short_title: 'Reports', long_title: 'Medical Reports (3)' },
        // { icon_name: 'icon-Discharge-Summary', short_title: 'Discharge', long_title: 'Discharge Summary' },
        // { icon_name: 'icon-Medical-Certificate', short_title: 'Certificate', long_title: 'Medical Certificate' },
        // { icon_name: 'icon-billings', short_title: 'Add Bill', long_title: 'Add Bill/Payment' },
        // { icon_name: 'icon-More', short_title: '', long_title: 'More Options' }
    ]

    const content = (
        <>
            <div className="align-items-center d-flex medicine-templates border-top-0 without-hover px-0 pt-0 pb-3">
                <div className="round-box bg-body-secondary"><i className="icon-Id fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Patient Id</div>
                    <div className="fontroboto letterspacing fw-medium">{patient_data !== undefined ? patient_data.pm_pid : "000000"}</div>
                </div>
            </div>
            <div className="align-items-center d-flex medicine-templates border-top-0 without-hover px-0 pt-0">
                <div className="round-box bg-body-secondary"><i className="icon-phone fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Mobile Number</div>
                    <div className="fontroboto letterspacing fw-medium">{patient_data !== undefined ? patient_data.pm_contact_no : "000000"}</div>
                </div>
            </div>
            <div>
                <Link to="/edit_patient" replace={true} state={{ patient_data: patient_data }}>
                    <Button className='btn btn-primary2 d-flex justify-content-center align-items-center w-100 mt-3 btn-41'>
                        <i className='icon-Edit me-2 fs-21'></i>
                        Edit Profile
                    </Button>
                </Link>
            </div>
        </>
    )

    const genderAge = (patient_data) => {
        var value = `${patient_data?.pm_gender[0].toUpperCase()}, `
        if (profile?.dp_id === 9) {
            if (patient_data?.ageYears != 0) {
                value += `${patient_data?.ageYears}y`
            }
            if (patient_data?.ageMonths != 0) {
                value += ` ${patient_data?.ageMonths}m`
            }
            if (patient_data?.ageDays != 0) {
                value += ` ${patient_data?.ageDays}d`
            }
        } else {
            value += `${patient_data?.ageYears}y`
        }
        return value
    }

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
                        {makeDefaultLogo(patient_data?.pm_fullname)}
                    </div>
                    {!collapsed && (
                        <div className='text-truncate'>
                            <div className='patientName d-flex align-items-center'> <div className='text-truncate pt-2px'>{`${patient_data !== undefined ? patient_data.pm_fullname : "Hello Guest"}`}</div>
                                <button className='btn p-0 ms-2 iconrotate270'><i className='icon-right'></i></button>
                            </div>
                            <p className='mb-0'>{patient_data !== undefined ? genderAge(patient_data) : `M, 30y`}</p>
                        </div>
                    )}
                </div>
            </Popover>
            <hr />
            {menu.map((item, index) => {
                return (
                    <div key={index}>
                        <Nav.Item className={collapsed && 'text-center'}>
                            <Nav.Link className={`${item.key == sidebarKey && 'active'} ${!collapsed && 'd-flex align-items-center'}`} onClick={() => onClickSidebarHandle(item?.key)}>
                                <i className={item.icon_name}></i>
                                <div className={collapsed ? 'text-truncate' : 'ms-3'}>{collapsed ? item.short_title : item.long_title}</div>
                            </Nav.Link>
                        </Nav.Item>
                        {/* {index == menu.length - 2 && <hr className='my-1' />} */}
                    </div>
                )
            })}
        </div>
    )
}
export default React.memo(SidebarPatient)