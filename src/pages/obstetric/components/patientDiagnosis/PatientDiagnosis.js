import React, { useState } from "react";
import "./PatientDiagnosis.scss";
import { Col, DatePicker, Drawer, Form, Input, Row, Select } from "antd";
import DiagnosisNotes from "../diagnosisNotes/DiagnosisNotes";
import { Dropdown, DropdownButton } from "react-bootstrap";

const bloodGroupOptions = [
  { value: 1, label: "A+ (A positive)", shortLabel: "A+" },
  { value: 2, label: "A- (A negative)", shortLabel: "A-" },
  { value: 3, label: "B+ (B positive)", shortLabel: "B+" },
  { value: 4, label: "B- (B negative)", shortLabel: "B-" },
  { value: 5, label: "AB+ (AB positive)", shortLabel: "AB+" },
  { value: 6, label: "AB- (AB negative)", shortLabel: "AB-" },
  { value: 7, label: "O+ (O positive)", shortLabel: "O+" },
  { value: 8, label: "O- (O negative)", shortLabel: "O-" },
];

const consangOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const maritalStatusOptions = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
];

export default function PatientDiagnosis() {
  const [gestationWeeks, setGestationWeeks] = useState("");
  const [gestationDays, setGestationDays] = useState("");
  const [marriageDurationInYears, setMarriageDurationInYears] = useState("");
  const [marriageDurationInMonths, setMarriageDurationInMonths] = useState("");

  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);

  const [diagnosisNotesDrawer, setDiagnosisNotesDrawer] = useState(false);
  const [diagnosisNotes, setDiagnosisNotes] = useState("");

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

  const handleInputChange = (index, newValue, isValid) => {
    if (isValid) {
      const updatedData = [...pastPregnancyData];
      updatedData[index].value = newValue;
      setPastPregnancyData(updatedData);
    }
  };

  const [selectedValue, setSelectedValue] = React.useState("");

  const handleSelect = (eventKey) => {
    const selectedOption = bloodGroupOptions.find(
      (option) => option.value.toString() === eventKey
    );
    setSelectedValue(selectedOption ? selectedOption.shortLabel : "");
  };

  return (
    <div>
      <div className="patientDiagnosisContainer">
        <div className="diagnosisTitle">Patient Diagnosis</div>
        <div className="diagnosisItems">
          <div className="rowContainer">
            <div className="history-badge" style={{ width: "167px" }}>
              LMP :
              <DatePicker
                className="datePickerStyle"
                placeholder="Select Date"
                dropdownClassName="addDOB-picker-dropdown"
                format="DD MMM YYYY"
                style={{
                  height: "34px",
                  border: "none",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                  padding: "0 10px 0 10px",
                }}
                allowClear={false}
              />
            </div>
            <div
              className="history-badge"
              style={{ cursor: "disabled", backgroundColor: "#FAFAFB" }}
            >
              E.D.D :{" "}
              <span className="spanStyle" style={{ marginLeft: "8px" }}>
                12 Jan 2024
              </span>
            </div>
            <div className="history-badge" style={{ width: "188px" }}>
              C.E.D.D :
              <DatePicker
                placeholder="Select Date"
                className="datePickerStyle"
                format="DD MMM YYYY"
                style={{
                  height: "34px",
                  border: "none",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                  padding: "0 10px 0 10px",
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
                inputMode="numeric"
                pattern="[0-9]*"
                value={gestationWeeks}
                onChange={(e) =>
                  setGestationWeeks(
                    e.target.validity.valid ? e.target.value : gestationWeeks
                  )
                }
              />
              <span className="timeInterval spanStyle">Weeks</span>
              <Input
                className="timeIntervalValue"
                placeholder="Ex : 2"
                pattern="[0-9]*"
                value={gestationDays}
                onChange={(e) =>
                  setGestationDays(
                    e.target.validity.valid ? e.target.value : gestationDays
                  )
                }
              />
              <span
                className="timeInterval spanStyle"
                style={{
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                Days
              </span>
            </div>
            <div className="history-badge" style={{ width: "142px" }}>
              Blood :
              <DropdownButton
                className="h-100 inputborder diagnosisSelect bloodDropdown"
                style={{ width: "40%" }}
                title={
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "flex",
                    }}
                  >
                    {selectedValue || "Select"}
                    <i className="icon-right iconStyle" />
                  </div>
                }
                onSelect={handleSelect}
              >
                {bloodGroupOptions.map((option, index) => (
                  <Dropdown.Item
                    key={option.value}
                    eventKey={option.value.toString()}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          </div>

          <div className="rowContainer">
            <div className="history-badge" style={{ width: "220px" }}>
              Husband's blood :
              <DropdownButton
                className="h-100 inputborder diagnosisSelect husbandBlood"
                style={{ width: "40%" }}
                title={
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      display: "flex",
                    }}
                  >
                    {selectedValue || "Select"}
                    <i className="icon-right iconStyle" />
                  </div>
                }
                onSelect={handleSelect}
              >
                {bloodGroupOptions.map((option) => (
                  <Dropdown.Item
                    key={option.value}
                    eventKey={option.value.toString()}
                    className="dropdown-item-custom"
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
            <div
              className="history-badge"
              style={{ width: "170px", position: "relative" }}
            >
              Consang :
              <Select
                className="autocomplete-custom h-100 inputborder diagnosisSelect"
                style={{ width: "50%" }}
                placeholder="Select"
                options={consangOptions}
                optionLabelProp="label"
                dropdownStyle={{ width: 170 }}
              />
            </div>
            <div
              className="history-badge"
              style={{ width: "208px", position: "relative" }}
            >
              Marital status :
              <Select
                className="autocomplete-custom h-100 inputborder diagnosisSelect maritalStatusSelect"
                style={{ width: "45%" }}
                placeholder="Select"
                options={maritalStatusOptions}
                optionLabelProp="label"
                dropdownStyle={{ width: 230, marginLeft: -112 }}
                allowClear
              />
            </div>
            <div className="history-badge">
              Marriage duration :{" "}
              <Input
                className="timeIntervalValue"
                style={{ marginLeft: "10px" }}
                placeholder="Ex : 3"
                pattern="[0-9]*"
                value={marriageDurationInYears}
                onChange={(e) =>
                  setMarriageDurationInYears(
                    e.target.validity.valid
                      ? e.target.value
                      : marriageDurationInYears
                  )
                }
              />
              <span className="timeInterval spanStyle">Years</span>
              <Input
                className="timeIntervalValue"
                placeholder="Ex : 2"
                pattern="[0-9]*"
                value={marriageDurationInMonths}
                onChange={(e) =>
                  setMarriageDurationInMonths(
                    e.target.validity.valid
                      ? e.target.value
                      : marriageDurationInMonths
                  )
                }
              />
              <span
                className="timeInterval spanStyle"
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
        <Row gutter={20} style={{ padding: "26px 0px 0px 40px" }}>
          {pastPregnancyData.map((item, index) => {
            return (
              <Col key={index}>
                <Form.Item label={item.label} style={{ marginBottom: "10px" }}>
                  <Input
                    value={item.value}
                    pattern="[0-9]*"
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        e.target.value,
                        e.target.validity.valid
                      )
                    }
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
            style={{
              color: "#4B4AD5",
              fontSize: "14px",
              fontWeight: "500",
              paddingRight: "40px",
            }}
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
            setDiagnosisNotes={setDiagnosisNotes}
          />
        </Drawer>
      )}
    </div>
  );
}
