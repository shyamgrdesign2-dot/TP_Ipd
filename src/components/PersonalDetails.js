import React, { useEffect, useState } from "react";

import { Form, Input, Button, Select, DatePicker, Radio, Row, Col, InputNumber } from "antd";
import {
    calculateAge,
    getFormattedDate,
} from "../utils/utils";
import dayjs from "dayjs";
import moment from "moment";
import { isMobile } from "react-device-detect";

import { removeBeforeWhiteSpace } from "../utils/utils"

import { useDispatch, useSelector } from "react-redux";
import { listSalutation } from "../redux/appointmentsSlice";

const { Option } = Select;

function PersonalDetails({ form }) {

    const [showDetails, setShowDetails] = useState(true);
    const [ageYearsMonths, setAgeYearsMonths] = useState(null);
    const [birthDate, setBirthDate] = useState(null);

    const dispatch = useDispatch();
    const { salutationData, loading } = useSelector((state) => state.records);

    useEffect(() => {
        dispatch(listSalutation());
    }, []);

    const validateMobileNumber = (_, value) => {
        const mobileNumberRegex = /^[0-9]{10}$/; // 10-digit number validation regex
        if (!value || !mobileNumberRegex.test(value)) {
            return Promise.reject('Please enter a valid 10-digit mobile number');
        }
        return Promise.resolve();
    };

    const validateFullName = (_, value) => {
        const updateQuery = removeBeforeWhiteSpace(value);
        form.setFieldsValue({
            pm_fullname: updateQuery,
        });
        return Promise.resolve();
    };

    // Form Rules
    const rules = {
        fullname: [
            // {
            //     required: true,
            //     message: <div className="align-items-center d-flex"><i className="icon-info me-2 fs-18"></i> Please enter full name</div>,
            // },
            { validator: validateFullName,message: <div className="align-items-center d-flex"><i className="icon-info me-2 fs-18"></i> Please enter full name</div> },
        ],
        mobile_no: [
            // {
            //     required: true,
            //     message: <div className="align-items-center d-flex"><i className="icon-info me-2 fs-18"></i> Enter a valid mobile number</div>,
            // },
            { validator: validateMobileNumber, message: <div className="align-items-center d-flex"><i className="icon-info me-2 fs-18"></i> Enter a valid 10-digit mobile number</div> },
        ],
        gender: [
            {
                required: true,
                message: <div className="align-items-center d-flex"><i className="icon-info me-2 fs-18"></i> Please select gender</div>,
            },
        ],
        dobYearsMonths: [
            {
                required: true,
                message: <div className="align-items-center d-flex"><i className="icon-info me-2 fs-18"></i> Please fill age in years & months</div>,
            },
        ],
    };



    const onBirthDateChanged = (date, dateString) => {
        if (dateString) {
            setBirthDate(dateString);
            // const remaingDate = moment(dateString).add(1, 'day').format('YYYY-MM-DD')
            const age = calculateAge(getFormattedDate(dateString));
            form.setFieldsValue({
                dobYearsMonths: age.years,
            });
            setAgeYearsMonths(age);
        }
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().endOf("day");
    };

    useEffect(() => {
        if (ageYearsMonths) {
            const newDate = new Date();
            newDate.setFullYear(
                newDate.getFullYear() - parseInt(
                    ageYearsMonths.hasOwnProperty("years")
                        ? ageYearsMonths.years != ""
                            ? ageYearsMonths.years
                            : 0
                        : 0
                ));
            newDate.setMonth(
                newDate.getMonth() - parseInt(
                    ageYearsMonths.hasOwnProperty("months")
                        ? ageYearsMonths.months != ""
                            ? ageYearsMonths.months
                            : 0
                        : 0
                ));
            newDate.setDate(newDate.getDate() - parseInt(
                ageYearsMonths.hasOwnProperty("days")
                    ? ageYearsMonths.days != ""
                        ? ageYearsMonths.days
                        : 0
                    : 0
            ));

            setBirthDate(newDate);
            form.setFieldsValue({
                pm_dob: dayjs(getFormattedDate(newDate), "YYYY-MM-DD"),
            });
        }
    }, [ageYearsMonths]);

    return (
        <div>
            {!isMobile && (
                <div className="d-flex justify-content-between">
                    <div className="title">Personal Details</div>
                    <Button
                        className="border-0 shadow-none"
                        onClick={() => setShowDetails(!showDetails)}>
                        <div className="title align-items-center d-flex">
                            <i className={`${showDetails ? 'icon-minus' : 'icon-Add'} me-2`} /> {showDetails ? 'Show Less' : 'Add Details'}
                        </div>
                    </Button>
                </div>
            )}
            {showDetails && (
                <>
                    <Row gutter={{ xs: 8, sm: 18, md: 24, lg: 30 }}>
                        <Col xs={8} sm={8} md={6} lg={4}>
                            <Form.Item name="pm_salutation" label="Salutation">
                                <Select placeholder="Select">
                                    {
                                        salutationData.map(elm => (
                                            <Option key={elm.ts_id} value={elm.ts_name}>{elm.ts_name}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={16} sm={16} md={18} lg={20}>
                            <Form.Item
                                name="pm_fullname"
                                label="Full Name"
                                rules={rules.fullname}>
                                <Input placeholder="Full Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 18, md: 40, lg: 94 }}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                name="pm_contact_no"
                                label="Mobile Number"
                                rules={rules.mobile_no}>
                                <Input placeholder="Enter 10 Digit Number" type="number" inputMode="numeric" maxLength={10} minLength={10} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="pm_gender" label="Gender" rules={rules.gender}>
                                <Radio.Group className="d-flex gender-radio">
                                    <Radio.Button className="w-100 text-center" value="Male">Male</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Female">Female</Radio.Button>
                                    <Radio.Button className="w-100 text-center" value="Other">Other</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="align-items-center" gutter={{ xs: 0, sm: 0, lg: 0 }}>
                        <Col xs={24} sm={24} md={11} lg={11}>
                            <Form.Item
                                name="dobYearsMonths"
                                label="Age In Years & Months"
                                rules={rules.dobYearsMonths}
                            >
                                <div className="justify-content-between d-flex">
                                    <Input
                                        className="w-48"
                                        type="number"
                                        placeholder="Years"
                                        value={ageYearsMonths?.years}
                                        onChange={(e) => {
                                            setAgeYearsMonths({
                                                ...ageYearsMonths,
                                                years: Math.abs(e.target.value),
                                            });
                                        }}
                                    />
                                    <Input
                                        className="w-48"
                                        type="number"
                                        placeholder="Months"
                                        maxLength={2}
                                        value={ageYearsMonths?.months}
                                        onChange={(e) => {
                                            setAgeYearsMonths({
                                                ...ageYearsMonths,
                                                months: Math.abs(e.target.value),
                                            });
                                        }}
                                    />
                                </div>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2}>
                            <div className="or text-center mt-2">OR</div>
                        </Col>
                        <Col xs={24} sm={24} md={11} lg={11}>
                            <Form.Item name="pm_dob" label="Date of Birth">
                                <DatePicker
                                    className="w-100"
                                    inputReadOnly
                                    placeholder="YYYY-MM-DD"
                                    onChange={onBirthDateChanged}
                                    disabledDate={disabledDate}
                                    value={
                                        birthDate
                                            ? dayjs(getFormattedDate(birthDate), "YYYY-MM-DD")
                                            : null
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default React.memo(PersonalDetails);
