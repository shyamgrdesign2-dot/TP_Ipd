import React, { useState, useRef } from "react";
import { Input, Segmented, Tabs, Row, Col, Form, Select, Radio } from 'antd';
import { Button, ButtonGroup } from "react-bootstrap";

const initialItems = [
    {
        label: 'Dose 1',
        children: 'Content of Tab 1',
        key: '1',
    },
    {
        label: 'Dose 2',
        children: 'Content of Tab 2',
        key: '2',
    },
    {
        label: 'Dose 3',
        children: 'Content of Tab 3',
        key: '3',
    },
];

function TabSearchMedicationDetails() {
    const [activeKey, setActiveKey] = useState(initialItems[0].key);
    const [items, setItems] = useState(initialItems);
    const newTabIndex = useRef(0);
    const onChange = (newActiveKey) => {
        setActiveKey(newActiveKey);
    };
    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        newPanes.push({
            label: 'New Tab',
            children: 'Content of new Tab',
            key: newActiveKey,
        });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };
    const remove = (targetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    // Segnment
    const DayList = [
        {
            value: 'morning', label:
                <ButtonGroup aria-label="Basic example" className="inputheight45">
                    <Button variant="outline-light" className="rounded-0 dateoutline px-2 bg-white">
                        <i className="icon-minus d-block text-main"></i>
                    </Button>
                    <Button variant="outline-light" className="rounded-0 dateoutline p-0 bg-white">
                        <Input className="rounded-0 h-100 border-0" />
                    </Button>
                    <Button variant="outline-light" className="rounded-0 dateoutline px-2 bg-white">
                        <i className="icon-Add text-main d-block"></i>
                    </Button>
                </ButtonGroup>
        },
        { value: 'afternoon', label: 'Afternoon' },
        { value: 'night', label: 'Night' },
    ];

    const MealTimeList = [
        { value: 'beforefood', label: 'Before Food' },
        { value: 'afterfood', label: 'After Food' },
        { value: 'betweenmeal', label: 'Between Meal' },
    ];

    const segmentedList = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label: <Input className="w-100 segment-input" placeholder="Custom" /> },
    ];

    const segmentedTimeList = [
        { value: 'hour', label: '1H' },
        { value: 'day', label: '1D' },
        { value: 'Week', label: '1W' },
        { value: 'month', label: '1M' },
        { value: 'year', label: '1Y' },
    ];

    return (
        <div>
            <Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={items}
                className="tablet-medication-tabs"
            />

            <div className="p-4">
                <div>
                    <Form
                        layout="vertical"
                        name="advanced_search"
                        className="form_addnewpatient">
                        <div>
                            <label className="title-common mb-2">
                                Unit/Dose
                            </label>
                            <Row gutter={20}>
                                <Col md={12}>
                                    <Form.Item>
                                        <Input placeholder="e.g. 1" type="number" />
                                    </Form.Item>
                                </Col>
                                <Col md={12}>
                                    <Select
                                        className="autocomplete-custom w-100 popinput inputheight38"
                                        placeholder="Select"
                                        options={[
                                            {
                                                value: 'Tablet',
                                                label: 'Tablet',
                                            },
                                            {
                                                value: 'Syringe',
                                                label: 'Syringe',
                                            },
                                            {
                                                value: 'O2',
                                                label: 'O2',
                                            },
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-4">
                            <label className="title-common mb-0">
                                Timing
                            </label>
                            <Form.Item name="gender" className="mb-0">
                                <Radio.Group size="small">
                                    <Radio.Button value="Male">MAN</Radio.Button>
                                    <Radio.Button value="Female">MAEN</Radio.Button>
                                    <Radio.Button value="Other">Hrs a Day</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                        <div className="mt-3">
                            <Segmented
                                className="search-segment"
                                options={DayList}
                            />
                        </div>
                        <div className="mt-3">
                            <Segmented
                                className="search-segment"
                                options={MealTimeList}
                            />
                        </div>
                        <div className="mt-3">
                            <Segmented
                                className="search-segment"
                                options={MealTimeList}
                            />
                        </div>
                        <div className="mt-5">
                            <label className="title-common">
                                Duration
                            </label>
                            <Segmented
                                className="search-segment"
                                options={segmentedList}
                            />
                        </div>
                        <div className="mt-3">
                            <Segmented
                                className="search-segment"
                                options={segmentedTimeList}
                            />
                        </div>
                        <div className="mt-5">
                            <label className="title-common">
                                Note
                            </label>
                            <Input.TextArea placeholder="Enter any specific notes here" className="textareaPlaceholder h-100" rows={3} />
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default TabSearchMedicationDetails;
