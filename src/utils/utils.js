import moment from "moment";

import config from "../config";

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const onlyNumberFormat = (text) => {
  return text.replace(/[^0-9]/g, "");
};
export const onlyDecimalFormat = (text) => {
  return text.match(/([0-9]*[\.]{0,1}[0-9]{0,2})/s)[0]
};
export const removeBeforeWhiteSpace = (text) => {
  return text.replace(/^[ ]+/g, "")
};

export const makeDefaultLogo = (text) => {
  var fullName = text != undefined ? text.trim() : ''
  if (!fullName) {
    return "HG";
  }
  const regex = /\s+/;
  const results = fullName.split(regex);
  if (results.length == 1) {
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
  const dateObj = new Date(date + " UTC");
  return moment(dateObj).format("YYYY-MM-DD");
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
