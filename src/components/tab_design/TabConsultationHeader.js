import React from "react";
import { Button} from 'antd';
import { Link } from "react-router-dom";
function TabConsultationHeader() {
    return (
        <div className='modalCard-header align-items-center d-flex'>
            <div className='border-end h-100 text-center'>
                <Button className='btn btn-delete-prescription px-3 h-100'>
                    <i className='icon-right'></i>
                </Button>
            </div>
            <div className="w-100 px-20 title-common">Star Walking Consultation</div>
            <Link to='/patient_details'>
                <Button className='btn btn-primary3 me-30 btn-41 px-4 d-flex align-items-center' icon={<i className="icon-Add"></i>}>
                    Add New Patient
                </Button>
            </Link>
        </div>
    );
}

export default TabConsultationHeader;
