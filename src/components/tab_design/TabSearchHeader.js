import React from "react";
import { AutoComplete, Input, Button} from 'antd';
function TabSearchHeader() {
    return (
        <div className='modalCard-header h-74 align-items-center d-flex'>
            <div className='border-end h-100 text-center'>
                <Button className='btn btn-delete-prescription px-3 h-100'>
                    <i className='icon-right'></i>
                </Button>
            </div>
            <AutoComplete
                className="autocomplete-custom w-100 px-20"
                popupClassName="autocompletepopup"
            >
                <Input
                    placeholder="Search Symptoms / Chief Complaints"
                    prefix={<i className="icon-search"></i>}
                    suffix={<i className="icon-Cross"></i>}
                />
            </AutoComplete>
            <Button disabled className='btn btn-primary3 me-30 btn-41 px-4'>
                Done
            </Button>
        </div>
    );
}

export default TabSearchHeader;
