import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button, Card, DatePicker, Input, Tooltip, Select, Radio } from "antd";
import { errorMessage } from "../../../../utils/utils";
import dayjs from "dayjs";
import moment from "moment";
import SuccessPopup from "../../../growthChart/components/SuccessPopup";
import "./addExamination.scss";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { addObstetricData, updateObstetricData } from "../../service";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../../utils/constants";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { obstetricDetailsUpdated } from "../../../../redux/obstetricSlice";
import { isNumberCheck } from "../../utils/helper";

const dateFormat = "YYYY-MM-DD";

function AddExamination({ close, editIndex, getAllObstetricDetails }) {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const [examinationData, setExaminationData] = useState({
    date: moment().format(dateFormat),
    heightOfFundusUnit: "weeks",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loader, setLoader] = useState(false);
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const { examinationHistory = [] } = obstetricDetails;
  const { state } = useLocation();
  const { patient_data } = state;

  useEffect(() => {
    if (editIndex >= 0 && examinationHistory?.toReversed()?.[editIndex]) {
      setExaminationData({ ...examinationHistory?.toReversed()?.[editIndex] });
    }
  }, [editIndex]);

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
        [field]: value === prevData[field] ? undefined : value,
        ...(["mothersWeight", "mothersHeight"].includes(field) && {
          ...bmi,
        }),
        modifiedAt: new Date().toISOString(),
      };
      return newData;
    });
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
    let newExaminationHistory = [...examinationHistory].toReversed() || [];
    const data = {};
    Object.keys(examinationData).forEach((key) => {
      if (![undefined, null, ""].includes(examinationData[key])) {
        data[key] = examinationData[key];
      }
    });
    if (examinationHistory?.length > 0 && editIndex >= 0) {
      newExaminationHistory[editIndex] = {
        ...data,
        modifiedAt: new Date().toISOString(),
        modifiedBy: decodedToken?.result?.user_id,
      };
    } else {
      newExaminationHistory = [
        ...examinationHistory,
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
      ...(examinationHistory?.length > 0
        ? {
            modifiedAt: new Date().toISOString(),
            modifiedBy: decodedToken?.result?.user_id,
          }
        : obstetricDetails),
      examinationHistory: newExaminationHistory,
      createdAt: obstetricDetails?.createdAt || new Date().toISOString(),
      createdBy: obstetricDetails?.createdBy || decodedToken?.result?.user_id,
      modifiedAt: examinationHistory?.length
        ? new Date().toISOString()
        : obstetricDetails?.modifiedAt || new Date().toISOString(),
      modifiedBy: examinationHistory?.length
        ? decodedToken?.result?.user_id
        : obstetricDetails?.modifiedBy || decodedToken?.result?.user_id,
    };
    setLoader(true);
    const addExaminationRes = obstetricDetails?._id
      ? await updateObstetricData(obstetricDetails?.patientId, payload)
      : await addObstetricData(payload);
    setLoader(false);
    if (addExaminationRes?.data) {
      dispatch(obstetricDetailsUpdated());
      getAllObstetricDetails();
      setShowSuccess(true);
      setTimeout(() => {
        close();
      }, 1000);
    } else {
      errorMessage(addExaminationRes?.message || "Error while adding data");
    }
  };

  const deleteExaminationData = async () => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    let decodedToken;
    if (token) {
      try {
        decodedToken = jwtDecode(token);
      } catch (e) {
        console.log(e);
      }
    }
    let newExaminationHistory = [...examinationHistory].toReversed();
    if (editIndex >= 0) {
      newExaminationHistory.splice(editIndex, 1);
    }
    const payload = {
      patientId: patient_data.patient_unique_id,
      examinationHistory: newExaminationHistory,
      createdAt: obstetricDetails?.createdAt || new Date().toISOString(),
      createdBy: obstetricDetails?.createdBy || decodedToken?.result?.user_id,
      modifiedAt: examinationHistory?.length
        ? new Date().toISOString()
        : obstetricDetails?.modifiedAt || new Date().toISOString(),
      modifiedBy: examinationHistory?.length
        ? decodedToken?.result?.user_id
        : obstetricDetails?.modifiedBy || decodedToken?.result?.user_id,
    };
    const deleteExaminationRes = await updateObstetricData(
      obstetricDetails?.patientId,
      payload
    );
    if (deleteExaminationRes?.data) {
      getAllObstetricDetails();
      setShowSuccess(true);
      setTimeout(() => {
        close();
      }, 1000);
    } else {
      errorMessage(deleteExaminationRes?.message || "Error while adding data");
    }
  };

  function calculate(H, W) {
    let height = 0,
      weight = 0,
      mothersBMI = "";

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
    mothersBMI =
      weight && height ? (isFinite(calBMI) ? calBMI.toFixed(2) : "") : "";

    return { mothersBMI };
  }

  const TABLE_EXAMINATION = useMemo(() => {
    return (
      <div className="examination-wrap-body examination-child-width">
        <div className="examination-head rounded-start-0 w-100">
          Visit
          {editIndex >= 0 && (
            <div>
              <Tooltip
                trigger={"click"}
                placement="bottom"
                title={
                  <div
                    className="tooltip-content"
                    onClick={deleteExaminationData}
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
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <DatePicker
            key={"date"}
            onChange={(date) => {
              const formattedDate = date.format("YYYY-MM-DD");
              handleExaminationDataChange("date", formattedDate);
            }}
            disabledDate={disabledDate}
            value={
              examinationData.date ? dayjs(moment(examinationData.date)) : ""
            }
            style={{ width: "170px", height: "41px" }}
            allowClear={false}
            format={"DD MMM YYYY"}
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
            value={examinationData.mothersHeight || ""}
            addonAfter={"Cms"}
            onChange={(e) => {
              isNumberCheck(e) &&
                handleExaminationDataChange("mothersHeight", e.target.value);
            }}
          />
        </div>
        <div className="examination-row examination-row-40 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.mothersWeight || ""}
            addonAfter={"Kgs"}
            onChange={(e) =>
              isNumberCheck(e) &&
              handleExaminationDataChange("mothersWeight", e.target.value)
            }
          />
        </div>
        <div className="examination-row examination-row-40 d-flex align-items-center px-2 py-5 w-100">
          <div className="fs-14 ">
            {`${
              examinationData.mothersBMI
                ? parseFloat(examinationData.mothersBMI).toFixed(2)
                : "--"
            } kg/m²`}
          </div>
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.systolic || ""}
            addonAfter={"mmHg"}
            onChange={(e) =>
              isNumberCheck(e) &&
              handleExaminationDataChange("systolic", e.target.value)
            }
          />
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41-group"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.diastolic || ""}
            addonAfter={"mmHg"}
            onChange={(e) =>
              isNumberCheck(e) &&
              handleExaminationDataChange("diastolic", e.target.value)
            }
          />
        </div>
        <div className="examination-row examination-row-60 d-flex align-items-center px-2 py-5 w-100">
          <Input
            className="inputheight41"
            placeholder="Enter"
            inputMode="numeric"
            value={examinationData.heightOfFundus || ""}
            onChange={(e) =>
              isNumberCheck(e) &&
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
              value="cm"
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
            value={examinationData.presentation}
            allowClear
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
              isNumberCheck(e) &&
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
              isNumberCheck(e) &&
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

export default React.memo(AddExamination);
