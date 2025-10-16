import { AutoComplete } from "antd";
import { isMobile } from 'react-device-detect';
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { isNumeric, onlyNumberFormat } from "../../utils/utils";

const SinceDuration = ({ value, onChange, record, column }) => {
  const SINCE_OPTIONS = useMemo(() => [
    { value: "Hour", label: "H" },
    { value: "Day", label: "D" },
    { value: "Week", label: "W" },
    { value: "Month", label: "M" },
    { value: "Year", label: "Y" },
  ], []);
  
  const SINCE_OPTIONS_WEB = useMemo(() => [
    { value: "Hour", label: "Hour" },
    { value: "Day", label: "Day" },
    { value: "Week", label: "Week" },
    { value: "Month", label: "Month" },
    { value: "Year", label: "Year" },
  ], []);
  const [sinceValue, setSinceValue] = useState(1);
  const [inputSince] = useState("");
  const [sinceOptions, setSinceOptions] = useState([]);

  // Initialize component state based on the value prop
  useEffect(() => {
    if (value) {
      // If value contains a number, extract it for sinceValue
      const numericMatch = value.match(/^\d+/);
      if (numericMatch) {
        setSinceValue(parseInt(numericMatch[0]));
      }
    }
  }, [value]);

  const onSearchSinceChid = useCallback(
    (query) => {
      const updateQuery = onlyNumberFormat(query);
      
      // Update the parent component with the current input value
      if (onChange && record && column) {
        onChange(record.key, column.dataIndex, updateQuery);
      }
      
      if (updateQuery) {
        const options = SINCE_OPTIONS_WEB.map((option) => {
          return {
            key: Math.random(),
            value: `${updateQuery} ${
              updateQuery <= 1 ? option.value : `${option.value}(s)`
            }`,
            label: (
              <>{`${updateQuery} ${
                updateQuery <= 1 ? option.label : `${option.label}(s)`
              }`}</>
            ),
          };
        });
        setSinceOptions(options);
      } else {
        setSinceOptions([]);
      }
    },
    [onChange, record, column, SINCE_OPTIONS_WEB]
  );

  const onBlurSinceChid = useCallback(() => {
    // Handle blur event - if only numeric value exists, append default "Day(s)"
    if (value && isNumeric(value) && onChange && record && column) {
      const numericValue = parseInt(value);
      const defaultDuration = `${value} ${numericValue <= 1 ? "Day" : "Day(s)"}`;
      onChange(record.key, column.dataIndex, defaultDuration);
    }
  }, [value, onChange, record, column]);

  const onSelectSinceChild = useCallback(
    (data) => {
      setSinceOptions([]);
      
      // Update the parent component with the selected value
      if (onChange && record && column) {
        onChange(record.key, column.dataIndex, data);
      }
    },
    [onChange, record, column]
  );

  // Generate mobile options when needed
  useEffect(() => {
    if (isMobile) {
      let options = [];
      
      if (sinceValue !== -1) {
        options = SINCE_OPTIONS.map((option) => ({
          key: Math.random(),
          value: `${sinceValue} ${
            sinceValue <= 1 ? option.value : `${option.value}(s)`
          }`,
          label: <>{`${sinceValue}${option.label}`}</>,
        }));
      } else if (inputSince.length > 0) {
        options = SINCE_OPTIONS.map((option) => ({
          key: Math.random(),
          value: `${inputSince} ${
            inputSince <= 1 ? option.value : `${option.value}(s)`
          }`,
          label: <>{`${inputSince}${option.label}`}</>,
        }));
      } else {
        options = SINCE_OPTIONS.map((option) => ({
          key: Math.random(),
          value: option.value,
          label: <>{option.label}</>,
        }));
      }
      
      setSinceOptions(options);
    }
  }, [sinceValue, inputSince, SINCE_OPTIONS]);

  return (
    <div>
      <AutoComplete
        value={value || ""}
        placeholder={column?.placeholder || "Since"}
        defaultOpen={false}
        onSearch={(query) => onSearchSinceChid(query)}
        onBlur={() => onBlurSinceChid()}
        options={sinceOptions}
        className="autocomplete-custom w-100"
        defaultActiveFirstOption={true}
        onSelect={(data) => onSelectSinceChild(data)}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default SinceDuration;
