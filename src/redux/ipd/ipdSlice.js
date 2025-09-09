import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiIpdService from "../../api/services/ipd/ipdService";
import { customizationMockData } from "../../utils/mockData";
import { IPD } from "../../utils/locale";

const initialState = {
  // patientDetails: {
  //   details: {
  //     id: "123",
  //     name: "Abhishek Kunte",
  //     gender: "Male",
  //     age: 30,
  //     contact: "+91-9876543210",
  //   },
  //   ward: {
  //     id: 1,
  //     title: "General Ward",
  //   },
  //   room: {
  //     id: 101,
  //     title: "101",
  //   },
  //   doctor: {
  //     id: 524,
  //     name: "Dr. Ramesh Shah",
  //   },
  //   admittedOn: "2025-08-05T10:00:00.000Z",
  //   _id: "68ad7740ecbc6168f6270f9e",
  //   referral: false,
  // },
  patientDetails: {},
  customization: {},
  loading: false,
  singleTemplate: null,
};

export const fetchSingleTemplate = createAsyncThunk(
  "ipd/fetchSingleTemplate",
  async (data) => {
    let result = {};
    try {
      result = await ApiIpdService.fetchSingleTemplate(data);
      return result.data;
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const getCustomization = createAsyncThunk(
  "ipd/getCustomization",
  async () => {
    try {
      let result = {};
      result = await ApiIpdService.getCustomization();
      if (result?.settings) {
        return result?.settings;  
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const updateCustomization = createAsyncThunk(
  "ipd/updateCustomization",
  async (data) => {
    try {
      let result = {};
      result = await ApiIpdService.updateCustomization(data);
      if (result.message === 'form customization updated successfully.') {
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

const ipdSlice = createSlice({
  name: "ipd",
  initialState,
  reducers: {
    setPatientDetailsInOldFormat: (state, action) => {
      state.patientDetails = action.payload;
    },
    setCustomization: (state, action) => {
      state.customization = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomization.fulfilled, (state, action) => {
        state.loading = false;
        state.customization = action.payload;
      })
      .addCase(getCustomization.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomization.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCustomization.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchSingleTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.singleTemplate = action.payload;
      })
      .addCase(fetchSingleTemplate.rejected, (state, action) => {
        state.loading = false;
        state.singleTemplate = null;
      });
  },
});

export const { setPatientDetailsInOldFormat, setCustomization } = ipdSlice.actions;
export default ipdSlice.reducer;
