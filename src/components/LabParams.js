import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from "react";
import { Button, Card, DatePicker, Input, Tooltip } from 'antd';
import dayjs from "dayjs";
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from "react-redux";
// import { v4 as uuidv4 } from 'uuid';
import { errorMessage, getClinicName, onlyDecimalFormat } from "../utils/utils";


import moment from "moment";

const dateFormat = 'YYYY-MM-DD'
const showDateFormat = 'DD MMM, YY'

const testsData = [
    {
      id: 1,
      name: 'Complete Blood Count',
      parameters: [
        { id: 'param1', title: 'Parameter 1', value: '' },
        { id: 'param2', title: 'Parameter 2', value: '' },
        { id: 'param3', title: 'Parameter 3', value: '' },
      ],
    },
    {
      id: 2,
      name: 'Kidney Funtion Test',
      parameters: [
        { id: 'param4', title: 'Parameter 4', value: '' },
        { id: 'param10', title: 'Parameter 10', value: '' },
        { id: 'param23', title: 'Parameter 23', value: '' },
      ],
    },
    // Add more tests here as needed
];

function LabParams(props) {

    const scrollContainerRef = useRef(null);
    const inputRef = useRef([]);

    const { handleDrawerVital, handleCollapsed } = props

    const [expandedTests, setExpandedTests] = useState({});
    const [tests, setTests] = useState(testsData);
  
    const toggleExpand = (testId) => {
      setExpandedTests((prev) => ({
        ...prev,
        [testId]: !prev[testId],
      }));
    };

    const handleInputChange = (testId, paramId, value) => {
        const updatedTests = tests.map((test) =>
          test.id === testId
            ? {
                ...test,
                parameters: test.parameters.map((param) =>
                  param.id === paramId ? { ...param, value } : param
                ),
              }
            : test
        );
        setTests(updatedTests);
    };

    const {
        selectedVitalsList,
        loading,
    } = useSelector((state) => state.vitals);
    const dispatch = useDispatch();

    const [dateString, setDateString] = useState(null);
    const { measurements } = useSelector((state) => state.growthChart);

    const { profile, userId } = useSelector((state) => state.doctors);

    const TestItem = ({ test, isExpanded, toggleExpand, handleInputChange }) => (
        <div className="test-item">
          <div className="test-header" onClick={() => toggleExpand(test.id)}>
            <span>{test.name}</span>
            {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
          </div>
          {isExpanded && (
            <div className="test-parameters">
              {test.parameters.map((param) => (
                <div key={param.id} className="test-parameter-row">
                  <span className="vitals-row d-flex align-items-center border-bottom px-2">{param.title}</span>
                  <Input
                    className="inputheight41-group"
                    type="text"
                    value={param.value}
                    addonAfter={'Frh'} 
                    onChange={(e) => handleInputChange(test.id, param.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
    );

    // const TABLE_VITALS = useMemo(() => {
    //     return (
    //         childVitalsData.length > 0 &&
    //         childVitalsData.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, i) => {
    //             return (
    //                 <div key={i} className='vitals-wrap-body w-100 vitals-child-width'>
    //                     <div className='vitals-head rounded-start-0 w-100'>{moment(item.date).format(showDateFormat)}</div>
    //                     <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
    //                         <Input ref={(el) => (inputRef.current[i] = el)} className='inputheight41-group focused' placeholder="Enter" inputMode="numeric" value={item.temp} addonAfter={'Frh'} onChange={(e) => onChangeInput(e.target.value, i, 1)} />
    //                     </div>
    //                     <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
    //                         <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.pres} addonAfter={'/min'} onChange={(e) => onChangeInput(e.target.value, i, 2)} />
    //                     </div>
    //                     <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
    //                         <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.resp_rate} addonAfter={'/min'} onChange={(e) => onChangeInput(e.target.value, i, 3)} />
    //                     </div>
    //                     <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
    //                         <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.systolic} addonAfter={'mmHg'} onChange={(e) => onChangeInput(e.target.value, i, 4)} />
    //                     </div>
    //                     <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
    //                         <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.diastolic} addonAfter={'mmHg'} onChange={(e) => onChangeInput(e.target.value, i, 5)} />
    //                     </div>
    //                     <div className='vitals-row d-flex align-items-center border-bottom px-2 w-100'>
    //                         <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.spo2} addonAfter={'%'} onChange={(e) => onChangeInput(e.target.value, i, 6)} />
    //                     </div>
    //                     <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
    //                         <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.height} addonAfter={'cms'} onChange={(e) => onChangeInput(e.target.value, i, 7)} />
    //                     </div>
    //                     <div className='vitals-row vitals-row-60 d-flex align-items-center px-2 w-100'>
    //                         <Input className='inputheight41-group' placeholder="Enter" inputMode="numeric" value={item.weight} addonAfter={'kgs'} onChange={(e) => onChangeInput(e.target.value, i, 8)} />
    //                     </div>
    //                     <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
    //                         <div className='fs-14 '>{`${item.bmi != '' ? parseFloat(item.bmi).toFixed(2) : '--'} kg/m²`}</div>
    //                     </div>
    //                     <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
    //                         <div className='fs-14'>{`${item.bmr != '' ? parseFloat(item.bmr).toFixed(2) : '--'} kcals`}</div>
    //                     </div>
    //                     <div className='vitals-row vitals-row-40 d-flex align-items-center px-2 w-100'>
    //                         <div className='fs-14'>{`${item.bsa != '' ? parseFloat(item.bsa).toFixed(2) : '--'} m²`}</div>
    //                     </div>
    //                 </div>
    //             );
    //         })
    //     );
    // }, [childVitalsData]);

    const disabledDate = (current) => {
        // Can not select days before today and today
        // return current && current > dayjs().endOf("day");
        return current && current >= moment().add(1, 'days').startOf('day');
    };

    return (
        <>
            <Card bordered={false} className="search-modalCard ">
                <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                    <div className='align-items-center d-flex'>
                        <Button type="text" className='btn btn-delete-prescription px-3 focus-none h-100'>
                            <i className='icon-Cross fs-3'></i>
                        </Button>
                        <div className="modal-title">Add Lab Results</div>
                    </div>
                    <Button className='btn btn-primary3 btn-41 px-4 me-20' loading={loading}>
                        Save
                    </Button>
                </div>
                <div className="align-items-center d-flex justify-content-between px-20 py-3">
                    <div className="position-relative">
                        <Button className='btn btn-primary2 btn-41'>
                            Add New Date
                        </Button>
                        <DatePicker key={Math.random()} suffixIcon={null} inputReadOnly className="calender-vitals w-100 h-100" />
                    </div>
                </div>
                <div className="lab-params-container">
                    {tests.map((test) => (
                        <TestItem
                            key={test.id}
                            test={test}
                            isExpanded={!!expandedTests[test.id]}
                            toggleExpand={toggleExpand}
                            handleInputChange={handleInputChange}
                        />
                    ))}
                </div>
                {/* {childVitalsData.length > 0 && (
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
                                <div className='vitals-row vitals-row-60 d-flex align-items-center px-2'>
                                    Height
                                </div>
                                <div className='vitals-row vitals-row-60 d-flex align-items-center px-2'>
                                    Weight
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
                )} */}
            </Card>
        </>
    );
}

export default React.memo(LabParams);