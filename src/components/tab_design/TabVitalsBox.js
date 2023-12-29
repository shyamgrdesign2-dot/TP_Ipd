import React, { useState, useEffect, useCallback, useRef, useContext, useMemo } from "react";
import { Button, message, Card, DatePicker,Input } from 'antd';

import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../../context/CashManagerContext';

import {
    addUpdateVitals,
    getVitals,
} from "../../redux/vitalsSlice";

function TabVitalsBox(props) {

    const { handleDrawerVital, handleCollapsed } = props

    const [messageApi, contextHolder] = message.useMessage();
    const {
        vitalsList,
        loading,
    } = useSelector((state) => state.vitals);
    const dispatch = useDispatch();

    const { vitalsData, setVitalsData } = useContext(CashManagerContext);
    // const [ vitalsData, setVitalsData] = useState([]);

    useEffect(() => {
        dispatch(getVitals({
            "patient_unique_id": "5754059960",
            "pam_id":"0"
        }));
    }, []);

    useEffect(() => {
        setVitalsData(vitalsList);
    }, [vitalsList]);

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    //Child Componet
    const TABLE_VITALS = useMemo(() => {
        return (
            vitalsData.length > 0 &&
            vitalsData.map((item, i) => {
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
                        <div className='vitals-row vitals-row-50 d-flex align-items-center px-2 w-100'>
                            <Input className='inputheight41-group' addonAfter={'mmhg'} />
                        </div>
                        <div className='vitals-row vitals-row-50 d-flex align-items-center px-2 w-100'>
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
            })
        );
    }, [vitalsData]);

    return (
        <>
            {contextHolder}
            <Card bordered={false} className="search-modalCard h-100">
                <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                    <div className='align-items-center d-flex'>
                        <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerVital}>
                            <i className='icon-Cross fs-3'></i>
                        </Button>
                        <div className="modal-title">Vitals</div>
                    </div>
                    <Button onClick={() => handleCollapsed(1)} className='btn btn-primary3 btn-41 px-4 me-20'>
                        Done
                    </Button>
                </div>
                <div className="align-items-center d-flex justify-content-between px-20 py-3">
                    <div className="position-relative">
                        <Button className='btn btn-primary2 btn-41'>
                            Add New Date
                        </Button>
                        <DatePicker suffixIcon={null} inputReadOnly onChange={onChange} className="calender-vitals w-100 h-100" />
                    </div>
                    <div className="float-end d-flex align-itms-center">
                        <i className="icon-setting me-2"></i>
                        <span className="text-decoration-underline fw-medium"> Add or Configure </span>
                    </div>
                </div>
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
                            <div className='vitals-row vitals-row-50 d-flex align-items-center'>
                                Height
                            </div>
                            <div className='vitals-row vitals-row-50 d-flex align-items-center'>
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
                            {TABLE_VITALS}
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
}


export default React.memo(TabVitalsBox);
