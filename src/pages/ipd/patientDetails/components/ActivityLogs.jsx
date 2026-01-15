import React, { useMemo, useState } from "react";
import moment from "moment";
import "./ActivityLogs.scss";

const ActivityLogs = ({ logs = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const safeLogs = Array.isArray(logs) ? logs : [];

  const filteredLogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return safeLogs;
    return safeLogs.filter((log) => {
      const status = log?.status?.toLowerCase() || "";
      const doctorName = log?.doctor?.name?.toLowerCase() || "";
      const infoText = (log?.info || []).join(" ").toLowerCase();
      return (
        status.includes(term) ||
        doctorName.includes(term) ||
        infoText.includes(term)
      );
    });
  }, [safeLogs, searchTerm]);

  const formatDateTime = (datetime) => {
    if (!datetime) return { date: "-", time: "" };

    const parsed = moment.utc(datetime, "DD-MM-YYYY hh:mm A", true);
    if (!parsed.isValid()) {
      const [date, ...timeParts] = datetime.split(" ");
      return { date, time: timeParts.join(" ") };
    }

    const ist = parsed.utcOffset(330);
    return {
      date: ist.format("DD-MM-YYYY"),
      time: ist.format("hh:mm A"),
    };
  };

  return (
    <div className="activity-logs-card">
      <div className="activity-logs-card__header">
        <div className="activity-logs-card__search">
          <input
            type="text"
            placeholder="Search by status, info or user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="activity-logs-table">
        <div className="activity-logs-table__row activity-logs-table__head">
          <div>#</div>
          <div>STATUS</div>
          <div>DATE/TIME</div>
          <div>INFO</div>
          <div>USER</div>
        </div>
        {filteredLogs.length ? (
          filteredLogs.map((log, index) => {
            const { date, time } = formatDateTime(log?.datetime);
            return (
              <div className="activity-logs-table__row" key={log?._id || index}>
                <div className="activity-logs-table__cell activity-logs-table__cell--muted">
                  {index + 1}
                </div>
                <div className="activity-logs-table__cell activity-logs-table__cell--status">
                  {log?.status || "-"}
                </div>
                <div className="activity-logs-table__cell activity-logs-table__cell--date">
                  <div>{date}</div>
                  {time && <div>{time}</div>}
                </div>
                <div className="activity-logs-table__cell activity-logs-table__cell--info">
                  {(log?.info || []).map((line, infoIndex) => (
                    <div key={infoIndex}>{line}</div>
                  ))}
                </div>
                <div className="activity-logs-table__cell activity-logs-table__cell--user">
                  {log?.doctor?.name || "-"}
                </div>
              </div>
            );
          })
        ) : (
          <div className="activity-logs-empty">No activity logs available.</div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
