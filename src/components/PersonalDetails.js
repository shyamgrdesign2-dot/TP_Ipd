import React from 'react';
import { Button, Form, Input, Select } from 'antd';

function PersonalDetails() {
    const [form] = Form.useForm();
    const { Option } = Select;
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div className="d-flex justify-content-between">
                <div className='title'>Address Details</div>
                <Button className='border-0 shadow-none'>
                    <div className='title align-items-center d-flex'> <i className='icon-Add me-2'></i> Add Details</div>
                </Button>
            </div>

            <Form name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" layout="inline">
                <Form.Item label="Salutation" name="fullname" rules={[{ required: true, message: false }]}>
                    <Select style={{ width: 100}} placeholder="Mr.">
                        <Option value="mr">Mr.</Option>
                        <Option value="mrs">Mrs.</Option>
                        <Option value="mss">Mss.</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Full Name" name="fullname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your full Name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default React.memo(PersonalDetails)