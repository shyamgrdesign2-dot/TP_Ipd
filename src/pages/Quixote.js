import React, { useContext } from 'react';
import ReactPDF, { Font, Page, Text, View, Image, PDFViewer, Document, StyleSheet } from '@react-pdf/renderer';

import PrintSettingsContext from '../context/PrintSettingsContext';
import moment from "moment";
import { useSelector } from "react-redux";
import { isNumeric } from '../utils/utils'


const showDateFormat = 'DD MMM, YY'

function Quixote() {
    const { printSettings, fileHeader, fileFooter, fileLogo, fileWatermark, fileSignature } = useContext(PrintSettingsContext);

    const { frequencyList, timingList } = useSelector((state) => state.doctors);

    var caseManagerData = {
        "tcm_id": 132368,
        "showConsultationDateTime": "08 Mar 2024, 04:07 pm",
        "follow_up_date": "",
        "visit_advice": "",
        "total_consultation": 188,
        "next_tcm_id": null,
        "prev_tcm_id": 132367,
        "print_url": "https://pms-upgrade.azurewebsites.net/case_manager/pdf_casemanager_send.php?pdf_id=MTMyMzY4&p_id=U1QtMTAxOQ==&pu_id=NDA3OTIzNjg1MQ==&lg=MQ==",
        "print_rx_url": "https://pms-upgrade.azurewebsites.net/case_manager/pdf_prescription_send.php?pdf_id=MTMyMzY4&p_id=U1QtMTAxOQ==&pu_id=NDA3OTIzNjg1MQ==&lg=MQ==",
        "symptoms": [
            {
                "symptom_name": "Complaints 01",
                "unique_id": "a0a0cc71-8831-4683-851e-e71e67230b3f",
                "change": 0,
                "since": "1 Week",
                "severity": "moderate",
                "note": "Hello"
            },
            {
                "symptom_name": "Complaints 02",
                "unique_id": "cabed42e-c2c5-4dc4-9cb2-5e1c238953c5",
                "change": 0,
                "since": "1 Week",
                "severity": "moderate",
                "note": "Hello"
            },
            {
                "symptom_name": "Complaints 03",
                "unique_id": "30eaf575-1adc-4ec6-9c1a-75cbf5ebe290",
                "change": 0,
                "since": "1 Week",
                "severity": "moderate",
                "note": "Hello"
            }
        ],
        "examination": [
            {
                "examination_name": "Examination 01",
                "note": "Hello",
                "unique_id": "f07c8217-2d6d-4e9e-90bf-07b956c023ce",
                "change": 0
            },
            {
                "examination_name": "Examination 02",
                "note": "",
                "unique_id": "d26ad5a8-b808-40e1-96f6-705488879381",
                "change": 0
            }
        ],
        "diagnosis": [
            {
                "unique_id": "b1b1a8ab-0cba-4e3e-bc3e-e6915405b9a3",
                "tds_id": 1328,
                "tds_name": "Unspecified mental disorder due to known physiological condition",
                "since": "1 Week",
                "status": "suspected",
                "note": "Hello"
            },
            {
                "unique_id": "696ab155-26ff-4d86-a7a8-248c155d572f",
                "tds_id": 1329,
                "tds_name": "Stereotyped movement disorders",
                "since": "",
                "status": "confirmed",
                "note": ""
            },
            {
                "unique_id": "7c3e659b-5de9-49e5-9760-ef47a1a6bbb4",
                "tds_id": 1330,
                "tds_name": "Disruptive, impulse-control and conduct disorders",
                "since": "4 Day",
                "status": "",
                "note": ""
            }
        ],
        "advice": [
            {
                "advice_name": "Low fat in diet",
                "unique_id": "a6232d6a-7319-48a2-8ee6-8d6519035a0b",
                "change": 0
            },
            {
                "advice_name": "Wash eyes frequently",
                "unique_id": "1bc089ee-cc64-4905-9b99-3e35bd800ca0",
                "change": 0
            }
        ],
        "investigation": [
            {
                "investigation_name": "ROMA (Ovarian Malignancy Risk Algorithm) Test",
                "note": "Hello",
                "unique_id": "168373b5-0aa4-48b0-9591-2dc471b5f250",
                "change": 0
            },
            {
                "investigation_name": "Allergy: Vanilla",
                "note": "",
                "unique_id": "9381b81c-6df7-439e-a5a5-1fa3ae6d7ebc",
                "change": 0
            }
        ],
        "doctor_data": {
            "doctor_name": "Jigish Pansaniya",
            "um_qualifications": "mca",
            "gmc_no": "JP-2021/25",
            "dp_name": "Psychiatry",
            "editCase": false
        },
        "patient_data": {
            "patinet_id": "ST-1019",
            "patinet_name": "Neel Patel",
            "patinet_dob": "01/01/1970",
            "patinet_age": 54,
            "patinet_gender": "Male",
            "patinet_contact_no": "88888",
            "patinet_email": "",
            "patinet_address": "",
            "patinet_blood_group": "",
            "patinet_secondary_name": "",
            "patinet_secondary_contact": "",
            "patinet_reference_id": null,
            "patinet_ht_wt": "182/80",
            "patinet_consultation_type": null,
            "patinet_consultaion_date": "2024-03-18 09:58:22",
            "patinet_edd_date": null,
            "patinet_date_time": "2024-03-18 13:53:56"
        },
        "vitals": [
            {
                "date": "2024-03-08",
                "dev_unique_id": "51702",
                "tcv_id": "28167",
                "temp": "50",
                "pres": "60",
                "resp_rate": "70",
                "blood_press": "80/90",
                "spo2": "10",
                "tcbc_id": 8592,
                "height": "190",
                "weight": "60",
                "bmi": "16.62",
                "bmr": "1522.50",
                "bsa": "1.78"
            },
            {
                "date": "2024-03-07",
                "dev_unique_id": "41206",
                "tcv_id": "28168",
                "temp": "30",
                "pres": "20",
                "resp_rate": "421",
                "blood_press": "60/51",
                "spo2": "56",
                "tcbc_id": 8593,
                "height": "182",
                "weight": "80",
                "bmi": "24.15",
                "bmr": "1672.50",
                "bsa": "2.01"
            }
        ],
        "medicine": [
            {
                "tmm_id": 226173,
                "tmm_medicine_name": "Adoxin OZ Suspension",
                "tmm_generic": "Ofloxacin (50mg) + Ornidazole (125mg)",
                "tmm_company": "Rhydburg Pharmaceuticals Ltd",
                "tmm_type": "",
                "tmm_days": 2,
                "tmm_duration_type": "day(s)",
                "tmm_dosage": "2",
                "tmm_unit": "1",
                "tcm_tmm_freq_morning": 0,
                "tcm_tmm_freq_afternoon": 0,
                "tcm_tmm_freq_evening": 0,
                "tcm_tmm_freq_night": 0,
                "tmm_time": 1,
                "tmm_remarks": "Hello",
                "tmm_freq_type": 5,
                "tmf_block": 1,
                "tcm_tmr_type": "M",
                "display_qty": 20,
                "medicineUnit": [
                    {
                        "tmu_id": 1,
                        "tmu_title": "Amplues"
                    },
                    {
                        "tmu_id": 2,
                        "tmu_title": "Tablets"
                    },
                    {
                        "tmu_id": 3,
                        "tmu_title": "mg"
                    },
                    {
                        "tmu_id": 4,
                        "tmu_title": "ml"
                    },
                    {
                        "tmu_id": 5,
                        "tmu_title": "units"
                    },
                    {
                        "tmu_id": 6,
                        "tmu_title": "Capsule"
                    },
                    {
                        "tmu_id": 7,
                        "tmu_title": "Fingertips"
                    },
                    {
                        "tmu_id": 8,
                        "tmu_title": "Pea sized"
                    },
                    {
                        "tmu_id": 9,
                        "tmu_title": "gms"
                    },
                    {
                        "tmu_id": 10,
                        "tmu_title": "palm sized"
                    },
                    {
                        "tmu_id": 11,
                        "tmu_title": "tsp"
                    },
                    {
                        "tmu_id": 12,
                        "tmu_title": "tbps"
                    },
                    {
                        "tmu_id": 13,
                        "tmu_title": "Kits"
                    },
                    {
                        "tmu_id": 14,
                        "tmu_title": "Drops"
                    },
                    {
                        "tmu_id": 15,
                        "tmu_title": "Sprays"
                    },
                    {
                        "tmu_id": 16,
                        "tmu_title": "Sachets"
                    },
                    {
                        "tmu_id": 17,
                        "tmu_title": "Cup"
                    },
                    {
                        "tmu_id": 18,
                        "tmu_title": "Scoops"
                    },
                    {
                        "tmu_id": 19,
                        "tmu_title": "Suppositories"
                    },
                    {
                        "tmu_id": 20,
                        "tmu_title": "Soaps"
                    },
                    {
                        "tmu_id": 21,
                        "tmu_title": "Bottles"
                    },
                    {
                        "tmu_id": 22,
                        "tmu_title": "patches"
                    },
                    {
                        "tmu_id": 23,
                        "tmu_title": "Respules"
                    },
                    {
                        "tmu_id": 24,
                        "tmu_title": "Puffs"
                    },
                    {
                        "tmu_id": 25,
                        "tmu_title": "mcg"
                    },
                    {
                        "tmu_id": 26,
                        "tmu_title": "Cups"
                    },
                    {
                        "tmu_id": 27,
                        "tmu_title": "tbsp"
                    }
                ]
            },
            {
                "tmm_id": 150741,
                "tmm_medicine_name": "Nurotas G 300mg/500mcg Capsule",
                "tmm_generic": "Gabapentin (300mg) + Methylcobalamin (500mcg)",
                "tmm_company": "Vintas Pharmaceuticals Pvt. Ltd.",
                "tmm_type": "",
                "tmm_days": 3,
                "tmm_duration_type": "day(s)",
                "tmm_dosage": "4",
                "tmm_unit": "2",
                "tcm_tmm_freq_morning": 1,
                "tcm_tmm_freq_afternoon": 2,
                "tcm_tmm_freq_evening": 1,
                "tcm_tmm_freq_night": 2,
                "tmm_time": 3,
                "tmm_remarks": "",
                "tmm_freq_type": 0,
                "tmf_block": 0,
                "tcm_tmr_type": "M",
                "display_qty": 18,
                "medicineUnit": [
                    {
                        "tmu_id": 1,
                        "tmu_title": "Amplues"
                    },
                    {
                        "tmu_id": 2,
                        "tmu_title": "Tablets"
                    },
                    {
                        "tmu_id": 3,
                        "tmu_title": "mg"
                    },
                    {
                        "tmu_id": 4,
                        "tmu_title": "ml"
                    },
                    {
                        "tmu_id": 5,
                        "tmu_title": "units"
                    },
                    {
                        "tmu_id": 6,
                        "tmu_title": "Capsule"
                    },
                    {
                        "tmu_id": 7,
                        "tmu_title": "Fingertips"
                    },
                    {
                        "tmu_id": 8,
                        "tmu_title": "Pea sized"
                    },
                    {
                        "tmu_id": 9,
                        "tmu_title": "gms"
                    },
                    {
                        "tmu_id": 10,
                        "tmu_title": "palm sized"
                    },
                    {
                        "tmu_id": 11,
                        "tmu_title": "tsp"
                    },
                    {
                        "tmu_id": 12,
                        "tmu_title": "tbps"
                    },
                    {
                        "tmu_id": 13,
                        "tmu_title": "Kits"
                    },
                    {
                        "tmu_id": 14,
                        "tmu_title": "Drops"
                    },
                    {
                        "tmu_id": 15,
                        "tmu_title": "Sprays"
                    },
                    {
                        "tmu_id": 16,
                        "tmu_title": "Sachets"
                    },
                    {
                        "tmu_id": 17,
                        "tmu_title": "Cup"
                    },
                    {
                        "tmu_id": 18,
                        "tmu_title": "Scoops"
                    },
                    {
                        "tmu_id": 19,
                        "tmu_title": "Suppositories"
                    },
                    {
                        "tmu_id": 20,
                        "tmu_title": "Soaps"
                    },
                    {
                        "tmu_id": 21,
                        "tmu_title": "Bottles"
                    },
                    {
                        "tmu_id": 22,
                        "tmu_title": "patches"
                    },
                    {
                        "tmu_id": 23,
                        "tmu_title": "Respules"
                    },
                    {
                        "tmu_id": 24,
                        "tmu_title": "Puffs"
                    },
                    {
                        "tmu_id": 25,
                        "tmu_title": "mcg"
                    },
                    {
                        "tmu_id": 26,
                        "tmu_title": "Cups"
                    },
                    {
                        "tmu_id": 27,
                        "tmu_title": "tbsp"
                    }
                ]
            }
        ],
        "consultation_date": "2024-03-08 16:07:24"
    }
    const initialRows = [
        {
            key: '1',
            name: `Temperature (Frh)`,
        },
        {
            key: '2',
            name: `Pulse (/min)`,
        },
        {
            key: '3',
            name: `Resp. Rate (/min)`,
        },
        {
            key: '4',
            name: `Systolic (mmHg)`,
        },
        {
            key: '5',
            name: `Diastolic (mmHg)`,
        },
        {
            key: '6',
            name: `SPO2 (%)`,
        },
        {
            key: '7',
            name: `Height (cms)`,
        },
        {
            key: '8',
            name: `Weight (kgs)`,
        },
        {
            key: '9',
            name: `BMI (kg/m²)`,
        },
        {
            key: '10',
            name: `BMR (kcals)`,
        },
        {
            key: '11',
            name: `BSA (m²)`,
        }
    ];

    const initialColumns = [
        {
            title: 'Name'
        },
    ];
    // Extract unique dates from the JSON array
    const uniqueDates = caseManagerData.vitals.length > 0 ? [...caseManagerData.vitals.map((item) => item.date)] : [];

    // Initialize columns for each unique date
    const dateColumns = uniqueDates.map((date, index) => ({
        title: moment(date).format(showDateFormat)
    }));

    const columns = [...initialColumns, ...dateColumns];

    caseManagerData.vitals.length > 0 && caseManagerData.vitals.map((item, index) => {
        initialRows[0][index] = item.temp ? item.temp : '-'
        initialRows[1][index] = item.pres ? item.pres : '-'
        initialRows[2][index] = item.resp_rate ? item.resp_rate : '-'
        initialRows[3][index] = item.blood_press ? item.blood_press.split('/')[0] ? item.blood_press.split('/')[0] : '-' : '-'
        initialRows[4][index] = item.blood_press ? item.blood_press.split('/')[1] ? item.blood_press.split('/')[1] : '-' : '-'
        initialRows[5][index] = item.spo2 ? item.spo2 : '-'
        initialRows[6][index] = item.height ? item.height : '-'
        initialRows[7][index] = item.weight ? item.weight : '-'
        initialRows[8][index] = item.bmi ? parseFloat(item.bmi).toFixed(2) : '-'
        initialRows[9][index] = item.bmr ? parseFloat(item.bmr).toFixed(2) : '-'
        initialRows[10][index] = item.bsa ? parseFloat(item.bsa).toFixed(2) : '-'
    });

    const patientDataShow = (id) => {
        var value = ''
        if (id == 1) {
            value = `${caseManagerData?.patient_data?.patinet_name} ${caseManagerData?.patient_data?.patinet_id}`
        } else if (id == 2) {
            value = `${caseManagerData?.patient_data?.patinet_date_time ? caseManagerData?.patient_data?.patinet_date_time : ''}`
        } else if (id == 3) {
            value = `${caseManagerData?.patient_data?.patinet_age}Years, ${caseManagerData?.patient_data?.patinet_gender}`
        } else if (id == 4) {
            value = `${caseManagerData?.patient_data?.patinet_contact_no ? caseManagerData?.patient_data?.patinet_contact_no : ''}`
        } else if (id == 5) {
            value = `${caseManagerData?.patient_data?.patinet_ht_wt ? caseManagerData?.patient_data?.patinet_ht_wt : ''}`
        } else if (id == 6) {
            value = `${caseManagerData?.patient_data?.patinet_blood_group ? caseManagerData?.patient_data?.patinet_blood_group : ''}`
        } else if (id == 7) {
            value = `${caseManagerData?.patient_data?.patinet_address ? caseManagerData?.patient_data?.patinet_address : ''}`
        } else if (id == 8) {
            value = `${caseManagerData?.patient_data?.patinet_consultation_type ? caseManagerData?.patient_data?.patinet_consultation_type : ''}`
        } else if (id == 9) {
            value = ''
        } else if (id == 10) {
            value = `${caseManagerData?.patient_data?.patinet_email}`
        } else if (id == 11) {
            value = `${caseManagerData?.patient_data?.patinet_reference_id}`
        }
        return value
    }

    return (
        <PDFViewer
            // showToolbar={false}
            style={{
                width: '100%',
                height: 800
            }}>
            <Document>
                <Page size="A4" style={{ padding: 30 }} wrap>
                    <View style={{ flex: 1 }}>

                        <View style={{ marginBottom: 29 }} fixed>
                            {printSettings?.letterhead_format === 0 ? (
                                <View>
                                    {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' && printSettings?.header_footer?.header?.clinic_info?.enable === 'Y' ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 18, color: '#A461D8', fontFamily: 'Roboto', fontWeight: 700 }}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.place === 'L' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                                </Text>
                                                <Text style={{ fontSize: 14, color: '#454551', marginTop: 4, fontFamily: 'Roboto', fontWeight: 500 }}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.place === 'L' ? printSettings?.header_footer?.header?.doctor_info?.subheader : printSettings?.header_footer?.header?.clinic_info?.subheader}
                                                </Text>
                                            </View>
                                            {printSettings?.logo_enable === 'Y' && (
                                                <View style={{ width: 82, height: 82, overflow: 'hidden', marginHorizontal: 16 }}>
                                                    {fileLogo && fileLogo?.imageShow && (
                                                        <Image
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                            src={fileLogo?.showFile}
                                                        />
                                                    )}
                                                </View>
                                            )}
                                            <View style={{ flex: 1, textAlign: 'right' }}>
                                                <Text style={{ fontSize: 18, color: '#A461D8', fontFamily: 'Roboto', fontWeight: 700 }}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.place === 'R' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                                </Text>
                                                <Text style={{ fontSize: 14, color: '#454551', marginTop: 4, fontFamily: 'Roboto', fontWeight: 500 }}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.place === 'R' ? printSettings?.header_footer?.header?.doctor_info?.subheader : printSettings?.header_footer?.header?.clinic_info?.subheader}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {printSettings?.logo_enable === 'Y' && (
                                                <View style={{ width: 82, height: 82, overflow: 'hidden' }}>
                                                    {fileLogo && fileLogo?.imageShow && (
                                                        <Image
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                            src={fileLogo?.showFile}
                                                        />
                                                    )}
                                                </View>
                                            )}
                                            {(printSettings?.header_footer?.header?.doctor_info?.enable === 'Y') ? (
                                                <View style={{ flex: 1, marginLeft: printSettings?.header_footer?.header?.doctor_info?.place === 'L' ? 8 : 0, textAlign: printSettings?.header_footer?.header?.doctor_info?.place === 'L' ? 'left' : 'right', weight: '189px' }}>
                                                    <Text style={{ fontSize: 18, color: '#A461D8', fontFamily: 'Roboto', fontWeight: 700 }}>
                                                        {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                                    </Text>
                                                    <Text style={{ fontSize: 14, color: '#454551', marginTop: 4, fontFamily: 'Roboto', fontWeight: 500 }}>
                                                        {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.subheader : printSettings?.header_footer?.header?.clinic_info?.subheader}
                                                    </Text>
                                                </View>
                                            ) : printSettings?.header_footer?.header?.clinic_info?.enable === 'Y' && (
                                                <View style={{ flex: 1, marginLeft: printSettings?.header_footer?.header?.clinic_info?.place === 'L' ? 8 : 0, textAlign: printSettings?.header_footer?.header?.clinic_info?.place === 'L' ? 'left' : 'right', weight: '130px' }}>
                                                    <Text style={{ fontSize: 18, color: '#A461D8', fontFamily: 'Roboto', fontWeight: 700 }}>
                                                        {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                                    </Text>
                                                    <Text style={{ fontSize: 14, color: '#454551', marginTop: 4, fontFamily: 'Roboto', fontWeight: 500 }}>
                                                        {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.subheader : printSettings?.header_footer?.header?.clinic_info?.subheader}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            ) : printSettings?.letterhead_format === 1 && (
                                fileHeader && fileHeader?.imageShow && (
                                    <Image
                                        style={{ width: '100%', objectFit: 'contain' }}
                                        src={fileHeader?.showFile}
                                    />
                                )
                            )}
                        </View>

                        <View style={{ flex: 1 }}>

                            {printSettings?.water_mark_enable === 'Y' && (
                                fileWatermark && fileWatermark?.imageShow && (
                                    <Image
                                        style={{
                                            width: 100, height: 100, objectFit: 'contain', zIndex: -1, opacity: 0.3,
                                            position: 'absolute', top: '40%', left: '40%'
                                        }}
                                        src={fileWatermark?.showFile}
                                        fixed />
                                )
                            )}

                            <View style={{ backgroundColor: '#171725', height: 2, width: '100%' }} />

                            <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    {printSettings?.header_footer?.patient_info.filter(e => e.enable === 'Y').map((item, i) => {
                                        return (
                                            i % 2 === 0 && (
                                                <View key={i} style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                                    <Text style={{ fontSize: 10, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{`${item.title}: `}</Text>
                                                    <Text style={{ fontSize: 10, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{patientDataShow(item.id)}</Text>
                                                </View>
                                            )
                                        )
                                    })}
                                </View>
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    {printSettings?.header_footer?.patient_info.filter(e => e.enable === 'Y').map((item, i) => {
                                        return (
                                            i % 2 === 1 && (
                                                <View key={i} style={{ flexDirection: 'row', paddingVertical: 3 }}>
                                                    <Text style={{ fontSize: 10, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{`${item.title}: `}</Text>
                                                    <Text style={{ fontSize: 10, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{patientDataShow(item.id)}</Text>
                                                </View>
                                            )
                                        )
                                    })}
                                </View>
                            </View>

                            <View style={{ backgroundColor: '#171725', height: 1, width: '100%' }} />

                            <View>
                                {caseManagerData.symptoms.length > 0 && printSettings?.prescription?.case_option[0]?.enable === 'Y' && (
                                    printSettings?.prescription?.case_option[0]?.format === 'inline' ? (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Symptoms:&nbsp;</Text>
                                            {caseManagerData.symptoms.map((item, i) => {
                                                return (
                                                    <Text key={i}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.symptom_name}&nbsp;</Text>
                                                        {(item.since || item.severity || item.note) ?
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ since, severity, note }) => ({ since, severity, note }))(caseManagerData.symptoms[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.symptoms.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                            :
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{caseManagerData.symptoms.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                        }
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : printSettings?.prescription?.case_option[0]?.format === 'listview' ? (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Symptoms:&nbsp;</Text>
                                            {caseManagerData.symptoms.map((item, i) => {
                                                return (
                                                    <Text key={i} style={{ marginTop: i == 0 ? 4 : 2 }}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.symptom_name}&nbsp;</Text>
                                                        {(item.since || item.severity || item.note) &&
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ since, severity, note }) => ({ since, severity, note }))(caseManagerData.symptoms[i])).filter(([_, v]) => v))).join(', ')})\n`}</Text>
                                                        }
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Symptoms:&nbsp;</Text>
                                            <View style={styles.table}>
                                                <View style={styles.row}>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NAME</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>SINCE</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>SEVERITY</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NOTE</Text>
                                                </View>
                                                {caseManagerData.symptoms.map((item, i) => (
                                                    <View style={styles.row} key={i}>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }]}>{item.symptom_name}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.since ? item.since : '-'}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.severity ? item.severity : '-'}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.note ? item.note : '-'}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )
                                )}

                                {caseManagerData.examination.length > 0 && printSettings?.prescription?.case_option[1]?.enable === 'Y' && (
                                    printSettings?.prescription?.case_option[1]?.format === 'inline' ? (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Examinations:&nbsp;</Text>
                                            {caseManagerData.examination.map((item, i) => {
                                                return (
                                                    <Text key={i}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.examination_name}&nbsp;</Text>
                                                        {(item.note) ?
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.examination[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.examination.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                            :
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{caseManagerData.examination.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                        }
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : printSettings?.prescription?.case_option[1]?.format === 'listview' ? (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Examinations:&nbsp;</Text>
                                            {caseManagerData.examination.map((item, i) => {
                                                return (
                                                    <Text key={i} style={{ marginTop: i == 0 ? 4 : 2 }}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.examination_name}&nbsp;</Text>
                                                        {(item.since || item.severity || item.note) &&
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.examination[i])).filter(([_, v]) => v))).join(', ')})\n`}</Text>
                                                        }
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Examinations:&nbsp;</Text>
                                            <View style={styles.table}>
                                                <View style={styles.row}>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NAME</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NOTE</Text>
                                                </View>
                                                {caseManagerData.examination.map((item, i) => (
                                                    <View style={styles.row} key={i}>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }]}>{item.examination_name}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.note ? item.note : '-'}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )
                                )}

                                {caseManagerData.diagnosis.length > 0 && printSettings?.prescription?.case_option[2]?.enable === 'Y' && (
                                    printSettings?.prescription?.case_option[2]?.format === 'inline' ? (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Diagnosis:&nbsp;</Text>
                                            {caseManagerData.diagnosis.map((item, i) => {
                                                return (
                                                    <Text key={i}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.tds_name}&nbsp;</Text>
                                                        {(item.since || item.status || item.note) ?
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ since, status, note }) => ({ since, status, note }))(caseManagerData.diagnosis[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.diagnosis.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                            :
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{caseManagerData.diagnosis.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                        }
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : printSettings?.prescription?.case_option[2]?.format === 'listview' ? (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Diagnosis:&nbsp;</Text>
                                            {caseManagerData.diagnosis.map((item, i) => {
                                                return (
                                                    <Text key={i} style={{ marginTop: i == 0 ? 4 : 2 }}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.tds_name}&nbsp;</Text>
                                                        {(item.since || item.severity || item.note) &&
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ since, status, note }) => ({ since, status, note }))(caseManagerData.diagnosis[i])).filter(([_, v]) => v))).join(', ')})\n`}</Text>
                                                        }
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Diagnosis:&nbsp;</Text>
                                            <View style={styles.table}>
                                                <View style={styles.row}>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NAME</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>SINCE</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>STATUS</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NOTE</Text>
                                                </View>
                                                {caseManagerData.diagnosis.map((item, i) => (
                                                    <View style={styles.row} key={i}>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }]}>{item.tds_name}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.since ? item.since : '-'}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.status ? item.status : '-'}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.note ? item.note : '-'}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )
                                )}

                                {caseManagerData.medicine.length > 0 && printSettings?.prescription?.case_option[3]?.enable === 'Y' && (
                                    printSettings?.prescription?.case_option[3]?.format === 'inline' ? (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Medication (Rx):&nbsp;</Text>
                                            {caseManagerData.medicine.map((item, i) => {
                                                return (
                                                    <Text key={i}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.tmm_medicine_name}&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                            {`(${Object.values(Object.fromEntries(Object.entries(
                                                                (
                                                                    ({
                                                                        tmm_generic,
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
                                                                        tmm_generic,
                                                                        modiFrequency: tmf_block === 0 || tmf_block === "" ? `${tcm_tmm_freq_morning ? tcm_tmm_freq_morning : 0}-${tcm_tmm_freq_afternoon ? tcm_tmm_freq_afternoon : 0}-${tcm_tmm_freq_evening ? tcm_tmm_freq_evening : 0}-${tcm_tmm_freq_night ? tcm_tmm_freq_night : 0}` : `0-0-0-0 (${frequencyList.find((x) => x.tmf_id === tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id === tmm_freq_type).tmf_title : ''})`,

                                                                        modiTiming: timingList.find((x) => x.tmt_id === tmm_time) !== undefined ? timingList.find((x) => x.tmt_id === tmm_time).tmt_title : '',

                                                                        modiDuration: isNumeric(tmm_days) ? `${tmm_days} - ${tmm_duration_type}` : '-',

                                                                        modiDisplayQty: display_qty ? display_qty.toFixed(2) : '',

                                                                        tmm_remarks
                                                                    })
                                                                )(caseManagerData.medicine[i])
                                                            ).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.medicine.length - 1 != i ? ',' : ''}&nbsp;
                                                        </Text>
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : printSettings?.prescription?.case_option[3]?.format === 'listview' ? (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Medication (Rx):&nbsp;</Text>
                                            {caseManagerData.medicine.map((item, i) => {
                                                return (
                                                    <Text key={i} style={{ marginTop: i == 0 ? 4 : 2 }}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.tmm_medicine_name}&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                            {`(${Object.values(Object.fromEntries(Object.entries(
                                                                (
                                                                    ({
                                                                        tmm_generic,
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
                                                                        tmm_generic,
                                                                        modiFrequency: tmf_block === 0 || tmf_block === "" ? `${tcm_tmm_freq_morning ? tcm_tmm_freq_morning : 0}-${tcm_tmm_freq_afternoon ? tcm_tmm_freq_afternoon : 0}-${tcm_tmm_freq_evening ? tcm_tmm_freq_evening : 0}-${tcm_tmm_freq_night ? tcm_tmm_freq_night : 0}` : `0-0-0-0 (${frequencyList.find((x) => x.tmf_id === tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id === tmm_freq_type).tmf_title : ''})`,

                                                                        modiTiming: timingList.find((x) => x.tmt_id === tmm_time) !== undefined ? timingList.find((x) => x.tmt_id === tmm_time).tmt_title : '',

                                                                        modiDuration: isNumeric(tmm_days) ? `${tmm_days} - ${tmm_duration_type}` : '-',

                                                                        modiDisplayQty: display_qty ? display_qty.toFixed(2) : '',

                                                                        tmm_remarks
                                                                    })
                                                                )(caseManagerData.medicine[i])
                                                            ).filter(([_, v]) => v))).join(', ')})\n`}
                                                        </Text>
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Medication (Rx):&nbsp;</Text>
                                            <View style={styles.table}>
                                                <View style={styles.row}>
                                                    <Text style={[styles.cell, { flex: 0.2, fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>RX</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NAME</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>TIME & FREQUENCY</Text>
                                                    <Text style={[styles.cell, { flex: 0.5, fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>DURATION</Text>
                                                    <Text style={[styles.cell, { flex: 0.4, fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>QTY.</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NOTE</Text>
                                                </View>
                                                {caseManagerData.medicine.map((item, i) => (
                                                    <View style={styles.row} key={i}>
                                                        <Text style={[styles.cell, { flex: 0.2, fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }]}>{i + 1}</Text>
                                                        <View style={styles.cell}>
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.tmm_medicine_name}</Text>
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{item.tmm_generic}</Text>
                                                        </View>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.tmf_block === 0 || item.tmf_block === "" ? `${item.tcm_tmm_freq_morning ? item.tcm_tmm_freq_morning : 0}-${item.tcm_tmm_freq_afternoon ? item.tcm_tmm_freq_afternoon : 0}-${item.tcm_tmm_freq_evening ? item.tcm_tmm_freq_evening : 0}-${item.tcm_tmm_freq_night ? item.tcm_tmm_freq_night : 0}` : `0-0-0-0 (${frequencyList.find((x) => x.tmf_id === item.tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id === item.tmm_freq_type).tmf_title : ''})`}{'\n'}{timingList.find((x) => x.tmt_id === item.tmm_time) !== undefined ? timingList.find((x) => x.tmt_id === item.tmm_time).tmt_title : ''}</Text>
                                                        <Text style={[styles.cell, { flex: 0.5, fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{isNumeric(item.tmm_days) ? `${item.tmm_days} - ${item.tmm_duration_type}` : '-'}</Text>
                                                        <Text style={[styles.cell, { flex: 0.4, fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.display_qty ? item.display_qty.toFixed(2) : '-'}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.tmm_remarks ? item.tmm_remarks : '-'}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )
                                )}

                                {caseManagerData.advice.length > 0 && printSettings?.prescription?.case_option[4]?.enable === 'Y' && (
                                    printSettings?.prescription?.case_option[4]?.format === 'inline' ? (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Advices:&nbsp;</Text>
                                            {caseManagerData.advice.map((item, i) => {
                                                return (
                                                    <Text key={i}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{item.advice_name}&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{caseManagerData.advice.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : printSettings?.prescription?.case_option[4]?.format === 'listview' ? (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Advices:&nbsp;</Text>
                                            {caseManagerData.advice.map((item, i) => {
                                                return (
                                                    <Text key={i} style={{ marginTop: i == 0 ? 4 : 2 }}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{item.advice_name}&nbsp;</Text>
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Advices:&nbsp;</Text>
                                            <View style={styles.table}>
                                                <View style={styles.row}>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NAME</Text>
                                                </View>
                                                {caseManagerData.advice.map((item, i) => (
                                                    <View style={styles.row} key={i}>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.advice_name}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )
                                )}

                                {caseManagerData.investigation.length > 0 && printSettings?.prescription?.case_option[5]?.enable === 'Y' && (
                                    printSettings?.prescription?.case_option[5]?.format === 'inline' ? (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Lab Investigation:&nbsp;</Text>
                                            {caseManagerData.investigation.map((item, i) => {
                                                return (
                                                    <Text key={i}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.investigation_name}&nbsp;</Text>
                                                        {(item.note) ?
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.investigation[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.investigation.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                            :
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{caseManagerData.investigation.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                        }
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : printSettings?.prescription?.case_option[5]?.format === 'listview' ? (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Lab Investigation:&nbsp;</Text>
                                            {caseManagerData.investigation.map((item, i) => {
                                                return (
                                                    <Text key={i} style={{ marginTop: i == 0 ? 4 : 2 }}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.investigation_name}&nbsp;</Text>
                                                        {(item.since || item.severity || item.note) &&
                                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.investigation[i])).filter(([_, v]) => v))).join(', ')})\n`}</Text>
                                                        }
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Lab Investigation:&nbsp;</Text>
                                            <View style={styles.table}>
                                                <View style={styles.row}>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NAME</Text>
                                                    <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>NOTE</Text>
                                                </View>
                                                {caseManagerData.investigation.map((item, i) => (
                                                    <View style={styles.row} key={i}>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }]}>{item.investigation_name}</Text>
                                                        <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item.note ? item.note : '-'}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )
                                )}

                                {caseManagerData.vitals.length > 0 && printSettings?.prescription?.case_option[6]?.enable === 'Y' && (
                                    printSettings?.prescription?.case_option[6]?.format === 'inline' ? (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Vitals & Body Composition:&nbsp;</Text>
                                            {caseManagerData.vitals.map((item, i) => {
                                                return (
                                                    <Text key={i}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.date}&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                            {`- ${Object.values(Object.fromEntries(Object.entries(
                                                                (
                                                                    ({
                                                                        temp,
                                                                        pres,
                                                                        resp_rate,
                                                                        blood_press,
                                                                        spo2,
                                                                        height,
                                                                        weight,
                                                                        bmi,
                                                                        bmr,
                                                                        bsa,
                                                                    }) => ({
                                                                        temp: temp ? `Temperature (${temp}Frh)` : '',
                                                                        pres: pres ? `Pulse (${pres}/min)` : '',
                                                                        resp_rate: resp_rate ? `Resp. Rate (${resp_rate}/min)` : '',
                                                                        systolic: blood_press ? blood_press.split('/')[0] ? `Systolic (${blood_press.split('/')[0]}mmHg)` : '' : '',
                                                                        diastolic: blood_press ? blood_press.split('/')[1] ? `Diastolic (${blood_press.split('/')[1]}mmHg)` : '' : '',
                                                                        spo2: spo2 ? `SPO2 (${spo2}%)` : '',
                                                                        height: height ? `Height (${height}cms)` : '',
                                                                        weight: weight ? `Weight (${weight}kgs)` : '',
                                                                        bmi: bmi ? `BMI (${parseFloat(bmi).toFixed(2)}kg/m²)` : '',
                                                                        bmr: bmr ? `BMR (${parseFloat(bmr).toFixed(2)}kcals)` : '',
                                                                        bsa: bsa ? `BSA (${parseFloat(bsa).toFixed(2)}m²)` : '',
                                                                    })
                                                                )(caseManagerData.vitals[i])
                                                            ).filter(([_, v]) => v))).join(', ')}`}{caseManagerData.vitals.length - 1 != i ? ',' : ''}&nbsp;
                                                        </Text>
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : printSettings?.prescription?.case_option[6]?.format === 'listview' ? (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Vitals & Body Composition:&nbsp;</Text>
                                            {caseManagerData.vitals.map((item, i) => {
                                                return (
                                                    <Text key={i} style={{ marginTop: i == 0 ? 4 : 2 }}>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }}>{item.date}&nbsp;</Text>
                                                        <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                            {`- ${Object.values(Object.fromEntries(Object.entries(
                                                                (
                                                                    ({
                                                                        temp,
                                                                        pres,
                                                                        resp_rate,
                                                                        blood_press,
                                                                        spo2,
                                                                        height,
                                                                        weight,
                                                                        bmi,
                                                                        bmr,
                                                                        bsa,
                                                                    }) => ({
                                                                        temp: temp ? `Temperature (${temp}Frh)` : '',
                                                                        pres: pres ? `Pulse (${pres}/min)` : '',
                                                                        resp_rate: resp_rate ? `Resp. Rate (${resp_rate}/min)` : '',
                                                                        systolic: blood_press ? blood_press.split('/')[0] ? `Systolic (${blood_press.split('/')[0]}mmHg)` : '' : '',
                                                                        diastolic: blood_press ? blood_press.split('/')[1] ? `Diastolic (${blood_press.split('/')[1]}mmHg)` : '' : '',
                                                                        spo2: spo2 ? `SPO2 (${spo2}%)` : '',
                                                                        height: height ? `Height (${height}cms)` : '',
                                                                        weight: weight ? `Weight (${weight}kgs)` : '',
                                                                        bmi: bmi ? `BMI (${parseFloat(bmi).toFixed(2)}kg/m²)` : '',
                                                                        bmr: bmr ? `BMR (${parseFloat(bmr).toFixed(2)}kcals)` : '',
                                                                        bsa: bsa ? `BSA (${parseFloat(bsa).toFixed(2)}m²)` : '',
                                                                    })
                                                                )(caseManagerData.vitals[i])
                                                            ).filter(([_, v]) => v))).join(', ')}\n`}
                                                        </Text>
                                                    </Text>
                                                )
                                            })}
                                        </View>
                                    ) : (
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 700 }}>Vitals & Body Composition:&nbsp;</Text>
                                            <View style={styles.table}>
                                                <View style={styles.row}>
                                                    {columns.map((item, i) => {
                                                        return (
                                                            <Text style={[styles.cell, { fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 500 }]}>{item.title}</Text>
                                                        )
                                                    })}
                                                </View>
                                                {initialRows.map((item, i) => {
                                                    return (
                                                        <View style={styles.row} key={i}>
                                                            <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 500 }]}>{item.name}</Text>
                                                            <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item['0']}</Text>
                                                            <Text style={[styles.cell, { fontSize: 12, color: '#171725', fontFamily: 'Roboto', fontWeight: 400 }]}>{item['1']}</Text>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    )
                                )}
                            </View>

                            <View style={{ marginTop: 30 }}>
                                {printSettings?.signature_enable === 'Y' && fileSignature && fileSignature?.imageShow && (
                                    <View style={{ alignSelf: printSettings?.header_footer?.other_settings?.signature_place === 'R' && 'flex-end' }}>
                                        <Image
                                            style={{ width: 139, height: 60, objectFit: 'contain' }}
                                            src={fileSignature?.showFile} />
                                    </View>
                                )}

                                {printSettings?.qrcode_enable === 'Y' && printSettings?.signature_enable === 'Y' ? (
                                    printSettings?.header_footer?.other_settings?.signature_place === 'R' ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    style={{ width: 61, height: 61, objectFit: 'contain' }}
                                                    src={printSettings?.qrcode} />
                                                <Text style={{ fontSize: 10, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                    {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, textAlign: 'right' }} >
                                                <Text style={{ fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 700 }}>
                                                    {caseManagerData?.doctor_data?.doctor_name}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                    Medical Registration No.: {`${caseManagerData?.doctor_data?.gmc_no}\n${caseManagerData?.doctor_data?.um_qualifications}`}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ flex: 1 }} >
                                                <Text style={{ fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 700 }}>
                                                    {caseManagerData?.doctor_data?.doctor_name}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                    Medical Registration No.: {`${caseManagerData?.doctor_data?.gmc_no}\n${caseManagerData?.doctor_data?.um_qualifications}`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Image
                                                    style={{ width: 61, height: 61, objectFit: 'contain' }}
                                                    src={printSettings?.qrcode} />
                                                <Text style={{ fontSize: 10, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                    {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                ) : (printSettings?.qrcode_enable === 'Y' || printSettings?.signature_enable === 'Y') && (
                                    <View style={{ flexDirection: 'row' }}>
                                        {printSettings?.qrcode_enable === 'Y' && (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    style={{ width: 61, height: 61, objectFit: 'contain' }}
                                                    src={printSettings?.qrcode} />
                                                <Text style={{ fontSize: 10, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                    {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                                                </Text>
                                            </View>
                                        )}
                                        {printSettings?.signature_enable === 'Y' && (
                                            <View style={{ flex: 1, textAlign: printSettings?.header_footer?.other_settings?.signature_place === 'R' && 'right' }} >
                                                <Text style={{ fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 700 }}>
                                                    {caseManagerData?.doctor_data?.doctor_name}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                    Medical Registration No.: {`${caseManagerData?.doctor_data?.gmc_no}\n${caseManagerData?.doctor_data?.um_qualifications}`}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>

                        </View>

                        <View style={{ marginTop: 29 }} fixed>
                            {printSettings?.letterhead_format === 1 && (
                                fileFooter && fileFooter?.imageShow && (
                                    <Image
                                        style={{ width: '100%', objectFit: 'contain' }}
                                        src={fileFooter?.showFile} />
                                )
                            )}
                        </View>

                    </View>
                </Page>
            </Document>
        </PDFViewer >
    )
};

Font.register({
    family: 'Roboto',
    fonts: [
        { src: require('../assets/fonts/print-fonts/Roboto-Regular.ttf'), fontWeight: 400 }, // Regular
        { src: require('../assets/fonts/print-fonts/Roboto-Medium.ttf'), fontWeight: 500 }, // Medium
        { src: require('../assets/fonts/print-fonts/Roboto-Bold.ttf'), fontWeight: 700 }, // Bold
    ],
});

const styles = StyleSheet.create({
    table: {
        marginTop: 4,
        borderTop: '1px solid #171725',
        borderLeft: '1px solid #171725'
    },
    row: {
        flexDirection: 'row',
        borderBottom: '1px solid #171725'
    },
    cell: {
        flex: 1,
        padding: 6,
        paddingBottom: 13,
        borderRight: '1px solid #171725',
    }
});

export default React.memo(Quixote);