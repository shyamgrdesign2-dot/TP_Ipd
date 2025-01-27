import React, { useState } from "react";
import { Font, Page, Document } from "@react-pdf/renderer";
import { calculatePadding } from "./helper";
import BillHeader from "./BillHeader";
import BillFooter from "./BillFooter";
import BillOtherSettings from "./BillOtherSettings";
import BillDetails from "./BillDetails";
import DepositDetails from "./DepositDetails";

// Roboto
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: require("./../../../../assets/fonts/print-fonts/Roboto-Regular.ttf"),
      fontWeight: 400,
    }, // Regular
    {
      src: require("./../../../../assets/fonts/print-fonts/Roboto-Medium.ttf"),
      fontWeight: 500,
    }, // Medium
    {
      src: require("./../../../../assets/fonts/print-fonts/Roboto-Bold.ttf"),
      fontWeight: 700,
    }, // Bold
  ],
});
// Arial
Font.register({
  family: "Arial",
  fonts: [
    {
      src: require("./../../../../assets/fonts/print-fonts/Arimo-Regular.ttf"),
      fontWeight: 400,
    }, // Regular
    {
      src: require("./../../../../assets/fonts/print-fonts/Arimo-Medium.ttf"),
      fontWeight: 500,
    }, // Medium
    {
      src: require("./../../../../assets/fonts/print-fonts/Arimo-Bold.ttf"),
      fontWeight: 700,
    }, // Bold
  ],
});
// Times Roman
Font.register({
  family: "Times-Roman",
  fonts: [
    {
      src: require("./../../../../assets/fonts/print-fonts/EBGaramond-Regular.ttf"),
      fontWeight: 400,
    }, // Regular
    {
      src: require("./../../../../assets/fonts/print-fonts/EBGaramond-Medium.ttf"),
      fontWeight: 500,
    }, // Medium
    {
      src: require("./../../../../assets/fonts/print-fonts/EBGaramond-Bold.ttf"),
      fontWeight: 700,
    }, // Bold
  ],
});
// Verdana
Font.register({
  family: "Verdana",
  fonts: [
    {
      src: require("./../../../../assets/fonts/print-fonts/Jost-Regular.ttf"),
      fontWeight: 400,
    }, // Regular
    {
      src: require("./../../../../assets/fonts/print-fonts/Jost-Medium.ttf"),
      fontWeight: 500,
    }, // Medium
    {
      src: require("./../../../../assets/fonts/print-fonts/Jost-Bold.ttf"),
      fontWeight: 700,
    }, // Bold
  ],
});
// Calibri
Font.register({
  family: "Calibri",
  fonts: [
    {
      src: require("./../../../../assets/fonts/print-fonts/OpenSans-Regular.ttf"),
      fontWeight: 400,
    }, // Regular
    {
      src: require("./../../../../assets/fonts/print-fonts/OpenSans-Medium.ttf"),
      fontWeight: 500,
    }, // Medium
    {
      src: require("./../../../../assets/fonts/print-fonts/OpenSans-Bold.ttf"),
      fontWeight: 700,
    }, // Bold
  ],
});
// Tahoma
Font.register({
  family: "Tahoma",
  fonts: [
    {
      src: require("./../../../../assets/fonts/print-fonts/Vazirmatn-Regular.ttf"),
      fontWeight: 400,
    }, // Regular
    {
      src: require("./../../../../assets/fonts/print-fonts/Vazirmatn-Medium.ttf"),
      fontWeight: 500,
    }, // Medium
    {
      src: require("./../../../../assets/fonts/print-fonts/Vazirmatn-Bold.ttf"),
      fontWeight: 700,
    }, // Bold
  ],
});

const ViewBillPdf = ({
  printSettings,
  isDepositReceipt,
  patientData,
  profile,
}) => {
  const [fileWatermark, setFileWatermark] = useState(null);
  const paddingStyles = calculatePadding(printSettings?.headerFooter);

  const depositData = {
    billNumber: "INV-2900569",
    total: 5000,
  };

  const billData = {
    date: "30th Apr 2024",
    gstIn: "1234",
    billNo: 123,
    receiptNo: 124,
    status: "done",
    createdBy: "Harish",
    createdAt: "24/12/2024",
  };

  return (
    <Document>
      <Page
        size={printSettings?.pageFormat?.pageType || "A5"}
        style={paddingStyles}
        wrap={true}
      >
        <BillHeader
          fileWatermark={fileWatermark}
          setFileWatermark={setFileWatermark}
          printSettings={printSettings}
          isDepositReceipt={isDepositReceipt}
          patientData={patientData}
          billData={billData}
          profile={profile}
        />
        {isDepositReceipt ? (
          <DepositDetails
            pageFormat={printSettings?.pageFormat}
            depositData={depositData}
          />
        ) : (
          <BillDetails pageFormat={printSettings?.pageFormat} />
        )}
        <BillOtherSettings printSettings={printSettings} profile={profile} />
        <BillFooter printSettings={printSettings} billData={billData} />
      </Page>
    </Document>
  );
};

export default React.memo(ViewBillPdf);
