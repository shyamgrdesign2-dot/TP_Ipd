import React from "react";
import { Input } from "antd";

const SearchInput = ({ value, onChange, onClear }) => (
  <Input
    value={value}
    placeholder="Search by patient name / ID / Bed no/ mobile no"
    className="inputheight38"
    prefix={<i className="icon-search" />}
    suffix={
      value.length > 0 && <i className="icon-Cross" onClick={onClear}></i>
    }
    onChange={(e) => onChange(e.target.value)}
  />
);

export default SearchInput;
