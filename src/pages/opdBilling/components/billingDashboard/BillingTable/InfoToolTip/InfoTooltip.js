import React from "react";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./InfoTooltip.css";

const InfoTooltip = ({ type = "Refunded", amount, billNo, notes }) => {
  const renderContent = () => {
    if (type === "Refunded") {
      return (
        <div className="custom-tooltip-content">
          <div
            className="tooltip-header"
            style={{
              marginBottom: notes ? 12 : 0,
            }}
          >
            <span>Refunded </span>
            <span className="amount">₹{amount}</span>
          </div>
          {notes && (
            <div className="tooltip-notes">
              <div className="notes-label">Credit Notes:</div>
              <div className="notes-content">{notes}</div>
            </div>
          )}
        </div>
      );
    } else if (type === "Debit") {
      return (
        <div className="custom-tooltip-content">
          <div className="due-amount-text">
            This amount <span style={{ fontWeight: 700 }}>₹{amount}</span> was
            debited against patient's next Bill No:{" "}
            <span style={{ fontWeight: 700 }}>{billNo}</span>
          </div>
        </div>
      );
    } else if (type === "Deposit") {
      return (
        <div className="custom-tooltip-content">
          <div className="due-amount-text">
            This amount was deposited via a refund from Bill No:{" "}
            <span style={{ fontWeight: 700 }}>{billNo}</span>
          </div>
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
      placement="bottomLeft"
    >
      <InfoCircleOutlined className="info-icon" />
    </Tooltip>
  );
};

export default InfoTooltip;
