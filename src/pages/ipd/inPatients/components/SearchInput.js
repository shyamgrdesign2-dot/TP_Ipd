import React, { useState } from "react";
import { Input } from "antd";

const SearchInput = ({ value, onChange, onClear, placeholder, className }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Input
      value={value}
      placeholder={placeholder}
      className={`ipd-search-input ${className} ${
        isFocused ? "search-input-active" : ""
      }`}
      prefix={<i className="icon-search" />}
      suffix={
        value.length > 0 && <i className="icon-Cross" onClick={onClear}></i>
      }
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

export default SearchInput;
