import React, { useCallback, useContext, useState, useMemo } from "react";
import { Col, Radio, Row, Form, Table, Collapse, Checkbox } from "antd";

import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import PrintSettingsContext from '../../context/PrintSettingsContext';

import { isMobile } from 'react-device-detect';
import { useVaccinationAccess } from "../../pages/vaccination/useVaccinationAccess";

// const CustomRow = ({ children, ...props }) => {
//     const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
//         id: props['data-row-key'],
//     });
//     const style = {
//         ...props.style,
//         transform: CSS.Transform.toString(
//             transform && {
//                 ...transform,
//                 scaleY: 1,
//             }
//         ),
//         transition,
//         ...(isDragging ? {
//             position: 'relative',
//             zIndex: 9999,
//         } : {}),
//     };
//     return (
//         <tr {...props} ref={setNodeRef} style={style} {...attributes}>
//             {React.Children.map(children, (child) => {
//                 if (child.key === 'sort') {
//                     return React.cloneElement(child, {
//                         children: (
//                             <MenuOutlined
//                                 ref={setActivatorNodeRef}
//                                 style={{
//                                     touchAction: 'none',
//                                     cursor: 'move',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     alignItems: 'center',
//                                 }}
//                                 {...listeners}
//                             />
//                         ),
//                     });
//                 } else if (child.key === 'enable') {
//                     return React.cloneElement(child, {
//                         style: {
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                         },
//                     });
//                 }
//                 return child;
//             })}
//         </tr>
//     );
// };

const RowContext = React.createContext({});
const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
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
    );
};
const CustomRow = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };
    const contextValue = useMemo(
        () => ({
            setActivatorNodeRef,
            listeners,
        }),
        [setActivatorNodeRef, listeners],
    );
    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};

const checkboxOptions = [
    {
        label: 'DOSE',
        value: 'dose',
    },
    {
        label: 'DURATION',
        value: 'duration',
    },
    {
        label: 'QUANTITY',
        value: 'quantity',
    },
    {
        label: 'NOTE',
        value: 'note',
    },
];

function PrescriptionLayout() {

    const { printSettings, setPrintSettings } = useContext(PrintSettingsContext);
    const isVaccinationAccessable = useVaccinationAccess();

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

    const onMedicationWithGenericChange = (e, i) => {
        printSettings.prescription.case_option[i].medicine_with_generic = e.target.value
        setPrintSettings((prev) => {
            return {
                ...prev
            };
        });
    };

    const onMedicationOptionChange = (checkedValues, i) => {
        printSettings.prescription.case_option[i].medicine_option = checkedValues
        setPrintSettings((prev) => {
            return {
                ...prev
            };
        });
    };

    const accordionItems = (record, i) => [
        {
            key: '1',
            label: <div className="text-start"><div className="fw-semibold">Customise Options</div><div className="subtitle-customize">Selected/deselect medication columns need to be printed</div></div>,
            children:
                <>
                    <div className="fw-medium text-start py-2">MEDICINE</div>
                    <div className="d-flex align-items-center text-start">
                        <Radio.Group value={record?.medicine_with_generic} onChange={(e) => onMedicationWithGenericChange(e, i)}>
                            <Radio className="mb-2" value={true}>Medicine with Generic Name</Radio>
                            <Radio value={false}>Only Medicine Name</Radio>
                        </Radio.Group>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center">
                        <Checkbox.Group options={checkboxOptions} value={record?.medicine_option} onChange={(checkedValues) => onMedicationOptionChange(checkedValues, i)} />
                    </div>
                    <div className="subtitle-customize text-start mt-3"><span>Note:</span> The printed information will always include the name of the medicine (brand or generic), and the frequency.</div>
                </>
        },
    ];

    //Display Patient Info
    const caseOptionTable = [
        {
            key: 'sort',
            // colSpan: 2,
            align: 'center',
            dataIndex: 'sort',
            width: 40,
            render: () => <DragHandle />,
        },
        {
            // colSpan: 0,
            dataIndex: 'title',
            key: 'title',
            render: (text, record, i) => (
                <>
                    <div className="d-flex align-items-center justify-content-between text-start">
                        <div className="d-flex align-items-center cursor-pointer Preview-color-icon" onClick={() => onCaseOptionChange(record, 'visible', i)}>
                            <i className={`icon-Preview ${record.enable === 'N' && 'disable-preview'} me-3`}></i>
                            <span>{record.title}</span>
                        </div>
                        <Form.Item className="mb-0 form_addnewpatient ">
                            <Radio.Group className={`d-flex gender-radio all-change-radio ${isMobile ? 'segmented-radio-mobile' : ''}`} onChange={(e) => onCaseOptionChange(e, 'radio', i)} value={record.format}>
                                <Radio.Button className="w-100 text-center" value="inline">Inline</Radio.Button>
                                <Radio.Button className="w-100 text-center" value="listview">List View</Radio.Button>
                                <Radio.Button className="w-100 text-center" value="table">Table</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {record.id === 4 && (
                        <div style={{ marginLeft: -40, display: 'flex' }}>
                            <div style={{ flex: 1 }} >
                                <div className="border mt-3 rounded-4 p-3 bg-white ">
                                    <Collapse items={accordionItems(record, i)} defaultActiveKey={['1']} className="prescriptiontab-accordian" expandIconPosition={'end'} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ),
        }
    ];

    const onDragEndCaseOption = ({ active, over }) => {
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
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndCaseOption}>
                    <SortableContext
                        // rowKey array
                        items={printSettings?.prescription?.case_option?.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table
                            className={`customize-table customize-table-format table-display-patient dragicon-position ${isMobile ? 'radio-width-static' : 'radio-width-static-web'}`}
                            pagination={false}
                            components={{
                                body: {
                                    row: CustomRow,
                                },
                            }}
                            rowKey="id"
                            columns={caseOptionTable}
                            dataSource={printSettings?.prescription?.case_option.filter(e => e.id === 10 ? isVaccinationAccessable : true).map((e) => ({ ...e, key: e.id }))}
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
