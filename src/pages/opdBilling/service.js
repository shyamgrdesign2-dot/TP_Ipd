import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.lab_params_api_url };

export const fetchPrintSetting = async function () {
  let res = {};
  try {
    res = await api.get(`/api/v1/billing/printSetting`, baseUrl);
  } catch (e) {
    console.error("Error while fetching Print settings details: ", e);
  }
  return res;
};

export const updatePrintSetting = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/api/v1/billing/printSetting`, payload, baseUrl);
  } catch (e) {
    console.error("Error while updating Billing Print Setting Data: ", e);
  }
  return res;
};

export const deletePrintSetting = async function () {
  let res = {};
  try {
    res = await api.delete(`/api/v1/billing/printSetting`, baseUrl);
  } catch (e) {
    console.error("Error while deleting the Print Setting: ", e);
  }
  return res;
};

// Function to process a bill refund
export const processBillRefund = async function (payload) {
  let res = {};
  try {
    const apiUrl = `/api/v1/billing/bill/refund`;

    // Make the API call
    res = await api.post(apiUrl, payload, baseUrl);
  } catch (e) {
    console.error("Error while processing bill refund: ", e);
  }
  return res;
};
export const createBill = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/api/v1/billing/bill`, payload, baseUrl);
  } catch (e) {
    console.error("Error while Creating Bill: ", e);
  }
  return res;
};

export const fetchAdvanceSetting = async function () {
  let res = {};
  try {
    res = await api.get(`/api/v1/billing/advancedSetting`, baseUrl);
  } catch (e) {
    console.error("Error while fetching Advance settings details: ", e);
  }
  return res;
};

export const searchBillItem = async function (searchQuery) {
  let res = {};
  try {
    res = await api.get(
      `/api/v1/billing/billItem?search=${searchQuery}`,
      baseUrl
    );
  } catch (e) {
    console.error("Error while fetching search bill items: ", e);
  }
  return res;
};

// Function to fetch billing dashboard data
export const fetchBillingDashboard = async function (params) {
  let res = {};
  try {
    // Construct query parameters
    const queryParams = {
      search: params.search,
      doctorIds: params.doctorIds,
      startDate: params.startDate,
      endDate: params.endDate,
      sortBy: params.sortBy || "date", // Default sorting field
      sortOrder: params.sortOrder || "desc", // Default sorting order
      page: params.page || 1,
      limit: params.limit || 25,
    };

    // Conditionally add isForm3C **only if the key exists in params**
    if ("isForm3C" in params) {
      queryParams.isForm3C = params.isForm3C;
    }
    // Convert status array into multiple query params
    let statusParams = "";
    if (params.status) {
      statusParams = params.status
        .map((status) => `status=${encodeURIComponent(status)}`)
        .join("&");
    }

    // Construct the final query string
    const queryString = new URLSearchParams(queryParams).toString();
    const apiUrl = `/api/v1/billing/bill/dashboard?${queryString}${
      statusParams ? `&${statusParams}` : ""
    }`;

    // Make the API call
    res = await api.get(apiUrl, baseUrl);
  } catch (e) {
    console.error("Error while fetching billing dashboard data: ", e);
  }
  return res;
};

export const upsertBillItem = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/api/v1/billing/billItem`, payload, baseUrl);
  } catch (e) {
    console.error("Error while upserting bill item: ", e);
  }
  return res;
};

export const deleteBillItem = async function (itemId) {
  let res = {};
  try {
    res = await api.post(`api/v1/billing/bill/addToForm3C`, payload, baseUrl);
  } catch (e) {
    console.error("Error while fetching patient due amount: ", e);
  }
  return res;
};

// Function to fetch Form 3C billing data
export const fetchForm3CBills = async function (params) {
  let res = [];
  try {
    res = await api.get(`/api/v1/billing/dashboard/bills`, baseUrl);
  } catch (e) {
    console.error("Error while fetching Form 3C bills: ", e);
  }
  return res;
};

// Function to add advanced deposit
export const createAdvancedDeposit = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/api/v1/billing/advancedDeposit`, payload, baseUrl);
  } catch (e) {
    console.error("Error while adding advanced deposit: ", e);
  }
  return res;
};

// Function to list advanced deposits by patient
export const listAdvancedDepositByPatient = async function (params) {
  let res = {};
  try {
    // Extract non-array query parameters
    const queryParams = {
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      patientId: params.patientId,
      page: params.page || 1, // Default to page 1 if not provided
      limit: params.limit || 25, // Default to limit 25 if not provided
    };

    // Handle the 'status' array to create multiple status query parameters
    const statusParams = params.status
      ? params.status
          .map((status) => `status=${encodeURIComponent(status)}`)
          .join("&")
      : "";

    // Combine query parameters into a single query string
    const queryString =
      new URLSearchParams(queryParams).toString() +
      (statusParams ? `&${statusParams}` : "");

    // Construct the final API URL
    const apiUrl = `/api/v1/billing/advancedDeposit/listByPatient?${queryString}`;

    // Perform the API request
    res = await api.get(apiUrl, {
      customBaseUrl: baseUrl.customBaseUrl,
    });
  } catch (e) {
    console.error("Error while listing advanced deposits by patient: ", e);
  }
  return res;
};

export const fetchBillsByPatient = async function (params) {
  let res = {};
  try {
    // Construct query parameters dynamically
    const queryParams = {
      search: params.search,
      doctorIds: params.doctorIds,
      startDate: params.startDate,
      endDate: params.endDate,
      sortBy: params.sortBy || "date",
      sortOrder: params.sortOrder || "asc",
      page: params.page || 1,
      limit: params.limit || 25,
      patientId: params.patientId,
      // ...(params.isForm3C ? { isForm3C: params.isForm3C } : {}), // Add only if true
    };

    // Create query string
    const queryString = new URLSearchParams(queryParams).toString();

    // API call
    res = await api.get(`/api/v1/billing/bill/listByPatient?${queryString}`, baseUrl);
  } catch (e) {
    console.error("Error while fetching bills by patient: ", e);
  }
  return res;
};

// Function to get advanced deposit dashboard data
export const fetchAdvancedDepositDashboard = async function (params) {
  let res = {};
  try {
    const queryParams = {
      status: params.status, // Pass an array, Axios will handle repeated query params
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      page: params.page,
      limit: params.limit,
      startDate: params.startDate,
      endDate: params.endDate,
      patientName: params.patientName,
      patientPhone: params.patientPhone,
    };
    res = await api.get(`/api/v1/billing/advancedDeposit/dashboard`, {
      params: queryParams,
      customBaseUrl: baseUrl.customBaseUrl,
    });
  } catch (e) {
    console.error("Error while fetching advanced deposit dashboard data: ", e);
  }
  return res;
};

// Function to add bills to Form 3C
export const addToForm3C = async function (billIds) {
  let res = {};
  try {
    // API request payload
    const payload = {
      billIds: billIds, // Array of bill IDs
    };

    res = await api.post(`/api/v1/billing/bill/addToForm3C`, payload, baseUrl);
  } catch (e) {
    console.error("Error while adding bills to Form 3C: ", e);
  }
  return res;
};
