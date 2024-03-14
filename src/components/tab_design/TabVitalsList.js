import React, { useEffect, useContext, useMemo } from "react";
import { Button, Collapse } from 'antd';

import { useSelector, useDispatch } from "react-redux";

import CashManagerContext from '../../context/CashManagerContext';

import {
    getVitals,
} from "../../redux/vitalsSlice";
import moment from "moment";

const showDateFormat = 'DD MMM, YY'

function TabVitalsList(props) {

    const { handleDrawerVital, handleCollapsed } = props

    const {
        selectedVitalsList,
        vitalsPastList,
        loading,
    } = useSelector((state) => state.vitals);
    const dispatch = useDispatch();

    const { patient_data, vitalsData, setVitalsData } = useContext(CashManagerContext);

    useEffect(() => {
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            pam_id: patient_data !== undefined && patient_data.pam_id !== undefined ? patient_data.pam_id : 0,
        }
        dispatch(getVitals(sendData));
    }, []);

    // useEffect(() => {
    //     const updatedData = selectedVitalsList.map((e, i) => {
    //         return { ...e, systolic: e.blood_press ? e.blood_press.split('/')[0] : '', diastolic: e.blood_press ? e.blood_press.split('/')[1] : '' };
    //     });
    //     setVitalsData(updatedData);
    // }, [selectedVitalsList]);

    const PAST_VITALS = useMemo(() => {
        return (
            vitalsPastList.length > 0 &&
            vitalsPastList.map((item, i) => {
                return (
                    <div key={i} className="p-10 border-bottom pb-0">
                        <div className="title-sami">
                            {moment(item.date).format(showDateFormat)}
                        </div>
                        <div className="py-3">
                            {/* <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BP(mm Hg)</div>
                                <div className="fontroboto">{item.blood_press}</div>
                            </div> */}
                            {item.temp && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Temperature(Frh)</div>
                                    <div className="fontroboto">{item.temp}</div>
                                </div>
                            )}
                            {item.pres && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Pulse (/min)</div>
                                    <div className="fontroboto">{item.pres}</div>
                                </div>
                            )}
                            {item.resp_rate && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Resp. Rate (/min)</div>
                                    <div className="fontroboto">{item.resp_rate}</div>
                                </div>
                            )}
                            {item.blood_press && item.blood_press.split('/')[0] && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Systolic (mmHg)</div>
                                    <div className="fontroboto">{item.blood_press.split('/')[0]}</div>
                                </div>
                            )}
                            {item.blood_press && item.blood_press.split('/')[1] && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Diastolic (mmHg)</div>
                                    <div className="fontroboto">{item.blood_press.split('/')[1]}</div>
                                </div>
                            )}
                            {item.spo2 && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">SPO2 (%)</div>
                                    <div className="fontroboto">{item.spo2}</div>
                                </div>
                            )}
                            {item.height && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Height (cms)</div>
                                    <div className="fontroboto">{item.height}</div>
                                </div>
                            )}
                            {item.weight && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Weight (kgs)</div>
                                    <div className="fontroboto">{item.weight}</div>
                                </div>
                            )}
                            {item.bmi && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">BMI (kg/m²)</div>
                                    <div className="fontroboto">{parseFloat(item.bmi).toFixed(2)}</div>
                                </div>
                            )}
                            {item.bmr && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">BMR (kcals)</div>
                                    <div className="fontroboto">{parseFloat(item.bmr).toFixed(2)}</div>
                                </div>
                            )}
                            {item.bsa && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">BSA (m²)</div>
                                    <div className="fontroboto">{parseFloat(item.bsa).toFixed(2)}</div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })
        );
    }, [vitalsPastList]);

    const TODAY_VITALS = useMemo(() => {
        return (
            vitalsData.length > 0 &&
            vitalsData.map((item, i) => {
                return (
                    <div key={i} className="p-10 border-bottom pb-0">
                        <div className="title-sami">
                            {moment(item.date).format(showDateFormat)}
                        </div>
                        <div className="py-3">
                            {item.temp && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Temperature(Frh)</div>
                                    <div className="fontroboto">{item.temp}</div>
                                </div>
                            )}
                            {item.pres && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Pulse (/min)</div>
                                    <div className="fontroboto">{item.pres}</div>
                                </div>
                            )}
                            {item.resp_rate && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Resp. Rate (/min)</div>
                                    <div className="fontroboto">{item.resp_rate}</div>
                                </div>
                            )}
                            {item.blood_press && item.blood_press.split('/')[0] && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Systolic (mmHg)</div>
                                    <div className="fontroboto">{item.blood_press.split('/')[0]}</div>
                                </div>
                            )}
                            {item.blood_press && item.blood_press.split('/')[1] && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Diastolic (mmHg)</div>
                                    <div className="fontroboto">{item.blood_press.split('/')[1]}</div>
                                </div>
                            )}
                            {item.spo2 && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">SPO2 (%)</div>
                                    <div className="fontroboto">{item.spo2}</div>
                                </div>
                            )}
                            {item.height && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Height (cms)</div>
                                    <div className="fontroboto">{item.height}</div>
                                </div>
                            )}
                            {item.weight && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">Weight (kgs)</div>
                                    <div className="fontroboto">{item.weight}</div>
                                </div>
                            )}
                            {item.bmi && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">BMI (kg/m²)</div>
                                    <div className="fontroboto">{parseFloat(item.bmi).toFixed(2)}</div>
                                </div>
                            )}
                            {item.bmr && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">BMR (kcals)</div>
                                    <div className="fontroboto">{parseFloat(item.bmr).toFixed(2)}</div>
                                </div>
                            )}
                            {item.bsa && (
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <div className="fontroboto">BSA (m²)</div>
                                    <div className="fontroboto">{parseFloat(item.bsa).toFixed(2)}</div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })
        );
    }, [vitalsData]);

    // Accordian for side menu
    const accordionItems = [
        {
            key: '1',
            label: <div className="title-common">Past Visit Data</div>,
            children: PAST_VITALS,
        },
    ];

    return (
        <>
            <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
                Vitals
                <Button type="text" className="btn p-0 btn-outline" onClick={handleCollapsed}>
                    <i className='icon-Contract fs-21 text-white p-0'></i>
                </Button>
            </div>
            <div className="overflow-y-auto" style={{ height: "calc(100vh - 109px)" }}>
                <div className="p-10 pb-0">
                    <span className="title-common">Today’s Data</span>
                    <Button className='btn btn-input mt-3 d-flex justify-content-center align-items-center btn-41' onClick={handleDrawerVital}>
                        <i className='icon-Add me-2 fs-21'></i>
                        Add or Edit Vitals
                    </Button>
                </div>
                {TODAY_VITALS}
                {vitalsPastList.length > 0 && (
                    <div>
                        <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian" expandIconPosition={'end'} />
                    </div>
                )}
            </div>
        </>
    );
}


export default React.memo(TabVitalsList);
