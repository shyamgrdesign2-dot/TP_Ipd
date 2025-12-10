import React from "react";
import { Input } from "antd";
import "./WardSearchBar.scss";

const WardSearchBar = ({ value, onChange, placeholder = "Search by ward name" }) => {
  return (
    <div className="ward-search-bar">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        prefix={<i className="icon-search" />}
        className="ward-search-input"
        allowClear
      />
    </div>
  );
};

export default React.memo(WardSearchBar);

