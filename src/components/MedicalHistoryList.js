import React, { useState, useEffect, useContext } from "react";
import { Collapse } from 'antd';

import CashManagerContext from '../context/CashManagerContext';
import GynecHistoryList from "./GynecHistoryList";
import { useAccess } from "../pages/vaccination/useAccess";
import { fetchGynecHistory } from "../redux/prescriptionSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function MedicalHistoryList(props) {
    const {gynecHistory: gynecHistoryFromProps, patientDataFromProps, isIPD } = props

    const [accordionItems, setAccordionItems] = useState([]);

    const {isGynaecHistoryAccessable} = useAccess();
    const  dispatch = useDispatch();

    const {
        userId,
      } = useSelector((state) => state.doctors);
    const { medicalHistoryData, gynecHistoryData: gynecHistoryFromStore } = useSelector((state) => state.prescription);
    const gynecHistory = gynecHistoryFromProps || gynecHistoryFromStore;
      const { state } = useLocation();
  const { patient_data } = state;

  const patientData = patient_data || patientDataFromProps;

    useEffect(() => {
        if (!gynecHistory && !isIPD) {
            dispatch(fetchGynecHistory(patientData?.patient_unique_id,userId));
        }
    }, []);

    const filteredGynecHistory = Object.keys(gynecHistory || {}).reduce((acc, key) => {
        if ( key !== 'reproductiveLifeStages' ) {
            acc[key] = gynecHistory[key];
        }
        return acc;
    }, {});

    const medical_history_title = (id) => {
        var value = ''
        if (id == 2 ) {
            value = `Condition : `
        } else if (id == 3) {
            value = `History : `
        } else if (id == 4) {
            value = `Allergies to : `
        } else if (id == 1) {
            value = `Habit : `
        }
        return value
    }

    useEffect(() => {
        if (medicalHistoryData.length > 0) {
            const data = []
            medicalHistoryData?.map((e, i) => {
                if (e?.no_know_history || e?.tags?.length > 0) {
                    return data.push({
                        key: `${i + 1}`,
                        label: <ul style={{margin: 0}}><li className="fw-semibold">{e?.title}</li></ul>,
                        children:
                            !e?.no_know_history ? (
                                <div className="cardbody-data ipd-mhl-cardbody">
                                        {e?.tags?.filter(x => x.enable == 'Y').length > 0 && (
                                            <ul style={{paddingLeft: '48px', paddingRight: '48px'}}>
                                                {e?.tags?.filter(x => x.enable == 'Y')?.map((e1, i1) => {
                                                    return (
                                                        <>
                                                            <li key={Math.random()} className='my-2'>
                                                                <label style={{fontWeight: 600}} >{e1?.title}</label>
                                                                {(() => {
                                                                    const parts = [];
                                                                    if (e1?.since) parts.push(<><b>Since</b>: {e1.since}</>);
                                                                    if (e?.tmmhs_id != 3) {
                                                                        if (e1?.status) parts.push(<><b>Status</b>: {e1.status}</>);
                                                                        if (e1?.medication) parts.push(<><b>Medication</b>: {e1.medication}</>);
                                                                    }
                                                                    if (e?.tmmhs_id == 3 && e1?.relationship) {
                                                                        parts.push(<><b>Relationship</b>: {e1.relationship}</>);
                                                                    }
                                                                    if (e1?.note) parts.push(<><b>Note</b>: {e1.note}</>);
                                                                    return parts.length ? (
                                                                        <> ({parts.map((part, index) => (
                                                                            <React.Fragment key={index}>
                                                                                {index > 0 && ', '}
                                                                                {part}
                                                                            </React.Fragment>
                                                                        ))})</>
                                                                    ) : null;
                                                                })()}
                                                            </li>
                                                            {e1?.medical_history_remarks && (
                                                                <li key={Math.random()} className='my-2'>
                                                                    <span>Additional History</span> : <label>{e1?.medical_history_remarks}</label>
                                                                </li>
                                                            )}
                                                        </>

                                                    )
                                                })}
                                            </ul>
                                        )}
                                    {e?.tags?.filter(x => x.enable == 'N').length > 0 && (
                                        <ul style={{paddingLeft: '48px', paddingRight: '48px'}}>
                                            {e?.tags?.filter(x => x.enable == 'N')?.map((e1, i1) => {
                                                return (
                                                    <li key={Math.random()} className='my-2'>
                                                        <label style={{fontWeight: 600}}>{`No ${e1?.title}`}</label>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <ul style={{paddingLeft: '48px', paddingRight: '48px'}}>
                                    <li className="fontroboto p-1 text-history fw-normal">{`No known history`}</li>
                                </ul>
                            )
                    });
                }
            });
            if(medicalHistoryData?.[0]?.medical_history_remarks) {
                data.push({
                    key: "5",
                    label: <ul style={{margin: 0}}><li className="fw-semibold">Additional History</li></ul>,
                    children: <ul style={{paddingLeft: '48px', paddingRight: '48px'}}>
                    <li className="fontroboto p-1 text-history fw-normal">{medicalHistoryData?.[0]?.medical_history_remarks}</li>
                </ul>
                })
            }
            setAccordionItems(data)
        } else {
            setAccordionItems([])
        }
    }, [medicalHistoryData]);

    return (
        <>
            <div className="overflow-y-auto ipd-mhl-container" style={{ maxHeight: "661px" }}>
                { (medicalHistoryData.length > 0 || (gynecHistory && Object.keys(filteredGynecHistory).length > 0)) && (
                    <div className="p-10">
                        { isGynaecHistoryAccessable && gynecHistory && Object.keys(filteredGynecHistory).length > 0 &&
                            <GynecHistoryList gynecHistory={gynecHistory} />
                        }
                        <Collapse items={accordionItems} defaultActiveKey={['1', '2', '3', '4', '5']} className="prescriptiontab-accordian history-sider-box history-sider-box-white" expandIconPosition={'end'} />
                    </div>
                )}
            </div>
        </>
    );
}

export default React.memo(MedicalHistoryList);
