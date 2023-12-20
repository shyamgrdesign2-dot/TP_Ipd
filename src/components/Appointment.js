import React, { useCallback, useState } from "react";
import { Tabs } from "antd";
import { useSelector } from "react-redux";

import AppointmentData, {
  TAB_CANCELLED,
  TAB_FINISHED,
  TAB_QUEUE,
} from "../components/AppointmentData";

function Appointment() {
  const [tabChange, setTabChange] = useState("1");
  const queueCount = useSelector((state) => state.records.queueCount);

  const items = [
    {
      key: "1",
      label: (
        <div className="d-flex align-items-baseline">
          <i className="icon-Queue"></i>
          Queue ({queueCount ?? 0})
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="d-flex align-items-baseline">
          <i className="icon-Finished"></i>
          Finished (0)
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="d-flex align-items-baseline">
          <i className="icon-Cancelled"></i>
          Cancelled (0)
        </div>
      ),
    },
  ];

  const onChange = useCallback(
    (key) => {
      setTabChange(key);
    },
    [tabChange]
  );

  return (
    <div className="border rounded-4 appointment-wrap dateborder">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      {tabChange == 1 ? (
        <AppointmentData type={TAB_QUEUE} />
      ) : tabChange == 2 ? (
        <AppointmentData type={TAB_FINISHED} />
      ) : (
        <AppointmentData type={TAB_CANCELLED} />
      )}
    </div>
  );
}
export default React.memo(Appointment);
