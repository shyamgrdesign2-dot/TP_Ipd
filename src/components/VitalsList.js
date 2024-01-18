import React, { useEffect, useContext, useMemo } from "react";
import { Input } from 'antd';

import { useSelector, useDispatch } from "react-redux";

import CashManagerContext from '../context/CashManagerContext';

import {
    getVitals,
} from "../redux/vitalsSlice";

function VitalsList() {

    const {
        selectedVitalsList,
        vitalsPastList,
        loading,
    } = useSelector((state) => state.vitals);
    const dispatch = useDispatch();

    const { state, vitalsData, setVitalsData } = useContext(CashManagerContext);

    useEffect(() => {
        var sendData = {
            patient_unique_id: state != undefined ? state.patient_unique_id : 0,
            pam_id: state != undefined && state.pam_id != undefined ? state.pam_id : 0,
        }
        dispatch(getVitals(sendData));
    }, []);

    // useEffect(() => {
    //     const updatedData = selectedVitalsList.map((e, i) => {
    //         return { ...e, systolic: e.blood_press ? e.blood_press.split('/')[0] : '', diastolic: e.blood_press ? e.blood_press.split('/')[1] : '' };
    //     });
    //     setVitalsData(updatedData);
    // }, [selectedVitalsList]);

    const TODAY_VITALS = useMemo(() => {
        return (
            vitalsData.length > 0 &&
            vitalsData.map((item, i) => {
                return (
                    <div key={i} className={`${vitalsData.length - 1 != i && 'border-bottom'} pt-3 vitals-height input-readonly`}>
                        <div className="title-sami mb-3">
                            {item.date}
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-12">
                            <div className="fontroboto">Temperature</div>
                            <Input className='inputheight41-group mx-2' value={item.temp} addonAfter={'Frh'} readOnly />
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-12">
                            <div className="fontroboto">Pulse</div>
                            <Input className='inputheight41-group mx-2' value={item.pres} addonAfter={'/min'} readOnly />
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-12">
                            <div className="fontroboto">Resp. Rate</div>
                            <Input className='inputheight41-group mx-2' value={item.resp_rate} addonAfter={'/min'} readOnly />
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-12">
                            <div className="fontroboto">Systolic</div>
                            <Input className='inputheight41-group mx-2' value={item.blood_press ? item.blood_press.split('/')[0] : ''} addonAfter={'mmHg'} readOnly />
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-12">
                            <div className="fontroboto">Diastolic</div>
                            <Input className='inputheight41-group mx-2' value={item.blood_press ? item.blood_press.split('/')[1] : ''} addonAfter={'mmHg'} readOnly />
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-12">
                            <div className="fontroboto">SPO2</div>
                            <Input className='inputheight41-group mx-2' value={item.spo2} addonAfter={'%'} readOnly />
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-12">
                            <div className="fontroboto">Height</div>
                            <Input className='inputheight41-group mx-2' value={item.height} addonAfter={'cms'} readOnly />
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-12">
                            <div className="fontroboto">Weight</div>
                            <Input className='inputheight41-group mx-2' value={item.weight} addonAfter={'kgs'} readOnly />
                        </div>
                    </div>
                );
            })
        );
    }, [vitalsData]);

    return (
        <>
            <div className="overflow-y-auto" style={{ height: `${vitalsData.length > 0 && "250px"}` }}>
                {TODAY_VITALS}
            </div>
        </>
    );
}


export default React.memo(VitalsList);
