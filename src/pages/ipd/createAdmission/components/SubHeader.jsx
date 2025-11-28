import { Button } from "antd";
import "../../inPatients/components/SubHeader.scss";
import { defaultIcons } from "../../../../assets/images/icons";
import { useNavigate } from "react-router-dom";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { GB_NEW_IPD_ZYDUS } from "../../../../utils/constants";

const SubHeader = ({
  headerTitle,
  showConfirmAdmissionButton = true,
  onConfirmAdmissionClick,
  isConfirmDisabled = false,
  helperMessage = "",
  onDisabledClick,
}) => {

  const navigate = useNavigate();

  return (
    <div className="sub-header">
      <div className="sub-header-content d-flex gap-1">
        <i
          className="icon-right"
          onClick={() => navigate(-1)}
          style={{
            display: "block",
            color: "white",
            fontSize: "2rem",
          }}
        />
        {headerTitle}
      </div>
      {showConfirmAdmissionButton && (
        <div className="sub-header-actions">
          <Button
            type="primary"
            //   icon={<img src={defaultIcons.plusIcon} alt="+" />}
            onClick={(e) => {
              if (isConfirmDisabled) {
                onDisabledClick?.();
                return;
              }
              onConfirmAdmissionClick?.(e);
            }}
            className={`add-admission-button ${
              isConfirmDisabled ? "is-disabled glass-button" : ""
            }`}
            // disabled={isConfirmDisabled}
          >
            Confirm Admission
          </Button>
          {/* {helperMessage && (
            <div className="sub-header-helper">{helperMessage}</div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default SubHeader;
