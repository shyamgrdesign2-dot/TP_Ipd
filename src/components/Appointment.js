import React, { useCallback, useState } from "react";
import { Tabs } from "antd";
import { useSelector } from "react-redux";

import AppointmentData, {
  TAB_CANCELLED,
  TAB_FINISHED,
  TAB_QUEUE,
} from "../components/AppointmentData";

function Appointment({ clinicChanged }) {
  const [tabChange, setTabChange] = useState("1");
  const counts = useSelector((state) => state.records.counts);

  const items = [
    {
      key: "1",
      label: (
        <div className="d-flex align-items-baseline">
          <i className="icon-Queue"></i>
          Queue ({counts.queueCount ?? 0})
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="d-flex align-items-baseline">
          <i className="icon-Finished"></i>
          Finished ({counts.finishedCount ?? 0})
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="d-flex align-items-baseline">
          <i className="icon-Cancelled"></i>
          Cancelled ({counts.cancelledCount ?? 0})
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
        <AppointmentData type={TAB_QUEUE} clinicChanged={clinicChanged} />
      ) : tabChange == 2 ? (
        <AppointmentData type={TAB_FINISHED} clinicChanged={clinicChanged} />
      ) : (
        <AppointmentData type={TAB_CANCELLED} clinicChanged={clinicChanged} />
      )}
    </div>
  );
}
export default React.memo(Appointment);
