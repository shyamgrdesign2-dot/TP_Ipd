import React, { useEffect, useState } from "react";
import "./PatientDiagnosis.scss";
import { Col, Collapse, DatePicker, Drawer, Form, Input, Row } from "antd";
import DiagnosisNotes from "../diagnosisNotes/DiagnosisNotes";
import { Dropdown, DropdownButton } from "react-bootstrap";
import ReadMore from "../../../../common/ReadMore";
import {
  BloodGroupOptions,
  ConsangOptions,
  MaritalStatusOptions,
} from "../../utils/constants";
import dayjs from "dayjs";
import moment from "moment";
import {
  obstetricDetailsUpdated,
  patientDiagnosisUpdated,
} from "../../../../redux/obstetricSlice";
import { useDispatch } from "react-redux";

export default function PatientDiagnosis({
  lmpDate,
  patientDiagnosisData,
  pastPregnancyData,
  patientDiagnosisNotes,
  setLmpDate,
  setPatientDiagnosisData,
  setPastPregnancyData,
  setPatientDiagnosisNotes,
}) {
  const dispatch = useDispatch();
  const [diagnosisNotesDrawer, setDiagnosisNotesDrawer] = useState(false);

  useEffect(() => {
    if (lmpDate) {
      /**
       * EDD Formula: LMP date + 1 year - 3 months + 7 days
       */
      setPatientDiagnosisData((prevState) => ({
        ...prevState,
        lmp: dayjs(lmpDate, "DD-MM-YYYY"),
        edd: moment(lmpDate, "DD-MM-YYYY")
          .clone()
          .add(1, "year")
          .subtract(3, "months")
          .add(7, "days")
          .toDate()
          .toISOString(),
      }));
      dispatch(patientDiagnosisUpdated());
      dispatch(obstetricDetailsUpdated());
    }
  }, [lmpDate]);

  const handlePatientDiagnosis = (newValue, key, isValid = true) => {
    if (isValid) {
      setPatientDiagnosisData((prevState) => ({
        ...prevState,
        [key]: newValue,
      }));
      dispatch(patientDiagnosisUpdated());
      dispatch(obstetricDetailsUpdated());
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
      dispatch(patientDiagnosisUpdated());
      dispatch(obstetricDetailsUpdated());
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
                setLmpDate(dayjs(d).format("DD-MM-YYYY"));
              }}
              style={{
                height: "34px",
                border: "none",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                padding: "0 10px 0 10px",
              }}
              allowClear={false}
              disabledDate={(current) => current && current > dayjs()}
            />
          </div>
          <div
            className="history-badge"
            style={{ cursor: "disabled", backgroundColor: "#FAFAFB" }}
          >
            E.D.D :{" "}
            <span className="spanStyle" style={{ marginLeft: "8px" }}>
              {patientDiagnosisData.edd
                ? moment(patientDiagnosisData.edd).format("DD MMM YYYY")
                : ""}
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
              disabledDate={(current) => current <= patientDiagnosisData.lmp}
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
                  e.target.validity.valid && e.target.value <= 50
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
                  e.target.validity.valid && e.target.value <= 6
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
                  e.target.validity.valid && e.target.value <= 100
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
                  e.target.validity.valid && e.target.value <= 11
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
                  {typeof patientDiagnosisData.consang === "boolean"
                    ? patientDiagnosisData.consang
                      ? "Yes"
                      : "No"
                    : "Select"}
                  <i className="icon-right iconStyle" />
                </div>
              }
              onSelect={(e) =>
                handlePatientDiagnosis(e === "yes" ? true : false, "consang")
              }
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
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        e.target.value,
                        e.target.validity.valid && e.target.value <= 45
                      )
                    }
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
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
