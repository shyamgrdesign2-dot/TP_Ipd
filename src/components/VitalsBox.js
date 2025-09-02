import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from "react";
import { Button, Card, DatePicker, Input, Tooltip } from 'antd';
import dayjs from "dayjs";

import { useSelector, useDispatch } from "react-redux";
// import { v4 as uuidv4 } from 'uuid';
import { errorMessage, getClinicName, onlyDecimalFormat } from "../utils/utils";

import CashManagerContext from '../context/CashManagerContext';

import {
    addUpdateVitals,
    getPatientBirthWeight,
    getVitals,
} from "../redux/vitalsSlice";
import moment from "moment";
import { PAEDIATRICS } from "../utils/constants";
import { useFeatureIsOn } from "@growthbook/growthbook-react";

const dateFormat = 'YYYY-MM-DD'
const showDateFormat = 'DD MMM, YY'

function VitalsBox(props) {

    const scrollContainerRef = useRef(null);
    const inputRef = useRef([]);

    const { handleDrawerVital, handleCollapsed } = props

    const {
      selectedVitalsList,
      loading,
      patientBirthWeight: storedPatientBirthWeight,
    } = useSelector((state) => state.vitals);
    const dispatch = useDispatch();

    const { patient_data, vitalsData, setVitalsData } = useContext(CashManagerContext);
    const [childVitalsData, setChildVitalsData] = useState([]);
    const [dateString, setDateString] = useState(null);
    const [patientBirthWeight, setPatientBirthWeight] = useState(
      vitalsData?.[0]?.patient_birth_weight || storedPatientBirthWeight
    );
    const { measurements } = useSelector((state) => state.growthChart);
    const isGowthChartAccessableFromGB = useFeatureIsOn(
      "growth-chart-new-design"
    );

    const { profile, userId } = useSelector((state) => state.doctors);

    useEffect(() => {
        if (selectedVitalsList.length > 0) {
            const updatedData = selectedVitalsList.map((e, i) => {
                return { ...e, systolic: e.blood_press ? e.blood_press.split('/')[0] : '', diastolic: e.blood_press ? e.blood_press.split('/')[1] : '' };
            });
            setVitalsData(updatedData);
        } else if(measurements.length) {
            let cal = calculate('', '');
            setVitalsData(measurements.map(m => ({
                date: m.date,
                height: m.height || "",
                weight: m.weight || "", 
                ofc: m.ofc || "",
                bmi: m.bmi || cal.bmi,
                dev_unique_id: 0,
                tcv_id: 0,
                tcbc_id: 0,
                temp: '',
                pres: '',
                resp_rate: '',
                systolic: '',
                diastolic: '',
                spo2: '',
                bmr: cal.bmr,
                bsa: cal.bsa,
                general_rbs: m.general_rbs,
                fib4: '',
                waist_circumference: ''
            })));
        }
    }, [selectedVitalsList, measurements]);

    useEffect(() => {
        setChildVitalsData([...vitalsData])
    }, [vitalsData]);

    useEffect(() => {
        if (childVitalsData.length === 0) {
            let cal = calculate('', '');
            childVitalsData.push({
                date: moment().format(dateFormat),
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
                fib4: '',
                waist_circumference: '',
                ofc: '',
                bmi: cal.bmi,
                bmr: cal.bmr,
                bsa: cal.bsa,
                general_rbs: ''

            });
            setChildVitalsData((prev) => [...prev]);
        }
    }, [childVitalsData]);

    const onChange = useCallback(
        (date, dateString) => {
            let cal = calculate('', '');
            const growthChartData = measurements?.find((m) => m.date === dateString);
            const { height, weight, bmi, ofc } = growthChartData || {};
            const tempVitals = [...childVitalsData];
            setDateString(dateString);
            tempVitals.push(
                {
                date: dateString,
                height: height || "",
                weight: weight || "",
                ofc: ofc || "",
                bmi: bmi || cal.bmi,
                dev_unique_id: 0,
                tcv_id: 0,
                tcbc_id: 0,
                temp: "",
                pres: "",
                resp_rate: "",
                systolic: "",
                diastolic: "",
                spo2: "",
                bmr: cal.bmr,
                bsa: cal.bsa,
                general_rbs: '',
                fib4: "",
                waist_circumference: ""
                },
            );
            setChildVitalsData([...tempVitals]);
        },
        [childVitalsData]
    );

    useEffect(() => {
        if (scrollContainerRef.current) {
            // const scrollWidth = scrollContainerRef.current.scrollWidth;
            // scrollContainerRef.current.scrollLeft = scrollWidth;
            const data = childVitalsData.sort((a, b) => new Date(b.date) - new Date(a.date))
            const index = data.findLastIndex(e => e.date == dateString)
            if (index !== -1) {
                inputRef.current[index].focus()
                const scrollWidth = index;
                scrollContainerRef.current.scrollLeft = scrollWidth * 180;
            }
        }
    }, [childVitalsData.length])

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

        var age = patient_data !== undefined && patient_data.ageYears !== undefined ? patient_data.ageYears : 0
        if (patient_data !== undefined && patient_data.pm_gender == 'Male') {
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
                childVitalsData[i].temp = updateValue;
            } else if (flag === 2) {
                childVitalsData[i].pres = updateValue;
            } else if (flag === 3) {
                childVitalsData[i].resp_rate = updateValue;
            } else if (flag === 4) {
                childVitalsData[i].systolic = updateValue;
            } else if (flag === 5) {
                childVitalsData[i].diastolic = updateValue;
            } else if (flag === 6) {
                childVitalsData[i].spo2 = updateValue;
            } else if (flag === 7) {
                childVitalsData[i].height = updateValue;
                let cal = calculate(updateValue, childVitalsData[i].weight);
                childVitalsData[i].bmi = cal.bmi;
                childVitalsData[i].bmr = cal.bmr;
                childVitalsData[i].bsa = cal.bsa;
            } else if (flag === 8) {
                childVitalsData[i].weight = updateValue;
                let cal = calculate(childVitalsData[i].height, updateValue);
                childVitalsData[i].bmi = cal.bmi;
                childVitalsData[i].bmr = cal.bmr;
                childVitalsData[i].bsa = cal.bsa;
            } else if (flag === 9) {
                childVitalsData[i].ofc = updateValue;
            } else if (flag === 10) {
                childVitalsData[i].general_rbs = updateValue;
            }else if (flag === 11) {
                childVitalsData[i].fib4 = updateValue;
            }else if (flag === 12) {
                childVitalsData[i].waist_circumference= updateValue;
            }
            setChildVitalsData((prev) => [...prev]);
        },
        [childVitalsData]
    );

    const onAddUpdateClicked = async () => {
        const clinic_name = getClinicName(profile?.hospital_data);
        window.Moengage.track_event("TP_vitals_updated", {
            clinic_name,
            "patient_number": patient_data?.pm_contact_no,
            "patient_id": patient_data?.patient_unique_id
        });
        var sendData = {
            patient_unique_id: patient_data !== undefined ? patient_data.patient_unique_id : 0,
            pm_pid: patient_data !== undefined ? patient_data.pm_pid : 0,
            pm_id: patient_data !== undefined ? patient_data.pm_id : 0,
            pam_id: patient_data !== undefined && patient_data.pam_id !== undefined ? patient_data.pam_id : 0,
            patient_birth_weight: patientBirthWeight,
            data: childVitalsData,
        };
        const action = await dispatch(addUpdateVitals(sendData));
        if (profile?.dp_name === PAEDIATRICS && patient_data?.ageMonths <= 12 && patient_data?.ageYears === 0) {
          dispatch(
            getPatientBirthWeight({
              patient_unique_id:
                patient_data !== undefined ? patient_data.patient_unique_id : 0,
              pam_id:
                patient_data !== undefined && patient_data.pam_id !== undefined
                  ? patient_data.pam_id
                  : 0,
            })
          );
        }
        if (action.meta.requestStatus === "fulfilled") {
            handleCollapsed(1)
        } else {
            errorMessage(action.error)
        }
    }

    const TABLE_VITALS = useMemo(() => {
        return (
            childVitalsData.length > 0 &&
            childVitalsData.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, i) => {
                return (
                    <div key={i} className='vitals-wrap-body w-100 vitals-child-width'>
                        <div className='vitals-head rounded-start-0 w-100'>{moment(item.date).format(showDateFormat)}</div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input ref={(el) => (inputRef.current[i] = el)} className='inputheight41-group focused' placeholder="Enter" inputMode="numeric" value={item.temp} addonAfter={'Frh'} onChange={(e) => onChangeInput(e.target.value, i, 1)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.pres} addonAfter={'/min'} onChange={(e) => onChangeInput(e.target.value, i, 2)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.resp_rate} addonAfter={'/min'} onChange={(e) => onChangeInput(e.target.value, i, 3)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.systolic} addonAfter={'mmHg'} onChange={(e) => onChangeInput(e.target.value, i, 4)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.diastolic} addonAfter={'mmHg'} onChange={(e) => onChangeInput(e.target.value, i, 5)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.spo2} addonAfter={'%'} onChange={(e) => onChangeInput(e.target.value, i, 6)} />
                        </div>
                        <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.general_rbs} addonAfter={'mg/dl'} onChange={(e) => onChangeInput(e.target.value, i, 10)} />
                        </div>
                        {profile?.dp_name === PAEDIATRICS || isGowthChartAccessableFromGB ? <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.ofc} addonAfter={'cms'} onChange={(e) => onChangeInput(e.target.value, i, 9)} />
                        </div> : null}
                        <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.height} addonAfter={'cms'} onChange={(e) => onChangeInput(e.target.value, i, 7)} />
                        </div>
                        <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.weight} addonAfter={'kgs'} onChange={(e) => onChangeInput(e.target.value, i, 8)} />
                        </div>
                        <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.fib4}  addonAfter={''} onChange={(e) => onChangeInput(e.target.value, i, 11)} />
                        </div>
                        <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
                            <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.waist_circumference} addonAfter={'cm'} onChange={(e) => onChangeInput(e.target.value, i, 12)} />
                        </div>
                        <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                            <div className='fs-14 '>{`${item.bmi != '' ? parseFloat(item.bmi).toFixed(2) : '--'} kg/m²`}</div>
                        </div>
                        <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                            <div className='fs-14'>{`${item.bmr != '' ? parseFloat(item.bmr).toFixed(2) : '--'} kcals`}</div>
                        </div>
                        <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
                            <div className='fs-14'>{`${item.bsa != '' ? parseFloat(item.bsa).toFixed(2) : '--'} m²`}</div>
                        </div>
                    </div>
                );
            })
        );
    }, [childVitalsData]);

    const disabledDate = (current) => {
        // Can not select days before today and today
        // return current && current > dayjs().endOf("day");
        return current && current >= moment().add(1, 'days').startOf('day');
    };

    return (
        <>
            <Card bordered={false} className="search-modalCard ">
                <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'
                    style={{
                        position: "sticky",
                        top: "0px",
                        zIndex: 2,
                    }}>
                    <div className='align-items-center d-flex'>
                        <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100' onClick={handleDrawerVital}>
                            <i className='icon-Cross fs-3'></i>
                        </Button>
                        <div className="modal-title">Vitals</div>
                    </div>
                    <Button onClick={onAddUpdateClicked} className='btn btn-primary3 btn-41 px-4 me-20' loading={loading} disabled={childVitalsData.length > 0 ? false : true}>
                        Done
                    </Button>
                </div>
                <div className="align-items-center d-flex justify-content-between px-20 py-3">
                    {profile?.dp_name === PAEDIATRICS && patient_data?.ageMonths <= 12 && patient_data?.ageYears === 0 ? (
                        <div className="vitals-wrapper">
                            <div className='vitals-row d-flex align-items-center px-2'>
                                Patient’s birth weight
                            </div>
                            <div className='vitals-row d-flex align-items-center px-2'>
                                <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" maxLength={5} value={patientBirthWeight} addonAfter={'kgs'} onChange={(e) => setPatientBirthWeight(onlyDecimalFormat(e.target.value))} />
                            </div>
                        </div>
                    ) : null}
                    <div className="position-relative">
                        <Button className='btn btn-primary2 btn-41'>
                            Add New Date
                        </Button>
                        <DatePicker key={Math.random()} suffixIcon={null} inputReadOnly onChange={onChange} disabledDate={disabledDate} className="calender-vitals w-100 h-100" />
                    </div>
                        {/* <div className="float-end d-flex align-itms-center">
                            <i className="icon-setting me-2"></i>
                            <span className="text-decoration-underline fw-medium"> Add or Configure </span>
                        </div> */}
                </div>
                {childVitalsData.length > 0 && (
                    <div className='px-20'>
                        <div className='vitals-wrapper w-100'>
                            <div className='vitals-wrap-body vitals-parent-width'>
                                <div className='vitals-head'>Name</div>
                                <div className='vitals-row d-flex align-items-center border-bottom px-2'>
                                    Temperature
                                </div>
                                <div className='vitals-row d-flex align-items-center border-bottom px-2'>
                                    Pulse
                                </div>
                                <div className='vitals-row d-flex align-items-center border-bottom px-2'>
                                    Resp. Rate
                                </div>
                                <div className='vitals-row d-flex align-items-center border-bottom px-2'>
                                    Systolic
                                </div>
                                <div className='vitals-row d-flex align-items-center border-bottom px-2'>
                                    Diastolic
                                </div>
                                <div className='vitals-row d-flex align-items-center border-bottom px-2'>
                                    SPO2
                                </div>
                                <div className='vitals-row d-flex align-items-center border-bottom px-2'>
                                    General RBS
                                </div>
                                {profile?.dp_name === PAEDIATRICS || isGowthChartAccessableFromGB? <div className='vitals-row d-flex align-items-center border-bottom px-2'>
                                    OFC
                                </div> : null}
                                <div className='vitals-row vitals-row-60 d-flex align-items-center px-2'>
                                    Height
                                </div>
                                <div className='vitals-row vitals-row-60 d-flex align-items-center px-2'>
                                    Weight
                                </div>
                                 <div className='vitals-row vitals-row-60 d-flex align-items-center px-2'>
                                    FIB4
                                </div>
                                 <div className='vitals-row vitals-row-60 d-flex align-items-center px-2'>
                                    Waist Circumference
                                </div>
                                <div className='vitals-row vitals-row-40 d-flex align-items-center px-2'>
                                    BMI
                                    <Tooltip placement="right" title="Body mass index will be auto-calculated by entering Height and Weight">
                                        <i className='icon-info ms-1'></i>
                                    </Tooltip>
                                </div>
                                <div className='vitals-row vitals-row-40 d-flex align-items-center px-2'>
                                    BMR
                                    <Tooltip placement="right" title="Basal metabolic rate will be auto-calculated by entering Height and Weight">
                                        <i className='icon-info ms-1'></i>
                                    </Tooltip>
                                </div>
                                <div className='vitals-row vitals-row-40 d-flex align-items-center px-2'>
                                    BSA
                                    <Tooltip placement="right" title="Body surface area will be auto-calculated by entering Height and Weight">
                                        <i className='icon-info ms-1'></i>
                                    </Tooltip>
                                </div>
                            </div>
                            <div ref={scrollContainerRef} className='d-flex overflow-x-auto scrollvitals w-100'>
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