import { db } from "../../../../firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { browserName } from "react-device-detect";

/**
 * Print document (generic function for all document types)
 * @param {Blob} printBlob - PDF blob to print
 * @param {string} patientId - Patient ID
 * @param {string} documentType - Type of document (dischargeSummary, assessment, progressNotes, etc.)
 */
export const printDocument = (
  printBlob,
  patientId,
  documentType = "dischargeSummary"
) => {
  if (!printBlob) {
    console.error("No print blob available");
    return;
  }

  if (browserName === "Chrome WebView" || browserName === "WebKit") {
    // For Android WebView
    handleWebViewPrint(printBlob, patientId, documentType);
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
      const iw = iframe.contentWindow;
      if (!iw) return;

      const cleanup = () => {
        try {
          if (iframe.parentNode) document.body.removeChild(iframe);
        } catch (_) {}
        try {
          URL.revokeObjectURL(url);
        } catch (_) {}
      };

      try {
        iw.focus();

        // Prefer afterprint event to know when printing is done
        const handleAfterPrint = () => {
          iw.removeEventListener("afterprint", handleAfterPrint);
          cleanup();
        };
        iw.addEventListener("afterprint", handleAfterPrint);

        // Fallback for browsers using matchMedia('print')
        if (typeof iw.matchMedia === "function") {
          const mql = iw.matchMedia("print");
          const onChange = (e) => {
            if (!e.matches) {
              mql.removeEventListener("change", onChange);
              cleanup();
            }
          };
          try {
            mql.addEventListener("change", onChange);
          } catch (_) {
            // Older browsers: ignore
          }
        }

        iw.print();

        // Safety fallback cleanup in case events do not fire
        setTimeout(cleanup, 20000);
      } catch (e) {
        // As a last resort, attempt print and cleanup later
        try { iw.print(); } catch (_) {}
        setTimeout(cleanup, 20000);
      }
    };

    document.body.appendChild(iframe);
  }
};

/**
 * Print discharge summary (backward compatibility)
 * @param {Blob} printBlob - PDF blob to print
 * @param {string} patientId - Patient ID
 */
export const printDischargeSummary = (printBlob, patientId) => {
  return printDocument(printBlob, patientId, "dischargeSummary");
};

/**
 * Handle print for WebView
 * @param {Blob} blob - PDF blob
 * @param {string} patientId - Patient ID
 * @param {string} documentType - Type of document
 */
const handleWebViewPrint = async (
  blob,
  patientId,
  documentType = "dischargeSummary"
) => {
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

      const docRef = doc(db, documentType, deviceUid);
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
 * Download document (generic function for all document types)
 * @param {string} pdfUrl - PDF URL
 * @param {Blob} printBlob - PDF blob
 * @param {Object} patientData - Patient data
 * @param {string} documentType - Type of document (dischargeSummary, assessment, progressNotes, etc.)
 */
export const downloadDocument = (
  pdfUrl,
  printBlob,
  patientData,
  documentType = "dischargeSummary"
) => {
  if (!pdfUrl && !printBlob) {
    console.error("No PDF available for download");
    return;
  }

  const patientName = patientData?.details?.name || "patient";
  const fileName = `${getDocumentTypeTitle(documentType)}-${patientName.replace(
    /\s+/g,
    "-"
  )}.pdf`;

  if (browserName === "Chrome WebView" || browserName === "WebKit") {
    // For Android WebView
    handleWebViewDownload(printBlob, patientData, documentType);
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
 * Download discharge summary (backward compatibility)
 * @param {string} pdfUrl - PDF URL
 * @param {Blob} printBlob - PDF blob
 * @param {Object} patientData - Patient data
 */
export const handleDownloadDischargeSummary = (
  pdfUrl,
  printBlob,
  patientData
) => {
  return downloadDocument(pdfUrl, printBlob, patientData, "dischargeSummary");
};

/**
 * Handle download for WebView
 * @param {Blob} blob - PDF blob
 * @param {Object} patientData - Patient data
 * @param {string} documentType - Type of document
 */
const handleWebViewDownload = async (
  blob,
  patientData,
  documentType = "dischargeSummary"
) => {
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

      const docRef = doc(db, `${documentType}Download`, deviceUid);
      await setDoc(docRef, {
        base64string,
        patientId: patientData?.details?.id,
        patientName: patientData?.details?.name,
        fileName: `${getDocumentTypeTitle(documentType)}-${
          patientData?.details?.name || "patient"
        }.pdf`,
      });
    };
  } catch (error) {
    console.error("Error in WebView download:", error);
  }
};

/**
 * Get document type title for file naming
 * @param {string} documentType - Type of document
 * @returns {string} Formatted document title
 */
const getDocumentTypeTitle = (documentType) => {
  const titleMapping = {
    dischargeSummary: "Discharge-Summary",
    assessment: "Assessment-Form",
    progressNotes: "Progress-Notes",
    consultantNotes: "Consultant-Notes",
    otNotes: "Operation-Notes",
    crossReferral: "Cross-Referral",
  };

  return titleMapping[documentType] || "Document";
};
