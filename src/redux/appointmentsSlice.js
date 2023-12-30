import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiAppointments from "../api/services/ApiAppointments";
import { STRING_QUEUE_TYPE_CANCELLED, STRING_QUEUE_TYPE_FINISHED, STRING_QUEUE_TYPE_QUEUE } from "../components/AppointmentData";

const initialState = {
  records: { queue: {}, finished: {}, cancelled: {} },
  loading: false,
  error: null,
  counts: {},
  patients: null,
  pincodeInfo: {},
  patientDetals: {},
  changeHospitalResponse: {},
  caseTypes: [],
  cancelledAppointment: null,
  endedAppointment: null,
};

export const getAllRecords = createAsyncThunk(
  "records/getAllRecords",
  async ({ startDate, endDate, pageNo, apStatue, filterVisitType }) => {
    try {
      const params = {
        startDate: startDate,
        endDate: endDate,
        apStatue: apStatue,
        filterVisitType: "",
        page: pageNo,
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
  async ({ searchQuery, queueType }) => {
    console.log("queueType: ", queueType);
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
  async ({ appointment }) => {
    console.log("appointment: ", appointment);
    const data = {
      pam_id: appointment.pam_id,
      patient_unique_id: appointment.patient_unique_id,
    };
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
    console.log("clinicId: ", clinicId);
    const data = {
      clinic_id: clinicId,
    };

    const result = await ApiAppointments.changeHospital(data);
    if (result.status) {
      return {
        ...result,
        clinicId,
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
      console.log("searchPincode.result", result);
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
      console.log("getCaseTypes.result", result);
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
      console.log("result: ", result);
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

export const endVisit = createAsyncThunk(
  "records/endVisit",
  async ({ appointment }) => {

    try {
      const result = await ApiAppointments.endVisit(appointment);
      console.log("result: ", result);
      if (result.status) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

function removeObjectFromArrays(source, targetObject) {
  for (const page in source) {
    if (source.hasOwnProperty(page) && Array.isArray(source[page])) {
      // Remove the targetObject from the array if it exists
      source[page] = source[page].filter((item) => item !== targetObject);
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
            [pageNo]: [...action.payload.app_data.map((data, index) => {
              return {
                ...data,
                pageNo: pageNo,
                indexInPage: index
              }
            })],
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
            [pageNo]: [],
          },
        };

        if(queueType === STRING_QUEUE_TYPE_QUEUE) {
          state.counts = {
            ...state.counts,
            queueCount: 0
          };
        } else if(queueType === STRING_QUEUE_TYPE_FINISHED) {
          state.counts = {
            ...state.counts,
            finishedCount: 0
          };
        } else if(queueType === STRING_QUEUE_TYPE_CANCELLED) {
          state.counts = {
            ...state.counts,
            cancelledCount: 0
          };
        }
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
            [pageNo]: [...action.payload],
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
            [pageNo]: [],
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
      .addCase(endVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cancelledAppointment = null;
        const endedAppointment = action.meta.arg.appointment;
        
        console.log('endedAppointment: ', endedAppointment);

        // set response
        state.endedAppointment = action.payload;

        // remove from the queue
        state.records.queue[endedAppointment.pageNo].splice(endedAppointment.indexInPage, 1);

        // add to cancelled list
        const cancelledFirstPage = state.records.finished[0];
        state.records = {
          ...state.records,
          "finished": {
            ...state.records.cancelled,
            [0]: cancelledFirstPage && cancelledFirstPage.length > 0 ? [endedAppointment, ...cancelledFirstPage] : [endedAppointment]
          }
        }
        
        // update the counts.
        state.counts = {
          ...state.counts,
          finishedCount: state.counts.finishedCount + 1,
          queueCount:
            state.counts.queueCount === 0 ? 0 : state.counts.queueCount - 1,
        };
      })
      .addCase(endVisit.rejected, (state, action) => {
        state.loading = false;
        state.endedAppointment = null;
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
        state.endedAppointment = null;
        const cancelledAppointment = action.meta.arg.appointment;
        
        console.log('cancelledAppointment: ', cancelledAppointment);

        // set response
        state.cancelledAppointment = cancelledAppointment;

        // remove from the queue
        state.records.queue[cancelledAppointment.pageNo].splice(cancelledAppointment.indexInPage, 1);

        // add to cancelled list
        const cancelledFirstPage = state.records.cancelled[0];
        state.records = {
          ...state.records,
          "cancelled": {
            ...state.records.cancelled,
            [0]: cancelledFirstPage && cancelledFirstPage.length > 0 ? [cancelledAppointment, ...cancelledFirstPage] : [cancelledAppointment]
          }
        }
        
        // update the counts.
        state.counts = {
          ...state.counts,
          cancelledCount: state.counts.cancelledCount + 1,
          queueCount:
            state.counts.queueCount === 0 ? 0 : state.counts.queueCount - 1,
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
            [pageNo]: [],
          },
        };

        state.patients = null;
      });
  },
});

export const { addRecord, updateRecord, deleteRecord } =
  appointmentsSlice.actions;
export default appointmentsSlice.reducer;
