import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const mergeDocuments = (doctorUploadedDocs, patientUploadedDocs) => {
  const updatedDocs = [...doctorUploadedDocs, ...patientUploadedDocs];
  updatedDocs.sort(
    (a, b) => new Date(b.created_date) - new Date(a.created_date)
  );
  return updatedDocs;
};

export const loadPdf = (url) => {
  return new Promise(async (resolve) => {
    try {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      // Convert canvas to data URL (base64)
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL); // Return the base64 image data
    } catch (e) {
      resolve("");
    }
  });
};

export const uploadDocURLtoFile = (dataurl, filename) => {
  const base64 = dataurl?.split(",")?.[1];
  const mime = dataurl?.match(/:(.*?);/)?.[1];

  const bstr = atob(base64);
  let n = bstr?.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const getCorrectedFileName = (fileName) => {
  const parts = fileName.split(".");
  const extension = parts.pop(); // Get the last part (the file extension)
  const baseName = parts.join(".").replace(/\./g, "").replace(/\s+/g, "-"); // Remove dots and replace spaces with hyphens
  return `${baseName}.${extension}`;
};

export const generateUniqueFileName = (file) => {
  const fileExtension = file.name.split(".").pop(); // Extract file extension
  const uniqueName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}.${fileExtension}`;
  return uniqueName;
};

export function shortenText(
  text,
  length = 25,
  firstPartLength = 18,
  lastPartLength = -7
) {
  if (text?.length > length) {
    const firstPart = text.slice(0, firstPartLength);
    const lastPart = text.slice(lastPartLength);
    return `${firstPart}...${lastPart}`;
  }
  return text;
}
