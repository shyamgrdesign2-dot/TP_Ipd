import React, { useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Col, Row } from "react-bootstrap";
import { Form, Tabs, Button, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import moment from "moment";

import { MESSAGE_KEY } from "../utils/constants";

import TabHeader from "../components/tab_design/TabHeader";
import PersonalDetails from "../components/PersonalDetails";
import AddressDetails from "../components/AddressDetails";
import UploadProfile from "../components/UploadProfile";
import { viewPatient, addPatient, editPatient } from "../redux/appointmentsSlice";

const dateFormat = 'YYYY-MM-DD'

const ADD = 'ADD'
const EDIT = 'EDIT'
const { TabPane } = Tabs;

function PatientForm({ mode = ADD, patient_data }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.records);

    const [form] = Form.useForm();

    useEffect(() => {
        const getEditData = async () => {
            var sendData = {
                patient_unique_id: patient_data.patient_unique_id
            };
            const action = await dispatch(viewPatient(sendData));
            if (action.meta.requestStatus == "fulfilled") {
                const data = action.payload
                form.setFieldsValue({
                    pm_fullname: data.pm_fullname,
                    pm_salutation: data.pm_salutation,
                    pm_contact_no: data.pm_contact_no,
                    pm_gender: `${data.pm_gender.charAt(0).toUpperCase()}${data.pm_gender.slice(1)}`,
                    pm_dob: dayjs(moment(data.pm_dob).format(dateFormat), dateFormat),
                    dobYearsMonths: moment(data.pm_dob).format(dateFormat),
                    pm_pincode: data.pm_pincode,
                    pm_city: data.pm_city,
                    pm_state: data.pm_state,
                    pm_address: data.pm_address,
                });
            }
        }
        mode === EDIT && getEditData()
    }, []);

    const onFinish = () => {
        form.validateFields().then(async (values) => {
            const finalValues = {
                ...values,
                pm_salutation: values.pm_salutation != undefined ? values.pm_salutation : '',
                pm_dob: values['pm_dob'].format('YYYY-MM-DD'),
                pm_pincode: values.pm_pincode != undefined ? values.pm_pincode : '',
                pm_city: values.pm_city != undefined ? values.pm_city : '',
                pm_state: values.pm_state != undefined ? values.pm_state : '',
                pm_address: values.pm_address != undefined ? values.pm_address : '',
            };
            if (mode === EDIT) {
                finalValues['patient_unique_id'] = patient_data.patient_unique_id
            }
            const action = mode === EDIT ? await dispatch(editPatient(finalValues)) : await dispatch(addPatient(finalValues));
            if (action.meta.requestStatus == "fulfilled") {
                mode === EDIT ? navigate("/patient_details", { replace: true, state: { patient_data: action.payload } }) : navigate("/prescription", { replace: true, state: { patient_data: action.payload } })
            } else {
                message.open({
                    MESSAGE_KEY,
                    type: 'warning',
                    content: action.error.message,
                    duration: 2
                });
            }
        }).catch(info => {
            console.log('info', info)
        });
    };

    return (
        <>
            {isMobile && (
                <TabHeader
                    flag={2}
                    mode={mode}
                    title={mode === EDIT ? "Edit Patient Details" : "Add New Patient"}
                    loading={loading}
                    onClick={onFinish} />
            )}
            <Form
                form={form}
                layout="vertical"
                className="form_addnewpatient">
                <div className={isMobile ? "" : "border rounded-4 appointment-wrap"}>
                    <div className={isMobile ? "p-30 pt-0" : "p-30"}>
                        <Row className="justify-content-between">
                            <Col lg={8} md={12}>
                                {isMobile ? (
                                    <div className="tabs-patient">
                                        <Tabs defaultActiveKey="1">
                                            <TabPane tab="Personal Details" key="1">
                                                <PersonalDetails form={form} />
                                            </TabPane>
                                            <TabPane tab="Address Details" key="2">
                                                <AddressDetails form={form} />
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                ) : (
                                    <>
                                        <PersonalDetails form={form} mode={mode} />
                                        <hr className="mb-3 mt-1" />
                                        <AddressDetails form={form} />
                                    </>
                                )}
                            </Col>
                            <Col lg={"auto"} md={12} className="mt-5">
                                <UploadProfile form={form} />
                            </Col>
                        </Row>
                    </div>
                    {!isMobile && (
                        <>
                            <hr className="my-0" />
                            <div className="text-end p-20">
                                <button type="button" className="btn btn-text text-decoration-underline me-3" onClick={() => navigate(-2)}>
                                    Cancel
                                </button>
                                <Button
                                    className='btn btn-primary3 me-30 btn-41 px-4'
                                    onClick={onFinish}
                                    loading={loading}>
                                    {mode === EDIT ? 'Save' : 'Add Patient to Consult'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Form>
        </>
    );
}
export default React.memo(PatientForm);
