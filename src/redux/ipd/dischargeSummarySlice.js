import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiDischargeSummary from "../../api/services/ipd/ApiDischargeSummary";

export const initialState = {
  dischargeSummaryData: [],
  loading: false,
  currentDischargeSummaryId: null,
  dischargeSummaryFormDetails: {}
};

export const getDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/getDischargeSummaryData",
  async (data, { rejectWithValue }) => {
    try {
      const result = await ApiDischargeSummary.getDischargeSummary(data);
      if (Array.isArray(result)) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response?.data?.message
      });
    }
  }
);

export const addDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/addDischargeSummaryData", 
  async (data) => {
    try {
      const result = await ApiDischargeSummary.addDischargeSummary(data);
      if (result.data?.length) {
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

export const updateDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/updateDischargeSummaryData",
  async (data) => {
    try {
      const result = await ApiDischargeSummary.updateDischargeSummary(data);
      if (result.message === "discharge summary created successfully.") {
        return result;
      } else {
        return result?.data;
      }
    } catch (error) {
      throw Error(error); 
    }
  }
);

const dischargeSummarySlice = createSlice({
  name: "dischargeSummary",
  initialState,
  reducers: {
    setDischargeSummaryData: (state, action) => {
      state.dischargeSummaryData = action.payload;
    },
    setDischargeSummaryFormDetails: (state, action) => {
      state.dischargeSummaryFormDetails = action.payload || {};
    },
    setCurrentDischargeSummaryId: (state, action) => {
      state.currentDischargeSummaryId = action.payload || null;
    },
    resetDischargeSummaryForm: (state) => {
      state.dischargeSummaryFormDetails = initialState.dischargeSummaryFormDetails;
      state.currentDischargeSummaryId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeSummaryData = action.payload;
      })
      .addCase(getDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.loading = false;
      })
      .addCase(addDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeSummaryData = action.payload;
      })
      .addCase(addDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.loading = false;
      })
      .addCase(updateDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeSummaryData = action.payload;
      })
      .addCase(updateDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.loading = false;
      });
  }
});

export const {
  setDischargeSummaryData,
  setDischargeSummaryFormDetails,
  setCurrentDischargeSummaryId,
  resetDischargeSummaryForm
} = dischargeSummarySlice.actions;

export default dischargeSummarySlice.reducer;
