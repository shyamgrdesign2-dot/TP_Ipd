import { Button, DatePicker, Modal } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import "./LmpPopup.scss";
import { isBrowser } from "react-device-detect";

const LmpPopup = ({
  handleDrawerObstetric,
  lmpDate,
  setLmpDate,
  setShowLmpPopup,
}) => {
  const [isContinueBtnDisabled, setContinueBtnDisabled] = useState(true);

  const continueBtnHandler = () => {
    if (!isContinueBtnDisabled) {
      setShowLmpPopup(false);
    }
  };
  return (
    <Modal
      width={"422px"}
      open={true}
      footer={null}
      closeIcon={null}
      className={"lmpModal"}
      title={
        <div style={{ borderRadius: "24px" }}>
          <div style={{ padding: "20px 24px 0px 24px" }}>
            Enter Patient's LMP
          </div>
          <hr style={{ borderTop: "1px solid #ccc" }} />
        </div>
      }
    >
      <div style={{ padding: "0px 24px 20px 24px" }}>
        <div
          style={{
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <div style={{ marginBottom: 15 }}>
            <label style={{ marginBottom: 8 }} className="lmpLabel">
              LMP date <span className="mandatory">*</span>
            </label>
            <DatePicker
              placeholder="Select Date"
              onChange={(_, d) => {
                setLmpDate(d ? dayjs(d, "DD-MM-YYYY").toISOString() : "");
                setContinueBtnDisabled(false);
              }}
              format={{
                format: "DD-MM-YYYY",
                type: "mask",
              }}
              value={lmpDate ? dayjs(lmpDate) : ""}
              style={{
                height: "38px",
                width: "374px",
              }}
              disabledDate={(current) => current && current > dayjs()}
              inputReadOnly={!isBrowser}
            />
          </div>
        </div>
        <div className="d-flex">
          <Button
            style={{
              marginRight: 20,
              borderColor: "#4B4AD5",
            }}
            className="lmpBtn"
            onClick={handleDrawerObstetric}
          >
            <span className="lmpBtnTxt">Back</span>
          </Button>
          <Button
            className={`lmpBtn ${isContinueBtnDisabled ? "disabledBtn" : ""}`}
            type="primary"
            onClick={continueBtnHandler}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LmpPopup;
