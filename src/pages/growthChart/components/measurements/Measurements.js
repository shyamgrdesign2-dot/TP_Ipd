import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { Button, Card, DatePicker, Input, Tooltip } from "antd";
import { errorMessage, onlyDecimalFormat } from "../../../../utils/utils";

import CashManagerContext from "../../../../context/CashManagerContext";
import moment from "moment";
import { addGrowthChartParam } from "../../service";
import SuccessPopup from "../SuccessPopup";

const dateFormat = "YYYY-MM-DD";
const showDateFormat = "DD MMM, YY";

function Measurements(props) {
  const scrollContainerRef = useRef(null);
  const inputRef = useRef([]);

  const { handleDrawerMeasurements } = props;

  const { patient_data } = useContext(CashManagerContext);
  const [measurementsData, setMeasurementsData] = useState([]);
  const [dateString, setDateString] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (measurementsData.length === 0) {
      let cal = calculate("", "");
      measurementsData.push({
        date: moment().format(dateFormat),
        dev_unique_id: 0,
        tcv_id: 0,
        tcbc_id: 0,
        temp: "",
        pres: "",
        resp_rate: "",
        systolic: "",
        diastolic: "",
        spo2: "",
        height: "",
        weight: "",
        ofc: "",
        bmi: cal.bmi,
        bmr: cal.bmr,
        bsa: cal.bsa,
      });
      setMeasurementsData((prev) => [...prev]);
    }
  }, [measurementsData]);

  const onChange = useCallback(
    (date, dateString) => {
      let cal = calculate("", "");
      setDateString(dateString);
      measurementsData.push({
        date: dateString,
        dev_unique_id: 0,
        tcv_id: 0,
        tcbc_id: 0,
        temp: "",
        pres: "",
        resp_rate: "",
        systolic: "",
        diastolic: "",
        spo2: "",
        height: "",
        weight: "",
        ofc: "",
        bmi: cal.bmi,
        bmr: cal.bmr,
        bsa: cal.bsa,
      });
      setMeasurementsData((prev) => [...prev]);
    },
    [measurementsData]
  );

  useEffect(() => {
    if (scrollContainerRef.current) {
      // const scrollWidth = scrollContainerRef.current.scrollWidth;
      // scrollContainerRef.current.scrollLeft = scrollWidth;
      const data = measurementsData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const index = data.findLastIndex((e) => e.date == dateString);
      if (index !== -1) {
        inputRef.current[index].focus();
        const scrollWidth = index;
        scrollContainerRef.current.scrollLeft = scrollWidth * 180;
      }
    }
  }, [measurementsData.length]);

  const calculate = (H, W) => {
    var height = 0,
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
  };

  const onChangeInput = useCallback(
    (value, i, flag) => {
      const updateValue = onlyDecimalFormat(value);
      if (flag === 1) {
        measurementsData[i].height = updateValue;
        let cal = calculate(updateValue, measurementsData[i].weight);
        measurementsData[i].bmi = cal.bmi;
      } else if (flag === 2) {
        measurementsData[i].weight = updateValue;
        let cal = calculate(measurementsData[i].height, updateValue);
        measurementsData[i].bmi = cal.bmi;
      } else if (flag === 3) {
        measurementsData[i].ofc = updateValue;
      }
      setMeasurementsData((prev) => [...prev]);
    },
    [measurementsData]
  );

  const onAddGrowthData = async () => {
    const result = measurementsData.map(async (vitalItem) => {
      const payload = {
        date: vitalItem.date,
        height: vitalItem.height,
        weight: vitalItem.weight,
        bmi: vitalItem.bmi,
        ofc: vitalItem.ofc,
        pm_id: patient_data?.pm_id || 0,
        pm_pid: patient_data?.pm_pid || 0,
        patient_unique_id: patient_data?.patient_unique_id || 0,
        pam_id: patient_data?.pam_id || 0,
      };
      return await addGrowthChartParam(payload);
    });
    const updateGrowthRes = await Promise.all(result);
    if (updateGrowthRes?.every((res) => res?.tcbc_id)) {
      setShowSuccess(true);
      setTimeout(() => {
        handleDrawerMeasurements();
      }, 1000);
    }
  };

  const TABLE_MEASUREMENTS = useMemo(() => {
    return (
      measurementsData.length > 0 &&
      measurementsData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((item, i) => {
          return (
            <div key={i} className="vitals-wrap-body w-100 vitals-child-width">
              <div className="vitals-head rounded-start-0 w-100">
                {moment(item.date).format(showDateFormat)}
              </div>
              <div className="vitals-row vitals-row-60 d-flex align-items-center px-2 w-100">
                <Input
                  ref={(el) => (inputRef.current[i] = el)}
                  className="inputheight41-group focused"
                  placeholder="Enter"
                  inputMode="numeric"
                  value={item.height}
                  addonAfter={"cms"}
                  onChange={(e) => onChangeInput(e.target.value, i, 1)}
                />
              </div>
              <div className="vitals-row vitals-row-60 d-flex align-items-center px-2 w-100">
                <Input
                  className="inputheight41-group"
                  placeholder="Enter"
                  inputMode="numeric"
                  value={item.weight}
                  addonAfter={"kgs"}
                  onChange={(e) => onChangeInput(e.target.value, i, 2)}
                />
              </div>
              <div className="vitals-row vitals-row-40 d-flex align-items-center px-2 w-100">
                <div className="fs-14 ">{`${
                  item.bmi != "" ? parseFloat(item.bmi).toFixed(2) : "--"
                } kg/m²`}</div>
              </div>

              <div className="vitals-row vitals-row-60 d-flex align-items-center px-2 w-100">
                <Input
                  className="inputheight41-group"
                  placeholder="Enter"
                  inputMode="numeric"
                  value={item.ofc}
                  addonAfter={"cms"}
                  onChange={(e) => onChangeInput(e.target.value, i, 3)}
                />
              </div>
            </div>
          );
        })
    );
  }, [measurementsData]);

  const disabledDate = (current) => {
    return current && current >= moment().add(1, "days").startOf("day");
  };

  return (
    <>
      <Card bordered={false} className="search-modalCard ">
        <div className="modalCard-header h-60 align-items-center justify-content-between d-flex">
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={handleDrawerMeasurements}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">Measurements</div>
          </div>
          <Button
            onClick={onAddGrowthData}
            className="btn btn-primary3 btn-41 px-4 me-20"
            loading={false}
            disabled={measurementsData.length > 0 ? false : true}
          >
            Done
          </Button>
        </div>
        <div className="align-items-center d-flex justify-content-between px-20 py-3">
          <div className="position-relative">
            <Button className="btn btn-primary2 btn-41">Add New Date</Button>
            <DatePicker
              key={Math.random()}
              suffixIcon={null}
              inputReadOnly
              onChange={onChange}
              disabledDate={disabledDate}
              className="calender-vitals w-100 h-100"
            />
          </div>
        </div>
        {measurementsData.length > 0 && (
          <div className="px-20">
            <div className="vitals-wrapper w-100">
              <div className="vitals-wrap-body vitals-parent-width">
                <div className="vitals-head">Name</div>
                <div className="vitals-row vitals-row-60 d-flex align-items-center px-2">
                  Height
                </div>
                <div className="vitals-row vitals-row-60 d-flex align-items-center px-2">
                  Weight
                </div>
                <div className="vitals-row vitals-row-40 d-flex align-items-center px-2">
                  BMI
                  <Tooltip
                    placement="right"
                    title="Body mass index will be auto-calculated by entering Height and Weight"
                  >
                    <i className="icon-info ms-1"></i>
                  </Tooltip>
                </div>
                <div className="vitals-row vitals-row-60 d-flex align-items-center px-2">
                  OFC
                </div>
              </div>
              <div
                ref={scrollContainerRef}
                className="d-flex overflow-x-auto scrollvitals w-100"
              >
                {TABLE_MEASUREMENTS}
              </div>
            </div>
          </div>
        )}
      </Card>
      <SuccessPopup show={showSuccess} setShow={setShowSuccess} />
    </>
  );
}

export default React.memo(Measurements);
