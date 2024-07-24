import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button, Card, DatePicker, Input, Tooltip, Select, Radio } from "antd";
import { errorMessage } from "../../../../utils/utils";
import moment from "moment";
import SuccessPopup from "../../../growthChart/components/SuccessPopup";
import { useDispatch, useSelector } from "react-redux";
import "./pastPregnancy.scss";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { addObstetricData, updateObstetricData } from "../../service";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../../utils/constants";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { obstetricDetailsUpdated } from "../../../../redux/obstetricSlice";

function PastPregnancy({ close, editIndex, getAllObstetricDetails }) {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const [pastPregnancyData, setPastPregnancyData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loader, setLoader] = useState(false);
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
        [field]: value,
        modifiedAt: new Date().toISOString(),
      };
      return newData;
    });
  };

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  const addPastPregnancyData = async () => {
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
      patientId: patient_data.patient_unique_id,
      ...(pregnancyHistory?.length > 0 ? {} : obstetricDetails),
      pregnancyHistory: newPastPregnancy,
      createdAt: obstetricDetails?.createdAt || new Date().toISOString(),
      createdBy: obstetricDetails?.createdBy || decodedToken?.result?.user_id,
      modifiedAt: pregnancyHistory?.length
        ? new Date().toISOString()
        : obstetricDetails?.modifiedAt,
      modifiedBy: pregnancyHistory?.length
        ? decodedToken?.result?.user_id
        : obstetricDetails?.modifiedBy,
    };
    setLoader(true);
    const addPastPregnancyRes = obstetricDetails?._id
      ? await updateObstetricData(obstetricDetails?.patientId, payload)
      : await addObstetricData(payload);
    setLoader(false);
    if (addPastPregnancyRes?.data) {
      dispatch(obstetricDetailsUpdated());
      getAllObstetricDetails();
      setShowSuccess(true);
      setTimeout(() => {
        close();
      }, 1000);
    } else {
      errorMessage(addPastPregnancyRes?.message || "Error while adding data");
    }
  };

  const deletePastPregnancyData = async () => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    let decodedToken;
    if (token) {
      try {
        decodedToken = jwtDecode(token);
      } catch (e) {
        console.log(e);
      }
    }
    let newPastPregnancy = [...pregnancyHistory];
    if (editIndex >= 0) {
      newPastPregnancy.splice(editIndex, 1);
    }
    const payload = {
      patientId: patient_data.patient_unique_id,
      pregnancyHistory: newPastPregnancy,
      createdAt: obstetricDetails?.createdAt || new Date().toISOString(),
      createdBy: obstetricDetails?.createdBy || decodedToken?.result?.user_id,
      modifiedAt: pregnancyHistory?.length
        ? new Date().toISOString()
        : obstetricDetails?.modifiedAt,
      modifiedBy: pregnancyHistory?.length
        ? decodedToken?.result?.user_id
        : obstetricDetails?.modifiedBy,
    };
    const deletePastPregnancyRes = await updateObstetricData(
      obstetricDetails?.patientId,
      payload
    );
    if (deletePastPregnancyRes?.data) {
      getAllObstetricDetails();
      setShowSuccess(true);
      setTimeout(() => {
        close();
      }, 1000);
    } else {
      errorMessage(
        deletePastPregnancyRes?.message || "Error while adding data"
      );
    }
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
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={pastPregnancyData?.gravidaNumber}
            onChange={(e) =>
              handlePastPregnancyDataChange("gravidaNumber", e.target.value)
            }
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
                  { value: "NVD", label: "NVD" },
                  { value: "AVD", label: "AVD" },
                  { value: "CSEC", label: "CSEC" },
                  { value: "Others", label: "Others" },
                ]}
                placeholder="Select"
                className="custom-select"
                value={pastPregnancyData.deliveryMode}
              />
            </div>
            <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
              <DatePicker
                key={"dateOfDelivery"}
                inputReadOnly
                onChange={(_, dateString) =>
                  handlePastPregnancyDataChange("dateOfDelivery", dateString)
                }
                disabledDate={disabledDate}
                style={{ width: "170px", height: "41px" }}
                placement="bottom"
                value={
                  pastPregnancyData.dateOfDelivery
                    ? dayjs(moment(pastPregnancyData.dateOfDelivery))
                    : ""
                }
                allowClear={false}
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
                value={pastPregnancyData.babysWeight}
                addonAfter={"Kgs"}
                onChange={(e) =>
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
                value={pastPregnancyData.gestationPeriod}
                addonAfter={"weeks"}
                onChange={(e) =>
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

  return (
    <>
      <Card bordered={false} className="search-modalCard">
        <div className="modalCard-header h-60 align-items-center justify-content-between d-flex">
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={close}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">Past pregnancy details</div>
          </div>
          <Button
            onClick={addPastPregnancyData}
            className="btn btn-primary3 btn-41 px-4 me-20"
            loading={loader}
            disabled={
              loader ||
              !pastPregnancyData.gravidaNumber ||
              !pastPregnancyData.outcome
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
                />
              </div>
            </>
          )}
        </div>
      </Card>
      <SuccessPopup show={showSuccess} setShow={setShowSuccess} />
    </>
  );
}

export default React.memo(PastPregnancy);
