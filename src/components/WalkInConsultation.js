import React, { useState } from 'react';
import { AutoComplete, Input, Button, Modal } from 'antd';

import CommonModal from '../common/CommonModal';

function WalkInConsultation() {
    const [value, setValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [options, setOptions] = useState([{
        label: (
            <Button type="text" className='btn btn-primary1 btn-41 align-items-center d-flex' icon={<i className='icon-Add'></i>}>
                Add New Patient
            </Button>
        )
    }]);
    const onSearch = (data) => {
        setValue(data);
        console.log('onSearch', data);
        if (data.length > 0) {
            const array = [
                { id: 1, name: 'kishan', ph_no: '8155559482', p_id: 'PI202306001', age: '25Y', gender: 'Male' },
                { id: 2, name: 'Mehul', ph_no: '61555559482', p_id: 'PI202306002', age: '26Y', gender: 'Female' },
                { id: 3, name: 'Ajeet', ph_no: '81559482', p_id: 'PI202306003', age: '27Y', gender: 'Male' },
                { id: -1 }
            ]
            array.map(e => {
                if (e.id != -1) {
                    options.push({
                        value: e.name,
                        label: (
                            <>
                                <div className='d-flex align-items-center justify-content-between py-3 border-bottom'>
                                    <div className='d-flex align-items-center'>
                                        <div className='list-patientName d-flex align-items-center me-4'><i className='icon-patients backbar me-2'></i> <span>{e.name} ({e.gender}, {e.age})</span></div>
                                        <div className='list-patientName d-flex align-items-center me-4'><i className='icon-phone backbar me-2'></i><span>{e.ph_no}</span></div>
                                        <div className='list-patientName d-flex align-items-center me-4'><i className='icon-Id backbar me-2'></i><span>{e.p_id}</span></div>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <Button type="text" className='btn btn-primary2 me-4 align-items-center d-flex' icon={<i className='icon-Preview'></i>}>
                                            Patient Details
                                        </Button>
                                        <Button type="text" className='btn btn-primary3 align-items-center d-flex' icon={<i className='icon-Consult'></i>}>
                                            Start Consult
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )
                    })
                } else {
                    options.push({
                        label: (
                            <Button type="text" className='btn btn-primary1 btn-41 align-items-center d-flex mt-3' icon={<i className='icon-Add'></i>}>
                                Add New Patient
                            </Button>
                        )
                    })
                }

            })
        } else {
            setOptions([{
                label: (
                    <Button type="text" className='btn btn-primary1 btn-41 align-items-center d-flex' icon={<i className='icon-Add'></i>}>
                        Add New Patient
                    </Button>
                )
            }])
        }
        setOptions(prev => [...prev])
    };
    const onSelect = (data) => {
        console.log('onSelect', data);
    };

    return (
        <div className="border rounded-4 appointment-wrap p-4">
            <label className='mb-2'> Enter Patient’s Name, Phone number or Id</label> <br />
            <div className='align-items-center d-flex'>
                <AutoComplete
                    value={value}
                    options={options}
                    style={{
                        width: '100%'
                    }}
                    onSelect={onSelect}
                    onSearch={onSearch}
                    className='autocomplete-custom'
                >
                    <Input
                        placeholder="Search by Patient’s Name, Phone number or Id"
                        prefix={<i className='icon-search'></i>}
                        suffix={value.length > 0 && <i className='icon-Cross' onClick={() => setValue('')}></i>}
                    />
                </AutoComplete>
            </div>

            <CommonModal
                isModalOpen={isModalOpen}
                title={"Patient Selected"}
                modalBody=
                {
                    <>
                        <div className='border bg-body rounded-10px p-2 patient-details'>
                            <div className='d-flex align-items-center'>
                                <i className='icon-patients me-2'></i>
                                <span>Rahul Sharma (Male, 26y)</span>
                            </div>
                            <div className='mt-2 d-flex align-items-center'>
                                <i className='icon-phone me-2'></i> <span>7894561230</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <i className='icon-Id me-2'></i> <span>PI202306001</span>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <span className='title-common'>
                                Choose Action
                            </span>
                            <div className='d-flex align-items-center mt-2'>
                                <Button type="text" className='btn btn-primary2 me-3 align-items-center d-flex btn-41 w-50' icon={<i className='icon-Preview'></i>}>
                                    View Patient Details <i className='icon-right iconrotate90 ms-auto'></i>
                                </Button>
                                <Button type="text" className='btn btn-primary3 align-items-center d-flex btn-41 w-50' icon={<i className='icon-Consult'></i>}>
                                    Start Consult <i className='icon-right iconrotate90 ms-auto'></i>
                                </Button>
                            </div>
                        </div>
                    </>
                }
            />
        </div>
    )
}
export default WalkInConsultation