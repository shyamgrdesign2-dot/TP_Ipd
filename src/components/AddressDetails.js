import React from 'react';
import { Button } from 'antd';

function AddressDetails() {
    return (
        <>
            <div className="d-flex justify-content-between">
                <div className='title'>Personal Details</div>
                <Button className='border-0 shadow-none'>
                    <div className='title align-items-center d-flex'> <i className='icon-Add me-2'></i> Add Details</div>
                </Button>
            </div>
        </>
    )
}

export default React.memo(AddressDetails)