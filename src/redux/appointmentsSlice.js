import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiAppointments from "../api/services/ApiAppointments";

const initialState = {
  records: { queue: {}, finished: {}, cancelled: {} },
  loading: false,
  error: null,
  counts: {},
  patients: null,
  pincodeInfo: {},
  patientDetals: {},
};

export const getAllRecords = createAsyncThunk(
  "records/getAllRecords",
  async ({ startDate, endDate, pageNo, filterVisitType }) => {
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
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const searchPatients = createAsyncThunk(
  "records/searchPatients",
  async (searchQuery) => {
    let result = {};
    result = await ApiAppointments.searchPatients(searchQuery);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const searchAppointments = createAsyncThunk(
  "records/searchAppointments",
  async ({searchQuery, queueType}) => {
    console.log('queueType: ', queueType);
    let result = {};
    result = await ApiAppointments.searchPatients(searchQuery);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const cancelAppointments = createAsyncThunk(
  "records/cancelAppointments",
  async (data) => {
    console.log('data: ', data);
    let result = {};
    result = await ApiAppointments.cancelAppointments(data);
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
      console.log('searchPincode.result', result);
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
      console.log('result: ', result)
      if (result.status) {
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
        // console.log("arg.queueType: ", queueType);
        state.records = {
          ...state.records,
          [queueType]: {
            ...state.records[queueType],
            [pageNo]: [...action.payload.app_data]
          },
        };

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
      .addCase(searchPatients.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.patients = action.payload;
        state.queueCount = action.payload?.queue_count ?? 0;
      })
      .addCase(searchPatients.rejected, (state, action) => {
        console.log("search.rejected.action.payload: ", action);
        state.patients = [];
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchAppointments.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(searchAppointments.fulfilled, (state, action) => {
        state.error = null;
        const queueType = action.meta.arg.queueType;
        const pageNo = action.meta.arg.pageNo;
        console.log("search.arg.queueType: ", queueType);
        state.records = {
          ...state.records,
          [queueType]: {
            [pageNo]: [...action.payload]
          },
        };

        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(searchAppointments.rejected, (state, action) => {
        console.log("search.rejected.action.payload: ", action);
        const queueType = action.meta.arg.queueType;
        const pageNo = action.meta.arg.pageNo;
        console.log("search.arg.queueType: ", queueType);
        state.records = {
          ...state.records,
          [queueType]: {
            [pageNo]: []
          },
        };
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
        state.patientDetals = action.payload;
      })
      .addCase(addPatient.rejected, (state, action) => {
        state.loading = false;
        state.patientDetals = null;
        state.error = action.error;
      })
      .addCase(cancelAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("cancelAppointments.action.payload: ", action.payload);
        state.patientDetals = action.payload;
      })
      .addCase(cancelAppointments.rejected, (state, action) => {
        state.loading = false;
        state.patientDetals = null;
        console.log("cancelAppointments.rejected: ", action.error);
        state.error = action.error;
      })
      .addCase(clearSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("clearSearch.fulfilled: ", action.payload);

        const queueType = action.meta.arg?.queueType;
        const pageNo = action.meta.arg?.pageNo;
        console.log("clearSearch.arg.queueType: ", queueType);
        state.records = {
          ...state.records,
          [queueType]: {
            [pageNo]: []
          },
        };

        state.patients = null;
      });
  },
});

export const { addRecord, updateRecord, deleteRecord } =
  appointmentsSlice.actions;
export default appointmentsSlice.reducer;
