import React from "react";
import { useLocation } from "react-router-dom";

import IPDConfigurePrintSetting from "../../../components/IPD/IPDConfigurePrintSetting";

function ConfigurePrintSettings() {
  const { state } = useLocation();

  const { moduleType, data, printSettings } = state;

  return (
    <IPDConfigurePrintSetting
      printSettings={printSettings}
      moduleType={moduleType}
      data={data}
    />
  );
}

export default ConfigurePrintSettings;
