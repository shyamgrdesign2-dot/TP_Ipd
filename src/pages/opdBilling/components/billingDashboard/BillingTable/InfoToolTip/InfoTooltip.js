import React from "react";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./InfoTooltip.css";

const InfoTooltip = ({ type = "Refunded", amount, billNo, notes }) => {
  const renderContent = () => {
    if (type === "Refunded") {
      return (
        <div className="custom-tooltip-content">
          <div className="tooltip-header">
            <span>Refunded </span>
            <span className="amount">
              <span style={{ fontWeight: 700 }}>₹{amount}</span>
            </span>
          </div>
          {notes && (
            <div className="tooltip-notes">
              <div className="notes-label">Notes:</div>
              <div className="notes-content">{notes}</div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="custom-tooltip-content">
        <div className="due-amount-text">
          This due amount of <span style={{ fontWeight: 700 }}>₹{amount}</span>{" "}
          has been automatically added to the patient's next bill
          {billNo && (
            <div className="bill-no">
              (Bill No: <span style={{ fontWeight: 700 }}>{billNo}</span>)
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Tooltip
      overlayClassName="custom-tooltip-container"
      title={renderContent()}
      color="white"
    >
      <InfoCircleOutlined className="info-icon" />
    </Tooltip>
  );
};

export default InfoTooltip;
