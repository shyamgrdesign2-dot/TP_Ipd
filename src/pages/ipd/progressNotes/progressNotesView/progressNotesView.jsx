import React, { useState } from 'react';
import { Card, Button, Divider, Space, Typography } from 'antd';
import { RemoteComponents } from '../../../../shared/remoteComponents';

import { defaultIcons } from '../../../../assets/images/icons/index.js';
import './progressNotesView.scss';

const { Title, Text } = Typography;
const { ReusableStepper, ReusableProgressCard } = RemoteComponents;

// Dummy data for Stepper component
const stepperData = [
  {
    date: "2025-06-24",
    period: "morning",
    time: "08:12 AM",
    chiefComplaint: [
      {
        title: "Mild headache, improved appetite",
      }
    ],
    findings: [
      "Patient appears stable",
      "No acute distress",
      "Vital signs within normal limits"
    ],
    vitals: {
      bloodPressure: "122/80",
      heartRate: 78,
      temperature: 98.8,
      respiratoryRate: 18
    },
    additionalRemarks: [
      "Patient responding well to treatment",
      "Continue current medication"
    ],
    filledBy: "Dr. John Smith",
    role: "Medical Officer"
  },
  {
    date: "2025-06-24",
    period: "evening",
    time: "06:30 PM",
    chiefComplaint: [
      {
        title: "Mild headache, improved appetite",
      }
    ],
    findings: [
      "Patient resting comfortably",
      "No signs of distress",
      "Appetite improved"
    ],
    vitals: {
      bloodPressure: "118/75",
      heartRate: 72,
      temperature: 98.4,
      respiratoryRate: 16
    },
    additionalRemarks: [
      "Patient stable for discharge",
      "Follow-up appointment scheduled"
    ],
    filledBy: "Dr. Sarah Johnson",
    role: "Medical Officer"
  },
  {
    date: "2025-06-23",
    period: "morning",
    time: "09:15 AM",
    chiefComplaint: [
      {
        title: "Mild headache, improved appetite",
      }
    ],
    findings: [
      "Abdominal pain started 2 days ago, mainly in the right lower quadrant",
      "Patient appears anxious",
      "Mild pallor observed"
    ],
    vitals: {
      bloodPressure: "130/85",
      heartRate: 88,
      temperature: 99.2,
      respiratoryRate: 20
    },
    additionalRemarks: [
      "Paracetamol 500 mg (3 days, No other regular medication)",
      "Ultrasound scheduled for tomorrow"
    ],
    filledBy: "Dr. Michael Brown",
    role: "Medical Officer"
  },
  {
    date: "2025-06-23",
    period: "night",
    time: "11:45 PM",
    chiefComplaint: [
      {
        title: "Mild headache, improved appetite",
      }
    ],
    findings: [
      "Patient restless",
      "Mild abdominal tenderness",
      "No acute changes"
    ],
    vitals: {
      bloodPressure: "125/80",
      heartRate: 85,
      temperature: 98.9,
      respiratoryRate: 19
    },
    additionalRemarks: [
      "Pain medication administered",
      "Patient comfortable for the night"
    ],
    filledBy: "Dr. Emily Davis",
    role: "Medical Officer"
  },
  {
    date: "2025-06-22",
    period: "morning",
    time: "07:30 AM",
    chiefComplaint: [
      {
        title: "Mild headache, improved appetite",
      }
    ],
    findings: [
      "Patient in acute distress",
      "Diaphoretic",
      "Chest pain on palpation"
    ],
    vitals: {
      bloodPressure: "150/95",
      heartRate: 110,
      temperature: 99.5,
      respiratoryRate: 24
    },
    additionalRemarks: [
      "ECG and Troponin test ordered",
      "Possible cardiac event",
      "Admission to cardiology ward"
    ],
    filledBy: "Dr. Robert Wilson",
    role: "Medical Officer"
  },
  {
    date: "2025-06-22",
    period: "evening",
    time: "05:20 PM",
    chiefComplaint: [
      {
        title: "Mild headache, improved appetite",
      }
    ],
    findings: [
      "Patient more comfortable",
      "Pain reduced significantly",
      "Vital signs stabilizing"
    ],
    vitals: {
      bloodPressure: "140/88",
      heartRate: 95,
      temperature: 99.0,
      respiratoryRate: 22
    },
    additionalRemarks: [
      "Cardiology consultation completed",
      "Medication adjusted",
      "Continue monitoring"
    ],
    filledBy: "Dr. Lisa Anderson",
    role: "Medical Officer"
  }
];

function ProgressNotesView() {
  const [events, setEvents] = useState([]);

  // Event handlers for ReusableStepper + ReusableProgressCard
  const handleReusableItemEvent = (eventName, payload) => {
    console.log('ReusableStepper Event:', eventName, payload);
    addEvent(`ReusableStepper - ${eventName}`, payload);
  };

  const handleReusableAllDatesClick = () => {
    console.log('ReusableStepper - All dates button clicked');
    addEvent('ReusableStepper - All Dates Click', {});
  };

  // Event handlers for group header actions (download, print)
  const handleGroupHeaderAction = (action, groupKey, groupData) => {
    console.log(`Group Header ${action}:`, { groupKey, groupData });
    addEvent(`Group Header - ${action}`, { groupKey, groupData });
  };

  // Custom render functions for ReusableStepper
  const renderCustomGroupHeader = (groupKey, groupData, emit) => {
    const date = new Date(groupKey);
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}, ${date.getFullYear()}`;
    
    return (
      <Card className="medical-progress__date-header-card">
        <div className="medical-progress__content-date">
          <img 
            className='medical-progress__content-calendar-icon' 
            style={{fill:"#581C87"}} 
            src={defaultIcons.calendarIcon} 
            alt='' 
          />
          <span className="medical-progress__content-date-text">
            {formattedDate}
          </span>
          <img 
            className='medical-progress__content-download-icon' 
            style={{fill:"#581C87", cursor: 'pointer'}} 
            src={defaultIcons.downloadIcon} 
            alt='Download' 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleGroupHeaderAction('Download', groupKey, groupData);
              // Also emit the event for the stepper
              if (emit) {
                emit('groupHeaderAction', { action: 'download', groupKey, groupData });
              }
            }}
            title="Download this date's progress notes"
          />
          <img 
            className='medical-progress__content-print-icon' 
            style={{fill:"#581C87", cursor: 'pointer'}} 
            src={defaultIcons.printerIcon} 
            alt='Print' 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleGroupHeaderAction('Print', groupKey, groupData);
              // Also emit the event for the stepper
              if (emit) {
                emit('groupHeaderAction', { action: 'print', groupKey, groupData });
              }
            }}
            title="Print this date's progress notes"
          />
        </div>
      </Card>
    );
  };

  const renderCustomItem = (item, itemIndex, groupKey, items, emit) => {
    const value = (item.period || item.timeOfDay) || "";
    const formattedTimeOfDay = value.charAt(0).toUpperCase() + value.slice(1);
    return (
      <ReusableProgressCard
        data={item}
        timeOfDay={formattedTimeOfDay}
        timestamp={item.time || item.timestamp}
        chiefComplaint={item.chiefComplaint}
        findings={item.findings}
        vitals={item.vitals}
        additionalRemarks={item.additionalRemarks}
        filledBy={item.filledBy}
        role={item.role}
        onEvent={(eventName, payload) => emit(eventName, payload)}
        className="medical-progress__progress-card"
        actions={{
          showEdit: true,
          showDelete: true,
          showView: true,
        }}
      />
    );
  };

  // Helper function to add events to the log
  const addEvent = (eventType, data) => {
    const newEvent = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type: eventType,
      data: data
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div>
        <ReusableStepper
          data={stepperData}
          groupBy={(item) => item.date || item.timestamp?.split(' ')[0] || 'Unknown'}
          sortGroups={(a, b) => new Date(b) - new Date(a)}
          renderGroupHeader={renderCustomGroupHeader}
          renderItem={renderCustomItem}
          onItemEvent={handleReusableItemEvent}
          layout={{
            gridGutter: [16, 16],
            colProps: { xs: 24, sm: 12, lg: 8 },
            stepDirection: 'vertical',
            currentStep: -1,
          }}
          toolbar={{
            show: true,
            label: 'All Dates',
            icon: <span className="medical-progress__calendar-icon">📅</span>,
            onClick: handleReusableAllDatesClick,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressNotesView;