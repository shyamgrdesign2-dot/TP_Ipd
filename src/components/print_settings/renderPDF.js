import { createElement } from 'react';
import { pdf } from '@react-pdf/renderer';
import { PDF } from './PDF'

export const renderPDF = async (props) => {
    return pdf(createElement(PDF, props)).toBlob();
};