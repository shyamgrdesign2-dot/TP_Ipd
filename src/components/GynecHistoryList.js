import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';

function GynecHistoryList(props) {
    const {gynecHistory} = props
    const [accordionItems, setAccordionItems] = useState([]);

    useEffect(() => {
        if (gynecHistory) {
            const data = [];
            const updateData = {
                key: `${1}`,
                label: <div className="fw-semibold">Menstrual Details</div>,
                children: (
                    <div className="cardbody-data border rounded px-2 my-2">
                        <div className="my-2">
                            {gynecHistory.cycle && (
                                <><span>Cycle</span> : <label>{gynecHistory.cycle}</label> | </>
                            )}
                            {gynecHistory.intervalOfCycle && (
                                <><span>Cycle Interval</span> : <label>{gynecHistory.intervalOfCycle}</label> | </>
                            )}
                            {gynecHistory.flow && (
                                <>
                                    <span>Flow</span> : <label>{gynecHistory.flow}</label> |
                                </>
                            )}
                        </div>
                        <div className="my-2">
                            {gynecHistory.durationOfMenstrualFlow && (
                                <>
                                    <span>Duration</span> : <label>{gynecHistory.durationOfMenstrualFlow} days</label> |
                                </>
                            )}
                            {gynecHistory.clots !== undefined && (
                                <>
                                    <span> Clots</span> : <label>{gynecHistory.clots ? 'Yes' : 'No'}</label> |
                                </>
                            )}
                            {gynecHistory.numberOfPadsPerDay && (
                                <>
                                    <span> Pads per day</span> : <label>{gynecHistory.numberOfPadsPerDay}</label> |
                                </>
                            )}
                        </div>
                        <div className="my-2">
                            {gynecHistory.pain && (
                                <>
                                    <span>Pain</span> : <label>{gynecHistory.pain}</label> |
                                </>
                            )}
                            {gynecHistory.occurrenceOfPain && (
                                <>
                                    <span> Occurrence</span> : <label>{gynecHistory.occurrenceOfPain}</label> |
                                </>
                            )}
                        </div>
                        <div className="my-2">
                            {gynecHistory.ageAtMenarche && (
                                <>
                                    <span>Menarche at</span> : <label>{gynecHistory.ageAtMenarche} Years</label> |
                                </>
                            )}
                            {gynecHistory.typeOfMenopause && (
                                <>
                                    <span> Menopause type</span> : <label>{gynecHistory.typeOfMenopause}</label>
                                </>
                            )}
                        </div>
                    </div>
                )
            };
    
            data.push(updateData);
            setAccordionItems(data);
        } else {
            setAccordionItems([]);
        }
    }, [gynecHistory]);

    return (
        <>
            <div className="overflow-y-auto" style={{ maxHeight: "661px" }}>
                <div>
                    {gynecHistory && (
                        <div className="p-10">
                            <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian history-sider-box history-sider-box-white" expandIconPosition={'end'} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default React.memo(GynecHistoryList);
