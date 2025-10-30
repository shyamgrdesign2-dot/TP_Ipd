import { Button } from "antd";
import "./SubHeader.scss";
import { defaultIcons } from "../../../../assets/images/icons";
import { useNavigate } from "react-router-dom";

const SubHeader = ({ headerTitle }) => {
  const navigate = useNavigate();

  const handleAddAdmission = () => {
    navigate(`/ipd/add-admission`);
  };

  return (
    <div className="sub-header">
      <div className="sub-header-content">{headerTitle}</div>
      <div>
        <Button
          type="primary"
          icon={<img src={defaultIcons.plusIcon} alt="+" />}
          onClick={handleAddAdmission}
        >
          Add Admission
        </Button>
      </div>
    </div>
  );
};

export default SubHeader;
