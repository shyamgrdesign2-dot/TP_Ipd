import React, { useState, useEffect, useContext } from 'react';
import { PDFViewer, BlobProvider, pdf } from '@react-pdf/renderer';
import { PDFReader,MobilePDFReader } from 'reactjs-pdf-reader';
import { isMobile } from "react-device-detect";

import PrintSettingsContext from '../context/PrintSettingsContext';
import moment from "moment";
import { useSelector } from "react-redux";

import { NORMAL } from "../utils/constants";
import ViewPDF from '../components/print_settings/ViewPDF';
import { renderPDF } from '../components/print_settings/renderPDF';
import { PDF } from '../components/print_settings/PDF';

const showDateFormat = 'DD MMM, YY'

function Quixote({ mode = NORMAL, ...props }) {

    const { configurePrintData, printSettings, fileHeader, fileFooter, fileLogo, fileWatermark, fileSignature } = useContext(PrintSettingsContext);
    const caseManagerData = configurePrintData ? configurePrintData?.caseManagerData : null

    const { frequencyList, timingList } = useSelector((state) => state.doctors);

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
    const uniqueDates = caseManagerData && caseManagerData.vitals.length > 0 ? [...caseManagerData.vitals.map((item) => item.date)] : [];

    // Initialize columns for each unique date
    const dateColumns = uniqueDates.map((date, index) => ({
        title: moment(date).format(showDateFormat)
    }));

    const columns = [...initialColumns, ...dateColumns];

    caseManagerData && caseManagerData.vitals.length > 0 && caseManagerData.vitals.map((item, index) => {
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

    const [pdfUrl, setPdfUrl] = useState(null)

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
            const blob = await pdf(<PDF
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
            />).toBlob();
            setPdfUrl(URL.createObjectURL(blob))
        }
        caseManagerData && isMobile && makePDFUrl()
    }, [mode, printSettings, fileHeader, fileFooter, fileSignature, fileWatermark, fileLogo]);

    return (
        <>
            {isMobile ? (
                // <BlobProvider document={<PDF
                //     mode={mode}
                //     caseManagerData={caseManagerData}
                //     columns={columns}
                //     initialRows={initialRows}
                //     frequencyList={frequencyList}
                //     timingList={timingList}
                //     printSettings={mode == NORMAL ? printSettings : props.printSettingsCopy}
                //     fileHeader={mode == NORMAL ? fileHeader : props.fileHeaderCopy}
                //     fileFooter={mode == NORMAL ? fileFooter : props.fileFooterCopy}
                //     fileLogo={mode == NORMAL ? fileLogo : props.fileLogoCopy}
                //     fileWatermark={fileWatermark}
                //     fileSignature={fileSignature}
                // />}>
                //     {({ blob, url1, loading, error }) => {
                //         // Do whatever you need with blob here
                //         // console.log(blob)
                //         console.log(loading, URL.createObjectURL(blob))
                //         return <MobilePDFReader key={Math.random()} url={`${url1}#toolbar=0&navpanes=0&scrollbar=0`} isShowHeader={false} isShowFooter={false} />
                //     }}
                // </BlobProvider>
                pdfUrl && (<MobilePDFReader key={Math.random()} url={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} isShowHeader={false} isShowFooter={false} />)
            ) : (
                <PDFViewer
                    showToolbar={false}
                    style={{
                        width: '100%',
                        height: 800
                    }}>
                    <ViewPDF
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
                    />
                </PDFViewer >
            )}
        </>
    )
};

export default React.memo(Quixote);