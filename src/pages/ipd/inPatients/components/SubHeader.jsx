import { Button } from "antd";
import "./SubHeader.scss";
import { defaultIcons } from "../../../../assets/images/icons";
import { useNavigate } from "react-router-dom";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { GB_NEW_IPD_ZYDUS } from "../../../../utils/constants";

const SubHeader = ({ headerTitle, showAddAdmission = true }) => {
  const isNewIPDZydusAccessableFromGB = useFeatureIsOn(
    GB_NEW_IPD_ZYDUS
  );
  const navigate = useNavigate();

  const handleAddAdmission = () => {
    // if(isNewIPDZydusAccessableFromGB) {
    //   navigate(`/ipd/add-admission`);
    // } else {
      navigate(`/ipd/create-admission`);
    // }
  };

  return (
    <div className="sub-header">
      <div className="sub-header-content">{headerTitle}</div>
      {(showAddAdmission) && (
        <div>
        <Button
          type="primary"
          icon={<img src={defaultIcons.plusIcon} alt="+" />}
          onClick={handleAddAdmission}
          className="add-admission-button"
        >
          Create New Admission
        </Button>
        </div>
      )}
    </div>
  );
};

export default SubHeader;
