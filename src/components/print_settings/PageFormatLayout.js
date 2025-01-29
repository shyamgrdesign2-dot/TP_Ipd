import React, { useCallback, useContext } from "react";
import { Form, Select } from "antd";

import PrintSettingsContext from '../../context/PrintSettingsContext';

const FONTS_FAMILY_LIST = [
    // {
    //     value: 'Arial',
    //     label: (<div className="fontarial">Arial</div>),
    // },
    {
        value: 'Times-Roman',
        label: (<div className="fonttimesroman">Times Roman</div>),
    },
    {
        value: 'Verdana',
        label: (<div className="fontverdana">Verdana</div>),
    },
    {
        value: 'Calibri',
        label: (<div className="fontcalibri">Calibri</div>),
    },
    {
        value: 'Tahoma',
        label: (<div className="fonttahoma">Tahoma</div>),
    },
    {
        value: 'Roboto',
        label: (<div className="fontroboto">Roboto</div>),
    }
]

const FONTS_SIZE_LIST = [
    {
        value: 8,
        label: '8',
    },
    {
        value: 10,
        label: '10',
    },
    {
        value: 12,
        label: '12',
    },
    {
        value: 14,
        label: '14',
    },
    {
        value: 16,
        label: '16',
    }
]

function PageFormatLayout() {

    const { printSettings, setPrintSettings } = useContext(PrintSettingsContext);

    const onSelectFontFamily = useCallback(
        (data) => {
            printSettings.page_format.font_family = data
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onSelectFontSize = useCallback(
        (data) => {
            printSettings.page_format.font_size = data
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    const onSelectPatientInfoFontSize = useCallback(
        (data) => {
            printSettings.page_format.patient_info_font_size = data
            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    return (
        <div className="px-3 form_addnewpatient">
            <div className="titleprint mb-3">Page Layout</div>
            {/* <Form.Item>
            <label className="mb-1">Page Size</label>
            <Radio.Group className="d-flex gender-radio">
                <Radio.Button className="w-100 text-center" value="a4">A4</Radio.Button>
                <Radio.Button className="w-100 text-center" value="a5">A5</Radio.Button>
            </Radio.Group>
        </Form.Item> */}
            <Form.Item>
                <label className="mb-1">Font Family</label>
                <Select
                    // showSearch
                    className="autocomplete-custom"
                    placeholder="Select font family"
                    options={FONTS_FAMILY_LIST}
                    value={printSettings?.page_format?.font_family}
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
                    value={printSettings?.page_format?.font_size}
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
                    value={printSettings?.page_format?.patient_info_font_size || printSettings?.page_format?.font_size}
                    onSelect={onSelectPatientInfoFontSize}
                    allowClear
                />
            </Form.Item>
        </div>
    );
}

export default React.memo(PageFormatLayout);
