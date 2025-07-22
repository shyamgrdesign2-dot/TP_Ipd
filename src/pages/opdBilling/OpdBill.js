import { pdf } from "@react-pdf/renderer";
import {
  fetchAdvanceSetting,
  fetchBillDetailsByBillNumber,
  fetchPatientWalletBalance,
  fetchPrintSetting,
} from "./service";
import { useEffect, useState } from "react";
import ViewBillPdf from "./components/viewBillPdf/ViewBillPdf";
import ApiAppointments from "../../api/services/ApiAppointments";

const OpdBill = () => {
  const billNumber = "";
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
    if (billDetails) {
      makePDFUrl();
    }
  }, [billDetails]);

  const getOpdBillDetails = async () => {
    const billDetailsRes = await fetchBillDetailsByBillNumber(billNumber);
    setBillDetails(billDetailsRes);
    const printSettingsResponse = await fetchPrintSetting(
      isReceptionist ? billDetailsRes?.doctorId : ""
    );
    if (printSettingsResponse) {
      setBillPrintSettings(printSettingsResponse);
    }
    const patientWalletBalanceRes = await fetchPatientWalletBalance(
      billDetails?.patient?.patient_unique_id
    );
    if (patientWalletBalanceRes?.advanceDepositBalance) {
      setPatientWalletBalance(patientWalletBalanceRes?.advanceDepositBalance);
    }

    const advanceSettingsResponse = await fetchAdvanceSetting();
    if (advanceSettingsResponse) {
      setAdvancedSettings(advanceSettingsResponse);
    }

    const profileRes = await ApiAppointments.getProfile();
    if (profileRes?.data?.[0]) {
      setProfile(profileRes?.data?.[0]);
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

  return <div>{pdfUrl}</div>;
};

export default OpdBill;
