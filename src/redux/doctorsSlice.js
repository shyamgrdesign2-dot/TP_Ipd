import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { parseApiError } from "../utils/utils";
import ApiAppointments from "../api/services/ApiAppointments";
import ApiMedication from "../api/services/ApiMedication";

const initialState = {
  profile: null,
  loading: false,
  error: null,
  customizedPadLeftList: [],
  customizedPadRightList: [],
  timingList: [],
  frequencyList: [],
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

export const customizedPad = createAsyncThunk(
  "records/customizedPad",
  async (data) => {
    try {
      const result = await ApiAppointments.customizedPad(data);
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

export const swtichLayout = createAsyncThunk(
  "records/swtichLayout",
  async (data) => {
    try {
      const result = await ApiAppointments.swtichLayout(data);
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

export const navigatetoTatvaPedia = createAsyncThunk(
  "records/navigatetoTatvaPedia",
  async () => {
    try {
      const result = await ApiAppointments.navigatetoTatvaPedia();
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

export const showMedicineFrequency = createAsyncThunk(
  "medication/showMedicineFrequency",
  async () => {
    let result = {};
    result = await ApiMedication.showMedicineFrequency();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const showMedicineTime = createAsyncThunk(
  "medication/showMedicineTime",
  async () => {
    let result = {};
    result = await ApiMedication.showMedicineTime();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    changeLogoStatus: (state) => {
      state.profile = { ...state.profile, NavigatetoTatvaPedia: 1 }
    }
  },
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
      .addCase(customizedPad.pending, (state, action) => {
        state.loading = action.meta.arg.data.default ? false : true;
      })
      .addCase(customizedPad.fulfilled, (state, action) => {
        state.loading = false;
        state.customizedPadLeftList = action.payload.left != undefined ? action.payload.left : []
        state.customizedPadRightList = action.payload.right != undefined ? action.payload.right : []
      })
      .addCase(customizedPad.rejected, (state) => {
        state.loading = false;
      })
      .addCase(swtichLayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(swtichLayout.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(swtichLayout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(navigatetoTatvaPedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(navigatetoTatvaPedia.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(navigatetoTatvaPedia.rejected, (state) => {
        state.loading = false;
      })
      .addCase(showMedicineFrequency.fulfilled, (state, action) => {
        state.frequencyList = action.payload;
      })
      .addCase(showMedicineFrequency.rejected, (state) => {
        state.frequencyList = [];
      })
      .addCase(showMedicineTime.fulfilled, (state, action) => {
        state.timingList = action.payload;
      })
      .addCase(showMedicineTime.rejected, (state) => {
        state.timingList = [];
      });
  },
});

export const { changeLogoStatus } = doctorsSlice.actions
export default doctorsSlice.reducer;