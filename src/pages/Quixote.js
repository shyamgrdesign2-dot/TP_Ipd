import React, { useState, useEffect, useContext } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Spin } from "antd";

import PrintSettingsContext from '../context/PrintSettingsContext';
import moment from "moment";
import { useSelector } from "react-redux";

import { NORMAL } from "../utils/constants";
import ViewPDF from '../components/print_settings/ViewPDF';
import { renderPDF } from '../components/print_settings/renderPDF';
import { PDF } from '../components/print_settings/PDF';
import { pdfjs, Document, Page } from "react-pdf";
import { getGivenVaccineDetails } from './vaccination/service';
const worker = require('pdfjs-dist/build/pdf.worker.min.js')
pdfjs.GlobalWorkerOptions.workerSrc = worker

const showDateFormat = 'DD MMM, YY'

function Quixote({ mode = NORMAL, ...props }) {

    const { divWidth, caseManagerData, printSettings, fileHeader, fileFooter, fileLogo, fileWatermark, fileSignature } = useContext(PrintSettingsContext);

    const { frequencyList, timingList } = useSelector((state) => state.doctors);

    const initialRows = [
        {
            key: '1',
            name: `Temp (F)`,
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
            name: `Blood Pressure (mmHg)`,
        },
        // {
        //     key: '4',
        //     name: `Systolic (mmHg)`,
        // },
        // {
        //     key: '5',
        //     name: `Diastolic (mmHg)`,
        // },
        {
            key: '5',
            name: `SPO2 (%)`,
        },
        {
            key: '6',
            name: `Height (cms)`,
        },
        {
            key: '7',
            name: `Weight (kgs)`,
        },
        {
            key: '8',
            name: `BMI (kg/m²)`,
        },
        {
            key: '9',
            name: `BMR (kcals)`,
        },
        {
            key: '10',
            name: `BSA (m²)`,
        }
    ];

    const initialColumns = [
        {
            title: 'Name'
        },
    ];

    // Extract unique dates from the JSON array
    const uniqueDates = caseManagerData && caseManagerData.vitals.length > 0 ? [...caseManagerData.vitals.slice(0, 2).map((item) => item.date)] : [];

    // Initialize columns for each unique date
    const dateColumns = uniqueDates.map((date, index) => ({
        title: moment(date).format(showDateFormat)
    }));

    const columns = [...initialColumns, ...dateColumns];

    caseManagerData && caseManagerData.vitals.length > 0 && caseManagerData.vitals.slice(0, 2).map((item, index) => {
        initialRows[0][index] = item.temp ? item.temp : '-'
        initialRows[1][index] = item.pres ? item.pres : '-'
        initialRows[2][index] = item.resp_rate ? item.resp_rate : '-'
        initialRows[3][index] = item.blood_press ? item.blood_press.endsWith("/") ? item.blood_press.substring(0, item.blood_press.length - 1) : item.blood_press : '-'
        // initialRows[3][index] = item.blood_press ? item.blood_press.split('/')[0] ? item.blood_press.split('/')[0] : '-' : '-'
        // initialRows[4][index] = item.blood_press ? item.blood_press.split('/')[1] ? item.blood_press.split('/')[1] : '-' : '-'
        initialRows[4][index] = item.spo2 ? item.spo2 : '-'
        initialRows[5][index] = item.height ? item.height : '-'
        initialRows[6][index] = item.weight ? item.weight : '-'
        initialRows[7][index] = item.bmi ? parseFloat(item.bmi).toFixed(2) : '-'
        initialRows[8][index] = item.bmr ? parseFloat(item.bmr).toFixed(2) : '-'
        initialRows[9][index] = item.bsa ? parseFloat(item.bsa).toFixed(2) : '-'
    });

    const [pdfUrl, setPdfUrl] = useState(null)
    const [numPages, setNumPages] = useState();
    const [loadSuccess, setLoadSuccesss] = useState(false);

    const [givenVaccines, setGivenVaccines] = useState();

    useEffect(() => {
        getGivenVaccines();
    }, []);

    const getGivenVaccines = async() => {
        const vaccines = await getGivenVaccineDetails(caseManagerData?.patient_data?.patient_unique_id, caseManagerData?.patient_data?.patient_id)
        setGivenVaccines(vaccines);
    }

    useEffect(() => {
        // const makePDFUrl = async () => {
        //     var make_data = {
        //         mode: mode,
        //         caseManagerData: caseManagerData,
        //         columns: columns,
        //         initialRows: initialRows,
        //         frequencyList: frequencyList,
        //         timingList: timingList,
        //         printSettings: mode == NORMAL ? printSettings : props.printSettingsCopy,
        //         fileHeader: mode == NORMAL ? fileHeader : props.fileHeaderCopy,
        //         fileFooter: mode == NORMAL ? fileFooter : props.fileFooterCopy,
        //         fileLogo: mode == NORMAL ? fileLogo : props.fileLogoCopy,
        //         fileWatermark: fileWatermark,
        //         fileSignature: fileSignature,
        //     }
        //     const blob = await renderPDF({ ...make_data });
        //     setPdfUrl(URL.createObjectURL(blob))
        // }
        const makePDFUrl = async () => {
            const blob = await pdf(<ViewPDF
                mode={mode}
                caseManagerData={caseManagerData}
                columns={columns}
                initialRows={initialRows}
                frequencyList={frequencyList}
                timingList={timingList}
                printSettings={mode == NORMAL ? printSettings : props.printSettingsCopy}
                fileHeader={mode == NORMAL ? fileHeader : props.fileHeaderCopy}
                fileFooter={mode == NORMAL ? fileFooter : props.fileFooterCopy}
                fileLogo={mode == NORMAL ? fileLogo : props.fileLogoCopy}
                fileWatermark={fileWatermark}
                fileSignature={fileSignature}
                givenVaccines={givenVaccines}
            />).toBlob();
            setPdfUrl(URL.createObjectURL(blob))
        }
        caseManagerData && makePDFUrl()
        return () => {
            setLoadSuccesss(false)
        };
    }, [
        mode,
        props.printSettingsCopy,
        props.fileHeaderCopy,
        props.fileFooterCopy,
        props.fileLogoCopy,
        printSettings,
        fileHeader,
        fileFooter,
        fileSignature,
        fileWatermark,
        fileLogo,
        givenVaccines
    ]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
        setLoadSuccesss(true)
    }

    return (
        <>
            {pdfUrl && (
                <Document
                    loading={<Spin style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%", height: '100%' }} />}
                    error={<div style={{ position: 'absolute', zIndex: 0, left: "42%", top: "50%" }} >{'Failed to load PDF file.'}</div>}
                    noData={<div style={{ position: 'absolute', zIndex: 0, left: "50%", top: "50%" }} >{'No PDF file specified.'}</div>}
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.apply(null, Array(numPages))
                        .map((x, i) => i + 1)
                        .map((page) => {
                            return (
                                <Page
                                    key={Math.random()}
                                    className={loadSuccess ? 'react-pdf__Page_afterload' : null}
                                    loading={null}
                                    width={divWidth}
                                    pageNumber={page}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            );
                        })}
                </Document>
            )}
        </>
    )
};

export default React.memo(Quixote);