import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import appointmentsService from "../api/services/appointmentsService";
import { parseApiError } from "../utils/utils";

const initialState = {
  patients1: [],
  loading: false,
  error: null,
};

export const searchPatients = createAsyncThunk(
  "patients/searchPatients",
  async (query) => {
    let result = {};
    try {
      result = await appointmentsService.search(query);
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

const patientsSlice = createSlice({
  name: "patients",
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
      .addCase(searchPatients.pending, (state) => {
        console.log("loading: ");
        state.loading = true;
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.error = null;
        console.log("search.action.payload: ", action.payload);
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(searchPatients.rejected, (state, action) => {
        console.log("rejected: ", action.payload);
        state.loading = false;
        state.records = null;
        state.error = action.error;
      });
  },
});

export const { addRecord, updateRecord, deleteRecord } =
patientsSlice.actions;
export default patientsSlice.reducer;
