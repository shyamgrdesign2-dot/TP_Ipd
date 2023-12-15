import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { isTablet } from 'react-device-detect';

function ProfilePopover() {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const content = (
        <>
            <div className="align-items-center d-flex medicine-templates without-hover px-0 pt-0 pb-3">
                <div className="round-box bg-body-secondary"><i className="icon-Id fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Patient Id</div>
                    <div className="fontroboto letterspacing fw-medium">PI202306001</div>
                </div>
            </div>
            <div className="align-items-center d-flex medicine-templates without-hover px-0 pt-0">
                <div className="round-box bg-body-secondary"><i className="icon-phone fs-21"></i></div>
                <div className="text-truncate">
                    <div className="fontroboto letterspacing">Mobile Number</div>
                    <div className="fontroboto letterspacing fw-medium">7894651230</div>
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
        <Popover
            content={content}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            className='cursor-pointer'
            overlayClassName="pop-260 pp-20"
        >
            <div className={['align-items-center d-flex h-100', isTablet ? '' : 'ps-3']}>
                {!isTablet ? <div className='rounded-pill patientProfile border me-3'>AP</div> : ''}
                <div>
                    <div className='patientName'> Ashish Patel{isTablet ? <span className='text-2 text-black'>, M, 28y </span>: <div className='text-2'> M, 28y </div>} </div>
                </div>
                <div className='iconrotate270 align-self-start ms-2 mt-1'>
                    <i className='icon-right'></i> 
                </div>
            </div>
        </Popover>
    );
}

export default React.memo(ProfilePopover);