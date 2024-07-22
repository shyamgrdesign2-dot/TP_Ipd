import React, { useState, useContext, useMemo, useRef } from "react";
import { Button, Card, DatePicker, Input, Tooltip, Select, Radio } from "antd";
import { errorMessage } from "../../../../utils/utils";
import dayjs from "dayjs";

import CashManagerContext from "../../../../context/CashManagerContext";
import moment from "moment";
import SuccessPopup from "../../../growthChart/components/SuccessPopup";
import "./examination.scss";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { addObstetricData, updateObstetricData } from "../../service";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../../utils/constants";
import { jwtDecode } from "jwt-decode";

const dateFormat = "YYYY-MM-DD";
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

function Examination({ close, obsDetails = OBS }) {
  const scrollContainerRef = useRef(null);
  const { patient_data } = useContext(CashManagerContext);
  const [examinationData, setExaminationData] = useState({
    date: moment().format(dateFormat),
    pallor: false,
    oedema: false,
    mothersWeight: "",
    systolic: "",
    diastolic: "",
    heightOfFundus: "",
    heightOfFundusUnit: "",
    presentation: "",
    foetalHeartRate: "",
    notes: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleExaminationDataChange = (field, value) => {
    let bmi;
    if (field === "mothersWeight") {
      bmi = calculate(examinationData.mothersHeight, value);
    } else if (field === "mothersHeight") {
      bmi = calculate(value, examinationData.mothersWeight);
    }
    setExaminationData((prevData) => {
      const newData = {
        ...prevData,
        [field]: value,
        ...(["mothersWeight", "mothersHeight"].includes(field) && {
          ...bmi,
        }),
        modifiedAt: new Date().toISOString(),
      };
      return newData;
    });
  };

  const deleteExaminationData = (index) => {
    setExaminationData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  const addExaminationData = async () => {
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
      ...examinationData,
      createdAt: new Date().toISOString(),
      createdBy: decodedToken?.result?.user_id,
      modifiedAt: new Date().toISOString(),
      modifiedBy: decodedToken?.result?.user_id,
    };
    setLoader(true);
    const addExaminationRes = payload?._id
      ? await updateObstetricData(payload?._id, payload)
      : await addObstetricData(payload);
    setLoader(false);
    console.log({ addExaminationRes });
    if ([200, 201].includes(addExaminationRes?.status)) {
      setShowSuccess(true);
      setTimeout(() => {
        close();
      }, 1000);
    } else {
      errorMessage(addExaminationRes?.message || "Error while adding data");
    }
  };

  function calculate(H, W) {
    let height = 0,
      weight = 0,
      bmi = "";

    if (H != "" && H != 0) {
      height = parseFloat(H);
    } else {
      height = 0;
    }

    if (W != "" && W != 0) {
      weight = parseFloat(W);
    } else {
      weight = 0;
    }

    const calBMI = (weight / height / height) * 10000;
    bmi = weight && height ? (isFinite(calBMI) ? calBMI.toFixed(2) : "") : "";

    return { bmi };
  }

  const TABLE_EXAMINATION = useMemo(() => {
    return (
      <div className="examination-wrap-body examination-child-width">
        <div className="examination-head rounded-start-0 w-100">
          Visit1
          <div>
            <Tooltip
              trigger={"click"}
              placement="bottom"
              title={
                <div
                  className="tooltip-content"
                  onClick={() => deleteExaminationData()}
                >
                  <DeleteOutlined
                    style={{ marginRight: 8, color: "#4B4AD51A !important" }}
                  />
                  <span>Delete</span>
                </div>
              }
              overlayClassName="custom-tooltip"
            >
              <EllipsisOutlined className="vertical-dots" />
            </Tooltip>
          </div>
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <DatePicker
            key={"date"}
            onChange={(_, dateString) =>
              handleExaminationDataChange("date", dateString)
            }
            disabledDate={disabledDate}
            value={
              examinationData.date ? dayjs(moment(examinationData.date)) : ""
            }
            style={{ width: "170px", height: "41px" }}
            allowClear={false}
          />
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Radio.Group value={examinationData.pallor}>
            <Radio.Button
              value={true}
              onClick={() => handleExaminationDataChange("pallor", true)}
              style={{
                width: "85px",
                height: "41px",
                padding: "5px 0 0 30px",
              }}
              className="custom-radio-button"
            >
              Yes
            </Radio.Button>
            <Radio.Button
              value={false}
              onClick={() => handleExaminationDataChange("pallor", false)}
              style={{
                width: "85px",
                height: "41px",
                padding: "5px 0 0 30px",
              }}
              className="custom-radio-button"
            >
              No
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Radio.Group value={examinationData.oedema} style={{ width: 170 }}>
            <Radio.Button
              value={true}
              onClick={() => handleExaminationDataChange("oedema", true)}
              style={{
                width: "85px",
                height: "41px",
                padding: "5px 0 0 30px",
              }}
              className="custom-radio-button"
            >
              Yes
            </Radio.Button>
            <Radio.Button
              value={false}
              onClick={() => handleExaminationDataChange("oedema", false)}
              style={{
                width: "85px",
                height: "41px",
                padding: "5px 0 0 30px",
              }}
              className="custom-radio-button"
            >
              No
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="examination-row examination-row-40 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.mothersHeight}
            addonAfter={"Cms"}
            onChange={(e) =>
              handleExaminationDataChange("mothersHeight", e.target.value)
            }
          />
        </div>
        <div className="examination-row examination-row-40 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.mothersWeight}
            addonAfter={"Kgs"}
            onChange={(e) =>
              handleExaminationDataChange("mothersWeight", e.target.value)
            }
          />
        </div>
        <div className="examination-row examination-row-40 d-flex align-items-center px-2 py-5 w-100">
          <div className="fs-14 ">
            {`${
              examinationData.bmi
                ? parseFloat(examinationData.bmi).toFixed(2)
                : "--"
            } kg/m²`}
          </div>
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.systolic}
            addonAfter={"mmHg"}
            onChange={(e) =>
              handleExaminationDataChange("systolic", e.target.value)
            }
          />
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.diastolic}
            addonAfter={"mmHg"}
            onChange={(e) =>
              handleExaminationDataChange("diastolic", e.target.value)
            }
          />
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.heightOfFundus}
            onChange={(e) =>
              handleExaminationDataChange("heightOfFundus", e.target.value)
            }
          />
          <Radio.Group
            className="radio-group"
            value={examinationData.heightOfFundusUnit}
            onChange={(e) =>
              handleExaminationDataChange("heightOfFundusUnit", e.target.value)
            }
          >
            <Radio.Button
              className="radio-button first-radio-button"
              value="cms"
            >
              cms
            </Radio.Button>
            <Radio.Button className="radio-button" value="weeks">
              weeks
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Select
            style={{ width: 170, height: 40 }}
            onChange={(value) =>
              handleExaminationDataChange("presentation", value)
            }
            options={[
              { value: "Breech", label: "Breech" },
              { value: "Cephalic", label: "Cephalic" },
              { value: "Variable", label: "Variable" },
              { value: "Transverse", label: "Transverse" },
              { value: "EB", label: "EB" },
            ]}
            placeholder="Select"
            className="custom-select"
          />
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.fluidIndex}
            addonAfter={"Cms"}
            onChange={(e) =>
              handleExaminationDataChange("fluidIndex", e.target.value)
            }
          />
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.foetalHeartRate}
            addonAfter={"Bpm"}
            onChange={(e) =>
              handleExaminationDataChange("foetalHeartRate", e.target.value)
            }
          />
        </div>
      </div>
    );
  }, [examinationData]);

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
            <div className="modal-title">Examination</div>
          </div>
          <Button
            onClick={addExaminationData}
            className="btn btn-primary3 btn-41 px-4 me-20"
            loading={loader}
            disabled={loader}
          >
            Done
          </Button>
        </div>

        <div className="p-20">
          <div className="examination-wrapper">
            <div className="examination-wrap-body examination-parent-width">
              <div className="examination-head">Parameter</div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Date
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Pallor
              </div>
              <div className="examination-row examination-row-40 d-flex align-items-center px-2 py-5">
                Oedema
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Mother's height
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Mother's weight
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                BMI
                <Tooltip
                  placement="right"
                  title="Body mass index will be auto-calculated by entering Height and Weight"
                >
                  <i className="icon-info ms-1"></i>
                </Tooltip>
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Systolic
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Diastolic
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Height of fundus
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Presentation
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Amniotic fluid index
              </div>
              <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5">
                Fetal heart rate
              </div>
            </div>
            <div
              ref={scrollContainerRef}
              className="d-flex overflow-x-auto scrollvitals"
            >
              {TABLE_EXAMINATION}
            </div>
          </div>
          <div className="remarks px-2 py-2">Note</div>
          <div className="remarks px-2 py-2">
            <Input.TextArea
              placeholder="Enter remarks"
              className="textareaPlaceholder"
              rows={3}
              value={examinationData.notes}
              onChange={(e) =>
                handleExaminationDataChange("notes", e.target.value)
              }
            />
          </div>
        </div>
      </Card>
      <SuccessPopup show={showSuccess} setShow={setShowSuccess} />
    </>
  );
}

export default React.memo(Examination);
