import React, { useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Col, Row } from "react-bootstrap";
import { Form, Tabs, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import TabConsultationHeader from "../components/tab_design/TabConsultationHeader";
import PersonalDetails from "../components/PersonalDetails";
import AddressDetails from "../components/AddressDetails";
import UploadProfile from "../components/UploadProfile";
import { addPatient } from "../redux/appointmentsSlice";

const { TabPane } = Tabs;

function AddNewPatient() {

    const dispatch = useDispatch();

    const [form] = Form.useForm();

    const [submitLoading, setSubmitLoading] = useState(false)

    const onFinish = () => {
        setSubmitLoading(true)
        form.validateFields().then(values => {
            setTimeout(() => {
                setSubmitLoading(false)
                const finalValues = {
                    ...values,
                    pm_salutation: values.pm_salutation != undefined ? values.pm_salutation : '',
                    pm_dob: values['pm_dob'].format('YYYY-MM-DD'),
                    pm_pincode: values.pm_pincode != undefined ? values.pm_pincode : '',
                    pm_city: values.pm_city != undefined ? values.pm_city : '',
                    pm_state: values.pm_state != undefined ? values.pm_state : '',
                    pm_address: values.pm_address != undefined ? values.pm_address : '',
                };
                dispatch(addPatient(finalValues));
            }, 1500);
        }).catch(info => {
            setSubmitLoading(false)
            console.log('info', info)
        });
    };

    return (
        <>
            {isMobile && (
                <TabConsultationHeader
                    flag={2}
                    title="Add New Patient"
                    loading={submitLoading}
                    onClick={onFinish} />
            )}
            <Form
                form={form}
                layout="vertical">
                <div className={isMobile ? "" : "border rounded-4 appointment-wrap"}>
                    <div className={isMobile ? "p-30 pt-0" : "p-30"}>
                        <Row className="justify-content-between">
                            <Col lg={8} md={12}>
                                {isMobile ? (
                                    <>
                                        <Tabs defaultActiveKey="1">
                                            <TabPane tab="Personal Details" key="1">
                                                <PersonalDetails form={form} />
                                            </TabPane>
                                            <TabPane tab="Address Details" key="2">
                                                <AddressDetails form={form} />
                                            </TabPane>
                                        </Tabs>
                                    </>
                                ) : (
                                    <>
                                        <PersonalDetails form={form} />
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
                                <button className="btn btn-text text-decoration-underline me-3">
                                    Cancel
                                </button>
                                <Button
                                    className='btn btn-primary3 me-30 btn-41 px-4'
                                    onClick={onFinish}
                                    loading={submitLoading}>
                                    Add Patient to Consult
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Form>
        </>
    );
}
export default React.memo(AddNewPatient);
