import { Spin } from 'antd';
import React, { useEffect } from 'react';

import { useDispatch } from "react-redux";
import { updatePatientCertificateList } from "../redux/doctorsSlice";

import { pdfjs } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
const worker = require('pdfjs-dist/build/pdf.worker.min.js')
pdfjs.GlobalWorkerOptions.workerSrc = worker

const PdfThumbnail = ({ pdfUrl, index, thumbnailUrl }) => {

    const dispatch = useDispatch();

    const loadPdf = (url) => {
        return new Promise(async resolve => {
            try {
                const loadingTask = pdfjs.getDocument(url);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1 });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                await page.render(renderContext).promise;
                const thumbnailUrl = canvas.toDataURL('image/png');
                resolve(thumbnailUrl)
            } catch (e) {
                resolve('');
            }
        });
    }

    useEffect(() => {
        const updateList = async () => {
            const makeThumbnailUrl = await loadPdf(pdfUrl)
            dispatch(updatePatientCertificateList({ index: index, thumbnailUrl: makeThumbnailUrl }));
        };
        thumbnailUrl === undefined && updateList();
    }, []);

    return (
        <div>
            {thumbnailUrl !== undefined ? <img src={thumbnailUrl} height={150} alt="PDF Thumbnail" /> : <Spin />}
        </div>
    );
};

export default React.memo(PdfThumbnail);