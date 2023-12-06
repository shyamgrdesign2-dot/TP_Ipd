import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { parseApiError } from "../utils/utils";
import ApiAppointments from '../api/services/ApiAppointments';

const initialState = {
  records: [],
  loading: false,
  error: null,
  queueCount: 0,
  patients: [],
  pincodeInfo: {}
};

export const getAllRecords = createAsyncThunk(
  "records/getAllRecords",
  async ({ startDate, endDate, pageNo }) => {
    let result = {};
    try {
      const sendData = {
        startDate: startDate,
        endDate: endDate,
        apStatue: 0,
        filterVisitType: "14",
        page: pageNo,
      }
      result = await ApiAppointments.getAll(sendData);
      console.log("results: ", result);
      if (result.status) {
        return result.data;
      }
    } catch (error) {
      console.log("error: ", error);
      if (error.response.status === 401) {
        // redirect here
        throw parseApiError(error);
      } else {
        // API failed, return some meaningful error
        throw parseApiError(error);
      }
    }
  }
);

export const searchAppointments = createAsyncThunk(
  "records/searchAppointments",
  async (query) => {
    let result = {};
    try {
      result = await ApiAppointments.search(query);
      console.log("results: ", result);
      if (result.status) {
        return result.data;
      }
    } catch (error) {
      console.log("error: ", error);
      if (error.response.status === 401) {
        // redirect here
        throw parseApiError(error);
      } else {
        // API failed, return some meaningful error
        throw parseApiError(error);
      }
    }
  }
);

export const searchPincode = createAsyncThunk(
  "records/searchPincode",
  async (pincode) => {
    const body = {
      searchPincode: pincode,
    }
    try {
      const result = await ApiAppointments.searchPincode(body);
      console.log("results: ", result);
      if (result.status && result.data.pincode == pincode) {
        console.log("pincode: ", result.data.pincode);
        return result.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error: ", error);
      if (error.response.status === 401) {
        // redirect here
        throw parseApiError(error);
      } else {
        // API failed, return some meaningful error
        throw parseApiError(error);
      }
    }
  }
);

const appointmentsSlice = createSlice({
  name: "records",
  initialState,
  reducers: {
    addRecord: (state, action) => {
      const uuid = uuidv4();
      const values = {
        ...action.payload,
        uuid,
      };
      state.records.push(values);
    },
    updateRecord: (state, action) => {
      const index = state.records.findIndex(
        (record) => record.uuid === action.payload.uuid
      );
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord: (state, action) => {
      state.records = state.records.filter(
        (record) => record.uuid !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('getAllRecords.action.payload: ', action.payload);
        state.records = action.payload;
        state.queueCount = action.payload?.queue_count ?? 0;
      })
      .addCase(getAllRecords.rejected, (state, action) => {
        state.loading = false;
        state.records = null;
        state.error = action.error;
      })
      .addCase(searchAppointments.fulfilled, (state, action) => {
        state.error = null;
        console.log('search.action.payload: ', action.payload);
        state.records = {
          app_data: action.payload
        };
        state.patients = action.payload;
        state.queueCount = action.payload?.queue_count ?? 0;
      })
      .addCase(searchAppointments.rejected, (state, action) => {
        state.records = null;
        state.error = action.error;
      })
      .addCase(searchPincode.fulfilled, (state, action) => {
        state.error = null;
        console.log('searchPincode.action.payload: ', action);
        state.pincodeInfo = action.payload;
      })
      .addCase(searchPincode.rejected, (state, action) => {
        state.pincodeInfo = null;
        state.error = action.error;
      });
  },
});

export const { addRecord, updateRecord, deleteRecord } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
