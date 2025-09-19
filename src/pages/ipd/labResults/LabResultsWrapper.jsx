import React from "react";
import { ConfigProvider } from "antd";
import LabResults from "./LabResults";
import { labResultsTheme } from "./themeConfig";
import "./LabResults.css";

const LabResultsWrapper = () => {
  return (
    <ConfigProvider theme={labResultsTheme}>
      <LabResults />
    </ConfigProvider>
  );
};

export default LabResultsWrapper;
