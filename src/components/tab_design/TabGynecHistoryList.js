import React, { useState, useEffect, useContext } from "react";
import { Button, Collapse } from 'antd';

function TabGynecHistoryList(props) {
    const {gynecHistory} = props
    const [accordionItems, setAccordionItems] = useState([]);

    const filteredGynecHistory = Object.keys(gynecHistory || {}).reduce((acc, key) => {
        if ( key !== 'reproductiveLifeStages' ) {
            acc[key] = gynecHistory[key];
        }
        return acc;
    }, {});

    useEffect(() => {
        if (gynecHistory && Object.keys(filteredGynecHistory).length > 0) {
            const data = []
            const updateData = {
                key: `${1}`,
                label: <div className="fw-semibold">Menstrual Details</div>,
                children: (
                    <div className="cardbody-data">
                        <div className="gynec-history-list">
                            {gynecHistory.lmp && (
                                <div key="lmp" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">LMP</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{new Date(gynecHistory.lmp).toISOString().split('T')[0]}</div>
                                </div>
                            )}
                            {gynecHistory.ageAtMenarche && (
                                <div key="ageAtMenarche" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Menarche at</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.ageAtMenarche} years</div>
                                </div>
                            )}
                            {gynecHistory.cycle && (
                                <div key="cycle" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Cycle</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.cycle}</div>
                                </div>
                            )}
                            {gynecHistory.intervalOfCycle && (
                                <div key="intervalOfCycle" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Cycle Interval</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.intervalOfCycle} days</div>
                                </div>
                            )}
                            {gynecHistory.flow && (
                                <div key="flow" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Flow</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.flow}</div>
                                </div>
                            )}
                            {gynecHistory.durationOfMenstrualFlow && (
                                <div key="durationOfMenstrualFlow" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Duration</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.durationOfMenstrualFlow} days</div>
                                </div>
                            )}
                            {gynecHistory.clots !== undefined && gynecHistory.clots !== '' && (
                                <div key="clots" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Clots</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.clots ? 'Yes' : 'No'}</div>
                                </div>
                            )}
                            {gynecHistory.numberOfPadsPerDay && (
                                <div key="numberOfPadsPerDay" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Pads per day</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.numberOfPadsPerDay}</div>
                                </div>
                            )}
                            {gynecHistory.pain && (
                                <div key="pain" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Pain</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.pain}</div>
                                </div>
                            )}
                            {gynecHistory.occurrenceOfPain && (
                                <div key="occurrenceOfPain" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Occurrence</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.occurrenceOfPain}</div>
                                </div>
                            )}
                            {gynecHistory.ageAtMenopause && (
                                <div key="ageAtMenopause" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">{gynecHistory?.reproductiveLifeStages} at</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.ageAtMenopause} years</div>
                                </div>
                            )}
                            {gynecHistory.typeOfMenopause && (
                                <div key="typeOfMenopause" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">{gynecHistory?.reproductiveLifeStages} type</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fw-medium">{gynecHistory.typeOfMenopause}</div>
                                </div>
                            )}
                            {gynecHistory.notes && (
                                <div key="notes" className="my-2">
                                    <div className="font-roboto fw-medium">Menstruation notes</div>
                                    <div className="border rounded px-2">{gynecHistory.notes}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            };
            data.push(updateData);
            setAccordionItems(data)
        } else {
            setAccordionItems([])
        }
    }, [gynecHistory]);

    return (
        <>
            {gynecHistory && (
                <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian history-sider-box" expandIconPosition={'end'} />
            )}
        </>
    );
}


export default React.memo(TabGynecHistoryList);
