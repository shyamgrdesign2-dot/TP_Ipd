import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Radio, Select } from "antd";

import { setDraftSettings } from "../../redux/ipd/printSettingsSlice";
import { FONTS_FAMILY_LIST, FONTS_SIZE_LIST } from "../../utils/constants";

function IPDPageFormatLayout({ moduleType }) {
  const dispatch = useDispatch();
  const { draftSettings } = useSelector((state) => state.printSettings);

  // Get current module settings from draft
  const currentModuleSettings = useMemo(
    () => draftSettings[moduleType] || {},
    [draftSettings, moduleType]
  );

  const pageFormatSettings = useMemo(
    () => currentModuleSettings.pageFormat || {},
    [currentModuleSettings]
  );

  const updatePageFormat = useCallback(
    (updates) => {
      dispatch(
        setDraftSettings({
          moduleType,
          settings: {
            ...currentModuleSettings,
            pageFormat: {
              ...pageFormatSettings,
              ...updates,
            },
          },
        })
      );
    },
    [dispatch, moduleType, currentModuleSettings, pageFormatSettings]
  );

  const onSelectFontFamily = useCallback(
    (data) => {
      updatePageFormat({ fontFamily: data });
    },
    [updatePageFormat]
  );

  const onSelectFontSize = useCallback(
    (data) => {
      updatePageFormat({ fontSize: data });
    },
    [updatePageFormat]
  );

  const onSelectPatientInfoFontSize = useCallback(
    (data) => {
      updatePageFormat({ patientInfoFontSize: data });
    },
    [updatePageFormat]
  );

  const paginationHandler = useCallback(
    (e) => {
      updatePageFormat({ pagination: e.target.value });
    },
    [updatePageFormat]
  );

  return (
    <div className="px-3 form_addnewpatient">
      <div className="titleprint mb-3">Page Layout</div>

      <Form.Item>
        <label className="mb-1">Font Family</label>
        <Select
          className="autocomplete-custom"
          placeholder="Select font family"
          options={FONTS_FAMILY_LIST}
          value={pageFormatSettings.fontFamily || "Roboto"}
          onSelect={onSelectFontFamily}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <label className="mb-1">Consultation Details Font Size</label>
        <Select
          className="autocomplete-custom"
          placeholder="Select font size"
          options={FONTS_SIZE_LIST}
          value={pageFormatSettings.fontSize || 8}
          onSelect={onSelectFontSize}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <label className="mb-1">Patient Info Font Size</label>
        <Select
          className="autocomplete-custom"
          placeholder="Select font size"
          options={FONTS_SIZE_LIST}
          value={pageFormatSettings.patientInfoFontSize || 8}
          onSelect={onSelectPatientInfoFontSize}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <label className="mb-1">Pagination</label>
        <Radio.Group
          className="d-flex gender-radio"
          value={pageFormatSettings.pagination}
          onChange={paginationHandler}
        >
          <Radio.Button className="w-100 text-center" value={true}>
            Show
          </Radio.Button>
          <Radio.Button className="w-100 text-center" value={false}>
            Hide
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
    </div>
  );
}

export default React.memo(IPDPageFormatLayout);
