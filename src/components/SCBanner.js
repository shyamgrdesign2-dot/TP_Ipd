import { Button } from "antd";
import speak from "../assets/images/speak.svg";
import { useDispatch } from "react-redux";
import { setShowSCPopup } from "../redux/ddxSlice";

const SCBanner = ({ handleBanner }) => {
  const dispatch = useDispatch();
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{
        border: "1px solid #E2E2EA",
        borderRadius: 16,
        padding: "8px 12px 8px 18px",
        marginBottom: 20,
      }}
    >
      <div className="d-flex w-100">
        <div style={{ fontSize: 16 }}>
          <div className="d-flex align-items-center">
            <img src={speak} alt="speak" className="me-2" />
            <span>
              Hey! You’ve received <b style={{ fontWeight: 600 }}>symptoms</b>{" "}
              and <b style={{ fontWeight: 600 }}>medical history</b> details
              from the
            </span>
            patient.
            <span
              className="theme-color cursor-pointer"
              style={{ textDecoration: "underline", marginLeft: 5 }}
              onClick={() => dispatch(setShowSCPopup(true))}
            >
              View now
            </span>
          </div>
        </div>
      </div>
      <Button
        type="text"
        className="btn btn-delete-prescription focus-none h-100"
        style={{ padding: 5 }}
        onClick={handleBanner}
      >
        <i className="icon-Cross fs-3" />
      </Button>
    </div>
  );
};

export default SCBanner;
