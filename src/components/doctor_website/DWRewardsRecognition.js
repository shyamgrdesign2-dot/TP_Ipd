import React, { useContext, useCallback } from 'react';
import { Form, Input, Select, Button, Collapse } from 'antd';
import DoctorWebsiteSettingsContext from '../../context/DoctorWebsiteSettingsContext';
import moment from 'moment';

function DWRewardsRecognition() {
    const { rewardRecognition, setRewardRecognition } = useContext(DoctorWebsiteSettingsContext);
    const yearList = [
        {
            value: '2021',
            label: '2021',
        }
    ]

    const yearsFromToCurrent = (value) => {
        const startYear = parseInt(value);
        const currentYear = moment().year();
        return Array.from({ length: currentYear - startYear + 1 }, (v, i) => ({
            value: `${startYear + i}`,
            label: `${startYear + i}`,
        }));
    }

    const onChangeInput = useCallback(
        (e, key, i) => {
            rewardRecognition[i][key] = e.target.value;
            setRewardRecognition((prev) => { return [...prev] });
        },
        [rewardRecognition]
    );

    const onSelect = useCallback(
        (e, key, i) => {
            rewardRecognition[i][key] = e;
            setRewardRecognition((prev) => { return [...prev] });
        },
        [rewardRecognition]
    );

    const onRemoveRow = (index) => {
        rewardRecognition.splice(index, 1);
        setRewardRecognition((prev) => { return [...prev] });
    };

    const accordionItems = (e, i) => [
        {
            key: `${i + 1}`,
            label:
                <>
                    <div className="title-common">{`Rewards & Recognition ${i + 1}`}</div>
                    {(e?.title || e?.year) ? (
                        <div className='fontroboto'>{`${Object.values(Object.fromEntries(Object.entries((({ title, year }) => ({ title, year }))(e)).filter(([_, v]) => v))).join(', ')}`}</div>
                    ) : (
                        <div className='fontroboto'>{'(Not Specified)'}</div>
                    )}
                </>,
            children:
                <div className="rounded-20px">
                    <div className='px-20'>
                        <Form layout="vertical">
                            <Form.Item
                                label="Title"
                                className='fw-medium mb-20'>
                                <Input placeholder="Add your achievements"
                                    className="rounded-10px h-38"
                                    value={e?.title}
                                    onChange={(e) => onChangeInput(e, 'title', i)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Year"
                                className='fw-medium mb-20'>
                                <Select
                                    className="autocomplete-custom"
                                    placeholder="Year"
                                    options={yearsFromToCurrent(1990)}
                                    value={e?.year ? e?.year : null}
                                    onSelect={(e) => onSelect(e, 'year', i)}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                    <Button className='btn w-100 btn-delete-experience btn-41 rounded-top-0 btn-primary3 align-items-center d-flex justify-content-center' onClick={() => onRemoveRow(i)}><i className='icon-delete fs-18 me-2'></i>Delete Experience</Button>
                </div>,
        },
    ];

    const addRewardRecognitionClick = useCallback(
        () => {
            rewardRecognition.push({
                title: '',
                year: ''
            })
            setRewardRecognition((prev) => { return [...prev] });
        },
        [rewardRecognition]
    );

    return (
        <div className="bg-white overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <div className='p-20'>
                <div className="text-greycolor fontroboto">Add your achievements, public acknowledgment or praise, such as awards, certificates, commendations, etc.</div>
                {rewardRecognition.map((e, i) => {
                    return (
                        <div key={i} className="border rounded-20px bg-white mt-3">
                            <Collapse items={accordionItems(e, i)} defaultActiveKey={['1']} className="prescriptiontab-accordian doctor-experience" expandIconPosition={'end'} />
                        </div>
                    )
                })}

                <Button className='btn btn-input w-100 btn-41 d-flex align-items-center justify-content-center mt-3' onClick={addRewardRecognitionClick} ><i className='icon-Add fs-18 me-2'></i>Add Rewards & Recognition</Button>
            </div>
        </div>
    );
}
export default React.memo(DWRewardsRecognition);