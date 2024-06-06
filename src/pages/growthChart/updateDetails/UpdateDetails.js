import { Modal, DatePicker, Input, Button, Divider } from "antd";
import dayjs from "dayjs";
import "./updateDetails.scss";

export default function UpdateDetails({
  show,
  dob,
  setDob,
  onChange,
  setShow,
}) {
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      //   onChange(inputValue);
    }
  };
  const handleClose = () => {};

  return (
    <Modal
      width={"422px"}
      open={show}
      footer={null}
      closeIcon={null}
      title={
        <div>
          <div>Update Details</div>
          <hr style={{ borderTop: "1px solid #ccc" }} />
        </div>
      }
      onCancel={handleClose}
    >
      <div style={{ marginBottom: 20, marginTop: 20 }}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ marginBottom: 8 }} className="gc-label">
            Date of birth
          </label>
          <DatePicker
            placeholder="Select Date"
            dropdownClassName="addDOB-picker-dropdown"
            onChange={(_, d) => {
              //   setDob(d);
            }}
            format="DD-MM-YYYY"
            // value={dob ? dayjs(dob, "DD-MM-YYYY") : ""}
            style={{
              height: "38px",
              width: "374px",
            }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ marginBottom: 8 }} className="gc-label">
            Gestation Period
          </label>
          <div className="d-flex">
            <Input
              placeholder="Weeks"
              className="gc-input"
              style={{ marginRight: 30 }}
              onChange={handleChange}
            />
            <Input
              placeholder="Days"
              className="gc-input"
              onChange={handleChange}
            />
          </div>
        </div>
        <Divider dashed style={{ width: "100%" }} />
        <div>
          <label style={{ marginBottom: 8 }} className="gc-label">
            Mid parental height
          </label>
          <div className="d-flex">
            <div style={{ marginRight: 30 }}>
              <label style={{ marginBottom: 8 }} className="gc-label">
                Father
              </label>
              <Input
                placeholder="Ex : 160 cms"
                className="gc-input"
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ marginBottom: 8 }} className="gc-label">
                Mother
              </label>
              <Input
                placeholder="Ex : 160 cms"
                className="gc-input"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex">
        <Button
          style={{
            marginRight: 20,
            borderColor: "#4B4AD5",
          }}
          className="gc-btn"
          onClick={() => setShow(false)}
        >
          <span className="gc-btn-txt">Do it later</span>
        </Button>
        <Button
          className="gc-btn"
          type="primary"
          onClick={() => setShow(false)}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
}
