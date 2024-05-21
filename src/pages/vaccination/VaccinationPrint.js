import { useContext, useEffect, useState } from "react";
import VaccinationChart from "./components/vaccinationChart/vaccinationChart";
import CashManagerContext from "../../context/CashManagerContext";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import Preview from "./components/preview/Preview";

const VaccinationPrint = () => {
  const { state } = useLocation();
  const { printType, previewData, patientData } = state;
  console.log("printType, previewData, patientData", previewData, patientData);
  const iframeRef = useRef();

  const [urlData, setUrlData] = useState();

  const handleGeneratePdf = () => {
    const element = document.getElementById("content");

    html2pdf(element, {
      margin: 50,
      filename: "my-document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
      .output("datauristring")
      .then((pdfDataUri) => {
        console.log("pdfDataUri", pdfDataUri);
        // iframeRef.current.src = pdfDataUri;
        setUrlData(pdfDataUri);
      });
  };

  useEffect(() => {
    handleGeneratePdf();
  }, []);

  return (
    <>
      <div style={{ display: "none" }} id="content">
        <VaccinationChart
          vaccinesData={previewData}
          patientDetails={patientData}
        />
      </div>
      {urlData && (
        <iframe
          src={urlData}
          title="PDF Viewer"
          width="100%"
          height="600"
          frameBorder="0"
        ></iframe>
      )}
    </>
  );
};

export default VaccinationPrint;
