import { Button } from "antd";
import { useRef, useState } from "react";
import "../../inPatients/components/SubHeader.scss";
import { defaultIcons } from "../../../../assets/images/icons";
import { useNavigate } from "react-router-dom";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { GB_NEW_IPD_ZYDUS } from "../../../../utils/constants";

const SubHeader = ({
  headerTitle,
  showConfirmAdmissionButton = false,
  backButtonPath = "/ipd/inPatients",
  onConfirmAdmissionClick,
  isConfirmDisabled = false,
  isConfirmLoading = false,
  helperMessage = "",
  onDisabledClick,
  isEditMode = false,
}) => {
  const [isClickLocked, setIsClickLocked] = useState(false);
  const clickLockRef = useRef(false);

  const navigate = useNavigate();

  const handleConfirmClick = async (e) => {
    if (isConfirmDisabled || isConfirmLoading || clickLockRef.current) {
      if (isConfirmDisabled) {
        onDisabledClick?.();
      }
      return;
    }
    clickLockRef.current = true;
    setIsClickLocked(true);
    try {
      const result = onConfirmAdmissionClick?.(e);
      if (result && typeof result.then === "function") {
        await result;
      }
    } finally {
      clickLockRef.current = false;
      setIsClickLocked(false);
    }
  };

  return (
    <div className="sub-header">
      <div className="sub-header-content d-flex gap-1">
        <i
          className="icon-right"
          onClick={() => navigate(backButtonPath)}
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
            onClick={handleConfirmClick}
            className={`add-admission-button ${
              isConfirmDisabled || isConfirmLoading || isClickLocked
                ? "is-disabled glass-button"
                : ""
            }`}
            disabled={isConfirmDisabled || isConfirmLoading || isClickLocked}
            loading={isConfirmLoading}
          >
            {isEditMode ? "Edit Admission" : "Confirm Admission"}
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
