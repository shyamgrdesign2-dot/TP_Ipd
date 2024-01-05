import React, { useEffect, useContext, useMemo } from "react";
import { Button, Collapse } from 'antd';

import { useSelector, useDispatch } from "react-redux";

import CashManagerContext from '../../context/CashManagerContext';

import {
    getVitals,
} from "../../redux/vitalsSlice";

function TabVitalsList(props) {

    const { handleDrawerVital, handleCollapsed } = props

    const {
        vitalsTodayList,
        vitalsPastList,
        loading,
    } = useSelector((state) => state.vitals);
    const dispatch = useDispatch();

    const { state, setVitalsData } = useContext(CashManagerContext);

    useEffect(() => {
        var sendData = {
            patient_unique_id: state != undefined ? state.patient_unique_id : 0,
            pam_id: state != undefined && state.pam_id != undefined ? state.pam_id : 0,
        }
        dispatch(getVitals(sendData));
    }, []);

    useEffect(() => {
        const updatedData = vitalsTodayList.map((e, i) => {
            return { ...e, systolic: e.blood_press ? e.blood_press.split('/')[0] : '', diastolic: e.blood_press ? e.blood_press.split('/')[1] : '' };
        });
        setVitalsData(updatedData);
    }, [vitalsTodayList]);

    const PAST_VITALS = useMemo(() => {
        return (
            vitalsPastList.length > 0 &&
            vitalsPastList.map((item, i) => {
                return (
                    <div key={i} className="p-10 border-bottom pb-0">
                        <div className="title-sami">
                            {item.date}
                        </div>
                        <div className="py-3">
                            {/* <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">BP(mm Hg)</div>
                                <div className="fontroboto">{item.blood_press}</div>
                            </div> */}
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Temperature(Frh)</div>
                                <div className="fontroboto">{item.temp}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Pulse(/min)</div>
                                <div className="fontroboto">{item.pres}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Resp. Rate(/min)</div>
                                <div className="fontroboto">{item.resp_rate}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Systolic(mmhg)</div>
                                <div className="fontroboto">{item.blood_press ? item.blood_press.split('/')[0] : ''}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Diastolic(mmhg)</div>
                                <div className="fontroboto">{item.blood_press ? item.blood_press.split('/')[1] : ''}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">SPO2(%)</div>
                                <div className="fontroboto">{item.spo2}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Height</div>
                                <div className="fontroboto">{item.height}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Weight</div>
                                <div className="fontroboto">{item.weight}</div>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    }, [vitalsPastList]);

    const TODAY_VITALS = useMemo(() => {
        return (
            vitalsTodayList.length > 0 &&
            vitalsTodayList.map((item, i) => {
                return (
                    <div key={i} className="p-10 border-bottom pb-0">
                        <div className="title-sami">
                            {item.date}
                        </div>
                        <div className="py-3">
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Temperature(Frh)</div>
                                <div className="fontroboto">{item.temp}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Pulse(/min)</div>
                                <div className="fontroboto">{item.pres}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Resp. Rate(/min)</div>
                                <div className="fontroboto">{item.resp_rate}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Systolic(mmhg)</div>
                                <div className="fontroboto">{item.blood_press ? item.blood_press.split('/')[0] : ''}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Diastolic(mmhg)</div>
                                <div className="fontroboto">{item.blood_press ? item.blood_press.split('/')[1] : ''}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">SPO2(%)</div>
                                <div className="fontroboto">{item.spo2}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Height</div>
                                <div className="fontroboto">{item.height}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-12">
                                <div className="fontroboto">Weight</div>
                                <div className="fontroboto">{item.weight}</div>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    }, [vitalsTodayList]);

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
                <div>
                    <Collapse items={accordionItems} className="prescriptiontab-accordian" expandIconPosition={'end'} />
                </div>
            </div>
        </>
    );
}


export default React.memo(TabVitalsList);
