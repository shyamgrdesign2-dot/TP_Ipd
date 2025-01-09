import { Form, Select } from "antd";
import {
  FONTS_FAMILY_LIST,
  FONTS_SIZE_LIST,
} from "../../../../utils/constants";
import { useCallback } from "react";

const BillPageFormatLayout = () => {
  const onSelectFontFamily = useCallback((data) => {
    console.log("data", data);
  }, []);

  const onSelectFontSize = useCallback((data) => {
    console.log("data", data);
  }, []);

  return (
    <div className="px-3 form_addnewpatient">
      <div className="titleprint mb-3">Page Layout</div>
      <Form.Item>
        <label className="mb-1">Font Family</label>
        <Select
          className="autocomplete-custom"
          placeholder="Select font family"
          options={FONTS_FAMILY_LIST}
          value={"Times-Roman"}
          onSelect={onSelectFontFamily}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <label className="mb-1">Font Size</label>
        <Select
          className="autocomplete-custom"
          placeholder="Select font size"
          options={FONTS_SIZE_LIST}
          value={12}
          onSelect={onSelectFontSize}
          allowClear
        />
      </Form.Item>
    </div>
  );
};

export default BillPageFormatLayout;
