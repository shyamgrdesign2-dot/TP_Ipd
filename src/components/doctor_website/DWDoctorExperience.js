import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Button, Collapse, Form, Input, Row, Col, Select, Checkbox } from 'antd';
import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';
import moment from 'moment';

function DWDoctorExperience() {

    const { doctorExperience, setDoctorExperience } = useContext(DoctorWebsiteSettingsContext);

    const monthList = [
        {
            value: '1',
            label: 'Jan',
        },
        {
            value: '2',
            label: 'Feb',
        },
        {
            value: '3',
            label: 'Mar',
        },
        {
            value: '4',
            label: 'Apr',
        },
        {
            value: '5',
            label: 'May',
        },
        {
            value: '6',
            label: 'Jun',
        },
        {
            value: '7',
            label: 'Jul',
        },
        {
            value: '8',
            label: 'Aug',
        },
        {
            value: '9',
            label: 'Sept',
        },
        {
            value: '10',
            label: 'Oct',
        },
        {
            value: '11',
            label: 'Nov',
        },
        {
            value: '12',
            label: 'Dec',
        }
    ]

    const onChangeInput = useCallback(
        (e, key, i) => {
            doctorExperience[i][key] = e.target.value;
            setDoctorExperience((prev) => { return [...prev] });
        },
        [doctorExperience]
    );

    const onSwitchChange = useCallback(
        (e, key, i) => {
            doctorExperience[i][key] = e.target.checked ? 1 : 0;
            setDoctorExperience((prev) => { return [...prev] });
        },
        [doctorExperience]
    );

    const yearsFromToCurrent = (value) => {
        const startYear = parseInt(value);
        const currentYear = moment().year();
        return Array.from({ length: currentYear - startYear + 1 }, (v, i) => ({
            value: `${startYear + i}`,
            label: `${startYear + i}`,
        }));
    }

    const onSelect = useCallback(
        (e, key, i) => {
            if (e == moment().year()) {
                if (key == 'start_year' && parseInt(doctorExperience[i]['start_month']) <= moment().month()) {
                    doctorExperience[i]['start_month'] = '';
                } else if (key == 'end_year' && parseInt(doctorExperience[i]['end_month']) <= moment().month()) {
                    doctorExperience[i]['end_month'] = '';
                }
            }
            doctorExperience[i][key] = e;
            setDoctorExperience((prev) => { return [...prev] });
        },
        [doctorExperience]
    );

    const accordionItems = (e, i) => [
        {
            key: '1',
            label:
                <>
                    <div className="title-common">{`Key Experience ${i + 1}`}</div>
                    <div className='fontroboto'>{'(Not Specified)'}</div>
                </>,
            children:
                <div className="rounded-20px">
                    <div className='px-20'>
                        <Form layout="vertical">
                            <Form.Item
                                label="Title"
                                className='fw-medium mb-20'
                                required>
                                <Input
                                    placeholder="e.g. Medical Director"
                                    className="text-capitalize rounded-10px h-38"
                                    value={e?.title}
                                    onChange={(e) => onChangeInput(e, 'title', i)} />
                            </Form.Item>
                            <Form.Item
                                label="Hospital"
                                className='fw-medium mb-20'
                                required>
                                <Input
                                    placeholder="e.g Medanta Hospital"
                                    className="text-capitalize rounded-10px h-38"
                                    value={e?.hospital}
                                    onChange={(e) => onChangeInput(e, 'hospital', i)} />
                            </Form.Item>
                            <Form.Item
                                label="City"
                                className='fw-medium mb-20'
                                required>
                                <Input
                                    placeholder="e.g. Mumbai"
                                    className="text-capitalize rounded-10px h-38"
                                    value={e?.city}
                                    onChange={(e) => onChangeInput(e, 'city', i)} />
                            </Form.Item>

                            <Checkbox
                                className="switch-name-check checkbold mb-3"
                                checked={e?.currently_working}
                                onChange={(e) => onSwitchChange(e, 'currently_working', i)}>I am currently working in this role</Checkbox>

                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Start Date"
                                        className='fw-medium mb-20'
                                        required>
                                        <Select
                                            showSearch
                                            optionFilterProp="label"
                                            className="autocomplete-custom"
                                            placeholder="Month"
                                            options={e?.start_year == moment().year() ? monthList.slice(monthList.findIndex(e => e.value == moment().month()), monthList.length) : monthList}
                                            allowClear
                                            value={e?.start_month ? e?.start_month : null}
                                            onSelect={(e) => onSelect(e, 'start_month', i)} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label=" "
                                        className='fw-medium mb-20'>
                                        <Select
                                            showSearch
                                            optionFilterProp="label"
                                            className="autocomplete-custom"
                                            placeholder="Year"
                                            options={yearsFromToCurrent(1990)}
                                            allowClear
                                            value={e?.start_year}
                                            onSelect={(e) => onSelect(e, 'start_year', i)} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="End Date"
                                        className='fw-medium mb-20'
                                        required>
                                        <Select
                                            showSearch
                                            optionFilterProp="label"
                                            className="autocomplete-custom"
                                            placeholder="Month"
                                            options={e?.end_year == moment().year() ? monthList.slice(monthList.findIndex(e => e.value == moment().month()), monthList.length) : monthList}
                                            allowClear
                                            value={e?.end_month ? e?.end_month : null}
                                            onSelect={(e) => onSelect(e, 'end_month', i)} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label=" "
                                        className='fw-medium mb-20'>
                                        <Select
                                            showSearch
                                            optionFilterProp="label"
                                            className="autocomplete-custom"
                                            placeholder="Year"
                                            options={yearsFromToCurrent(e?.start_year)}
                                            allowClear
                                            value={e?.end_year}
                                            onSelect={(e) => onSelect(e, 'end_year', i)} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <Button className='btn w-100 btn-delete-experience btn-41 rounded-top-0 btn-primary3' disabled><i className='icon-delete fs-18 me-2'></i>Delete Experience</Button>
                </div>,
        },
    ];

    const addDoctorExperienceClick = useCallback(
        () => {
            doctorExperience.push({
                title: '',
                hospital: '',
                city: '',
                currently_working: 0,
                start_month: '',
                start_year: '',
                end_month: '',
                end_year: ''
            })
            setDoctorExperience((prev) => { return [...prev] });
        },
        [doctorExperience]
    );

    return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto"> Your experience journey includes previous roles, locations, durations, and descriptions.</div>
                {doctorExperience?.map((e, i) => {
                    return (
                        <div key={`${Math.random()}`} className="border rounded-20px bg-white mt-3">
                            <Collapse
                                items={accordionItems(e, i)}
                                defaultActiveKey={['1']}
                                className="prescriptiontab-accordian doctor-experience"
                                expandIconPosition={'end'} />
                        </div>
                    )
                })}
                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3' onClick={addDoctorExperienceClick}><i className='icon-Add fs-18 me-2'></i>Add Experience</Button>
            </div>
        </div>
    );
}

export default DWDoctorExperience;
