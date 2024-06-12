import React, { useContext, useMemo } from "react";
import { Input } from 'antd';

import { useSelector } from "react-redux";

import CashManagerContext from '../context/CashManagerContext';

import moment from "moment";

const showDateFormat = 'DD MMM, YY'

function VitalsList(props) {

    const { vitalsPastList } = useSelector((state) => state.vitals);

    const { vitalsData } = useContext(CashManagerContext);

    const TODAY_VITALS = useMemo(() => {
        return (
            vitalsData.length > 0 &&
            vitalsData.map((item, i) => {
                return (
                    <div key={i} className={`${vitalsData.length - 1 != i && 'border-bottom'} pt-3 vitals-height input-readonly`}>
                        <div className="title-sami mb-3">
                            {moment(item.date).format(showDateFormat)}
                        </div>
                        {item.temp && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Temperature</div>
                                <Input className='inputheight41-group mx-2' value={item.temp} addonAfter={'Frh'} readOnly />
                            </div>
                        )}
                        {item.pres && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Pulse</div>
                                <Input className='inputheight41-group mx-2' value={item.pres} addonAfter={'/min'} readOnly />
                            </div>
                        )}
                        {item.resp_rate && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Resp. Rate</div>
                                <Input className='inputheight41-group mx-2' value={item.resp_rate} addonAfter={'/min'} readOnly />
                            </div>
                        )}
                        {item.blood_press && item.blood_press.split('/')[0] && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Systolic</div>
                                <Input className='inputheight41-group mx-2' value={item.blood_press ? item.blood_press.split('/')[0] : ''} addonAfter={'mmHg'} readOnly />
                            </div>
                        )}
                        {item.blood_press && item.blood_press.split('/')[1] && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Diastolic</div>
                                <Input className='inputheight41-group mx-2' value={item.blood_press ? item.blood_press.split('/')[1] : ''} addonAfter={'mmHg'} readOnly />
                            </div>
                        )}
                        {item.spo2 && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">SPO2</div>
                                <Input className='inputheight41-group mx-2' value={item.spo2} addonAfter={'%'} readOnly />
                            </div>
                        )}
                        {item.height && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Height</div>
                                <Input className='inputheight41-group mx-2' value={item.height} addonAfter={'cms'} readOnly />
                            </div>
                        )}
                        {item.weight && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Weight</div>
                                <Input className='inputheight41-group mx-2' value={item.weight} addonAfter={'kgs'} readOnly />
                            </div>
                        )}
                        {item.bmi && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BMI</div>
                                <Input className='inputheight41-group mx-2' value={parseFloat(item.bmi).toFixed(2)} addonAfter={'kg/m²'} readOnly />
                            </div>
                        )}
                        {item.bmr && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BMR</div>
                                <Input className='inputheight41-group mx-2' value={parseFloat(item.bmr).toFixed(2)} addonAfter={'kcals'} readOnly />
                            </div>
                        )}
                        {item.bsa && (
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BSA</div>
                                <Input className='inputheight41-group mx-2' value={parseFloat(item.bsa).toFixed(2)} addonAfter={'m²'} readOnly />
                            </div>
                        )}
                    </div>
                );
            })
        );
    }, [vitalsData]);

    return (
        <>
            <div className="overflow-y-auto" style={{ maxHeight: `${vitalsData.length > 0 && "250px"}` }}>
                {TODAY_VITALS}
            </div>
        </>
    );
}


export default React.memo(VitalsList);
