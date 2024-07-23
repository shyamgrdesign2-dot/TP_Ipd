import React from 'react';
import { Font, Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
import { isNumeric } from '../../utils/utils'
import { NORMAL, WHATSAPP } from '../../utils/constants';
import moment from 'moment';
import { chunkArray } from '../../utils/utils';

const PX_TO_PT = 0.75

// Roboto
Font.register({
    family: 'Roboto',
    fonts: [
        { src: require('../../assets/fonts/print-fonts/Roboto-Regular.ttf'), fontWeight: 400 }, // Regular
        { src: require('../../assets/fonts/print-fonts/Roboto-Medium.ttf'), fontWeight: 500 }, // Medium
        { src: require('../../assets/fonts/print-fonts/Roboto-Bold.ttf'), fontWeight: 700 }, // Bold
    ],
});
// Arial
Font.register({
    family: 'Arial',
    fonts: [
        { src: require('../../assets/fonts/print-fonts/Arimo-Regular.ttf'), fontWeight: 400 }, // Regular
        { src: require('../../assets/fonts/print-fonts/Arimo-Medium.ttf'), fontWeight: 500 }, // Medium
        { src: require('../../assets/fonts/print-fonts/Arimo-Bold.ttf'), fontWeight: 700 }, // Bold
    ],
});
// Times Roman
Font.register({
    family: 'Times-Roman',
    fonts: [
        { src: require('../../assets/fonts/print-fonts/EBGaramond-Regular.ttf'), fontWeight: 400 }, // Regular
        { src: require('../../assets/fonts/print-fonts/EBGaramond-Medium.ttf'), fontWeight: 500 }, // Medium
        { src: require('../../assets/fonts/print-fonts/EBGaramond-Bold.ttf'), fontWeight: 700 }, // Bold
    ],
});
// Verdana
Font.register({
    family: 'Verdana',
    fonts: [
        { src: require('../../assets/fonts/print-fonts/Jost-Regular.ttf'), fontWeight: 400 }, // Regular
        { src: require('../../assets/fonts/print-fonts/Jost-Medium.ttf'), fontWeight: 500 }, // Medium
        { src: require('../../assets/fonts/print-fonts/Jost-Bold.ttf'), fontWeight: 700 }, // Bold
    ],
});
// Calibri
Font.register({
    family: 'Calibri',
    fonts: [
        { src: require('../../assets/fonts/print-fonts/OpenSans-Regular.ttf'), fontWeight: 400 }, // Regular
        { src: require('../../assets/fonts/print-fonts/OpenSans-Medium.ttf'), fontWeight: 500 }, // Medium
        { src: require('../../assets/fonts/print-fonts/OpenSans-Bold.ttf'), fontWeight: 700 }, // Bold
    ],
});
// Tahoma
Font.register({
    family: 'Tahoma',
    fonts: [
        { src: require('../../assets/fonts/print-fonts/Vazirmatn-Regular.ttf'), fontWeight: 400 }, // Regular
        { src: require('../../assets/fonts/print-fonts/Vazirmatn-Medium.ttf'), fontWeight: 500 }, // Medium
        { src: require('../../assets/fonts/print-fonts/Vazirmatn-Bold.ttf'), fontWeight: 700 }, // Bold
    ],
});

const styles = StyleSheet.create({
    mainTitle: {
        fontSize: PX_TO_PT * 18,
        color: '#A461D8',
        fontFamily: 'Roboto',
        fontWeight: 700
    },
    subTitle: {
        fontSize: PX_TO_PT * 14,
        color: '#454551',
        fontFamily: 'Roboto',
        fontWeight: 500,
        lineHeight: 1.4
    },
    displayPatient: {
        fontSize: PX_TO_PT * 12,
        color: '#171725',
        fontFamily: 'Roboto'
    },
    mainCasemanager: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    extraText: {
        fontSize: PX_TO_PT * 12,
        color: '#171725',
        fontFamily: 'Roboto',
    },
    directionCasemanager: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    table: {
        marginTop: PX_TO_PT * 4,
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
        borderRight: '1px solid #171725',
    }
});

const ViewPDF = ({ mode = NORMAL, ...props }) => {

    let { smartRxFile, caseManagerData, columns, initialRows, frequencyList, timingList, printSettings, fileHeader, fileFooter, fileLogo, fileWatermark, fileSignature, todayVaccines, growthChartDetails, isGynaecHistoryAccessable, obsHistoryData } = props

    const gynecHistoryData = caseManagerData?.gynecHistoryData 
    
    const { growthChartData, growthChartImageData } = growthChartDetails || {};
    let growthChartImageChunks = []
    if(growthChartImageData) {
        const growthChartOption = printSettings?.prescription?.case_option?.find(o => o.id === 12)?.growth_chart_option;
        const graphs = Object.keys(growthChartImageData)?.filter(g => growthChartOption?.includes(g));
        growthChartImageChunks = chunkArray(graphs, 2);
    }

    const patientDataShow = (id) => {
        var value = ''
        if (id == 1) {
            value = `${caseManagerData?.patient_data?.patient_salutation} ${caseManagerData?.patient_data?.patient_name} ${caseManagerData?.patient_data?.patient_id}`
        } else if (id == 2) {
            value = `${caseManagerData?.patient_data?.patient_consultaion_date ? moment(caseManagerData?.patient_data?.patient_consultaion_date).format('DD/MM/YYYY HH:mm') : '-'}`
        } else if (id == 3) {
            value = `${caseManagerData?.patient_data?.patient_age ? `${caseManagerData?.patient_data?.patient_age}Years` : '-'}, ${caseManagerData?.patient_data?.patient_gender}`
        } else if (id == 4) {
            value = `${caseManagerData?.patient_data?.patient_contact_no ? caseManagerData?.patient_data?.patient_contact_no : '-'}`
        } else if (id == 5) {
            value = `${caseManagerData?.patient_data?.patient_ht_wt ? caseManagerData?.patient_data?.patient_ht_wt : '-'}`
        } else if (id == 6) {
            value = `${caseManagerData?.patient_data?.patient_blood_group ? caseManagerData?.patient_data?.patient_blood_group : '-'}`
        } else if (id == 7) {
            value = `${caseManagerData?.patient_data?.patient_address ? caseManagerData?.patient_data?.patient_address : '-'}`
        } else if (id == 8) {
            value = `${caseManagerData?.patient_data?.patient_consultation_type ? caseManagerData?.patient_data?.patient_consultation_type : '-'}`
        } else if (id == 9) {
            value = `${caseManagerData?.patient_data?.patient_edd_date ? caseManagerData?.patient_data?.patient_edd_date : '-'}`
        } else if (id == 10) {
            value = `${caseManagerData?.patient_data?.patient_email ? caseManagerData?.patient_data?.patient_email : '-'}`
        } else if (id == 11) {
            value = `${caseManagerData?.patient_data?.patient_reference_id ? caseManagerData?.patient_data?.patient_reference_id : '-'}`
        }
        return value
    }

    const medical_history_title = (id) => {
        var value = ''
        if (id == 2 || id == 3) {
            value = `Issue : `
        } else if (id == 4) {
            value = `Allergies to : `
        } else if (id == 1) {
            value = `Habit : `
        }
        return value
    }

    let gynecListViewCounter = 1;
    let obsInlineViewCounter = 1;
    let obsListViewCounter = 1;

    return (
        <Document>
            <Page
                size="A4"
                style={{
                    // flex: 1,
                    paddingTop: mode == NORMAL ? printSettings?.letterhead_format != 2 ? PX_TO_PT * 30 : printSettings?.header_footer?.margin?.top ? printSettings?.header_footer?.margin?.top * 25 : 0 : PX_TO_PT * 30,
                    paddingBottom: mode == NORMAL ?
                        printSettings?.letterhead_format != 2 ?
                            printSettings?.letterhead_format == 1 ?
                                fileFooter ? 110 : PX_TO_PT * 30
                                : printSettings?.header_footer?.footer?.title ?
                                    35 + parseInt(printSettings?.header_footer?.footer?.font_size)
                                    : PX_TO_PT * 30
                            : printSettings?.header_footer?.margin?.bottom ? printSettings?.header_footer?.margin?.bottom * 25
                                : 0
                        : printSettings?.whatsapp_letterhead_format == 1 ?
                            fileFooter ? 110 : PX_TO_PT * 30
                            : printSettings?.header_footer?.footer?.title ?
                                35 + parseInt(printSettings?.header_footer?.footer?.font_size)
                                : PX_TO_PT * 30,
                    paddingLeft: mode == NORMAL ? printSettings?.letterhead_format != 2 ? PX_TO_PT * 30 : printSettings?.header_footer?.margin?.left ? printSettings?.header_footer?.margin?.left * 25 : 0 : PX_TO_PT * 30,
                    paddingRight: mode == NORMAL ? printSettings?.letterhead_format != 2 ? PX_TO_PT * 30 : printSettings?.header_footer?.margin?.right ? printSettings?.header_footer?.margin?.right * 25 : 0 : PX_TO_PT * 30,
                }}
                wrap={!smartRxFile}>

                <View style={{ marginBottom: PX_TO_PT * (mode == NORMAL ? printSettings?.letterhead_format != 2 ? 15 : 0 : 15) }} fixed>
                    {mode == NORMAL ? (
                        printSettings?.letterhead_format === 0 ? (
                            <View>
                                {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' && printSettings?.header_footer?.header?.clinic_info?.enable === 'Y' ? (
                                    <View style={styles.directionCasemanager}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.mainTitle}>
                                                {printSettings?.header_footer?.header?.doctor_info?.place === 'L' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                            </Text>
                                            <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
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
                                            <Text style={styles.mainTitle}>
                                                {printSettings?.header_footer?.header?.doctor_info?.place === 'R' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                            </Text>
                                            <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
                                                {printSettings?.header_footer?.header?.doctor_info?.place === 'R' ? printSettings?.header_footer?.header?.doctor_info?.subheader : printSettings?.header_footer?.header?.clinic_info?.subheader}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {printSettings?.logo_enable === 'Y' && (
                                            <View style={{ width: 82, height: 82, overflow: 'hidden', marginLeft: 8 }}>
                                                {fileLogo && fileLogo?.imageShow && (
                                                    <Image
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                        src={fileLogo?.showFile}
                                                    />
                                                )}
                                            </View>
                                        )}
                                        {(printSettings?.header_footer?.header?.doctor_info?.enable === 'Y') ? (
                                            <View style={{ flex: 1, textAlign: printSettings?.header_footer?.header?.doctor_info?.place === 'L' ? 'left' : 'right', weight: '189px' }}>
                                                <Text style={styles.mainTitle}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                                </Text>
                                                <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.subheader : printSettings?.header_footer?.header?.clinic_info?.subheader}
                                                </Text>
                                            </View>
                                        ) : printSettings?.header_footer?.header?.clinic_info?.enable === 'Y' && (
                                            <View style={{ flex: 1, textAlign: printSettings?.header_footer?.header?.clinic_info?.place === 'L' ? 'left' : 'right', weight: '130px' }}>
                                                <Text style={styles.mainTitle}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                                </Text>
                                                <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
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
                        )
                    ) : mode == WHATSAPP && (
                        printSettings?.whatsapp_letterhead_format === 0 ? (
                            <View>
                                {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' && printSettings?.header_footer?.header?.clinic_info?.enable === 'Y' ? (
                                    <View style={styles.directionCasemanager}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.mainTitle}>
                                                {printSettings?.header_footer?.header?.doctor_info?.place === 'L' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                            </Text>
                                            <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
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
                                            <Text style={styles.mainTitle}>
                                                {printSettings?.header_footer?.header?.doctor_info?.place === 'R' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                            </Text>
                                            <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
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
                                                <Text style={styles.mainTitle}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                                </Text>
                                                <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.subheader : printSettings?.header_footer?.header?.clinic_info?.subheader}
                                                </Text>
                                            </View>
                                        ) : printSettings?.header_footer?.header?.clinic_info?.enable === 'Y' && (
                                            <View style={{ flex: 1, marginLeft: printSettings?.header_footer?.header?.clinic_info?.place === 'L' ? 8 : 0, textAlign: printSettings?.header_footer?.header?.clinic_info?.place === 'L' ? 'left' : 'right', weight: '130px' }}>
                                                <Text style={styles.mainTitle}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.header : printSettings?.header_footer?.header?.clinic_info?.header}
                                                </Text>
                                                <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
                                                    {printSettings?.header_footer?.header?.doctor_info?.enable === 'Y' ? printSettings?.header_footer?.header?.doctor_info?.subheader : printSettings?.header_footer?.header?.clinic_info?.subheader}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        ) : printSettings?.whatsapp_letterhead_format === 1 && (
                            fileHeader && fileHeader?.imageShow && (
                                <Image
                                    style={{ width: '100%', objectFit: 'contain' }}
                                    src={fileHeader?.showFile}
                                />
                            )
                        )
                    )}

                </View>

                {/* <View style={{ flex: 1 }}> */}

                {printSettings?.water_mark_enable === 'Y' && (
                    fileWatermark && fileWatermark?.imageShow && (
                        <Image
                            style={{
                                width: 100, height: 100, objectFit: 'contain', zIndex: -1, opacity: 0.1,
                                position: 'absolute', top: '50%', left: '40%'
                            }}
                            src={fileWatermark?.showFile}
                            fixed />
                    )
                )}

                <View style={{ backgroundColor: '#171725', height: PX_TO_PT * 2, width: '100%' }} />

                <View style={{ flexDirection: 'row', marginVertical: PX_TO_PT * 15 }}>
                    <View style={{ flex: 0.7, marginRight: PX_TO_PT * 8 }}>
                        {printSettings?.header_footer?.patient_info.filter(e => e.enable === 'Y').map((item, i) => {
                            return (
                                i % 2 === 0 && (
                                    <View key={i} style={{ flexDirection: 'row', paddingVertical: PX_TO_PT * 3 }}>
                                        <Text style={[styles.displayPatient, { fontWeight: 500 }]}>{`${item.title}: `}</Text>
                                        <Text style={[styles.displayPatient, { fontWeight: 400 }]}>{patientDataShow(item.id)}</Text>
                                    </View>
                                )
                            )
                        })}
                    </View>
                    <View style={{ flex: 0.3, marginLeft: PX_TO_PT * 8 }}>
                        {printSettings?.header_footer?.patient_info.filter(e => e.enable === 'Y').map((item, i) => {
                            return (
                                i % 2 === 1 && (
                                    <View key={i} style={{ flexDirection: 'row', paddingVertical: PX_TO_PT * 3 }}>
                                        <Text style={[styles.displayPatient, { fontWeight: 500 }]}>{`${item.title}: `}</Text>
                                        <Text style={[styles.displayPatient, { fontWeight: 400 }]}>{patientDataShow(item.id)}</Text>
                                    </View>
                                )
                            )
                        })}
                    </View>
                </View>

                <View style={{ backgroundColor: '#171725', height: PX_TO_PT * 1, width: '100%' }} />

                <View>
                    {printSettings?.prescription?.case_option?.map((option, index) => {
                        return (
                            option?.id === 1 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.symptoms.length > 0 && (
                                        option?.format === 'inline' ? (
                                            <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Symptoms:&nbsp;</Text>
                                                {caseManagerData.symptoms.map((item, i) => {
                                                    return (
                                                        <Text key={i}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.symptom_name}&nbsp;</Text>
                                                            {(item.since || item.severity || item.note) ?
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ since, severity, note }) => ({ since, severity, note }))(caseManagerData.symptoms[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.symptoms.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                                :
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{caseManagerData.symptoms.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                            }
                                                        </Text>
                                                    )
                                                })}
                                            </Text>
                                        ) : option?.format === 'listview' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Symptoms:&nbsp;</Text>
                                                {caseManagerData.symptoms.map((item, i) => {
                                                    return (
                                                        <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.symptom_name}&nbsp;</Text>
                                                            {(item.since || item.severity || item.note) &&
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ since, severity, note }) => ({ since, severity, note }))(caseManagerData.symptoms[i])).filter(([_, v]) => v))).join(', ')})\n`}</Text>
                                                            }
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Symptoms:&nbsp;</Text>
                                                <View style={styles.table}>
                                                    <View style={styles.row}>
                                                        <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NAME</Text>
                                                        <Text style={[styles.cell, { flex: 0.2, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>SINCE</Text>
                                                        <Text style={[styles.cell, { flex: 0.2, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>SEVERITY</Text>
                                                        <Text style={[styles.cell, { flex: 0.5, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NOTE</Text>
                                                    </View>
                                                    {caseManagerData.symptoms.map((item, i) => (
                                                        <View style={styles.row} key={i}>
                                                            <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{item.symptom_name}</Text>
                                                            <Text style={[styles.cell, { flex: 0.2, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.since ? item.since : '-'}</Text>
                                                            <Text style={[styles.cell, { flex: 0.2, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.severity ? item.severity : '-'}</Text>
                                                            <Text style={[styles.cell, { flex: 0.5, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.note ? item.note : '-'}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 2 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.examination.length > 0 && (
                                        option?.format === 'inline' ? (
                                            <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Examinations:&nbsp;</Text>
                                                {caseManagerData.examination.map((item, i) => {
                                                    return (
                                                        <Text key={i}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.examination_name}&nbsp;</Text>
                                                            {(item.note) ?
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.examination[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.examination.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                                :
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{caseManagerData.examination.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                            }
                                                        </Text>
                                                    )
                                                })}
                                            </Text>
                                        ) : option?.format === 'listview' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Examinations:&nbsp;</Text>
                                                {caseManagerData.examination.map((item, i) => {
                                                    return (
                                                        <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.examination_name}&nbsp;</Text>
                                                            {(item.since || item.severity || item.note) &&
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.examination[i])).filter(([_, v]) => v))).join(', ')})\n`}</Text>
                                                            }
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Examinations:&nbsp;</Text>
                                                <View style={styles.table}>
                                                    <View style={styles.row}>
                                                        <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NAME</Text>
                                                        <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NOTE</Text>
                                                    </View>
                                                    {caseManagerData.examination.map((item, i) => (
                                                        <View style={styles.row} key={i}>
                                                            <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{item.examination_name}</Text>
                                                            <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.note ? item.note : '-'}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 3 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.diagnosis.length > 0 && (
                                        option?.format === 'inline' ? (
                                            <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Diagnosis:&nbsp;</Text>
                                                {caseManagerData.diagnosis.map((item, i) => {
                                                    return (
                                                        <Text key={i}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.tds_name}&nbsp;</Text>
                                                            {(item.since || item.status || item.note) ?
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ since, status, note }) => ({ since, status, note }))(caseManagerData.diagnosis[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.diagnosis.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                                :
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{caseManagerData.diagnosis.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                            }
                                                        </Text>
                                                    )
                                                })}
                                            </Text>
                                        ) : option?.format === 'listview' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Diagnosis:&nbsp;</Text>
                                                {caseManagerData.diagnosis.map((item, i) => {
                                                    return (
                                                        <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.tds_name}&nbsp;</Text>
                                                            {(item.since || item.severity || item.note) &&
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ since, status, note }) => ({ since, status, note }))(caseManagerData.diagnosis[i])).filter(([_, v]) => v))).join(', ')})\n`}</Text>
                                                            }
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Diagnosis:&nbsp;</Text>
                                                <View style={styles.table}>
                                                    <View style={styles.row}>
                                                        <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NAME</Text>
                                                        <Text style={[styles.cell, { flex: 0.2, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>SINCE</Text>
                                                        <Text style={[styles.cell, { flex: 0.2, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>STATUS</Text>
                                                        <Text style={[styles.cell, { flex: 0.5, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NOTE</Text>
                                                    </View>
                                                    {caseManagerData.diagnosis.map((item, i) => (
                                                        <View style={styles.row} key={i}>
                                                            <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{item.tds_name}</Text>
                                                            <Text style={[styles.cell, { flex: 0.2, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.since ? item.since : '-'}</Text>
                                                            <Text style={[styles.cell, { flex: 0.2, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.status ? item.status : '-'}</Text>
                                                            <Text style={[styles.cell, { flex: 0.5, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.note ? item.note : '-'}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 4 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.medicine.length > 0 && (
                                        option?.format === 'inline' ? (
                                            <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Medication (Rx):&nbsp;</Text>
                                                {caseManagerData.medicine.map((item, i) => {
                                                    return (
                                                        <Text key={i}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.tmm_medicine_name}&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                {`(${Object.values(Object.fromEntries(Object.entries(
                                                                    (
                                                                        ({
                                                                            tmm_generic,
                                                                            tmf_block,
                                                                            tmm_dosage,
                                                                            medicineUnit,
                                                                            tmm_unit,
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
                                                                            modiGeneric: option?.medicine_with_generic ? tmm_generic : '',

                                                                            modiUnitPerDose: option?.medicine_option?.includes('dose') ? tmm_dosage ? `${tmm_dosage} ${medicineUnit && medicineUnit.find((x) => x.tmu_id == tmm_unit) !== undefined ? medicineUnit.find((x) => x.tmu_id == tmm_unit).tmu_title : ""}` : "" : "",

                                                                            modiFrequency: tmf_block === 0 || tmf_block === "" ? `${(tcm_tmm_freq_morning || tcm_tmm_freq_afternoon || tcm_tmm_freq_evening || tcm_tmm_freq_night) ? `${tcm_tmm_freq_morning ? tcm_tmm_freq_morning : 0}-${tcm_tmm_freq_afternoon ? tcm_tmm_freq_afternoon : 0}${tcm_tmm_freq_evening ? '-' + tcm_tmm_freq_evening : ''}-${tcm_tmm_freq_night ? tcm_tmm_freq_night : 0}` : ``}` : `(${frequencyList.find((x) => x.tmf_id === tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id === tmm_freq_type).tmf_title : ''})`,

                                                                            modiTiming: timingList.find((x) => x.tmt_id === tmm_time) !== undefined ? timingList.find((x) => x.tmt_id === tmm_time).tmt_title : '',

                                                                            modiDuration: option?.medicine_option?.includes('duration') ? isNumeric(tmm_days) ? `${tmm_days} ${tmm_duration_type}` : '-' : '',

                                                                            // modiDisplayQty: display_qty ? display_qty.toFixed(2).replace(/\.00$/, '') : '',
                                                                            modiDisplayQty: option?.medicine_option?.includes('quantity') ? display_qty ? display_qty : '' : '',

                                                                            modiRemarks: option?.medicine_option?.includes('note') ? tmm_remarks : ''
                                                                        })
                                                                    )(caseManagerData.medicine[i])
                                                                ).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.medicine.length - 1 != i ? ',' : ''}&nbsp;
                                                            </Text>
                                                        </Text>
                                                    )
                                                })}
                                            </Text>
                                        ) : option?.format === 'listview' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Medication (Rx):&nbsp;</Text>
                                                {caseManagerData.medicine.map((item, i) => {
                                                    return (
                                                        <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.tmm_medicine_name}&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                {`(${Object.values(Object.fromEntries(Object.entries(
                                                                    (
                                                                        ({
                                                                            tmm_generic,
                                                                            tmf_block,
                                                                            tmm_dosage,
                                                                            medicineUnit,
                                                                            tmm_unit,
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
                                                                            modiGeneric: option?.medicine_with_generic ? tmm_generic : '',

                                                                            modiUnitPerDose: option?.medicine_option?.includes('dose') ? tmm_dosage ? `${tmm_dosage} ${medicineUnit && medicineUnit.find((x) => x.tmu_id == tmm_unit) !== undefined ? medicineUnit.find((x) => x.tmu_id == tmm_unit).tmu_title : ""}` : "" : "",

                                                                            modiFrequency: tmf_block === 0 || tmf_block === "" ? `${(tcm_tmm_freq_morning || tcm_tmm_freq_afternoon || tcm_tmm_freq_evening || tcm_tmm_freq_night) ? `${tcm_tmm_freq_morning ? tcm_tmm_freq_morning : 0}-${tcm_tmm_freq_afternoon ? tcm_tmm_freq_afternoon : 0}${tcm_tmm_freq_evening ? '-' + tcm_tmm_freq_evening : ''}-${tcm_tmm_freq_night ? tcm_tmm_freq_night : 0}` : ``}` : `(${frequencyList.find((x) => x.tmf_id === tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id === tmm_freq_type).tmf_title : ''})`,

                                                                            modiTiming: timingList.find((x) => x.tmt_id === tmm_time) !== undefined ? timingList.find((x) => x.tmt_id === tmm_time).tmt_title : '',

                                                                            modiDuration: option?.medicine_option?.includes('duration') ? isNumeric(tmm_days) ? `${tmm_days} ${tmm_duration_type}` : '-' : '',

                                                                            modiDisplayQty: option?.medicine_option?.includes('quantity') ? display_qty ? display_qty : '' : '',

                                                                            modiRemarks: option?.medicine_option?.includes('note') ? tmm_remarks : ''
                                                                        })
                                                                    )(caseManagerData.medicine[i])
                                                                ).filter(([_, v]) => v))).join(', ')})\n`}
                                                            </Text>
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Medication (Rx):&nbsp;</Text>
                                                <View style={styles.table}>
                                                    <View style={styles.row}>
                                                        <Text style={[styles.cell, { flex: 0.18, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>S.NO</Text>
                                                        <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>MEDICINE</Text>
                                                        {option?.medicine_option?.includes('dose') && (
                                                            <Text style={[styles.cell, { flex: 0.4, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>DOSE</Text>
                                                        )}
                                                        <Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>FREQUENCY</Text>
                                                        {option?.medicine_option?.includes('duration') && (
                                                            <Text style={[styles.cell, { flex: 0.53, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>DURATION</Text>
                                                        )}
                                                        {option?.medicine_option?.includes('quantity') && (
                                                            <Text style={[styles.cell, { flex: 0.18, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>QTY</Text>
                                                        )}
                                                        {option?.medicine_option?.includes('note') && (
                                                            <Text style={[styles.cell, { flex: 0.7, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NOTES</Text>
                                                        )}
                                                    </View>
                                                    {caseManagerData.medicine.map((item, i) => (
                                                        <View style={styles.row} key={i}>
                                                            <Text style={[styles.cell, { flex: 0.18, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{i + 1}</Text>
                                                            <View style={styles.cell}>
                                                                <Text style={[{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{item.tmm_medicine_name}</Text>
                                                                {option?.medicine_with_generic && (
                                                                    <Text style={[{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.tmm_generic}</Text>
                                                                )}
                                                            </View>
                                                            {option?.medicine_option?.includes('dose') && (
                                                                <Text style={[styles.cell, { flex: 0.4, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{`${item.tmm_dosage ? `${item.tmm_dosage} ${item?.medicineUnit && item?.medicineUnit.find((x) => x.tmu_id == item.tmm_unit) !== undefined ? item?.medicineUnit.find((x) => x.tmu_id == item.tmm_unit).tmu_title : ""}` : ""}`}</Text>
                                                            )}
                                                            <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                {item.tmf_block === 0 || item.tmf_block === "" ? `${(item.tcm_tmm_freq_morning || item.tcm_tmm_freq_afternoon || item.tcm_tmm_freq_evening || item.tcm_tmm_freq_night) ? `${item.tcm_tmm_freq_morning ? item.tcm_tmm_freq_morning : 0}-${item.tcm_tmm_freq_afternoon ? item.tcm_tmm_freq_afternoon : 0}${item.tcm_tmm_freq_evening ? '-' + item.tcm_tmm_freq_evening : ''}-${item.tcm_tmm_freq_night ? item.tcm_tmm_freq_night : 0}` : `-`}` : `(${frequencyList.find((x) => x.tmf_id === item.tmm_freq_type) !== undefined ? frequencyList.find((x) => x.tmf_id === item.tmm_freq_type).tmf_title : ''})`}{'\n'}{timingList.find((x) => x.tmt_id === item.tmm_time) !== undefined ? timingList.find((x) => x.tmt_id === item.tmm_time).tmt_title : ''}
                                                            </Text>
                                                            {option?.medicine_option?.includes('duration') && (
                                                                <Text style={[styles.cell, { flex: 0.53, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                    {isNumeric(item.tmm_days) ? `${item.tmm_days} ${item.tmm_duration_type}` : '-'}
                                                                </Text>
                                                            )}
                                                            {option?.medicine_option?.includes('quantity') && (
                                                                <Text style={[styles.cell, { flex: 0.18, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                    {item.display_qty ? item.display_qty : '-'}
                                                                </Text>
                                                            )}
                                                            {option?.medicine_option?.includes('note') && (
                                                                <Text style={[styles.cell, { flex: 0.7, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                    {item.tmm_remarks ? item.tmm_remarks : '-'}
                                                                </Text>
                                                            )}
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 5 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.advice.length > 0 && (
                                        option?.format === 'inline' ? (
                                            <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Advices:&nbsp;</Text>
                                                {caseManagerData.advice.map((item, i) => {
                                                    return (
                                                        <Text key={i}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{item.advice_name}&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{caseManagerData.advice.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                        </Text>
                                                    )
                                                })}
                                            </Text>
                                        ) : option?.format === 'listview' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Advices:&nbsp;</Text>
                                                {caseManagerData.advice.map((item, i) => {
                                                    return (
                                                        <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{item.advice_name}&nbsp;</Text>
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Advices:&nbsp;</Text>
                                                <View style={styles.table}>
                                                    <View style={styles.row}>
                                                        <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NAME</Text>
                                                    </View>
                                                    {caseManagerData.advice.map((item, i) => (
                                                        <View style={styles.row} key={i}>
                                                            <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.advice_name}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 6 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.investigation.length > 0 && (
                                        option?.format === 'inline' ? (
                                            <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Lab Investigation:&nbsp;</Text>
                                                {caseManagerData.investigation.map((item, i) => {
                                                    return (
                                                        <Text key={i}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.investigation_name}&nbsp;</Text>
                                                            {(item.note) ?
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.investigation[i])).filter(([_, v]) => v))).join(', ')})`}{caseManagerData.investigation.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                                :
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{caseManagerData.investigation.length - 1 != i ? ',' : ''}&nbsp;</Text>
                                                            }
                                                        </Text>
                                                    )
                                                })}
                                            </Text>
                                        ) : option?.format === 'listview' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Lab Investigation:&nbsp;</Text>
                                                {caseManagerData.investigation.map((item, i) => {
                                                    return (
                                                        <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.investigation_name}&nbsp;</Text>
                                                            {(item.since || item.severity || item.note) &&
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(${Object.values(Object.fromEntries(Object.entries((({ note }) => ({ note }))(caseManagerData.investigation[i])).filter(([_, v]) => v))).join(', ')})\n`}</Text>
                                                            }
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Lab Investigation:&nbsp;</Text>
                                                <View style={styles.table}>
                                                    <View style={styles.row}>
                                                        <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NAME</Text>
                                                        <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NOTE</Text>
                                                    </View>
                                                    {caseManagerData.investigation.map((item, i) => (
                                                        <View style={styles.row} key={i}>
                                                            <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{item.investigation_name}</Text>
                                                            <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item.note ? item.note : '-'}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 7 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.vitals.length > 0 && (
                                        option?.format === 'inline' ? (
                                            <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Vitals & Body Composition:&nbsp;</Text>
                                                {caseManagerData.vitals.map((item, i) => {
                                                    return (
                                                        <Text key={i}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{moment(item.date).format('DD/MM/YYYY')}&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
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
                                                                            temp: temp ? `Temp: ${temp}F` : '',
                                                                            pres: pres ? `Pulse: ${pres}/min` : '',
                                                                            resp_rate: resp_rate ? `Resp. Rate: ${resp_rate}/min` : '',
                                                                            blood_press: blood_press ? blood_press.endsWith("/") ? `BP: ${blood_press.substring(0, blood_press.length - 1)}mmHg` : `BP: ${blood_press}mmHg` : '',
                                                                            // systolic: blood_press ? blood_press.split('/')[0] ? `Systolic (${blood_press.split('/')[0]}mmHg)` : '' : '',
                                                                            // diastolic: blood_press ? blood_press.split('/')[1] ? `Diastolic (${blood_press.split('/')[1]}mmHg)` : '' : '',
                                                                            spo2: spo2 ? `SPO2: ${spo2}%` : '',
                                                                            height: height ? `Height: ${height}cms` : '',
                                                                            weight: weight ? `Weight: ${weight}kgs` : '',
                                                                            bmi: bmi ? `BMI: ${parseFloat(bmi).toFixed(2)}kg/m²` : '',
                                                                            bmr: bmr ? `BMR: ${parseFloat(bmr).toFixed(2)}kcals` : '',
                                                                            bsa: bsa ? `BSA: ${parseFloat(bsa).toFixed(2)}m²` : '',
                                                                        })
                                                                    )(caseManagerData.vitals[i])
                                                                ).filter(([_, v]) => v))).join(', ')}`}{caseManagerData.vitals.length - 1 != i ? ',' : ''}&nbsp;
                                                            </Text>
                                                        </Text>
                                                    )
                                                })}
                                            </Text>
                                        ) : option?.format === 'listview' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Vitals & Body Composition:&nbsp;</Text>
                                                {caseManagerData.vitals.map((item, i) => {
                                                    return (
                                                        <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{moment(item.date).format('DD/MM/YYYY')}&nbsp;</Text>
                                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
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
                                                                            temp: temp ? `Temp: ${temp}F` : '',
                                                                            pres: pres ? `Pulse: ${pres}/min` : '',
                                                                            resp_rate: resp_rate ? `Resp. Rate: ${resp_rate}/min` : '',
                                                                            blood_press: blood_press ? blood_press.endsWith("/") ? `BP: ${blood_press.substring(0, blood_press.length - 1)}mmHg` : `BP: ${blood_press}mmHg` : '',
                                                                            // systolic: blood_press ? blood_press.split('/')[0] ? `Systolic (${blood_press.split('/')[0]}mmHg)` : '' : '',
                                                                            // diastolic: blood_press ? blood_press.split('/')[1] ? `Diastolic (${blood_press.split('/')[1]}mmHg)` : '' : '',
                                                                            spo2: spo2 ? `SPO2: ${spo2}%` : '',
                                                                            height: height ? `Height: ${height}cms` : '',
                                                                            weight: weight ? `Weight" ${weight}kgs` : '',
                                                                            bmi: bmi ? `BMI: ${parseFloat(bmi).toFixed(2)}kg/m²` : '',
                                                                            bmr: bmr ? `BMR: ${parseFloat(bmr).toFixed(2)}kcals` : '',
                                                                            bsa: bsa ? `BSA: ${parseFloat(bsa).toFixed(2)}m²` : '',
                                                                        })
                                                                    )(caseManagerData.vitals[i])
                                                                ).filter(([_, v]) => v))).join(', ')}\n`}
                                                            </Text>
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Vitals & Body Composition:&nbsp;</Text>
                                                <View style={styles.table}>
                                                    <View style={styles.row}>
                                                        {columns.map((item, i) => {
                                                            return (
                                                                <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>{item.title}</Text>
                                                            )
                                                        })}
                                                    </View>
                                                    {initialRows.map((item, i) => {
                                                        return (
                                                            (item['0'] != '-' || (item.hasOwnProperty('1') && item['1'] != '-') || (item.hasOwnProperty('2') && item['2'] != '-')) && (
                                                                <View style={styles.row} key={i}>
                                                                    <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{item.name}</Text>
                                                                    <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item['0']}</Text>
                                                                    {item.hasOwnProperty('1') && (
                                                                        <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item['1']}</Text>
                                                                    )}
                                                                    {item.hasOwnProperty('2') && (
                                                                        <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item['2']}</Text>
                                                                    )}
                                                                </View>
                                                            )
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 8 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.medical_history.length > 0 && (
                                        option?.format === 'inline' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Medical History:&nbsp;</Text>
                                                {caseManagerData.medical_history.map((item, i) => {
                                                    return (
                                                        <Text key={i} style={{ marginTop: (item?.no_know_history || item?.tags?.length > 0) ? PX_TO_PT * 6 : 0, lineHeight: 1.4 }}>
                                                            {!item?.no_know_history ? (
                                                                item?.tags?.length > 0 && (
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.title}&nbsp;
                                                                        {item.tags.map((item1, i1) => {
                                                                            return (
                                                                                <>
                                                                                    {`(`}
                                                                                    {item1.enable == 'Y' ? (
                                                                                        <>
                                                                                            <Text key={i1} style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                                                {medical_history_title(item?.tmmhs_id)}
                                                                                                <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                                    {item1?.title}
                                                                                                </Text>
                                                                                            </Text>

                                                                                            {item1?.since && (
                                                                                                <Text key={i1} style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                                                    {` | Since : `}
                                                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                                        {item1?.since}
                                                                                                    </Text>
                                                                                                </Text>
                                                                                            )}

                                                                                            {item?.tmmhs_id != 3 && (
                                                                                                <>
                                                                                                    {item1?.status && (
                                                                                                        <Text key={i1} style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                                                            {` | Status : `}
                                                                                                            <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                                                {item1?.status}
                                                                                                            </Text>
                                                                                                        </Text>
                                                                                                    )}
                                                                                                    {item1?.medication && (
                                                                                                        <Text key={i1} style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                                                            {` | Medication : `}
                                                                                                            <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                                                {item1?.medication}
                                                                                                            </Text>
                                                                                                        </Text>
                                                                                                    )}
                                                                                                </>
                                                                                            )}
                                                                                            {item?.tmmhs_id == 3 && item1?.relationship && (
                                                                                                <Text key={i1} style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                                                    {` | Relative : `}
                                                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                                        {item1?.relationship}
                                                                                                    </Text>
                                                                                                </Text>
                                                                                            )}

                                                                                            {item1?.note && (
                                                                                                <Text key={i1} style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                                                    {` | Note : `}
                                                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                                        {item1?.note}
                                                                                                    </Text>
                                                                                                </Text>
                                                                                            )}
                                                                                        </>
                                                                                    ) : (
                                                                                        <Text key={i1} style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                            {`No ${item1.title}`}
                                                                                        </Text>
                                                                                    )}
                                                                                    {`)`}{item.tags.length - 1 != i1 ? ',' : ''}&nbsp;
                                                                                </>
                                                                            )
                                                                        })}
                                                                        {'\n'}</Text>
                                                                )
                                                            ) : (
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item.title}&nbsp;
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{`(No known history)`}</Text>
                                                                </Text>
                                                            )}
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : option?.format === 'listview' ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Medical History:&nbsp;</Text>
                                                {caseManagerData.medical_history.map((item, i) => {
                                                    let abcd = 97
                                                    return (
                                                        <Text key={i} style={{ marginTop: (item?.no_know_history || item?.tags?.length > 0) ? PX_TO_PT * 6 : 0, lineHeight: 1.4 }}>
                                                            {!item?.no_know_history ? (
                                                                item?.tags?.length > 0 && (
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, lineHeight: 1.4 }}>&nbsp;{i + 1}. {item.title}&nbsp;:</Text>
                                                                        {item.tags.map((item1, i1) => {
                                                                            return (
                                                                                <>
                                                                                    {item1.enable == 'Y' ? (
                                                                                        <>
                                                                                            <Text key={i1} style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{'\n'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String.fromCharCode(abcd++)}.&nbsp;{item1.title}&nbsp;</Text>
                                                                                            {(item1.since || item1.status || item1.medication || item1.relationship || item1.note) &&
                                                                                                <Text key={i1} style={{ lineHeight: 1.4, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                                    {`(${Object.values(Object.fromEntries(Object.entries((
                                                                                                        ({
                                                                                                            since,
                                                                                                            status,
                                                                                                            medication,
                                                                                                            relationship,
                                                                                                            note
                                                                                                        }) => ({
                                                                                                            since: since && `Since : ${since}`,
                                                                                                            status: status && `Status : ${status}`,
                                                                                                            medication: medication && `Medication : ${medication}`,
                                                                                                            relationship: relationship && `Relative : ${relationship}`,
                                                                                                            note: note && `Note : ${note}`,
                                                                                                        })
                                                                                                    )(item1)).filter(([_, v]) => v))).join(' | ')})`}
                                                                                                </Text>
                                                                                            }
                                                                                        </>
                                                                                    ) : (
                                                                                        <Text key={i1} style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{'\n'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String.fromCharCode(abcd++)}.&nbsp;{`No ${item1.title}`}&nbsp;</Text>
                                                                                    )}
                                                                                </>
                                                                            )
                                                                        })}
                                                                        {'\n'}</Text>
                                                                )
                                                            ) : (
                                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}. {item.title}&nbsp;:
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{'\n'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String.fromCharCode(abcd++)}.&nbsp;No known history&nbsp;</Text>
                                                                </Text>
                                                            )}
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Medical History:&nbsp;</Text>
                                                {caseManagerData.medical_history.map((item, i) => {
                                                    return (
                                                        (item?.no_know_history || item?.tags?.length > 0) && (
                                                            <>
                                                                <Text style={{ color: '#000', marginTop: i === 0 ? PX_TO_PT * 4 : PX_TO_PT * 12, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, padding: 6, borderTop: '1px solid #171725', borderLeft: '1px solid #171725', borderRight: '1px solid #171725', backgroundColor: '#E2E2EA' }}>{`${item.title} : `}</Text>
                                                                {!item?.no_know_history ? (
                                                                    <View key={i} style={[styles.table, { marginTop: 0 }]}>
                                                                        <View style={styles.row}>
                                                                            <Text style={[styles.cell, { fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NAME</Text>
                                                                            <Text style={[styles.cell, { flex: 0.2, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>SINCE</Text>
                                                                            {item?.tmmhs_id != 3 && (
                                                                                <>
                                                                                    <Text style={[styles.cell, { flex: 0.2, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>STATUS</Text>
                                                                                    {item?.tmmhs_id == 2 && (
                                                                                        <Text style={[styles.cell, { flex: 0.25, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>MEDICATION</Text>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                            {item?.tmmhs_id === 3 && (
                                                                                <Text style={[styles.cell, { flex: 0.4, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>RELATIVE</Text>
                                                                            )}
                                                                            <Text style={[styles.cell, { flex: 0.5, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NOTE</Text>
                                                                        </View>
                                                                        {item?.tags?.filter(x => x.enable == 'Y')?.map((item1, i1) => {
                                                                            return (
                                                                                <View style={styles.row} key={i1}>
                                                                                    <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{item1.title}</Text>
                                                                                    <Text style={[styles.cell, { flex: 0.2, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item1.since ? item1.since : '-'}</Text>
                                                                                    {item?.tmmhs_id != 3 && (
                                                                                        <>
                                                                                            <Text style={[styles.cell, { flex: 0.2, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item1.status ? item1.status : '-'}</Text>
                                                                                            {item?.tmmhs_id == 2 && (
                                                                                                <Text style={[styles.cell, { flex: 0.25, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item1.medication ? item1.medication : '-'}</Text>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                    {item?.tmmhs_id === 3 && (
                                                                                        <Text style={[styles.cell, { flex: 0.4, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item1.relationship ? item1.relationship : '-'}</Text>
                                                                                    )}
                                                                                    <Text style={[styles.cell, { flex: 0.5, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>{item1.note ? item1.note : '-'}</Text>
                                                                                </View>
                                                                            )
                                                                        })}
                                                                        {item?.tags?.filter(x => x.enable == 'N')?.map((item1, i1) => {
                                                                            return (
                                                                                <View style={styles.row} key={i1}>
                                                                                    <Text style={[styles.cell, { color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }]}>{`No ${item1.title}`}</Text>
                                                                                </View>
                                                                            )
                                                                        })}
                                                                    </View>
                                                                ) : (
                                                                    <Text style={{ color: '#000', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, padding: 6, border: 1, borderStyle: 'solid', borderColor: '#171725' }}>{`No known history`}</Text>

                                                                )}
                                                            </>
                                                        )
                                                    )
                                                })}
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 9 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {caseManagerData.follow_up_date && (
                                        <Text style={{ marginTop: PX_TO_PT * 15 }}>
                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Follow-up:&nbsp;</Text>
                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{moment(caseManagerData.follow_up_date).format('DD/MM/YYYY')}</Text>
                                        </Text>
                                    )}

                                    {caseManagerData.visit_advice && (
                                        <Text style={{ marginTop: PX_TO_PT * 15 }}>
                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Notes:&nbsp;</Text>
                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>{caseManagerData.visit_advice}</Text>
                                        </Text>
                                    )}
                                </>
                            ) : option?.id === 10 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    <>
                                        {(todayVaccines?.given?.length > 0 || todayVaccines?.due?.length > 0) && (
                                            option?.format === 'inline' ? (
                                                <>
                                                    {todayVaccines?.given?.length > 0 && <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                        <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Given Vaccines :&nbsp;{'\n'}</Text>
                                                        {todayVaccines?.given?.map((item, i) => {
                                                            return (
                                                                <Text key={i} style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item?.tvac_name}&nbsp;</Text>
                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        {`(Given Date : `}
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                            {item?.tvp_given_date ? moment(item?.tvp_given_date).format("DD MMM YYYY") : '-'}
                                                                        </Text>
                                                                    </Text>
                                                                    {item?.tvc_name && <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        {` | Brand : `}
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                            {item?.tvc_name}
                                                                        </Text>
                                                                    </Text>}
                                                                    {item?.tvp_remarks &&
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                            {` | Note : `}
                                                                            <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                {item?.tvp_remarks}
                                                                            </Text>
                                                                        </Text>}
                                                                    <Text key={i} style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{')\n'}</Text>
                                                                </Text>
                                                            )
                                                        })}
                                                    </Text>}
                                                    {todayVaccines?.due?.length > 0 && <Text style={{ marginTop: PX_TO_PT * 15, lineHeight: 1.4 }}>
                                                        <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Due Vaccines :&nbsp;{'\n'}</Text>
                                                        {todayVaccines?.due?.map((item, i) => {
                                                            return (
                                                                <Text key={i} style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item?.tvac_name}&nbsp;</Text>
                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        {`(Updated Due Date : `}
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                            {item?.tvd_due_date ? moment(item?.tvd_due_date).format("DD MMM YYYY") : '-'}
                                                                        </Text>
                                                                    </Text>
                                                                    {item?.tvd_remarks &&
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                            {` | Note : `}
                                                                            <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                                {item?.tvd_remarks}
                                                                            </Text>
                                                                        </Text>}
                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{')\n'}</Text>
                                                                </Text>
                                                            )
                                                        })}
                                                    </Text>}
                                                </>
                                            ) : option?.format === 'listview' ? (
                                                <>
                                                    {todayVaccines?.given?.length && <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                        <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Given Vaccines :&nbsp;{'\n'}</Text>
                                                        {todayVaccines?.given?.map((item, i) => {
                                                            return (
                                                                <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item?.tvac_name}&nbsp;</Text>
                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        {`(Given Date : `}
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                            {item?.tvp_given_date ? moment(item?.tvp_given_date).format("DD MMM YYYY") : '-'}
                                                                        </Text>
                                                                    </Text>
                                                                    {item?.tvc_name && <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        {` | Brand : `}
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                            {item?.tvc_name}
                                                                        </Text>
                                                                    </Text>}
                                                                    {item?.tvp_remarks && <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        {` | Note : `}
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                            {item?.tvp_remarks}
                                                                        </Text>
                                                                    </Text>}
                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{')\n'}</Text>
                                                                </Text>
                                                            )
                                                        })}
                                                    </View>}
                                                    {todayVaccines?.due?.length && <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                        <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Due Vaccines :&nbsp;{'\n'}</Text>
                                                        {todayVaccines?.due?.map((item, i) => {
                                                            return (
                                                                <Text key={i} style={{ marginTop: PX_TO_PT * (i == 0 ? 4 : 2), lineHeight: 1.4 }}>
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>&nbsp;{i + 1}.&nbsp;</Text>
                                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{item?.tvac_name}&nbsp;</Text>
                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        {`(Updated Due Date : `}
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                            {item?.tvd_due_date ? moment(item?.tvd_due_date).format("DD MMM YYYY") : '-'}
                                                                        </Text>
                                                                    </Text>
                                                                    {item?.tvp_remarks && <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>
                                                                        {` | Note : `}
                                                                        <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }}>
                                                                            {item?.tvd_remarks}
                                                                        </Text>
                                                                    </Text>}
                                                                    <Text style={{ color: '#454551', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500 }}>{')\n'}</Text>
                                                                </Text>
                                                            )
                                                        })}
                                                    </View>}
                                                </>
                                            ) : (
                                                <>
                                                    {todayVaccines?.given?.length && <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                        <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Given Vaccines :&nbsp;{'\n'}</Text>
                                                        <View style={styles.table}>
                                                            <View style={styles.row}>
                                                                <Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NAME</Text>
                                                                <Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>GIVEN DATE</Text>
                                                                <Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>BRAND</Text>
                                                                <Text style={[styles.cell, { flex: 0.8, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NOTE</Text>
                                                            </View>
                                                            {todayVaccines?.given?.map((item, i) => (
                                                                <View style={styles.row} key={i}>
                                                                    <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                        {item?.tvac_name || '-'}
                                                                    </Text>
                                                                    <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                        {item?.tvp_given_date ? moment(item?.tvp_given_date).format("DD MMM YYYY") : '-'}
                                                                    </Text>
                                                                    <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                        {item?.tvc_name || '-'}
                                                                    </Text>
                                                                    <Text style={[styles.cell, { flex: 0.8, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                        {item.tvp_remarks || '-'}
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>}
                                                    {todayVaccines?.due?.length && <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                        <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Due Vaccines :&nbsp;{'\n'}</Text>
                                                        <View style={styles.table}>
                                                            <View style={styles.row}>
                                                                <Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NAME</Text>
                                                                <Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>UPDATED DUE DATE</Text>
                                                                <Text style={[styles.cell, { flex: 0.8, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>NOTE</Text>
                                                            </View>
                                                            {todayVaccines?.due?.map((item, i) => (
                                                                <View style={styles.row} key={i}>
                                                                    <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                        {item?.tvac_name || '-'}
                                                                    </Text>
                                                                    <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                        {item?.tvd_due_date ? moment(item?.tvd_due_date).format("DD MMM YYYY") : '-'}
                                                                    </Text>
                                                                    <Text style={[styles.cell, { flex: 0.8, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                        {item.tvd_remarks || '-'}
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>}
                                                </>
                                            )
                                        )}
                                    </>
                                </>
                            ) : option?.id === 11 && option?.enable === 'Y' && option?.custom_status === 'Y' && caseManagerData?.smart_prescription_filename ? (
                                    <Image
                                        src={smartRxFile}
                                    />
                            ) : option?.id === 12 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    {growthChartData?.length > 0 && (
                                        option?.format === 'table' ? (
                                            <>
                                                <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                    <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700 }}>Growth Chart &nbsp;{'\n'}</Text>
                                                    <View style={styles.table}>
                                                        <View style={styles.row}>
                                                            <Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>Parameters</Text>
                                                            {option?.growth_chart_option?.includes('height') && <Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>Height</Text>}
                                                            {option?.growth_chart_option?.includes('weight') &&<Text style={[styles.cell, { flex: 0.6, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>Weight</Text>}
                                                            {option?.growth_chart_option?.includes('bmi') &&<Text style={[styles.cell, { flex: 0.8, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>BMI</Text>}
                                                            {option?.growth_chart_option?.includes('ofc') &&<Text style={[styles.cell, { flex: 0.8, fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 500, color: '#000' }]}>OFC</Text>}
                                                        </View>
                                                        {growthChartData?.map((item, i) => (
                                                            <View style={styles.row} key={i}>
                                                                <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                    {item?.tcbc_created_date ? moment(item?.tcbc_created_date).format("DD MMM YYYY") : ''}
                                                                </Text>
                                                                {option?.growth_chart_option?.includes('height') && <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                    {item?.height ? `${item?.height} cms` : ''}
                                                                </Text>}
                                                                {option?.growth_chart_option?.includes('weight') && <Text style={[styles.cell, { flex: 0.6, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                    {item?.weight ? `${item?.weight} kgs` : ''}
                                                                </Text>}
                                                                {option?.growth_chart_option?.includes('bmi') && <Text style={[styles.cell, { flex: 0.8, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                    {item.bmi ? `${item.bmi} kg/m2` : ''}
                                                                </Text>}
                                                                {option?.growth_chart_option?.includes('ofc') && <Text style={[styles.cell, { flex: 0.8, color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 400 }]}>
                                                                    {item.ofc ? `${item.ofc} cms` : ''}
                                                                </Text>}
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            </>
                                        ) : growthChartImageChunks?.length > 0 &&
                                        <>
                                            <Text style={{ color: '#171725', fontFamily: printSettings?.page_format?.font_family, fontSize: PX_TO_PT * printSettings?.page_format?.font_size, fontWeight: 700, marginTop: PX_TO_PT * 15 }}>Growth Chart &nbsp;{'\n'}</Text>
                                            <View>
                                                {growthChartImageChunks?.map((chunk, index) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: PX_TO_PT * 15}} key={index}>
                                                        {chunk?.filter(c => option?.growth_chart_option?.includes(c))?.map(img => (<Image key={img} style={{width: '48%', objectFit: 'contain'}} src={growthChartImageData[img]} />))}
                                                    </View>
                                                ))}
                                            </View>
                                        </>
                                    )}
                                </>
                            ) : option?.id === 13 && option?.enable === 'Y' && option?.custom_status === 'Y' ? (
                                <>
                                    { gynecHistoryData && isGynaecHistoryAccessable &&
                                        (option?.format === "inline" ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text
                                                    style={{
                                                        color: "#171725",
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Menstrual details&nbsp;:&nbsp;
                                                </Text>

                                                <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
                                                    {gynecHistoryData?.lmp && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                LMP&nbsp;(Date&nbsp;:&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                }}
                                                            >
                                                                {moment(gynecHistoryData?.lmp).format("DD MMM YYYY")}
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                ),&nbsp;
                                                            </Text>
                                                        </>
                                                    )}

                                                    {(gynecHistoryData?.cycle || gynecHistoryData?.intervalOfCycle || gynecHistoryData?.cycleNotes || gynecHistoryData?.cycleNotes) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Cycle&nbsp;
                                                            </Text>

                                                            {gynecHistoryData?.cycle && (
                                                                <>                                                            
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        (Type&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,  
                                                                            textTransform: 'capitalize'                                                  
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.cycle}
                                                                    </Text>
                                                                    {(gynecHistoryData?.intervalOfCycle || gynecHistoryData?.cycleNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,  
                                                                                textTransform: 'capitalize'                                                  
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}                                                                    
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.intervalOfCycle && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Interval of cycle&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.intervalOfCycle}&nbsp;
                                                                        {Number(gynecHistoryData?.intervalOfCycle) > 1 ? `days` : `day`}
                                                                    </Text>
                                                                    {gynecHistoryData?.cycleNotes && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.cycleNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.cycleNotes}
                                                                    </Text>                                                            
                                                                </>
                                                            )}
                                                        </> 
                                                    )}

                                                    {(gynecHistoryData?.flow || gynecHistoryData?.durationOfMenstrualFlow || gynecHistoryData?.clots || gynecHistoryData?.numberOfPadsPerDay || gynecHistoryData?.flowNotes) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                ),&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Flow&nbsp;(
                                                            </Text>

                                                            {gynecHistoryData?.flow && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Volume&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.flow}
                                                                    </Text>
                                                                    {(gynecHistoryData?.durationOfMenstrualFlow || gynecHistoryData?.clots || gynecHistoryData?.numberOfPadsPerDay || gynecHistoryData?.flowNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.durationOfMenstrualFlow && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Duration of menstrual flow&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.durationOfMenstrualFlow}&nbsp;
                                                                        {Number(gynecHistoryData?.durationOfMenstrualFlow) > 1 ? `days` : `day`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.clots || gynecHistoryData?.numberOfPadsPerDay || gynecHistoryData?.flowNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.clots && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Clots&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {Boolean(gynecHistoryData?.clots) ? `Yes` : `No`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.numberOfPadsPerDay || gynecHistoryData?.flowNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.numberOfPadsPerDay && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Number of pads per day&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.numberOfPadsPerDay}
                                                                    </Text>
                                                                    {(gynecHistoryData?.flowNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.flowNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.flowNotes}
                                                                    </Text>                                                            
                                                                </>
                                                            )}
                                                        </>
                                                    )}

                                                    {(gynecHistoryData?.pain || gynecHistoryData?.occurrenceOfPain || gynecHistoryData?.painNotes) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                ),&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Pain&nbsp;(
                                                            </Text>

                                                            {gynecHistoryData?.pain && (
                                                                <>                                                                    
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Level&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.pain}
                                                                    </Text>
                                                                    {(gynecHistoryData?.occurrenceOfPain || gynecHistoryData?.painNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.occurrenceOfPain && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Occurrence of pain&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.occurrenceOfPain}
                                                                    </Text>
                                                                    {(gynecHistoryData?.painNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.painNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.painNotes}
                                                                    </Text>                                                    
                                                                </>
                                                            )}
                                                        </>
                                                    )}

                                                    {(gynecHistoryData?.ageAtMenarche || gynecHistoryData?.menarcheNotes) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                ),&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Menarche&nbsp;(
                                                            </Text>

                                                            {gynecHistoryData?.ageAtMenarche && (
                                                                <>                                                                    
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Age at&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.ageAtMenarche} {`years`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.menarcheNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.menarcheNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.menarcheNotes}
                                                                    </Text>                                                            
                                                                </>
                                                            )}
                                                        </>
                                                    )}

                                                    {(gynecHistoryData?.ageAtMenopause || gynecHistoryData?.typeOfMenopause || gynecHistoryData?.reproductiveNotes) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                ),&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'menopause' ? 'Menopause' : gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'perimenopause' ? 'Perimenopause' : 'Lactational amenorrhea'}&nbsp;(
                                                            </Text>

                                                            {gynecHistoryData?.ageAtMenopause && (
                                                                <>                                                                    
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Age at&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.ageAtMenopause} {`years`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.typeOfMenopause || gynecHistoryData?.reproductiveNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.typeOfMenopause && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Type of {gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'menopause' ? 'menopause' : gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'perimenopause' ? 'perimenopause' : 'lactational amenorrhea'}&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.typeOfMenopause}
                                                                    </Text>
                                                                    {(gynecHistoryData?.reproductiveNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.reproductiveNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.reproductiveNotes}
                                                                    </Text>
                                                                    
                                                                    {!gynecHistoryData?.notes && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 500,
                                                                            }}
                                                                        >
                                                                            {`)`}
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}

                                                    {gynecHistoryData?.notes && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                ),&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Menstruation note&nbsp;:&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                }}
                                                            >
                                                                {gynecHistoryData?.notes}
                                                            </Text>
                                                        </>
                                                    )}
                                                </Text>
                                            </View>
                                        ) : option?.format === "listview" ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text
                                                    style={{
                                                        color: "#171725",
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Menstrual details&nbsp;:&nbsp;
                                                </Text>

                                                {gynecHistoryData?.lmp && (
                                                    <Text
                                                        style={{ marginTop: 5, lineHeight: 1.4 }}
                                                    >                                                    
                                                        <Text
                                                            style={{
                                                                color: "#171725",
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,                                                                    
                                                                }}
                                                            >
                                                                &nbsp;{gynecListViewCounter++}.&nbsp;LMP&nbsp;:&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Date&nbsp;:&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                }}
                                                            >
                                                                {moment(gynecHistoryData?.lmp).format("DD MMM YYYY")}
                                                            </Text>
                                                        </Text>
                                                    </Text>
                                                )}    

                                                {(gynecHistoryData?.cycle || gynecHistoryData?.intervalOfCycle || gynecHistoryData?.cycleNotes || gynecHistoryData?.cycleNotes) && (
                                                    <Text
                                                        style={{ lineHeight: 1.4 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: "#171725",
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                &nbsp;{gynecListViewCounter++}.&nbsp;Cycle&nbsp;:&nbsp;
                                                            </Text>

                                                            {gynecHistoryData?.cycle && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Type&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.cycle}
                                                                    </Text>
                                                                    {(gynecHistoryData?.intervalOfCycle || gynecHistoryData?.cycleNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.intervalOfCycle && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Interval of cycle&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.intervalOfCycle || ``}&nbsp;
                                                                        {Number(gynecHistoryData?.intervalOfCycle) > 1 ? `days` : `day`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.cycleNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.cycleNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.cycleNotes}
                                                                    </Text>
                                                                </>
                                                            )}   
                                                        </Text>
                                                    </Text>
                                                )}

                                                {(gynecHistoryData?.flow || gynecHistoryData?.durationOfMenstrualFlow || gynecHistoryData?.clots || gynecHistoryData?.numberOfPadsPerDay || gynecHistoryData?.flowNotes) && (
                                                    <Text
                                                        style={{ lineHeight: 1.4 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: "#171725",
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            
                                                                <Text
                                                                    style={{
                                                                        color: "#171725",
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    &nbsp;{gynecListViewCounter++}.&nbsp;Flow&nbsp;:&nbsp;
                                                                </Text>
                                                                                                                
                                                            
                                                            {gynecHistoryData?.flow && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Volume&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.flow}
                                                                    </Text>
                                                                    {(gynecHistoryData?.durationOfMenstrualFlow || gynecHistoryData?.clots || gynecHistoryData?.numberOfPadsPerDay || gynecHistoryData?.flowNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.durationOfMenstrualFlow && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Duration of mentrual flow&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.durationOfMenstrualFlow || ``}&nbsp;
                                                                        {Number(gynecHistoryData?.durationOfMenstrualFlow) > 1 ? `days` : `day`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.clots || gynecHistoryData?.numberOfPadsPerDay || gynecHistoryData?.flowNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.clots && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Clots&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {Boolean(gynecHistoryData?.clots) ? `Yes` : `No`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.numberOfPadsPerDay || gynecHistoryData?.flowNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.numberOfPadsPerDay && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Number of pads per day&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.numberOfPadsPerDay}
                                                                    </Text>
                                                                    {(gynecHistoryData?.flowNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.flowNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.flowNotes}
                                                                    </Text>
                                                                </>
                                                            )}                                                    
                                                        </Text>
                                                    </Text>
                                                )}

                                                {(gynecHistoryData?.pain || gynecHistoryData?.occurrenceOfPain || gynecHistoryData?.painNotes) && (
                                                    <Text
                                                        style={{ lineHeight: 1.4 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: "#171725",
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            
                                                                <Text
                                                                    style={{
                                                                        color: "#171725",
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    &nbsp;{gynecListViewCounter++}.&nbsp;Pain&nbsp;:&nbsp;
                                                                </Text>
                                                            
                                                            
                                                            {gynecHistoryData?.pain && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Level&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.pain}
                                                                    </Text>
                                                                    {(gynecHistoryData?.occurrenceOfPain || gynecHistoryData?.painNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.occurrenceOfPain && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Occurrence of pain&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.occurrenceOfPain}
                                                                    </Text>
                                                                    {(gynecHistoryData?.painNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.painNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.painNotes}
                                                                    </Text>
                                                                </>
                                                            )} 
                                                        </Text>
                                                    </Text>
                                                )}

                                                {(gynecHistoryData?.ageAtMenarche || gynecHistoryData?.menarcheNotes) && (
                                                    <Text
                                                        style={{ lineHeight: 1.4 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: "#171725",
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            
                                                                <Text
                                                                    style={{
                                                                        color: "#171725",
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    &nbsp;{gynecListViewCounter++}.&nbsp;Menarche&nbsp;:&nbsp;
                                                                </Text>
                                                            
                                                            
                                                            {gynecHistoryData?.ageAtMenarche && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                       Age at&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.ageAtMenarche} {`years`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.menarcheNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.menarcheNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.menarcheNotes}
                                                                    </Text>
                                                                </>
                                                            )} 
                                                        </Text>
                                                    </Text>
                                                )}

                                                {(gynecHistoryData?.ageAtMenopause || gynecHistoryData?.typeOfMenopause || gynecHistoryData?.reproductiveNotes) && (
                                                    <Text
                                                        style={{ lineHeight: 1.4 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: "#171725",
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            
                                                                <Text
                                                                    style={{
                                                                        color: "#171725",
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    &nbsp;{gynecListViewCounter++}.&nbsp;{gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'menopause' ? 'Menopause' : gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'perimenopause' ? 'Perimenopause' : 'Lactational amenorrhea'}&nbsp;:&nbsp;
                                                                </Text>
                                                            
                                                            
                                                            {gynecHistoryData?.ageAtMenopause && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Age at&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.ageAtMenopause} {`years`}
                                                                    </Text>
                                                                    {(gynecHistoryData?.typeOfMenopause || gynecHistoryData?.reproductiveNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.typeOfMenopause && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Type of {gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'menopause' ? 'menopause' : gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'perimenopause' ? 'perimenopause' : 'lactational amenorrhea'}&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            textTransform: 'capitalize'
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.typeOfMenopause}
                                                                    </Text>
                                                                    {(gynecHistoryData?.reproductiveNotes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {gynecHistoryData?.reproductiveNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {gynecHistoryData?.reproductiveNotes}
                                                                    </Text>
                                                                </>
                                                            )}                                                        
                                                        </Text>
                                                    </Text>
                                                )}

                                                {gynecHistoryData?.notes && (
                                                    <Text
                                                        style={{ lineHeight: 1.4 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: "#171725",
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                &nbsp;{gynecListViewCounter++}.&nbsp;Menstruation note&nbsp;:&nbsp;
                                                            </Text>

                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                }}
                                                            >
                                                                {gynecHistoryData?.notes}
                                                            </Text>
                                                        </Text>
                                                    </Text>
                                                )}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text
                                                    style={{
                                                        color: "#171725",
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 700,
                                                    }}
                                                    wrap={false}
                                                >
                                                    Menstrual details&nbsp;:&nbsp;
                                                </Text>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                    wrap={false}
                                                >
                                                    LMP
                                                </Text>
                                                <View style={[styles.table, { marginTop: 0 }]}>
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                },
                                                            ]}
                                                        >
                                                            Date
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.lmp ? moment(gynecHistoryData?.lmp).format("DD MMM YYYY") : `-`}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                    wrap={false}
                                                >
                                                    Cycle
                                                </Text>
                                                <View style={[styles.table, { marginTop: 0 }]}>
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Type
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Interval
                                                        </Text>                                                        
                                                    </View>
                                                    
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                textTransform: 'capitalize'
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.cycle || `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.intervalOfCycle || ``}&nbsp;
                                                            {gynecHistoryData?.intervalOfCycle ? Number(gynecHistoryData?.intervalOfCycle) > 1 ? `days` : `day` : `-`}
                                                        </Text>                                                        
                                                    </View>

                                                    <View
                                                        style={[
                                                            styles.row
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                Note&nbsp;:&nbsp;
                                                            </Text>

                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 400,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                {gynecHistoryData?.cycleNotes || `-`}
                                                            </Text>                                                                                                                        
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                    wrap={false}
                                                >
                                                    Flow
                                                </Text>
                                                <View style={[styles.table, { marginTop: 0 }]}>
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Volume
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Duration flow
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Clots
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Pads per day
                                                        </Text>
                                                    </View>
                                                    
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                textTransform: 'capitalize'
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.flow || `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.durationOfMenstrualFlow || ``}&nbsp;
                                                            {gynecHistoryData?.durationOfMenstrualFlow ? Number(gynecHistoryData?.durationOfMenstrualFlow) > 1
                                                                ? `days`
                                                                : `day` : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {Boolean(gynecHistoryData?.clots) ? `Yes` : `No`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.numberOfPadsPerDay || `-`}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            styles.row
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                Note&nbsp;:&nbsp;
                                                            </Text>

                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 400,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                {gynecHistoryData?.flowNotes || `-`}
                                                            </Text>                                                                                                                        
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                    wrap={false}                                                    
                                                >
                                                    Pain
                                                </Text>                                               
                                                <View style={[styles.table, { marginTop: 0 }]}>
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}                                                        
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Level
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Occurrence
                                                        </Text>
                                                    </View>
                                                    
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                textTransform: 'capitalize'
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.pain || `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {                                                               
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                textTransform: 'capitalize'
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.occurrenceOfPain || `-`}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            styles.row
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                Note&nbsp;:&nbsp;
                                                            </Text>

                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 400,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                {gynecHistoryData?.painNotes || `-`}
                                                            </Text>                                                                                                                        
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                    wrap={false}
                                                >
                                                    Menarche
                                                </Text>
                                                <View style={[styles.table, { marginTop: 0 }]}>
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                },
                                                            ]}
                                                        >
                                                            Age at
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.ageAtMenarche || ``} {gynecHistoryData?.ageAtMenarche ? `years` : `-`}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            styles.row
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell                                                                
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                Note&nbsp;:&nbsp;
                                                            </Text>

                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 400,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                {gynecHistoryData?.menarcheNotes || `-`}
                                                            </Text>                                                                                                                        
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                    wrap={false}
                                                >
                                                    {gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'menopause' ? 'Menopause' : gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'perimenopause' ? 'Perimenopause' : 'Lactational amenorrhea'}
                                                </Text>
                                                <View style={[styles.table, { marginTop: 0 }]}>
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Age
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Type of {gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'menopause' ? 'menopause' : gynecHistoryData?.reproductiveLifeStages?.toLowerCase() === 'perimenopause' ? 'perimenopause' : 'lactational amenorrhea'}
                                                        </Text>
                                                    </View>
                                                    
                                                    <View
                                                        style={[
                                                            styles.row,
                                                            { alignItems: "center", justifyContent: "center" },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.ageAtMenopause || ``} {gynecHistoryData?.ageAtMenopause ? `years` : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 400,
                                                                color: "#000",
                                                                textAlign: "center",
                                                                textTransform: 'capitalize'
                                                                },
                                                            ]}
                                                        >
                                                            {gynecHistoryData?.typeOfMenopause || `-`}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            styles.row
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.cell
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                Note&nbsp;:&nbsp;
                                                            </Text>

                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 400,
                                                                        color: "#000",
                                                                    }
                                                                ]}>
                                                                {gynecHistoryData?.reproductiveNotes || `-`}
                                                            </Text>                                                                                                                        
                                                        </Text>
                                                    </View>
                                                </View>

                                                {gynecHistoryData?.notes && (
                                                    <>
                                                        <Text
                                                            style={{
                                                                color: "#000",
                                                                marginTop: PX_TO_PT * 12,
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                padding: 6,
                                                                borderTop: "1px solid #171725",
                                                                borderLeft: "1px solid #171725",
                                                                borderRight: "1px solid #171725",
                                                                backgroundColor: "#E2E2EA",
                                                            }}
                                                            wrap={false}
                                                        >
                                                            Menstruation note
                                                        </Text>
                                                        <View style={[styles.table, { marginTop: 0 }]}>
                                                            <View
                                                                style={[
                                                                    styles.row
                                                                ]}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                        },
                                                                    ]}
                                                                >
                                                                    {gynecHistoryData?.notes || `-`}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </>
                                                )}                                                                                                
                                            </View>
                                        )
                                    )}
                                </>
                            ) : option?.id === 14 && option?.enable === 'Y' && option?.custom_status === 'Y' && (
                                <>
                                    {isGynaecHistoryAccessable && obsHistoryData &&
                                        Object.keys(obsHistoryData).length > 2 &&
                                        (option?.format === "inline" ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text
                                                    style={{
                                                        color: "#171725",
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Obstetric History&nbsp;:&nbsp;
                                                </Text>

                                                <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
                                                    {(obsHistoryData?.lmp ||
                                                        obsHistoryData?.edd ||
                                                        obsHistoryData?.ceed ||
                                                        obsHistoryData?.gestationWeeks ||
                                                        obsHistoryData?.gestationDays ||
                                                        obsHistoryData?.blood ||
                                                        obsHistoryData?.husbandsBlood ||
                                                        obsHistoryData?.consang ||
                                                        obsHistoryData?.maritialStatus) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {obsInlineViewCounter++}.&nbsp;Patient diagnosis&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                (
                                                            </Text>
                                                            {obsHistoryData?.lmp && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        LMP&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {moment(obsHistoryData?.lmp).format("DD MMM YYYY")}
                                                                    </Text>

                                                                    {(obsHistoryData?.edd ||
                                                                        obsHistoryData?.ceed ||
                                                                        obsHistoryData?.gestationWeeks ||
                                                                        obsHistoryData?.gestationDays ||
                                                                        obsHistoryData?.blood ||
                                                                        obsHistoryData?.husbandsBlood ||
                                                                        obsHistoryData?.consang ||
                                                                        obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.edd && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        E.D.D.&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {moment(obsHistoryData?.edd).format("DD MMM YYYY")}
                                                                    </Text>
                                                                    {(obsHistoryData?.ceed ||
                                                                        obsHistoryData?.gestationWeeks ||
                                                                        obsHistoryData?.gestationDays ||
                                                                        obsHistoryData?.blood ||
                                                                        obsHistoryData?.husbandsBlood ||
                                                                        obsHistoryData?.consang ||
                                                                        obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.ceed && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        C.E.D.D.&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {moment(obsHistoryData?.ceed).format("DD MMM YYYY")}
                                                                    </Text>
                                                                    {(obsHistoryData?.gestationWeeks ||
                                                                        obsHistoryData?.gestationDays ||
                                                                        obsHistoryData?.blood ||
                                                                        obsHistoryData?.husbandsBlood ||
                                                                        obsHistoryData?.consang ||
                                                                        obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {(obsHistoryData?.gestationWeeks || obsHistoryData?.gestationDays) && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Gestation&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.gestationWeeks ? `${obsHistoryData?.gestationWeeks}W` : ""}
                                                                        {obsHistoryData?.gestationWeeks && obsHistoryData?.gestationDays ? `,` : ``}
                                                                        {obsHistoryData?.gestationDays ? `${obsHistoryData?.gestationDays}D` : ""}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            {obsHistoryData?.blood && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        &nbsp;{"\n"}
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;Blood group&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.blood}
                                                                    </Text>
                                                                    {(obsHistoryData?.husbandsBlood || obsHistoryData?.consang || obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.husbandsBlood && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Husband's blood group&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.husbandsBlood}
                                                                    </Text>
                                                                    {(obsHistoryData?.consang || obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.consang && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Consanguineous&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {Boolean(obsHistoryData?.consang) ? `Yes` : `No`}
                                                                    </Text>
                                                                    {obsHistoryData?.maritialStatus && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.maritialStatus && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Marital status&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.maritialStatus}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                )
                                                            </Text>
                                                        </>
                                                    )}
                                                </Text>

                                                <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
                                                    {(obsHistoryData?.gravidity || obsHistoryData?.parity || obsHistoryData?.livingChildren || obsHistoryData?.abortion || obsHistoryData?.ectopicPregnancies) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {obsInlineViewCounter++}.&nbsp;GPLAE&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                (
                                                            </Text>

                                                            {obsHistoryData?.gravidity && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Gravida&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.gravidity).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {(obsHistoryData?.parity || obsHistoryData?.livingChildren || obsHistoryData?.abortion || obsHistoryData?.ectopicPregnancies) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.parity && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Para&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.parity).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {(obsHistoryData?.livingChildren || obsHistoryData?.abortion || obsHistoryData?.ectopicPregnancies) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.livingChildren && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Living&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.livingChildren).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {(obsHistoryData?.abortion || obsHistoryData?.ectopicPregnancies) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.abortion && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Abortion&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.abortion).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {obsHistoryData?.ectopicPregnancies && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.ectopicPregnancies && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Ectopic&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.ectopicPregnancies).toString().padStart(2, "0")}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            {obsHistoryData?.diagnosisNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.diagnosisNotes}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                )
                                                            </Text>
                                                        </>
                                                    )}
                                                </Text>

                                                <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
                                                    {obsHistoryData?.pregnancyHistory.length > 0 && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {obsInlineViewCounter++}.&nbsp;Pregancy history
                                                            </Text>

                                                            {obsHistoryData?.pregnancyHistory.map((item, i) => (
                                                                <View key={i}>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        {(item?.gravidaNumber ||
                                                                            item?.outcome ||
                                                                            item?.termLength ||
                                                                            item?.deliveryMode ||
                                                                            item?.gestationPeriod ||
                                                                            item?.location ||
                                                                            item?.modeOfManagement ||
                                                                            item?.typeOfAbortion ||
                                                                            item?.modeOfAbortion ||
                                                                            item?.dateOfDelivery ||
                                                                            item?.gender ||
                                                                            item?.babysWeight ||
                                                                            item?.remarks) && (
                                                                            <>
                                                                                {i > 0 ? (
                                                                                    <Text style={{ marginTop: 15 }}>
                                                                                        &nbsp;{`\n`}
                                                                                        &nbsp;&nbsp;&nbsp;&nbsp;(
                                                                                    </Text>
                                                                                ) : (
                                                                                    <Text>&nbsp;(</Text>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </Text>
                                                                    {item?.gravidaNumber && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Gravida number&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {(item?.gravidaNumber).toString().padStart(2, "0")}
                                                                            </Text>
                                                                            {(item?.outcome ||
                                                                                item?.termLength ||
                                                                                item?.deliveryMode ||
                                                                                item?.gestationPeriod ||
                                                                                item?.location ||
                                                                                item?.modeOfManagement ||
                                                                                item?.typeOfAbortion ||
                                                                                item?.modeOfAbortion ||
                                                                                item?.dateOfDelivery ||
                                                                                item?.gender ||
                                                                                item?.babysWeight ||
                                                                                item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.outcome && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Outcome&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.outcome}
                                                                            </Text>
                                                                            {(item?.termLength ||
                                                                                item?.deliveryMode ||
                                                                                item?.gestationPeriod ||
                                                                                item?.location ||
                                                                                item?.modeOfManagement ||
                                                                                item?.typeOfAbortion ||
                                                                                item?.modeOfAbortion ||
                                                                                item?.dateOfDelivery ||
                                                                                item?.gender ||
                                                                                item?.babysWeight ||
                                                                                item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.termLength && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Term length&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.termLength}
                                                                            </Text>
                                                                            {(item?.deliveryMode ||
                                                                                item?.gestationPeriod ||
                                                                                item?.location ||
                                                                                item?.modeOfManagement ||
                                                                                item?.typeOfAbortion ||
                                                                                item?.modeOfAbortion ||
                                                                                item?.dateOfDelivery ||
                                                                                item?.gender ||
                                                                                obsHistoryData?.babysWeight ||
                                                                                item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.deliveryMode && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Mode of delivery&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.deliveryMode}
                                                                            </Text>
                                                                            {(item?.gestationPeriod ||
                                                                                item?.location ||
                                                                                item?.modeOfManagement ||
                                                                                item?.typeOfAbortion ||
                                                                                item?.modeOfAbortion ||
                                                                                item?.dateOfDelivery ||
                                                                                item?.gender ||
                                                                                item?.babysWeight ||
                                                                                item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.gestationPeriod && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                &nbsp;|&nbsp;Period of gestation&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.gestationPeriod}
                                                                            </Text>
                                                                            {(item?.location ||
                                                                                item?.modeOfManagement ||
                                                                                item?.typeOfAbortion ||
                                                                                item?.modeOfAbortion ||
                                                                                item?.dateOfDelivery ||
                                                                                item?.gender ||
                                                                                item?.babysWeight ||
                                                                                item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.location && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Location&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.location}
                                                                            </Text>
                                                                            {(item?.modeOfManagement || item?.typeOfAbortion || item?.modeOfAbortion || item?.dateOfDelivery || item?.gender || item?.babysWeight || item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.modeOfManagement && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Mode of management&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.modeOfManagement}
                                                                            </Text>
                                                                            {(item?.typeOfAbortion || item?.modeOfAbortion || item?.dateOfDelivery || item?.gender || item?.babysWeight || item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.typeOfAbortion && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Type of abortion&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.typeOfAbortion}
                                                                            </Text>
                                                                            {(item?.modeOfAbortion || item?.dateOfDelivery || item?.gender || item?.babysWeight || item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.modeOfAbortion && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Mode of abortion&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.modeOfAbortion}
                                                                            </Text>
                                                                        </>
                                                                    )}

                                                                    {item?.dateOfDelivery && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                &nbsp;{"\n"}
                                                                                &nbsp;&nbsp;&nbsp;&nbsp;Date of delivery&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {moment(item?.dateOfDelivery).format("DD MMM YYYY")}
                                                                            </Text>
                                                                            {(item?.gender || item?.babysWeight || item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.gender && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Gender&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.gender}
                                                                            </Text>
                                                                            {(item?.babysWeight || item?.remarks) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.babysWeight && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Baby's weight&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.babysWeight}
                                                                                {`kgs`}
                                                                            </Text>
                                                                            {item?.remarks && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.remarks && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Remarks&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.remarks}
                                                                            </Text>
                                                                        </>
                                                                    )}
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        )
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                        </>
                                                    )}
                                                </Text>

                                                <Text style={{ marginTop: PX_TO_PT * 6, lineHeight: 1.4 }}>
                                                    {obsHistoryData?.examinationHistory.length > 0 && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {obsInlineViewCounter++}.&nbsp;Examination
                                                            </Text>
                                                            {obsHistoryData?.examinationHistory.map((item, i) => (
                                                                <View key={i}>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        {("pallor" in item || "oedema" in item || item?.mothersBMI) && (
                                                                            <>
                                                                                {i > 0 ? (
                                                                                    <Text style={{ marginTop: 15 }}>
                                                                                        &nbsp;{`\n`}
                                                                                        &nbsp;&nbsp;&nbsp;&nbsp;(
                                                                                    </Text>
                                                                                ) : (
                                                                                    <Text>&nbsp;(</Text>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </Text>

                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Visit&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(i + 1).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {("pallor" in item || "oedema" in item || item?.mothersBMI) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}

                                                                    {"pallor" in item && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Pallor&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {Boolean(item?.pallor) ? `Yes` : `No`}
                                                                            </Text>
                                                                            {("oedema" in item || item?.mothersBMI) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {"oedema" in item && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Oedema&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {Boolean(item?.oedema) ? `Yes` : `No`}
                                                                            </Text>
                                                                            {item?.mothersBMI && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.mothersBMI && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Mother's BMI&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.mothersBMI}
                                                                                {`kg/m2`}
                                                                            </Text>
                                                                        </>
                                                                    )}

                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        )
                                                                    </Text>

                                                                    {(item?.diastolic || item?.systolic || item?.heightOfFundus || item?.presentation || item?.foetalHeartRate || item?.fluidIndex || item?.notes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 500,
                                                                            }}
                                                                        >
                                                                            ,&nbsp;(
                                                                        </Text>
                                                                    )}

                                                                    {(item?.diastolic || item?.systolic) && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                BP&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.diastolic}
                                                                                {item?.diastolic && item?.systolic ? `/` : ``}
                                                                                {item?.systolic}
                                                                                {` mmHg`}
                                                                            </Text>
                                                                        </>
                                                                    )}

                                                                    {item?.heightOfFundus && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                &nbsp;{"\n"}
                                                                                &nbsp;&nbsp;&nbsp;&nbsp;Fundus height&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.heightOfFundus}
                                                                                {item?.heightOfFundusUnit}
                                                                            </Text>
                                                                            {(item?.presentation || item?.foetalHeartRate || item?.fluidIndex || item?.notes) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.presentation && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Presentation&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.presentation}
                                                                            </Text>
                                                                            {(item?.foetalHeartRate || item?.fluidIndex || item?.notes) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.foetalHeartRate && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Fetal heart rate&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.foetalHeartRate}
                                                                                {` BPM`}
                                                                            </Text>
                                                                            {(item?.fluidIndex || item?.notes) && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.fluidIndex && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Fluid index&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.fluidIndex}
                                                                                {`cm`}
                                                                            </Text>
                                                                            {item?.notes && (
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;
                                                                                </Text>
                                                                            )}
                                                                        </>
                                                                    )}

                                                                    {item?.notes && (
                                                                        <>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                Note&nbsp;:&nbsp;
                                                                            </Text>
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                }}
                                                                            >
                                                                                {item?.notes}
                                                                            </Text>
                                                                        </>
                                                                    )}
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        )
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                        </>
                                                    )}
                                                </Text>
                                            </View>
                                        ) : option?.format === "listview" ? (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text
                                                    style={{
                                                        color: "#171725",
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Obstetric History&nbsp;:&nbsp;
                                                </Text>

                                                <Text style={{ marginTop: 5, lineHeight: 1.4 }}>
                                                    {(obsHistoryData?.lmp ||
                                                        obsHistoryData?.edd ||
                                                        obsHistoryData?.ceed ||
                                                        obsHistoryData?.gestationWeeks ||
                                                        obsHistoryData?.gestationDays ||
                                                        obsHistoryData?.blood ||
                                                        obsHistoryData?.husbandsBlood ||
                                                        obsHistoryData?.consang ||
                                                        obsHistoryData?.maritialStatus) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                &nbsp;{obsListViewCounter++}.&nbsp;Patient diagnosis&nbsp;
                                                            </Text>

                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                &nbsp;{"\n"}
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;Details&nbsp;(
                                                            </Text>
                                                            {obsHistoryData?.lmp && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        LMP&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {moment(obsHistoryData?.lmp).format("DD MMM YYYY")}
                                                                    </Text>

                                                                    {(obsHistoryData?.edd ||
                                                                        obsHistoryData?.ceed ||
                                                                        obsHistoryData?.gestationWeeks ||
                                                                        obsHistoryData?.gestationDays ||
                                                                        obsHistoryData?.blood ||
                                                                        obsHistoryData?.husbandsBlood ||
                                                                        obsHistoryData?.consang ||
                                                                        obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.edd && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        E.D.D.&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {moment(obsHistoryData?.edd).format("DD MMM YYYY")}
                                                                    </Text>
                                                                    {(obsHistoryData?.ceed ||
                                                                        obsHistoryData?.gestationWeeks ||
                                                                        obsHistoryData?.gestationDays ||
                                                                        obsHistoryData?.blood ||
                                                                        obsHistoryData?.husbandsBlood ||
                                                                        obsHistoryData?.consang ||
                                                                        obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.ceed && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        C.E.D.D.&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {moment(obsHistoryData?.ceed).format("DD MMM YYYY")}
                                                                    </Text>
                                                                    {(obsHistoryData?.gestationWeeks ||
                                                                        obsHistoryData?.gestationDays ||
                                                                        obsHistoryData?.blood ||
                                                                        obsHistoryData?.husbandsBlood ||
                                                                        obsHistoryData?.consang ||
                                                                        obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {(obsHistoryData?.gestationWeeks || obsHistoryData?.gestationDays) && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Gestation&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.gestationWeeks ? `${obsHistoryData?.gestationWeeks}W` : ""}
                                                                        {obsHistoryData?.gestationWeeks && obsHistoryData?.gestationDays ? `,` : ``}
                                                                        {obsHistoryData?.gestationDays ? `${obsHistoryData?.gestationDays}D` : ""}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            {obsHistoryData?.blood && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        &nbsp;{"\n"}
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blood group&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.blood}
                                                                    </Text>
                                                                    {(obsHistoryData?.husbandsBlood || obsHistoryData?.consang || obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.husbandsBlood && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Husband's blood group&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.husbandsBlood}
                                                                    </Text>
                                                                    {(obsHistoryData?.consang || obsHistoryData?.maritialStatus) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.consang && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Consanguineous&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {Boolean(obsHistoryData?.consang) ? `Yes` : `No`}
                                                                    </Text>
                                                                    {obsHistoryData?.maritialStatus && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.maritialStatus && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Marital status&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.maritialStatus}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                )
                                                            </Text>
                                                        </>
                                                    )}
                                                </Text>

                                                <Text style={{ marginTop: 5, lineHeight: 1.4 }}>
                                                    {(obsHistoryData?.gravidity || obsHistoryData?.parity || obsHistoryData?.livingChildren || obsHistoryData?.abortion || obsHistoryData?.ectopicPregnancies) && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                &nbsp;{obsListViewCounter++}.&nbsp;GPLAE&nbsp;:
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                &nbsp;{"\n"}
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;
                                                            </Text>

                                                            {obsHistoryData?.gravidity && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Gravida&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.gravidity).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {(obsHistoryData?.parity || obsHistoryData?.livingChildren || obsHistoryData?.abortion || obsHistoryData?.ectopicPregnancies) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.parity && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Para&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.parity).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {(obsHistoryData?.livingChildren || obsHistoryData?.abortion || obsHistoryData?.ectopicPregnancies) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.livingChildren && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Living&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.livingChildren).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {(obsHistoryData?.abortion || obsHistoryData?.ectopicPregnancies) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.abortion && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Abortion&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.abortion).toString().padStart(2, "0")}
                                                                    </Text>
                                                                    {obsHistoryData?.ectopicPregnancies && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {obsHistoryData?.ectopicPregnancies && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Ectopic&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {(obsHistoryData?.ectopicPregnancies).toString().padStart(2, "0")}
                                                                    </Text>
                                                                </>
                                                            )}
                                                            {obsHistoryData?.diagnosisNotes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {obsHistoryData?.diagnosisNotes}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                )
                                                            </Text>
                                                        </>
                                                    )}
                                                </Text>

                                                <Text style={{ marginTop: 5, lineHeight: 1.4 }}>
                                                    {obsHistoryData?.pregnancyHistory.length > 0 && (
                                                        <>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                &nbsp;{obsListViewCounter++}.&nbsp;Pregnancy history&nbsp;:
                                                            </Text>

                                                            {obsHistoryData?.pregnancyHistory.map((item, i) => {
                                                                return (
                                                                    <View key={i}>
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 500,
                                                                            }}
                                                                        >
                                                                            &nbsp;{"\n"}
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                            {String.fromCharCode(97 + i)}.&nbsp;
                                                                        </Text>
                                                                        {item?.gravidaNumber && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Gravida&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {(item?.gravidaNumber).toString().padStart(2, "0")}
                                                                                </Text>
                                                                            </>
                                                                        )}

                                                                        {(item?.outcome ||
                                                                            item?.termLength ||
                                                                            item?.deliveryMode ||
                                                                            item?.gestationPeriod ||
                                                                            item?.location ||
                                                                            item?.modeOfManagement ||
                                                                            item?.typeOfAbortion ||
                                                                            item?.modeOfAbortion ||
                                                                            item?.dateOfDelivery ||
                                                                            item?.gender ||
                                                                            item?.babysWeight ||
                                                                            item?.remarks) && (
                                                                            <Text
                                                                                style={{
                                                                                    color: "#171725",
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            >
                                                                                &nbsp;(
                                                                            </Text>
                                                                        )}

                                                                        {item?.outcome && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Outcome&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.outcome}
                                                                                </Text>
                                                                                {(item?.termLength ||
                                                                                    item?.deliveryMode ||
                                                                                    item?.gestationPeriod ||
                                                                                    item?.location ||
                                                                                    item?.modeOfManagement ||
                                                                                    item?.typeOfAbortion ||
                                                                                    item?.modeOfAbortion ||
                                                                                    item?.dateOfDelivery ||
                                                                                    item?.gender ||
                                                                                    item?.babysWeight ||
                                                                                    item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.termLength && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Term length&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.termLength}
                                                                                </Text>
                                                                                {(item?.deliveryMode ||
                                                                                    item?.gestationPeriod ||
                                                                                    item?.location ||
                                                                                    item?.modeOfManagement ||
                                                                                    item?.typeOfAbortion ||
                                                                                    item?.modeOfAbortion ||
                                                                                    item?.dateOfDelivery ||
                                                                                    item?.gender ||
                                                                                    obsHistoryData?.babysWeight ||
                                                                                    item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.deliveryMode && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Mode of delivery&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.deliveryMode}
                                                                                </Text>
                                                                                {(item?.gestationPeriod ||
                                                                                    item?.location ||
                                                                                    item?.modeOfManagement ||
                                                                                    item?.typeOfAbortion ||
                                                                                    item?.modeOfAbortion ||
                                                                                    item?.dateOfDelivery ||
                                                                                    item?.gender ||
                                                                                    item?.babysWeight ||
                                                                                    item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.gestationPeriod && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;|&nbsp;Period of gestation&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.gestationPeriod}
                                                                                </Text>
                                                                                {(item?.location ||
                                                                                    item?.modeOfManagement ||
                                                                                    item?.typeOfAbortion ||
                                                                                    item?.modeOfAbortion ||
                                                                                    item?.dateOfDelivery ||
                                                                                    item?.gender ||
                                                                                    item?.babysWeight ||
                                                                                    item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.location && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Location&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.location}
                                                                                </Text>
                                                                                {(item?.modeOfManagement ||
                                                                                    item?.typeOfAbortion ||
                                                                                    item?.modeOfAbortion ||
                                                                                    item?.dateOfDelivery ||
                                                                                    item?.gender ||
                                                                                    item?.babysWeight ||
                                                                                    item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.modeOfManagement && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Mode of management&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.modeOfManagement}
                                                                                </Text>
                                                                                {(item?.typeOfAbortion || item?.modeOfAbortion || item?.dateOfDelivery || item?.gender || item?.babysWeight || item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.typeOfAbortion && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Type of abortion&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.typeOfAbortion}
                                                                                </Text>
                                                                                {(item?.modeOfAbortion || item?.dateOfDelivery || item?.gender || item?.babysWeight || item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.modeOfAbortion && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Mode of abortion&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.modeOfAbortion}
                                                                                </Text>
                                                                            </>
                                                                        )}

                                                                        {item?.dateOfDelivery && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    &nbsp;{"\n"}
                                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date of delivery&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {moment(item?.dateOfDelivery).format("DD MMM YYYY")}
                                                                                </Text>
                                                                                {(item?.gender || item?.babysWeight || item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.gender && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Gender&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.gender}
                                                                                </Text>
                                                                                {(item?.babysWeight || item?.remarks) && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.babysWeight && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Baby's weight&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.babysWeight}
                                                                                    {`kgs`}
                                                                                </Text>
                                                                                {item?.remarks && (
                                                                                    <Text
                                                                                        style={{
                                                                                            color: "#171725",
                                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                            fontWeight: 400,
                                                                                        }}
                                                                                    >
                                                                                        &nbsp;|&nbsp;
                                                                                    </Text>
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        {item?.remarks && (
                                                                            <>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 500,
                                                                                    }}
                                                                                >
                                                                                    Remarks&nbsp;:&nbsp;
                                                                                </Text>
                                                                                <Text
                                                                                    style={{
                                                                                        color: "#171725",
                                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                        fontWeight: 400,
                                                                                    }}
                                                                                >
                                                                                    {item?.remarks}
                                                                                </Text>
                                                                            </>
                                                                        )}
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 500,
                                                                            }}
                                                                        >
                                                                            )
                                                                        </Text>
                                                                    </View>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </Text>

                                                <Text style={{ marginTop: 5, lineHeight: 1.4 }}>
                                                    <Text
                                                        style={{
                                                            color: "#171725",
                                                            fontFamily: printSettings?.page_format?.font_family,
                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        &nbsp;{obsListViewCounter++}.&nbsp;Examination&nbsp;:
                                                    </Text>

                                                    {obsHistoryData?.examinationHistory.map((item, i) => (
                                                        <View key={i}>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                &nbsp;{"\n"}
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </Text>

                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Visit&nbsp;
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                }}
                                                            >
                                                                {i + 1}
                                                            </Text>

                                                            {("pallor" in item || "oedema" in item || item?.mothersBMI) && (
                                                                <Text
                                                                    style={{
                                                                        color: "#171725",
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    &nbsp;(
                                                                </Text>
                                                            )}

                                                            {"pallor" in item && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Pallor&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {Boolean(item?.pallor) ? `Yes` : `No`}
                                                                    </Text>
                                                                    {("oedema" in item || item?.mothersBMI) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {"oedema" in item && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Oedema&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {Boolean(item?.oedema) ? `Yes` : `No`}
                                                                    </Text>
                                                                    {item?.mothersBMI && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {item?.mothersBMI && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Mother's BMI&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {item?.mothersBMI}
                                                                        {`kg/m2`}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                )
                                                            </Text>

                                                            {(item?.diastolic || item?.systolic || item?.heightOfFundus || item?.presentation || item?.foetalHeartRate || item?.fluidIndex || item?.notes) && (
                                                                <Text
                                                                    style={{
                                                                        color: "#171725",
                                                                        fontFamily: printSettings?.page_format?.font_family,
                                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    ,&nbsp;(
                                                                </Text>
                                                            )}

                                                            {(item?.diastolic || item?.systolic) && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        BP&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {item?.diastolic}
                                                                        {item?.diastolic && item?.systolic ? `/` : ``}
                                                                        {item?.systolic}
                                                                        {` mmHg`}
                                                                    </Text>
                                                                </>
                                                            )}

                                                            {item?.heightOfFundus && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        &nbsp;{"\n"}
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fundus height&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {item?.heightOfFundus}
                                                                        {item?.heightOfFundusUnit}
                                                                    </Text>
                                                                    {(item?.presentation || item?.foetalHeartRate || item?.fluidIndex || item?.notes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {item?.presentation && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Presentation&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {item?.presentation}
                                                                    </Text>
                                                                    {(item?.foetalHeartRate || item?.fluidIndex || item?.notes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {item?.foetalHeartRate && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Fetal heart rate&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {item?.foetalHeartRate}
                                                                        {` BPM`}
                                                                    </Text>
                                                                    {(item?.fluidIndex || item?.notes) && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {item?.fluidIndex && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Fluid index&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {item?.fluidIndex}
                                                                        {`cm`}
                                                                    </Text>
                                                                    {item?.notes && (
                                                                        <Text
                                                                            style={{
                                                                                color: "#171725",
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                            }}
                                                                        >
                                                                            &nbsp;|&nbsp;
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}

                                                            {item?.notes && (
                                                                <>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        Note&nbsp;:&nbsp;
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: "#171725",
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        {item?.notes}
                                                                    </Text>
                                                                </>
                                                            )}
                                                            <Text
                                                                style={{
                                                                    color: "#171725",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                )
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: PX_TO_PT * 15 }}>
                                                <Text
                                                    style={{
                                                        color: "#171725",
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Obstetric History&nbsp;:&nbsp;
                                                </Text>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                >
                                                    Patient diagnosis
                                                </Text>

                                                <View style={[styles.table, { marginTop: 0 }]}>
                                                    <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                                styles.minHeight38,
                                                            ]}
                                                        >
                                                            LMP
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                                styles.minHeight38,
                                                            ]}
                                                        >
                                                            E.D.D.
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                                styles.minHeight38,
                                                            ]}
                                                        >
                                                            C.E.E.D.
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                                styles.minHeight38,
                                                            ]}
                                                        >
                                                            Gestation
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                                styles.minHeight38,
                                                            ]}
                                                        >
                                                            Blood group
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                                styles.minHeight38,
                                                            ]}
                                                        >
                                                            Husband's blood group
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                                styles.minHeight38,
                                                            ]}
                                                        >
                                                            Consng
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                                styles.minHeight38,
                                                            ]}
                                                        >
                                                            Marital status
                                                        </Text>
                                                    </View>

                                                    <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.lmp ? moment(obsHistoryData?.lmp).format("DD MMM YYYY") : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.edd ? moment(obsHistoryData?.edd).format("DD MMM YYYY") : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.ceed ? moment(obsHistoryData?.ceed).format("DD MMM YYYY") : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.gestationWeeks ? `${obsHistoryData?.gestationWeeks}W` : ""}
                                                            {obsHistoryData?.gestationWeeks ? `,` : ``}
                                                            {obsHistoryData?.gestationDays ? `${obsHistoryData?.gestationDays}D` : ""}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.blood || `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.husbandsBlood || `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {Boolean(obsHistoryData?.consang) ? `Yes` : `No`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.maritialStatus || `-`}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                >
                                                    GPLAE
                                                </Text>
                                                <View style={[styles.table, { marginTop: 0 }]}>
                                                    <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Gravida
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Para
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Living
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Abortion
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            Ectopic
                                                        </Text>
                                                    </View>

                                                    <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.gravidity ? (obsHistoryData?.gravidity).toString().padStart(2, "0") : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.parity ? (obsHistoryData?.parity).toString().padStart(2, "0") : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.livingChildren ? (obsHistoryData?.livingChildren).toString().padStart(2, "0") : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.abortion ? (obsHistoryData?.abortion).toString().padStart(2, "0") : `-`}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.cell,
                                                                {
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 400,
                                                                    color: "#000",
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {obsHistoryData?.ectopicPregnancies ? (obsHistoryData?.ectopicPregnancies).toString().padStart(2, "0") : `-`}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            color: "#000",
                                                            fontFamily: printSettings?.page_format?.font_family,
                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                            fontWeight: 500,
                                                            padding: 6,
                                                            borderBottom: "1px solid #171725",
                                                            borderRight: "1px solid #171725",
                                                        }}
                                                    >
                                                        Remarks&nbsp;:&nbsp;{obsHistoryData?.diagnosisNotes || `-`}
                                                    </Text>
                                                </View>

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                >
                                                    Pregnancy history
                                                </Text>

                                                {obsHistoryData?.pregnancyHistory.map((item, i) => {
                                                    return (
                                                        <View key={i} wrap={false}>
                                                            <View style={[styles.table, { marginTop: 0 }]}>
                                                                <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                                                                    <Text
                                                                        style={[
                                                                            styles.cell,
                                                                            {
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 500,
                                                                                color: "#000",
                                                                                textAlign: "center",
                                                                            },
                                                                            styles.minHeight38,
                                                                        ]}
                                                                    >
                                                                        Gravida no
                                                                    </Text>
                                                                    <Text
                                                                        style={[
                                                                            styles.cell,
                                                                            {
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 500,
                                                                                color: "#000",
                                                                                textAlign: "center",
                                                                            },
                                                                            styles.minHeight38,
                                                                        ]}
                                                                    >
                                                                        Outcome
                                                                    </Text>
                                                                    <Text
                                                                        style={[
                                                                            styles.cell,
                                                                            {
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 500,
                                                                                color: "#000",
                                                                                textAlign: "center",
                                                                            },
                                                                            styles.minHeight38,
                                                                        ]}
                                                                    >
                                                                        Term length
                                                                    </Text>
                                                                    {item?.deliveryMode && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Mode of delivery
                                                                        </Text>
                                                                    )}

                                                                    {item?.gestationPeriod && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Period of gestation
                                                                        </Text>
                                                                    )}

                                                                    {item?.location && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Location
                                                                        </Text>
                                                                    )}

                                                                    {item?.modeOfManagement && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Mode of management
                                                                        </Text>
                                                                    )}

                                                                    {item?.typeOfAbortion && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Type of abortion
                                                                        </Text>
                                                                    )}

                                                                    {item?.modeOfAbortion && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Mode of abortion
                                                                        </Text>
                                                                    )}

                                                                    {item?.dateOfDelivery && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Delivery date
                                                                        </Text>
                                                                    )}

                                                                    {item?.gender && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Gender
                                                                        </Text>
                                                                    )}

                                                                    {item?.babysWeight && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 500,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                                styles.minHeight38,
                                                                            ]}
                                                                        >
                                                                            Baby's weight
                                                                        </Text>
                                                                    )}
                                                                </View>

                                                                <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                                                                    <Text
                                                                        style={[
                                                                            styles.cell,
                                                                            {
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                color: "#000",
                                                                                textAlign: "center",
                                                                            },
                                                                        ]}
                                                                    >
                                                                        {item?.gravidaNumber ? (item?.gravidaNumber).toString().padStart(2, "0") : `-`}
                                                                    </Text>
                                                                    <Text
                                                                        style={[
                                                                            styles.cell,
                                                                            {
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                color: "#000",
                                                                                textAlign: "center",
                                                                            },
                                                                        ]}
                                                                    >
                                                                        {item?.outcome || `-`}
                                                                    </Text>
                                                                    <Text
                                                                        style={[
                                                                            styles.cell,
                                                                            {
                                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                fontWeight: 400,
                                                                                color: "#000",
                                                                                textAlign: "center",
                                                                            },
                                                                        ]}
                                                                    >
                                                                        {item?.termLength || `-`}
                                                                    </Text>

                                                                    {item?.deliveryMode && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.deliveryMode || `-`}
                                                                        </Text>
                                                                    )}

                                                                    {item?.gestationPeriod && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.gestationPeriod || `-`}
                                                                        </Text>
                                                                    )}

                                                                    {item?.location && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.location || `-`}
                                                                        </Text>
                                                                    )}

                                                                    {item?.modeOfManagement && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.modeOfManagement || `-`}
                                                                        </Text>
                                                                    )}

                                                                    {item?.typeOfAbortion && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.typeOfAbortion || `-`}
                                                                        </Text>
                                                                    )}

                                                                    {item?.modeOfAbortion && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.modeOfAbortion || `-`}
                                                                        </Text>
                                                                    )}

                                                                    {item?.dateOfDelivery && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.dateOfDelivery ? moment(item?.dateOfDelivery).format("DD MMM YYYY") : `-`}
                                                                        </Text>
                                                                    )}

                                                                    {item?.gender && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.gender || `-`}
                                                                        </Text>
                                                                    )}

                                                                    {item?.babysWeight && (
                                                                        <Text
                                                                            style={[
                                                                                styles.cell,
                                                                                {
                                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                                    fontWeight: 400,
                                                                                    color: "#000",
                                                                                    textAlign: "center",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {item?.babysWeight || ``}
                                                                            {item?.babysWeight ? `kgs` : `-`}
                                                                        </Text>
                                                                    )}
                                                                </View>
                                                            </View>
                                                            <Text
                                                                style={{
                                                                    color: "#000",
                                                                    fontFamily: printSettings?.page_format?.font_family,
                                                                    fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                    fontWeight: 500,
                                                                    padding: 6,
                                                                    borderBottom: "1px solid #171725",
                                                                    borderLeft: "1px solid #171725",
                                                                    borderRight: "1px solid #171725",
                                                                }}
                                                            >
                                                                Remarks&nbsp;:&nbsp;{item?.remarks || `-`}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}

                                                <Text
                                                    style={{
                                                        color: "#000",
                                                        marginTop: PX_TO_PT * 12,
                                                        fontFamily: printSettings?.page_format?.font_family,
                                                        fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                        fontWeight: 500,
                                                        padding: 6,
                                                        borderTop: "1px solid #171725",
                                                        borderLeft: "1px solid #171725",
                                                        borderRight: "1px solid #171725",
                                                        backgroundColor: "#E2E2EA",
                                                    }}
                                                    wrap={false}
                                                >
                                                    Examination
                                                </Text>

                                                {obsHistoryData?.examinationHistory.map((item, i) => (
                                                    <View key={i}>
                                                        <View style={[styles.table, { marginTop: 0 }]}>
                                                            <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    Rx
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    Pallor
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    Oedema
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    BMI
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    BP
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    Fundus
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    Presentation
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    Fluid
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 500,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    FHR
                                                                </Text>
                                                            </View>

                                                            <View style={[styles.row, { alignItems: "center", justifyContent: "center" }]}>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {i + 1}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {Boolean(item?.pallor) ? `Yes` : `No`}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {Boolean(item?.oedema) ? `Yes` : `No`}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {item?.mothersBMI || ``}
                                                                    {item?.mothersBMI ? `kg/m2` : `-`}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {item?.diastolic || ``}
                                                                    {item?.diastolic ? `/` : `-`}
                                                                    {item?.systolic || ``}
                                                                    {item?.diastolic ? ` mmHg` : ``}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {item?.heightOfFundus || ``}
                                                                    {item?.heightOfFundusUnit || `-`}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {item?.presentation || `-`}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {item?.fluidIndex || ``}
                                                                    {item?.fluidIndex ? ` cm` : `-`}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.cell,
                                                                        {
                                                                            fontFamily: printSettings?.page_format?.font_family,
                                                                            fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                            fontWeight: 400,
                                                                            color: "#000",
                                                                            textAlign: "center",
                                                                        },
                                                                        styles.minHeight38,
                                                                    ]}
                                                                >
                                                                    {item?.foetalHeartRate || ``}
                                                                    {item?.foetalHeartRate ? ` BPM` : `-`}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <Text
                                                            style={{
                                                                color: "#000",
                                                                fontFamily: printSettings?.page_format?.font_family,
                                                                fontSize: PX_TO_PT * printSettings?.page_format?.font_size,
                                                                fontWeight: 500,
                                                                padding: 6,
                                                                borderBottom: "1px solid #171725",
                                                                borderLeft: "1px solid #171725",
                                                                borderRight: "1px solid #171725",
                                                            }}
                                                        >
                                                            Remarks&nbsp;:&nbsp;{item?.notes || `-`}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                </>
                            )
                        )
                    })}

                </View>

                <View style={{ marginTop: PX_TO_PT * 29 }} wrap={false}>
                    {printSettings?.signature_enable === 'Y' && fileSignature && fileSignature?.imageShow && (
                        <View style={{ alignSelf: printSettings?.header_footer?.other_settings?.signature_place === 'R' && 'flex-end' }}>
                            {fileSignature?.showFile && (
                                <Image
                                    style={{ width: 139, height: 60, objectFit: 'contain' }}
                                    src={fileSignature?.showFile} />
                            )}
                        </View>
                    )}

                    {printSettings?.qrcode_enable === 'Y' && printSettings?.signature_enable === 'Y' ? (
                        printSettings?.header_footer?.other_settings?.signature_place === 'R' ? (
                            <View style={styles.directionCasemanager}>
                                <View style={[styles.directionCasemanager, { flex: 1 }]} >
                                    {printSettings?.qrcode && (
                                        <>
                                            <Image
                                                style={{ width: 61, height: 61, objectFit: 'contain' }}
                                                src={printSettings?.qrcode} />
                                            <Text style={{ fontSize: PX_TO_PT * 10, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                                            </Text>
                                        </>
                                    )}
                                </View>
                                <View style={{ flex: 1, textAlign: 'right' }} >
                                    {printSettings?.header_footer?.other_settings?.name_of_doctor_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 700, color: '#000' }]}>
                                            {caseManagerData?.doctor_data?.doctor_name}
                                        </Text>
                                    )}
                                    {printSettings?.header_footer?.other_settings?.registration_no_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 400, color: '#000' }]}>
                                            Medical Registration No.: {caseManagerData?.doctor_data?.gmc_no}
                                        </Text>
                                    )}
                                    {printSettings?.header_footer?.other_settings?.qualification_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 400, color: '#000' }]}>
                                            {printSettings?.header_footer?.other_settings?.qualification ? printSettings?.header_footer?.other_settings?.qualification : caseManagerData?.doctor_data?.um_qualifications}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1 }} >
                                    {printSettings?.header_footer?.other_settings?.name_of_doctor_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 700, color: '#000' }]}>
                                            {caseManagerData?.doctor_data?.doctor_name}
                                        </Text>
                                    )}
                                    {printSettings?.header_footer?.other_settings?.registration_no_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 400, color: '#000' }]}>
                                            Medical Registration No.: {caseManagerData?.doctor_data?.gmc_no}
                                        </Text>
                                    )}
                                    {printSettings?.header_footer?.other_settings?.qualification_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 400, color: '#000' }]}>
                                            {printSettings?.header_footer?.other_settings?.qualification ? printSettings?.header_footer?.other_settings?.qualification : caseManagerData?.doctor_data?.um_qualifications}
                                        </Text>
                                    )}
                                </View>
                                <View style={[styles.directionCasemanager, { flex: 1, justifyContent: 'flex-end' }]}>
                                    {printSettings?.qrcode && (
                                        <>
                                            <Image
                                                style={{ width: 61, height: 61, objectFit: 'contain' }}
                                                src={printSettings?.qrcode} />
                                            <Text style={{ fontSize: PX_TO_PT * 10, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </View>
                        )
                    ) : (printSettings?.qrcode_enable === 'Y' || printSettings?.signature_enable === 'Y') && (
                        <View style={{ flexDirection: 'row' }}>
                            {printSettings?.qrcode_enable === 'Y' && (
                                <View style={styles.directionCasemanager}>
                                    {printSettings?.qrcode && (
                                        <>
                                            <Image
                                                style={{ width: 61, height: 61, objectFit: 'contain' }}
                                                src={printSettings?.qrcode} />
                                            <Text style={{ fontSize: PX_TO_PT * 10, color: '#000', fontFamily: 'Roboto', fontWeight: 400 }}>
                                                {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            )}
                            {printSettings?.signature_enable === 'Y' && (
                                <View style={{ flex: 1, textAlign: printSettings?.header_footer?.other_settings?.signature_place === 'R' && 'right' }} >
                                    {printSettings?.header_footer?.other_settings?.name_of_doctor_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 700, color: '#000' }]}>
                                            {caseManagerData?.doctor_data?.doctor_name}
                                        </Text>
                                    )}
                                    {printSettings?.header_footer?.other_settings?.registration_no_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 400, color: '#000' }]}>
                                            Medical Registration No.: {caseManagerData?.doctor_data?.gmc_no}
                                        </Text>
                                    )}
                                    {printSettings?.header_footer?.other_settings?.qualification_enable === 'Y' && (
                                        <Text style={[styles.extraText, { fontWeight: 400, color: '#000' }]}>
                                            {printSettings?.header_footer?.other_settings?.qualification ? printSettings?.header_footer?.other_settings?.qualification : caseManagerData?.doctor_data?.um_qualifications}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* </View> */}

                <View style={{
                    position: 'absolute',
                    bottom: PX_TO_PT * 30,
                    left: PX_TO_PT * 30,
                    right: PX_TO_PT * 30,
                    // marginTop: PX_TO_PT * (mode == NORMAL ? printSettings?.letterhead_format != 2 ? 29 : 0 : 29)
                }} fixed>
                    {mode == NORMAL ? (
                        printSettings?.letterhead_format === 0 ? (
                            <View>
                                <View style={{ backgroundColor: '#171725', height: PX_TO_PT * 2, width: '100%' }} />
                                <Text style={{ marginTop: PX_TO_PT * 8, color: '#171725', fontFamily: 'Roboto', fontSize: PX_TO_PT * printSettings?.header_footer?.footer?.font_size, fontWeight: 400, maxLines: 1 }}>{printSettings?.header_footer?.footer?.title}</Text>
                            </View>
                        ) : printSettings?.letterhead_format === 1 && (
                            fileFooter && fileFooter?.imageShow && (
                                <Image
                                    style={{ width: '100%', height: 80, objectFit: 'fill' }}
                                    src={fileFooter?.showFile} />
                            )
                        )
                    ) : (
                        printSettings?.whatsapp_letterhead_format === 0 ? (
                            <View>
                                <View style={{ backgroundColor: '#171725', height: PX_TO_PT * 2, width: '100%' }} />
                                <Text style={{ marginTop: PX_TO_PT * 8, color: '#171725', fontFamily: 'Roboto', fontSize: PX_TO_PT * printSettings?.header_footer?.footer?.font_size, fontWeight: 400, maxLines: 1 }}>{printSettings?.header_footer?.footer?.title}</Text>
                            </View>
                        ) : printSettings?.whatsapp_letterhead_format === 1 && (
                            fileFooter && fileFooter?.imageShow && (
                                <Image
                                    style={{ width: '100%', height: 80, objectFit: 'fill' }}
                                    src={fileFooter?.showFile} />
                            )
                        )
                    )}
                </View>

                {/* </View> */}
            </Page>
        </Document>
    )
}

export default React.memo(ViewPDF)