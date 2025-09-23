import React from "react";
import { Input } from "antd";

const SearchInput = ({ value, onChange, onClear, placeholder, className }) => (
  <Input
    value={value}
    placeholder={placeholder}
    className={`inputheight38 ${className}`}
    prefix={<i className="icon-search" />}
    suffix={
      value.length > 0 && <i className="icon-Cross" onClick={onClear}></i>
    }
    onChange={(e) => onChange(e.target.value)}
  />
);

export default SearchInput;
