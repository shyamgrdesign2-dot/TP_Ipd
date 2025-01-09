import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Switch,
  Table,
} from "antd";
import CommonModal from "../../../../common/CommonModal";
import { Cropper } from "react-cropper";
import { DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import SignatureCanvas from "react-signature-canvas";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { errorMessage } from "../../../../utils/utils";
import defaultprofile from "./../../../../assets/images/default-profile.svg";
import rxDisplayArea from "./../../../../assets/images/rx-display-area.svg";
import wtsp from "./../../../../assets/images/wtsp.svg";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { MenuOutlined } from "@ant-design/icons";
import { FONTS_SIZE_LIST } from "../../../../utils/constants";

const printSettings = {
  type: "opd_prescription",
  letterhead_format: 0,
  whatsapp_letterhead_format: 0,
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
const fileHeader = null;
const fileSignature = null;
const fileFooter = null;
const fileWatermark = null;
const fileLogo = {
  imageShow: true,
  showFile: "https://pm-uat-dhspl-2.tatvacare.in/logo/default/logo.png",
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

const BillHeaderFooterLayout = () => {
  const { TextArea } = Input;

  const [isOwnLetterHead, setIsOwnLetterHead] = useState(false);
  const [isHandleDrawerWhatsappView, setIsHandleDrawerWhatsappView] =
    useState(false);

  const [headerFooterShowHide, setHeaderFooterShowHide] = useState(false);
  const [patientInfoShowHide, setPatientInfoShowHide] = useState(false);
  const [settingsShowHide, setSettingsShowHide] = useState(false);

  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureMode, setSignatureMode] = useState("L");

  const inputHeaderFile = React.createRef();
  const cropperHeaderRef = React.createRef();

  const inputFooterFile = React.createRef();
  const cropperFooterRef = React.createRef();

  const inputLogoFile = React.createRef();
  const inputWatermarkFile = React.createRef();

  const inputSignatureFile = React.createRef();
  const signatureRef = React.createRef();
  const cropperSignatureRef = React.createRef();

  const CustomRow = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"],
    });
    const style = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    };
    const contextValue = useMemo(
      () => ({
        setActivatorNodeRef,
        listeners,
      }),
      [setActivatorNodeRef, listeners]
    );
    return (
      <RowContext.Provider value={contextValue}>
        <tr {...props} ref={setNodeRef} style={style} {...attributes} />
      </RowContext.Provider>
    );
  };

  //TAB_HEADER_FOOTER
  const onHeaderFooterClick = useCallback(() => {
    setHeaderFooterShowHide(!headerFooterShowHide);
  }, [headerFooterShowHide]);

  const onLetterheadFormatChange = useCallback(
    (e) => {
      // printSettings.letterhead_format = e.target.value;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onPatientInfoClick = useCallback(() => {
    setPatientInfoShowHide(!patientInfoShowHide);
  }, [patientInfoShowHide]);

  const onSettingsClick = useCallback(() => {
    setSettingsShowHide(!settingsShowHide);
  }, [settingsShowHide]);

  //Header & Footer
  const handleDrawerOwnLetterHead = useCallback(() => {
    setIsOwnLetterHead(!isOwnLetterHead);
  }, [isOwnLetterHead]);

  //Custom Header & Footer
  const handleDrawerWhatsappView = useCallback(() => {
    setIsHandleDrawerWhatsappView(!isHandleDrawerWhatsappView);
  }, [isHandleDrawerWhatsappView]);

  //Custom
  //Doctor’s information
  const onDoctorInfoSwitchChange = useCallback(
    (checked) => {
      // printSettings.header_footer.header.doctor_info.enable = checked
      //   ? "Y"
      //   : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onDoctorInfoPlaceChange = useCallback(
    (e) => {
      // printSettings.header_footer.header.doctor_info.place = e.target.value;
      // printSettings.header_footer.header.clinic_info.place =
      //   e.target.value === "L" ? "R" : "L";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onDoctorInfoHeaderChange = useCallback(
    (e) => {
      // printSettings.header_footer.header.doctor_info.header = e.target.value;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onDoctorInfoSubHeaderChange = useCallback(
    (e) => {
      // printSettings.header_footer.header.doctor_info.subheader = e.target.value;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  //Clinic’s information
  const onClinicInfoSwitchChange = useCallback(
    (checked) => {
      // printSettings.header_footer.header.clinic_info.enable = checked
      //   ? "Y"
      //   : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onClinicInfoPlaceChange = useCallback(
    (e) => {
      // printSettings.header_footer.header.clinic_info.place = e.target.value;
      // printSettings.header_footer.header.doctor_info.place =
      //   e.target.value === "L" ? "R" : "L";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onClinicInfoHeaderChange = useCallback(
    (e) => {
      // printSettings.header_footer.header.clinic_info.header = e.target.value;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onClinicInfoSubHeaderChange = useCallback(
    (e) => {
      // printSettings.header_footer.header.clinic_info.subheader = e.target.value;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  //Logo on Header
  const onLogoSwitchChange = useCallback(
    (checked) => {
      // printSettings.logo_enable = checked ? "Y" : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  // Logo Image
  const handleLogoChange = (e) => {
    if (e.target.files?.length > 0) {
      const fileUrl = e.target.files[0];
      if (
        fileUrl.size <= 2000000 &&
        (fileUrl.type == "image/png" ||
          fileUrl.type == "image/jpeg" ||
          fileUrl.type == "image/jpg")
      ) {
        // setFileLogo({
        //   imageShow: true,
        //   showFile: URL.createObjectURL(fileUrl),
        //   uploadFile: fileUrl,
        // });
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  //Footer
  const onFooterTextChange = useCallback(
    (e) => {
      // printSettings.header_footer.footer.title = e.target.value;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onSelectFooterFontSize = useCallback(
    (data) => {
      // printSettings.header_footer.footer.font_size = data;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  //Upload Letterhead
  //Header Image
  const showHideHeaderModal = useCallback(() => {
    setIsHeaderModalOpen(!isHeaderModalOpen);
  }, [isHeaderModalOpen]);

  const handleHeaderChange = (e) => {
    if (e.target.files?.length > 0) {
      const fileUrl = e.target.files[0];
      if (
        fileUrl.size <= 2000000 &&
        (fileUrl.type == "image/png" ||
          fileUrl.type == "image/jpeg" ||
          fileUrl.type == "image/jpg")
      ) {
        const reader = new FileReader();
        // reader.onload = () => {
        //   setFileHeader({
        //     imageShow: false,
        //     crop: true,
        //     showFile: reader.result,
        //     originalFile: fileUrl,
        //   });
        //   showHideHeaderModal();
        // };
        // reader.readAsDataURL(fileUrl);
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  const getHeaderCropData = async () => {
    if (typeof cropperHeaderRef.current?.cropper !== "undefined") {
      // const trimData = cropperHeaderRef.current?.cropper
      //   .getCroppedCanvas()
      //   .toDataURL(fileHeader.originalFile.type);
      // const uploadFile = await dataUrlToFileUsingFetch(
      //   trimData,
      //   "header.png",
      //   "image/png"
      // );
      // setFileHeader({
      //   ...fileHeader,
      //   crop: false,
      //   showFile: trimData,
      //   uploadFile: uploadFile,
      // });
    }
  };

  const getHeaderCropChangeData = () => {
    if (fileHeader && !fileHeader?.crop) {
      const reader = new FileReader();
      // reader.onload = () => {
      //   setFileHeader({
      //     ...fileHeader,
      //     imageShow: false,
      //     crop: true,
      //     showFile: reader.result,
      //   });
      // };
      // reader.readAsDataURL(fileHeader.originalFile);
    }
  };

  const onHeaderImageSubmit = () => {
    // setFileHeader({ ...fileHeader, imageShow: true });
    showHideHeaderModal();
  };

  //Footer Image
  const showHideFooterModal = useCallback(() => {
    setIsFooterModalOpen(!isFooterModalOpen);
  }, [isFooterModalOpen]);

  const handleFooterChange = (e) => {
    if (e.target.files?.length > 0) {
      const fileUrl = e.target.files[0];
      if (
        fileUrl.size <= 2000000 &&
        (fileUrl.type == "image/png" ||
          fileUrl.type == "image/jpeg" ||
          fileUrl.type == "image/jpg")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          // setFileFooter({
          //   imageShow: false,
          //   crop: true,
          //   showFile: reader.result,
          //   originalFile: fileUrl,
          // });
          showHideFooterModal();
        };
        reader.readAsDataURL(fileUrl);
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  const getFooterCropData = async () => {
    // if (typeof cropperFooterRef.current?.cropper !== "undefined") {
    //   const trimData = cropperFooterRef.current?.cropper
    //     .getCroppedCanvas()
    //     .toDataURL(fileFooter.originalFile.type);
    //   const uploadFile = await dataUrlToFileUsingFetch(
    //     trimData,
    //     "footer.png",
    //     "image/png"
    //   );
    //   setFileFooter({
    //     ...fileFooter,
    //     crop: false,
    //     showFile: trimData,
    //     uploadFile: uploadFile,
    //   });
    // }
  };

  const getFooterCropChangeData = () => {
    // if (fileFooter && !fileFooter?.crop) {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     setFileFooter({
    //       ...fileFooter,
    //       imageShow: false,
    //       crop: true,
    //       showFile: reader.result,
    //     });
    //   };
    //   reader.readAsDataURL(fileFooter.originalFile);
    // }
  };

  const onFooterImageSubmit = () => {
    // setFileFooter({ ...fileFooter, imageShow: true });
    // showHideFooterModal();
  };

  //Own Letterhead
  const onTopMarginChange = useCallback(
    (e) => {
      if (e.target.value <= 15) {
        // printSettings.header_footer.margin.top = e.target.value;
        // setPrintSettings((prev) => {
        //   return {
        //     ...prev,
        //   };
        // });
      }
    },
    [printSettings]
  );

  const onLeftMarginChange = useCallback(
    (e) => {
      if (e.target.value <= 10) {
        // printSettings.header_footer.margin.left = e.target.value;
        // setPrintSettings((prev) => {
        //   return {
        //     ...prev,
        //   };
        // });
      }
    },
    [printSettings]
  );

  const onRightMarginChange = useCallback(
    (e) => {
      if (e.target.value <= 10) {
        // printSettings.header_footer.margin.right = e.target.value;
        // setPrintSettings((prev) => {
        //   return {
        //     ...prev,
        //   };
        // });
      }
    },
    [printSettings]
  );

  const onBottomMarginChange = useCallback(
    (e) => {
      if (e.target.value <= 15) {
        // printSettings.header_footer.margin.bottom = e.target.value;
        // setPrintSettings((prev) => {
        //   return {
        //     ...prev,
        //   };
        // });
      }
    },
    [printSettings]
  );

  const updateMargin = useCallback((type, position, value, limit) => {
    // setPrintSettings((prev) => {
    //   // Ensure header_footer and margin objects exist
    //   const headerFooter = prev.header_footer || {};
    //   const marginObj = headerFooter[type] || {};
    //   // Update the margin value if within limit
    //   if (value <= limit) {
    //     marginObj[position] = value;
    //   }
    //   return {
    //     ...prev,
    //     header_footer: {
    //       ...headerFooter,
    //       [type]: {
    //         ...marginObj,
    //       },
    //     },
    //   };
    // });
  }, []);

  const onMarginChange = (type, position, limit) => (e) => {
    const value = e.target.value;
    updateMargin(type, position, value, limit);
  };

  // Handlers for custom letterhead margins
  const onCustomLetterheadTopMarginChange = onMarginChange(
    "custom_letterhead_margin",
    "top",
    15
  );
  const onCustomLetterheadLeftMarginChange = onMarginChange(
    "custom_letterhead_margin",
    "left",
    10
  );
  const onCustomLetterheadRightMarginChange = onMarginChange(
    "custom_letterhead_margin",
    "right",
    10
  );
  const onCustomLetterheadBottomMarginChange = onMarginChange(
    "custom_letterhead_margin",
    "bottom",
    15
  );

  // Handlers for uploaded letterhead margins
  const onUploadedLetterheadTopMarginChange = onMarginChange(
    "uploaded_letterhead_margin",
    "top",
    15
  );
  const onUploadedLetterheadLeftMarginChange = onMarginChange(
    "uploaded_letterhead_margin",
    "left",
    10
  );
  const onUploadedLetterheadRightMarginChange = onMarginChange(
    "uploaded_letterhead_margin",
    "right",
    10
  );
  const onUploadedLetterheadBottomMarginChange = onMarginChange(
    "uploaded_letterhead_margin",
    "bottom",
    15
  );

  const RowContext = React.createContext({});

  const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
      <MenuOutlined
        ref={setActivatorNodeRef}
        style={{
          touchAction: "none",
          cursor: "move",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        {...listeners}
      />
    );
  };

  //Display Patient Info
  const patientInfoTable = [
    {
      key: "sort",
      colSpan: 2,
      width: 50,
      align: "center",
      dataIndex: "sort",
      render: () => <DragHandle />,
    },
    {
      colSpan: 0,
      dataIndex: "title",
      key: "title",
      render: (text, record) => <div>{record.title}</div>,
    },
    {
      dataIndex: "enable",
      key: "enable",
      render: (text, record) => (
        <Switch
          defaultChecked
          onChange={(checked) => onChangePatientInfo(checked, record)}
          checked={text != "Y" ? false : true}
        />
      ),
    },
  ];

  const onChangePatientInfo = (checked, record) => {
    const index = printSettings.header_footer.patient_info.findIndex(
      (e) => e.id == record.id
    );
    if (index !== -1) {
      // printSettings.header_footer.patient_info[index].enable = checked
      //   ? "Y"
      //   : "N";
      // // setPrintSettings((prev) => { return [...prev] });
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    }
  };

  const onDragEndPatientInfo = ({ active, over }) => {
    if (active.id !== over?.id) {
      // setPrintSettings((prev) => {
      //   const activeIndex = prev.header_footer.patient_info.findIndex(
      //     (i) => i.id === active.id
      //   );
      //   const overIndex = prev.header_footer.patient_info.findIndex(
      //     (i) => i.id === over?.id
      //   );
      //   return {
      //     ...prev,
      //     header_footer: {
      //       header: { ...prev.header_footer.header },
      //       footer: { ...prev.header_footer.footer },
      //       patient_info: arrayMove(
      //         prev.header_footer.patient_info,
      //         activeIndex,
      //         overIndex
      //       ),
      //       margin: { ...prev.header_footer.margin },
      //       other_settings: { ...prev.header_footer.other_settings },
      //     },
      //   };
      // });
    }
  };

  //Other Settings
  const onWatermarkSwitchChange = useCallback(
    (checked) => {
      // printSettings.water_mark_enable = checked ? "Y" : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  // Watermark Image
  const handleWatermarkChange = (e) => {
    if (e.target.files?.length > 0) {
      const fileUrl = e.target.files[0];
      if (
        fileUrl.size <= 2000000 &&
        (fileUrl.type == "image/png" ||
          fileUrl.type == "image/jpeg" ||
          fileUrl.type == "image/jpg")
      ) {
        // setFileWatermark({
        //   imageShow: true,
        //   showFile: URL.createObjectURL(fileUrl),
        //   uploadFile: fileUrl,
        // });
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  const onSignatureSwitchChange = useCallback(
    (checked) => {
      // printSettings.signature_enable = checked ? "Y" : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  //Signature Image
  const showHideSignatureModal = useCallback(() => {
    setIsSignatureModalOpen(!isSignatureModalOpen);
  }, [isSignatureModalOpen]);

  const onSignatureModeChange = useCallback(
    (e) => {
      // setSignatureMode(e.target.value);
      // setFileSignature(null);
    },
    [signatureMode]
  );

  const handleSignatureChange = (e) => {
    if (e.target.files?.length > 0) {
      const fileUrl = e.target.files[0];
      if (
        fileUrl.size <= 2000000 &&
        (fileUrl.type == "image/png" ||
          fileUrl.type == "image/jpeg" ||
          fileUrl.type == "image/jpg")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          // setFileSignature({
          //   imageShow: false,
          //   crop: true,
          //   readFile: reader.result,
          //   originalFile: fileUrl,
          // });
        };
        reader.readAsDataURL(fileUrl);
      } else {
        errorMessage(
          "Please upload only jpg, jpeg or png files with the max size 2mb."
        );
      }
    }
  };

  const onSignatureImageSubmit = () => {
    // setFileSignature({ ...fileSignature, imageShow: true });
    // printSettings["signature_image_delete"] = 0;
    // setPrintSettings((prev) => {
    //   return {
    //     ...prev,
    //   };
    // });
    showHideSignatureModal();
  };

  const onRemoveSignature = () => {
    if (signatureRef.current) {
      signatureRef.current?.clear();
    }
    // setFileSignature(null);
    // printSettings["signature_image_delete"] = 1;
    // setPrintSettings((prev) => {
    //   return {
    //     ...prev,
    //   };
    // });
  };

  const onResetSignature = () => {
    if (signatureRef.current) {
      signatureRef.current?.clear();
    }
    // setFileSignature(null);
  };

  const handleTrim = async () => {
    if (signatureMode === "L") {
      if (signatureRef.current?.isEmpty()) {
        alert("Please provide signature");
        return;
      }
      const trimData = signatureRef.current
        ?.getTrimmedCanvas()
        .toDataURL("image/png");
      // const uploadFile = await dataUrlToFileUsingFetch(
      //   trimData,
      //   "signature.png",
      //   "image/png"
      // );
      // setFileSignature({
      //   ...fileSignature,
      //   preview: true,
      //   showFile: trimData,
      //   uploadFile: uploadFile,
      // });
    } else {
      if (typeof cropperSignatureRef.current?.cropper !== "undefined") {
        const trimData = cropperSignatureRef.current?.cropper
          .getCroppedCanvas()
          .toDataURL(fileSignature.originalFile.type);
        // const uploadFile = await dataUrlToFileUsingFetch(
        //   trimData,
        //   "signature.png",
        //   "image/png"
        // );
        // setFileSignature({
        //   ...fileSignature,
        //   preview: true,
        //   showFile: trimData,
        //   uploadFile: uploadFile,
        // });
      }
    }
  };

  const onSignaturePlaceChange = useCallback(
    (e) => {
      // printSettings.header_footer.other_settings.signature_place =
      //   e.target.value;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onSignatureCheckbox1Change = useCallback(
    (e) => {
      // printSettings.header_footer.other_settings.name_of_doctor_enable = e
      //   .target.checked
      //   ? "Y"
      //   : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onSignatureCheckbox2Change = useCallback(
    (e) => {
      // printSettings.header_footer.other_settings.registration_no_enable = e
      //   .target.checked
      //   ? "Y"
      //   : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onSignatureCheckbox3Change = useCallback(
    (e) => {
      // printSettings.header_footer.other_settings.qualification_enable = e.target
      //   .checked
      //   ? "Y"
      //   : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onSignatureQualificationChange = useCallback(
    (e) => {
      // printSettings.header_footer.other_settings.qualification = e.target.value;
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  const onShowQrSwitchChange = useCallback(
    (checked) => {
      // printSettings.qrcode_enable = checked ? "Y" : "N";
      // setPrintSettings((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
    },
    [printSettings]
  );

  return (
    <div className="px-3 form_addnewpatient">
      <div className="border-bottom pb-3 mb-3">
        <Row
          justify="space-between"
          className="align-items-center form_addnewpatient mb-1"
        >
          <Col lg="18">
            <div className="titleprint">Header & Footer</div>
          </Col>
          <Col lg="6">
            <Button
              className="btn rounded-10px px-1 border px-3-15"
              style={{
                transform: headerFooterShowHide
                  ? "rotate(90deg)"
                  : "rotate(-90deg)",
              }}
              onClick={onHeaderFooterClick}
            >
              <i className="icon-right"></i>
            </Button>
          </Col>
        </Row>
        <div>Setup your header and Footer</div>

        {headerFooterShowHide && (
          <div className="mt-4">
            <div className="mt-3">
              <Form.Item className="mb-0">
                <label className="mb-1 title-common">
                  Select Letterhead Format
                </label>
                <Radio.Group
                  className={`d-flex gender-radio all-change-radio ${
                    isMobile ? "segmented-radio-mobile" : ""
                  }`}
                  onChange={onLetterheadFormatChange}
                  value={printSettings?.letterhead_format}
                >
                  <Radio.Button className="w-100 text-center" value={2}>
                    Own Letterhead
                  </Radio.Button>
                  <Radio.Button className="w-100 text-center" value={1}>
                    Upload Letterhead
                  </Radio.Button>
                  <Radio.Button className="w-100 text-center" value={0}>
                    Custom
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>

            {printSettings?.letterhead_format === 0 ? (
              // For Custom tab
              <div className="mt-5">
                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-3"
                >
                  <Col lg="18">
                    <div className="title-common">Doctor’s information</div>
                  </Col>
                  <Col lg="6">
                    <span className="fw-medium me-2 text-greycolor fs-16">
                      {printSettings?.header_footer?.header?.doctor_info
                        ?.enable === "Y"
                        ? "Show"
                        : "Hide"}
                    </span>
                    <Switch
                      onChange={onDoctorInfoSwitchChange}
                      checked={
                        printSettings?.header_footer?.header?.doctor_info
                          ?.enable === "Y"
                          ? true
                          : false
                      }
                    />
                  </Col>
                </Row>

                {printSettings?.header_footer?.header?.doctor_info?.enable ===
                  "Y" && (
                  <>
                    <Form.Item>
                      <Radio.Group
                        className={`d-flex gender-radio ${
                          isMobile ? "segmented-radio-mobile" : ""
                        }`}
                        onChange={onDoctorInfoPlaceChange}
                        value={
                          printSettings?.header_footer?.header?.doctor_info
                            ?.place
                        }
                      >
                        <Radio.Button className="w-100 text-center" value="L">
                          Left
                        </Radio.Button>
                        <Radio.Button className="w-100 text-center" value="R">
                          Right
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    <div className="mt-3">
                      <Form.Item>
                        <label className="mb-1">Header</label>
                        <Input
                          className="inputheight41-group"
                          placeholder="Enter Doctor Name"
                          onChange={onDoctorInfoHeaderChange}
                          value={
                            printSettings?.header_footer?.header?.doctor_info
                              ?.header
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="mt-3">
                      <Form.Item>
                        <label className="mb-1">Subheader</label>
                        <TextArea
                          className="endreason-textarea subheader-textarea"
                          placeholder="Enter Information (Ex: MBBS, MD)"
                          style={{
                            resize: "none",
                          }}
                          onChange={onDoctorInfoSubHeaderChange}
                          value={
                            printSettings?.header_footer?.header?.doctor_info
                              ?.subheader
                          }
                        />
                      </Form.Item>
                    </div>
                  </>
                )}

                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-3"
                >
                  <Col lg="18">
                    <div className="title-common">Clinic's information</div>
                  </Col>
                  <Col lg="6">
                    <span className="fw-medium me-2 text-greycolor fs-16">
                      {printSettings?.header_footer?.header?.clinic_info
                        ?.enable === "Y"
                        ? "Show"
                        : "Hide"}
                    </span>
                    <Switch
                      onChange={onClinicInfoSwitchChange}
                      checked={
                        printSettings?.header_footer?.header?.clinic_info
                          ?.enable === "Y"
                          ? true
                          : false
                      }
                    />
                  </Col>
                </Row>

                {printSettings?.header_footer?.header?.clinic_info?.enable ===
                  "Y" && (
                  <>
                    <Form.Item>
                      <Radio.Group
                        className={`d-flex gender-radio ${
                          isMobile ? "segmented-radio-mobile" : ""
                        }`}
                        onChange={onClinicInfoPlaceChange}
                        value={
                          printSettings?.header_footer?.header?.clinic_info
                            ?.place
                        }
                      >
                        <Radio.Button className="w-100 text-center" value="L">
                          Left
                        </Radio.Button>
                        <Radio.Button className="w-100 text-center" value="R">
                          Right
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    <div className="mt-3">
                      <Form.Item>
                        <label className="mb-1">Header</label>
                        <Input
                          className="inputheight41-group"
                          placeholder="Enter Clinic Name"
                          onChange={onClinicInfoHeaderChange}
                          value={
                            printSettings?.header_footer?.header?.clinic_info
                              ?.header
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="mt-3">
                      <Form.Item>
                        <label className="mb-1">Subheader</label>
                        <TextArea
                          className="endreason-textarea subheader-textarea"
                          placeholder="Enter Clinic Address"
                          style={{
                            resize: "none",
                          }}
                          onChange={onClinicInfoSubHeaderChange}
                          value={
                            printSettings?.header_footer?.header?.clinic_info
                              ?.subheader
                          }
                        />
                      </Form.Item>
                    </div>
                  </>
                )}

                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-3"
                >
                  <Col lg="18">
                    <div className="title-common">Logo on Header</div>
                  </Col>
                  <Col lg="6">
                    <span className="fw-medium me-2 text-greycolor fs-16">
                      {printSettings?.logo_enable === "Y" ? "Show" : "Hide"}
                    </span>
                    <Switch
                      onChange={onLogoSwitchChange}
                      checked={
                        printSettings?.logo_enable === "Y" ? true : false
                      }
                    />
                  </Col>
                </Row>

                {printSettings?.logo_enable === "Y" && (
                  <div className="upload-headfoot upload-headfoot2 p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      {fileLogo && fileLogo?.imageShow ? (
                        <img
                          style={{
                            height: 62,
                            objectFit: "contain",
                            overflow: "hidden",
                          }}
                          src={fileLogo?.showFile}
                        />
                      ) : (
                        <div className="text-start fontroboto">
                          Upload a picture of your
                          <br /> Logo
                        </div>
                      )}
                      <div
                        className="btn btn-input btn-41 d-flex align-items-center justify-content-center"
                        onClick={() => inputLogoFile.current?.click()}
                      >
                        <input
                          key={Math.random()}
                          ref={inputLogoFile}
                          style={{ display: "none" }}
                          type="file"
                          accept="image/png"
                          onChange={handleLogoChange}
                        />
                        <span>
                          <i className="icon-upload me-2"></i>
                          {fileLogo && fileLogo?.imageShow
                            ? "Change"
                            : "Upload"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <Form.Item>
                    <label className="mb-1">Footer Text</label>
                    <Input
                      className="inputheight41-group"
                      placeholder="Enter Footer Text"
                      onChange={onFooterTextChange}
                      value={printSettings?.header_footer?.footer?.title}
                    />
                  </Form.Item>
                </div>

                <div className="mt-3">
                  <Form.Item>
                    <label className="mb-1">Footer Font Size</label>
                    <Select
                      className="autocomplete-custom"
                      placeholder="Select footer font size"
                      options={FONTS_SIZE_LIST}
                      value={printSettings?.header_footer?.footer?.font_size}
                      onSelect={onSelectFooterFontSize}
                      allowClear
                    />
                  </Form.Item>
                </div>

                <div className="mt-5">
                  <Row
                    justify="space-between"
                    className="align-items-center form_addnewpatient mb-1"
                  >
                    <Col lg="24">
                      <div className="title-common">
                        Set page margins to display your own letterhead
                      </div>
                    </Col>
                  </Row>
                  <div className="">
                    <div className="my-3 text-center">
                      <label className="mb-1">Top (cm)</label> <br />
                      <Input
                        className="inputheight41-group"
                        value={
                          printSettings?.header_footer?.custom_letterhead_margin
                            ?.top
                        }
                        onChange={onCustomLetterheadTopMarginChange}
                        style={{ width: 70 }}
                      />
                    </div>
                    <Row className="align-items-center justify-content-around form_addnewpatient mb-1">
                      <Col lg="6">
                        <div className="text-center">
                          <label className="mb-1">Left (cm)</label> <br />
                          <Input
                            className="inputheight41-group"
                            value={
                              printSettings?.header_footer
                                ?.custom_letterhead_margin?.left
                            }
                            onChange={onCustomLetterheadLeftMarginChange}
                            style={{ width: 70 }}
                          />
                        </div>
                      </Col>
                      <Col lg="12">
                        <img src={rxDisplayArea} />
                      </Col>
                      <Col lg="6">
                        <div className="text-center">
                          <label className="mb-1">Right (cm)</label> <br />
                          <Input
                            className="inputheight41-group"
                            value={
                              printSettings?.header_footer
                                ?.custom_letterhead_margin?.right
                            }
                            onChange={onCustomLetterheadRightMarginChange}
                            style={{ width: 70 }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="my-3 text-center">
                      <Input
                        className="inputheight41-group"
                        value={
                          printSettings?.header_footer?.custom_letterhead_margin
                            ?.bottom
                        }
                        onChange={onCustomLetterheadBottomMarginChange}
                        style={{ width: 70 }}
                      />{" "}
                      <br />
                      <label className="mb-1">Bottom (cm)</label>
                    </div>
                  </div>
                </div>
              </div>
            ) : printSettings?.letterhead_format === 1 ? (
              //For Upload Letter head tab
              <div className="mt-5">
                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-1"
                >
                  <Col lg="24">
                    <div className="title-common">
                      Upload your header and footer image
                    </div>
                  </Col>
                </Row>
                <div className="upload-headfoot">
                  {fileHeader && fileHeader?.imageShow ? (
                    <>
                      <img
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          overflow: "hidden",
                        }}
                        src={fileHeader?.showFile}
                      />
                      <Button
                        className="btn btn-headfoot"
                        onClick={() => inputHeaderFile.current?.click()}
                      >
                        <i className="icon-Edit me-1"></i>Edit
                      </Button>
                    </>
                  ) : (
                    <>
                      <div
                        className="fw-medium text-decoration-underline cursor-pointer"
                        onClick={() => inputHeaderFile.current?.click()}
                      >
                        Upload Header
                      </div>
                      <div className="fs-12-1 fontroboto">
                        {" "}
                        Only jpg, jpeg or png files with the max size 2mb.
                      </div>
                    </>
                  )}
                  <input
                    key={Math.random()}
                    ref={inputHeaderFile}
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderChange}
                  />
                  <CommonModal
                    handleCancel={true}
                    isModalOpen={isHeaderModalOpen}
                    onCancel={showHideHeaderModal}
                    modalWidth={744}
                    title={
                      <div className="d-flex">
                        <div className="align-items-center d-flex w-100">
                          <div className="text-truncate-twolines">
                            {"Crop Image"}
                          </div>
                        </div>
                        <Button
                          type="button"
                          disabled={
                            fileHeader && !fileHeader?.crop ? false : true
                          }
                          className="btn-41 btn px-4 btn-primary3 me-4"
                          onClick={onHeaderImageSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    }
                    modalBody={
                      <>
                        <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                          {fileHeader && fileHeader.crop ? (
                            <Cropper
                              ref={cropperHeaderRef}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              preview=".img-preview"
                              src={
                                fileHeader
                                  ? fileHeader?.showFile
                                  : defaultprofile
                              }
                              viewMode={3}
                              background={false}
                              autoCropArea={0.3}
                              guides={false}
                            />
                          ) : (
                            <img
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              src={
                                fileHeader
                                  ? fileHeader?.showFile
                                  : defaultprofile
                              }
                            />
                          )}
                        </div>
                        <div className="mt-4">
                          <div className="d-flex align-items-center mt-2 justify-content-between">
                            <div
                              className="fw-normal text-decoration-underline btn p-0 text-main"
                              onClick={showHideHeaderModal}
                            >
                              {fileHeader && !fileHeader?.crop ? "" : "Discard"}
                            </div>
                            <div
                              className="fw-normal text-decoration-underline btn p-0 text-main"
                              onClick={() =>
                                fileHeader && !fileHeader?.crop
                                  ? getHeaderCropChangeData()
                                  : getHeaderCropData()
                              }
                            >
                              {fileHeader && !fileHeader?.crop
                                ? "Change"
                                : "Save"}
                            </div>
                          </div>
                        </div>
                      </>
                    }
                  />
                </div>
                <div className="upload-headfoot">
                  {fileFooter && fileFooter?.imageShow ? (
                    <>
                      <img
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          overflow: "hidden",
                        }}
                        src={fileFooter?.showFile}
                      />
                      <Button
                        className="btn btn-headfoot"
                        onClick={() => inputFooterFile.current?.click()}
                      >
                        <i className="icon-Edit me-1"></i>Edit
                      </Button>
                    </>
                  ) : (
                    <>
                      <div
                        className="fw-medium text-decoration-underline cursor-pointer"
                        onClick={() => inputFooterFile.current?.click()}
                      >
                        Upload Footer
                      </div>
                      <div className="fs-12-1 fontroboto">
                        {" "}
                        Only jpg, jpeg or png files with the max size 2mb.
                      </div>
                    </>
                  )}
                  <input
                    key={Math.random()}
                    ref={inputFooterFile}
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    onChange={handleFooterChange}
                  />
                  <CommonModal
                    handleCancel={true}
                    isModalOpen={isFooterModalOpen}
                    onCancel={showHideFooterModal}
                    modalWidth={744}
                    title={
                      <div className="d-flex">
                        <div className="align-items-center d-flex w-100">
                          <div className="text-truncate-twolines">
                            {"Crop Image"}
                          </div>
                        </div>
                        <Button
                          type="button"
                          disabled={
                            fileFooter && !fileFooter?.crop ? false : true
                          }
                          className="btn-41 btn px-4 btn-primary3 me-4"
                          onClick={onFooterImageSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    }
                    modalBody={
                      <>
                        <div className="d-flex image-crop bg-dark justify-content-center align-items-center">
                          {fileFooter && fileFooter.crop ? (
                            <Cropper
                              ref={cropperFooterRef}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              preview=".img-preview"
                              src={
                                fileFooter
                                  ? fileFooter?.showFile
                                  : defaultprofile
                              }
                              viewMode={3}
                              background={false}
                              autoCropArea={0.3}
                              guides={false}
                            />
                          ) : (
                            <img
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                              src={
                                fileFooter
                                  ? fileFooter?.showFile
                                  : defaultprofile
                              }
                            />
                          )}
                        </div>
                        <div className="mt-4">
                          <div className="d-flex align-items-center mt-2 justify-content-between">
                            <div
                              className="fw-normal text-decoration-underline btn p-0 text-main"
                              onClick={showHideFooterModal}
                            >
                              {fileFooter && !fileFooter?.crop ? "" : "Discard"}
                            </div>
                            <div
                              className="fw-normal text-decoration-underline btn p-0 text-main"
                              onClick={() =>
                                fileFooter && !fileFooter?.crop
                                  ? getFooterCropChangeData()
                                  : getFooterCropData()
                              }
                            >
                              {fileFooter && !fileFooter?.crop
                                ? "Change"
                                : "Save"}
                            </div>
                          </div>
                        </div>
                      </>
                    }
                  />
                </div>
                <div className="mt-5">
                  <Row
                    justify="space-between"
                    className="align-items-center form_addnewpatient mb-1"
                  >
                    <Col lg="24">
                      <div className="title-common">
                        Set page margins to display your own letterhead
                      </div>
                    </Col>
                  </Row>
                  <div className="">
                    <div className="my-3 text-center">
                      <label className="mb-1">Top (cm)</label> <br />
                      <Input
                        className="inputheight41-group"
                        value={
                          printSettings?.header_footer
                            ?.uploaded_letterhead_margin?.top
                        }
                        onChange={onUploadedLetterheadTopMarginChange}
                        style={{ width: 70 }}
                      />
                    </div>
                    <Row className="align-items-center justify-content-around form_addnewpatient mb-1">
                      <Col lg="6">
                        <div className="text-center">
                          <label className="mb-1">Left (cm)</label> <br />
                          <Input
                            className="inputheight41-group"
                            value={
                              printSettings?.header_footer
                                ?.uploaded_letterhead_margin?.left
                            }
                            onChange={onUploadedLetterheadLeftMarginChange}
                            style={{ width: 70 }}
                          />
                        </div>
                      </Col>
                      <Col lg="12">
                        <img src={rxDisplayArea} />
                      </Col>
                      <Col lg="6">
                        <div className="text-center">
                          <label className="mb-1">Right (cm)</label> <br />
                          <Input
                            className="inputheight41-group"
                            value={
                              printSettings?.header_footer
                                ?.uploaded_letterhead_margin?.right
                            }
                            onChange={onUploadedLetterheadRightMarginChange}
                            style={{ width: 70 }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="my-3 text-center">
                      <Input
                        className="inputheight41-group"
                        value={
                          printSettings?.header_footer
                            ?.uploaded_letterhead_margin?.bottom
                        }
                        onChange={onUploadedLetterheadBottomMarginChange}
                        style={{ width: 70 }}
                      />{" "}
                      <br />
                      <label className="mb-1">Bottom (cm)</label>
                    </div>
                  </div>
                </div>
                {caseManagerData !== undefined && (
                  <>
                    <Row
                      justify="space-between"
                      className="align-items-center form_addnewpatient mb-1"
                    >
                      <Col lg="18">
                        <div className="title-common">
                          <img
                            className="img-fluid me-2"
                            width={25}
                            src={wtsp}
                            alt="Header"
                          />{" "}
                          See WhatsApp Rx preview{" "}
                        </div>
                      </Col>
                      <Col lg="6">
                        <div
                          className="d-flex align-items-center"
                          onClick={handleDrawerWhatsappView}
                        >
                          <i className="icon-Preview"></i>
                          <button className="btn btn-text">
                            <span>Preview Now</span>
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
              </div>
            ) : (
              printSettings?.letterhead_format === 2 && (
                // For Own Letterhead tab
                <div className="mt-5">
                  <Row
                    justify="space-between"
                    className="align-items-center form_addnewpatient mb-1"
                  >
                    <Col lg="24">
                      <div className="title-common">
                        Set page margins to display your own letterhead
                      </div>
                    </Col>
                  </Row>
                  <div className="">
                    <div className="my-3 text-center">
                      <label className="mb-1">Top (cm)</label> <br />
                      <Input
                        className="inputheight41-group"
                        value={printSettings?.header_footer?.margin?.top}
                        onChange={onTopMarginChange}
                        style={{ width: 70 }}
                      />
                    </div>
                    <Row className="align-items-center justify-content-around form_addnewpatient mb-1">
                      <Col lg="6">
                        <div className="text-center">
                          <label className="mb-1">Left (cm)</label> <br />
                          <Input
                            className="inputheight41-group"
                            value={printSettings?.header_footer?.margin?.left}
                            onChange={onLeftMarginChange}
                            style={{ width: 70 }}
                          />
                        </div>
                      </Col>
                      <Col lg="12">
                        <img src={rxDisplayArea} />
                      </Col>
                      <Col lg="6">
                        <div className="text-center">
                          <label className="mb-1">Right (cm)</label> <br />
                          <Input
                            className="inputheight41-group"
                            value={printSettings?.header_footer?.margin?.right}
                            onChange={onRightMarginChange}
                            style={{ width: 70 }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="my-3 text-center">
                      <Input
                        className="inputheight41-group"
                        value={printSettings?.header_footer?.margin?.bottom}
                        onChange={onBottomMarginChange}
                        style={{ width: 70 }}
                      />{" "}
                      <br />
                      <label className="mb-1">Bottom (cm)</label>
                    </div>
                  </div>

                  {caseManagerData !== undefined && (
                    <>
                      <Row
                        justify="space-between"
                        className="align-items-center form_addnewpatient mb-1"
                      >
                        <Col lg="18">
                          <div className="title-common">
                            <img
                              className="img-fluid me-2"
                              width={25}
                              src={wtsp}
                              alt="Header"
                            />{" "}
                            See WhatsApp Rx preview{" "}
                          </div>
                          <div
                            className="fontroboto text-greycolor"
                            style={{ marginLeft: 37, fontSize: 13 }}
                          >
                            {" "}
                            You can edit your WhatsApp preview{" "}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div
                            className="d-flex align-items-center"
                            onClick={handleDrawerOwnLetterHead}
                          >
                            <i className="icon-Preview"></i>
                            <button className="btn btn-text">
                              <span>Preview Now</span>
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {caseManagerData !== undefined && (
        <div className="border-bottom pb-3 mb-3">
          <Row
            justify="space-between"
            className="align-items-center form_addnewpatient mb-1"
          >
            <Col lg="18">
              <div className="titleprint">Display Patient Info</div>
            </Col>
            <Col lg="6">
              <Button
                className="btn rounded-10px px-1 border px-3-15"
                style={{
                  transform: patientInfoShowHide
                    ? "rotate(90deg)"
                    : "rotate(-90deg)",
                }}
                onClick={onPatientInfoClick}
              >
                <i className="icon-right"></i>
              </Button>
            </Col>
          </Row>
          <div>Manage your patient information</div>
          {patientInfoShowHide && (
            <div className="mt-4">
              <div className="mt-4">
                <Row
                  justify="space-between"
                  className="align-items-center form_addnewpatient mb-3"
                >
                  <Col lg={24}>
                    <DndContext
                      modifiers={[restrictToVerticalAxis]}
                      onDragEnd={onDragEndPatientInfo}
                    >
                      <SortableContext
                        // rowKey array
                        items={printSettings?.header_footer?.patient_info?.map(
                          (i) => i.id
                        )}
                        strategy={verticalListSortingStrategy}
                      >
                        <Table
                          className="customize-table table-display-patient"
                          pagination={false}
                          components={{
                            body: {
                              row: CustomRow,
                            },
                          }}
                          rowKey="id"
                          columns={patientInfoTable}
                          dataSource={
                            printSettings?.header_footer?.patient_info
                          }
                          showHeader={false}
                        />
                      </SortableContext>
                    </DndContext>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-3">
        <Row
          justify="space-between"
          className="align-items-center form_addnewpatient mb-1"
        >
          <Col lg="18">
            <div className="titleprint">Other Settings</div>
          </Col>
          <Col lg="6">
            <Button
              className="btn rounded-10px px-1 border px-3-15"
              style={{
                transform: settingsShowHide
                  ? "rotate(90deg)"
                  : "rotate(-90deg)",
              }}
              onClick={onSettingsClick}
            >
              <i className="icon-right"></i>
            </Button>
          </Col>
        </Row>
        <div>Customize your watermark, signature, and QR code</div>

        {settingsShowHide && (
          <div className="mt-4">
            <div className="mb-3">
              <Row
                justify="space-between"
                className="align-items-center form_addnewpatient"
              >
                <Col lg="18">
                  <div className="title-common">Watermark</div>
                </Col>
                <Col lg="6">
                  <Switch
                    onChange={onWatermarkSwitchChange}
                    checked={
                      printSettings?.water_mark_enable === "Y" ? true : false
                    }
                  />
                </Col>
              </Row>
              {printSettings?.water_mark_enable === "Y" && (
                <div className="upload-headfoot upload-headfoot1 p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <img
                      style={{
                        height: 62,
                        objectFit: "contain",
                        overflow: "hidden",
                      }}
                      src={
                        fileWatermark && fileWatermark?.imageShow
                          ? fileWatermark?.showFile
                          : defaultprofile
                      }
                    />
                    <div
                      className="btn btn-input btn-41 d-flex align-items-center justify-content-center"
                      onClick={() => inputWatermarkFile.current?.click()}
                    >
                      <input
                        key={Math.random()}
                        ref={inputWatermarkFile}
                        style={{ display: "none" }}
                        type="file"
                        accept="image/png"
                        onChange={handleWatermarkChange}
                      />
                      <span>
                        <i className="icon-upload me-2"></i>
                        {fileWatermark && fileWatermark?.imageShow
                          ? "Change"
                          : "Upload New"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Row
                justify="space-between"
                className="align-items-center form_addnewpatient mb-3"
              >
                <Col lg="18">
                  <div className="title-common">Signature</div>
                </Col>
                <Col lg="6">
                  <Switch
                    onChange={onSignatureSwitchChange}
                    checked={
                      printSettings?.signature_enable === "Y" ? true : false
                    }
                  />
                </Col>
              </Row>
              {printSettings?.signature_enable === "Y" && (
                <div>
                  <Form.Item className="mb-0 mt-3">
                    <Radio.Group
                      className={`d-flex gender-radio ${
                        isMobile ? "segmented-radio-mobile" : ""
                      }`}
                      onChange={onSignaturePlaceChange}
                      value={
                        printSettings?.header_footer?.other_settings
                          ?.signature_place
                      }
                    >
                      <Radio.Button className="w-100 text-center" value="L">
                        Left
                      </Radio.Button>
                      <Radio.Button className="w-100 text-center" value="R">
                        Right
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <div className="border rounded-10px mt-3">
                    <div className="upload-headfoot border-0 border-bottom rounded-bottom-0 mt-0">
                      {fileSignature && fileSignature?.imageShow ? (
                        <>
                          <img
                            style={{
                              width: "100%",
                              objectFit: "contain",
                              overflow: "hidden",
                            }}
                            src={fileSignature?.showFile}
                          />
                          <Button
                            className="btn btn-headfoot btn-headfoot2 px-2"
                            onClick={onRemoveSignature}
                          >
                            <i className="icon-delete"></i>
                          </Button>
                          <Button
                            className="btn btn-headfoot px-2"
                            onClick={showHideSignatureModal}
                          >
                            <i className="icon-Edit"></i>
                          </Button>
                        </>
                      ) : (
                        <div
                          className="fw-medium text-decoration-underline cursor-pointer"
                          onClick={showHideSignatureModal}
                        >
                          Draw or Upload Signature
                        </div>
                      )}
                      <CommonModal
                        handleCancel={true}
                        isModalOpen={isSignatureModalOpen}
                        onCancel={showHideSignatureModal}
                        modalWidth={744}
                        title={
                          <div className="d-flex">
                            <div className="align-items-center d-flex w-100">
                              <div className="text-truncate-twolines">
                                {"Signature Image"}
                              </div>
                            </div>
                            <Button
                              type="button"
                              disabled={
                                fileSignature && fileSignature?.preview
                                  ? false
                                  : true
                              }
                              className="btn-41 btn px-4 btn-primary3 me-4"
                              onClick={onSignatureImageSubmit}
                            >
                              Submit
                            </Button>
                          </div>
                        }
                        modalBody={
                          <>
                            <div>
                              <div className="rounded-top-3 bg-body border border-bottom-0 d-flex align-items-center justify-content-between p-2">
                                <div className="fw-medium fontroboto text-main ms-2">
                                  {"Draw Signature"}
                                </div>
                                <div>
                                  <Form.Item className="mb-0">
                                    <Radio.Group
                                      className={`d-flex gender-radio draw-upload ${
                                        isMobile ? "segmented-radio-mobile" : ""
                                      }`}
                                      onChange={onSignatureModeChange}
                                      value={signatureMode}
                                    >
                                      <Radio.Button
                                        className="w-100 text-center"
                                        value="L"
                                      >
                                        <div className="d-flex align-items-center">
                                          <i className="fs-18 icon-Edit me-1"></i>
                                          <span className="fontroboto fs-12-1 fw-medium">
                                            Draw
                                          </span>
                                        </div>
                                      </Radio.Button>
                                      <Radio.Button
                                        className="w-100 text-center"
                                        value="R"
                                      >
                                        <div className="d-flex align-items-center">
                                          <i className="fs-16 icon-upload me-1"></i>
                                          <span className="fontroboto fs-12-1 fw-medium">
                                            Upload
                                          </span>
                                        </div>
                                      </Radio.Button>
                                    </Radio.Group>
                                  </Form.Item>
                                </div>
                              </div>
                              <div className="d-flex image-crop border justify-content-center align-items-center">
                                {signatureMode === "L" ? (
                                  <SignatureCanvas
                                    ref={signatureRef}
                                    canvasProps={{ width: 694, height: 189 }}
                                  />
                                ) : (
                                  <>
                                    {fileSignature && fileSignature.crop ? (
                                      <Cropper
                                        ref={cropperSignatureRef}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "contain",
                                        }}
                                        preview=".img-preview"
                                        src={
                                          fileSignature
                                            ? fileSignature?.readFile
                                            : defaultprofile
                                        }
                                        viewMode={3}
                                        background={false}
                                        autoCropArea={0.3}
                                        guides={false}
                                      />
                                    ) : (
                                      <>
                                        <div
                                          className="fw-medium text-decoration-underline cursor-pointer"
                                          onClick={() =>
                                            inputSignatureFile.current?.click()
                                          }
                                        >
                                          Upload Signature
                                        </div>
                                        <input
                                          key={Math.random()}
                                          ref={inputSignatureFile}
                                          style={{ display: "none" }}
                                          type="file"
                                          accept="image/*"
                                          onChange={handleSignatureChange}
                                        />
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="d-flex align-items-center justify-content-between rounded-bottom-3 border border-top-0 p-2">
                                <div
                                  className="fw-medium text-decoration-underline btn p-0 text-main"
                                  onClick={onResetSignature}
                                >
                                  {"Reset"}
                                </div>
                                <div
                                  className="fw-medium text-decoration-underline btn p-0 text-main"
                                  onClick={handleTrim}
                                >
                                  {fileSignature && fileSignature?.preview
                                    ? "Change"
                                    : "Save"}
                                </div>
                              </div>
                              <div className="mt-4">
                                <div className="fw-normal text-main fw-medium fontroboto mb-1">
                                  {"Signature Preview"}
                                </div>
                                <div
                                  style={{
                                    height: 100,
                                    width: 200,
                                    border: "1px solid",
                                    borderColor: "#E2E2EA",
                                    backgroundColor: "#FAFAFB",
                                    borderRadius: "10px",
                                  }}
                                >
                                  {fileSignature && fileSignature?.preview && (
                                    <img
                                      style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "contain",
                                        overflow: "hidden",
                                      }}
                                      src={fileSignature?.showFile}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        }
                      />
                    </div>
                    <div className="p-3">
                      <div className="title-common mb-3">
                        Include in signature
                      </div>
                      <div className="mb-3">
                        <Checkbox
                          className="switch-name-check"
                          onChange={onSignatureCheckbox1Change}
                          checked={
                            printSettings?.header_footer?.other_settings
                              ?.name_of_doctor_enable != "Y"
                              ? false
                              : true
                          }
                        >
                          Name of Doctor
                        </Checkbox>
                      </div>
                      <div className="mb-3">
                        <Checkbox
                          className="switch-name-check"
                          onChange={onSignatureCheckbox2Change}
                          checked={
                            printSettings?.header_footer?.other_settings
                              ?.registration_no_enable != "Y"
                              ? false
                              : true
                          }
                        >
                          Medical Registration Number
                        </Checkbox>
                      </div>
                      <div className="mb-3">
                        <Checkbox
                          className="switch-name-check"
                          onChange={onSignatureCheckbox3Change}
                          checked={
                            printSettings?.header_footer?.other_settings
                              ?.qualification_enable != "Y"
                              ? false
                              : true
                          }
                        >
                          Qualifications
                        </Checkbox>
                      </div>
                      <TextArea
                        className="endreason-textarea h-76"
                        placeholder="Enter qualification e.g. MBBS, MS, MD"
                        style={{
                          resize: "none",
                        }}
                        onChange={onSignatureQualificationChange}
                        value={
                          printSettings?.header_footer?.other_settings
                            ?.qualification
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Row
                justify="space-between"
                className="align-items-center form_addnewpatient mb-3"
              >
                <Col lg="18">
                  <div className="title-common">Show QR code</div>
                </Col>
                <Col lg="6">
                  <Switch
                    onChange={onShowQrSwitchChange}
                    checked={
                      printSettings?.qrcode_enable === "Y" ? true : false
                    }
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillHeaderFooterLayout;
