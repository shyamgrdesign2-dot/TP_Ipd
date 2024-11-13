import { Button } from "antd";
import apexAI from "../assets/images/apexAI.svg";
import newTag from "../assets/images/new-gif.gif";

const ApexAIPopup = ({ setShowApexPopup, handleDDxKnowMore }) => {
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
        <img className="me-3" src={apexAI} alt="apex-AI" />
        <div style={{ fontSize: 16, fontWeight: 500 }}>
          <div className="d-flex align-items-center">
            AI-Powered Differential Diagnosis (DDx){" "}
            <img
              style={{ marginLeft: 10 }}
              src={newTag}
              alt="new-tag"
              width={39}
              height={16}
            />
          </div>
          <div className="know-more-txt" onClick={handleDDxKnowMore}>
            Know More
          </div>
        </div>
      </div>
      <Button
        type="text"
        className="btn btn-delete-prescription focus-none h-100"
        style={{ padding: 5 }}
        onClick={() => setShowApexPopup(false)}
      >
        <i className="icon-Cross fs-3" style={{ color: "#A461D8" }} />
      </Button>
    </div>
  );
};

export default ApexAIPopup;
