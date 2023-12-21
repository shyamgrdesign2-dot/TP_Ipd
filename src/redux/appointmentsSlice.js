import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { parseApiError } from "../utils/utils";
import ApiAppointments from "../api/services/ApiAppointments";
import { TAB_FINISHED, TAB_QUEUE } from "../components/AppointmentData";

const initialState = {
  records: { app_data: [], queue: {}, finished: {}, cancelled: {} },
  loading: false,
  error: null,
  counts: {},
  patients: null,
  pincodeInfo: {},
  patientDetals: {},
};

export const getAllRecords = createAsyncThunk(
  "records/getAllRecords",
  async ({ startDate, endDate, pageNo, filterVisitType, queueType }) => {
    let result = {};
    try {
      const params = {
        startDate: startDate,
        endDate: endDate,
        apStatue: 0,
        filterVisitType,
        page: pageNo
      };
      result = await ApiAppointments.getAll(params);
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
    result = await ApiAppointments.search(query);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const clearSearch = createAsyncThunk("records/clearSearch", async () => {
  return null;
});

export const searchPincode = createAsyncThunk(
  "records/searchPincode",
  async (pincode) => {
    const body = {
      searchPincode: pincode,
    };
    try {
      const result = await ApiAppointments.searchPincode(body);
      if (result.status && result.data.pincode == pincode) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const addPatient = createAsyncThunk(
  "records/addPatient",
  async (patientInfo) => {
    const formData = new FormData();
    Object.keys(patientInfo).forEach((key) => {
      formData.append(key, patientInfo[key]);
    });

    try {
      const result = await ApiAppointments.addPatient(formData);
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

const appointmentsSlice = createSlice({
  name: "records",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const queueType = action.meta.arg.queueType;
        const pageNo = action.meta.arg.pageNo;
        console.log("arg.queueType: ", queueType);
        state.records = {
          ...state.records,
          [queueType]: {
            ...state.records[queueType],
            [pageNo]: [...action.payload.app_data]
          },
        };
        /* if (action.meta.arg.type === TAB_QUEUE) {
          state.records = {
            ...state.records,
            app_data: [...state.records.app_data, ...action.payload.app_data],
          };
        } else */
        /* if (action.meta.arg.type === TAB_QUEUE) {
          
        } else if (action.meta.arg.type === TAB_FINISHED) {
          state.records = {
            ...state.records,
            finished: {
              ...state.records.finished,
              [action.meta.arg.pageNo]: [...action.payload.app_data]
            },
          };
        } else {
          state.records = {
            ...state.records,
            cancelled: {
              ...state.records.cancelled,
              [action.meta.arg.pageNo]: [...action.payload.app_data]
            },
          };
        } */

        state.counts = {
          queueCount: action.payload?.queue_count ?? 0,
          finishedCount: action.payload?.finished_count ?? 0,
          cancelledCount: action.payload?.cancelled_count ?? 0,
        };
      })
      .addCase(getAllRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(searchAppointments.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(searchAppointments.fulfilled, (state, action) => {
        state.error = null;
        state.records = {
          app_data: action.payload,
        };
        state.loading = false;
        state.patients = action.payload;
        state.queueCount = action.payload?.queue_count ?? 0;
      })
      .addCase(searchAppointments.rejected, (state, action) => {
        console.log("search.rejected.action.payload: ", action);
        state.records = null;
        state.patients = [];
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchPincode.fulfilled, (state, action) => {
        state.error = null;
        console.log("searchPincode.action.payload: ", action);
        state.pincodeInfo = action.payload;
        state.error = action.error;
      })
      .addCase(searchPincode.rejected, (state, action) => {
        state.pincodeInfo = null;
        console.log("searchPincode.rejected.payload: ", action);
        state.error = action.error;
      })
      .addCase(addPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("addPatient.action.payload: ", action.payload);
        state.patientDetals = action.payload;
      })
      .addCase(addPatient.rejected, (state, action) => {
        state.loading = false;
        state.patientDetals = null;
        state.error = action.error;
      })
      .addCase(clearSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("clearSearch.fulfilled: ", action.payload);
        state.patients = null;
      });
  },
});

export const { addRecord, updateRecord, deleteRecord } =
  appointmentsSlice.actions;
export default appointmentsSlice.reducer;
