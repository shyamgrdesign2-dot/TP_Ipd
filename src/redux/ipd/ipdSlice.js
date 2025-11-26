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
  async ({ doctorId } = {}) => {
    try {
      let result = {};
      result = await ApiIpdService.getCustomization(doctorId);
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
  async ({ doctorId, customization } = {}) => {
    try {
      let result = {};
      result = await ApiIpdService.updateCustomization({
        doctorId,
        customization: {
          progressNotes: [],
          crossReferral: [],
          otNotes: [],
          dischargeSummary: [],
          ...customization,
        },
      });
      if (result.message === "form customization updated successfully.") {
        return customization;
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
    return result;
  } catch (error) {
    console.log("error: ", error);
    throw Error(error);
  }
});

export const fetchPatientUniqueId = createAsyncThunk(
  "ipd/fetchPatientUniqueId",
  async (data) => {
    try {
      let result = {};
      result = await ApiIpdService.getPatientUniqueId(data);
      return result;
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const checkPatientAdmitted = createAsyncThunk(
  "ipd/checkPatientAdmitted",
  async (data) => {
    try {
      let result = {};
      result = await ApiIpdService.checkPatientAdmitted(data);
      return result;
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const markPatientAsDischarged = createAsyncThunk(
  "ipd/markPatientAsDischarged",
  async (data) => {
    try {
      let result = {};
      result = await ApiIpdService.markPatientAsDischarged(data);
      return result;
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const sendForDischargeApproval = createAsyncThunk(
  "ipd/sendForDischargeApproval",
  async (data) => {
    try {
      let result = {};
      result = await ApiIpdService.sendForDischargeApproval(data);
      return result;
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
    storePatientDetails: (state, action) => {
      state.patientDetails = action.payload;
    },
    resetPatientDetails: (state, action) => {
      state.patientDetails = {};
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
      .addCase(markPatientAsDischarged.pending, (state) => {
        state.loading = true;
      })
      .addCase(markPatientAsDischarged.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(markPatientAsDischarged.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setPatientDetailsInOldFormat,
  setCustomization,
  setDoctorDepartmentRoles,
  setWards,
  clearPatientsSearch,
  resetPatientDetails,
  storePatientDetails,
} = ipdSlice.actions;

export default ipdSlice.reducer;
