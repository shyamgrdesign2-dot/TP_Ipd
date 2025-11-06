import React from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import KeyboardAwareLayout from './KeyboardAwareLayout';

/**
 * Example of how to use KeyboardAwareLayout with your existing form
 */
const ExampleFormWithKeyboardFix = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  // Your fixed header component
  const FixedHeader = () => (
    <div style={{
      background: 'white',
      padding: '10px 20px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2>Patient Form</h2>
      <Button 
        type="primary" 
        onClick={() => form.submit()}
        style={{ minWidth: '100px' }}
      >
        Submit
      </Button>
    </div>
  );

  return (
    <KeyboardAwareLayout 
      header={<FixedHeader />}
      headerHeight={60}
      autoScrollToFocusedInput={true}
    >
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ paddingBottom: '100px' }} // Extra space at bottom
        >
          <Form.Item
            label="Patient Name"
            name="patientName"
            rules={[{ required: true, message: 'Please enter patient name' }]}
          >
            <Input 
              placeholder="Enter patient name"
              style={{ fontSize: '16px' }} // Prevents zoom on iOS
            />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Please enter age' }]}
          >
            <Input 
              type="number"
              placeholder="Enter age"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: 'Please select date of birth' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Medical History"
            name="medicalHistory"
          >
            <Input.TextArea 
              rows={4}
              placeholder="Enter medical history"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            label="Contact Number"
            name="contact"
            rules={[{ required: true, message: 'Please enter contact number' }]}
          >
            <Input 
              placeholder="Enter contact number"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input.TextArea 
              rows={3}
              placeholder="Enter address"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          {/* Add more form fields as needed */}
          
          {/* Hidden submit button for form submission */}
          <Form.Item style={{ display: 'none' }}>
            <Button type="primary" htmlType="submit">
              Hidden Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </KeyboardAwareLayout>
  );
};

export default ExampleFormWithKeyboardFix;
