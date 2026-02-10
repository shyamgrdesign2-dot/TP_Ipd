import React from "react";
import { Card, Typography } from "antd";
import ProfileIcon from "../../../../../common/ProfileIcon";
import "./styles.scss";

const { Text } = Typography;
const themeShade2 = "#6c6bdd";
const grayLight = "#f1f1fc";

const PatientInfoCard = ({
  name,
  gender,
  age,
  phone,
  className = "",
  ...rest
}) => (
  <Card
    bordered={true}
    className={`patient-info-card p-12 ${className}`}
    {...rest}
  >
    <div className="d-flex align-items-center justify-content-start">
      <ProfileIcon
        className="rounded-circle"
        fill={themeShade2}
        bgFill={grayLight}
      />
      <div className="ps-2">
        <div className="pb-1">
          <Text className="pe-1 fw-semibold">{name}</Text>
          <Text>
            ({gender}, {age})
          </Text>
        </div>
        <Text>{phone}</Text>
      </div>
    </div>
  </Card>
);

export default PatientInfoCard;
