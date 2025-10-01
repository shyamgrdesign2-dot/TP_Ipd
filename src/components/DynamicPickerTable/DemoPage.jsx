import React from 'react';
import { Card, Typography, Divider } from 'antd';
import MedicationPickerExample from './MedicationPickerExample';

const { Title, Paragraph } = Typography;

const DemoPage = () => {
  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Card>
          <Title level={1}>Dynamic Picker Table Demo</Title>
          <Paragraph>
            This page demonstrates the DynamicPickerTable component with a medication management example.
            The table supports drag-and-drop reordering, dynamic columns, search functionality, and imperative API methods.
          </Paragraph>
          
          <Divider />
          
          <MedicationPickerExample />
        </Card>
      </div>
    </div>
  );
};

export default DemoPage;
