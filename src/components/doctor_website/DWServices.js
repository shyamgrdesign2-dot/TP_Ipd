import React from 'react';
import { Button } from 'antd';

function DWServices() {
   return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto"> Include the services you provide to your patients. You can add up to 8 services.</div>

                {/* Use D&D Table Design here  */}   

                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3'><i className='icon-Add fs-18 me-2'></i>Add Service</Button>
            </div>
        </div>
    );
}

export default DWServices;
