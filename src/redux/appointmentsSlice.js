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
  changeHospitalResponse: {},
  caseTypes: []
};

export const getAllRecords = createAsyncThunk(
  "records/getAllRecords",
  async ({ startDate, endDate, pageNo, apStatue, filterVisitType }) => {
    try {
      const params = {
        startDate: startDate,
        endDate: endDate,
        apStatue: apStatue,
        filterVisitType: 1,
        page: pageNo
      };

      const result = await ApiAppointments.getAll(params);
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
  async ({record}) => {
    console.log('record: ', record);
    const data = {
      pam_id: record.pam_id,
      patient_unique_id: record.patient_unique_id 
    }
    let result = {};
    result = await ApiAppointments.cancelAppointments(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const changeHospital = createAsyncThunk(
  "records/changeHospital",
  async (clinicId) => {
    console.log('clinicId: ', clinicId);
    const data = {
      clinic_id: clinicId,
    }
    
    const result = await ApiAppointments.changeHospital(data);
    if (result.status) {
      return {
        ...result,
        clinicId
      };
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

export const getCaseTypes = createAsyncThunk(
  "records/getCaseTypes",
  async () => {
    try {
      const result = await ApiAppointments.getCaseTypes();
      console.log('getCaseTypes.result', result);
      if (result.status) {
        return result.data.case_type;
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

function removeObjectFromArrays(obj, targetObject) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
      // Remove the targetObject from the array if it exists
      obj[key] = obj[key].filter(item => item !== targetObject);
    }
  }
}

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
        console.log("getAllRecords.fulfilled: ", action.payload.app_data);
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
        const queueType = action.meta.arg.queueType;
        const pageNo = action.meta.arg.pageNo;
        state.records = {
          ...state.records,
          [queueType]: {
            ...state.records[queueType],
            [pageNo]: []
          },
        };

        state.counts = {
          queueCount: 0,
          finishedCount: 0,
          cancelledCount: 0,
        };
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
        state.patients = [];
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCaseTypes.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.caseTypes = action.payload;
      })
      .addCase(getCaseTypes.rejected, (state, action) => {
        console.log("getCaseTypes.rejected.action.payload: ", action);
        state.caseTypes = [];
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
      .addCase(changeHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // console.log('action.payload: ', action.payload);
        state.changeHospitalResponse = action.payload;
      })
      .addCase(changeHospital.rejected, (state, action) => {
        state.loading = false;
        state.changeHospitalResponse = null;
        state.error = action.error;
      })
      .addCase(cancelAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        console.log(" record.obj:",  action.meta.arg.record);
        removeObjectFromArrays(state.records.queue, action.meta.arg.record);
        console.log(" state.records:",  state.records);

        /* let source = [].concat(...Object.values(state.records.queue));
        console.log(" source.leng:",  source.length);
        const index = source.indexOf(action.meta.arg.record);
        console.log(" index:",  index); */

        /* const keys = Object.keys(state.records.queue);
        for(let i=0; i < keys.length; i++) {
          const key = keys[i];
          const listAti = state.records.queue[key];
          console.log(" listAti:",  listAti);
          const index = listAti.indexOf(action.meta.arg.record);
          console.log(" index:",  index);
        } */
        // TODO: Find and remove from queue and add to cancelled list
          
        state.counts = {
          ...state.counts,
          cancelledCount: state.counts.cancelledCount + 1,
          queueCount: state.counts.queueCount === 0 ? 0 : state.counts.queueCount - 1,
        };
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
