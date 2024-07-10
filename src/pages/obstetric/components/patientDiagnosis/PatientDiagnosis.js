import React, { useState } from "react";
import "./PatientDiagnosis.scss";
import {
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import DiagnosisNotes from "../diagnosisNotes/DiagnosisNotes";

const bloodGroupOptions = [
  { value: 1, label: "A+ (A positive)" },
  { value: 2, label: "A- (A negative" },
  { value: 3, label: "B+ (B positive)" },
  { value: 4, label: "B- (B negative" },
  { value: 5, label: "AB+ (AB positive)" },
  { value: 6, label: "AB- (AB negative" },
  { value: 7, label: "O+ (O positive)" },
  { value: 8, label: "O- (O negative" },
];

const diagnosisNotes =
  "We are an ABDM-certified platform crafted to ease administrative burdens your passion where it truly matters – caring for patients.";

export default function PatientDiagnosis() {
  const [gestationWeeks, setGestationWeeks] = useState("");
  const [gestationDays, setGestationDays] = useState("");
  const [marriageDurationInYears, setMarriageDurationInYears] = useState("");
  const [marriageDurationInMonths, setMarriageDurationInMonths] = useState("");

  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);

  const [diagnosisNotesDrawer, setDiagnosisNotesDrawer] = useState(false);

  const handleDrawerDiagnosisNotes = () => {
    setDiagnosisNotesDrawer(!diagnosisNotesDrawer);
  };

  const handleChange = (value) => {
    setSelectedBloodGroup(value);
  };
  const [pastPregnancyData, setPastPregnancyData] = useState([
    { value: 1, label: "G" },
    { value: 1, label: "P" },
    { value: 1, label: "L" },
    { value: 1, label: "A" },
    { value: 1, label: "NND" },
    { value: 1, label: "E" },
  ]);

  const handleInputChange = (index, newValue) => {
    const updatedData = [...pastPregnancyData];
    updatedData[index].value = newValue;
    setPastPregnancyData(updatedData);
  };

  return (
    <div>
      <div className="patientDiagnosisContainer">
        <div className="diagnosisTitle">Patient Diagnosis</div>
        <div className="diagnosisItems">
          <div className="rowContainer">
            <div className="history-badge">
              LMP :
              <DatePicker
                placeholder="Select Date"
                dropdownClassName="addDOB-picker-dropdown"
                format="DD MMM YYYY"
                style={{
                  height: "34px",
                  border: "none",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                  paddingRight: "0px",
                }}
                allowClear={false}
              />
            </div>
            <div
              className="history-badge"
              style={{ cursor: "disabled", backgroundColor: "#FAFAFB" }}
            >
              E.D.D : <span>12 Jan 2024</span>
            </div>
            <div className="history-badge">
              C.E.D.D :
              <DatePicker
                placeholder="Select Date"
                dropdownClassName="addDOB-picker-dropdown"
                format="DD MMM YYYY"
                style={{
                  height: "34px",
                  border: "none",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                  paddingRight: "0px",
                }}
                allowClear={false}
              />
            </div>
            <div className="history-badge">
              Gestation :
              <Input
                className="timeIntervalValue"
                style={{ marginLeft: "10px" }}
                placeholder="Ex : 3"
                value={gestationWeeks}
                onChange={(e) => setGestationWeeks(e.target.value)}
              />
              <span className="timeInterval">Weeks</span>
              <Input
                className="timeIntervalValue"
                placeholder="Ex : 2"
                value={gestationDays}
                onChange={(e) => setGestationDays(e.target.value)}
              />
              <span
                className="timeInterval"
                style={{
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                Days
              </span>
            </div>
            <div className="history-badge" style={{ width: "250px" }}>
              Blood :{" "}
              <Select
                className="autocomplete-custom h-100 inputborder"
                placeholder="Select"
                options={bloodGroupOptions}
                //   onClear={() => onSelectFrequencyChild("", index)}
                allowClear
              />
            </div>
          </div>

          <div className="rowContainer">
            <div className="history-badge">
              Husband's blood : <span>B +ve</span>
            </div>
            <div className="history-badge">
              Consang : <span>12 Jan 2024</span>
            </div>
            <div className="history-badge">
              Marital status : <span>12 Jan 2024</span>
            </div>
            <div className="history-badge">
              Marriage duration :{" "}
              <Input
                className="timeIntervalValue"
                style={{ marginLeft: "10px" }}
                placeholder="Ex : 3"
                value={marriageDurationInYears}
                onChange={(e) => setMarriageDurationInYears(e.target.value)}
              />
              <span className="timeInterval">Years</span>
              <Input
                className="timeIntervalValue"
                placeholder="Ex : 2"
                value={marriageDurationInMonths}
                onChange={(e) => setMarriageDurationInMonths(e.target.value)}
              />
              <span
                className="timeInterval"
                style={{
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                Months
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="pastPregnancyContainer">
        <Row gutter={32} style={{ padding: "26px 40px 0px" }}>
          {pastPregnancyData.map((item, index) => {
            return (
              <Col key={index}>
                <Form.Item label={item.label}>
                  <Input
                    value={item.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{ width: "40px", height: "28px" }}
                  />
                </Form.Item>
              </Col>
            );
          })}
        </Row>
        {diagnosisNotes ? (
          <div className="diagnosisNotesStyle">
            <span className="diagnosisNotesText">{diagnosisNotes}</span>
            <div className="editStyle" onClick={handleDrawerDiagnosisNotes}>
              <i className="icon-Edit iconStyle" />
              <span className="editText">Edit</span>
            </div>
          </div>
        ) : (
          <button
            className="btn d-flex align-items-center btn-text"
            style={{ color: "#4B4AD5", fontSize: "14px", fontWeight: "500" }}
            onClick={handleDrawerDiagnosisNotes}
          >
            <i className={`icon-Add me-1 fs-5`}></i> Add diagnosis notes
          </button>
        )}
      </div>
      <hr />
      {diagnosisNotesDrawer && (
        <Drawer
          closeIcon={false}
          placement="right"
          onClose={handleDrawerDiagnosisNotes}
          open={diagnosisNotesDrawer}
          className="modalWidth-563"
          width="auto"
        >
          <DiagnosisNotes
            handleDrawerDiagnosisNotes={handleDrawerDiagnosisNotes}
            diagnosisNotes={diagnosisNotes}
          />
        </Drawer>
      )}
    </div>
  );
}
