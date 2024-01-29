import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { parseApiError } from "../utils/utils";
import ApiAppointments from "../api/services/ApiAppointments";

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

export const getProfile = createAsyncThunk(
  "doctors/getProfile",
  async () => {
    let result = {};
    try {
      result = await ApiAppointments.getProfile();
      if (result.status) {
        return result.data[0];
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const changeHospital = createAsyncThunk(
  "records/changeHospital",
  async (data) => {
    const result = await ApiAppointments.changeHospital(data);
    if (result.status) {
      return result;
    } else {
      throw Error(result.error);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(changeHospital.pending, (state) => {
        state.loading = false;
      })
      .addCase(changeHospital.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changeHospital.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export default doctorsSlice.reducer;