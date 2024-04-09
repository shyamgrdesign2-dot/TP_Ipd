import React, { useCallback, useContext } from "react";
import { Col, Radio, Row, Form } from "antd";

import PrintSettingsContext from '../../context/PrintSettingsContext';

import { isMobile } from 'react-device-detect';

function PrescriptionLayout() {

    const { printSettings, setPrintSettings } = useContext(PrintSettingsContext);

    const onMainCaseOptionChange = useCallback(
        (e) => {
            const updatedData = printSettings.prescription.case_option.map((x) => {
                return { ...x, format: e.target.value };
            });

            setPrintSettings((prev) => {
                return {
                    ...prev,
                    prescription: {
                        case_option: updatedData
                    }
                };
            });
        },
        [printSettings]
    );

    const onCaseOptionChange = useCallback(
        (e, flag, i) => {
            flag === 'radio' ?
                printSettings.prescription.case_option[i].format = e.target.value
                :
                printSettings.prescription.case_option[i].enable = e.enable === 'Y' ? 'N' : 'Y'

            setPrintSettings((prev) => {
                return {
                    ...prev
                };
            });
        },
        [printSettings]
    );

    return (
        <div className="px-3">
            <div className="titleprint mb-3">Format Style</div>
            <Row justify="space-between" className="align-items-center form_addnewpatient mb-28">
                <Col lg={10}>
                    All Change to
                </Col>
                <Col lg={14}>
                    <Form.Item className="mb-0">
                        <Radio.Group className={`d-flex gender-radio all-change-radio ${isMobile ? 'segmented-radio-mobile' : ''}`} onChange={onMainCaseOptionChange}
                            value={
                                printSettings?.prescription?.case_option.every(e => e.format === 'inline') ? 'inline'
                                    : printSettings?.prescription?.case_option.every(e => e.format === 'listview') ? 'listview'
                                        : printSettings?.prescription?.case_option.every(e => e.format === 'table') ? 'table'
                                            : null}>
                            <Radio.Button className="w-100 text-center" value="inline">Inline</Radio.Button>
                            <Radio.Button className="w-100 text-center" value="listview">List View</Radio.Button>
                            <Radio.Button className="w-100 text-center" value="table">Table</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            {printSettings?.prescription?.case_option?.map((e, i) => {
                return (
                    e?.custom_status === 'Y' && (
                        <Row key={i} justify="space-between" className="align-items-center form_addnewpatient mb-28">
                            <Col lg={10}>
                                <div className="d-flex align-items-center cursor-pointer Preview-color-icon" onClick={() => onCaseOptionChange(e, 'visible', i)}>
                                    <i className={`icon-Preview ${e.enable === 'N' && 'disable-preview'} me-2`}></i>
                                    <span>{e.title}</span>
                                </div>
                            </Col>
                            <Col lg={14}>
                                <Form.Item className="mb-0">
                                    <Radio.Group className={`d-flex gender-radio all-change-radio ${isMobile ? 'segmented-radio-mobile' : ''}`} onChange={(e) => onCaseOptionChange(e, 'radio', i)} value={e.format}>
                                        <Radio.Button className="w-100 text-center" value="inline">Inline</Radio.Button>
                                        <Radio.Button className="w-100 text-center" value="listview">List View</Radio.Button>
                                        <Radio.Button className="w-100 text-center" value="table">Table</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    )
                )
            })}
        </div>
    );
}

export default React.memo(PrescriptionLayout);
