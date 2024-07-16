import React, { useState, useEffect, useContext } from "react";
import { Button, Collapse } from 'antd';

import CashManagerContext from '../../context/CashManagerContext';
import { GB_GYNEC_HISTORY } from "../../utils/constants";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import TabGynecHistoryList from "./TabGynecHistoryList";

// Read More content
const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className="text mb-0 fontroboto lh-base">
            {isReadMore && text.length > 70 ? text.slice(0, 70) : text}
            <span onClick={toggleReadMore} className="read-or-hide">
                {text.length > 70 ? isReadMore ? "... View More" : " View Less" : ""}
            </span>
        </p>
    );
};

function TabMedicalHistoryList(props) {

    const { handleDrawerMedicalHistory, handleCollapsed } = props

    const { medicalHistoryData } = useContext(CashManagerContext);

    const {gynecHistory} = props
    const [accordionItems, setAccordionItems] = useState([]);

    const isGynecHistoryAccessableFromGB = useFeatureIsOn(
        GB_GYNEC_HISTORY
    );

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
                                e?.tags?.map((e1, i1) => {
                                    return (
                                        e1?.enable == 'Y' ? (
                                            <>
                                                <div key={Math.random()} className="d-flex my-2">
                                                    <div className="text-history font-roboto fw-medium">Issue&nbsp;:&nbsp;</div>
                                                    <div className="fontroboto text-history fw-normal">{e1?.title}</div>
                                                </div>
                                                {e1?.since && (
                                                    <div key={Math.random()} className="d-flex my-2">
                                                        <div className="text-history fontroboto fw-medium">Since&nbsp;:&nbsp;</div>
                                                        <div className="fontroboto text-history fw-normal">{e1?.since}</div>
                                                    </div>
                                                )}
                                                {e?.tmmhs_id != 3 && (
                                                    <>
                                                        {e1?.status && (
                                                            <div key={Math.random()} className="d-flex my-2">
                                                                <div className="text-history fontroboto fw-medium">Status&nbsp;:&nbsp;</div>
                                                                <div className="fontroboto text-history fw-normal">{e1?.status}</div>
                                                            </div>
                                                        )}
                                                        {e1?.medication && (
                                                            <div key={Math.random()} className="d-flex my-2">
                                                                <div className="text-history fontroboto fw-medium">Medication&nbsp;:&nbsp;</div>
                                                                <div className="fontroboto text-history fw-normal">{e1?.medication}</div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {e?.tmmhs_id == 3 && e1?.relationship && (
                                                    <div key={Math.random()} className="d-flex my-2">
                                                        <div className="text-history fontroboto fw-medium">Relationship&nbsp;:&nbsp;</div>
                                                        <div className="fontroboto text-history fw-normal">{e1?.relationship}</div>
                                                    </div>
                                                )}
                                                {e1?.note && (
                                                    <div key={Math.random()} className="my-2">
                                                        <div className="text-history fontroboto fw-medium">Notes&nbsp;:&nbsp;</div>
                                                        <div className="border rounded-3 px-2 py-5px-3px">
                                                            <ReadMore>
                                                                {e1?.note}
                                                            </ReadMore>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : e1?.enable == 'N' ? (
                                            <div key={Math.random()} className="fontroboto text-history fw-normal">{`No ${e1?.title}`}</div>
                                        ) : (
                                            null
                                        )
                                    )
                                })
                            ) : (
                                <div className="fontroboto border rounded p-1 my-2 text-history fw-normal">{`No known history`}</div>
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
            <div className="text-white align-items-center bg-secondary d-flex justify-content-between lh-lg px-2 py-2">
                History
                <Button type="text" className="btn p-0 btn-outline" onClick={handleCollapsed}>
                    <i className='icon-Contract fs-21 text-white p-0'></i>
                </Button>
            </div>
            <div className="overflow-y-auto" style={{ height: "calc(100vh - 108px)" }}>
                <div className="p-10">
                    <Button className='btn btn-input d-flex w-100 align-items-center btn-41' onClick={handleDrawerMedicalHistory}>
                        <i className='icon-Add me-2 fs-21'></i>
                        Add or Edit History
                    </Button>
                    {gynecHistory && isGynecHistoryAccessableFromGB &&
                        <TabGynecHistoryList gynecHistory={gynecHistory}/>
                    }
                    {medicalHistoryData.length > 0 && (
                        <div className="border rounded-3 bg-body mt-3 p-10">
                            <Collapse items={accordionItems} defaultActiveKey={['1', '2', '3', '4']} className="prescriptiontab-accordian history-sider-box" expandIconPosition={'end'} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}


export default React.memo(TabMedicalHistoryList);
