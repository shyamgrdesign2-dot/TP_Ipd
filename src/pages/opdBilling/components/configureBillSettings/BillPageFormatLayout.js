import { Form, Select } from "antd";
import {
  FONTS_FAMILY_LIST,
  FONTS_SIZE_LIST,
} from "../../../../utils/constants";

const BillPageFormatLayout = ({ pageFormat, setPrintSettings }) => {
  const { fontFamily, fontSize } = pageFormat || {};
  const onSelectPageFormat = (data, key) => {
    setPrintSettings((prev) => {
      return {
        ...prev,
        pageFormat: {
          ...prev.pageFormat,
          [key]: data,
        },
      };
    });
  };

  return (
    <div className="px-3 form_addnewpatient">
      <div className="titleprint mb-3">Page Layout</div>
      <Form.Item>
        <label className="mb-1">Font Family</label>
        <Select
          className="autocomplete-custom"
          placeholder="Select font family"
          options={FONTS_FAMILY_LIST}
          value={fontFamily}
          onSelect={(data) => onSelectPageFormat(data, "fontFamily")}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <label className="mb-1">Font Size</label>
        <Select
          className="autocomplete-custom"
          placeholder="Select font size"
          options={FONTS_SIZE_LIST}
          value={fontSize}
          onSelect={(data) => onSelectPageFormat(data, "fontSize")}
          allowClear
        />
      </Form.Item>
    </div>
  );
};

export default BillPageFormatLayout;
