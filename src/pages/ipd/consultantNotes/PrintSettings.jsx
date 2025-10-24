import React from "react";
import { useLocation } from "react-router-dom";

import IPDConfigurePrintSetting from "../../../components/IPD/IPDConfigurePrintSetting";

function PrintSettings() {
  const { state } = useLocation();

  const { moduleType, data } = state;

  return <IPDConfigurePrintSetting moduleType={moduleType} data={data} />;
}

export default PrintSettings;
