import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button, Card, DatePicker, Input, Tooltip, Select, Radio } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import "./pastPregnancy.scss";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../../utils/constants";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import {
  addObstetricDetails,
  obstetricDetailsUpdated,
  patientDiagnosisUpdated,
} from "../../../../redux/obstetricSlice";
import { isDecimalCheck, isNumberCheck } from "../../utils/helper";

function PastPregnancy({
  close,
  editIndex,
  toggleDeletePopup,
  isDataAddedOrEdited,
  setIsDataAddedOrEdited,
  setIsPastPregnancyUpdated,
}) {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const [pastPregnancyData, setPastPregnancyData] = useState({});
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const { pregnancyHistory = [] } = obstetricDetails;
  const { state } = useLocation();
  const { patient_data } = state;

  useEffect(() => {
    if (editIndex >= 0) {
      setPastPregnancyData({ ...pregnancyHistory[editIndex] });
    }
  }, [editIndex]);

  const handlePastPregnancyDataChange = (field, value) => {
    setPastPregnancyData((prevData) => {
      const newData = {
        ...prevData,
        [field]:
          field !== "remarks" && value === prevData[field] ? undefined : value,
        modifiedAt: new Date().toISOString(),
      };
      return newData;
    });
    setIsDataAddedOrEdited(true);
  };

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  const addPastPregnancyData = async () => {
    setIsPastPregnancyUpdated(true);
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    let decodedToken;
    if (token) {
      try {
        decodedToken = jwtDecode(token);
      } catch (e) {
        console.log(e);
      }
    }
    let newPastPregnancy = [...pregnancyHistory] || [];
    const data = {};
    Object.keys(pastPregnancyData).forEach((key) => {
      if (![undefined, null, ""].includes(pastPregnancyData[key])) {
        data[key] = pastPregnancyData[key];
      }
    });
    if (pregnancyHistory?.length > 0 && editIndex >= 0) {
      newPastPregnancy[editIndex] = {
        ...data,
        modifiedAt: new Date().toISOString(),
        modifiedBy: decodedToken?.result?.user_id,
      };
    } else {
      newPastPregnancy = [
        ...pregnancyHistory,
        {
          ...data,
          createdAt: new Date().toISOString(),
          createdBy: decodedToken?.result?.user_id,
          modifiedAt: new Date().toISOString(),
          modifiedBy: decodedToken?.result?.user_id,
        },
      ];
    }
    const payload = {
      ...obstetricDetails,
      patientId: patient_data.patient_unique_id,
      pregnancyHistory: newPastPregnancy,
    };
    dispatch(addObstetricDetails(payload));
    dispatch(obstetricDetailsUpdated());
    dispatch(patientDiagnosisUpdated());
    setIsDataAddedOrEdited(false);
    close();
  };

  const deletePastPregnancyData = async () => {
    let newPastPregnancy = [...pregnancyHistory];
    if (editIndex >= 0) {
      newPastPregnancy.splice(editIndex, 1);
    }
    const payload = {
      ...obstetricDetails,
      patientId: patient_data.patient_unique_id,
      pregnancyHistory: newPastPregnancy,
    };
    dispatch(addObstetricDetails(payload));
    dispatch(obstetricDetailsUpdated());
    dispatch(patientDiagnosisUpdated());
    setIsDataAddedOrEdited(false);
    close();
  };

  const TABLE_PAST_PREGNANCY = useMemo(() => {
    return (
      <div className="past-pregnancy-wrap-body past-pregnancy-child-width">
        <div className="past-pregnancy-head rounded-start-0 w-100">
          Values
          {editIndex >= 0 && (
            <div>
              <Tooltip
                trigger={"click"}
                placement="bottom"
                title={
                  <div
                    className="tooltip-content"
                    onClick={deletePastPregnancyData}
                  >
                    <DeleteOutlined className="delete-icon" />
                    <span>Delete</span>
                  </div>
                }
                overlayClassName="custom-tooltip"
              >
                <EllipsisOutlined className="vertical-dots" />
              </Tooltip>
            </div>
          )}
        </div>
        <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5 w-100">
          <Select
            style={{ width: 170, height: 40, outline: "none" }}
            onChange={(value) =>
              handlePastPregnancyDataChange("gravidaNumber", value)
            }
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
              { value: "6", label: "6" },
              { value: "7", label: "7" },
              { value: "8", label: "8" },
              { value: "9", label: "9" },
            ]}
            placeholder="Select"
            className="custom-select"
            value={pastPregnancyData?.gravidaNumber}
            allowClear
          />
        </div>
        <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Select
            style={{ width: 170, height: 40 }}
            onChange={(value) =>
              handlePastPregnancyDataChange("outcome", value)
            }
            options={[
              { value: "Live", label: "Live" },
              { value: "Still birth", label: "Still birth" },
              { value: "Ectopic", label: "Ectopic" },
              { value: "Abortion", label: "Abortion" },
            ]}
            placeholder="Select"
            className="custom-select"
            value={pastPregnancyData?.outcome}
            allowClear
          />
        </div>

        {["Live", "Still birth"].includes(pastPregnancyData?.outcome) && (
          <>
            <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
              <Radio.Group value={pastPregnancyData.termLength}>
                <Radio.Button
                  value={"Term"}
                  onClick={() =>
                    handlePastPregnancyDataChange("termLength", "Term")
                  }
                  style={{
                    height: "41px",
                    padding: "5px 20px 0 20px",
                  }}
                  className="custom-radio-button"
                >
                  Term
                </Radio.Button>
                <Radio.Button
                  value={"Preterm"}
                  onClick={() =>
                    handlePastPregnancyDataChange("termLength", "Preterm")
                  }
                  style={{
                    height: "41px",
                    padding: "5px 20px 0 20px",
                  }}
                  className="custom-radio-button"
                >
                  Pre term
                </Radio.Button>
              </Radio.Group>
            </div>
            <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
              <Select
                style={{ width: 170, height: 40 }}
                onChange={(value) =>
                  handlePastPregnancyDataChange("deliveryMode", value)
                }
                options={[
                  { value: "FTND", label: "FTND" },
                  { value: "LSCS", label: "LSCS" },
                  { value: "PTVD", label: "PTVD" },
                ]}
                placeholder="Select"
                className="custom-select"
                value={pastPregnancyData.deliveryMode}
                allowClear
              />
            </div>
            <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
              <DatePicker
                key={"dateOfDelivery"}
                onChange={(date) => {
                  const formattedDate = date.format("YYYY-MM-DD");
                  handlePastPregnancyDataChange(
                    "dateOfDelivery",
                    formattedDate
                  );
                }}
                disabledDate={disabledDate}
                style={{ width: "170px", height: "41px" }}
                value={
                  pastPregnancyData.dateOfDelivery
                    ? dayjs(moment(pastPregnancyData.dateOfDelivery))
                    : ""
                }
                allowClear={false}
                format={{
                  format: "DD-MM-YYYY",
                  type: "mask",
                }}
              />
            </div>
            <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
              <Radio.Group value={pastPregnancyData.gender}>
                <Radio.Button
                  value={"Male"}
                  onClick={() =>
                    handlePastPregnancyDataChange("gender", "Male")
                  }
                  style={{
                    width: "85px",
                    height: "41px",
                    padding: "5px 0 0 20px",
                  }}
                  className="custom-radio-button"
                >
                  Male
                </Radio.Button>
                <Radio.Button
                  value={"Female"}
                  onClick={() =>
                    handlePastPregnancyDataChange("gender", "Female")
                  }
                  style={{
                    width: "85px",
                    height: "41px",
                    padding: "5px 0 0 20px",
                  }}
                  className="custom-radio-button"
                >
                  Female
                </Radio.Button>
              </Radio.Group>
            </div>
            <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5 w-100">
              <Input
                className="inputheight41-group"
                placeholder="Enter"
                inputMode="numeric"
                value={pastPregnancyData.babysWeight || ""}
                addonAfter={"Kgs"}
                onChange={(e) =>
                  isDecimalCheck(e) &&
                  handlePastPregnancyDataChange("babysWeight", e.target.value)
                }
              />
            </div>
          </>
        )}
        {["Ectopic", "Abortion"].includes(pastPregnancyData.outcome) && (
          <>
            <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5 w-100">
              <Input
                className="inputheight41-group"
                placeholder="Enter"
                inputMode="numeric"
                value={pastPregnancyData.gestationPeriod || ""}
                addonAfter={"weeks"}
                onChange={(e) =>
                  isNumberCheck(e) &&
                  handlePastPregnancyDataChange(
                    "gestationPeriod",
                    e.target.value
                  )
                }
              />
            </div>
            {pastPregnancyData.outcome === "Ectopic" && (
              <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
                <Select
                  style={{ width: 170, height: 40 }}
                  onChange={(value) =>
                    handlePastPregnancyDataChange("location", value)
                  }
                  options={[
                    { value: "Left tube", label: "Left tube" },
                    { value: "Right tube", label: "Right tube" },
                    { value: "Others", label: "Others" },
                  ]}
                  placeholder="Select"
                  className="custom-select"
                  value={pastPregnancyData.location}
                  allowClear
                />
              </div>
            )}
            {pastPregnancyData.outcome === "Abortion" && (
              <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
                <Select
                  style={{ width: 170, height: 40 }}
                  onChange={(value) =>
                    handlePastPregnancyDataChange("typeOfAbortion", value)
                  }
                  options={[
                    { value: "Missed abortion", label: "Missed abortion" },
                    { value: "Spontaneous", label: "Spontaneous" },
                    { value: "Induce", label: "Induce" },
                    { value: "Recurrent", label: "Recurrent" },
                  ]}
                  placeholder="Select"
                  className="custom-select"
                  value={pastPregnancyData.typeOfAbortion}
                  allowClear
                />
              </div>
            )}
            <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
              <Radio.Group
                value={
                  pastPregnancyData.outcome === "Abortion"
                    ? pastPregnancyData.modeOfAbortion
                    : pastPregnancyData.modeOfManagement
                }
              >
                <Radio.Button
                  value={"Medical"}
                  onClick={() =>
                    handlePastPregnancyDataChange(
                      pastPregnancyData.outcome === "Abortion"
                        ? "modeOfAbortion"
                        : "modeOfManagement",
                      "Medical"
                    )
                  }
                  style={{
                    height: "41px",
                    padding: "5px 20px 0 20px",
                  }}
                  className="custom-radio-button"
                >
                  Medical
                </Radio.Button>
                <Radio.Button
                  value={"Surgical"}
                  onClick={() =>
                    handlePastPregnancyDataChange(
                      pastPregnancyData.outcome === "Abortion"
                        ? "modeOfAbortion"
                        : "modeOfManagement",
                      "Surgical"
                    )
                  }
                  style={{
                    height: "41px",
                    padding: "5px 20px 0 20px",
                  }}
                  className="custom-radio-button"
                >
                  Surgical
                </Radio.Button>
              </Radio.Group>
            </div>
          </>
        )}
      </div>
    );
  }, [pastPregnancyData]);

  const closeBtnHandler = () => {
    if (isDataAddedOrEdited) {
      toggleDeletePopup();
    } else {
      close();
    }
  };

  return (
    <>
      <Card bordered={false} className="search-modalCard">
        <div
          className="modalCard-header h-60 align-items-center justify-content-between d-flex"
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 2,
          }}
        >
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={closeBtnHandler}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">Past pregnancy details</div>
          </div>
          <Button
            onClick={addPastPregnancyData}
            className="btn btn-primary3 btn-41 px-4 me-20"
            disabled={
              !pastPregnancyData.gravidaNumber || !pastPregnancyData.outcome
            }
          >
            Done
          </Button>
        </div>

        <div className="p-20">
          <div className="past-pregnancy-wrapper">
            <div className="past-pregnancy-wrap-body past-pregnancy-parent-width">
              <div className="past-pregnancy-head">Parameter</div>
              <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5">
                Gravida number
              </div>
              <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5">
                Outcome
              </div>
              {["Live", "Still birth"].includes(pastPregnancyData.outcome) && (
                <>
                  <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5">
                    Term length
                  </div>
                  <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5">
                    Delivery mode
                  </div>
                  <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5">
                    Date of delivery
                  </div>
                  <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5">
                    Gender
                  </div>
                  <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5">
                    Baby's weight
                  </div>
                </>
              )}
              {["Ectopic", "Abortion"].includes(pastPregnancyData.outcome) && (
                <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5">
                  Period of GA
                </div>
              )}
              {pastPregnancyData.outcome === "Ectopic" && (
                <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5">
                  Location
                </div>
              )}
              {pastPregnancyData.outcome === "Abortion" && (
                <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5">
                  Type of abortion
                </div>
              )}
              {["Ectopic", "Abortion"].includes(pastPregnancyData.outcome) && (
                <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5">
                  Mode of{" "}
                  {pastPregnancyData.outcome === "Ectopic"
                    ? "Management"
                    : "abortion"}
                </div>
              )}
            </div>
            <div
              ref={scrollContainerRef}
              className="d-flex overflow-x-auto scrollvitals"
            >
              {TABLE_PAST_PREGNANCY}
            </div>
          </div>
          {!!pastPregnancyData.outcome && (
            <>
              <div className="remarks px-2 py-2">Note</div>
              <div className="remarks px-2 py-2">
                <Input.TextArea
                  placeholder="Enter remarks"
                  className="textareaPlaceholder"
                  rows={3}
                  value={pastPregnancyData.remarks}
                  onChange={(e) =>
                    handlePastPregnancyDataChange("remarks", e.target.value)
                  }
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </>
  );
}

export default React.memo(PastPregnancy);
