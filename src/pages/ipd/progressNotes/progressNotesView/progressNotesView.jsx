import React, { useState, useMemo } from 'react';
import { Card, Button, Divider, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RemoteComponents } from '../../../../shared/remoteComponents';
import { defaultIcons } from '../../../../assets/images/icons/index.js';
import './progressNotesView.scss';

const { Title, Text } = Typography;
const { ReusableStepper, ReusableProgressCard } = RemoteComponents;

function ProgressNotesView({progressNotes , patientDetails}) {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const mappedData = useMemo(() => {
    if (!Array.isArray(progressNotes)) return [];
    return progressNotes.map((entry) => {
      const pn = entry?.progressNotes || {};
      const dateIso = pn?.date ? new Date(pn.date) : null;
      const timeIso = pn?.time ? new Date(pn.time) : null;
      const formattedDate = dateIso ? `${dateIso.getFullYear()}-${String(dateIso.getMonth() + 1).padStart(2, '0')}-${String(dateIso.getDate()).padStart(2, '0')}` : undefined;
      return {
        // identifiers and raw source to support edit flow
        _id: entry?._id,
        raw: entry,
        date: formattedDate,
        period: pn?.period,
        time: timeIso ? timeIso.toLocaleTimeString() : undefined,
        timestamp: pn?.time,
        chiefComplaint: pn?.chiefComplaint,
        findings: pn?.findings,
        vitals: pn?.vitals,
        additionalRemarks: pn?.additionalRemarks,
        filledBy: entry?.createdBy ? `Dr. ${entry.createdBy}` : undefined,
        role: undefined,
      };
    });
  }, [progressNotes]);

  // Event handlers for ReusableStepper + ReusableProgressCard
  const handleReusableItemEvent = (eventName, payload) => {
    if(eventName === "edit") {
      const progressNotes = payload?.data
      navigate("/ipd/patient-details/progress-notes", {
        state: {
          progressNotesData : progressNotes,
          patientDetails,
          isEditable: true,
        },
      });
    }
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
          data={mappedData}
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