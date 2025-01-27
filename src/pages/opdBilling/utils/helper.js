import { saveAs } from "file-saver";

export const handleDownload = async (pdfUrl) => {
  try {
    saveAs(pdfUrl, `${Date.now()}.pdf`);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export const printContent = async (printBlob) => {
  var blobURL = URL.createObjectURL(printBlob);
  // Remove all existing iframes
  document.querySelectorAll("iframe").forEach(function (iframe) {
    iframe.parentNode.removeChild(iframe);
  });
  var iframe = document.createElement("iframe"); //load content in an iframe to print later
  document.body.appendChild(iframe);
  iframe.style.display = "none";
  iframe.src = blobURL;
  iframe.onload = function () {
    setTimeout(function () {
      iframe.focus();
      iframe.contentWindow.print();
      // Revoke the Blob URL to avoid memory leaks
      URL.revokeObjectURL(blobURL);
    }, 1);
  };
};
