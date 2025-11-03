import emptyFileIcon from "../../../assets/images/empty-file.svg";
import { Typography } from "antd";

const { Text } = Typography;

const EmptyState = ({ label }) => (
  <div className="empty-state">
    <div className="empty-state-content">
      <img src={emptyFileIcon} alt="No results" className="empty-state-icon" />
      <Text className="empty-state-text">{label}</Text>
    </div>
  </div>
);

export default EmptyState;
