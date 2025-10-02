import React, { useEffect, useState } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spin, Alert } from "antd";
import { generateChronologicalSummary, setCourseInHospital } from "../../../../redux/ipd/dischargeSummarySlice";
import { isEmptyRichText } from "../../../../utils/utils";
import dayjs from "dayjs";
import "./styles.scss";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ChronologicalSummary = (props) => {
  const { isEditable = true, sectionData, patientId, admissionId } = props || {};
  const dispatch = useDispatch();
  
  const { 
    chronologicalSummary, 
    chronologicalSummaryLoading,
    dischargeSummaryData 
  } = useSelector((state) => state.dischargeSummary);

  const [error, setError] = useState(null);

  const handleGenerateChronologicalSummary = async () => {
    if (!patientId || !admissionId) {
      setError("Patient ID and Admission ID are required to generate chronological summary");
      return;
    }

    try {
      setError(null);
      await dispatch(generateChronologicalSummary({ patientId, admissionId })).unwrap();
    } catch (err) {
      setError(err.message || "Failed to generate chronological summary");
    }
  };

  const renderChronologicalSummaryData = () => {
    if (chronologicalSummaryLoading) {
      return (
        <div className="chronological-summary-loading">
          <Spin size="large" />
          <p>Generating chronological summary...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      );
    }

    if (!chronologicalSummary || chronologicalSummary.length === 0) {
      return (
        <div className="chronological-summary-empty">
          <p>No chronological summary data available.</p>
          {isEditable && (
            <Button 
              type="primary" 
              onClick={handleGenerateChronologicalSummary}
              loading={chronologicalSummaryLoading}
            >
              Generate Chronological Summary
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="chronological-summary-content">
        {isEditable && (
          <div className="chronological-summary-actions">
            <Button 
              type="default" 
              onClick={handleGenerateChronologicalSummary}
              loading={chronologicalSummaryLoading}
            >
              Regenerate Summary
            </Button>
          </div>
        )}
        
        <div className="chronological-summary-data">
          {Array.isArray(chronologicalSummary) ? (
            chronologicalSummary.map((item, index) => (
              <div key={index} className="chronological-summary-item">
                {typeof item === 'object' ? (
                  <div>
                    {item.date && <div className="summary-date"><strong>Date:</strong> {item.date}</div>}
                    {item.time && <div className="summary-time"><strong>Time:</strong> {item.time}</div>}
                    {item.description && <div className="summary-description">{item.description}</div>}
                    {item.notes && <div className="summary-notes">{item.notes}</div>}
                  </div>
                ) : (
                  <div className="summary-text">{item}</div>
                )}
              </div>
            ))
          ) : (
            <div className="summary-text">{chronologicalSummary}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <CollapsibleWrapper
      title={sectionData?.title || "Chronological Summary"}
      data-testid={sectionData?.id || "chronological-summary"}
      icon={
        sectionData?.id
          ? dischargeSummaryIcons[`${sectionData.id}Dark`]
          : dischargeSummaryIcons.chronologicalSummaryDark
      }
      collapsible={isEditable}
      width={"100%"}
      className={`collapsible-wrapper-class ${
        isEditable ? "" : "collapsible-wrapper-class-readonly"
      }`}
      defaultOpen
    >
      {renderChronologicalSummaryData()}
    </CollapsibleWrapper>
  );
};

export default ChronologicalSummary;
