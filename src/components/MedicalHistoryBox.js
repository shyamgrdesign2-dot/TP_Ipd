import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Card, Row, Col, Checkbox, Input, message, Spin } from 'antd';

import { LoadingOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import CashManagerContext from '../context/CashManagerContext';
import { MESSAGE_KEY } from "../utils/constants";
import { capitalizeAfterSentence } from "../utils/utils";

import noRecordFound from '../assets/images/no-record-round.svg';
import verticleUpDown from '../assets/images/verticle-up-down.svg';
import ActiveverticleUpDown from '../assets/images/active-verticle-up-down.svg';
import InActiveverticleUpDown from '../assets/images/inactive-verticle-up-down.svg';
import NoHypertension from '../assets/images/no-hypertension.png';

import {
    listSectionwithTag
} from "../redux/medicalhistorySlice";

function MedicalHistoryBox(props) {

    const { handleDrawerMedicalHistory } = props

    const [messageApi, contextHolder] = message.useMessage();
    const {
        defaultList,
        loading,
    } = useSelector((state) => state.medicalhistory);
    const dispatch = useDispatch();

    const { medicalHistoryData, setMedicalHistoryData } = useContext(CashManagerContext);
    // const [ medicalHistoryData, setMedicalHistoryData] = useState([]);

    const [selectData, setSelectData] = useState(null);

    // useEffect(() => {
    //     defaultList.length === 0 && dispatch(listSectionwithTag());
    // }, [handleDrawerMedicalHistory]);

    useEffect(() => {
        dispatch(listSectionwithTag());
    }, []);

    useEffect(() => {
        setMedicalHistoryData(JSON.parse(JSON.stringify(defaultList)));
    }, [defaultList]);

    const onNoKnownHistoryChange = useCallback((e, i) => {
        medicalHistoryData[i].no_know_history = e.target.checked
        setMedicalHistoryData((prev) => [...prev]);
    }, [medicalHistoryData]);

    const onExpandCollapseClick = useCallback((i) => {
        medicalHistoryData[i].isExpand = !medicalHistoryData[i].isExpand
        setMedicalHistoryData((prev) => [...prev]);
    }, [medicalHistoryData]);

    const onTagClick = useCallback((tmmhs_id, tmmhst_id, i, i1) => {
        setSelectData({
            tmmhs_id: tmmhs_id,
            tmmhst_id: tmmhst_id,
            section_index: i,
            tag_index: i1
        });
        if (medicalHistoryData[i].tags[i1].enable === undefined) {
            setMedicalHistoryData((prev) => {
                const newArray = [...prev];
                newArray[i].tags[i1] = {
                    ...newArray[i].tags[i1],
                    enable: "Y",
                    status: "",
                    medication: "",
                    note: ""
                };
                return newArray;
            })
        }
    }, [selectData, medicalHistoryData]);

    const onEnableClick = useCallback((tmmhs_id, tmmhst_id, i, i1) => {
        setSelectData({
            tmmhs_id: tmmhs_id,
            tmmhst_id: tmmhst_id,
            section_index: i,
            tag_index: i1
        });
        setMedicalHistoryData((prev) => {
            const newArray = [...prev];
            newArray[i].tags[i1] = {
                ...newArray[i].tags[i1],
                enable: newArray[i].tags[i1].enable !== undefined ?
                    newArray[i].tags[i1].enable == "Y" ? "N"
                        : newArray[i].tags[i1].enable == "N" ? "-" : "Y"
                    : "Y",
                status: "",
                medication: "",
                note: ""
            };
            return newArray;
        })
    }, [selectData, medicalHistoryData]);

    const STATUS_LIST = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];
    const MEDICATION_LIST = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    const onChangeStatus = useCallback((key) => {
        if (key != medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.status) {
            medicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].status = key
        } else {
            medicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].status = ''
        }
        setMedicalHistoryData((prev) => [...prev]);
    }, [selectData, medicalHistoryData]);

    const onChangeMedication = useCallback((key) => {
        if (key != medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.medication) {
            medicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].medication = key
        } else {
            medicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].medication = ''
        }
        setMedicalHistoryData((prev) => [...prev]);
    }, [selectData, medicalHistoryData]);

    const onChangeInputNote = useCallback((e) => {
        medicalHistoryData[selectData?.section_index].tags[selectData?.tag_index].note = capitalizeAfterSentence(e.target.value)
        setMedicalHistoryData((prev) => [...prev]);
    }, [selectData, medicalHistoryData]);

    return (
        <>
            {contextHolder}
            <Card bordered={false} className="search-modalCard">
                <div>
                    <div className='modalCard-header h-60 align-items-center justify-content-between d-flex'>
                        <div className='align-items-center d-flex h-100'>
                            <div className='border-end h-100 text-center me-3'>
                                <div onClick={handleDrawerMedicalHistory} className='btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer'>
                                    <i className='icon-right'></i>
                                </div>
                            </div>
                            <div className="title-common">Medical History</div>
                        </div>
                        <Button className='btn btn-primary3 btn-41 px-4 me-20'>
                            Save
                        </Button>
                    </div>
                </div>
                <Row>
                    <Col lg={15}>
                        <div className="bg-white overflow-y-auto medical-history-section" style={{ height: 'calc(100vh - 194px)' }}>
                            {medicalHistoryData.length > 0 ? (
                                medicalHistoryData?.map((e, i) => {
                                    return (
                                        <div key={i} className="border-bottom px-4 pt-3 pb-2">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="titleprint">{e?.title}</div>
                                                    <Button className="btn border rounded-3 px-1 ms-3 collapseButton" onClick={() => onExpandCollapseClick(i)}>
                                                        <i className="icon-right d-block iconrotate270 fs-18"></i>
                                                    </Button>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <Checkbox className="fontroboto" onChange={(e) => onNoKnownHistoryChange(e, i)}>No known history</Checkbox>
                                                    <button className='btn d-flex ms-1 align-items-center btn-text pe-0'>
                                                        <i className="icon-setting me-2"></i> <span>Add & Edit</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-wrap">
                                                {!e?.no_know_history && !e?.isExpand && e?.tags?.map((e1, i1) => {
                                                    return (
                                                        <div key={i1} className={`history-badge ${e1?.enable !== undefined ? e1?.enable == "Y" ? 'history-active' : e1?.enable == "N" ? 'history-inactive' : '' : ''}`}>
                                                            <div onClick={() => onTagClick(e?.tmmhs_id, e1?.tmmhst_id, i, i1)}>{e1?.title}</div>
                                                            <span onClick={() => onEnableClick(e?.tmmhs_id, e1?.tmmhst_id, i, i1)}>{e1?.enable !== undefined ? e1?.enable : "-"}<img src={e1?.enable !== undefined ? e1?.enable == "Y" ? ActiveverticleUpDown : e1?.enable == "N" ? InActiveverticleUpDown : verticleUpDown : verticleUpDown} />
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <Spin />
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col lg={9}>
                        <div className="bg-body overflow-y-auto" style={{ height: 'calc(100vh - 194px)' }}>
                            {selectData?.tmmhs_id == 1 ? (
                                medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.enable == 'Y' ? (
                                    <div>
                                        <div className="selectedchip-header1 d-flex flex-column justify-content-center title px-20">
                                            <span className="text-truncate">{medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.title}</span>
                                        </div>

                                        <div className="p-3">
                                            <div className="mt-2">
                                                <label className="title-common mb-1"> Since</label>
                                                <div className="segement-static d-flex">
                                                    <button type="button" className='btn w-100'>1</button>
                                                    <button type="button" className='btn w-100'>2</button>
                                                    <button type="button" className='btn w-100'>3</button>
                                                    <button type="button" className='btn w-100'>4</button>
                                                    <button type="button" className='btn w-100'>5</button>
                                                </div>
                                            </div>
                                            <div className="mt-5">
                                                <label className="title-common mb-1">Status</label>
                                                <div className="segement-static d-flex">
                                                    {STATUS_LIST.map((item, i) => {
                                                        return (
                                                            <button key={i}
                                                                type="button"
                                                                className={`btn w-100 ${medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.status !== undefined && medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.status == item.value && 'btn-segement'}`}
                                                                onClick={() => onChangeStatus(item.value)}>
                                                                {item.label}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            {medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.status == 'Active' && (
                                                <div className="mt-5">
                                                    <label className="title-common mb-1"> Medication</label>
                                                    <div className="segement-static d-flex">
                                                        {MEDICATION_LIST.map((item, i) => {
                                                            return (
                                                                <button key={i}
                                                                    type="button"
                                                                    className={`btn w-100 ${medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.medication !== undefined && medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.medication == item.value && 'btn-segement'}`}
                                                                    onClick={() => onChangeMedication(item.value)}>
                                                                    {item.label}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="mt-5">
                                                <label className="title-common mb-1">Note</label>
                                                <Input.TextArea value={medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.note !== undefined && medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.note} placeholder="Enter any specific notes here" className="textareaPlaceholder" rows={3} onChange={onChangeInputNote} />
                                            </div>
                                        </div>
                                    </div>
                                ) : medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.enable == 'N' && (
                                    <div className="text-center">
                                        <img className="mt-4 mb-3" style={{ width: 135 }} src={NoHypertension} alt="No Result Found" />
                                        <div className="title-hypertension">{`No ${medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.title} !`}</div>
                                        <div className="fontroboto text-main title fw-normal mt-2">
                                            You have selected that patient does not <br />
                                            have {medicalHistoryData[selectData?.section_index]?.tags[selectData?.tag_index]?.title}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="text-center">
                                    <img className="my-4" style={{ width: 194 }} src={noRecordFound} alt="No Result Found" />
                                    <div className="fontroboto text-main title-common"> No Records Found! </div>
                                    <div className="fontroboto text-main title fw-normal mt-2"> You haven’t added any medical history. </div>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}


export default React.memo(MedicalHistoryBox);
