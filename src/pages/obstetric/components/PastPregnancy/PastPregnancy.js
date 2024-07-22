import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Tooltip,
  Select,
  Radio,
  Divider,
} from "antd";
import { errorMessage, onlyDecimalFormat } from "../../../../utils/utils";

import CashManagerContext from "../../../../context/CashManagerContext";
import moment from "moment";
import SuccessPopup from "../../../growthChart/components/SuccessPopup";
import { useDispatch, useSelector } from "react-redux";
import "./pastPregnancy.scss";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { addObstetricData, updateObstetricData } from "../../service";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../../utils/constants";
import { jwtDecode } from "jwt-decode";

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM, YY";

const OBS = {
  _id: "66867285cdbebbe52109f4d2",
  patientId: 897,
  lmp: "2023-01-01T00:00:00.000Z",
  edd: "2023-10-08T00:00:00.000Z",
  ceed: "2023-10-15T00:00:00.000Z",
  gestationWeeks: 38,
  gestationDays: 2,
  blood: "A+",
  husbandsBlood: "B+",
  consang: true,
  maritialStatus: "Married",
  marriageDurationYears: 2,
  marriageDurationMonths: 3,
  conceptionType: "natural",
  gravidity: 2,
  parity: 2,
  livingChildren: 2,
  abortion: 1,
  ectopicPregnancies: 1,
  diagnosisNotes: "",
  pregnancyHistory: [
    {
      gravidaNumber: 1,
      termLength: "Term",
      outcome: "Live",
      deliveryMode: "NVD",
      dateOfDelivery: "2021-09-15T00:00:00.000Z",
      gender: "Male",
      babysWeight: 3.5,
      gestationPeriod: 2,
      remarks: "Healthy baby",
      createdAt: "2024-06-27T09:13:23.899Z",
      createdBy: 64,
      modifiedAt: "2024-06-27T09:13:23.899Z",
      modifiedBy: 64,
    },
    {
      gravidaNumber: 2,
      termLength: "Preterm",
      outcome: "Ectopic",
      monthOfPregnancy: 4,
      location: "Left Tube",
      remarks: "Healthy baby",
      createdAt: "2024-06-27T09:13:23.899Z",
      createdBy: 64,
      modifiedAt: "2024-06-27T09:13:23.899Z",
      modifiedBy: 64,
    },
    {
      gravidaNumber: 3,
      termLength: "Pre-term",
      outcome: "Abortion",
      monthOfPregnancy: 3,
      typeOfAbortion: "Inevitable",
      modeOfAbortion: "Surgical",
      remarks: "Had extreme pain for one week after the pregrancy.",
      createdAt: "2024-06-27T09:13:23.899Z",
      createdBy: 64,
      modifiedAt: "2024-06-27T09:13:23.899Z",
      modifiedBy: 64,
    },
  ],
  examinationHistory: [
    {
      date: "2023-06-01T00:00:00.000Z",
      pallor: false,
      oedema: false,
      mothersWeight: 70,
      mothersHeight: 150,
      mothersBMI: 25,
      systolic: 120,
      diastolic: 80,
      heightOfFundus: 35,
      heightOfFundusUnit: "cms",
      presentation: "Cephalic",
      foetalHeartRate: 140,
      fluidIndex: 4,
      notes: "Normal examination",
      createdAt: "2024-06-27T09:13:23.899Z",
      createdBy: 64,
      modifiedAt: "2024-06-27T09:13:23.899Z",
      modifiedBy: 64,
    },
  ],
  createdAt: "2024-06-27T09:13:23.899Z",
  createdBy: 64,
  modifiedAt: "2024-06-27T09:13:23.899Z",
  modifiedBy: 64,
  deleted: false,
  __v: 0,
};

function PastPregnancy({ close, obsDetails = OBS }) {
  const scrollContainerRef = useRef(null);
  const inputRef = useRef([]);

  const { patient_data } = useContext(CashManagerContext);
  const [pastPregnancyData, setPastPregnancyData] = useState({
    gravidaNumber: "",
    termLength: "",
    outcome: "",
    deliveryMode: "",
    dateOfDelivery: "",
    gender: "",
    babysWeight: "",
    remarks: "",
  });
  const [dateString, setDateString] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

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

  const deleteExaminationData = (index) => {
    setPastPregnancyData((prevData) => prevData.filter((_, i) => i !== index));
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
    const payload = {
      ...obsDetails,
      ...pastPregnancyData,
      createdAt: new Date().toISOString(),
      createdBy: decodedToken?.result?.user_id,
      modifiedAt: new Date().toISOString(),
      modifiedBy: decodedToken?.result?.user_id,
    };
    setLoader(true);
    const addPastPregnancyRes = payload?._id
      ? await updateObstetricData(payload?._id, payload)
      : await addObstetricData(payload);
    console.log({ addPastPregnancyRes });
    setLoader(false);
    if ([200, 201].includes(addPastPregnancyRes?.status)) {
      setShowSuccess(true);
      setTimeout(() => {
        close();
      }, 1000);
    } else {
      errorMessage(addPastPregnancyRes?.message || "Error while adding data");
    }
  };

  const TABLE_PAST_PREGNANCY = useMemo(() => {
    return (
      <div className="past-pregnancy-wrap-body past-pregnancy-child-width">
        <div className="past-pregnancy-head rounded-start-0 w-100">
          Values
          <div>
            <Tooltip
              trigger={"click"}
              placement="bottom"
              title={
                <div
                  className="tooltip-content"
                  onClick={() => deleteExaminationData()}
                >
                  <DeleteOutlined style={{ marginRight: 8 }} />
                  <span>Delete</span>
                </div>
              }
              overlayClassName="custom-tooltip"
            >
              <EllipsisOutlined className="vertical-dots" />
            </Tooltip>
          </div>
        </div>
        <div className="past-pregnancy-row past-pregnancy-row-40 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={pastPregnancyData.gravidaNumber}
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
          />
        </div>

        {["Live", "Still birth"].includes(pastPregnancyData.outcome) && (
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
                />
              </div>
            )}
            <div className="past-pregnancy-row past-pregnancy-row-60 d-flex align-items-center px-2 py-5 w-100">
              <Radio.Group value={pastPregnancyData.modeOfAbortion}>
                <Radio.Button
                  value={"Medical"}
                  onClick={() =>
                    handlePastPregnancyDataChange("modeOfAbortion", "Medical")
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
                    handlePastPregnancyDataChange("modeOfAbortion", "Surgical")
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
            disabled={loader}
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
