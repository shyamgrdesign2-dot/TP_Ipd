import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { Button, message, Card, DatePicker, Input, Tooltip } from 'antd';
import dayjs from "dayjs";

import { useSelector, useDispatch } from "react-redux";
// import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_KEY } from "../utils/constants";
import { onlyDecimalFormat } from "../utils/utils";

import CashManagerContext from '../context/CashManagerContext';

import {
    addUpdateVitals,
    getVitals,
} from "../redux/vitalsSlice";
import moment from "moment";

function VitalsBox(props) {

    const { handleDrawerVital, handleCollapsed } = props

    const [messageApi, contextHolder] = message.useMessage();
    const {
        vitalsTodayList,
        loading,
    } = useSelector((state) => state.vitals);
    const dispatch = useDispatch();

    const { patient_data } = useContext(CashManagerContext);
    const [vitalsData, setVitalsData] = useState([]);

    useEffect(() => {
        const updatedData = vitalsTodayList.map((e, i) => {
            return { ...e, systolic: e.blood_press ? e.blood_press.split('/')[0] : '', diastolic: e.blood_press ? e.blood_press.split('/')[1] : '' };
        });
        setVitalsData(updatedData);
    }, [vitalsTodayList]);

    useEffect(() => {
        if (vitalsData.length == 0) {
            let cal = calculate('', '');
            vitalsData.push({
                date: moment().format("YYYY-MM-DD"),
                dev_unique_id: 0,
                tcv_id: 0,
                tcbc_id: 0,
                temp: '',
                pres: '',
                resp_rate: '',
                systolic: '',
                diastolic: '',
                spo2: '',
                height: '',
                weight: '',
                bmi: cal.bmi,
                bmr: cal.bmr,
                bsa: cal.bsa,
            });
            setVitalsData((prev) => [...prev]);
        }
    }, [vitalsData]);

    const onChange = useCallback(
        (date, dateString) => {
            let cal = calculate('', '');
            vitalsData.push({
                date: dateString,
                dev_unique_id: 0,
                tcv_id: 0,
                tcbc_id: 0,
                temp: '',
                pres: '',
                resp_rate: '',
                systolic: '',
                diastolic: '',
                spo2: '',
                height: '',
                weight: '',
                bmi: cal.bmi,
                bmr: cal.bmr,
                bsa: cal.bsa,
            });
            setVitalsData((prev) => [...prev]);
        },
        [vitalsData]
    );

    const calculate = (H, W) => {
        var height = 0, weight = 0, bmi = "", bmr = "", bsa = ""

        if (H != '' && H != 0) {
            height = parseFloat(H)
        } else {
            height = 0
        }

        if (W != '' && W != 0) {
            weight = parseFloat(W)
        } else {
            weight = 0
        }

        const calBMI = (weight / height / height) * 10000
        bmi = weight && height ? isFinite(calBMI) ? calBMI.toFixed(2) : '' : '';

        var age = patient_data != undefined && patient_data.ageYears != undefined ? patient_data.ageYears : 0
        if (patient_data != undefined && patient_data.pm_gender == 'Male') {
            const calBMR = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            bmr = weight && height ? isFinite(calBMR) ? calBMR.toFixed(2) : '' : '';
        } else {
            const calBMR = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            bmr = weight && height ? isFinite(calBMR) ? calBMR.toFixed(2) : '' : '';
        }

        const calBSA = Math.sqrt(height * weight / 3600);
        bsa = weight && height ? isFinite(calBSA) ? calBSA.toFixed(2) : '' : '';

        return { bmi: bmi, bmr: bmr, bsa: bsa }
    }

    const onChangeInput = useCallback(
        (value, i, flag) => {
            const updateValue = onlyDecimalFormat(value);
            if (flag === 1) {
                vitalsData[i].temp = updateValue;
            } else if (flag === 2) {
                vitalsData[i].pres = updateValue;
            } else if (flag === 3) {
                vitalsData[i].resp_rate = updateValue;
            } else if (flag === 4) {
                vitalsData[i].systolic = updateValue;
            } else if (flag === 5) {
                vitalsData[i].diastolic = updateValue;
            } else if (flag === 6) {
                vitalsData[i].spo2 = updateValue;
            } else if (flag === 7) {
                vitalsData[i].height = updateValue;
                let cal = calculate(updateValue, vitalsData[i].weight);
                vitalsData[i].bmi = cal.bmi;
                vitalsData[i].bmr = cal.bmr;
                vitalsData[i].bsa = cal.bsa;
            } else if (flag === 8) {
                vitalsData[i].weight = updateValue;
                let cal = calculate(vitalsData[i].height, updateValue);
                vitalsData[i].bmi = cal.bmi;
                vitalsData[i].bmr = cal.bmr;
                vitalsData[i].bsa = cal.bsa;
            }
            setVitalsData((prev) => [...prev]);
        },
        [vitalsData]
    );

    const onAddUpdateClicked = async () => {
        var sendData = {
            patient_unique_id: patient_data != undefined ? patient_data.patient_unique_id : 0,
            pm_pid: patient_data != undefined ? patient_data.pm_pid : 0,
            pm_id: patient_data != undefined ? patient_data.pm_id : 0,
            pam_id: patient_data != undefined && patient_data.pam_id != undefined ? patient_data.pam_id : 0,
            data: vitalsData,
        };
        const action = await dispatch(addUpdateVitals(sendData));
        if (action.meta.requestStatus == "fulfilled") {
            handleCollapsed(1)
        } else {
            messageApi.open({
                MESSAGE_KEY,
                type: 'warning',
                content: action.error.message,
                duration: 2
            });
        }
    }

    const TABLE_VITALS = useMemo(() => {
        return (
            vitalsData.length > 0 &&
            vitalsData.map((item, i) => {
                return (
                    <div key={i} className='vitals-wrap-body w-100 vitals-child-width'>
                        <div className='vitals-head rounded-start-0 w-100'>{item.date}</div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' inputMode="numeric" value={item.temp} addonAfter={'Frh'} onChange={(e) => onChangeInput(e.target.value, i, 1)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' inputMode="numeric" value={item.pres} addonAfter={'/min'} onChange={(e) => onChangeInput(e.target.value, i, 2)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' inputMode="numeric" value={item.resp_rate} addonAfter={'/min'} onChange={(e) => onChangeInput(e.target.value, i, 3)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' inputMode="numeric" value={item.systolic} addonAfter={'mmHg'} onChange={(e) => onChangeInput(e.target.value, i, 4)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' inputMode="numeric" value={item.diastolic} addonAfter={'mmHg'} onChange={(e) => onChangeInput(e.target.value, i, 5)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' inputMode="numeric" value={item.spo2} addonAfter={'%'} onChange={(e) => onChangeInput(e.target.value, i, 6)} />
                        </div>
                        <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
                            <Input className='inputheight41-group' inputMode="numeric" value={item.height} addonAfter={'cms'} onChange={(e) => onChangeInput(e.target.value, i, 7)} />
                        </div>
                        <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
                            <Input className='inputheight41-group' inputMode="numeric" value={item.weight} addonAfter={'kgs'} onChange={(e) => onChangeInput(e.target.value, i, 8)} />
                        </div>
                        <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                            <div className='fs-14 '>{`${item.bmi != '' ? item.bmi : '--'} kg/m²`}</div>
                        </div>
                        <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                            <div className='fs-14'>{`${item.bmr != '' ? item.bmr : '--'} kcals`}</div>
                        </div>
                        <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                            <div className='fs-14'>{`${item.bsa != '' ? item.bsa : '--'} m²`}</div>
                        </div>
                    </div>
                );
            })
        );
    }, [vitalsData]);

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().endOf("day");
    };

    return (
        <>
            {contextHolder}
            <Card bordered={false} className="search-modalCard ">
                <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                    <div className='align-items-center d-flex'>
                        <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerVital}>
                            <i className='icon-Cross fs-3'></i>
                        </Button>
                        <div className="modal-title">Vitals</div>
                    </div>
                    <Button onClick={onAddUpdateClicked} className='btn btn-primary3 btn-41 px-4 me-20' loading={loading} disabled={vitalsData.length > 0 ? false : true}>
                        Done
                    </Button>
                </div>
                <div className="align-items-center d-flex justify-content-between px-20 py-3">
                    <div className="position-relative">
                        <Button className='btn btn-primary2 btn-41'>
                            Add New Date
                        </Button>
                        <DatePicker suffixIcon={null} inputReadOnly onChange={onChange} disabledDate={disabledDate} className="calender-vitals w-100 h-100" />
                    </div>
                    {/* <div className="float-end d-flex align-itms-center">
                        <i className="icon-setting me-2"></i>
                        <span className="text-decoration-underline fw-medium"> Add or Configure </span>
                    </div> */}
                </div>
                {vitalsData.length > 0 && (
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
                                    BMI
                                    <Tooltip placement="right" title="Body mass index will be auto-calculated by entering Height and Weight">
                                        <i className='icon-info ms-1'></i>
                                    </Tooltip>
                                </div>
                                <div className='vitals-row vitals-row-40 d-flex align-items-center'>
                                    BMR
                                    <Tooltip placement="right" title="basal metabolic rate will be auto-calculated by entering Height and Weight">
                                        <i className='icon-info ms-1'></i>
                                    </Tooltip>
                                </div>
                                <div className='vitals-row vitals-row-40 d-flex align-items-center'>
                                    BSA
                                    <Tooltip placement="right" title="Body Surface Area will be auto-calculated by entering Height and Weight">
                                        <i className='icon-info ms-1'></i>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className='d-flex overflow-x-auto scrollvitals w-100'>
                                {TABLE_VITALS}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
}


export default React.memo(VitalsBox);
