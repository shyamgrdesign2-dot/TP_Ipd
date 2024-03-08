import React from "react";
import PrintHeaderImage from "../assets/images/print-header.png";
import { Flex, Col } from "antd";
import { useSelector } from "react-redux";

import { isNumeric } from '../utils/utils'

import '../assets/scss/print.scss';

function PrintHtmlPage({ printSettings }) {

    const { frequencyList, timingList } = useSelector((state) => state.doctors);

    var caseManagerData = {
        "tcm_id": 132351,
        "showConsultationDateTime": "06 Mar 2024, 03:17 pm",
        "follow_up_date": "",
        "visit_advice": "",
        "total_consultation": 180,
        "next_tcm_id": null,
        "prev_tcm_id": 128314,
        "print_url": "https://pms-upgrade.azurewebsites.net/case_manager/pdf_casemanager_send.php?pdf_id=MTMyMzUx&p_id=U1QtMTAxOQ==&pu_id=NDA3OTIzNjg1MQ==&lg=MQ==",
        "print_rx_url": "https://pms-upgrade.azurewebsites.net/case_manager/pdf_prescription_send.php?pdf_id=MTMyMzUx&p_id=U1QtMTAxOQ==&pu_id=NDA3OTIzNjg1MQ==&lg=MQ==",
        "symptoms": [
            {
                "symptom_name": "Complaints 01",
                "unique_id": "3efaa29a-c9db-4ec9-bf13-53ca102c5e1e",
                "change": 0,
                "since": "5 Month",
                "severity": "fgf",
                "note": "Hello"
            },
            {
                "symptom_name": "Complaints 02",
                "unique_id": "1fb050da-1316-4314-a426-c9bdc2e5c8e6",
                "change": 0,
                "since": "5 Month",
                "severity": "",
                "note": ""
            },
            {
                "symptom_name": "Complaints 05",
                "unique_id": "3efaa29a-c9db-4ec9-bf13-53ca102c5e1e",
                "change": 0,
                "since": "",
                "severity": "",
                "note": "Hello"
            },
        ],
        "examination": [
            {
                "examination_name": "Examination 01",
                "note": "Hello",
                "unique_id": "2159a623-581d-4dda-b5d2-4ddd1a4662b9",
                "change": 0
            },
            {
                "examination_name": "Examination 02",
                "note": "",
                "unique_id": "8a26aed6-0539-4910-a003-570a055eb195",
                "change": 0
            }
        ],
        "diagnosis": [
            {
                "unique_id": "4aa464f9-c187-4147-aa57-b5eed7c8a199",
                "tds_id": 1325,
                "tds_name": "Unspecified mental disorder due to known physiological condition",
                "since": "",
                "status": "",
                "note": ""
            }
        ],
        "advice": [
            {
                "objectID": "18b4dc207ffc8f_dashboard_generated_id",
                "advice_name": "AN Sub Title 3-3",
                "unique_id": "5c50574e-2baa-4bb9-b3e1-d183c67de344"
            },
            {
                "objectID": "f8b7ca1326dba_dashboard_generated_id",
                "advice_name": "PH Sub Title 2-4",
                "unique_id": "c0bcb630-27fe-40ea-8ef5-c36ef52b6e1c"
            }
        ],
        "investigation": [
            {
                "report_code": "MI19",
                "price": "2,542",
                "objectID": "fe3e36a79e25a_dashboard_generated_id",
                "investigation_name": "AFB Drug Susceptibility Test: PAS",
                "unique_id": "7a931436-434c-41d1-90ae-16c1b5e1ba31",
                "note": ""
            }
        ],
        "doctor_data": {
            "doctor_name": "Jigish Pansaniya",
            "dp_name": "Psychiatry",
            "editCase": true
        },
        "patient_data": {
            "patinet_id": "ST-1019",
            "patinet_name": "Neel Patel",
            "patinet_dob": "01/01/1970",
            "patinet_age": 54,
            "patinet_gender": "Male",
            "patinet_consultaion_date": "06/03/2024 15:17:23",
            "patinet_email": "",
            "patinet_secondary_name": "",
            "patinet_secondary_contact": "",
            "patinet_address": "",
            "patinet_ht_wt": "/",
            "patinet_consultation_type": null
        },
        "vitals": [
            {
                "date": "2024-03-08",
                "dev_unique_id": "36847",
                "tcv_id": "28164",
                "temp": "50",
                "pres": "50",
                "resp_rate": "60",
                "blood_press": "90/53",
                "spo2": "43",
                "tcbc_id": 8589,
                "height": "43",
                "weight": "43",
                "bmi": "232.56",
                "bmr": "433.75",
                "bsa": "0.72"
            },
            {
                "date": "2024-03-07",
                "dev_unique_id": "31173",
                "tcv_id": "28165",
                "temp": "452",
                "pres": "7452",
                "resp_rate": "42",
                "blood_press": "42/42",
                "spo2": "4",
                "tcbc_id": 8590,
                "height": "7423",
                "weight": "423",
                "bmi": "0.08",
                "bmr": "50358.75",
                "bsa": "29.53"
            }
        ],
        "medicine": [],
        "consultation_date": "2024-03-06 15:17:23"
    }



    return (
        <>
            {/* Header */}
            <div className="pb-4 print-custom-header border-bottom">
                {/* For Upload Image Header */}
                <img className="img-fluid" src={PrintHeaderImage} alt="Header" />

                {/* Print RX on your letter header */}
                {/* <div style={{marginLeft: 50, marginRight: 50, marginTop: 50, marginBottom: 50}}></div> */}

                {/* For custom Header */}
                {/* <div className="text-primary fw-bold fontroboto text-uppercase" style={{ fontSize: 24 }}>
                    Care Clinic
                </div>
                <div className="fontroboto" style={{ fontSize: 14 }}>
                    Hyderabad, India • 07894561230 • contact@careclinic.com
                </div> */}
            </div>

            {/* Patient Details */}
            <div className="py-4 border-dark border-bottom patient-details">
                <Flex justify="space-between">
                    <Col flex={7}>
                        <div className="details-name">
                            <span>Patient Name & ID: </span>
                            <span>Abhishek Baroliya, #MH-020230214002</span>
                        </div>
                        <div className="details-name">
                            <span>Age/Gender: </span>
                            <span>28 Years, Male</span>
                        </div>
                        <div className="details-name">
                            <span>Height / Weight: </span>
                            <span>170cm / 68kg</span>
                        </div>
                        <div className="details-name">
                            <span>Address: </span>
                            <span>K9 Sardar Banglow, Prahladnagar, Ahmedabad 380015, Gujarat</span>
                        </div>
                    </Col>
                    <Col flex={3}>
                        <div className="details-name">
                            <span>Date: </span>
                            <span>22/11/2023 04:36 PM</span>
                        </div>
                        <div className="details-name">
                            <span>Mobile: </span>
                            <span>7894561230</span>
                        </div>
                        <div className="details-name">
                            <span>Blood Group: </span>
                            <span>A+</span>
                        </div>
                    </Col>
                </Flex>
            </div>

            {/* Page Format */}


            {/* Inline|List View|Table */}
            <div className="py-4">
                {caseManagerData.symptoms.length > 0 && (
                    printSettings?.prescription?.case_option[7]?.format === 'inline' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label>
                            {caseManagerData.symptoms.map((item, i) => {
                                return (
                                    <label key={i} style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                        <label className="fw-medium">{item.symptom_name}&nbsp;</label>
                                        {(item.since || item.severity || item.note) ?
                                            <>{`(${Object.values(Object.fromEntries(Object.entries((({ since, severity, note }) => ({ since, severity, note }))(caseManagerData.symptoms[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.symptoms.length - 1 != i ? ',' : ''}&nbsp;</>
                                            :
                                            <>{caseManagerData.symptoms.length - 1 != i ? ',' : ''}&nbsp;</>
                                        }
                                    </label>
                                )
                            })}
                        </div>
                    ) : printSettings?.prescription?.case_option[0]?.format === 'listview' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label> <br />
                            <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                {caseManagerData.symptoms.map((item, i) => {
                                    return (
                                        <>
                                            <label key={Math.random()} className="fw-medium mt-1">&nbsp;{i + 1}.&nbsp;</label>
                                            <label key={Math.random()} className="fw-medium">{item.symptom_name}&nbsp;</label>
                                            {(item.since || item.severity || item.note) &&
                                                <>{`(${Object.values(Object.fromEntries(Object.entries((({ since, severity, note }) => ({ since, severity, note }))(caseManagerData.symptoms[i])).filter(([_, v]) => v))).join(', ')})`}<br /></>
                                            }
                                        </>
                                    )
                                })}
                            </label>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label>
                            <table className="w-100 mb-3 print_table" cellPadding={5} cellSpacing={5}>
                                <tr>
                                    <th style={{ fontSize: 12 }}>NAME</th>
                                    <th style={{ fontSize: 12 }}>SINCE</th>
                                    <th style={{ fontSize: 12 }}>SEVERITY</th>
                                    <th style={{ fontSize: 12 }}>NOTE</th>
                                </tr>
                                {caseManagerData.symptoms.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ fontSize: 12 }}>{item.symptom_name}</td>
                                            <td style={{ fontSize: 12 }}>{item.since ? item.since : '-'}</td>
                                            <td style={{ fontSize: 12 }}>{item.severity ? item.severity : '-'}</td>
                                            <td style={{ fontSize: 12 }}>{item.note ? item.note : '-'}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    )
                )}

                {caseManagerData.symptoms.length > 0 && (
                    printSettings?.prescription?.case_option[0]?.format === 'inline' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label>
                            {caseManagerData.symptoms.map((item, i) => {
                                return (
                                    <label key={i} style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                        <label className="fw-medium">{item.symptom_name}&nbsp;</label>
                                        {(item.since || item.severity || item.note) ?
                                            <>{`(${Object.values(Object.fromEntries(Object.entries((({ since, severity, note }) => ({ since, severity, note }))(caseManagerData.symptoms[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.symptoms.length - 1 != i ? ',' : ''}&nbsp;</>
                                            :
                                            <>{caseManagerData.symptoms.length - 1 != i ? ',' : ''}&nbsp;</>
                                        }
                                    </label>
                                )
                            })}
                        </div>
                    ) : printSettings?.prescription?.case_option[0]?.format === 'listview' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label> <br />
                            <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                {caseManagerData.symptoms.map((item, i) => {
                                    return (
                                        <>
                                            <label key={Math.random()} className="fw-medium mt-1">&nbsp;{i + 1}.&nbsp;</label>
                                            <label key={Math.random()} className="fw-medium">{item.symptom_name}&nbsp;</label>
                                            {(item.since || item.severity || item.note) &&
                                                <>{`(${Object.values(Object.fromEntries(Object.entries((({ since, severity, note }) => ({ since, severity, note }))(caseManagerData.symptoms[i])).filter(([_, v]) => v))).join(', ')})`}<br /></>
                                            }
                                        </>
                                    )
                                })}
                            </label>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Symptoms:&nbsp;</label>
                            <table className="w-100 mb-3 print_table" cellPadding={5} cellSpacing={5}>
                                <tr>
                                    <th style={{ fontSize: 12 }}>NAME</th>
                                    <th style={{ fontSize: 12 }}>SINCE</th>
                                    <th style={{ fontSize: 12 }}>SEVERITY</th>
                                    <th style={{ fontSize: 12 }}>NOTE</th>
                                </tr>
                                {caseManagerData.symptoms.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ fontSize: 12 }}>{item.symptom_name}</td>
                                            <td style={{ fontSize: 12 }}>{item.since ? item.since : '-'}</td>
                                            <td style={{ fontSize: 12 }}>{item.severity ? item.severity : '-'}</td>
                                            <td style={{ fontSize: 12 }}>{item.note ? item.note : '-'}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    )
                )}

                {caseManagerData.examination.length > 0 && (
                    printSettings?.prescription?.case_option[1]?.format === 'inline' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Examinations:&nbsp;</label>
                            {caseManagerData.examination.map((item, i) => {
                                return (
                                    <label key={i} style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                        <label className="fw-medium">{item.examination_name}&nbsp;</label>
                                        {(item.note) ?
                                            <>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.examination[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.examination.length - 1 != i ? ',' : ''}&nbsp;</>
                                            :
                                            <>{caseManagerData.examination.length - 1 != i ? ',' : ''}&nbsp;</>
                                        }
                                    </label>
                                )
                            })}
                        </div>
                    ) : printSettings?.prescription?.case_option[1]?.format === 'listview' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Examinations:&nbsp;</label> <br />
                            <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                {caseManagerData.examination.map((item, i) => {
                                    return (
                                        <>
                                            <label key={Math.random()} className="fw-medium mt-1">&nbsp;{i + 1}.&nbsp;</label>
                                            <label key={Math.random()} className="fw-medium">{item.examination_name}&nbsp;</label>
                                            {(item.note) &&
                                                <>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.examination[i])).filter(([_, v]) => v))).join(', ')})`}<br /></>
                                            }
                                        </>
                                    )
                                })}
                            </label>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Examinations:&nbsp;</label>
                            <table className="w-100 mb-3 print_table" cellPadding={5} cellSpacing={5}>
                                <tr>
                                    <th style={{ fontSize: 12 }}>NAME</th>
                                    <th style={{ fontSize: 12 }}>NOTE</th>
                                </tr>
                                {caseManagerData.examination.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ fontSize: 12 }}>{item.examination_name}</td>
                                            <td style={{ fontSize: 12 }}>{item.note ? item.note : '-'}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    )
                )}

                {caseManagerData.diagnosis.length > 0 && (
                    printSettings?.prescription?.case_option[2]?.format === 'inline' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Diagnosis:&nbsp;</label>
                            {caseManagerData.diagnosis.map((item, i) => {
                                return (
                                    <label key={i} style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                        <label className="fw-medium">{item.tds_name}&nbsp;</label>
                                        {(item.since || item.status || item.note) ?
                                            <>{`(${Object.values(Object.fromEntries(Object.entries((({ since, status, note }) => ({ since, status, note }))(caseManagerData.diagnosis[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.diagnosis.length - 1 != i ? ',' : ''}&nbsp;</>
                                            :
                                            <>{caseManagerData.diagnosis.length - 1 != i ? ',' : ''}&nbsp;</>
                                        }
                                    </label>
                                )
                            })}
                        </div>
                    ) : printSettings?.prescription?.case_option[2]?.format === 'listview' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Diagnosis:&nbsp;</label> <br />
                            <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                {caseManagerData.diagnosis.map((item, i) => {
                                    return (
                                        <>
                                            <label key={Math.random()} className="fw-medium mt-1">&nbsp;{i + 1}.&nbsp;</label>
                                            <label key={Math.random()} className="fw-medium">{item.tds_name}&nbsp;</label>
                                            {(item.since || item.status || item.note) &&
                                                <>{`(${Object.values(Object.fromEntries(Object.entries((({ since, status, note }) => ({ since, status, note }))(caseManagerData.diagnosis[i])).filter(([_, v]) => v))).join(', ')})`}<br /></>
                                            }
                                        </>
                                    )
                                })}
                            </label>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Diagnosis:&nbsp;</label>
                            <table className="w-100 mb-3 print_table" cellPadding={5} cellSpacing={5}>
                                <tr>
                                    <th style={{ fontSize: 12 }}>NAME</th>
                                    <th style={{ fontSize: 12 }}>SINCE</th>
                                    <th style={{ fontSize: 12 }}>STATUS</th>
                                    <th style={{ fontSize: 12 }}>NOTE</th>
                                </tr>
                                {caseManagerData.diagnosis.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ fontSize: 12 }}>{item.tds_name}</td>
                                            <td style={{ fontSize: 12 }}>{item.since ? item.since : '-'}</td>
                                            <td style={{ fontSize: 12 }}>{item.status ? item.status : '-'}</td>
                                            <td style={{ fontSize: 12 }}>{item.note ? item.note : '-'}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    )
                )}

                {caseManagerData.medicine.length > 0 && (
                    printSettings?.prescription?.case_option[3]?.format === 'inline' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Medication (Rx):&nbsp;</label>
                            {caseManagerData.medicine.map((item, i) => {
                                return (
                                    <label key={i} style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                        <label className="fw-medium">{item.tmm_medicine_name},{item.tmm_generic}&nbsp;</label>
                                        <>{`(${Object.values(Object.fromEntries(Object.entries(
                                            (
                                                ({
                                                    tmf_block,
                                                    tcm_tmm_freq_morning,
                                                    tcm_tmm_freq_afternoon,
                                                    tcm_tmm_freq_evening,
                                                    tcm_tmm_freq_night,
                                                    tmm_freq_type,
                                                    tmm_time,
                                                    tmm_days,
                                                    tmm_duration_type,
                                                    display_qty,
                                                    tmm_remarks
                                                }) => ({
                                                    modiFrequency: tmf_block == 0 || tmf_block == "" ? `${tcm_tmm_freq_morning ? tcm_tmm_freq_morning : 0}-${tcm_tmm_freq_afternoon ? tcm_tmm_freq_afternoon : 0}-${tcm_tmm_freq_evening ? tcm_tmm_freq_evening : 0}-${tcm_tmm_freq_night ? tcm_tmm_freq_night : 0}` : `0-0-0-0 (${frequencyList.find((x) => x.tmf_id == tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id == tmm_freq_type).tmf_title : ''})`,

                                                    modiTiming: timingList.find((x) => x.tmt_id == tmm_time) !== undefined ? timingList.find((x) => x.tmt_id == tmm_time).tmt_title : '',

                                                    modiDuration: isNumeric(tmm_days) ? `${tmm_days} - ${tmm_duration_type}` : '-',

                                                    modiDisplayQty: display_qty ? display_qty.toFixed(2) : '',

                                                    tmm_remarks
                                                })
                                            )(caseManagerData.medicine[i])
                                        ).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.medicine.length - 1 != i ? ',' : ''}&nbsp;</>
                                    </label>
                                )
                            })}
                        </div>
                    ) : printSettings?.prescription?.case_option[3]?.format === 'listview' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Medication (Rx):&nbsp;</label> <br />
                            <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                {caseManagerData.medicine.map((item, i) => {
                                    return (
                                        <>
                                            <label key={Math.random()} className="fw-medium mt-1">&nbsp;{i + 1}.&nbsp;</label>
                                            <label key={Math.random()} className="fw-medium">{item.tmm_medicine_name},{item.tmm_generic}&nbsp;</label>
                                            <>{`(${Object.values(Object.fromEntries(Object.entries(
                                                (
                                                    ({
                                                        tmf_block,
                                                        tcm_tmm_freq_morning,
                                                        tcm_tmm_freq_afternoon,
                                                        tcm_tmm_freq_evening,
                                                        tcm_tmm_freq_night,
                                                        tmm_freq_type,
                                                        tmm_time,
                                                        tmm_days,
                                                        tmm_duration_type,
                                                        display_qty,
                                                        tmm_remarks
                                                    }) => ({
                                                        modiFrequency: tmf_block == 0 || tmf_block == "" ? `${tcm_tmm_freq_morning ? tcm_tmm_freq_morning : 0}-${tcm_tmm_freq_afternoon ? tcm_tmm_freq_afternoon : 0}-${tcm_tmm_freq_evening ? tcm_tmm_freq_evening : 0}-${tcm_tmm_freq_night ? tcm_tmm_freq_night : 0}` : `0-0-0-0 (${frequencyList.find((x) => x.tmf_id == tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id == tmm_freq_type).tmf_title : ''})`,

                                                        modiTiming: timingList.find((x) => x.tmt_id == tmm_time) !== undefined ? timingList.find((x) => x.tmt_id == tmm_time).tmt_title : '',

                                                        modiDuration: isNumeric(tmm_days) ? `${tmm_days} - ${tmm_duration_type}` : '-',

                                                        modiDisplayQty: display_qty ? display_qty.toFixed(2) : '',

                                                        tmm_remarks
                                                    })
                                                )(caseManagerData.medicine[i])
                                            ).filter(([_, v]) => v))).join(', ')})`}<br /></>
                                        </>
                                    )
                                })}
                            </label>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Medication (Rx):&nbsp;</label>
                            <table className="w-100 mb-3 print_table" cellPadding={5} cellSpacing={5}>
                                <tr>
                                    <th style={{ fontSize: 12 }}>RX</th>
                                    <th style={{ fontSize: 12 }}>NAME</th>
                                    <th style={{ fontSize: 12 }}>TIME & FREQUENCY</th>
                                    <th style={{ fontSize: 12 }}>DURATION</th>
                                    <th style={{ fontSize: 12 }}>QTY.</th>
                                    <th style={{ fontSize: 12 }}>NOTE</th>
                                </tr>
                                {caseManagerData.medicine.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ fontSize: 12 }}>{i + 1}</td>
                                            <td style={{ fontSize: 12 }}>{item.tmm_medicine_name}<br />{item.tmm_generic}</td>
                                            <td style={{ fontSize: 12 }}>{item.tmf_block == 0 || item.tmf_block == "" ? `${item.tcm_tmm_freq_morning ? item.tcm_tmm_freq_morning : 0}-${item.tcm_tmm_freq_afternoon ? item.tcm_tmm_freq_afternoon : 0}-${item.tcm_tmm_freq_evening ? item.tcm_tmm_freq_evening : 0}-${item.tcm_tmm_freq_night ? item.tcm_tmm_freq_night : 0}` : `0-0-0-0 (${frequencyList.find((x) => x.tmf_id == item.tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id == item.tmm_freq_type).tmf_title : ''})`}<br />{timingList.find((x) => x.tmt_id == item.tmm_time) !== undefined ? timingList.find((x) => x.tmt_id == item.tmm_time).tmt_title : ''}</td>
                                            <td style={{ fontSize: 12 }}>{isNumeric(item.tmm_days) ? `${item.tmm_days} - ${item.tmm_duration_type}` : '-'}</td>
                                            <td style={{ fontSize: 12 }}>{item.display_qty ? item.display_qty.toFixed(2) : '-'}</td>
                                            <td style={{ fontSize: 12 }}>{item.tmm_remarks ? item.tmm_remarks : '-'}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    )
                )}

                {caseManagerData.advice.length > 0 && (
                    printSettings?.prescription?.case_option[4]?.format === 'inline' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Advices:&nbsp;</label>
                            {caseManagerData.advice.map((item, i) => {
                                return (
                                    <label key={i} style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                        <label className="fw-medium">{item.advice_name}&nbsp;</label>
                                        <>{caseManagerData.advice.length - 1 != i ? ',' : ''}&nbsp;</>
                                    </label>
                                )
                            })}
                        </div>
                    ) : printSettings?.prescription?.case_option[4]?.format === 'listview' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Advices:&nbsp;</label> <br />
                            <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                {caseManagerData.advice.map((item, i) => {
                                    return (
                                        <>
                                            <label key={Math.random()} className="fw-medium mt-1">&nbsp;{i + 1}.&nbsp;</label>
                                            <label key={Math.random()} className="fw-medium">{item.advice_name}&nbsp;</label><br />
                                        </>
                                    )
                                })}
                            </label>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Advices:&nbsp;</label>
                            <table className="w-100 mb-3 print_table" cellPadding={5} cellSpacing={5}>
                                <tr>
                                    <th style={{ fontSize: 12 }}>NAME</th>
                                </tr>
                                {caseManagerData.advice.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ fontSize: 12 }}>{item.advice_name}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    )
                )}

                {caseManagerData.investigation.length > 0 && (
                    printSettings?.prescription?.case_option[5]?.format === 'inline' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Lab Investigation:&nbsp;</label>
                            {caseManagerData.investigation.map((item, i) => {
                                return (
                                    <label key={i} style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                        <label className="fw-medium">{item.investigation_name}&nbsp;</label>
                                        {(item.note) ?
                                            <>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.investigation[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.investigation.length - 1 != i ? ',' : ''}&nbsp;</>
                                            :
                                            <>{caseManagerData.investigation.length - 1 != i ? ',' : ''}&nbsp;</>
                                        }
                                    </label>
                                )
                            })}
                        </div>
                    ) : printSettings?.prescription?.case_option[5]?.format === 'listview' ? (
                        <div className="mb-3">
                            <label className="fw-bold" style={{ fontFamily: 'roboto', fontSize: 12 }}>Lab Investigation:&nbsp;</label> <br />
                            <label style={{ fontFamily: 'roboto', fontSize: 12 }}>
                                {caseManagerData.investigation.map((item, i) => {
                                    return (
                                        <>
                                            <label key={Math.random()} className="fw-medium mt-1">&nbsp;{i + 1}.&nbsp;</label>
                                            <label key={Math.random()} className="fw-medium">{item.investigation_name}&nbsp;</label>
                                            {(item.note) &&
                                                <>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.investigation[i])).filter(([_, v]) => v))).join(', ')})`}<br /></>
                                            }
                                        </>
                                    )
                                })}
                            </label>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="fw-bold mb-1" style={{ fontFamily: 'roboto', fontSize: 12 }}>Lab Investigation:&nbsp;</label>
                            <table className="w-100 mb-3 print_table" cellPadding={5} cellSpacing={5}>
                                <tr>
                                    <th style={{ fontSize: 12 }}>NAME</th>
                                    <th style={{ fontSize: 12 }}>NOTE</th>
                                </tr>
                                {caseManagerData.investigation.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ fontSize: 12 }}>{item.investigation_name}</td>
                                            <td style={{ fontSize: 12 }}>{item.note ? item.note : '-'}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    )
                )}
            </div>
        </>
    );
}
export default React.memo(PrintHtmlPage);
