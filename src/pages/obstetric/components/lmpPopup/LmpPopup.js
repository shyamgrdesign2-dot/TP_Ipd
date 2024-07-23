import { Button, DatePicker, Modal } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import "./LmpPopup.scss";

const LmpPopup = ({ handleDrawerObstetric, lmpDate, setLmpDate, setShowLmpPopup }) => {
  
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
              dropdownClassName="addDOB-picker-dropdown"
              onChange={(_, d) => {
                setLmpDate(d);
                setContinueBtnDisabled(false);
              }}
              format="DD-MM-YYYY"
              value={lmpDate ? dayjs(lmpDate, "DD-MM-YYYY") : ""}
              style={{
                height: "38px",
                width: "374px",
              }}
              allowClear={false}
              disabledDate={(current) => current && current > dayjs()}
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
