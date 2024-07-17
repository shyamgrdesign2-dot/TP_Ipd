import React, { useState, useEffect, useContext } from "react";
import { Button, Collapse } from 'antd';

function TabGynecHistoryList(props) {
    const {gynecHistory} = props
    const [accordionItems, setAccordionItems] = useState([]);

    useEffect(() => {
        if (gynecHistory) {
            const data = []
            const updateData = {
                key: `${1}`,
                label: <div className="fw-semibold">Menstrual Details</div>,
                children: (
                    <div className="cardbody-data">
                        <div className="gynec-history-list">
                            {gynecHistory.lmp && (
                                <div key="cycle" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">LMP</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.cycle}</div>
                                </div>
                            )}
                            {gynecHistory.cycle && (
                                <div key="cycle" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Cycle</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.cycle}</div>
                                </div>
                            )}
                            {gynecHistory.intervalOfCycle && (
                                <div key="intervalOfCycle" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Cycle Interval</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.intervalOfCycle} days</div>
                                </div>
                            )}
                            {gynecHistory.flow && (
                                <div key="flow" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Flow</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.flow}</div>
                                </div>
                            )}
                            {gynecHistory.durationOfMenstrualFlow && (
                                <div key="durationOfMenstrualFlow" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Duration</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.durationOfMenstrualFlow} days</div>
                                </div>
                            )}
                            {gynecHistory.clots !== undefined && (
                                <div key="clots" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Clots</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.clots ? 'Yes' : 'No'}</div>
                                </div>
                            )}
                            {gynecHistory.numberOfPadsPerDay && (
                                <div key="numberOfPadsPerDay" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Pads per day</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.numberOfPadsPerDay}</div>
                                </div>
                            )}
                            {gynecHistory.pain && (
                                <div key="pain" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Pain</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.pain}</div>
                                </div>
                            )}
                            {gynecHistory.occurrenceOfPain && (
                                <div key="occurrenceOfPain" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Occurrence</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.occurrenceOfPain}</div>
                                </div>
                            )}
                            {gynecHistory.ageAtMenarche && (
                                <div key="ageAtMenarche" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Menarche at</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.ageAtMenarche} Years</div>
                                </div>
                            )}
                            {gynecHistory.ageAtMenopause && (
                                <div key="ageAtMenarche" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Menopause at</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.ageAtMenopause} Years</div>
                                </div>
                            )}
                            {gynecHistory.typeOfMenopause && (
                                <div key="typeOfMenopause" className="d-flex justify-content-between align-items-center my-2">
                                    <div className="text-history font-roboto fw-medium">Menopause type</div>
                                    <div className="semicolon">:</div>
                                    <div className="fontroboto text-history fw-normal">{gynecHistory.typeOfMenopause}</div>
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
