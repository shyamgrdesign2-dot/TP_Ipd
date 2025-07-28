import { pdf } from "@react-pdf/renderer";
import {
  fetchAdvanceSetting,
  fetchBillDetailsByBillNumber,
  fetchPatientWalletBalance,
  fetchPrintSetting,
} from "./service";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import ViewBillPdf from "./components/viewBillPdf/ViewBillPdf";
import ApiAppointments from "../../api/services/ApiAppointments";

const OpdBill = () => {
  const billNumber = "INVO_0038";
  const isDepositReceipt = false;
  const isReceptionist = false;

  const [pdfUrl, setPdfUrl] = useState(null);
  const [billDetails, setBillDetails] = useState(null);
  const [billPrintSettings, setBillPrintSettings] = useState(null);
  const [patientWalletBalance, setPatientWalletBalance] = useState(0);
  const [advancedSettings, setAdvancedSettings] = useState(null);
  const [profile, setProfile] = useState(null);

  const { patient = {} } = billDetails || {};
  const patientData = {
    pm_pid: patient.id,
    pm_fullname: patient.name,
    pm_gender: patient.gender,
    pm_contact_no: patient.phone,
    tpml_refrence_id: patient.refId,
    ageDays: patient.ageDays,
    ageMonths: patient.ageMonths,
    ageYears: patient.ageYears,
    pm_salutation: patient.salutation,
    address: patient.address,
  };

  useEffect(() => {
    getOpdBillDetails();
  }, []);

  useEffect(() => {
    if (billDetails && billPrintSettings) {
      makePDFUrl();
    }
  }, [billDetails, billPrintSettings]);

  const getOpdBillDetails = async () => {
    try {
      const billDetailsRes = await fetchBillDetailsByBillNumber(billNumber);
      setBillDetails(billDetailsRes);

      const [
        printSettingsResponse,
        patientWalletBalanceRes,
        advanceSettingsResponse,
        profileRes,
      ] = await Promise.all([
        fetchPrintSetting(isReceptionist ? billDetailsRes?.doctorId : ""),
        fetchPatientWalletBalance(billDetailsRes?.patientId),
        fetchAdvanceSetting(),
        ApiAppointments.getProfile(),
      ]);

      // Set all the responses
      if (printSettingsResponse) {
        setBillPrintSettings(printSettingsResponse);
      }

      if (patientWalletBalanceRes?.advanceDepositBalance) {
        setPatientWalletBalance(patientWalletBalanceRes?.advanceDepositBalance);
      }

      if (advanceSettingsResponse) {
        setAdvancedSettings(advanceSettingsResponse);
      }

      if (profileRes?.data?.[0]) {
        setProfile(profileRes?.data?.[0]);
      }
    } catch (error) {
      console.error("Error fetching bill details:", error);
    }
  };

  const makePDFUrl = async () => {
    const blob = await pdf(
      <ViewBillPdf
        printSettings={billPrintSettings}
        isDepositReceipt={isDepositReceipt}
        patientData={patientData}
        profile={profile}
        billData={billDetails}
        totalAdvanceBalance={patientWalletBalance}
        gstIn={advancedSettings?.GSTIN}
        showCreatedBy={advancedSettings?.enableCreatedByInRx}
      />
    ).toBlob();
    setPdfUrl(URL.createObjectURL(blob));
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="PDF Viewer"
        />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Spin size="large" />
          <div style={{ fontSize: "16px", color: "#666" }}>Loading PDF...</div>
        </div>
      )}
    </div>
  );
};

export default OpdBill;
