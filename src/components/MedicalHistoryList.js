import React, { useState, useEffect, useContext } from "react";
import { Collapse } from 'antd';

import CashManagerContext from '../context/CashManagerContext';

function MedicalHistoryList(props) {
    const { medicalHistoryData } = useContext(CashManagerContext);
    const {gynecHistory} = props
    const [accordionItems, setAccordionItems] = useState([]);

    useEffect(() => {
        if (medicalHistoryData.length > 0) {
            const data = []
            medicalHistoryData?.map((e, i) => {
                if (e?.no_know_history || e?.tags?.length > 0) {
                    return data.push({
                        key: `${i + 1}`,
                        label: <div className="fw-semibold">{e?.title}</div>,
                        children:
                            !e?.no_know_history ? (
                                <div className="cardbody-data">
                                    {e?.tags?.filter(x => x.enable == 'Y').length > 0 && (
                                        <div className='border rounded px-2 my-2'>
                                            {e?.tags?.filter(x => x.enable == 'Y')?.map((e1, i1) => {
                                                return (
                                                    <>
                                                        <div key={Math.random()} className='my-2'>
                                                            <span>Issue</span> : <label>{e1?.title}</label>
                                                            {e1?.since && (
                                                                <> | <span>Since</span> : <label>{e1?.since}</label></>
                                                            )}
                                                            {e?.tmmhs_id != 3 && (
                                                                <>
                                                                    {e1?.status && (
                                                                        <> | <span>Status</span> : <label>{e1?.status}</label></>
                                                                    )}
                                                                    {e1?.medication && (
                                                                        <> | <span>Medication</span> : <label>{e1?.medication}</label></>
                                                                    )}
                                                                </>
                                                            )}
                                                            {e?.tmmhs_id == 3 && e1?.relationship && (
                                                                <> | <span>Relationship</span> : <label>{e1?.relationship}</label></>
                                                            )}
                                                        </div>
                                                        {e1?.note && (
                                                            <div key={Math.random()} className='my-2'>
                                                                <span>Note</span> : <label>{e1?.note}</label>
                                                            </div>
                                                        )}
                                                    </>

                                                )
                                            })}
                                        </div>
                                    )}
                                    {e?.tags?.filter(x => x.enable == 'N').length > 0 && (
                                        <div className='border rounded px-2 my-2'>
                                            {e?.tags?.filter(x => x.enable == 'N')?.map((e1, i1) => {
                                                return (
                                                    <div key={Math.random()} className='my-2'>
                                                        <label>{`No ${e1?.title}`}</label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="fontroboto border rounded p-2 my-2 text-history fw-normal">{`No known history`}</div>
                            )
                    });
                }
            });
            setAccordionItems(data)
        } else {
            setAccordionItems([])
        }
    }, [medicalHistoryData]);

    return (
        <>
            <div className="overflow-y-auto" style={{ maxHeight: "661px" }}>
                <div>
                    {medicalHistoryData.length > 0 && (
                        <>
                            { gynecHistory &&
                                <div className="cardbody-data mx-3 mt-2">
                                    <span style={{    fontWeight: "600", marginLeft: "-6px", color: "black", fontSize: "0.9rem"}}>
                                        Menstrual Details
                                    </span>
                                    <div className="my-2">
                                        <span>Cycle</span> : <label>{gynecHistory.cycle}</label> | <span>Cycle Interval</span> : <label>{gynecHistory.intervalOfCycle}</label> | <span>Flow</span> : <label>{gynecHistory.flow}</label>
                                    </div>
                                    <div className="my-2">
                                        <span>Duration</span> : <label>{gynecHistory.durationOfMenstrualFlow} days</label> | <span>Clots</span> : <label>{gynecHistory.clots}</label> | <span>Pads per day</span> : <label>{gynecHistory.numberOfPadsPerDay}</label>
                                    </div>
                                    <div className="my-2">
                                        <span>Pain</span> : <label>{gynecHistory.pain}</label> | <span>Occurrence</span> : <label>{gynecHistory.occurrenceOfPain}</label>
                                    </div>
                                    <div className="my-2">
                                        <span>Menarche at</span> : <label>{gynecHistory.ageAtMenarche} Years</label> | <span>Menopause type</span> : <label>{gynecHistory.typeOfMenopause}</label>
                                    </div>
                                </div>
                            }
                            <div className="p-10">
                                <Collapse items={accordionItems} defaultActiveKey={['1', '2', '3', '4']} className="prescriptiontab-accordian history-sider-box history-sider-box-white" expandIconPosition={'end'} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}


export default React.memo(MedicalHistoryList);
