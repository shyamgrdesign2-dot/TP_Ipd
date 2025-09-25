import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import ApiCrossReferral from "../../api/services/ipd/ApiCrossReferral";

export const initialState = {
  crossReferralData: {},
  loading: false,
  currentCrossReferralId: null, //"68d26742d5f86080a3a6383a", 
  currentCrossReferralFilledByDetails: null,
  crossReferralFormDetails: {},
};

export const getCrossReferralData = createAsyncThunk(
  "crossReferral/getCrossReferralData",
  async (data, {rejectWithValue}) => {
    try {
      let result = {};
      result = await ApiCrossReferral.getCrossReferral(data);
      if (Array.isArray(result)) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({ visible: false, message: error.response.data.message });
    }
  }
);
export const addCrossReferralData = createAsyncThunk(
  "crossReferral/addCrossReferralData",
  async (data) => {
    try {
      let result = {};
      result = await ApiCrossReferral.addCrossReferral(data);
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
export const updateCrossReferralData = createAsyncThunk(
  "crossReferral/updateCrossReferralData",
  async (data) => {
    try {
      let result = {};
      result = await ApiCrossReferral.updateCrossReferral(data);
      if (result.data?.length) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      throw Error(error);
    }
  }
);

const crossReferralSlice = createSlice({
  name: "crossReferral",
  initialState,
  reducers: {
    setCrossReferralData: (state, action) => {
      state.crossReferralData = action.payload;
    },
    setCrossReferralFormDetails: (state, action) => {
      state.crossReferralFormDetails = action.payload || {};
    },
    setCurrentCrossReferralFilledByDetails: (state, action) => {
      state.currentCrossReferralFilledByDetails = action.payload || null;
    },
    setSingleCrossReferralData: (state, action) => {
      state.crossReferralData = action.payload || null;
    },
    setCurrentCrossReferralId: (state, action) => {
      state.currentCrossReferralId = action.payload || null;
    },
    resetCrossReferralForm: (state) => {
      state.crossReferralFormDetails = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCrossReferralData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCrossReferralData.fulfilled, (state, action) => {
        state.loading = false;
        state.crossReferralData = action.payload;
      })
      .addCase(getCrossReferralData.rejected, (state, action) => {
        state.crossReferralData = {};
        state.loading = false;
      })
      .addCase(addCrossReferralData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCrossReferralData.fulfilled, (state, action) => {
        state.loading = false;
        state.crossReferralData = action.payload;
      })
      .addCase(addCrossReferralData.rejected, (state, action) => {
        state.crossReferralData = [];
        state.loading = false;
      })
      .addCase(updateCrossReferralData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCrossReferralData.fulfilled, (state, action) => {
        state.loading = false;
        state.crossReferralData = action.payload;
      })
      .addCase(updateCrossReferralData.rejected, (state, action) => {
        state.crossReferralData = [];
        state.loading = false;
      });
  },
});

export const {
  setCrossReferralData,
  setCrossReferralFormDetails,
  setCurrentCrossReferralFilledByDetails,
  setSingleCrossReferralData,
  setCurrentCrossReferralId,
  resetCrossReferralForm
} = crossReferralSlice.actions;
export default crossReferralSlice.reducer;
