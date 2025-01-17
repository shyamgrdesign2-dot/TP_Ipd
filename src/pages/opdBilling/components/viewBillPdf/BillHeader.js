import { Image, Text, View } from "@react-pdf/renderer";
import { patientDataShow } from "./helper";
import { PX_TO_PT, styles } from "./constants";

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

const BillHeader = ({ printSettings }) => {
  const { headerFooter } = printSettings;
  const { header, logo, otherSettings, patientInfo } = headerFooter || {};
  const { clinicInfo, doctorInfo } = header || {};
  const { waterMark } = otherSettings || {};

  return (
    <>
      <View
        style={{
          marginBottom:
            PX_TO_PT * (headerFooter?.letterHeadFormat != 2 ? 15 : 0),
        }}
        fixed
      >
        {headerFooter?.letterHeadFormat === 0 ? (
          <View>
            {doctorInfo?.enabled && clinicInfo?.enabled ? (
              <View style={styles.directionCasemanager}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mainTitle}>
                    {doctorInfo?.position === "left"
                      ? doctorInfo?.header
                      : clinicInfo?.header}
                  </Text>
                  <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
                    {doctorInfo?.position === "left"
                      ? doctorInfo?.subheader
                      : clinicInfo?.subheader}
                  </Text>
                </View>
                {logo?.enabled && (
                  <View
                    style={{
                      width: 82,
                      height: 82,
                      overflow: "hidden",
                      marginHorizontal: 16,
                    }}
                  >
                    {logo?.enabled && logo?.file && (
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        src={logo?.file}
                      />
                    )}
                  </View>
                )}
                <View style={{ flex: 1, textAlign: "right" }}>
                  <Text style={styles.mainTitle}>
                    {doctorInfo?.position === "right"
                      ? doctorInfo?.header
                      : clinicInfo?.header}
                  </Text>
                  <Text style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}>
                    {doctorInfo?.position === "right"
                      ? doctorInfo?.subheader
                      : clinicInfo?.subheader}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {logo?.enabled && (
                  <View
                    style={{
                      width: 82,
                      height: 82,
                      overflow: "hidden",
                      marginLeft: 8,
                    }}
                  >
                    {logo?.enabled && logo?.file && (
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        src={logo?.file}
                      />
                    )}
                  </View>
                )}
                {doctorInfo?.enabled ? (
                  <View
                    style={{
                      flex: 1,
                      textAlign:
                        doctorInfo?.position === "left" ? "left" : "right",
                      weight: "189px",
                    }}
                  >
                    <Text style={styles.mainTitle}>
                      {doctorInfo?.enabled
                        ? doctorInfo?.header
                        : clinicInfo?.header}
                    </Text>
                    <Text
                      style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}
                    >
                      {doctorInfo?.enabled
                        ? doctorInfo?.subheader
                        : clinicInfo?.subheader}
                    </Text>
                  </View>
                ) : (
                  clinicInfo?.enabled && (
                    <View
                      style={{
                        flex: 1,
                        textAlign:
                          clinicInfo?.position === "left" ? "left" : "right",
                        weight: "130px",
                      }}
                    >
                      <Text style={styles.mainTitle}>
                        {doctorInfo?.enabled
                          ? doctorInfo?.header
                          : clinicInfo?.header}
                      </Text>
                      <Text
                        style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}
                      >
                        {doctorInfo?.enabled
                          ? doctorInfo?.subheader
                          : clinicInfo?.subheader}
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        ) : (
          headerFooter?.letterHeadFormat === 1 &&
          headerFooter?.header?.file && (
            <Image
              style={{ width: "100%", objectFit: "contain" }}
              src={headerFooter?.header?.file}
            />
          )
        )}
      </View>

      {waterMark?.enabled && waterMark?.file && (
        <Image
          style={{
            width: 100,
            height: 100,
            objectFit: "contain",
            zIndex: -1,
            opacity: 0.1,
            position: "absolute",
            top: "50%",
            left: "40%",
          }}
          src={waterMark?.file}
          fixed
        />
      )}

      <View
        style={{
          backgroundColor: "#171725",
          height: PX_TO_PT * 2,
          width: "100%",
        }}
      />

      <View style={{ flexDirection: "row", marginVertical: PX_TO_PT * 15 }}>
        <View style={{ flex: 0.7, marginRight: PX_TO_PT * 8 }}>
          {patientInfo
            ?.filter((e) => e.enabled)
            ?.map((item, i) => {
              return (
                i % 2 === 0 && (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      paddingVertical: PX_TO_PT * 3,
                    }}
                  >
                    <Text
                      style={[styles.displayPatient, { fontWeight: 500 }]}
                    >{`${item.title}: `}</Text>
                    <Text style={[styles.displayPatient, { fontWeight: 400 }]}>
                      {patientDataShow(item.id, caseManagerData)}
                    </Text>
                  </View>
                )
              );
            })}
        </View>
        <View style={{ flex: 0.3, marginLeft: PX_TO_PT * 8 }}>
          {patientInfo
            ?.filter((e) => e.enabled)
            ?.map((item, i) => {
              return (
                i % 2 === 1 && (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      paddingVertical: PX_TO_PT * 3,
                    }}
                  >
                    <Text
                      style={[styles.displayPatient, { fontWeight: 500 }]}
                    >{`${item.title}: `}</Text>
                    <Text style={[styles.displayPatient, { fontWeight: 400 }]}>
                      {patientDataShow(item.id, caseManagerData)}
                    </Text>
                  </View>
                )
              );
            })}
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#171725",
          height: PX_TO_PT * 1,
          width: "100%",
        }}
      />
    </>
  );
};

export default BillHeader;
