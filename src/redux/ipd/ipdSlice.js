// redux/ipd/ipdSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiIpdService from "../../api/services/ipd/ipdService";
import { customizationMockData } from "../../utils/mockData";
import { IPD } from "../../utils/locale";

const initialState = {
  patientDetails: {},
  customization: {},
  loading: false,
  singleTemplate: null,
  doctorDepartmentRoles: null,
  wards: null, // <-- NEW
  patientsSearch: {
    loading: false,
    list: [],
    error: null,
  },
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

export const searchPatientsByMobile = createAsyncThunk(
  "ipd/searchPatientsByMobile",
  async ({ mobile, countryCode }) => {
    try {
      const res = await ApiIpdService.searchPatientsByMobile({
        mobile,
        countryCode,
      });
      return res; // keep same passthrough convention
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
      result = await ApiIpdService.updateCustomization({
        progressNotes: [],
        crossReferral: [],
        otNotes: [],
        dischargeSummary: [],
        ...data,
      });
      if (result.message === "form customization updated successfully.") {
        return data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const doctorDepartmentRoles = createAsyncThunk(
  "ipd/doctorDepartmentRoles",
  async () => {
    try {
      let result = {};
      result = await ApiIpdService.doctorDepartmentRoles();
      return result; // NOTE: stays consistent with your existing pattern
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

// ---------- NEW: Wards ----------
export const fetchWards = createAsyncThunk("ipd/fetchWards", async () => {
  try {
    let result = {};
    result = await ApiIpdService.getWards();
    return result; // keep same pattern as above thunks
  } catch (error) {
    console.log("error: ", error);
    throw Error(error);
  }
});

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
    setDoctorDepartmentRoles: (state, action) => {
      state.doctorDepartmentRoles = action.payload;
    },
    // optional: setter for wards if you need it elsewhere
    setWards: (state, action) => {
      state.wards = action.payload;
    },
    clearPatientsSearch: (state) => {
      state.patientsSearch = { loading: false, list: [], error: null };
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
      .addCase(getCustomization.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomization.fulfilled, (state, action) => {
        state.loading = false;
        state.customization = action.payload;
      })
      .addCase(updateCustomization.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchSingleTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.singleTemplate = action.payload;
      })
      .addCase(fetchSingleTemplate.rejected, (state) => {
        state.loading = false;
        state.singleTemplate = null;
      })
      .addCase(doctorDepartmentRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(doctorDepartmentRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorDepartmentRoles = action.payload;
      })
      .addCase(doctorDepartmentRoles.rejected, (state) => {
        state.loading = false;
        state.doctorDepartmentRoles = null;
      })
      .addCase(fetchWards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.loading = false;
        state.wards = action.payload;
      })
      .addCase(fetchWards.rejected, (state) => {
        state.loading = false;
        state.wards = null;
      })
      .addCase(searchPatientsByMobile.pending, (state) => {
        state.patientsSearch.loading = true;
        state.patientsSearch.error = null;
      })
      .addCase(searchPatientsByMobile.fulfilled, (state, action) => {
        state.patientsSearch.loading = false;
        const data = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
        state.patientsSearch.list = data || [];
      })
      .addCase(searchPatientsByMobile.rejected, (state, action) => {
        state.patientsSearch.loading = false;
        state.patientsSearch.error =
          action.error?.message || "Failed to search patients";
        // state.patientsSearch.list =  [];
        state.patientsSearch.list = [
          {
            id: "P044",
            name: "Gita Verma",
            gender: "Female",
            age: 78,
            contact: "+91-9291041929",
          },
        ];
      });
  },
});

export const {
  setPatientDetailsInOldFormat,
  setCustomization,
  setDoctorDepartmentRoles,
  setWards,
  clearPatientsSearch,
} = ipdSlice.actions;

export default ipdSlice.reducer;
