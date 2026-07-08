import React from "react";
import { pdf } from "@react-pdf/renderer";
import ViewCertificatePDF from "../components/print_settings/ViewCertificatePDF";
import { NORMAL } from "./constants";

export const renderCertificatePayloadToBlob = async (
  payload,
  { mode = NORMAL } = {}
) => {
  if (!payload) {
    return null;
  }

  const {
    printSettings,
    fileHeader,
    fileFooter,
    fileLogo,
    fileWatermark,
    fileSignature,
    patientCertificate,
    doctorData,
  } = payload;

  return pdf(
    <ViewCertificatePDF
      mode={mode}
      printSettings={printSettings}
      fileHeader={fileHeader}
      fileFooter={fileFooter}
      fileLogo={fileLogo}
      fileWatermark={fileWatermark}
      fileSignature={fileSignature}
      heading={patientCertificate?.title || ""}
      content={patientCertificate?.content || ""}
      doctorData={doctorData}
    />
  ).toBlob();
};
