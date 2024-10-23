import { Button } from "antd";
import alertIcon from "../assets/images/alertIcon.svg";
import arrow from "../assets/images/shaded-arrow.svg";

const DifferentialDiagnosis = () => {
  return (
    <div className="d-flex" style={{ padding: "20px 0" }}>
      <div>
        <img className="me-3" src={alertIcon} alt="Warning" />
      </div>
      <div
        className="d-flex flex-column"
        style={{
          background: "rgba(119, 66, 254, 0.08)",
          borderRadius: 12,
          padding: "17px 20px",
        }}
      >
        <div>Differential Diagnosis</div>
        <div>
          Enter key symptoms and patient history to generate a list of possible
          diagnoses and recommended tests for confirmation. Ensure accurate data
          for best results.
        </div>
        <div
          className="d-flex align-items-center"
          style={{ padding: "0 8px", marginTop: 16, columnGap: 16 }}
        >
          <div style={{ width: "160px" }}>
            <Button
              type="primary"
              className="btn d-flex w-100 align-items-center justify-content-center btn-41"
            >
              <i className="icon-Add me-2 fs-21"></i>
              Generate DDx
            </Button>
          </div>
          <div className="d-flex align-items-center" style={{ columnGap: 8 }}>
            <div className="text-primary" style={{ fontWeight: 600 }}>
              Know More About DDx
            </div>
            <img src={arrow} alt="arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifferentialDiagnosis;
