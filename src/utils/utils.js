import moment from "moment";

import config from "../config";
import { message } from "antd";
import {
  MESSAGE_KEY,
  NEO_NATOLOGISTS_DP_ID,
  PAEDIATRICS_DP_ID,
  SNAP_RX_TOKENS_STORAGE_KEY,
} from "../utils/constants";
import { browserName, deviceDetect, isBrowser } from "react-device-detect";
import html2pdf from "html2pdf.js";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../src/firebase.js";
import { getDecodedToken } from "./localStorage.js";
import imageCompression from "browser-image-compression";
import numeral from "numeral";
import packageJson from "../../package.json";
import { EVENTS } from "./events.js";
import {
  AISENSY_SCRIPT_CONTAINER,
  AISENSY_SCRIPT_ID,
  AISENSY_SCRIPT_SRC,
} from "../utils/constants";
import { env } from "../EnvironmentConfig.js";
import { uploadDocsToAzure } from "../pages/medicalRecords/service.js";
// export const validateEmail = (email) => {
//   return String(email)
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// };

export const aisensybotInjection = (isLoginFlow) => {
  // If in login flow, remove the script and widget
  if (isLoginFlow) {
    const existingScript = document.getElementById(AISENSY_SCRIPT_ID);
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    // Also remove any injected widget container/button
    const widget = document.querySelector(AISENSY_SCRIPT_CONTAINER);
    if (widget) widget.remove();
    if (typeof window.dfToggle === "function") {
      window.dfToggle = () => {};
    }
    return;
  }

  // If signup → inject script
  if (!document.getElementById(AISENSY_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.src = AISENSY_SCRIPT_SRC;
    script.id = AISENSY_SCRIPT_ID;
    script.setAttribute("widget-id", "aaa4hg");
    script.async = true;
    document.body.appendChild(script);
  }
};

export const validateEmail = (email) => {
  let reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(String(email).toLowerCase());
};

// export const isValidWebsite = (url) => {
//   const pattern = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
//   return pattern.test(url);
// }

export const isValidWebsite = (url, account) => {
  const patterns = {
    facebook:
      /^https?:\/\/(www\.)?facebook\.com\/(profile\.php\?id=\d+|[A-Za-z0-9.]+)\/?$/,
    instagram:
      /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?(?:\?[^\s]*)?$/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-._]+\/?$/,
    twitter:
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}(?:\?[^\s]*)?\/?$/,
    youtube:
      /^https?:\/\/(www\.)?(youtube\.com\/(channel\/[A-Za-z0-9_-]+|user\/[A-Za-z0-9_-]+|@?[A-Za-z0-9._-]+)|youtu\.be\/[A-Za-z0-9_-]+)(\?[^\s]*)?$/,
  };
  const pattern = patterns[account];
  if (pattern) {
    return pattern.test(url.trim());
  }
  return false;
};

export const isValidMap = (url) => {
  const pattern =
    /^https?:\/\/(www\.)?(google\.[a-z]{2,3}(?:\.[a-z]{2})?|maps\.app\.goo\.gl)\/(maps\/)?[a-zA-Z0-9?=&,.;_-]*$/;
  return pattern.test(url);
};

export const removeSpecialCharectorWithoutDotSpace = (text) => {
  return text.replace(/[^\w. ]/g, "");
};

export const replaceCommasAndSemicolons = (text) => {
  return text.replace(/[;,]/g, "");
};

export const blockedEmoji = (text) => {
  return text.replace(
    /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F980}-\u{1FAFF}]/gu,
    ""
  );
};

export const onlyNumberFormat = (text) => {
  return text.replace(/[^0-9]/g, "");
};
export const onlyDecimalFormat = (text) => {
  return text.match(/([0-9]*[\.]{0,1}[0-9]{0,2})/s)[0];
};
export const removeBeforeWhiteSpace = (text) => {
  return text.replace(/^[ ]+/g, "");
};

export const removeWhiteSpace = (text) => {
  return text.replace(/[ ]+/g, "");
};

export const frequencyFormat = (str) => {
  return /^(?!-)[\d.\s-]+$/.test(str);
};

export const hasNumber = (str) => {
  return /\d/.test(str);
};

export const isNumeric = (str) => {
  return /^[0-9]\d*$/.test(str);
};

export const isAlphabet = (str) => {
  return /^[a-zA-z\s]*$/.test(str);
};

export const isAlphabetExit = (str) => {
  return /[a-zA-Z]/.test(str);
};

export const capitalizeAfterSentence = (text) => {
  const regex = /([.?!]\s*|^)([a-z])/g;
  return text.replace(regex, (match, p1, p2) => p1 + p2.toUpperCase());
};

export const capitalizeFirstLetter = (text) => {
  if (!text) return ""; // Handle empty string case
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeFirstWordOnly = (text) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length === 0) return "";
  const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  const remainingWords = words.slice(1);

  return [firstWord, ...remainingWords].join(" ");
};
export const capitalize = (str, lower = false) =>
  (lower ? str?.toLowerCase() : str)?.replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

export const makeDefaultLogo = (text) => {
  var fullName = text !== undefined ? text.trim() : "";
  if (!fullName) {
    return "HG";
  }
  const regex = /\s+/;
  const results = fullName.split(regex);
  if (results.length === 1) {
    return results[0][0].toUpperCase();
  } else {
    const letter = `${results[0][0].toUpperCase()}${results[1][0].toUpperCase()}`;
    return letter;
  }
  // if (fullName?.includes(" ")) {
  //   try {
  //     const letter = `${fullName.split(" ")[0][0].toUpperCase()}${fullName.split(" ")[1][0].toUpperCase()}`;
  //     return letter;
  //   } catch (e) {
  //     return `${fullName.split(" ")[0][0]}`;
  //   }
  // } else {
  //   return `${fullName.split(" ")[0][0]}`;
  // }
};

export const frequencyCombination = (text) => {
  // const array = ['0', '1/2', '1/3', '1/4', '3/4', '1', '2']
  // const array = ['0', '0.5', '0.33', '0.25', '0.75', '1', '2']
  const array = ["0", "1"];
  const results = text;
  let makeArray = [];

  if (
    results.split("-")[0] &&
    !results.split("-")[1] &&
    !results.split("-")[2] &&
    !results.split("-")[3]
  ) {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        makeArray.push(`${results.split("-")[0]}-${array[i]}-${array[j]}`);
      }
    }
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        for (let k = 0; k < array.length; k++) {
          makeArray.push(
            `${results.split("-")[0]}-${array[i]}-${array[j]}-${array[k]}`
          );
        }
      }
    }
  } else if (
    results.split("-")[0] &&
    results.split("-")[1] &&
    !results.split("-")[2] &&
    !results.split("-")[3]
  ) {
    for (let i = 0; i < array.length; i++) {
      makeArray.push(
        `${results.split("-")[0]}-${results.split("-")[1]}-${array[i]}`
      );
    }
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        makeArray.push(
          `${results.split("-")[0]}-${results.split("-")[1]}-${array[i]}-${
            array[j]
          }`
        );
      }
    }
  } else if (
    results.split("-")[0] &&
    results.split("-")[1] &&
    results.split("-")[2] &&
    !results.split("-")[3]
  ) {
    makeArray.push(
      `${results.split("-")[0]}-${results.split("-")[1]}-${
        results.split("-")[2]
      }`
    );
    for (let i = 0; i < array.length; i++) {
      makeArray.push(
        `${results.split("-")[0]}-${results.split("-")[1]}-${
          results.split("-")[2]
        }-${array[i]}`
      );
    }
  } else if (
    results.split("-")[0] &&
    results.split("-")[1] &&
    results.split("-")[2] &&
    results.split("-")[3]
  ) {
    makeArray.push(
      `${results.split("-")[0]}-${results.split("-")[1]}-${
        results.split("-")[2]
      }-${results.split("-")[3]}`
    );
  }
  return makeArray;
};

export const medicine_freq_dosage_format = (freqDosage, is_dosage_decimal) => {
  if (!!is_dosage_decimal) {
    return freqDosage;
  }
  var value = "";
  if (freqDosage == "0.5") {
    value = `1/2`;
  } else if (freqDosage == "0.25") {
    value = `1/4`;
  } else if (freqDosage == "0.75") {
    value = `3/4`;
  } else {
    value = freqDosage;
  }
  return value;
};

export const calculateDose = (dosage, weight, concentration, tmmType) => {
  const dose =
    (parseFloat(dosage) * parseFloat(weight)) / parseFloat(concentration);
  console.log(dose.toFixed(1));
  return !isNaN(dose)
    ? [
        8, 11, 23, 20, 34, 27, 9, 33, 21, 1, 17, 35, 12, 40, 10, 18, 31, 36, 2,
        19, 14, 30, 15, 13, 3, 16,
      ]?.includes(parseInt(tmmType))
      ? Math.round(dose.toFixed(1))
      : dose.toFixed(1).replace(/\.0$/, "")
    : "";
};

export const formatAmount = (amount) => {
  return amount.toFixed(2).replace(/\.00$/, "");
};

export const currencyFormat = (amount) => {
  return numeral(amount).format("0,0.00").replace(/\.00$/, "");
};

export const dataUrlToFile = (url, fileName) => {
  const [mediaType, data] = url.split(",");

  const mime = mediaType.match(/:(.*?);/)?.[0];

  var n = data.length;

  const arr = new Uint8Array(n);

  while (n--) {
    arr[n] = data.charCodeAt(n);
  }

  return new File([arr], fileName, {
    type: mime.substring(1, mime.length - 1),
  });
};

export const dataUrlToFileUsingFetch = async (url, fileName, mimeType) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  return new File([buffer], fileName, { type: mimeType });
};

export const errorMessage = async (error) => {
  if (typeof error === "object" && error?.name == "TypeError") {
    return message.open({
      key: MESSAGE_KEY,
      type: "error",
      className: "error-red",
      content: (
        <div className="d-flex align-items-center">
          <div>
            <div className="title-common text-start fontroboto">Error</div>
            <div className="fontroboto text-start fw-normal mt-1">
              We're Sorry, Something went wrong. Please{" "}
              <span className="text-underline">try again</span>
            </div>
          </div>
        </div>
      ),
      duration: 2,
    });
  } else {
    return message.open({
      key: MESSAGE_KEY,
      type: "warning",
      content: typeof error === "object" ? error.message : error,
      duration: 2,
    });
  }
};

export const handleCopy = async (url, msg = "Copied") => {
  try {
    await navigator.clipboard.writeText(url);
    errorMessage(msg);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

export const inputToLabel = (htmlString) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const inputs = tempDiv.querySelectorAll("input");
  inputs.forEach((input) => {
    console.log(input.type);
    if (input.type === "date") {
      const label = document.createElement("label");
      label.className = input.className;
      // label.id = input.id;
      label.textContent = input.value;
      input.parentNode.replaceChild(label, input);
    }
  });

  return tempDiv.innerHTML;
};

export const HTMLTransformer = (htmlString) => {
  // Create a temporary container to parse the HTML string
  let tempContainer = document.createElement("div");
  tempContainer.innerHTML = htmlString;

  // Select all label elements
  let labels = tempContainer.querySelectorAll("label");

  // Iterate over the labels and replace innerHTML content based on the class
  labels.forEach((label) => {
    if (label.classList.contains("consulting_doctor")) {
      replaceContent(label, "{Consulting Doctor}");
    } else if (label.classList.contains("patient_name")) {
      replaceContent(label, "{Patient Name}");
    } else if (label.classList.contains("age")) {
      replaceContent(label, "{Age}");
    } else if (label.classList.contains("contact_number")) {
      replaceContent(label, "{Contact Number}");
    } else if (label.classList.contains("gender")) {
      replaceContent(label, "{Gender}");
    } else if (label.classList.contains("email")) {
      replaceContent(label, "{Email}");
    } else if (label.classList.contains("patient_id")) {
      replaceContent(label, "{Patient ID}");
    } else if (label.classList.contains("address")) {
      replaceContent(label, "{Address}");
    } else if (label.classList.contains("blood_group")) {
      replaceContent(label, "{Blood Group}");
    } else if (label.classList.contains("date_of_birth")) {
      replaceContent(label, "{Date of Birth}");
    } else if (label.classList.contains("today_date")) {
      replaceContent(label, "{Today Date}");
    } else if (label.classList.contains("department")) {
      replaceContent(label, "{Department}");
    } else if (label.classList.contains("referred_by")) {
      replaceContent(label, "{Referred by}");
    } else if (label.classList.contains("case_type")) {
      replaceContent(label, "{Case Type}");
    } else if (label.classList.contains("last_appointment")) {
      replaceContent(label, "{Last appointment}");
    } else if (label.classList.contains("inpatient_number")) {
      replaceContent(label, "{Inpatient Number}");
    } else if (label.classList.contains("ward")) {
      replaceContent(label, "{Ward}");
    } else if (label.classList.contains("room_bed")) {
      replaceContent(label, "{Room/Bed}");
    } else if (label.classList.contains("admitting_doctor")) {
      replaceContent(label, "{Admitting Doctor}");
    } else if (label.classList.contains("admitting_date")) {
      replaceContent(label, "{Admitting Date}");
    } else if (label.classList.contains("admitting_time")) {
      replaceContent(label, "{Admitting Time}");
    } else if (label.classList.contains("discharge_date")) {
      replaceContent(label, "{Discharge Date}");
    } else if (label.classList.contains("discharge_time")) {
      replaceContent(label, "{Discharge Time}");
    } else if (label.classList.contains("admitted_days")) {
      replaceContent(label, "{Admitted Days}");
    } else if (label.classList.contains("admission_diagnosis")) {
      replaceContent(label, "{Admission Diagnosis}");
    } else if (label.classList.contains("discharge_diagnosis")) {
      replaceContent(label, "{Discharge Diagnosis}");
    } else if (label.classList.contains("resident_of")) {
      replaceContent(label, "{Resident of}");
    } else if (label.classList.contains("start_date")) {
      replaceContent(label, "{Start Date}");
    } else if (label.classList.contains("end_date")) {
      replaceContent(label, "{End Date}");
    } else if (label.classList.contains("join_date")) {
      replaceContent(label, "{Join Date}");
    } else if (label.classList.contains("custom_date")) {
      replaceContent(label, "{Custom Date}");
    } else if (label.classList.contains("diagnosis")) {
      replaceContent(label, "{Diagnosis}");
    } else if (label.classList.contains("time")) {
      replaceContent(label, "{Time}");
    } else if (label.classList.contains("travel_from")) {
      replaceContent(label, "{Travel From}");
    } else if (label.classList.contains("travel_to")) {
      replaceContent(label, "{Travel To}");
    } else if (label.classList.contains("photo_id_card_no")) {
      replaceContent(label, "{Photo ID card No}");
    } else if (label.classList.contains("nationality")) {
      replaceContent(label, "{Nationality}");
    } else if (label.classList.contains("passport_number")) {
      replaceContent(label, "{Passport Number}");
    } else if (label.classList.contains("procedure")) {
      replaceContent(label, "{Procedure}");
    } else if (label.classList.contains("number_of_months")) {
      replaceContent(label, "{Number of Months}");
    }
  });

  // Get the modified HTML string
  return tempContainer.innerHTML;
};

function replaceContent(element, newText) {
  // Traverse through the child nodes and replace the text nodes
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = newText;
    } else {
      replaceContent(node, newText);
    }
  });
}

export const removeLabelTags = (htmlString) => {
  // Create a temporary container to parse the HTML string
  let tempContainer = document.createElement("div");
  tempContainer.innerHTML = htmlString;

  // Select all label elements
  let labels = tempContainer.querySelectorAll("label");

  labels.forEach((label) => {
    // Create a document fragment to hold the inner content
    let fragment = document.createDocumentFragment();

    // Move all child nodes of the label into the fragment
    while (label.firstChild) {
      fragment.appendChild(label.firstChild);
    }

    // If the label has a style attribute, apply it to the nearest child element
    if (label.hasAttribute("style")) {
      if (
        fragment.firstChild &&
        fragment.firstChild.nodeType === Node.ELEMENT_NODE &&
        !fragment.firstChild.hasAttribute("style")
      ) {
        fragment.firstChild.setAttribute("style", label.getAttribute("style"));
      }
    }

    // Replace the label with its content
    label.parentNode.replaceChild(fragment, label);
  });

  // Get the modified HTML string
  return tempContainer.innerHTML;
};

export const trimEllip = (source, length) => {
  if (source == null) {
    return "";
  }
  return source.length > length ? source.substring(0, length) + "..." : source;
};

export const isLocalDev = () => {
  if (config.placeholderApiUrl.includes("ninjasforjava.com")) {
    return true;
  }

  if (window.location.includes("localhost:")) {
    return true;
  }
  return false;
};

export const getFormattedDate = (date) => {
  if (!date) {
    return "";
  }
  // const dateObj = new Date(date + " UTC");
  // return moment(dateObj).format("YYYY-MM-DD");
  return moment(date).format("YYYY-MM-DD");
};

export const formatDateToShortMonthYear = (date) => {
  if (!date) return "";
  return moment(date).format("DD MMM’YY").replace("'20", "'");
};

const getTime = (date) => {
  return date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
};

export const parseApiError = (errorResponse) => {
  console.log("errorResponse: ", errorResponse);
  if (!errorResponse) {
    return "Something went wrong!";
  }

  if (errorResponse.response?.data?.error) {
    return errorResponse.response?.data?.error;
  }

  if (errorResponse.message) {
    return errorResponse.message;
  }

  if (errorResponse.data && Array.isArray(errorResponse.data)) {
    const errorArray = errorResponse.data;
    if (errorArray.length > 0) {
      const firstItem = errorArray[0];
      const firstItemError = `${firstItem.type} ${firstItem.msg} ${firstItem.path}`;
      return firstItemError;
    } else {
      return "Something went wrong!";
    }
  }
};

export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  const ageInMilliseconds = currentDate - dob;
  const ageInYears = Math.floor(
    ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000)
  );
  const ageInMonths = Math.floor(
    (ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) /
      (30.44 * 24 * 60 * 60 * 1000)
  );
  const ageInDays = Math.floor(
    (ageInMilliseconds % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
  );

  return { years: ageInYears, months: ageInMonths, days: ageInDays };
}

export function calculateBirthdateFromAge(age) {
  // Get the current date
  const currentDate = new Date();

  // Calculate birthdate year
  const birthYear = currentDate.getFullYear() - age.years;

  // Calculate birthdate month
  let birthMonth = currentDate.getMonth() - age.months;

  // Adjust the month and year if necessary
  if (birthMonth < 0) {
    birthMonth = 12 + birthMonth;
    birthYear--;
  }

  // Set the day to 1 for simplicity
  const birthDate = new Date(birthYear, birthMonth, 1);
  return birthDate;
}

export const generateTempId = () => {
  return "temp-id-" + Math.floor(Math.random() * 90) + 1000;
};

export const generateMockData = () => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push(getRandomAppointment());
  }

  return data;
};

const NAMES_FIRST = [
  "Aakash",
  "Aavesh",
  "Ajeet",
  "Sooraj",
  "Pankaj",
  "Rajesh",
  "Mangesh",
  "Jayesh",
  "Bhavesh",
  "Raj",
  "Vivek",
];
const NAMES_LAST = ["Ramachandran", "Saraswat", "Gokhale", "Shah"];

export const getRandomAppointment = () => {
  const randomMonthShort = moment()._locale._monthsShort[randomInteger(0, 11)];
  const apiTime = `${randomInteger(1, 12)}:${randomInteger(10, 59)} PM`;
  const apiDate = `${randomInteger(
    1,
    31
  )}th ${randomMonthShort} ${randomInteger(2021, 2025)}`;
  // console.log('randomMonthShort: ', moment());

  return {
    patient_unique_id: randomInteger(10000, 99999),
    pam_id: randomInteger(10000, 99999),
    pm_first_name: NAMES_FIRST[randomInteger(0, 3)],
    pm_last_name: NAMES_LAST[randomInteger(0, 3)],
    pm_gender: "Male",
    ageYears: randomInteger(18, 99),
    pm_contact_no: `${randomInteger(10, 99)}058${randomInteger(11111, 99999)}`,
    toct_type:
      Math.random() < 0.5
        ? "Follow-up"
        : Math.random() < 0.5
        ? "New"
        : "Urgent",
    apTime: apiTime,
    apDate: apiDate,
  };
};

export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const convertBase64ToBlobURL = (base64string = "") => {
  const byteCharacters = atob(base64string);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  return URL.createObjectURL(blob);
};

export const handlePrintClick = (
  element,
  setTabLoader,
  handlePrintWeb,
  chartType
) => {
  if (browserName == "Chrome WebView" || browserName == "WebKit") {
    if (!element) {
      console.error("Element not found");
      return;
    }

    const options = {
      filename: `${chartType}.pdf`,
      image: { type: "jpeg", quality: 0.8 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    setTabLoader(true);
    html2pdf()
      .from(element)
      .set(options)
      .output("datauristring")
      .then(async (pdfDataUri) => {
        const response = await fetch(pdfDataUri);
        const printBlob = await response.blob();
        const file = new File(
          [printBlob],
          `${new Date().toISOString().split("T")[0]}.pdf`,
          {
            type: "application/pdf",
          }
        );
        const formData = new FormData();
        formData.append(file?.name, file);
        const res = await uploadDocsToAzure(formData);
        const printUrl = res?.[0]?.url;
        if (res?.length > 0) {
          sendMessageToParent(EVENTS.PRINT, { url: printUrl });
        }
        // const base64string = pdfDataUri.slice(
        //   pdfDataUri.indexOf("base64,") + 7
        // );
        // const deviceUid = localStorage.getItem("app_device_unique_id");
        // if (deviceUid) {
        //   const docRef = doc(db, chartType, deviceUid);
        //   try {
        //     const docSnap = await getDoc(docRef);
        //     if (docSnap.exists()) {
        //       await updateDoc(docRef, {
        //         base64string,
        //       });
        //     } else {
        //       await setDoc(doc(db, chartType, deviceUid), {
        //         base64string,
        //       });
        //     }
        //   } catch (error) {
        //     console.error("Error updating document:", error);
        //   }
        // } else {
        //   console.error("Device UID not found");
        // }
        setTabLoader(false);
      })
      .catch((err) => {
        console.error("Error generating PDF", err);
        setTabLoader(false);
      });
  } else {
    handlePrintWeb();
  }
};

export const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export const getClinicName = (hospitalData) => {
  const decodedToken = getDecodedToken();
  const clinicId = decodedToken?.result?.clinic_id;
  const clinic = hospitalData?.find((e) => e?.hm_id == clinicId);
  return clinic ? clinic.hm_name : "";
};

export const getClinicCity = (hospitalData) => {
  const decodedToken = getDecodedToken();
  const clinicId = decodedToken?.result?.clinic_id;
  const clinic = hospitalData?.find((e) => e?.hm_id == clinicId);
  return clinic ? clinic.hm_city : "";
};

export const getClinic = (hospitalData) => {
  const decodedToken = getDecodedToken();
  const clinicId = decodedToken?.result?.clinic_id;
  const clinic = hospitalData?.find((e) => e?.hm_id == clinicId);
  return clinic || "";
};

export const getTokenData = () => {
  const decodedToken = getDecodedToken();
  const result = decodedToken?.result;
  return result || {};
};

export const getDeviceSdkData = () => {
  return { device_info: deviceDetect(), sdk_version: packageJson?.version };
};

export const compressedFile = async (
  file,
  maxSizeMB = 2,
  compressPercent = null
) => {
  if (file.size > maxSizeMB * 1024 * 1024) {
    // If file size is greater than 2MB
    try {
      const options = {
        maxSizeMB, // Target size: 2MB, the limit you want to enforce
        maxWidthOrHeight: 1920, // Max dimension, but we aim to maintain original dimensions - 1280, 2560
        useWebWorker: true, // Use a web worker for performance
        alwaysKeepResolution: true, // Ensure original height and width are maintained
      };
      if (compressPercent) {
        options.initialQuality = compressPercent / 100;
        delete options.maxSizeMB;
      }
      const compress = await imageCompression(file, options);

      // Preserve original file extension
      const fileExtension = file.name.split(".").pop(); // Get the original extension
      const newFileName = `${file.name.split(".")[0]}.${fileExtension}`;
      const renamedCompress = new File([compress], newFileName, {
        type: compress.type,
      });

      return renamedCompress;
    } catch (error) {
      console.error("Error compressing the image:", error);
      return null;
    }
  }
  return file;
};

export const groupArray = async (array) => {
  const updatedArray = array.reduce((acc, currentItem) => {
    const { tmm_id, tmm_medicine_name } = currentItem;
    let group = acc.find((item) => item.tmm_id == tmm_id);
    if (!group) {
      group = { tmm_id, tmm_medicine_name, data: [] };
      acc.push(group);
    }
    group.data.push({ ...currentItem });
    return acc;
  }, []);
  return updatedArray;
};

export const fetchDocumentAsFile = async (url, fileName) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob(); // Convert response to a Blob
    return new File([blob], fileName, { type: blob.type }); // Create a File object
  } catch (error) {
    console.error("Error fetching document: ", error);
    return null;
  }
};

export const isValidMongoId = (id) => {
  return (
    typeof id === "string" && id.length === 24 && /^[a-f\d]{24}$/i.test(id)
  );
};

export const trackEvent = (eventName, attributes) => {
  window.Moengage.track_event(eventName, attributes);
};

export const trackMoEngageEvent = (
  eventName,
  eventParams = {},
  commonData = {}
) => {
  try {
    const finalAttributes = {
      ...(commonData || {}),
      ...(eventParams || {}),
    };

    if (window.Moengage && typeof window.Moengage.track_event === "function") {
      window.Moengage.track_event(eventName, finalAttributes);
      console.log(`MoEngage Event Tracked: ${eventName}`, finalAttributes);
    } else {
      console.warn(
        "MoEngage is not available or track_event function not found"
      );
    }
  } catch (error) {
    console.error("Error tracking MoEngage event:", error);
  }
};

export const getIndianLanguageFont = (text, defaultFont = "Roboto") => {
  // Devanagari (Hindi, Marathi, Sanskrit, Nepali, etc.)
  if (/[\u0900-\u097F]/.test(text)) {
    return "AnekDevanagari";
  }

  // Bengali/Assamese
  if (/[\u0980-\u09FF]/.test(text)) {
    return "NotoSansBengali";
  }

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return "NotoSansTamil";
  }

  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return "NotoSansTelugu";
  }

  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return "NotoSansKannada";
  }

  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) {
    return "NotoSansMalayalam";
  }

  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return "NotoSansGujarati";
  }

  // Punjabi/Gurmukhi
  if (/[\u0A00-\u0A7F]/.test(text)) {
    return "NotoSansGurmukhi";
  }

  // Oriya/Odia
  if (/[\u0B00-\u0B7F]/.test(text)) {
    return "NotoSansOriya";
  }

  //urdu
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(text)) {
    return "Urdu";
  }

  // Default to the regular font if no Indian script is detected
  return defaultFont;
};

export const isValidGST = (gstNumber) => {
  // GST Regex Pattern
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstRegex.test(gstNumber)) {
    return false; // Invalid format
  }

  // Validate State Code (first two digits: 01-35)
  const stateCode = parseInt(gstNumber.substring(0, 2), 10);
  if (stateCode < 1 || stateCode > 35) {
    return false; // Invalid state code
  }

  return true; // GST is valid
};

export const getRxTitle = (LanguageId, title) => {
  const translations = {
    1: {
      // English
      "S.NO": "S.NO",
      MEDICINE: "MEDICINE",
      DOSE: "DOSE",
      DURATION: "DURATION",
      QTY: "QTY",
      FREQUENCY: "FREQUENCY",
      NOTES: "NOTES",
    },
    2: {
      // Gujarati
      "S.NO": "સંખ્યા",
      MEDICINE: "દવાઓ",
      DOSE: "માત્રા",
      DURATION: "સમયગાળો",
      QTY: "જથ્થો",
      FREQUENCY: "આવર્તન",
      NOTES: "નૉૅધ",
    },
    3: {
      // Hindi
      "S.NO": "संख्या",
      MEDICINE: "दवाइयाँ",
      DOSE: "खुराक",
      DURATION: "अवधि",
      QTY: "मात्रा",
      FREQUENCY: "आवृत्ति",
      NOTES: "टिप्पणियाँ",
    },
    4: {
      // Marathi
      "S.NO": "अ.क्र.",
      MEDICINE: "औषधे",
      DOSE: "डोस",
      DURATION: "कालावधी",
      QTY: "प्रमाण",
      FREQUENCY: "FREQUENCY",
      NOTES: "नोट्स",
    },
    5: {
      // Telugu
      "S.NO": "S.NO",
      MEDICINE: "MEDICINE",
      DOSE: "DOSE",
      DURATION: "DURATION",
      QTY: "QTY",
      FREQUENCY: "FREQUENCY",
      NOTES: "NOTES",
    },
    6: {
      // Kannada
      "S.NO": "ಸಂಖ್ಯೆ",
      MEDICINE: "ಔಷಧಿಗಳು",
      DOSE: "ಡೋಸ್",
      DURATION: "ಅವಧಿ",
      QTY: "ಪ್ರಮಾಣ",
      FREQUENCY: "ಆವರ್ತನ",
      NOTES: "ಟಿಪ್ಪಣಿಗಳು",
    },
    7: {
      // Urdu
      "S.NO": "S.NO",
      MEDICINE: "MEDICINE",
      DOSE: "DOSE",
      DURATION: "DURATION",
      QTY: "QTY",
      FREQUENCY: "FREQUENCY",
      NOTES: "NOTES",
    },
    8: {
      // Punjabi
      "S.NO": "S.NO",
      MEDICINE: "MEDICINE",
      DOSE: "DOSE",
      DURATION: "DURATION",
      QTY: "QTY",
      FREQUENCY: "FREQUENCY",
      NOTES: "NOTES",
    },
    9: {
      // Malayalam
      "S.NO": "S.NO",
      MEDICINE: "MEDICINE",
      DOSE: "DOSE",
      DURATION: "DURATION",
      QTY: "QTY",
      FREQUENCY: "FREQUENCY",
      NOTES: "NOTES",
    },
    10: {
      // Tamil
      "S.NO": "எண்",
      MEDICINE: "மருந்துகள்",
      DOSE: "மருந்தளவு",
      DURATION: "கால அளவு",
      QTY: "மொத்த அளவு",
      FREQUENCY: "அதிர்வெண்",
      NOTES: "குறிப்புகள்",
    },
    11: {
      // Assamese
      "S.NO": "ক্ৰমিক নম্বৰ",
      MEDICINE: "ঔষধ",
      DOSE: "পৰিমাণ",
      DURATION: "সময়কাল",
      QTY: "পৰিমাণ",
      FREQUENCY: "ঘনত্ব",
      NOTES: "টোকা",
    },
    12: {
      // Bengali
      "S.NO": "ক্র.সংখ্যা",
      MEDICINE: "ওষুধ",
      DOSE: "ডোজ",
      DURATION: "সময়কাল",
      QTY: "পরিমাণ",
      FREQUENCY: "ফ্রিকোয়েন্সি",
      NOTES: "নোট",
    },
    13: {
      // Odia
      "S.NO": "କ୍ରମିକ ସଂଖ୍ୟା",
      MEDICINE: "ଔଷଧ",
      DOSE: "ଡୋଜ",
      DURATION: "ସମୟ",
      QTY: "ପରିମାଣ",
      FREQUENCY: "ସମୟ ଅନୁସୂଚୀ",
      NOTES: "ଟିପ୍ପଣୀ",
    },
  };
  return translations?.[parseInt(LanguageId)]?.[title] || title;
};

export const getDurationTitle = (LanguageId, tmm_duration_type) => {
  var tmm_duration_type = tmm_duration_type.toLowerCase();

  const langTranslations = {
    1: {
      // English
      "day(s)": "Day(S)",
      "week(s)": "Week(S)",
      "month(s)": "Month(S)",
      "year(s)": "Year(S)",
      "to be continued": "To Be Continued",
      stat: "STAT",
      "till required": "Till required",
    },
    2: {
      // Gujarati
      "day(s)": "દિવસ",
      "week(s)": "અઠવાડિયા",
      "month(s)": "મહિનાઓ",
      "year(s)": "વર્ષ",
      "to be continued": "ચાલુ રાખો",
      stat: "તાત્કાલિક",
      "till required": "જરૂરી ત્યાં સુધી",
    },
    3: {
      // Hindi
      "day(s)": "दिन",
      "week(s)": "सप्ताह",
      "month(s)": "महीने",
      "year(s)": "वर्षों",
      "to be continued": "जारी रखो",
      stat: "तत्काल",
      "till required": "आवश्यक होने तक",
    },
    4: {
      // Marathi
      "day(s)": "दिवस",
      "week(s)": "आठवडे",
      "month(s)": "महिने",
      "year(s)": "वर्षे",
      "to be continued": "जारी रखो",
      stat: "लगेच",
      "till required": "आवश्यक तेव्हा पर्यंत",
    },
    5: {
      // Telugu
      // 'day(s)': 'రోజులు',
      // 'week(s)': 'వారాలు',
      // 'month(s)': 'నెలల',
      // 'year(s)': 'సంవత్సరాలు',
      // 'to be continued': 'కొనసాగించు',
      // 'stat': 'తక్షణమే'
      "day(s)": "Day(S)",
      "week(s)": "Week(S)",
      "month(s)": "Month(S)",
      "year(s)": "Year(S)",
      "to be continued": "To Be Continued",
      stat: "STAT",
      "till required": "Till required",
    },
    6: {
      // Kannada
      "day(s)": "ದಿನಗಳು",
      "week(s)": "ವಾರಗಳು",
      "month(s)": "ತಿಂಗಳುಗಳು",
      "year(s)": "ವರ್ಷಗಳು",
      "to be continued": "ಮುಂದುವರೆಸು",
      stat: "ತಕ್ಷಣವೇ",
      "till required": "ಅಗತ್ಯವಿರುವವರೆಗೆ",
    },
    7: {
      // Urdu
      // 'day(s)': 'دن',
      // 'week(s)': 'ہفتے',
      // 'month(s)': 'مہینہ',
      // 'year(s)': 'سال',
      // 'to be continued': 'جاری رکھو',
      // 'stat': 'فوراً'
      "day(s)": "Day(S)",
      "week(s)": "Week(S)",
      "month(s)": "Month(S)",
      "year(s)": "Year(S)",
      "to be continued": "To Be Continued",
      stat: "STAT",
      "till required": "Till required",
    },
    8: {
      // Punjabi
      // 'day(s)': 'ਦਿਨ',
      // 'week(s)': 'ਹਫ਼ਤੇ',
      // 'month(s)': 'ਮਹੀਨੇ',
      // 'year(s)': 'ਸਾਲ',
      // 'to be continued': 'ਜਾਰੀ ਰੱਖਿਆ',
      // 'stat': 'ਸ਼ੁਰੂ ਕਰੋ'
      "day(s)": "Day(S)",
      "week(s)": "Week(S)",
      "month(s)": "Month(S)",
      "year(s)": "Year(S)",
      "to be continued": "To Be Continued",
      stat: "STAT",
      "till required": "Till required",
    },
    9: {
      // Malayalam
      // 'day(s)': 'ദിവസങ്ങളിൽ',
      // 'week(s)': 'ആഴ്ചകൾ',
      // 'month(s)': 'മാസങ്ങൾ',
      // 'year(s)': 'വർഷം',
      // 'to be continued': 'തുടരും',
      // 'stat': 'സ്ഥിതി'
      "day(s)": "Day(S)",
      "week(s)": "Week(S)",
      "month(s)": "Month(S)",
      "year(s)": "Year(S)",
      "to be continued": "To Be Continued",
      stat: "STAT",
      "till required": "Till required",
    },
    10: {
      // Tamil
      "day(s)": "நாட்களில்",
      "week(s)": "வாரங்கள்",
      "month(s)": "மாதங்கள்",
      "year(s)": "ஆண்டு",
      "to be continued": "தொடரும்",
      stat: "புள்ளிவிவரங்கள்",
      "till required": "தேவையான வரை",
    },
    11: {
      // Assamese
      "day(s)": "দিন",
      "week(s)": "সপ্তাহসমূহ",
      "month(s)": "মাহ",
      "year(s)": "বছৰ",
      "to be continued": "চলি থাকিব",
      stat: "ষ্টাট",
      "till required": "Till required",
    },
    12: {
      // Bengali
      "day(s)": "দিন",
      "week(s)": "সপ্তাহগুলি",
      "month(s)": "মাস",
      "year(s)": "বছর",
      "to be continued": "To Be Continued",
      stat: "স্ট্যাট",
      "till required": "Till required",
    },
    13: {
      //Odia
      "day(s)": "ଦିନ",
      "week(s)": "ସପ୍ତାହଗୁଡ଼ିକ",
      "month(s)": "ମାସ",
      "year(s)": "ବର୍ଷ",
      "to be continued": "ଚାଲୁ ରହିବ",
      stat: "ଷ୍ଟାଟ୍",
      "till required": "ଆବଶ୍ୟକ ହେଉଅ ଯାଏଁ",
    },
  };

  return (
    langTranslations[parseInt(LanguageId)][tmm_duration_type] ||
    tmm_duration_type
  );
};

export const getTimeingTitle = (LanguageId) => {
  var FetchColumn = "tmt_title";

  if (LanguageId == 1) {
    FetchColumn = "tmt_title";
  } else if (LanguageId == 2) {
    FetchColumn = "tmt_gujarati";
  } else if (LanguageId == 3) {
    FetchColumn = "tmt_hindi";
  } else if (LanguageId == 4) {
    FetchColumn = "tmt_marathi";
  } else if (LanguageId == 6) {
    FetchColumn = "tmt_kannada";
  } else if (LanguageId == 10) {
    FetchColumn = "tmt_tamil";
  } else if (LanguageId == 11) {
    FetchColumn = "tmt_assamese";
  } else if (LanguageId == 12) {
    FetchColumn = "tmt_bengali";
  } else if (LanguageId == 13) {
    FetchColumn = "tmt_odia";
  }

  return FetchColumn;
};

export const getFrequencyTitle = (LanguageId) => {
  var FetchColumn = "tmf_title";

  if (LanguageId == 1) {
    FetchColumn = "tmf_title";
  } else if (LanguageId == 2) {
    FetchColumn = "tmf_gujarati";
  } else if (LanguageId == 3) {
    FetchColumn = "tmf_hindi";
  } else if (LanguageId == 4) {
    FetchColumn = "tmf_marathi";
  } else if (LanguageId == 6) {
    FetchColumn = "tmf_kannada";
  } else if (LanguageId == 10) {
    FetchColumn = "tmf_tamil";
  } else if (LanguageId == 11) {
    FetchColumn = "tmf_assamese";
  } else if (LanguageId == 12) {
    FetchColumn = "tmf_bengali";
  } else if (LanguageId == 13) {
    FetchColumn = "tmf_odia";
  }

  return FetchColumn;
};

export const getFrequencyLanguageTitles = (languageId) => {
  const languageMap = {
    1: "english",
    2: "gujarati",
    3: "hindi",
    4: "marathi",
    6: "kannada",
    10: "tamil",
    11: "assamese",
    12: "bengali",
    13: "odia",
  };

  const frequencyTitles = {
    english: {
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      night: "Night",
    },
    gujarati: {
      morning: "સવારે",
      afternoon: "બપોર",
      evening: "સાંજે",
      night: "રાત્રે",
    },
    hindi: {
      morning: "सुबह",
      afternoon: "दोपहर",
      evening: "शाम",
      night: "रात",
    },
    marathi: {
      morning: "सकाळी",
      afternoon: "दुपारी",
      evening: "संध्याकाळ",
      night: "रात्री",
    },
    kannada: {
      morning: "ಬೆಳಗ್ಗೆ",
      afternoon: "ಮಧ್ಯಾಹ್ನ",
      evening: "ಸಂಜೆ",
      night: "ರಾತ್ರಿ",
    },
    tamil: {
      morning: "காலை பொழுதில்",
      afternoon: "மதியம்",
      evening: "மாலையில்",
      night: "இரவு",
    },
    assamese: {
      morning: "সকাল",
      afternoon: "বিকাল",
      evening: "সন্ধ্যা",
      night: "ৰাতি",
    },
    bengali: {
      morning: "সকাল",
      afternoon: "দুপুর",
      evening: "সন্ধ্যা",
      night: "রাত",
    },
    odia: {
      morning: "ସକାଳ",
      afternoon: "ବେଳୁଆ",
      evening: "ସନ୍ଧ୍ୟା",
      night: "ରାତି",
    },
  };

  const language = languageMap[languageId] || "english";
  return frequencyTitles[language];
};

export const shouldMonetizationDisabled = () => {
  const monetizationDisabled = config?.tp_monetization_disabled_hospital;
  const monetizationDisabledArray = monetizationDisabled.map(Number);
  const { hospital_business_id = null } = getTokenData();
  // console.log(monetizationDisabled,hospital_business_id)
  const currentHospital = Number(hospital_business_id);

  if (currentHospital && monetizationDisabledArray.includes(currentHospital)) {
    return true;
  }

  return false;
};

export const shouldAppointmentAgentDisabled = () => {
  const appointmentAgentDisabled = config?.tp_agent_disabled_hospital;
  const appointmentAgentDisabledArray = appointmentAgentDisabled.map(Number);
  const { hospital_business_id = null } = getTokenData();
  const currentHospital = Number(hospital_business_id);

  if (
    currentHospital &&
    appointmentAgentDisabledArray.includes(currentHospital)
  ) {
    return true;
  }

  return false;
};

export const isMunshiHospital = () => {
  const munshiHospitalIds = config?.munshi_hospital_business_ids;
  const munshiHospitalArray = munshiHospitalIds?.map(Number) || [];
  const { hospital_business_id = null } = getTokenData();
  const currentHospital = Number(hospital_business_id);

  if (currentHospital && munshiHospitalArray.includes(currentHospital)) {
    return true;
  }

  return false;
};

export const detectOperatingSystem = () => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;

  const os = {
    Windows: /Win/.test(platform),
    MacOS: /Mac/.test(platform),
    Linux: /Linux/.test(platform),
    iOS: /iPhone|iPad|iPod/.test(userAgent),
    Android: /Android/.test(userAgent),
  };

  return Object.keys(os).find((key) => os[key]) || "Unknown";
};

export const sendMessageToParent = (eventName, data = {}) => {
  try {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: eventName, data })
      );
    } else {
      console.warn("ReactNativeWebView is not available on the window object.");
    }
  } catch (error) {
    console.log("sendMessageToParent ERROR", error);
  }
};

export const clearExpiredTokensFromStorage = () => {
  try {
    const tokensObject = localStorage.getItem(SNAP_RX_TOKENS_STORAGE_KEY);
    if (tokensObject) {
      const parsedTokens = JSON.parse(tokensObject);
      const currentTime = Date.now();
      const validTokens = {};

      Object.keys(parsedTokens).forEach((key) => {
        if (parsedTokens[key].expiresIn > currentTime) {
          validTokens[key] = parsedTokens[key];
        }
      });

      localStorage.setItem(
        SNAP_RX_TOKENS_STORAGE_KEY,
        JSON.stringify(validTokens)
      );
    }
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
  }
};

export const normalizeToDefault = (m, key) => {
  if (key && m[key]) return { default: m[key] };
  if (m?.default) return { default: m.default };
  if (typeof m === "function") return { default: m };
  throw new Error("Remote module does not export a React component.");
};

export const sortAssessmentFormStructure = (array) => {
  if (!Array.isArray(array)) {
    return [];
  }

  const sortedArray = [...array].sort((a, b) => {
    const orderA = typeof a.order === "number" ? a.order : 0;
    const orderB = typeof b.order === "number" ? b.order : 0;
    return orderA - orderB;
  });

  return sortedArray.map((section) => {
    if (Array.isArray(section.children)) {
      return {
        ...section,
        children: [...section.children].sort((a, b) => {
          const orderA = typeof a.order === "number" ? a.order : 0;
          const orderB = typeof b.order === "number" ? b.order : 0;
          return orderA - orderB;
        }),
      };
    }
    return section;
  });
};

export const addOrderToAssessmentFormStructure = (array) => {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.map((section, index) => {
    const sectionWithOrder = {
      ...section,
      order: index,
    };

    if (Array.isArray(section.children)) {
      sectionWithOrder.children = section.children.map((child, childIndex) => ({
        ...child,
        order: childIndex,
      }));
    }

    return sectionWithOrder;
  });
};

export const convertMedicationFormat = (medications) => {
  if (!medications) return [];

  // If single object is passed, convert to array
  const medicationArray = Array.isArray(medications)
    ? medications
    : [medications];

  return medicationArray.map((medication) => {
    // Extract frequency and schedule from the medication object
    let frequency = "";
    let schedule = [];

    // Convert frequency type to human readable format
    if (medication.tmm_freq_type_name) {
      frequency = medication.tmm_freq_type_name;
    }

    // Build schedule based on morning, afternoon, evening, night values
    if (medication.tcm_tmm_freq_morning === "1") schedule.push("Morning");
    if (medication.tcm_tmm_freq_afternoon === "1") schedule.push("Afternoon");
    if (medication.tcm_tmm_freq_evening === "1") schedule.push("Evening");
    if (medication.tcm_tmm_freq_night === "1") schedule.push("Night");

    // If tmm_time_name exists, use that for schedule
    if (medication.tmm_time_name) {
      schedule = [medication.tmm_time_name];
    }

    return {
      name: medication.tmm_medicine_name || "",
      unitPerDose: medication.tmm_generic || "",
      frequency: frequency || "Once daily", // Default to once daily if not specified
      schedule: schedule.join(", ") || "As needed",
      duration: medication.tmm_duration_type || "as needed",
      notes: medication.tmm_remarks || "",
    };
  });
};

export const convertTemplateDataToRichText = (templateData, templateType) => {
  if (!Array.isArray(templateData)) return [];
  switch (templateType) {
    case "symptoms":
      return [
        {
          type: "bulleted-list",
          children: templateData.map((item) => ({
            type: "list-item",
            children: [
              {
                text: item?.symptom_name || item?.title || item?.symptom || "",
                bold: true,
              },
              {
                text: (() => {
                  const parts = [];
                  if (item.since) parts.push(`since: ${item.since}`);
                  if (item.severity) parts.push(`severity: ${item.severity}`);
                  if (item.note) parts.push(item.note);
                  return parts.length ? ` (${parts.join(", ")})` : "";
                })(),
              },
            ],
          })),
        },
      ];
    case "medications":
      return [
        {
          type: "bulleted-list",
          children: templateData.map((item) => ({
            type: "list-item",
            children: [
              {
                text: item.medication_name || "",
                bold: true,
              },
              {
                text: (() => {
                  const parts = [];
                  if (item.unitPerDose) parts.push(`Dose: ${item.unitPerDose}`);
                  if (item.frequency)
                    parts.push(`Frequency: ${item.frequency}`);
                  if (item.schedule) parts.push(`Schedule: ${item.schedule}`);
                  if (item.duration) parts.push(`Duration: ${item.duration}`);
                  if (item.notes) parts.push(`Instructions: ${item.notes}`);
                  return parts.length ? ` (${parts.join(", ")})` : "";
                })(),
              },
            ],
          })),
        },
      ];
    default:
      return [];
  }
};

export const mergeArraysOfObjects = (
  array1 = [],
  array2 = [],
  matchKey = "title",
  tagsKey = "tags",
  tagMatchKey = "title"
) => {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return Array.isArray(array1) ? array1 : Array.isArray(array2) ? array2 : [];
  }

  const array2Map = new Map();
  array2.forEach((item) => {
    if (item && typeof item === "object" && item[matchKey]) {
      array2Map.set(item[matchKey], item);
    }
  });

  const mergedArray = array1.map((item1) => {
    if (!item1 || typeof item1 !== "object" || !item1[matchKey]) {
      return item1;
    }

    const matchingItem2 = array2Map.get(item1[matchKey]);

    if (!matchingItem2) {
      return item1;
    }

    const mergedItem = { ...matchingItem2, ...item1 };

    if (
      tagsKey &&
      Array.isArray(item1[tagsKey]) &&
      Array.isArray(matchingItem2[tagsKey])
    ) {
      const tags1Map = new Map();
      item1[tagsKey].forEach((tag) => {
        if (tag && typeof tag === "object" && tag[tagMatchKey]) {
          tags1Map.set(tag[tagMatchKey], tag);
        }
      });

      const mergedTags = [...item1[tagsKey]];

      matchingItem2[tagsKey].forEach((tag2) => {
        if (tag2 && typeof tag2 === "object" && tag2[tagMatchKey]) {
          if (!tags1Map.has(tag2[tagMatchKey])) {
            mergedTags.push(tag2);
          }
        }
      });

      mergedItem[tagsKey] = mergedTags;
    }

    array2Map.delete(item1[matchKey]);

    return mergedItem;
  });

  array2Map.forEach((item) => {
    mergedArray.push(item);
  });

  return mergedArray;
};

export const isEmptyRichText = (content) => {
  if (!content || !Array.isArray(content)) return true;
  if (content.length === 0) return true;

  // Check if all paragraphs are empty
  return content.every((node) => {
    if (!node.children || node.children.length === 0) return true;
    return node.children.every((child) =>
      child.children && Array.isArray(child.children)
        ? child.children.every(
            (child) => !child.text || child.text.trim() === ""
          )
        : !child.text || child.text.trim() === ""
    );
  });
};

export const deepMergePreserveFirst = (obj1, obj2) => {
  const isEmpty = (value) => {
    if (value == null) return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "string") return value.trim() === "";
    return false;
  };

  if (obj1 == null && obj2 == null) return null;
  if (obj1 == null) return obj2;
  if (obj2 == null) return obj1;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return isEmpty(obj2) ? obj1 : obj2;
  }

  if (obj1 instanceof Date || obj2 instanceof Date) {
    return obj2 instanceof Date ? obj2 : obj1;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj2.length === 0) return obj1;

    if (obj1.length === 0) return obj2;

    const maxLength = Math.max(obj1.length, obj2.length);
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const val1 = i < obj1.length ? obj1[i] : undefined;
      const val2 = i < obj2.length ? obj2[i] : undefined;

      if (
        val1 != null &&
        val2 != null &&
        typeof val1 === "object" &&
        typeof val2 === "object" &&
        !Array.isArray(val1) &&
        !Array.isArray(val2) &&
        !(val1 instanceof Date) &&
        !(val2 instanceof Date)
      ) {
        result[i] = deepMergePreserveFirst(val1, val2);
      } else {
        result[i] = val2 !== undefined && !isEmpty(val2) ? val2 : val1;
      }
    }

    return result;
  }

  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    if (Array.isArray(obj2) && obj2.length === 0) return obj1;
    if (Array.isArray(obj1) && obj1.length === 0) return obj2;
    return obj2;
  }

  const result = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (key in obj1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (isEmpty(val2)) {
          result[key] = val1;
        } else if (
          val1 != null &&
          val2 != null &&
          typeof val1 === "object" &&
          typeof val2 === "object" &&
          !Array.isArray(val1) &&
          !Array.isArray(val2) &&
          !(val1 instanceof Date) &&
          !(val2 instanceof Date)
        ) {
          result[key] = deepMergePreserveFirst(val1, val2);
        } else {
          result[key] = val2;
        }
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
};

// Convert patient data structure to IPD format for discharge summary
export const convertPatientDataToIpdFormat = (patientInformation) => {
  if (!patientInformation) return {};

  return {
    patientName: patientInformation.patientName || "",
    patientAgeGender:
      patientInformation.age && patientInformation.gender
        ? `${patientInformation.age} / ${patientInformation.gender}`
        : "",
    contactNumber: patientInformation.contactNumber || "",
    wardBedNumber: patientInformation.wardBedNo || "",
    patientId: patientInformation.patientId || "",
    admissionId: patientInformation.admissionId || "",
    admittedOn: patientInformation.admissionDate
      ? new Date(patientInformation.admissionDate).toLocaleDateString()
      : "",
    primaryConsultant: patientInformation.primaryConsultant?.name || "",
    admitSpeciality: patientInformation.primaryConsultant?.speciality || "",
    address: patientInformation.address || "",
    dateOfDischarge: patientInformation.dateOfDischarge || "",
  };
};

const calculateSurgeryDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const startMoment = moment(startTime, "HH:mm");
  let endMoment = moment(endTime, "HH:mm");

  if (endMoment.isBefore(startMoment)) {
    endMoment.add(1, "day");
  }

  return endMoment.diff(startMoment, "minutes");
};

const formatSurgeryTime = (minutes) => {
  if (minutes <= 0) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}hr ${mins}min`;
  } else if (hours > 0) {
    return `${hours}hr`;
  } else {
    return `${mins}min`;
  }
};

export const convertSurgeryDataToDisplayFormat = (surgeryData) => {
  const displayData = [];

  // Surgery Details
  if (surgeryData.surgeryDetails) {
    const details = surgeryData.surgeryDetails;

    if (details.procedureName?.length) {
      displayData.push({
        key: "Surgery/Procedure Name",
        value: Array.isArray(details.procedureName)
          ? details.procedureName?.join(", ")
          : details.procedureName,
      });
    }

    if (details.surgeryDate) {
      displayData.push({
        key: "Date Of Surgery",
        value: details.surgeryDate,
      });
    }

    if (details.surgeryStartTime && details.surgeryEndTime) {
      const surgeryTimeDiff = calculateSurgeryDuration(
        details.surgeryStartTime,
        details.surgeryEndTime
      );
      const surgeryTime = formatSurgeryTime(surgeryTimeDiff);

      displayData.push({
        key: "Duration",
        value: `${details.surgeryStartTime} - ${details.surgeryEndTime} (${surgeryTime})`,
      });
    }

    if (details.anaesthesiaType) {
      displayData.push({
        key: "Anaesthesia Type",
        value: details.anaesthesiaType,
      });
    }
  }

  // Surgery Team
  if (surgeryData.surgeryTeam) {
    const team = surgeryData.surgeryTeam;

    // Combine all surgeons
    const allSurgeons = [
      ...(team.primarySurgeon || []),
      ...(team.secondarySurgeon || []),
    ];

    if (allSurgeons.length) {
      displayData.push({
        key: "Surgeon",
        value: allSurgeons.map((surgeon) => surgeon.name).join(", "),
      });
    }

    if (team.anaesthesiologist?.length || team.anaesthesiologist !== "") {
      displayData.push({
        key: "Anaesthetist",
        value:
          typeof team.anaesthesiologist === "string"
            ? team.anaesthesiologist
            : team.anaesthesiologist.map((person) => person.name).join(", "),
      });
    }

    if (team.assistant?.length) {
      displayData.push({
        key: "Assistant",
        value: team.assistant.map((person) => person.name).join(", "),
      });
    }

    if (team.scrubNurse?.length) {
      displayData.push({
        key: "Scrub Nurse",
        value: team.scrubNurse.map((person) => person.name).join(", "),
      });
    }

    if (team.floorCirculatingNurse?.length) {
      displayData.push({
        key: "Floor Circulating Nurse",
        value: team.floorCirculatingNurse
          .map((person) => person.name)
          .join(", "),
      });
    }
  }

  // Operative Notes - Special handling as requested
  if (surgeryData.operativeNotes) {
    const notes = surgeryData.operativeNotes;

    if (notes.operativeFindings) {
      displayData.push({
        key: "Operative Findings",
        value: notes.operativeFindings,
      });
    }

    if (notes.procedures) {
      displayData.push({
        key: "Procedure",
        value: notes.procedures,
      });
    }

    if (notes.additionalNotes) {
      displayData.push({
        key: "Additional Notes",
        value: notes.additionalNotes,
      });
    }
  }

  return displayData;
};

export const isZydus = () =>
  env?.ZYDUS_BUSINESS_ID === getTokenData()?.hospital_business_id;

export const isVoiceRxFree = () => {
  return (
    (isZydus() && new Date(env?.zydus_voice_rx_expiry_date) > new Date()) ||
    env?.FREE_VOICE_RX_APOLLO_USER_IDS?.includes(getTokenData()?.user_id)
  );
};

// Function to determine supported MIME types for MediaRecorder in the current browser
export const getSupportedMimeType = () => {
  if (!MediaRecorder) {
    return null;
  }

  // Try different MIME types in order of preference
  const mimeTypes = [
    "audio/webm;codecs=opus", // Best compression for long recordings
    "audio/mp4;codecs=mp4a.40.2", // AAC - excellent compression
    "audio/webm", // Good fallback
    "audio/mp4", // Wide API compatibility
    "audio/mpeg", // MP3 - universal support
  ];

  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return null; // No supported type found, let browser use default
};

export const isApollo = () =>
  env?.APOLLO_BUSINESS_IDS?.includes(getTokenData()?.hospital_business_id);

// List of specific doctors who should see "Tatva Care Platform" branding
const TATVACARE_DOCTORS = [
  "NMQAvpjb7nPRYBh",
  "7RULp5rlfWF8JC6",
  "9RplZSe-tEGFzQP",
];

// Helper function to determine if current doctor should use TatvaCare platform
export const shouldUseTatvaCare = () => {
  // Get user ID from localStorage or token
  const token = localStorage.getItem("persistant.storage.key.auth-token");
  if (!token) return false;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const doctorId = decodedToken?.result?.doctor_unique_id;

    // Check if this doctor is in the TatvaCare list
    return TATVACARE_DOCTORS.includes(doctorId);
  } catch (error) {
    return false;
  }
};

// Helper function to get the platform name based on user type
export const getPlatformName = () => {
  return shouldUseTatvaCare() ? "Tatva Care Platform" : "Tatva Pedia";
};

// Helper function to get the platform name for welcome messages
export const getWelcomePlatformName = () => {
  return shouldUseTatvaCare() ? "Tatva Care Platform" : "TatvaPractice";
};

export function mapSectionsWithData(structure, apiResponse) {
  return structure.map((section) => {
    const sectionData = apiResponse[section.field] || {};

    let total = 0;
    let filled = 0;

    const children = (section.children || []).map((child) => {
      total++;

      let hasData = false;

      // Check if nested object/array exists in API response
      if (child?.isRedundant) {
        if (Array.isArray(sectionData)) {
          hasData = sectionData?.length > 0;
        } else if (typeof sectionData === "object" && sectionData !== null) {
          hasData = Object.keys(sectionData).some((key) => !!sectionData[key]);
        } else {
          hasData = !!sectionData;
        }
      } else {
        let childFieldValue;
        if (child.field && child.field.includes(".")) {
          const parts = child.field.split(".");
          childFieldValue = parts.reduce(
            (acc, key) =>
              acc && acc[key] !== undefined ? acc[key] : undefined,
            sectionData
          );
          hasData = childFieldValue;
        } else if (Array.isArray(sectionData[child.field])) {
          hasData =
            sectionData[child.field].length > 0 &&
            (!["paragraph", "bulleted-list", "numbered-list"].includes(
              sectionData[child.field]?.[0]?.type
            ) ||
              (["paragraph", "bulleted-list", "numbered-list"].includes(
                sectionData[child.field]?.[0]?.type
              ) &&
                sectionData[child.field]?.[0]?.objectID) ||
              (["paragraph", "bulleted-list", "numbered-list"].includes(
                sectionData[child.field]?.[0]?.type
              ) &&
                !sectionData[child.field]?.[0]?.objectID &&
                !isEmptyRichText(sectionData[child.field])));
        } else if (
          typeof sectionData[child.field] === "object" &&
          sectionData[child.field] !== null
        ) {
          hasData = Object.keys(sectionData[child.field]).some((key) =>
            child.field === "generalExamination"
              ? sectionData[child.field][key]?.value !== undefined
              : !!sectionData[child.field][key]
          );
        } else {
          hasData = !!sectionData[child.field];
        }
      }

      if (hasData) filled++;

      return {
        ...child,
        isDataFilled: hasData,
      };
    });

    return {
      ...section,
      children,
      total,
      filled,
      isDataFilled: filled > 0,
      isFullyFilled: filled === total,
      isPartiallyFilled: filled > 0 && filled < total,
    };
  });
}

export const getPatientInformation = (patientDetails) => {
  return {
    patientName: patientDetails?.details?.name || "",
    patientId: patientDetails?.details?.id || "",
    age: patientDetails?.details?.age || "",
    contactNumber: patientDetails?.details?.contact || "",
    gender: patientDetails?.details?.gender || "",
    admissionId: patientDetails?.admissionId || "",
    admissionDate: patientDetails?.admittedOn || "",
    wardBedNo:
      patientDetails?.ward?.title && patientDetails?.room?.title
        ? `${patientDetails?.ward?.title} - ${patientDetails?.room?.title}`
        : "",
    address: patientDetails?.details?.address || "",
    bloodGroup: patientDetails?.details?.bloodGroup || "",
    dischargeSummaryNo: patientDetails?.dischargeNo || "",
    dischargeType: patientDetails?.dischargeType || "",
    dischargedAt: patientDetails?.dischargedAt || "",
    doctorName: patientDetails?.doctor?.name || "",
    mrnNo: patientDetails?.mrno || "",
    admissionNo: patientDetails?.admissionNo || "",
  };
};

export const formatDateWithTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${day} ${month}, ${hours}:${minutes}${ampm}`;
};
export const camelToCapitalized = (text) => {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const hasNoData = (data) => {
  const values = Object.values(data);

  return !values.some((value) => {
    if (value === null || value === undefined) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "number") {
      return value > 0;
    }

    if (typeof value === "string") {
      return value.trim() !== "";
    }

    if (typeof value === "object") {
      return Object.keys(value).length > 0;
    }

    if (typeof value === "boolean") {
      return value;
    }

    return !!value;
  });
};

export const transformAdmissionToPatient = (source = {}) => {
  if (!source || typeof source !== "object") return {};

  const details = source.details || {};
  const metadata = source.metadata || {};

  return {
    pm_salutation: "", // not available in source
    pm_fullname: details.name
      ? details.name.charAt(0).toUpperCase() +
        details.name.slice(1).toLowerCase()
      : "",
    pm_id: Number(details.id) || null, // safely parse to number
    pm_pid: source.admissionId || "", // fallback: using admissionId
    pm_contact_no: details.contact || "",
    patient_unique_id: source?.patient_unique_id || null,
    pm_gender: details.gender
      ? details.gender.charAt(0) + details.gender.slice(1).toLowerCase()
      : "",
    ageDays: 0, // not available, fallback
    ageMonths: 0, // not available, fallback
    ageYears: Number(details.age) || null,
    pm_dob: null, // not in source (needs DOB if available)
    tpml_refrence_id: source.mrno || "",
    pm_address: details.address || "",
    pm_area: "",
    pm_city: "",
    pm_state: "",
    pm_pincode: "",
    pm_blood_group: "", // not in source
    category: metadata.category || null,
    lastVisitDate: source.dischargedAt
      ? source.dischargedAt.split("T")[0]
      : null,
    pm_first_name: details.name || "",
  };
};

export const getModuleCode = (module) => {
  if (!module) return "";

  const moduleMap = {
    "OT Note": "OT",
    "OT Notes": "OT",
    "Progress Note": "PN",
    "Progress Notes": "PN",
    Assessment: "AF",
    "Consultant Notes": "CN",
    "Cross Referral": "CR",
    "Laboratory Report": "LR",
    "Radiology Report": "RR",
    "Nursing Notes": "NN",
    Medication: "MED",
    "Vital Signs": "VS",
    "Discharge Planning": "DP",
  };

  return moduleMap[module] || module.substring(0, 2).toUpperCase();
};

export const groupIpdCustomModulesById = (customModules = []) => {
  const groupedModules = customModules?.reduce((acc, item) => {
    if (!acc[item.moduleId]) {
      acc[item.moduleId] = {
        moduleId: item.moduleId,
        moduleName: item.moduleName,
        content: [],
      };
    }
    acc[item.moduleId].content.push(...item.content);
    return acc;
  }, {});

  return Object.values(groupedModules);
};
