import { Button } from "antd";
import tatvaAi from "../assets/images/apexAI.svg";
import newTag from "../assets/images/new-gif.gif";

const TatvaAiBanner = ({ setShowTatvaAiPopup, handleTatvaAiKnowMore }) => {
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
        <img className="me-3" src={tatvaAi} alt="apex-AI" />
        <div style={{ fontSize: 16, fontWeight: 500 }}>
          <div className="d-flex align-items-center">
            Redefine Rx & Diagnosis with{" "}
            <b style={{ marginLeft: 5 }}>TatvaAI</b>
            <img
              style={{ marginLeft: 10 }}
              src={newTag}
              alt="new-tag"
              width={39}
              height={16}
            />
          </div>
          <div className="know-more-txt" onClick={handleTatvaAiKnowMore}>
            Know More
          </div>
        </div>
      </div>
      <Button
        type="text"
        className="btn btn-delete-prescription focus-none h-100"
        style={{ padding: 5 }}
        onClick={() => setShowTatvaAiPopup(false)}
      >
        <i className="icon-Cross fs-3" style={{ color: "#A461D8" }} />
      </Button>
    </div>
  );
};

export default TatvaAiBanner;
