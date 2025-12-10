import React from "react";
import { TABS } from "../constants";
import { defaultIcons } from "../../../../assets/images/icons";

const BedFormTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="add-beds-tabs">
      <button
        className={`add-beds-tab ${
          activeTab === TABS.MULTIPLE ? "active" : ""
        }`}
        onClick={() => onTabChange(TABS.MULTIPLE)}
      >
        <div className="add-beds-tab-content">
          <img
            src={
              activeTab === TABS.MULTIPLE
                ? defaultIcons.bedPrimaryIcon
                : defaultIcons.bedSecondaryIcon
            }
            alt="Multiple"
            className="tab-icon"
          />
          <span>Add Multiple Beds</span>
        </div>
        {activeTab === TABS.MULTIPLE && <div className="tab-indicator" />}
      </button>
      <button
        className={`add-beds-tab ${activeTab === TABS.SINGLE ? "active" : ""}`}
        onClick={() => onTabChange(TABS.SINGLE)}
      >
        <div className="add-beds-tab-content">
          <img
            src={
              activeTab === TABS.SINGLE
                ? defaultIcons.bedPrimaryIcon
                : defaultIcons.bedSecondaryIcon
            }
            alt="Single"
            className="tab-icon"
          />
          <span>Add a Single Bed</span>
        </div>
        {activeTab === TABS.SINGLE && <div className="tab-indicator" />}
      </button>
    </div>
  );
};

export default React.memo(BedFormTabs);
