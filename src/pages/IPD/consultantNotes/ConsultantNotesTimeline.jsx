import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePicker, Button, Tooltip } from "antd";
import {
  CalendarOutlined,
  DownloadOutlined,
  PrinterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  setCurrentConsultantNote,
  setClinicalAssessmentPlan,
  setVitals,
  setLabInvestigation,
  setAdditionalRemarks,
} from "../../../redux/ipd/consultantNotesSlice";
import { setMedicationData } from "../../../redux/prescriptionSlice";
import "./styles.scss";
import { createRemoteComponent } from "../../../shared/remoteComponents";

const ReusableProgressCard = createRemoteComponent("ReusableProgressCard");
const ReusableStepper = createRemoteComponent("ReusableStepper");

const ConsultantNotesTimeline = () => {
  const { consultantNotes } = useSelector((state) => state.consultantNotes);
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const [filterDate, setFilterDate] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filter notes by date if filter is applied
  const filteredNotes = useMemo(() => {
    if (!filterDate) return consultantNotes || [];

    return (consultantNotes || []).filter((note) => {
      const noteDate = dayjs(note.createdAt);
      const filterDateValue = dayjs(filterDate);
      return noteDate.isSame(filterDateValue, "day");
    });
  }, [consultantNotes, filterDate]);

  // Sort notes by date (newest first)
  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filteredNotes]);

  // Handle edit button click
  const handleEditNote = (note) => {
    console.log("Editing note:", note);

    // Set the current consultant note
    dispatch(setCurrentConsultantNote(note));

    // Populate all Redux states with the note's data
    const consultationData = note.consultationNotes || {};

    // Set clinical assessment plan
    if (consultationData.clinicalAssessmentPlan) {
      dispatch(
        setClinicalAssessmentPlan(consultationData.clinicalAssessmentPlan)
      );
    }

    // Set vitals
    if (consultationData.vitals) {
      dispatch(setVitals(consultationData.vitals));
    }

    // Set medication
    if (consultationData.medication) {
      dispatch(setMedicationData(consultationData.medication));
    }

    // Set lab investigation
    if (consultationData.labInvestigation) {
      dispatch(setLabInvestigation(consultationData.labInvestigation));
    }

    // Set additional remarks
    if (consultationData.additionalRemarks) {
      dispatch(setAdditionalRemarks(consultationData.additionalRemarks));
    }

    // Navigate to the consultant notes page
    navigate("/ipd/patient-details/consultant-notes", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
      },
    });
  };

  const formatDateTime = (dateString) => {
    const date = dayjs(dateString);
    return {
      date: date.format("DD MMM, YYYY"),
      time: date.format("HH:mm A"),
    };
  };

  const renderClinicalAssessment = (data) => {
    if (!data || data.length === 0) return <div className="no-data">None</div>;

    // Handle rich text format (Slate.js format)
    if (Array.isArray(data) && data.length > 0 && data[0].type) {
      return (
        <ul className="consultant-notes-list">
          {data.map((item, index) => (
            <li key={index} className="consultant-notes-item">
              {item.children
                ? item.children
                    .map((child, childIndex) =>
                      child?.children
                        ?.map((grandChild, grandChildIndex) => grandChild?.text)
                        .join("")
                    )
                    .join(", ")
                : ""}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul className="consultant-notes-list">
        {data.map((item, index) => (
          <li key={index} className="consultant-notes-item">
            {typeof item === "string"
              ? item
              : item.text || JSON.stringify(item)}
          </li>
        ))}
      </ul>
    );
  };

  const renderVitals = (data) => {
    if (!data || Object.keys(data).length === 0)
      return <div className="no-data">None</div>;

    return (
      <ul className="consultant-notes-list">
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="consultant-notes-item">
            <strong>{key}:</strong> {value || "N/A"}
          </li>
        ))}
      </ul>
    );
  };

  const renderMedication = (data) => {
    if (!data || data.length === 0) return <div className="no-data">None</div>;

    return (
      <div className="medication-table-container">
        <table className="medication-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Unit Per Dose</th>
              <th>Frequency</th>
              <th>WHEN</th>
              <th>Duration</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {data.map((med, index) => (
              <tr key={index}>
                <td>{med.medicineName || med.name || "N/A"}</td>
                <td>{med.unitPerDose || "N/A"}</td>
                <td>{med.frequency || "N/A"}</td>
                <td>{med.when || "N/A"}</td>
                <td>{med.duration || "N/A"}</td>
                <td>{med.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLabInvestigation = (data) => {
    if (!data || data.length === 0) return <div className="no-data">None</div>;

    return (
      <ul className="consultant-notes-list">
        {data.map((item, index) => (
          <li key={index} className="consultant-notes-item">
            {item.name || item.investigation_name || item}
          </li>
        ))}
      </ul>
    );
  };

  const renderAdditionalRemarks = (data) => {
    if (!data || data.length === 0) return <div className="no-data">None</div>;

    // Handle rich text format (Slate.js format)
    if (Array.isArray(data) && data.length > 0 && data[0].type) {
      return (
        <ul className="consultant-notes-list">
          {data.map((item, index) => (
            <li key={index} className="consultant-notes-item">
              {item.children
                ? item.children
                    .map((child, childIndex) =>
                      child?.children
                        ?.map((grandChild, grandChildIndex) => grandChild?.text)
                        .join(",")
                    )
                    .join(", ")
                : ""}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul className="consultant-notes-list">
        {data.map((item, index) => (
          <li key={index} className="consultant-notes-item">
            {typeof item === "string"
              ? item
              : item.text || JSON.stringify(item)}
          </li>
        ))}
      </ul>
    );
  };

  const renderFilledBy = (data) => {
    return (
      <div className="filled-by-section">
        <span className="filled-by-label">Filled by:</span>
        <span className="filled-by-name">{data?.name || "Dr. Ram Lal"}</span>
        <span className="filled-by-role">{data?.role || "Consultant"}</span>
      </div>
    );
  };

  const renderConsultantNoteCard = (note, index) => {
    const { date, time } = formatDateTime(note.createdAt);
    const consultationData = note.consultationNotes || {};

    return (
      <div key={note._id || index} className="consultant-note-card">
        {/* Header */}
        <div className="consultant-note-header">
          <div className="consultant-note-date-time">
            <CalendarOutlined className="date-icon" />
            <span className="date">{date}</span>
            <span className="time">{time}</span>
          </div>
          <div className="consultant-note-actions">
            <Tooltip title="Download">
              <Button type="text" icon={<DownloadOutlined />} />
            </Tooltip>
            <Tooltip title="Print">
              <Button type="text" icon={<PrinterOutlined />} />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditNote(note)}
              />
            </Tooltip>
          </div>
        </div>

        {/* Content Sections */}
        <div className="consultant-note-content">
          {/* Clinical Assessment & Plan */}
          <div className="consultant-note-section">
            <div className="section-header">
              <div className="section-icon clinical-assessment-icon">🏥</div>
              <h3 className="section-title">Clinical Assessment & Plan</h3>
            </div>
            <div className="section-content">
              {renderClinicalAssessment(
                consultationData.clinicalAssessmentPlan
              )}
            </div>
          </div>

          {/* Vitals */}
          <div className="consultant-note-section">
            <div className="section-header">
              <div className="section-icon vitals-icon">💓</div>
              <h3 className="section-title">Vitals</h3>
            </div>
            <div className="section-content">
              {renderVitals(consultationData.vitals)}
            </div>
          </div>

          {/* Medication */}
          <div className="consultant-note-section">
            <div className="section-header">
              <div className="section-icon medication-icon">💊</div>
              <h3 className="section-title">Medication(Rx)</h3>
            </div>
            <div className="section-content">
              {renderMedication(consultationData.medication)}
            </div>
          </div>

          {/* Lab Investigation */}
          <div className="consultant-note-section">
            <div className="section-header">
              <div className="section-icon lab-icon">🧪</div>
              <h3 className="section-title">Lab Investigation</h3>
            </div>
            <div className="section-content">
              {renderLabInvestigation(consultationData.labInvestigation)}
            </div>
          </div>

          {/* Additional Remarks */}
          <div className="consultant-note-section">
            <div className="section-header">
              <div className="section-icon remarks-icon">📄</div>
              <h3 className="section-title">Additional Remarks</h3>
            </div>
            <div className="section-content">
              {renderAdditionalRemarks(consultationData.additionalRemarks)}
            </div>
          </div>

          {/* Filled by */}
          <div className="consultant-note-section">
            <div className="section-header">
              <div className="section-icon filled-by-icon">👨‍⚕️</div>
              <div className="section-content">
                {renderFilledBy(consultationData.filledBy)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="consultant-notes-timeline">
      {/* Filter Section */}
      <div className="timeline-filter">
        <div className="timeline-filter-left">
          <DatePicker
            placeholder="Filter by Date"
            value={filterDate}
            onChange={setFilterDate}
            allowClear
            format="DD MMM YYYY"
            className="timeline-date-filter"
          />
        </div>
      </div>

      {/* Timeline Content */}
      <div className="timeline-content">
        {sortedNotes.length === 0 ? (
          <div className="no-notes-message">
            {filterDate
              ? "No consultant notes found for the selected date."
              : "No consultant notes available."}
          </div>
        ) : (
          sortedNotes.map((note, index) =>
            renderConsultantNoteCard(note, index)
          )
        )}
      </div>
    </div>
  );
};

export default ConsultantNotesTimeline;
