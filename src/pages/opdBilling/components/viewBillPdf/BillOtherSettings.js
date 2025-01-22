import { Image, Text, View } from "@react-pdf/renderer";
import { PX_TO_PT, styles } from "./constants";
import { useEffect, useState } from "react";
import config from "../../../../config";
import QRCode from "qrcode";

const caseManagerData = {
  tcm_id: 6222,
  showConsultationDateTime: "08 Jan 2025, 04:45 pm",
  consultation_date: "2025-01-08 16:45:15",
  follow_up_date: "2025-01-22",
  visit_advice: "",
  smart_prescription_filename: null,
  total_consultation: 41,
  next_tcm_id: null,
  prev_tcm_id: 6221,
  print_url:
    "https://pm-printview-uat.tatvacare.in/api/v1/printview/patient-prescription?patient_unique_id=ODMzMTkwNzA3MjU0&tcm_id=NjIyMg==&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiZG9jdG9yX3VuaXF1ZV9pZCI6IjJjQUtlOUZVYnZHUkp0TiIsIm1vYmlsZV9ubyI6Ijk3NDI2Mzk5NTgiLCJjbGluaWNfaWQiOiIzNjgiLCJob3NwaXRhbF9idXNpbmVzc19pZCI6Ijc1NDgxMTcxMzQzODc3MyIsInVzZXJfaWQiOjQ5M30sImlhdCI6MTcxNTA4NTg0NSwiZXhwIjoxNzQ2NjQzNDQ1fQ.iHe9R3VYqLHePwUFM8EzMnFlPum3Amgk7ui-TIJBfpU&rxDigitize=false",
  print_rx_url:
    "https://pm-printview-uat.tatvacare.in/api/v1/printview/patient-prescription?patient_unique_id=ODMzMTkwNzA3MjU0&tcm_id=NjIyMg==&rx=1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiZG9jdG9yX3VuaXF1ZV9pZCI6IjJjQUtlOUZVYnZHUkp0TiIsIm1vYmlsZV9ubyI6Ijk3NDI2Mzk5NTgiLCJjbGluaWNfaWQiOiIzNjgiLCJob3NwaXRhbF9idXNpbmVzc19pZCI6Ijc1NDgxMTcxMzQzODc3MyIsInVzZXJfaWQiOjQ5M30sImlhdCI6MTcxNTA4NTg0NSwiZXhwIjoxNzQ2NjQzNDQ1fQ.iHe9R3VYqLHePwUFM8EzMnFlPum3Amgk7ui-TIJBfpU&rxDigitize=false",
  patient_data: {
    pm_id: 6942,
    patient_id: "PAT0450",
    patient_salutation: "Mr",
    patient_name: "A A RATHVA",
    patient_dob: "01/10/2024",
    patient_age: 0,
    ageYears: 0,
    ageMonths: 3,
    ageDays: 7,
    patient_gender: "Male",
    patient_contact_no: "7567784027",
    patient_email: null,
    patient_address: "",
    patient_blood_group: "A+",
    patient_secondary_name: null,
    patient_secondary_contact: null,
    patient_reference_id: "10012020049092",
    patient_ht_wt: "78Cm/67Kg",
    patient_consultation_type: null,
    patient_consultaion_date: "2025-01-08 16:45:15",
    patient_edd_date: null,
    patient_date_time: "2025-01-08 17:19:10",
    patient_unique_id: 833190707254,
  },
  doctor_data: {
    doctor_name: "Dr Harish Y",
    um_qualifications: null,
    gmc_no: "",
    dp_name: "Paediatrics",
    dp_id: 9,
    editCase: true,
  },
  symptoms: [],
  examination: [],
  diagnosis: [],
  advice: [],
  investigation: [],
  vitals: [],
  patient_birth_weight: "",
  medicine: [],
  medical_history: [],
  private_notes: null,
  treatment: "",
  isRxDigitize: false,
  surgeries: [],
  moduleContents: [
    {
      module_id: "675c60925a44857736cb1774",
      content: [],
    },
    {
      module_id: "676d5cbd1d692360e829bfeb",
      content: [],
    },
    {
      module_id: "676e77071d692360e829bff0",
      content: [],
    },
  ],
  gynecHistoryData: null,
  labParamsData: [],
};

const BillOtherSettings = ({ printSettings }) => {
  const { headerFooter } = printSettings;
  const { header, otherSettings } = headerFooter || {};
  const { doctorInfo } = header || {};
  const { signature, qrCode } = otherSettings || {};

  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (qrCode?.enabled) {
      const qrUrl = getQrCodeUrl();
      if (qrUrl) {
        setQrCodeUrl(qrUrl);
      }
    }
  }, []);

  const getQrCodeUrl = async () => {
    return await QRCode.toDataURL(
      `${config.doctor_website_url}${parseInt(
        printSettings?.um_contact,
        10
      ).toString(36)}_${printSettings?.hm_refer_code}`
    );
  };

  return (
    <View style={{ marginTop: PX_TO_PT * 29 }} wrap={false}>
      {signature?.enabled && signature?.file && (
        <View
          style={{
            alignSelf: signature?.position === "right" && "flex-end",
          }}
        >
          <Image
            style={{ width: 139, height: 60, objectFit: "contain" }}
            src={signature?.file}
          />
        </View>
      )}

      {qrCode?.enabled && signature?.enabled ? (
        signature?.position === "right" ? (
          <View style={styles.directionCasemanager}>
            <View style={[styles.directionCasemanager, { flex: 1 }]}>
              {qrCodeUrl && (
                <>
                  <Image
                    style={{ width: 61, height: 61, objectFit: "contain" }}
                    src={qrCodeUrl}
                  />
                  <Text
                    style={{
                      fontSize: PX_TO_PT * 10,
                      color: "#000",
                      fontFamily: "Roboto",
                      fontWeight: 400,
                    }}
                  >
                    {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                  </Text>
                </>
              )}
            </View>
            <View style={{ flex: 1, textAlign: "right" }}>
              {doctorInfo?.enabled && (
                <Text
                  style={[styles.extraText, { fontWeight: 700, color: "#000" }]}
                >
                  {caseManagerData?.doctor_data?.doctor_name}
                </Text>
              )}
              {signature?.registrationEnabled && (
                <Text
                  style={[styles.extraText, { fontWeight: 400, color: "#000" }]}
                >
                  Medical Registration No.:{" "}
                  {caseManagerData?.doctor_data?.gmc_no}
                </Text>
              )}
              {signature?.qualificationEnabled && (
                <Text
                  style={[styles.extraText, { fontWeight: 400, color: "#000" }]}
                >
                  {signature?.qualification ??
                    caseManagerData?.doctor_data?.um_qualifications}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              {signature?.doctorNameEnabled && (
                <Text
                  style={[styles.extraText, { fontWeight: 700, color: "#000" }]}
                >
                  {caseManagerData?.doctor_data?.doctor_name}
                </Text>
              )}
              {signature?.registrationEnabled && (
                <Text
                  style={[styles.extraText, { fontWeight: 400, color: "#000" }]}
                >
                  Medical Registration No.:{" "}
                  {caseManagerData?.doctor_data?.gmc_no}
                </Text>
              )}
              {signature?.qualificationEnabled && (
                <Text
                  style={[styles.extraText, { fontWeight: 400, color: "#000" }]}
                >
                  {signature?.qualification ??
                    caseManagerData?.doctor_data?.um_qualifications}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.directionCasemanager,
                { flex: 1, justifyContent: "flex-end" },
              ]}
            >
              {qrCodeUrl && (
                <>
                  <Image
                    style={{ width: 61, height: 61, objectFit: "contain" }}
                    src={qrCodeUrl}
                  />
                  <Text
                    style={{
                      fontSize: PX_TO_PT * 10,
                      color: "#000",
                      fontFamily: "Roboto",
                      fontWeight: 400,
                    }}
                  >
                    {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                  </Text>
                </>
              )}
            </View>
          </View>
        )
      ) : (
        (qrCode?.enabled || signature?.enabled) && (
          <View style={{ flexDirection: "row" }}>
            {qrCode?.enabled && (
              <View style={styles.directionCasemanager}>
                {qrCodeUrl && (
                  <>
                    <Image
                      style={{
                        width: 61,
                        height: 61,
                        objectFit: "contain",
                      }}
                      src={qrCodeUrl}
                    />
                    <Text
                      style={{
                        fontSize: PX_TO_PT * 10,
                        color: "#000",
                        fontFamily: "Roboto",
                        fontWeight: 400,
                      }}
                    >
                      {`Scan QR code to book an appointment\nwith your doctor or download your old\ndigital prescription`}
                    </Text>
                  </>
                )}
              </View>
            )}
            {signature?.enabled && (
              <View
                style={{
                  flex: 1,
                  textAlign: signature?.position === "right" && "right",
                }}
              >
                {signature?.doctorNameEnabled && (
                  <Text
                    style={[
                      styles.extraText,
                      { fontWeight: 700, color: "#000" },
                    ]}
                  >
                    {caseManagerData?.doctor_data?.doctor_name}
                  </Text>
                )}
                {signature?.registrationEnabled && (
                  <Text
                    style={[
                      styles.extraText,
                      { fontWeight: 400, color: "#000" },
                    ]}
                  >
                    Medical Registration No.:{" "}
                    {caseManagerData?.doctor_data?.gmc_no}
                  </Text>
                )}
                {signature?.qualificationEnabled && (
                  <Text
                    style={[
                      styles.extraText,
                      { fontWeight: 400, color: "#000" },
                    ]}
                  >
                    {signature?.qualification ??
                      caseManagerData?.doctor_data?.um_qualifications}
                  </Text>
                )}
              </View>
            )}
          </View>
        )
      )}
    </View>
  );
};

export default BillOtherSettings;
