import moment from 'moment';

import config from "../config";

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const trimEllip = (source, length) => {
  if(source == null) {
    return "";
  }
  return source.length > length ? source.substring(0, length) + "..." : source;
};

export const isLocalDev = () => {
  if(config.placeholderApiUrl.includes("ninjasforjava.com")) {
    return true;
  }

  if(window.location.includes("localhost:")) {
    return true;
  }
  return false;
};

export const getFormattedDate = (date) => {
  if(!date) {
    return "";
  }
  const dateObj = new Date(date+" UTC");
  return moment(dateObj).format('DD/MM/YY');
};

const getTime = (date) => {
  return date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
};

export const parseApiError = (errorResponse) => {
  console.log("errorResponse: ", errorResponse);
  if(!errorResponse) {
    return "Something went wrong!";
  }

  if(errorResponse.response?.data?.error) {
    return errorResponse.response?.data?.error;
  }

  if(errorResponse.message) {
    return errorResponse.message;
  }
  
  if(errorResponse.data && Array.isArray(errorResponse.data)) {
    const errorArray = errorResponse.data;
    if(errorArray.length > 0) {
      const firstItem = errorArray[0];
      const firstItemError = `${firstItem.type} ${firstItem.msg} ${firstItem.path}`;
      return firstItemError;
    } else {
      return "Something went wrong!";
    }
  }
};
