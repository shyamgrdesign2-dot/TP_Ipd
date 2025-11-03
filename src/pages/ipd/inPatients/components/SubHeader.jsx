import { Button } from "antd";
import "./SubHeader.scss";
import { defaultIcons } from "../../../../assets/images/icons";
import { useNavigate } from "react-router-dom";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { GB_NEW_IPD_ZYDUS } from "../../../../utils/constants";

const SubHeader = ({ headerTitle, showAddAdmission = true }) => {
  const isNewIPDHosBusinessIdAccessableFromGB = useFeatureIsOn(
    GB_NEW_IPD_ZYDUS
  );
  const navigate = useNavigate();

  const handleAddAdmission = () => {
    navigate(`/ipd/add-admission`);
  };

  return (
    <div className="sub-header">
      <div className="sub-header-content">{headerTitle}</div>
      {(showAddAdmission && isNewIPDHosBusinessIdAccessableFromGB) && (
        <div>
        <Button
          type="primary"
          icon={<img src={defaultIcons.plusIcon} alt="+" />}
          onClick={handleAddAdmission}
        >
          Add Admission
        </Button>
        </div>
      )}
    </div>
  );
};

export default SubHeader;
