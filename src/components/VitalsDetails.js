import React from 'react';
import { Input } from 'antd';
function VitalsDetails() {
    const data = [
        {
            "date": "2023-12-29",
            "dev_unique_id": 0,
            "tcv_id": 0,
            "temp": "10",
            "pres": "20",
            "resp_rate": "330",
            "systolic": "40",
            "diastolic": "50",
            "spot": "74",
            "tcbc_id": "0",
            "height": "12",
            "weight": "3",
            "bmi": "2",
            "bmr": "2",
            "bsa": "2"
        }
    ]
    return (
        <div className='px-20'>
            <div className='vitals-wrapper w-100'>
                <div className='vitals-wrap-body vitals-parent-width'>
                    <div className='vitals-head'>Name</div>
                    <div className='vitals-row d-flex align-items-center border-bottom'>
                        Temperature
                    </div>
                    <div className='vitals-row d-flex align-items-center border-bottom'>
                        Pulse
                    </div>
                    <div className='vitals-row d-flex align-items-center border-bottom'>
                        Resp. Rate
                    </div>
                    <div className='vitals-row d-flex align-items-center border-bottom'>
                        Systolic
                    </div>
                    <div className='vitals-row d-flex align-items-center border-bottom'>
                        Diastolic
                    </div>
                    <div className='vitals-row d-flex align-items-center border-bottom'>
                        SPO2
                    </div>
                    <div className='vitals-row vitals-row-60 d-flex align-items-center'>
                        Height
                    </div>
                    <div className='vitals-row vitals-row-60 d-flex align-items-center'>
                        Weight
                    </div>
                    <div className='vitals-row vitals-row-40 d-flex align-items-center'>
                        BMI <i className='icon-info ms-1'></i>
                    </div>
                    <div className='vitals-row vitals-row-40 d-flex align-items-center'>
                        BMR <i className='icon-info ms-1'></i>
                    </div>
                    <div className='vitals-row vitals-row-40 d-flex align-items-center'>
                        BSA <i className='icon-info ms-1'></i>
                    </div>
                </div>
                <div className='d-flex overflow-x-auto scrollvitals w-100'>
                    {data.length > 0 &&
                        data.map((item, i) => {
                            return (
                                <div key={i} className='vitals-wrap-body w-100 vitals-child-width'>
                                    <div className='vitals-head rounded-start-0 w-100'>{item.date}</div>
                                    <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                                        <Input className='inputheight41-group' value={item.temp} addonAfter={'mmhg'} />
                                    </div>
                                    <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                                        <Input className='inputheight41-group' addonAfter={'mmhg'} />
                                    </div>
                                    <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                                        <Input className='inputheight41-group' addonAfter={'mmhg'} />
                                    </div>
                                    <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                                        <Input className='inputheight41-group' addonAfter={'mmhg'} />
                                    </div>
                                    <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                                        <Input className='inputheight41-group' addonAfter={'mmhg'} />
                                    </div>
                                    <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                                        <Input className='inputheight41-group' addonAfter={'mmhg'} />
                                    </div>
                                    <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
                                        <Input className='inputheight41-group' addonAfter={'mmhg'} />
                                    </div>
                                    <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
                                        <Input className='inputheight41-group' addonAfter={'mmhg'} />
                                    </div>
                                    <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                                        <div className='fs-14 '>22.2 kg/m² </div>
                                    </div>
                                    <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                                        <div className='fs-14'>1653.75 kcals </div>
                                    </div>
                                    <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                                        <div className='fs-14'>1.82 m² </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    )
}

export default React.memo(VitalsDetails)