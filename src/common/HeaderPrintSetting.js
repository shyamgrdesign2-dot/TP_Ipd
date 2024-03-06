import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

function HeaderPrintSetting() {
    const navigate = useNavigate();

    return (
        <Navbar className="justify-content-between headerprescription p-0">
            <div className='align-items-center d-flex w-100 h-100 justify-content-between'>
                <div className='align-items-center d-flex h-100 w-100'>
                    <div className='border-end h-100 text-center me-2'>
                        <div onClick={() => navigate("/")} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                            <i className='icon-right'></i>
                        </div>
                    </div>
                    <div className='title-common'>
                        Configure Print Setting
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-end w-100'>
                    <button className='btn btn-text me-14'>
                        <span>Default Settings</span>
                    </button>
                    <Button type='button' className="btn-41 btn px-4 btn-primary3 me-4">
                        Save
                    </Button>
                </div>
            </div>
        </Navbar>
    );
}

export default React.memo(HeaderPrintSetting);