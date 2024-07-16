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
                    <div className="cardbody-data border rounded px-2 my-2">
                        {gynecHistory.cycle && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Cycle&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.cycle}</div>
                            </div>
                        )}
                        {gynecHistory.intervalOfCycle && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Cycle Interval&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.intervalOfCycle}</div>
                            </div>
                        )}
                        {gynecHistory.flow && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Flow&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.flow}</div>
                            </div>
                        )}
                        {gynecHistory.durationOfMenstrualFlow && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Duration&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.durationOfMenstrualFlow} days</div>
                            </div>
                        )}
                        {gynecHistory.clots !== undefined && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Clots&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.clots ? 'Yes' : 'No'}</div>
                            </div>
                        )}
                        {gynecHistory.numberOfPadsPerDay && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Pads per day&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.numberOfPadsPerDay}</div>
                            </div>
                        )}
                        {gynecHistory.pain && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Pain&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.pain}</div>
                            </div>
                        )}
                        {gynecHistory.occurrenceOfPain && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Occurrence&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.occurrenceOfPain}</div>
                            </div>
                        )}
                        {gynecHistory.ageAtMenarche && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Menarche at&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.ageAtMenarche} Years</div>
                            </div>
                        )}
                        {gynecHistory.typeOfMenopause && (
                            <div key={Math.random()} className="d-flex my-2">
                                <div className="text-history font-roboto fw-medium">Menopause type&nbsp;:&nbsp;</div>
                                <div className="fontroboto text-history fw-normal">{gynecHistory.typeOfMenopause}</div>
                            </div>
                        )}
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
            <div className="overflow-y-auto" style={{ height: "calc(100vh - 108px)" }}>
                <div className="p-10">
                    {gynecHistory > 0 && (
                        <div className="border rounded-3 bg-body mt-3 p-10">
                            <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian history-sider-box" expandIconPosition={'end'} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}


export default React.memo(TabGynecHistoryList);
