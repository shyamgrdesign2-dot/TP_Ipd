import { Button } from "antd";
import apexAI from "../assets/images/apexAI.svg";

const ApexAIPopup = ({ setShowApexPopup }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{
        border: "1px solid #A461D8",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        backgroundColor: "#EFE9F3",
      }}
    >
      <div className="d-flex w-100">
        <img className="me-3" src={apexAI} alt="Warning" />
        <div style={{ fontSize: 16, fontWeight: 500 }}>
          <div>AI-Powered Differential Diagnosis (DDx)</div>
          <div className="know-more-txt">Know More</div>
        </div>
      </div>
      <Button
        type="text"
        className="btn btn-delete-prescription focus-none h-100"
        style={{ paddingRight: 0 }}
        onClick={() => setShowApexPopup(false)}
      >
        <i className="icon-Cross fs-3" style={{ color: "#A461D8" }} />
      </Button>
    </div>
  );
};

export default ApexAIPopup;
