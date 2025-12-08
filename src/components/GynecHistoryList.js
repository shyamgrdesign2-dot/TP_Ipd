import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import moment from 'moment';
import { fetchGynecHistory } from '../redux/prescriptionSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

function GynecHistoryList(props) {
    const {gynecHistory: gynecHistoryFromProps, showTitle = true, fetchDataOnLaunch = true} = props
    const [accordionItems, setAccordionItems] = useState([]);

    const  dispatch = useDispatch();

    const {
        userId,
      } = useSelector((state) => state.doctors);
    const { gynecHistoryData : gynecHistoryFromStore } = useSelector((state) => state.prescription);

    const { state } = useLocation();
    const { patient_data } = state;
    
    const gynecHistory = gynecHistoryFromProps || gynecHistoryFromStore;
    
    
    useEffect(() => {
        if (!fetchDataOnLaunch) return;
        
        if (!gynecHistory) {
        
            dispatch(
              fetchGynecHistory({
                patientId: patient_data.patient_unique_id,
                userId,
              })
            );
        }
    }, [gynecHistory.length, fetchDataOnLaunch]);

    const filteredGynecHistory = Object.keys(gynecHistory || {}).reduce((acc, key) => {
        if ( key !== 'reproductiveLifeStages' ) {
            acc[key] = gynecHistory[key];
        }
        return acc;
    }, {});

    useEffect(() => {
        if (gynecHistory && Object.keys(filteredGynecHistory).length > 0) {
            const data = [];
            const updateData = {
                key: `${1}`,
                label: showTitle ? <ul style={{margin: 0}}><li className="fw-semibold">Menstrual Details</li></ul> : null,
                children: (
                    <div className="cardbody-data ipd-mhl-cardbody">
                        <ul style={{paddingLeft: '36px', paddingRight: '36px'}}>
                            {gynecHistory.lmp && (
                                <li key={Math.random()} className="my-2">
                                    <span>LMP</span> : <label>{moment(gynecHistory.lmp).format('DD/MM/YYYY')}</label>
                                </li>
                            )}
                            {gynecHistory.ageAtMenarche && (
                                <li key={Math.random()} className="my-2">
                                    <span>Menarche at</span> : <label>{gynecHistory.ageAtMenarche} years</label>
                                    {gynecHistory.menarcheNotes && (
                                        <> (<span>Menarche notes</span> : <label>{gynecHistory.menarcheNotes}</label>)</>
                                    )}
                                </li>
                            )}
                            {(gynecHistory.cycle || gynecHistory.intervalOfCycle || gynecHistory.cycleNotes) && (
                                <li key={Math.random()} className="my-2">
                                    {gynecHistory.cycle && (
                                        <><span>Cycle</span> : <label>{gynecHistory.cycle}</label></>
                                    )}
                                    {(gynecHistory.intervalOfCycle || gynecHistory.cycleNotes) && (
                                        <> (<>
                                            {gynecHistory.intervalOfCycle && (
                                                <><span>Cycle Interval</span> : <label>{gynecHistory.intervalOfCycle} days</label></>
                                            )}
                                            {gynecHistory.intervalOfCycle && gynecHistory.cycleNotes && <>, </>}
                                            {gynecHistory.cycleNotes && (
                                                <><span>Cycle Note</span> : <label>{gynecHistory.cycleNotes}</label></>
                                            )}
                                        </>)</>
                                    )}
                                </li>
                            )}
                            {(gynecHistory.flow || gynecHistory.durationOfMenstrualFlow || gynecHistory.clots || gynecHistory.numberOfPadsPerDay || gynecHistory.flowNotes) && (
                                <li key={Math.random()} className="my-2">
                                    {gynecHistory.flow && (
                                        <><span>Flow</span> : <label>{gynecHistory.flow}</label></>
                                    )}
                                    {(gynecHistory.durationOfMenstrualFlow || gynecHistory.clots || gynecHistory.numberOfPadsPerDay || gynecHistory.flowNotes) && (
                                        <> (<>
                                            {gynecHistory.durationOfMenstrualFlow ? (
                                                <><span>Duration</span> : <label>{gynecHistory.durationOfMenstrualFlow} days</label></>
                                            ): null}
                                            {gynecHistory.durationOfMenstrualFlow ? (gynecHistory.clots || gynecHistory.numberOfPadsPerDay || gynecHistory.flowNotes) && <>, </>: null}
                                            {gynecHistory.clots !== undefined && gynecHistory.clots !== '' && (
                                                <><span>Clots</span> : <label>{gynecHistory.clots ? 'Yes' : 'No'}</label></>
                                            )}
                                            {gynecHistory.clots !== undefined && gynecHistory.clots !== '' && (gynecHistory.numberOfPadsPerDay || gynecHistory.flowNotes) && <>, </>}
                                            {gynecHistory.numberOfPadsPerDay ? (
                                                <><span>Pads per day</span> : <label>{gynecHistory.numberOfPadsPerDay}</label></>
                                            ): null}
                                            {gynecHistory.numberOfPadsPerDay && gynecHistory.flowNotes ? <>, </>: null}
                                            {gynecHistory.flowNotes ? (
                                                <><span>Flow notes</span> : <label>{gynecHistory.flowNotes}</label></>
                                            ): null}
                                        </>)</>
                                    )}
                                </li>
                            )}
                            {(gynecHistory.pain || gynecHistory.occurrenceOfPain || gynecHistory.painNotes) && (
                                <li key={Math.random()} className="my-2">
                                    {gynecHistory.pain && (
                                        <><span>Pain</span> : <label>{gynecHistory.pain}</label></>
                                    )}
                                    {(gynecHistory.occurrenceOfPain || gynecHistory.painNotes) && (
                                        <> (<>
                                            {gynecHistory.occurrenceOfPain && (
                                                <><span>Occurrence</span> : <label>{gynecHistory.occurrenceOfPain}</label></>
                                            )}
                                            {gynecHistory.occurrenceOfPain && gynecHistory.painNotes && <>, </>}
                                            {gynecHistory.painNotes && (
                                                <><span>Pain note</span> : <label>{gynecHistory.painNotes}</label></>
                                            )}
                                        </>)</>
                                    )}
                                </li>
                            )}
                            {(gynecHistory.ageAtMenopause || gynecHistory.typeOfMenopause || gynecHistory.reproductiveNotes) && gynecHistory?.reproductiveLifeStages && (
                                <li key={Math.random()} className="my-2">
                                    {gynecHistory.ageAtMenopause && (
                                        <><span>{gynecHistory?.reproductiveLifeStages} at</span> : <label>{gynecHistory.ageAtMenopause} years</label></>
                                    )}
                                    {(gynecHistory.typeOfMenopause || gynecHistory.reproductiveNotes) && (
                                        <> (<>
                                            {gynecHistory.typeOfMenopause && (
                                                <><span>{gynecHistory?.reproductiveLifeStages} type</span> : <label>{gynecHistory.typeOfMenopause}</label></>
                                            )}
                                            {gynecHistory.typeOfMenopause && gynecHistory.reproductiveNotes && <>, </>}
                                            {gynecHistory.reproductiveNotes && (
                                                <><span>{gynecHistory?.reproductiveLifeStages} note</span> : <label>{gynecHistory.reproductiveNotes}</label></>
                                            )}
                                        </>)</>
                                    )}
                                </li>
                            )}
                            {gynecHistory.notes && (
                                <li key={Math.random()} className="my-2">
                                    <span>Menstruation notes</span> : <label>{gynecHistory.notes}</label>
                                </li>
                            )}
                        </ul>
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
            <div className="overflow-y-auto">
                {gynecHistory && (
                    <Collapse items={accordionItems} defaultActiveKey={['1']} className="prescriptiontab-accordian history-sider-box history-sider-box-white" expandIconPosition={'end'} />
                )}
            </div>
        </>
    );
}

export default React.memo(GynecHistoryList);
