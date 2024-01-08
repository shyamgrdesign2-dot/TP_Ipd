import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { makeDefaultLogo } from "../utils/utils";

function ProfilePopover(props) {
    const [open, setOpen] = useState(false);

    const { locationPath, isMobile, state } = props

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const content = (
        <>
            <div className="align-items-center d-flex medicine-templates border-top-0 without-hover px-0 pt-0 pb-3">
                <div className="round-box bg-body-secondary"><i className="icon-Id fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Patient Id</div>
                    <div className="fontroboto letterspacing fw-medium">{state != undefined ? state.pm_pid : "000000"}</div>
                </div>
            </div>
            <div className="align-items-center d-flex medicine-templates border-top-0 without-hover px-0 pt-0">
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
                {locationPath == '/patient_details' ? '' :
                    <Button className='btn btn-primary2 align-items-center d-flex justify-content-center w-100 mt-3 btn-41'>
                        <i className='icon-Visit-Summary fs-21 me-2'></i>
                        Visit Summary
                    </Button>
                }
            </div>
        </>
    )

    return (
        <Popover
            content={content}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            className='cursor-pointer'
            overlayClassName="pop-260 pp-20"
        >
            {locationPath == '/patient_details' ? (
                <div className={'align-items-center d-flex h-100'}>
                    <div className='align-items-center d-flex'>
                        <div className='patientName'>{`${state != undefined ? state.pm_fullname : "Hello Guest"},`}</div>
                        <div className='text-2 ms-2'>{`${state != undefined ? state.pm_gender[0].toUpperCase() : "M"}, ${state != undefined ? state.ageYears : 30}y`}</div>
                        <i className='icon-right iconrotate270 ms-1'></i>
                    </div>
                </div>
            ) : (
                <div className={'align-items-center d-flex h-100 ps-3'}>
                    <div className='rounded-pill patientProfile border me-3'>{makeDefaultLogo(state?.pm_fullname)}</div>
                    <div>
                        <div className='patientName'>{`${state != undefined ? state.pm_fullname : "Hello Guest"}`}<div className='text-2'>{`${state != undefined ? state.pm_gender[0].toUpperCase() : "M"}, ${state != undefined ? state.ageYears : 30}y`}</div></div>
                    </div>
                    <div className='iconrotate270 align-self-start ms-2 mt-1'>
                        <i className='icon-right'></i>
                    </div>
                </div>
            )}
        </Popover>
    );
}

export default React.memo(ProfilePopover);