import moment from "moment";

import config from "../config";
import { message } from "antd";
import { MESSAGE_KEY } from "../utils/constants";
import { browserName, deviceDetect } from "react-device-detect";
import html2pdf from "html2pdf.js";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../src/firebase.js";
import { getDecodedToken } from "./localStorage.js";
import imageCompression from 'browser-image-compression';
import numeral from 'numeral'
import packageJson from '../../package.json';

// export const validateEmail = (email) => {
//   return String(email)
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// };

export const validateEmail = (email) => {
  let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(String(email).toLowerCase());
};

// export const isValidWebsite = (url) => {
//   const pattern = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
//   return pattern.test(url);
// }

export const isValidWebsite = (url, account) => {
  const patterns = {
    facebook: /^https?:\/\/(www\.)?facebook\.com\/(profile\.php\?id=\d+|[A-Za-z0-9.]+)\/?$/,
    instagram: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?(?:\?[^\s]*)?$/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-._]+\/?$/,
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}(?:\?[^\s]*)?\/?$/,
    youtube: /^https?:\/\/(www\.)?(youtube\.com\/(channel\/[A-Za-z0-9_-]+|user\/[A-Za-z0-9_-]+|@?[A-Za-z0-9._-]+)|youtu\.be\/[A-Za-z0-9_-]+)(\?[^\s]*)?$/
  };
  const pattern = patterns[account];
  if (pattern) {
    return pattern.test(url.trim());
  }
  return false;
}

export const isValidMap = (url) => {
  const pattern = /^https?:\/\/(www\.)?(google\.[a-z]{2,3}(?:\.[a-z]{2})?|maps\.app\.goo\.gl)\/(maps\/)?[a-zA-Z0-9?=&,.;_-]*$/;
  return pattern.test(url);
}

export const removeSpecialCharectorWithoutDotSpace = (text) => {
  return text.replace(/[^\w. ]/g, "");
}

export const replaceCommasAndSemicolons = (text) => {
  return text.replace(/[;,]/g, '');
}

export const blockedEmoji = (text) => {
  return text.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F980}-\u{1FAFF}]/gu, '');
}

export const onlyNumberFormat = (text) => {
  return text.replace(/[^0-9]/g, "");
};
export const onlyDecimalFormat = (text) => {
  return text.match(/([0-9]*[\.]{0,1}[0-9]{0,2})/s)[0]
};
export const removeBeforeWhiteSpace = (text) => {
  return text.replace(/^[ ]+/g, "")
};

export const removeWhiteSpace = (text) => {
  return text.replace(/[ ]+/g, "")
};

export const frequencyFormat = (str) => {
  return /^(?!-)[\d.\s-]+$/.test(str);
};

export const hasNumber = (str) => {
  return /\d/.test(str);
}

export const isNumeric = (str) => {
  return /^[0-9]\d*$/.test(str);
}

export const isAlphabet = (str) => {
  return /^[a-zA-z\s]*$/.test(str);
}

export const isAlphabetExit = (str) => {
  return /[a-zA-Z]/.test(str);
}

export const capitalizeAfterSentence = (text) => {
  const regex = /([.?!]\s*|^)([a-z])/g;
  return text.replace(regex, (match, p1, p2) => p1 + p2.toUpperCase());
}

export const capitalizeFirstLetter = (text) => {
  if (!text) return ''; // Handle empty string case
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
export const capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

export const makeDefaultLogo = (text) => {
  var fullName = text !== undefined ? text.trim() : ''
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
  const array = ['0', '1']
  const results = text;
  let makeArray = []

  if (results.split("-")[0] && !results.split("-")[1] && !results.split("-")[2] && !results.split("-")[3]) {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        makeArray.push(`${results.split("-")[0]}-${array[i]}-${array[j]}`);
      }
    }
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        for (let k = 0; k < array.length; k++) {
          makeArray.push(`${results.split("-")[0]}-${array[i]}-${array[j]}-${array[k]}`);
        }
      }
    }
  } else if (results.split("-")[0] && results.split("-")[1] && !results.split("-")[2] && !results.split("-")[3]) {
    for (let i = 0; i < array.length; i++) {
      makeArray.push(`${results.split("-")[0]}-${results.split("-")[1]}-${array[i]}`);
    }
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        makeArray.push(`${results.split("-")[0]}-${results.split("-")[1]}-${array[i]}-${array[j]}`);
      }
    }
  } else if (results.split("-")[0] && results.split("-")[1] && results.split("-")[2] && !results.split("-")[3]) {
    makeArray.push(`${results.split("-")[0]}-${results.split("-")[1]}-${results.split("-")[2]}`);
    for (let i = 0; i < array.length; i++) {
      makeArray.push(`${results.split("-")[0]}-${results.split("-")[1]}-${results.split("-")[2]}-${array[i]}`);
    }
  } else if (results.split("-")[0] && results.split("-")[1] && results.split("-")[2] && results.split("-")[3]) {
    makeArray.push(`${results.split("-")[0]}-${results.split("-")[1]}-${results.split("-")[2]}-${results.split("-")[3]}`);
  }
  return makeArray;
}

export const medicine_freq_dosage_format = (freqDosage) => {
  var value = ''
  if (freqDosage == '0.5') {
    value = `1/2`
  } else if (freqDosage == '0.25') {
    value = `1/4`
  } else if (freqDosage == '0.75') {
    value = `3/4`
  } else {
    value = freqDosage
  }
  return value
}

export const calculateDose = (dosage, weight, concentration) => {
  const dose = (parseFloat(dosage) * parseFloat(weight)) / parseFloat(concentration);
  return !isNaN(dose) ? dose.toFixed(1).replace(/\.0$/, '') : "";
}

export const formatAmount = (amount) => {
  return amount.toFixed(2).replace(/\.00$/, '');
}

export const currencyFormat = (amount) => {
  return numeral(amount).format('0,0.00').replace(/\.00$/, '');
}

export const dataUrlToFile = (url, fileName) => {
  const [mediaType, data] = url.split(",");

  const mime = mediaType.match(/:(.*?);/)?.[0];

  var n = data.length;

  const arr = new Uint8Array(n);

  while (n--) {
    arr[n] = data.charCodeAt(n);
  }

  return new File([arr], fileName, { type: mime.substring(1, mime.length - 1) });
};

export const dataUrlToFileUsingFetch = async (url, fileName, mimeType) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  return new File([buffer], fileName, { type: mimeType });
};

export const errorMessage = async (error) => {
  if (typeof error === 'object' && error?.name == "TypeError") {
    return message.open({
      key: MESSAGE_KEY,
      type: 'error',
      className: 'error-red',
      content: (
        <div className='d-flex align-items-center'>
          <div>
            <div className='title-common text-start fontroboto'>Error</div>
            <div className='fontroboto text-start fw-normal mt-1'>We're Sorry, Somthing went wronng. Please <span className="text-underline">try again</span></div>
          </div>
        </div>
      ),
      duration: 2,
    });
  } else {
    return message.open({
      key: MESSAGE_KEY,
      type: "warning",
      content: typeof error === 'object' ? error.message : error,
      duration: 2,
    });
  }
};

export const handleCopy = async (url, msg = 'Copied') => {
  try {
    await navigator.clipboard.writeText(url);
    errorMessage(msg)
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

export const inputToLabel = (htmlString) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  const inputs = tempDiv.querySelectorAll('input');
  inputs.forEach(input => {
    console.log(input.type)
    if (input.type === "date") {
      const label = document.createElement('label');
      label.className = input.className;
      // label.id = input.id;
      label.textContent = input.value;
      input.parentNode.replaceChild(label, input);
    }
  });

  return tempDiv.innerHTML;
}

export const HTMLTransformer = (htmlString) => {
  // Create a temporary container to parse the HTML string
  let tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlString;

  // Select all label elements
  let labels = tempContainer.querySelectorAll('label');

  // Iterate over the labels and replace innerHTML content based on the class
  labels.forEach(label => {
    if (label.classList.contains('consulting_doctor')) {
      replaceContent(label, '{Consulting Doctor}');
    } else if (label.classList.contains('patient_name')) {
      replaceContent(label, '{Patient Name}');
    } else if (label.classList.contains('age')) {
      replaceContent(label, '{Age}');
    } else if (label.classList.contains('contact_number')) {
      replaceContent(label, '{Contact Number}');
    } else if (label.classList.contains('gender')) {
      replaceContent(label, '{Gender}');
    } else if (label.classList.contains('email')) {
      replaceContent(label, '{Email}');
    } else if (label.classList.contains('patient_id')) {
      replaceContent(label, '{Patient ID}');
    } else if (label.classList.contains('address')) {
      replaceContent(label, '{Address}');
    } else if (label.classList.contains('blood_group')) {
      replaceContent(label, '{Blood Group}');
    } else if (label.classList.contains('date_of_birth')) {
      replaceContent(label, '{Date of Birth}');
    } else if (label.classList.contains('today_date')) {
      replaceContent(label, '{Today Date}');
    } else if (label.classList.contains('department')) {
      replaceContent(label, '{Department}');
    } else if (label.classList.contains('referred_by')) {
      replaceContent(label, '{Referred by}');
    } else if (label.classList.contains('case_type')) {
      replaceContent(label, '{Case Type}');
    } else if (label.classList.contains('last_appointment')) {
      replaceContent(label, '{Last appointment}');
    } else if (label.classList.contains('inpatient_number')) {
      replaceContent(label, '{Inpatient Number}');
    } else if (label.classList.contains('ward')) {
      replaceContent(label, '{Ward}');
    } else if (label.classList.contains('room_bed')) {
      replaceContent(label, '{Room/Bed}');
    } else if (label.classList.contains('admitting_doctor')) {
      replaceContent(label, '{Admitting Doctor}');
    } else if (label.classList.contains('admitting_date')) {
      replaceContent(label, '{Admitting Date}');
    } else if (label.classList.contains('admitting_time')) {
      replaceContent(label, '{Admitting Time}');
    } else if (label.classList.contains('discharge_date')) {
      replaceContent(label, '{Discharge Date}');
    } else if (label.classList.contains('discharge_time')) {
      replaceContent(label, '{Discharge Time}');
    } else if (label.classList.contains('admitted_days')) {
      replaceContent(label, '{Admitted Days}');
    } else if (label.classList.contains('admission_diagnosis')) {
      replaceContent(label, '{Admission Diagnosis}');
    } else if (label.classList.contains('discharge_diagnosis')) {
      replaceContent(label, '{Discharge Diagnosis}');
    } else if (label.classList.contains('resident_of')) {
      replaceContent(label, '{Resident of}');
    } else if (label.classList.contains('start_date')) {
      replaceContent(label, '{Start Date}');
    } else if (label.classList.contains('end_date')) {
      replaceContent(label, '{End Date}');
    } else if (label.classList.contains('join_date')) {
      replaceContent(label, '{Join Date}');
    } else if (label.classList.contains('custom_date')) {
      replaceContent(label, '{Custom Date}');
    } else if (label.classList.contains('diagnosis')) {
      replaceContent(label, '{Diagnosis}');
    } else if (label.classList.contains('time')) {
      replaceContent(label, '{Time}');
    } else if (label.classList.contains('travel_from')) {
      replaceContent(label, '{Travel From}');
    } else if (label.classList.contains('travel_to')) {
      replaceContent(label, '{Travel To}');
    } else if (label.classList.contains('photo_id_card_no')) {
      replaceContent(label, '{Photo ID card No}');
    } else if (label.classList.contains('nationality')) {
      replaceContent(label, '{Nationality}');
    } else if (label.classList.contains('passport_number')) {
      replaceContent(label, '{Passport Number}');
    } else if (label.classList.contains('procedure')) {
      replaceContent(label, '{Procedure}');
    } else if (label.classList.contains('number_of_months')) {
      replaceContent(label, '{Number of Months}');
    }
  });

  // Get the modified HTML string
  return tempContainer.innerHTML;
}

function replaceContent(element, newText) {
  // Traverse through the child nodes and replace the text nodes
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = newText;
    } else {
      replaceContent(node, newText);
    }
  });
}

export const removeLabelTags = (htmlString) => {
  // Create a temporary container to parse the HTML string
  let tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlString;

  // Select all label elements
  let labels = tempContainer.querySelectorAll('label');

  labels.forEach(label => {
    // Create a document fragment to hold the inner content
    let fragment = document.createDocumentFragment();

    // Move all child nodes of the label into the fragment
    while (label.firstChild) {
      fragment.appendChild(label.firstChild);
    }

    // If the label has a style attribute, apply it to the nearest child element
    if (label.hasAttribute('style')) {
      if (fragment.firstChild && fragment.firstChild.nodeType === Node.ELEMENT_NODE && !fragment.firstChild.hasAttribute('style')) {
        fragment.firstChild.setAttribute('style', label.getAttribute('style'));
      }
    }

    // Replace the label with its content
    label.parentNode.replaceChild(fragment, label);
  });

  // Get the modified HTML string
  return tempContainer.innerHTML;
}

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
  const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
  const ageInMonths = Math.floor((ageInMilliseconds % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
  const ageInDays = Math.floor((ageInMilliseconds % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));

  return { years: ageInYears, months: ageInMonths, days: ageInDays };
};

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
  const apiDate = `${randomInteger(1, 31)}th ${randomMonthShort} ${randomInteger(2021, 2025)}`;
  // console.log('randomMonthShort: ', moment());

  return {
    patient_unique_id: randomInteger(10000, 99999),
    pam_id: randomInteger(10000, 99999),
    pm_first_name: NAMES_FIRST[randomInteger(0, 3)],
    pm_last_name: NAMES_LAST[randomInteger(0, 3)],
    pm_gender: "Male",
    ageYears: randomInteger(18, 99),
    pm_contact_no: `${randomInteger(10, 99)}058${randomInteger(11111, 99999)}`,
    toct_type: Math.random() < 0.5 ? "Follow-up" : Math.random() < 0.5 ? "New" : "Urgent",
    apTime: apiTime,
    apDate: apiDate,
  };
};

export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
        const base64string = pdfDataUri.slice(
          pdfDataUri.indexOf("base64,") + 7
        );
        const deviceUid = localStorage.getItem("app_device_unique_id");
        if (deviceUid) {
          const docRef = doc(db, chartType, deviceUid);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              await updateDoc(docRef, {
                base64string,
              });
            } else {
              await setDoc(doc(db, chartType, deviceUid), {
                base64string,
              });
            }
          } catch (error) {
            console.error("Error updating document:", error);
          }
        } else {
          console.error("Device UID not found");
        }
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
}

export const getClinicCity = (hospitalData) => {
  const decodedToken = getDecodedToken();
  const clinicId = decodedToken?.result?.clinic_id;
  const clinic = hospitalData?.find((e) => e?.hm_id == clinicId);
  return clinic ? clinic.hm_city : "";
}

export const getClinic = (hospitalData) => {
  const decodedToken = getDecodedToken();
  const clinicId = decodedToken?.result?.clinic_id;
  const clinic = hospitalData?.find((e) => e?.hm_id == clinicId);
  return clinic || "";
}

export const getTokenData = () => {
  const decodedToken = getDecodedToken();
  const result = decodedToken?.result;
  return result || {};
}

export const getDeviceSdkData = () => {
  return { device_info: deviceDetect(), sdk_version: packageJson?.version };
}

export const compressedFile = async (file) => {
  if (file.size > 2101546) {                       // If file size is greater than 2MB
    try {
      const options = {
        maxSizeMB: 2,                        // Target size: 2MB, the limit you want to enforce
        maxWidthOrHeight: 1920,              // Max dimension, but we aim to maintain original dimensions - 1280, 2560
        useWebWorker: true,                  // Use a web worker for performance
        alwaysKeepResolution: true           // Ensure original height and width are maintained
      };

      const compress = await imageCompression(file, options);

      // Preserve original file extension
      const fileExtension = file.name.split('.').pop(); // Get the original extension
      const newFileName = `${file.name.split('.')[0]}.${fileExtension}`;
      const renamedCompress = new File([compress], newFileName, { type: compress.type });

      return renamedCompress;

    } catch (error) {
      console.error("Error compressing the image:", error);
      return null;
    }
  }
  return file;
}

export const groupArray = async (array) => {
  const updatedArray = array.reduce((acc, currentItem) => {
    const { tmm_id, tmm_medicine_name } = currentItem;
    let group = acc.find(item => item.tmm_id == tmm_id);
    if (!group) {
      group = { tmm_id, tmm_medicine_name, data: [] };
      acc.push(group);
    }
    group.data.push({ ...currentItem });
    return acc;
  }, []);
  return updatedArray;
}

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
  return typeof id === 'string' && id.length === 24 && /^[a-f\d]{24}$/i.test(id);
}

export const trackEvent = (eventName, attributes) => {
  window.Moengage.track_event(eventName, attributes);
}

export const getIndianLanguageFont = (text, defaultFont = 'Roboto') => {

  // Devanagari (Hindi, Marathi, Sanskrit, Nepali, etc.)
  if (/[\u0900-\u097F]/.test(text)) {
    return 'NotoSansDevanagari';
  }

  // Bengali/Assamese
  if (/[\u0980-\u09FF]/.test(text)) {
    return 'NotoSansBengali';
  }

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'NotoSansTamil';
  }

  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return 'NotoSansTelugu';
  }

  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return 'NotoSansKannada';
  }

  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) {
    return 'NotoSansMalayalam';
  }

  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return 'NotoSansGujarati';
  }

  // Punjabi/Gurmukhi
  if (/[\u0A00-\u0A7F]/.test(text)) {
    return 'NotoSansGurmukhi';
  }

  // Oriya/Odia
  if (/[\u0B00-\u0B7F]/.test(text)) {
    return 'NotoSansOriya';
  }

  //urdu
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(text)) {
    return 'Urdu';
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
}

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
}
export const detectOperatingSystem = () => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  
  const os = {
    Windows: /Win/.test(platform),
    MacOS: /Mac/.test(platform),
    Linux: /Linux/.test(platform),
    iOS: /iPhone|iPad|iPod/.test(userAgent),
    Android: /Android/.test(userAgent)
  };

  return Object.keys(os).find(key => os[key]) || 'Unknown';
};
