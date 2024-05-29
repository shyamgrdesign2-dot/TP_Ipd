import { Button } from "antd";
import "./subHeader.scss";

const SubHeader = () => {
  return (
    <div className="d-flex justify-content-between align-items-center growthSubHeader p-0">
      <div>
        <Button
          type="button"
          className="btn-41 btn px-4 me-4 ant-btn-text btn-input align-items-center d-flex"
          //   onClick={previewBtnHandler}
          style={{ width: "172px", height: "60px" }}
          icon={<i className="icon-Add"></i>}
        >
          Add Measurements
        </Button>
      </div>
    </div>
  );
};

export default SubHeader;
