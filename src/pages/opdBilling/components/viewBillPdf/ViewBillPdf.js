import React from "react";
import {
  Font,
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";

const printSettings = {
  type: "opd_prescription",
  letterhead_format: 0,
  logo_enable: "Y",
  signature_enable: "N",
  qrcode_enable: "N",
  water_mark_enable: "N",
  logo_image: "https://pm-uat-dhspl-2.tatvacare.in/logo/default/logo.png",
  header_image: "",
  footer_image: "",
  signature_image: "",
  water_mark_image: "",
  prescription: {
    case_option: [
      {
        id: 7,
        title: "Vitals & Body Composition",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 1,
        title: "Symptoms",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 2,
        title: "Examinations",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 13,
        title: "Gynec History",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 14,
        title: "Obs History",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
        obs_history_option: [
          "gplae",
          "diagnosis",
          "history",
          "examination",
          "ancHistory",
          "immunisationHistory",
        ],
      },
      {
        id: 8,
        title: "Medical History",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
        medical_history_option: [2, 4, 3, 1],
      },
      {
        id: 15,
        title: "Lab Results",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 3,
        title: "Diagnosis",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 4,
        title: "Medications (Rx)",
        format: "table",
        enable: "Y",
        custom_status: "Y",
        medicine_with_generic: true,
        medicine_option: ["dose", "duration", "note"],
        numeric_frequency: true,
      },
      {
        id: 5,
        title: "Advices",
        format: "listview",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 6,
        title: "Lab Investigation",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 9,
        title: "Follow-up & Notes",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 10,
        title: "Vaccination",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 11,
        title: "SmartRx",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: 12,
        title: "Growth Chart",
        format: "table",
        enable: "Y",
        custom_status: "Y",
        growth_chart_option: [
          "height",
          "weight",
          "bmi",
          "ofc",
          "heightVsWeight",
        ],
      },
      {
        id: 16,
        title: "Surgeries/Procedures",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
      },
      {
        id: "675c60925a44857736cb1774",
        title: "Physio",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
        is_custom_module: true,
      },
      {
        id: "676d5cbd1d692360e829bfeb",
        title: "Cross Consult / Referred to",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
        is_custom_module: true,
      },
      {
        id: "676e77071d692360e829bff0",
        title: "Diet",
        format: "inline",
        enable: "Y",
        custom_status: "Y",
        is_custom_module: true,
      },
    ],
  },
  header_footer: {
    header: {
      doctor_info: {
        enable: "Y",
        place: "L",
        header: "Dr Harish Y",
        subheader: "null\nPaediatrics\n",
      },
      clinic_info: {
        enable: "Y",
        place: "R",
        header: "Harish",
        subheader: "Bengaluru,null,null\nBengaluru\nKarnataka",
      },
    },
    patient_info: [
      {
        id: 1,
        title: "Patient Name & Patient Id",
        enable: "Y",
      },
      {
        id: 2,
        title: "Date & Time",
        enable: "Y",
      },
      {
        id: 3,
        title: "Age/Gender",
        enable: "Y",
      },
      {
        id: 4,
        title: "Mobile No",
        enable: "Y",
      },
      {
        id: 5,
        title: "Height/Weight",
        enable: "Y",
      },
      {
        id: 6,
        title: "Blood Group",
        enable: "Y",
      },
      {
        id: 7,
        title: "Address",
        enable: "Y",
      },
      {
        id: 8,
        title: "Consultation Type",
        enable: "Y",
      },
      {
        id: 9,
        title: "Estimated Date of Delivery",
        enable: "N",
      },
      {
        id: 10,
        title: "Email",
        enable: "N",
      },
      {
        id: 11,
        title: "Ref/MRN Id",
        enable: "N",
      },
      {
        id: 12,
        title: "Patient Name",
        enable: "N",
      },
      {
        id: 13,
        title: "Patient Id",
        enable: "N",
      },
    ],
    margin: {
      top: 3,
      left: 2,
      right: 2,
      bottom: 2.5,
    },
    other_settings: {
      signature_place: "R",
      name_of_doctor_enable: "Y",
      qualification_enable: "Y",
      registration_no_enable: "Y",
      qualification: "",
    },
    footer: {
      title: "Harish",
      font_size: 10,
    },
    custom_letterhead_margin: {
      top: "2",
      left: "2",
      right: "2",
      bottom: "2",
    },
  },
  page_format: {
    font_family: "Roboto",
    font_size: 12,
  },
  um_contact: "9742639958",
  hm_refer_code: "NL4FH3",
  qrcode:
    "data:image/png;base64,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",
};

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

const fileLogo = {
  imageShow: true,
  showFile: "https://pm-uat-dhspl-2.tatvacare.in/logo/default/logo.png",
};

const fileHeader = null;
const fileFooter = null;
const fileWatermark = null;
const fileSignature = null;

const PX_TO_PT = 0.75;

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

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: PX_TO_PT * 18,
    color: "#A461D8",
    fontFamily: "Roboto",
    fontWeight: 700,
  },
  subTitle: {
    fontSize: PX_TO_PT * 14,
    color: "#454551",
    fontFamily: "Roboto",
    fontWeight: 500,
    lineHeight: 1.4,
  },
  displayPatient: {
    fontSize: PX_TO_PT * 12,
    color: "#171725",
    fontFamily: "Roboto",
  },
  mainCasemanager: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  extraText: {
    fontSize: PX_TO_PT * 12,
    color: "#171725",
    fontFamily: "Roboto",
  },
  directionCasemanager: {
    flexDirection: "row",
    alignItems: "center",
  },
  table: {
    marginTop: PX_TO_PT * 4,
    borderTop: "1px solid #171725",
    borderLeft: "1px solid #171725",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #171725",
  },
  cell: {
    flex: 1,
    padding: 6,
    borderRight: "1px solid #171725",
  },
  minHeight50: {
    minHeight: 50,
  },
  minHeight38: {
    minHeight: 38,
  },
});

const getMarginByFormat = (
  letterheadFormat,
  headerFooter,
  position,
  defaultValue
) => {
  const marginType =
    letterheadFormat === 0
      ? "custom_letterhead_margin"
      : letterheadFormat === 1
      ? "uploaded_letterhead_margin"
      : letterheadFormat === 2
      ? "margin"
      : null;

  return marginType && headerFooter?.[marginType]?.[position] >= 0
    ? (headerFooter?.[marginType]?.[position] || defaultValue) * 25
    : PX_TO_PT * 30;
};

const calculatePadding = () => {
  const { letterhead_format, header_footer } = printSettings || {};
  return {
    paddingTop: [0, 1, 2].includes(letterhead_format)
      ? getMarginByFormat(letterhead_format, header_footer, "top", 0.5)
      : PX_TO_PT * 30,
    paddingLeft: [0, 1, 2].includes(letterhead_format)
      ? getMarginByFormat(letterhead_format, header_footer, "left", 0.5)
      : PX_TO_PT * 30,
    paddingRight: [0, 1, 2].includes(letterhead_format)
      ? getMarginByFormat(letterhead_format, header_footer, "right", 0.5)
      : PX_TO_PT * 30,
  };
};

const patientDataShow = (id) => {
  var value = "";
  if (id == 1) {
    value = `${
      caseManagerData?.patient_data?.patient_salutation
        ? `${caseManagerData?.patient_data?.patient_salutation} ${caseManagerData?.patient_data?.patient_name}, ${caseManagerData?.patient_data?.patient_id}`
        : `${caseManagerData?.patient_data?.patient_name}, ${caseManagerData?.patient_data?.patient_id}`
    }`;
  } else if (id == 2) {
    value = `${
      caseManagerData?.patient_data?.patient_consultaion_date
        ? moment(
            caseManagerData?.patient_data?.patient_consultaion_date
          ).format("DD/MM/YYYY HH:mm")
        : "-"
    }`;
  } else if (id == 3) {
    value = `${genderAge(
      caseManagerData?.patient_data,
      caseManagerData?.doctor_data
    )}, ${caseManagerData?.patient_data?.patient_gender}`;
  } else if (id == 4) {
    value = `${
      caseManagerData?.patient_data?.patient_contact_no
        ? caseManagerData?.patient_data?.patient_contact_no
        : "-"
    }`;
  } else if (id == 5) {
    value = `${
      caseManagerData?.patient_data?.patient_ht_wt
        ? caseManagerData?.patient_data?.patient_ht_wt
        : "-"
    }`;
  } else if (id == 6) {
    value = `${
      caseManagerData?.patient_data?.patient_blood_group
        ? caseManagerData?.patient_data?.patient_blood_group
        : "-"
    }`;
  } else if (id == 7) {
    value = `${
      caseManagerData?.patient_data?.patient_address
        ? caseManagerData?.patient_data?.patient_address
        : "-"
    }`;
  } else if (id == 8) {
    value = `${
      caseManagerData?.patient_data?.patient_consultation_type
        ? caseManagerData?.patient_data?.patient_consultation_type
        : "-"
    }`;
  } else if (id == 9) {
    value = `${
      caseManagerData?.patient_data?.patient_edd_date
        ? caseManagerData?.patient_data?.patient_edd_date
        : "-"
    }`;
  } else if (id == 10) {
    value = `${
      caseManagerData?.patient_data?.patient_email
        ? caseManagerData?.patient_data?.patient_email
        : "-"
    }`;
  } else if (id == 11) {
    value = `${
      caseManagerData?.patient_data?.patient_reference_id
        ? caseManagerData?.patient_data?.patient_reference_id
        : "-"
    }`;
  } else if (id == 12) {
    value = `${
      caseManagerData?.patient_data?.patient_salutation
        ? `${caseManagerData?.patient_data?.patient_salutation} ${caseManagerData?.patient_data?.patient_name}`
        : `${caseManagerData?.patient_data?.patient_name}`
    }`;
  } else if (id == 13) {
    value = `${
      caseManagerData?.patient_data?.patient_id
        ? caseManagerData?.patient_data?.patient_id
        : "-"
    }`;
  }
  return value;
};

const genderAge = (patient_data, profile) => {
  var value = ``;
  if (profile?.dp_id === 9) {
    if (patient_data?.ageYears != 0) {
      value += `${patient_data?.ageYears}y`;
    }
    if (patient_data?.ageMonths != 0) {
      value += ` ${patient_data?.ageMonths}m`;
    }
    if (patient_data?.ageDays != 0) {
      value += ` ${patient_data?.ageDays}d`;
    }
  } else {
    if (patient_data?.ageYears != 0) {
      value += `${patient_data?.ageYears}y`;
    } else if (patient_data?.ageMonths != 0) {
      value += ` ${patient_data?.ageMonths}m`;
    } else if (patient_data?.ageDays != 0) {
      value += ` ${patient_data?.ageDays}d`;
    }
  }
  return value;
};

const ViewBillPdf = () => {
  const paddingStyles = calculatePadding();
  return (
    <Document>
      <Page size="A5" style={paddingStyles} wrap={true}>
        <View
          style={{
            marginBottom:
              PX_TO_PT * (printSettings?.letterhead_format != 2 ? 15 : 0),
          }}
          fixed
        >
          {printSettings?.letterhead_format === 0 ? (
            <View>
              {printSettings?.header_footer?.header?.doctor_info?.enable ===
                "Y" &&
              printSettings?.header_footer?.header?.clinic_info?.enable ===
                "Y" ? (
                <View style={styles.directionCasemanager}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mainTitle}>
                      {printSettings?.header_footer?.header?.doctor_info
                        ?.place === "L"
                        ? printSettings?.header_footer?.header?.doctor_info
                            ?.header
                        : printSettings?.header_footer?.header?.clinic_info
                            ?.header}
                    </Text>
                    <Text
                      style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}
                    >
                      {printSettings?.header_footer?.header?.doctor_info
                        ?.place === "L"
                        ? printSettings?.header_footer?.header?.doctor_info
                            ?.subheader
                        : printSettings?.header_footer?.header?.clinic_info
                            ?.subheader}
                    </Text>
                  </View>
                  {printSettings?.logo_enable === "Y" && (
                    <View
                      style={{
                        width: 82,
                        height: 82,
                        overflow: "hidden",
                        marginHorizontal: 16,
                      }}
                    >
                      {fileLogo && fileLogo?.imageShow && (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          src={fileLogo?.showFile}
                        />
                      )}
                    </View>
                  )}
                  <View style={{ flex: 1, textAlign: "right" }}>
                    <Text style={styles.mainTitle}>
                      {printSettings?.header_footer?.header?.doctor_info
                        ?.place === "R"
                        ? printSettings?.header_footer?.header?.doctor_info
                            ?.header
                        : printSettings?.header_footer?.header?.clinic_info
                            ?.header}
                    </Text>
                    <Text
                      style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}
                    >
                      {printSettings?.header_footer?.header?.doctor_info
                        ?.place === "R"
                        ? printSettings?.header_footer?.header?.doctor_info
                            ?.subheader
                        : printSettings?.header_footer?.header?.clinic_info
                            ?.subheader}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {printSettings?.logo_enable === "Y" && (
                    <View
                      style={{
                        width: 82,
                        height: 82,
                        overflow: "hidden",
                        marginLeft: 8,
                      }}
                    >
                      {fileLogo && fileLogo?.imageShow && (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          src={fileLogo?.showFile}
                        />
                      )}
                    </View>
                  )}
                  {printSettings?.header_footer?.header?.doctor_info?.enable ===
                  "Y" ? (
                    <View
                      style={{
                        flex: 1,
                        textAlign:
                          printSettings?.header_footer?.header?.doctor_info
                            ?.place === "L"
                            ? "left"
                            : "right",
                        weight: "189px",
                      }}
                    >
                      <Text style={styles.mainTitle}>
                        {printSettings?.header_footer?.header?.doctor_info
                          ?.enable === "Y"
                          ? printSettings?.header_footer?.header?.doctor_info
                              ?.header
                          : printSettings?.header_footer?.header?.clinic_info
                              ?.header}
                      </Text>
                      <Text
                        style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}
                      >
                        {printSettings?.header_footer?.header?.doctor_info
                          ?.enable === "Y"
                          ? printSettings?.header_footer?.header?.doctor_info
                              ?.subheader
                          : printSettings?.header_footer?.header?.clinic_info
                              ?.subheader}
                      </Text>
                    </View>
                  ) : (
                    printSettings?.header_footer?.header?.clinic_info
                      ?.enable === "Y" && (
                      <View
                        style={{
                          flex: 1,
                          textAlign:
                            printSettings?.header_footer?.header?.clinic_info
                              ?.place === "L"
                              ? "left"
                              : "right",
                          weight: "130px",
                        }}
                      >
                        <Text style={styles.mainTitle}>
                          {printSettings?.header_footer?.header?.doctor_info
                            ?.enable === "Y"
                            ? printSettings?.header_footer?.header?.doctor_info
                                ?.header
                            : printSettings?.header_footer?.header?.clinic_info
                                ?.header}
                        </Text>
                        <Text
                          style={[styles.subTitle, { marginTop: PX_TO_PT * 4 }]}
                        >
                          {printSettings?.header_footer?.header?.doctor_info
                            ?.enable === "Y"
                            ? printSettings?.header_footer?.header?.doctor_info
                                ?.subheader
                            : printSettings?.header_footer?.header?.clinic_info
                                ?.subheader}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
            </View>
          ) : (
            printSettings?.letterhead_format === 1 &&
            fileHeader &&
            fileHeader?.imageShow && (
              <Image
                style={{ width: "100%", objectFit: "contain" }}
                src={fileHeader?.showFile}
              />
            )
          )}
        </View>

        {printSettings?.water_mark_enable === "Y" &&
          fileWatermark &&
          fileWatermark?.imageShow && (
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
              src={fileWatermark?.showFile}
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
            {printSettings?.header_footer?.patient_info
              .filter((e) => e.enable === "Y")
              .map((item, i) => {
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
                      <Text
                        style={[styles.displayPatient, { fontWeight: 400 }]}
                      >
                        {patientDataShow(item.id)}
                      </Text>
                    </View>
                  )
                );
              })}
          </View>
          <View style={{ flex: 0.3, marginLeft: PX_TO_PT * 8 }}>
            {printSettings?.header_footer?.patient_info
              .filter((e) => e.enable === "Y")
              .map((item, i) => {
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
                      <Text
                        style={[styles.displayPatient, { fontWeight: 400 }]}
                      >
                        {patientDataShow(item.id)}
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

        <View style={{ marginTop: PX_TO_PT * 29 }} wrap={false}>
          {printSettings?.signature_enable === "Y" &&
            fileSignature &&
            fileSignature?.imageShow && (
              <View
                style={{
                  alignSelf:
                    printSettings?.header_footer?.other_settings
                      ?.signature_place === "R" && "flex-end",
                }}
              >
                {fileSignature?.showFile && (
                  <Image
                    style={{ width: 139, height: 60, objectFit: "contain" }}
                    src={fileSignature?.showFile}
                  />
                )}
              </View>
            )}

          {printSettings?.qrcode_enable === "Y" &&
          printSettings?.signature_enable === "Y" ? (
            printSettings?.header_footer?.other_settings?.signature_place ===
            "R" ? (
              <View style={styles.directionCasemanager}>
                <View style={[styles.directionCasemanager, { flex: 1 }]}>
                  {printSettings?.qrcode && (
                    <>
                      <Image
                        style={{ width: 61, height: 61, objectFit: "contain" }}
                        src={printSettings?.qrcode}
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
                  {printSettings?.header_footer?.other_settings
                    ?.name_of_doctor_enable === "Y" && (
                    <Text
                      style={[
                        styles.extraText,
                        { fontWeight: 700, color: "#000" },
                      ]}
                    >
                      {caseManagerData?.doctor_data?.doctor_name}
                    </Text>
                  )}
                  {printSettings?.header_footer?.other_settings
                    ?.registration_no_enable === "Y" && (
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
                  {printSettings?.header_footer?.other_settings
                    ?.qualification_enable === "Y" && (
                    <Text
                      style={[
                        styles.extraText,
                        { fontWeight: 400, color: "#000" },
                      ]}
                    >
                      {printSettings?.header_footer?.other_settings
                        ?.qualification
                        ? printSettings?.header_footer?.other_settings
                            ?.qualification
                        : caseManagerData?.doctor_data?.um_qualifications}
                    </Text>
                  )}
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  {printSettings?.header_footer?.other_settings
                    ?.name_of_doctor_enable === "Y" && (
                    <Text
                      style={[
                        styles.extraText,
                        { fontWeight: 700, color: "#000" },
                      ]}
                    >
                      {caseManagerData?.doctor_data?.doctor_name}
                    </Text>
                  )}
                  {printSettings?.header_footer?.other_settings
                    ?.registration_no_enable === "Y" && (
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
                  {printSettings?.header_footer?.other_settings
                    ?.qualification_enable === "Y" && (
                    <Text
                      style={[
                        styles.extraText,
                        { fontWeight: 400, color: "#000" },
                      ]}
                    >
                      {printSettings?.header_footer?.other_settings
                        ?.qualification
                        ? printSettings?.header_footer?.other_settings
                            ?.qualification
                        : caseManagerData?.doctor_data?.um_qualifications}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.directionCasemanager,
                    { flex: 1, justifyContent: "flex-end" },
                  ]}
                >
                  {printSettings?.qrcode && (
                    <>
                      <Image
                        style={{ width: 61, height: 61, objectFit: "contain" }}
                        src={printSettings?.qrcode}
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
            (printSettings?.qrcode_enable === "Y" ||
              printSettings?.signature_enable === "Y") && (
              <View style={{ flexDirection: "row" }}>
                {printSettings?.qrcode_enable === "Y" && (
                  <View style={styles.directionCasemanager}>
                    {printSettings?.qrcode && (
                      <>
                        <Image
                          style={{
                            width: 61,
                            height: 61,
                            objectFit: "contain",
                          }}
                          src={printSettings?.qrcode}
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
                {printSettings?.signature_enable === "Y" && (
                  <View
                    style={{
                      flex: 1,
                      textAlign:
                        printSettings?.header_footer?.other_settings
                          ?.signature_place === "R" && "right",
                    }}
                  >
                    {printSettings?.header_footer?.other_settings
                      ?.name_of_doctor_enable === "Y" && (
                      <Text
                        style={[
                          styles.extraText,
                          { fontWeight: 700, color: "#000" },
                        ]}
                      >
                        {caseManagerData?.doctor_data?.doctor_name}
                      </Text>
                    )}
                    {printSettings?.header_footer?.other_settings
                      ?.registration_no_enable === "Y" && (
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
                    {printSettings?.header_footer?.other_settings
                      ?.qualification_enable === "Y" && (
                      <Text
                        style={[
                          styles.extraText,
                          { fontWeight: 400, color: "#000" },
                        ]}
                      >
                        {printSettings?.header_footer?.other_settings
                          ?.qualification
                          ? printSettings?.header_footer?.other_settings
                              ?.qualification
                          : caseManagerData?.doctor_data?.um_qualifications}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )
          )}
        </View>

        <View
          style={{
            position: "absolute",
            bottom: getMarginByFormat(
              printSettings?.letterhead_format,
              printSettings?.header_footer,
              "bottom",
              0.5
            ),
            left: getMarginByFormat(
              printSettings?.letterhead_format,
              printSettings?.header_footer,
              "left",
              0.5
            ),
            right: getMarginByFormat(
              printSettings?.letterhead_format,
              printSettings?.header_footer,
              "right",
              0.5
            ),
          }}
          fixed
        >
          {printSettings?.letterhead_format === 0 ? (
            <View>
              <View
                style={{
                  backgroundColor: "#171725",
                  height: PX_TO_PT * 2,
                  width: "100%",
                }}
              />
              <Text
                style={{
                  marginTop: PX_TO_PT * 8,
                  color: "#171725",
                  fontFamily: "Roboto",
                  fontSize:
                    PX_TO_PT * printSettings?.header_footer?.footer?.font_size,
                  fontWeight: 400,
                  maxLines: 1,
                }}
              >
                {printSettings?.header_footer?.footer?.title}
              </Text>
            </View>
          ) : (
            printSettings?.letterhead_format === 1 &&
            fileFooter &&
            fileFooter?.imageShow && (
              <Image
                style={{ width: "100%", objectFit: "cover" }}
                src={fileFooter?.showFile}
              />
            )
          )}
        </View>
      </Page>
    </Document>
  );
};

export default React.memo(ViewBillPdf);
