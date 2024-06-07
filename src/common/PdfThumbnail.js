import { Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { pdfjs } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
const worker = require('pdfjs-dist/build/pdf.worker.min.js')
pdfjs.GlobalWorkerOptions.workerSrc = worker


const PdfThumbnail = ({ pdfUrl }) => {
    const canvasRef = useRef(null);
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    useEffect(() => {
        const loadPdf = async () => {
            try {
                const loadingTask = pdfjs.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);

                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = canvasRef.current;
                const context = canvas?.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext).promise;

                const thumbnailUrl = canvas.toDataURL();
                setThumbnailUrl(thumbnailUrl);
            } catch (e) {
                console.error(e);
            }
        };

        loadPdf();
    }, [pdfUrl]);

    return (
        <div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {thumbnailUrl ? <img src={thumbnailUrl} height={150} alt="PDF Thumbnail" /> : <Spin />}
        </div>
    );
};

export default React.memo(PdfThumbnail);