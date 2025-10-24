import { db } from "../../../../firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import html2pdf from "html2pdf.js";
import { browserName } from "react-device-detect";

/**
 * Print progress notes
 * @param {Blob} printBlob - PDF blob to print
 * @param {string} patientId - Patient ID
 */
export const printProgressNotes = (printBlob, patientId) => {
  if (!printBlob) {
    console.error("No print blob available");
    return;
  }

  if (browserName === "Chrome WebView" || browserName === "WebKit") {
    // For Android WebView
    handleWebViewPrint(printBlob, patientId);
  } else {
    // For regular browsers
    const url = URL.createObjectURL(printBlob);

    // Create hidden iframe to load the content
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    iframe.src = url;

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 1000);
    };

    document.body.appendChild(iframe);
  }
};

/**
 * Handle print for WebView
 * @param {Blob} blob - PDF blob
 * @param {string} patientId - Patient ID
 */
const handleWebViewPrint = async (blob, patientId) => {
  const deviceUid = localStorage.getItem("app_device_unique_id");
  if (!deviceUid) {
    console.error("Device UID not found");
    return;
  }

  try {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64string = reader.result.split(",")[1];

      const docRef = doc(db, "progressNotes", deviceUid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          base64string,
          patientId,
        });
      } else {
        await setDoc(docRef, {
          base64string,
          patientId,
          clicked: "yes",
        });
      }
    };
  } catch (error) {
    console.error("Error in WebView print:", error);
  }
};

/**
 * Download progress notes
 * @param {string} pdfUrl - PDF URL
 * @param {Blob} printBlob - PDF blob
 * @param {Object} patientData - Patient data
 */
export const handleDownloadProgressNotes = (
  pdfUrl,
  printBlob,
  patientData
) => {
  if (!pdfUrl && !printBlob) {
    console.error("No PDF available for download");
    return;
  }

  const patientName = patientData?.patientName || patientData?.name || "patient";
  const fileName = `Progress-Notes-${patientName.replace(/\s+/g, "-")}.pdf`;

  if (browserName === "Chrome WebView" || browserName === "WebKit") {
    // For Android WebView
    handleWebViewDownload(printBlob, patientData);
  } else {
    // For regular browsers
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Handle download for WebView
 * @param {Blob} blob - PDF blob
 * @param {Object} patientData - Patient data
 */
const handleWebViewDownload = async (blob, patientData) => {
  const deviceUid = localStorage.getItem("app_device_unique_id");
  if (!deviceUid) {
    console.error("Device UID not found");
    return;
  }

  try {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64string = reader.result.split(",")[1];

      const docRef = doc(db, "progressNotesDownload", deviceUid);
      await setDoc(docRef, {
        base64string,
        patientId: patientData?.patientId,
        patientName: patientData?.patientName || patientData?.name,
        fileName: `Progress-Notes-${
          patientData?.patientName || patientData?.name || "patient"
        }.pdf`,
      });
    };
  } catch (error) {
    console.error("Error in WebView download:", error);
  }
};

/**
 * Generate PDF from HTML element (fallback)
 * @param {HTMLElement} element - HTML element to convert
 * @param {Function} setLoader - Loading state setter
 */
export const generatePDFFromHTML = (element, setLoader) => {
  if (!element) {
    console.error("Element not found");
    return;
  }

  const options = {
    filename: "progress-notes.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  if (setLoader) setLoader(true);

  html2pdf()
    .from(element)
    .set(options)
    .save()
    .then(() => {
      if (setLoader) setLoader(false);
    })
    .catch((err) => {
      console.error("Error generating PDF", err);
      if (setLoader) setLoader(false);
    });
};
