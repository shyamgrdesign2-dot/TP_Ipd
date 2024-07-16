import React from 'react';
import { Button } from 'antd';

function DWMembership() {
   return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto"> Include the memberships you are associated with.</div>

                {/* Use D&D Table Design here  */}   

                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3'><i className='icon-Add fs-18 me-2'></i>Add Service</Button>
            </div>
        </div>
    );
}

export default DWMembership;
