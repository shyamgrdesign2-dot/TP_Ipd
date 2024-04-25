import React, { useState, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import { Spin } from 'antd';

import MedicalHistoryicon from '../assets/images/Medical-History.svg';
import arrowright from '../assets/images/arrow-box-right.svg';
import heartBeat from '../assets/images/heartBeat.svg';

function MedicalHistory({ loading, medicalHistoryData }) {

    const [isExpand, setIsExpand] = useState(false);

    const manageExpand = useCallback(() => {
        setIsExpand(!isExpand)
    }, [isExpand])

    return (
        <div className="appointment-wrap PatientDetailswrap m-0">
            <Card>
                <Card.Header className='bg-white py-3'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div>
                            <img src={MedicalHistoryicon} alt="Medical History" className='me-3' />
                            Medical History
                        </div>
                        {/* <a>
                            <img src={arrowright} alt="right" />
                        </a> */}
                    </div>
                </Card.Header>
                <div className='p-3'>
                    <div className={`${!isExpand ? 'overflow-hidden' : 'overflow-auto'}`} style={{ height: isExpand ? 529 : 190 }}>
                        {medicalHistoryData && medicalHistoryData.length > 0 ? (
                            medicalHistoryData?.map((e, i) => {
                                return (
                                    <>
                                        <div className={`fw-semibold ${i !== 0 && 'pt-2'}`}>{e?.title}</div>
                                        {!e?.no_know_history ? (
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
                                        )}
                                    </>
                                )
                            })
                        ) : (
                            <div className='d-flex flex-column justify-content-center' style={{ minHeight: "190px" }}>
                                {loading ? (
                                    <div className='align-items-center text-center'>
                                        <Spin />
                                    </div>
                                ) : (
                                    <div className='align-items-center text-center'>
                                        <img src={heartBeat} width={57} height={52} alt="No vital & body composition saved for the patient!" />
                                        <p className='mt-4 fontroboto'>No Medical History saved <br /> for the patient!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {medicalHistoryData && medicalHistoryData.length > 0 && (
                        <div className='py-2 text-center text-primary fw-medium cursor-pointer' onClick={manageExpand}>{isExpand ? 'View less' : 'View more'}</div>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default React.memo(MedicalHistory)