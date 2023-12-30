import React, { useCallback, useEffect, useState } from "react";
import { Tabs } from "antd";
import { useSelector } from "react-redux";

import AppointmentData, {
  TAB_CANCELLED,
  TAB_FINISHED,
  TAB_QUEUE,
} from "../components/AppointmentData";

function Appointment({ clinicChanged }) {
  const [selectedTab, setSelectedTab] = useState(TAB_QUEUE);
  const counts = useSelector((state) => state.records.counts);

  const items = [
    {
      key: TAB_QUEUE,
      label: (
        <div className="d-flex align-items-baseline">
          <i className="icon-Queue"></i>
          Queue ({counts.queueCount ?? 0})
        </div>
      ),
    },
    {
      key: TAB_FINISHED,
      label: (
        <div className="d-flex align-items-baseline">
          <i className="icon-Finished"></i>
          Finished ({counts.finishedCount ?? 0})
        </div>
      ),
    },
    {
      key: TAB_CANCELLED,
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
      setSelectedTab(key);
    },
    [selectedTab]
  );

  return (
    <div className="border rounded-4 appointment-wrap dateborder">
      <Tabs
        defaultActiveKey={TAB_QUEUE}
        items={items}
        onChange={onChange}
        activeKey={selectedTab}
      />
      {selectedTab === TAB_QUEUE ? (
        <AppointmentData
          type={TAB_QUEUE}
          clinicChanged={clinicChanged}
          setSelectedTab={setSelectedTab}
        />
      ) : selectedTab === TAB_FINISHED ? (
        <AppointmentData
          type={TAB_FINISHED}
          clinicChanged={clinicChanged}
          setSelectedTab={setSelectedTab}
        />
      ) : (
        <AppointmentData
          type={TAB_CANCELLED}
          clinicChanged={clinicChanged}
          setSelectedTab={setSelectedTab}
        />
      )}
    </div>
  );
}
export default React.memo(Appointment);
