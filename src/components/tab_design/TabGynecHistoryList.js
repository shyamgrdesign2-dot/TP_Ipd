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
                                    <div className="text-history font-roboto fs-13 t-bold">LMP</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{new Date(gynecHistory.lmp).toISOString().split('T')[0]}</div>
                                </div>
                            )}
                            {gynecHistory.ageAtMenarche && (
                                <div key="ageAtMenarche" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Menarche at</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.ageAtMenarche} years</div>
                                </div>
                            )}
                            {gynecHistory.cycle && (
                                <div key="cycle" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Cycle</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.cycle}</div>
                                </div>
                            )}
                            {gynecHistory.intervalOfCycle && (
                                <div key="intervalOfCycle" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Cycle Interval</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.intervalOfCycle} days</div>
                                </div>
                            )}
                            {gynecHistory.flow && (
                                <div key="flow" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Flow</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.flow}</div>
                                </div>
                            )}
                            {gynecHistory.durationOfMenstrualFlow && (
                                <div key="durationOfMenstrualFlow" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Duration</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.durationOfMenstrualFlow} days</div>
                                </div>
                            )}
                            {gynecHistory.clots !== undefined && gynecHistory.clots !== '' && (
                                <div key="clots" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Clots</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.clots ? 'Yes' : 'No'}</div>
                                </div>
                            )}
                            {gynecHistory.numberOfPadsPerDay && (
                                <div key="numberOfPadsPerDay" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Pads per day</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.numberOfPadsPerDay}</div>
                                </div>
                            )}
                            {gynecHistory.pain && (
                                <div key="pain" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Pain</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.pain}</div>
                                </div>
                            )}
                            {gynecHistory.occurrenceOfPain && (
                                <div key="occurrenceOfPain" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">Occurrence</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.occurrenceOfPain}</div>
                                </div>
                            )}
                            {gynecHistory.ageAtMenopause && (
                                <div key="ageAtMenopause" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">{gynecHistory?.reproductiveLifeStages} at</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.ageAtMenopause} years</div>
                                </div>
                            )}
                            {gynecHistory.typeOfMenopause && (
                                <div key="typeOfMenopause" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fs-13 t-bold">{gynecHistory?.reproductiveLifeStages} type</div>
                                    <div className="semicolon">:</div>
                                    <div className="text-history font-roboto fs-13">{gynecHistory.typeOfMenopause}</div>
                                </div>
                            )}
                            {gynecHistory.notes && (
                                <div key="notes" className="my-2">
                                    <div style={{fontSize: "12px",fontWeight:"600"}} >Menstruation notes</div>
                                    <div style={{fontSize: "12px"}} className="border rounded px-2">{gynecHistory.notes}</div>
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