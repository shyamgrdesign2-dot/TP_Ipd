import React from "react";
import { Button } from 'antd';
import { Link, useNavigate } from "react-router-dom";

import { ADD, EDIT } from "../../utils/constants";

function TabHeader({ flag, mode = ADD, title, loading, onClick }) {
    const navigate = useNavigate();
    return (
        <div className='modalCard-header align-items-center d-flex'>
            <div className='border-end h-100 text-center'>
                <Button className='btn btn-delete-prescription px-3 h-100' onClick={() => navigate(-1)}>
                    <i className='icon-right lh-lg'></i>
                </Button>
            </div>
            <div className="w-100 px-20 title-common">{title}</div>
            {flag === 1 ? (
                <Link to='/add_patient'>
                    <Button className='btn btn-primary3 me-30 btn-41 px-4 d-flex align-items-center' icon={<i className="icon-Add"></i>}>
                        Add New Patient
                    </Button>
                </Link>
            ) : (
                mode === EDIT ? (
                    <Button className='btn btn-primary3 me-30 btn-41 px-4 d-flex align-items-center' loading={loading} onClick={onClick}>
                        Save
                    </Button>
                ) : (
                    <Button className='btn btn-primary3 me-30 btn-41 px-4 d-flex align-items-center' loading={loading} onClick={onClick}>
                        Add Patient to Consult
                    </Button>
                )
            )}

        </div >
    );
}

export default React.memo(TabHeader);
