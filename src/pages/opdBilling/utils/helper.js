import { saveAs } from "file-saver";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";
import { db } from "../../../firebase";
import { uploadDocsToAzure } from "../../medicalRecords/service";
import { isChrome, isSafari } from "react-device-detect";

export const handleDownload = async (
  pdfUrl,
  printBlob,
  patientUniqueId,
  setStartLoader
) => {
  if (!isChrome && !isSafari) {
    const file = new File([printBlob], "billingFile.pdf", {
      type: "application/pdf",
    });
    const formData = new FormData();
    formData.append(file?.name, file);
    formData.append("patient_unique_id", patientUniqueId);
    const res = await uploadDocsToAzure(formData);
    if (res?.length > 0) {
      handleInAppClick(
        patientUniqueId,
        "download",
        res?.[0]?.url,
        setStartLoader
      );
    }
  } else {
    try {
      saveAs(pdfUrl, `${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
};

export const printContent = async (
  printBlob,
  patientUniqueId,
  setStartLoader
) => {
  if (!isChrome && !isSafari) {
    const file = new File([printBlob], "billingFile.pdf", {
      type: "application/pdf",
    });
    const formData = new FormData();
    formData.append(file?.name, file);
    formData.append("patient_unique_id", patientUniqueId);
    const res = await uploadDocsToAzure(formData);
    if (res?.length > 0) {
      handleInAppClick(patientUniqueId, "print", res?.[0]?.url, setStartLoader);
    }
  } else {
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
  }
};

const handleInAppClick = async (
  patientUniqueId,
  actionType,
  url,
  setStartLoader
) => {
  const deviceUid = localStorage.getItem("app_device_unique_id");
  if (deviceUid) {
    const docRef = doc(db, "billing", deviceUid);
    try {
      const docSnap = await getDoc(docRef);
      const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
      const cleanedToken = token.replace(/['"]+/g, "");
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          action_type: actionType,
          clicked: "yes",
          patient_unique_id: patientUniqueId,
          token: cleanedToken,
          url: url,
        });
      } else {
        await setDoc(doc(db, "billing", deviceUid), {
          action_type: actionType,
          clicked: "yes",
          patient_unique_id: patientUniqueId,
          token: cleanedToken,
          url: url,
        });
      }
      setStartLoader();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }
};
