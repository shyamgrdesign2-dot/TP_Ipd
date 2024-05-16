import React, { useCallback, useContext } from "react";
import { Col, Radio, Row, Form, Table } from "antd";
import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import PrintSettingsContext from '../../context/PrintSettingsContext';

import { isMobile } from 'react-device-detect';

const CustomRow = ({ children, ...props }) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && {
                ...transform,
                scaleY: 1,
            }
        ),
        transition,
        ...(isDragging ? {
            position: 'relative',
            zIndex: 9999,
        } : {}),
    };
    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
                if (child.key === 'sort') {
                    return React.cloneElement(child, {
                        children: (
                            <MenuOutlined
                                ref={setActivatorNodeRef}
                                style={{
                                    touchAction: 'none',
                                    cursor: 'move',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                {...listeners}
                            />
                        ),
                    });
                } else if (child.key === 'enable') {
                    return React.cloneElement(child, {
                        style: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    });
                }
                return child;
            })}
        </tr>
    );
};

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


    //Display Patient Info
    const caseOptionTable = [
        {
            key: 'sort',
            // colSpan: 2,
            align: 'center',
            dataIndex: 'sort',
        },
        {
            // colSpan: 0,
            dataIndex: 'title',
            key: 'title',
            render: (text, record, i) => (
                <div className="d-flex align-items-center cursor-pointer Preview-color-icon" onClick={() => onCaseOptionChange(record, 'visible', i)}>
                    <i className={`icon-Preview ${record.enable === 'N' && 'disable-preview'} me-3`}></i>
                    <span>{record.title}</span>
                </div>
            ),
        },
        {
            dataIndex: 'format',
            key: 'format',
            render: (text, record, i) => (
                <Form.Item className="mb-0 form_addnewpatient ">
                    <Radio.Group className={`d-flex gender-radio all-change-radio ${isMobile ? 'segmented-radio-mobile' : ''}`} onChange={(e) => onCaseOptionChange(e, 'radio', i)} value={record.format}>
                        <Radio.Button className="w-100 text-center" value="inline">Inline</Radio.Button>
                        <Radio.Button className="w-100 text-center" value="listview">List View</Radio.Button>
                        <Radio.Button className="w-100 text-center" value="table">Table</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            ),
        },
    ];

    const onCaseOptionChange = (record, flag, i) => {
        flag === 'radio' ?
            printSettings.prescription.case_option[i].format = record.target.value
            :
            printSettings.prescription.case_option[i].enable = record.enable === 'Y' ? 'N' : 'Y'

        setPrintSettings((prev) => {
            return {
                ...prev
            };
        });
    }

    const onDragEndPatientInfo = ({ active, over }) => {
        if (active.id !== over?.id) {
            setPrintSettings((prev) => {
                const activeIndex = prev.prescription.case_option.findIndex((i) => i.id === active.id);
                const overIndex = prev.prescription.case_option.findIndex((i) => i.id === over?.id);
                return {
                    ...prev,
                    prescription: {
                        case_option: arrayMove(prev.prescription.case_option, activeIndex, overIndex)
                    }
                };
            });
        }
    };

    return (
        <div className="px-3">
            <div className="titleprint mb-3">Format Style</div>
            <Row justify="space-between" className="align-items-center form_addnewpatient mb-3">
                <Col>
                    All Change to
                </Col>
                <Col className={`${isMobile ? 'radio-width-static' : 'radio-width-static-web'}`}>
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
            {printSettings?.prescription?.case_option?.length > 0 && (
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndPatientInfo}>
                    <SortableContext
                        // rowKey array
                        items={printSettings?.prescription?.case_option?.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table
                            className={`customize-table customize-table-format table-display-patient ${isMobile ? 'radio-width-static' : 'radio-width-static-web'}`}
                            pagination={false}
                            components={{
                                body: {
                                    row: CustomRow,
                                },
                            }}
                            rowKey="id"
                            columns={caseOptionTable}
                            dataSource={printSettings?.prescription?.case_option}
                            showHeader={false}
                        />
                    </SortableContext>
                </DndContext>
            )}

            {/* {printSettings?.prescription?.case_option?.map((e, i) => {
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
            })} */}
        </div>
    );
}

export default React.memo(PrescriptionLayout);
