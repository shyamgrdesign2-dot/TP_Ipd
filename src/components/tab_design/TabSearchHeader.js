import React from "react";
import { AutoComplete, Input, Button } from 'antd';

function TabSearchHeader(props) {
    const { placeholder, onClose, searchQuery, onSearchParent } = props
    return (
        <div className='modalCard-header h-74 align-items-center d-flex'>
            <div className='border-end h-100 text-center'>
                <Button className='btn btn-delete-prescription px-3 h-100' onClick={onClose}>
                    <i className='icon-right'></i>
                </Button>
            </div>
            <Input
                value={searchQuery}
                className="mx-20 inputheight38"
                placeholder={placeholder}
                prefix={<i className="icon-search"></i>}
                suffix={searchQuery.length > 0 && <i className="icon-Cross" onClick={() => onSearchParent('')}></i>}
                onChange={(e) => onSearchParent(e.target.value)}
            />
            <Button className='btn btn-primary3 me-30 btn-41 px-4' onClick={onClose}>
                Done
            </Button>
        </div>
    );
}

export default React.memo(TabSearchHeader);
