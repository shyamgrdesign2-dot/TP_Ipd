import React, { useState } from "react";
import "./PatientDiagnosis.scss";
import { Col, Collapse, DatePicker, Drawer, Form, Input, Row } from "antd";
import DiagnosisNotes from "../diagnosisNotes/DiagnosisNotes";
import { Dropdown, DropdownButton } from "react-bootstrap";
import ReadMore from "../../../../common/ReadMore";
import { useSelector } from "react-redux";
import {
  BloodGroupOptions,
  ConsangOptions,
  MaritalStatusOptions,
} from "../../utils/ObstetricHelper";
import dayjs from "dayjs";
import moment from "moment";

export default function PatientDiagnosis() {
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const {
    gravidity,
    parity,
    livingChildren,
    abortion,
    ectopicPregnancies,
    diagnosisNotes,
    blood,
    ceed,
    lmp,
    consang,
    edd,
    gestationDays,
    gestationWeeks,
    husbandsBlood,
    maritialStatus,
    marriageDurationYears,
    marriageDurationMonths,
  } = obstetricDetails || {};
  const [diagnosisNotesDrawer, setDiagnosisNotesDrawer] = useState(false);
  const [patientDiagnosisNotes, setPatientDiagnosisNotes] =
    useState(diagnosisNotes);

  const [patientDiagnosisData, setPatientDiagnosisData] = useState({
    lmp: lmp ? dayjs(moment(lmp).format("DD-MM-YYYY"), "DD-MM-YYYY") : "",
    edd: edd ? moment(edd).format("DD MMM YYYY") : "",
    ceed: ceed ? dayjs(moment(ceed).format("DD-MM-YYYY"), "DD-MM-YYYY") : "",
    gestationWeeks: gestationWeeks || 0,
    gestationDays: gestationDays || 0,
    blood: blood,
    husbandsBlood: husbandsBlood,
    consang: typeof consang === "boolean" ? (consang ? "Yes" : "No") : "",
    maritialStatus: maritialStatus,
    marriageDurationYears: marriageDurationYears || 0,
    marriageDurationMonths: marriageDurationMonths || 0,
  });

  const [pastPregnancyData, setPastPregnancyData] = useState([
    { value: gravidity, label: "G" },
    { value: parity, label: "P" },
    { value: livingChildren, label: "L" },
    { value: abortion, label: "A" },
    { value: ectopicPregnancies, label: "E" },
  ]);

  const handlePatientDiagnosis = (newValue, key, isValid = true) => {
    if (isValid) {
      setPatientDiagnosisData((prevState) => ({
        ...prevState,
        [key]: newValue,
      }));
    }
  };

  const handleDrawerDiagnosisNotes = () => {
    setDiagnosisNotesDrawer(!diagnosisNotesDrawer);
  };

  const handleInputChange = (index, newValue, isValid) => {
    if (isValid) {
      const updatedData = [...pastPregnancyData];
      updatedData[index].value = newValue;
      setPastPregnancyData(updatedData);
    }
  };

  const patientDiagnosisAccordian = {
    label: (
      <div
        className="fw-semibold"
        style={{
          background: "transparent",
        }}
      >
        Patient Diagnosis
      </div>
    ),
    content: (
      <div className="diagnosisItems">
        <div className="rowContainer">
          <div className="history-badge" style={{ width: "167px" }}>
            LMP :
            <DatePicker
              className="datePickerStyle"
              placeholder="Select Date"
              dropdownClassName="addDOB-picker-dropdown lmpStyle"
              format="DD MMM YYYY"
              value={patientDiagnosisData.lmp}
              onChange={(_, d) => {
                handlePatientDiagnosis(
                  dayjs(moment(d).format("DD-MM-YYYY"), "DD-MM-YYYY"),
                  "lmp"
                );
              }}
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
              {patientDiagnosisData.edd}
            </span>
          </div>
          <div className="history-badge" style={{ width: "188px" }}>
            C.E.D.D :
            <DatePicker
              placeholder="Select Date"
              className="datePickerStyle"
              dropdownClassName="addDOB-picker-dropdown ceddStyle"
              format="DD MMM YYYY"
              value={patientDiagnosisData.ceed}
              onChange={(_, d) => {
                handlePatientDiagnosis(
                  dayjs(moment(d).format("DD-MM-YYYY"), "DD-MM-YYYY"),
                  "ceed"
                );
              }}
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
              value={patientDiagnosisData.gestationWeeks}
              onChange={(e) =>
                handlePatientDiagnosis(
                  e.target.value,
                  "gestationWeeks",
                  e.target.validity.valid
                )
              }
            />
            <span className="timeInterval spanStyle">Weeks</span>
            <Input
              className="timeIntervalValue"
              placeholder="Ex : 2"
              pattern="[0-9]*"
              value={patientDiagnosisData.gestationDays}
              onChange={(e) =>
                handlePatientDiagnosis(
                  e.target.value,
                  "gestationDays",
                  e.target.validity.valid
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
          <div
            className="history-badge"
            style={{ width: "160px", position: "relative" }}
          >
            Blood :
            <DropdownButton
              className="diagnosisSelect bloodGroup"
              style={{ width: "40%" }}
              title={
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                  }}
                >
                  {patientDiagnosisData.blood || "Select"}
                  <i className="icon-right iconStyle" />
                </div>
              }
              onSelect={(e) => handlePatientDiagnosis(e, "blood")}
            >
              {BloodGroupOptions.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  eventKey={option.value}
                  className="dropdown-item-custom"
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
              className="diagnosisSelect husbandBlood"
              style={{ width: "40%" }}
              title={
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                  }}
                >
                  {patientDiagnosisData.husbandsBlood || "Select"}
                  <i className="icon-right iconStyle" />
                </div>
              }
              onSelect={(e) => handlePatientDiagnosis(e, "husbandsBlood")}
            >
              {BloodGroupOptions.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  eventKey={option.value}
                  className="dropdown-item-custom"
                >
                  {option.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div
            className="history-badge"
            style={{ width: "212px", position: "relative" }}
          >
            Marital status :
            <DropdownButton
              className="diagnosisSelect marritalStatus"
              style={{ width: "40%" }}
              title={
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                  }}
                >
                  {patientDiagnosisData.maritialStatus || "Select"}
                  <i className="icon-right iconStyle" />
                </div>
              }
              onSelect={(e) => handlePatientDiagnosis(e, "maritialStatus")}
            >
              {MaritalStatusOptions.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  eventKey={option.value}
                  className="dropdown-item-custom"
                >
                  {option.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div className="history-badge">
            Marriage duration :{" "}
            <Input
              className="timeIntervalValue"
              style={{ marginLeft: "10px" }}
              placeholder="Ex : 3"
              pattern="[0-9]*"
              value={patientDiagnosisData.marriageDurationYears}
              onChange={(e) =>
                handlePatientDiagnosis(
                  e.target.value,
                  "marriageDurationYears",
                  e.target.validity.valid
                )
              }
            />
            <span className="timeInterval spanStyle">Years</span>
            <Input
              className="timeIntervalValue"
              placeholder="Ex : 2"
              pattern="[0-9]*"
              value={patientDiagnosisData.marriageDurationMonths}
              onChange={(e) =>
                handlePatientDiagnosis(
                  e.target.value,
                  "marriageDurationMonths",
                  e.target.validity.valid
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
          <div
            className="history-badge"
            style={{ width: "160px", position: "relative" }}
          >
            Consang :
            <DropdownButton
              className="diagnosisSelect consang"
              style={{ width: "40%" }}
              title={
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                  }}
                >
                  {patientDiagnosisData.consang || "Select"}
                  <i className="icon-right iconStyle" />
                </div>
              }
              onSelect={(e) => handlePatientDiagnosis(e, "consang")}
            >
              {ConsangOptions.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  eventKey={option.value}
                  className="dropdown-item-custom"
                >
                  {option.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div>
      <div className="patientDiagnosisContainer">
        <Collapse
          defaultActiveKey={["0"]}
          className="prescriptiontab-accordian  patientDiagnosisAccordian"
          expandIconPosition={"end"}
        >
          <Collapse.Panel header={patientDiagnosisAccordian.label}>
            {patientDiagnosisAccordian.content}
          </Collapse.Panel>
        </Collapse>
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
        {patientDiagnosisNotes ? (
          <div className="diagnosisNotesStyle">
            <ReadMore text={patientDiagnosisNotes} textLimit={125} />
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
            diagnosisNotes={patientDiagnosisNotes}
            setDiagnosisNotes={setPatientDiagnosisNotes}
          />
        </Drawer>
      )}
    </div>
  );
}
